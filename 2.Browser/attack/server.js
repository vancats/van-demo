const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const cookieParser = require('cookie-parser')
const svgCaptcha = require('svg-captcha')

const app = express()

app.use(cookieParser())

// 解析静态资源
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname)))

// 解析表单 body
// jquery 提交的是表单 a=1&b=2 转换成 { a: 1, b: 2}
app.use(bodyParser.urlencoded({ extended: true }))

const userList = [{ username: 'vancats', password: 'vancats', money: 10000 }, { username: 'lqf', password: 'lqf', money: 20 }]
const SESSION_ID = 'connect.sid'
const session = {}

app.post('/api/login', function (req, res) {
  let { username, password } = req.body
  let user = userList.find(user => user.username === username && user.password === password)
  if (user) {
    let cardId = Math.random() + Date.now()
    session[cardId] = { user }
    res.cookie(SESSION_ID, cardId)
    res.json({ code: 0 })
  } else {
    res.json({ code: 1, error: '用户不存在' })
  }
})

// TODO XSS 反射型 http://localhost:3000/welcome?type=<script>alert(1)</script>
app.get('/welcome', function (req, res) {
  // 字符串转义
  res.send(`${encodeURIComponent(req.query.type)}`)
})



const comments = [{ username: 'lqf', content: 'lqf' }, { username: 'vancats', content: 'vancats' }]
// 获取列表
app.get('/api/list', function (req, res) {
  res.json({ code: 0, comments })
})

// TODO XSS 存储型 做字符串替换
app.post('/api/addcomment', function (req, res) {
  const r = session[req.cookies[SESSION_ID]] || {}
  const user = r.user
  if (user) {
    comments.push({ username: user.username, content: req.body.content })
    res.json({ code: 0 })
  } else {
    res.json({ code: 1, error: '用户未登陆' })
  }
})


app.get('/api/userinfo', function (req, res) {
  const r = session[req.cookies[SESSION_ID]] || {}

  // TODO 1. 验证码方案
  const { data, text } = svgCaptcha.create()
  r.text = text
  const user = r.user
  if (user) {
    res.json({ code: 0, user: { username: user.username, money: user.money, svg: data } })
  } else {
    res.json({ code: 1, error: '用户未登陆' })
  }
})

// TODO 原版
// app.post('/api/transfer', function (req, res) {
//   const r = session[req.cookies[SESSION_ID]] || {}
//   let { target, money } = req.body
//   const user = r.user
//   if (user) {
//     money = Number(money)
//     userList.forEach(u => {
//       if (u.username === user.username) {
//         u.money -= money
//       }
//       if (u.username === target) {
//         u.money += money
//       }
//     })
//     res.json({ code: 0 })
//   } else {
//     res.json({ code: 1, error: '用户未登陆' })
//   }
// })

// TODO CSRF 1. 验证码方案
// app.post('/api/transfer', function (req, res) {
//   const r = session[req.cookies[SESSION_ID]] || {}
//   let { target, money, code } = req.body
//   const user = r.user
//   if (user) {
//     if (code && r.text.toLowerCase() === code.toLowerCase()) {
//       money = Number(money)
//       userList.forEach(u => {
//         if (u.username === user.username) {
//           u.money -= money
//         }
//         if (u.username === target) {
//           u.money += money
//         }
//       })
//     } else {
//       res.json({ code: 0, message: '验证码错误' })
//     }
//     res.json({ code: 0 })
//   } else {
//     res.json({ code: 1, error: '用户未登陆' })
//   }
// })

// TODO CSRF 2. referer --- 可被后端修改
// app.post('/api/transfer', function (req, res) {
//   const r = session[req.cookies[SESSION_ID]] || {}
//   let { target, money } = req.body
//   const user = r.user
//   const referer = req.headers['referer']
//   if (referer.includes('http://localhost:3000')) {
//     if (user) {
//       money = Number(money)
//       userList.forEach(u => {
//         if (u.username === user.username) {
//           u.money -= money
//         }
//         if (u.username === target) {
//           u.money += money
//         }
//       })
//       res.json({ code: 0 })
//     } else {
//       res.json({ code: 1, error: '用户未登陆' })
//     }
//   } else {
//     res.json({ code: 0, message: '来源不正确' })
//   }
// })

// TODO 3. Token
app.post('/api/transfer', function (req, res) {
  const r = session[req.cookies[SESSION_ID]] || {}
  let { target, money, token } = req.body
  const user = r.user
  if (user) {
    if ('my_' + req.cookies[SESSION_ID] === token) {
      money = Number(money)
      userList.forEach(u => {
        if (u.username === user.username) {
          u.money -= money
        }
        if (u.username === target) {
          u.money += money
        }
      })
      res.json({ code: 0 })
    } else {
      res.json({ code: 0, message: 'token 不正确' })
    }
  } else {
    res.json({ code: 1, error: '用户未登陆' })
  }
})

app.listen(3000, () => {
  console.log('启动成功！')
})
