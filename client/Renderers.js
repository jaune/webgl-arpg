var Renderers = function () {
	this.items_ = [];
};

Renderers.prototype.append = function (renderer) {
	if (!(renderer instanceof Renderer)) {
		throw new Error('Must be Renderer.');
	}
	this.items_.push(renderer);
};

Renderers.prototype.initialize = function () {
	for (var a = this.items_, i = 0, l = a.length; i < l; i++) {
		this.items_[i].initialize();
	}
};

Renderers.prototype.render = function (cycle) {
	for (var a = this.items_, i = 0, l = a.length; i < l; i++) {
		this.items_[i].render(cycle);
	}
};

Renderers.prototype.applyViewportMatrix = function (matrix) {
	for (var a = this.items_, i = 0, l = a.length; i < l; i++) {
		this.items_[i].applyViewportMatrix(matrix);
	}
};

