var __BROWSER__ = __BROWSER__ || false;
if (!__BROWSER__) {

	var Entities = require('./Entities.js');
	var CharacterFactory = require('./CharacterFactory.js');
	var PlayerFactory = require('./PlayerFactory.js');
}

var Machine = function () {
	this.entities_ = new Entities();
	
	this.cycle_ = 0;
	this.cycle_date_ = Date.now();

	this.unserialize_date_ = null;
	this.serialize_date_  = null;

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

Machine.CYCLE_DURATION = 50;

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

	player.step(this.cycle_);
	character.step(this.cycle_);

	return this.entities_.identify(player);
};

Machine.prototype.pushOrder = function (uuid, order) {
//	console.log(uuid +': '+ order);
	var player = this.find(uuid);
	player.pushOrder(this.cycle_, order);
};

Machine.prototype.doStep = function () {
	var ec = this.entities_.findByType(Machine.ENTITY_CHARACTER),
		ep = this.entities_.findByType(Machine.ENTITY_PLAYER),
		l = 0,
		i = 0,
		c = this.cycle_;

	for (i = 0, l = ep.length; i < l; ++i) {
		ep[i].step(c);
	}
	
	for (i = 0, l = ec.length; i < l; ++i) {
		ec[i].step(c);
	}
};

Machine.prototype.step = function () {
	this.doStep();
	this.cycle_++;
	this.cycle_date_ = Date.now();
};

Machine.prototype.serialize = function () {
	return {
		cycle : this.cycle_,
		cycle_date : this.cycle_date_,
		entities: this.entities_.serialize(),
		serialize_date: Date.now()
	};
};

Machine.prototype.unserialize = function (serial) {
	this.cycle_ = serial.cycle;
	this.cycle_date_ = serial.cycle_date;
	this.serialize_date_ = serial.serialize_date;
	this.unserialize_date_ = Date.now();
	this.entities_.unserialize(serial.entities);
};

Machine.prototype.computeLatency = function () {
	return this.unserialize_date_ - this.serialize_date_;
};

Machine.prototype.computeRealCycle = function (time) {
	var c = time - (this.cycle_date_ - (this.unserialize_date_ - this.serialize_date_));
	c /= Machine.CYCLE_DURATION;
	return this.cycle_ + c;
};

if (!__BROWSER__) {
	module.exports = Machine;
}