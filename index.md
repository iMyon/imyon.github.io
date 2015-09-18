---
layout: page
title: Ancient Temple
(*tagline: Supporting tagline*)
---
{% include JB/setup %}

{% for post in site.posts %}
<div class = "card">
	<div class = "clearfix">
		<div  class = "date_label">
			<div class="day_month">
  			{{ post.date | date:"%m/%d" }}
  		</div>
  		<div class="year">
  			{{ post.date | date:"%Y" }}
  		</div>
  	</div> 
    <div class="post_title">
      <h2>
        <a href="{{ post.url }}">{{ post.title }}</a>
      </h2>
    </div>
	</div>
    <div class="post_desc">
		  {{ post.content  | | split:'<!--break-->' | first }}
    </div>
	<div class = "read_more">
		<a href="{{ BASE_PATH }}{{ post.url }}">查看全文</a>
	</div>
	
</div>
<hr>
{% endfor %}
