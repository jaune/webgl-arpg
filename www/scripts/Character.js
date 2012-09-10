var Character = function () {
	this.position_ = vec2.create([0.0, 0.0]);
	this.position_current_ = this.position_;
	
	this.elapsed_time_ = 0;

	this.next_action_ = null;
	
	this.action_ = null;

	/*{
		delta: vec2.create([0.0, 1.0]),
		duration: 500
	};*/
};

Character.prototype.computeCurrentPosition = function (scalar) {
	var position = vec2.create();
	vec2.scale(this.action_.delta, scalar, position);
	vec2.add(this.position_, position);
	return position;
};

Character.prototype.update = function (elapsed_time) {
	if (this.action_ !== null ) {
		this.elapsed_time_ += elapsed_time;
		if (this.elapsed_time_ > this.action_.duration) {
			
			this.position_current_ = this.position_ = this.computeCurrentPosition(1.0);

			this.elapsed_time_ -= this.action_.duration;
			this.action_ = this.next_action_;
			if (this.action_) {
				this.update(0);
			} else {
				this.elapsed_time_ = 0;
			}
			return;
		}

		this.position_current_ = this.computeCurrentPosition(this.elapsed_time_ / this.action_.duration);
		return;
	} else if (this.next_action_ !== null) {
		this.elapsed_time_ = 0;
		this.action_ = this.next_action_;
	}
};
