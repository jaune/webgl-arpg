var __BROWSER__ = __BROWSER__ || false;

if (!__BROWSER__) {
	require('./gl-matrix.js');
	var AreaCollisionLayer = require('./AreaCollisionLayer.js');
}

var Area = function () {
	this.width_ = null;
	this.height_ = null;
	this.size_ = null;
	
	this.data_ = null;
	this.offset_ = 0;
};

Area.prototype.validateMouvement = function (x, y) {
	var test = (x < this.width_) &&
		(x >= 0) &&
		(y <  this.height_) &&
		(y >= 0) &&
		!this.collide(x, y);
	return test;
};

Area.prototype.allocate = function (width, heigth) {
	this.width_ = width;
	this.height_ = heigth;
	this.size_ = this.width_ * this.height_ * 4;
	this.data_ = new Uint8Array(this.size_);
};

Area.prototype.write = function () {
	this.data_.set(arguments, this.offset_);
	this.offset_ += arguments.length;
};

Area.prototype.collide = function (x, y) {
	var index = (x * 4) + (y * this.width_ * 4) + 2;
	return this.data_[index] === 0;
};

Area.prototype.getDataBuffer = function () {
	return this.data_;
};

Area.prototype.getWidth = function () {
	return this.width_;
};

Area.prototype.getHeight = function () {
	return this.height_;
};

Area.prototype.loadDefault = function () {
	this.allocate(64, 64);
	for (var i = 0, l = this.width_ * this.height_; i < l; i++) {

		collide = (Math.floor(Math.random() * 100) >= 50);
		x = collide?2:3;
		y = 0;

		this.write(x, y, collide?1:0, 0);
	}
};

if (!__BROWSER__) {
	module.exports = Area;
}