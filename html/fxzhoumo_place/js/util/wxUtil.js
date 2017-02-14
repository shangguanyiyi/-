define(['We'],function(We){


	return{

		setZoom:function(){
			var width=window.innerWidth;
			var zoom=width/375;
			zoom=zoom>=2?1:zoom;
			document.body.style.zoom=zoom;
		},
		getOpenId:function(opts){
			var code=We.getUrlParam('code');
			var url=window.location.href;
			var me=this;
			var obj={};
			obj.wei_code=code;
			obj.wei_url=escape(url);
			We.ajaxRequest(opts.getOpenIdURL,{
				send:"servicestr="+JSON.stringify(obj),
				completeListener:function(){
					var data=JSON.parse(this.responseText);
					if(data.code==="success"){
						opts.openidEl.value=data.openid;
					}else{
						alert(data.description);
					}	
				}
			})
		}
	}
})