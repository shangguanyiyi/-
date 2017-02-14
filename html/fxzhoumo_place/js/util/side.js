var side={
	navList:null,
	container:null,
	list:null,
	touch:null,
	now:0,
	current:null,
	previous:null,
	next:null,
	direction:'',
	clientWidth:window.innerWidth,
	time:null,
	x:0,
	y:0,
	init:function(className,navContainer){
		var me=this;
		this.navList=document.querySelector('.'+navContainer).children;
		this.container=document.querySelector('.'+className);
		this.list=this.container.querySelectorAll('li');
		for (var i = this.list.length - 1; i >= 0; i--) {
			(function(i){
				me.list[i].addEventListener('transitionend',function(){
					this.completed=true;
					if(i==me.now){
						var now=me.now,
							len=me.list.length;
						me.current=me.list[now],
						me.next=now==(len-1)?me.list[0]:me.list[now+1];
						me.previous=now==0?me.list[len-1]:me.list[now-1];
						me.reset(me.next,me.previous);
					}
				})
			})(i);
		};
		this.container.addEventListener('touchstart',this,false);
		this.container.addEventListener('touchmove',this,false);
		this.container.addEventListener('touchend',this,false);
		this.autoPlay();
	},
	handleEvent:function(e){
		var type=event.type;
		switch(type){
			case 'touchstart':
			this.start(event);
			break;
			case 'touchend':
			this.end(event);
			break;
			case 'touchmove':
			this.move(event);
			break;
		}
	},
	autoPlay:function(){
		var me=this;
		this.time=setInterval(function(){
			me.play();
		},2000);
	},
	play:function(){
		var me=this,
			now=this.now,
			len=this.list.length;
		this.current=this.list[now],
		this.next=now==(len-1)?this.list[0]:this.list[now+1];
		this.previous=now==0?this.list[len-1]:this.list[now-1];
		this.reset(this.next,this.previous);
		this.swipeRight();
		this.changeNav();
	},
	changeNav:function(){
		var now=this.now,
			len=0,
			i=0;
		for(len=this.navList.length;i<len;i++){
			if(i==now){
				this.navList[i].classList.add('active');
			}else{
				this.navList[i].classList.remove('active');
			}
		}
	},
	swipeRight:function(){
		var me=this;
		var reg=/-?[0-9]+px/g;	
		setTimeout(function() {
			var m=me.current.style.webkitTransform.match(reg);
			var match=(m&&m[0].replace("px",""))||0;
			me.current.style.webkitTransform='translate3d('+((-me.clientWidth)+Number(match))+'px,0,0)'+"";
			me.current.completed=false;
		},0);
		 setTimeout(function() {
			var m=me.next.style.webkitTransform.match(reg);
			var match=(m&&m[0].replace("px",""))||0;
			me.next.style.webkitTransform='translate3d('+((-me.clientWidth)+Number(match))+'px,0,0)';
			me.next.completed=false;
		 },0);
		this.now=[].indexOf.call(this.list,this.next);
	},
	swipeLeft:function(){
		var me=this;
		var reg=/-?[0-9]+px/g;	
		setTimeout(function() {
			var m=me.current.style.webkitTransform.match(reg);
			var match=(m&&m[0].replace("px",""))||0;
			me.current.style.webkitTransform='translate3d('+((me.clientWidth)+Number(match))+'px,0,0)'+"";
			me.current.completed=false;
		},0);
		 setTimeout(function() {
			var m=me.previous.style.webkitTransform.match(reg);
			var match=(m&&m[0].replace("px",""))||0;
			me.previous.style.webkitTransform='translate3d('+((me.clientWidth)+Number(match))+'px,0,0)';
			me.previous.completed=false;
		 },0);
		this.now=[].indexOf.call(this.list,this.previous);
	},
	reset:function(next,previous){
		next.style.left=this.clientWidth+"px";
		previous.style.left=(-this.clientWidth)+"px";
		next.style.display='block';
		previous.style.display='block';
		next.style.webkitTransform='none';
		previous.style.webkitTransform='none';
	},
	start:function(event){
		var me=this;
		clearInterval(this.time);
		this.time=null;
		event.preventDefault();
		this.touch=event.touches[0];
		// var parent=this.touch.target.parentNode;
		// var len=this.list.length;
		// this.current=this.list[this.now];
		// this.next=this.now==(len-1)?this.list[0]:this.list[this.now+1];
		// this.previous=this.now==0?this.list[len-1]:this.list[this.now-1];
		// this.reset(this.next,this.previous);
		this.pageX=this.touch.pageX;
		this.pageY=this.touch.pageY;
	},
	move:function(event){
		event.preventDefault();
		var touch=event.touches[0];
		var pageX=touch.pageX;
		var pageY=touch.pageY;
		this.x=pageX-this.pageX;
		this.y=pageY-this.pageY;
		var direction=Math.abs(this.x)-Math.abs(this.y);
		if(direction>0&&this.x>0){
			this.direction='Left';
		}else if(direction>0&&this.x<0){
			this.direction='Right';
		}else if(direction<0&&this.y>0){
			this.direction='down';
		}else if(direction<0&&this.y<0){
			this.direction='up';
		}
	},
	end:function(event){
		var me=this;
		if(me&&(me.direction!=="")){
			setTimeout(function(){
				me['swipe'+me.direction]();
				me.changeNav();
			},100);
		}				
	}
}