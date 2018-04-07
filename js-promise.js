/* jshint esversion: 6 */

function runAsync1() {
    var p = new Promise(function(resolve, reject) {
        setTimeout(function() {
            // body
            console.log('执行完成11111');
            resolve('随便什么11111');
        }, 2000);

    });
    return p;
}
function runAsync2() {
    var p = new Promise(function(resolve, reject) {
        setTimeout(function() {
            // body
            console.log('执行完成22222');
            resolve('随便什么22222');
        }, 2000);

    });
    return p;
}
function runAsync3() {
    var p = new Promise(function(resolve, reject) {
        setTimeout(function() {
            // body
            console.log('执行完成33333');
            resolve('随便什么33333');
        }, 2000);

    });
    return p;
}
// runAsync().then((value) => {
//     console.log(value);
//     //后面可以用传过来的数据做些其他操作
// });

runAsync1()
.then(function(data){
    console.log(data);
    return runAsync2();
})
.then(function(data){
    console.log(data);
    return runAsync3();
})
.then(function(data){
    console.log(data);
    return '直接返回数据';  //这里直接返回数据
})
.then(function(data){
    console.log(data);
});

var promise = new Promise(function(resolve, reject) {
    setTimeout(function() {
        // body
        console.log('执行完成22222');
        resolve('随便什么22222');
    }, 2000);
});

promise.then((value) => {
    console.log(value);
    //后面可以用传过来的数据做些其他操作
});

// Math.random()是令系统随机选取大于等于 0.0 且小于 1.0 的伪随机 double 值

Promise.resolve()
  .then(function success1 (res) {
    throw new Error('error');
  }, function fail1 (e) {
    console.error('fail1: ', e);
  })
  .then(function success2 (res) {
  }, function fail2 (e) {
    console.error('fail2: ', e);
  });
