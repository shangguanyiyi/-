require.config({
	paths:{
		'We':'../util/We',
		'ImageLazyLoad':'../util/ImageLazyLoad',
		'config':'../common/config',
		'FastClick':'../lib/fastclick',
		'util':'../util/util',
		'pageInit':'../common/pageInit',
		'Panel':'../common/panel',
		'getPrefix':'../common/getPrefix',
		'FavElem':'../common/favElem',
		'Tip':'../util/tip',
		'doFav':'../common/doFav'
	},
	shim:{
		'ImageLazyLoad':{
			exports:'ImageLazyLoad'
		}
	}
})
require(['We','config','FastClick','ImageLazyLoad','Panel','util','getPrefix','pageInit','FavElem','Tip','doFav'],function(We,config,FastClick,ImageLazyLoad,Panel,_,getPrefix,pageInit,FavElem,Tip,doFav){
	var isGene=We.getUrlParam('isGene');
	if(isGene=="false"){
		isGene=false;
	}else{
		isGene=true;
	}
	FastClick.attach(document.body);
	var pageindex=0,
		longitude=We.cookie.get('longitude'),
		latitude=We.cookie.get('latitude'),
		goType=null,
		tagtype=null,
		tagname=null,
		opts={
			url:config.hotsubjectURL,
			favURL:config.doFavURL,
			showURL:config.findSubjectForShowURL,
			container:document.querySelector('#container'),//主容器
			main:document.querySelector('#main'),//初始category容器
			startDom:null,//
			result:null,//搜索结果页面构成的DOM元素
			specify:null,//各分类符合条件结果的详细列表构成的DOM
			mainTpl:document.querySelector('#mainTpl'),
			listTpl:document.querySelector('#listTpl'),
			personTpl:document.querySelector('#personTpl'),
			courseTpl:document.querySelector('#courseTpl'),
			itemTpl:document.querySelector('#itemTpl'),
			backBtn:document.querySelector('.u-back'),//后退
			menuBtn:document.querySelector('.m-panelBtn'),//panel
			input:document.querySelector('#in'),//表单域
			form:document.querySelector('#ff'),//表单
			searchBtn:document.querySelector('#searchBtn'),//显示的表单提交按钮
			submitBtn:document.querySelector('#hiddenBtn'),//隐藏的表单提交按钮
			goType:null,//表示从哪跳转到当前页，0为放大镜，1位panel内链接
			tagname:null,//搜索关键词
			tagtype:null,//搜索类型
			isGene:isGene,//表示是否是通过历史记录进入的
			isBind:false,//表示是否绑定了后退事件
			panelOpts:{
				url:config.loadUserInfoURL,
				btn:We.$('.m-panelBtn')[0],
				panel:We.$('.g-panel')[0],
				needMove:[We.$('.g-head')[0],We.$('#container')],
				userImage:We.$('.u-headImg')[0],
				userInfo:We.$('.u-name')[0],
				userMsgNum:We.$('.msgNum')[0],
				userDesc:We.$('.u-des')[0]
			}
		},
		setZoom=function(){
			var width=window.innerWidth;
			var zoom=width/375;
			zoom=zoom>=2?1:zoom;
			document.body.style.zoom=zoom;
		},
		bindSearchEvent=function(){
			
			We.addEvent(opts.searchBtn,'click',function(){
				opts.submitBtn.click();
			})
			We.addEvent(opts.form,'submit',function(e){
				opts.tagname=opts.input.value;
				opts.isGene=true;
				createPage.searchBySubject();

				e.preventDefault();
			})

			We.addEvent(opts.backBtn,'click',function(){
				//window.location='../index.html';
				window.history.go(-1);
			})
			doFav.start(opts.container,opts.favURL);
		
		};

	var nav=function (obj){
		pageInit.setZoom=function(){};
		goType=We.getUrlParam('go'),
		tagtype=We.getUrlParam('tagtype'),
		tagname=We.getUrlParam('tagname'),
		opts.goType=goType;
		opts.tagtype=tagtype;
		opts.tagname=escape(tagname);
		if(obj){
			opts.tagtype=obj.tagtype;
			opts.tagname=obj.tagname;
		}
		if(opts.tagtype===null){
			createPage.init();
		}else if(opts.tagtype==0){
			createPage.searchBySubject();
		}else{
			searchList.searchSpecifyHtml(tagtype);
		}
		if(!opts.isBind){
			bindSearchEvent();
			opts.isBind=true;
		}
		
	}

	var createParam=function(opts){  //拼接ajax参数
		var obj={};
			longitude=We.cookie.get('longitude'),
			latitude=We.cookie.get('latitude');
		obj.nowx=latitude;
		obj.nowy=longitude;
		obj.tagtype=opts.tagtype;
		obj.tagname=opts.tagname;
		if(!opts.isClearpageIndex){
			obj.pageindex=++opts.pageindex;
		}else{
			obj.pageindex=opts.pageindex;
		}
		
		return "servicestr="+JSON.stringify(obj);
	}
	var createPage={  //页面初始化对象
		_opts:{},
		init:function(){
			opts.result=null;
			opts.specify=null;
			this.toggleBackBtn();
			document.body.style.background="#fff";
/*			var data=
{"code":"success","description":"成功！","tag_arr":[{"tag_photo":"teach_project/subject/quanbu.png","tag_name":"全部活动","tag_id":0},{"tag_photo":"teach_project/subject/375/subject375.png","tag_name":"DIY&体验","tag_id":375},{"tag_photo":"teach_project/subject/377/subject377.png","tag_name":"亲子活动","tag_id":377},{"tag_photo":"teach_project/subject/378/subject378.png","tag_name":"周边游","tag_id":378},{"tag_photo":"teach_project/subject/379/subject379.png","tag_name":"电电影影电影","tag_id":379},{"tag_photo":"teach_project/subject/380/subject380.png","tag_name":"聚会派对","tag_id":380},{"tag_photo":"teach_project/subject/376/subject376.png","tag_name":"主题节&市集","tag_id":376},{"tag_photo":"teach_project/subject/381/subject381.png","tag_name":"演出展览","tag_id":381},{"tag_photo":"teach_project/subject/382/subject382.png","tag_name":"沙龙讲座","tag_id":382},{"tag_photo":"teach_project/subject/175/subject175.png","tag_name":"艺术","tag_id":175},{"tag_photo":"teach_project/subject/383/subject383.png","tag_name":"下午茶&美食","tag_id":383},{"tag_photo":"teach_project/subject/314/subject314.png","tag_name":"约会","tag_id":314},{"tag_photo":"teach_project/subject/168/subject168.png","tag_name":"音乐","tag_id":168}]};
						var html=We.template(opts.mainTpl.innerHTML,data);
						opts.container.innerHTML=html;
						opts.startDom=opts.container.children[0];*/
			We.ajaxRequest(opts.showURL,{
				completeListener:function(){
					var data=JSON.parse(this.responseText);
					if(data.code=="success"){
						var html=We.template(opts.mainTpl.innerHTML,data);
						opts.container.innerHTML=html;
						opts.startDom=opts.container.children[0];
					}
				}
			})
		},
		toggleBackBtn:function(){
			if(opts.goType==0){
				opts.backBtn.classList.remove('dn');
				opts.menuBtn.classList.add('dn');
			}else{
				opts.backBtn.classList.add('dn');
				opts.menuBtn.classList.remove('dn');
				var panel=new Panel(opts.panelOpts);
			}
		},
		searchBySubject:function(){
			var me=this;
			var value=opts.tagname||opts.input.value;
			if(!!value){
				opts.tagname=value;
				var param=createParam({
					tagtype:0,
					pageindex:1,
					tagname:value,
					isClearpageIndex:true
				});
				We.ajaxRequest(opts.url,{
					send:param,
					completeListener:function(){
						var data=JSON.parse(this.responseText);
						if(data.code==='success'){
							opts.tagname=value;
							me.appendSubjectHtml(data);
						}
					}
				});
			}
		},
		appendSubjectHtml:function(data){
			var html=We.template(opts.listTpl.innerHTML,data);
			opts.container.innerHTML="";
			opts.container.appendChild(We.parseHTML(html)[0]);
			opts.result=opts.container.children[0];
			opts.specify=null;
			opts.tagtype=0;
			var url='list.html?tagtype=0&tagname='+opts.tagname;
			var obj={
				tagname:opts.tagname,
				tagtype:opts.tagtype
			};
			if(opts.isGene){
				window.history.pushState(JSON.stringify(obj),"",url);
			}
			opts.backBtn.classList.remove('dn');
			opts.menuBtn.classList.add('dn');
			document.body.style.background="#ededed";
			searchList.init();
		}
	}


	var searchList={
		_opts:{},
		init:function(){
			//this._opts=opts;
			this.bindEvent();
		},
		bindEvent:function(){
			var me=this;
			We.addEvent(opts.result,'click',function(e){
				opts.isGene=true;
				var target=e.target;
				var currentTarget=null;
				if(target.classList.contains('m-title')){
					currentTarget=target;
				}else if(target.parentNode&&target.parentNode.classList.contains('m-title')){
					currentTarget=target.parentNode;
				}else if(target.parentNode.classList.contains('i-num')){
					var elem=target.parentNode;
					currentTarget=elem.parentNode;
				}else{
					return;
				}
				var tagtype=parseInt(currentTarget.getAttribute("data-tagtype"));
				if(!tagtype)return;
				me.searchSpecifyHtml(tagtype);
			})
		},
		searchSpecifyHtml:function(type){
			var me=this;
			opts.tagtype=type;
			var param=createParam({
				pageindex:1,
				tagname:opts.tagname,
				tagtype:type,
				isClearpageIndex:true
			})
			We.ajaxRequest(opts.url,{
				send:param,
				completeListener:function(){
					var data=JSON.parse(this.responseText);
					if(data.code==='success'){
						me.appendSpecifyHtml(data);
					}
				}
			});
		},
		appendSpecifyHtml:function(data){
			var tpl='';
			if(opts.tagtype==1){
				tpl=opts.personTpl.innerHTML;
			}else if(opts.tagtype==2){
				tpl=opts.courseTpl.innerHTML+opts.itemTpl.innerHTML+"</div></div>";
				data.myparam='活动';
				delete data.course_place_arr;
			}else if(opts.tagtype==3){
				tpl=opts.courseTpl.innerHTML+opts.itemTpl.innerHTML+"</div></div>";
				data.myparam="地点";
				delete data.course_title_arr;
			}
			if(!!!tpl)return;
			var html=We.template(tpl,data);
			opts.result&&opts.container.removeChild(opts.result);
			opts.container.innerHTML=html;
			opts.input.value=data.tagname;
			opts.specify=opts.container.children[0];
			var url='list.html?tagtype='+opts.tagtype+"&tagname="+opts.tagname;
			var obj={
				tagname:opts.tagname,
				tagtype:opts.tagtype
			};
			if(opts.isGene){
				window.history.pushState(JSON.stringify(obj),"",url);
			}
			document.body.style.background="#ededed";
			opts.backBtn.classList.remove('dn');
			opts.menuBtn.classList.add('dn');
			specifyList.init(opts); //图片懒加载以及滚动加载
		}
	}

	var specifyList={
		_opts:{},
		init:function(opts){
			opts.isClearpageIndex=false;
			opts.pageindex=1;
			var obj={
				url:opts.url,
				itemContainer:opts.specify.querySelector('#page')||opts.specify,
				itemTpl:'#itemTpl',
				titleIndex:opts
			};
			pageInit.getUrlParam=createParam;
			pageInit.init(obj);
		}
	}
	if(!latitude||!longitude){   //获取地理位置
		We.getLocation(); 
	}
	

	

	window.We=We;
	window.config=config;
	nav();
	We.addEvent(window,'popstate',function(e){
		opts.isGene=false;
		var obj=null;
		try{
			obj=JSON.parse(e.state);
		}catch(e){

		}
		nav(obj);
	})
})