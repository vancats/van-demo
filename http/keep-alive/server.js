const http = require('http')
const fs = require('fs')

http.createServer(function (req, res) {
  console.log('server come', req.url)

  const html = fs.readFileSync('test.html', 'utf-8')
  const img = fs.readFileSync('vancats.jpeg')
  if (req.url === '/') {
    res.writeHead(200, {
      'Content-Type': 'text/html',
    })
    res.end(html)
  } else {
    res.writeHead(200, {
      'Content-Type': 'image/jpeg',
      // 最多可以建立 6 个 tcp 连接，观察 connection Id
      'Connection': 'close'
    })
    res.end(img)
  }
}).listen(8888, () => {
  console.log('server 启动')
})
