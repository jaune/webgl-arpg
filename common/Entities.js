var __BROWSER__ = __BROWSER__ || false;

var Entities = function () {
	this.factories_ = {};
	
	this.entities_ = [];
	this.mappings_ = {};
	this.uuids_ = [];
	this.types_ = {};
};

Entities.prototype.create = function (type, uuid) {
	if (!this.factories_.hasOwnProperty(type)) {
		throw new Error('Missing factory `'+type+'`.');
	}

	var index = this.entities_.length;
	uuid = uuid || [
		(index + 1).toString(36),
		type
	].join('-');

	var entity = this.factories_[type].create(uuid);

	this.uuids_.push(uuid);
	this.entities_.push(entity);
	this.mappings_[uuid] = index;

	if (!this.types_.hasOwnProperty(type)) {
		this.types_[type] = [];
	}
	this.types_[type].push(entity);

//	this.onCreateEntity(type, entity);
	return entity;
};

Entities.prototype.findByType = function (type) {
	if (!this.types_.hasOwnProperty(type)) {
		return [];
	}
	return this.types_[type];
};

Entities.prototype.findAll = function () {
	return this.entities_;
};

Entities.prototype.parseType = function (uuid) {
	return uuid.split('-')[1];
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
		serial[u[i]] = e[i].serialize(this);
	}
	return serial;
};

Entities.prototype.serializeOnce = function (uuid) {
	var serial = {};
	serial[uuid] = this.find(uuid).serialize(this);
	return serial;
};

Entities.prototype.unserialize = function (serial) {
	var entity = null,
		type = null,
		uuid = null,
		is_new = false;

	for (uuid in serial) {
		if (serial.hasOwnProperty(uuid)) {
			type = this.parseType(uuid);
			if (!this.has(uuid)) {
				entity = this.create(type, uuid);
				is_new = true;
			} else {
				entity = this.find(uuid);
				is_new = false;
			}
			entity.unserialize(serial[uuid], this);
			if (is_new) {
				this.onCreateEntity(entity, type, uuid);
			} else {
				this.onUpdateEntity(entity, type, uuid);
			}
		}
	}
	return serial;
};

Entities.prototype.onUpdateEntity = function () {};
Entities.prototype.onCreateEntity = function () {};

if (!__BROWSER__) { module.exports = Entities; }