var imgUrl="http://img.mammachoice.com/";
var teacherUrl="http://img.fxzhoumo.com/";

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
	$.ajax({
		url:'/IArticleServlet?method=findArticleById',
		type:'post',
		data:'servicestr={"article_id":1,"nowx":"9.0","nowy":"9.0"}',
		success:function(data){
			var json=eval("("+data+")");
			console.log(json);
			if(json.code=="success"){
				$('.video_title').html(json.article_title);//文章或者视频标题
				if(json.article_showtime!=""||json.article_author){
					$('.video_time').html(json.article_showtime);
					$('.video_author').html(json.article_author);
				}else{
					$('.time_author').hide();
				}
				
				// 视频封面
				if(json.article_type==1){
					$('.video_iframe').hide();
					$('.mask').show();
					if(json.article_easydesc!=""&&json.article_videotime!=""){
						$('.video_info').text(json.article_easydesc);
						// var minutes=json.article_videotime.replace(/'/,"分").replace(/"/,"秒");
						$('.video_longtime').text(json.article_videotime);
					}else{
						$('.article_videoinfo').hide();
					}

					$('.switch').bind('click',function(){
						$('.mask').hide();
						$('.first').append('<iframe id="video_iframe"  class="video_iframe" style="z-index: 1; display:block" height="'+window.screen.availWidth*0.58+'"px !important" frameborder="0"  allowfullscreen="" scrolling="no"></iframe>')
						$('.video_iframe').css({
							'z-index':'1',
							'width':''+window.screen.availWidth*0.95+'',
						})
						$('.video_iframe').attr('width',''+window.screen.availWidth*0.95+'');
						// $('.video_iframe').show();
						var videourl=json.article_qq_videourl;
						var after=getStr(videourl,'?');
						var after1=getStrbefore(after,'&');
						$('.video_iframe').attr('src','http://v.qq.com/iframe/player.html?'+after1+'&amp;width='+window.screen.availWidth*0.93+'&amp;height='+screen.availWidth*0.58+'&amp;auto=0" scrolling="no"');
						$('.video_iframe').attr('data-src','http://v.qq.com/iframe/player.html?'+after1+'&amp;width='+window.screen.availWidth*0.93+'&amp;height='+screen.availWidth*0.58+'&amp;auto=0" scrolling="no"');

					})
				}else{
					$('.video_iframe').css('display','none');
					$('.mask').show();
					$('.article_videoinfo').hide();
					$('.switch').hide();
					
				}

				var len=json.article_content.length;
				if(json.article_content.length!=0){
					var endArr=json.article_content[len-1];//如果是数组的最后一个 如果有underline属性就去掉
					
					for(var n=0;n<len;n++){
						var content=json.article_content[n];//按顺序添加进去
						
						if(content.article_content_type==1){
							var str=content.article_content_cell;
							if(str.indexOf('font')>0){//当前字符串里含有[font:...:font]时对他进行拆分
								var havefont=content.article_content_cell.split('[');
								var result=[];//result用来存放被拆分后的元素
								var num=0;
								for(var j=0;j<havefont.length;j++){
									if(havefont[j].indexOf(']')<0){
										continue;
									}
									var bb=havefont[j].split(']');
									var str0=bb[0];
									result[num]='['+str0+']';
									result[num+1]=bb[1];
									num=num+2;//**********
								}
								var obj;
								for(var i=0;i<result.length;i++){
									if(result[i].indexOf("\r\n")>=0){
										result[i]=result[i].replace(/\r\n/g,"<br>")
									}
									
									if(result[i].indexOf('font')>0){
										var deleteFont=result[i].substring(result[i].indexOf("{"),result[i].indexOf("}")+1);
										obj=eval("("+deleteFont+")");
										if(obj.hasOwnProperty('size')){
											var fontSize=parseFloat(obj.size/24)+"rem";
										}else{
											fontSize="";
										}

										if(obj.hasOwnProperty('color')){
											var fontColor="#"+obj.color;
										}else{
											fontColor="";
										}

										if(obj.hasOwnProperty('url')){
											var fontUrl=obj.url;
										}else{
											fontUrl="javaScript:void(0)";
										}

						
										if(obj.hasOwnProperty('img')){
											$('.content_main').append('<img class="content_commonImg" src='+imgUrl+obj.img+'>');
										}else{
											$('.content_main').append('<a class="words" style="font-size:'+fontSize+';color:'+fontColor+';" href="'+fontUrl+'">'+obj.text+'</a>')
										}
										
									}else{
										$('.content_main').append('<span class="words">'+result[i]+'</span>');
										// $('<span class="words">'+result[i]+'</span>').appendTo($(this).next());
										
										// $('.content_main').append('<div class="activity_big clear underline><span class="words">'+result[i]+'</span></div>');
									}
								}	
							}else{
								var content1="<div class='activity_big clear underline'><p class='content_text'>"+content.article_content_cell+"</p></div>";
								$('.content_main').append(content1);
							}

							
						}else if(content.article_content_type==2){
							var price=parseInt(content.courseprice_suffix);
							var pieces=content.courseprice_suffix.slice(price.toString().length);
							var content2='<div class="activity_big clear  underline"><a class="content_details" href="http://www.fxzhoumo.com/detail/course.html?courseid='+content.courseid+'">'+
		                    '<div class="left_pic"><img class="content_leftImg" src="http://img.mammachoice.com/'+content.headphoto+'" alt=""></div>'+
		                    '<div class="right_info "><p class="right_title">'+content.title+'</p><p class="right_time">'+content.course_time+'</p></div>'+ 
		                	'</a><div class="icon_price"><p id="content_price" class="css19c53533a4397">'+price+'</p><p id="price_unit">'+pieces+'</p></div></div>';
							$('.content_main').append(content2);

						}else if(content.article_content_type==3){
							var content3='<div class="activity_big clear underline"><a class="content_details " href="">'+
		                    '<div class="left_pic"><img class="content_leftImg" src="http://img.mammachoice.com/'+content.teacher_photo+'" alt=""></div>'+
		                    '<div class="right_info "><p class="right_title right_name">'+content.teacher_nickname+'</p><p class="right_time right_type">用户类型'+content.teacher_type+'</p><p class="right_oneabstrace">'+content.teacher_oneabstract+'</p></div>'+ 
		                	'</a><div class="icon_price"><a href="#">查看&gt;</a></div></div>';
							$('.content_main').append(content3);
						}
												
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
			console.log(jsonData);
			if(jsonData.code=="success"){
				for(var i=0;i<jsonData.articlearr.length;i++){
					if(jsonData.article_type==0){//普通文章
						swiper.appendSlide('<a class="swiper-slide">'+
	                    '<dt><img src="'+imgUrl+jsonData.articlearr[i].article_photo+'" alt=""></dt>'+
	                    '<dd>'+jsonData.articlearr[i].article_title+'</dd>'+
	                	'</a>');
					}else{//视频文章
						swiper.appendSlide('<a class="swiper-slide">'+
	                    '<dt><img src="'+imgUrl+jsonData.articlearr[i].article_photo+'" alt=""><div class="player">'+
                        '<img src="../videoShareContent_img/switch.png" alt="">'+
                    '</div></dt>'+
	                    '<dd>'+jsonData.articlearr[i].article_title+'</dd></a>');
					}
                	
				}
			}
		}
	})

	
})
