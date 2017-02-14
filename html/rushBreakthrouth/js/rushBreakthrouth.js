var answerStr;
function rightQuestion(){
	$('#onceagain').bind('click',function(){
		$('.section0').show();
		$('.tanchuang').hide();
		$('.section3').hide();
		top.location.reload();
		window.location.reload();
		location.href=document.location;
	})
	$('#nogo').bind('click',function(){
		$('.section4').show();
		$('.section3').hide();
	})
}

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


$(function(){
	$('.section0').show();
	$('.section1').hide();
	$('.section2').hide();
	$('.section3').hide();
	$('.section4').hide();

	// $('.section0').hide();
	// $('.section1').hide();
	// $('.section2').hide();
	// $('.section3').hide();
	// $('.section4').show();

	$.ajax({
		url:'/IFestivalServlet?method=getTotalRight',
		type:'post',
		success:function(data){
			var json=eval("("+data+")");
			if(json.code=="success"){
				$('.number').html(json.total+380);
			}
		}
	})

	$('.button0_0').bind('click',function(){
		$('.section0').hide();
		$('.section1').show();
	})
	$('.chooseOne').bind('click',function(e){
		if(e.preventDefault)
		{
			e.preventDefault();
		}else{
			e.returnValue=false;
		}
		var src=e.target||e.srcElement;
		var srcImg=$(src).css('background');
		console.log(srcImg);	
		if(!srcImg){return;}	
		$('.current').removeClass('current');
		$(src).addClass('current');
		
	})
	$('.chooseTwo').bind('click',function(e){
		if(e.preventDefault)
		{
			e.preventDefault();
		}else{
			e.returnValue=false;
		}
		var src=e.target||e.srcElement;
		var srcImg=$(src).css('background');
		console.log(srcImg);	
		if(!srcImg){return;}	
		$('.cur').removeClass('cur');
		$(src).addClass('cur');
		
	})
	$('.chooseThree').bind('click',function(e){
		if(e.preventDefault)
		{
			e.preventDefault();
		}else{
			e.returnValue=false;
		}
		var src=e.target||e.srcElement;
		var srcImg=$(src).css('background');
		console.log(srcImg);	
		if(!srcImg){return;}	
		$('.selected').removeClass('selected');
		$(src).addClass('selected');
		
	})
	$('.button1_3').bind('click',function(){
		if($('.current').length==0){
			alert('您还没有选择选项哦~')
		}else{
			$('.section0').hide();
			$('.section1').hide();
			$('.section2').show();
			$('.section3').hide();
			$('.section4').hide();
		}
		
	})
	$('.button2_3').bind('click',function(){
		if($('.cur').length==0){
			alert('您还没有选择选项哦~')
		}else{
			$('.section0').hide();
			$('.section1').hide();
			$('.section2').hide();
			$('.section3').show();
			$('.section4').hide();
		}
		
	})

	$('.button3_3').bind('click',function(){
		if($('.selected').length==0){
			alert('您还没有选择选项哦~')
		}else{
			var current=$('.current').attr('id');
		var answer1=current.slice(3);
		console.log(typeof(answer1));
		var cur=$('.cur').attr('id');
		var answer2=cur.slice(3);
		var selected=$('.selected').attr('id');
		var answer3=selected.slice(3);
		answerStr=answer1+answer2+answer3;
		console.log(typeof(answerStr));
		if((answer1=='1_1')&&(answer2=='2_2')&&(answer3=='3_2')){
			$('.section3').hide();
			$('.section4').show();
			$('.section4').css({
				'background':'url(../rushBreakthrouth_img/section5.jpg) no-repeat',
				 'backgroundSize':' 100% 100%',
   				 'width':'10rem',
			    'height':'17.786rem',
			    'position': 'relative',
			    'textAlign':'center'
			});

		}else if((answer1=='1_1')&&(answer2=='2_2')||(answer1=='1_1')&&(answer3=='3_2')||(answer2=='2_2')&&(answer3=='3_2')){
			$('.tanchuang').show();
			$('.tanchuang img:nth-child(1)').attr('src','../rushBreakthrouth_img/right2.png');
			rightQuestion();
		}
		else if((answer1=='1_1')||(answer2=='2_2')||(answer3=='3_2')){
			$('.tanchuang').show();
			$('.tanchuang img:nth-child(1)').attr('src','../rushBreakthrouth_img/right1.png');
			rightQuestion();
		}else{
			$('.tanchuang').show();
			rightQuestion();
			
		}
		}
		
	})

/*
	$('.A').bind('click',function(e){
		if(e.preventDefault)
		{
			e.preventDefault();
		}else{
			e.returnValue=false;
		}
		var src=e.target||e.srcElement;
		var srcImg=$(src).css('background');
		if(!srcImg){return;}	
		$('.baoming').removeClass('baoming');
		$(src).addClass('baoming');
	})
	$('.B').bind('click',function(e){
		if(e.preventDefault)
		{
			e.preventDefault();
		}else{
			e.returnValue=false;
		}
		var src=e.target||e.srcElement;
		var srcImg=$(src).css('background');
		if(!srcImg){return;}	
		$('.baoming').removeClass('baoming');
		$(src).addClass('baoming');
	})
	
*/	

	$('.toFriend').bind('click',function(){//邀请好友
		$('.mask').show();
	})

	function is_weixin() {
		var ua = navigator.userAgent.toLowerCase();
		if (ua.match(/MicroMessenger/i) == "micromessenger") {
			return true;
		} else {
			return false;
		}
	}
	// $('.fuchuang').show();
	var isWeixin = is_weixin();
	$('#App').attr('href','http://www.fxzhoumo.com/detail/course.html?courseid=6120');
	if(isWeixin){
		$('.fuchuang').show();
		$('.voucher').bind('click',function(){//点击领取优惠券按钮 弹框出现
			var phone=$('.phone').val();
			var tel_RegExp = /^1[3|4|5|7|8]\d{9}$/;
			if(!(tel_RegExp.test(phone))){
				alert("请正确填写手机号");
				return;
			}
			var name=$('.name').val();
			if(name==''){
				alert("请输入昵称");
				return;
			}
			var chooseAB=$('.baoming').attr('id');
			// console.log(chooseAB);
			var textarea=answerStr+chooseAB+name;
			// if(chooseAB==undefined||chooseAB=="B"){
				$.ajax({
					url:'/IFestivalServlet?method=tuCao',
					type:'post',
					data:'servicestr={"type":"0","openId":"","mobile":"'+phone+'","content":"'+textarea+'"}',
					success:function(data){
						var jsonData=eval("("+data+")");
						if(jsonData.code=="success"){
						}
					}
				})
				$.ajax({
					url:"/IUserCenterV2Servlet?method=addUserVoucherByMobileVoucherCardNo",
					type:"post",
					data:'servicestr={"user_mobile":"'+phone+'","codenumstr":"fxzhoumoaaasssni"}',
					success:function(data){
						var obj=eval("("+data+")");
						if(obj.code=="success"){
							$('.getVoucher').show();
						}else{
							alert(obj.description);
						}
					}
				})
			
			// }else{
			// 	$.ajax({
			// 		url:'/IFestivalServlet?method=tuCao',
			// 		type:'post',
			// 		data:'servicestr={"type":"0","openId":"","mobile":"'+phone+'","content":"'+textarea+'"}',
			// 		success:function(data){
			// 			var jsonData=eval("("+data+")");
			// 			if(jsonData.code=="success"){
			// 			}
			// 		}
			// 	})
			// 	$.ajax({
			// 			url:"/IUserCenterV2Servlet?method=addUserVoucherByMobileVoucherCardNo",
			// 			type:"post",
			// 			data:'servicestr={"user_mobile":"'+phone+'","codenumstr":"fxzhoumoaaasssni"}',
			// 			success:function(data){
			// 				var obj=eval("("+data+")");
			// 				if(obj.code=="success"){
			// 					$('.success').attr('src','../rushBreakthrouth_img/baoming.png');
			// 					$('.getVoucher').show();
								
			// 				}else{
			// 					alert(obj.description);
			// 				}
			// 			}
			// 	})
			// }
			
			
		})


	}else{
		
		if(browser.versions.ios || browser.versions.iPhone || browser.versions.iPad){
				connectWebViewJavascriptBridge(function(bridge) {
				var uniqueId = 1;	
					$('#app').bind("click",function(e){
						var t_id = $(this).parent('#App').attr('id');
						window.location.reload();
						// var count = t_id.substr(4,1);
						var data = '{"activityID":6120,"activityTitle":"学习一下"}'									
						bridge.send(data, function(responseData) {										
						})
						e.preventDefault(); 
					})
			})
		}else if(browser.versions.android){
				
				$('#app').bind("click",function(e){
					var t_id = $(e.target).parent('#App').attr('id');
					window.location.reload();
					// alert("t_id:"+t_id);
					// var t_id=$(this).attr('id');
					// var count = t_id.substr(4,1);
					
					window.FXZMAndroidJavaScript.jumpToDetailActivity(6120);  //安卓
					e.preventDefault(); 
				})

		}

		$('.voucher').bind('click',function(){//点击领取优惠券按钮 弹框出现
			var phone=$('.phone').val();
			var tel_RegExp = /^1[3|4|5|7|8]\d{9}$/;
			if(!(tel_RegExp.test(phone))){
				alert("请正确填写手机号");
				return;
			}
			var name=$('.name').val();
			if(name==''){
				alert("请输入昵称");
				return;
			}
			var chooseAB=$('.baoming').attr('id');
			// console.log(chooseAB);
			var textarea=answerStr+chooseAB+name;
			// if(chooseAB==undefined||chooseAB=="B"){
				$.ajax({
					url:'/IFestivalServlet?method=tuCao',
					type:'post',
					data:'servicestr={"type":"0","openId":"","mobile":"'+phone+'","content":"'+textarea+'"}',
					success:function(data){
						var jsonData=eval("("+data+")");
						if(jsonData.code=="success"){
						}
					}
				})
				$.ajax({
					url:"/IUserCenterV2Servlet?method=addUserVoucherByMobileVoucherCardNo",
					type:"post",
					data:'servicestr={"user_mobile":"'+phone+'","codenumstr":"fxzhoumoaaasssni"}',
					success:function(data){
						var obj=eval("("+data+")");
						if(obj.code=="success"){
							$('.getVoucher').show();
							// $('.getVoucher #app').hide();

							// $('.toFriend').css({
							// 	'width':'60%',
							// 	'position':'absolute',
							// 	'top':'9rem',
							// 	'left':'2rem'
							// })
						}else{
							alert(obj.description);
						}
					}
				})
			
			// }else{
			// 	// $.ajax({
			// 	// 	url:'/IFestivalServlet?method=tuCao',
			// 	// 	type:'post',
			// 	// 	data:'servicestr={"type":"0","openId":"","mobile":"'+phone+'","content":"'+textarea+'"}',
			// 	// 	success:function(data){
			// 	// 		var jsonData=eval("("+data+")");
			// 	// 		if(jsonData.code=="success"){
			// 	// 		}
			// 	// 	}
			// 	// })
			// 	// $.ajax({
			// 	// 		url:"/IUserCenterV2Servlet?method=addUserVoucherByMobileVoucherCardNo",
			// 	// 		type:"post",
			// 	// 		data:'servicestr={"user_mobile":"'+phone+'","codenumstr":"fxzhoumoaaasssni"}',
			// 	// 		success:function(data){
			// 	// 			var obj=eval("("+data+")");
			// 	// 			if(obj.code=="success"){
			// 	// 				// $('.success').attr('src','../rushBreakthrouth_img/baoming.png');
			// 	// 				$('.getVoucher').show();
			// 	// 				// $('.getVoucher #app').hide();

			// 	// 				// $('.toFriend').css({
			// 	// 				// 	'width':'60%',
			// 	// 				// 	'position':'absolute',
			// 	// 				// 	'top':'9rem',
			// 	// 				// 	'left':'2rem'
			// 	// 				// })
								
			// 	// 			}else{
			// 	// 				alert(obj.description);
			// 	// 			}
			// 	// 		}
			// 	// })
			// }
			
			
		})
		$('.section0').css('margin-bottom','0');
		$('.fuchuang').hide();
	}


})