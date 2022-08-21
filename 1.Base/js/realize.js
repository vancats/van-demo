// 1. 深拷贝 原始值 数组 对象 包装对象 日期 错误 正则 Symbol Set Map 循环引用
const MapTag = '[object Map]'
const SetTag = '[object Set]'
const ArrayTag = '[object Array]'
const ObjectTag = '[object Object]'

const NumTag = '[object Number]'
const StringTag = '[object String]'
const BooleanTag = '[object Boolean]'
const RegExpTag = '[object RegExp]'
const DateTag = '[object Date]'
const SymbolTag = '[object Symbol]'
const ErrorTag = '[object Error]'

const deepTag = [MapTag, SetTag, ArrayTag, ObjectTag]

function cloneOtherType(target, type) {
  const Ctor = target.constructor
  switch (type) {
    case NumTag:
    case StringTag:
    case BooleanTag:
    case DateTag:
    case ErrorTag: return new Ctor(target)
    case SymbolTag: return Object(Symbol(target.description))
    case RegExpTag: return new Ctor(target.source, target.flags)
  }
}

function deepClone(target, map = new Map()) {
  if (typeof target === 'symbol')
    return Symbol(target.description)
  if (typeof target !== 'object' || !target)
    return target
  if (map.has(target))
    return map.get(target)

  const type = Object.prototype.toString.call(target)
  if (!deepTag.includes(type)) {
    return cloneOtherType(target, type)
  }
  const res = new target.constructor()

  map.set(target, res)
  if (type === MapTag) {
    console.log(123)
    target.forEach((value, key) => res.set(key, deepClone(value)))
    return res
  }

  if (type === SetTag) {
    target.forEach(value => res.add(deepClone(value)))
    return res
  }
  Reflect.ownKeys(target).forEach(key => {
    res[key] = deepClone(target[key], map)
  })
  return res
}

// * 测试用例
const target = {
  field1: 1,
  field2: undefined,
  field3: {
    child: 'child'
  },
  field4: [2, 4, 8],
  empty: null,
  map: new Map().set(1, 'map'),
  set: new Set().add('set'),
  bool: Boolean(true),
  num: new Number(1),
  str: new String(1),
  date: new Date(),
  objSymbol: Object(Symbol('2')),
  [Symbol('key')]: 'symbol',
  reg: /\d+de$/gm,
  error: new Error('error'), symbol: Symbol('1'),
}
target.target = target
console.log(deepClone(target))



// 2. 发布-订阅
class event {
  constructor() {
    this.handles = []
  }
  on(type, handle) {
    if (!this.handles[type])
      this.handles[type] = []
    this.handles[type].push(handle)
  }

  off(type, handle) {
    if (!this.handles[type])
      return new Error('不存在该方法')

    if (!handle)
      return (delete this.handles[type])

    let ind = this.handles[type].findIndex(item => item === handle)
    if (ind < 0)
      return new Error('不存在该方法')
    this.handles[type].splice(ind, 1)
    if (!handles.length)
      delete this.handles[type]
  }

  emit(type, ...args) {
    if (!this.handles[type])
      return new Error('不存在该方法')
    this.handles[type].forEach(fn => fn.call(this, ...args))
  }

  once(type, handle) {
    function fn() {
      handle()
      this.off(type, handle)
    }
    this.on(type, fn)
  }
}



// 3. 双向绑定
let obj = {}
let input = document.querySelector('input')
let span = document.querySelector('span')
Object.defineProperty(obj, 'text', {
  get() {
    return obj[text]
  },
  set(newVal) {
    input.value = newVal
    span.innerText = newVal
  }
})

input.addEventListener('keyup', function (e) {
  obj.text = e.target.value
})



// 4. 简单路由跳转
class Route {
  constructor() {
    this.routes = {}
    this.currentHash = '/'
    this.freshRoute = this.freshRoute.bind(this)
    window.addEventListener('hash', this.freshRoute, false)
    window.addEventListener('hashchange', this.freshRoute, false)
  }

  storeRoute(path, cb) {
    this.routes[path] = cb || function () { }
  }

  freshRoute() {
    this.currentHash = window.location.hash.slice(1) || '/'
    this.routes[this.currentHash]()
  }
}



// 5. 大数据量的分片加载
const ul = document.querySelector('#container')
let total = 10000 // 载入数量
let once = 20 // 一次插入数量
let page = Math.ceil(total / once) // 一页数量
let index = 0 // 每条记录的索引

function loop(curTotal, curIndex) {
  if (curTotal <= 0)
    return

  let pageCount = Math.min(curTotal, once)
  window.requestAnimationFrame(function () {
    for (let i = 0; i < pageCount; i++) {
      const li = document.createElement('li')
      li.innerText = curIndex + i + ':' + ~~(Math.random() * total)
      ul.appendChild(li)
    }
    loop(curTotal - pageCount, curIndex + pageCount)
  })
}



// 6. LRU
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity
    this.secretKey = new Map()
  }
  get(key) {
    if (this.secretKey.has(key)) {
      let tempVal = this.secretKey.get(key)
      this.secretKey.delete(key)
      this.secretKey.set(key, tempVal)
      return tempVal
    } else return -1
  }
  put(key, value) {
    if (this.secretKey.has(key)) {
      this.secretKey.delete(key)
      this.secretKey.set(key, value)
    } else if (this.secretKey.size < this.capacity) {
      this.secretKey.set(key, value)
    } else {
      this.secretKey.set(key, value)
      this.secretKey.delete(this.secretKey.keys().next().value)
    }
  }
}



// 7. 懒加载
const imgs = document.querySelectorAll('img')
// 可视区高度
const clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight

function lazyLoad() {
  let scrollTop = window.pageYScroll || document.documentElement.scrollTop || document.body.scrollTop
  for (let i = 0; i < imgs.length; i++) {
    // 图片在可视区的高度
    let x = clientHeight + scrollTop - imgs[i].offsetTop
    if (x > 0 && x < clientHeight + imgs[i].height) {
      imgs[i].src = imgs[i].getAttribute('data')
    }
  }
}
window.addEventListener('scroll', lazyLoad)


// 8. 创建对象
//  1. 字面量
//  2. new Object
//  3. 工厂函数：不能根据原型对象判断对象类型
function createPerson(name) {
  const o = new Object()
  o.name = name
  return o
}

//  4. 构造函数：内含方法每次都会调用
function Person(name) {
  this.name = name
  this.intr = function () { }
}

//  5. 原型对象：步骤繁琐
function Person() { }
Person.prototype.name = 'vancats'
Person.prototype.intr = function () { }

//  6. 混合模式：不符合对象封装思想
function Person(name) {
  this.name = name
}
Person.prototype.intr = function () { }

//  7. 动态混合：语义不符
function Person(name) {
  this.name = name
  if (Person.prototype.intr === undefined) {
    Person.prototype.intr = function () { }
  }
}

//  8. 寄生构造函数：可读性差
function Person(name) {
  this.name = name
  if (Person.prototype.intr === undefined) {
    Person.prototype.intr = function () { }
  }
}

function Student(name, age) {
  let person = new Person(name)
  person.age = age
  return person
}

let student = new Student('Lqf', 18)

//  9. class

//  10. 稳妥构造函数：容易内存泄露
function Person(name) {
  let person = {}
  person.getName = function () { return name }
  person.setName = function (val) { name = val }
  // 这种方式不用加 new 调用
  // this.getName = function () { return name }
  // this.setName = function (val) { name = val }
  return person

}

// 9. 继承
//  0. 父类方法
function Person(name) {
  this.name = name
  this.intr = function () { }
}
Person.prototype.eat = function () { }


//  1. 原型链继承：父类实例变成子类的原型（无法向父类传参）
function Student() { }
Student.prototype = new Person()
Student.prototype.name = 'vancats'


//  2. 构造函数继承
function Student(name, age) {
  Person.call(this, name)
  this.age = age
}

//  3. 实例继承
function Student(name, age) {
  let person = new Person(name)
  person.age = age
  return person
}

//  4. 拷贝继承：无法获取父类不可 for in 的方法
function Student(name, age) {
  let person = new Person(name)
  for (var p in person) {
    Student.prototype[p] = person[p]
  }
  this.age = age
}


//  5. 组合继承
function Student(name, age) {
  Person.call(this, name)
  this.age = age
}
Student.prototype = new Animal()
Student.prototype.constructor = Student

//  6. 寄生组合继承
function Student(name, age) {
  Person.call(this, name)
  this.age = age
}
Student.prototype = Object.create(Person.prototype)
Student.prototype.constructor = Student

//  7. class Extends
class Student {
  constructor(name) {
    super(name)
  }
}
