var express = require('express')
var router = express.Router()
const { autojwt } = require('./auto_jwt');
const Joi = require('@hapi/joi')
var Link = require('../models/Link')

// 判断权限
router.use('/', (req, res, next) => {
    console.log('判断权限');
    const validateList = ['/add', '/del', '/edit']
    if (validateList.indexOf(req.path.toLowerCase()) != -1) {
        const jwt_res = autojwt(req)
        if (jwt_res.code == 401) {
            console.log(jwt_res.message);
            next(jwt_res)
        } else {
            console.log('合法token');
            next()
        }
        // 不加return会继续执行if语句外面的代码
        return
    } else {
        next()
        return
    }
    // console.log('没想到吧，我还会执行');
})

// 判断参数
const validateLink = Joi.object({
    id: [
        null,
        Joi.number()
    ],
    name: Joi.string().min(3).max(10).required(),
    avatar: Joi.string().min(10).max(150).required(),
    description: Joi.string().min(3).max(30).required(),
    url: Joi.string().min(10).max(50).required(),
}).xor('id')

// 获取友链
router.get('/list', async function (req, res) {
    var { rows, count } = await Link.findAndCountAll()
    res.json({ count, rows })
})

// 新增友链
router.post('/add', async function (req, res, next) {
    try {
        await validateLink.validateAsync(req.body, { convert: false })
    } catch (err) {
        next({ code: 400, message: err.message })
        return
    }
    const { name, avatar, description, url } = req.body
    const jwt_res = autojwt(req)
    if (jwt_res.user.role == 'admin') {
        var create_res = await Link.create(
            {
                name, avatar, description, url
            }
        )
        res.json(create_res)
    } else {
        next(jwt_res)
    }
})

// 修改友链
router.put('/edit', async function (req, res, next) {
    try {
        await validateLink.validateAsync(req.body, { convert: false, allowUnknown: true })
    } catch (err) {
        next({ code: 400, message: err.message })
        return
    }
    const { id, name, avatar, description, url } = req.body
    const jwt_res = autojwt(req)
    if (jwt_res.user.role == 'admin') {
        var update_res = await Link.update(
            {
                name, avatar, description, url
            },
            {
                where: { id }
            })
        res.json(update_res)
    } else {
        next(jwt_res)
        return
    }

})

// 删除友链
router.delete('/del', async function (req, res, next) {
    try {
        await Joi.number().required().validateAsync(req.body.id, { convert: false })
    } catch (err) {
        next({ code: 400, message: err.message })
        return
    }
    const jwt_res = autojwt(req)
    if (jwt_res.user.role == 'admin') {
        var del_res = await Link.destroy(
            {
                where: { id: req.body.id }
            })
        res.json(del_res)
    } else {
        next(jwt_res)
        return
    }
})


module.exports = router