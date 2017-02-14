require.config({
	paths:{
		'We':'../util/We',
		'ImageLazyLoad':'../util/ImageLazyLoad',
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
require(['We','config','FastClick','ImageLazyLoad','Tip','Panel','util','getPrefix','pageInit','FavElem','doFav'],function(We,config,FastClick,ImageLazyLoad,Tip,Panel,_,getPrefix,pageInit,FavElem,doFav){

var pageindex=0,
	longitude=We.cookie.get('longitude'),
	latitude=We.cookie.get('latitude'),
	opts={
		url:config.searchByTagURL,
		doFavURL:config.doFavURL,
		container:We.$("#g-screen"),
		headTpl:"#headTpl",
		itemTpl:'#itemTpl',
		teacherid:We.getUrlParam('id')
	},
	setZoom=function(){
			var width=window.innerWidth;
			var zoom=width/375;
			zoom=zoom>=2?1:zoom;
			document.body.style.zoom=zoom;
	};


pageInit.getParam=function(){
	var longitude=We.cookie.get('longitude'),
		latitude=We.cookie.get('latitude'),
		obj={};
	obj.nowx=latitude;
	obj.nowy=longitude;
	obj.pageindex=++pageindex;
	obj.teacherid=parseInt(opts.teacherid);
	var str="servicestr="+JSON.stringify(obj);
	return str;
}	
var createPage={
	opts:{},
	init:function(){
		FastClick.attach(document.body);
		this.initPage();
	},
	initPage:function(){
		var me=this;
		var str=pageInit.getParam();
		We.ajaxRequest(opts.url,{
			send:str,
			completeListener:function(){
				var resp=JSON.parse(this.responseText);
				me.appendHtml(resp);
				me.bindEvent();
				opts.itemContainer=We.$('#page');
				pageInit.init(opts);
			}
		});
	},
	appendHtml:function(data){
		var tpl=We.$(opts.headTpl).innerHTML+We.$(opts.itemTpl).innerHTML+"</div>";
		var html=We.template(tpl,data);
		opts.container.innerHTML=html;
	},
	bindEvent:function(){

		document.querySelector('.u-back').addEventListener('click',function(){
			window.history.go(-1);
		},false);
		var success=function(){
			this.changeBgElem.style.backgroundPositionY="0px";
			this.changeBgElem.parentNode.style.backgroundColor="#ccc";
			this.changeTextElem.innerText="已喜欢";
		}
		var cancel=function(){
			this.changeBgElem.style.backgroundPositionY="-26px";
			this.changeBgElem.parentNode.style.backgroundColor="#00c8c8";
			this.changeTextElem.innerText="喜欢";
		}
		var teacherBtn=document.querySelector('#teacherFavBtn');
		var page=document.querySelector("#page");
		doFav.start(teacherBtn,opts.doFavURL,success,cancel);
		doFav.start(page,opts.doFavURL);
	}
}


if(!latitude||!longitude){
	We.getLocation();
}
window.We=We;
window.config=config;
setZoom();
createPage.init();


	
});


