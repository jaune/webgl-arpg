var __BROWSER__ = __BROWSER__ || false;

if (!__BROWSER__) {
}

var Player = function () {
	this.character_ = null;
};


Player.prototype.getCharacter = function () {
	return this.character_;
};

Player.prototype.unserialize = function (serial, entities) {
	this.character_ = entities.find(serial.character);
};

Player.prototype.serialize = function (entities) {
	return {
		character: entities.identify(this.character_)
	};
};

if (!__BROWSER__) {
	module.exports = Player;
}