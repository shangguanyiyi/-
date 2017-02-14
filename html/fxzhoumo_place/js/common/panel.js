define(['We','getPrefix','config'],function(We,getPrefix,config){

	var transform=getPrefix.transform,
		transitionDuration=getPrefix.transitionDuration;
	function Panel(opts){
		this.speed=opts.speed||300;
		this.toggleBtn=opts.btn;  //点击按钮
		this.panel=opts.panel;//面板
		this.needMove=opts.needMove;//点击按钮后需要移动的元素
		this.url=opts.url;//获取用户信息的url
		this.userImage=opts.userImage;//用户头像
		this.userInfo=opts.userInfo;//用户昵称
		this.userMsgNumElem=opts.userMsgNum;
		this.userDesc=opts.userDesc;
		this.init();
	}

	Panel.prototype={
		constructor:Panel,
		init:function(){
			this._bindEvents();
		},
		_bindEvents:function(){
			var me=this;
			We.addEvent(this.toggleBtn,'click',function(){
				// var cssText="transition:all 300ms;-webkit-transition:all 300ms;"+transitionDuration+":"+me.speed+"ms;"+transform+":translate3d("+me.panel.offsetWidth+"px,0,0)";
				me.needMove[0].style[transitionDuration]=me.speed+"ms";
				me.needMove[0].style[transform]='translate3d('+(me.panel.offsetWidth)+'px,0,0)';
				me.needMove[1].style[transitionDuration]=me.speed+"ms";
				me.needMove[1].style[transform]='translate3d('+(me.panel.offsetWidth)+'px,0,0)';
				me.panel.style[transitionDuration]=me.speed+"ms";
				me.panel.style[transform]='translate3d('+(me.panel.offsetWidth)+'px,0,0)';
	/*			me.needMove[0].style.cssText=cssText;
				me.needMove[1].style.cssText=cssText;
				me.panel.style.cssText=cssText;*/
				me._createClose();
				if(this.getAttribute('isGet')!==1){
					me._getUserInfo();
				}
			})
		},
		_createClose:function(){
			var me=this;
			var width=window.innerWidth;
			var height=document.documentElement.scrollHeight;
			var div=document.createElement('div');
			We.setStyle(div,{
				'position':'fixed',
				'opacity':0,
				'top':0,
				'left':me.panel.offsetWidth+"px",
				'width':width+"px",
				'z-index':100000,
				'height':'100%'
			});
			document.body.appendChild(div);
			We.addEvent(div,'click',function(){
				me._recover();
				this.parentNode.removeChild(this);
			})
		},
		_getUserInfo:function(){
			var me=this;
			We.ajaxRequest(me.url,{
				completeListener:function(){
					var obj=JSON.parse(this.responseText);
					if(obj.code=='success'){
						me.toggleBtn.setAttribute('isGet',1);
						me.userImage.src=config.imgBaseURL+obj.user_photo;
						me.userInfo.innerHTML=obj.user_nickname;
						obj.user_oneabstract&&(me.userDesc.innerHTML=obj.user_oneabstract);
						if(obj.user_notlookinfo_count>0){
							me.userMsgNumElem.innerText=obj.user_notlookinfo_count;
							me.userMsgNumElem.classList.remove('dn');

						}else{
							me.userMsgNumElem.classList.add('dn');
						}
					}
				}
			})
		},
		_recover:function(){
			var me=this;
	/*		var cssText="transition:all 300ms;-webkit-transition:all 300ms;"+transitionDuration+":"+me.speed+"ms;"+transform+":translate3d(0,0,0)";
			me.panel.style.cssText=cssText;
			me.needMove[0].style.cssText=cssText;
			me.needMove[1].style.cssText=cssText;*/
		
			me.panel.style[transitionDuration]=me.speed+"ms";
			me.panel.style[transform]='translate3d(0,0,0)';
			me.needMove[0].style[transitionDuration]=me.speed+"ms";
			me.needMove[0].style[transform]='translate3d(0,0,0)';
			me.needMove[1].style[transitionDuration]=me.speed+"ms";
			me.needMove[1].style[transform]='translate3d(0,0,0)';
		}


	}

	return Panel;

})