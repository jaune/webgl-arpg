var Canvas = function () {};

Canvas.prototype.oninitialize = function () {};
Canvas.prototype.onresize = function () {};

Canvas.prototype.initialize = function () {
	var self = this;
	var resize_timeout = null;
	var canvas = null;

	canvas = document.createElement('CANVAS');
	canvas.setAttribute('width', window.innerWidth);
	canvas.setAttribute('height', window.innerHeight);
	document.body.appendChild(canvas);

	window.addEventListener('resize', function (event) {
		if (resize_timeout) {
			window.clearTimeout(resize_timeout);
		}
		resize_timeout = window.setTimeout(function () {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			self.onResize(canvas.width, canvas.height);
			resize_timeout = null;
		}, 1000);
	});

	this.onInitialize(canvas);
};

