const Joi = require('joi')

// name, alias 新增文章分类验证规则
const name = Joi.string().required()
const alias = Joi.string().alphanum().required()

// 验证规则对象-新增文章分类
exports.add_articleCate_schema = {
  body: {
    name,
    alias,
  },
}
