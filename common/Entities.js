var __BROWSER__ = __BROWSER__ || false;

var Entities = function () {
	this.factories_ = {};
	
	this.entities_ = [];
	this.mappings_ = {};
	this.uuids_ = [];

	this.onUnserializeEntity = function () {};
	this.onCreateEntity = function () {};
};

Entities.prototype.create = function (type, uuid) {
	if (!this.factories_.hasOwnProperty(type)) {
		throw new Error('Missing factory `'+type+'`.');
	}

	var index = this.entities_.length;
	uuid = uuid || [
		type,
		Date.now().toString(36),
		(index + 42).toString(36),
		Math.round(Math.random() * 42).toString(36)
	].join('-');

	var entity = this.factories_[type].create(uuid);

	this.uuids_.push(uuid);
	this.entities_.push(entity);
	this.mappings_[uuid] = index;

	this.onCreateEntity(type, entity);
	return entity;
};

Entities.prototype.register = function (type, factory) {
	this.factories_[type] = factory;
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

Entities.prototype.has = function (uuid) {
	return this.mappings_.hasOwnProperty(uuid);
};

Entities.prototype.serialize = function (uuid) {
	if (uuid) {
		return this.serializeOnce(uuid);
	}
	return this.serializeAll();
};

Entities.prototype.serializeAll = function () {
	var e = this.entities_,
		u = this.uuids_,
		l = e.length,
		serial = {};

	for (i = 0; i < l; ++i) {
		serial[u[i]] = e[i].serialize();
	}
	return serial;
};

Entities.prototype.serializeOnce = function (uuid) {
	var serial = {};
	serial[uuid] = this.find(uuid).serialize();
	return serial;
};

Entities.prototype.unserialize = function (serial) {
	var entity = null,
		type = null,
		uuid = null;

	for (uuid in serial) {
		if (serial.hasOwnProperty(uuid)) {
			type = uuid.split('-')[0];
			if (!this.has(uuid)) {
				entity = this.create(type, uuid);
			} else {
				entity = this.find(uuid);
			}
			entity.unserialize(serial[uuid]);
			this.onUnserializeEntity(type, entity);
		}
	}
	return serial;
};

if (!__BROWSER__) { module.exports = Entities; }