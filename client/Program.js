var Program = function (program) {
	this.program_ = program;

	this.uniforms_ = {};
	this.attributes_ = {};
	
};

Program.prototype.initializeAttributes = function (attributes, enable) {
	enable = (enable === false)?false:true;
	for (i = 0, l = attributes.length; i < l; i++) {
		var attribute = webgl.locatesAttribute(this.program_, attributes[i]);
		if (enable) {
			gl.enableVertexAttribArray(attribute);
		}
		this.attributes_[attributes[i]] = attribute;
	}
};

Program.prototype.getAttribute = function (name) {
	return this.attributes_[name];
};

Program.prototype.initializeUniforms = function (uniforms) {
	for (i = 0, l = uniforms.length; i < l; i++) {
		this.uniforms_[uniforms[i]] = webgl.locatesUniform(this.program_, uniforms[i]);
	}
};

Program.prototype.getUniform = function (name) {
	return this.uniforms_[name];
};

Program.prototype.use = function () {
	gl.useProgram(this.program_);
};