var __BROWSER__ = __BROWSER__ || false;

if (!__BROWSER__) {
	require('./gl-matrix.js');
}

var Character = function () {
	this.position_ = vec2.create();

	
	this.next_action_ = null;
	this.cycle_ = null;


	this.action_ = null;
	this.duration_ = null;

	fiox = Math.floor(Math.random() * 5) * 3;
	fioy = Math.floor(Math.random() * 4) * 4;
	this.frame_index_offset_ = fiox << 4 | fioy;
	
	
	this.delta_ = vec2.create();
	this.delta_length_ = 0;
	this.real_position_ = vec2.create();
	this.final_position_ = vec2.create();

	// this.initializeAction(null, -1);
};

Character.ACTION_IDLE_SOUTH = 0x00;
Character.ACTION_IDLE_WEST = 0x01;
Character.ACTION_IDLE_EAST = 0x02;
Character.ACTION_IDLE_NORTH = 0x03;

Character.ACTION_WALK_SOUTH = 0x10;
Character.ACTION_WALK_WEST = 0x11;
Character.ACTION_WALK_EAST = 0x12;
Character.ACTION_WALK_NORTH = 0x13;

Character.ACTION_IDLE_MASK = 0x0F;

Character.FRAME_SIZE = 32;
Character.FRAME_INDEX_LIMIT = 256;
Character.FRAMES_SIZE = 512;

Character.ACTION_DEFAULT = Character.ACTION_IDLE_SOUTH;

Character.FRAMES = [];

Character.FRAMES[Character.ACTION_IDLE_SOUTH] = [0x10];
Character.FRAMES[Character.ACTION_IDLE_WEST] = [0x11];
Character.FRAMES[Character.ACTION_IDLE_EAST] = [0x12];
Character.FRAMES[Character.ACTION_IDLE_NORTH] = [0x13];


Character.FRAMES[Character.ACTION_WALK_SOUTH] = [0x00, 0x20];
Character.FRAMES[Character.ACTION_WALK_WEST] = [0x01, 0x21];
Character.FRAMES[Character.ACTION_WALK_EAST] = [0x02, 0x22];
Character.FRAMES[Character.ACTION_WALK_NORTH] = [0x03, 0x23];


Character.prototype.unserialize = function (serial) {
	this.position_ = serial.position;
	this.next_action_ = serial.next_action;
	this.action_ = serial.action;
	this.duration_ = serial.duration;
	this.cycle_ = serial.cycle;
	this.delta_ = serial.delta;
	this.frame_index_offset_ = serial.frame_index_offset;
};

Character.prototype.serialize = function () {
	return {
		position: [this.position_[0], this.position_[1]],
		next_action: this.next_action_,
		action: this.action_,
		duration: this.duration_,
		cycle: this.cycle_,
		delta: this.delta_,
		frame_index_offset: this.frame_index_offset_
	};
};


Character.prototype.computeRealPosition = function (real_cycle) {
	if (this.delta_length_ !== 0) {
		vec2.lerp(this.position_, this.final_position_, (real_cycle - this.cycle_)  / this.duration_, this.real_position_);
	} else {
		vec2.set(this.position_, this.real_position_);
	}
	return this.real_position_;
};

Character.prototype.computeFrameIndex = function (real_cycle) {
	var delta = (real_cycle - this.cycle_)  / this.duration_,
		frames = Character.FRAMES[this.action_],
		i = Math.floor(delta * frames.length) % frames.length;

	return frames[i] + this.frame_index_offset_;
};

Character.prototype.setNextAction = function (action) {
	this.next_action_ = action;
};




Character.prototype.step = function (world) {
	var current_cycle = world.getCurrentCycle();
	
	if ((current_cycle - this.cycle_) < this.duration_ ||
		((this.duration_ === -1) && (this.next_action_ == this.action_))) {
		return;
	}

	this.commitAction();

	this.cycle_ = current_cycle;

	this.applyAction(this.next_action_);

	if (this.delta_length_ > 0) {
		if (!world.validateMouvement(this.position_, this.final_position_)) {
			this.applyAction(this.action_ & Character.ACTION_IDLE_MASK);
		}
	}
};

Character.prototype.commitAction = function () {
	switch (this.action_) {
		case Character.ACTION_WALK_SOUTH:
		case Character.ACTION_WALK_NORTH:
		case Character.ACTION_WALK_WEST:
		case Character.ACTION_WALK_EAST:
			vec2.add(this.delta_, this.position_);
		break;
	}
};

Character.prototype.applyAction = function (action) {
	this.action_ = action;
	switch (this.action_) {
		case Character.ACTION_WALK_SOUTH:
			this.duration_ = 10;
			this.delta_[0] = 0;
			this.delta_[1] = 1000;
		break;
		case Character.ACTION_WALK_NORTH:
			this.duration_ = 10;
			this.delta_[0] = 0;
			this.delta_[1] = -1000;
		break;
		case Character.ACTION_WALK_WEST:
			this.duration_ = 10;
			this.delta_[0] = -1000;
			this.delta_[1] = 0;
		break;
		case Character.ACTION_WALK_EAST:
			this.duration_ = 10;
			this.delta_[0] = 1000;
			this.delta_[1] = 0;
		break;
		case Character.ACTION_IDLE_SOUTH:
		case Character.ACTION_IDLE_NORTH:
		case Character.ACTION_IDLE_WEST:
		case Character.ACTION_IDLE_EAST:
			this.duration_ = -1;
			this.delta_[0] = 0;
			this.delta_[1] = 0;
		break;
	}
	this.delta_length_ = vec2.length(this.delta_);
	vec2.add(this.position_, this.delta_, this.final_position_);
};


if (!__BROWSER__) {
	module.exports = Character;
}