var gl = null,
	webgl = null;

var WebGL = function () {
	var self = this;

	this.canvas_ = new Canvas();
	this.canvas_.oninitialize = function (element) {
		self.doInitialize(element);
	};

	this.canvas_.onresize = function (width, height) {
		self.onresize(width, height);
	};

	this.canvas_.onrender = function (time) {
		self.onrender(time);
	};
	
	this.oninitialize = function () {};
	this.onresize = function () {};
	this.onrender = function () {};
};

WebGL.prototype.initialize = function() {
	this.canvas_.initialize();
};

WebGL.prototype.doInitialize = function (canvas) {
	var context = null;
	try {
		context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
	} catch(e) {
	}
	if (!context) {
		throw new Error('Unable to initialize the webgl context.');
	}
	gl = context;
	this.oninitialize(canvas.width, canvas.height);
	this.canvas_.render();
};

WebGL.prototype.createShaderFromId = function (id) {
	var shader = null,
		script = document.getElementById(id);
	if (!script) {
		throw new Error('Missing element `#'+id+'`.');
	}

	switch (script.type) {
		case 'x-shader/x-fragment':
			shader = gl.createShader(gl.FRAGMENT_SHADER);
		break;
		case 'x-shader/x-vertex':
			shader = gl.createShader(gl.VERTEX_SHADER);
		break;
		default:
			throw new Error('Invalid shader type.');
	}

	gl.shaderSource(shader, script.text);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		throw new Error('Shader compile: '+gl.getShaderInfoLog(shader));
	}
	return shader;
};

WebGL.prototype.createProgramFromIds = function (fs_id, vs_id) {
	var program = gl.createProgram(),
		fs = this.createShaderFromId(fs_id),
		vs = this.createShaderFromId(vs_id);
	
	gl.attachShader(program, fs);
	gl.attachShader(program, vs);
	gl.linkProgram(program);

	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		throw new Error("Unable to initialize the shader program.");
	}
	return program;
};

WebGL.prototype.locatesAttribute = function (program, name) {
	var attribute = gl.getAttribLocation(program, name);
	if (attribute === null) {
		throw new Error('Missing attribute `'+name+'` location.');
	}
	return attribute;
};

WebGL.prototype.locatesUniform = function (program, name) {
	var uniform = gl.getUniformLocation(program, name);
	if (uniform === null) {
		throw new Error('Missing uniform `'+name+'` location.');
	}
	return uniform;
};

webgl = new WebGL();