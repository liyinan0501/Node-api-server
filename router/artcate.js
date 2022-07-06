const express = require('express')
const router = express.Router()
const artcate_handler = require('../router_handler/artcate')

// 获取文章分类的列表路由
router.get('/cates', artcate_handler.getArticleCates)

module.exports = router
