 var userCode=GetQueryString("code");
  // var userCode="sdfghjklf";
  var openId;
  var isLogin;
  var countdown=60;
  var str;
  var time=null;
  var browserType;
  var isWeixin;
  var nextUrl="http://www.fxzhoumo.com/operation/storyFilm/storyFilm_comment.html?phone=";
  var base_url="http://www.fxzhoumo.com/operation/storyFilm/storyFilm.html";
  // var base_url="http://192.168.0.83/storyFilm/storyFilm/storyFilm.html";
function GetQueryString(name) { 
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r!=null) return unescape(r[2]); return null; //返回参数值
}   //通过这个函数传递url中的参数名就可以获取到参数的值

function validate(){
	// 弹窗登录
	$('.yanzheng').show();
	//点击更换验证码
	$('.fresh').bind("click",function(){
		$.ajax({
			url:"/IUserServlet?method=getVerifyCode",
			type:"post",
			success:function(data){	
				$('.fresh').attr('src',"/IUserServlet?method=getVerifyCode");
			}
		})
	})
	//点击获取短信按钮 向后台发送当前图片验证码 
	$('.btnYzm').bind('click',function(){
		var security=$('.securityCode').val();//图片验证码
		var phone=$('.phone').val();
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

	// 给确定按钮绑定事件  发送短信验证码后台进行判断
	$('.true').bind("click",function(){
		var info=$('.securityCode2').val();
		var phone=$('.phone').val();
		$.ajax({
			url:"/IUserServlet?method=dloginreg",
			type:"post",
			data:'servicestr={"mobile":"'+phone+'","password":"'+info+'","facility":"","facilityNum":"","userx":"","usery":""}',
			success:function(data){
				json=eval("("+data+")");
				if(json.code=="success"){
					$('.yanzheng').hide();
					// window.scrollTo(0,0);
					window.location.reload();
				}else{
					alert(json.description);
				}
			}
		})
	})

	$('.cancle').bind("click",function(){
		$('.yanzheng').hide();
		$('.phone').val("");
		$('.securityCode').val("");
		$('.securityCode2').val("");
		$('.input2').val("");
		button=document.getElementById("btnYzm")
		countdown=0;
		$('#btnYzm').removeAttr("disabled");
		$('#btnYzm').css({"background":"#86e2fd","color":"#fff","border":"1px solid #86e2fd"});
		button.innerText="获取短信";
		document.getElementById('hidden').value = 0; 
		$.ajax({
			url:"/IUserServlet?method=getVerifyCode",
			type:"post",
			success:function(data){	
				$('.fresh').attr('src',"/IUserServlet?method=getVerifyCode");
			}
		})
	});
}

function firstAccess(){
 	var isFaveImg;
 	$.ajax({
		url:'/IFestivalServlet?method=queryTuCao',
		type:'post',
		data:'servicestr={"type":"'+browserType+'","code":"'+userCode+'"}',
		success:function(data){	
			var obj=eval("("+data+")");
			if(obj.code=="success"){
				var dataFestivalArr=obj.festivalCourseArray;
				isLogin=obj.isLogin;
				openId=obj.openId;
				if(isWeixin){
					$('.htmlA').attr('href',"https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx47987fa108b8329b&redirect_uri="+nextUrl+""+"&response_type=code&scope=snsapi_base&state=1#wechat_redirect");
					// window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx47987fa108b8329b&redirect_uri="+nextUrl+""+"&response_type=code&scope=snsapi_base&state=1#wechat_redirect";
				}else{
					$('.htmlA').attr('href','storyFilm_comment.html?phone='+"");
				}
				
				if(isLogin==false){
					$('.print').show();
					$('.user').hide();
				}else if(isLogin==true){
					$('.print').hide();
					$('.user').show();
				}else{//没有传isLogin的时候  微信
					$('.print').show();
					$('.user').hide();
				}
				
				for(var i=0;i<dataFestivalArr.length;i++){
					if(dataFestivalArr[i].isFave==false){
						isFaveImg='../storyFilm_img/before.png';
					}else{
						isFaveImg='../storyFilm_img/after.png';
					}
				
					$('.commentPanel').append('<div class="comment comment'+i+'">'+
						'<div class="left">'+
							 '<img class="img_exprise" id="exprise_'+dataFestivalArr[i].id+'" src="../storyFilm_img/amazed.png" alt="">'+ 
						'</div>'+
						'<div class="right" id="fav'+dataFestivalArr[i].id+'">'+
			                '<div class="right_text">'+dataFestivalArr[i].content+'</div>'+
			                '<div class="goodHeart">'+
			                    '<img class="heart" id="heart_'+dataFestivalArr[i].id+'" src="'+isFaveImg+'" alt="'+dataFestivalArr[i].isFave+'">'+
			                    '<p id="faveCount_'+dataFestivalArr[i].id+'">'+dataFestivalArr[i].faveCount+'</p>'+
			                '</div>'+         
			            '</div>'+
					'</div>');
					
					var rightHeight=$('#fav'+dataFestivalArr[i].id).height();
					var imgHeight=$('.img_exprise').height();
					var distance;
					if(imgHeight==0){
						distance=rightHeight/3;
					}else{
						distance=(rightHeight-(imgHeight/2))/2;
					}
					$('#exprise_'+dataFestivalArr[i].id).css("margin-top",distance);
					
					var id=dataFestivalArr[i].id;
					addFave(id);
					
				}
			}
			
		}
		
	})
	
	

}

function submitBtn(){
	var textareaText=$('.textarea').val();
	function clearBr(key) 
	{ 
	    key = key.replace(/[\r\n]/g, ""); 
	    return key; 
	} 
	var textarea=clearBr(textareaText);
	if(textarea==""){
		alert("你还没有吐槽呦~");
		return;
	}	
	var phone=$('.phone1').val();
	// var tel_RegExp = /^1[3|4|5|7|8]\d{9}$/;
	// if(!(tel_RegExp.test(phone))){
	// 	alert("请正确填写手机号");
	// 	return;
	// }
	$.ajax({
		url:'/IFestivalServlet?method=tuCao',
		type:'post',
		data:'servicestr={"type":"'+browserType+'","openId":"'+openId+'","mobile":"'+phone+'","content":"'+textarea+'"}',
		success:function(data){
			var jsonData=eval("("+data+")");
			if(jsonData.code=="success"){
				if(isWeixin){
					window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx47987fa108b8329b&redirect_uri="+nextUrl+phone+"&response_type=code&scope=snsapi_base&state=1#wechat_redirect";	
				}else{
					window.location.href="storyFilm_comment.html?phone="+phone+"";
				}
				
			}
		}
	})
}

function ajaxAdd(id){
	$.ajax({
		url:'/IFestivalServlet?method=addFave',
		type:'post',
		data:'servicestr={"type":"'+browserType+'","openId":"'+openId+'","faveId":"'+id+'"}',
		success:function(data){
			console.log(data);
			var obj=eval("("+data+")");
			if(obj.code=="success"){
				// alert(obj.description);
				if(obj.description=="已添加到喜欢 "){
					$('#heart_'+id).attr('src','../storyFilm_img/after.png');
					var add=$('#faveCount_'+id).text();
					add++;
					$('#faveCount_'+id).text(add);
				}else if(obj.description=="已取消喜欢 "){
					$('#heart_'+id).attr('src','../storyFilm_img/before.png');
					var reduce=$('#faveCount_'+id).text();
					reduce--;
					$('#faveCount_'+id).text(reduce);
				}
			}

		}
	})
}

function addFave(id){
	$('#heart_'+id).bind('click',function(){
		if(userCode==null||userCode==""){
			if(isLogin==true){//APP已登录状态
				openId="";
				ajaxAdd(id);
				
			}else{//APP未登录状态 弹窗显示
				validate();
			}
		}else{//微信浏览器
			ajaxAdd(id);
		}
		
	})
}

$(function(){
	if(userCode==null||userCode==""){//普通浏览器
		console.log("普通浏览器");
		$('.fuchuang').hide();
		browserType=0;
		userCode="";
		
		firstAccess();
		$('.submit').bind('click',function(){//没登录时的按钮 有电话输入框
			var phone=$('.phone1').val();
			var tel_RegExp = /^1[3|4|5|7|8]\d{9}$/;
			if(!(tel_RegExp.test(phone))){
				alert("请正确填写手机号");
				return;
			}
			openId="";
			submitBtn();
		});
		$('.user_submit').bind('click',function(){//登录过的按钮  没有电话输入框
			openId="";
			mobile="";
			submitBtn();
		})
		$('.btn').bind('click',function(){//点击分享按钮 蒙层出现
			$('.share').show();
		})
		$('.share').bind('click',function(){//点击蒙层  蒙层隐藏
			$('.share').hide();
		})
	}else{//微信浏览器
		$('.fuchuang').show();
		browserType=1;
		firstAccess();
		$('.submit').bind('click',function(){//没登录时的按钮 有电话输入框 微信中全部没有登录
			var phone=$('.phone1').val();
			var tel_RegExp = /^1[3|4|5|7|8]\d{9}$/;
			if(!(tel_RegExp.test(phone))){
				alert("请正确填写手机号");
				return;
			}
			submitBtn();
		})
		$('.btn').bind('click',function(){//点击分享按钮 蒙层出现
			$('.share').show();
		})
		$('.share').bind('click',function(){//点击蒙层  蒙层隐藏
			$('.share').hide();
		})
	}

	function is_weixin() {
		var ua = navigator.userAgent.toLowerCase();
		if (ua.match(/MicroMessenger/i) == "micromessenger") {
			return true;
		} else {
			return false;
		}
	}
	isWeixin = is_weixin();
	if(isWeixin){
		if(userCode==null||userCode==""){
			wx_url=escape(base_url);
			window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx47987fa108b8329b&redirect_uri="+wx_url+"&response_type=code&scope=snsapi_base&state=1#wechat_redirect";	
			// return;
		}
	}

})
