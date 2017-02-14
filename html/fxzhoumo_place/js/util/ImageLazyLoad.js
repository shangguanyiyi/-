/*

	图片懒加载,无需任何库,只支持IE9以上现代浏览器
	img元素需要指定data-src属性：此属性值为需要加载的图片的链接地址 
	ImageLazyLoad.init();使用默认配置,默认懒加载body内所有图片
	ImageLazyLoad.init({
		offset:100,
		callback:function(){},
		container:document.querySelector(''); 指定需要懒加载图片的初始容器
	})
	callback:加载图片后的回调
	refresh:监听事件变化,加载图片,无需传入参数
	add:接收图片元素数组,当dom树新添图片元素时,将新加入的图片元素传入,自动懒加载

*/

/*
示例:
document.addEventListener('DOMContentLoaded',function(){

	//ImageLazyLoad.init();
	ImageLazyLoad.init({
		offset:100,
		container:document.querySelector('')
	})

	window.addEventListener('scroll',function(){

		ImageLazyLoad.refresh();
	})
})
*/
var ImageLazyLoad={
	opts:{
		offset:0,
		container:null,
		callback:null
	},
	clientHeight:document.documentElement.clientHeight,
	clientWidth:document.documentElement.clientWidth,
	innerHeight:window.innerHeight,
	innerWidth:window.innerWidth,
	forEach:[].forEach,
	splice:[].splice,
	filter:[].filter,
	concat:[].concat,
	imgList:[],
	init:function(options){
		var me=this;
		var options=this.extend(this.opts,options);
		var container=options.container||document.body;
		this.imgList=container.querySelectorAll('img[data-src]');
		this.imgList=Array.prototype.slice.call(this.imgList);
		this.refresh();
	},
	extend:function(target,source){
		var key;
		for(key in source){
			target[key]=source[key];
		}
		return target;
	},
	isInViewport:function(item){
		var rect=item.getBoundingClientRect();
		var offset=this.opts.offset;
		return rect.top>=-offset&&rect.left>=-offset
				&&rect.bottom<=(this.innerHeight+offset||this.clientHeight+offset)&&
				rect.right<=(this.innerWidth+offset||this.clientWidth+offset);
	},
	load:function(elem,idx){
		var me=this;
		var src=elem.getAttribute('data-src');
		var img=new Image();
		img.src=src;
		img.onload=function(){
				elem.src=src;
				me.splice.call(me.imgList,idx,1,null);
		}		
		if(me.opts.callback){
			me.opts.callback.call(this);
		}

	},
	refresh:function(){
		var me=this;
		this.forEach.call(this.imgList,function(item,idx){
			if(item&&me.isInViewport(item)){
				me.load(item,idx);
			}
		})
	},
	add:function(list){
		this.imgList=this.concat.call(this.imgList,list);
		this.refresh();
	}
}



