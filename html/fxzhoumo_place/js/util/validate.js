(function(){

	function createMsg(elem,message){
		var msg={};
		msg.elem=elem;
		msg.errorMsg=message;
		msg.flag=true;
		return msg;
	}

	function Validate(form){

		var elements=form.elements;
		for(var i=0;i<elements.length;i++){
			var elem=elements[i];
			var pattern=elements[i].getAttribute('data-pattern');
			if(!pattern)continue;
			var value=elem.value.trim();
			var reg=new RegExp(pattern);
			var msg=null;
			var id="label_"+elem.getAttribute('id');
			var text=document.getElementById(id).innerText.trim().replace(/\s/g,"");
			if(value===""){
				msg=createMsg(elem,text+"不能为空！");
				break;
			}
			if(!reg.test(value)){
				msg=createMsg(elem,text+"格式错误！");
				break;
			}
		}
		elements=null;
		return msg;
	}

	if(define!=='undefined'){
		define(function(){
			return Validate;
		})
	}

})()