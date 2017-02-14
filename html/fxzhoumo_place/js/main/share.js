require.config({
	paths:{
		'We':'../util/We',
		'config':'../common/config',
		'FastClick':'../lib/fastclick',
		'Tip':'../util/tip'
	}
})

require(['We','config','FastClick','Tip'],function(We,config,FastClick,Tip){

	FastClick.attach(document.body);
	var setZoom=function(){
			var width=window.innerWidth;
			var zoom=width/375;
			zoom=zoom>=2?1:zoom;
			document.body.style.zoom=zoom;
	}

	setZoom();

	var userImg=We.$("#user_photo"),
		courseTitle=We.$("#courseTitle"),
		tpl=We.$("#tpl").innerHTML,
		courseId=We.getUrlParam('id'),
		userId=We.getUrlParam('userid'),
		orderId=We.getUrlParam('orderid'),
		getUserPhotoURL=config.getUserPhotoURL,
		getCourseTitle=config.courseDetailURL,
		getVoucherByShareAMobURL=config.getVoucherByShareAMobURL;


	function setUserImg(){
		var obj={userid:parseInt(userId)};
		var param="servicestr="+JSON.stringify(obj);
		We.ajaxRequest(getUserPhotoURL,{
			send:param,
			completeListener:function(){
				var obj=JSON.parse(this.responseText);
				if(obj.code=="success"&&obj.user_photo){
					userImg.src=config.imgBaseURL+obj.user_photo;
				}
			}
		})
	}

	function setCourseTitle(){
		var obj={"nowy":"","nowx":"","pageindex":1,"courseid":parseInt(courseId),"lesson":0};
		param="servicestr="+JSON.stringify(obj);
		We.ajaxRequest(getCourseTitle,{
			send:param,
			completeListener:function(){
				var data=JSON.parse(this.responseText);
				if(data.code=="success"){
					courseTitle.innerHTML=data.course_title;
				}
			}
		})
	}

	function bindSumbit(){
		var btn=We.$("#getCode");
		var mob=We.$("#account");
		var flag=true;
		We.addEvent(btn,'click',function(){
			var me=this;
			if(flag){
				flag=false;
				var pattern=new RegExp(mob.getAttribute('data-pattern'));
				if(!pattern.test(mob.value)){
					var oldType=mob.type;
					mob.type="text";
					mob.setAttribute('oldType',oldType);
					mob.value="手机号格式错误";
					flag=true;
					return;
				}
				var obj={};
				obj.orderid=parseInt(orderId);
				obj.mobile=mob.value;
				var param="servicestr="+JSON.stringify(obj);
				We.ajaxRequest(getVoucherByShareAMobURL,{
					send:param,
					completeListener:function(){
						var obj=JSON.parse(this.responseText);
						Tip({
							elem:me,
							msg:obj.description
						});
						flag=true;
					}
				})
			}
		})

		We.addEvent(mob,'focus',function(){
			if(this.type==="text"){
				var oldType=this.getAttribute('oldType');
				this.type=oldType;
				this.value="";
			}
		})
	}

	var  list=["1元去跟明星声乐师唱歌","1元去攀岩馆玩攀岩","1元去做翻糖饼干","1元去体验爆裂鼓手","1元剑道体验","1元去射箭,体验武侠梦","1元学茶道","1元咖啡馆喝咖啡","1元打桌游"];
	var courses=[];
	var cache=[];
	while(true){
		if(cache.length>=3){
			break;
		}
		var num=Math.floor(Math.random()*9);
		if(cache.indexOf(num)==-1){
			cache.push(num);
			var obj={};
			obj.num=num+1;
			obj.title=list[num];
			courses.push(obj);
		}
	}

	var data={};
	data.courses=courses;
	var html=We.template(tpl,data);
	We.$("#courseList").innerHTML=html;

	setUserImg();
	setCourseTitle();
	bindSumbit();
})