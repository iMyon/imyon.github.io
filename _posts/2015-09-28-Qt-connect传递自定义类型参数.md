---
layout: post
category: c++
tags: [Qt,c++,lambda]
keywords: [Qt,c++,lambda,clicked,自定义类型参数,自定义参数,参数类型]
---

最近无聊写Qt程序玩，发现connect的clicked信号不能传递自定义类型的参数，虽然有其他不传参数的方案可以解决问题，但是绕圈子感觉不爽，于是乎折腾好久才解决问题。  

<!--break-->

简单来说用到了qt5的新特性和`c++11`的`lambda`匿名函数  

Qt5的`connect`槽支持普通函数，而不是原来的只支持QObject，只能在`slots`定义  
> The new syntax can even connect to functions, not just QObjects:   

```cpp 

connect(sender, &Sender::valueChanged, someFunction);

```

上面的`someFunction`可以直接用lambda表达式代替，这样就可以通过lambda取上下文变量，变相传递自己想传的类型参数，实例如下：  

```cpp

CustomClass cc; //假设CustomClass是已经定义好了的类
//在需要的地方使用connect连接
connect(sender, &sender::clicked, receiver, [cc]{
             showEditDialog(cc);
         });

```

以上代码使用值传递方式将`CustomClass`类型的参数传递给showEditDialog函数，达到目的。  
lambda表达式更多的用法：[Lambda Expressions in C++](https://msdn.microsoft.com/en-us/library/dd293608.aspx)  

###参考资料  
* [New Signal Slot Syntax in Qt 5](https://wiki.qt.io/New_Signal_Slot_Syntax)