# Event Loop 必知必会（六道题）

![eventloop](https://pic4.zhimg.com/80/v2-3a59c624e6ff95a7e8c5a23c979f5abe_hd.jpg)

## 题目一

```javascript
setTimeout(() => {
  console.log('setTimeout')
}, 0)

setImmediate(() => {
  console.log('setImmediate')
})
```

运行结果：

```javascript
setImmediate
setTimeout
```

或者：

```javascript
setTimeout
setImmediate
```

为什么结果不确定呢？

解释：`setTimeout/setInterval` 的第二个参数取值范围是：`[1, 2^31 - 1]`，如果超过这个范围则会初始化为 1，即 `setTimeout(fn, 0) === setTimeout(fn, 1)`。我们知道 setTimeout 的回调函数在 timer 阶段执行，setImmediate 的回调函数在 check 阶段执行，event loop 的开始会先检查 timer 阶段，但是在开始之前到 timer 阶段会消耗一定时间，所以就会出现两种情况：

1. timer 前的准备时间超过 1ms，满足  loop->time >= 1，则执行 timer 阶段（setTimeout）的回调函数

1. timer 前的准备时间小于 1ms，则先执行 check 阶段（setImmediate）的回调函数，下一次 event loop 执行 timer 阶段（setTimeout）的回调函数

再看个例子：

```javascript
setTimeout(() => {
  console.log('setTimeout')
}, 0)

setImmediate(() => {
  console.log('setImmediate')
})

const start = Date.now()
while (Date.now() - start < 10);
```

运行结果一定是：

```javascript
setTimeout
setImmediate
```

## 题目二

```javascript
const fs = require('fs')

fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log('setTimeout')
  }, 0)

  setImmediate(() => {
    console.log('setImmediate')
  })
})
```

运行结果：

```javascript
setImmediate
setTimeout
```

解释：fs.readFile 的回调函数执行完后：

1. 注册 setTimeout 的回调函数到 timer 阶段
1. 注册 setImmediate 的回调函数到 check 阶段
1. event loop 从 pool 阶段出来继续往下一个阶段执行，恰好是 check 阶段，所以 setImmediate 的回调函数先执行
1. 本次 event loop 结束后，进入下一次 event loop，执行 setTimeout 的回调函数

所以，在 I/O Callbacks 中注册的 setTimeout 和 setImmediate，永远都是setImmediate 先执行。

## 题目三

```javascript
setInterval(() => {
  console.log('setInterval')
}, 100)

process.nextTick(function tick () {
  process.nextTick(tick)
})
```

运行结果：setInterval 永远不会打印出来。

解释：process.nextTick 会无限循环，将 event loop 阻塞在 microtask 阶段，导致 event loop 上其他 macrotask 阶段的回调函数没有机会执行。

解决方法通常是用 setImmediate 替代 process.nextTick，如下：

```javascript
setInterval(() => {
  console.log('setInterval')
}, 100)

setImmediate(function immediate () {
  setImmediate(immediate)
})
```

运行结果：每 100ms 打印一次 setInterval。

解释：process.nextTick 内执行 process.nextTick 仍然将 tick 函数注册到当前 microtask 的尾部，所以导致 microtask 永远执行不完； setImmediate 内执行 setImmediate 会将 immediate 函数注册到下一次 event loop 的 check 阶段，而不是当前正在执行的 check 阶段，所以给了 event loop 上其他 macrotask 执行的机会。

再看个例子：

```javascript
setImmediate(() => {
  console.log('setImmediate1')
  setImmediate(() => {
    console.log('setImmediate2')
  })
  process.nextTick(() => {
    console.log('nextTick')
  })
})

setImmediate(() => {
  console.log('setImmediate3')
})
```

运行结果：

```javascript
setImmediate1
setImmediate3
nextTick
setImmediate2
```

>注意：并不是说 setImmediate 可以完全替代 process.nextTick，process.nextTick 在特定场景下还是无法被替代的，比如我们就想将一些操作放到最近的 microtask 里执行。

## 题目四

```javascript
const promise = Promise.resolve()
  .then(() => {
    return promise
  })
promise.catch(console.error)
```

运行结果：

```javascript
TypeError: Chaining cycle detected for promise #<Promise>
```

解释：promise.then 类似于 process.nextTick，都会将回调函数注册到 microtask 阶段。上面代码会导致死循环，类似前面提到的：

```javascript
process.nextTick(function tick () {
  process.nextTick(tick)
})
```

再看个例子：

```javascript
const promise = Promise.resolve()

promise.then(() => {
  console.log('promise')
})

process.nextTick(() => {
  console.log('nextTick')
})
```

运行结果：

```javascript
nextTick
promise
```

解释：promise.then 虽然和 process.nextTick 一样，都将回调函数注册到 microtask，但优先级不一样。process.nextTick 的 microtask queue 总是优先于 promise 的 microtask queue 执行。

## 题目五

```javascript
setTimeout(() => {
  console.log(1)
}, 0)

new Promise((resolve, reject) => {
  console.log(2)
  for (let i = 0; i < 10000; i++) {
    i === 9999 && resolve()
  }
  console.log(3)
}).then(() => {
  console.log(4)
})
console.log(5)
```

运行结果：

```javascript
2
3
5
4
1
```

解释：Promise 构造函数是同步执行的，所以先打印 2、3，然后打印 5，接下来 event loop 进入执行 microtask 阶段，执行 promise.then 的回调函数打印出 4，然后执行下一个 macrotask，恰好是 timer 阶段的 setTimeout 的回调函数，打印出 1。

## 题目六

```javascript
setImmediate(() => {
  console.log(1)
  setTimeout(() => {
    console.log(2)
  }, 100)
  setImmediate(() => {
    console.log(3)
  })
  process.nextTick(() => {
    console.log(4)
  })
})
process.nextTick(() => {
  console.log(5)
  setTimeout(() => {
    console.log(6)
  }, 100)
  setImmediate(() => {
    console.log(7)
  })
  process.nextTick(() => {
    console.log(8)
  })
})
console.log(9)
```

运行结果：

```javascript
9
5
8
1
7
4
3
6
2
```

process.nextTick、setTimeout 和 setImmediate 的组合。

>https://zhuanlan.zhihu.com/p/34182184