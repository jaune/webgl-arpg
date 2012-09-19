var CharactersRenderer = function (characters_image) {
	this.program_ = null;

	this.image_ = characters_image;
	this.texture_ = new Texture();

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

	this.viewport_matrix_ = null;
	this.need_viewport_matrix_apply_ = false;

	this.attributes_ = null;
};





CharactersRenderer.prototype.contains = function (character) {
	return this.characters_.indexOf(character) > 0;
};

CharactersRenderer.prototype.append = function (character) {
	this.characters_.push(character);
};

CharactersRenderer.prototype.remove = function (character) {
	var index = this.characters_.indexOf(character),
		last = this.characters_.pop();
	if (index > 0 && index < this.characters_.length ) {
		this.characters_[index] = last;
	}
};

CharactersRenderer.prototype.initialize = function () {
	this.program_ = webgl.createProgramFromIds('characters-fs', 'characters-vs');
	this.program_.use();

	this.program_.initializeUniforms([
		'uCharacterSampler',
		'uViewportMatrix'
	]);
	this.program_.initializeAttributes([
		'aPosition',
		'aCoordinates'
	]);

	this.texture_.initializeFromImage(this.program_.getUniform('uCharacterSampler'), this.image_);


	this.initializeAttributes();
};

/*
CharactersRenderer.prototype.update = function (elapsed_time) {
	var c = this.characters_,
		l = c.length;
	for (i = 0; i < l; i++) {
		c[i].update(elapsed_time);
	}
};
*/

CharactersRenderer.prototype.applyViewportMatrix = function (matrix) {
	this.viewport_matrix_ = matrix;
	this.need_viewport_matrix_apply_ = true;
};

CharactersRenderer.prototype.render = function (real_cycle) {
	var l = this.characters_.length;
	if (l === 0) {
		return;
	}

	this.program_.use();
	
	this.texture_.bind(gl.TEXTURE0);

	if (this.need_viewport_matrix_apply_) {
		gl.uniformMatrix4fv(this.program_.getUniform('uViewportMatrix'), false, this.viewport_matrix_);
	}

	this.bindAttributes(real_cycle);

	gl.drawArrays(gl.TRIANGLES, 0, l * 6);
};

CharactersRenderer.prototype.buildAttributes = function (real_cycle) {
	var c = this.characters_,
		o = 32 / 2,
		l = c.length,
		s = 4 * 6,
		t = 32.0/512.0,
		data = new Float32Array(l * s);

	for (i = 0; i < l; i++) {
		cp = c[i].computeRealPosition(real_cycle);
		x = (cp[0] * 32) + o;
		y = (cp[1] * 32) + o;

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

CharactersRenderer.prototype.initializeAttributes = function () {
	this.attributes_ = gl.createBuffer();
};

CharactersRenderer.prototype.bindAttributes = function (real_cycle) {
	var stride = Float32Array.BYTES_PER_ELEMENT * 4,
		data = this.buildAttributes(real_cycle);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.attributes_);
	gl.bufferData(gl.ARRAY_BUFFER, data, gl.STREAM_DRAW);

	gl.vertexAttribPointer(this.program_.getAttribute('aPosition'), 2, gl.FLOAT, false, stride, 0);
	gl.vertexAttribPointer(this.program_.getAttribute('aCoordinates'), 2, gl.FLOAT, false, stride, 2 * Float32Array.BYTES_PER_ELEMENT);
};

