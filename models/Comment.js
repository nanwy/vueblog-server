const Sequelize = require('sequelize')
const sequelize = require('../config/db')
const Comment = sequelize.define(
    'comment',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        article_id: {
            type: Sequelize.INTEGER,
        },
        from_userid: {
            type: Sequelize.INTEGER,
        },
        to_commentid: {
            type: Sequelize.INTEGER,
        },
        to_userid: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        content: {
            type: Sequelize.STRING,
        }
    },
    {
        freezeTableName: true
    }
)
module.exports = Comment