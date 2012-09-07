var modules = {
	express: require('express'),
	http: require('http'),
	'socket.io': require('socket.io')
};

var app = modules.express(),
	server = modules.http.createServer(app),
	io = modules['socket.io'].listen(server)
	;

app.use(modules.express['static']('www'));

io.sockets.on('connection', function (socket) {

	socket.emit('player initialize', {
		position: { x: 0, y: 0 },
		direction: 'south'
	});
  
  socket.on('player do', function (data) {
		var action = {
			player : '',
			sent_at : data.date,
			received_at : Date.now(),
			action: data.action
		};
  });

});


server.listen(80);