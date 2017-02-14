define(function(){
	
	var trans=["t", "webkitT", "MozT", "msT", "OT"];
	var styles=document.createElement('div').style;
	var prefix=(function(){
		var i,
			len;
		for(i=0,len=trans.length;i<len;i++){
			var e=trans[i]+'ransform';
			if(e in styles){

				return trans[i].substr(0,trans[i].length-1);
			}
		}
		return false;
	})();

	function getPreFix(str){
		if(prefix===false){
			return false;
		}else if(prefix===''){
			return str;
		}else{
			return prefix+str.charAt(0).toUpperCase()+str.substr(1);
		}
		return false;
	}
	var transform=getPreFix('transform');
	var transitionDuration=getPreFix('transitionDuration');
	return {
		'transform':transform,
		'transitionDuration':transitionDuration
	}
})