
const LAND_Y = 170;

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
}

const MathPhysics = new function(){
	this.interpolationExp = function(valueAct, valueDest, degrade){
		return valueAct+(valueDest-valueAct)*degrade;
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
