require.config({
	paths:{
		'We':'../util/We',
		'config':'../common/config',
		'FastClick':'../lib/fastclick',
		'ImageLazyLoad':'../util/ImageLazyLoad',
		'util':'../util/util'
	},
	shim:{
		'ImageLazyLoad':{
			exports:'ImageLazyLoad'
		}
	}
})
require(['We','config','FastClick','ImageLazyLoad','util'],function(We,config,FastClick,ImageLazyLoad,_){

	FastClick.attach(document.body);
	window.config=config;
	var dissertationid=We.getUrlParam("dissertationid"),
		findDissertationURL=config.findDissertationURL,
		tpl=We.$("#tpl"),
		container=We.$("#g-screen"),
		close=".u-back";


	var setZoom=function(){
			var width=window.innerWidth;
			var zoom=width/375;
			zoom=zoom>=2?1:zoom;
			document.body.style.zoom=zoom;
	}

	setZoom();



		function createParam(){
			var obj={};
			obj.dissertationid=parseInt(dissertationid);
			return "servicestr="+JSON.stringify(obj);
		}

	We.ajaxRequest(findDissertationURL,{

		send:createParam(),
		completeListener:function(){

			var data=JSON.parse(this.responseText);

			if(data.code=="success"){
				var html=We.template(tpl.innerHTML,data);
				container.innerHTML=html;
				var closeBtn=We.$(close)[0];
				We.addEvent(closeBtn,'click',function(){
					window.history.go(-1);
				})
				document.title=data.dissertation_title;

				ImageLazyLoad.init({
					offset:window.innerHeight
				});
				var imgFn=_.throttle(function(){
					ImageLazyLoad.refresh();
				},200);
				We.addEvent(window,'scroll',imgFn);
			}else{
				alert(data.description);
			}
		}
	})

})