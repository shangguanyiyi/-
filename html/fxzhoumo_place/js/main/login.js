require.config({
	paths:{
		'We':'../util/We',
		'config':'../common/config',
		'FastClick':'../lib/fastclick',
		'Validate':'../util/validate',
		
	}
})
require(['We','config','FastClick','Validate'],function(We,config,FastClick,Validate){
		FastClick.attach(document.body);
	var 
		longitude=We.cookie.get('longitude'),
		latitude=We.cookie.get('latitude'),
		opts={
				loginURL:config.loginURL,
				registerURL:config.registerURL,
				modifyURL:config.modifyPwdURL,
				getCodeURL:config.getCodeURL,
				loginForm:document.querySelector('#loginForm'),
				registerForm:document.querySelector('#registerForm'),
				modifyForm:document.querySelector('#modifyForm'),
				backBtn:document.querySelector('.u-back'),
				mobile:'#account',
				pwd:'#pwd',
				pwd2:'#pwd2',
				getCode:'#getCode',
				passCode:'#passCode',
				recommendCode:"#recommendCode"
			};
	var goType=We.getUrlParam('goType');
	var isCodeLogin=false;//是否验证码登陆


	var referrer=window.document.referrer;
	if(referrer&&referrer!=window&&referrer.indexOf('sign')!=-1){

		try{
			sessionStorage.setItem('oldURL',referrer);
		}catch(e){

		}
	}

	

	function listenerFormSubmit(form,callback,url,submitCallBack){

		We.addEvent(form,'submit',function(e){
			e.preventDefault();
			var msg=Validate(form);
			if(msg&&msg.flag){
				var oldType=msg.elem.type;
				msg.elem.setAttribute("oldType",oldType);
				msg.elem.type="text";
				msg.elem.value=msg.errorMsg;
			}else{
				if(callback)callback(url,submitCallBack);
			}
		})
	}

	function createParam(passCode,pwd,pwd2){
		var param={};
		param.mobile=We.$(opts.mobile).value;
		if(isCodeLogin){
			param.password=passCode.value;
		}else{
			param.password=pwd.value;
		}
		
		if(!pwd2){
			param.userx=We.cookie.get('latitude');
			param.usery=We.cookie.get('longitude');
			param.facility="";
			param.facilituNum="";
		}else{
			param.dynamic_password=passCode.value;
			param.verify_password=pwd2.value;
		}
		var recommendCode=We.$(opts.recommendCode);
		param.user_recommendnum=recommendCode&&recommendCode.value;
		return "servicestr="+JSON.stringify(param);
	}

	function formSubmit(url,submitCallBack){
		var pwd2=We.$(opts.pwd2);
		var pwd=We.$(opts.pwd);
		var getCode=We.$(opts.getCode);
		var passCode=We.$(opts.passCode);
		if(pwd2){
			var pwd2=We.$(opts.pwd2);
			if(pwd.value!=pwd2.value){
				pwd.value="两次密码不一致";
				pwd2.value="";
				return;
			}
			if(passCode.value==""||passCode.value.length!=6){
				passCode.value="验证码错误";
				return;
			}
		}
		var param=createParam(passCode,pwd,pwd2);
		if(isCodeLogin){
			url=config.userCodeLoginURL;
		}
		We.ajaxRequest(url,{
			send:param,
			completeListener:submitCallBack
		})
	}

	function loginCallBack(){
		var obj=JSON.parse(this.responseText);
		if(obj.code==='success'){

			try{
				if(sessionStorage.getItem('oldURL')){
					var oldURL=sessionStorage.getItem('oldURL');
					window.location.href=oldURL;
					return;
				}
			}catch(e){
				window.location.replace("../center/center.html");
				return;
			}
			if(goType){
				window.location.replace('../center/center.html');
				return;
			}

			var url=window.document.referrer;
			if(url&&url!=window){
				window.location.replace(url);
				return;
			}else{
				window.location.replace("../center/center.html");
				return;
			}
		}else{
			alert(obj.description);
		}
	}

	function registerCallBack(title){

		return function(){
			var obj=JSON.parse(this.responseText);
			if(obj.code==='success'){

				if(title=="注册"){
					alert(title+"成功,点击跳转登录");
					window.location.href="login.html?goType=1";
				}else{
					window.location.href="success.html";
				}
				
			}else{
				alert(obj.description);
			}
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
	window.We=We;
	window.config=config;
	if(!latitude||!longitude){
		We.getLocation(); 
	}
	opts.backBtn.addEventListener('click',function(){
		window.history.go(-1);
	},false)
	if(opts.loginForm){

		listenerFormSubmit(opts.loginForm,formSubmit,opts.loginURL,loginCallBack);
		addFocusEvent(opts.loginForm);
		var doCode=We.$("#doCode");
		var passCodeBtn=document.querySelector(".u-passCode");
		var customCode=document.querySelector('.u-pwd');
		We.addEvent(doCode,'click',function(){
			if(isCodeLogin){
				passCodeBtn.classList.add('dn');
				customCode.classList.remove('dn');
				this.innerText="动态密码登陆";
				isCodeLogin=false;
			}else{
				passCodeBtn.classList.remove('dn');
				customCode.classList.add('dn');
				isCodeLogin=true;
				this.innerText="普通密码登陆";
			}
		})

		addGetCodeEvent();
	}
	if(opts.registerForm){
		listenerFormSubmit(opts.registerForm,formSubmit,opts.registerURL,registerCallBack("注册"));
		addFocusEvent(opts.registerForm);
		addGetCodeEvent();
	}
	if(opts.modifyForm){
		listenerFormSubmit(opts.modifyForm,formSubmit,opts.modifyURL,registerCallBack("修改"));
		addFocusEvent(opts.modifyForm);
		addGetCodeEvent();
	}

	
})