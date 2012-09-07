var Inputs = function () {
	this.mapping_ = {};
	this.onaction = function () {};
};

Inputs.prototype.mapping = function (mapping) {
	this.mapping_ = mapping;
};

Inputs.prototype.initialize = function () {
	this.initializeKeys();
};

Inputs.prototype.doAction = function (code) {
	if (!this.mapping_.hasOwnProperty(code)) {
		return;
	}
	this.onaction(this.mapping_[code]);
};

Inputs.prototype.initializeKeys = function () {
	var keys = {};
	var self = this;

	window.addEventListener('keydown', function (event) {
		if (!key_is_down(event.keyCode)) {
			self.doAction('key '+event.keyCode+' pressed');
		}
		keys[event.keyCode+''] = true;
	});

	window.addEventListener('keyup', function (event) {
		if (key_is_down(event.keyCode)) {
			self.doAction('key '+event.keyCode+' released');
		}
		keys[event.keyCode+''] = false;
	});

	function key_is_down(code) {
		code = ''+code;
		if (!keys.hasOwnProperty(code)) {
			return false;
		}
		return keys[code];
	}
};