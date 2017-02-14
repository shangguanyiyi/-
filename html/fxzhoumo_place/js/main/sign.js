require.config({
	urlArgs:'v=2.0',
	paths:{
		'We':'../util/We',
		'config':'../common/config',
		'FastClick':'../lib/fastclick',
		'Tip':'../util/tip',
		'util':'../util/util',
		'observer':'../util/observer',
		'Pop':'../common/pop',
		'signTpl':'signTpl'

	}
})
require(['We','config','FastClick','Tip','util','observer','Pop','signTpl'],function(We,config,FastClick,Tip,_,observer,Pop,signTpl){
	var 
		openid,
		sourceofpayment=11, //支付类型
		latitude=We.cookie.get('latitude'),
		longitude=We.cookie.get('longitude'),
		courseid=We.getUrlParam('courseid'),
		course_price_id=We.getUrlParam('course_price_id'),
		//toPayURL=config.toPayURL,
		toPayURL="/IOrderV2Servlet?method=toPayV3",
		getOpenIdURL=config.getOpenIdURL,
		toOrderDetailURL=config.toOrderDetailURL,
		findVoucherURL=config.findVoucherURL,
		getPayCodeURL=config.getPayCodeURL,
		orderTpl=We.$('#orderTpl'),
		voucherTpl=We.$('#voucherTpl'),
		orderContainer=We.$('#container'),
		voucherPage=We.$('#g-screen2'),
		voucherContainer=We.$('#container2'),
		isWeiXin=(function(){
			return navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1
		})(),
		setZoom=function(){
			var width=window.innerWidth;
			var zoom=width/375;
			zoom=zoom>=2?1:zoom;
			document.body.style.zoom=zoom;
		},
		timeToggleBtn="#timeToggleBtn",  //时间切换按钮
		timeSelectItems="#timeSelectItem",//课程选框容器
		totalPrice="#price",//选择的课程的总价
		discountPrice="#remainPrice",//选择课程的总价减去优惠券后的价格
		selectVoucherId="#selectVoucher",//选择优惠券的按钮
		voucherItem=".m-voucher",//优惠券
		back="#back",//优惠券页面关闭按钮
		voucherMoney="#voucherMoney",//选定优惠券后的显示内容
		toPayBtn="#toPay",
		reserveMobile="#reservedMobile",
		isSubmit=false;//判断是否重复提交

	var getOpenId={  //在微信中获取用户openid

		init:function(code,url){
			var me=this;
			var obj={};
			obj.wei_code=code;
			obj.wei_url=escape(url);
			We.ajaxRequest(getOpenIdURL,{
				send:"servicestr="+JSON.stringify(obj),
				completeListener:function(){
					var data=JSON.parse(this.responseText);
					if(data.code==="success"){
						me.trigger('ready',data);
					}else{
						alert(data.description);
					}	
				}
			})
		}
	}
	We.extend(getOpenId,observer);
	var currentOpenid;
	try{
		currentOpenid=sessionStorage.getItem('openid');
	}catch(e){
		alert('可能使用了无痕浏览,网页功能受限！');
	}
	
	if(!currentOpenid&&isWeiXin){
		var code=We.getUrlParam('code');
		var url=window.location.href;
		getOpenId.init(code,url);
	}


	var saveOpenId=(function(){
		getOpenId.on('ready',function(data){

			saveOpenId.save(data);
		})
		return {
			save:function(data){
				try{

					sessionStorage.setItem('openid',data.openid);

				}catch(e){
					alert('可能使用了无痕浏览,网页功能受限！');
				}
	
			}
		}

	})()



	var  page={    //初始渲染页面
		init:function(){
			this.render();
		},
		render:function(){
			var me=this;
			var param=this.createParam();
			We.ajaxRequest(toOrderDetailURL,{
				send:param,
				completeListener:function(){
					var data=JSON.parse(this.responseText);
					data.sourceofpayment=sourceofpayment;
					data.oldAmount=me.getOldAmount(data);
					data.remainAmount=me.getRemainAmount(data);
					//var html=We.template(orderTpl.innerHTML,data);
					var html=We.template(signTpl.signTpl,data);
					orderContainer.innerHTML=html;
					me.trigger('ready');
				},
				errorListener:function(){
					alert("请求失败");
				}
			})
		},
		createParam:function(){
			var obj={};
			obj.nowx=We.cookie.get('latitude');
			obj.nowy=We.cookie.get('longitude');
			obj.courseid=parseInt(courseid);
			obj.course_price_id=parseInt(course_price_id);//新增加的
			return "servicestr="+JSON.stringify(obj);
		},
		getOldAmount:function(data){
			var count=0;
			var arr=data.course_syllabus_arr;
			var price=data.course_price;
			for(var i=0;i<arr.length;i++){
				count=count+(arr[i].course_syllabus_reserve_count*price);
			}
			return count;
		},
		getRemainAmount:function(data){
			return data.oldAmount-data.voucher_money>=0?data.oldAmount-data.voucher_money:0;
		}
	}

	We.extend(page,observer);

	var togglePay=(function(){

		page.on('ready',function(){
			togglePay.toggle();
		})

		return {
			toggle:function(){

				if(isWeiXin){
					var aliPay=We.$("#aliPay");
					aliPay.parentNode.removeChild(aliPay);
					return;
				}
				var wxPay=We.$("#wxPay");
				wxPay.parentNode.removeChild(wxPay);
			}
		}


	})();



	var toggleTimeSelect=(function(){  //时间选框切换
		page.on('ready',function(){
			toggleTimeSelect.bindEvent();
		})
		return {
			bindEvent:function(){
				var btn=We.$(timeToggleBtn);
				var timeSelectItem=We.$(timeSelectItems);
				We.addEvent(btn,"click",function(){
					if(timeSelectItem.classList.contains('dn')){
						timeSelectItem.classList.remove('dn');
					}else{
						timeSelectItem.classList.add('dn');
					}
				})
			}
		}
	})();

	var itemCompetent=(function(){  //选择课程份数的组件

		var courseArr=[];
		page.on('ready',function(){
			itemCompetent.init();
		})

		return {
			init:function(){
				this.bindEvent();
			},
			bindEvent:function(){
				var me=this;
				var timeSelectItem=We.$(timeSelectItems);
				var list=timeSelectItem.querySelectorAll("li");
				for(var i=0;i<list.length;i++){
					var li=list[i];
					var obj=me.createItemOption(li);
					var course=new CourseItem(obj);
					course.init();
					course.on("change",function(arithmetical){
						this.arithmetical=arithmetical;
						me.trigger('change',this);
					})
					courseArr.push(course);
				}
			},
			createItemOption:function(li){
				var obj={};
				obj.remainEl=li.querySelector('.remains');
				obj.add=li.querySelector('.addBox');
				obj.sub=li.querySelector('.subBox');
				obj.inputEl=li.querySelector('input');
				obj.syllabusid=li.getAttribute("syllabusId");
				obj.price=li.getAttribute('price');
				obj.limit=li.getAttribute('limit');
				obj.parent=li.parentNode;
				return obj;
			},
			getCourseArr:function(){
				return courseArr;
			}
		}

	})();
	We.extend(itemCompetent,observer);

	var CourseItem=function(obj){  //课程对象
		this.parent=obj.parent;
		this.remainEl=obj.remainEl; //剩余份数
		this.addEl=obj.add;//增加按钮
		this.addBgEl=null;
		this.subBgEl=null;
		this.subEl=obj.sub;//减少按钮
		this.inputEl=obj.inputEl;//显示份数的区域
		this.syllabusid=obj.syllabusid;//对应的小课程ID
		this.amount=parseInt(this.remainEl.innerText)+(parseInt(this.inputEl.value)||0);//课程最初的总数
		this.price=obj.price;//课程单价
		if(obj.limit==0){
			obj.limit=9999;
		}
		this.limit=obj.limit;//课程最多购买份数
	}
	CourseItem.prototype={
		constructor:CourseItem,
		init:function(){
			this.bindEvent();
		},
		bindEvent:function(){
			var me=this;
			We.addEvent(this.addEl,"click",function(){
				var flag=me.doAdd();
				if(flag)me.trigger("change",1);
			
			});
			We.addEvent(this.subEl,'click',function(){
				var flag=me.doSub();
				if(flag)me.trigger("change",-1);
			})
		},
		doAdd:function(){
			var currentNum=parseInt(this.inputEl.value);
			if(currentNum==this.amount){
				Tip({
			 		elem:this.addEl,
			 		msg:"此课程仅有"+this.amount+"份",
			 		parent:this.parent
			 	})
				return false;
			}
			if(currentNum==this.limit){
				Tip({
			 		elem:this.addEl,
			 		msg:"此课程限购"+this.limit+"份",
			 		parent:this.parent
			 	})
			 	return false;
			}
			currentNum++;
			this.toggleSubBtnBg("on");
			if(currentNum==this.amount||currentNum==this.limit){
				this.toggleAddBtnBg("off");
			}
			this.inputEl.value=currentNum;
			var num=parseInt(this.remainEl.innerText);
			this.remainEl.innerText=--num;
			return true;
		},
		doSub:function(){
			var currentNum=parseInt(this.inputEl.value);
			if(currentNum<=0)return false;
			currentNum--;
			this.toggleAddBtnBg('on');
			if(currentNum<=0){
				this.toggleSubBtnBg('off');
			}
			this.inputEl.value=currentNum;
			var num=parseInt(this.remainEl.innerText);
			this.remainEl.innerText=++num;
			return true;
		},
		toggleAddBtnBg:function(status){
			var span=this.addBgEl||(this.addBgEl=this.addEl.querySelector('span'));
			this.toggleBtnBg[status](span);
		},
		toggleSubBtnBg:function(status){
			var span=this.subBgEl||(this.subBgEl=this.subEl.querySelector('span'));
			this.toggleBtnBg[status](span);
		},
		toggleBtnBg:{
			"off":function(span){
				span.style.backgroundPositionY="-1.1946666666666668rem";
			},
			"on":function(span){
				span.style.backgroundPositionY="-1px";
			}
		}
	}

	We.extend(CourseItem.prototype,observer);


	var amountPrice=(function(){  //选择课程份数后的总价
		var total=0;
		itemCompetent.on('change',function(item){
			amountPrice.setPrice(item);
		})
		return {
			setPrice:function(item){
				var oldPrice=parseFloat(We.$(totalPrice).innerText)||0;
				total=oldPrice;
				var price=parseFloat(item.price);
				var num=parseInt(item.inputEl.value);
				total=total+(price*item.arithmetical);
				We.$(totalPrice).innerText=total;
			}
		}
	})();


	var selectVoucher=(function(){ //选择优惠券

		var totalEl=null;
		var isLogin=true;
		page.on("ready",function(){
			selectVoucher.bindEvent();
		});
		return {
			bindEvent:function(){
				var me=this;
				var btn=We.$(selectVoucherId);
				var toLoginBtn=We.$("#toLogin");
				We.addEvent(btn,'click',function(){
					if(toLoginBtn)return;
					totalEl=totalEl||We.$(totalPrice);
					if(parseFloat(totalEl.innerText)==0||!parseFloat(totalEl.innerText)){
						Tip({
						 	elem:this,
						 	msg:"请先选择课程份数"
						 })
						return false;
					}
					me.getVoucherInfo(this);
				})
			},
			getVoucherInfo:function(elem){
				if(!isLogin)return;
				var me=this;
				var param=me.createParam();
				We.ajaxRequest(findVoucherURL,{
					send:param,
					completeListener:function(){
						var data=JSON.parse(this.responseText);
						if(data.code=="success"){
							me.createVoucher(data);
							return;
						}else if(data.code==="error_1"){
							isLogin=false;
						}
						Tip({
							elem:elem,
							msg:data.description
						});
					},
					errorListener:function(){
						Tip({
							elem:elem,
							msg:"请求失败"
						})
					}
				})
			},
			createVoucher:function(data){
				var obj={
					data:data,
					//tpl:voucherTpl,
					tpl:signTpl.voucherTpl,
					container:voucherPage,
					content:voucherContainer
				}
				var voucher=new Voucher(obj);
				voucher.init();
			},
			createParam:function(){
				var obj={};
				obj.price=parseFloat(totalEl.innerText);
				obj.voucherid=parseInt(We.$(voucherMoney).getAttribute("currentId"))||0;
				return "servicestr="+JSON.stringify(obj);
			}
		}
	})();

	var Voucher=function(obj){  //优惠券类
		this.data=obj.data;
		//this.tpl=obj.tpl;
		this.tpl=obj.tpl;
		this.el=obj.container;
		this.content=obj.content;
		this.voucherLimit=0;
		this.voucherId=0;
		this.voucherPrice=0;
	}
	We.extend(Voucher,observer);
	Voucher.prototype={
		constructor:Voucher,
		init:function(){
			var html=We.template(this.tpl,this.data);
			this.content.innerHTML=html;
			this.show();
			this.bindEvent();
		},
		show:function(){
			this.el.style.display="block";
		},
		close:function(){
			this.el.style.display="none";
			this.content.innerHTML="";
		},
		bindEvent:function(){
			var me=this;
			var backBtn=document.querySelector(back);
			var close=me.close.bind(this);
			We.addEvent(backBtn,"click",close);
			var vouchers=this.content.querySelectorAll(voucherItem);
			for(var i=0;i<vouchers.length;i++){
				var elem=vouchers[i];
				We.addEvent(elem,"click",function(){
					var isselect=this.getAttribute('isselect');
					if(isselect==0){
						me.isselect=1;
					}else{
						me.isselect=0;
					}
					me.voucherId=this.getAttribute('voucherId');
					me.voucherLimit=this.getAttribute('voucherLimit');
					me.voucherPrice=this.getAttribute('voucherPrice');
					me.close();
					We.removeEvent(backBtn,'click',close);
					Voucher.trigger('select',me);
				})
			}
		}
	}

	
	var remainPrice=(function(){  //使用优惠券后的课程总价格
		var total=0;
		var limitPrice=0;
		//var currentVoucherPrice=0;
		var voucherId=0;
		var oldSourceofpayment=0;
		if(isWeiXin){
			oldSourceofpayment=2;
		}else{
			oldSourceofpayment=11;
		}
		
		itemCompetent.on('change',function(item){
			remainPrice.setPrice(item);
		})
		Voucher.on('select',function(voucherItem){
			remainPrice.subPrice(voucherItem);
		})
		return {
			setPrice:function(item){
				var oldAmountPrice=parseFloat(We.$(totalPrice).innerText)||0;
				var oldRemainPrice=parseFloat(We.$(discountPrice).innerText)||0;
				if(oldAmountPrice==0){
					We.$(discountPrice).innerText=0;
					return;
				}
				total=oldRemainPrice;
				var price=parseFloat(item.price);
				//var num=parseInt(item.inputEl.value);				
				if(limitPrice>0&&oldAmountPrice<limitPrice){  //当总价改变不符合当前的优惠券的条件的时候,清除优惠券
					We.$(voucherMoney).innerText="";
					We.$(voucherMoney).setAttribute("currentId",0);
					We.$(discountPrice).innerText=oldAmountPrice;
				}else{
					total=total+(price*item.arithmetical);
					We.$(discountPrice).innerText=total;
				}
			
			},
			subPrice:function(voucherItem){
				var oldPrice=parseFloat(We.$(discountPrice).innerText)||0;
				var oldAmountPrice=parseFloat(We.$(totalPrice).innerText)||0;
				total=oldAmountPrice;
				limitPrice=voucherItem.voucherLimit;
				var newPrice=0;
				var dikou=0;
				if(voucherItem.isselect==1){
					newPrice=total-voucherItem.voucherPrice;
					if(newPrice<=0){
						sourceofpayment=0; //如果减去优惠券后价格小于零。支付方式变为优惠券支付
						newPrice=0;
						dikou=oldAmountPrice;
					}else{
						dikou=voucherItem.voucherPrice;
					}
					We.$(discountPrice).innerText=newPrice;
					We.$(voucherMoney).innerText="抵扣"+dikou+"元";				
					voucherId=voucherItem.voucherId;
					We.$(voucherMoney).setAttribute("currentId",voucherId);

				}else{
					sourceofpayment=oldSourceofpayment;
					var oldAmountPrice=parseFloat(We.$(totalPrice).innerText)||0;
					We.$(voucherMoney).innerText="";
					We.$(voucherMoney).setAttribute("currentId",0);
					We.$(discountPrice).innerText=oldAmountPrice;
				}
				
			},
			getVoucherId:function(){
				return voucherId;
			}
		}
	})()
	/*页面初始化*/
	if(!latitude||!longitude){
		We.getLocation();
	}
	if(isWeiXin){
		//openid=We.getUrlParam('code');
		sourceofpayment=2;
	}
	//setZoom();
	document.querySelector('.u-back').addEventListener('click',function(){
		window.history.go(-1);
	})

	window.We=We;
	window.config=config;
	window.weeks=["一","二","三","四","五","六","日"];
	page.init();
	/*页面初始化完成,开始绑定其他事件*/
	var createParam=(function(){  //创建提交订单信息参数

		getOpenId.on('ready',function(data){

			createParam.setOpenId(data.openid);
			
		})

		var servicestr={
			reserve_mobile:"",
			payCode:"",
			courseid:"",
			course_price_id:"",
			syllabusid_arr:[],
			voucherid:"",
			facility:"",
			facilityNum:"",
			userx:"",
			usery:"",
			sourceofpayment:""
		};

		return {

			create:function(payCode){
				var id=remainPrice.getVoucherId();
				var courseArr=itemCompetent.getCourseArr();
				var syllabusid_arr=[];
				for(var i=0;i<courseArr.length;i++){
					var course=courseArr[i];
					if(course.inputEl.value>0){
						var obj={};
						obj.course_syllabus_id=course.syllabusid;
						obj.course_syllabus_reserve_count=course.inputEl.value;
						syllabusid_arr.push(obj);
					}
				}
				servicestr.courseid=parseInt(courseid);
				servicestr.course_price_id=parseInt(course_price_id);
				servicestr.voucherid=parseInt(id);
				servicestr.reserve_mobile=We.$(reserveMobile).value;
				servicestr.syllabusid_arr=syllabusid_arr;
				servicestr.payCode=payCode;
				servicestr.sourceofpayment=sourceofpayment;
				servicestr.userx=We.cookie.get('latitude');
				servicestr.usery=We.cookie.get('longitude');
				try{
					var currentOpenid=sessionStorage.getItem('openid');
					if(currentOpenid&&isWeiXin){
						servicestr.openid=currentOpenid;
						servicestr.weixin_type=1;
					}
				}catch(e){
					alert('可能使用了无痕浏览,网页功能受限！');
				}
				
				return servicestr;
			},
			setOpenId:function(openid){
				 //alert(openid);
				servicestr.openid=openid;
				servicestr.weixin_type=1;
			}

		}
	})()
	
	
	var wxConfig=(function(){  //注入微信接口权限
		
		getOpenId.on('ready',function(data){
			
			wxConfig.init(data);
		})
		
		return {
			init:function(data){
					wx.config({
					    debug: false,
					    appId: 'wx47987fa108b8329b', 
					    timestamp:data.timestamp, 
					    nonceStr: data.nonceStr,
					    signature: data.signature,
					    jsApiList: [ 'chooseWXPay']
					});
			}
		}
	})()

	/*验证码弹窗内部事件*/
	var createSendEvent=function(pop){
		var mob=We.$(reserveMobile);
		var content=pop.el.querySelector('.pop-content');
		var codeInput=pop.el.querySelector('#payCode');
		var getCodeBtn=pop.el.querySelector('.pop-send');
		var sureBtn=pop.el.querySelector('.pop-sureBtn');
		var cancelBtn=pop.el.querySelector('.pop-cancelBtn');
		/*
		var div=document.createElement('div');
		div.innerText="验证码已发送至"+mob.value;
		div.classList.add('mt5');
		div.classList.add('tc');
		var time=null;
		var num=300;

		We.addEvent(getCodeBtn,"click",function(){
			var me=this;
			var mob=We.$(reserveMobile);
			if(this.getAttribute('isGet')==1)return;
			this.setAttribute('isGet',1);
			var param={
				reserve_mobile:mob.value
			}
			if(!!!time){
				We.ajaxRequest(getPayCodeURL,{
					send:"servicestr="+JSON.stringify(param),
					completeListener:function(){
						var obj=JSON.parse(this.responseText);
						if(obj.code==="success"){
							content.appendChild(div);
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
					content.removeChild(div);
					return;
				}
				me.innerText=num+"s后重新获取";

				num--;
			},1000);
		})
		
		We.addEvent(codeInput,'focus',function(){
			this.value="";
		})
		*/
		We.addEvent(sureBtn,"click",function(){
			if(isSubmit){
				Tip({
					elem:this,
					msg:"请不要重复提交",
					isFixed:true
				})
				return;
			}
			/*
			var payCode=codeInput.value;
			if(payCode==""||payCode.length!=6){
				codeInput.value="验证码输入错误";
				return ;
			}
			*/
			this.innerText="预订中";
			isSubmit=true;
			pop.trigger('submit');
		})
		We.addEvent(cancelBtn,'click',function(){
			pop.trigger('close');
		})
	}
	var pop=null;
	var createPop=function(){  //创建验证码弹窗
		var obj={
				mob:We.$("#reservedMobile").value
		}
		var tplElem=document.createElement('script');
		tplElem.setAttribute("type","text/template");
		tplElem.innerHTML=signTpl.msgTpl;
		var pop=new Pop({
			hasShadow:true,
			tpl:tplElem,
			data:obj
		});
		return pop;
	}
	var createSinglePop=We.getSingle(createPop);


	var listenerPop=(function(){ //监听验证码弹窗事件

		var flag=false;
		var one=true;
		return function(pop){
			if(one){
				pop.on('ready',function(){
					if(!flag){
						flag=true;
						createSendEvent(this);
					}
				})
				pop.on('submit',function(){
					toPay.goToPay();
				})
				pop.on('close',function(){
					pop.close();
				})
				one=false;
			}
		}
	})()

	var toPay=(function(){  //提交支付信息

		page.on('ready',function(){

			toPay.init();
		})

		

		return {
			init:function(){
				var me=this;
				this.isSubmit=false;
				var toPay=We.$(toPayBtn);
				We.addEvent(toPay,"click",function(){
					if(me.isSubmit){
						Tip({
							elem:this,
							msg:"请不要重复提交"
						});
						return;
					}
					var flag=me.vaildate(this);					
					if(flag&&!me.isSubmit){
						pop=createSinglePop();
						listenerPop(pop);
						pop.trigger('ready');
						pop.show();
						return;
					}
				})
			},
			vaildate:function(elem){
				var totalEl=We.$(totalPrice);
				if(parseFloat(totalEl.innerText)==0||!parseFloat(totalEl.innerText)){
						Tip({
						 	elem:elem,
						 	msg:"请先选择课程份数"
						 })
						return false;
				}
				var mobile=We.$(reserveMobile);
				var oldmobile=We.$(reserveMobile).getAttribute("oldmobile");
				var reg=/^1[3,4,5,7,8][0-9]{9}$/;
				if(mobile.value==""){
					Tip({
						elem:elem,
						msg:"手机号不能为空"
					});
					return false;
				}else if(!reg.test(mobile.value)){
					Tip({
						elem:elem,
						msg:"手机号格式错误！"
					})
					return false;
				}
			
				return true;
			},
			goToPay:function(payCode){
				var me=this;
				var param=createParam.create(payCode);
				var str="servicestr="+JSON.stringify(param);
				We.ajaxRequest(toPayURL,{
					send:str,
					completeListener:function(){
						var data=JSON.parse(this.responseText);
						if(data.code=="SUCCESS"||data.code=="success"){
							data.sourceofpayment=param.sourceofpayment;
							data.param=param;
							me.trigger("complete",data);
						}else{
							isSubmit=false;
							me.isSubmit=false;
							document.querySelector('.pop-sureBtn').innerText="确定";
							alert(data.description);
						}
					},
					errorListener:function(){
						alert("请求失败");
					}
				})
			}
		}
	})()

	We.extend(toPay,observer);

	var Conductor=(function(){  //具体支付过程

		toPay.on('complete',function(data){
			
			Conductor[data.sourceofpayment](data);
					
		})

		var  failNum=0;

		return {

			2:function(data){ //微信
				var me=this;
				  wx.chooseWXPay({
					    timestamp: data.timeStamp, 
					    nonceStr: data.nonceStr, 
					    package: data.pre_package, 
					    signType: 'MD5', 
					    paySign: data.paySign,
					    success: function (res) {
				    		var mobile=We.$(reserveMobile).value;
				    		var url=config.baseJSPURL+'/list/signSuccess.jsp?mobile='+mobile+"&orderid="+data.orderid;
							window.location.replace(url);
					    },
					    fail:function(res){
					    	me[3](data);
					    },
					    cancel:function(res){
					    	//me[3](data);
					    }
					}); 
				  
			},
			11:function(data){//支付宝
				window.location=config.baseURL+"/list/alipayapiv2.jsp?WIDout_trade_no="+data.orderid+"&WIDtotal_fee="+data.price+"&WIDsubject="+data.title;
			},
			0:function(data){//优惠券
				var mobile=We.$(reserveMobile).value;
				var url=config.baseJSPURL+'/list/signSuccess.jsp?mobile='+mobile+"&orderid="+data.orderid;
				window.location.replace(url);
			},
			3:function(data){//二维码支付
				var param=data.param;
				param.weixin_type=3; //3是native支付
				failNum++;
				param.failNum=failNum;
				var box=We.$("#nativePayContainer");
				var imgEl=We.$("#nativeImg");
				var src=toPayURL+"&servicestr="+JSON.stringify(param)+"&num="+Math.random();
				box.classList.remove('dn');
				imgEl.src=src;
			}

		}
	})();

	
})