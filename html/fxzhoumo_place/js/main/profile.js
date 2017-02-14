require.config({
	paths:{
		'We':'../util/We',
		'config':'../common/config',
		'FastClick':'../lib/fastclick',
		'Tip':'../util/tip',
		'FavElem':'../common/favElem',
		'doFav':'../common/doFav'
	}
})
require(['We','config','FastClick','FavElem','doFav','Tip'],function(We,config,FastClick,FavElem,doFav,Tip){

	var opts={
				url:config.getOtherUserDetailURL,
				doFavURL:config.doFavURL,
				back:document.querySelector('.u-back'),
				tpl:document.querySelector('#infoTpl'),
				container:document.querySelector("#g-screen")
			},
		id=We.getUrlParam('userid');
	var setZoom=function(){
			var width=window.innerWidth;
			var zoom=width/375;
			zoom=zoom>=2?1:zoom;
			document.body.style.zoom=zoom;
	}
	FastClick.attach(document.body);
	setZoom();

	window.We=We;
	window.config=config;
	var param={};
	param.course_teacher_id=Number(id)||0;
	var str="servicestr="+JSON.stringify(param);
	We.ajaxRequest(opts.url,{
		send:str,
		completeListener:function(){
			var data=JSON.parse(this.responseText);
			if(data.code=="success"){
				var html=We.template(opts.tpl.innerHTML,data);
				opts.container.innerHTML=html;
				bindEvent();
			}else{
				alert(data.description);
			}
		}
	})

	function bindEvent(){

		document.querySelector('.u-back').addEventListener('click',function(){
			window.history.go(-1);
		})
		fav();
	}

	function fav(){
		var success=function(){
			this.changeBgElem.style.backgroundPositionY="0";
			this.changeBgElem.parentNode.style.backgroundColor="#ccc";
			this.changeTextElem.innerText="已喜欢";
		}
		var cancel=function(){
			this.changeBgElem.style.backgroundPositionY="-26px";
			this.changeBgElem.parentNode.style.backgroundColor="#00c8c8";
			this.changeTextElem.innerText="喜欢";
		}
		doFav.start(document.body,opts.doFavURL,success,cancel);
	}

})