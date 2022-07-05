const express = require('express')
const router = express.Router()
const expressJoi = require('@escook/express-joi')
const { update_userinfo_schema } = require('../schema/user')

// 导入路由处理函数模块
const userinfo_handler = require('../router_handler/userinfo')
// 获取用户的基本信息
router.get('/userinfo', userinfo_handler.getUserinfo)
// 更新用户的基本信息
router.post(
  '/userinfo',
  expressJoi(update_userinfo_schema),
  userinfo_handler.updateUserinfo
)

module.exports = router
