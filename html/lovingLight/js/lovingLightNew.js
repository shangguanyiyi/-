// var imgURL='http://img.fxzhoumo.com/';
var imgURL='http://img.mammachoice.com/';
$(function(){
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
		$('.weixin_save').show();
		$('.fuchuang').show();
		$('.pop_save').hide();
		$('.pic_text').show();
	}else{
		$('.pop_save').hide();
		$('.weixin_save').hide();
		$('.pic_text').hide();
	}

	function getStr(string,str){ 
	    var str_before = string.split(str)[0]; 
	    var str_after = string.split(str)[1]; 
	    var aa=str_after.split('&');
	   
	    var picName=aa[0];
	     // console.log(picName);
	    return picName;

	} 

	$('.pop_share').bind('click',function(){
		$('.mask').show();
	})
	var lianjie=window.location.href;
	// var picAddress=".com/";
	// var picAddress="picture=http://img.fxzhoumo.com/";
	var picAddress="picture=http://img.mammachoice.com/";
	var pic=getStr(lianjie,picAddress);
	// var pic="dfghjk";
	console.log(pic);

	$('.picSave img').attr('src',''+imgURL+pic+'');

	wx_url=escape(window.location.href);
	    $.ajax({
	        url:"/WeixinServlet?method=weixinPower",
	        type:"post",
	        data:'servicestr={"wei_url":"'+wx_url+'"}',  
	        dataType:"html",
	        success:function(data){
	            var json = eval("("+data+")");
	            if(json.code=="success"){
	                wx.config({
	                    debug: false, 
	                    appId: 'wx47987fa108b8329b', 
	                   // appId:'wxd470058f4535a61d', //mammachoice
	                    timestamp:json.timestamp,
	                    nonceStr: json.nonceStr,
	                    signature: json.signature,
	                    jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo','onMenuShareQZone']
	                });

	                var shareObject = {
	                    title: '喂，我有句话想告诉你！',
	                    desc: '快点开看，趁我还没有后悔。',
	                    link: window.location.href,
	                    imgUrl: 'http://www.fxzhoumo.com/operation/lovingLight_img/share.jpg'
	                };
	                var shareFriend={
	                    title:'喂，我有句话想告诉你！',
	                    link: window.location.href,
	                    imgUrl: 'http://www.fxzhoumo.com/operation/lovingLight_img/share.jpg'
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
})