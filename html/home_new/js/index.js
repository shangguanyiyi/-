
var index=0;
var lastIndex=0;
var tcrarr=[];
var isFirstLoad=1;
var pageIndex=1;
var firstSortArr=[];
var isHaveMoreData = true;
//根据当前高度显示可视界面
function showPage(){
	//窗口的高度+看不见的顶部的高度=屏幕低部距离最顶部的高度  
            var thisButtomTop = parseInt($(window).height()) + parseInt($(window).scrollTop());  
            var thisTop = parseInt($(window).scrollTop()); //屏幕顶部距离最顶部的高度
            // console.log(thisTop);  
            // console.log(thisButtomTop);
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
	//thiscourseid是点击关注按钮对应的活动的id
	var thiscourseid=$("#fixed"+id).attr("data");
	 if($("#isCollectImg"+id).attr("src")=="img/color1.png"){//未关注时
		$("#isCollectImg"+id).attr("src","img/color2.png");
	 }
	else if($("#isCollectImg"+id).attr("src")=="img/color2.png")  {//已关注时
		$("#isCollectImg"+id).attr("src","img/color1.png");
	}
}
//获取当前的模块框架（将对应的id都设进去了）
function getModel(modelIndex,courseIndex){
	var pieces='';
	var old_courseprice='';
	var course_new_havecount='';
	var str4='<div class="fixed" id="fixed'+modelIndex+courseIndex+'" data="" onclick="'+'collect('+modelIndex+courseIndex+')'+'"><s><img id=isCollectImg'+modelIndex+courseIndex+' src="img/color1.png" /></s><p><span id="collectNum'+modelIndex+courseIndex+'"></span>个关注</p><div></div></div>';
    var str3='<p class="pro_price"><span class="finish" id="price'+modelIndex+courseIndex+'"></span><i id="pieces'+modelIndex+courseIndex+'">'+pieces+'</i> <s class="start" id="old_price'+modelIndex+courseIndex+'">'+old_courseprice+'</s><span class="residus">仅剩<i class="course_new" id="course_new'+modelIndex+courseIndex+'">'+course_new_havecount+'</i>份</span><u class="distance"></u></p>';
	var str2='<p class="pro_time" id="pro_time'+modelIndex+courseIndex+'"></p><p class="pro_address" id="pro_address'+modelIndex+courseIndex+'"></p>'+str3;                  			  
	var str1='<div class="produce"><p class="pro_theme" id="pro_theme'+modelIndex+courseIndex+'"></p>'+str2+'</div>'+str4;
	var moren='<div class="info"><div class="big"><img id="bigpic'+modelIndex+courseIndex+'" src="img/loading.jpg" class="banner" width="100%"/><div class="mask" id="mask'+modelIndex+courseIndex+'"><img src="img/mask2.png"></div></div>'+str1+'</div>' ;
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
function reviseModel(){
	for(var i=1;i<=7;i++){
		clearModel(i);
	}
}
//开始进入链接重置模块内容
$(function(){
	for(var i=1;i<=7;i++){
		reviseModel(i);
	}
});


//获取当前模块的信息并初始化
function fresh(){
	$.ajax({  //导航条请求
		url:"/IRecommendV2Servlet?method=getTags",
        type:"get",
        success:function(data){
        	 firstSortArr=eval("("+data+")");
        	//console.log("laile");
        	// console.log(json);
        	if(firstSortArr.code=="success"){
        		var tag_len=firstSortArr.tag_arr.length;
                var arr=[];
                var arr1=[];
                if(isFirstLoad){
                	for(var i=0;i<tag_len;i++){
                  		var e=firstSortArr.tag_arr[i];
                  		console.log(e);
                		// $("#swiper2").append('<div class="swiper-slide">'+'<a id='+e.tag_id+' data='+i+'>'+e.tag_name+'</a>'+'</div>');
                  		if(tag_len==5){
                  			$("#swiper2").append('<div class="swiper-slide swiper-slide-visible">'+'<a id='+e.tag_id+' data='+i+'>'+e.tag_name+'</a>'+'</div>');
	
                  		}else if(tag_len>=6){
                  			$("#swiper2").append('<div class="swiper-slide">'+'<a id='+e.tag_id+' data='+i+'>'+e.tag_name+'</a>'+'</div>');

                  		}
                  		// arr.push(tagTemp); 
                  		// console.log(tagTemp);
                  		// arr1.push(e.tag_id); 
                	}
                	//console.log(arr1);
                	//将导航栏里的innerHTML替换
                
                	// var nod=document.getElementById("swiper2");
                	// var listitems=nod.children;
                	// for(var i=0;i<listitems.length;i++){
                 //  		listitems[i].innerHTML=arr[i];
                	// }
                }
                var id=$(".active-nav a").attr("id");
                lastIndex=index;
                index=$(".active-nav a").attr("data");
                if(lastIndex==index) return;
               console.log(lastIndex+'-----'+index);
               pageIndex = 1;
               // isHaveMoreData = true;
                getCourseListByTagId(id,pageIndex);
                isFirstLoad=0;
        	}
        			       
        }
       
	})
}

//填充模块里的内容
function getCourseListByTagId(tagId,pageIndex){
	$.ajax({
		url:"/IRecommendV2Servlet?method=mainV3",
		type:"post",
		data:'servicestr={"nowx":"","nowy":"","pageindex":'+pageIndex+',"channelid":"web","tag_id":'+tagId+'}',
		success:function(data){
			var json1=eval("("+data+")");
			// console.log(json1);
			console.log(pageIndex);
			if(json1.code=="success"){
				// console.log(json1.tcrarr);
				//console.log(tagId);
				if(json1.tcrarr!=''){
					tcrarr=json1.tcrarr.concat(tcrarr);
					console.log(tcrarr);
				} else {
					isHaveMoreData=false;
				}
				tcrarr=json1.tcrarr;
				reviseModel(lastIndex);
				reviseModel();

				for(var i=0;i<tcrarr.length;i++){
					$("#slide"+index).append('<a href="home/index.html?courseid='+tcrarr[i].courseid+'">'+getModel(index,i)+'</a>')
				}
				for(var i=0;i<tcrarr.length;i++){
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
          var scrollTop=$(document).scrollTop();//滚动条
          var bottomTop=$(document).height()-$(window).height(); //文档高度减去屏幕高度
          if(scrollTop>=bottomTop){
          		fresh();
	          	pageIndex+=1;
	          	console.log(pageIndex);
	          	var e=firstSortArr.tag_arr[index];
	          	// console.log(e);
	          	var tagID = e.tag_id;
	          	console.log(tagID);
	          	getCourseListByTagId(tagID,pageIndex);
			}else{
				// alert(111)；
			}

          	
          
})

