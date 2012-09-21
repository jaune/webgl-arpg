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

	this.va_buffer_ = new VertexAttributeBuffer(VertexAttributeBuffer.USAGE_STREAM_DRAW);
	this.va_buffer_margin_ = 8;
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

	this.va_buffer_.appendAttribute(this.program_.getAttribute('aPosition'), 2);
	this.va_buffer_.appendAttribute(this.program_.getAttribute('aCoordinates'), 2);


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

	this.updateBuffer(real_cycle);

	this.va_buffer_.bind(gl);

	gl.drawArrays(gl.TRIANGLES, 0, l * 6);
};

CharactersRenderer.prototype.updateBuffer = function (real_cycle) {
	var c = this.characters_,
		o = Character.FRAME_SIZE / 2,
		l = c.length,
		tr = Character.FRAME_SIZE / Character.FRAMES_SIZE,
		s = l * 6;
	if (this.va_buffer_.getCapacity() < s) {
		this.va_buffer_.allocate(s + (this.va_buffer_margin_ * 6));
	}
	this.va_buffer_.rewind();
	for (i = 0; i < l; i++) {

		cp = c[i].computeRealPosition(real_cycle);
		x0 = (cp[0] * (Character.FRAME_SIZE * 0.001));
		x1 = x0 + o + o;
		y0 = (cp[1] * (Character.FRAME_SIZE * 0.001));
		y1 = y0 + o + o;

		ti = c[i].computeFrameIndex(real_cycle);
		tx0 = ((ti & 0xF0) >> 4) * tr;
		tx1 = tx0 + tr;
		ty0 = (ti & 0x0F) * tr;
		ty1 = ty0 + tr;
		
		this.va_buffer_.write(
			x1, y1, tx1, ty1,
			x0, y1, tx0, ty1,
			x0, y0, tx0, ty0,
			x0, y0, tx0, ty0,
			x1, y0, tx1, ty0,
			x1, y1, tx1, ty1
		);
	}
};

