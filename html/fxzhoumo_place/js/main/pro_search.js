require.config({
	paths:{
		'We':'../util/We',
		'config':'../common/config',
		'FastClick':'../lib/fastclick'
	}
})
require(['We','config','FastClick'],function(We,config,FastClick){
	FastClick.attach(document.body);
	
	document.querySelector('.g-head').addEventListener('click',function(){
		window.history.go(-1);
	},false);
	
	var opts={
		getCode:"#codeBtn",
		mobile:"#mobile",
		getCodeURL:config.getProCodeURL,
		searchURL:config.getProSearchURL
	}
	
	function addGetCodeEvent(){
		var getCode=We.$(opts.getCode);
		var time=null;
		var num=300;
		We.addEvent(getCode,'click',function(){
			var me=this;
			var mob=We.$(opts.mobile);
			var pattern=new RegExp(mob.getAttribute('data-pattern'));
			if(!pattern.test(mob.value)){
				var oldType=mob.type;
				mob.type="text";
				mob.setAttribute('oldType',oldType);
				mob.value="手机号格式错误";
				return;
			}
			if(this.getAttribute('isGet')==1)return;
			this.setAttribute('isGet',1);
			var param={
				mobile:mob.value
			}
			if(!!!time){
				We.ajaxRequest(opts.getCodeURL,{
					send:"servicestr="+JSON.stringify(param),
					completeListener:function(){
						var obj=JSON.parse(this.responseText);
						if(obj.code==="success"){
							me.innerText='验证码已发送';
						}else{
							alert("获取验证码失败,请稍后再试!");
						}
					}
				})
			}
			time=setInterval(function(){
				if(num<=0){
					clearInterval(time);
					time=null;
					num=300;
					me.innerText="获取验证码";
					me.setAttribute('isGet',0);
					return;
				}
				me.innerText=num+"秒后重新获取";
				num--;
			},1000);
		})
	}
	var mob=We.$(opts.mobile);
	We.addEvent(mob,'focus',function(){
				if(this.type==="text"){
					var oldType=this.getAttribute('oldType');
					this.type=oldType;
					this.value="";
				}
			})
	addGetCodeEvent();
	
	var numArea=document.querySelector(".numArea");
	var btn=document.querySelector("#btn");
	var num=document.querySelector("#num");
	var seat=document.querySelector("#seat");
	btn.addEventListener("click",function(){
		
		var mv=mob.value;
		var code=We.$("#code").value;
		var obj={
			mobile:mv,
			password:code
		}
		
		var servicestr="servicestr="+JSON.stringify(obj);
		
		We.ajaxRequest(opts.searchURL,{
			send:servicestr,
			completeListener:function(){
				var data=JSON.parse(this.responseText);
				if(data.code=="success"){
					num.innerHTML=data.now_hav_count;
					seat.innerHTML=data.now_paihang;
					numArea.style.display="block";
				}else{
					alert(data.description);
				}
			}
		})
		
	},false);

})