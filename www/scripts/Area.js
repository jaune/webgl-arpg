var Area = function (tileset_image) {
	this.tile_size_ = 32;
	this.tile_size_uniform_ = null;
	
	this.tileset_size_ = 128;
	this.tileset_size_uniform_ = null;
	
	this.area_size_ = 64 * this.tile_size_;
	this.area_size_uniform_ = null;

	this.area_texture_ = new Texture();
	this.area_texture_buffer_ = null;

	this.tileset_texture_ = new Texture();
	this.tileset_image_ = tileset_image;

	this.vertices_attribute_ = null;
	this.coordinates_attribute_ = null;
	this.attributes_ = null;

	this.program_ = null;
};

Area.prototype.initialize = function () {
	this.program_ = webgl.createProgramFromIds('area-fs', 'area-vs');
	
	this.initilizeTextureBuffer();
	this.initilizeAttributes();
	
	this.tileset_texture_.initializeFromImage(
		this.program_, 'uTilesetSampler',
		this.tileset_image_
	);
	
	var size = this.area_size_ / this.tile_size_;
	this.area_texture_.initializeFromBuffer(
		this.program_, 'uAreaSampler',
		this.area_texture_buffer_, size, size
	);

	this.tile_size_uniform_ = gl.getUniformLocation(this.program_, 'uTileSize');
	this.tileset_size_uniform_ = gl.getUniformLocation(this.program_, 'uTilesetSize');
	this.area_size_uniform_ = gl.getUniformLocation(this.program_, 'uAreaSize');

	gl.useProgram(this.program_);
	gl.uniform1f(this.tile_size_uniform_, this.tile_size_);
	gl.uniform1f(this.tileset_size_uniform_, this.tileset_size_);
	gl.uniform1f(this.area_size_uniform_, this.area_size_);

};


Area.prototype.render = function (callback) {
	gl.useProgram(this.program_);
	
	this.tileset_texture_.bind(gl.TEXTURE0);
	this.area_texture_.bind(gl.TEXTURE1);
	this.bindAttributes();

	callback(this.program_);
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};


/* ---- */


Area.prototype.initilizeTextureBuffer = function () {
	var size = this.area_size_ / this.tile_size_;
	var length = size * size;
	var buffer = new Uint8Array(length * 4);

	for (i = 0, l = length; i < l; i++) {
		buffer.set([3, 0, 0, 0], i * 4);
	}


	// buffer.set([3, 0, 0, 0], 0);

	return this.area_texture_buffer_ = buffer;
};

/* ---- */


Area.prototype.initilizeAttributes = function () {
	var w = this.area_size_,
		h = this.area_size_,
		data = [
			w,  h, 1.0, 1.0,
			0.0, h, 0.0, 1.0,
			w, 0.0, 1.0, 0.0,
			0.0,0.0, 0.0, 0.0
		];
	
	this.vertices_attribute_ = webgl.locatesAttribute(this.program_, 'aVertexPosition');
	gl.enableVertexAttribArray(this.vertices_attribute_);

	this.coordinates_attribute_ = webgl.locatesAttribute(this.program_, 'aTextureCoord');
	gl.enableVertexAttribArray(this.coordinates_attribute_);

	var buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
	this.attributes_ = buffer;
};

Area.prototype.bindAttributes = function () {
	var stride = Float32Array.BYTES_PER_ELEMENT * 4;

	gl.bindBuffer(gl.ARRAY_BUFFER, this.attributes_);
	gl.vertexAttribPointer(this.vertices_attribute_, 2, gl.FLOAT, false, stride, 0);
	gl.vertexAttribPointer(this.coordinates_attribute_, 2, gl.FLOAT, false, stride, 2 * Float32Array.BYTES_PER_ELEMENT);
};
