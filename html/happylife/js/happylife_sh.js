
$(function(){

	var str1="lhpdfdsh1";
	var str2="lhpdfdsh3";
	var str3="lhpdfdsh2";
	var curr = new Date();
	var date=curr.getDate();
	var time = curr.getHours();
	var minutes=curr.getMinutes();
	console.log(date);
	if(date==13){
		str1="lhpdfdsh1";
		// str1.replace(/lhpdfdbj1/g,str2);
	}
	if(date==14){
		str1="lhpdfdsh3";
		str1.replace(/lhpdfdsh1/g,str2);
	}

	if(date==15){
		str1="lhpdfdsh2";
		str1.replace(/lhpdfdsh3/g,str3);
	}


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