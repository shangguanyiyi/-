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

    //在微信里出现遮罩层
      function is_weixin() {
        var ua = navigator.userAgent.toLowerCase();
          if (ua.match(/MicroMessenger/i) == "micromessenger") {
            return true;
           } else {
            return false;
           }
      }
      var courseIdList = [5621, 5620, 5147, 5623, 1799,5299,5613];
      // var courseIdList = [3085, 5620, 5147, 5623, 1799,5299,3086];

      $(function(){

	      //判断不在微信浏览器  

	  		for(var i=0;i<7;i++){
	  			$(".contain").append('<a class="pic'+i+'" id="pic'+i+'" href="http://www.fxzhoumo.com/detail/course.html?courseid='+courseIdList[i]+'"></a>');
			}
			
			if(is_weixin()){//微信浏览器
				
			}else{
				if(browser.versions.ios || browser.versions.iPhone || browser.versions.iPad){
	  				connectWebViewJavascriptBridge(function(bridge) {
						var uniqueId = 1;	
							$('.contain').bind("click",function(e){
								
								var t_id = $(e.target).attr('id');
								var count = t_id.substr(3,1);
								var data = '{"activityID":'+courseIdList[count]+',"activityTitle":"学习一下"}'									
								bridge.send(data, function(responseData) {										
								})
								e.preventDefault(); 
							})
					})
				}else if(browser.versions.android){
						
						$('.contain').bind("click",function(e){
							var t_id = $(e.target).attr('id');
							var count = t_id.substr(3,1);
							window.FXZMAndroidJavaScript.jumpToDetailActivity(courseIdList[count]);  //安卓
							e.preventDefault(); 
						})
				}
			}				

	  });
	
	