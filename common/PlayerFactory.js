var __BROWSER__ = __BROWSER__ || false;

if (!__BROWSER__) {
	var Player = require('./Player.js');
}

var PlayerFactory = function () {
};

PlayerFactory.prototype.create = function (uuid) {
	return new Player(uuid);
};

if (!__BROWSER__) {
	module.exports = PlayerFactory;
}