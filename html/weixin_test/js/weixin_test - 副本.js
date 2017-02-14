// var openId='o7_dKt8CJINaGmM6G121dVWUBoc8';
var openId;
var userCode=GetQueryString("code");
// var userCode="hcudshfkfd";
//拿到code值
function GetQueryString(name) { 
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r!=null) return unescape(r[2]); return null; //返回参数值
}   //通过这个函数传递url中的参数名就可以获取到参数的值
function getStr(string,str){ 
    var str_before = string.split(str)[0]; 
    var str_after = string.split(str)[1]; 
    var aa=str_after.split('=');
    var picName=aa[0];
    return picName;
} 

$(function(){
	/*
	var themeH=$('.theme').height();
	$('.price').css('margin-top','1%');

	var hidden=$('.hidden').val();
	$('.love').bind('click',function(){
		if($('.fav').attr('src')=='../weixin_test_img/before1.png'){
			$('.fav').attr('src','../weixin_test_img/after1.png');
		}else{
			$('.fav').attr('src','../weixin_test_img/before1.png')
		}
	})
	*/
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
			alert("userCode:::"+userCode);
			var base_url=window.location.href;
			var wx_url=escape(base_url);
			window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx47987fa108b8329b&redirect_uri="+wx_url+"&response_type=code&scope=snsapi_base&state=1#wechat_redirect";
		}else{
			alert("userCode:"+userCode);
			$.ajax({
				url:'/IFestivalServlet?method=queryMoreTuCao',
				type:'post',
				data:'servicestr={"type":"1","code":"'+userCode+'","mobile":""}',
				success:function(data){
					var jsonData=eval("("+data+")");
					var commonarr=jsonData.commonFestivalCourseArray;
					if(jsonData.code=="success"){
						for(var i=0;i<commonarr.length;i++){
							if(commonarr[i].id==hidden&&commonarr[i].isFave==false){
								$('.fav').attr('src','../weixin_test_img/before1.png')
								return;
							}else{
								$('.fav').attr('src','../weixin_test_img/after1.png')
								return;
							}
						}

					}
					
				}
			})
			// alert('servicestr={"type":"1","code":"'+userCode+'"}');
			$.ajax({
				url:'/IFestivalServlet?method=queryTuCao',
				type:'post',
				async:false,
				data:'servicestr={"type":"1","code":"'+userCode+'"}',
				success:function(data){
					var obj=eval("("+data+")");
					if(obj.code=="success"){
						openId=obj.openId;
						// alert("openId"+openId);
					}
				}
			})

			//点击关注
			$('.love').on('touchstart',function(){
				// alert('发送请求了'+openId);
				// alert('servicestr={"type":"1","openId":"'+openId+'","faveId":"'+hidden+'"}');
				$.ajax({
					url:'/IFestivalServlet?method=addFave',
					type:'post',
					// async:false,
					data:'servicestr={"type":"1","openId":"'+openId+'","faveId":"'+hidden+'"}',
					success:function(data){
						var obj=eval("("+data+")");
						if(obj.code=="success"){
							if(obj.description=="已添加到喜欢 "){
								$('.fav').attr('src','../weixin_test_img/after1.png');	
							}else if(obj.description=="已取消喜欢 "){
								$('.fav').attr('src','../weixin_test_img/before1.png');
							}
							
						}
						
					}
				})
			})
		}
		
	}
	// */

})