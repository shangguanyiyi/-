function getStr(string,str){ 
    var str_before = string.split(str)[0]; 
    var str_after = string.split(str)[1]; 
   
    return str_after;
} 
$(function(){
	var url=window.location.href;
	var imgurl=getStr(url,'&');
	$('.company_logo img').attr('src','../images/'+imgurl+'.JPG');
})