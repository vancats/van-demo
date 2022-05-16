const http = require('http')
const fs = require('fs')

http.createServer(function (req, res) {
  console.log('server come', req.url)
  const host = req.headers.host
  console.log('host: ', host)
  if (req.url === '/') {
    const html = fs.readFileSync('test.html', 'utf-8')
    if (host === 'test.com') {
      res.writeHead(200, {
        'Content-Type': 'text/html',
        // test.com 域名要一致，无法跨域名设置 cookie
        // 设置后，a.test.com b.test.com 可以使用 cookie
        'Set-Cookie': ['id=1223;max-age=2000;domain=test.com', 'name=vancats; httpOnly']
      })
    }
    res.end(html)
  }
}).listen(8888, () => {
  console.log('server 启动')
})

