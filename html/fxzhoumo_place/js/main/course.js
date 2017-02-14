require.config({
	paths:{
		'We':'../util/We',
		'ImageLazyLoad':'../util/ImageLazyLoad',
		'config':'../common/config',
		'FastClick':'../lib/fastclick',
		'observer':'../util/observer',
		'Tip':'../util/tip',
		'util':'../util/util',
		'FavElem':'../common/favElem',
		'doFav':'../common/doFav',
		'Pop':'../common/pop'
	},
	shim:{
		'ImageLazyLoad':{
			exports:'ImageLazyLoad'
		}
	}
})
require(['We','config','FastClick','ImageLazyLoad','observer','Tip','FavElem','doFav','util','Pop'],function(We,config,FastClick,ImageLazyLoad,observer,Tip,FavElem,doFav,_,Pop){
	window.We=We;
	window.config=config;
	FastClick.attach(document.body);
	var longitude=We.cookie.get('longitude'),
		latitude=We.cookie.get('latitude'),
		courseid=We.getUrlParam('courseid'),
		course_price_id=We.getUrlParam('course_price_id');//新增加的
		lesson=We.getUrlParam('lesson'),
		loadQuestionURL=config.loadQuestionURL,
		questionTpl=We.$('#questionTpl'),
		questionContainer="#questionContainer",
		doFavURL=config.doFavURL,
		opts={
			container:We.$('#g-screen'),
			url:config.courseDetailURL,
			tpl:We.$('#mainTpl')
		};
	
	var isWeiXin=(function(){
			return navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1
		})();

	var createParam=function(pageindex){
		var obj={};
		obj.nowy=We.cookie.get('longitude');
		obj.nowx=We.cookie.get('latitude');
		obj.pageindex=pageindex;
		obj.courseid=Number(courseid);
		obj.lesson=Number(lesson)||0;
		return "servicestr="+JSON.stringify(obj);
	}

	console.log("测试");
	console.log({name:"msg"});
	var createPage={

		init:function(){
				var me=this;
				var param=createParam(1);
				We.ajaxRequest(opts.url,{
					send:param,
					completeListener:function(){
						var data=JSON.parse(this.responseText);
						render(data);
						me.trigger('ready',data);
					}
				})
		}
	}

	We.extend(createPage,observer);

	var render=function(data){
		var reg=/\n/;
		var r=/\s/g;
		var desc=data.course_description.split(reg);
		var d=desc.map(function(item){
			var item=item.replace(r,"&nbsp;");
			return "<p>"+item+"</p>";
		})
		var before=/\[img:/g;
		var after=/:img\]/g;
		data.course_description=d.join('').replace(before,"<img src='../images/loading.gif' data-src='"+config.imgBaseURL).replace(after,"'/>");
		var html=We.template(opts.tpl.innerHTML,data);
		opts.container.innerHTML=html;
	}

	var setZoom=function(){
			var width=window.innerWidth;
			var zoom=width/375;
			zoom=zoom>=2?1:zoom;
			document.body.style.zoom=zoom;
	}
	
	/*绑定咨询弹窗*/
	
	var telPop=(function(){
	
		
		createPage.on('ready',function(data){
			
			telPop.init(data);
			
		})
		return {
			init:function(data){
				var createPop=function(){  //创建弹窗
					var pop=new Pop({
						hasShadow:true,
						tpl:We.$('#telTpl'),
						data:data
					});
					return pop;
				}
				var createSinglePop=We.getSingle(createPop);
				var telBtn=document.getElementById('toTel');
				telBtn.addEventListener('click',function(){
					var pop=createSinglePop();
					pop.show();
				},false);
			}
		}
	})()

	/*注入微信权限*/


	var injectWX=(function(){

		if(isWeiXin){
			createPage.on("ready",function(data){
				injectWX.init(data);
			})
		}
		return {

			init:function(data){

				var me=this,
					getURL=config.wx_getPowerURL,
					wx_url=escape(window.location.href),
					obj={wei_url:wx_url};
					We.ajaxRequest(getURL,{
					send:"servicestr="+JSON.stringify(obj),
					completeListener:function(){
						var obj=JSON.parse(this.responseText);
						obj.course_title=data.course_title;
						obj.course_photo=data.course_photo;
						if(obj.code=="success"){
							me.setControl(obj);
						}
					}
				})
			},
			setControl:function(data){
				var me=this;
				wx.config({
					    debug: false, 
					    appId: 'wx47987fa108b8329b', 
					   // appId:'wxd470058f4535a61d', //mammachoice
					    timestamp:data.timestamp,
					    nonceStr: data.nonceStr,
					    signature: data.signature,
					    jsApiList: [ 'onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo','onMenuShareQZone']
				});
				wx.ready(function(){
					me.trigger('ready',data);	
				});
			}
		}

	})()

	We.extend(injectWX,observer);

	/*监听分享事件*/
	var listenerShare=(function(){
		if(isWeiXin){
			injectWX.on('ready',function(data){
				listenerShare.init(data);
			})
		}
		return {
			init:function(data){
				this.shareObject=this.createShareObject(data);
				wx.onMenuShareTimeline(this.shareObject);
				wx.onMenuShareAppMessage(this.shareObject);
				wx.onMenuShareQQ(this.shareObject);
				wx.onMenuShareWeibo(this.shareObject);
				wx.onMenuShareQZone(this.shareObject);
			},
			createShareObject:function(data){
				var obj={
					title:"发现周末App上的["+data.course_title+"]很棒，这个周末跟我一起参加吧!",
					desc:"发现周末App上的["+data.course_title+"]很棒，这个周末跟我一起参加吧!",
					link:window.location.href+"&source=1",
					imgUrl:config.imgBaseURL+data.course_photo
				}
				return obj;
			}
		}
	})()



	/*修改页面title为当前课程标题*/

	var  setPageTitle=(function(){

		createPage.on('ready',function(data){

			setPageTitle.set(data);
		})
		
		return {
			set:function(data){
				document.title=data.course_title;
			}
		}
	})()

	/*课程详情页图片懒加载*/
	var doImageLazy=(function(){

		createPage.on('ready',function(){

			doImageLazy.init();
		})
		return {

			init:function(){
				ImageLazyLoad.init({
					offset:window.innerHeight
				});
				var imgFn=_.throttle(function(){
					ImageLazyLoad.refresh();
				},200);
				We.addEvent(window,'scroll',imgFn);
			}
		}
	})()

	/*设置地图坐标*/

	var setMapPlace=(function(){
		
		createPage.on('ready',function(){
			setMapPlace.set();
		})
		return {
			set:function(){
				var input=document.querySelector("#mapPlace");
				sessionStorage.setItem("place",input.value);
			}
		}
	})()

	/*绑定后退*/
	var bindBack=(function(){
		createPage.on('ready',function(){
			bindBack.init();
		})
		return {
			init:function(){
				
				var toIndex=We.getUrlParam('source');
				if(toIndex==1){
					document.querySelector(".u-back>div:nth-child(2)").innerHTML="首页";
					document.querySelector('.u-back').addEventListener('click',function(){
						
						window.location.href="http://www.fxzhoumo.com";
					})
				}else{
					document.querySelector(".u-back>div:nth-child(2)").innerHTML="返回";
					document.querySelector('.u-back').addEventListener('click',function(){
						
						window.history.go(-1);
					})
				}
				
				
			}
		}
	})()

	/*喜欢*/
	var bindFav=(function(){
		createPage.on('ready',function(){
			bindFav.init();
		})
		return {
			init:function(){
				var btn=document.querySelector("#courseFavBtn");
				doFav.start(btn,doFavURL);
			}
		}
	})()



	var loadQuestion=(function(){
		createPage.on('ready',function(){
			loadQuestion.init();
		})

		return {
			loadBtn:null,
			init:function(){
				this.bindEvent();
			},
			bindEvent:function(){
				this.loadBtn=We.$('#loadQuestion');
				var me=this;
				this.loadBtn&&(We.addEvent(this.loadBtn,"click",function(){
					var pageindex=this.getAttribute("pageindex");
					me.getQuestion(pageindex,this);
				}));
			},
			getQuestion:function(pageindex,loadBtn){
				var me=this;
				var pageindex=parseInt(pageindex);
				var param={
					pageindex:pageindex,
					courseid:courseid
				}
				var str="servicestr="+JSON.stringify(param);
				We.ajaxRequest(loadQuestionURL,{
						send:str,
						completeListener:function(){
							var data=JSON.parse(this.responseText);
							if(data.code==="success"){
								data.pageindex=pageindex;
								me.addQuestion(data);
							}else{
								Tip({
									elem:me.loadBtn,
									msg:data.description
								});
							}
						}
				})
			},
			addQuestion:function(data){
				if(data.course_questreply_arr.length<10){
					this.loadBtn.parentNode.removeChild(this.loadBtn);
				}else{
					this.loadBtn.setAttribute('pageindex',++data.pageindex);
				}
				var html=We.template(questionTpl.innerHTML,data);
				if(data.pageindex==1){
					We.$(questionContainer).innerHTML=html;
					return;
				}	
				var elems=We.parseHTML(html);
				var fragment=document.createDocumentFragment();
				for(var i=0;i<elems.length;i++){
					fragment.appendChild(elems[i]);
				}
				We.$(questionContainer).appendChild(fragment);	
			}
		}
	})()


	var sign=(function(){

		createPage.on('ready',function(data){
			sign.init(data);
		})
		return {
			signBtn:null,
			init:function(data){
				if(data.course_isapply!==0)return;
				this.bindEvent(data);
			},
			bindEvent:function(data){
				var me=this;
				this.signBtn=We.$('#signBtn');
				We.addEvent(this.signBtn,"click",function(){
					var url="";
					if(!isWeiXin){
						url=config.baseJSPURL+"/list/sign.jsp?courseid="+courseid+"&course_price_id="+courseid_price_id;
					}else{
						url="https://open.wseixin.qq.com/connect/oauth2/authorize?appid=wx47987fa108b8329b&redirect_uri=http://www.fxzhoumo.com/list/sign.jsp?courseid="+courseid+"&course_price_id="+courseid_price_id+"&response_type=code&scope=snsapi_base&state=1#wechat_redirect";
					}
					window.location.href=url;
				})
			}
		}

	})()


	if(!latitude||!longitude){
		We.getLocation(); 
	}
	setZoom();
	createPage.init();


	//https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx520c15f417810387&redirect_uri=http%3A%2F%2Fchong.qq.com%2Fphp%2Findex.php%3Fd%3D%26c%3DwxAdapter%26m%3DmobileDeal%26showwxpaytitle%3D1%26vb2ctag%3D4_2030_5_1194_60&response_type=code&scope=snsapi_base&state=123#wechat_redirect

})
