var data = function(time, user, spaceUrl, type){
  this.time = time;
  this.user = user;
  this.spaceUrl = spaceUrl;
  this.type = type;
};

var b_coin_chart = {
  datas: [],
  init: function(){
    loadcssfile("http://imyon.github.io/github-markdown-css/github-markdown.css");
    loadcssfile("http://cdn.bootcss.com/bootstrap/3.2.0/css/bootstrap.min.css");
    loadjsfile("http://imyon.github.io/Chart.js/Chart.min.js");
    loadjsfile("http://echarts.baidu.com/build/echarts-plain.js");
    $('body').html(
      '<div id="bcc">\
        <div class="upper">\
          <button type="button" id="table_btn" class="btn">查看原始数据</button>\
          <button type="button" id="chart_btn" class="btn">切换到图形</button>\
        </div>\
        <div id="view">数据请求中...</div>\
      </div>'
    );
    $("#table_btn").click(function(){
      b_coin_chart.table_view();
    });
    $("#chart_btn").click(function(){
      b_coin_chart.chart_view();
    });
    this.get_list(window.aid, 1);
  },
  get_list: function(av, page, _this){
    if(!_this) _this = this;
    $.get("http://www.bilibili.com/plus/comment.php?aid="+ av +"&page=" + page, onload);
    function onload(res){
      res = "<div>" + res + "</div>";
      var lists = $(res).find(".rat_list li");
      if(lists){
        lists.each(function(){
          var _time = $(this).find(".name").attr("title");
          var _url = $(this).find(".name a").attr("href");
          var _user = $(this).find(".name a").text();
          if($(this).find(".f5").length) //评分类型
            var _type = 0;
          else
            var _type = 1;
          var _data = new data(_time, _user, _url, _type);
          _this.datas.push(_data);
        });
      }
      if(lists.length){
        _this.get_list(av, ++page, _this);
      }
      //获取全部数据后的处理
      else{
        _this.show(); //展现视图
      }
    }
  },
  show: function(){
  },
  //表格视图
  table_view: function(){
    var trs = "";
    for(var i = 0; i<this.datas.length; i++){
      var d = this.datas[i];
      trs += gen_tr(i, d.time, d.type, d.spaceUrl, d.user);
    }
    document.getElementById("view").innerHTML = gen_table(trs);
    function gen_table(trs){
      var html = 
      '<ARTICLE class="markdown-body"> \
      <div class="view">\
        <table>\
          <thead>\
            <tr>\
              <th>序号</th>\
              <th>时间</th>\
              <th>类型</th>\
              <th>用户</th>\
            </tr>\
          </thead>\
          <tbody>{trs}</tbody>\
        </table>\
      </div>\
      </ARTICLE>';
      return html.replace("{trs}", trs);
    }
    function gen_tr(i, time, type, url, user){
      var tr = 
      '<tr>\
        <td>{i}</td>\
        <td>{time}</td>\
        <td>{type}</td>\
        <td><a href="{url}">{user}</a></td>\
      </tr>';
      return tr.replace("{i}", i)
        .replace("{time}", time)
        .replace("{type}", type ? "硬币" : "积分")
        .replace("{url}", url)
        .replace("{user}", user);
    }
  },
  chart_view: function(fv){//取fv分钟为一组数据
    if(!fv) fv = 10;
    var chart_data = {
      labels: [],
      data: []
    };
    var index = 0;
    var start = stosteamp(this.datas[this.datas.length-1].time);
    start = start - start % 60;
    var end = ~~(new Date().getTime()/60/1000);
    for(var tt = start, i= this.datas.length - 1; tt < end && i >= 0;){
      var t = stosteamp(this.datas[i].time);
      if(t - tt <= fv){
        chart_data.data[index] = chart_data.data[index] ? chart_data.data[index]+1 : 1;
        i--;
      }
      else{
        chart_data.labels[index] = steamptos(tt) + "-" + steamptos(tt + fv).replace(/.*\s/, '');
        chart_data.data[index] = chart_data.data[index] ? chart_data.data[index] : 0;
        tt+=fv;
        index++;
      }
    }
    // var chart_html = '<canvas id="canvas" height="450" width="600"></canvas>'
    // document.body.innerHTML = chart_html;
    (function runpeity(fv){
      // if(Chart){
      //   var ctx = document.getElementById("canvas").getContext("2d");
      //   var lineChartData = {
      //     labels : chart_data.labels,
      //     datasets : [
      //     {
      //       label: "折线图",
      //       fillColor : "rgba(151,187,205,0.2)",
      //       strokeColor : "rgba(151,187,205,1)",
      //       pointColor : "rgba(151,187,205,1)",
      //       pointStrokeColor : "#fff",
      //       pointHighlightFill : "#fff",
      //       pointHighlightStroke : "rgba(151,187,205,1)",
      //       data : chart_data.data
      //     }
      //     ]
      //   }
      //   window.myLine = new Chart(ctx).Line(lineChartData, {
      //     responsive: true
      //   });
      // }
      if(echarts){
        var view = document.getElementById("view");
        if($(".change_fv").length) $(".change_fv").remove();
        $(view).html(
          '<div class="input-group change_fv" style="width:300px;">\
            <input type="text" class="form-control fv" value="'+ fv +'">\
            <span class="input-group-addon">分钟统计一组数据</span>\
            <span class="input-group-btn">\
              <button id="change_fv_btn"  class="btn btn-default" type="button">点击更新视图</button>\
            </span>\
          </div>\
          <div id="chart_view"></div>'
          );
        $("#change_fv_btn").click(function(){
          var fv = ~~$(".fv").val();
          b_coin_chart.chart_view(fv);
        });
        view = document.getElementById("chart_view");
        view.style.height = "700px";
        view.style.width = chart_data.data.length*20 + "px";
        var myChart = echarts.init(view);
        var option = {
          title : {
              text: '评分历史',
              subtext: 'av' + window.aid + " " + '每' + fv + "分钟统计一组数据"
          },
          tooltip : {
              trigger: 'axis'
          },
          legend: {
              data:['硬币']
          },
          toolbox: {
              show : true,
              feature : {
                  mark : {show: true},
                  dataView : {show: true, readOnly: false},
                  magicType : {show: true, type: ['line', 'bar']},
                  restore : {show: true},
                  saveAsImage : {show: true}
              }
          },
          calculable : true,
          xAxis : [
              {
                  type : 'category',
                  boundaryGap : false,
                  data : chart_data.labels
              }
          ],
          yAxis : [
              {
                  type : 'value',
                  axisLabel : {
                      formatter: '{value} 个'
                  }
              }
          ],
          series : [
              {
                  name:'该时间段累积投币数量',
                  type:'line',
                  smooth:true,
                  itemStyle: {normal: {areaStyle: {type: 'default'}}},
                  data:chart_data.data,
                  markPoint : {
                      data : [
                          {type : 'max', name: '最大值'},
                          {type : 'min', name: '最小值'}
                      ]
                  },
                  markLine : {
                      data : [
                          {type : 'average', name: '平均值'}
                      ]
                  }
              }
          ]
        };
        myChart.setOption(option);
      }
      else
        setTimeout(function(){
          runpeity();
        },1000);
    })(fv);
    
    function stosteamp(str){
      var mts = str.match(/(\d+)-(\d+)-(\d+) (\d+):(\d+)/);
      if(mts){
        var date = new Date();
        date.setYear(~~mts[1]);
        date.setMonth(~~mts[2] - 1);
        date.setDate(~~mts[3]);
        date.setHours(~~mts[4]);
        date.setMinutes(~~mts[5]);
        return ~~(date.getTime()/60/1000);
      }
      mts = str.match(/(\d+)小时/);
      if(mts){
        var date = new Date();
        date.setHours(new Date().getHours() - ~~mts[1]);
        return ~~(date.getTime()/60/1000);
      }
      mts = str.match(/(\d+)分钟/);
      if(mts){
        var date = new Date();
        date.setMinutes(new Date().getMinutes() - ~~mts[1]);
        return ~~(date.getTime()/60/1000);
      }
    }
    //上述函数的反向操作
    function steamptos(sp){
      var date = new Date(sp * 60 * 1000);
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var hour = date.getHours();
      var min = date.getMinutes();
      return year + '-' + month + '-' + day + ' ' + prefixInteger(hour,2) + ':' + prefixInteger(min,2); 
    }
  }
};

b_coin_chart.show = b_coin_chart.chart_view;
b_coin_chart.init();

function loadcssfile(filename){
  var fileref = document.createElement('link');
  fileref.setAttribute("rel","stylesheet");
  fileref.setAttribute("type","text/css");
  fileref.setAttribute("href",filename);
  document.head.appendChild(fileref);
}
function loadjsfile(filename){
  var fileref = document.createElement('script');
  fileref.setAttribute("src",filename);
  document.head.appendChild(fileref);
}
function prefixInteger(num, length) {
  num = '' + num;
  return Array(length + 1 - num.length).join('0') + num;
}
