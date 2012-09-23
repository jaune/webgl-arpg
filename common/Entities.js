var __BROWSER__ = __BROWSER__ || false;

var Entities = function () {
	this.entities_ = [];
	this.mappings_ = {};
	this.uuids_ = [];

	this.counter_ = 1;
};

Entities.prototype.doCreate = function () {
	throw new Error('Abstract method.');
};

Entities.prototype.create = function () {
	var entity = this.doCreate(),
		uuid = (++this.counter_).toString(36);

	this.set(uuid, entity);

	this.onCreate(entity, uuid);

	return entity;
};

Entities.prototype.allocate = function (uuid) {
	var entity = this.doCreate();

	this.set(uuid, entity);

	this.onAllocate(entity, uuid);

	return entity;
};

Entities.prototype.set = function (uuid, entity) {
	var index = this.entities_.length;

	this.uuids_.push(uuid);
	this.entities_.push(entity);
	this.mappings_[uuid] = index;

	this.onSet(entity, uuid);

	return entity;
};

Entities.prototype.findAll = function () {
	return this.entities_;
};

Entities.prototype.identify = function (entity) {
	return this.uuids_[this.entities_.indexOf(entity)];
};

Entities.prototype.find = function (uuid) {
	if (!this.has(uuid)) {
		return null;
	}
	return this.entities_[this.mappings_[uuid]];
};

Entities.prototype.get = function (uuid) {
	if (!this.has(uuid)) {
		throw new Error('Entity `'+uuid+'` is missing.');
	}
	return this.entities_[this.mappings_[uuid]];
};

Entities.prototype.has = function (uuid) {
	return this.mappings_.hasOwnProperty(uuid);
};

Entities.prototype.destroy = function (entity) {
	var index = this.entities_.indexOf(entity);
	if (index === -1) {
		return;
	}
	delete this.mappings_[this.uuids_[index]];
	if (this.entities_.length > 1) {
		this.entities_[index] = this.entities_.pop();
		this.uuids_[index] = this.uuids_.pop();
	} else {
		this.entities_.pop();
		this.uuids_.pop();
	}
};

Entities.prototype.serialize = function (machine) {
	var e = this.entities_,
		u = this.uuids_,
		l = e.length,
		serial = {};

	for (i = 0; i < l; ++i) {
		serial[u[i]] = e[i].serialize(machine);
	}
	return serial;
};

Entities.prototype.unserialize = function (serial, machine) {
	var entity = null,
		uuid = null,
		is_new = false;

	for (uuid in serial) {
		if (serial.hasOwnProperty(uuid)) {
			if (!this.has(uuid)) {
				entity = this.allocate(uuid);
			} else {
				entity = this.get(uuid);
			}
			entity.unserialize(serial[uuid], machine);
		}
	}
	return serial;
};

Entities.prototype.step = function (world) {
	var e = this.entities_;

	for (i = 0, l = e.length; i < l; ++i) {
		e[i].step(world);
	}
};

Entities.prototype.onCreate = function () {};
Entities.prototype.onAllocate = function () {};
Entities.prototype.onSet = function () {};

if (!__BROWSER__) { module.exports = Entities; }