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


	var 
		loginOutURL=config.loginOutURL,
		goType=We.getUrlParam('go')||0,
		backBtn=We.$('.u-back')[0],
		menuBtn=We.$('.m-panelBtn')[0],
		setZoom=function(){
			var width=window.innerWidth;
			var zoom=width/375;
			zoom=zoom>=2?1:zoom;
			document.body.style.zoom=zoom;
		};

	FastClick.attach(document.body);

	var toggleMethod={

		1:function(obj){
			obj.backBtn.classList.remove('dn');
			obj.menuBtn.classList.add('dn');
			We.addEvent(obj.backBtn,"click",function(){
				window.history.go(-1);
			});
		},
		0:function(obj){
			var panelOpts={
				url:config.loadUserInfoURL,
				btn:We.$('.m-panelBtn')[0],
				panel:We.$('.g-panel')[0],
				needMove:[We.$('.g-head')[0],We.$('#container')],
				userImage:We.$('.u-headImg')[0],
				userInfo:We.$('.u-name')[0],
				userMsgNum:We.$('.msgNum')[0],
				userDesc:We.$('.u-des')[0]
			};
			obj.backBtn.classList.add('dn');
			obj.menuBtn.classList.remove('dn');
			var panel=new Panel(panelOpts);
		}
	}

	setZoom();
	window.We=We;
	window.config=config;
	toggleMethod[goType]({
		backBtn:backBtn,
		menuBtn:menuBtn
	});

	We.ajaxRequest(config.loadUserInfoURL,{
		completeListener:function(){
			var obj=JSON.parse(this.responseText);
			if(obj.code!='success'){
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

	We.addEvent(We.$('#loginOut'),"click",function(){

		We.ajaxRequest(loginOutURL,{
			completeListener:function(){
				var data=JSON.parse(this.responseText);
				if(data.code=="success"){
					window.location="../index.html";
				}else{
					window.location="../login/login.html";
				}
			},
			errorListener:function(){
				alert("请求失败");
			}
		})

	})

})