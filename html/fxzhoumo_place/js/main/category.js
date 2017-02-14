require.config({
	paths:{
		'We':'../util/We',
		'ImageLazyLoad':'../util/ImageLazyLoad',
		'config':'../common/config',
		'FastClick':'../lib/fastclick',
		'pageInit':'../common/pageInit',
		'util':'../util/util',
		'Tip':'../util/tip',
		'FavElem':'../common/favElem',
		'doFav':'../common/doFav'

	},
	shim:{
		'ImageLazyLoad':{
			exports:'ImageLazyLoad'
		}
	}
})

require(['We','config','FastClick','ImageLazyLoad','pageInit','Tip','FavElem','doFav'],function(We,config,FastClick,ImageLazyLoad,pageInit,Tip,FavElem,doFav){

	var doFavURL=config.doFavURL;
	
	var title=['全部','吃货集合','喝个水饱','玩个痛快','乐享生活','学点什么'];
	var createPage={
		opts:{},
		init:function(opts){
			FastClick.attach(document.body);
			var titleIndex=We.getUrlParam('coursetype');
			opts.titleIndex=titleIndex;
			var title=We.getUrlParam("title");
			opts.title.innerText=title;
			We.addEvent(opts.back,'click',function(){
				window.location.href='list.html';
			});
			this.opts=opts;
			this.createHtml(opts);
		},
		createHtml:function(opts){
			var me=this;
			var param=pageInit.getParam(opts.titleIndex);
			We.ajaxRequest(opts.url,{
				send:param,
				completeListener:function(){
					var resp=JSON.parse(this.responseText);
					me.appendHtml(resp);
					pageInit.init(me.opts);
				}
			})
		},
		appendHtml:function(data){
			var itemTpl=We.$(this.opts.itemTpl).innerHTML;
			var itemHtml=We.template(itemTpl,data);
			this.opts.itemContainer.innerHTML=itemHtml;
			
		}

	}

	var pageindex=0,
		longitude=We.cookie.get('longitude'),
		latitude=We.cookie.get('latitude'),
		opts={
			title:We.$('.u-title')[0],
			back:We.$('.u-back')[0],
			url:config.searchbycoursetypeURL,
			itemContainer:We.$('#page'),
			itemTpl:'#itemTpl'
		};
	if(!latitude||!longitude){
		We.getLocation();
	}
	createPage.init(opts);
	doFav.start(document.body,doFavURL);
	window.We=We;
	window.config=config;
});