// 文章的处理函数模块
const path = require('path')
const db = require('../db/index')

// 发布文章处理函数
exports.addArticle = (req, res) => {
  // multer single()中间件，将文件类型的数据，解析并挂载到 req.file 属性中
  // multer single()中间件，将文本类型的数据，解析并挂载到 req.body 属性中
  //   console.log(req.body)
  //   console.log(req.file)
  // 手动判断是否上传了文章封面
  if (!req.file || req.file.fieldname !== 'cover_img')
    return res.cc('文章封面是必选参数！')
  const articleInfo = {
    // 标题、内容、状态、所属的分类Id
    ...req.body,
    // 文章封面在服务器端的存放路径
    cover_img: path.join('/uploads', req.file.filename),
    // 文章发布时间
    pub_date: new Date(),
    // 文章作者的Id
    author_id: req.auth.id,
  }

  const sqlStr = 'insert into ev_articles set ?'
  db.query(sqlStr, articleInfo, (err, results) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)
    // 执行 SQL 语句成功，但是影响行数不等于 1
    if (results.affectedRows !== 1) return res.cc('发布文章失败！')
    // 发布文章成功
    res.cc('发布文章成功', 0)
  })
}
