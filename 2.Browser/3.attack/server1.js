const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const cookieParser = require('cookie-parser')

const app = express()

app.use(cookieParser())

// 解析静态资源
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname)))

// 解析表单 body
// jquery 提交的是表单 a=1&b=2 转换成 { a: 1, b: 2}
app.use(bodyParser.urlencoded({ extended: true }))


app.listen(4000, () => {
  console.log('启动成功！')
})
