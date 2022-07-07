const expressJoi = require('@escook/express-joi')
const express = require('express')
const router = express.Router()
const artcate_handler = require('../router_handler/artcate')
const {
  add_articleCate_schema,
  delete_articleCate_schema,
  get_articleCate_schema,
} = require('../schema/artcate')

// 获取文章分类列表的路由
router.get('/cates', artcate_handler.getArticleCates)

// 新增文章分类的路由
router.post(
  '/addcates',
  expressJoi(add_articleCate_schema),
  artcate_handler.addArticleCate
)

// 删除文章分类的路由
router.get(
  '/deletecate/:id',
  expressJoi(delete_articleCate_schema),
  artcate_handler.deleteArticleCateById
)

// 获取文章分类的路由
router.get(
  '/cates/:id',
  expressJoi(get_articleCate_schema),
  artcate_handler.getArticleCateById
)

module.exports = router
