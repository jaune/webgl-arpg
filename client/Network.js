var Network = function () {
	this.socket_ = null;
	this.machine_ = new Machine();
	this.player_uuid_ = null;

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
		
		this.player_uuid_ = player_uuid;

		var player = self.machine_.find(player_uuid);

		self.onEnter(player);
	});

	socket.on('machine', function (machine) {
		self.machine_.unserialize(machine);
	});
};

Network.prototype.pushOrder = function (order) {
	socket.emit('order', order);
};