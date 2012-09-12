var Fog = function (fog_image) {
	this.program_ = null;

	this.image_ = fog_image;
	this.texture_ = new Texture();

	this.position_attribute_ = null;
	this.coordinates_attribute_ = null;

	this.attributes_ = null;
};


Fog.prototype.initialize = function () {
	this.program_ = webgl.createProgramFromIds('fog-fs', 'fog-vs');

	this.texture_.initializeFromImage(this.program_, 'uSampler', this.image_);

	this.initializeAttributes();
};

Fog.prototype.render = function (callback) {
	gl.useProgram(this.program_);
	
	callback(this.program_);

	this.texture_.bind(gl.TEXTURE0);

	this.bindAttributes();

	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};

Fog.prototype.initializeAttributes = function () {
	this.position_attribute_ = webgl.locatesAttribute(this.program_, 'aPosition');
	gl.enableVertexAttribArray(this.position_attribute_);

	this.coordinates_attribute_ = webgl.locatesAttribute(this.program_, 'aCoordinates');
	gl.enableVertexAttribArray(this.coordinates_attribute_);

	this.attributes_ = gl.createBuffer();

	var w = 400.0,
		h = 400.0,
		x = 0.0,
		y = 0.0,
		data = [
			w + x,  h + y, 1.0, 1.0,
			x, h + y, 0.0, 1.0,
			w + x, y, 1.0, 0.0,
			x,y, 0.0, 0.0
		];

	gl.bindBuffer(gl.ARRAY_BUFFER, this.attributes_);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

};

Fog.prototype.bindAttributes = function () {
	var stride = Float32Array.BYTES_PER_ELEMENT * 4;

	gl.bindBuffer(gl.ARRAY_BUFFER, this.attributes_);
	gl.vertexAttribPointer(this.position_attribute_, 2, gl.FLOAT, false, stride, 0);
	gl.vertexAttribPointer(this.coordinates_attribute_, 2, gl.FLOAT, false, stride, 2 * Float32Array.BYTES_PER_ELEMENT);
};

