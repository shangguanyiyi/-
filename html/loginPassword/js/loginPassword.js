var countdown=60;
var str;
var phone;
var time=null;
// time=setInterval(function(){
// 	var button=document.getElementById("btnYzm");
// 	if(countdown<=0){
// 		clearInterval(time);
// 		time=null;
// 		countdown=60;
// 		$('#btnYzm').removeAttr("disabled");
// 		$('#btnYzm').css({"background":"#86e2fd","color":"#fff","border":"1px solid #86e2fd"});
// 		button.innerText="获取短信";
// 		document.getElementById('hidden').value = 1; 
// 		return;
// 	}
// 	button.innerText="倒计时"+num+"秒";
// 	$('#btnYzm').attr("disabled","disabled");
// 	$('#btnYzm').css({"background":"#ddd","color":"#666","border":"1px solid #ddd"});
// 	$('#btnYzm').css("backgound","#ddd");
// 	// button.innerHTML=str;
// 	countdown--;
// },1000);
//短信验证码倒计时
/*
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

}*/
function authCode(){
	$.ajax({
		url:"/IUserServlet?method=getVerifyCode",
		type:"post",
		success:function(data){	
			$('.fresh').attr('src',"/IUserServlet?method=getVerifyCode");
		}
	})
}
$(function(){	
	$('.yanzheng').show();
	//点击更换验证码
	$('.fresh').bind("touchstart",function(){
		authCode();
	})
	//点击获取短信按钮 向后台发送当前图片验证码 
	$('.btnYzm').bind('touchstart',function(){
		var security=$('.securityCode').val();//图片验证码
		phone=$('#phone').val();
		security=security.trim();			

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
						// setTime();	
						time=setInterval(function(){
						var button=document.getElementById("btnYzm");
						if(countdown<=0){
							clearInterval(time);
							time=null;
							countdown=60;
							$('#btnYzm').removeAttr("disabled");
							$('#btnYzm').css({"background":"#86e2fd","color":"#fff","border":"1px solid #86e2fd"});
							button.innerText="获取短信";
							document.getElementById('hidden').value = 1; 
							return;
						}
						button.innerText="倒计时"+countdown+"秒";
						$('#btnYzm').attr("disabled","disabled");
						$('#btnYzm').css({"background":"#ddd","color":"#666","border":"1px solid #ddd"});
						$('#btnYzm').css("backgound","#ddd");
						// button.innerHTML=str;
						countdown--;
					},1000);							
					}else{
						alert(jsonData.description);
						document.getElementById('hidden').value = 1; 
						// $.ajax({
						// 	url:"/IUserServlet?method=getVerifyCode",
						// 	type:"post",
						// 	success:function(data){	
						// 		$('.fresh').attr('src',"/IUserServlet?method=getVerifyCode");
						// 	}
						// })
						authCode();
					}
											
				}					
			})

		}
	})

	// 给确定按钮绑定事件  发送短信验证码后台进行判断
	$('.true').bind("touchstart",function(){
		var info=$('.securityCode2').val();
		
		$.ajax({
			url:"/IUserServlet?method=dloginreg",
			type:"post",
			data:'servicestr={"mobile":"'+phone+'","password":"'+info+'","facility":"","facilityNum":"","userx":"","usery":""}',
			success:function(data){
				json=eval("("+data+")");
				if(json.code=="success"){
					$('.yanzheng').hide();
					//此处写验证成功之后跳转到那个页面
					window.scrollTo(0,0);
				}else{
					alert(json.description);
				}
			}
		})
	})


	$('.cancle').bind("touchstart",function(){
			// $('.yanzheng').hide();
			$('#phone').val("");
			$('.securityCode').val("");
			$('.securityCode2').val("");
			button=document.getElementById("btnYzm")
			countdown=0;
			$('#btnYzm').removeAttr("disabled");
			$('#btnYzm').css({"background":"#86e2fd","color":"#fff","border":"1px solid #86e2fd"});
			button.innerText="获取短信";
			document.getElementById('hidden').value = 0; 
			// clearInterval(time);ssss
		})
			
})		
			
