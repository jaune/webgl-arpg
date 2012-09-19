var Network = function () {
	this.socket_ = null;
	this.machine_ = new Machine();
	this.player_uuid_ = null;

	this.interval_ = null;

	var self = this;
	this.machine_.onCreateEntity = function (entity, type, uuid) {
		self.onCreateEntity(entity, type, uuid);
	};

	this.machine_.onUpdateEntity = function (entity, type, uuid) {
		self.onUpdateEntity(entity, type, uuid);
	};
};

Network.prototype.onCreateEntity = function () {};
Network.prototype.onUpdateEntity = function () {};
Network.prototype.onEnter = function () {};

Network.prototype.initialize = function () {

	socket = io.connect('http://'+window.location.host+':80');
	
	var self = this;

	socket.on('connect', function () {
		socket.emit('enter');
	});

	socket.on('enter', function (player_uuid, machine) {
		self.machine_.unserialize(machine);
		
		self.player_uuid_ = player_uuid;

		var player = self.machine_.find(player_uuid);

		self.onEnter(player);
	});

	socket.on('machine', function (machine) {
		self.machine_.unserialize(machine);
	});

	socket.on('order', function (uuid, order) {
		self.machine_.pushOrder(uuid, order);
	});
};

Network.prototype.pushOrder = function (order) {
	this.machine_.pushOrder(this.player_uuid_, order);
	socket.emit('order', order);
};


Network.prototype.computeRealCycle = function (current_time) {
	var real_cycle = this.machine_.computeRealCycle(current_time);
	var floor_cycle = Math.floor(real_cycle);
	var begin_cycle = this.machine_.cycle_;
	for (i = 0, l = floor_cycle - begin_cycle; i < l; i++) {
		this.machine_.step(begin_cycle + i);
	}
	return real_cycle;
};