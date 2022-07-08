// 文章的处理函数模块

// 发布文章处理函数
exports.addArticle = (req, res) => {
  // multer single()中间件，将文件类型的数据，解析并挂载到 req.file 属性中
  // multer single()中间件，将文本类型的数据，解析并挂载到 req.body 属性中
  //   console.log(req.body)
  //   console.log(req.file)
  // 手动判断是否上传了文章封面
  if (!req.file || req.file.fieldname !== 'cover_img')
    return res.cc('文章封面是必选参数！')
  res.send('addArt')
}
