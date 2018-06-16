# js-input.md

前端页面开发的很多情况下都需要实时监听文本框输入，比如腾讯微博编写140字的微博时输入框hu9i动态显示还可以输入的字数。过去一般都使用`onchange/onkeyup/onkeypress/onkeydown`实现，但是这存在着一些不好的用户体验。比如`onchange`事件只在键盘或者鼠标操作改变对象属性，且失去焦点时触发，脚本触发无效；而`onkeydown/onkeypress/onkeyup`在处理复制、粘贴、拖拽、长按键（按住键盘不放）等细节上并不完善。

`onpropertychange`属性可在某些情况下解决上面存在的问题，不用考虑是否失去焦点，不管js操作还是键盘鼠标手动操作，只要HTML元素属性发生改变即可立即捕获到。遗憾的是，`onpropertychange`为IE专属的。其他浏览器下如果想要实现这一实时监听的需求，就要用到HTML5中的标准事件oninput，不过IE9以下的浏览器是不支持oninput事件的。

所以我们需要综合`oninpu`t和`onpropertychange`二者来实现文本区域实时监听的功能。举例如下：

>例1、对支持oninput的浏览器用oninput，其他浏览器（IE6/7/8）使用onpropertychange：

```javascript
var testinput = document.createElement('input');
if('oninput' in testinput) {
    object.addEventListener("input",fn,false);
} else {
    object.onpropertychange = fn;
}
```

>例2、对所有ie使用onpropertychange，其他浏览器用oninput：

```javascript
var ie = !!window.ActiveXObject;
if(ie){
    object.onpropertychange = fn;
}else{
    object.addEventListener("input",fn,false);
}
```

>汇总onchange onpropertychange 和oninput事件的区别：

1. onchange事件与onpropertychange事件的区别：
onchange事件在内容改变（两次内容有可能还是相等的）且失去焦点时触发；onpropertychange事件却是实时触发，即每增加或删除一个字符就会触发，通过js改变也会触发该事件，但是该事件IE专有。

2. oninput事件与onpropertychange事件的区别：
oninput事件是IE之外的大多数浏览器支持的事件，在value改变时触发，实时的，即每增加或删除一个字符就会触发，然而通过js改变value时，却不会触发；onpropertychange事件是任何属性改变都会触发的，而oninput却只在value改变时触发，oninput要通过addEventListener()来注册，onpropertychange注册方式跟一般事件一样。（此处都是指在js中动态绑定事件，以实现内容与行为分离）

3. oninput与onpropertychange失效的情况：

    - oninput事件：
      - 当脚本中改变value时，不会触发；
      - 从浏览器的自动下拉提示中选取时，不会触发。

    - onpropertychange事件：
      - 当input设置为disable=true后，onpropertychange不会触发。

HTML5将oninput事件标准化了，该事件用来检测用户的输入状态。当然，通过使用onkeydown或者onkeyup作为代替也是可以的。这些事件设计本意也并非如此

所有的现代浏览器支持oninput，其中包括IE9。对于那些老式浏览器，在不支持该事件时用keydown作为优雅降级。不幸的是，检测浏览器对该oninput事件的支持性并不容易。假定浏览器支持oninput，那么以下这段js代码的返回值为true，否则为false。
```javascript
 'oninput' in document.createElement('input')
```

这段代码在大多数浏览器中正常运行，除了Firefox（见bug #414853），故仍旧需要为oninput作浏览器特性检测。除此以外就没必要为其他浏览器作特性检测了，只需为input和keydown绑定事件，并在oninput事件触发之后删除onkeydown即可。示例如下：

```javascript
someElement.oninput = function() {
  el.onkeydown = null;
  // Your code goes here
};
someElement.onkeydown = function() {
  // Your code goes here
}
```

keydown事件仅会被触发一次（在oninput事件触发前），之后再触发oninput。虽然并不完美，但总比写上一大堆oninput特性检测代码要好些吧。

>https://blog.csdn.net/freshlover/article/details/39050609