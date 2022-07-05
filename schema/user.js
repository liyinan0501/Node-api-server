const Joi = require('joi')

/**
 * string() 值必须是字符串
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值是必填项，不能为 undefined
 * pattern(正则表达式) 值必须符合正则表达式的规则
 */

// 用户名和密码的验证规则
const username = Joi.string().alphanum().min(1).max(10).required()
const password = Joi.string()
  .pattern(/^[\S]{6,12}$/)
  .required()

// id, nickname, email 的验证规则
const id = Joi.number().integer().min(1).required()
const nickname = Joi.string().required()
const email = Joi.string().email().required()

// 验证规则对象-注册和登录表单
exports.reg_login_schema = {
  body: {
    username,
    password,
  },
}

// 验证规则对象-更新用户基本信息
exports.update_userinfo_schema = {
  body: {
    id,
    nickname,
    email,
  },
}
