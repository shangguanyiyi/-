var imgUrl="http://img.mammachoice.com/";
var teacherUrl="http://img.fxzhoumo.com/";
// document.domain="192.168.0.83";
$(function(){

})
/* 
  string 字符串; 
  str 指定字符; 
  split(),用于把一个字符串分割成字符串数组; 
  split(str)[0],读取数组中索引为0的值（第一个值）,所有数组索引默认从0开始; 
 */
function getStr(string,str){ 
    var str_before = string.split(str)[0]; 
    var str_after = string.split(str)[1]; 
    return str_after; 
} 

function getStrbefore(string,str){ 
    var str_before = string.split(str)[0]; 
    var str_after = string.split(str)[1]; 
    return str_before; 
} 
$(function(){
	$('.video_iframe').css({
		'z-index':'1',
		'width':''+window.screen.availWidth*0.95+'',
	})
	$('.video_iframe').attr('width',''+window.screen.availWidth*0.95+'');

	$.ajax({
		url:'/IArticleServlet?method=findArticleById',
		type:'post',
		data:'servicestr={"article_id":1,"nowx":"9.0","nowy":"9.0"}',
		success:function(data){
			var json=eval("("+data+")");
			console.log(json);
			if(json.code=="success"){
				document.title=json.article_title;
				$('.video_title').html(json.article_title);
				$('.video_time').html(json.article_showtime);
				$('.video_author').html(json.article_author);

				if(json.article_type==2){
					var videourl=json.article_qq_videourl;
					var after=getStr(videourl,'?');
					var after1=getStrbefore(after,'&');
					$('.video_iframe').attr('src','http://v.qq.com/iframe/player.html?'+after1+'&amp;width='+window.screen.availWidth*0.93+'&amp;height=258.75&amp;auto=0" scrolling="no"');
					$('.video_iframe').attr('data-src','http://v.qq.com/iframe/player.html?'+after1+'&amp;width='+window.screen.availWidth*0.93+'&amp;height=258.75&amp;auto=0" scrolling="no"');

				}else{
					$('.video_iframe').css('display','none');
					$('.first').append('<img style="display:block;" src="'+imgUrl+json.article_photo+'">');
				}
				
			
				// 视频封面
				
				var len=json.article_content.length;
				var result=[];
				var num=0;
				if(json.article_content.length!=0){
					for(var i=0;i<len;i++){
						var content=json.article_content.pop();//按顺序弹出来 再按顺序添加进去
						if(content.article_content_type==1){

							var str=content.article_content_cell;
							if(str.indexOf('font')>0){
								//console.log(content.article_content_cell);
								//console.log(str+'aaaaaaaaa');
								var aa=content.article_content_cell.split('[');
								var len2=aa.length;
								for(var j=0;j<len2;j++){
									var bb=aa[j].split(']');
									// console.log("bb:"+bb);
									var str0=bb[0];
									var str1=bb[1];
									// console.log("bb[1]:"+bb[1]);
									result[num]='['+str0+']';
									result[num+1]=str1;
									num=num+1;

								}
								
								//console.log(str0+'bbbbbbbb');
								//console.log(aa.length);
								
							}else{
								var content1="<div class='activity_big clear underline'><p class='content_text'>"+content.article_content_cell+"</p></div>";
								$('.content_main').append(content1);
							}
							/*
							if(/^\[[^\s]+/.test(content.article_content_cell)){//正则匹配中括号
							 	// alert(content.article_content_cell);^\[[^\s]+
							 	var text=content.article_content_cell;
							 	// getStr(text,']');
							 	// var bb=/\\[font:[^\\s]*?:font\\]/;
							 	// var cc=content.article_content_cell.split('[');
							 	// console.log(cc);
							 	var afterText=getStr(text,']');
							 	var b=text.substring(text.indexOf("{"),text.indexOf("}")+1);
							 	var obj=eval("("+b+")");
							 	
							 	//console.log(obj);
							 	var content='<p class="content_text" style="font-size:'+obj.size/24+'rem'+';color:'+obj.color+'">'+obj.text+'<span>'+afterText+'</span></p> '
							 	$('.content_main').append(content);
							 	
							 	
							 }
							 // else if(/^\r\n+/.test(content.article_content_cell)){//有回车的时候
							 // 	console.log("++++"+content.article_content_cell);
							 // 	var afterText1=getStr(content.article_content_cell,']');
							 // 	// console.log(afterText1);
							 
							 // 	var cc=/\\[font:[^\\s]*?:font\\]/;
							 // 	console.log(cc.test(afterText1));
							 // 	if(/\\[font:[^\\s]*?:font\\]/.test(afterText1)){
							 // 		// alert(afterText1);
							 // 	}else{
							 // 		// alert(afterText1);
							 // 	}
							 	
							 // }
							 else{
							 	var content1="<div class='activity_big clear underline'><p class='content_text'>"+content.article_content_cell+"</p></div>";
								$('.content_main').append(content1);
							 }
							*/
							
						}else if(content.article_content_type==2){
							var price=parseInt(content.courseprice_suffix);
							var pieces=content.courseprice_suffix.slice(price.toString().length);
							var content2='<div class="activity_big clear  underline"><a class="content_details" href="http://www.fxzhoumo.com/detail/course.html?courseid='+content.courseid+'">'+
		                    '<div class="left_pic"><img class="content_leftImg" src="http://img.mammachoice.com/'+content.headphoto+'" alt=""></div>'+
		                    '<div class="right_info "><p class="right_title">'+content.title+'</p><p class="right_time">'+content.course_time+'</p></div>'+ 
		                	'</a><div class="icon_price"><p id="content_price" class="css19c53533a4397">179</p><p id="price_unit">'+pieces+'</p></div></div>';
							$('.content_main').append(content2);
						}else if(content.article_content_type==3){
							var content3='<div class="activity_big clear underline"><a class="content_details " href="">'+
		                    '<div class="left_pic"><img class="content_leftImg" src="http://img.mammachoice.com/'+content.teacher_photo+'" alt=""></div>'+
		                    '<div class="right_info "><p class="right_title right_name">'+content.teacher_nickname+'</p><p class="right_time right_type">用户类型'+content.teacher_type+'</p><p class="right_oneabstrace">'+content.teacher_oneabstract+'</p></div>'+ 
		                	'</a><div class="icon_price"><a href="#">查看&gt;</a></div></div>';
							$('.content_main').append(content3);
						}						
					}

					var len=result.length;
					for(var i=0;i<len;i++){
						console.log(result[i]);
					}
				}	
			}
		}
	})

	$.ajax({
		url:'/IArticleServlet?method=findArticleByIdForHotOthers',
		type:'post',
		data:'servicestr={"article_id":1}',
		success:function(data){
			var jsonData=eval("("+data+")");
			//console.log(jsonData);
			if(jsonData.code=="success"){
				for(var i=0;i<jsonData.articlearr.length;i++){
                	swiper.appendSlide('<a class="swiper-slide" href="http://www.fxzhoumo.com/mindex.html">'+
                    '<dt><img src="'+imgUrl+jsonData.articlearr[i].article_photo+'" alt=""></dt>'+
                    '<dd>'+jsonData.articlearr[i].article_title+'</dd>'+
                	'</a>');
				}
			}
		}
	})

})
