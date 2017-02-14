require.config({
	paths:{
		'We':'../util/We',
		'ImageLazyLoad':'../util/ImageLazyLoad',
		'swipe':'../util/swipe',
		'config':'../common/config',
		'FastClick':'../lib/fastclick',
		'Tip':'../util/tip',
		'Panel':'../common/panel',
		'util':'../util/util',
		'getPrefix':'../common/getPrefix',
		'pageInit':'../common/pageInit',
		'FavElem':'../common/favElem',
		'doFav':'../common/doFav'

	},
	shim:{
		'ImageLazyLoad':{
			exports:'ImageLazyLoad'
		}
	}
})
require(['We','config','FastClick','ImageLazyLoad','swipe','Tip','Panel','util','getPrefix','pageInit','FavElem','doFav'],function(We,config,FastClick,ImageLazyLoad,swipe,Tip,Panel,_,getPrefix,pageInit,FavElem,doFav){

var setZoom=function(){
		var width=window.innerWidth;
		var zoom=width/375;
		zoom=zoom>=2?1:zoom;
		document.body.style.zoom=zoom;
}

var slider=null;
var createPage={
	opts:{},
	init:function(option){
		FastClick.attach(document.body);
		//setZoom();
		this.opts=option;
		this.initPage(option);
	},
	initPage:function(opts){
		var me=this;
		var str=pageInit.getParam();
		We.ajaxRequest(opts.url,{
			send:str,
			completeListener:function(){
				var resp=JSON.parse(this.responseText);
				me.appendHtml(resp);
				pageInit.init(me.opts);
				me.createSlide(me.opts.adNavContainer.children.length);
				me.loadAdImg();
			}
		});
		var panel=new Panel(me.opts.panelOpts);
	},
	loadAdImg:function(){
		var imgs=this.opts.adContainer.querySelectorAll('img');
		var i,len;
		for(i=0,len=imgs.length;i<len;i++){
			(function(i){
				var img=imgs[i];
				var image=new Image();
				var src=img.getAttribute('feature-src');
				image.src=src;
				image.onload=function(){
					img.src=src;
				}
			})(i);
		}
	},
	appendHtml:function(data){
		var adTpl=We.$(this.opts.adTpl).innerHTML;
		var adhtml=We.template(adTpl,data);
		this.opts.adContainer.innerHTML=adhtml;
		var itemTpl=We.$(this.opts.itemTpl).innerHTML;
		var itemHtml=We.template(itemTpl,data);
		this.opts.itemContainer.innerHTML=itemHtml;
		this.bindFavEvent();
		var adNavTpl=We.$(this.opts.adNavTpl).innerHTML;
		var adNavHtml=We.template(adNavTpl,data);
		this.opts.adNavContainer.innerHTML=adNavHtml;
	},
	createSlide:function(length){
		var navList=this.opts.adNavContainer.children;
		slider=Swipe(We.$('#slider'),{
			auto:3000,
			callback:function(index){
				var len=navList.length,
					i=0;
				if(length==2){
					index=(index%2+2)%2;
					len=2;
				}
				for(;i<len;i++){
					if(i==index){
						We.addClass(navList[i],'active');
					}else{
						We.removeClass(navList[i],'active');
					}
				}
			}
		});
	},
	bindFavEvent:function(){
		
		doFav.start(this.opts.itemContainer,this.opts.favURL);
	}
}
var pageindex=0,
	longitude=We.cookie.get('longitude'),
	latitude=We.cookie.get('latitude'),
	opts={
	url:config.indexURL,
	favURL:config.doFavURL,
	adContainer:We.$('#featureArea'),
	adTpl:'#adTpl',
	adNavTpl:"#adNav",
	adNavContainer:We.$("#adNavContainer"),
	itemContainer:We.$('#page'),
	itemTpl:'#itemTpl',
	panelOpts:{
		url:config.loadUserInfoURL,
		btn:We.$('.m-panelBtn')[0],
		panel:We.$('.g-panel')[0],
		needMove:[We.$('.g-head')[0],We.$('#container')],
		userImage:We.$('.u-headImg')[0],
		userInfo:We.$('.u-name')[0],
		userMsgNum:We.$('.msgNum')[0],
		userDesc:We.$('.u-des')[0]
	}
};

if(!latitude||!longitude){
	We.getLocation();
}

window.We=We;
window.config=config;
createPage.init(opts);
var innerHeight=window.innerHeight;
var isBegin=false;
var fn=_.throttle(function(){

	var scroll=window.pageYOffset;
	if(scroll>innerHeight){
		slider&&slider.stop();
		isBegin=false;
	}else{
		if(!isBegin){
			slider.setDelay(10000);
			slider.begin();
			isBegin=true;
		}
		
	}

},200);

	We.addEvent(window,'scroll',fn);

	var jump=We.$("#jump");
	var bdBox=We.$("#bdBox");

	We.addEvent(jump,'click',function(){
		bdBox.parentNode.removeChild(bdBox);
		We.removeEvent(window,'touchmove',startFn);
	})
	var goType=We.getUrlParam('go');
	if(goType==1){
		bdBox.parentNode.removeChild(bdBox);
	}
	bdBox&&bdBox.classList.remove('dn');
	function startFn(e){
		e.preventDefault();
	}
	We.addEvent(window,'touchmove',startFn);

	var isWeiXin=(function(){
		return navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1
	})();

	if(isWeiXin){

		var android=document.querySelector('.android');
		var iPhone=document.querySelector('.iPhone');
		var toWap=document.querySelector('#toWap');
		We.addEvent(iPhone,'click',function(e){
			e.preventDefault();
			//toWap.style.display="block";
			window.location.href="http://a.app.qq.com/o/simple.jsp?pkgname=sm.xue";
			return false;
		})
		We.addEvent(android,'click',function(e){
			e.preventDefault();
			window.location.href="http://a.app.qq.com/o/simple.jsp?pkgname=sm.xue";
			//toWap.style.display="block";
			return false;
		})
/*		We.addEvent(toWap,'click',function(e){
			this.style.display="none";
			e.preventDefault();
		})*/

	}


});




