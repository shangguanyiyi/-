var shareTitle;
var share_course_vice_title;
var sharePhoto;
//活动详情
$(function(){
    var courseid = GetQueryString("courseid");
    $("#courseid").val(courseid);
    $.ajax({
            url:"/IQueryCourseReleaseV2Servlet?method=toDetailV2",
            type:"post",
            data:'servicestr={"nowx":"","nowy":"","courseid":"'+courseid+'"}', 
            dataType:"html",
            success:function(data){       
                var json = eval("("+data+")");
                //轮播图
                if(json.code=="success"){
                    var other_photo_length = json.course_photo_others.length;
                    sharePhoto = json.course_photo;
                    if(other_photo_length>0){
                        for(var i=0;i<other_photo_length;i++){
                            $(".swiper-wrapper").append(
                                '<li class="swiper-slide'+(other_photo_length==1?' swiper-no-swiping':'')+'">'+
                                '<img src="http://img.fxzhoumo.com/'+json.course_photo_others[i]+'" alt="" id="scollimg_'+i+'" class="scroll_img" >'+
                                '</li>'
                            );
                        }
                    }else if(other_photo_length==""){
                         $(".swiper-wrapper").append('<li class="swiper-slide swiper-no-swiping"><img src="http://img.fxzhoumo.com/'+json.course_photo+'"  id="course_photo" class="scroll_img"/></li>')
                    }
                    $("#loading").hide();

                    //课程活动标题  
                    $("#course_title").text(json.course_title);
                    //微信分享所需正标题和副标题
                    shareTitle = json.course_title;
                    share_course_vice_title = json.course_vice_title; 
                    //课程活动时间
                    $("#course_datetime").text(json.course_datetime);

                    //课程活动现价
                    if(json.course_price_suffix==""){
                         $("#course_price_suffix").text("");
                    }else{
                        var courseprice_suffix=parseInt(json.course_price_suffix);
                        var pieces=json.course_price_suffix.slice(courseprice_suffix.toString().length);
                        $("#course_price_suffix").text(courseprice_suffix);
                        $("#course_price").text(pieces);//单位
                    }
                    

                    //价格对比
                    var course_price = json.course_price;
                    var course_old_price = json.course_old_price;
                    if(course_price==-1){
                         $("#course_old_price").text("");
                    }
                    if(course_old_price>0){
                        $("#course_old_price").text(course_old_price+'元');
                    }else if(course_old_price==0){
                         $("#course_old_price").text("");
                    }

                    //活动具体位置
                    $("#course_detailplace").text(json.course_detailplace);
                   
                    //活动地点的X坐标和y坐标
                    //地图X坐标Y坐标
                    $('#course_place').attr('href','map.html?x='+json.course_place_x+'&y='+json.course_place_y);
                
                    //活动亮点 //活动亮点的详细内容
                    $('#activity_list').html('<li id="course_lightspot_type"></li>');
                    if(json.course_description_arr!=""){
                        $("#course_lightspot_type").text(json.course_lightspot_type) ;
                         var course_lightspot_arr = json.course_lightspot.split("|");
                        for(var i=0;i<course_lightspot_arr.length;i++){
                            $("#activity_list").append('<li>'+course_lightspot_arr[i]+'</li>');
                        }   
                   
                    }

                    //组织者头像
                    var course_teacher_photo = "http://img.fxzhoumo.com/"+json.course_teacher_photo;
                    $("#course_teacher_photo").attr("src",course_teacher_photo);
                    
                    //组织者昵称
                    $("#course_teacher_nickname").text(json.course_teacher_nickname);
                    
                    //组织者类型
                    $("#course_teacher_type").text(json.course_teacher_type);
                    
                    //组织者简介
                    $("#course_teacher_oneabstract").text(json.course_teacher_oneabstract);
               
                    //活动描述图文混排
                    var course_description_arr_length =json.course_description_arr.length;
                    var course_description_arr = json.course_description_arr;
                    // console.log(json.course_description);
                    if(course_description_arr_length==""){
                        var course_description =  json.course_description;//活动描述
                         

                        var config_url = "http://img.fxzhoumo.com/";
                        var reg=/\n/;
                        var r=/\s/g;   //匹配任意的空白符。表示该表达式将用来在输入字符串中查找所有可能的匹配，返回的结果可以是多个。如果不加/g最多只会匹配一个
                        var desc=course_description.split(reg);
                        var d=desc.map(function(item){
                            var item=item.replace(r,"&nbsp;");
                             return "<p>"+item+"</p>";
                        })
                        var before=/\[img:/g;
                        var after=/:img\]/g;
                        course_description=d.join('').replace(before,"<img src='"+config_url).replace(after,"'/>").replace(/\n/g,"<br/>");
                    }else{

                        // console.log(json.course_description_arr);
                        for(var i=0;i<course_description_arr_length;i++){
                            var course_description_content = course_description_arr[i].course_description_content;
                            var course_description_title = course_description_arr[i].course_description_title;
                            // console.log(course_description_content);
                            var config_url = "http://img.fxzhoumo.com/";
                            var before=/\[img:/g;
                            var after=/:img\]/g;
                            var cc=course_description_content.replace(before,"<img class='image_text_img' src='"+config_url).replace(after,"'/>").replace(/\n/g,"<br/>");
                            $('#des_img_text').append("<img src='http://img.fxzhoumo.com/"+course_description_title+"' alt=''/>"+cc);
                        }
                    };
                
                    $(".des_img_text").html(course_description);
                    
                    // 温馨提示
                    var course_hint = json.course_hint;
                    var course_hint_arr = course_hint.split("|")
                    for(var i=0;i<course_hint_arr.length;i++){
                        $("#activity_list_remind").append('<li>'+course_hint_arr[i]+'</li>')
                    }

                    //温馨提示下面的图
                    var course_hint_photo_arr = json.course_hint_photo_arr;
                    var course_hint_name = json.course_hint_name;
                    for(var i=0;i<course_hint_photo_arr.length;i++){
                        $("#course_hint_photo_arr").append("<img src='http://img.fxzhoumo.com/"+course_hint_photo_arr[i].course_hint_photo+"' alt=''/>")
                        $("#course_hint_photo_arr").append("<li>"+course_hint_photo_arr[i].course_hint_name+"</li>")
                    }

                    // 剩余份数
                    $("#course_havecount").html('<u>剩余</u>'+json.course_new_havecount+'份');           

                    //多价格选择
                    var coursePriceSize = json.course_price_arr.length;
                    if(coursePriceSize==1){
                        var courseid = $("#courseid").val();
                        var course_price_id = $("#course_price_id").val();
                        if(!isWeiXin){
                            $("#course_isapplydes").attr("href","http://www.fxzhoumo.com/list/sign.jsp?courseid="+courseid+"&course_price_id="+course_price_id);

                        }else{
                            var wei_url=escape("http://www.fxzhoumo.com/list/sign.jsp?courseid="+courseid+"&course_price_id="+course_price_id);
                             $("#course_isapplydes").attr("href","https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx47987fa108b8329b&redirect_uri="+wei_url+"&response_type=code&scope=snsapi_base&state=1#wechat_redirect");
                        }
                    }else if(coursePriceSize>1){

                        for(var i=0;i<coursePriceSize;i++){
                            var course_price = json.course_price_arr[i];  
                            var course_price_id = course_price.course_price_id;
                            var course_price_arr_count = json.course_price_arr.length;
                            //判断价格，如果是多价格出遮罩层，单价格直接跳转到支付页面
                            var cs =  (course_price.course_price_once_havecount>0) ? ('onclick="clickFun('+course_price_id+')"'):'';
                            var style = (course_price.course_price_once_havecount==0) ?"spe_textspe":'';        //如果剩余份数为0的话，字的颜色变灰      
                            var clickStr = '<li class="radio" ><span class="opt-text ' + style +'"><u class="spe_text ' + style +'">'+course_price.course_price_once+'</u>'+course_price.course_price_once_desc + '&nbsp'+
                                            '(剩余'+course_price.course_price_once_havecount+'份)</span><input type="radio"  name="sport" value="cba"><label name="cba" id="label_'+course_price_id+'" for="cba" ' + cs +'></label></li>';
                                $("#ul_list").append(clickStr);                         
                        };
                        //
                        $('#course_isapplydes').on('touchstart', function(event){     
                            $("#course_isapplydes").text("请选择套餐");              
                            $('#cd-popup').addClass('is-visible'); 
                            $("#contain").addClass("containfixed");
                        });
                         //遮罩层        
                        $('#cd-popup').on('touchstart', function(event){
                            if( $(event.target).is('.cd-popup-close')) { 
                                $(this).removeClass('is-visible');
                                $("#course_isapplydes").text("立即报名");
                                $("#contain").removeClass("containfixed") 
                            }  
                        });
                    }
                

                    //按钮显示与否//（0：立即报名，1：已报满，2：已结束|时间待定，无法报名)，当值为-1时，不显示按钮
                    var isapply = json.course_isapply;
                    var course_isapplydes = json.course_isapplydes;
                    if(isapply==0){
                        $("#course_isapplydes").text(course_isapplydes);
                    }else if(isapply==1||isapply==2){
                        $("#course_isapplydes").text(course_isapplydes).css("background","#ccc").attr("href","javascript:;") ; 
                    }else if(isapply==-1){
                        $("#apply").hide();
                    }

                    //swiper轮播图
                    var swiper = new Swiper('.swiper-container', {
                        pagination: '.swiper-pagination',
                        loop: true,
                        autoplayDisableOnInteraction : false, 
                        preventClicks : false,
                    });
                    share();
                }else{
                    alert(json.description); 
                }
            }
    });

    function share(){
        //-----------分享好友和朋友圈
        wx_url=escape(window.location.href);
        $.ajax({
            url:"/WeixinServlet?method=weixinPower",
            type:"post",
            data:'servicestr={"wei_url":"'+wx_url+'"}',  
            dataType:"html",
            success:function(data){
                var json = eval("("+data+")");
                var share_photo = "http://img.fxzhoumo.com/"+sharePhoto;
                if(json.code=="success"){
                    wx.config({
                        debug: false, 
                        appId: 'wx47987fa108b8329b', 
                       // appId:'wxd470058f4535a61d', //mammachoice
                        timestamp:json.timestamp,
                        nonceStr: json.nonceStr,
                        signature: json.signature,
                        jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo','onMenuShareQZone']
                    });
                    var shareObject = {
                        title: ""+shareTitle+"",
                        desc: "发现周末App上的["+share_course_vice_title+"]很棒，这个周末跟我一起参加吧！",
                        link: window.location.href,
                        imgUrl: share_photo
                    };
                    var shareFriend={
                        title:"发现周末App上的["+shareTitle+"]很棒，快来参加吧！",
                        link: window.location.href,
                        imgUrl: share_photo
                    }
                    wx.ready( function (){
                        wx.onMenuShareTimeline(shareFriend);   //朋友圈
                        wx.onMenuShareAppMessage(shareObject);  //好友
                    });
                }else{
                    alert(json.description);
                }
                
            }
        });
    }
        
});

//页面显示的详情须知切换
$(document).ready(function(){
    var nav = $("#nav").height();  //顶部的nav的高度
    var pnc = $("#particulars_notice_change").height();
    
    //页面的详情切换
    $("#particulars").bind("touchstart",function(){
        $("#notice").removeClass("select");
        $("#particulars").addClass("select");
        //跳到指定位置
        var pn = $("#particulars_notice_change").offset().top;
        // console.log(pn)
        $(window).scrollTop(pn-nav)
    }); 

    //页面的须知切换
    $("#notice").bind("touchstart",function(){
        //详情须知切换
        setTimeout(function(){
            $("#notice").addClass("select");
            $("#particulars").removeClass("select");
            $("#notice_fixed").addClass("select");
            $("#particulars_fixed").removeClass("select");
        }, 10);
        
        //跳到指定位置
        var wr = $("#warm_remind").offset().top;
        var pnc = $("#particulars_notice_change").height();
        $(window).scrollTop(wr-nav-pnc);
    });

    //页面隐藏的详情切换
    $("#particulars_fixed").bind("touchstart",function(){
        $("#notice_fixed").removeClass("select");
        $("#particulars_fixed").addClass("select");
        $("#notice").removeClass("select");
        $("#particulars").addClass("select");
        var pn = $("#particulars_notice_change").offset().top;
        $(window).scrollTop(pn-nav)
    });

    //页面隐藏的须知切换
    $("#notice_fixed").bind("touchstart",function(){      
       setTimeout(function(){
            $("#notice").addClass("select");
            $("#particulars").removeClass("select");
            $("#notice_fixed").addClass("select");
            $("#particulars_fixed").removeClass("select");
       },10);
        var wr = $("#warm_remind").offset().top;
        $(window).scrollTop(wr-nav-pnc);
    });

    //页面显示的详情须知切换  
    $(window).scroll(function(){
        var this_scrollTop = $(this).scrollTop();  
        var psn = $("#particulars_notice_change").offset().top;   //获取详情须知离顶部的距离  
        var wr = $("#warm_remind").offset().top; 
        //当页面滚到详情、须知时来回切换     
        if(this_scrollTop>psn-nav){            
            $("#particulars_notice_change_fixed").show()
        }else if(this_scrollTop<psn-nav){
            $("#particulars_notice_change_fixed").hide()
        }
         if(this_scrollTop>wr-nav-pnc){
            $("#particulars_fixed").removeClass("select");
            $("#notice_fixed").addClass("select");
        }else if(this_scrollTop<wr-nav-pnc){
            $("#particulars_fixed").addClass("select");
            $("#notice_fixed").removeClass("select");
            $("#notice").removeClass("select");
            $("#particulars").addClass("select");
        }
        //当页面的须知不在可视区的时候，隐藏须知和详情
        var recommend_activity = $(".recommend_activity").offset().top;
        if(this_scrollTop>=recommend_activity-nav-pnc){
            $("#particulars_notice_change_fixed").hide();
        }
    });   
}); 

//推荐活动列表
$(function(){
     var courseid = GetQueryString("courseid");
     // var courseid = $('#courseid').val();
        $.ajax({
            url:"/IQueryCourseReleaseV2Servlet?method=hotCourse",
            type:"post",
            data:'servicestr={"nowx":"","nowy":"","courseid":"'+courseid+'"}', 
            dataType:"html",
            success:function(data){
                var value = JSON.parse(data);         
                if(value.code=="success"){
                    var tcrarr = value.tcrarr;
                    var arr = tcrarr.length ;
                    for (var i = 0; i < arr; i++) {
                        var headphoto = "http://img.fxzhoumo.com/"+tcrarr[i].headphoto;
                        $("#headphoto_"+i).attr('src',headphoto);
                        $("#title_"+i).html(tcrarr[i].title);
                        $("#time_"+i).html(tcrarr[i].course_time);  
                        $("#address_"+i).html(tcrarr[i].coursesite) ;
                        var cour_seprice_suffix = parseInt(tcrarr[i].courseprice_suffix);
                        var prices=tcrarr[i].courseprice_suffix.slice(cour_seprice_suffix.toString().length);
                        $("#courseprice_suffix_"+i).text(cour_seprice_suffix);
                        $("#prices_unit_"+i).text(prices);
                        $("#local_href_"+i).attr("href","http://www.fxzhoumo.com/detail/course.html?courseid="+tcrarr[i].courseid);               
                   }         
                }else{                                
                    alert(value.description);
                }                   
            }
        });
});

var isWeiXin=(function(){
            return navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1
        })();

//活动详情页
function GetQueryString(name) { 
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r!=null) return unescape(r[2]); return null; //返回参数值
};

//多价格函数调用
function clickFun(index,price){
    var courseid = $("#courseid").val();
    $('label').removeAttr('class') && $("#label_"+index).attr('class', 'checked');

    if(!isWeiXin){
        $("#mask_a1").attr("href","http://www.fxzhoumo.com/list/sign.jsp?courseid="+courseid+"&course_price_id="+index);
    }else{
        var wei_url=escape("http://www.fxzhoumo.com/list/sign.jsp?courseid="+courseid+"&course_price_id="+index);
        $("#mask_a1").attr("href","https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx47987fa108b8329b&redirect_uri="+wei_url+"&response_type=code&scope=snsapi_base&state=1#wechat_redirect");
    }
    
};
          

