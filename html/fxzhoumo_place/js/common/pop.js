define(['We','observer'],function(We,observer){


	var Pop=function(opts){
		this.tpl=opts.tpl;  //弹窗模板
		this.data=opts.data; //模板可能会绑定的数据,也许没有
		this.el=null; //生成的弹窗的dom元素
		this.hasShadow=opts.hasShadow;//是否有背景
		this.shadow=null; //背景
		this.closeBtn=null;//透明的关闭背景
		this.init();
	}

	Pop.prototype={
		constructor:Pop,
		init:function(){
			We.extend(this,observer);
			var html=We.template(this.tpl.innerHTML,this.data||{});
			this.el=We.parseHTML(html)[0];
			// this.el.classList.add('show');
			// this.el.classList.add('hide');
			document.body.appendChild(this.el);
			var height=this.el.offsetHeight;
			//var scroll=window.pageYOffset;
			this.el.style.marginTop=(-height/2)+"px";
			if(this.hasShadow){
				this.createShadow();
			}
			this.createClose();
			return this;
		},
		createShadow:function(){
			this.shadow=document.createElement('div');
			this.shadow.classList.add('pop-shadow');
			// this.shadow.classList.add('show');
			// this.shadow.classList.add('hide');
			document.body.appendChild(this.shadow);

		},
		createClose:function(){
			var me=this;
			this.closeBtn=document.createElement('div');
			this.closeBtn.classList.add('pop-close');
			this.closeBtn.style.display="block";
			document.body.appendChild(this.closeBtn);
			We.addEvent(this.closeBtn,"click",function(){
				me.close();
			})
		},
		show:function(){
			// this.el.classList.remove('hide');
			// this.shadow.classList.remove('hide');
			// this.closeBtn.classList.remove('hide');
			this.closeBtn.style.display="block";
			this.el.style.display="block";
			this.shadow&&(this.shadow.style.display="block");
		},
		close:function(){
			// this.el.classList.add('hide');
			// this.shadow.classList.add('hide');
			this.closeBtn.style.display="none";
			this.el.style.display="none";
			this.shadow&&(this.shadow.style.display="none");
		}

	}


	return Pop;

})