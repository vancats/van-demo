// 1. AJAX
function ajax(url, method) {
  let xhr = new XMLHttpRequest()
  xhr.open(method, url, true) // 异步
  xhr.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status === 200) {
        return this.responseText
      } else {
        throw new Error(this.statusText)
      }
    }
  }
  xhr.responseType = 'json'
  xhr.setRequestHeader('Accept', 'application/json')
  xhr.send()
}

function promiseAjax(url, method) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest()
    xhr.open(method, url, true)
    xhr.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status === 200) {
          resolve(this.responseText)
        } else {
          reject(new Error(this.statusText))
        }
      }
    }
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send()
  })
}



// 2. jsonp
function jsonp(url, params, cb) {

  let script = document.createElement('script')
  window[cb] = function (data) {
    console.log('data: ', data)
    document.body.removeChild(script)
  }
  params = { ...params, cb }
  let arr = []
  for (const key in params) {
    arr.push(`${key}=${params[key]}`)
  }
  script.src = `${url}?${arr.join('&')}`
  document.body.appendChild(script)
}



// 3. 图片异步加载
function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = url
    img.onload = () => {
      console.log(123)
      resolve(img)
    }
    img.onerror = (err) => {
      console.log(456)
      reject(err)
    }
  })
}



// 4. 红绿灯打印
function red() {
  console.log('red')
}
function green() {
  console.log('green')
}
function yellow() {
  console.log('yellow')
}

function task(color, timeout, callback) {
  setTimeout(() => {
    if (color === 'red') {
      red()
    } else if (color === 'green') {
      green()
    } else {
      yellow()
    }
    callback()
  }, timeout)
}

const step = () => {
  task('red', 1000, () => {
    task('green', 1000, () => {
      task('yellow', 1000, step)
    })
  })
}

function task1(color, timeout) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (color === 'red') {
        red()
      } else if (color === 'green') {
        green()
      } else {
        yellow()
      }
      resolve()
    }, timeout)
  })
}

const step1 = () => {
  task1('red', 1000)
    .then(() => task1('green', 1000))
    .then(() => task1('yellow', 1000))
    .then(step1)
}

const step2 = async () => {
  await task1('red', 1000)
  await task1('green', 1000)
  await task1('yellow', 1000)
  step2()
}



// 5. 一秒打印一个数字
function print(cnt) {
  setTimeout(() => {
    console.log(cnt)
    print(cnt + 1)
  }, 1000)
}

for (var i = 1; i < 4; i++) {
  setTimeout((j) => {
    console.log(j)
  }, i * 1000, i)
}

for (var i = 1; i < 4; i++) {
  ((j) => {
    setTimeout(() => {
      console.log(j)
    }, i * 1000)
  })(i)
}



// 6. Promise A+
// 1. 设置状态和值
// 2. resolve 和 reject 修改值
// 3. fn 函数的错误处理
// 4. 值穿透
// 5. 任务队列和错误处理
// 6. 两个延迟执行函数队列
// 7. resolvePromise
//    1. 循环爆栈处理
//    2. 普通值和没有 then 方法的值直接 resolve
//    3. 执行函数并递归调用 resolvePromise 注意要绑定 this
const PromisePending = 'PENDING'
const PromiseFulfilled = 'FULFILLED'
const PromiseRejected = 'REJECTED'

class MyPromise {
  constructor(fn) {
    if (typeof fn !== 'function') {
      return new TypeError(`Promise resolver ${fn} is not a function`)
    }
    this.PromiseState = PromisePending
    this.PromiseResult = null

    this.onFulfilledCallbacks = []
    this.onRejectedCallbacks = []

    const resolve = (value) => {
      this.PromiseResult = value
      this.PromiseState = PromiseFulfilled
      this.onFulfilledCallbacks.forEach(fn => fn())
    }

    const reject = (reason) => {
      this.PromiseResult = reason
      this.PromiseState = PromiseRejected
      this.onRejectedCallbacks.forEach(fn => fn())
    }

    try {
      fn(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }
    const promise2 = new MyPromise((resolve, reject) => {
      if (this.PromiseState === PromisePending) {
        this.onFulfilledCallbacks.push(() => {
          process.nextTick(() => {
            try {
              const x = onFulfilled(this.PromiseResult)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          })
        })

        this.onRejectedCallbacks.push(() => {
          process.nextTick(() => {
            try {
              const x = onRejected(this.PromiseResult)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          })
        })
      }

      if (this.PromiseState === PromiseFulfilled) {
        process.nextTick(() => {
          try {
            const x = onFulfilled(this.PromiseResult)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }

      if (this.PromiseState === PromiseRejected) {
        process.nextTick(() => {
          try {
            const x = onRejected(this.PromiseResult)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }
    })
    return promise2
  }

  catch(onRejected) {
    return this.then(undefined, onRejected)
  }

  finally(callback) {
    return this.then(callback, callback)
  }
}


const resolvePromise = (promise2, x, resolve, reject) => {
  if (promise2 === x)
    return reject(new Error('Chaining cycle detected for promise #<Promise>"'))

  if (x && (typeof x === 'object' || typeof x === 'function')) {
    let called = false
    try {
      const then = x.then
      if (typeof then !== 'function') {
        resolve(x)
      } else {
        then.call(x,
          value => {
            if (called) return
            called = true
            resolvePromise(promise2, value, resolve, reject)
          },
          reason => {
            if (called) return
            called = true
            reject(reason)
          }
        )
      }
    } catch (e) {
      if (called) return
      called = true
      reject(e)
    }
  } else {
    resolve(x)
  }
}


MyPromise.resolve = (value) => {
  return new MyPromise((resolve, reject) => {
    if (value in MyPromise) {
      return value
    } else if (typeof value === 'object' && 'then' in value) {
      return value.then(resolve, reject)
    } else {
      return new MyPromise(resolve => resolve(value))
    }
  })
}

MyPromise.reject = (reason) => {
  return new MyPromise((resolve, reject) => reject(reason))
}


MyPromise.all = (promises) => {
  return new MyPromise((resolve, reject) => {
    if (!Array.isArray(promises))
      return reject(new TypeError('Arguments is not iterator'))
    let n = promises.length
    if (!n)
      resolve(promises)
    let cnt = 0
    const res = new Array(n)
    promises.forEach((promise, index) => {
      MyPromise.resolve(promise).then(
        value => {
          cnt++
          res[index] = value
          cnt === n && resolve(res)
        },
        reason => {
          reject(reason)
        }
      )
    })
  })
}


MyPromise.race = (promises) => {
  return new MyPromise((resolve, reject) => {
    if (!Array.isArray(promises))
      return reject(new TypeError('Arguments is not iterator'))

    promises.forEach(promise => {
      MyPromise.resolve(promise).then(resolve, reject)
    })
  })
}

MyPromise.allSettled = (promises) => {
  return new MyPromise((resolve, reject) => {
    if (!Array.isArray(promises))
      return reject(new TypeError('Arguments is not iterator'))
    let n = promises.length
    if (!n)
      resolve(promises)
    let cnt = 0
    const res = new Array(n)
    promises.forEach((promise, index) => {
      MyPromise.resolve(promise).then(
        value => {
          cnt++
          res[index] = {
            status: 'fulfilled',
            value
          }
          cnt === n && resolve(res)
        },
        reason => {
          cnt++
          res[ind] = {
            status: 'rejected',
            reason
          }
          cnt === n && resolve(res)
        }
      )
    })
  })
}

MyPromise.any = (promises) => {
  return new MyPromise((resolve, reject) => {
    if (!Array.isArray(promises))
      return reject(new TypeError('Arguments is not iterator'))

    const n = promises.length
    if (!n)
      return reject(new AggregateError('All promises were iterator'))

    let cnt = 0
    const errors = new Array(n)
    promises.forEach((promise, index) => {
      MyPromise.resolve(promise).then(
        value => {
          resolve(value)
        },
        reason => {
          cnt++
          errors[index] = reason
          cnt === n && reject(new AggregateError(errors))
        }
      )
    })
  })
}



// 7. LazyMan
class LazyMan {
  constructor(name) {
    this.name = name
    this.tasks = []
    const task = () => {
      console.log(`我是${name}`)
      this.next()
    }
    this.tasks.push(task)
    setTimeout(() => {
      this.next()
    }, 0)
  }

  next() {
    const task = this.tasks.shift()
    task && task()
  }

  sleep(time) {
    this.sleepWrapper(time, false)
    return this
  }

  sleepFirst(time) {
    this.sleepWrapper(time, true)
    return this
  }

  sleepWrapper(time, first) {
    const task = () => {
      setTimeout(() => {
        this.next()
      }, time * 1000)
    }
    if (first) {
      this.tasks.unshift(task)
    } else {
      this.tasks.push(task)
    }
  }

  eat(food) {
    const task = () => {
      console.log(`Eat ${food}`)
      this.next()
    }
    this.tasks.push(task)
  }
}

// 8. 并行 Promise
class Scheduler {
  constructor(limit) {
    this.queue = []
    this.maxCount = limit
    this.runCounts = 0
  }

  add(time, order) {
    const promiseCreator = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log(order)
          resolve()
        }, time)
      })
    }
    this.queue.push(promiseCreator)
  }

  taskStart() {
    for (let i = 0; i < this.maxCount; i++) {
      this.request()
    }
  }

  request() {
    if (!this.queue || !this.queue.length || this.runCounts >= this.maxCount)
      return
    this.runCounts++
    const task = this.queue.shift()
    task().then(() => {
      this.runCounts--
      this.request()
    })
  }
}

// ? 测试用例
const scheduler = new Scheduler(2)
const addTask = (time, order) => {
  scheduler.add(time, order)
}
addTask(1000, "1")
addTask(500, "2")
addTask(300, "3")
addTask(400, "4")
scheduler.taskStart()



// 9. 依次输出任务并按顺序放入数组
function mergePromise(promises) {
  const data = []
  let promise = Promise.resolve()
  promises.forEach(item => {
    promise = promise.then(item).then((res) => {
      data.push(res)
      return data
    })
  })
  return promise
}

// ? 测试用例
const time = (timer) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, timer)
  })
}
const ajax1 = () => time(2000).then(() => {
  console.log(1)
  return 1
})
const ajax2 = () => time(1000).then(() => {
  console.log(2)
  return 2
})
const ajax3 = () => time(1000).then(() => {
  console.log(3)
  return 3
})


mergePromise([ajax1, ajax2, ajax3]).then(data => {
  console.log("done")
  console.log(data) // data 为 [1, 2, 3]
})
