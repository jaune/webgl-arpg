var __BROWSER__ = __BROWSER__ || false;

if (!__BROWSER__) {
	require('./gl-matrix.js');
}

var Character = function () {
	this.position_ = [0, 0];
	
	// this.position_current_ = this.position_;

	this.next_action_ = null;

	this.action_ = null;
	this.duration_ = -1;
	this.elapsed_cycle_ = 0;
	this.delta_ = null;

	this.initializeAction(Character.ACTION_DEFAULT);
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
//	this.position_current_ = this.position_;
};

Character.prototype.serialize = function () {
	return {
		position : [this.position_[0], this.position_[1]]
	};
};


Character.prototype.computeCurrentPosition = function () {
	var position = vec2.create();
	if (this.duration_ !== -1) {
		vec2.scale(this.delta_, this.elapsed_cycle_ / this.duration_, position);
	}
	vec2.add(this.position_, position);
	vec2.scale(position, 0.001);
	return position;
};

Character.prototype.setNextAction = function (action) {
	this.next_action_ = action;
};


Character.prototype.initializeAction = function (action) {
	this.action_ = action;
	this.elapsed_cycle_ = 0;
	switch (this.action_) {
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
};

Character.prototype.updateAction = function () {
	if ((this.duration_ !== -1) && (this.elapsed_cycle_ >= this.duration_)) {
		this.releaseAction();
		if (this.next_action_ !== null) {
			this.initializeAction(this.next_action_);
		} else {
			this.initializeAction(this.ACTION_DEFAULT);
		}
		return;
	}
	this.elapsed_cycle_++;
};

Character.prototype.step = function () {
	if ((this.duration_ === -1) && (this.next_action_ !== null)) {
		this.initializeAction(this.next_action_);
	} else {
		this.updateAction();
	}
};

if (!__BROWSER__) {
	module.exports = Character;
}