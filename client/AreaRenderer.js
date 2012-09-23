var AreaRenderer = function (area, tileset_image) {
	this.tileset_size_ = 128;

	if (area.getWidth() !== area.getHeight()) {
		throw new Error('Area Width and Height must be equal.');
	}
	this.area_ = area;

	this.area_texture_ = new Texture();
	this.area_texture_buffer_ = null;

	this.tileset_texture_ = new Texture();
	this.tileset_image_ = tileset_image;

	this.program_ = null;
/*
	this.viewport_matrix_ = null;
	this.need_viewport_matrix_apply_ = false;
*/

	this.va_buffer_ = new VertexAttributeBuffer(VertexAttributeBuffer.USAGE_STATIC_DRAW);
};

AreaRenderer.prototype = Object.create(new Renderer());

AreaRenderer.TILE_SIZE = 32;

AreaRenderer.prototype.initialize = function () {
	this.program_ = webgl.createProgramFromIds('area-fs', 'area-vs');
	this.program_.use();

	this.program_.initializeUniforms([
		'uTilesetSampler',
		'uAreaSampler',
		'uTileSize',
		'uTilesetSize',
		'uAreaSize',
		'uViewportMatrix'
	]);
	
	this.program_.initializeAttributes([
		'aVertexPosition',
		'aTextureCoord'
	]);

	// this.initilizeAttributes();

	this.va_buffer_.appendAttribute(this.program_.getAttribute('aVertexPosition'), 2);
	this.va_buffer_.appendAttribute(this.program_.getAttribute('aTextureCoord'), 2);
	this.va_buffer_.allocate(4);



	var w = this.area_.getWidth() * AreaRenderer.TILE_SIZE,
		h = this.area_.getHeight() * AreaRenderer.TILE_SIZE;

	this.va_buffer_.write(
		w,  h, 1.0, 1.0,
		0.0, h, 0.0, 1.0,
		w, 0.0, 1.0, 0.0,
		0.0,0.0, 0.0, 0.0
	);


	this.tileset_texture_.initializeFromImage(
		this.program_.getUniform('uTilesetSampler'),
		this.tileset_image_
	);
	
//	var size = this.area_size_ / this.tile_size_;
	this.area_texture_.initializeFromBuffer(
		this.program_.getUniform('uAreaSampler'),
		this.area_.getDataBuffer(), this.area_.getWidth(), this.area_.getHeight()
	);

	
	gl.uniform1f(this.program_.getUniform('uTileSize'), AreaRenderer.TILE_SIZE);
	gl.uniform1f(this.program_.getUniform('uTilesetSize'), this.tileset_size_);
	gl.uniform1f(this.program_.getUniform('uAreaSize'), w);

};

/*
AreaRenderer.prototype.applyViewportMatrix = function (matrix) {
	this.viewport_matrix_ = matrix;
	this.need_viewport_matrix_apply_ = true;
};
*/

AreaRenderer.prototype.render = function () {
	this.program_.use();
	
	this.tileset_texture_.bind(gl.TEXTURE0);
	this.area_texture_.bind(gl.TEXTURE1);

	if (this.need_viewport_matrix_apply_) {
		gl.uniformMatrix4fv(this.program_.getUniform('uViewportMatrix'), false, this.viewport_matrix_);
	}

	// this.bindAttributes();
	this.va_buffer_.bind(gl);

	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};



/* ---- */
/*

AreaRenderer.prototype.initilizeTextureBuffer = function () {
	var size = this.area_size_ / this.tile_size_;
	var length = size * size;
	var buffer = new Uint8Array(length * 4);

	for (i = 0, l = length; i < l; i++) {
		buffer.set([3, 0, 0, 0], i * 4);
	}
	
	buffer.set([2, 0, 0, 0], 3 * 4);


	return this.area_texture_buffer_ = buffer;
};
*/

/* ---- */

