
var modules = {
	express: require('express'),
	http: require('http'),
	socket_io: require('socket.io')
};

var Entities = require('./common/Entities.js');
var CharacterFactory = require('./common/CharacterFactory.js');


var express_static = modules.express['static'];

var app = modules.express(),
	server = modules.http.createServer(app),
	io = modules.socket_io.listen(server),
	entities = new Entities();

entities.register('Character', new CharacterFactory());

app.use(express_static('www'));
app.use('/scripts/client', express_static('./client'));
app.use('/scripts/common', express_static('./common'));


function onConnection (socket) {

	socket.on('area enter', function (data) {

		var character = entities.create('Character');
		var uuid = entities.identify(character);

		socket.on('disconnect', function () {
			// socket.broadcast.emit('other leave', uuid, character.serialize());
		});

		socket.emit('area enter', {
			sent_at : Date.now(),
			character : uuid,
			entities : entities.serialize()
		});

		socket.broadcast.emit('entities update', {
			sent_at : Date.now(),
			entities : entities.serialize(uuid)
		});
	

		socket.on('owner do', function (data) {
			var action = {
				character: character.serialize(),
				sent_at : data.sent_at,
				received_at : Date.now(),
				action: data.action
			};
			socket.broadcast.emit('other do', action);
		});

	});
}


io.sockets.on('connection', onConnection);


setInterval(function () {
	io.sockets.emit('entities update', {
		sent_at : Date.now(),
		entities : entities.serialize()
	});
}, 1000);


server.listen(80);