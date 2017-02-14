
var index=0;
var lastIndex=0;
var tcrarr=[];
//根据当前高度显示可视界面
function showPage(){
	//窗口的高度+看不见的顶部的高度=屏幕低部距离最顶部的高度
            var thisButtomTop = parseInt($(window).height()) + parseInt($(window).scrollTop());//屏幕高度加滚动高度
            var thisTop = parseInt($(window).scrollTop()); //屏幕顶部距离最顶部的高度  滚动的距离
            //console.log(thisTop);
            for(var i=0;i<tcrarr.length;i++){
            	var PictureTop = parseInt($("#bigpic"+index+i).offset().top);//每个活动里的每张图片的位置
            	if (PictureTop >= thisTop && PictureTop <= thisButtomTop) {
            		$("#bigpic"+index+i).attr("src",'http://img.fxzhoumo.com/'+tcrarr[i].headphoto);
            	}
            }
}
//获取当前的模块框架（将对应的id都设进去了）
function getModel(modelIndex,courseIndex){
	// console.log(modelIndex,courseIndex);
	var pieces='';
	var old_courseprice='';
	// console.log($("#fixed"+modelIndex+courseIndex).attr("data"));
	var str4='<div class="fixed" id="fixed'+modelIndex+courseIndex+'" data=""  onclick="'+'collect('+modelIndex+courseIndex+')'+'"><s><img id=isCollectImg'+modelIndex+courseIndex+' src="img/color1.png" /></s><p><span id="collectNum'+modelIndex+courseIndex+'"></span>个关注</p><div></div></div>';
    var str3='<p class="pro_price"><span class="finish" id="price'+modelIndex+courseIndex+'"></span><i id="pieces'+modelIndex+courseIndex+'">'+pieces+'</i> <s class="start" id="old_price'+modelIndex+courseIndex+'">'+old_courseprice+'</s><u class="distance"></u></p>';
	var str2='<p class="pro_time" id="pro_time'+modelIndex+courseIndex+'"></p><p class="pro_address" id="pro_address'+modelIndex+courseIndex+'"></p>'+str3;                  			  
	var str1='<a class="produce"><p class="pro_theme" id="pro_theme'+modelIndex+courseIndex+'"></p>'+str2+'</a>'+str4;
	var moren='<div class="info"><div class="big"><img id="bigpic'+modelIndex+courseIndex+'" src="img/loading.jpg" class="banner" width="100%"/><div class="mask"  id="mask'+modelIndex+courseIndex+'"><img src="img/mask2.png"></div></div>'+str1+'</div>' ;
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
        	var json=eval("("+data+")");
        	//console.log(json);
        	if(json.code=="success"){
        		var tag_len=json.tag_arr.length;
                var arr=[];
                var arr1=[];
                for(var i=0;i<tag_len;i++){
                  var e=json.tag_arr[i];
                  var tagTemp = '<a id='+e.tag_id+' data='+(i+1)+'>'+e.tag_name+'</a>';//data为导航条的位置 1 2 3 4
                  arr.push(tagTemp); 
                  arr1.push(e.tag_id); 
                }
                //console.log(arr1);
                //将导航栏里的innerHTML替换
                var nod=document.getElementById("swiper2");
                var listitems=nod.children;
                for(var i=0;i<listitems.length;i++){
                  listitems[i].innerHTML=arr[i];
                }
                var id=$(".active-nav a").attr("id");
                lastIndex=index;
                index=$(".active-nav a").attr("data");//data为导航条的位置 1 2 3 4
                getCourseListByTagId(id);
        	}		       
        }
       
	})
}

//填充模块里的内容
function getCourseListByTagId(tagId){
	$.ajax({
		url:"/IRecommendV2Servlet?method=mainV3",
		type:"post",
		data:'servicestr={"nowx":"","nowy":"","pageindex":"1","channelid":"1","tag_id":'+tagId+'}',
		success:function(data){
			var json1=eval("("+data+")");
			if(json1.code=="success"){
				tcrarr=json1.tcrarr;
				reviseModel(lastIndex);//清除模块内容

				for(var i=0;i<tcrarr.length;i++){//依次加入活动内容
					// $("#slide"+index).append(getModel(index,i));
					$("#slide"+index).append('<a href="home/index.html?courseid='+tcrarr[i].courseid+'">'+getModel(index,i)+'</a>')
					//console.log(tcrarr[i].courseid);
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
			      	$("#pro_theme"+index+i).append(tcrarr[i].title);
			      	$("#pro_time"+index+i).append(tcrarr[i].course_time);
			      	$("#pro_address"+index+i).append(tcrarr[i].coursesite);
			      	showPage();
				}
			}
			
		}//第二个success：function
	});
}


//缓加载图片的滚动条的监控，并展示可视区的页面。
$(window).bind("scroll", function(event){
          showPage();
})

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


