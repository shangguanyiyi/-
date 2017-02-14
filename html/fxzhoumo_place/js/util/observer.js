(function(){
    var slice=[].slice;
    var observer={
        on:function(ev,fn){
            var _callbacks=this._callbacks||(this._callbacks={});
            var fns=this._callbacks[ev]||(this._callbacks[ev]=[]);
           fns.push(fn);
        },
        trigger:function(ev){
            var args=slice.call(arguments,1);
            var fns=this._callbacks[ev];
            if(!fns)return false;
            if(fns.length<1)return false;
            for(var i=0;i<fns.length;i++){
              fns[i].apply(this,args);
            }
        },
        off:function(ev,fn){
            var fns=this._callbacks[ev];
            if(fns.length<1)return false;
            if(!fn){
                fns.length=0;
            }else{
                for(var i=fns.length;i>0;i--){
                    if(fns[i]===fn){
                        fns.splice(fns[i],1);
                    }
                }
            }
        }
    }
if(define!==undefined){
    define(function(){
        return observer;
    })
}else{
    window.observer=observer;
}

})()