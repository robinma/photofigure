/**
 * @author jerry
 */
(function(win) {
	var preload = function(url, ready, load, error) {
		var __ = this,
			list = [],
			intervalId = null,
			tick = function() {
				var i = 0;
				for (; i < list.length; i++) {
					list[i].end ? list.splice(i--, 1) : list[i]();
				};
				!list.length && stop();
			},
			stop = function() {
				clearInterval(intervalId);
				intervalId = null;
			};

		var onready, width, height, newWidth, newHeight, img = new Image();
		img.src = url;
		if (img.complete) {
			//ready.call(img);
			__.circuGet(img, ready);
			load && load.call(img);
			return;
		};
		width = img.width;
		height = img.height;
		img.onerror = function() {
			error && error.call(img);
			onready.end = true;
			img = img.onload = img.onerror = null;
		};

		onready = function() {
			newWidth = img.width;
			newHeight = img.height;
			if (newWidth !== width || newHeight !== height ||
				newWidth * newHeight > 1024) {
				//ready.call(img);
				__.circuGet(img, ready);
				onready.end = true;
			};
		};
		onready();

		img.onload = function() {
			!onready.end && onready();
			load && load.call(img);
			img = img.onload = img.onerror = null;
		};

		if (!onready.end) {
			list.push(onready);
			if (intervalId === null)
				intervalId = setInterval(tick, 40);
		};
	};

	preload.prototype.circuGet = function(img, ready) {
		var sto, time = 0;
		var check = function() {
			if (img.width > 0 && img.height > 0) {
				ready.call(img);
				return;
			}
			if (time > 11) return;
			window.console && console.log(img, ' test to get img width and height!!');
			sto = setTimeout(check, 40);
			time++
		};
		check();
	};


	win.preOnloadImgSize = function(url, ready, load, error) {
		new preload(url, ready, load, error);
	}

}(window));