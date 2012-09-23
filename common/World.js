var __BROWSER__ = __BROWSER__ || false;
if (!__BROWSER__) {
	var Characters = require('./Characters.js');
	var Players = require('./Players.js');
	var Area = require('./Area.js');
}

var World = function () {
	this.players_ = new Players();
	this.characters_ = new Characters();

	this.area_ = new Area();
	
	this.cycle_ = 0;
	this.cycle_date_ = Date.now();

	this.unserialize_date_ = null;
	this.serialize_date_  = null;

	var self = this;
	this.characters_.onSet = function () { return self.onCharacterSet.apply(self, arguments); };
};

World.CYCLE_DURATION = 20;

World.prototype.onCharacterSet = function () { };

World.prototype.getArea = function () {
	return this.area_;
};

World.prototype.getCurrentCycle = function () {
	return this.cycle_;
};

World.prototype.getPlayer = function (uuid) {
	return this.players_.get(uuid);
};

World.prototype.getCharacter = function (uuid) {
	return this.characters_.get(uuid);
};

World.prototype.identifyCharacter = function (character) {
	return this.characters_.identify(character);
};

World.prototype.enter = function () {
	var character = this.characters_.create();
	var player = this.players_.create();
	
	player.character_ = character;

	player.step(this);
	character.step(this);

	return this.players_.identify(player);
};

World.prototype.validateMouvement = function (from, to) {
	if (!this.area_.validateMouvement(to[0] / 1000, to[1] / 1000)) {
		return false;
	}
	return true;
};

World.prototype.pushOrder = function (uuid, order) {
//	console.log(uuid +': '+ order);
	var player = this.players_.find(uuid);
	player.pushOrder(this.cycle_, order);
};

World.prototype.step = function () {
	this.players_.step(this);
	this.characters_.step(this);
	this.cycle_++;
	this.cycle_date_ = Date.now();
};

World.prototype.serialize = function () {
	return {
		cycle : this.cycle_,
		cycle_date : this.cycle_date_,
		players: this.players_.serialize(this),
		characters: this.characters_.serialize(this),
		serialize_date: Date.now()
	};
};

World.prototype.unserialize = function (serial) {
	this.cycle_ = serial.cycle;
	this.cycle_date_ = serial.cycle_date;
	this.serialize_date_ = serial.serialize_date;
	this.unserialize_date_ = Date.now();

	this.characters_.unserialize(serial.characters, this);
	this.players_.unserialize(serial.players, this);
	
};

World.prototype.computeLatency = function () {
	return this.unserialize_date_ - this.serialize_date_;
};

World.prototype.computeRealCycle = function (time) {
	var c = time - (this.cycle_date_ - (this.unserialize_date_ - this.serialize_date_));
	c /= World.CYCLE_DURATION;
	return this.cycle_ + c;
};

if (!__BROWSER__) {
	module.exports = World;
}