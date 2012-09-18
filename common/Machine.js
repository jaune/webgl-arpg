var __BROWSER__ = __BROWSER__ || false;
if (!__BROWSER__) {

	var Entities = require('./Entities.js');
	var CharacterFactory = require('./CharacterFactory.js');
	var PlayerFactory = require('./PlayerFactory.js');
}

var Machine = function () {
	this.entities_ = new Entities();
	this.cycle_ = 0;

	this.registerFactories();

	var self = this;
	this.entities_.onCreateEntity = function (entity, type, uuid) {
		self.onCreateEntity(entity, type, uuid);
	};

	this.entities_.onUpdateEntity = function (entity, type, uuid) {
		self.onUpdateEntity(entity, type, uuid);
	};
};

Machine.ENTITY_PLAYER = 'Player';
Machine.ENTITY_CHARACTER = 'Character';

Machine.prototype.registerFactories = function () {
	this.entities_.register(Machine.ENTITY_CHARACTER, new CharacterFactory());
	this.entities_.register(Machine.ENTITY_PLAYER, new PlayerFactory());
};


Machine.prototype.find = function (uuid) {
	return this.entities_.find(uuid);
};

Machine.prototype.enter = function () {
	var character = this.entities_.create(Machine.ENTITY_CHARACTER);
	var player = this.entities_.create(Machine.ENTITY_PLAYER);
	player.character_ = character;
	return this.entities_.identify(player);
};

Machine.prototype.pushOrder = function (uuid, order) {
	console.log(uuid +': '+ order);
	var player = this.find(uuid);
	player.pushOrder(this.cycle_, order);
};

Machine.prototype.step = function () {
	var c = this.entities_.findByType(Machine.ENTITY_CHARACTER),
		p = this.entities_.findByType(Machine.ENTITY_PLAYER),
		l = 0,
		i = 0;

	for (i = 0, l = p.length; i < l; ++i) {
		p[i].step();
	}
	
	for (i = 0, l = c.length; i < l; ++i) {
		c[i].step();
	}
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