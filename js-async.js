/* jshint esversion: 6 */
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

const promise1 = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('success');
    }, 1000);
});
const promise2 = promise1.then(() => {
    throw new Error('error!!!');
});
  
console.log('promise1', promise1);
console.log('promise2', promise2);
  
setTimeout(() => {
  console.log('promise1', promise1);
  console.log('promise2', promise2);
}, 2000);


const promise = new Promise((resolve, reject) => {
    resolve('success1');
    reject('error');
    resolve('success2');
  });
  
promise
    .then((res) => {
      console.log('then: ', res);
    })
    .catch((err) => {
      console.log('catch: ', err);
    });


Promise
  .resolve(1)
  .then((res) => {
    console.log(res);
    return 2;
  })
  .catch((err) => {
    return 3;
  })
  .then((res) => {
    console.log(res);
  });


const promiseOne = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log('once');
      resolve('success');
    }, 1000);
});
      
const start = Date.now();
// console.log(start);
promiseOne.then((res) => {
  console.log(res, Date.now() - start);
});
promiseOne.then((res) => {
  console.log(res, Date.now() - start);
});

Promise
  .resolve()
  .then(() => {
    return Promise.reject(new Error('error!!!'))
    throw new Error('error!!!')
  })
  .then((res) => {
    console.log('then: ', res);
  })
  .catch((err) => {
    console.log('catch: ', err);
  });


//============================================================================
// process.nextTick 和 promise.then 都属于 microtask，
// 而 setImmediate 属于 macrotask，在事件循环的 check 阶段执行。
// 事件循环的每个阶段（macrotask）之间都会执行 microtask，事件循环的开始会先执行一次 microtask。


process.nextTick(() => {
    console.log('nextTick')
  })
  Promise.resolve()
    .then(() => {
      console.log('then')
    })
  setImmediate(() => {
    console.log('setImmediate')
  })
  console.log('end')
  
