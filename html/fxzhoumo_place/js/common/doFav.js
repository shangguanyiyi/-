define(['FavElem','We'],function(FavElem,We){

	var success=function(){
		this.changeBgElem.style.backgroundPositionY="0px";
		var num=0;
		this.changeTextElem&&(num=parseInt(this.changeTextElem.innerText));
		this.changeTextElem&&(this.changeTextElem.innerText=++num);
	}
	var cancel=function(){
		this.changeBgElem.style.backgroundPositionY="-25px";
		var num=0;
		this.changeTextElem&&(num=parseInt(this.changeTextElem.innerText));
		this.changeTextElem&&(--num>0?(this.changeTextElem.innerText=num):(this.changeTextElem.innerText=0));
	}

	function start(elem,url,endo,undo){


		We.addEvent(elem,'click',function(e){

			var target=e.target;
			var currentTarget=null;
			if(target.classList.contains('changeFavBtn')){
				currentTarget=target;
				e.preventDefault();
			}else if(target.parentNode&&target.parentNode.classList.contains('changeFavBtn')){
				currentTarget=target.parentNode;
				e.preventDefault();
			}else{
				return;
			}
			var favid=parseInt(currentTarget.getAttribute("favid"));
			var tagtype=parseInt(currentTarget.getAttribute("tagtype"));
			var changeBgElem=currentTarget.querySelector(".changeBgElem");
			var changeTextElem=currentTarget.querySelector(".changeTextElem");
		
			var favElem=new FavElem({
				favBtn:currentTarget,
				changeBgElem:changeBgElem,
				changeTextElem:changeTextElem,
				url:url,
				favid:favid,
				tagtype:tagtype,
				success:endo||success,
				cancel:undo||cancel
			})
			favElem.init();
		})
	}

	return {
		start:start
	};
})