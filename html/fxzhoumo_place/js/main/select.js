require.config({
	paths:{
		'We':'../util/We',
		'config':'../common/config',
		'FastClick':'../lib/fastclick'
	}
})
require(['We','config','FastClick'],function(We,config,FastClick){


	var 
		opts={
			url:null,
			findVoucherURL:config.findVoucherURL,
			goType:We.getUrlParam('go')||1,
			price:We.getUrlParam('price'),
			voucherid:We.getUrlParam('voucherid')||0,
			container:We.$('#container'),
			tpl:We.$("#tpl")
		},
		setZoom=function(){
			var width=window.innerWidth;
			var zoom=width/375;
			zoom=zoom>=2?1:zoom;
			document.body.style.zoom=zoom;
		};


	var toggleMethod={

		1:function(obj){
			We.addEvent(obj.backBtn,"click",function(){
				window.history.go(-1);
			});
		}
	}

		var  createPage={

		init:function(){
			this.toggleBackBtn();
			this.render();
		},
		toggleBackBtn:function(){
			var obj={
				backBtn:document.querySelector('.u-back'),//后退
			}
			toggleMethod[opts.goType](obj);
		},
		render:function(){
			var me=this;
			var param=this.createParam();
			We.ajaxRequest(opts.findVoucherURL,{
				completeListener:function(){
					var data=JSON.parse(this.responseText);
					if(data.code==="success"){
						var html=We.template(opts.tpl.innerHTML,data);
						opts.container.innerHTML=html;
					}else{
						alert(data.description);
					}
				},
				errorListener:function(){
					alert('请求异常!');
				}
			})
		},
		createParam:function(){
			var obj={};
			obj.price=parseFloat(opts.price);
			obj.voucherid=parseInt(opts.voucherid);
			return "servicestr="+JSON.stringify(obj);
		}
	}
	window.We=We;
	window.config=config;//将config对象挂载到window下,解析模板需要用到此对象
	createPage.init();


})