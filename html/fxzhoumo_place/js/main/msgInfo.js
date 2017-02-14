require.config({
	paths:{
		'We':'../util/We',
		'config':'../common/config',
		'FastClick':'../lib/fastclick',
		'observer':'../util/observer',
		'util':'../util/util'
	}
})
require(['We','config','FastClick','observer','util'],function(We,config,FastClick,observer,_){



	var 
		opts={
			url:null,
			systemMsgURL:config.systemMsgURL,
			questUserMsgURL:config.questUserMsgURL,
			goType:We.getUrlParam('go'),
			container:We.$('#container'),
			tpl:We.$("#tpl"),
			title:We.$('.u-title')[0]
		},
		pageindex=0,
		setZoom=function(){
			var width=window.innerWidth;
			var zoom=width/375;
			zoom=zoom>=2?1:zoom;
			document.body.style.zoom=zoom;
		};

	var loading={
		elem:null,
		showLoading:function(){
			var box=document.createElement('div');
			box.classList.add('loadBox');
			var div=document.createElement('div');
			div.classList.add('loading');
			box.appendChild(div);
			document.body.appendChild(box);
			window.scrollBy(0,40);
			this.elem=box;
		},
		removeLoading:function(){
			this.elem.parentNode.removeChild(this.elem);
		}
	}
	var  createPage={

		init:function(){
			if(opts.goType==1){
				opts.url=opts.questUserMsgURL;
				opts.title.innerText="我的提问";
			}else{
				opts.url=opts.systemMsgURL;
				opts.title.innerText="系统消息";
			}
			this.toggleBackBtn();
			this.render();
		},
		toggleBackBtn:function(){
			var obj={
				backBtn:document.querySelector('.u-back'),//后退
			}
			We.addEvent(obj.backBtn,"click",function(){
				window.history.go(-1);
			});
		},
		render:function(){
			var me=this;
			var param=this.createParam();
			var str="servicestr="+JSON.stringify(param);
			We.ajaxRequest(opts.url,{
				send:str,
				completeListener:function(){
					var data=JSON.parse(this.responseText);
					if(data.code==="success"){
						var html=We.template(opts.tpl.innerHTML,data);
						opts.container.innerHTML=html;
						if(data.infor_arr&&data.infor_arr.length>=10){
							createPage.trigger('ready');
						}
						if(data.course_questreply_arr&&data.course_questreply_arr.length>=10){
							createPage.trigger('ready');
						}
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
			obj.pageindex=++pageindex;
			return obj;
		}
	}

	We.extend(createPage,observer);

	var loadInfo=(function(){

		createPage.on('ready',function(){
			loadInfo.init();
		})

		return {

			init:function(){
				var me=this;
				me.fn=_.throttle(function(){
					var scroll=window.pageYOffset;
					var height=document.documentElement.scrollHeight||document.body.scrollHeight;
					var innerHeight=window.innerHeight;
					if(height-scroll<=innerHeight){
						me.loadHtml();
					}
				},300);
				We.addEvent(window,'scroll',me.fn);
			},
			loadHtml:function(){
				var me=this;
				We.removeEvent(window,'scroll',me.fn);
				
				loading.showLoading();
				var param=createPage.createParam();
				var str="servicestr="+JSON.stringify(param);
				We.ajaxRequest(opts.url,{
					send:str,
					completeListener:function(){
						var data=JSON.parse(this.responseText);
						if(data.code==="success"){
							me.addHtml(data);
						}
					}
				})
			},
			addHtml:function(data){
				var me=this;
				var html=We.template(opts.tpl.innerHTML,data);
				var items=We.parseHTML(html);
				var fragment=document.createDocumentFragment();
				var length=items.length;
				for(var i=items.length-1;i>=0;i--){
					if(i==length-1){
						fragment.appendChild(items[i]);
					}else{
						var elem=fragment.firstChild;
						fragment.insertBefore(items[i],elem);
					}
				}
				opts.container.appendChild(fragment);
				loading.removeLoading();
				if(data.infor_arr&&data.infor_arr.length>=10){
					We.addEvent(window,'scroll',me.fn);
				}
			}

		}

	})();


	window.We=We;
	window.config=config;//将config对象挂载到window下,解析模板需要用到此对象
	createPage.init();


})