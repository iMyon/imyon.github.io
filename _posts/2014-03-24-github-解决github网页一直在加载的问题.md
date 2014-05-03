---
layout:	post
category: github
tags:	[github,hosts]
---

#hosts解决github网页一直加载问题

###问题描述

github网页加载不出来，刚google了下github一直在加载的网址，找到了可用的host

<!--break-->

###解决方法

找到系统的hosts文件，添加下面的代码

```

192.30.252.128 github.com
199.27.79.133 raw.github.com
199.27.79.133 raw2.github.com
192.30.252.141 gist.github.com
199.27.79.133 identicons.github.com
192.30.252.135 wiki.github.com
54.235.185.69 help.github.com
192.30.252.144 codeload.github.com
199.27.73.184 github.global.ssl.fastly.net
199.27.77.129 f.cloud.github.com

```

linux需重启下网络` /etc/init.d/networking restart`  
添加之后我这边秒开网页了

#####参考链接
[Github 刷很久出不来](https://code.google.com/p/openerdns/issues/detail?id=7)
