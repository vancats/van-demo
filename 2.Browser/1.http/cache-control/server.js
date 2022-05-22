const http = require('http')
const fs = require('fs')

http.createServer(function (req, res) {
  console.log('server come', req.url)
  if (req.url === '/') {

    const html = fs.readFileSync('test.html', 'utf-8')
    res.writeHead(200, {
      'Content-Type': 'text/html'
    })

    res.end(html)
  }
  if (req.url === '/script.js') {
    const etag = req.headers['if-none-match']
    if (etag === '777') {
      res.writeHead(304, {
        'Content-Type': 'text/javascript',
        'Cache-Control': 'max-age=200, no-cache',
        'Last-Modified': '123',
        'Etag': '777'
      })
      res.end('123')
    } else {
      res.writeHead(200, {
        'Content-Type': 'text/javascript',
        'Cache-Control': 'max-age=200, no-cache',
        'Last-Modified': '123',
        'Etag': '777'
      })
      res.end('console.log("script loaded twice")')
    }
  }
}).listen(8888, () => {
  console.log('server 启动')
})

