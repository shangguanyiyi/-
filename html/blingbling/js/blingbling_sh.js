
$(function(){
	var str1="blingsh3";
	var str2="blingsh1";
	var str3="blingsh2";
	var voucher1;
	var curr = new Date();
	var date=curr.getDate();
	var hours = curr.getHours();
	var minutes=curr.getMinutes();
	console.log(date);
	if(date==26||date==25){
		str1="blingsh3";
		voucher1=749;
	}
	if(date==27){
		str1=str2;
		voucher1=750;
		str1.replace(/blingsh3/g,str2);
	}

	if(date==28){
		str1="blingsh2";
		voucher1=751;
		str1.replace(/blingsh1/g,str3);
	}

	if(hours>=11&&hours<24){
		$('.button').val("立即领取");
	}else if(hours>0&&hours<11){
		$('.button').val('即将开始');
		$('.button').attr('disabled','disabled');
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
					$('.button').attr('disabled','disabled');
					$('.button').css('border','2px solid #bfbfbf');
				}
			}
		}
	})

	function is_weixin() {
		var ua = navigator.userAgent.toLowerCase();
		if (ua.match(/MicroMessenger/i) == "micromessenger") {
			return true;
		} else {
			return false;
		}
	}
	var isWeixin=is_weixin();
	
	if(isWeixin){
	
		$('.fuchuang').show();

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
							alert("礼包已经成功放入您的账户中啦！")	;	
					}else{
							alert(obj.description);
					}
				}
			}) 
		})
		
	}else{
		//在APP内
		$('.fuchuang').hide();
		$.ajax({
			url:'/IUserCenterV2Servlet?method=toUserCenter',
			type:'get',
			success:function(data){
				var json=eval("("+data+")");
				console.log(json);
				if(json.code=="success"){//登录
					$('.phone').hide();
					$('.button').bind('click',function(){
						$.ajax({
							url:'/IUserCenterV2Servlet?method=voucheConvert',
							type:'post',
							data:'servicestr={"codenum":"'+str1+'"}',
							success:function(data){
								var json=eval("("+data+")");
								if(json.code=="success"){
									alert("礼包已经成功放入您的账户中啦！")
								}else{
									alert(json.description);
								}
								
							}
						})
					})
					
				}else{//未登录
					
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
								var jsonData=eval("("+data+")");
								if(jsonData.code=="success"){
									alert("礼包已经成功放入您的账户中啦！");
								}else{
									alert(jsonData.description);
								}
							}
						})
					})
					
				}
			}
		})
	}

})