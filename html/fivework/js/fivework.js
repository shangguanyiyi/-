function is_weixin() {
		var ua = navigator.userAgent.toLowerCase();
		if (ua.match(/MicroMessenger/i) == "micromessenger") {
			return true;
		} else {
			return false;
		}
	}
var isWeixin=is_weixin();

$(function(){
	var str1="wuyihongbao1";//wuyihongbao1
	var str2="wuyihongbao2";
	var str3="wuyihongbao3";
	var str4="wuyihongbao4";
	var voucher1;
	var curr=new Date();
	var date=curr.getDate();
	var hours = curr.getHours();
	var minutes=curr.getMinutes();
	console.log(date);
	if(date==29||date==28){
		str1="wuyihongbao1";
		// str1="22222";
		voucher1=775;
		// voucher1=290;

	}
	if(date==30){
		str1=str2;
		voucher1=777;
		str1.replace(/wuyihongbao1/g,str2);
		// str1.replace(/22222/g,str2);
	}
	if(date==1){
		str1=str3;
		voucher1=779;
		str1.replace(/wuyihongbao2/g,str3);
	}
	if(date==2){
		str1=str4;
		voucher1=781;
		str1.replace(/wuyihongbao3/g,str4);
	}

	if(hours>=11&&hours<24){
		$('.button').attr('src','../fivework_img/rightnow.png');
	}else if(hours>0&&hours<11){
		$('.button').attr('src','../fivework_img/startBefore.png');
		$('.button').unbind('click');
	}
	
	// if(hours>15&&hours<24){
	// 	$('.button').attr('src','../fivework_img/startBefore.png');
	// 	$('.button').unbind('click');
	// }
	
	//判断剩余份数
	$.ajax({
		url:'/IUserCenterV2Servlet?method=findVouch',
		type:'post',
		data:'servicestr={"voucherId":'+voucher1+'}',
		success:function(data){
			var json=eval("("+data+")");
			if(json.code=="success"){
				if(json.c_count<=0){
					$('.button').attr('src','../fivework_img/haveno.png');
					$('.button').unbind('click');
				}
			}
		}
	})
	//点击立即领取按钮时执行的函数
	var foo=function(){
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
						alert("礼包已经成功放入您的账户中啦！")	;
						$('.section1').show();
						$('.section0').hide();	
				}else{
						alert(obj.description);
				}
			}
		}) 
	}
	
	if(isWeixin){
		$('.fuchuang').show();
		$('.section1').append('<div style="margin-top:-1%;"><img style="display:block;" src="../fivework_img/fuchuang.png" /></div>');
		$('.section0').show();
		$('.section1').hide();
		if($('.button').attr('src')=='../fivework_img/rightnow.png'){
			$('.button').bind('click',foo);
		}
		
		
	}else{
		//在APP内
		$('.section0').show();
		$('.section1').hide();
		$('.fuchuang').hide();
		$.ajax({
			url:'/IUserCenterV2Servlet?method=toUserCenter',
			type:'get',
			success:function(data){
				var json=eval("("+data+")");
				console.log(json);
				if(json.code=="success"){//登录
					$('.section1').hide();
					$('.phone').hide();
					$('.button').css({
						'bottom':'1.7rem',
					})
					if($('.button').attr('src')=='../fivework_img/rightnow.png'){
						$('.button').bind('click',function(){
							$.ajax({
								url:'/IUserCenterV2Servlet?method=voucheConvert',
								type:'post',
								data:'servicestr={"codenum":"'+str1+'"}',
								success:function(data){
									var json=eval("("+data+")");
									if(json.code=="success"){
										alert("礼包已经成功放入您的账户中啦！");
										$('.section0').hide();
										$('.section1').show();
									}else{
										alert(json.description);
									}
									
								}
							})
						})
					}
					
					
				}else{//未登录
					if($('.button').attr('src')=='../fivework_img/rightnow.png'){
						$('.button').bind('click',foo);
					}	
				}
			}
		})
	}
	
})