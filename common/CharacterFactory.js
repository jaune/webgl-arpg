var __BROWSER__ = __BROWSER__ || false;

if (!__BROWSER__) {
	var Character = require('./Character.js');
}

var CharacterFactory = function () {
};

CharacterFactory.prototype.create = function (uuid) {
	return new Character(uuid);
};

if (!__BROWSER__) {
	module.exports = CharacterFactory;
}