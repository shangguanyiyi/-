var countdown=60;
var str;
var moveImgs=$('.photo-clip-rotateLayer').html();
 var userCode=GetQueryString("code");
var widthScreen=$(window).width();
var screnWidth=$(window).width()-20;
var area=screnWidth-screnWidth*0.18;//口唇印面积
var userId;//朋友的userid
var clickCount=0;
var browserType;
var openId;
var isLogin;
var route;
var count;
var photo_url="http://img.fxzhoumo.com/";
// var photo_url="http://img.mammachoice.com/";
var base_url="http://www.fxzhoumo.com/operation/valentine/valentine.html";
var para_img;
//短信验证码倒计时
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
//拿到code值
function GetQueryString(name) { 
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r!=null) return unescape(r[2]); return null; //返回参数值
}   //通过这个函数传递url中的参数名就可以获取到参数的值
function otherOpen(){
	$('#first').hide();
	$('#second').hide();
	$('#third').show();
	$('#forth').hide();
	// $('#first').hide();
	$('#third_clipArea img').attr("src",route)
}

function ownselfOpen(){
	$('#first').hide();
	$('#second').hide();
	$('#third').hide();
	$('#forth').show();
	$('#forth_clipArea img').attr("src",route);
} 
//刚进入页面的时候发送请求 拿到图片地址 亲吻数量 isOwn A朋友的Openid
function sendRequest(){
	//para_sendRequest(userId);
	//}
	//function para_sendRequest(para_userid){
	var requestParames='servicestr={"userid":"'+userId+'","code":"'+userCode+'","type":"'+browserType+'"}';
	$.ajax({
		url:"/QingRenJieServlet?method=getChunYinCount",
		type:"post",
		data:requestParames,
		async:false,
		success:function(data){
			var jsonData=eval("("+data+")");
			if(jsonData.image==null||jsonData.image==""){
				//window.location.href=base_url+"?userid=1";
				para_img=jsonData.image;
			}else{
				para_img=jsonData.image;
				route=photo_url+jsonData.image;
				$('#first_clipArea img').attr('src',route);
				var jsonPicture=jsonData.openId;
				openId=jsonData.openId;
				//alert(openId);
				count=jsonData.count;
				isLogin=parseInt(jsonData.isLogin);
				if(userId>1){
					if(jsonData.isOwn==1){
						ownselfOpen();//如果是自己就打开分享去炫耀页面
						randomChunYin(count,4);
					}else{
						otherOpen();//如果是别人就打开我要去索吻页面
						randomChunYin(count,3);
					}
				}else{
					$('#first').show();
					randomChunYin(count,1);
				}
				return data;	
			}
					
		}
	})	
}

function randomChunYin(count,imgDivType){
	for(var i=0;i<count;i++){
		num1=parseInt(Math.random()*area);
		num2=parseInt(Math.random()*area);
		num3=parseInt(Math.random()*100);
		var clipArea=$('#first_clipArea');
		if(imgDivType==3){
			clipArea=$('#third_clipArea');
		}else if(imgDivType==4){
			clipArea=$('#forth_clipArea');
		}else if(imgDivType==1){
			clipArea=$('#first_clipArea');
		}else if(imgDivType==2){
			clipArea=$('.photo-clip-view');
		}
		clipArea.append('<img src="../valentine_img/mouth.png" class="mouth mouth'+clickCount+'" >');

		$('.mouth'+clickCount).css(
			'transform','translate('+num1+'px,'+num2+'px) rotate('+num3+'deg)'
		);
		clickCount++;

	}
}
//判断是否已经上传过图片
function wetherUpLoadImg(){
	//alert("请求是否已经上传过图片");
	$.ajax({
		url:'/QingRenJieServlet?method=isUploadImg',
		type:'post',
		data:'servicestr={"openid":"'+openId+'","type":"'+browserType+'"}',
		success:function(data){
			var	json=eval("("+data+")");
			if(json.code=="success"){

				//判断是否上传过图片 上传过就直接跳转分享去炫耀页面 没有就跳转到发射那页
				if(json.isUplod==0){
					$('#second').show();
					$('#first').hide();
					$('#third').hide();
					$('#forth').hide();
				}else{
					window.location.href=base_url+"?userid="+json.userid;
				}
			}else{
				alert(json.description);

			}
		}
	})
}
//验证框部分validateBox
function validateBox(){
		//如果isLogin=0时 未登录 弹出验证码弹框
		//alert("绑定isLogin:"+isLogin);
		if(isLogin==0){
			$('.yanzheng').show();
			//点击更换验证码
			$('.fresh').bind("touchstart",function(){
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
		
			// 给确定按钮绑定事件  发送短信验证码后台进行判断
			$('.true').bind("touchstart",function(){
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
							wetherUpLoadImg();
							window.scrollTo(0,0);
						}else{
							alert(json.description);
						}
					}
				})
			})
		}else{
			wetherUpLoadImg();
		}
		

		$('.cancle').bind("touchstart",function(){
			$('.yanzheng').hide();
		});
}
// 点击选择图片 读取坐标值  
function selectPicture(){
	 var moveImg=$('.photo-clip-rotateLayer>img').attr("id","pic");
	 var tupian=$('.photo-clip-rotateLayer>img').attr('src');
	 var picture = document.getElementById('pic');
	 var browser_so=$('#type');
	 var weixin_openId=$('#weixin_openId');
	 //alert("--userCode:"+userCode+"--openId:"+openId);	 
	 if(openId==null||openId==""){
		browser_so.attr("value",0);//普通浏览器type值为0
	 }else{
	 	browser_so.attr("value",1);
	 	//alert("--openId:"+openId);
	 	weixin_openId.attr("value",openId);
	 }
	 var formData = new FormData($( "#uploadForm" )[0]);
	 $('.fileInputContainer').hide();//上传时按钮隐藏

	 //发送请求  剪切图片  放回原位
 	 $.ajax({
			url:"/QingRenJieServlet?method=uploadImg",
			type:"post",
			data: formData,
			async: false,  
          	cache: false,  
         	contentType: false,  
          	processData: false,  
	        success: function (data) {  
	            var json=eval("("+data+")");
	            console.log(json);
	            var json_userId=json.userid;
	            if(json.code=="success"){
	            	var wx_url_temp=escape(base_url+"?userid="+json_userId);
	            	if(openId!=null&&openId!=""){
	            		
	            		window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx47987fa108b8329b&redirect_uri="+wx_url_temp+"&response_type=code&scope=snsapi_base&state=1#wechat_redirect";
	            		return;
	            	}else{
	            		var path=photo_url+json.image;
	            		$('#pic').attr("src",path);
	            		$('.mask').show();
	            		window.location.href=base_url+"?userid="+json_userId;
	            		return;
	            		//share(json_userId);//分享的时候 带一个userid
	            	}
	            	
	            }else{
	            	alert(json.description);
	            	$('.fileInputContainer').show();//上传失败按钮出现
	            }
	        },   
	 });	
}

//点击发射按钮
function launch(){
	//点击发射 发送请求 弹出蒙层
	$('#clipBtn').bind('touchstart',function(){	
		var launchCount=$('#launchCount').val();
		if(launchCount!=1){
			return;
		}	
		var moveImgs=$('.photo-clip-rotateLayer').html();
		if(moveImgs!=""){
			document.getElementById('launchCount').value=0;
		}		
	})
}
//请求addChunYin 阻止第二次点击
function addMouth(headPic){
	$.ajax({
		url:"/QingRenJieServlet?method=addChunYin",
		type:"post",
		data:'servicestr={"userid":"'+userId+'","openid":"'+openId+'","type":'+browserType+'}',
		success:function(data){
			var json= eval("("+data+")");
			if(json.code=="success"){
				var chunYin=$('#chunYin').val();
				if(chunYin!=1){//zhen
					return;
				}
				num1=parseInt(Math.random()*area);
				num2=parseInt(Math.random()*area);
				num3=parseInt(Math.random()*100);
				headPic.append('<img src="../valentine_img/mouth.png" class="mouth mouth'+clickCount+'" >');
				$('.mouth'+clickCount).css(
					'transform','translate('+num1+'px,'+num2+'px) rotate('+num3+'deg)'
				);
				clickCount++;
				json.count++;
				document.getElementById('chunYin').value=0;
			}else{
				alert(json.description);
			}
		}
	});	
}
//页面一加载就判断当前浏览器类型
$(function(){
	$('#second').hide();
	$('#third').hide();
	$('#forth').hide();
    $('#clipArea').css("height",screnWidth);
    $('.clipArea').css("height",screnWidth);
    $('.shadow').css("top",screnWidth);
    userId=GetQueryString("userid");
    if(userId==null||userId==""){
    	userId=1;
    }
    
	if(userCode==null||userCode==""){//在普通浏览器中执行的一切
		browserType=0;
		userCode="";
		sendRequest();
		if(para_img==null||para_img==""){
			window.location.href=base_url+"?userid=1";
			return;
		}
		$('#suowen').bind('touchstart',function(){
			// var phone=$('#phone').val();
			/*原本的
			event.preventDefault(); 
			validateBox();//弹出验证
			*/
			$('.friend').show();

		});
		$('#third_suowen').bind('touchstart',function(){
			event.preventDefault();
			// var phone=$('#phone3').val();
			validateBox();//弹出
		});
		launch();

		if(isLogin==0){
			$('#first_clipArea').bind('touchstart',function(){
				var chunYin=$('#chunYin').val();
				if(chunYin!=1){//zhen
					return;
				}
				num1=parseInt(Math.random()*area);
				num2=parseInt(Math.random()*area);
				num3=parseInt(Math.random()*100);
				$('#first_clipArea').append('<img src="../valentine_img/mouth.png" class="mouth mouth'+clickCount+'" >');
				$('.mouth'+clickCount).css(
					'transform','translate('+num1+'px,'+num2+'px) rotate('+num3+'deg)'
				);
				clickCount++;
				document.getElementById('chunYin').value=0;
			})
			$('#third_clipArea').bind('touchstart',function(){
				var chunYin=$('#chunYin').val();
				if(chunYin!=1){//zhen
					return;
				}
				num1=parseInt(Math.random()*area);
				num2=parseInt(Math.random()*area);
				num3=parseInt(Math.random()*100);
				$('#third_clipArea').append('<img src="../valentine_img/mouth.png" class="mouth mouth'+clickCount+'" >');
				$('.mouth'+clickCount).css(
					'transform','translate('+num1+'px,'+num2+'px) rotate('+num3+'deg)'
				);
				clickCount++;
				document.getElementById('chunYin').value=0;
			})
			
		}else{
			openId="";
			$('#first_clipArea').bind('touchstart',function(){
				var headerPic1=$('#first_clipArea');
				addMouth(headerPic1);
			})
			$('#third_clipArea').bind('touchstart',function(){
				var headerPic3=$('#third_clipArea');
				addMouth(headerPic3);
			})
			$('#forth_clipArea').bind('touchstart',function(){
				var headerPic4=$('#forth_clipArea');
				addMouth(headerPic4);
			})
		}
		$(".download").css("display","none");//普通浏览器不显示下载浮窗
		
	}else{//在微信浏览器里执行的一切
		browserType=1;
		sendRequest();
		launch();
		$('#suowen').bind('touchstart',function(){
			event.preventDefault(); 
			// validateBox();//弹出验证
			wetherUpLoadImg();
		});
		$('#third_suowen').bind('touchstart',function(){
			event.preventDefault();
			wetherUpLoadImg();
			$('#third').hide();
			$('#second').show();
		});

		$('#first_clipArea').bind('touchstart',function(){
			var headerPic1=$('#first_clipArea');
			addMouth(headerPic1);
		})
		$('#third_clipArea').bind('touchstart',function(){
			var headerPic3=$('#third_clipArea');
			addMouth(headerPic3);
		})
		$('#forth_clipArea').bind('touchstart',function(){
			var headerPic4=$('#forth_clipArea');
			addMouth(headerPic4);
		})
		$(".download").css("display","block");//微信浏览器显示下载浮窗
	}

	//wx_url=escape(window.location.href+"?userid="+userId);
	// console.log(wx_url);
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
	if(isWeixin){
		if(userCode=null||userCode==""){
			wx_url=escape(base_url+"?userid="+userId);
			window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx47987fa108b8329b&redirect_uri="+wx_url+"&response_type=code&scope=snsapi_base&state=1#wechat_redirect";	
			return;
		}
	}

	//点击分享去炫耀时弹出蒙层
	$('#share').bind('touchstart',function(){
		$('.mask').show();
	});

	share(userId);//分享的时候 带一个userid
	
})


//点击微信分享朋友圈
function share(para_userid){
	
	//wx_url=escape(base_url+"?userid="+para_userid);
	//alert(window.location.href);
	//wx_url=escape(window.location.href);
	wx_url=window.location.href;
	//wx_url = base_url
	//alert(wx_url);

	$.ajax({
		url:"/WeixinServlet?method=weixinPower",
		type:"post",
		data:'servicestr={"wei_url":"'+wx_url+'"}',  
		dataType:"html",
		success:function(data){
			var json = eval("("+data+")");
			if(json.code=="success"){
				
				wx.config({
				    debug: true, 
				    appId: 'wx47987fa108b8329b', 
				   // appId:'wxd470058f4535a61d', //mammachoice
				    timestamp:json.timestamp,
				    nonceStr: json.nonceStr,
				    signature: json.signature,
				    jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo','onMenuShareQZone']
				});

				var shareObject = {
					title: '给我一个吻，可以不可以？',
					desc: '情人节快到啦，快来亲亲我吧！',
					link: wx_url,
					imgUrl: route
					
				};
				var shareFriend={
					title:'给我一个吻，可以不可以？',
					link: wx_url,
					imgUrl: route
				}
				wx.ready( function (){
					wx.onMenuShareTimeline(shareFriend);   //朋友圈
					wx.onMenuShareAppMessage(shareObject);  //朋友
				});
			}else{
				alert(json.description);
			}
			
		}
	});
	
}
