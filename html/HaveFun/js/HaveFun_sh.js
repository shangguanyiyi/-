
$(function(){
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
		$('.section1').hide();
		$('.section0').show();
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
				data:'servicestr={"user_mobile":"'+phone+'","codenumstr":"cjwldlbsh"}',
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
					$('.section0').hide();
					$('.section1').show();
					$('.button1').bind('click',function(){
						$.ajax({
							url:'/IUserCenterV2Servlet?method=voucheConvert',
							type:'post',
							data:'servicestr={"codenum":"cjwldlbsh"}',
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
					$('.section1').hide();
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
							data:'servicestr={"user_mobile":"'+phone+'","codenumstr":"cjwldlbsh"}',
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