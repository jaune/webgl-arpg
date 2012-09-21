var VertexAttributeBuffer = function (usage) {

	this.attributes_ = [];

	this.data_ = null;
	this.usage_ = usage || VertexAttributeBuffer.USAGE_STREAM_DRAW;
	this.stride_ = 0;

	this.element_size_ = 0;

	this.buffer_ = null;

	this.offset_ = 0;

	this.capacity_ = 0;

	this.need_send_data_ = false;
};

VertexAttributeBuffer.USAGE_STREAM_DRAW = 0x1;
VertexAttributeBuffer.USAGE_STATIC_DRAW = 0x2;
VertexAttributeBuffer.USAGE_DYNAMIC_DRAW = 0x3;

VertexAttributeBuffer.prototype.rewind = function () {
	this.offset_ = 0;
};

VertexAttributeBuffer.prototype.seek = function (offset) {
	this.offset_ = offset;
};

VertexAttributeBuffer.prototype.write = function () {
	this.data_.set(arguments, this.offset_);
	this.offset_ += arguments.length;
	if (this.usage_ === VertexAttributeBuffer.USAGE_DYNAMIC_DRAW) {
		this.need_send_data_ = true;
	}
};

VertexAttributeBuffer.prototype.appendAttribute = function (location, size) {
	this.attributes_.push({
		location: location,
		size: size
	});
	this.stride_ += Float32Array.BYTES_PER_ELEMENT * size;
	this.element_size_ += size;
};

VertexAttributeBuffer.prototype.allocate = function (capacity) {
	this.capacity_ = capacity;
	this.data_ = new Float32Array(capacity * this.element_size_);
	this.need_send_data_ = true;
};

VertexAttributeBuffer.prototype.getCapacity = function (capacity) {
	return this.capacity_;
};

VertexAttributeBuffer.prototype.bind = function (gl) {
	if (this.buffer_ === null) {
		this.buffer_ = gl.createBuffer();
	}

	gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer_);
	if ((this.usage_ === VertexAttributeBuffer.USAGE_STATIC_DRAW) && this.need_send_data_) {
		gl.bufferData(gl.ARRAY_BUFFER, this.data_, gl.STATIC_DRAW);
		this.need_send_data_ = false;
	} else if ((this.usage_ === VertexAttributeBuffer.USAGE_DYNAMIC_DRAW) && this.need_send_data_) {
		gl.bufferData(gl.ARRAY_BUFFER, this.data_, gl.DYNAMIC_DRAW);
		this.need_send_data_ = false;
	} else if (this.usage_ === VertexAttributeBuffer.USAGE_STREAM_DRAW) {
		gl.bufferData(gl.ARRAY_BUFFER, this.data_, gl.STREAM_DRAW);
	}

	for (var a = this.attributes_, l = a.length, i = 0, offset = 0; i < l; i++) {
		gl.vertexAttribPointer(a[i].location, 2, gl.FLOAT, false, this.stride_, offset);
		offset += a[i].size * Float32Array.BYTES_PER_ELEMENT;
	}
};
