(function(window,zoom){
	function setRate(){
		var w=docElem.getBoundingClientRect().width;
		w/scale>750&&(w=750*scale);
		var n=w/16;
		docElem.style.fontSize=n+"px";
		isFlex.rem=doc.rem=n;
	}
	var time,
		doc=window.document,
		docElem=doc.documentElement,
		viewportEl=doc.querySelector('meta[name="viewport"]'),
		flexibleEl=doc.querySelector('meta[name="flexible"]'),
		scale=0,
		rate=0,
		isFlex=zoom.flexible||(zoom.flexible={});
	if(viewportEl){
		console.warn('将根据已有的meta标签来设置缩放比例');
		var num=viewportEl.getAttribute('content').match(/initial\-scale=([\d\.]+)/);
		num&&(rate=parseFloat(num[1]),scale=parseInt(1/rate));
	}else{
		if(flexibleEl){
			var el=flexibleEl.getAttribute('content');
			if(el){
				var initNum=el.match(/initial\-dpr=([\d\.]+)/);
				var maxNum=el.match(/maximum\-dpr=([\d\.]+)/);
				initNum&&(scale=parseFloat(initNum[1]),rate=parseFloat((1/scale).toFixed(2))),
				maxNum&&(scale=parseFloat(maxNum[1]),rate=parseFloat((1/scale).toFixed(2)));
			}
		}
	}
	if(!scale&&!rate){
		var platform=(window.navigator.appVersion.match(/android/ig),window.navigator.appVersion.match(/iphone/ig));
		var ratio=window.devicePixelRatio;
		scale=platform?ratio>=3&&(!scale||scale>=3)?3:ratio>=2&&(!scale||scale>=2)?2:1:1;
		rate=1/scale;
	}
	if(docElem.setAttribute("data-dpr",scale),!viewportEl){
		if(viewportEl=doc.createElement('meta'),viewportEl.setAttribute('name','viewport'),viewportEl.setAttribute('content','initial-scale='+rate+', maximum-scale='+rate+', minimum-scale='+rate+', user-scalable=no'),docElem.firstElementChild){
			docElem.firstElementChild.appendChild(viewportEl);
		}else{
			var div=doc.createElement('div');
			div.appendChild(viewportEl);
			doc.write(div.innerHTML);
		}
	}
	window.addEventListener('resize',function(){
		clearTimeout(time);
		time=setTimeout(setRate,300);
	},false);
	window.addEventListener('pageshow',function(e){
		e.persisted&&(clearTimeout(time),time=setTimeout(setRate,300));
	},false);
	'complete'===doc.readyState?doc.body.style.fontSize=12*scale+"px":doc.addEventListener('DOMContentLoaded',function(){
		doc.body.style.fontSize=12*scale+'px';
	},false);
	setRate();
	isFlex.dpr=window.dpr=scale;
	isFlex.refreshRem=setRate;
	isFlex.rem2px=function(rem){
		var r=parseFloat(rem)*this.rem;
		return "string"==typeof rem && rem.match(/rem$/)&&(r+="px"),r;
	}
	isFlex.px2rem=function(px){
		var p=parseFloat(px)/this.rem;
		return "string"== typeof px&&px.match(/px$/)&&(p+="rem"),p;
	}
})(window,window.zoom||(window.zoom={}))