require.config({
	paths:{
		'We':'../util/We',
		'config':'../common/config',
		'FastClick':'../lib/fastclick',
		'wxUtil':'../util/wxUtil'
	}
})
require(['We','config','FastClick','wxUtil'],function(We,config,FastClick,wxUtil){

	window.We=We;

	var code=We.getUrlParam('code')||"",
		orderbill_id=We.getUrlParam('orderid'),
		url=config.wx_findOrderDetailURL,
		container=document.getElementById('content'),
		tpl=document.getElementById('tpl');

	var obj={};
	obj.code=code;
	obj.orderbill_id=parseInt(orderbill_id)||0;
	var param="servicestr="+JSON.stringify(obj);

	wxUtil.setZoom();
	We.ajaxRequest(url,{
		send:param,
		completeListener:function(){
			var obj=JSON.parse(this.responseText);
			if(obj.code=="success"){
				var html=We.template(tpl.innerHTML,obj);
				container.innerHTML=html;
			}else{
				alert(obj.description);
			}
		}
	})

document.querySelector('.u-back').addEventListener('click',function(){
					window.history.go(-1);
			},false);







})