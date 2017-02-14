require.config({
	paths:{
		'We':'../util/We',
		'config':'../common/config',
		'FastClick':'../lib/fastclick',
		'Tip':'../util/tip',
		'wxUtil':'../util/wxUtil',
		'observer':'../util/observer',
		'Pop':'../common/pop'
	}
})
require(['We','config','FastClick','Tip','wxUtil','observer','Pop'],function(We,config,FastClick,Tip,wxUtil,observer,Pop){




	var form=We.$("#loginForm"),
		btn=document.querySelector('.m-loginBtn'),
		code=We.getUrlParam('code')||"",
		enSureURL=config.wx_modifyOrderNumStatusURL,
		url=config.wx_verifyOrderNumURL,
		tpl=We.$('#ensure');

	var flag=true;
	var validateFlag=true;
	We.addEvent(form,'submit',function(e){
			e.preventDefault();
			var elem=We.$("#start");
			var value=elem.value;
			if(!value){
				elem.value="识别码不能为空";
			}else{
				if(flag){
					flag=false;
					submitCode();
				}
			}
	})
	function createParam(){
		var obj={};
		obj.code=code;
		obj.order_number=We.$('#start').value;
		return obj;
	}

/*		var testData1={
			order_course_title:"测试课程1",
			order_course_time: "2015-05-02 00:07",
			order_good_count: 1,
			order_number_status:"未使用"
		};
		var testData2={
			order_course_title:"测试课程2",
			order_course_time: "2015-05-02 00:07",
			order_good_count: 2,
			order_number_status:"未使用"
		};
		var i=1;*/
	function submitCode(){
		var param=createParam();
/*		if(i==1){
			modifyOrderNumStatus.init(testData1);
			i++;
		}else{
			modifyOrderNumStatus.init(testData2);
		}
		*/
		We.ajaxRequest(url,{
			send:"servicestr="+JSON.stringify(param),
			completeListener:function(){
				var res=JSON.parse(this.responseText);
				if(res.code=="success"){
					modifyOrderNumStatus.init(res);
				}else{
					alert(res.description);
				}
				flag=true;
			}
		})
	}


	function addFocusEvent(form){
		var elems=form.elements;
		for(var i=0;i<elems.length;i++){
			We.addEvent(elems[i],'focus',function(){
				if(this.type!=="submit"){
					this.value="";
				}
			})
		}
	}


	
	var modifyOrderNumStatus={
		instance:null,
		init:function(obj){
			this.setData(obj);
			this.instance||(this.instance=new Pop({
				hasShadow:true,
				tpl:We.$('#ensure'),
				data:obj
			}));
			listenerPop(this.instance);
			this.instance.trigger('ready');
			this.setBtn(obj);
			this.instance.show();
		},
		setData:function(obj){
			for(var elem in obj){
				var e=document.querySelector('#'+elem);
				if(e){
					e.value=obj[elem];
				}
			}
		},
		setBtn:function(obj){
			var btn=this.instance.el.querySelector('.pop-sureBtn');
			if(obj.order_number_status=="未使用"){
				
				btn.innerText="确定使用";
				btn.style.background="#00c8c8";
			}else{
				btn.innerText="已使用";
				btn.style.background="#999";
			}
		}
	}

	function createSendEvent(pop){

		var btn=pop.el.querySelector('.pop-sureBtn');
		We.addEvent(btn,"click",function(){
			if(!validateFlag)return;
			validateFlag=false;
			pop.trigger('submit',this);
		})
	}

	

	var listenerPop=(function(){ 

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
				pop.on('submit',function(btn){
					var obj={
						order_number:We.$('#start').value,
						code:code
					}
					var me=this;
					We.ajaxRequest(enSureURL,{
						send:"servicestr="+JSON.stringify(obj),
						completeListener:function(){
							var data=JSON.parse(this.responseText);
							if(data.code=="success"){
								btn.innerText="识别成功";
								btn.style.background="#999";
								setTimeout(function(){
									me.close();
								},800);
							}else{
								alert(data.description);
							}
							validateFlag=true;
						}
					})
				})
				one=false;
			}
		}
	})()
	wxUtil.setZoom();
	addFocusEvent(loginForm);

})