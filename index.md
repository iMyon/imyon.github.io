---
layout: page
title: 半分虚幻的庭师
(*tagline: Supporting tagline*)
---
{% include JB/setup %}

##文章列表

<ul class="posts">
  {% for post in site.posts %}
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>
