const express = require('express')

const app = express()
const whiteList = ['http://localhost:3000']

app.use(function (req, res, next) {
  let origin = req.headers.origin
  if (whiteList.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Headers', 'name')
    res.setHeader('Access-Control-Allow-Methods', 'PUT')
    // 预检存活时间
    res.setHeader('Access-Control-Max-Age', 4)
    // 允许 cookies, authorization headers 或 TLS
    res.setHeader('Access-Control-Allow-Credentials', true)
    // 允许返回的头
    res.setHeader('Access-Control-Expose-Headers', 'age') // Refused to get unsafe header "age"
  }
  if (req.method === 'OPTIONS') {
    res.end()
  }
  next()
})

app.get('/getData', function (req, res) {
  console.log(req.headers)
  res.setHeader('age', '18')
  res.end('world')
})

app.put('/getData', function (req, res) {
  console.log(req.headers)
  res.setHeader('age', '18')
  res.end('world')
})

app.use(express.static(__dirname))

app.listen(4000, () => {
  console.log('server2 启动')
})
