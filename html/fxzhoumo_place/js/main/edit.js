require.config({
	paths:{
		'We':'../util/We',
		'config':'../common/config',
		'FastClick':'../lib/fastclick'
	}
})
require(['We','config','FastClick'],function(We,config,FastClick){

	var opts={
				selectURL:config.toUserRemarkURL,
				saveURL:config.setUserRemarkURL,
				uploadPhotoURL:config.uploadPhotoURL,
				tpl:document.querySelector('#tpl'),
				container:document.querySelector("#info")
			};
	var setZoom=function(){
			var width=window.innerWidth;
			var zoom=width/375;
			zoom=zoom>=2?1:zoom;
			document.body.style.zoom=zoom;
	}

	function send(obj,url){
		var formData=new FormData();
		formData.append('fileName',obj.files[0]);
		We.ajaxRequest(url,{
			send:formData,
			isFile:true,
			completeListener:function(){
				console.log(this.responseText);
			}
		})
	}

	function bindEvent(){
		var form=document.querySelector('form');
		var input=document.querySelector("#in");
		document.querySelector('.u-back').addEventListener('click',function(){
			window.history.go(-1);
		})

		We.addEvent(input,"change",function(e){

			var reader=new FileReader();
			reader.onload=function(event){
				var src=event.target.result;
				var headImg=We.$('#headImg');
				headImg.src=src;
			}
			reader.readAsDataURL(e.target.files[0]);
			var servicestr={};
			servicestr.imgType="head";
			send(this,opts.uploadPhotoURL+"&servicestr="+JSON.stringify(servicestr));
		})

		We.addEvent(form,'submit',function(e){
				e.preventDefault();
				var nickName=We.$('#nickName').value;
				var sign=We.$('#sign').value;
				if(nickName=="")return;
				var param={};
				param.user_nickname=nickName;
				param.user_oneabstract=sign;
				var str="servicestr="+JSON.stringify(param);
				We.ajaxRequest(opts.saveURL,{
					send:str,
					completeListener:function(){
						var data=JSON.parse(this.responseText);
						if(data.code==='success'){
							alert("保存成功");
						}else{
							alert(data.description);
						}
					},
					errorListener:function(){
						alert("请不要输入特殊字符!");
					}
				})
			})
	}



	setZoom();
	We.ajaxRequest(opts.selectURL,{
		completeListener:function(){
			var data=JSON.parse(this.responseText);
			if(data.code=="success"){
				var html=We.template(opts.tpl.innerHTML,data);
				opts.container.innerHTML=html;
				bindEvent();
			}else{
				alert(data.description);
			}
		}
	})


	window.We=We;
	window.config=config;

})