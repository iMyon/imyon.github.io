var WCC = {

	data: {
		talktime: 0,
		talkself: 60, //璁剧疆鑷█鑷棰戠巼锛堝崟浣嶏細绉掞級
		talkobj: {},
		tsi: 0,

		timenum: 0,
		tol: 0,
		//10鍒嗛挓鍚庨〉闈㈡病鏈夊搷搴斿氨鍋滄娲诲姩
		goal: 10 * 60,
		_typei: 0,

		//春菜的话语
		weichuncai_text: '',

		_site_path: "", //鍩虹璺緞
		_weichuncai_path: "data.json", //请求的数据文件地址
		imagewidth: '120', //浼槬鑿滅殑澶у皬
		imageheight: '240', //浼槬鑿滅殑澶у皬

		ghost: "default",
		this_ghost: {},

		talkself_arr: [
			//璇濊锛岃劯閮ㄧ殑琛ㄦ儏
			["白日依山尽，黄河入海流，欲穷千里目，更上.....一层楼？", "1"],
			["我看见主人熊猫眼又加重了！", "3"],
			["我是不是很厉害呀～～？", "2"],
			["5555...鏄ㄥぉ鏈変釜灏忓瀛愯窡鎴戞姠妫掓绯栧悆.....", "3"],
			["鏄ㄥぉ鎴戝ソ鍍忕湅瑙佷富浜哄張鍦ㄤ紬浜轰箣鍓嶅崠钀屼簡鍝︼綖", "2"]
		]
	},

	load_ghost: function() {
		$.getScript(WCC.data._site_path + "ghost/" + WCC.data.ghost + "/ghost.js").done(function() {
			if (ghost && ghost.action) {
				ghost.init(WCC);
				WCC.data.this_ghost = ghost;
				WCC.build();
				return true;
			} else {
				WCC.chuncaiSay("瑙掕壊" + WCC.data.ghost + "鍒濆鍖栧け璐ワ紒璇疯仈绯荤鐞嗗憳");
				return false;
			}
		}).fail(function(jqxhr, settings, exception) {
			WCC.chuncaiSay("加载角色" + WCC.data.ghost + "失败！请联系管理员");
			return false;
		});
	},

	build: function() {
		var wcc_html = "";
		for (var i = this.data.this_ghost.action.length - 1; i >= 0; i--) {
			wcc_html += '<ul class="wcc_mlist ghost_envent" id="' + this.data.this_ghost.action[i][0] + '">' + this.data.this_ghost.action[i][1] + '</ul>';
		}
		$(".wcc .showchuncaimenu").prepend(wcc_html);

		$(".wcc .getmenu").click(function() {
			WCC.chuncaiMenu();
			WCC.setFace(1);
		});
		$(".wcc .closechuncai").click(function() {
			WCC.setFace(3);
			WCC.closechuncai();
		});
		$(".wcc.callchuncai").click(function() {
			WCC.setFace(2);
			WCC.callchuncai();
			WCC.tools.setCookie("is_closechuncai", '', 60 * 60 * 24 * 30 * 1000);
		});

		$('.wcc .ghost_envent').click(function() {
			var event = this.id;
			if (WCC.data.this_ghost[event]) {
				WCC.data.this_ghost[event]();
				return;
			}

			if (WCC[event]) {
				WCC[event]();
				return;
			}
		});

		// $(".wcc .chuncaiface").mousemove(function() {
		//WCC.stoptime();
		//WCC.data.tol = 0;
		//WCC.setTime();
		//WCC.chuncaiSay("啊，野生的主人出现了！ ～～～O口O");
		// });
		this.talkSelf(this.data.talktime);

		$(".wcc.smchuncai").mouseover(function() {
			if (talkobj) {
				clearTimeout(talkobj);
			}
			WCC.data.talktime = 0;
			WCC.talkSelf(WCC.data.talktime);
		});

		//判断春菜是否处于隐藏状态
		var is_closechuncai = this.tools.getCookie("is_closechuncai");
		if (is_closechuncai == 'close') {
			this.closechuncai_init();
		}
		//设置初始状态
		if (this.data.this_ghost.shownotice) {
			this.data.this_ghost.shownotice();
		}
		this.setFace(1);
	},

	init: function(data) {
		this.data = this.tools.composition(this.data, data);
		if (this.data.talkself_user) {
			this.data.talkself_arr = this.data.talkself_arr.concat(this.data.talkself_user);
			delete this.data.talkself_user;
		}

		var wcc_html = '';
		wcc_html += '<div class="wcc smchuncai" onfocus="this.blur();" style="color:#626262;z-index:999;">';
		wcc_html += '	<div class="chuncaiface"></div>';
		wcc_html += '	<div class="dialog_chat">';
		wcc_html += '		<div class="chat_top"></div>';
		wcc_html += '		<div class="dialog_chat_contents">';
		wcc_html += '			<div class="dialog_chat_loading"></div>';
		wcc_html += '			<div class="tempsaying"></div>';
		wcc_html += '			<div class="showchuncaimenu">';
		// '				<ul class="wcc_mlist" id="shownotice">鏄剧ず鍏憡</ul>'+
		// '				<ul class="wcc_mlist" id="chatTochuncai">聊&nbsp;&nbsp;&nbsp;&nbsp;天</ul>'+
		// '				<ul class="wcc_mlist" id="foods">吃 零 食</ul>'+
		// '				<ul class="wcc_mlist" id="blogmanage">瑙佹垜瀹堕暱</ul>'+
		// '				<ul class="wcc_mlist" id="lifetimechuncai">鐢熷瓨鏃堕棿</ul>'+
		wcc_html += '				<ul class="wcc_mlist closechuncai">鍏抽棴鏄ヨ彍</ul>';
		wcc_html += '			</div>';
		wcc_html += '			<div>';
		wcc_html += '				<ul class="chuncaisaying"></ul>';
		wcc_html += '			</div>';
		wcc_html += '			<div class="getmenu"></div>';
		wcc_html += '		</div>';
		wcc_html += '		<div class="chat_bottom"></div>';
		wcc_html += '	</div>';

		wcc_html += '</div>';
		wcc_html += '<div class="wcc callchuncai">鍙敜鏄ヨ彍</div>';

		$("body").append(wcc_html);

		var getwidth = this.tools.getCookie("historywidth");
		var getheight = this.tools.getCookie("historyheight");
		var width = document.documentElement.clientWidth - this.data.imagewidth;
		var height = document.documentElement.clientHeight - this.data.imageheight;
		if (getwidth !== null && getheight !== null) {
			width = getwidth;
			height = getheight;
		}

		var cwidth = document.documentElement.clientWidth - 100;
		var cheight = document.documentElement.clientHeight - 20;
		var moveX = 0;
		var moveY = 0;
		var moveTop = 0;
		var moveLeft = 0;
		var moveable = false;
		var docMouseMoveEvent = document.onmousemove;
		var docMouseUpEvent = document.onmouseup;

		$(".wcc.callchuncai").attr("style", "top:" + cheight + "px; left:" + cwidth + "px; text-align:center;");
		$(".wcc.smchuncai").css('left', width + 'px')
			.css('top', height + 'px')
			.css('width', this.data.imagewidth + 'px')
			.css('height', this.data.imageheight + 'px')
			.ready(function() {
			WCC.load_ghost();
		}).mousedown(function() {
			var ent = WCC.tools.getEvent();
			moveable = true;
			moveX = ent.clientX;
			moveY = ent.clientY;
			obj = $(".wcc.smchuncai");

			moveTop = parseInt(obj.css('top'));
			moveLeft = parseInt(obj.css('left'));
			if (isFirefox = navigator.userAgent.indexOf("Firefox") > 0) {
				window.getSelection().removeAllRanges();
			}
			document.onmousemove = function() {
				if (moveable) {
					var ent = WCC.tools.getEvent();
					var x = moveLeft + ent.clientX - moveX;
					var y = moveTop + ent.clientY - moveY;
					var w = 200;
					var h = 200; //w,h为浮层宽高
					obj.css('left', x + "px").css('top', y + "px");
				}
			};
			document.onmouseup = function() {
				if (moveable) {
					var historywidth = obj.css('left');
					var historyheight = obj.css('top');
					historywidth = historywidth.replace('px', '');
					historyheight = historyheight.replace('px', '');
					WCC.tools.setCookie("historywidth", historywidth, 60 * 60 * 24 * 30 * 1000);
					WCC.tools.setCookie("historyheight", historyheight, 60 * 60 * 24 * 30 * 1000);
					document.onmousemove = docMouseMoveEvent;
					document.onmouseup = docMouseUpEvent;
					moveable = false;
					moveX = 0;
					moveY = 0;
					moveTop = 0;
					moveLeft = 0;
				}
			}
		});
	},

	// 初始化表情
	createFace: function(face) {
		var html = '<div class="hiddenfaces">';
		for (var i in face) {
			html += '<img class="hf' + i + '" src="' + WCC.data._site_path + "ghost/" + WCC.data.ghost + "/" + face[i] + '" />';
		}
		html += '</div>';

		$("head").append(html);
		this.setFace(1);
	},

	// 璁剧疆琛ㄦ儏
	setFace: function(num) {
		obj = $('.hiddenfaces img.hf' + num).attr('src');
		$(".wcc .chuncaiface").attr("style", "background:url(" + obj + ") no-repeat scroll 50% 0% transparent; width:" + this.data.imagewidth + "px;height:" + this.data.imageheight + "px;");
	},

	//弹出春菜的菜单
	chuncaiMenu: function() {
		this.clearChuncaiSay();

		if (this.data.this_ghost.closeInput) {
			if($(".talk").is(':focus')===false)
				this.data.this_ghost.closeInput();
		}

		this.chuncaiSay("准备做什么呢？");
		$(".wcc .showchuncaimenu").css("display", "block");
		$(".wcc .getmenu").css("display", "none");
		$(".wcc .chuncaisaying").css("display", "none");
	},

	//关闭春菜的菜单
	closeChuncaiMenu: function() {
		this.clearChuncaiSay();
		$(".wcc .showchuncaimenu").css("display", "none");
		//$("#chuncaisaying").css("display", "block");
		this.showNotice();
		$(".wcc .getmenu").css("display", "block");
	},

	//鏄剧ず鎻愮ず淇℃伅
	showNotice: function() {
		$(".wcc .chuncaisaying").css("display", "block");
	},

	// 鍏抽棴鎻愮ず淇℃伅
	closeNotice: function() {
		$(".wcc .chuncaisaying").css("display", "none");
	},

	//鏄ヨ彍璇磋瘽
	chuncaiSay: function(s) {
		this.clearChuncaiSay();
		$(".wcc .tempsaying").append(s);
		$(".wcc .tempsaying").css("display", "block");
		this.data.weichuncai_text = s;
		this.typeWords();
	},

	//清空春菜说的话
	clearChuncaiSay: function() {
		$(".wcc .tempsaying").html('');
	},

	//鑷█鑷
	talkSelf: function(talktime) {
		this.data.talktime++;
		var tslen = this.data.talkself_arr.length;
		var yushu = this.data.talktime % this.data.talkself;
		if (parseInt(yushu) == parseInt(9)) {
			this.closeChuncaiMenu();
			this.closeNotice();

			if (this.data.this_ghost['closeInput']) {
				if($(".talk").is(':focus')===false)
					this.data.this_ghost.closeInput();
			}

			tsi = Math.floor(Math.random() * this.data.talkself_arr.length + 1) - 1;
			this.chuncaiSay(this.data.talkself_arr[tsi][0]);
			this.setFace(this.data.talkself_arr[tsi][1]);
		}
		talkobj = window.setTimeout("WCC.talkSelf(" + this.data.talktime + ")", 1000);
	},

	//鍋滄鑷█鑷
	stopTalkSelf: function() {
		if (talkobj) {
			clearTimeout(talkobj);
		}
	},

	//鍏抽棴鏄ヨ彍
	closechuncai: function() {
		this.stopTalkSelf();
		this.chuncaiSay("璁板緱鍐嶅彨鎴戝嚭鏉ュ摝...");
		$(".wcc .showchuncaimenu").css("display", "none");
		setTimeout(function() {
			$(".wcc.smchuncai").fadeOut(1200);
			$(".callchuncai").css("display", "block");
		}, 2000);
		//保存关闭状态的春菜
		this.tools.setCookie("is_closechuncai", 'close', 60 * 60 * 24 * 30 * 1000);
	},

	//鍏抽棴鏄ヨ彍锛屼笉棰勮
	closechuncai_init: function() {
		this.stopTalkSelf();
		$(".wcc .showchuncaimenu").css("display", "none");
		setTimeout(function() {
			$(".wcc.smchuncai").css("display", "none");
			$(".callchuncai").css("display", "block");
		}, 30);
	},

	//开启春菜
	callchuncai: function() {
		this.talkSelf(this.data.talktime);
		$(".wcc.smchuncai").fadeIn('normal');
		$(".callchuncai").css("display", "none");
		this.closeChuncaiMenu();
		this.closeNotice();
		this.chuncaiSay("我回来啦～");
		this.tools.setCookie("is_closechuncai", '', 60 * 60 * 24 * 30 * 1000);
	},

	// setTime: function() {
	// 	this.data.tol++;
	// 	//document.body.innerHTML(this.data.tol);
	// 	this.data.timenum = window.setTimeout("WCC.setTime('" + this.data.tol + "')", 1000);
	// 	if (parseInt(this.data.tol) == parseInt(this.data.goal)) {
	// 		this.stopTalkSelf();
	// 		this.closeChuncaiMenu();
	// 		this.closeNotice();

	// 		if (this.data.this_ghost['closeInput']) {
	// 			this.data.this_ghost.closeInput();
	// 		}

	// 		this.chuncaiSay("主人跑到哪里去了呢....");
	// 		this.setFace(3);
	// 		this.stoptime();
	// 	}
	// },

	// stoptime: function() {
	// 	if (this.data.timenum) {
	// 		clearTimeout(this.data.timenum);
	// 	}
	// },

	//渐进的方式显示内容
	typeWords: function() {
		var p = 1;
		var str = this.data.weichuncai_text.substr(0, this.data._typei);
		var w = this.data.weichuncai_text.substr(this.data._typei, 1);
		if (w == "<") {
			str += this.data.weichuncai_text.substr(this.data._typei, this.data.weichuncai_text.substr(this.data._typei).indexOf(">") + 1);
			p = this.data.weichuncai_text.substr(this.data._typei).indexOf(">") + 1;
		}
		this.data._typei += p;
		$('.wcc .tempsaying').html(str);
		txtst = setTimeout(function(){WCC.typeWords();}, 20);
		if (this.data._typei > this.data.weichuncai_text.length) {
			clearTimeout(txtst);
			this.data._typei = 0;
		}
	},

	tools: {
		//闅忔満鎺掑垪鑷█鑷鍐呭
		arrayShuffle: function(arr) {
			var result = [],
				len = arr.length;
			while (len--) {
				result[result.length] = arr.splice(Math.floor(Math.random() * (len + 1)), 1);
			}
			return result;
		},

		//寰楀埌浜嬩欢
		getEvent: function() {
			return window.event || arguments.callee.caller.arguments[0];
		},

		in_array: function(str, arr) {
			for (var i in arr) {
				if (arr[i] == str) {
					return i;
				}
			}
			return false;
		},

		dateDiff: function(date1, date2) {
			var date3 = date2.getTime() - date1.getTime(); //时间差的毫秒数
			//计算出相差天数
			var days = Math.floor(date3 / (24 * 3600 * 1000));
			//注:Math.floor(float) 这个方法的用法是: 传递一个小数,返回一个最接近当前小数的整数,

			//璁＄畻鍑哄皬鏃舵暟
			var leave1 = date3 % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
			var hours = Math.floor(leave1 / (3600 * 1000));
			//计算相差分钟数
			var leave2 = leave1 % (3600 * 1000); //璁＄畻灏忔椂鏁板悗鍓╀綑鐨勬绉掓暟
			var minutes = Math.floor(leave2 / (60 * 1000));

			//璁＄畻鐩稿樊绉掓暟
			var leave3 = leave2 % (60 * 1000); //璁＄畻鍒嗛挓鏁板悗鍓╀綑鐨勬绉掓暟
			var seconds = Math.round(leave3 / 1000);

			var str = '';
			if (days > 0) str += ' <font color="red">' + days + "</font> 天";
			if (hours > 0) str += ' <font color="red">' + hours + "</font> 灏忔椂";
			if (minutes > 0) str += ' <font color="red">' + minutes + "</font> 鍒嗛挓";
			if (seconds > 0) str += ' <font color="red">' + seconds + "</font> 鍒嗛挓";
			return str;
		},

		//鍚堝苟涓や釜瀵硅薄
		composition: function(target, source) {
			var desc = Object.getOwnPropertyDescriptor;
			var prop = Object.getOwnPropertyNames;
			var def_prop = Object.defineProperty;

			prop(source).forEach(function(key) {
				def_prop(target, key, desc(source, key));
			});
			return target;
		},

		getCookie: function(name) {
			var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
			if (arr !== null) return unescape(arr[2]);
			return null;
		},

		setCookie: function(name, val, ex) {
			var times = new Date();
			times.setTime(times.getTime() + ex);
			if (ex === 0) {
				document.cookie = name + "=" + val + ";";
			} else {
				document.cookie = name + "=" + val + "; expires=" + times.toGMTString();
			}
		}
	}
};
