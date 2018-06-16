# FormData

## 1. 概述

FormData类型其实是在XMLHttpRequest 2级定义的，它是为序列化表以及创建与表单格式相同的数据（当然是用于XHR传输）提供便利。

`XMLHttpRequest` 是一个浏览器接口，通过它，我们可以使得 `Javascript` 进行 HTTP (S) 通信。`XMLHttpRequest` 在现在浏览器中是一种常用的前后台交互数据的方式。

2008年 2 月，`XMLHttpRequest Level 2` 草案提出来了，相对于上一代，它有一些新的特性，其中 FormData 就是 `XMLHttpRequest Level 2` 新增的一个对象，利用它来提交表单、模拟表单提交，当然最大的优势就是可以上传二进制文件。下面就具体介绍一下如何利用 FormData 来上传文件。

## 2. 构造函数

创建一个formData对象实例有几种方式

### 1、创建一个空对象实例

```javascript
var formData = new FormData();
```

此时可以调用append()方法来添加数据

### 2、使用已有的表单来初始化一个对象实例

假如现在页面已经有一个表单

```html
<form id="myForm" action="" method="post">
    <input type="text" name="name">名字
    <input type="password" name="psw">密码
    <input type="submit" value="提交">
</form>
```

我们可以使用这个表单元素作为初始化参数，来实例化一个formData对象

```javascript
// 获取页面已有的一个form表单
var form = document.getElementById("myForm");
// 用表单来初始化
var formData = new FormData(form);
// 我们可以根据name来访问表单中的字段
var name = formData.get("name"); // 获取名字
var psw = formData.get("psw"); // 获取密码
// 当然也可以在此基础上，添加其他数据
formData.append("token","kshdfiwi3rh");
```

### 3. 操作方法

首先，我们要明确formData里面存储的数据形式，一对key/value组成一条数据，key是唯一的，一个key可能对应多个value。如果是使用表单初始化，每一个表单字段对应一条数据，它们的HTML name属性即为key值，它们value属性对应value值。

| key | value      |
|-----|------------|
| k1  | [v1,v2,v3] |
| k2  | v4         |

#### 3.1 获取值

我们可以通过get(key)/getAll(key)来获取对应的value，

```javascript
formData.get("name"); // 获取key为name的第一个值
formData.get("name"); // 返回一个数组，获取key为name的所有值
```

#### 3.2 添加数据

我们可以通过append(key, value)来添加数据，如果指定的key不存在则会新增一条数据，如果key存在，则添加到数据的末尾

```javascript
formData.append("k1", "v1");
formData.append("k1", "v2");
formData.append("k1", "v1");

formData.get("k1"); // "v1"
formData.getAll("k1"); // ["v1","v2","v1"]
```

#### 3.3 设置修改数据

我们可以通过set(key, value)来设置修改数据，如果指定的key不存在则会新增一条，如果存在，则会修改对应的value值。
```javascript
formData.append("k1", "v1");
formData.set("k1", "1");
formData.getAll("k1"); // ["1"]
```
#### 3.4 判断是否该数据

我们可以通过has(key)来判断是否对应的key值

```javascript
formData.append("k1", "v1");
formData.append("k2",null);

formData.has("k1"); // true
formData.has("k2"); // true
formData.has("k3"); // false
```

#### 3.5 删除数据

通过delete(key)，来删除数据
```javascript
formData.append("k1", "v1");
formData.append("k1", "v2");
formData.append("k1", "v1");
formData.delete("k1");

formData.getAll("k1"); // []
```
#### 3.6 遍历

我们可以通过entries()来获取一个迭代器，然后遍历所有的数据

```javascript
formData.append("k1", "v1");
formData.append("k1", "v2");
formData.append("k2", "v1");

var i = formData.entries();

i.next(); // {done:false, value:["k1", "v1"]}
i.next(); // {done:fase, value:["k1", "v2"]}
i.next(); // {done:fase, value:["k2", "v1"]}
i.next(); // {done:true, value:undefined}
```

可以看到返回迭代器的规则:

1. 每调用一次next()返回一条数据，数据的顺序由添加的顺序决定

1. 返回的是一个对象，当其done属性为true时，说明已经遍历完所有的数据，这个也可以作为判断的依据

1. 返回的对象的value属性以数组形式存储了一对key/value，数组下标0为key，下标1为value，如果一个key值对应多个value，会变成多对key/value返回

我们也可以通过values()方法只获取value值

```javascript
formData.append("k1", "v1");
formData.append("k1", "v2");
formData.append("k2", "v1");

var i = formData.entries();

i.next(); // {done:false, value:"v1"}
i.next(); // {done:fase, value:"v2"}
i.next(); // {done:fase, value:"v1"}
i.next(); // {done:true, value:undefined}
```

4. 发送数据
我们可以通过xhr来发送数据

```javascript
var xhr = new XMLHttpRequest();
xhr.open("post","login");
xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
xhr.send(formData);
```

这种方式可以来实现文件的异步上传。

## 4. 表单序列化

### 4.1 概述

随着Ajax的出现，表单的序列化已经是一个常见的需求。我们先明确表单提交时，浏览器是怎么样将数据发送给服务器的

- 对表单字段的名称和值进行URL编码（调用encodeURIComponent()方法），使用&分隔，无论是get还是post请求，都是一样的

- 不发送禁用的表单字段，即属性disabled为true的

- 只发送勾选的复选框和单选按钮

- 不发送type为reset和button的按钮

- 多选选择框中每个选择的值单独一个条目

- 在单击提交按钮表单的情况下，也会发送提交按钮的value值，否则不发送提交按钮。

- elect元素的值，就是选中的option元素的value属性的值，如果option元素没有value属性，则是option元素的文本值。

### 4.2 实现

1. 增加参数验证

2. 将form.elements转为数组，提高性能

3. 改进多选选择框，同一个参数名的值进行合并,试验了一下，如果options没有HTML的value属性，读取该option的value属性会等于它的text属性(测试浏览器 IE8，chrome)

```javascript
function serialize(form) {
    // 参数验证
    if(!form && form.nodeName.toUpperCase() != "FORM" ){
        throw new Error("invalid parameters");
    }

    var encode = window.encodeURIComponent,
        slice = Array.prototype.slice;

    var params = [],
        i = 0,
        fields = slice.call(form.elements),
        len = fields.length,
        el,
        type;
    for(;i < len; i++){
        el = fields[i];
        type = el.type.toLowerCase();
        switch(type){
            case  "undefined":
            case  "button":
            case  "submit":
            case  "reset":
            case "file":
              break;
            case "select-one":
            case "select-multiple":
                if(el.name.length){
                    var j = 0,
                        opts = slice.call(el.options),
                        oLen = opts.length,
                        selected = [] , // 用于合并参数
                        opt;
                    for(; j < oLen; j++){
                        opt = opts[j];
                        if(!opt.selected)continue;
                        selected.push(opt.value);
                    }
                    params.push(encode(el.name) + "=" + encode(selected.join(",")));
                }
                break;
            case "checkbox":
            case "radio":
                if(!el.checked){
                    break;
                }
            default:
              if(el.name.length){
                params.push(encode(el.name) + "=" + encode(el.value));
              }
        }
    }
    return params.join("&");
};

```

>以上代码在IE8会报错，原因是option元素的实现并非一个JavaScript对象，导致无法使用slice，当然解决的方法也有，就是重写slice函数，但是这脱离了本章节的主题。

- [FormData](#formdata)
  - [1. 概述](#1)
  - [2. 构造函数](#2)
    - [1、创建一个空对象实例](#1)
    - [2、使用已有的表单来初始化一个对象实例](#2)
    - [3. 操作方法](#3)
      - [3.1 获取值](#31)
      - [3.2 添加数据](#32)
      - [3.3 设置修改数据](#33)
      - [3.4 判断是否该数据](#34)
      - [3.5 删除数据](#35)
      - [3.6 遍历](#36)
  - [4. 表单序列化](#4)
    - [4.1 概述](#41)
    - [4.2 实现](#42)
