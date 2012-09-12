var Network = function () {
	this.socket_ = null;
	this.entities_ = new Entities();

	this.entities_.register('Character', new CharacterFactory());

	var self  = this;
	this.entities_.onCreateEntity = function (type, entity) {
		self.onCreateEntity(type, entity);
	};

	this.onConnect = function () {};
	this.onDisconnect = function () {};

	this.onAreaEnter = function () {};
	this.onAreaTick = function () {};

	this.onOtherDo = function () {};

	this.onCreateEntity = function () {};
};

Network.prototype.initialize = function () {

	socket = io.connect('http://'+window.location.host+':80');
	
	var self = this;

	socket.on('connect', function () {
		self.onConnect();
		socket.emit('area enter', {
			id : this.id_
		});
	});

	socket.on('disconnect', function () {
		self.onDisconnect();
	});

	socket.on('area enter', function (data) {
		self.entities_.unserialize(data.entities);
		self.onAreaEnter(self.entities_.find(data.character));
	});

	socket.on('entities update', function (data) {
		self.entities_.unserialize(data.entities);
	});

	socket.on('other do', function (data) {
		self.onOtherDo(data);
	});
};

Network.prototype.doAction = function (action) {
	socket.emit('owner do', {
		action : action,
		sent_at : Date.now()
	});
};