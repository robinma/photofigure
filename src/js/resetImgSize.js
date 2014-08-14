/**
 * @author jerry
 */
(function(win,$){
	/**
	 * param {object} require and todo param
	 * param.imageUrl {string} images
	 * param.width {NUmber} image width
	 * param.style {string} image height value:max | min
	 * param.height {Number} image height
	 * param.zoom {bool} if images size than param.width latter,is or not reset size
	 */
	var init=function(param,fn){
		var defalts={};
		$.extend(defalts,{
			zoom:true
		},param)
		todo(defalts,fn);
	};
	var todo=function(p,cb){
		getJs('../src/js/preOnloadImgSize.js','preOnloadImgSize',function(loadimg){
			loadimg(p.imageUrl,function(){
				var newWH;
				if(p.style=='max'){
					newWH=setWH(p,this);
				}else if(p.style=='min'){
					newWH=setMinWH(p,this);
				}
				cb&&cb(newWH,p.imageUrl);
			});
		})
	},
	getJs=function(url,method,fn){
		if(win[method]){
			fn&&fn(win[method]);
		}else{
			$.getScript(url,function(){
				fn&&fn(win[method]);
			});
		}
	},
	setWH=function(p,img){
		var iw=img.width,ih=img.height;
		var nw,nh;
		if(iw<=p.width && ih <= p.height){
			return [iw,ih];	
		}
		var ratio=iw/ih;
		if(iw>=ih){
			if(iw>=p.width){
				nw=p.width;
				nh=nw/ratio;
			}else if(ih>=p.height){
				nh=p.height;
				nw=ratio*nh;
			}
		}else{
			if(ih>=p.height){
				nh=p.height;
				nw=ratio*nh;
			}else if(iw>=p.width){
				nw=p.width;
				nh=nw/ratio
			}
		}
		return [nw,nh];
	},
	setMinWH=function(p,img){
		var iw=img.width,ih=img.height;
		var nw,nh;
		var ratio=p.width/p.height;
		var lratio=iw/ih;

		if(!p.zoom){
			if(iw<=p.width && ih <= p.height){
				return [iw,ih];	
			}
		}
		if(ratio>lratio){
			nw=p.width;
			nh=nw/lratio;
		}else{
			nh=p.height;
			nw=lratio*nh
		}
		return [nw,nh];
	};
	
	win.resetImgSize = init;
}(window,$));