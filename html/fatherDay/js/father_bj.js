	var browser = {
		versions: function() {
			var u = navigator.userAgent, app = navigator.appVersion;
			return {//移动终端浏览器版本信息 
				trident: u.indexOf('Trident') > -1, //IE内核
				presto: u.indexOf('Presto') > -1, //opera内核
				webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
				gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
				mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
				ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
				android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
				iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
				iPad: u.indexOf('iPad') > -1, //是否iPad
				webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
			};
		}(),
		language: (navigator.browserLanguage || navigator.language).toLowerCase()
	}
   
	if (browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) {
		//document.getElementById("alink").setAttribute("href","https://itunes.apple.com/cn/app/fa-xian-zhou-mo-mei-yi-ge/id972982647?l=en&mt=8s"); 
	}else if (browser.versions.android) {
  		//document.getElementById("alink").setAttribute("href","http://img.fxzhoumo.com/fxzhoumo_t3.apk"); 
	}

	function connectWebViewJavascriptBridge(callback) {
		if (window.WebViewJavascriptBridge) {
			callback(WebViewJavascriptBridge)
		} else {
			document.addEventListener('WebViewJavascriptBridgeReady', function() {
				callback(WebViewJavascriptBridge)
			}, false)
		}
	}
	
	function is_weixin() {
        var ua = navigator.userAgent.toLowerCase();
          if (ua.match(/MicroMessenger/i) == "micromessenger") {
            return true;
           } else {
            return false;
           }
    }

    var isWeixin = is_weixin();
$(function(){
	var str1="fqjlqbj1";
	var str2="fqjlqbj2";
	var str3="fqjlqbj3"
	var voucher1;
	var curr=new Date();
	var date=curr.getDate();
	var hours = curr.getHours();
	var minutes=curr.getMinutes();
	console.log(minutes);

	if(date==15||date==14){
		str1="fqjlqbj1";
		// str1="22222"
		voucher1=835;
		// voucher1=290;

	}
	if(date==16){
		str1=str2;
		voucher1=836;
		str1.replace(/fqjlqbj1/g,str2);
	}
	if(date==17){
		str1=str3;
		voucher1=837;
		str1.replace(/fqjlqbj2/g,str3);
	}

	
	if(hours>=11&&hours<24){
		$('.button').val("立即领取");
	}else if(hours>0&&hours<11){
		$('.button').val('即将开始');
		$('.phone').css('border','2px solid #bfbfbf');
		$('.button').attr('disabled','disabled');
		$('.button').css('background','transparent');
		$('.button').css('color','#666');
		$('.button').css('border','2px solid #bfbfbf');
	}

	
	$.ajax({
		url:'/IUserCenterV2Servlet?method=findVouch',
		type:'post',
		data:'servicestr={"voucherId":'+voucher1+'}',
		success:function(data){
			var json=eval("("+data+")");
			if(json.code=="success"){
				if(json.c_count<=0){
					$('.button').val("已抢光");
					$('.phone').css('border','2px solid #bfbfbf');
					$('.button').attr('disabled','disabled');
					$('.button').css('border','2px solid #bfbfbf');
					$('.button').css('background','transparent');
					$('.button').css('color','#666');
				}
			}
		}
	})
	
	if(isWeixin){
		$('.fuchuang').show();
		$('.phone').show();
		$('.inside').hide();
		$('.button').bind('click',function(){
			var phone=$('.phone').val();
			var tel_RegExp = /^1[3|4|5|7|8]\d{9}$/;
			if(!(tel_RegExp.test(phone))){
				alert("请正确填写手机号");
				return;
			}
			$.ajax({
				url:"/IUserCenterV2Servlet?method=addUserVoucherByMobileVoucherCardNo",
				type:"post",
				data:'servicestr={"user_mobile":"'+phone+'","codenumstr":"'+str1+'"}',
				success:function(data){
					var obj=eval("("+data+")");
					if(obj.code=="success"){
						$('.mask').show();
						$('.outside').show();
						$('.inside').hide();
						$('.register').show();
					}else{
						alert(obj.description);
					}
				}
			})
		})
	}else{
		$('.fuchuang').hide();
		//APP内登录没登录
		$.ajax({
			url:'/IUserCenterV2Servlet?method=toUserCenter',
			type:'get',
			success:function(data){
				var json=eval("("+data+")");
				if(json.code=="success"){
					//已登录状态
					$('.phone').hide();
					$('.button').bind('click',function(){
						$.ajax({
							url:'/IUserCenterV2Servlet?method=voucheConvert',
							type:'post',
							data:'servicestr={"codenum":"'+str1+'"}',
							success:function(data){
								var jsonData=eval("("+data+")");
								if(jsonData.code=="success"){
									$('.mask').show();
									$('.inside').show();
									$('.outside').hide();
									$('.register').hide();
								}else{
									alert(jsonData.description);
								}
							}
						})
					})
				}else{
					//未登录状态
					// alert('未登录状态');
	 				$('.inside').hide();
	 				$('.button').bind('click',function(){
	 					var phone=$('.phone').val();
		 				var tel_RegExp = /^1[3|4|5|7|8]\d{9}$/;
						if(!(tel_RegExp.test(phone))){
							alert("请正确填写手机号");
							return;
						}
	 					$.ajax({
	 						url:"/IUserCenterV2Servlet?method=addUserVoucherByMobileVoucherCardNo",
							type:"post",
							data:'servicestr={"user_mobile":"'+phone+'","codenumstr":"'+str1+'"}',
							success:function(data){
								var obj=eval("("+data+")");
								if(obj.code=="success"){
									$('.mask').show();
									$('.inside').show();
									$('.outside').hide();
									$('.register').hide();
								}else{
									alert(obj.description);
								}
							}
	 					})
	 				})
				}
			}
		})

	}
	//在任何情况下都执行
	$('.close').bind('click',function(){
		$('.mask').hide();
	})

	
	var courseIdLeft=[5380,5703,6472,6202];
    var courseIdRight = [4264,6287,5251,6513]; 
	 
	var leftList=$('.left');
	var rightList=$('.right');
	for(var i=0;i<4;i++){
		$(leftList[i]).attr('href','http://www.fxzhoumo.com/detail/course.html?courseid='+courseIdLeft[i]);
	}
	for(var i=0;i<4;i++){
		$(rightList[i]).attr('href','http://www.fxzhoumo.com/detail/course.html?courseid='+courseIdRight[i]);
	}
	
	if(is_weixin()){//微信浏览器
		
	}else{
		if(browser.versions.ios || browser.versions.iPhone || browser.versions.iPad){
				connectWebViewJavascriptBridge(function(bridge) {
				var uniqueId = 1;	
					$('.left').bind("click",function(e){
						var t_id = $(this).attr('id');
						var count = t_id.substr(4,1);
						var data = '{"activityID":'+courseIdLeft[count]+',"activityTitle":"学习一下"}'									
						bridge.send(data, function(responseData) {										
						})
						e.preventDefault(); 
					})

					$('.right').bind("click",function(e){
						var t_id = $(this).attr('id');
						var count = t_id.substr(5,1);
						var data = '{"activityID":'+courseIdRight[count]+',"activityTitle":"学习一下"}'									
						bridge.send(data, function(responseData) {										
						})
						e.preventDefault(); 
					})
			})
		}else if(browser.versions.android){
				
				$('.left').bind("click",function(e){
					// var t_id = $(e.target).attr('id');
					var t_id=$(this).attr('id');
					var count = t_id.substr(4,1);
					window.FXZMAndroidJavaScript.jumpToDetailActivity(courseIdLeft[count]);  //安卓
					e.preventDefault(); 
				})

				$('.right').bind("click",function(e){
					// var t_id = $(e.target).attr('id');
					var t_id=$(this).attr('id');
					var count = t_id.substr(5,1);
					window.FXZMAndroidJavaScript.jumpToDetailActivity(courseIdRight[count]);  //安卓
					e.preventDefault(); 
				})

		}
	}				

})