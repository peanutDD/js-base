# javascript中new关键字详解

和其他高级语言一样 javascript 中也有 new 运算符，我们知道 new 运算符是用来实例化一个类，从而在内存中分配一个实例对象。 但在 javascript 中，万物皆对象，为什么还要通过 new 来产生对象？ 本文将带你一起来探索 javascript 中 new 的奥秘...

## 一、认识new运算符：

```javascript
function Animal(name){
    this.name = name;
}

Animal.color = "black";
Animal.prototype.say = function(){
    console.log("I'm " + this.name);
};

var cat = new Animal("cat");

console.log(
   cat.name,  //cat
   cat.height //undefined
);
cat.say(); //I'm cat

console.log(
   Animal.name, //Animal
   Animal.color //back
);
Animal.say(); //Animal.say is not a function
```

如果你能理解上面输出的结果，说明你已非常了解js中new和this的运行机制，请忽略本文!

我们将通过解析这个例子来加深你对js中new运算符的理解! 【如果你对js的this还不了解，请先阅读：JS作用域和this关键字】

### 1、代码解读

- 1-3行创建了一个函数Animal,并在其this上定义了属性:name,name的值是函数被执行时的形参。

- 第4行在Animal对象（Animal本身是一个函数对象）上定义了一个静态属性:color,并赋值“black”

- 5-7行在Animal函数的原型对象prototype上定义了一个say()方法，say方法输出了this的name值。

- 第8行通过new关键字创建了一个新对象cat

- 10-14行cat对象尝试访问name和color属性，并调用say方法。

- 16-20行Animal对象尝试访问name和color属性，并调用say方法。

### 2、重点解析

第8行代码是关键：

```javascript
var cat = new Animal("cat");
```

JS引擎执行这句代码时，在内部做了很多工作，用伪代码模拟其工作流程如下：

```javascript
new Animal("cat") = {

    var obj = {};

    obj.__proto__ = Animal.prototype;

    var result = Animal.call(obj,"cat");

    return typeof result === 'object'? result : obj;
}
```

1）创建一个空对象obj;

2）把obj的__proto__ 指向Animal的原型对象prototype，此时便建立了obj对象的原型链：

>obj->Animal.prototype->Object.prototype->null

3）在obj对象的执行环境调用Animal函数并传递参数“cat”。 相当于var result = obj.Animal("cat")。

当这句执行完之后，obj便产生了属性name并赋值为"cat"。【关于JS中call的用法请阅读：JS的call和apply】

4）考察第3步返回的返回值，如果无返回值或者返回一个非对象值，则将obj返回作为新对象；否则会将返回值作为新对象返回。

理解new的运行机制以后，我们知道cat其实就是过程（4）的返回值，因此我们对cat对象的认知就多了一些：

>cat的原型链是：cat->Animal.prototype->Object.prototype->null

注意：cat上新增了一个属性：name

分析完了cat的产生过程，我们再看看输出结果：

- `cat.name` -> 在过程（3）中，obj对象就产生了name属性。因此`cat.name`就是这里的`obj.name`

- cat.color -> cat会先查找自身的color，没有找到便会沿着原型链查找，在上述例子中，我们仅在Animal对象上定义了color,并没有在其原型链上定义，因此找不到。

- cat.say -> cat会先查找自身的say方法，没有找到便会沿着原型链查找，在上述例子中，我们在Animal的prototype上定义了say,因此在原型链上找到了say方法。

- 另外，在say方法中还访问`this.name`，这里的this指的是其调用者obj,因此输出的是obj.name的值。

对于Animal来说，它本身也是一个对象，因此，它在访问属性和方法时也遵守上述查找规则，所以：

>Animal.color -> "black"

- `Animal.name -> "Animal"` , Animal先查找自身的name,找到了name,<font color="B13943">注意：但这个name不是我们定义的name,而是函数对象内置的属性。</font>

一般情况下，函数对象在产生时会内置name属性并将函数名作为赋值<font color="B13943">（仅函数对象）</font>。

- `Animal.say -> Animal`在自身没有找到say方法，也会沿着其原型链查找，话说Animal的原型链是什么呢？

从测试结果看：Animal的原型链是这样的：

>Animal->Function.prototype->Object.prototype->null

因此Animal的原型链上没有定义say方法！



## 二、new存在的意义

认识了new运算符之后，我们再回到开篇提到的问题：JS中万物皆对象，为什么还要通过new来产生对象？要弄明白这个问题，我们首先要搞清楚cat和Animal的关系。

通过上面的分析，我们发现cat继承了Animal中的部分属性，因此我们可以简单的理解：Animal和cat是继承关系。

另一方面，cat是通过new产生的对象，那么cat到底是不是Animal的实例对象？ 我们先来了解一下JS是如何来定义“实例对象”的？

```javascript
 >A instanceof B
```

如果上述表达式为true,JS认为A是B的实例对象，我们用这个方法来判断一下cat和Animal

```javascript
 cat instanceof Animal; //true
```

从执行结果看：cat确实是Animal实例，要想证实这个结果，<font color="B13943">我们再来了解一下JS中instanceof的判断规则：</font>

```javascript
var L = A.__proto__;
var R = B.prototype;
if(L === R) return true;
```

如果A的__proto__ 等价于 B的prototype，就返回true

在new的执行过程（2）中，cat的__proto__指向了Animal的prototype，所以cat和Animal符合instanceof的判断结果。因此，我们认为：cat是Animal的实例对象。

### javascript 使用new关键字的区别

- 第一种方式使用new关键字以原型的方式将user对象暴露到window对象中

```javascript
//one

var user = function(){
  this.name="";
  this.id="";
};
user.add = function(){
  console.log("add");
};
user.delete = function(){
  console.log("delete");
};
user.prototype = user;
window.user = new user();
```

- 第二种方式不使用new关键字直接将user对象暴露到window对象中

```javascript
//two

var user = {
  name:"",
  id:""
};
user.add = function(){
  console.log("add");
};
user.delete = function(){
  console.log("delete");
};

// window.user = user; 同下面等价

window = {
    user: user
}
```

```html
<button onclick="user.add()">增加</button>
<button onclick="user.delete()">删除</button>
```

## 简单的总结语

在javascript中, 通过new可以产生原对象的一个实例对象，而这个实例对象继承了原对象的属性和方法。因此，new存在的意义在于它实现了javascript中的继承，而不仅仅是实例化了一个对象！