const db = require('../db/index')
const bcrypt = require('bcryptjs')
const { login } = require('./user')
const { response } = require('express')
// 获取用户信息处理模块
//! 注意：为了防止用户的密码泄露，需要排除 password 字段
exports.getUserinfo = (req, res) => {
  const sqlStr =
    'select id, username, nickname, email, user_pic from ev_users where id = ?'
  db.query(sqlStr, [req.auth.id], (err, results) => {
    // 1. 执行 SQL 语句失败
    if (err) return res.cc(err)
    // 2. 执行 SQL 语句成功，但是查询到的数据条数不等于 1。
    if (results.length != 1) return res.cc('未找到该用户，获取用户信息失效！')
    // 3. 将用户信息响应给客户端
    res.send({
      status: 0,
      message: '获取用户成功',
      data: result[0],
    })
  })
}

// 更新用户基本信息的处理函数
exports.updateUserinfo = (req, res) => {
  const sqlStr = 'update ev_users set ? where id = ?'
  db.query(sqlStr, [req.body, req.body.id], (err, results) => {
    // 1. 执行 SQL 语句失败
    if (err) return res.cc(err)
    // 2. 执行 SQL 语句成功，但是查询到的数据条数不等于 1。
    if (results.affectedRows !== 1)
      return res.cc('未找到该用户，更新用户信息失败！')
    // 3. 将修改成功的信息响应给客户端
    return res.cc('更新用户基本信息成功')
  })
}

exports.updatePassword = (req, res) => {
  const sqlStr = 'select * from ev_users where id = ?'
  // 执行 SQL 语句查询用户是否存在
  db.query(sqlStr, [req.auth.id], (err, results) => {
    // 1. 执行 SQL 语句失败
    if (err) return res.cc(err)
    // 2. 执行 SQL 语句成功，但是查询到的数据条数不等于 1，未找到该用户。
    if (results.length !== 1) return res.cc('未找到该用户，密码重置失效！')
    // 3. 判断原密码是否正确
    const compareResult = bcrypt.compareSync(
      req.body.oldPwd,
      results[0].password
    )
    if (!compareResult) return res.cc('原密码验证失败')

    const sqlStr1 = 'update ev_users set password = ? where id = ?'
    req.body.newPwd = bcrypt.hashSync(req.body.newPwd, 10)
    db.query(sqlStr1, [req.body.newPwd, req.auth.id], (err, results) => {
      // 1. 执行 SQL 语句失败
      if (err) return res.cc(err)
      // 2. 执行 SQL 语句成功，但是查询到的数据条数不等于 1。
      if (results.affectedRows !== 1)
        return res.cc('未找到该用户，更新用户信息失败！')
      // 3. 将密码修改成功的信息响应给客户端
      return res.cc('密码修改成功')
    })
  })
}
