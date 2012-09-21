var __BROWSER__ = __BROWSER__ || false;

if (!__BROWSER__) {
	var Character = require('./Character.js');
}

var Player = function () {
	this.character_ = null;
	this.order_ = null;
};


Player.prototype.pushOrder = function (cycle, order) {
	this.order_ = order;
};

Player.prototype.step = function () {
	this.character_.setNextAction((this.order_ !== null) ? this.order_ : Character.ACTION_DEFAULT);
};

Player.prototype.getCharacter = function () {
	return this.character_;
};

Player.prototype.unserialize = function (serial, entities) {
	this.character_ = entities.find(serial.character);
	this.order_ = serial.order;
};

Player.prototype.serialize = function (entities) {
	return {
		character: entities.identify(this.character_),
		order: this.order_
	};
};

if (!__BROWSER__) {
	module.exports = Player;
}