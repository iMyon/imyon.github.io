---
layout: page
title: 半分虚幻的庭师
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
	</div>
		{{ post.content  | | split:'<!--break-->' | first }}
	<div class = "read_more">
		<a href="{{ BASE_PATH }}{{ post.url }}">查看全文</a>
	</div>
	
</div>
<hr>
{% endfor %}
