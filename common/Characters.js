var __BROWSER__ = __BROWSER__ || false;

if (!__BROWSER__) {
	var Entities = require('./Entities.js');
	var Character = require('./Character.js');
}

var Characters = function () {
};

Characters.prototype = Object.create(new Entities());

Characters.prototype.doCreate = function () {
	return new Character();
};

if (!__BROWSER__) {
	module.exports = Characters;
}