const express = require('express')
const app = express()

app.get('/say', function (req, res) {
  let { wd, cb } = req.query
  console.log('wd: ', wd)
  res.end(`${cb}('world')`)
})

app.listen(3000, () => {
  console.log('已启动!')
})
