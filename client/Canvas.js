var Canvas = function () {
	
	this.oninitialize = function () {};
	this.onresize = function () {};
	this.onrender = function () {};

};

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
			self.onresize(canvas.width, canvas.height);
			resize_timeout = null;
		}, 1000);
	});

	this.oninitialize(canvas);
};

Canvas.prototype.render = function () {
	var self = this;
	window.requestAnimationFrame__(function (time) {
		self.onrender(time);
		self.render();
	});
};

window.requestAnimationFrame__ = (function(){
	return  window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback){
		window.setTimeout(function () { callback(+(new Date())); } , 1000 / 60);
	};
})();