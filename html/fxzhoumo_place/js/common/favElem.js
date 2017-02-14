define(['We','Tip'],function(We,Tip){



	function FavElem(opts){
		this.favBtn=opts.favBtn; //喜欢按钮
		this.changeBgElem=opts.changeBgElem;//喜欢按钮下面的心形
		this.changeTextElem=opts.changeTextElem;//喜欢后需要改变的文字的容器
		this.url=opts.url;
		this.favid=opts.favid;//被喜欢的课程ID
		this.tagtype=opts.tagtype;//被喜欢的类型
		this.success=opts.success;//喜欢成功后的回调
		this.cancel=opts.cancel;//取消喜欢后的回调
	}


	FavElem.prototype={
		constructor:FavElem,
		init:function(){
			var me=this;
			var param=this.createParam();
			var str="servicestr="+JSON.stringify(param);
			We.ajaxRequest(this.url,{
				send:str,
				completeListener:function(){
					var data=JSON.parse(this.responseText);
					if(data.code=="success"){
						me.doFav(data);
					}else{
						Tip({
							elem:me.favBtn,
							msg:data.description
						});
					}
				}
			});
		},
		createParam:function(){
			var obj={};
			obj.favid=this.favid;
			obj.tagtype=this.tagtype;
			return obj;
		},
		doFav:function(data){
			if(data.iscollect==1){
				this.success();
			}else{
				this.cancel();
			}
		}
	}


	return FavElem;
})


