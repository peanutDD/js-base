# js-js-EventMechanism

js事件的捕获和冒泡图

![@EVENT|center](https://user-gold-cdn.xitu.io/2018/6/20/1641b55b628f6727?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

```html
<div id="s1">s1
 <div id="s2">s2</div>
</div>
```

```javascript
<script>
s1.addEventListener("click",function(e){
  console.log("s1 冒泡事件"); },false);
s2.addEventListener("click",function(e){
  console.log("s2 冒泡事件");},false);
s1.addEventListener("click",function(e){
  console.log("s1 捕获事件");},true);
s2.addEventListener("click",function(e){
  console.log("s2 捕获事件");},true);
</script>

//s1 捕获事件
//s2 冒泡事件
//s2 捕获事件
//s1 冒泡事件
```

 - 点击s2，click事件从document->html->body->s1->s2(捕获前进)这里在s1上发现了捕获注册事件，则输出"s1 捕获事件"到达s2，已经到达目的节点。

 - s2上注册了冒泡和捕获事件，先注册的冒泡后注册的捕获，则先执行冒泡，输出"s2 冒泡事件"

 - 再在s2上执行后注册的事件，即捕获事件，输出"s2 捕获事件"

 - 下面进入冒泡阶段，按照s2->s1->body->html->documen(冒泡前进)

 - 在s1上发现了冒泡事件，则输出"s1 冒泡事件"

jQuery的on事件是冒泡

![jquery](https://user-gold-cdn.xitu.io/2018/6/20/1641b4d35e2b93cf?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

## 常用技巧

>onclick -->事件冒泡，重写onlick会覆盖之前属性，没有兼容性问题

```javascript
ele.onclik = null;   //解绑单击事件，将onlick属性设为null即可
```

>阻止默认事件(href=""链接，submit表单提交等)

1. return false; 阻止独享属性（通过on这种方式）绑定的事件的默认事件

```javascript
ele.onclick = function() {
  ……                         //你的代码
  return false;              //通过返回false值阻止默认事件行为
}
```

但是，在jQuery中，我们常用 `return false` 来阻止浏览器的默认行为，那 `return false` 到底做了什么？

当你每次调用 `return false` 的时候，它实际上做了3件事情：

- event.preventDefault();

- event.stopPropagation();

- 停止回调函数执行并立即返回。

这3件事中用来阻止浏览器继续执行默认行为的只有preventDefault，除非你想要停止事件冒泡，否则使用return false会为你的代码埋下很大的隐患。

贴上jQuery的源码

![jquery](https://user-gold-cdn.xitu.io/2018/6/20/1641b4d9a84bfe06?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

1. event.preventDefault( ); 阻止通过 addEventListener( ) 添加的事件的默认事件

```javascript
element.addEventListener(“click”, function(e){
    var event = e || window.event;
    ……
    event.preventDefault( ); // 阻止默认事件
},false);
```

1. event.returnValue = false; 阻止通过 attachEvent( ) 添加的事件的默认事件（此事件为ie浏览器特有）

```javascript
element.attachEvent(“onclick”, function(e){
    var event = e || window.event;
    ……
    event.returnValue = false;  //阻止默认事件
},false);
```

>把事件绑定以及事件解绑封装成为一个函数，兼容浏览器，包括IE6及以上（虽然现在基本上都放弃了IE9以下了）

```javascript
// 事件绑定
function addEvent(element, eType, handle, bol) {
  if(element.addEventListener){
    //如果  addEventListener
    element.addEventListener(eType, handle, bol);
  }else if(element.attachEvent){
    //如果  attachEvent
    element.attachEvent("on"+eType, handle);
  }else{
    //否则使用兼  onclick绑定
    element["on"+eType] = handle;
  }
}

// 事件解绑
function removeEvent(element, eType, handle, bol) {
  if(element.addEventListener){
    element.removeEventListener(eType, handle, bol);
  }else if(element.attachEvent){
    element.detachEvent("on"+eType, handle);
  }else{
    element["on"+eType] = null;
  }
}
```

#### 事件停止传播 stopPropagation 和 stopImmediatePropagation

```javascript
// 事件传播到 element 元素后，就不再向下传播了
element.addEventListener('click', function (event) {
  event.stopPropagation();
}, true);

// 事件冒泡到 element 元素后，就不再向上冒泡了
element.addEventListener('click', function (event) {
  event.stopPropagation();
}, false);
```

但是，stopPropagation方法只会阻止【该元素的当前事件（冒泡或者捕获）】的传播，不会阻止该节点的其他click事件的监听函数。

也就是说，不是彻底取消click事件,它还可以正常创建一个新的click事件。

```javascript
element.addEventListener('click', function (event) {
  event.stopPropagation();
  console.log(1);
});

element.addEventListener('click', function(event) {
  // 会触发
  console.log(2);
});
```

如果想要彻底阻止这个事件的传播，不再触发后面所有click的监听函数，可以使用stopImmediatePropagation方法。
注意：是针对该事件，比如你在click里写了这个方法，那【使用该方法之后】的该元素上绑定的方法将失效，但是别的mousedown，mouseover方法等还是生效的。

```javascript
element.addEventListener('click', function (event) {
  // 会触发
  console.log(‘改方法内的可以执行’);
  event.stopImmediatePropagation();
  // 会触发
  console.log(1);
});

element.addEventListener('click', function(event) {
  // 不会被触发
  console.log(2);
});

// Jquery同理
$(element).click(function() {
  // 不会触发
  console.log(‘jquery click’)
})

$(element).hover(function() {
  // 会触发
  console.log(‘jquery click’)
})
```

#### Event.bubbles，Event.eventPhase

Event.bubbles属性返回一个布尔值，表示当前事件是否会冒泡。该属性为只读属性，一般用来了解 Event 实例是否可以冒泡。前面说过，除非显式声明，Event构造函数生成的事件，默认是不冒泡的。可以根据下面的代码来判断事件是否冒泡，从而执行不同的函数。

```javascript
function goInput(e) {
  if (!e.bubbles) {
    passItOn(e);
  } else {
    doOutput(e);
  }
}
```

专门查了一下不支持冒泡的事件有：

- UI事件（load, unload, scroll, resize）
- 焦点事件（blur, focus）
- 鼠标事件（mouseleave, mouseenter）

Event.eventPhase属性返回一个整数常量，表示事件目前所处的阶段。该属性只读。

```javascript
var phase = event.eventPhase;
```

Event.eventPhase的返回值有四种可能:

 - 0，事件目前没有发生。
 - 1，事件目前处于捕获阶段，即处于从祖先节点向目标节点的传播过程中。
 - 2，事件到达目标节点，即Event.target属性指向的那个节点。
 - 3，事件处于冒泡阶段，即处于从目标节点向祖先节点的反向传播过程中。

#### Event.cancelable，Event.cancelBubble，event.defaultPrevented

Event.cancelable属性返回一个布尔值，表示事件是否可以取消。该属性为只读属性，一般用来了解 Event 实例的特性。

大多数浏览器的原生事件是可以取消的。比如，取消click事件，点击链接将无效。但是除非显式声明，Event构造函数生成的事件，默认是不可以取消的。

```javascript
var evt = new Event('foo');
evt.cancelable  // false
```

当Event.cancelable属性为true时，调用Event.preventDefault()就可以取消这个事件，阻止浏览器对该事件的默认行为。
注意，该方法只是取消事件对当前元素的默认影响，不会阻止事件的传播。如果要阻止传播，可以使用stopPropagation()或stopImmediatePropagation()方法。

```javascript
function preventEvent(event) {
  if (event.cancelable) {
    event.preventDefault();
  } else {
    console.warn('This event couldn\'t be canceled.');
    console.dir(event);
  }
}
```


Event.cancelBubble属性是一个布尔值，该属性可以自行设置。如果设为true，相当于执行Event.stopPropagation()，可以阻止事件的传播。

>注意：MDN里说该特性已经从 Web 标准中删除，虽然一些浏览器目前仍然支持它，但也许会在未来的某个时间停止支持，请尽量不要使用该特性。请使用 event.stopPropagation() 方法来代替该不标准的属性.cancelBubble-MDN

Event.defaultPrevented属性返回一个布尔值，表示该事件是否调用过Event.preventDefault方法。该属性只读。

```javascript
if (event.defaultPrevented) {
  console.log('该事件已经取消了');
}
```

https://juejin.im/post/5b29cdaa518825749d2d557a
https://www.jianshu.com/p/7105b81e456a