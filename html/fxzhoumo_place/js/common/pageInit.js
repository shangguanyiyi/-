define(['We','ImageLazyLoad','util'],function(We,ImageLazyLoad,_){
	


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
	var pageindex=0;

	var pageInit={
		opts:{},
		fn:null,
		end:false,
		init:function(opts){
			this.setZoom();
			this.setImageLazyLoad();
			this.opts=opts;
		},
		setZoom:function(){
			var width=window.innerWidth;
			var zoom=width/375;
			zoom=zoom>=2?1:zoom;
			document.body.style.zoom=zoom;
		},
		setImageLazyLoad:function(){
			var me=this;
			ImageLazyLoad.init({
				offset:window.innerHeight
			});
			me.imgFn=_.throttle(function(){
				ImageLazyLoad.refresh();
				//me.loadHtml();
			},300);
			me.loadHtmlFn=_.throttle(function(){
				me.loadHtml();
			},300);
			We.addEvent(window,'scroll',me.loadHtmlFn);
			We.addEvent(window,'scroll',me.imgFn);
		},
		loadHtml:function(){
			var me=this;
			if(me.end)return;
			var scroll=window.pageYOffset;
			var height=document.documentElement.scrollHeight||document.body.scrollHeight;
			var innerHeight=window.innerHeight;
			if((height-scroll)<=innerHeight){
				loading.showLoading();
				me.end=true;
				var str=me.getParam(me.opts.titleIndex);
				We.removeEvent(window,'scroll',me.loadHtmlFn);
				We.ajaxRequest(this.opts.url,{
					send:str,
					completeListener:function(){
						var obj=JSON.parse(this.responseText);
						if(obj.code==='success'){
							if(typeof me.opts.titleIndex ==="object"){
								if(me.opts.titleIndex.tagtype==2){
									delete obj.course_place_arr;
								}else if(me.opts.titleIndex.tagtype==3){
									delete obj.course_title_arr;
								}
							}
							var itemTpl=We.$(me.opts.itemTpl).innerHTML;

							var itemHtml=We.template(itemTpl,obj);
							var items=We.parseHTML(itemHtml);
							var imgList=[];
							for(var j=0;j<items.length;j++){
								imgList.push(items[j].querySelector('[data-src]'));
							}
							var fragment=document.createDocumentFragment();   //当用We.parseHTML 解析出的items的元素被添加到文档中时，items的长度会变化
							var length=items.length;
							for(var i=items.length-1;i>=0;i--){
								if(i==length-1){
									fragment.appendChild(items[i]);
								}else{
									var elem=fragment.firstChild;
									fragment.insertBefore(items[i],elem);
								}
							}
							me.opts.itemContainer.appendChild(fragment);
						
							ImageLazyLoad.add(imgList);
							me.end=false;
							if(obj.tcrarr&&obj.tcrarr.length<20){
								me.end=true;
							}
							if(obj.course_title_arr&&obj.course_title_arr.length<20){
								me.end=true;
							}
							if(obj.course_place_arr&&obj.course_place_arr.length<20){
								me.end=true;
							}
							if(obj.course_user_arr&&obj.course_user_arr.length<20){
								me.end=true;
							}
							if(obj.course_coursetype_arr&&obj.course_coursetype_arr.length<20){
								me.end=true;
							}
							We.addEvent(window,'scroll',me.loadHtmlFn);
							loading.removeLoading();
						}
					}
				});
			}
		},
		getParam:function(num){
			var longitude=We.cookie.get('longitude'),
				latitude=We.cookie.get('latitude'),
				obj={};
				obj.nowx=latitude;
				obj.nowy=longitude;
				obj.pageindex=++pageindex;
				num &&(typeof Number(num)=='number')&&(obj.coursetype=Number(num));
				var str="servicestr="+JSON.stringify(obj);
				return str;
		},
		setPageIndex:function(num){
			pageindex=num;
		}

	}
	return pageInit;
})