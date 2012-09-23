var Renderer = function () {
	this.viewport_matrix_ = null;
	this.need_viewport_matrix_apply_ = false;
};

Renderer.prototype.initialize = function () {
	throw new Error('Abstract method.');
};

Renderer.prototype.render = function () {
	throw new Error('Abstract method.');
};

Renderer.prototype.applyViewportMatrix = function (matrix) {
	this.viewport_matrix_ = matrix;
	this.need_viewport_matrix_apply_ = true;
};

