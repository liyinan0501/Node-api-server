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
