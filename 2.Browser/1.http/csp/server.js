const http = require('http')
const fs = require('fs')

http.createServer(function (req, res) {
  console.log('server come', req.url)
  const html = fs.readFileSync('test.html')
  if (req.url === '/') {
    res.writeHead(200, {
      'Content-Type': 'text/html',
      // 'Content-Security-Policy': 'default-src http: https:' // 全局限制 只允许 http(s)
      // 'Content-Security-Policy': 'default-src \'self\' http://code.jquery.com/' // 仅允许一下域名
      // 'Content-Security-Policy': 'default-src \'self\'; form-action \'self\'' // 限制 form-data
      // 'Content-Security-Policy': 'script-src \'self\'; form-action \'self\'; report-uri /report' // report
      // 'Content-Security-Policy-Report-Only': 'script-src \'self\'; form-action \'self\'; report-uri /report' // 仅 report，不限制文件
    })
    res.end(html)
  } else {
    res.writeHead(200, {
      'Content-Type': 'application/javascript',
    })
    res.end('console.log("loader script")')
  }
}).listen(8888, () => {
  console.log('server 启动')
})
