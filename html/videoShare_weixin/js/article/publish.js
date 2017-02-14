var json;
var num=0;
var courseArr=[];
var pageIndex=1;
var base_url="http://www.fxzhoumo.com/detail/course.html?courseid=";
var img_url="http://img.mammachoice.com/";
//根据当前高度显示可视界面
function showPage(){
	//窗口的高度+看不见的顶部的高度=屏幕低部距离最顶部的高度  
    var thisButtomTop = parseInt($(window).height()) + parseInt($(window).scrollTop());  
    var thisTop = parseInt($(window).scrollTop()); //屏幕顶部距离最顶部的高度
    for(var j=0;j<courseArr.length;j++){
    	var PictureTop = parseInt($("#bigpic"+j).offset().top);
    	if (PictureTop >= thisTop && PictureTop <= thisButtomTop) {
    		$("#bigpic"+j).attr("src",img_url+courseArr[j].headphoto);
    	}
    }
}

function getActivity(id,index){
    var str1='<a href="'+base_url+id+'"><div class="big">'+
                '<img id="bigpic'+index+'" src="../img/loading.png" class="banner" width="100%">'+
                '<div class="mask mask'+index+'" id="mask'+index+'">'+
                    '<img src="../img/mask2.png">'+
                '</div></div></a>';
    var str2='<p class="pro_price"><span class="finish" id="price'+index+'"></span><i id="pieces'+index+'">元起</i><s class="start" id="old_price'+index+'"></s><span class="residus" id="residus'+index+'">仅剩<i class="course_new" id="course_new'+index+'"></i>份</span><u class="distance" id="distance'+index+'"></u></p>';
    var str3='<a href="'+base_url+id+'"><div class="produce">'+
                '<p class="pro_theme" id="pro_theme'+index+'"></p>'+
                '<p class="pro_time" id="pro_time'+index+'"></p>'+
                '<p class="pro_address" id="pro_address'+index+'"></p>'+str2
                '</div></a>';
    var structure='<div class="info" id="info'+index+'">'+str1+str3+'</div>';
    return structure;
}

function aa(pageIndex){
       $.ajax({
            url:'/IRecommendV2Servlet?method=seachbytagV2',
            type:'post',
            data:'servicestr={"nowx":"","nowy":"","teacherid":222,"pageindex":'+pageIndex+'}',
            success:function(data){
                json=eval("("+data+")");
                if(json.code=="success"){
                    if(json.course_user_arr!=''){
                        courseArr=courseArr.concat(json.course_user_arr);
                    } else {
                        pageIndex--;
                        return;
                    }
                    var startIndex=(pageIndex-1)*20;
                    for(var m=startIndex;m<courseArr.length;m++){
                        var id=courseArr[m].courseid;
                        $('.section').append(getActivity(id,m));
                    }
                    for(var i=startIndex;i<courseArr.length;i++){
                        if(courseArr[i].course_isover==1){ //course_isover:0未结束 1已结束
                           $("#mask"+i).css("display","block");
                        }
                        // 剩余份数<=0时 显示已爆满
                        if(courseArr[i].course_havecount<=0){
                            $("#mask"+i).css("display","block");
                            $('#residus'+i).text("");
                        }else{//剩余份额
                            $('#course_new'+i).text(courseArr[i].course_havecount);
                        }
                        
                        var courseprice_suffix=parseInt(courseArr[i].courseprice_suffix);
                        var pieces=courseArr[i].courseprice_suffix.slice(courseprice_suffix.toString().length);
                        var old_courseprice=courseArr[i].old_courseprice<=0?"":courseArr[i].old_courseprice+"元";
                        
                        $('#pro_theme'+i).append(courseArr[i].title);
                        $('#pro_time'+i).append(courseArr[i].course_time);
                        $('#price'+i).text(courseprice_suffix);
                        $('#pro_address'+i).text(courseArr[i].coursesite);
                        $('#old_price'+i).text(old_courseprice);
                        $('#distance'+i).text(courseArr[i].coursedistance);

                        showPage();               
                    }   
                }
                         
            }
        })   
}
$(function(){
    aa(pageIndex);
	
})

$(window).bind("scroll", function(event){
    showPage();
    scrollTop=$(document).scrollTop();//滚动条
    var bottomTop=$(document).height()-$(window).height(); //文档高度减去屏幕高度
    if(scrollTop>=bottomTop){               
        pageIndex+=1;
        aa(pageIndex);
   
    }       
   
})