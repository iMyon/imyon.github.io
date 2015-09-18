---
layout: post
category: java
tags: [java]
---

web.xml简单来说就是java web应用用来处理web请求的一个配置文件


###一个简单的例子  

```xml

<web-app xmlns="http://java.sun.com/xml/ns/javaee" version="2.5">
    <servlet>
        <!-- servlet-name只是一个servlet的标识符，随意 -->
        <servlet-name>sample</servlet-name>
        <!-- 用来处理sample这个sevlet的java类 -->
        <servlet-class>mysite.server.SampleServlet</servlet-class>
    </servlet>
    <!-- sample的sevlet映射 -->
    <servlet-mapping>
        <servlet-name>sample</servlet-name>
        <!-- 所有请求都映射到sample这个setvlet -->
        <url-pattern>/*</url-pattern>
    </servlet-mapping>
</web-app>

```

<!--break-->

以上配置将所有请求都映射到sample这个servlet，即交给mysite.server.SampleServlet处理
  
###servlet标签的其他属性：  
####init-param  
例：   

```xml

<servlet>
    <servlet-name>redteam</servlet-name>
    <servlet-class>mysite.server.TeamServlet</servlet-class>
    <init-param>
        <param-name>teamColor</param-name>
        <param-value>red</param-value>
    </init-param>
    <init-param>
        <param-name>bgColor</param-name>
        <param-value>#CC0000</param-value>
    </init-param>
</servlet>

```

init-param设置的值可以通过以下语句获取  
`String teamColor = getServletConfig().getInitParameter("teamColor");`

####jsp-file  
直接映射URL到jsp文件（servlet-class是映射到servlet类）  
例：  

```xml

<servlet>
    <servlet-name>register</servlet-name>
    <jsp-file>/register/start.jsp</jsp-file>
</servlet>

<servlet-mapping>
    <servlet-name>register</servlet-name>
    <url-pattern>/register/*</url-pattern>
</servlet-mapping>

```

####load-on-startup  
应用启动时该servlet的加载顺序，值越小加载顺序越靠前

访问`/register/*`直接转到`/register/start.jsp`处理

###关于taglib  
jsp2.0之后不需要显示声明taglib，它会自动搜寻，搜寻目录： 

* `<appName>/WEB-INF`及其子目录
* jar包下的`META-INF`目录

###context-param  
顶层标签，和`init-param`类似，不过`context-param`作用域为整个web项目，而`init-param`只作用在它所在的servlet。  
例：  

```xml

<context-param> 
    <description>The email address of the administrator, used to send error reports.</description> 
    <param-name>webmaster</param-name> 
    <param-value>address@somedomain.com</param-value> 
</context-param> 

```

通过以下语句可以获取值：  
` String value = getServletContext().getInitParameter("webmaster");`

###env-entry  
配置JNDI的访问资源，例：  

```xml

<env-entry> 
    <env-entry-name>webmasterEmail</env-entry-name> 
    <env-entry-type>java.lang.String</env-entry-type> 
    <env-entry-value>admin@domain.com</env-entry-value> 
</env-entry>

```

取值：  

```java

 // 获取JNDI上下文
Context env = (Context)new InitialContext().lookup("java:comp/env");

// 获取配置文件的值
String webmasterEmail = (String)env.lookup("webmasterEmail");

```

###filter  
顶层标签， 简单来说serlvet中的filter就是一个中间件的作用，它不是用于处理请求和响应，而是用来过滤的，如果设置了filter，那么该请求和响应之前都要先通过filter。它的主要作用一般是权限控制、编码转换、请求响应头修改等。  例：  

```xml

<filter>
  <filter-name>Set Character Encoding</filter-name>
  <filter-class>filters.SetCharacterEncodingFilter</filter-class>
  <init-param>
    <param-name>encoding</param-name>
    <param-value>EUC_JP</param-value>
  </init-param>
</filter>
<filter-mapping>
  <filter-name>Set Character Encoding</filter-name>
  <url-pattern>/*</url-pattern>
</filter-mapping> 

```

给每个页面加上编码处理，通过filters.SetCharacterEncodingFilter这个java类实现  

###listener  
顶层标签，用于定义Listener，jsp的Listener主要用来监听各种特定事件，比如监听session的销毁和创建，例：  

```xml

<listener>
  <listener-class>com.metawerx.listener.ContextListener</listener-class>
</listener>
<listener>
  <listener-class>com.metawerx.listener.SessionListener</listener-class>
</listener> 

```

###安全管理  
`security-role`、`security-constraint`和`login-config`标签，可以不通过编程限制某个资源的访问权限和强制SSL，

###error-page  
页面出错跳转页面， 例：  

```xml

<!-- 页面404时跳转 -->
<error-page>
  <error-code>404</error-code>
  <location>/error404.jsp</location>
</error-page>

<!-- 根据错误类型跳转到不同页面，Throwable为所有错误 -->
<error-page>
  <exception-type>java.lang.Throwable</exception-type>
  <location>/errorThrowable.jsp</location>
</error-page> 

```

###mime-mapping  
资源扩展名和mine-type的映射关系，访问一个应用未知扩展名文件的时候，一般应用会默认使用纯文本（即`text/plain`）的方式打开，如果想要改成下载，就要改变mine-type映射关系，例：  

```xml

<mime-mapping> 
    <extension>pqz</extension>
    <mime-type>application/octet-stream</mime-type> 
</mime-mapping>

```

[mine-type对照表](http://tool.oschina.net/commons)


###welcome-file-list  
访问目录根目录时默认访问的文件，比如访问`http://localhost/`自动到`http://localhost/index.jsp`，例：  

```xml

<welcome-file-list>
  <welcome-file>index.html</welcome-file>
  <welcome-file>index.htm</welcome-file>
  <welcome-file>index.jsp</welcome-file>
</welcome-file-list> 

```  


##参考资料  
* [web.xml Reference Guide for Tomcat](http://wiki.metawerx.net/wiki/Web.xml)