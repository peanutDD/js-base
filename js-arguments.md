# js-arguments

## arguments.callee

在函数内部，有两个特殊的对象：arguments 和 this。其中， arguments 的主要用途是保存函数参数， 但这个对象还有一个名叫 callee 的属性，该属性是一个指针，指向拥有这个 arguments 对象的函数。 请看下面这个非常经典的阶乘函数：

```javascript
function factorial(num){    
    if (num <=1) {         
        return 1;     
    } else {         
        return num * factorial(num-1)     
    } 
}  
```

定义阶乘函数一般都要用到递归算法；如上面的代码所示，在函数有名字，而且名字以后也不会变 的情况下，这样定义没有问题。但问题是这个函数的执行与函数名 factorial 紧紧耦合在了一起。为 了消除这种紧密耦合的现象，可以像下面这样使用 arguments.callee

```javascript
function factorial(num){    
    if (num <=1) {         
        return 1;     
    } else {         
        return num * arguments.callee(num-1);
    } 
}  
```

在这个重写后的 factorial()函数的函数体内，没有再引用函数名 factorial。这样，无论引用 函数时使用的是什么名字，都可以保证正常完成递归调用。例如

```javascript
function factorial(num){
    if(num <= 1){
        return 1;
    } else {
        return num * arguments.callee(num-1);
    }
}
var trueFactorial = factorial;
alert(trueFactorial(5));    // 120    

factorial = function() {
    return 0;
}                
alert(trueFactorial(5)); // 120 如果没有使用arguments.callee，将返回0
```

在此，变量 trueFactorial 获得了 factorial 的值，实际上是在另一个位置上保存了一个函数 的指针。然后，我们又将一个简单地返回 0的函数赋值给 factorial 变量。如果像原来的 factorial() 那样不使用 arguments.callee，调用 trueFactorial()就会返回 0。可是，在解除了函数体内的代 码与函数名的耦合状态之后，trueFactorial()仍然能够正常地计算阶乘；至于 factorial()，它现 在只是一个返回 0的函数。

>现在已经不推荐使用arguments.callee()；

原因：访问 arguments 是个很昂贵的操作，因为它是个很大的对象，每次递归调用时都需要重新创建。影响现代浏览器的性能，还会影响闭包。

>不能用怎么办？

像第三段中的例子，重写 factorial()方法导致trueFactorial（）结果不在预期。是为了演示而做的。平时写代码应该避免。

递归时用到arguments.callee（）是常见的事情，比如

一道面试题。接受参数n=5,不用for循环输出数组【1,2,3,4,5】,这用递归的思路，配合arguments.callee，代码如下

```javascript
function show(n) {
    var arr = [];
    return (function () {
        arr.unshift(n);
        n--;
        if (n != 0) {
            arguments.callee();
        }
        return arr;
    })()
}
show(5)//[1,2,3,4,5]
```

现在arguments.callee 被弃用了。怎么办，其实很简单，给内部函数一个名字即可

```javascript
function show(n) {
    var arr = [];
    return (function fn() {
        arr.unshift(n);
        n--;
        if (n != 0) {
            fn();
        }
        return arr;

    })()
}
show(5) // [1,2,3,4,5]
```

><font color='#B13943'>JS严格模式（use strict）下不能使用arguments.callee的替代方案</font>

如下，一般在非严格模式下递归调用一般这样使用：
```javascript
function factorial(num){
    if(num<=1){
        return 1;
    }else {
        return num * arguments.callee(num-1);
    }
}

console.log(factorial(4)); //24
```

但是如果代码是在严格模式下开发：

```javascript
"use strict";
function factorial(num){
    if(num<=1){
        return 1;
    }else {
        return num * arguments.callee(num-1);
    }
}

console.log(factorial(4));
```

>结果：Uncaught TypeError: 'caller', 'callee', and 'arguments' properties may not be accessed on strict mode functions or the arguments objects for calls to them

在严格模式下不能通过脚本访问arguments.callee,访问这个属性会报错，那么可以使用命名函数表达式来达到相同的结果：

```javascript
"use strict";
var factorial = (function f(num){
     if(num<=1){
        return 1;
    }else {
        return num * f(num-1);
    }
})

console.log(factorial(4)); //24
```

以上代码创建了一个名为f()的命名函数表达式，然后将它赋值给变量factorial,即是把函数赋值给另外一个变量，函数的名字仍然有效。

在看一段代码：

```javascript
(function  foo(bar) {
  if (bar) {
    return;
  }
  foo(true);
})();
```

## Js中caller和callee的区别

### caller 返回一个调用当前函数的引用 如果是由顶层调用的话 则返回null

（举个栗子哈 caller给你打电话的人  谁给你打电话了 谁调用了你 很显然是下面a函数的执行 只有在打电话的时候你才能知道打电话的人是谁 所以对于函数来说 只有caller在函数执行的时候才存在）

```javascript
var callerTest = function() {
    console.log(callerTest.caller);
};
function a() {
    callerTest();
}

a() ; // 输出function a() {callerTest();}

callerTest(); // 输出null
```
 

### callee 返回一个正在被执行函数的引用  （这里常用来递归匿名函数本身 但是在严格模式下不可行）

callee是arguments对象的一个成员 表示对函数对象本身的引用 它有个length属性（代表形参的长度）

```javascript
var c = function(x,y) {
    console.log(arguments.length,arguments.callee.length,arguments.callee)
};

c(1,2,3); // 输出3 2 function(x,y) {console.log(arguments.length,arguments.callee.length,arguments.callee)}
```
