require.config({
	paths:{
		'We':'../util/We',
		'config':'../common/config',
		'FastClick':'../lib/fastclick',
		'Panel':'../common/panel',
		'getPrefix':'../common/getPrefix'
	}
})
require(['We','config','FastClick','Panel'],function(We,config,FastClick,Panel){

	var 
		opts={
			url:null,
			msgListURL:config.msgListURL,
			goType:We.getUrlParam('go')||0,
			container:We.$('#container'),
			tpl:We.$("#tpl")
		},
		setZoom=function(){
			var width=window.innerWidth;
			var zoom=width/375;
			zoom=zoom>=2?1:zoom;
			document.body.style.zoom=zoom;
		};


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

	var  createPage={

		init:function(){
			this.toggleBackBtn();
			this.render();
		},
		toggleBackBtn:function(){
			var obj={
				backBtn:document.querySelector('.u-back'),//后退
				menuBtn:document.querySelector('.m-panelBtn'),//panel
			}
			toggleMethod[opts.goType](obj);
		},
		render:function(){
			var me=this;
			We.ajaxRequest(opts.msgListURL,{
				completeListener:function(){
					var data=JSON.parse(this.responseText);
					if(data.code==="success"){
						var html=We.template(opts.tpl.innerHTML,data);
						opts.container.innerHTML=html;
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
				},
				errorListener:function(){
					alert('请求异常!');
				}
			})
		}
	}
	window.config=config;//将config对象挂载到window下,解析模板需要用到此对象
	setZoom();
	createPage.init();

})