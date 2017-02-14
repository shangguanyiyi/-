require.config({
	paths:{
		'We':'../util/We',
		'config':'../common/config',
		'FastClick':'../lib/fastclick',
		'Tip':'../util/tip',
		'util':'../util/util',
		'observer':'../util/observer'

	}
})
require(['We','config','FastClick','Tip','util','observer'],function(We,config,FastClick,Tip,_,observer){

	var orderid=We.getUrlParam('orderid'),
		mobile=We.getUrlParam('mobile'),
		form=We.$("#ff");
	var nowOrderId=null;
	var loader=We.$("#loader");
	var progress=We.$("#progress");

	if(orderid){
		nowOrderId=orderid;
	}else{
		nowOrderId=We.$("#nowOrderId").value;
	}
	
	
	var sureOrderStatus=function(orderid){
			var time=null;
			var num=20;
			var obj={};
			obj.orderid=parseInt(nowOrderId);
			var str="servicestr="+JSON.stringify(obj);
			var func=function(){
				num--;
				progress.innerText=num;
				if(num<=0){
					time=null;
					We.$('#payFail').classList.remove('dn');
					return;
				}
				We.ajaxRequest(config.getOrderStatusURL,{
					send:str,
					completeListener:function(){
						var data=JSON.parse(this.responseText);
						if(data.code==="success"){
							clearInterval(time);
							time=null;
							We.$('#vCount').innerText=data.voucher_money;
							We.$('#paySuccess').classList.remove('dn');
							loader.classList.add('dn');
							if(data.issetpw===1){
								
								$("#setPwdPop").classList.remove('dn');
							}
						}
					}
				})
			}
			return function(){
				time=setInterval(func,2000);
			}
		}

		We.$("#i-account").innerText=mobile;
		sureOrderStatus(orderid)();

		We.addEvent(form,'submit',function(e){

			e.defaultPrvent();

			var pwd=$("#setPwd").value;
			var surePwd=$("#surePwd").value;
			if(pwd!=surePwd){
				Tip({
					elem:We.$("#u-submitBtn"),
					msg:"两次密码不一致"
				})
				return;
			}

			We.ajaxRequest(config.setPwURL,{

				completeListener:function(){
					$("#setPwdPop").classList.add('dn');
				}
			})
		})

		var close=We.$("#i-closePwd");

		We.addEvent(close,"click",function(){
			We.$("#setPwdPop").classList.add('dn');
		})

})
