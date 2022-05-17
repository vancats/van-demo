// 1 Object.create
function create(target) {
  function F() { }
  F.prototype = target
  return new F()
}

// 2 instanceof
function myInstanceOf(left, right) {
  const prototype = right.prototype
  let proto = Object.getPrototypeOf(left) // left.__proto__
  while (proto) {
    if (proto === prototype)
      return true
    proto = Object.getPrototypeOf(proto) // proto.__proto__
  }
  return false
}

// 3. compose
function compose(fns) {
  if (fns.length === 0)
    return v => v
  if (fns.length === 1)
    return fns[0]
  return fns.reduce((prev, cur) => (...args) => prev(cur(...args)))
}

// 4. new
function myNew(fn, ...args) {
  if (typeof fn !== 'function')
    throw new TypeError('必须是一个构造函数')
  const instance = Object.create(fn.prototype)
  const res = fn.apply(instance, args)
  if (res && (typeof res === 'object' || typeof res === 'function'))
    return res
  return instance
}

// 5. getType
function getType(target) {
  if (target === null) {
    return 'null'
  }
  if (typeof target === 'object')
    // 基本类型不推荐使用，因为 call 会对其进行封装处理
    return Object.prototype.toString.call(target).slice(8, -1)
  return typeof target
}

// 6. call
Function.prototype.myCall = function (context = window, ...args) {
  if (typeof this === 'function')
    throw new TypeError('必须是一个函数')

  context.fn = this
  const res = context.fn(...args)
  delete context.fn
  return res
}

// 7. apply
Function.prototype.myApply = function (context = window, args) {
  if (typeof this === 'function')
    throw new TypeError('必须是一个函数')

  context.fn = this
  const res = context.fn(...args)
  delete context.fn
  return res
}

// 8. bind
Function.prototype.myBind = function (context = window, ...args) {
  if (typeof this === 'function')
    throw new TypeError('必须是一个函数')
  const fn = this
  function resFn(...args1) {
    return resFn.call(this instanceof fn ? this : context, ...args, ...args1)
  }
  resFn.prototype = Object.create(fn.prototype)
  return resFn
}

// 9. flatten
function flatten(arr, depth = 1) {
  if (depth <= 0)
    return arr
  while (depth--) {
    arr = arr.reduce((prev, cur) => Array.isArray(cur) ? [...prev, ...cur] : [...prev, cur], [])
  }
  return arr
}

// 10. setTimeout -> setInterval
function mySetInterval(callback, timeout = 1000) {
  let timer = null

  function interval() {
    callback()
    timer = setTimeout(interval, timeout)
  }
  interval()
  return timer
}

// 11. requestAnimationFrame -> setInterval
function mySetInterval1(callback, timeout = 1000) {
  let timer = null
  let start = Date.now()
  function interval() {
    if (Date.now() - start >= timeout) {
      callback()
      start = Date.now()
    }
    timer = requestAnimationFrame(interval)
  }
  interval()
  return timer
}

// 12. 防抖
function debounce(fn, timeout) {
  let timer = null
  return function (...args) {
    let context = this
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(() => {
      fn.call(context, ...args)
    }, timeout)
  }
}

// 13. 节流
function throttle(fn, timeout) {
  let prev = Date.now()
  return function (...args) {
    let context = this
    let cur = Date.now()
    if (cur - prev >= timeout) {
      cur = Date.now()
      fn.call(context, ...args)
    }
  }
}

// 14. 柯里化
function curry(fn, ...args1) {
  let len = curry.length
  return function (...args2) {
    const curArgs = [...args1, args2]
    if (curArgs >= len) {
      return fn(...curArgs)
    } else {
      return curry.call(null, fn, curArgs)
    }
  }
}
