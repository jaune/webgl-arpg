var Network = function (world) {
	this.socket_ = null;
	this.world_ = world;
	this.player_uuid_ = null;
};

Network.prototype.onCreateCharacter = function () {};
Network.prototype.onEnter = function () {};

/*
Network.prototype.initialize = function () {

	socket = io.connect('http://'+window.location.host+':80');
	
	var self = this;

	socket.on('connect', function () {
		socket.emit('enter');
	});

	socket.on('enter', function (player_uuid, machine) {
		self.machine_.unserialize(machine);
		
		self.player_uuid_ = player_uuid;

		var player = self.machine_.getPlayer(player_uuid);

		self.onEnter(player);
	});

	socket.on('machine', function (machine) {
		self.machine_.unserialize(machine);
	});

	socket.on('order', function (uuid, order) {
		self.machine_.pushOrder(uuid, order);
	});
};
*/

Network.prototype.initialize = function () {
	this.player_uuid_ = this.world_.enter();
	var player = this.world_.getPlayer(this.player_uuid_);
	this.onEnter(player);
};


Network.prototype.pushOrder = function (order) {
	this.world_.pushOrder(this.player_uuid_, order);
	// socket.emit('order', order);
};

Network.prototype.computeRealCycle = function (current_time) {
	var real_cycle = this.world_.computeRealCycle(current_time);
	var floor_cycle = Math.floor(real_cycle);
	var begin_cycle = this.world_.getCurrentCycle();
	for (i = 0, l = floor_cycle - begin_cycle; i < l; i++) {
		this.world_.step(begin_cycle + i);
	}
	return real_cycle;
};