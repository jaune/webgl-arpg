var __BROWSER__ = __BROWSER__ || false;

if (!__BROWSER__) {
	require('./gl-matrix.js');
}

var Character = function () {
	this.position_ = [0, 0];
	
	// this.position_current_ = this.position_;

	this.next_action_ = null;
	this.action_ = null;
	this.duration_ = null;
	this.cycle_ = null;
	this.delta_ = null;
};

Character.ACTION_WALK_NORTH = 'walk north';
Character.ACTION_WALK_SOUTH = 'walk south';
Character.ACTION_WALK_WEST = 'walk west';
Character.ACTION_WALK_EAST = 'walk east';

Character.ACTION_IDLE_NORTH = 'idle north';
Character.ACTION_IDLE_SOUTH = 'idle south';
Character.ACTION_IDLE_WEST = 'idle west';
Character.ACTION_IDLE_EAST = 'idle east';

Character.ACTION_DEFAULT = Character.ACTION_IDLE_SOUTH;


Character.prototype.unserialize = function (serial) {
	this.position_ = serial.position;
	this.next_action_ = serial.next_action;
	this.action_ = serial.action;
	this.duration_ = serial.duration;
	this.cycle_ = serial.cycle;
	this.delta_ = serial.delta;
};

Character.prototype.serialize = function () {
	return {
		position: [this.position_[0], this.position_[1]],
		next_action: this.next_action_,
		action: this.action_,
		duration: this.duration_,
		cycle: this.cycle_,
		delta: this.delta_
	};
};


Character.prototype.computeRealPosition = function (real_cycle) {
	var position = vec2.create();
	if (this.duration_ !== -1) {
		// console.debug((real_cycle - this.cycle_) / this.duration_);


		vec2.scale(this.delta_, (real_cycle - this.cycle_)  / this.duration_, position);
	}
	vec2.add(this.position_, position);
	vec2.scale(position, 0.001);
	return position;
};

Character.prototype.setNextAction = function (action) {
	this.next_action_ = action;
};


Character.prototype.initializeAction = function (action, current_cycle) {
	this.releaseAction();

	var a = action || this.ACTION_DEFAULT;
	
	switch (a) {
		case Character.ACTION_WALK_SOUTH:
			this.duration_ = 10;
			this.delta_ = [0, 1000];
		break;
		case Character.ACTION_WALK_NORTH:
			this.duration_ = 10;
			this.delta_ = [0, -1000];
		break;
		case Character.ACTION_WALK_WEST:
			this.duration_ = 10;
			this.delta_ = [-1000, 0];
		break;
		case Character.ACTION_WALK_EAST:
			this.duration_ = 10;
			this.delta_ = [1000, 0];
		break;
		case Character.ACTION_IDLE_SOUTH:
		case Character.ACTION_IDLE_NORTH:
		case Character.ACTION_IDLE_WEST:
		case Character.ACTION_IDLE_EAST:
			this.duration_ = -1;
			this.delta_ = null;
		break;
	}
	this.cycle_ = current_cycle;
	this.action_ = a;
};

Character.prototype.releaseAction = function () {
	switch (this.action_) {
		case Character.ACTION_WALK_SOUTH:
		case Character.ACTION_WALK_NORTH:
		case Character.ACTION_WALK_WEST:
		case Character.ACTION_WALK_EAST:
			this.position_ = [
				this.position_[0] + this.delta_[0],
				this.position_[1] + this.delta_[1]
			];
		break;
	}
	this.action_ = null;
	this.duration_ = null;
	this.cycle_ = null;
	this.delta_ = null;
};

Character.prototype.step = function (current_cycle) {
	if (this.action_ === null) {
		this.initializeAction(this.next_action_, current_cycle);
		return;
	}
	if ((this.duration_ === -1)) {
		this.initializeAction(this.next_action_, current_cycle);
		return;
	}
	if ((current_cycle - this.cycle_) >= this.duration_) {
		this.initializeAction(this.next_action_, current_cycle);
		return;
	}

};

if (!__BROWSER__) {
	module.exports = Character;
}