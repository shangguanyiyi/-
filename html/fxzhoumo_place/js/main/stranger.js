require.config({
	paths:{
		'We':'../util/We',
		'config':'../common/config',
		'FastClick':'../lib/fastclick'
	}
})
require(['We','config','FastClick'],function(We,config,FastClick){

	var opts={
				url:config.questUserDetailURL,
				back:document.querySelector('.u-back'),
				tpl:document.querySelector('#infoTpl'),
				container:document.querySelector("#info")
			},
		id=We.getUrlParam('userid');
	var setZoom=function(){
			var width=window.innerWidth;
			var zoom=width/375;
			zoom=zoom>=2?1:zoom;
			document.body.style.zoom=zoom;
	}
	setZoom();
	opts.back.addEventListener('click',function(){
		window.history.go(-1);
	})
	var param={};
	param.quest_userid=Number(id)||0;
	var str="servicestr="+JSON.stringify(param);
	We.ajaxRequest(opts.url,{
		send:str,
		completeListener:function(){
			var data=JSON.parse(this.responseText);
			if(data.code=="success"){
				var html=We.template(opts.tpl.innerHTML,data);
				opts.container.innerHTML=html;
			}else{
				alert(data.description);
			}
		}
	})

	window.We=We;
	window.config=config;

})