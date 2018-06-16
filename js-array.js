/* jshint esversion: 6 */

// 1.==========创建数组

var arr = [];
var arr1 = new Array(); //创建空数组
var arr2 = new Array(5); // 创建数组长度为5 返回[undefined, undefined, undefined. undefined, undefined]
var arr3 = new Array(1, 2, 3, 4, 5);
var arr4 = Array.of(7); //创建数组并赋值7
var arr4 = Array.of(1, 2, 3); //创建数组并赋值1,2,3

console.log(arr2);
console.log(arr3);

// 2.==========检测数组

// 判断一个对象是不是数组的三种方法

var a = [];
if (a instanceof Array) {
  console.log('is数组1');
}

var arrList = [1, 2, 3];
if (Object.prototype.toString.call(arrList) == '[object Array]') {
  console.log('is数组2');
}

if (Array.isArray(a)) {
  console.log('is数组3');
  console.log(Array.isArray(a));
}

if (a.constructor == Array) {
  console.log('is数组4');
}

// 3.==========数组方法

let arrayLike = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3
};

let arrayLike2 = {
  length: 3
};
let str = 'abcd';

let newArray1 = Array.from(arrayLike);
let newArray2 = Array.from(arrayLike, (arg) => arg + '1');
let newArray3 = Array.from(arrayLike2);
let newArray4 = Array.from(str);
console.log(newArray1);
console.log(newArray2);
console.log(newArray3);
console.log(newArray4);



var arr1 = new Array("1", "2", "3");

var arr2 = new Array("4", "5", "6");

Array.prototype.push.apply(arr1, arr2);

console.log(arr1);

Array.of(7);
Array.of(1, 2, 3);

var arr = [1, 2, 3];
var arr1 = arr.join(" ");
console.log(arr);
console.log(arr1);

// arr.join()排序

var arr = [2, 3, 1, 5, 4];
var arr1 = arr.sort(function (a, b) {
  return b - a;
});

console.log(arr);
console.log(arr1);

var arr2 = arr1.concat(arr);
console.log(arr2);
console.log(arr);

var arr3 = arr.slice(2, 4);
console.log(arr3);
console.log(arr);
// [1,2,3,4,5]

// arr.splice

var arr = [1, 2, 3, 4, 5, 6];
var arr3 = [1, 2];
var arr1 = arr.splice(2, 2, arr3);

console.log(arr);
console.log(arr1);

var arr = [0, 1, 2, 3, 4, 5, 6, 7];
var arr1 = arr.copyWithin(1, 3);
console.log(arr);
console.log(arr1);

var arr = [0, 1, 2, 3, 4, 5, 6, 7];
var arr1 = arr.fill(9, 2, 4);
console.log(arr);
console.log(arr1);

var arr = [0, 1, 2, 3, 4, 5, 6, 7];
var index = arr.indexOf(4, 5);
console.log(index);

var arr = [0, 1, 2, 3, 4, 5, 6, 7];
var index = arr.lastIndexOf(4, 4);
console.log(index);

var arr = [0, 1, 2, 3, 4, 5, 6, 7];
var index = arr.includes(4, -1);
console.log(index);

console.log([NaN].indexOf(NaN));
console.log([NaN].includes(NaN));


console.log([1, 4, -5, 10].find((v, i, arr) => v < 0));

console.log([-1, 4, -5, 10].find((v, i, arr) => v > 0));

console.log([1, 5, 10, 15].findIndex((v, i, arr) => {
  return v > 9;
}));

for (let index of ['a', 'b'].keys()) {
  console.log(index);
}
// 0
// 1

for (let value of ['a', 'b'].values()) {
  console.log(value);
}
// 'a'
// 'b'

for (let [index, value] of ['a', 'b'].entries()) {
  console.log(index, value);
}
// 0 "a"
// 1 "b"

var arr = ["a", "b"];
var iterator = arr.entries(); // undefined

console.log(iterator); // Array Iterator {}

console.log(iterator.next().value); // [0, "a"]
console.log(iterator.next().value); // [1, "b"]

var arr1 = [1, 2];
var arr2 = [3, 4];
// function flation(arr1, arr2) {
//     for (var i = 0; i < arr2.length; i++) {
//         arr1.push(arr2[i]);
//     }

//     return arr1;
// }

function flatten(arr1, arr2) {
  return arr2.reduce(function (prev, curr) {
    prev.push(curr);
    return prev;
  }, arr1);
}

// console.log(flation(arr1, arr2));
console.log(flatten(arr1, arr2));

function flatten(arr, result) {
  if (!result) {
    result = [];
  }
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].constructor == Array) {
      flatten(arr[i], result);
    } else {
      result.push(arr[i]);
    }
  }
  return result;
}

console.log(flatten([
  [1, 2],
  [3, 4, 5],
  [6, 7, 8, 9],
  [11, 12, [12, 13, [14]]], 10, 11
]));