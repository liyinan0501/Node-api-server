const Joi = require('joi')

// name, alias 新增文章分类验证规则
const name = Joi.string().required()
const alias = Joi.string().alphanum().required()
// id 的校验规则
const id = Joi.number().integer().min(1).required()

// 验证规则对象-新增文章分类
exports.add_articleCate_schema = {
  body: {
    name,
    alias,
  },
}

// 验证规则对象-删除文章分类
exports.delete_articleCate_schema = {
  params: {
    id,
  },
}

// 验证规则对象-查找文章分类
exports.get_articleCate_schema = {
  params: {
    id,
  },
}
