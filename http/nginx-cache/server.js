const http = require('http')
const fs = require('fs')

const wait = (seconds) => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res()
    }, seconds * 1000)
  })
}

http.createServer(function (req, res) {
  console.log('server come', req.url)

  const html = fs.readFileSync('test.html', 'utf-8')
  if (req.url === '/') {
    res.writeHead(200, {
      'Content-Type': 'text/html',
    })
    res.end(html)
  }

  if (req.url === '/data') {
    res.writeHead(200, {
      // 'Cache-Control': 'max-age=5,s-maxage=200,private',
      'Cache-Control': 's-maxage=200',
      // 设置的头和值相等时才会进行服务器缓存
      'Vary': 'X-Test-Cache'
    })
    wait(2).then(() => {
      res.end('success')
    })
  }
}).listen(8888, () => {
  console.log('server 启动')
})
