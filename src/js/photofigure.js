/**
 * author robin ma
 * photo show figure
 * email:ahmzj@163.com
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
	var isIe6 = (!!window.ActiveXObject && !window.XMLHttpRequest);
	var $win = $(window),
		$html = $('html'),
		$body = $('body'),
		winAttr = {};
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
	var Figure = function(imgdata, currIndex, params) {
		this.imgData = [];
		this.currIndex = currIndex | 0;
		this.init(imgdata);
	};

	$.extend(Figure.prototype, pubsub, {
		init: function(imgdata) {
			var data = this.filterData(imgdata);
			this.imgData = this.imgData.concat(data);
			this.getWinWH();
			this._renderWarp();
		},
		filterData: function(imgdata) {
			var imgData = [];
			if ($.isArray(imgdata)) {
				imgData = imgData.concat(imgdata);
			} else if (typeof imgdata === 'object') {
				imgData.push(imgdata);
			}

			return imgData;
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
			this.$_warp = $warp;
			this._setPosition()
			$html.append($warp);
			this.$_figbox = $warp.find('.photo_figure_box')
			this._warpControl();
			//show photo main warp
			this._renderPhotoShow();
			this._setBoxSize();

			this._renderGallary();
		},
		_setHidden: function() {
			$html.css({
				'overflow': 'hidden'
			});
		},
		_setVisible: function() {
			$html.css({
				'overflow': 'visible'
			});
		},
		_warpControl: function() {
			var __ = this;
			this.$_warp.on('click', 'a.closebtn', function() {
				__._setVisible();
				__.$_warp.remove();
			});
		},
		_setPosition: function() {
			if (isIe6) {
				var st = $win.scrollTop();
				this.$_warp.css({
					'position': 'absolute',
					top: st,
					left: 0
				})
			} else {
				this.$_warp.css({
					'position': 'fixed',
					'top': 0,
					'left': 0
				});
			}
		},
		getWinWH: function() {
			winAttr['winWidth'] = $win.width();
			winAttr['winHeight'] = $win.height();
		}
	});
	//photoshow
	$.extend(Figure.prototype, {
		$_photoshow: '',
		_mainImg: '',
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
								<em class="pficon zoomin"></em>\
							</a>\
						</div>\
						<div class="pfmap" node-type="pf-map"></div>\
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
			}).on('click', 'a[node-type="rotate"]', function() {
				if (!__._mainImg) return;
				if (__._mainImg.zoom) {
					__._mainImg.zoomOut();
					__._setzoomstatus()
				}
				__._mainImg.rotate.clockwise();
			}).on('click', 'a[node-type="zoom"]', function() {
				if (!__._mainImg) return;
				var _this = $(this);
				if (__._mainImg.zoom) {
					__._mainImg.zoomOut();
				} else {
					__._mainImg.zoomIn();
				}
				__._setzoomstatus()

			});

			this.$_photoshow.on('mouseover click', function() {
				if (__._imglist.length < 2) return;
				__.$_photoshow.find('a.btn').show();
			}).on('mouseout', function() {
				if (__._imglist.length < 2) return;
				__.$_photoshow.find('a.btn').hide();
			})
		},
		_showMainImage: function(data) {
			this._mainImg = new mainImages(data, this);
			this._setzoomstatus();
		},
		_setzoomstatus: function() {
			var zoombtn = this.$_photoshow.find('a[node-type="zoom"]');
			if (this._mainImg.zoom) {
				zoombtn.html('<em class="pficon zoomout"></em>');
			} else {
				zoombtn.html('<em class="pficon zoomin"></em>');
			}
		},
		_setBoxSize: function() {
			var dw = 920,
				dh = 835,
				minWid = 460,
				minHei = 420;
			var rotate = dw / dh;
			var newWid = winAttr['winHeight'] * rotate - 36;
			var newHei = winAttr['winHeight'] - 20;
			if (newWid < minWid) newWid = minWid - 36;
			if (newHei < minHei) newHei = minHeix;

			var mainwarp = this.$_warp.find('.photo_figure_main');
			mainwarp.width(newWid);
			this.$_photoshow.height(newHei - 155);
		}
	});
	//image list bow
	$.extend(Figure.prototype, {
		$_gallary: '',
		$_viewwarp: '',
		$ul: '',
		imgListObj: '',
		_imglist: '',
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
		add: function(imgdata) {
			if (this.imgListObj) {
				var data = this.filterData(imgdata);
				this.imgListObj.add(data);
			}
		},
		_gallaryControl: function() {
			this._gallary_showimg();
		},
		_gallary_showimg: function() {
			var __ = this;
			this._imglist = [];
			this.imgListObj = new imgList();

			this.imgListObj.on('add', function(param) {
				var minimg = new minImg(param);
				var el = minimg.render();
				__.$_gallary.find('ul.galllist').append(el);

				__._imglist.push(minimg);
				minimg.on('click', function(minimg) {
					__.imgListObj.setCurrent(minimg.data.cindex)
				});
				//show gallary bar
				if (__._imglist.length > 1) {
					__.$_gallary.show();
				}
				//set gallary bar witdh and set center
				__._setGallaryWidth();
				//set gallary arrow is show or hide
				__._setGallaryArrow()

			}).on('pre', function(index) {
				__._gallary_setFocus(index)
			}).on('next', function(index) {
				__._gallary_setFocus(index)
			}).on('current', function(index) {
				__._gallary_setFocus(index)
			});

			this.$_gallary.on('click', 'a[node-type="btn-l"]', function() {
				__.imgListObj.pre();
			}).on('click', 'a[node-type="btn-r"]', function() {
				__.imgListObj.next()
			});
			this.imgListObj.add(this.imgData);
			__.imgListObj.setCurrent(__.currIndex || 0)
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
			this.emit('switch', index, imgobjs, this);
		},
		_slideImgView: function(inx) {
			var viewWid = 141;
			var pagesize = Math.floor(this.$_viewwarp.width() / viewWid);
			var len = this._imglist.length;
			if (len < pagesize) return;
			var page = Math.floor(inx / pagesize);
			var s = page * pagesize,
				e = (page + 1) * pagesize;
			if (e > len) {
				e = len;
				s = s - e + len;
			}
			this.$ul.animate({
				'margin-left': -(s * viewWid)
			}, 200);

		},
		_setGallaryWidth: function() {
			//$_viewwarp
			var viewWid = 141;
			var twidth = this.$_photoshow.width();
			var showsize = Math.floor(twidth / viewWid);
			var showWid = showsize * viewWid;
			var marginLR = (twidth - showWid) / 2;
			this.$_gallary.width(showWid);
			this.$_gallary.css({
				'margin-left': marginLR,
				'margin-right': marginLR
			})
		},
		_setGallaryArrow:function(){
			var imgtotal = this._imglist;
			if(imgtotal.length<2){
				this.$_gallary.find('a.btn').hide();
			}else{
				this.$_gallary.find('a.btn').show();
			}
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
		setCurrent: function(index) {
			if (index < 0) index = 0;
			if (index > this.dataList.length - 1) index = this.dataList.length - 1;
			this.currIndex = index;
			this.emit('current', this.currIndex)
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
								<em class="pf_arrow"></em>\
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

			if (wh[0] > wh[1]) {
				img.css('margin-left', -(wh[0] - 130) / 2);
			} else {
				img.css('margin-top', -(wh[1] - 130) / 2);
			}
			img.css('opacity', 0).animate({
				'opacity': 1
			}, 200);
			this.$el.find('.img_warp').html(img);
		}
	});

	//main images
	var mainImages = function(imgdata, Figure) {
		this.imgdata = imgdata;
		this.figure = Figure;
		this.boxwh = {};
		this.imghome = this.figure.$_photoshow.find('div[node-type="img-home"]');
		this.map = this.figure.$_photoshow.find('div[node-type="pf-map"]')
		this.zoom = false;
		this.init();
	};

	$.extend(mainImages.prototype, pubsub, {
		init: function() {
			this.map.hide();
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
			this.boxwh.width = this.imghome.width();
			this.boxwh.height = this.imghome.height();
		},
		renderImg: function() {
			var __ = this;
			var imgUrl = this.imgdata['bigImg'];
			getJs('../src/js/resetImgSize.js', 'resetImgSize', function(resize) {
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
				__.rotate = Rotate({
					imgObj: img,
					width: wh[0],
					height: wh[1],
					imgwarp: __.imghome,
					wwid: __.boxwh.width,
					whei: __.boxwh.height
				});

			});

		},
		zoomIn: function() {
			var __ = this;
			var bwh = this.boxwh;
			var imgUrl = this.imgdata['bigImg'];
			getJs('../src/js/resetImgSize.js', 'resetImgSize', function(resize) {
				resize({
					imageUrl: imgUrl,
					style: 'min',
					width: __.boxwh.width,
					height: __.boxwh.height,
					zoom: false
				}, function(wh, url) {
					__._setBigImg(wh, url);
				});
			})
			__.zoom = true;

		},
		zoomOut: function() {
			var __ = this;
			__.zoom = false;
			__.renderImg();
			__.map.hide();
		},
		$_bigImg: '',
		_setBigImg: function(wh, url) {
			var __ = this;
			if (wh[0] > this.boxwh.width || wh[1] > this.boxwh.height) {
				getJs('../src/js/resetImgSize.js', 'resetImgSize', function(resize) {
					resize({
						imageUrl: url,
						style: 'max',
						width: $win.width(),
						height: $win.height()
					}, function(wh, url) {
						__._insetBigImg(wh, url)
					});
				});
			} else {
				__._insetBigImg(wh, url)
			}
		},
		$_bigImgWh: '',
		_insetBigImg: function(wh, url) {
			var img = $('<img src="' + url + '"  width="' + wh[0] + '" height="' + wh[1] + '" class="bigPhotoImg" />');
			this.imghome.html(img);
			this.$_bigImgWh = wh;
			this.$_bigImg = img;
			this._insertMapImg(wh, img, url);
		},
		$_mw: '',
		$_mh: '',
		// get map img size
		_getMapImgSize: function(wh, url, callback) {
			var __ = this;
			__.map.show();
			__.$_mw = __.map.width();
			__.$_mh = __.map.height();
			getJs('../src/js/resetImgSize.js', 'resetImgSize', function(resize) {
				resize({
					imageUrl: url,
					style: 'max',
					width: __.$_mw,
					height: __.$_mh
				}, function(wh, url) {
					callback && callback(wh, url);
				});
			});
		},
		_mapinfo: {},
		// 设置预览图的大小及位置
		_insertMapImg: function(wh, img, url) {
			var __ = this;
			__._setBigImgPosition(wh, img);
			if (wh[0] <= __.boxwh.width && wh[1] <= __.boxwh.height) return;
			__._getMapImgSize(wh, url, function(mapwh, url) {
				var mapimg = $('<img src="' + url + '"  width="' + mapwh[0] + '" height="' + mapwh[1] + '" class="mapImg" />');
				var l = (__.$_mw - mapwh[0]) / 2;
				var t = (__.$_mh - mapwh[1]) / 2;
				mapimg.css({
					'top': t,
					'left': l
				});
				__.map.html(mapimg);
				__._mapinfo.imgwid = mapwh[0];
				__._mapinfo.imghei = mapwh[1];
				__._mapinfo.imgleft = l;
				__._mapinfo.imgtop = t;
				//set zoomview box
				__._getViewArea(wh, mapwh);
				__._initViewareaPos(l, t);
				__._moveViewEvn()
			});
		},
		//设置大图的居中初始位置
		_setBigImgPosition: function(wh, img) {
			var __ = this;
			var l = (__.boxwh.width - wh[0]) / 2;
			var t = (__.boxwh.height - wh[1]) / 2;
			img.css({
				'top': t,
				'left': l
			});
		},
		$_viewBtn: '',
		_getViewArea: function(wh, mapwh) {
			var __ = this;
			var ratio = mapwh[0] / wh[0];
			var viewWH = [];
			viewWH[0] = this.boxwh.width * ratio;
			viewWH[1] = this.boxwh.height * ratio;
			var viewarea = $('<p class="viewarea"></p>');
			viewarea.width(viewWH[0] - 6);
			viewarea.height(viewWH[1] - 6)
			__._mapinfo.areawid = viewWH[0];
			__._mapinfo.areahei = viewWH[1];
			this.map.append(viewarea);
			this.$_viewBtn = viewarea;
		},
		//设置预览可视框初始位置
		_initViewareaPos: function() {
			var mi = this._mapinfo;
			var l = (mi.areawid - mi.imgwid) / 2;
			var t = (mi.areahei - mi.imghei) / 2;
			var vl = mi.imgleft - l;
			var vt = mi.imgtop - t;
			mi.areatop = vt;
			mi.arealeft = vl;
			this.$_viewBtn.css({
				left: vl,
				top: vt
			});
		},
		//drag viewarea button
		_moveViewEvn: function() {
			var __ = this;
			getJs('../src/js/mousedrag.js', 'Mousedrag', function(Mousedrag) {
				var mousedrag = new Mousedrag(__.$_viewBtn, function(nl, ny, odata) {
					__.emit('moving', nl, ny, odata)
				});
				mousedrag.mousedown(function() {
					__.emit('moveStart');
				});
				mousedrag.mouseup(function() {
					__.emit('moveEnd');
				})

			});
			__._moveAreaPos();
			__._moveMainImgPos();
		},
		//设置小图框的位置
		_moveAreaPos: function(nl, ny, odata) {
			var __ = this,
				mi = __._mapinfo;
			var newlr = [0, 0];
			var rule = __._getRule();

			this.on('moveStart', function() {

			});
			this.on('moving', function(nl, ny, odata) {
				var left = mi.arealeft + nl;
				var top = mi.areatop + ny;
				if (left > rule['x'][0]) {
					left = rule['x'][0]
				}
				if (left < rule['x'][1]) {
					left = rule['x'][1]
				}
				if (top < rule['y'][0]) {
					top = rule['y'][0]
				}
				if (top > rule['y'][1]) {
					top = rule['y'][1]
				}
				// if(left > rule['x'][0] || left < rule['x'][1] )return;
				// if(top < rule['y'][0] || top > rule['y'][1])return;
				newlr[0] = left;
				newlr[1] = top;
				__.$_viewBtn.css({
					left: left,
					top: top
				});
				__.emit('setposition', mi.imgleft - left, mi.imgtop - top)

			});
			this.on('moveEnd', function() {
				mi.arealeft = newlr[0];
				mi.areatop = newlr[1];
			})

		},
		//设置大图的位置
		_moveMainImgPos: function() {
			var __ = this;
			var rotate = this.$_bigImgWh[0] / this._mapinfo.imgwid;
			this.on('setposition', function(zleft, ztop) {
				__.$_bigImg.css({
					left: zleft * rotate,
					top: ztop * rotate
				});

			})
		},
		_getRule: function() {
			var __ = this,
				mi = __._mapinfo;
			var rule = {
				x: [],
				y: []
			};
			var x1 = mi.imgleft;
			var x2 = mi.imgleft - mi.areawid + mi.imgwid;
			var y1 = mi.imgtop;
			var y2 = mi.imgtop - mi.areahei + mi.imghei;
			rule['x'][0] = Math.max(x1, x2);
			rule['x'][1] = Math.min(x1, x2);
			rule['y'][0] = Math.min(y1, y2);
			rule['y'][1] = Math.max(y1, y2);
			return rule;
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

	return function(imgDataList, index, params) {
		return figureObj = new Figure(imgDataList, index, params);
	}

});