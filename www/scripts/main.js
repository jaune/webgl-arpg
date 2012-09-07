var	current_time = 0,
	elapsed_time = 0,
	last_time = 0,
	viewport_width = 0,
	viewport_height = 0,
	viewport_matrix = null,
	viewport_offset_x = 200,
	viewport_offset_y = 200,
	area = null,
	characters = null,
	inputs = new Inputs(),
	player_character = null;

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

function viewport_apply(program) {
	var uniform = webgl.locatesUniform(program, 'uViewportMatrix');
	gl.viewport(0, 0, viewport_width, viewport_height);
	gl.uniformMatrix4fv(uniform, false, viewport_matrix);
}

webgl.onrender = function (time) {
	// console.time('render');

	current_time = time;
	elapsed_time = current_time - last_time;
	
	gl.clear(gl.COLOR_BUFFER_BIT);

	if (need_viewport_apply === true) {
		viewport_matrix = viewport_matrix_update();
	}

	area.render(function (program) {
		if (need_viewport_apply === true) {
			viewport_apply(program);
		}
	});

	characters.render(function (program) {
		if (need_viewport_apply === true) {
			viewport_apply(program);
		}
	});

	need_viewport_apply = false;

	// console.timeEnd('render');
};

webgl.onresize = function (width, height) {
	need_viewport_apply = true;
	viewport_width = width;
	viewport_height = height;
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

	inputs.initialize();

	player_character = characters.create(0.0, 0.0);
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
	switch (action) {
		case 'walk south':
		break;
		case 'walk south':
		break;
		default:

	}
	console.debug(action);
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
		image_load('images/characters0.png', function (characters_image) {
			area = new Area(tileset_image);
			characters = new Characters(characters_image);
			webgl.initialize();
		});
	});
})();

