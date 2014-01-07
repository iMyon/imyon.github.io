var WCC = {

	data: {
		talktime: 0,
		talkself: 60, //&#x8BBE;&#x7F6E;&#x81EA;&#x8A00;&#x81EA;&#x8BED;&#x9891;&#x7387;&#xFF08;&#x5355;&#x4F4D;&#xFF1A;&#x79D2;&#xFF09;
		talkobj: {},
		tsi: 0,

		timenum: 0,
		tol: 0,
		//10&#x5206;&#x949F;&#x540E;&#x9875;&#x9762;&#x6CA1;&#x6709;&#x54CD;&#x5E94;&#x5C31;&#x505C;&#x6B62;&#x6D3B;&#x52A8;
		goal: 10 * 60,
		_typei: 0,

		//&#x6625;&#x83DC;&#x7684;&#x8BDD;&#x8BED;
		weichuncai_text: '',

		_site_path: "", //&#x57FA;&#x7840;&#x8DEF;&#x5F84;
		_weichuncai_path: "data.json", //&#x8BF7;&#x6C42;&#x7684;&#x6570;&#x636E;&#x6587;&#x4EF6;&#x5730;&#x5740;
		imagewidth: '120', //&#x4F2A;&#x6625;&#x83DC;&#x7684;&#x5927;&#x5C0F;
		imageheight: '240', //&#x4F2A;&#x6625;&#x83DC;&#x7684;&#x5927;&#x5C0F;

		ghost: "default",
		this_ghost: {},

		talkself_arr: [
			//&#x8BDD;&#x8BED;&#xFF0C;&#x8138;&#x90E8;&#x7684;&#x8868;&#x60C5;
			["&#x767D;&#x65E5;&#x4F9D;&#x5C71;&#x5C3D;&#xFF0C;&#x9EC4;&#x6CB3;&#x5165;&#x6D77;&#x6D41;&#xFF0C;&#x6B32;&#x7A77;&#x5343;&#x91CC;&#x76EE;&#xFF0C;&#x66F4;&#x4E0A;.....&#x4E00;&#x5C42;&#x697C;&#xFF1F;", "1"],
			["&#x6211;&#x770B;&#x89C1;&#x4E3B;&#x4EBA;&#x718A;&#x732B;&#x773C;&#x53C8;&#x52A0;&#x91CD;&#x4E86;&#xFF01;", "3"],
			["&#x6211;&#x662F;&#x4E0D;&#x662F;&#x5F88;&#x5389;&#x5BB3;&#x5440;&#xFF5E;&#xFF5E;&#xFF1F;", "2"],
			["5555...&#x6628;&#x5929;&#x6709;&#x4E2A;&#x5C0F;&#x5B69;&#x5B50;&#x8DDF;&#x6211;&#x62A2;&#x68D2;&#x68D2;&#x7CD6;&#x5403;.....", "3"],
			["&#x6628;&#x5929;&#x6211;&#x597D;&#x50CF;&#x770B;&#x89C1;&#x4E3B;&#x4EBA;&#x53C8;&#x5728;&#x4F17;&#x4EBA;&#x4E4B;&#x524D;&#x5356;&#x840C;&#x4E86;&#x54E6;&#xFF5E;", "2"]
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
				WCC.chuncaiSay("&#x89D2;&#x8272;" + WCC.data.ghost + "&#x521D;&#x59CB;&#x5316;&#x5931;&#x8D25;&#xFF01;&#x8BF7;&#x8054;&#x7CFB;&#x7BA1;&#x7406;&#x5458;");
				return false;
			}
		}).fail(function(jqxhr, settings, exception) {
			WCC.chuncaiSay("&#x52A0;&#x8F7D;&#x89D2;&#x8272;" + WCC.data.ghost + "&#x5931;&#x8D25;&#xFF01;&#x8BF7;&#x8054;&#x7CFB;&#x7BA1;&#x7406;&#x5458;");
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
		//WCC.chuncaiSay("&#x554A;&#xFF0C;&#x91CE;&#x751F;&#x7684;&#x4E3B;&#x4EBA;&#x51FA;&#x73B0;&#x4E86;&#xFF01; &#xFF5E;&#xFF5E;&#xFF5E;O&#x53E3;O");
		// });
		this.talkSelf(this.data.talktime);

		$(".wcc.smchuncai").mouseover(function() {
			if (talkobj) {
				clearTimeout(talkobj);
			}
			WCC.data.talktime = 0;
			WCC.talkSelf(WCC.data.talktime);
		});

		//&#x5224;&#x65AD;&#x6625;&#x83DC;&#x662F;&#x5426;&#x5904;&#x4E8E;&#x9690;&#x85CF;&#x72B6;&#x6001;
		var is_closechuncai = this.tools.getCookie("is_closechuncai");
		if (is_closechuncai == 'close') {
			this.closechuncai_init();
		}
		//&#x8BBE;&#x7F6E;&#x521D;&#x59CB;&#x72B6;&#x6001;
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
		// '				<ul class="wcc_mlist" id="shownotice">&#x663E;&#x793A;&#x516C;&#x544A;</ul>'+
		// '				<ul class="wcc_mlist" id="chatTochuncai">&#x804A;&nbsp;&nbsp;&nbsp;&nbsp;&#x5929;</ul>'+
		// '				<ul class="wcc_mlist" id="foods">&#x5403; &#x96F6; &#x98DF;</ul>'+
		// '				<ul class="wcc_mlist" id="blogmanage">&#x89C1;&#x6211;&#x5BB6;&#x957F;</ul>'+
		// '				<ul class="wcc_mlist" id="lifetimechuncai">&#x751F;&#x5B58;&#x65F6;&#x95F4;</ul>'+
		wcc_html += '				<ul class="wcc_mlist closechuncai">&#x5173;&#x95ED;&#x6625;&#x83DC;</ul>';
		wcc_html += '			</div>';
		wcc_html += '			<div>';
		wcc_html += '				<ul class="chuncaisaying"></ul>';
		wcc_html += '			</div>';
		wcc_html += '			<div class="getmenu"></div>';
		wcc_html += '		</div>';
		wcc_html += '		<div class="chat_bottom"></div>';
		wcc_html += '	</div>';

		wcc_html += '</div>';
		wcc_html += '<div class="wcc callchuncai">&#x53EC;&#x5524;&#x6625;&#x83DC;</div>';

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
					var h = 200; //w,h&#x4E3A;&#x6D6E;&#x5C42;&#x5BBD;&#x9AD8;
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

	// &#x521D;&#x59CB;&#x5316;&#x8868;&#x60C5;
	createFace: function(face) {
		var html = '<div class="hiddenfaces">';
		for (var i in face) {
			html += '<img class="hf' + i + '" src="' + WCC.data._site_path + "ghost/" + WCC.data.ghost + "/" + face[i] + '" />';
		}
		html += '</div>';

		$("head").append(html);
		this.setFace(1);
	},

	// &#x8BBE;&#x7F6E;&#x8868;&#x60C5;
	setFace: function(num) {
		obj = $('.hiddenfaces img.hf' + num).attr('src');
		$(".wcc .chuncaiface").attr("style", "background:url(" + obj + ") no-repeat scroll 50% 0% transparent; width:" + this.data.imagewidth + "px;height:" + this.data.imageheight + "px;");
	},

	//&#x5F39;&#x51FA;&#x6625;&#x83DC;&#x7684;&#x83DC;&#x5355;
	chuncaiMenu: function() {
		this.clearChuncaiSay();

		if (this.data.this_ghost.closeInput) {
			if($(".talk").is(':focus')===false)
				this.data.this_ghost.closeInput();
		}

		this.chuncaiSay("&#x51C6;&#x5907;&#x505A;&#x4EC0;&#x4E48;&#x5462;&#xFF1F;");
		$(".wcc .showchuncaimenu").css("display", "block");
		$(".wcc .getmenu").css("display", "none");
		$(".wcc .chuncaisaying").css("display", "none");
	},

	//&#x5173;&#x95ED;&#x6625;&#x83DC;&#x7684;&#x83DC;&#x5355;
	closeChuncaiMenu: function() {
		this.clearChuncaiSay();
		$(".wcc .showchuncaimenu").css("display", "none");
		//$("#chuncaisaying").css("display", "block");
		this.showNotice();
		$(".wcc .getmenu").css("display", "block");
	},

	//&#x663E;&#x793A;&#x63D0;&#x793A;&#x4FE1;&#x606F;
	showNotice: function() {
		$(".wcc .chuncaisaying").css("display", "block");
	},

	// &#x5173;&#x95ED;&#x63D0;&#x793A;&#x4FE1;&#x606F;
	closeNotice: function() {
		$(".wcc .chuncaisaying").css("display", "none");
	},

	//&#x6625;&#x83DC;&#x8BF4;&#x8BDD;
	chuncaiSay: function(s) {
		this.clearChuncaiSay();
		$(".wcc .tempsaying").append(s);
		$(".wcc .tempsaying").css("display", "block");
		this.data.weichuncai_text = s;
		this.typeWords();
	},

	//&#x6E05;&#x7A7A;&#x6625;&#x83DC;&#x8BF4;&#x7684;&#x8BDD;
	clearChuncaiSay: function() {
		$(".wcc .tempsaying").html('');
	},

	//&#x81EA;&#x8A00;&#x81EA;&#x8BED;
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

	//&#x505C;&#x6B62;&#x81EA;&#x8A00;&#x81EA;&#x8BED;
	stopTalkSelf: function() {
		if (talkobj) {
			clearTimeout(talkobj);
		}
	},

	//&#x5173;&#x95ED;&#x6625;&#x83DC;
	closechuncai: function() {
		this.stopTalkSelf();
		this.chuncaiSay("&#x8BB0;&#x5F97;&#x518D;&#x53EB;&#x6211;&#x51FA;&#x6765;&#x54E6;...");
		$(".wcc .showchuncaimenu").css("display", "none");
		setTimeout(function() {
			$(".wcc.smchuncai").fadeOut(1200);
			$(".callchuncai").css("display", "block");
		}, 2000);
		//&#x4FDD;&#x5B58;&#x5173;&#x95ED;&#x72B6;&#x6001;&#x7684;&#x6625;&#x83DC;
		this.tools.setCookie("is_closechuncai", 'close', 60 * 60 * 24 * 30 * 1000);
	},

	//&#x5173;&#x95ED;&#x6625;&#x83DC;&#xFF0C;&#x4E0D;&#x9884;&#x8BA2;
	closechuncai_init: function() {
		this.stopTalkSelf();
		$(".wcc .showchuncaimenu").css("display", "none");
		setTimeout(function() {
			$(".wcc.smchuncai").css("display", "none");
			$(".callchuncai").css("display", "block");
		}, 30);
	},

	//&#x5F00;&#x542F;&#x6625;&#x83DC;
	callchuncai: function() {
		this.talkSelf(this.data.talktime);
		$(".wcc.smchuncai").fadeIn('normal');
		$(".callchuncai").css("display", "none");
		this.closeChuncaiMenu();
		this.closeNotice();
		this.chuncaiSay("&#x6211;&#x56DE;&#x6765;&#x5566;&#xFF5E;");
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

	// 		this.chuncaiSay("&#x4E3B;&#x4EBA;&#x8DD1;&#x5230;&#x54EA;&#x91CC;&#x53BB;&#x4E86;&#x5462;....");
	// 		this.setFace(3);
	// 		this.stoptime();
	// 	}
	// },

	// stoptime: function() {
	// 	if (this.data.timenum) {
	// 		clearTimeout(this.data.timenum);
	// 	}
	// },

	//&#x6E10;&#x8FDB;&#x7684;&#x65B9;&#x5F0F;&#x663E;&#x793A;&#x5185;&#x5BB9;
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
		//&#x968F;&#x673A;&#x6392;&#x5217;&#x81EA;&#x8A00;&#x81EA;&#x8BED;&#x5185;&#x5BB9;
		arrayShuffle: function(arr) {
			var result = [],
				len = arr.length;
			while (len--) {
				result[result.length] = arr.splice(Math.floor(Math.random() * (len + 1)), 1);
			}
			return result;
		},

		//&#x5F97;&#x5230;&#x4E8B;&#x4EF6;
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
			var date3 = date2.getTime() - date1.getTime(); //&#x65F6;&#x95F4;&#x5DEE;&#x7684;&#x6BEB;&#x79D2;&#x6570;
			//&#x8BA1;&#x7B97;&#x51FA;&#x76F8;&#x5DEE;&#x5929;&#x6570;
			var days = Math.floor(date3 / (24 * 3600 * 1000));
			//&#x6CE8;:Math.floor(float) &#x8FD9;&#x4E2A;&#x65B9;&#x6CD5;&#x7684;&#x7528;&#x6CD5;&#x662F;: &#x4F20;&#x9012;&#x4E00;&#x4E2A;&#x5C0F;&#x6570;,&#x8FD4;&#x56DE;&#x4E00;&#x4E2A;&#x6700;&#x63A5;&#x8FD1;&#x5F53;&#x524D;&#x5C0F;&#x6570;&#x7684;&#x6574;&#x6570;,

			//&#x8BA1;&#x7B97;&#x51FA;&#x5C0F;&#x65F6;&#x6570;
			var leave1 = date3 % (24 * 3600 * 1000); //&#x8BA1;&#x7B97;&#x5929;&#x6570;&#x540E;&#x5269;&#x4F59;&#x7684;&#x6BEB;&#x79D2;&#x6570;
			var hours = Math.floor(leave1 / (3600 * 1000));
			//&#x8BA1;&#x7B97;&#x76F8;&#x5DEE;&#x5206;&#x949F;&#x6570;
			var leave2 = leave1 % (3600 * 1000); //&#x8BA1;&#x7B97;&#x5C0F;&#x65F6;&#x6570;&#x540E;&#x5269;&#x4F59;&#x7684;&#x6BEB;&#x79D2;&#x6570;
			var minutes = Math.floor(leave2 / (60 * 1000));

			//&#x8BA1;&#x7B97;&#x76F8;&#x5DEE;&#x79D2;&#x6570;
			var leave3 = leave2 % (60 * 1000); //&#x8BA1;&#x7B97;&#x5206;&#x949F;&#x6570;&#x540E;&#x5269;&#x4F59;&#x7684;&#x6BEB;&#x79D2;&#x6570;
			var seconds = Math.round(leave3 / 1000);

			var str = '';
			if (days > 0) str += ' <font color="red">' + days + "</font> &#x5929;";
			if (hours > 0) str += ' <font color="red">' + hours + "</font> &#x5C0F;&#x65F6;";
			if (minutes > 0) str += ' <font color="red">' + minutes + "</font> &#x5206;&#x949F;";
			if (seconds > 0) str += ' <font color="red">' + seconds + "</font> &#x5206;&#x949F;";
			return str;
		},

		//&#x5408;&#x5E76;&#x4E24;&#x4E2A;&#x5BF9;&#x8C61;
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
