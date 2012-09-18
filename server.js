
var modules = {
	express: require('express'),
	http: require('http'),
	socket_io: require('socket.io')
};



var Machine = require('./common/Machine.js');


var express_static = modules.express['static'];

var app = modules.express(),
	server = modules.http.createServer(app),
	io = modules.socket_io.listen(server),
	machine = new Machine();

io.set('log level', 2);

app.use(express_static('www'));
app.use('/scripts/client', express_static('./client'));
app.use('/scripts/common', express_static('./common'));


function onConnection (socket) {

		var player_uuid = null;
//	socket.on('area enter', function (data) {
/*
		var character = entities.create('Character');
		var uuid = entities.identify(character);
*/
		socket.on('disconnect', function () {
			// socket.broadcast.emit('other leave', uuid, character.serialize());
		});
/*
		(function () {
			var serial = machine.serialize();
			socket.emit('player begin', {
				sent_at : Date.now(),
				character : uuid,
				entities : entities.serialize()
			});

		})();
*/
/*
		socket.broadcast.emit('entities update', {
			sent_at : Date.now(),
			entities : entities.serialize(uuid)
		});
*/
		socket.on('enter', function () {
			player_uuid = machine.enter();
			socket.emit('enter', player_uuid, machine.serialize());
		});

		socket.on('order', function (order) {
			if (!player_uuid) {
				return;
			}
			machine.pushOrder(player_uuid, order);
			/*
			var a = actions;
			for (i = 0, l = a.length; i < l; i++) {
				machine.pushAction(player_uuid, a[i]);
			}
			*/
/*
			var action = {
				character: character.serialize(),
				sent_at : data.sent_at,
				received_at : Date.now(),
				action: data.action
			};
*/

			

//			socket.broadcast.emit('other do', action);
		});

//	});
}


io.sockets.on('connection', onConnection);


setInterval(function () {
	io.sockets.emit('machine', machine.serialize());
}, 1000);

setInterval(function () {
	machine.step();
}, 50);


server.listen(80);