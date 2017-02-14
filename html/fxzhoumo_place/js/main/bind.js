require.config({
	paths:{
		'We':'../util/We',
		'config':'../common/config',
		'FastClick':'../lib/fastclick',
		'Validate':'../util/validate',
		'Tip':'../util/tip',
		'wxUtil':'../util/wxUtil'
	}
})
require(['We','config','FastClick','Validate','Tip','wxUtil'],function(We,config,FastClick,Validate,Tip,wxUtil){
	
	FastClick.attach(document.body);

	var 
		bindURL=config.wx_bindURL,
		code=We.getUrlParam('code')||"",
		getCodeURL=config.wx_getDynamicURL,
		getPowerURL=config.wx_getPowerURL;

/*	var wei_url=window.location.href;
	var obj={wei_url:escape(wei_url)}
	We.ajaxRequest(getPowerURL,{
		send:"servicestr="+JSON.stringify(wei_url),
		completeListener:function(){
			var data=JSON.parse(this.responseText);
			if(data.code=="success"){
				wx.config({
				    debug: false,
				    appId: 'wx47987fa108b8329b', 
				    timestamp:data.timestamp, 
				    nonceStr: data.nonceStr, 
				    signature: data.signature,
				    jsApiList: [ 'closeWindow']
				});
			}else{
				alert(data.description);
			}
		}
	})*/

	var setZoom=function(){
			var width=window.innerWidth;
			var zoom=width/375;
			zoom=zoom>=2?1:zoom;
			document.body.style.zoom=zoom;
	}

	var opts={
		mobile:'#account',
		getCode:'#getCode',
		passCode:'#passCode',
		loginForm:document.querySelector('#loginForm'),
		bindBtn:document.querySelector(".m-loginBtn")
	}

	function addGetCodeEvent(){
		var getCode=We.$(opts.getCode);
		var time=null;
		var num=300;
		var codeFlag=true;
		We.addEvent(getCode,'click',function(){
			if(!codeFlag)return;
			codeFlag=false;
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
			var param={
				mobile:mob.value,
				code:code
			}
			if(!!!time){
				We.ajaxRequest(getCodeURL,{
					send:"servicestr="+JSON.stringify(param),
					completeListener:function(){
						var obj=JSON.parse(this.responseText);
						if(obj.code==="success"){
							me.innerText='验证码已发送';
						}else{
							alert(obj.description);
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
					codeFlag=true;
				}
				me.innerText=num+"秒后重新获取";
				num--;
			},1000);
		})
	}
	var flag=true;
	function listenerFormSubmit(form,callback,url,submitCallBack){


		We.addEvent(form,'submit',function(e){
			e.preventDefault();
			if(!flag)return;
			flag=false;
			var msg=Validate(form);
			if(msg&&msg.flag){
				var oldType=msg.elem.type;
				msg.elem.setAttribute("oldType",oldType);
				msg.elem.type="text";
				msg.elem.value=msg.errorMsg;
				flag=true;
			}else{
				if(callback)callback(url,submitCallBack);
			}
		})
	}

	function createParam(){
		var obj={};
		var code=We.getUrlParam('code')||"";
		var mobile=document.querySelector("#account").value;
		var passCode=document.querySelector("#passCode").value;
		var iswithdrawEl=document.querySelector('input[name="isNeedCash"]:checked');
		obj.code=code;
		obj.mobile=mobile;
		obj.password=passCode;
		if(iswithdrawEl){
			obj.iswithdraw=parseInt(iswithdrawEl.value)||0;
		}else{
			obj.iswithdraw=0;
		}
		return "servicestr="+JSON.stringify(obj);
	}

	function formSubmit(url,submitCallBack){
		var param=createParam();
		We.ajaxRequest(url,{
			send:param,
			completeListener:submitCallBack
		})
	}

	function submitCallBack(){
		var data=this.responseText;
		var obj=JSON.parse(data);
		if(obj.code=="success"){
			alert(obj.description);
			// setTimeout(function(){
			// 	wx.closeWindow();
			// },0)
		}else{
			flag=true;
			alert(obj.description);
		}
		
	}

	function addFocusEvent(form){
		var elems=form.elements;
		for(var i=0;i<elems.length;i++){
			We.addEvent(elems[i],'focus',function(){
				if(this.type==="text"){
					var oldType=this.getAttribute('oldType');
					this.type=oldType;
					this.value="";
				}
			})
		}
	}

	function toggleCash(){

		var btn=We.$('#hasNeedWrapper');
		var btn2=We.$('#notNeedWrapper');
		var need=btn.querySelector('label');
		var noNeed=btn2.querySelector('label');
		We.addEvent(btn,'click',function(){
			need.style.backgroundPositionY="-65px";
			noNeed.style.backgroundPositionY="0";
		})
		We.addEvent(btn2,'click',function(){
			noNeed.style.backgroundPositionY="-65px";
			need.style.backgroundPositionY="0";
		})
	}


	toggleCash();
	wxUtil.setZoom();
	addFocusEvent(opts.loginForm);
	We.addEvent(opts.loginForm,'submit',function(e){e.preventDefault();});
	var checkURL=config.wx_checkBindURL;
	var obj={code:code};
	We.ajaxRequest(checkURL,{
		send:"servicestr="+JSON.stringify(obj),
		completeListener:function(){
			var data=JSON.parse(this.responseText);
			if(data.code=="success"){
				addGetCodeEvent();
				listenerFormSubmit(opts.loginForm,formSubmit,bindURL,submitCallBack);
			}else{
				Tip({
					elem:opts.bindBtn,
					msg:data.description
				});
				opts.bindBtn.value="已绑定";
				opts.bindBtn.style.background="#999";
			}
		}
	})
	


})