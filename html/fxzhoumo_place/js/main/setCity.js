require.config({
	paths:{
		'We':'../util/We',
		'config':'../common/config',
		'FastClick':'../lib/fastclick',
		'observer':'../util/observer',
	}
})
require(['We','config','FastClick','observer'],function(We,config,FastClick,observer){
	var 
		longitude=We.cookie.get('longitude'),
		latitude=We.cookie.get('latitude'),
		backBtn=We.$('.u-back')[0],
		setCityURL=config.setCityURL,
		saveCityURL=config.saveCityURL,
		address=We.$('#address'),
		cityContainer=We.$('#cityContainer'),
		cityArr=["北京","上海"];
		cityPinYin=['beijing','shanghai'];


	var setZoom=function(){
		var width=window.innerWidth;
		var zoom=width/375;
		zoom=zoom>=2?1:zoom;
		document.body.style.zoom=zoom;
	}
	var page={

		init:function(){
		/*	var longitude=We.cookie.get('longitude'),
				latitude=We.cookie.get('latitude');*/
			this.getCity();				
		},
		getCity:function(longitude,latitude){
			/*var me=this;
			var map = new BMap.Map("allmap");
			var point = new BMap.Point(longitude,latitude);
			var gc = new BMap.Geocoder();   
			gc.getLocation(point, function(rs){
				var addComp = rs.addressComponents;
				me.setCity(addComp.province);    
			}); */
			We.ajaxRequest(setCityURL,{

				completeListener:function(){
					var data=JSON.parse(this.responseText);
					if(data.code==="success"){
						address.innerText=data.usercity;
					}
				}
			})
		
		},
		setCity:function(city){
			if(cityArr.indexOf(city)!=-1){
				address.innerText=city;
			}
		}

	}



	var selectCity={

		init:function(){
			var me=this;
			We.addEvent(cityContainer,"click",function(e){
				var target=e.target;
				if(!!target.getAttribute('cityid')){
					var cityId=target.getAttribute('cityid');
					var city=cityArr[cityId];
					var obj={};
					obj.type=3;
					obj.city=city;
					var str="servicestr="+JSON.stringify(obj);
					We.ajaxRequest(saveCityURL,{
						send:str,
						completeListener:function(){
							var data=JSON.parse(this.responseText);
							if(data.code==="success"){
								address.innerText=city;
							}
						}
					})
				}
			})
		}
	}

	selectCity.init();



	if(!latitude||!longitude){   //获取地理位置
		We.getLocation(); 
	}
	setZoom();
	We.addEvent(backBtn,"click",function(){
		window.history.go(-1);
	});
	window.We=We;
	window.config=config;
	page.init();
	

})