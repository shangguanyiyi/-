 $(function(){
	  $('.header_nav_ul').click(function(){
			var src = event.target||event.srcElement;
            console.log(src);
			var href = $(src).attr('href');
            // console.log(href);
			if(!href){
				return; 
			}
			$('.current').removeClass('current');
			$(src).addClass('current');
	  })

      var url=location.search;
        if(url.indexOf("?")!=-1){

        }
        else{uaredirect("http://www.fxzhoumo.com/mindex.html");}

    $('.picture1').mouseover(function(){
        $('.ios').css({"background":"url(show_img/apple_light.png) no-repeat"})
        $('.picture1').
        css({"background-color":"#86e2fd","box-shadow":"10px 10px 30px rgba(150,150,150,.3)",
            "-webkit-transition":"all 0.3s","border":"2px solid transparent"});
        $('.picture1 p').css({"color":"#fff"});
    }).mouseout(function(){
         $('.ios').css({"background":"url(show_img/apple.png) no-repeat"})
        $('.picture1').css({"background-color":"#fff","box-shadow":"10px 10px 30px rgba(0,0,0,0)",
            "-webkit-transition":"all 0.3s","border":"2px solid #ddd"});
        $('.picture1 p').css({"color":"#999"});
    })

    $('.picture2').mouseover(function(){
        $('.android').css({"background":"url(show_img/android_light.png) no-repeat"})
        $('.picture2').css({"background-color":"#86e2fd","box-shadow":"10px 10px 30px rgba(150,150,150,.3)",
            "-webkit-transition":"all 0.3s","border":"2px solid transparent"});
        $('.picture2 p').css({"color":"#fff"});
    }).mouseout(function(){
         $('.android').css({"background":"url(show_img/android.png) no-repeat"})
        $('.picture2').css({"background-color":"#fff","box-shadow":"10px 10px 30px rgba(0,0,0,0)",
            "-webkit-transition":"all 0.3s","border":"2px solid #ddd"});
        $('.picture2 p').css({"color":"#999"});
    })

       
});  