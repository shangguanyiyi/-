$(function(){
	$.ajax({
		url:"/IUserCenterV2Servlet?method=findVouch",
		type:"post",
		data:'servicestr={"voucherId":284}',  
		dataType:"html",
		success:function(data){
			var json = eval("("+data+")");
			if(json.code=="success"){
					var count = json.c_count;	
					if(count<=0){
						$("#click_get").unbind().removeClass("click_get").addClass("change_click_get").text("礼券已领取完").css("color","black")
							
						$("#tle").attr("disabled","disabled")
					}
			}else{
				alert(json.description);
			}
		}
	});
});
	
		
		
$(function(){
	$(window).on("load",function(){
		var winHeight = $(window).height();
		function is_weixin() {
			var ua = navigator.userAgent.toLowerCase();
			if (ua.match(/MicroMessenger/i) == "micromessenger") {
				return true;
			} else {
				return false;
			}
		}
		var isWeixin = is_weixin();

		$("#click_get").bind("touchstart",function(){
			//--------------------
			var tle = $('#tle').val();
			// var gifts = $('#codenum').val();
			var tel_RegExp = /^1[3|4|5|7|8]\d{9}$/;
			if(!(tel_RegExp.test(tle))){
				alert("手机号码有误，请重填！");
				return;
			}
			$.ajax({
				url:"/IUserCenterV2Servlet?method=addUserVoucherByMobileVoucherCardNo",
				type:"post",
				data:'servicestr={"user_mobile":"'+tle+'","codenumstr":"bsqrjbj"}',
				dataType:"html",
				success:function(data){
					var json = eval("("+data+")");
					if(json.code=="success"){
						$('.p2').html(tle);  //点击的时候把用户电话放入到遮罩层里面
						$('.bg').show();
						$('.bg').bind("touchmove",function(e){  
							e.preventDefault(); 
						});
						$('.mask_green').show();
						$("body,html").css({"overflow":"hidden"});
						//--------------------
						
					}else{
						alert(json.description);
					}					
				}
			});
			
		});

		if(isWeixin){
			$("#lon_in").css("display","none");
			$(".logo_cash").css("display","block");
			$(".see_more").show();
		}else{
			$("#lon_in").css("display","block");
			$(".logo_cash").css("display","none");
			$(".see_more").hide();
		}

	});
});
		


	$("#lon_in").bind("touchstart",function(){
		$(".mask_green").css("display","none");
		$(".bg2").css("display","none");
		$('.weixin-tip').css("display","block");
		$(".bg").css("display","none");
	});

	$(".weixin-tip").bind("touchstart",function(){
		$('.weixin-tip').fadeOut(800);
	});



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

    //在微信里出现遮罩层
      function is_weixin() {
        var ua = navigator.userAgent.toLowerCase();
          if (ua.match(/MicroMessenger/i) == "micromessenger") {
            return true;
           } else {
            return false;
           }
      }
      var courseIdList = [5206, 5694, 4885, 5335];
      // var courseIdList=[3086,3085,3080,5370];
      var courseIdRight = [5656, 5330, 5575,5625];
      // var courseIdRight=[3086,3085,3080,5370];

      $(function(){
	      //判断不在微信浏览器  

	        var leftList=$('.left_activ');
	        var rightList=$('.right_activ');
	  		for(var i=0;i<4;i++){
	  			$(leftList[i]).attr('href','http://www.fxzhoumo.com/detail/course.html?courseid='+courseIdList[i]);
			}
			for(var i=0;i<4;i++){
				$(rightList[i]).attr('href','http://www.fxzhoumo.com/detail/course.html?courseid='+courseIdRight[i]);
			}
			
			if(is_weixin()){//微信浏览器
				
			}else{
				if(browser.versions.ios || browser.versions.iPhone || browser.versions.iPad){
	  				connectWebViewJavascriptBridge(function(bridge) {
						var uniqueId = 1;	
							$('.particular_left').bind("click",function(e){
								var t_id = $(e.target).attr('id');
								var count = t_id.substr(11,1);
								var data = '{"activityID":'+courseIdList[count]+',"activityTitle":"学习一下"}'									
								bridge.send(data, function(responseData) {										
								})
								e.preventDefault(); 
							})

							$('.particular_right').bind("click",function(e){
								
								var t_id = $(e.target).attr('id');
								var count = t_id.substr(10,1);
								var data = '{"activityID":'+courseIdRight[count]+',"activityTitle":"学习一下"}'									
								bridge.send(data, function(responseData) {										
								})
								e.preventDefault(); 
							})
					})
				}else if(browser.versions.android){
						
						$('.particular_left').bind("click",function(e){
							var t_id = $(e.target).attr('id');
							var count = t_id.substr(10,1);
							window.FXZMAndroidJavaScript.jumpToDetailActivity(courseIdList[count]);  //安卓
							e.preventDefault(); 
						})

						$('.particular_right').bind("click",function(e){
							var t_id = $(e.target).attr('id');
							var count = t_id.substr(10,1);
							window.FXZMAndroidJavaScript.jumpToDetailActivity(courseIdRight[count]);  //安卓
							e.preventDefault(); 
						})

				}
			}				

	  });
	
