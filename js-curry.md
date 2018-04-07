# 简单理解JavaScript中的柯里化和反柯里化

- 柯里化又称部分求值，字面意思就是不会立刻求值，而是到了需要的时候再去求值

- 反柯里化的作用是，当我们调用某个方法，不用考虑这个对象在被设计时，是否拥有这个方法，只要这个方法适用于它，我们就可以对这个对象使用它。

## 柯里化(curring)

我们有这样一个场景，记录程序员一个月的加班总时间，那么好，我们首先要做的是记录程序员每天加班的时间，然后把一个月中每天的加班的时间相加，就得到了一个月的加班总时间。
但问题来了，我们有很多种方法可以实现它，比如最简单的：

```javascript
var monthTime = 0;

function overtime(time) {
 return monthTime += time;
}

overtime(3.5);    // 第一天
overtime(4.5);    // 第二天
overtime(2.1);    // 第三天
//...

console.log(monthTime);    // 10.1每次传入加班时间都进行累加，这样当然没问题，但你知道，如果数据量很大的情况下，这样会大大牺牲性能。
```

那怎么办？这就是柯里化要解决的问题。

其实我们不必每天都计算加班时间，只需要保存好每天的加班时间，在月底时计算这个月总共的加班时间，所以，其实只需要在月底计算一次就行。

下面的overtime函数还不是一个柯里化函数的完整实现，但可以帮助我们了解其核心思想：

```javascript
var overtime = (function() {
  var args = [];

  return function() {
    if(arguments.length === 0) {
      var time = 0;
      for (var i = 0, l = args.length; i < l; i++) {
        time += args[i];
      }
      return time;
    }else {
      [].push.apply(args, arguments);
    }
  }
})();

overtime(3.5);    // 第一天
overtime(4.5);    // 第二天
overtime(2.1);    // 第三天
//...

console.log( overtime() );    // 10.1柯里化的核心思想就是这样，看到这里你肯定已经懂了，至于真正的柯里化函数，网上有很多，大家可以去Google一下。
```

## 反柯里化(uncurring)

反柯里化的的作用已经在前言说过了，这里讲下它的由来。

2011年JavaScript之父Brendan Eich发表了一篇Twitter，提出了反柯里化这个思想，下面这段代码是反柯里化的实现方式之一：

```javascript
Function.prototype.uncurring = function() {
  var self = this;
  return function() {
    var obj = Array.prototype.shift.call(arguments);
    return self.apply(obj, arguments);
  };
};我们先来看看上面这段代码有什么作用。
我们要把Array.prototype.push方法转换成一个通用的push函数，只需要这样做：
var push = Array.prototype.push.uncurring();

//测试一下
(function() {
  push(arguments, 4);
  console.log(arguments); //[1, 2, 3, 4]
})(1, 2, 3)
```

arguments本来是没有push方法的，通常，我们都需要用Array.prototype.push.call来实现push方法，但现在，直接调用push函数，既简洁又意图明了。

就和前言写的那样，我们不用考虑对象是否拥有这个方法，只要它适用于这个方法，那就可以使用这个方法（类似于鸭子类型）。

我们来分析一下调用Array.prototype.push.uncurring()这句代码时，发生了什么事情：

```javascript
Function.prototype.uncurring = function() {
  var self = this;  //self此时是Array.prototype.push

  return function() {
    var obj = Array.prototype.shift.call(arguments);
    //obj 是{
    //  "length": 1,
    //  "0": 1
    //}
    //arguments的第一个对象被截去(也就是调用push方法的对象),剩下[2]

    return self.apply(obj, arguments);
    //相当于Array.prototype.push.apply(obj, 2);
  };
};

//测试一下
var push = Array.prototype.push.uncurring();
var obj = {
  "length": 1,
  "0" : 1
};

push(obj, 2);
console.log( obj ); //{0: 1,1: 2, length: 2 }
```

看到这里你应该对柯里化和反柯里化有了一个初步的认识了，但要熟练的运用在开发中，还需要我们更深入的去了解它们内在的含义。