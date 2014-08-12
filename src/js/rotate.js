/**
 * @author jerry
 *
 * imgObj	{DOMObject} image Document Object
 * width	{Number} image box width
 * height	{Number} image box height
 * reg		{Number} reg value
 */
(function(root) {
	var rotate = function(args) {
		var params = {
			imgObj: '',
			width: 0,
			height: 0,
			reg: 0,
			imgwarp: '',
			imgObj: ''
		};
		$.extend(params, args);
		return new Rotate(params)
	};

	function Rotate(args) {
		for (var i in args) {
			this[i] = args[i];
		}
		this.init()
	};
	var proto = Rotate.prototype;

	proto['init'] = function() {
		var __ = this,
			imgobj = __.imgwarp.find('.figure_img');
		if (imgobj[0]) imgobj.remove()
		var obj = insertRWarp(this.wwid, this.whie);
		this.imgwarp.append(obj)
		var imgObj = getImg(this.imgObj.attr('src'), this.width, this.height);
		var pos = getPos(this.wwid, this.whei, this.width, this.height)
		this.imgObj.css({
			"opacity": 0
		})
		obj.append(imgObj.css(pos));
		this.roImg = imgObj;
		imgObj.addClass('rotate')
		this.rotateImg = this.rotate();
	};

	proto['rotate'] = function() {
		var __ = this;
		if (HAS_CANVAS) return function(reg) {
			var trans = getFix + 'transform';
			var mulriple = reg / 90,
				nwd, pos;

			if (mulriple % 2) {
				nwd = resetHW(__.whei, __.wwid, __.width, __.height)
			} else {
				nwd = resetHW(__.wwid, __.whei, __.width, __.height)
			}
			var pos = getPos(__.wwid, __.whei, nwd[0], nwd[1])
			__.roImg.css(trans, 'rotate(' + reg + 'deg)')
			__.roImg.css({
				width: nwd[0],
				height: nwd[1],
				top: pos.top,
				left: pos.left
			})
		}

		if (HAS_FILTER) return function(reg) {
			var angle = Math.PI / 180 * reg;
			var sin = Math.sin(angle);
			var cos = Math.cos(angle);
			var mulriple = reg / 90,
				pos;
			if (mulriple % 2) {
				nwd = resetHW(__.whei, __.wwid, __.width, __.height)
				pos = getPos(__.wwid, __.whei, nwd[1], nwd[0])
			} else {
				nwd = resetHW(__.wwid, __.whei, __.width, __.height)
				pos = getPos(__.wwid, __.whei, nwd[0], nwd[1])
			}
			__.roImg.css({
				width: nwd[0],
				height: nwd[1],
				top: pos.top,
				left: pos.left
			})
			var filter = [
				'progid:DXImageTransform.Microsoft.Matrix(M11="',
				cos,
				'", M12="', -sin,
				'", M21="',
				sin,
				'", M22="',
				cos,
				'", sizingMethod="auto expand")'
			].join('');
			__.roImg.css('filter', filter);

		}
	};

	proto['clockwise'] = function() {
		this.reg += 90;
		this.rotateImg(this.reg);
	};
	proto['anticlockwise'] = function() {
		this.reg -= 90;
		this.rotateImg(this.reg);
	};
	var insertRWarp = function(wid, hei) {
		return $('<div class="figure_img"></div>').css({
			'position': 'absolute',
			"width": wid,
			"height": hei,
			"top": 0,
			"left": 0
		});
	};

	var getImg = function(src, wid, hei) {
		var img = $('<img src="' + src + '" />');
		return img.css({
			height: hei,
			width: wid,
			'position': 'absolute'
		})
	};
	var resetHW = function(wwid, whei, iw, ih) {
		var nw, nh;
		if (iw <= wwid && ih <= whei) {
			return [iw, ih];
		}
		var ratio = iw / ih;
		if (iw >= ih) {
			if (iw >= wwid) {
				nw = wwid;
				nh = nw / ratio;
			} else if (ih >= whei) {
				nh = whei;
				nw = ratio * nh;
			}
		} else {
			if (ih >= whei) {
				nh = whei;
				nw = ratio * nh;
			} else if (iw >= wwid) {
				nw = wwid;
				nh = nw / ratio
			}
		}
		return [nw, nh];
	};
	var getPos = function(wwid, whei, iwid, ihei) {
		return {
			top: (whei - ihei) / 2,
			left: (wwid - iwid) / 2
		};
	}
	var HAS_CANVAS = (function() {
		var canvas = document.createElement('canvas');
		return !!(canvas && canvas.getContext);
	})();

	var HAS_FILTER = (function() {
		return document.createElement('span').style.filter !== undefined;
	})();

	var getFix = function() {
		var nua = navigator.userAgent;
		if (nua.indexOf('MSIE') >= 0) return '-ms-';
		if (nua.indexOf('OPR') >= 0) return '-o-';
		if (nua.indexOf('Firefox') >= 0) return '-moz-';
		if (nua.indexOf('Safari') >= 0) return '-webkit-';
		if (nua.indexOf('Chrome') >= 0) return '-webkit-';
		if (nua.indexOf('Camino') >= 0) return '';
		return ''
	}();

	root.rotate = rotate;
}(window));