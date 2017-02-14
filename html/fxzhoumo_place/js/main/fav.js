require.config({
	paths:{
		'We':'../util/We',
		'config':'../common/config',
		'FastClick':'../lib/fastclick',
		'Panel':'../common/panel',
		'getPrefix':'../common/getPrefix',
		'Tip':'../util/tip',
		'FavElem':'../common/favElem',
		'doFav':'../common/doFav'
	}
})
require(['We','config','FastClick','Panel','FavElem','doFav','Tip'],function(We,config,FastClick,Panel,FavElem,doFav,Tip){

	var 
		longitude=We.cookie.get('longitude'),
		latitude=We.cookie.get('latitude'),
		opts={
			url:null,
			doFavURL:config.doFavURL,
			myFavURL:config.myFavURL,
			otherFavURL:config.otherFavURL,
			goType:We.getUrlParam('go')||0,
			teacherid:We.getUrlParam('id'),
			container:We.$('#box'),
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

	var createPage={

		init:function(){
			if(opts.teacherid==null){
				opts.url=opts.myFavURL;
			}else{
				opts.url=opts.otherFavURL;
			}
			this.render();
		},
		render:function(){
			var me=this;
			var param=me.createParam();
			We.ajaxRequest(opts.url,{
				send:param,
				completeListener:function(){
					var data=JSON.parse(this.responseText);
					if(data.code==="success"){
						if(!data.collect_user_nickname){
							data.myTitle="我喜欢的";
						}else{
							data.myTitle=data.collect_user_nickname+"喜欢的";
						}
						var html=We.template(opts.tpl.innerHTML,data);
						opts.container.innerHTML=html;
						me.bindEvent();
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

		},
		bindEvent:function(){
			var obj={
				backBtn:document.querySelector('.u-back'),//后退
				menuBtn:document.querySelector('.m-panelBtn'),//panel
			}
			this.toggleBackBtn(obj);
			
		},
		toggleBackBtn:function(obj){

			toggleMethod[opts.goType](obj);
		},

		createParam:function(){
			var obj={};
			var longitude=We.cookie.get('longitude');
			var latitude=We.cookie.get('latitude');
			obj.nowx=longitude;
			obj.nowy=latitude;
			if(opts.teacherid!=null){
				obj.teacherid=opts.teacherid;
			}
			return "servicestr="+JSON.stringify(obj);
		}
	};

	if(!latitude||!longitude){   //获取地理位置
		We.getLocation(); 
	}
	window.We=We;
	window.config=config;
	setZoom();
	createPage.init();

	doFav.start(document.body,opts.doFavURL);
})