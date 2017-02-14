require.config({
	paths:{
		'We':'../util/We',
		'config':'../common/config',
		'FastClick':'../lib/fastclick',
				'observer':'../util/observer',
		'Pop':'../common/pop'
	}
})
require(['We','config','FastClick',"observer",'Pop'],function(We,config,FastClick,observer,Pop){

	var 
		latitude=We.cookie.get('latitude'),
		longitude=We.cookie.get('longitude'),
		orderid=We.getUrlParam('orderid'),
		courseid=We.getUrlParam('courseid'),
		syllabusid=We.getUrlParam('syllabusid'),
		backBtn=We.$('.u-back')[0],
		tpl=We.$("#tpl"),
		container=We.$('#container'),
		lookHavOrderURL=config.lookHavOrderURL;


	var page={
		init:function(){		
			this.render();
		},
		render:function(){
			var param=this.createParam();
			var str="servicestr="+JSON.stringify(param);
			We.ajaxRequest(lookHavOrderURL,{
				send:str,
				completeListener:function(){
					var data=JSON.parse(this.responseText);
					if(data.code=="success"){
						data.courseid=courseid;
						data.order_goodcount=0;
						var num=0;
						for(var i=0;i<data.order_others_detail.length;i++){
							num=num+data.order_others_detail[i].order_goodcount;
						}
						data.order_goodcount=num;
						var html=We.template(tpl.innerHTML,data);
						container.innerHTML=html;
						bindTelEvent(data);
						createMap(data);
					}else{
						alert(data.description);
					}
				}
			})
		},
		createParam:function(){
			var obj={};
			obj.nowx=We.cookie.get('latitude');
			obj.nowy=We.cookie.get('longitude');
			obj.orderid=parseInt(orderid);
			obj.course_syllabusid=parseInt(syllabusid);
			return obj;
		}

	}
	function createMap(data){
			var x=data.course_place_x||39.915;
			var y=data.course_place_y||116.404;
			var map = new BMap.Map("map");  
			var point = new BMap.Point(y, x);
			var marker = new BMap.Marker(point);
			map.centerAndZoom(point,15); 
			map.addOverlay(marker); 
			map.addControl(new BMap.ZoomControl());
	}
	
	function bindTelEvent(data){
		
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

	if(!latitude||!longitude){
		We.getLocation();
	}
	window.We=We;
	window.config=config;//将config对象挂载到window下,解析模板需要用到此对象
	page.init();
	We.addEvent(backBtn,"click",function(){
		window.history.go(-1);
	})

	var setZoom=function(){
			var width=window.innerWidth;
			var zoom=width/375;
			zoom=zoom>=2?1:zoom;
			document.body.style.zoom=zoom;
	}
	setZoom();
})