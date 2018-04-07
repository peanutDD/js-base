# js异步

## 回调

回调是编写和处理 JavaScript 程序异步逻辑的最常用方式，无论是 setTimeout 还是 ajax，都是以回调的方式把我们打算做的事情在某一时刻执行。

回调的一般使用形式:

```JavaScript
// request(..) 是个支持回调的请求函数
request('http://my.data', function callback(res) {
    console.log(res)
})

// 或者延时的回调
setTimeout(function callback() {
    console.log('hi')
}, 1000)
```

函数 callback 即为回调函数，它作为参数传进请求函数，并将在合适的时候被调用执行。

回调的问题:

回调主要有以下两点问题。

1. 线性理解能力缺失，回调地狱

- 过深的嵌套，导致回调地狱，难以追踪回调的执行顺序。

1. 控制反转信任缺失，错误处理无法保证

- 回调函数的调用逻辑是在请求函数内部，我们无法保证回调函数一定会被正确调用。回调本身没有错误处理机制，需要额外设计。可能出现的错误包括：回调返回错误结果、吞掉可能出现的错误与异常、回调没有执行、回调被多次执行、回调被同步执行等等。

---

## Promise

Promise 的一般使用形式

```JavaScript
var p = new Promise((resolve, reject) => {
    if (1 > 0) {
        resolve(); // 通常用于完成
    } else {
        reject(); // 用于拒绝
    }
});

var onFulfilled =function () {
    // 用于处理完成
};

var onRejected = function () {
    // 用于处理拒绝
}
```

先理解几个单词，有助于理解整个模式：

- promise: 承诺

- pending: 待定

- settled: 定了

- resolve(d): （已）解决

- reject(ed): （已）拒绝

- onFulfilled: 已履行（事件）

- onRejected: 已拒绝（事件）

- then: 然后，接下来

- catch: 捕获

- race: 赛跑

- future: 未来（值）

- thenable：可then的（有then属性的）

Promise 不是对回调的替代。 Promise 在回调代码和将要执行这个任务的异步代码之间提供了一种可靠的中间机制来管理回调。

使用回调的话，通知就是任务 request(..) 调用的回调。而使用 Promise 的话，我们把这个关系反转了过来，侦听来自 request(..) 的事件，然后在得到通知的时候，根据情况继续。

你肯定已经注意到 Promise 并没有完全摆脱回调。它们只是改变了传递回调的位置。我们并不是把回调传递给 request(..)，而是从 request(..) 得到某个东西（外观上看是一个真正的 Promise），然后把回调传给这个东西。

Promise 归一保证了行为的一致性，Promise 给了确定的值，resolve、reject、pendding。一旦 Promise 决议，它就永远保持在这个状态。此时它就成为了不变值（immutable value），可以根据需求多次查看。

### 一.Promise是什么

一套异步操作处理机制，Promise A+是规范，jQuery、ES2015、q的promise都是对该规范的一种实现

### 二.Promise有什么特点

1. 更容易控制异步操作的执行顺序

1. 可以在一系列异步操作中，灵活地处理错误

1. 支持链式调用，好写

1. 能够消除回调金字塔，好看

### 三.Promise有什么用

1. 实现串行任务队列

1. 实现串行任务管道

1. 处理运行时才能确定执行顺序的串行任务

（具体适用场景以后再展开）

### 四.Promise类型

#### 内部属性[[PromiseStatus]]/[[PromiseValue]]

- [[PromiseStatus]]：pending(待定) | resolved(已解决) | rejected(已拒绝)

后两个统称settled（定了），pending是初始状态，如果new Promise(func)后，func中的resolve和reject都还没有执行，此时status=pending

- [[PromiseValue]]：undefined | resolve/reject的参数 | Promise.resolve/reject的!thenable参数 | onFulfilled/onRejected的返回值

当then被调用时，该值会被传给then的onFulfilled或onRejected，如果resolve和reject始终没有执行，那么then的onFulfilled和onRejected也始终不会执行

#### 构造器参数resolve/reject

1. resolve（解决）

执行resolve后，触发then的onFulfilled回调，并把resolve的参数传递给onFulfilled

1. reject（拒绝）

执行reject后，触发then | catch的onRejected回调，并把reject的参数传递给onRejected

>注意：如果紧跟的then没有声明onRejected回调，则传给下一个then | catch的onRejected，还没有，接着传…如果走到头都没有，则报错Uncaught (in promise) Error:xxx


>特殊的：如果resolve的参数是Promise对象，则该对象最终的[[PromiseValue]]会传递给外层Promise对象后续的then的onFulfilled/onRejected

例如：

```JavaScript
// 外层then能够拿到内层future和error
new Promise(function(resolve, reject) {
    resolve(new Promise(function(resolve, reject) {
        resolve(12);
        // reject(new Error('reject in nested Promise'));
    }).then(function(future) {
        return future + 1;
    }, function(error) {
        return new Error('reject again in nested Promise');
    }));
}).then(onFulfilled, onRejected);
// => 13 因为onFulfilled接收到了内层promise最终的[[PromiseValue]]
// 如果是reject，onFulfilled将会接收到Error('reject again')
```

### 五.基本语法

#### 1.创建Promise对象

创建Promise的基本语法如下：

```JavaScript
// 创建
var promise = new Promise(function(resolve, reject) {
    if (/*...*/) {
        resolve(data);
    }
    else {
        reject(new Error('error occurs'));
    }
});
// 使用
// then
promise.then(function(future) {
    // ...
}, function(error) {
    // ...
});
// catch
promise.catch(function(error) {
    // ...
});
```

>注意：new Promise(func)时，func会立即执行（不像generator只声明不执行），执行过程中遇到resolve()装没看见（P.S.简单理解为装没看见，解释见注释），遇到reject()立即抛出错误（注意：Chrome46会立即抛出错误，FF39不报错，其它polyfill，如es6-promise、promise-polyfill不报错）

对比例子如下：

```JavaScript
new Promise(function(resolve, reject) {
    console.log('#1');
    resolve(1);
    console.log('#2');
});
// => #1 #2 不报错（遇到resolve装没看见）
// 其实内部属性[[PromiseStatus]]和[[PromiseValue]]都变了，但没有then提供的onFulfilled回调，看不到效果

new Promise(function(resolve, reject) {
    console.log('#1');
    reject(new Error('reject'));
    console.log('#2');
});
// => #1 #2 Chrome46报错：Uncaught (in promise) Error: reject(…)
// 因为后面没有then/catch提供的onRejected回调，异常没有被消费掉
```

>P.S.reject的参数可以是任意类型的，但一般都传入Error对象表示错误原因

#### 2.Promise.prototype.then(onFulfilled, onRejected)

然后给promise添加onFulfilled/onRejected回调handler，当promise的resolve/reject执行时触发对应handler。

>注意：用promise.then添加回调函数时，如果promise已经处于fulfilled或rejected状态，那么相应的方法将会被立即调用返回一个Promise对象（链式调用有戏），可以简单理解为：

- 1.如果触发了onFulfilled，则该对象的[[PromiseValue]]=onFulfilled的返回值，
[[PromiseStatus]]=resolved

```JavaScript
new Promise(function(resolve, reject) {
    resolve(2);
}).then(function(future) {
    return future * 2;
}, onRejected).then(onFulfilled, onRejected);
// onFulfilled拿到了4
```

- 2.如果触发了onRejected，则该对象的[[PromiseValue]]=onRejected的返回值，[[PromiseStatus]]=resolved

>特别注意：返回对象的状态是resolved，而不是rejected

```JavaScript
new Promise(function(resolve, reject) {
    reject(2);
}).then(null, function(err) {
    return err * 2;
}).then(onFulfilled, onRejected);
// 还是onFulfilled拿到了4，而不是onRejected
```

>P.S.实际上[[PromiseValue]]=undefined, [[PromiseStatus]]=pending，但仍将按照上述状态来执行

#### 3.Promise.prototype.catch(onRejected) 捕获

等价于then(null, onRejected)，返回一个Promise对象，可以简单理解为：

- 1.如果触发了onReject，则返回对象的[[PromiseValue]]=onReject的返回值, [[PromiseStatus]]=resolved

- 2.如果onReject始终没有触发，则装作没看见catch，直接返回原Promise对象

```JavaScript
var p = new Promise(function(resolve, reject) {
    resolve(2);
}).catch(function() {
    console.log('onRejected');
    return false;
});
p.then(onFulfilled, onRejected);
// onFulfilled拿到了2，catch没有任何影响
```

>P.S.实际上[[PromiseValue]]=undefined, [[PromiseStatus]]=pending，但仍将按照上述状态来执行

#### 4.Promise.all(iterable)

返回Promise对象，当iterable中所有promise都resolve后，触发onFulfilled，遇到第一个否定promise就立即退出，并触发onRejected

```JavaScript
//1.全肯定集合，触发onFulfilled，传入的参数是集合中所有promise的[[PromiseValue]]组成的数组

Promise.all([getPromise(), getPromise()]).then(onFulfilled, onRejected);

//2.全否定集合，遇到第一个否定promise就退出，触发onRejected，传入的参数是该promise的[[PromiseValue]]

Promise.all([getPromise(true), getPromise(true)]).then(onFulfilled, onRejected);

// 3.一般集合，同上

Promise.all([getPromise(true), getPromise()]).then(onFulfilled, onRejected);
```

>P.S.all，要么全都正常完成，要么因错误中断，全都停下来

#### 5.Promise.race(iterable) 赛跑

返回Promise对象，当iterable中有任意一个promise被resolve后就立即退出，并触发onFulfilled，遇到否定promise就立即退出，并触发onRejected

```JavaScript
// 1.全肯定集合，遇到第一个肯定promise就退出，触发onFulfilled，传入的参数是该promise的[[PromiseValue]]

Promise.race([getPromise(), getPromise()]).then(onFulfilled, onRejected);

// 2.全否定集合，遇到第一个否定promise就退出，触发onRejected，传入的参数是该promise的[[PromiseValue]]

Promise.race([getPromise(true), getPromise(true)]).then(onFulfilled, onRejected);

// 3.一般集合，同上

Promise.race([getPromise(true), getPromise()]).then(onFulfilled, onRejected);
```

>P.S.“赛跑”，不论结果是肯定还是否定，只要最快的

#### 6.Promise.resolve(value) 解决

- 1.如果value是promise，则把promise中resolve/reject的参数传递给对应的onFulfilled/onRejected

```JavaScript

Promise.resolve(getPromise()).then(onFulfilled, onRejected);

// onFulfilled拿到resolve的参数

Promise.resolve(getPromise(true)).then(onFulfilled, onRejected);

// onRejected拿到reject的参数
```

- 2.如果value是thenable对象（有then属性的对象），就会把obj包装成Promise对象，该对象的then就是obj.then

```JavaScript
Promise.resolve({
    then: function(onFulfilled, onRejected) {
        // onFulfilled(1);
        onRejected(new Error('obj.then err'));

        console.log('obj.then');
    }
}).then(onFulfilled, onRejected);
```

- 3.如果value是!thenable值，会把该值包装成Promise对象，该对象的[[PromiseValue]]=value, [[PromiseStatus]]=resolved，所以调用then方法时，onFulfilled将会接收到这个值

```JavaScript
Promise.resolve(1).then(onFulfilled, onRejected);
// onFulfilled拿到1
```

- 7.Promise.reject(reason) 拒绝
会把reason包装成Promise对象，该对象的[[PromiseValue]]=reason, [[PromiseStatus]]=rejected，所以调用then方法时，onRejected将会接收到这个值

>注意：这里没有thenable/!thenable的区别，一视同仁：

```JavaScript
// 1.!thenable onRejected将拿到Error对象

Promise.reject(new Error('static reject')).then(onFulfilled, onRejected);

// 2.promise onRejected将拿到被包起来的肯定Promise对象
// 该对象的[[PromiseValue]]=promise, [[PromiseStatus]]=rejected

Promise.reject(getPromise()).then(onFulfilled, onRejected);

// 3.thenable onRejected将拿到{then: xxx}

Promise.reject({
    then: function(onFulfilled, onRejected) {
        console.log('obj.then');
    }
}).then(onFulfilled, onRejected);
```

完整的测试DEMO：promise实例

六.高级用法
配合生成器（generator）

配合async/await

（篇幅限制，以后再说）

>http://www.ayqy.net/blog/完全理解promise/
