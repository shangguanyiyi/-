(function(){
	function getElementPosition(e){
		var x=0,
			y=0;
		while(e!=null){
			x+=e.offsetLeft;
			y+=e.offsetTop;
			e=e.offsetParent;
		}
		return {
			x:x,
			y:y
		}
	}
	var module=null;
	var Tip=function(opts){
		var container=opts.container||document.body;
		var weidth=document.documentElement.clientWidth;
		var height=document.documentElement.clientHeight;
		var allHeight=document.body.scrollHeight;
		var isFixed=opts.isFixed;
		var parent=opts.parent;

		function init(){	
			createModule();
			createClose();
		}
		init();
		function createModule(){
			var div=document.createElement('div');
			div.classList.add('pop');
			var arrow=document.createElement('div');
			arrow.classList.add('arrow');
			var content=document.createElement('div');
			content.classList.add('popcontent');
			content.innerHTML=opts.msg;
			div.appendChild(arrow);
			div.appendChild(content);
			document.body.appendChild(div);
			setPosition(div);
			module=div;
		}
		function setPosition(div){
			var width=div.offsetWidth,
				height=div.offsetHeight,
				elemWidth=opts.elem.offsetWidth,
				obj=getElementPosition(opts.elem);
			var top=obj.y,
				left=obj.x;

			div.style.left=left+elemWidth/2-width/2+"px";
			if(top<=height){
				div.style.top=height+"px";
				div.removeChild(div.querySelector('.arrow'));
			}else{
				if(parent){
					top=top-parent.scrollTop;
				}
				div.style.top=top-height+"px";

			}
			if(isFixed){
				div.style.position="fixed";
			}
		}
		function createClose(){
			var div=document.createElement('div');
			div.classList.add('closeShadow');
			//div.style.height=allHeight+"px";
			document.body.appendChild(div);
			div.addEventListener('click',function(){
				this.parentNode.removeChild(this);
				module.parentNode.removeChild(module);
			})
		}
	}
	if(define!=='undefined'){
		define(function(){
			return Tip;
		})
	}
	
})()