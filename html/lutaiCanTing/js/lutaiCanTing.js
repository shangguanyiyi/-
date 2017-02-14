var browser = {
		versions: function() {
			var u = navigator.userAgent, app = navigator.appVersion;
			return {//移动终端浏览器版本信息 
				trident: u.indexOf('Trident') > -1, //IE内核
				presto: u.indexOf('Presto') > -1, //opera内核
				webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
				gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
				mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
				ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
				android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
				iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
				iPad: u.indexOf('iPad') > -1, //是否iPad
				webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
			};
		}(),
		language: (navigator.browserLanguage || navigator.language).toLowerCase()
	}
   
	if (browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) {
		//document.getElementById("alink").setAttribute("href","https://itunes.apple.com/cn/app/fa-xian-zhou-mo-mei-yi-ge/id972982647?l=en&mt=8s"); 
	}else if (browser.versions.android) {
  		//document.getElementById("alink").setAttribute("href","http://img.fxzhoumo.com/fxzhoumo_t3.apk"); 
	}

	function connectWebViewJavascriptBridge(callback) {
		if (window.WebViewJavascriptBridge) {
			callback(WebViewJavascriptBridge)
		} else {
			document.addEventListener('WebViewJavascriptBridgeReady', function() {
				callback(WebViewJavascriptBridge)
			}, false)
		}
	}
	
	
$(function(){
	var courseIdList=[5723,5810,5954,5576,5967,5648,5310,5632,5903,5778];
	var a=$('.section a');
	for(var i=0;i<a.length;i++){
		// $(a[i]).attr('id','activity'+i);
		$(a[i]).attr('href','http://www.fxzhoumo.com/detail/course.html?courseid='+courseIdList[i]);
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
    // var courseIdList=[3085,3086];
    
    if(isWeixin){
    	$('.fuchuang').show();
    }else{
    	if(browser.versions.ios || browser.versions.iPhone || browser.versions.iPad){
				connectWebViewJavascriptBridge(function(bridge) {
				var uniqueId = 1;	
					$('.section').bind("click",function(e){
						var t_id = $(e.target).attr('id');
						// var t_id = $(this).attr('id');
						var count = t_id.substr(8,1);
						var data = '{"activityID":'+courseIdList[count]+',"activityTitle":"学习一下"}'									
						bridge.send(data, function(responseData) {										
						})
						e.preventDefault(); 
					})

				
			})
		}else if(browser.versions.android){
				
				$('.section').bind("click",function(e){
					var t_id = $(e.target).attr('id');
					var count = t_id.substr(8,1);
					window.FXZMAndroidJavaScript.jumpToDetailActivity(courseIdList[count]);  //安卓
					e.preventDefault(); 
				})

				

		}
    }
})