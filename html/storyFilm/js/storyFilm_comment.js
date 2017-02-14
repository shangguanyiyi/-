var userCode=GetQueryString("code");
var openId;
var commonFestivalArr=[];
var index=1;
var isLogin;
var wayPhone;
var countdown=60;
var str;
var time=null;
var browserType;
var base_url="http://www.fxzhoumo.com/operation/storyFilm/storyFilm_comment.html";
// var base_url="http://192.168.0.83/storyFilm/storyFilm/storyFilm_comment.html";
function getStr(string,str){ 
    var str_before = string.split(str)[0]; 
    var str_after = string.split(str)[1]; 
    var aa=str_after.split('&');
    var picName=aa[0];
    return picName;
} 	
function GetQueryString(name) { 
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r!=null) return unescape(r[2]); return null; //返回参数值
}   //通过这个函数传递url中的参数名就可以获取到参数的值


function showPage(){
	//窗口的高度+看不见的顶部的高度=屏幕低部距离最顶部的高度  
    var thisButtomTop = parseInt($(window).height()) + parseInt($(window).scrollTop());  
    var thisTop = parseInt($(window).scrollTop()); //屏幕顶部距离最顶部的高度
    for(var j=0;j<commonFestivalArr.length;j++){
 
    	}
}

function watchMore(){
	$.ajax({
		url:'/IFestivalServlet?method=queryMoreTuCao',
		type:'post',
		data:'servicestr={"type":"'+browserType+'","code":"'+userCode+'","mobile":"'+wayPhone+'"}',
		success:function(data){
			var json=eval("("+data+")");
			console.log(json);
			
			if(json.code=="success"){
				openId=json.openId;
				isLogin=json.isLogin;
				// top.location="storyFilm_comment.html";
				var dataFestivalArr=json.festivalCourseArray;
				commonFestivalArr=json.commonFestivalCourseArray;
				
				for(var i=0;i<dataFestivalArr.length;i++){
					if(dataFestivalArr[i].isFave==false){
						isFaveImg='../storyFilm_img/before.png';
					}else{
						isFaveImg='../storyFilm_img/after.png';
					}
					/*
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
					*/
					var rightHeight=$('#fav'+dataFestivalArr[i].id).height();
					var imgHeight=$('.img_exprise').height();
					var distance=(rightHeight-(imgHeight/2))/2;
					console.log(distance);
					$('#exprise_'+dataFestivalArr[i].id).css("margin-top",distance);
					var id=dataFestivalArr[i].id;
					// addFave(id);
				}

			
				for(var j=0;j<commonFestivalArr.length;j++){
					if(commonFestivalArr[j].isFave==false){
						isFaveImg='../storyFilm_img/before.png';
					}else{
						isFaveImg='../storyFilm_img/after.png';
					}
					$('.commomText').append(getcommonData(id,j));
					var rightHeight=$('#more_'+commonFestivalArr[j].id).height();
					var imgHeight=$('.amazed').height();
					var distance=(rightHeight-(imgHeight/2))/2;
					$('#amazed_'+commonFestivalArr[j].id).css("margin-top",distance);
					var commentId=commonFestivalArr[j].id;
					commentIdFun(commentId);
					// var id=commonFestivalArr[j].id;
					// addFave(id);
				}

			}
		}
	})
}
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
		// document.getElementById("cancle").value=0;
		// document.getElementById("hidden").value=0;
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

function getIndexData(id,index){
	$.ajax({
		url:'/IFestivalServlet?method=selectMoreTuCao',
		type:'post',
		data:'servicestr={"type":"'+browserType+'","index":'+index+',"openId":"'+openId+'"}',
		success:function(data){
			var jsonMore=eval("("+data+")");
			console.log(jsonMore);
			if(jsonMore.code=="success"){
				if(jsonMore.commonFestivalCourseArray!=''){
					commonFestivalArr=commonFestivalArr.concat(jsonMore.commonFestivalCourseArray);
				}else{
					index--;
					return;
				}
				var startIndex=(index-1)*20;
				for(var j=startIndex;j<commonFestivalArr.length;j++){
					if(commonFestivalArr[j].isFave==false){
						isFaveImg='../storyFilm_img/before.png';
					}else{
						isFaveImg='../storyFilm_img/after.png';
					}
					
					$('.commomText').append(getcommonData(id,j));
					var rightHeight=$('#more_'+commonFestivalArr[j].id).height();
					var imgHeight=$('.amazed').height();
					var distance=(rightHeight-(imgHeight/2))/2;
					$('#amazed_'+commonFestivalArr[j].id).css("margin-top",distance);
					var commentId=commonFestivalArr[j].id;
					commentIdFun(commentId);
					// var id=commonFestivalArr[j].id;
					// addFave(id);
			       showPage();

				}
			}
		}
	})
}

function getcommonData(id,j){
	var str1='<div class="sigle_comment sigle_comment'+j+'"><div class="left"><img class="amazed" id="amazed_'+commonFestivalArr[j].id+'" src="../storyFilm_img/amazed.png" alt=""></div>';
	var str2=str1+'<div class="right" id="more_'+commonFestivalArr[j].id+'"><div class="text_comment">'+commonFestivalArr[j].content+'</div>';
	var str3=str2+'<div class="divHeart"><img class="heart" id="second_'+commonFestivalArr[j].id+'" src="'+isFaveImg+'" alt="'+commonFestivalArr[j].isFave+'">';
	var str4=str3+'<p id="faveSum_'+commonFestivalArr[j].id+'">'+commonFestivalArr[j].faveCount+'</p></div></div></div>';
	return str4;
}

/*
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
*/

function bb(commentId){
	$.ajax({
		url:'/IFestivalServlet?method=addFave',
		type:'post',
		data:'servicestr={"type":"'+browserType+'","openId":"'+openId+'","faveId":"'+commentId+'"}',
		success:function(data){
			console.log(data);
			var obj=eval("("+data+")");
			if(obj.code=="success"){
				// alert(obj.description);
				if(obj.description=="已添加到喜欢 "){
					$('#second_'+commentId).attr('src','../storyFilm_img/after.png');
					var add=$('#faveSum_'+commentId).text();
					add++;
					$('#faveSum_'+commentId).text(add);
				}else if(obj.description=="已取消喜欢 "){
					$('#second_'+commentId).attr('src','../storyFilm_img/before.png');
					var reduce=$('#faveSum_'+commentId).text();
					reduce--;
					$('#faveSum_'+commentId).text(reduce);
				}
			}

		}
	})
}

function commentIdFun(commentId){
	$('#second_'+commentId).bind('click',function(){
		if(userCode==null||userCode==""){
			if(isLogin==true){//APP已登录状态
				openId="";
				bb(commentId);
				
			}else{//APP未登录状态 弹窗显示
				validate();
			}
		}else{//微信浏览器
			bb(commentId);
		}
	})
}

$(function(){
	var href=window.location.href;
	var cutStr=".html?phone=";
	wayPhone=getStr(href,cutStr);
	if(userCode==null||userCode==""){//普通浏览器
		$('.fuchuang').hide();
		browserType=0;
		watchMore();
	}else{//微信浏览器
		$('.fuchuang').show();
		browserType=1;
		watchMore();
	}

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
		if(userCode==null||userCode==""){
			wx_url=escape(base_url+"?phone="+phone);
			window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx47987fa108b8329b&redirect_uri="+wx_url+"&response_type=code&scope=snsapi_base&state=1#wechat_redirect";	
		}
	}

})

$(window).bind("scroll", function(event){
    showPage();
    scrollTop=$(document).scrollTop();//滚动条
    var bottomTop=$(document).height()-$(window).height(); //文档高度减去屏幕高度
    if(scrollTop>=bottomTop){        		
      	index+=1;
      	var e=commonFestivalArr[index-1];
      	var commomId= e.id;
      	getIndexData(commomId,index);
	}       
})
