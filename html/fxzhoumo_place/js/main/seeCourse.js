require.config({
	paths:{
		'We':'../util/We',
		'config':'../common/config',
		'FastClick':'../lib/fastclick',
		'wxUtil':'../util/wxUtil',
		'loadHtml':'loadHtml',
		"util":'../util/util',
		'Tip':'../util/tip'

	}
})
require(['We','config','FastClick','wxUtil',"loadHtml","util","Tip"],function(We,config,FastClick,wxUtil,loadHtml,_,Tip){

	var findOrderURL=config.wx_findCourseURL,
		code=We.getUrlParam('code'),
		tpl=We.$("#tpl"),
		tbody=document.querySelector('tbody'),
		form=document.querySelector('#loginForm'),
		btn=document.querySelector('.m-loginBtn');

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

	var page={
		form:null,
		isInitialized:true,
		init:function(){
			this.load();
			this.bindEvent();
		},
		load:function(){
			var me=this;
			var param=this.createParam();
			We.ajaxRequest(findOrderURL,{
				send:param,
				completeListener:function(){
					var data=JSON.parse(this.responseText);
					if(data.code=="success"){
						var html=We.template(tpl.innerHTML,data);
						tbody.innerHTML=html;
						if(me.isInitialized){
							loadHtml.init({
								form:me.form,
								pageindex:2,
								url:findOrderURL,
								tpl:tpl,
								container:tbody
							});
							me.isInitialized=false;
						}else{
							loadHtml.setPageIndex(2);
							loadHtml.restart();
						}
					}else{
						Tip({
							elem:btn,
							msg:data.description
						})					
					}
				}
			})
		},
		createParam:function(){
			this.form||(this.form=document.querySelector('form'));
			var obj=getFormValue(this.form);
			obj.code=code||"";
			obj.pageindex=1;
			return "servicestr="+JSON.stringify(obj);
		},
		bindEvent:function(){
			var me=this;
			We.addEvent(this.form,'submit',function(e){
				e.preventDefault();
				me.load();
			})
		}
	}

	wxUtil.setZoom();

	page.init();
	

})