const http = require('http')

http.createServer(function (req, res) {
  console.log('server2 come', req.url)
  res.writeHead(200, {
    'Access-Control-Allow-Origin': 'http://localhost:8888',
    'Access-Control-Allow-Headers': 'X-Test-Cors',
    'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE',
    'Access-Control-Max-Age': 4
  })
  res.end('123')
}).listen(8887, () => {
  console.log('server2 启动')
})
