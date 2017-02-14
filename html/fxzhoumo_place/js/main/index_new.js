
var index=0;
var lastIndex=0;
var tcrarr=[];
var isFirstLoad=1;
var pageIndex=1;
var firstSortArr=[];
var scrollTop=0;
var severalTime=0;//循环执行一次
var tagArr;
var base_url="http://www.fxzhoumo.com/detail/course.html?courseid=";
// var base_url="home/index.html?courseid=";

function readCookie(cookie_name){
	var strCookie = document.cookie;
	var cookis_pos= strCookie.indexOf(cookie_name);
	
	if(cookis_pos!=-1){
		cookis_pos += cookie_name.length + 1;
		var cookie_end = strCookie.indexOf(";", cookis_pos);
		if (cookie_end == -1)
		{
			cookie_end = strCookie.length;
		}
		var value = unescape(strCookie.substring(cookis_pos, cookie_end));

	}
	return value;
}

$(function(){
	var city=readCookie("city");
	if(city=="beijing"||city==undefined){
		$('#visibility').html("北京");
		$('#select_one').text("北京");
		$('#select_two').text("上海");
	}else if(city=="shanghai"){
		$('#visibility').html("上海")
		$('#select_one').text("上海");
		$('#select_two').text("北京");
	}
	var liList=$('.city li');
	var liLength=liList.length;
	console.log("liList"+liList);
	console.log("liLength:"+liLength);
	function saveCookie(){
		for(var i=0;i<liLength;i++){
			if($(liList[i]).attr('class')){
				if(liList[i].innerHTML=="上海"){
					setCookie("city","shanghai");
				}else{
					setCookie("city","beijing");
				}
				break;
			}
		}
	}

	function setCookie(cookie_name, value, expiredays) {
        var exdate = new Date();
        exdate.setTime(exdate.getTime() + expiredays * 3600 * 1000);
        document.cookie = cookie_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString()) + ";path=/";
    }

	$('.city li').bind('click',function(){
		$(this).addClass('selected');
		saveCookie();
		 window.location.replace(location)
	});

	$('.changeCity').bind('click',function(){
		$('.city').show();
	})

	
})



//根据当前高度显示可视界面
function showPage(){
	//窗口的高度+看不见的顶部的高度=屏幕低部距离最顶部的高度  
            var thisButtomTop = parseInt($(window).height()) + parseInt($(window).scrollTop());  
            var thisTop = parseInt($(window).scrollTop()); //屏幕顶部距离最顶部的高度
            for(var i=0;i<tcrarr.length;i++){
            	//console.log($("#bigpic"+index+i).offset().top);
            	var PictureTop = parseInt($("#bigpic"+index+i).offset().top);
            	if (PictureTop >= thisTop && PictureTop <= thisButtomTop) {
            		$("#bigpic"+index+i).attr("src",'http://img.fxzhoumo.com/'+tcrarr[i].headphoto);
            	}
            	//console.log(PictureTop);
            }
}
//点击关注时的处理函数
function collect(id){
	$.ajax({
		url:'/IUserCenterV2Servlet?method=favFocus',
		type:'post',
		data:'servicestr={"favid":id,"tagtype":2}',
		success:function(data){
			var jsonObj=eval("("+data+")");
			if(jsonObj.code=="success"){
				if($("#img-"+id).attr("src")=="img/color1.png"){//未关注时
					$("#img-"+id).attr("src","img/color2.png");
				}
				else if($("#img-"+id).attr("src")=="img/color2.png")  {//已关注时
					$("#img-"+id).attr("src","img/color1.png");
				}
			}else{
				alert(jsonObj.description);
			}
		}
	})
	// //thiscourseid是点击关注按钮对应的活动的id
	// var thiscourseid=$("#fixed"+id).attr("data");
	//  if($("#isCollectImg"+id).attr("src")=="img/color1.png"){//未关注时
	// 	$("#isCollectImg"+id).attr("src","img/color2.png");
	//  }
	// else if($("#isCollectImg"+id).attr("src")=="img/color2.png")  {//已关注时
	// 	$("#isCollectImg"+id).attr("src","img/color1.png");
	// }
}
//获取当前的模块框架（将对应的id都设进去了）
function getModel(modelIndex,courseIndex){
	var pieces='';
	var old_courseprice='';
	var course_new_havecount='';
	var str4='<div class="fixed" id="fixed'+modelIndex+courseIndex+'" data=""><s><img id=isCollectImg'+modelIndex+courseIndex+' src="img/color1.png" /></s><p><span id="collectNum'+modelIndex+courseIndex+'"></span>个关注</p><div></div></div>';
    var str3='<p class="pro_price"><span class="finish" id="price'+modelIndex+courseIndex+'"></span><i id="pieces'+modelIndex+courseIndex+'">'+pieces+'</i> <s class="start" id="old_price'+modelIndex+courseIndex+'">'+old_courseprice+'</s><span class="residus">仅剩<i class="course_new" id="course_new'+modelIndex+courseIndex+'">'+course_new_havecount+'</i>份</span><u class="distance"></u></p>';
	var str2='<p class="pro_time" id="pro_time'+modelIndex+courseIndex+'"></p><p class="pro_address" id="pro_address'+modelIndex+courseIndex+'"></p>'+str3;                  			  
	var str1='<a href="'+base_url+tcrarr[courseIndex].courseid+'"><div class="produce"><p class="pro_theme" id="pro_theme'+modelIndex+courseIndex+'"></p>'+str2+'</div></a>'+str4;
	var moren='<div class="info"><a href="'+base_url+tcrarr[courseIndex].courseid+'"><div class="big"><img id="bigpic'+modelIndex+courseIndex+'" src="img/loading.png" class="banner" width="100%"/><div class="mask" id="mask'+modelIndex+courseIndex+'"><img src="img/mask2.png"></div></div></a>'+str1+'</div>' ;
	
	return moren;
}
//清理模块里的内容
function clearModel(modelIndex){
	$("#slide"+modelIndex).empty();
}
//重置模块里的内容
function reviseModel(modelIndex){
	clearModel(modelIndex);

}


//获取当前模块的信息并初始化
function fresh(){
	$.ajax({  //导航条请求
		url:"/IRecommendV2Servlet?method=getTags",
        type:"get",
        success:function(data){
        	 firstSortArr=eval("("+data+")");
        	 console.log(firstSortArr);
        	if(firstSortArr.code=="success"){
        		var tag_len=firstSortArr.tag_arr.length;
        		// document.getElementById('hidden').value=tag_len;
        		$('#hidden').attr("value",tag_len);

                var arr=[];
                var arr1=[];
                if(isFirstLoad){
                	for(var i=0;i<tag_len;i++){
            			e=firstSortArr.tag_arr[i];
            			tagArr=firstSortArr.tag_arr;
                  		var tagTemp = '<a id='+e.tag_id+' data='+(i+1)+'>'+e.tag_name+'</a>';
                  		arr.push(tagTemp);
                	} 
                	var nod=document.getElementById("swiper2");
                	var listitems=nod.children;
                	
                	for(var i=0;i<listitems.length;i++){
                  		re=/[\u4E00-\u9FA5]/g;
                  		var count=arr[i].match(re).length
                  		if(count==2){
                  			listitems[i].innerHTML='&nbsp;'+arr[i];
                  		}else{
                  			listitems[i].innerHTML=arr[i];
                  		}
                	} 	
                }

               
                var id=$(".active-nav a").attr("id");
                lastIndex=index;
                index=$(".active-nav a").attr("data");
                if(lastIndex==index) return;
                pageIndex = 1;
                // isHaveMoreData = true;
                tcrarr=[];
                getCourseListByTagId(id,pageIndex);
                isFirstLoad=0;
                var startClassifyCount=$('#hidden').val();
                // alert(startClassifyCount);
                function reviseModel(){
					for(var i=1;i<=startClassifyCount;i++){
						if(i==index) continue;
						clearModel(i);
					}
				}
				//开始进入链接重置模块内容
                for(var i=1;i<=startClassifyCount;i++){
					reviseModel(i);
				}
					
				if(startClassifyCount>4){
						var surplus = startClassifyCount-4;
						//alert("surplus"+surplus)
						if(severalTime==0){//如果是第一次就添加  第二次不添加
							for(i=1;i<=surplus;i++){

							mySwiper2.appendSlide('<div class="swiper-slide">'+'<a id='+tagArr[3+i].tag_id+' data='+(4+i)+'>'+tagArr[3+i].tag_name+'</a>'+'</div>');					
							mySwiper3.appendSlide('<div class="swiper-slide" id="slide'+(4+i)+'"> </div>')
							}
							severalTime++;
						}
				}
        	}
        	//页面内容一更新 让滚动条回到顶部
        	window.scrollTo(0,0);
        }
	})
}

//填充模块里的内容
function getCourseListByTagId(tagId,pageIndex){	
	//请求id对应的模块数据 并
	$.ajax({
		url:"/IRecommendV2Servlet?method=mainV3",
		type:"post",
		data:'servicestr={"nowx":"","nowy":"","pageindex":'+pageIndex+',"channelid":"web","tag_id":'+tagId+'}',
		success:function(data){
			var json1=eval("("+data+")");
			if(json1.code=="success"){
				if(json1.tcrarr!=''){
					tcrarr=tcrarr.concat(json1.tcrarr);
				} else {
					pageIndex--;
					return;
				}
				reviseModel();
				var startIndex=(pageIndex-1)*20;
				for(var i=startIndex;i<tcrarr.length;i++){
					$("#slide"+index).append('<a href="'+base_url+tcrarr[i].courseid+'">'+getModel(index,i)+'</a>')
				}
				for(var i=startIndex;i<tcrarr.length;i++){
					//已爆满遮罩层判断
				     if(tcrarr[i].course_isover===1){ //course_isover:0未结束 1已结束
				       $("#mask"+index+i).css("display","block");
				    }
				    var courseid=tcrarr[i].courseid;//当前活动的id号
				  	var iscollect=tcrarr[i].iscollect;  //是否被关注
			      	var courseprice_suffix=parseInt(tcrarr[i].courseprice_suffix);
			      	var pieces=tcrarr[i].courseprice_suffix.slice(courseprice_suffix.toString().length);
			      	var old_courseprice=tcrarr[i].old_courseprice<=0?"":tcrarr[i].old_courseprice+"元";
			      	$("#fixed"+index+i).attr("data",tcrarr[i].courseid);
			      	$("#isCollectImg"+index+i).attr("src",'img/color'+(iscollect+1)+'.png');
			      	$("#collectNum"+index+i).append(tcrarr[i].collectcount);
			      	$("#pieces"+index+i).append(pieces);
			      	$("#price"+index+i).append(courseprice_suffix);
			      	$("#old_price"+index+i).append(old_courseprice);
			      	$("#course_new"+index+i).append(tcrarr[i].course_new_havecount);
			      	$("#pro_theme"+index+i).append(tcrarr[i].title);
			      	$("#pro_time"+index+i).append(tcrarr[i].course_time);
			      	$("#pro_address"+index+i).append(tcrarr[i].coursesite);
			      	showPage();
				}
           		
			}

		},//第二个success：function
	});
}


//缓加载图片的滚动条的监控，并展示可视区的页面。
$(window).bind("scroll", function(event){
          showPage();
          scrollTop=$(document).scrollTop();//滚动条
          // console.log(scrollTop);
          var bottomTop=$(document).height()-$(window).height(); //文档高度减去屏幕高度
          if(scrollTop>=bottomTop){
          		
	          	pageIndex+=1;
	          	var e=firstSortArr.tag_arr[index-1];
	          	var tagID = e.tag_id;
	          	console.log(tagID);
	          	getCourseListByTagId(tagID,pageIndex);
			}       
})
	

