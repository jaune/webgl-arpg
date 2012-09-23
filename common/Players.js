var __BROWSER__ = __BROWSER__ || false;

if (!__BROWSER__) {
	var Entities = require('./Entities.js');
	var Player = require('./Player.js');
}

var Players = function () {
};

Players.prototype = Object.create(new Entities());

Players.prototype.doCreate = function () {
	return new Player();
};



if (!__BROWSER__) {
	module.exports = Players;
}