	var userCode=GetQueryString("code");
  // var userCode="sdfghjklf";
  var openId;
  // var openId='o7_dKt8CJINaGmM6G121dVWUBoc8';
  var isLogin;
  var browserType;
  var index=0;
  var dataFestivalArr=[];
  // var imgUrl="http://img.mammachoice.com/";
var imgUrl="http://img.fxzhoumo.com/";

function GetQueryString(name) { 
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r!=null) return unescape(r[2]); return null; //返回参数值
}   //通过这个函数传递url中的参数名就可以获取到参数的值

function is_weixin() {
		var ua = navigator.userAgent.toLowerCase();
		if (ua.match(/MicroMessenger/i) == "micromessenger") {
			return true;
		} else {
			return false;
		}
	}

var isWeinxin=is_weixin();
var isFaveImg;
var headphoto;
function firstAccess(){
 	// alert('servicestr={"type":"'+browserType+'","code":"'+userCode+'"}');
 	$.ajax({
		url:'/IFestivalServlet?method=queryTuCao',
		type:'post',
		data:'servicestr={"type":"'+browserType+'","code":"'+userCode+'"}',
		success:function(data){
			// alert("data:"+data);
			var obj=eval("("+data+")");
			
			if(obj.code=="success"){
				console.log(obj);
				dataFestivalArr=obj.festivalCourseArray;
				isLogin=obj.isLogin;
				openId=obj.openId;
				// alert("openId:"+openId);
				
				if(isLogin==false){//未登录
					$('.phone_submit').show();
					$('.phone_submit2').hide();
					$('.submit').bind('touchstart',function(){
						var phone=$('.phone').val();
						var tel_RegExp = /^1[3|4|5|7|8]\d{9}$/;
						if(!(tel_RegExp.test(phone))){
							alert("请正确填写手机号");
							return;
						}
						openId="";
						submitBtn();
					})
				}else if(isLogin==true){
					$('.phone_submit').hide();
					$('.phone_submit2').show();
					$('.submit2').bind('touchstart',function(){
						openId="";
						mobile="";
						submitBtn();
					})
				}else{//没有传isLogin的时候  微信
					$('.phone_submit').show();
					$('.phone_submit2').hide();
					$('.submit').bind('click',function(){
						var phone=$('.phone').val();
						var tel_RegExp = /^1[3|4|5|7|8]\d{9}$/;
						if(!(tel_RegExp.test(phone))){
							alert("请正确填写手机号");
							return;
						}
						submitBtn();
					})
				}
				

				for(var i=0;i<dataFestivalArr.length;i++){
					if(dataFestivalArr[i].isFave==false){
						isFaveImg='../timefirend_img/nolike.png';
					}else{
						isFaveImg='../timefirend_img/like.png';
					}

					if(dataFestivalArr[i].photo==""){
						headphoto='../timefirend_img/logo.png';
					}else{
						headphoto=imgUrl+dataFestivalArr[i].photo;
					}

					$('.leavewordsList').append('<div class="person person'+i+'">'+
		               '<div class="headImg">'+
		                    '<img src="'+headphoto+'" alt="">'+
		               '</div>'+
		               '<div class="info">'+
		                    '<div class="info_message">'+
		                        '<div class="name"><span>'+dataFestivalArr[i].nickName+'</span>留言</div>'+
		                        '<div class="fav" id="'+dataFestivalArr[i].id+'" onclick="addFave(this,id);">'+
		                            '<img id="'+dataFestivalArr[i].id+'" class="love" src="'+isFaveImg+'" alt=""><b id="favcount_'+dataFestivalArr[i].id+'">'+dataFestivalArr[i].faveCount+'</b>'+
		                        '</div>'+
		                    '</div>'+
		                   '<div class="text">'+dataFestivalArr[i].content+'<img class="up" src="../timefirend_img/up.png" alt=""></div>'+
		               '</div>'+
		           '</div>');

					var id=dataFestivalArr[i].id;
				}

				var last=$('.leavewordsList').children()[$('.leavewordsList').children().length-1];
				// $(last).css('border-bottom','1px solid transparent');
			
			}			
		}		
	})
}
//点击提交按钮需要执行的弹窗
function submitBtn(){
	var textareaText=$('.textarea').val();
	function clearBr(key) 
	{ 
	    key = key.replace(/[\r\n]/g, ""); 
	    return key; 
	}
	var textarea=clearBr(textareaText); 
	if(textarea==""){
		alert("你还没有写下感动你的瞬间呦~");
		return;
	}	
	var phone=$('.phone').val();
	$.ajax({
		url:'/IFestivalServlet?method=tuCao',
		type:'post',
		data:'servicestr={"type":"'+browserType+'","openId":"'+openId+'","mobile":"'+phone+'","content":"'+textarea+'"}',
		success:function(data){
			var jsonData=eval("("+data+")");
			if(jsonData.code=="success"){
				// window.location.reload();
				$('.success').show();
				$('.shareBtn').bind('click',function(){
					$('.tanchuang').hide();
					$('.close').hide();
					$('.shareBtn').hide();
					$('.mask').show();
					// window.location.reload();
					// $('.mask').bind('click',function(){
					// 	$('.success').hide();
					// 	window.location.reload();
					// })
				})
				
			}
		}
	})

}
//下拉的时候填充
function getdetails(id,i){
	if(dataFestivalArr[i].photo==""){
		headphoto='../timefirend_img/logo.png';
	}else{
		headphoto=imgUrl+dataFestivalArr[i].photo;
	}
	var str1='<div class="person person'+i+'"><div class="headImg"><img src="'+headphoto+'" alt=""></div>';
	var str2=str1+'<div class="info"><div class="info_message"><div class="name"><span>'+dataFestivalArr[i].nickName+'</span>留言</div>';
	var str3=str2+'<div class="fav" id="'+dataFestivalArr[i].id+'" onclick="addFave(this,id);"><img id="'+dataFestivalArr[i].id+'" class="love" src="'+isFaveImg+'" alt=""><b id="favcount_'+dataFestivalArr[i].id+'">'+dataFestivalArr[i].faveCount+'</b></div>';
	var str4=str3+'</div><div class="text">'+dataFestivalArr[i].content+'<img class="up" src="../timefirend_img/up.png" alt=""></div></div></div>';
	return str4;
}
//下拉加载更多
function seeMore(){
	$.ajax({
		url:'/IFestivalServlet?method=selectMoreTuCao',
		type:'post',
		data:'servicestr={"type":"'+browserType+'","index":'+index+',"openId":"'+openId+'"}',
		success:function(data){
			var jsonMore=eval("("+data+")");
			console.log(jsonMore);
			if(jsonMore.code=="success"){
				if(jsonMore.commonFestivalCourseArray!=''){
					dataFestivalArr=dataFestivalArr.concat(jsonMore.commonFestivalCourseArray);
				}else{
					index--;
					return;
				}

				var startIndex=(index-1)*20;
				if(startIndex==0){
					startIndex=5;
				}else{
					startIndex=startIndex-15;
				}
				for(var j=startIndex;j<dataFestivalArr.length;j++){
					if(dataFestivalArr[j].isFave==false){
						isFaveImg='../timefirend_img/nolike.png';
					}else{
						isFaveImg='../timefirend_img/like.png';
					}
					
					$(getdetails(id,j)).insertAfter($('.leavewordsList').children()[$('.leavewordsList').children().length-1]);
					// $(getdetails(id,j)).insertAfter($('.leavewordsList'));
					// $('.leavewordsList').append(getdetails(id,j))
					var id=dataFestivalArr[j].id;
				}


			}
		}
	})
	
}
//点赞按钮
function addFave(add,id){
	that = $(add);
	if(!isWeinxin){
		openId="";
	}
	// $('#fav_'+id).bind('click',function(){
		$.ajax({
			url:'/IFestivalServlet?method=addFave',
			type:'post',
			data:'servicestr={"type":"'+browserType+'","openId":"'+openId+'","faveId":"'+id+'"}',
			success:function(data){
				// console.log(data);
				var obj=eval("("+data+")");
				if(obj.code=="success"){
					// alert(obj.description);
					if(obj.description=="已添加到喜欢 "){
						that.find(".love").attr('src','../timefirend_img/like.png');
						var add=that.find('#favcount_'+id).text();
						add++;
						that.find('#favcount_'+id).text(add);
						console.log("添加")
					}else if(obj.description=="已取消喜欢 "){
						that.find(".love").attr('src','../timefirend_img/nolike.png');
						var reduce=that.find('#favcount_'+id).text();
						reduce--;
						that.find('#favcount_'+id).text(reduce);
						console.log("取消")
					}
				}

			}
		})
	// })
	
}

$(function(){
	$(document).scrollTop(0);
	if(isWeinxin){
		// alert('userCode:'+userCode);
		if(userCode==null||userCode==""){
			window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx47987fa108b8329b&redirect_uri=http://www.fxzhoumo.com/operation/timefirend/timefirend.html&response_type=code&scope=snsapi_base&state=1#wechat_redirect";
		}
		browserType=1;
		firstAccess();

		$('.close').bind('click',function(){//点击x号  弹窗关闭
			window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx47987fa108b8329b&redirect_uri=http://www.fxzhoumo.com/operation/timefirend/timefirend.html&response_type=code&scope=snsapi_base&state=1#wechat_redirect";
			$('.success').hide();
			
		})
			
	}else{
		browserType=0;
		userCode="";
		openId="";
		firstAccess();

		$('.close').bind('click',function(){//点击x号  弹窗关闭
			window.location.reload();
			$('.success').hide();
			
		})
	}


	
})

$(window).bind("scroll", function(event){
    scrollTop=$(document).scrollTop();//滚动条
    var bottomTop=$(document).height()-$(window).height(); //文档高度减去屏幕高度
    if(scrollTop>=bottomTop){ 
      	index+=1;
      	if(!isWeinxin){
      		openId="";
      	}
      	seeMore();
	}       
})
