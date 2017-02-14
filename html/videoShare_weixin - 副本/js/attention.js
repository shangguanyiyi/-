$(function(){
	$.ajax({
		url:'/IRecommendV2Servlet?method=searchbycoursetype',
		type:'post',
		data:'servicestr={"nowx":"10.00","nowy":"10.00","coursetype":1,"pageindex":1}',
		success:function(data){
			var json=eval("("+data+")");
			if(json.code=="success"){
				console.log(json);
				$('.section').append('<div class="info">'+
        '<a href="http://www.fxzhoumo.com/detail/course.html?courseid=6188">'+
            '<div class="big">'+
                '<img id="bigpic10" src="http://img.fxzhoumo.com/xue/218767/218767cover20160425105054mid.jpg" class="banner" width="100%">'+
                '<div class="mask" id="mask10">'+
                    '<img src="../videoShareContent_img/mask2.png">'+
                '</div>'+
            '</div>'+
        '</a>'+
        '<a href="http://www.fxzhoumo.com/detail/course.html?courseid=6188">'+
            '<div class="produce">'+
                '<p class="pro_theme" id="pro_theme10">精选优质食材 蔓延浪漫气息 wood木餐厅单人晚餐</p>'+
                '<p class="pro_time" id="pro_time10">2016.06.30前有效</p>'+
                '<p class="pro_address" id="pro_address10">wood木餐厅</p>'+
                '<p class="pro_price">'+
                    '<span class="finish" id="price10">228</span>'+
                    '<i id="pieces10">元起</i>'+ 
                    '<s class="start" id="old_price10"></s>'+
                    '<span class="residus">仅剩<i class="course_new" id="course_new10">12</i>份</span>'+
                    '<u class="distance"></u>'+
               ' </p>'+
            '</div>'+
        '</a>'+
       
    '</div>')	
			}
		}
	})
})