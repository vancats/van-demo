const express = require('express')

const app = express()
app.use(express.static(__dirname))

app.get('/getData', function (req, res) {
  console.log(req.headers)
  res.end('world')
})

app.listen(3000, () => {
  console.log('server1 启动！')
})
