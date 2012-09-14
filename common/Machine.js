var __BROWSER__ = __BROWSER__ || false;
if (!__BROWSER__) {

	var Entities = require('./Entities.js');
	var CharacterFactory = require('./CharacterFactory.js');
	var PlayerFactory = require('./PlayerFactory.js');
}

var Machine = function () {
	this.entities_ = new Entities();
	this.cycle_ = 0;
	this.actions_ = [];

	this.registerFactories();
};

Machine.prototype.registerFactories = function () {
	this.entities_.register('Character', new CharacterFactory());
	this.entities_.register('Player', new PlayerFactory());
};


Machine.prototype.find = function (uuid) {
	return this.entities_.find(uuid);
};

Machine.prototype.enter = function () {
	var character = this.entities_.create('Character');
	var player = this.entities_.create('Player');
	player.character_ = character;
	return this.entities_.identify(player);
};

Machine.prototype.pushAction = function (entity, action) {

	console.log(entity+' : '+action);

	this.actions_.push({
		entity : entity,
		action : action
	});
	
};

Machine.prototype.step = function () {
	var a = this.actions_;
	for (i = 0, l = a.length; i < l; ++i) {
		// a[i];
	}
	this.actions_ = [];
	this.cycle_++;
};

Machine.prototype.serialize = function () {
	return {
		cycle : this.cycle_,
		entities: this.entities_.serialize()
	};
};

Machine.prototype.unserialize = function (serial) {
	this.cycle_ = serial.cycle;
	this.entities_.unserialize(serial.entities);
};

if (!__BROWSER__) {
	module.exports = Machine;
}