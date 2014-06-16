---
layout:	post
category: acg
tags:	[js]
---

#firefox下innerHTML和textContent的效率比较  

####说明

写脚本用到，顺便测了下两者的效率。

###测试代码  
####第三方yidsf多多节点测试  
```js  
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

//example:
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

<!--break-->
