var Network = function () {
	this.socket_ = null;
	this.machine_ = new Machine();
	this.player_uuid_ = null;

	this.onEnter = function () {};
};

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

Network.prototype.doAction = function (action) {
	socket.emit('actions', [action]);
};