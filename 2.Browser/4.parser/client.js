const net = require('net')
const HttpParser = require('./http-parser')
const HtmlParser = require('htmlparser2')
const css = require('css')

class HTTPRequest {
  constructor(options = {}) {
    this.host = options.host
    this.method = options.method || 'GET'
    this.port = options.port || 80
    this.path = options.path || '/'
    this.headers = options.headers
  }

  send() {
    return new Promise((resolve, reject) => {
      const rows = []
      rows.push(`${this.method} ${this.path} HTTP/1.1`)
      Object.keys(this.headers).forEach(key => {
        rows.push(`${key}: ${this.headers[key]}`)
      })

      // 请求头信息
      const data = rows.join('\r\n') + '\r\n\r\n'

      // TCP 连接
      const socket = net.createConnection({
        host: this.host,
        port: this.port
      }, () => {
        // 发送请求头
        socket.write(data)
      })

      // 响应内容解析
      const parser = new HttpParser()
      socket.on('data', function (chunk) {
        parser.parse(chunk)
        if (parser.result) {
          resolve(parser.result)
        }
      })
    })
  }
}

// 解析 CSS
function parserCss(styleText) {
  const ast = css.parse(styleText)
  console.dir(ast.stylesheet, { depth: null })
}

async function request() {
  const request = new HTTPRequest({
    host: '127.0.0.1',
    method: 'GET',
    port: 3000,
    path: '/',
    headers: {
      name: 'vancats',
      age: 22
    }
  })

  // 解析后的响应内容
  let { responseLine, headers, body } = await request.send()
  // 节点树
  const stack = [{ type: 'document', children: [] }]

  const parser = new HtmlParser.Parser({
    onopentag(name, attributes) {
      const parent = stack[stack.length - 1]
      const element = {
        type: 'element',
        tagName: name,
        attributes,
        parent,
        children: []
      }
      parent.children.push(element)
      stack.push(element)
    },
    ontext(text) {
      const parent = stack[stack.length - 1]
      const textNode = {
        type: 'text',
        text,
        parent
      }
      parent.children.push(textNode)
    },
    onclosetag(name) {
      const parent = stack[stack.length - 1]
      if (name === 'style') {
        parserCss(parent.children[0].text)
        console.log(parent.children[0].text)
      }
      stack.pop()
    }
  })
  parser.end(body) // DOMTree
  // console.dir(stack, { depth: null })
}

request()
