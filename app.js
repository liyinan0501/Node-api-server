const express = require('express')
const app = express()
const Joi = require('joi')

const cors = require('cors')
app.use(cors())

// 只能解析x-www-form-urlencoded表单数据
app.use(express.urlencoded({ extended: false }))

// 必须在路由之前，封装处理错误的res.cc函数中间件。
app.use((req, res, next) => {
  // status默认等于1意味着失败
  res.cc = function (err, status = 1) {
    res.send({
      status,
      message: err instanceof Error ? err.message : err,
    })
  }
  next()
})

// 导入并使用用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)

// 必须在路由之后，定义错误级别的中间件
app.use((err, req, res, next) => {
  // 验证失败导致的错误
  if (err instanceof Joi.ValidationError) return res.cc(err)
  // 未知错误
  res.cc(err)
  next()
})

// 测试数据库
const db = require('./db/index')
db.query('select 1', (err, results) => {
  if (err) return console.log(err.message)
  console.log(results) // [ RowDataPacket { '1': 1 } ] 代表能正常工作
})

// 启动服务器
app.listen(3007, () => {
  console.log('api server running at http://127.0.0.1:3007')
})
