var __BROWSER__ = __BROWSER__ || false;

if (!__BROWSER__) {
}

var Player = function () {
	this.character_ = null;
	this.orders_ = [];
};


Player.prototype.pushOrder = function (cycle, order) {
	this.orders_.push([
		cycle, order
	]);
	this.clearOrders();
};

Player.prototype.clearOrders = function () {
	var a = this.orders_, l = a.length, s = l - 10;
	if (s > 10) {
		a.splice(0, s + 10);
	}
};

Player.prototype.getCurrentOrder = function (cycle) {
	var a = this.orders_, l = a.length;
	if (l > 0) {
		return a[l - 1][1];
	}
	return 'idle south';
};

Player.prototype.step = function () {
	this.character_.setNextAction(this.getCurrentOrder());
};

Player.prototype.getCharacter = function () {
	return this.character_;
};

Player.prototype.unserialize = function (serial, entities) {
	this.character_ = entities.find(serial.character);
	this.orders_ = serial.orders;
};

Player.prototype.serialize = function (entities) {
	return {
		character: entities.identify(this.character_),
		orders: this.orders_
	};
};

if (!__BROWSER__) {
	module.exports = Player;
}