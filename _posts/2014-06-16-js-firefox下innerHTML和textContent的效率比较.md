---
layout:	post
category: js
tags:	[js]
---

写脚本用到，顺便测了下两者的效率。

<!--break-->

###测试代码  
####一、多节点测试  
#####测试方法：通过测试body的innerHTML和textContent，比较两者的耗时
```javascript
var Timing = function(){
  //计时开始
  this.begin = function(){
    this.start = new Date();
  };
  //计时结束并调用回调函数
  this.end = function(callback){
    //回调函数参数：结束时间减去开始时间（毫秒）
    callback(new Date() - this.start);
  };
};

var timing = new Timing();
timing.begin();
for(let i=0;i<100;i++) document.body.innerHTML;
timing.end(function(t){
  console.log("innerHTML耗时:",t,"毫秒");
});
delete timing;

var timing = new Timing();
timing.begin();
for(let i=0;i<100;i++) document.body.textContent;
timing.end(function(t){
  console.log("textContent耗时:",t,"毫秒");
});
delete timing;
```
#####输出：
```
innerHTML耗时: 512 毫秒
textContent耗时: 39 毫秒
```

####二、单节点测试  
#####测试方法：通过测试document.title的innerHTML和textContent，比较两者的耗时
```javascript
var Timing = function(){
  //计时开始
  this.begin = function(){
    this.start = new Date();
  };
  //计时结束并调用回调函数
  this.end = function(callback){
    //回调函数参数：结束时间减去开始时间（毫秒）
    callback(new Date() - this.start);
  };
};

var timing = new Timing();
timing.begin();
for(let i=0;i<100000;i++) document.title.innerHTML;
timing.end(function(t){
  console.log("innerHTML耗时:",t,"毫秒");
});
delete timing;

var timing = new Timing();
timing.begin();
for(let i=0;i<100000;i++) document.title.textContent;
timing.end(function(t){
  console.log("textContent耗时:",t,"毫秒");
});
delete timing;
```
#####输出：
```
innerHTML耗时: 308 毫秒
textContent耗时: 329 毫秒
```

###结论  
当元素下面有很多子节点时，textContent的效率远远高于innerHTML  
当元素下面没有子节点的时候，innerHTML效率略高于textContent  
