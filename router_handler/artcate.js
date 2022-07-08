const db = require('../db/index')

// 获取文章分类列表的处理函数
exports.getArticleCates = (req, res) => {
  const sqlStr =
    'select * from ev_article_cate where is_delete = 0 order by id asc'
  db.query(sqlStr, (err, results) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      message: '获取文字列表成功！',
      data: results,
    })
  })
}

// 新增文章分类的处理函数
exports.addArticleCate = (req, res) => {
  // 1. 定义查重的 SQL 语句
  const sqlStr = 'select * from ev_article_cate where name = ? or alias = ?'
  // 2. 定义查重的 SQL 语句
  db.query(sqlStr, [req.body.name, req.body.alias], (err, results) => {
    // 3. 判断是否执行 SQL 语句失败
    if (err) return res.cc(err)
    // 4. 判断 length
    if (results.length === 2)
      return res.cc('分类名称与分类别名被占用，请更换后重试。')
    if (
      results.length === 1 &&
      results[0].name === req.body.name &&
      results[0].alias === req.body.alias
    )
      return res.cc('分类名称与分类别名被占用，请更换后重试。')
    if (results.length === 1 && results[0].name === req.body.name)
      return res.cc('分类名称被占用，请更换后重试。')
    if (results.length === 1 && results[0].alias === req.body.alias)
      return res.cc('分类别名被占用，请更换后重试。')

    // 定义插入文章分类的 SQL 语句
    const sqlStr1 = 'insert ev_article_cate set ?'
    // 执行插入文章分类的 SQL 语句
    db.query(
      sqlStr1,
      { name: req.body.name, alias: req.body.alias },
      (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('添加失败，稍后再试。')
        return res.cc('adding article category succeeds!', 0)
      }
    )
  })
}

// 删除文章分类的处理函数
exports.deleteArticleCateById = (req, res) => {
  const sqlStr = 'update ev_article_cate set is_delete = 1 where id = ?'
  db.query(sqlStr, [req.params.id], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('删除失败，稍后再试。')
    return res.cc('deleting article category succeeds!', 0)
  })
}

// 查找文章分类的处理函数
exports.getArticleCateById = (req, res) => {
  const sqlStr = 'select * from ev_article_cate where id = ?'
  db.query(sqlStr, [req.params.id], (err, results) => {
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc('未找到该分类')
    return res.send({
      status: 0,
      message: '查询分类成功',
      data: results[0],
    })
  })
}

// 更新文章分类的处理函数
exports.updateArticleCateById = (req, res) => {
  const { Id, name, alias } = req.body
  // 定义查重的 SQL 语句
  const sqlStr =
    'select * from ev_article_cate where id <> ? and (name = ? or alias = ?)'
  db.query(sqlStr, [Id, name, alias], (err, results) => {
    if (err) return res.cc(err)
    if (results.length === 2) return res.cc('名称和别名都被占用')
    if (
      results.length === 1 &&
      results[0].name === name &&
      results[0].alias === alias
    )
      return res.cc('名称和别名都被占用')
    if (results.length === 1 && results[0].name === name)
      return res.cc('名称被占用')
    if (results.length === 1 && results[0].alias === alias)
      return res.cc('别名被占用')
    const sqlStr1 = 'update ev_article_cate set ? where id = ? '
    db.query(sqlStr1, [{ name, alias }, Id], (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows !== 1) return res.cc('修改文章分类失败')
      res.cc('修改文章分类成功', 0)
    })
  })
}
