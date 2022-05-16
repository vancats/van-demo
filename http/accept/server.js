const http = require('http')
const fs = require('fs')
const zlib = require('zlib')

http.createServer(function (req, res) {
  console.log('server come', req.url)
  const html = fs.readFileSync('test.html')
  if (req.url === '/') {
    res.writeHead(301, {
      'Location': '/new'
    })
    res.end()
  } else if (req.url === '/new') {
    res.writeHead(200, {
      // zlib 需要使用 buffer，需要不进行 utf-8 转义
      'Content-Type': 'text/html',
      'Content-Encoding': 'gzip'
    })
    res.end(zlib.gzipSync(html))
  }
}).listen(8888, () => {
  console.log('server 启动')
})
