var Characters = function (characters_image) {
	this.program_ = null;

	this.image_ = characters_image;
	this.texture_ = new Texture();

	this.position_attribute_ = null;
	this.coordinates_attribute_ = null;

	this.characters_ = [];
/*
	for (i = 0, l = 1000; i < l; i++) {
		x = Math.random() * 64.0;
		y = Math.random() * 64.0;
		this.characters_.push({
			x : x,
			y : y
		});
	}
*/
	this.attributes_ = null;
};


Characters.prototype.initialize = function () {
	this.program_ = webgl.createProgramFromIds('characters-fs', 'characters-vs');

	this.texture_.initializeFromImage(this.program_, 'uCharacterSampler', this.image_);

	this.initializeAttributes();
};

Characters.prototype.update = function (elapsed_time) {
	var c = this.characters_,
		l = c.length;
	for (i = 0; i < l; i++) {
		c[i].update(elapsed_time);
	}
};

Characters.prototype.render = function (callback) {
	var l = this.characters_.length;
	if (l === 0) {
		return;
	}

	gl.useProgram(this.program_);
	
	callback(this.program_);

	this.texture_.bind(gl.TEXTURE0);

	this.bindAttributes();

	gl.drawArrays(gl.TRIANGLES, 0, l * 6);
};

Characters.prototype.buildAttributes = function () {
	var c = this.characters_,
		o = 32 / 2,
		l = c.length,
		s = 4 * 6,
		t = 32.0/128.0,
		data = new Float32Array(l * s);

	for (i = 0; i < l; i++) {
		x = (c[i].position_current_[0] * 32) + o;
		y = (c[i].position_current_[1] * 32) + o;
		data.set([
			x + o, y + o, t, t,
			x - o, y + o, 0.0, t,
			x - o, y - o, 0.0, 0.0,

			x - o, y - o, 0.0, 0.0,
			x + o, y - o, t, 0.0,
			x + o, y + o, t, t
		], i * s);
	}

	return data;
};

Characters.prototype.initializeAttributes = function () {
	this.position_attribute_ = webgl.locatesAttribute(this.program_, 'aPosition');
	gl.enableVertexAttribArray(this.position_attribute_);

	this.coordinates_attribute_ = webgl.locatesAttribute(this.program_, 'aCoordinates');
	gl.enableVertexAttribArray(this.coordinates_attribute_);

	this.attributes_ = gl.createBuffer();

/*
	var data = this.buildAttributes();

	gl.bindBuffer(gl.ARRAY_BUFFER, this.attributes_);
	gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
*/
};

Characters.prototype.bindAttributes = function () {
	var stride = Float32Array.BYTES_PER_ELEMENT * 4,
		data = this.buildAttributes();


	gl.bindBuffer(gl.ARRAY_BUFFER, this.attributes_);
	gl.bufferData(gl.ARRAY_BUFFER, data, gl.STREAM_DRAW);
	gl.vertexAttribPointer(this.position_attribute_, 2, gl.FLOAT, false, stride, 0);
	gl.vertexAttribPointer(this.coordinates_attribute_, 2, gl.FLOAT, false, stride, 2 * Float32Array.BYTES_PER_ELEMENT);
};

