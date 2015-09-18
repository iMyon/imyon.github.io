---
layout:	post
category: js
tags:	[js,target,currentTarget]
---

###w3c描述

>target 事件属性可返回事件的目标节点（触发该事件的节点），如生成事件的元素、文档或窗口。

>currentTarget 事件属性返回其监听器触发事件的节点，即当前处理该事件的元素、文档或窗口。
在捕获和起泡阶段，该属性是非常有用的，因为在这两个节点，它不同于 target 属性。

w3c两个例子都是一样的代码，让人第一眼有点搞不懂他想干什么

<!--break-->

###简单例子

```html

<script type="text/javascript">
function c_getEventTrigger(event)
  { 
  x=event.currentTarget; 
  alert("触发元素:"
  + x.id);
  }
function t_getEventTrigger(event)
  { 
  x=event.target; 
  alert("触发元素"
  + x.id);
  }

</script>

<div>

<div>
<p id="p1" onmousedown="c_getEventTrigger(event)" style="background:#EE8B86">
我是p1
<span id="e1" style="background:#FFFFEE">我是e1</span>
<span id="e2" style="background:green">我是e2</span>
</p>
</div>

<div>
<p id="p2" onmousedown="t_getEventTrigger(event)" style="background:#EE8B86">
我是p1
<span id="e1" style="background:#FFFFEE">我是e1</span>
<span id="e2" style="background:green">我是e2</span>
</p>
</div>

</div>



```

<script type="text/javascript">
function c_getEventTrigger(event)
  { 
  x=event.currentTarget; 
  alert("触发元素:"
  + x.id);
  }
function t_getEventTrigger(event)
  { 
  x=event.target; 
  alert("触发元素"
  + x.id);
  }

</script>

<div>

<div>
<p id="p1" onmousedown="c_getEventTrigger(event)" style="background:#EE8B86">
我是p1
<span id="e1" style="background:#FFFFEE">我是e1</span>
<span id="e2" style="background:green">我是e2</span>
</p>
</div>

<div>
<p id="p2" onmousedown="t_getEventTrigger(event)" style="background:#EE8B86">
我是p2
<span id="e1" style="background:#FFFFEE">我是e1</span>
<span id="e2" style="background:green">我是e2</span>
</p>
</div>

</div>

###结论

可以看出`currentTarget`只获取监听元素，`target`获取的是触发元素
