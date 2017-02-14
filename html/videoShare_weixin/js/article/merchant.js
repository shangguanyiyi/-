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
				$('.activity_teacher').append('<div class="headImg"><img class="picture_user" src="../img/usermechant.png" alt=""></div>'+
			        '<p class="published">已发布的活动('+json.teacher_overcourse_count+')</p>'+
			        '<p class="right_jump"><img src="../img/more.png" alt=""></p>');
				$('.activity_teacher').attr('href','publish.html')
				
			}
		}

	})
})