require.config({
	paths:{
		'We':'../util/We',
		'config':'../common/config',
		'FastClick':'../lib/fastclick',
		'Panel':'../common/panel',
		'getPrefix':'../common/getPrefix',
		'Tip':'../util/tip'
	}
})
require(['We','config','FastClick','Panel','Tip'],function(We,config,FastClick,Panel,Tip){


	var 
		opts={
			url:null,
			voucherListURL:config.voucherListURL,
			goType:We.getUrlParam('go')||0,
			container:We.$('#vouContainer'),
			tpl:We.$("#tpl"),
			infoTpl:We.$("#infoTpl")
		},
		addVouURL=config.addVouURL,
		addBtn=We.$("#inputVouBtn"),
		addValue=We.$("#inputVouValue"),
		setZoom=function(){
			var width=window.innerWidth;
			var zoom=width/375;
			zoom=zoom>=2?1:zoom;
			document.body.style.zoom=zoom;
		};


	var toggleMethod={

		1:function(obj){
			obj.backBtn.classList.remove('dn');
			obj.menuBtn.classList.add('dn');
			We.addEvent(obj.backBtn,"click",function(){
				window.history.go(-1);
			});
		},
		0:function(obj){
			var panelOpts={
				url:config.loadUserInfoURL,
				btn:We.$('.m-panelBtn')[0],
				panel:We.$('.g-panel')[0],
				needMove:[We.$('.g-head')[0],We.$('#container')],
				userImage:We.$('.u-headImg')[0],
				userInfo:We.$('.u-name')[0],
				userMsgNum:We.$('.msgNum')[0],
				userDesc:We.$('.u-des')[0]
			};
			obj.backBtn.classList.add('dn');
			obj.menuBtn.classList.remove('dn');
			var panel=new Panel(panelOpts);
		}

	}

		var  createPage={

		init:function(){
			this.toggleBackBtn();
			this.bindAddVouEvent();
			this.render();
		},
		toggleBackBtn:function(){
			var obj={
				backBtn:document.querySelector('.u-back'),//后退
				menuBtn:document.querySelector('.m-panelBtn'),//panel
			}
			toggleMethod[opts.goType](obj);
		},
		bindAddVouEvent:function(){
			var me=this;
			var flag=false;
			We.addEvent(addBtn,"click",function(){
				if(flag)return;
				var flag=true;
				var value=addValue.value;
				if(!value){
					Tip({
						elem:this,
						msg:'验证码格式不正确'
					})
					flag=false;
					return;
				}
				var obj={};
				obj.codenum=value;
				var str="servicestr="+JSON.stringify(obj);
				We.ajaxRequest(addVouURL,{
					send:str,
					completeListener:function(){
						var data=JSON.parse(this.responseText);
						if(data.code=='success'){
							window.location.reload();
						}else{
							Tip({
								elem:me,
								msg:data.description
							})
						}
					}
				})

			})
		},
		render:function(){
			var me=this;
			We.ajaxRequest(opts.voucherListURL,{
				completeListener:function(){
					var data=JSON.parse(this.responseText);
					if(data.code==="success"){
						var tpl=opts.infoTpl.innerHTML+opts.tpl.innerHTML+"</div>";
						var html=We.template(tpl,data);
						opts.container.innerHTML=html;
					}else{
						try{
							var url=window.location.href;
							sessionStorage.setItem("oldURL",url);
							window.location.replace("../login/login.html");
						}catch(e){
							var url=window.location.href;
							window.location.replace("../login/login.html");
						}
					}
				},
				errorListener:function(){
					alert('请求异常!');
				}
			})
		}
	}
	window.We=We;
	window.config=config;//将config对象挂载到window下,解析模板需要用到此对象
	createPage.init();


})