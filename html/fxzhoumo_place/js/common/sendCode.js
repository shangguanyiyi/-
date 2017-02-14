define(['We'],function(We){

	//opts:包括获取验证码的URL,获取验证码的时间间隔,获取验证码需要发送的参数 
/*	{
		num:
		url:
	}*/
	//createParam:创建请求验证码的参数
	//todo:成功发送验证码后的回调
	//redo:验证码获取的间隔时间到了以后的回调
	//errdo未成功发送验证码的回调

	var sendCode=function(opts,createParam,todo,redo,errdo){

		var time=null;
		var num=opts.num;
		var param=createParam&&createParam();
		return function(){
			var me=this;
			if(this.getAttribute('isGet')==1)return;
			this.setAttribute('isGet',1);
			if(!!!time){
				We.ajaxRequest(opts.url,{
					send:param,
					completeListener:function(){
						var data=JSON.parse(this.responseText);
						if(data.code==="success"){
							if(todo){
								todo.call(me,data);
							}
						}else{
							if(errdo){
								errdo.call(me,data);
							}
						}
					}

				})

			}
			time=setInterval(function(){

				if(num<=0){
					clearInterval(time);
					time=null;
					num=opts.num;
					me.innerText="获取验证码";
					me.setAttribute("isGet",0);
					if(redo){
						redo.call(me);
					}
					return;
				}
				me.innerText=num+"s后重新获取";
				num--;
			},1000);
		}
	}

	return sendCode;
})