var countdown=60;
var str;


function setTime(){
		var button=document.getElementById("btnYzm");
		if(countdown==0){
			
			$('#btnYzm').removeAttr("disabled");
			
			$('#btnYzm').css({"background":"#86e2fd","color":"#fff","border":"1px solid #86e2fd"});
			button.innerHTML="获取短信";
			countdown=60;
			document.getElementById('hidden').value = 1; 
			return;			
		}else{
			str="倒计时"+countdown+"秒";
			$('#btnYzm').attr("disabled","disabled");
			$('#btnYzm').css({"background":"#ddd","color":"#666","border":"1px solid #ddd"});
			$('#btnYzm').css("backgound","#ddd");
			button.innerHTML=str;
			countdown--;
		}
		setTimeout("setTime()",1000);

	}


function getMessage(){
		$('.yanzheng').show();
		var phone=$('#phone').val();
		$('.fresh').bind("touchstart",function(){//点击更换验证码
					$.ajax({
						url:"/IUserServlet?method=getVerifyCode",
						type:"post",
						success:function(data){	
							$('.fresh').attr('src',"/IUserServlet?method=getVerifyCode");
						}
					})
				})
		//点击获取短信按钮 向后台发送当前图片验证码 
		$('.btnYzm').bind('touchstart',function(){
			var security=$('.securityCode').val();//图片验证码
			security=security.trim();
						
			var moving=$('.securityCode2').val();//短信动态验证码

				//输入正确之后执行定时器函数
				var hidden_val = $('#hidden').val();

				if(hidden_val == 1){
						document.getElementById('hidden').value = 0; 
						$.ajax({
							url:"/IUserServlet?method=getDynamicPT",
							type:"post",
							data:'servicestr={"mobile":"'+phone+'","verify_code":"'+security+'"}',
							success:function(data){
								console.log(data);
								var jsonData= eval("("+data+")");
								if(jsonData.code=="success"){
									setTime();
									
								}else{
									alert(jsonData.description);
									document.getElementById('hidden').value = 1; 
									$.ajax({
										url:"/IUserServlet?method=getVerifyCode",
										type:"post",
										success:function(data){	
											$('.fresh').attr('src',"/IUserServlet?method=getVerifyCode");
										}
									})
								}
														
							}					
						})

				}
				

				
		})
	}


$(function(){
	//输入手机号
	$('#phone').bind('focus',function(){
		$('.shuTel').hide();
	})
	var value=$("#phone").val();
	if(value!=''){
		$('.shuTel').hide();
	}
	$('.two').hide();

				
	

	// 给领取红包按钮绑定事件 成功后执行getMessage事件
	$('.redPacket').bind('touchstart',function(){
		event.preventDefault();  
		var phone=$('#phone').val();
		// var img=$(".fresh img").attr("src");
		// console.log(img);
		if(phone==''||phone.length!=11){
			alert('手机号输入格式有误');
			return;
		}else{	
			getMessage();
		}

		// 给确定按钮绑定事件  发送短信验证码后台进行判断
				$('.true').bind("touchstart",function(){
					var info=$('.securityCode2').val();
					$.ajax({
						url:"/IUserCenterV2Servlet?method=addUserVoucherHavCodeByMobileVoucherCardNo",
						type:"post",
						data:'servicestr={"user_mobile":"'+phone+'","codenumstr":"woxiangqingnicdfsh4","user_password":"'+info+'"}',
						success:function(data){
							json=eval("("+data+")");
							if(json.code=="success"){
								$('.yanzheng').hide();
								$('.one').hide();
								$('.two').show();
								window.scrollTo(0,0);
							}else{
								alert(json.description);
							}
						}
					})
				})

				$('.cancle').bind("touchstart",function(){
					$('.yanzheng').hide();
				})

	});

})