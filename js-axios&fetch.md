# js-axios

## axios

- 可以再nodejs中使用
- 提供了并发请求的接口 `axiso.all()`
- 支持Promise API
- 体积比较小

issue:

>axios访问api时，session每次访问都不一样，导致后台无法设置session状态

resolve：

>axios默认是不携带验证信息的，所以每次都会不一样，需要进行下面的配置

```javascript
axios.default.withCredentials=true
```

## fetch

API基于Promise设计，旧版本浏览器不支持Promise，需要使用polyfill es6-promise

fetch的一些问题：

- fetch比较底层需要手动将参数拼接成'key=value'格式，而jQuery ajax已经封装好了；
- fetch还不支持超时控制`timeout`；

>fetch支持超时写法的连接 

http://imweb.io/topic/57c6ea35808fd2fb204eef63

原生的HTML5 API fetch并不支持timeout属性，习惯了jQuery的ajax配置的同学，如果一时在fetch找不到配置timeout的地方，也许会很纠结。fetch 的配置 API 如下：

### 语法

```javascript
fetch(input, init).then(function(response) { ... });
```

### 参数

- input

  定义要获取的资源。这可能是： 一个 USVString 字符串，包含要获取资源的 URL。 一个 Request 对象。

- init 可选 

  一个配置项对象，包括所有对请求的设置。可选的参数有：
  - method: 请求使用的方法，如 GET、POST。
  - headers: 请求的头信息，形式为 Headers 对象或 ByteString。 
  - body: 请求的 body 信息：可能是一个 Blob、BufferSource、FormData、URLSearchParams 或者 USVString 对象。注意 GET 或 HEAD 方法的请求不能包含 body 信息。
  - mode: 请求的模式，如 cors、 no-cors 或者 same-origin。
  - credentials: 请求的 credentials，如 omit、same-origin 或者 include。
  - cache: 请求的 cache 模式: default, no-store, reload, no-cache, force-cache, or only-if-cached。

根本找不到timeout配置，本文和大家分享如何快速实现 fetch 的 timeout功能。

我们先实现abort功能，但由于初始化fetch后，返回的是一个Promise对象，那么需要在abort后达到触发rejectPromise的效果。

如果要沿用fetch返回的Promise来实现abort估计是达不到效果的，这里需要借助自己的一个Promise实例来达到目的。

```javascript
var abort_fn = null;
var abort_promise = new Promise(function(resolve, reject) {
    abort_fn = function() {
        reject('abort promise');
    };
 });
 ```

这个简单的代码段，可以通过调用abort_fn 函数就可以触发abort_promise的reject。

fetch 返回的promise 我们暂且称为 fetch_promise 吧，那么现在有两个 promise：abort_promise 和 fetch_promise。

每个promise都可以绑定resolve callback 和 reject callbck，那么后续then的回调绑定到哪个promise上呢，这是一个问题。

这里我们使用Promise非常好用的Promise.race方法， 他可以帮我们解决这个问题：

>Promise.race

Promise.race(iterable)方法返回一个promise，这个promise在iterable中的任意一个promise被解决或拒绝后，立刻以相同的解决值被解决或以相同的拒绝原因被拒绝。

合体：

```javascript
function abortablePromise(fetch_promise) {

    var abort_fn = null;

    // 这是一个可以被reject的promise
    var abort_promise = new Promise(function(resolve, reject) {
        abort_fn = function() {
            reject('abort promise');
        };
    });

    // 这里使用Promise.race，以最快 resolve 或 reject 的结果来传入后续绑定的回调
    var abortable_promise = Promise.race([
        fetch_promise,
        abort_promise
    ]);

    abortable_promise.abort = abort_fn;
    return abortable_promise;
}
```

经过abortablePromise包裹后的promise都会返回一个新的promise，不同的是带上了一个abort方法。 使用例子:

```javascript
var p = abortablePromise(fetch('//a.com/b/c'));

p.then(
    function(res) {
        console.log(res)
    },
    function(err) {
        console.log(err);
    }
);

//假设fetch要3秒，但是你想在2秒就放弃了：
setTimeout(
    function() {
        p.abort(); // -> will print "abort promise"
    }, 
    2000
);
```

目前为止，大体功能已经实现，再稍微调整，让调用更方便：

```javascript
_fetch(fetch('//a.com/b/c'), 2000)
	.then(function(res) {
       	console.log(res)
    }, function(err) {
        console.log(err);
	}
);
function _fetch(fetch_promise, timeout) {
	var abort_fn = null;
	//这是一个可以被reject的promise
    var abort_promise = new Promise(function(resolve, reject) {
        abort_fn = function() {
            reject('abort promise');
        };
	});

    // 这里使用Promise.race，以最快 resolve 或 reject 的结果来传入后续绑定的回调
    var abortable_promise = Promise.race([
        fetch_promise,
        abort_promise
    ]);
    setTimeout(
        function() {
            abort_fn();
        }, 
        timeout
    );

    return abortable_promise;
}
```

