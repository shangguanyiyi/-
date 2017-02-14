require.config({
	paths:{
		'We':'../util/We',
		'config':'../common/config',
		'FastClick':'../lib/fastclick',
		'Validate':'../util/validate',
		'Tip':'../util/tip',
		'wxUtil':'../util/wxUtil',
		'util':'../util/util',
		'loadHtml':"loadHtml"
	}
})
require(['We','config','FastClick','Validate','Tip','wxUtil','loadHtml',"util"],function(We,config,FastClick,Validate,Tip,wxUtil,loadHtml,_){
	
	FastClick.attach(document.body);
	window.We=We;
	var 
		saveURL=config.wx_saveWithdrawURL,
		getBillURL=config.wx_findBillURL,
		getCodeURL=config.wx_getWithdrawURL,
		amountEL=We.$("#hasMoney"),
		tpl=We.$('#tpl'),
		form=We.$('#loginForm'),
		tbody=document.querySelector('tbody'),
		code=We.getUrlParam('code')||"",
		typeEl=We.$("#withdraw_type"),
		btn=document.querySelector(".m-loginBtn");



	var setZoom=function(){
			var width=window.innerWidth;
			var zoom=width/375;
			zoom=zoom>=2?1:zoom;
			document.body.style.zoom=zoom;
	}


	var getFormValue=function(form){
		var obj={};
		var elements=form.elements;
		var i,len;
		for(i=0,len=elements.length;i<len;i++){
			var elem=elements[i];
			if(elem.type!=="submit"){
				obj[elem.name]=elem.value;
			}
		}
		return obj;
	}

	function toggleCash(){

		var btn=We.$('#hasNeedWrapper');
		var btn2=We.$('#notNeedWrapper');
		var need=btn.querySelector('label');
		var noNeed=btn2.querySelector('label');
		We.addEvent(btn,'click',function(){
			need.style.backgroundPositionY="-65px";
			noNeed.style.backgroundPositionY="0";
			typeEl.value=1;
		})

		We.addEvent(btn2,'click',function(){
			noNeed.style.backgroundPositionY="-65px";
			need.style.backgroundPositionY="0";
			typeEl.value=2;
		})

	}

	var page={

		init:function(){
			this.getOrderBill();
		},
		getOrderBill:function(){
			var me=this;
			var param=this.createParam();
			We.ajaxRequest(getBillURL,{
				send:param,
				completeListener:function(){
					var obj=JSON.parse(this.responseText);
					if(obj.code=="success"){
						if(obj.iswithdraw==1){
							var html=We.template(tpl.innerHTML,obj);
							tbody.innerHTML=html;
							loadHtml.init({
								form:form,
								pageIndex:2,
								url:getBillURL,
								tpl:tpl,
								container:tbody
							});
							me.bindWithdraw();
							addGetCodeEvent();
							document.querySelector("#hasMoney").value=obj.user_balance;
						}else{
							btn.value="此账户不是提现账户";
							btn.style.background="#999";
						}
					}else{
						Tip({
							elem:btn,
							msg:obj.description
						})
					}
				}
			})
		},
		createParam:function(){
			var obj=getFormValue(form);
			obj.withdraw_type=parseInt(obj.withdraw_type);
			obj.cash=parseInt(obj.cash)||0;
			obj.code=code;
			obj.pageindex=1;
			return "servicestr="+JSON.stringify(obj);
		},
		bindWithdraw:function(){
			var me=this;
			var flag=true;
			We.addEvent(form,'submit',function(e){
				e.preventDefault();
				if(!flag)return;
				flag=false;
				var param=me.createParam();
				We.ajaxRequest(saveURL,{
					send:param,
					completeListener:function(){
						var obj=JSON.parse(this.responseText);
						/*Tip({
							elem:btn,
							msg:obj.description
						});*/
						alert(obj.description);
						flag=true;
					}
				})
			})

		}

	}



	function addGetCodeEvent(){
		var getCode=We.$("#getCode");
		var time=null;
		var num=300;
		We.addEvent(getCode,'click',function(){
			var me=this;
			if(this.getAttribute('isGet')==1)return;
			this.setAttribute('isGet',1);
			var param={
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
				}
				me.innerText=num+"秒后重新获取";
				num--;
			},1000);
		})
	}

	toggleCash();
	We.addEvent(form,'submit',function(e){e.preventDefault();});
	wxUtil.setZoom();

	page.init();


})