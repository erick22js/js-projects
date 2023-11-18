/*
 * MATH LIBRARY PROTOTYPE FUNCTIONS
 */

const _P_G = 0.005;//6.67408E-11;

Math.distance = function(x1, y1, x2, y2){
	return Math.sqrt(((x2-x1)*(x2-x1))+((y2-y1)*(y2-y1)));
}
Math.scalar = function(x1, y1){
	return Math.sqrt((x1*x1)+(y1*y1));
}

/*
 * MAIN OBJECTS AND SHAPES
 */

const PS_CIRCLE = 0x10;
const PS_RECTANGLE = 0x20;

function p_body() {
	var self = this;
	self.x = 0;
	self.y = 0;
	self.velocity_x = 0;
	self.velocity_y = 0;
	self.acceleration_x = 0;
	self.acceleration_y = 0;
	self.mass = 1;

	self.get_scalarVelocity = function(){
		return Math.scalar(self.velocity_x, self.velocity_y);
	}
	self.get_distance = function(obody){
		return Math.distance(self.x, self.y, obody.x, obody.y);
	}
	self.get_gravityForce = function(obody){
		var d = self.get_distance(obody);
		return (_P_G/*G*/)*((self.mass*obody.mass)/(d*d));
	}
	self.process_motion = function(delta=1){
		self.velocity_x += self.acceleration_x*delta;
		self.velocity_y += self.acceleration_y*delta;
		self.x += self.velocity_x*delta;
		self.y += self.velocity_y*delta;
	}
}

function ps_circle(radius) {
	var self = this;
	p_body.call(this);
	self.pshape = PS_CIRCLE;
	self.radius = radius??10;

	self.collides = function(oshape){
		switch(oshape.pshape){
			case PS_CIRCLE:{
				return Math.distance(self.x, self.y, oshape.x, oshape.y)<(self.radius+oshape.pshape);
			}
			break;
		}
		return false;
	}
	self.update = function(delta=1){
		self.process_motion(delta);
	}
}
