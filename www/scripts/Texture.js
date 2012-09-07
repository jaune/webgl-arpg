var Texture = function () {
	this.texture_ = null;
	this.uniform_ = null;
};

Texture.prototype.initializeFromImage = function (program, uniform_name, image) {
	var uniform = gl.getUniformLocation(program, uniform_name);
	if (uniform === null) {
		throw new Error('Missing uniform `'+uniform_name+'` location.');
	}
	this.uniform_ = uniform;

	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.bindTexture(gl.TEXTURE_2D, null);

	this.texture_ = texture;
};


Texture.prototype.initializeFromBuffer = function (program, uniform_name, buffer, width, height) {
	var uniform = gl.getUniformLocation(program, uniform_name);
	if (uniform === null) {
		throw new Error('Missing uniform `'+uniform_name+'` location.');
	}
	this.uniform_ = uniform;

	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, buffer);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.bindTexture(gl.TEXTURE_2D, null);

	this.texture_ = texture;
};

Texture.prototype.bind = function (unit) {
	gl.activeTexture(unit);
	gl.bindTexture(gl.TEXTURE_2D, this.texture_);
	gl.uniform1i(this.uniform_, unit - gl.TEXTURE0);
};