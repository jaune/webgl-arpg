var	current_time = 0,
	elapsed_time = 0,
	last_time = null,
	viewport_width = 0,
	viewport_height = 0,
	viewport_matrix = null,
	viewport_offset_x = 200,
	viewport_offset_y = 200,
	area = null,
	characters = null,
	fog = null,
	inputs = new Inputs(),
	player_character = null,
	network = new Network();

function viewport_matrix_update() {
	var matrix = mat4.create([
		2/viewport_width, 0, 0, 0,
		0, 2/(-viewport_height), 0, 0,
		0, 0, -2, 0,
		-1, 1, -1, 1
	]);
	mat4.translate(matrix, [viewport_offset_x, viewport_offset_y, 0.0]);
	mat4.scale(matrix, [0.5, 0.5, 0]);
	return matrix;
}
/*
function viewport_apply(program) {
	var uniform = webgl.locatesUniform(program, 'uViewportMatrix');
	gl.viewport(0, 0, viewport_width, viewport_height);
	gl.uniformMatrix4fv(uniform, false, viewport_matrix);
}
*/

webgl.onrender = function (time) {
	// console.time('render');
	current_time = time;
	if (last_time === null) {
		elapsed_time =  0;
	} else {
		elapsed_time =  current_time - last_time;
	}
	last_time = current_time;

	// characters.update(elapsed_time);
	
	gl.clear(gl.COLOR_BUFFER_BIT);
//	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	if (need_viewport_apply === true) {
		gl.viewport(0, 0, viewport_width, viewport_height);
		viewport_matrix = viewport_matrix_update();
		area.applyViewportMatrix(viewport_matrix);
		characters.applyViewportMatrix(viewport_matrix);
	}

	area.render();
	characters.render();

/*
	gl.blendFunc(gl.ZERO, gl.SRC_COLOR);

	fog.render(function (program) {
		if (need_viewport_apply === true) {
			viewport_apply(program);
		}
	});
*/

	need_viewport_apply = false;

	// console.timeEnd('render');
};

webgl.onresize = function (width, height) {
	viewport_width = width;
	viewport_height = height;
	
	need_viewport_apply = true;
};

webgl.oninitialize = function (width, height) {
	viewport_width = width;
	viewport_height = height;
	
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.disable(gl.DEPTH_TEST);
	
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	gl.clear(gl.COLOR_BUFFER_BIT);

	need_viewport_apply = true;

	area.initialize();
	characters.initialize();
//	fog.initialize();
	
	network.initialize();


};

/*
network.onCreateEntity = function (type, entity) {
	switch (type) {
		case 'Character':
			characters.append(entity);
		break;
		case '':
		break;
		default:
	}
};
*/
network.onCreateEntity = function (entity, type, uuid) {
	if (type == Machine.ENTITY_CHARACTER) {
		characters.append(entity);
	}
};

network.onUpdateEntity = function (entity, type, uuid) {
};

network.onEnter = function (player) {
	player_character = player.getCharacter();
//	characters.append(player_character);
	inputs.initialize();
};

inputs.mapping({
	'key 40 pressed' : 'walk south',
	'key 83 pressed' : 'walk south',

	'key 38 pressed' : 'walk north',
	'key 87 pressed' : 'walk north',

	'key 37 pressed' : 'walk west',
	'key 65 pressed' : 'walk west',

	'key 39 pressed' : 'walk east',
	'key 68 pressed' : 'walk east',

	'key 40 released' : 'idle south',
	'key 83 released' : 'idle south',

	'key 38 released' : 'idle north',
	'key 87 released' : 'idle north',

	'key 37 released' : 'idle west',
	'key 65 released' : 'idle west',

	'key 39 released' : 'idle east',
	'key 68 released' : 'idle east',

	'key 32 pressed' : 'attack'
});

inputs.onaction = function (action) {
	
	if (action === 'attack') {
		console.debug(network);
	} else {
		network.pushOrder(action);
	}
	/*
	switch (action) {
		case 'walk south':
			player_character.next_action_ = {
				delta: vec2.create([0.0, 1.0]),
				duration: 300
			};
		break;
		case 'walk north':
			player_character.next_action_ = {
				delta: vec2.create([0.0, -1.0]),
				duration: 300
			};
		break;
		case 'walk east':
			player_character.next_action_ = {
				delta: vec2.create([1.0, 0.0]),
				duration: 300
			};
		break;
		case 'walk west':
			player_character.next_action_ = {
				delta: vec2.create([-1.0, 0.0]),
				duration: 300
			};
		break;
		default:
			player_character.next_action_ = null;

	}
	*/
};

function image_load(uri, callback) {
	var image  = new Image();
	image.onload = function() {
		callback(image);
	};
	image.src = uri;
}

(function main () {
	image_load('images/tileset0.png', function (tileset_image) {
		image_load('images/characters.png', function (characters_image) {
			image_load('images/fog0.png', function (fog_image) {
				area = new AreaRenderer(tileset_image);
				characters = new CharactersRenderer(characters_image);
				// fog = new Fog(fog_image);
				webgl.initialize();
			});
		});
	});
})();

