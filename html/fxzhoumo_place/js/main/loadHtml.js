
define(['We','util'],function(We,_){

	var loading={
		elem:null,
		showLoading:function(){
			var box=document.createElement('div');
			box.classList.add('loadText');
			box.innerText="正在加载中...";
			document.body.appendChild(box);
			window.scrollBy(0,24);
			this.elem=box;
		},
		removeLoading:function(){
			this.elem.parentNode.removeChild(this.elem);
		}
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

	var loadHtml={
		loadFn:null,
		_pageIndex:2,
		isBindScrollEvent:false,
		init:function(opts){
			this.opts=opts;
			this.bindEvents();
		},
		needLoad:function(){
			var scroll=window.pageYOffset;
			var height=document.documentElement.scrollHeight||document.body.scrollHeight;
			var innerHeight=window.innerHeight;
			if(height-scroll<=innerHeight)return true;
			return false;
		},
		bindEvents:function(){
			var me=this;
			this.loadFn=_.throttle(function(){
				me.load();
			},300);
			We.addEvent(window,'scroll',this.loadFn);
			this.isBindScrollEvent=true;
		},
		load:function(){
			if(this.needLoad()){
				loading.showLoading();
				We.removeEvent(window,'scroll',this.loadFn);
				this.isBindScrollEvent=false;
				this.patch();
			}
		},
		patch:function(){
			var me=this;
			var param=this.createParam();
			We.ajaxRequest(this.opts.url,{
				send:"servicestr="+JSON.stringify(param),
				completeListener:function(){
					var data=JSON.parse(this.responseText);
					if(data.code=="success"){
						loading.removeLoading();

						var html=We.template(me.opts.tpl.innerHTML,data);
						var table=document.createElement("table");
						table.innerHTML=html;
						var trs=table.children&&table.children[0]&&table.children[0].children;
						trs=[].slice.call(trs);
						for(var i=0;i<trs.length;i++){
							me.opts.container.appendChild(trs[i]);
						}
						if(data.order_arr&&data.order_arr.length>=10){
							me.isBindScrollEvent=true;
							We.addEvent(window,'scroll',me.loadFn);
							me._pageIndex++;
						}
						if(data.bill_arr&&data.bill_arr.length>=10){
							me.isBindScrollEvent=true;
							We.addEvent(window,'scroll',me.loadFn);
							me._pageIndex++;
						}
						if(data.course_arr&&data.course_arrs.length>=10){
							me.isBindScrollEvent=true;
							We.addEvent(window,'scroll',me.loadFn);
							me._pageIndex++;
						}
					}else{
						loading.removeLoading();
						alert(data.description);
					}

				}
			})
		},
		createParam:function(){
			var obj=getFormValue(this.opts.form);
			obj.code="";
			obj.pageindex=this._pageIndex;
			return obj;
		},
		setPageIndex:function(pageidx){
			this._pageIndex=pageidx;
		},
		restart:function(){
			if(!this.isBindScrollEvent){
				this.bindEvents();
			}
		}
	}

	return loadHtml;
})