$(function(){

	$('.homeBegDiv').bind('click',function(){
		$('.sectionOne').hide();
		$('.sectionTwo').show();
		window.scrollTo(0,0);
	});

	function is_weixin() {
		var ua = navigator.userAgent.toLowerCase();
		if (ua.match(/MicroMessenger/i) == "micromessenger") {
			return true;
		} else {
			return false;
		}
	}
	var isWeixin = is_weixin();
	if(isWeixin){
		//微信浏览器
		// alert('微信浏览器');
		$('.phoneWall').show();
	 	$('.anniu').hide();
	 	$('.fuchuang').show();
	 	$('.btn').bind('click',function(){
	 		var phone=$('.phone').val();
			var tel_RegExp = /^1[3|4|5|7|8]\d{9}$/;
			if(!(tel_RegExp.test(phone))){
				alert("请正确填写手机号");
				return;
			}
			$.ajax({
				url:"/IUserCenterV2Servlet?method=addUserVoucherByMobileVoucherCardNo",
				type:"post",
				data:'servicestr={"user_mobile":"'+phone+'","codenumstr":"yinghuafudai"}',
				success:function(data){
					var obj=eval("("+data+")");
					if(obj.code=="success"){
						$('.mask').show();
						$('.weixin').show();
						$('.app').hide();
						$('.register').show();
					}else{
						alert(obj.description);
					}
				}
			})
	 	})
	}else{//分APP内登录没登录
		
		$('.fuchuang').hide();
		$.ajax({
			url:'/IUserCenterV2Servlet?method=toUserCenter',
			type:'get',
			success:function(data){
				var json=eval("("+data+")");
				if(json.code=="success"){
					//已登录状态
					// alert('已登录状态');
					$('.phoneWall').hide();
					$('.anniu').show();
					$('.put').bind('click',function(){
						$.ajax({
							url:'/IUserCenterV2Servlet?method=voucheConvert',
							type:'post',
							data:'servicestr={"codenum":"yinghuafudai"}',
							success:function(data){
								var jsonData=eval("("+data+")");
								if(jsonData.code=="success"){
									$('.mask').show();
									$('.weixin').hide();
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
					$('.phoneWall').show();
	 				$('.anniu').hide();
	 				
	 				$('.btn').bind('click',function(){
	 					var phone=$('.phone').val();
		 				var tel_RegExp = /^1[3|4|5|7|8]\d{9}$/;
						if(!(tel_RegExp.test(phone))){
							alert("请正确填写手机号");
							return;
						}
	 					$.ajax({
	 						url:"/IUserCenterV2Servlet?method=addUserVoucherByMobileVoucherCardNo",
							type:"post",
							data:'servicestr={"user_mobile":"'+phone+'","codenumstr":"yinghuafudai"}',
							success:function(data){
								var obj=eval("("+data+")");
								if(obj.code=="success"){
									$('.mask').show();
									$('.weixin').hide();
									$('.app').show();
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

	
})