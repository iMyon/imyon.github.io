---
layout:	post
category:	linux	
tags:	[linux,视频合并,格式转换,ffmpeg]
---

#linux合并flv视频并转换成mp3格式

###参考文章

[如何合并 flv 文件](http://forum.ubuntu.org.cn/viewtopic.php?f=74&t=291041&start=0) 6L

[使用ffmpeg把flv转换成mp3](http://my.oschina.net/tguitar/blog/101926)

[linux下 合并优酷等网站视频 ](http://blog.csdn.net/swust_long/article/details/7053295)

###前言
由于最近回家了，经常要帮别人到视频网站下视频，这点小事切到win下用硕鼠又太麻烦，所以搜索折腾了一下

<!--break-->

###准备

`sudo apt-get install ffmpeg mencoder libavcodec-extra-53`

###下载视频

>>参考[linux下 合并优酷等网站视频](http://blog.csdn.net/swust_long/article/details/7053295)

###合并视频

```
`mencoder -oac pcm -ovc copy -idx -o output.flv x.flv y.flv z.flv`
#以上为合并视频其中output.flv 是输出文件,x y z 是分段文件

#转换成mp3格式
`ffmpeg -i output.flv -vn  output.mp3`

```

###值得注意的地方

ffmpeg 转换 flv -> mp3 需要安装`libavcodec-extra-53`,`53`可能会随着版本变化，如果apt-get安装提示无源的话自动递增下版本，没安装会转换出错。
