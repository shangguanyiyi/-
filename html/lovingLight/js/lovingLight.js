var imgURL='http://img.fxzhoumo.com/';
// var imgURL='http://img.mammachoice.com/';
var loveArray=[];
var i=0;
function getByteLen(val) {
      var len = 0;
      for (var i = 0; i < val.length; i++) {
        var a = val.charAt(i);
        if (a.match(/[^\x00-\xff]/ig) != null) {
          len += 2;
        }
        else {
          len += 1;
        }
      }
      return len;
    }
//获取表白数据  填充到页
function timerFun(){
	$.ajax({
		url:'/IFestivalServlet?method=queryZhuYuan',
		type:'post',
		success:function(data){
			var json = eval("("+data+")");
			console.log(json);
			if(json.code=="success"){
				var loveArray=json.festivalCourseArray;
				$('.marqueeBox0').show();
				$('.marqueeBox0~.brother').hide();
				for(var i=0;i<3;i++){
					$('.marqueeBox0').append('<div class="writeConfession'+i+'">'+
						'<p class="common_toSomebody">TO:'+loveArray[i].sayForm+'</p>'+
						'<div  class="commonText">'+loveArray[i].content+'</div>'+
						'<p class="common_fromMe">From:'+loveArray[i].sayto+'</p></div>');
				}


				for(var i=3;i<6;i++){
					$('.marqueeBox1').append('<div class="writeConfession'+(i-3)+'">'+
						'<p class="common_toSomebody">TO:'+loveArray[i].sayForm+'</p>'+
						'<div  class="commonText">'+loveArray[i].content+'</div>'+
						'<p class="common_fromMe">From:'+loveArray[i].sayto+'</p></div>');
				}
				for(var i=6;i<9;i++){
					$('.marqueeBox2').append('<div class="writeConfession'+(i-6)+'">'+
						'<p class="common_toSomebody">TO:'+loveArray[i].sayForm+'</p>'+
						'<div  class="commonText">'+loveArray[i].content+'</div>'+
						'<p class="common_fromMe">From:'+loveArray[i].sayto+'</p></div>')
				}
				for(var i=9;i<12;i++){
					$('.marqueeBox3').append('<div class="writeConfession'+(i-9)+'">'+
						'<p class="common_toSomebody">TO:'+loveArray[i].sayForm+'</p>'+
						'<div  class="commonText">'+loveArray[i].content+'</div>'+
						'<p class="common_fromMe">From:'+loveArray[i].sayto+'</p></div>')
				}
				for(var i=12;i<15;i++){
					$('.marqueeBox4').append('<div class="writeConfession'+(i-12)+'">'+
						'<p class="common_toSomebody">TO:'+loveArray[i].sayForm+'</p>'+
						'<div  class="commonText">'+loveArray[i].content+'</div>'+
						'<p class="common_fromMe">From:'+loveArray[i].sayto+'</p></div>')
				}
				for(var i=15;i<18;i++){
					$('.marqueeBox5').append('<div class="writeConfession'+(i-15)+'">'+
						'<p class="common_toSomebody">TO:'+loveArray[i].sayForm+'</p>'+
						'<div  class="commonText">'+loveArray[i].content+'</div>'+
						'<p class="common_fromMe">From:'+loveArray[i].sayto+'</p></div>')
				}
				for(var i=18;i<21;i++){
					$('.marqueeBox6').append('<div class="writeConfession'+(i-18)+'">'+
						'<p class="common_toSomebody">TO:'+loveArray[i].sayForm+'</p>'+
						'<div  class="commonText">'+loveArray[i].content+'</div>'+
						'<p class="common_fromMe">From:'+loveArray[i].sayto+'</p></div>')
				}
				for(var i=21;i<24;i++){
					$('.marqueeBox7').append('<div class="writeConfession'+(i-21)+'">'+
						'<p class="common_toSomebody">TO:'+loveArray[i].sayForm+'</p>'+
						'<div  class="commonText">'+loveArray[i].content+'</div>'+
						'<p class="common_fromMe">From:'+loveArray[i].sayto+'</p></div>')
				}
				for(var i=24;i<27;i++){
					$('.marqueeBox8').append('<div class="writeConfession'+(i-24)+'">'+
						'<p class="common_toSomebody">TO:'+loveArray[i].sayForm+'</p>'+
						'<div  class="commonText">'+loveArray[i].content+'</div>'+
						'<p class="common_fromMe">From:'+loveArray[i].sayto+'</p></div>')
				}
				for(var i=27;i<30;i++){
					$('.marqueeBox9').append('<div class="writeConfession'+(i-27)+'">'+
						'<p class="common_toSomebody">TO:'+loveArray[i].sayForm+'</p>'+
						'<div  class="commonText">'+loveArray[i].content+'</div>'+
						'<p class="common_fromMe">From:'+loveArray[i].sayto+'</p></div>')
				}
			}
		}
	})

}
$(function(){
	
	timerFun();
	var index=0;
	var timer=0;
		timer=setInterval(function(){	
			show(index);
			index++;
			if(index==10){
				index=0;
				timerFun();
			}
			function show(index){
				$('.wallText .brother').eq(index).fadeIn().siblings('div').fadeOut();
			}

		},5000);

	function is_weixin() {
		var ua = navigator.userAgent.toLowerCase();
		if (ua.match(/MicroMessenger/i) == "micromessenger") {
			return true;
		} else {
			return false;
		}
	}
	var isWeixin = is_weixin();
	if(isWeixin){
		$('.fuchuang').show();
		$('.tip').hide();
		//点击生成告白
		$('.btn').bind('click',function(){
			var pic;
			var str;
			var sayTo=$('.toSomebody').val();
			var sayFrom=$('.fromMe').val();
			var content=$('.textarea').val();
			var phone=$('.phone').val();
			var tel_RegExp = /^1[3|4|5|7|8]\d{9}$/;
			if(!(tel_RegExp.test(phone))){
				alert("请正确填写手机号");
				return;
			}
			var reg = /\'|’|‘|“|”|'|&/g;
			content = content.replace(reg, "");
			if(sayTo==""){
				alert("请填写收信人");
			}else if(sayFrom==""){
				alert("请填写寄信人");
			}else if(content==""){
				alert("请填写内容");
			}else{
				var contentStr=getByteLen(content);
				if(contentStr>100){
					alert("您的输入超过了限制字数~")
				}else{
					$.ajax({
						url:'/IFestivalServlet?method=saveZhuYuan',
						type:'post',
						data:'servicestr={"sayFrom":"'+sayTo+'","sayTo":"'+sayFrom+'","content":"'+content+'","mobile":"'+phone+'"}',
						success:function(data){
							var json = eval("("+data+")");
							if(json.code=="success"){
								pic=json.picture;
								window.location.href="lovingPicture.html?picture="+imgURL+pic;

								// $('.pop_save').attr('href','/IFestivalServlet?method=downloadImg&imageName='+pic);
								// $('.picSave img').attr('src',imgURL+pic);
								// $('.makeWall').show();
								// window.scrollTo(0,0);
								// $('.writeConfession').hide();
							}else{
								alert(json.description);
							}
						}
					})
				}
				
			}
			
			
		})
	
	}else{
		$('.btn').bind('click',function(){
			var pic;
			var str;
			var sayTo=$('.toSomebody').val();
			var sayFrom=$('.fromMe').val();
			var content=$('.textarea').val();
			var phone=$('.phone').val();
			var tel_RegExp = /^1[3|4|5|7|8]\d{9}$/;
			if(!(tel_RegExp.test(phone))){
				alert("请正确填写手机号");
				return;
			}
			var reg = /\'|’|‘|“|”|'|&/g;
			content = content.replace(reg, "");

			if(sayTo==""){
				alert("请填写收信人");
			}else if(sayFrom==""){
				alert("请填写寄信人");
			}else if(content==""){
				alert("请填写内容");
			}else{
				var contentStr=getByteLen(content);
				if(contentStr>100){
					alert("您的输入超过了限制字数~")
				}else{
					$.ajax({
						url:'/IFestivalServlet?method=saveZhuYuan',
						type:'post',
						data:'servicestr={"sayFrom":"'+sayTo+'","sayTo":"'+sayFrom+'","content":"'+content+'","mobile":"'+phone+'"}',
						success:function(data){
							var json = eval("("+data+")");
							if(json.code=="success"){
								pic=json.picture;
								// window.location.href="lovingPicture.html?picture="+imgURL+pic;

								// $('.pop_save').attr('href','/IFestivalServlet?method=downloadImg&imageName='+pic);
								// $('.picSave img').attr('src',imgURL+pic);
								// $('.makeWall').show();
								// window.scrollTo(0,0);
								// $('.writeConfession').hide();
								
								// window.scrollTo(0,0);
								$('.mask1').show();
								// window.location.reload();
							}else{
								alert(json.description);
							}
						}
					})
				}
			}

				
			

		})
	}	
})