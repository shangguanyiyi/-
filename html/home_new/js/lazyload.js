$(function(){
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



})
