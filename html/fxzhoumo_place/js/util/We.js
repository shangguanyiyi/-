define(function(){
	function $(selector){
		if(selector.charAt(0)==='#')return document.querySelector(selector);
		return document.querySelectorAll(selector);
	}

	function extend(target,src){
		var elem ;
		for(elem in src){
			if(src.hasOwnProperty(elem)){
				target[elem]=src[elem];
			}
		}
		return target;
	}
	function addEvent(node,type,listener){
		if(node.addEventListener){
			node.addEventListener(type,listener,false);
			return true;
		}else if(node.attachEvent){
			node['e'+type+listener]=listener;
			node[type+listener]=function(){
				node['e'+type+listener](window.event);
			}
			node.attachEvent('on'+type,node[type+listener]);
			return true;
		}else{
			node['on'+type]=listener;
		}	
		return false;
	};
	function removeEvent(node,type,listener){
		if(node.addEventListener){
			node.removeEventListener(type,listener,false);
			return true;
		}else if(node.detachEvent){
			node.detachEvent('on'+type,node[type+listener]);
			node[type+listener]=null;
			return true;
		}else{
			node['on'+type]=null;
			return true;
		}
		return false;
	};

	function insertAfter(node,referenceNode){
		var parent=referenceNode.parentNode;
		if(!referenceNode.nextElementSibling){
			parent.appendChild(node);
		}else{
			parent.insertBefore(node,referenceNode.nextElementSibling);
		}
	};
	function removeChildren(parent){
		while(parent.firstChild){
			parent.firstChild.parentNode.removeChild(parent.firstChild);
		}
		return parent;
	};	
	function prependChild(parent,newChild){
		if(parent.firstChild){
			parent.insertBefore(newChild,parent.firstChild);
		}else{
			parent.appendChild(newChild);
		}
		return parent;
	};

	function camelize(s){
		return s.replace(/-(\w)/g,function(strMatch,p1){
			return p1.toUpperCase();
		})
	}

	function addLoadEvent(loadEvent,waitForImages){
		if(waitForImages){
			return addEvent(window,'load',loadEvent);
		}
		var init=function(){
			if(arguments.callee.done)return;
			arguments.callee.done=true;
			loadEvent.apply(document,arguments);
		}
		if(document.addEventListener){
			document.addEventListener('DOMContentLoaded',init,false);
		}
		if(/WebKit/i.test(navigator.userAgent)){
			var _timer=setInterval(function(){
				if(/loaded|complete/.test(document.readyState)){
					clearInterval(_timer);
					init();
				}
			},10)
		}
	}
	function getPointPositionInDocument(event){
		var event=event||window.event;
		var x=event.pageX||(event.clientX+(document.documentElement.scrollLeft||document.body.scrollLeft));
		var y=event.pageY||(event.clientY+(document.documentElement.scrollTop||document.body.scrollTop))
		return {x:x,y:y}
	}


	function setStyle(element,styles){
		if(element instanceof Element){
			set(element,styles);
		}else{
			for(var i=0;i<element.length;i++){
				set(element[i],styles);
			}
		}
		function set(element,styles){
			for(var  style in styles){
				if(styles.hasOwnProperty(style)){
					element.style[camelize(style)]=styles[style];
				}
			}
		}
	}
	function getStyle(element,property){
		var value=element.style[camelize(property)];
		if(!value){
			if(getComputedStyle){
				var css=getComputedStyle(element,null);
				value=css?css.getPropertyValue(property):null;
			}
		}
		return value=='auto'?'':value;
	}

	function hasClass(element,className){
		return element.classList.contains(className);
	}
	function addClass(element,className){
		return element.classList.add(className);
	}
	function removeClass(element,className){
		return element.classList.remove(className);
	}


	function getRequestObject(url,options){
		var req=false;
		req=new XMLHttpRequest();
		if(!req)return false;
		options=options||{};
		options.method=options.method||'POST';
		options.send=options.send||null;
		req.onreadystatechange=function(){
			switch(req.readyState){
				case 1:
				if(options.loadListener){
					options.loadListener.apply(req,arguments);
				}
				break;
				case 2:
				if(options.loadedListener){
					options.loadedListener.apply(req,arguments);
				}
				break;
				case 3:
				if(options.interactiveListener){
					options.interactiveListener.apply(req,arguments);
				}
				break;
				case 4:
				 try{
				 	if(req.status&&req.status==200){
				 		var contentType=req.getResponseHeader('Content-Type');
				 		var mimeType=contentType.match(/\s*([^;]+)\s*(;|$)/i)[1];
				 		switch(mimeType){
				 			case 'text/javascript':
				 			case 'application/javascript':
				 			if(options.jsResponseListener){
				 				options.jsResponseListener.call(req,req.responseText);
				 			}
				 			break;
				 			case 'application/json':
				 			if(options.jsonResponseListener){
				 				var json=JSON.parse(req.responseText);
				 				options.jsonResponseListener.call(req,json);
				 			}
				 			break;
				 			case 'text/xml':
				 			case 'application/xml':
				 			case 'text/xhtml':
				 			if(options.xmlResponseListener){
				 				options.xmlResponseListener.call(req,req.responseXML);
				 			}
				 			break;
				 			case 'text/html':
				 			if(options.htmlResponseListener){
				 				options.htmlResponseListener.call(req,req.responseText);
				 			}
				 		}
				 		if(options.completeListener){
				 			options.completeListener.apply(req,arguments);
				 		}

				 	}else{
				 		if(options.errorListener){
				 			options.errorListener.apply(req,arguments);
				 		}
				 	}
				 }catch(e){
				 	console.log(e);
				 }
				 break;
			}
		};
		req.open(options.method,url,true);
		if(options.method==="POST"&&!options.isFile){
			req.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		}
		return req;
	}
	function ajaxRequest(url,options){
		var req=getRequestObject(url,options);
		return req.send(options.send);
	}

	function template(str, data){
        var tmpl = 'var __p=[];' + 'with(obj||{}){__p.push(\'' +
                str.replace( /\\/g, '\\\\' )
                .replace( /'/g, '\\\'' )
                .replace( /<%=([\s\S]+?)%>/g, function( match, code ) {
                    return '\',' + code.replace( /\\'/, '\'' ) + ',\'';
                } )
                .replace( /<%([\s\S]+?)%>/g, function( match, code ) {
                    return '\');' + code.replace( /\\'/, '\'' )
                            .replace( /[\r\n\t]/g, ' ' ) + '__p.push(\'';
                } )
                .replace( /\r/g, '\\r' )
                .replace( /\n/g, '\\n' )
                .replace( /\t/g, '\\t' ) +
                '\');}return __p.join("");',

            /* jsbint evil:true */
            func = new Function( 'obj', tmpl );
        
        return data ? func( data ) : func;
	}

	 function getUrlParam(name){
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)
            return unescape(r[2]);
        return null;
    }

    var domainPrefix = window.location.hostname;
    var cookie = {
        set : function(name, value, domain, path, hour) {
            if (hour) {
                var today = new Date();
                var expire = new Date();
                expire.setTime(today.getTime() + 3600000 * hour);
            }
            window.document.cookie = name + "=" + value + "; " + (hour ? ("expires=" + expire.toGMTString() + "; ") : "") + (path ? ("path=" + path + "; ") : "path=/; ") + (domain ? ("domain=" + domain + ";") : ("domain=" + domainPrefix + ";"));
            return true;
        },
        get : function(name) {
            var r = new RegExp("(?:^|;+|\\s+)" + name + "=([^;]*)");
            var m = window.document.cookie.match(r);
            return (!m ? "" : m[1]);
        },
        remove : function(name, domain, path) {
            window.document.cookie = name + "=; expires=Mon, 26 Jul 1997 05:00:00 GMT; " + (path ? ("path=" + path + "; ") : "path=/; ") + (domain ? ("domain=" + domain + ";") : ("domain=" + domainPrefix + ";"));
        }
    }

	function getLocation(){ 
		navigator.geolocation.getCurrentPosition(showMap, handleError, {enableHighAccuracy:true, maximumAge:300000});
	}
	 
	function showMap(value){
		  var longitude = value.coords.longitude;
		  var latitude = value.coords.latitude;
		  cookie.set("longitude",longitude,null,null,0.3);
		  cookie.set("latitude",latitude,null,null,0.3);
	}

	function handleError(value){
	   cookie.set("longitude","");
	   cookie.set("latitude","");
		  switch(value.code){
		   case 1:
		    //alert("位置服务被拒绝");
		    break;
		   case 2:
		    //alert("暂时获取不到位置信息");
		    break;
		   case 3:
		    //alert("获取信息超时");
		    break;
		   case 4:
		   // alert("未知错误");
		    break;
		}
	}
	function parseHTML(str) {
		  var tmp = document.implementation.createHTMLDocument();
		  tmp.body.innerHTML = str;
		  return tmp.body.children;
	}

	function date(date, formatString){
        /*
         * eg:formatString="YYYY-MM-DD hh:mm:ss";
         */
        var o = {
            "M+" : date.getMonth()+1,    //month
            "D+" : date.getDate(),    //day
            "h+" : date.getHours(),    //hour
            "m+" : date.getMinutes(),    //minute
            "s+" : date.getSeconds(),    //second
            "q+" : Math.floor((date.getMonth()+3)/3),    //quarter
            "S" : date.getMilliseconds()    //millisecond
        }
    
        if(/(Y+)/.test(formatString)){
            formatString = formatString.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
        }
    
        for(var k in o){
            if(new RegExp("("+ k +")").test(formatString)){
                formatString = formatString.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
            }
        }
        return formatString;
    }

    function getSingle(fn){
    	var result;
    	return function(){
    		return result||(result=fn.apply(this,arguments));
    	}
    }

	return {
		$:$,
		camelize:camelize,
		addLoadEvent:addLoadEvent,
		addEvent:addEvent,
		removeEvent:removeEvent,
		insertAfter:insertAfter,
		removeChildren:removeChildren,
		prependChild:prependChild,
		getPointPositionInDocument:getPointPositionInDocument,
		setStyle:setStyle,
		getStyle:getStyle,
		getRequestObject:getRequestObject,
		ajaxRequest:ajaxRequest,
		hasClass:hasClass,
		addClass:addClass,
		removeClass:removeClass,
		template:template,
		getUrlParam:getUrlParam,
		cookie:cookie,
		getLocation:getLocation,
		parseHTML:parseHTML,
		date:date,
		extend:extend,
		getSingle:getSingle
	}
})
