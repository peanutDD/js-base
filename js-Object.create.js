/* jshint esversion: 6 */

// Object.create 兼容实现

let obj1 = {id: 1};

Object._create = (o) => {
    let Fn = function() {}; // 临时的构造函数
    Fn.prototype = o;
    console.log(Fn.prototype.id === 1);
    return new Fn;
};
        
let obj2 = Object._create(obj1);
console.log(obj2.__proto__ === obj1); // true
console.log(obj2.id); // 1

// 原生的Object.create
let obj3 = Object.create(obj1);
console.log(obj3.__proto__ === obj1); // true
console.log(obj3.id); // 1
