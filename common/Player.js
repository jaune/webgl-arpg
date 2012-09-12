var __BROWSER__ = __BROWSER__ || false;

if (!__BROWSER__) {
	var Character = require('./Character.js');
}

var Player = function (uuid) {
	this.character_ = new Character();
	this.uuid_ = uuid || null;
};

Player.prototype.unserialize = function (data) {
	this.uuid_ =	data.uuid;
	this.character_.unserialize(data.character);
};

Player.prototype.serialize = function () {
	return {
		uuid : this.uuid_,
		character : this.character_.serialize()
	};
};

if (!__BROWSER__) {
	module.exports = Player;
}