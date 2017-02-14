var ceshi="http://img.mammachoice.com/";
var imgUrl="http://img.fxzhoumo.com/";
$(function(){
	$.ajax({
		url:'/IUserCenterV2Servlet?method=getOtherUserDetailV3',
		type:'post',
		data:'servicestr={"course_user_id":222}',
		success:function(data){
			var json=eval("("+data+")");
			if(json.code=="success"){
				console.log(json);
				//头部信息
				$('.user_img').css('background','url('+ceshi+json.teacher_photo+') no-repeat');
				$('.name').text(json.teacher_nickname);
				if(json.teacher_sex==0){
					$('.sex').text("♀");
					$('.message').css('background','#ff7e7f');
				}else{
					$('.sex').text("♂");
					$('.message').css('background','#10b9f4');
				}
				$('.type').text(json.teacher_oneabstract);
				$('.age').text(json.teacher_age);
				$('.constellation').text(json.teacher_constellation);//星座
				

				//已发布的活动
				var teacher_course=json.teacher_overcourse_arr;
				var len=json.teacher_overcourse_arr.length;
				for(var i=0;i<len;i++){
					$('.sigle').append('<a class="left" href="http://www.fxzhoumo.com/detail/course.html?courseid='+teacher_course[i].over_course_id+'">'+
	                '<img src="'+ceshi+teacher_course[i].over_course_photo+'" alt="">'+
	               '<p>'+teacher_course[i].over_course_title+'</p></a>');
				}
				$('.activity_teacher').append('<div class="headImg"><img class="picture_user" src="../videoShareContent_img/user.png" alt=""></div>'+
			        '<p class="published">已发布的活动('+json.teacher_overcourse_count+')</p>'+
			        '<p class="right_jump"><img src="../videoShareContent_img/more.png" alt=""></p>');
				$('.activity_teacher').attr('href','publish.html')
				
				//已关注活动部分
				/*
				var attention_teacher=json.collect_course_arr;
				var takelen=json.collect_course_arr.length;
				if(takelen!=0){
					var attention=$('<a class="attention_teacher" href="attention.html"></a>');
					$('section').append(attention);
					$('.attention_teacher').append('<div class="headImg"><img class="picture_user" src="../videoShareContent_img/attention.png" alt=""></div>'+
			        '<p class="published">已关注的活动('+json.teacher_collectcourse_count+')</p>'+
			        '<p class="right_jump"><img src="../videoShareContent_img/more.png" alt=""></p>');
					var attentionActivity=$('<div class="sigle_attention"></div>');
					$('.attention_teacher').after(attentionActivity);
					for(var j=0;j<takelen;j++){
						$('.sigle_attention').append('<a class="left" href="http://www.fxzhoumo.com/detail/course.html?courseid='+attention_teacher[j].collect_course_id+'">'+
		                	'<img src="'+imgUrl+attention_teacher[j].collect_course_photo+'" alt="">'+
		               		'<p>'+attention_teacher[j].collect_course_title+'</p></a>');
					}
				
				}
				*/


				//已参与活动部分
				/*
				var join_arr=json.teacher_takecourse_arr;
				var joinlen=json.teacher_takecourse_arr.length;
				if(joinlen!=0){
					var join=$('<a class="join_teacher" href="join.html"></a>');
					$('section').append(join);
					$('.join_teacher').append('<div class="headImg"><img class="picture_user" src="../videoShareContent_img/join.png" alt=""></div>'+
			        '<p class="published">已参与的活动('+json.teacher_takecourse_count+')</p>'+
			        '<p class="right_jump"><img src="../videoShareContent_img/more.png" alt=""></p>')
					var joinActivity=$('<div class="sigle_join"></div>');
					$('.join_teacher').after(joinActivity);
					for(var n=0;n<joinlen;n++){
						$('.sigle_join').append('<a class="left" href="http://www.fxzhoumo.com/detail/course.html?courseid='+join_arr[n].takepart_course_id+'">'+
		                '<img src="'+imgUrl+join_arr[n].takepart_course_photo+'" alt="">'+
		               '<p>'+join_arr[n].takepart_course_title+'</p></a>');
					}

				}
				*/
			}
		}

	})
})