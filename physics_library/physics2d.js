
const LAND_Y = 170;

function Circle(x, y, a, r){
	this.x = x;
	this.y = y;
	this.r = r;
	this.a = a;
	
	var body = this;
	
	//Make phisics!
	this.direction = 0; //Angular motion
	this.speedDir = 0; //Angular speed
	this.gravY = 0; //Actual Gravity speed
	this.acGravY = 0.2; //Increase Gravity speed
	//this.ace = .1;
	//this.aceC = 1;
	
	//Angular moviments (unplemented!)
	this.resiA = 0;
	
	function _applyTorque(angle, force){
		body.direction = angle;
		body.speedDir = force;
		body.gravY *= 0;
	}
	this.applyTorque = _applyTorque;
	
	function _update(deltaTime, world, bodies){
		var colliding = false;
		
		for(var c=0; c<bodies.length; c++){
			var tbody = bodies[c];
			if(tbody!=body){
				var colision = ColisionTest.circleAndCircle(body, tbody);
				if(colision.coliding){
					_applyTorque(-colision.angle-Math.PI*.5, body.gravY);
					//tbody.applyTorque(colision.angle+Math.PI*.5, body.gravY);
				}
			}
		}
		
		var cos = Math.cos(body.direction)*body.speedDir;
		var sen = Math.sin(body.direction)*body.speedDir;
		
		body.x += cos;
		body.y += sen+body.gravY;
		
		body.gravY += body.acGravY;
		body.speedDir -= body.speedDir*.15;//body.acGravY;
		
		if(this.y+this.r >= LAND_Y)
			_applyTorque(-.5*Math.PI, body.speedDir+body.gravY);
		
		//this.aceA = MathPhysics.interpolationExp(
		//	this.aceA, Math.PI*.5, .1);
		
		//Detect colision with other circles
		/*for(var c=0; c<bodies.length; c++){
			var tbody = bodies[c];
			if(tbody!=body){
				var colision = ColisionTest.circleAndCircle(body, tbody);
				if(colision.coliding){
					/*if(colision.angle<Math.PI&&colision.angle>0){
						var newDir = colision.angle+(Math.PI*.5*(colision.angle<Math.PI*.5?1:-1));//colision.massLeft > colision.massRight? Math.PI: 0;
						var power = Math.abs(colision.angle-Math.PI*.5);//colision.massLeft > colision.massRight? colision.massLeft: colision.massRight;
						this.aceC = 4*(power*power);
						//this.a += this.aceC*-.06;
						this.aceA = newDir;
					}
				}
			}
		}
		
		//Detect colision with land, test for move
		if(this.y+this.r >= LAND_Y){
			_applyTorque(-.5*Math.PI, .1);
		}/*else{
			//Make object fall
		var sin = Math.sin(this.aceA);
		var cos = Math.cos(this.aceA);
		this.x += cos*this.aceC;
		this.y += sin*this.aceC;
		this.aceC += this.ace*world.gravity;*/
		//}
	}
	this.update = _update;
}

function Box(x, y, w, h, a, px, py){
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.a = a;
	this.px = px;
	this.py = py;
	
	var body = this;
	
	//Make phisics!
	this.aceA = Math.PI*.5;
	this.ace = .1;
	this.aceC = 1;
	
	//Angular moviments (unplemented!)
	this.resiA = 0;
	
	
	function _update(deltaTime, world, bodies){
		var colliding = false;
		this.aceA = MathPhysics.interpolationExp(
			this.aceA, Math.PI*.5, .1);
		
		//Detect colision with other cubes
		for(var c=0; c<bodies.length; c++){
			var tbody = bodies[c];
			if(tbody!=body){
				var colision = ColisionTest.cubeAndCube(body, tbody);
				if(colision.coliding){
					if(colision.fromDown){
						var newDir = colision.massLeft > colision.massRight? Math.PI: 0;
						var power = colision.massLeft > colision.massRight? colision.massLeft: colision.massRight;
						this.aceC = 0.275*(power*power);
						this.aceA = newDir;
					}
				}
			}
		}
		
		//Detect colision with land, test for move
		if(this.y+this.h-this.py >= LAND_Y){
			this.y = LAND_Y-this.h+this.py;
			this.aceC = 1;
		}else{
			//Make object fall
			var sin = Math.sin(this.aceA);
			var cos = Math.cos(this.aceA);
			this.x += cos*this.aceC;
			this.y += sin*this.aceC;
			this.aceC += this.ace*world.gravity;
		}
	}
	this.update = _update;
}

const ColisionTest = new function(){
	//The main pointer is the first body
	this.cubeAndCube = function(cube1, cube2){
		var testx1 = (cube1.x > cube2.x) && (cube1.x < cube2.x+cube2.w);
		var testx2 = (cube2.x > cube1.x) && (cube2.x < cube1.x+cube1.w);
		var testy1 = (cube1.y > cube2.y) && (cube1.y < cube2.y+cube2.h);
		var testy2 = (cube2.y > cube1.y) && (cube2.y < cube1.y+cube1.h);
		var isColliding = (testx1||testx2)&&(testy1||testy2);
		var colisionData = {
			coliding: isColliding,
			fromUp: (testy1),
			fromDown: (testy2),
			massLeft: (cube2.x-cube1.x)/cube1.px,
			massRight: ((cube1.x+cube1.w)-(cube2.x+cube2.w))/(cube1.w-cube1.px),
		}
		return colisionData;
	}
	this.circleAndCircle = function(circle1, circle2){
		var dist = MathPhysics.distance(circle1, circle2);
		var ang = MathPhysics.angle(circle1, circle2);
		return {
			coliding: (dist <= circle1.r+circle2.r),
			distance: dist,
			angle: ang
		};
	}
}

const MathPhysics = new function(){
	this.interpolationExp = function(valueAct, valueDest, degrade){
		return valueAct+(valueDest-valueAct)*degrade;
	}
	this.distance = function(p1, p2){
		return Math.sqrt((p2.x-p1.x)*(p2.x-p1.x)+(p2.y-p1.y)*(p2.y-p1.y));
	}
	this.angle = function(p1, p2){
		return Math.atan2((p2.y-p1.y), (p2.x-p1.x));
	}
}

function World(properties){
	//gravity is acceleration per time
	this.gravity = properties.gravity||1;
	var bodies = [];
	var world = this;
	function _addBody(body){
		bodies.push(body);
	}
	function _removeBody(body){
		for(var i=0; i<bodies.length; i++){
			if(bodies[i]==body){
				bodies.splice(i,1);
				return;
			}
		}
	}
	function _update(deltaTime, callback){
		callback = callback||(function(){});
		for(var i=0; i<bodies.length; i++){
			bodies[i].update(deltaTime, world, bodies);
			callback(bodies[i]);
		}
	}
	
	this.addBody = _addBody;
	this.removeBody = _removeBody;
	this.update = _update;
}