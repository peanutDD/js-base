new Promise(function (resolve, reject) {

  setTimeout(() => {
    console.log('开始');

    function errTest() {
      throw new Error('bye')
    }
    console.log('Test:', errTest());
  }, 2000);
}).then(function (resolve) {
  console.log('成功', value);
}).catch((err) => {
  console.log(1);
  console.log('two', err.message);
});

new Promise(function (resolve, reject) {
  throw new Error('hello')
  // setTimeout(() => {
  //   throw new Error('bye');
  // }, 2000);
}).then((value) => {
  console.log(value + ' hello');
}).catch((error) => {
  console.log('two:', error.message);
})