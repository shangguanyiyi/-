require.config({
	paths:{
		'We':'../util/We',
		'config':'../common/config',
		'FastClick':'../lib/fastclick',
		'Panel':'../common/panel',
		'getPrefix':'../common/getPrefix'
	}
})
require(['We','config','FastClick','Panel','getPrefix'],function(We,config,FastClick,Panel){

	var opts={
				url:config.loadUserInfoURL,
				tpl:document.querySelector('#tpl'),
				container:document.querySelector("#g-screen")
			};
	var setZoom=function(){
			var width=window.innerWidth;
			var zoom=width/375;
			zoom=zoom>=2?1:zoom;
			document.body.style.zoom=zoom;
	}
	setZoom();
	We.ajaxRequest(opts.url,{
		completeListener:function(){
			var data=JSON.parse(this.responseText);
			if(data.code=="success"){
				var html=We.template(opts.tpl.innerHTML,data);
				opts.container.innerHTML=html;
				bindEvent();
			}else{
				try{
					var url=window.location.href;
					sessionStorage.setItem("oldURL",url);
					window.location.replace("../login/login.html");
				}catch(e){
					var url=window.location.href;
					window.location.replace("../login/login.html");
				}
			}
		}
	})

	function bindEvent(){

		document.querySelector('.u-back').addEventListener('click',function(){
			window.history.go(-1);
		})

		var opts={
			url:config.loadUserInfoURL,
			btn:We.$('.m-panelBtn')[0],
			panel:We.$('.g-panel')[0],
			needMove:[We.$('.g-head')[0],We.$('#container')],
			userImage:We.$('.u-headImg')[0],
			userInfo:We.$('.u-name')[0],
			userMsgNum:We.$('.msgNum')[0],
			userDesc:We.$('.u-des')[0]
		}
		var panel=new Panel(opts);
	}

	window.config=config;
})