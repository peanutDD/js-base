/* jshint esversion: 6 */

var arr1 = new Array("1", "2", "3");
var arr2 = new Array("4", "5", "6");

Array.prototype.push.apply(arr1, arr2);
console.log(arr1);

var overtime = (function() {
  var args = [];

  return function() {
    if (arguments.length === 0) {
      var time = 0;

      for (var i = 0, l = args.length; i < l; i++) {
        time += args[i];
      }
      return time;
    } else {
      [].push.apply(args, arguments);
    }
  };
})();

overtime(3.5); // 第一天
overtime(4.5); // 第二天
overtime(2.1); // 第三天
//...

console.log(overtime()); // 10.1

// ==========================================================================================================
// 在计算机科学中，柯里化（英语：Currying），又译为卡瑞化或加里化，是把接受多个参数的函数变换成接受一个单一参数（最初函
// 数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术。这个技术由克里斯托弗·斯特雷奇以逻辑学家哈斯
// 凯尔·加里命名的，尽管它是Moses Schönfinkel和戈特洛布·弗雷格发明的。
// ==========================================================================================================
// curry 柯理化的实现（递归调用 + valueOf）
// ==========================================================================================================
// 知识点：valueOf 浏览器环境下 当我们以log(fn)这种形式取值时，会隐式调用fn自身的valueOf 所以得到的是valueOf的返回值
// ==========================================================================================================

function fn() {}
fn.valueOf = () => console.log("valueof");
console.log(fn); // valueof

// ==========================================================================================================
const mul = x => {
  const result = y => mul(x * y); // 递归调用mul
  result.valueOf = () => x;
  return result;
};
console.log(mul(2)(3)); // 6

// 在上面mul每执行一次,就会返回一个valueOf被改写后的新函数result 并且result执行会在里面调用mul(x * y)
// 在result函数的valueOf里保存着 由上一次x * y 传进来的结果x, 也就是上一次x*y 会作为这一次的输出 依然叫x

// 第一次mul(2) 此时 x为2  return result
// result 为 result = y => mul(2 * y);
// 第二次 mul(2)(3) 等价于 第一个mul返回的result(3), result执行 => mul(2 * 3) 再次调用mul 将2*3 = 6 的结果作为mul参数
// 最后mul(6) x = 6 在返回一个新函数result 此时result的valueOf = () => 6

// log(mul(2)(3)) 相当于log的最后返回的result 隐式调用valueOf 返回 6

// ==========================================================================================================
// curry 将多参数函数转换为接收单一参数的函数
// ==========================================================================================================
let Fn = function(a, b, c) {
  // 多参数函数
  return a + b + c;
};

function curry(Fn) {
  let args = []; // 收集参数
  let len = Fn.length;
  return function fe() {
    args = args.concat([].slice.call(arguments, 0));
    if (args.length === len) {
      return Fn.apply(null, args);
    }
    return fe;
  };
}

console.log(curry(Fn)(1)(2)(3)); // 6

// ==========================================================================================================
// 收集参数 延迟执行 到达指定次数才执行
// ==========================================================================================================
// 参数收集 指定次数后执行
function fn(...rest) {
  console.log(rest);
}

function after(fn, time = 1) {
  let params = [];
  return function(...rest) {
    params = [...params, ...rest];
    if (--time === 0) {
      fn.apply(this, params);
    }
  };
}
let newFn = after(fn, 3); // 执行3次 内部fn才会执行
newFn(2);
newFn(3);
newFn(4);
// ==========================================================================================================
