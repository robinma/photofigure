/**
 *
 */

(function(root, $, factory) {
	//set up videoplayer appropriately for the enviroment.
	if (typeof define === 'function' && (define.cmd || define.amd)) {
		define(function() {
			return factory(root, $);
		});
	} else {
		//as a browser global
		root.photofigure = factory(root, $);
	}
})(window, $, function(root, $) {
	var $win = $(window),$html = $('html'),$body=$('body');	
	//pubsub events
	var pubsub = {
		_handlers: '',
		on: function(etype, handler) {
			if (typeof this._handlers !== 'object') {
				this._handlers = [];
			}
			if (!this._handlers[etype]) {
				this._handlers[etype] = []
			}
			if (typeof handler === 'function') {
				this._handlers[etype].push(handler)
			}
			return this;
		},
		emit: function(etype) {
			var args = Array.prototype.slice.call(arguments, 1)
			var handlers = this._handlers[etype] || [];
			for (var i = 0, l = handlers.length; i < l; i++) {
				handlers[i].apply(null, args)
			}
			return this;
		}
	}
	//figure class
	var Figure = function(imgdata) {
		var imgData = [];
		if ($.isArray(imgdata)) {
			imgData = imgData.concat(imgdata);
		} else if (typeof imgdata === 'object') {
			imgData.push(imgdata);
		}
		this.imgData = imgData;

		this.init();
	};

	$.extend(Figure.prototype, pubsub, {
		init: function() {
			this._renderWarp()
		}

	});
	//render photo figure warp
	$.extend(Figure.prototype, {
		$_warp: '',
		$_figbox: '',
		_renderWarp: function() {
			var html = '<div class="photo_figure_layer">\
						<div class="photo_bg_layer"></div>\
							<div class="photo_figure_main">\
								<a href="javascript:;" class="closebtn"><em class="pficon"></em></a>\
								<div class="photo_figure_box"></div>\
							</div>\
					</div>';
			this._setHidden();
			var $warp = $(html);
			$html.append($warp);
			this.$_warp = $warp;
			this.$_figbox = $warp.find('.photo_figure_box')
			this._warpControl();
			//show photo main warp
			this._renderPhotoShow();
			this._renderGallary();
		},
		_setHidden:function(){
			$body.css({'overflow':'hidden'});
		},
		_setVisible:function(){
			$body.css({'overflow':'visible'});
		},
		_warpControl: function() {
			var __ = this;
			this.$_warp.on('click', 'a.closebtn', function() {
				__._setVisible();
				__.$_warp.hide();
			});
		}
	});
	//photoshow
	$.extend(Figure.prototype, {
		$_photoshow: '',
		_mainImg:'',
		_renderPhotoShow: function() {
			var html = '<div class="photo_figure_showwarp">\
						<div class="photo_figure_iwarp" node-type="img-home"></div>\
						<a href="javascript:;" class="btn btn_left">\
							<em class="pficon arr_l"></em>\
						</a>\
						<a href="javascript:;" class="btn btn_right"><em class="pficon arr_r"></em></a>\
						<div class="photo_figure_zr">\
							<a href="javascript:;" class="photo_opbtn" node-type="rotate"><em class="pficon rotate"></em></a>\
							<a href="javascript:;" class="photo_opbtn" node-type="zoom">\
								<em class="pficon zoom"></em>\
							</a>\
						</div>\
					</div>';
			this._setHidden()
			var photoshow = $(html);
			this.$_photoshow = photoshow;
			this.$_figbox.append(photoshow);
			this._showControl();
		},
		_showControl: function() {
			var __ = this;
			this.$_photoshow.on('click', 'a.btn_left', function() {
				__.imgListObj.pre();
			}).on('click', 'a.btn_right', function() {
				__.imgListObj.next();
			}).on('click','a[node-type="rotate"]',function(){
				__._mainImg && __._mainImg.rotate.clockwise();
			});
		},
		_showMainImage: function(data) {
			this._mainImg = new mainImages(data, this);
		}
	});
	//image list bow
	$.extend(Figure.prototype, {
		$_gallary: '',
		$_viewwarp:'',
		$ul:'',
		imgListObj: '',
		_imglist: [],
		_renderGallary: function() {
			var html = '<div class="photo_gallary">\
						<div class="pf_iw" node-type="imgview_warp">\
							<ul class="galllist clearfix"></ul>\
						</div>\
						<div class="gall_btn gall_btn_l">\
							<a href="javascript:;" class="btn" node-type="btn-l"><em class="pficon l"></em></a>\
						</div>\
						<div class="gall_btn gall_btn_r">\
							<a href="javascript:;" class="btn" node-type="btn-r"><em class="pficon r"></em></a>\
						</div>\
					</div>';
			var gallary = $(html);
			this.$_gallary = gallary;
			this.$_viewwarp = gallary.find('div[node-type="imgview_warp"]');
			this.$ul = gallary.find('ul');
			this.$_figbox.append(gallary);
			this._gallaryControl()
		},
		_gallaryControl: function() {
			this._gallary_showimg();
		},
		_gallary_showimg: function() {
			var __ = this;
			this.imgListObj = new imgList();

			this.imgListObj.on('add', function(param) {
				var minimg = new minImg(param);
				var el = minimg.render();
				__.$_gallary.find('ul.galllist').append(el);

				__._imglist.push(minimg);
				minimg.on('click', function(minimg) {
					__.imgListObj.setCurrent(minimg.data.cindex)
				
				});

			}).on('pre', function(index) {
				__._gallary_setFocus(index)
			}).on('next', function(index) {
				__._gallary_setFocus(index)
			}).on('current',function(index){
				__._gallary_setFocus(index)
			});

			this.$_gallary.on('click','a[node-type="btn-l"]',function(){
				__.imgListObj.pre();
			}).on('click','a[node-type="btn-r"]',function(){
				__.imgListObj.next()
			})
			this.imgListObj.add(this.imgData);
			this._gallary_setFocus(this.imgListObj.currIndex)
		},
		_gallary_emititem: function(ming) {
			this._gallary_setFocus(ming.data.cindex);
		},
		_gallary_setFocus: function(index) {
			var imgobjs = this._imglist;
			for (var i = 0, l = imgobjs.length; i < l; i++) {
				imgobjs[i].cancelCurrent();
			}
			imgobjs[index].setCurrent();
			//show images
			this._showMainImage(imgobjs[index].data);
			this._slideImgView(index)
		},
		_slideImgView:function(inx){
			var viewWid = 131;
			var pagesize=Math.floor(this.$_viewwarp.width()/viewWid);
			var len = this._imglist.length;
			if(len<pagesize) return;
			var page = Math.floor(inx/pagesize);
			var s= page*pagesize,e=(page+1)*pagesize;
			if(e>len){
				e=len;
				s=s-e+len;
			}
			this.$ul.animate({'margin-left':-(s*(viewWid+10))},200);

		}


	});
	//data list
	var imgList = function(imglist) {
		this.dataList = [];
		this.currIndex = 0;
		this.cindex = 0;
		var __ = this;
		__.add(imglist);
	};
	$.extend(imgList.prototype, pubsub, {
		add: function(imgdata) {
			var __ = this;
			var imgarr = [];
			if ($.isArray(imgdata)) {
				imgarr = imgarr.concat(imgdata);
			} else if (typeof imgdata === 'object') {
				imgarr.push(imgdata);
			}
			for (var i = 0; i < imgarr.length; i++) {
				var item = imgarr[i];
				item.cindex = this.cindex;
				__.emit('add', item)
				__.dataList.push(item);
				this.cindex++;
			};

		},
		traverse: function(fn) {
			var imgdata;
			for (var i = 0, l = this.dataList.length; i < l; i++) {
				imgdata = this.dataList[i];
				typeof fn === 'function' ? fn(imgdata) : '';
			}
		},
		pre: function() {
			var imglength = this.dataList.length;
			if (this.currIndex == 0) {
				this.currIndex = imglength - 1;
			} else {
				this.currIndex -= 1;
			}

			this.emit('pre', this.currIndex);
		},
		next: function() {
			var imglength = this.dataList.length;
			if (this.currIndex == imglength - 1) {
				this.currIndex = 0;
			} else {
				this.currIndex += 1;
			}
			this.emit('next', this.currIndex);

		},
		setCurrent:function(index){
			this.currIndex = index;
			this.emit('current',this.currIndex)
		}
	});


	//small images Class
	var minImg = function(data) {
		this.data = data;
		this.$el = '';
	};
	$.extend(minImg.prototype, pubsub, {
		render: function() {
			var __ = this;
			var html = '<li class="item">\
						<a href="javascript:;" class="imgb">\
							<div class="img_warp"><span class="load"></span></div>\
							<div class="imgchose">\
								<em class="arrow"></em>\
							</div>\
						</a>\
					</li>';
			html = html.replace(/\$\{(.+)\}/i, function(a, b) {
				return __.data[b];
			})
			this.$el = $(html);
			__.events();
			return this.$el;
		},
		events: function() {
			var __ = this;
			this.$el.on('click', function() {
				__.emit('click', __);
			})
			this.renderImg()
		},
		setCurrent: function() {
			this.$el.addClass('item_hover');
		},
		cancelCurrent: function() {
			this.$el.removeClass('item_hover');
		},
		renderImg: function() {
			var __ = this;
			var imgUrl = this.data['smallImg'];
			getJs('../src/js/resetImgSize.js', 'resetImgSize', function(resize) {
				resize({
					imageUrl: imgUrl,
					style: 'min',
					width: 131,
					height: 105
				}, function(wh, url) {
					__.setImgAttr(wh, url);
				});
			})
		},
		setImgAttr: function(wh, url) {
			var img = $('<img src="' + url + '"  width="' + wh[0] + '" height="' + wh[1] + '" class="bigPhotoImg" />');

			if(wh[0]>wh[1]){
				img.css('margin-left',-(wh[0]-130)/2);
			}else{
				img.css('margin-top',-(wh[1]-130)/2);
			}
			img.css('opacity',0).animate({'opacity':1},200);
			this.$el.find('.img_warp').html(img);
		}
	});

	//main images
	var mainImages = function(imgdata, Figure) {
		this.imgdata = imgdata;
		this.figure = Figure;
		this.boxwh = {};
		this.imghome = this.figure.$_photoshow.find('div[node-type="img-home"]');
		this.init();
	};

	$.extend(mainImages.prototype, pubsub, {
		init: function() {
			this.events();
			this.renderImg()
		},
		events: function() {
			var __ = this;
			$win.on('resize', function() {
				__._getWH();
			});
			__._getWH();
		},
		_getWH: function() {
			console.log(this.imghome)
			this.boxwh.width = this.imghome.width();
			this.boxwh.height = this.imghome.height();
		},
		renderImg: function() {
			var __ = this;
			var imgUrl = this.imgdata['bigImg'];
			getJs('../src/js/resetImgSize.js', 'resetImgSize', function(resize) {
				console.log(__.boxwh)
				resize({
					imageUrl: imgUrl,
					style: 'max',
					width: __.boxwh.width,
					height: __.boxwh.height
				}, function(wh, url) {
					__.setImgAttr(wh, url);
				});
			})
		},
		setImgAttr: function(wh, url) {
			var img = $('<img src="' + url + '"  width="' + wh[0] + '" height="' + wh[1] + '" class="bigPhotoImg" />');
			this.imghome.html(img);
			this.setImgPos(wh, img);
		},
		setImgPos: function(wh, img) {
			var __ = this;
			if (wh[1] < __.boxwh.height) {
				img.css('margin-top', (__.boxwh.height - wh[1]) / 2);
			}
			getJs('../src/js/rotate.js', 'rotate', function(Rotate) {
				setTimeout(function() {
					__.rotate = Rotate({
						imgObj: img,
						width: wh[0],
						height: wh[1],
						imgwarp: __.imghome,
						wwid: __.boxwh.width,
						whei: __.boxwh.height
					});
				}, 300)

			});

		},
		zoomIn:function(){

		},
		zoomOut:function(){

		}
	})

	//get javasdript files
	var getJs = function(url, method, fn) {
		if (root[method]) {
			fn && fn(root[method]);
		} else {
			$.getScript(url, function() {
				fn && fn(root[method]);
			});
		}
	}

	return function(imgDataList) {
		return new Figure(imgDataList);
	}

});