require.config({
	paths:{
		'We':'../util/We',
		'config':'../common/config',
		'FastClick':'../lib/fastclick'
	}
})
require(['We','config','FastClick'],function(We,config,FastClick){
	FastClick.attach(document.body);
	
	var isWeiXin=(function(){
		return navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1
	})();
	
	if(isWeiXin){
		document.querySelector(".g-btn2").style.display="block";
		var to=document.querySelector("#to"),
			shadow=document.querySelector(".shadow");
		to.addEventListener('click',function(){
			shadow.style.display="table";
		},false)
		shadow.addEventListener("click",function(){
			this.style.display="none";
		})
	}else{
		document.querySelector(".g-btn1").style.display="block";
	}


})