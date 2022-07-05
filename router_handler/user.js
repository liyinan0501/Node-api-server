// 导入数据库操作模块
const db = require('../db/index')
// 导入 bcryptjs 加密包
const bcrypt = require('bcryptjs')
// 导入生成 Token 的包
const jwt = require('jsonwebtoken')
const config = require('../config')

// 注册新用户的处理函数
exports.regUser = (req, res) => {
  // 获取客户端提交到服务器的表单用户信息
  const userInfo = req.body
  // 对表单数据，进行合法性校验。
  // if (!userInfo.username || !userInfo.password) {
  //   return res.send({
  //     status: 1,
  //     message: '用户名和密码不合法',
  //   })
  // }

  // 定义查询用户名是否被占用的 SQL 语句
  const sqlStr = 'select * from ev_users where username = ?'
  db.query(sqlStr, [userInfo.username], (err, results) => {
    // 执行 SQL 语句失败
    if (err) {
      // return res.send({ status: 1, message: err.message })
      return res.cc(err)
    }
    // 判断用户名是否被占用
    if (results.length > 0) {
      // return res.send({ status: 1, message: '用户名已被占用' })
      return res.cc('用户名已被占用')
    }
    // 对用户的密码进行 bcrype 加密，返回值是加密之后的密码字符串。
    userInfo.password = bcrypt.hashSync(userInfo.password, 10)

    // 判断之后，定义插入新用户的 SQL 语句。
    const sqlStr1 = 'insert into ev_users set ?'
    db.query(
      sqlStr1,
      {
        username: userInfo.username,
        password: userInfo.password,
      },
      (err, results) => {
        // 执行 SQL 语句失败
        if (err) {
          // return res.send({ status: 1, message: err.message })
          return res.cc(err)
        }
        // 判断影响函数是否为1，不是1注册失败。
        if (results.affectedRows !== 1) {
          // return res.send({ status: 1, message: '注册失败，稍后在试。' })
          return res.cc('注册失败，稍后在试。')
        }
        // res.send('registration succeeds!')
        res.cc('registration succeeds!', 0)
      }
    )
  })
}

// 登录的处理函数
exports.login = (req, res) => {
  // 获取客户端提交到服务器的表单用户信息
  const userInfo = req.body

  const sqlStr = 'select * from ev_users where username = ?'
  // 判断表单用户名是否存在
  db.query(sqlStr, userInfo.username, function (err, results) {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)
    // 执行 SQL 语句成功，但是查询到数据条数不等于 1。
    if (results.length !== 1) return res.cc('登录失败')

    // 表单用户名正确后，判断表单密码是否正确。
    // bcrypt.compareSync(用户提交的未加密的密码, 数据库中已机密的密码)
    const compareResult = bcrypt.compareSync(
      userInfo.password,
      results[0].password
    )
    if (!compareResult) return res.cc('密码不正确')

    // 在服务器端生成 Token 字符串：
    // 剔除完毕之后，user 中只保留了用户的 id, username, nickname, email 这四个属性的值，用于生成 Token 字符串。
    const user = { ...results[0], password: '', user_pic: '' }
    const token = jwt.sign(user, config.jwtSecretKey, {
      expiresIn: config.expiresIn,
    })
    res.send({
      status: 200,
      message: 'Login Succeeds!',
      token: 'Bearer ' + token,
    })
  })
}
