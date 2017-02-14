// var imgUrl="http://img.mammachoice.com/";
var imgUrl="http://img.fxzhoumo.com/";
var merchantUrl="http://www.fxzhoumo.com/article/articleshare.html?article_id=";
// var merchantUrl="http://192.168.0.83/videoShare_weixin/article/articleshare.html?article_id=";//相关推荐链接
// var merchantMoreUrl="http://192.168.0.83/videoShare_weixin/article/merchant.html";
var merchantMoreUrl="http://www.fxzhoumo.com/article/merchant.html";
// 
/* 
  string 字符串; 
  str 指定字符; 
  split(),用于把一个字符串分割成字符串数组; 
  split(str)[0],读取数组中索引为0的值（第一个值）,所有数组索引默认从0开始; 
 */
function getStr0(string,str){ 
    var str_before = string.split(str)[0]; 
    var str_after = string.split(str)[1]; 
    var aa=str_after.split('&');
    var picName=aa[0];
    return picName;
} 
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
	var localhref=window.location.href;
	var articleStr=getStr0(localhref,'?');
	var articalId=getStr(articleStr,'=');

	$.ajax({
		url:'/IArticleServlet?method=findArticleById',
		type:'post',
		data:'servicestr={"article_id":'+articalId+',"nowx":"9.0","nowy":"9.0"}',
		success:function(data){
			var json=eval("("+data+")");
			console.log(json);
			if(json.code=="success"){
				$('.video_title').html(json.article_title);//文章或者视频标题
				$('.cover').attr('src',imgUrl+json.article_photo);
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
					$('.switch').show();
					if(json.article_easydesc!=""&&json.article_videotime!=""){
						$('.article_videoinfo').show();
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
						// var after1=getStrbefore(after,'&');
						$('.video_iframe').attr('src','http://v.qq.com/iframe/player.html?'+after+'&amp;width='+window.screen.availWidth*0.93+'&amp;height='+screen.availWidth*0.58+'&amp;auto=0" scrolling="no"');
						$('.video_iframe').attr('data-src','http://v.qq.com/iframe/player.html?'+after+'&amp;width='+window.screen.availWidth*0.93+'&amp;height='+screen.availWidth*0.58+'&amp;auto=0" scrolling="no"');
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
						var content=json.article_content[n];
						
						if(content.article_content_type==1){
							var str=content.article_content_cell;
							var resultStr=str.replace(/\n/g,"<br>");
							if(str.indexOf('font')>0){
								var reg=/\[font:/;
								var havefont=resultStr.split(reg);
								$('.content_main').append("<div class='activity_big_"+n+" clear underline'></div>");
								for(var i=0;i<havefont.length;i++){
									if(havefont[i].indexOf(':font]')<0&&havefont[i]==""){
										continue;
									}else{
										var bb=havefont[i].split(':font]');
										for(var m=0;m<bb.length;m++){
											if(bb[m].indexOf('{')!=-1){
												var deleteFont=bb[m].substring(bb[m].indexOf("{"),bb[m].indexOf("}")+1);
												var jsondeleteFont=eval("("+deleteFont+")");
												// console.log(jsondeleteFont);
												
												if(jsondeleteFont.hasOwnProperty('img')){
													$('.activity_big_'+n).append('<img class="content_commonImg" src='+imgUrl+jsondeleteFont.img+'>');
												}else if(jsondeleteFont.hasOwnProperty('text')){
													if(jsondeleteFont.hasOwnProperty('size')){
														var fontSize=parseFloat(jsondeleteFont.size/24)+"rem";
													}else{
														fontSize="";
													}

													if(jsondeleteFont.hasOwnProperty('color')){
														var fontColor="#"+jsondeleteFont.color;
													}else{
														fontColor="";
													}

													if(jsondeleteFont.hasOwnProperty('url')){
														var fontUrl=jsondeleteFont.url;
													}else{
														fontUrl="javaScript:void(0)";
													}
													$('.activity_big_'+n).append('<a class="words" style="font-size:'+fontSize+';color:'+fontColor+';" href="'+fontUrl+'">'+jsondeleteFont.text+"</a>");
												}

											}else{
												$('.activity_big_'+n).append('<span class="textAll">'+bb[m]+'</span>');
											}
										}	
									}
						
								}
							}else{
								var content1="<div class='activity_big clear underline'><p class='content_text'>"+content.article_content_cell+"</p></div>";
								$('.content_main').append(content1);
							}
						}else if(content.article_content_type==2){
							var price=parseInt(content.courseprice_suffix);
							var pieces=content.courseprice_suffix.slice(price.toString().length);
							var content2='<div class="activity_details clear  underline"><a class="content_details" href="http://www.fxzhoumo.com/detail/course.html?courseid='+content.courseid+'">'+
		                    '<div class="left_pic"><img class="content_leftImg" src="'+imgUrl+content.headphoto+'" alt=""></div>'+
		                    '<div class="right_info "><p class="right_title">'+content.title+'</p><p class="right_time">'+content.course_time+'</p></div>'+ 
		                	'</a><div class="icon_price"><p id="content_price" class="css19c53533a4397">'+price+'</p><p id="price_unit">'+pieces+'</p></div></div>';
							$('.content_main').append(content2);

						}else if(content.article_content_type==3){
							var content3='<div class="activity_merchant clear underline"><a class="content_details " href="'+merchantMoreUrl+'">'+
		                    '<div class="left_pic"><img class="content_leftImg" src="'+imgUrl+content.teacher_photo+'" alt=""></div>'+
		                    '<div class="right_info "><p class="right_title right_name">'+content.teacher_nickname+'</p><p class="right_time right_type">用户类型'+content.teacher_type+'</p><p class="right_oneabstrace">'+content.teacher_oneabstract+'</p></div>'+ 
		                	'</a><div class="icon_price"><a href="'+merchantMoreUrl+'">查看&gt;</a></div></div>';
							$('.content_main').append(content3);
						}
												
					}
					var lastDiv=$('.content_main').children()[$('.content_main').children().length-1];
					console.log(lastDiv);
					$(lastDiv).removeClass('underline');

				}
			}
		}
	})


	$.ajax({
		url:'/IArticleServlet?method=findArticleByIdForHotOthers',
		type:'post',
		data:'servicestr={"article_id":'+articalId+'}',
		success:function(data){
			var jsonData=eval("("+data+")");
			console.log(jsonData);
			if(jsonData.code=="success"){
				for(var i=0;i<jsonData.articlearr.length;i++){
					if(jsonData.articlearr[i].hasOwnProperty('article_photo')||jsonData.articlearr[i].article_photo==""){
						var imgloading=imgUrl+jsonData.articlearr[i].article_photo
					}else{
						imgloading='../img/loading.png';
					}
					if(jsonData.article_type==0){//普通文章
						swiper.appendSlide('<a class="swiper-slide" href="'+merchantUrl+jsonData.articlearr[i].article_id+'">'+
	                    '<dt><img src="'+imgloading+'" alt=""></dt>'+
	                    '<dd>'+jsonData.articlearr[i].article_title+'</dd>'+
	                	'</a>');
					}else{//视频文章
						swiper.appendSlide('<a class="swiper-slide" href="'+merchantUrl+jsonData.articlearr[i].article_id+'">'+
	                    '<dt><img src="'+imgloading+'" alt="">'+
                        '</dt><dd>'+jsonData.articlearr[i].article_title+'</dd></a>');
					}
                	
				}
				//给swiper固定一个宽度
				for(var i=0;i<$('.swiper-slide').length;i++){
					var slideWidth=parseInt($('.swiper-slide')[0].style.width)+15;
					$('.five_activity').css('width',jsonData.articlearr.length*slideWidth+'px');
					return ;
				}


			}
		}
	})	
})
