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
			joinURL:config.myJoinURL,
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

	var createPage={

		init:function(){
			this.render();
			this.bindEvent();
		},
		render:function(){
			var me=this;
			var param=me.createParam();
			We.ajaxRequest(opts.joinURL,{
				send:param,
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

	var success=function(){

		var favid=this.favid;
		var elems=document.querySelectorAll('[favid="'+favid+'"]');
		[].forEach.call(elems,function(elem){
			var changeBgElem=elem.querySelector('.changeBgElem');
			var changeTextElem=elem.querySelector('.changeTextElem');
			changeBgElem.style.backgroundPositionY="0px";
			var num=0;
			changeTextElem&&(num=parseInt(changeTextElem.innerText));
			changeTextElem&&(changeTextElem.innerText=++num);
		})
		
	}

	var cancel=function(){
		var favid=this.favid;
		var elems=document.querySelectorAll('[favid="'+favid+'"]');
		[].forEach.call(elems,function(elem){
			var changeBgElem=elem.querySelector('.changeBgElem');
			var changeTextElem=elem.querySelector('.changeTextElem');
			changeBgElem.style.backgroundPositionY="-25px";
			var num=0;
			changeTextElem&&(num=parseInt(changeTextElem.innerText));
			changeTextElem&&(--num>0?(changeTextElem.innerText=num):(changeTextElem.innerText=0));
		})
	}

	doFav.start(document.body,opts.doFavURL,success,cancel);
})