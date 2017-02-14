$(function(){

		$.ajax({
			url:"/IFestivalServlet?method=queryChristmasCourse",
			success:function(data){
				var json=eval("("+data+")");
				// console.log(json.festivalCourseArray);
				var festivalCourseArray=json.festivalCourseArray;
				for(var i=0;i<festivalCourseArray.length;i++){
						$(".bottom").append('<div class="luck"><div class="qiqiu"><img src="img/'+i
							+'.png"></div><div class="content"><span class="luckyP">'+  festivalCourseArray[i].mobile +'</span> : <span class="yuanwang">'+ 
							festivalCourseArray[i].content+'</span></div></div>')
				}
			}
		})
	
		$(".button").bind("touchstart",function(){
			var phone=$(".phone").val();
			var textarea=$(".textarea").val();
			//alert(phone + "-----" + textarea);
				$.ajax({
				url:"/IFestivalServlet?method=saveChristmasCourse",
				type:"post",
				data:'servicestr={"mobile":"'+phone+'","content":"'+textarea+'"}',
				success:function(data){
					var json=eval("("+data+")");
					if(json.code=="success"){//保存成功
						window.location.reload();
					}else{
						alert(json.description);
					}
				}
			})
		})

})