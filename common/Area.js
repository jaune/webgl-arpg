var __BROWSER__ = __BROWSER__ || false;

if (!__BROWSER__) {
	require('./gl-matrix.js');
}


var Area = function (uuid) {
	this.uuid_ = uuid;
};

Area.prototype.unserialize = function (serial) {
	this.uuid_ = serial.uuid;
};

Area.prototype.serialize = function () {
	return {
		uuid: this.uuid_,
		position : [this.position_[0], this.position_[1]]
	};
};

if (!__BROWSER__) {
	module.exports = Character;
}