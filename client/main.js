(function () {

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
	renderers = new Renderers(),
	world = new World(),
	inputs = new Inputs(),
	network = new Network(world);

function viewport_matrix_update() {
	var matrix = mat4.create([
		2/viewport_width, 0, 0, 0,
		0, 2/(-viewport_height), 0, 0,
		0, 0, -2, 0,
		-1, 1, -1, 1
	]);
	mat4.translate(matrix, [viewport_offset_x, viewport_offset_y, 0.0]);
//	mat4.scale(matrix, [0.5, 0.5, 0]);
	return matrix;
}
/*
function viewport_apply(program) {
	var uniform = webgl.locatesUniform(program, 'uViewportMatrix');
	gl.viewport(0, 0, viewport_width, viewport_height);
	gl.uniformMatrix4fv(uniform, false, viewport_matrix);
}
*/

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

network.world_.characters_.onSet = function (entity, uuid) {
	characters.append(entity);
};
*/

world.onCharacterSet = function (entity, uuid) {
	characters.append(entity);
};


network.onEnter = function (player) {
	inputs.initialize();
};

inputs.mapping({
	'key 40 pressed' : Character.ACTION_WALK_SOUTH,
	'key 83 pressed' : Character.ACTION_WALK_SOUTH,

	'key 38 pressed' : Character.ACTION_WALK_NORTH,
	'key 87 pressed' : Character.ACTION_WALK_NORTH,

	'key 37 pressed' : Character.ACTION_WALK_WEST,
	'key 65 pressed' : Character.ACTION_WALK_WEST,

	'key 39 pressed' : Character.ACTION_WALK_EAST,
	'key 68 pressed' : Character.ACTION_WALK_EAST,

	'key 40 released' : Character.ACTION_IDLE_SOUTH,
	'key 83 released' : Character.ACTION_IDLE_SOUTH,

	'key 38 released' : Character.ACTION_IDLE_NORTH,
	'key 87 released' : Character.ACTION_IDLE_NORTH,

	'key 37 released' : Character.ACTION_IDLE_WEST,
	'key 65 released' : Character.ACTION_IDLE_WEST,

	'key 39 released' : Character.ACTION_IDLE_EAST,
	'key 68 released' : Character.ACTION_IDLE_EAST,

	'key 32 pressed' : 'attack'
});

inputs.onaction = function (action) {
	if (action === 'attack') {
//		console.debug(network.machine_.computeRealCycle(current_time));
	} else {
		network.pushOrder(action);
	}
};

function image_load(uri, callback) {
	var image  = new Image();
	image.onload = function() {
		callback(image);
	};
	image.src = uri;
}



webgl.onResize = function (width, height) {
	viewport_width = width;
	viewport_height = height;
	
	need_viewport_apply = true;
};

webgl.onInitialize = function (width, height) {
	viewport_width = width;
	viewport_height = height;
	
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.disable(gl.DEPTH_TEST);
	
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	gl.clear(gl.COLOR_BUFFER_BIT);

	need_viewport_apply = true;

//	area.initialize();
//	characters.initialize();
//	fog.initialize();

	renderers.initialize();
	
	network.initialize();

	requestAnimationFrame__(animate);
};

function times_update (time) {
	current_time = time;
	if (last_time === null) {
		elapsed_time =  0;
	} else {
		elapsed_time =  current_time - last_time;
	}
	last_time = current_time;
}

function animate (time) {
	times_update(time);

	var real_cycle = network.computeRealCycle(current_time);
	
	gl.clear(gl.COLOR_BUFFER_BIT);

	if (need_viewport_apply === true) {
		gl.viewport(0, 0, viewport_width, viewport_height);
		viewport_matrix = viewport_matrix_update();
		renderers.applyViewportMatrix(viewport_matrix);
	}
	renderers.render(real_cycle);
	need_viewport_apply = false;
	requestAnimationFrame__(animate);
}



(function main () {

	world.getArea().loadDefault();

	image_load('images/tileset0.png', function (tileset_image) {
		image_load('images/characters.png', function (characters_image) {
//			image_load('images/fog0.png', function (fog_image) {
				


				var area = new AreaRenderer(world.getArea(), tileset_image);
				characters = new CharactersRenderer(characters_image);

				renderers.append(area);
				renderers.append(characters);

				// fog = new Fog(fog_image);
				webgl.initialize();
//			});
		});
	});
})();



})();