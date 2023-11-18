const ctx = tela.getContext("2d");
const width = Number(tela.width);
const height = Number(tela.height);

/*
	Working Functions
*/
var proto_app = {
	"start": function(){},
	"update": function(){},
};

function setup(){
	proto_app["start"]();
}

function process(dt){
	proto_app["update"](dt);
}

/*
	Some Util Math Functions
*/

/*
	Renderization Functions
*/
function renderScene(dt, objs=renderobjs){
	for(var i=0; i<objs.length; i++){
		var obj = objs[i];
		var w = obj["wide"];
		
		if(!obj["visible"]){
			continue;
		}
		
		ctx.save();
		ctx.translate(obj["position"][0], obj["position"][1]);
		ctx.rotate(obj["rotation"]);
		
		switch(obj["type"]){
			case OBJ_RECT:{
				if(obj["outline"]){
					ctx.lineWidth = w;
					ctx.strokeStyle = obj["outline"];
					ctx.strokeRect(obj["offset"][0], obj["offset"][1], obj["size"][0], obj["size"][1]);
				}
				if(obj["fill"]){
					ctx.fillStyle = obj["fill"];
					ctx.fillRect(obj["offset"][0], obj["offset"][1], obj["size"][0], obj["size"][1]);
				}
			}
			break;
		}
		
		if(obj["children"].length){
			renderScene(dt, obj["children"]);
		}
		
		ctx.restore();
	}
}

function clearScreen(color){
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, width, height);
}

/*
	Renderization Data
	and Auxiliar Functions
*/
var renderobjs = [];

const OBJ_RECT = 0x01;

function rdrAddRect(fill=null, outline=null, x=0, y=0, w=20, h=20, ofx=0, ofy=0, wide=2){
	var obj = {
		"type": OBJ_RECT,
		"visible": true,
		"fill": fill,
		"outline": outline,
		"wide": wide,
		"position": [x, y],
		"rotation": 0,
		"offset": [ofx, ofy],
		"size": [w, h],
		"children": [],
	}
	
	/* Adding some collision detection function */
	obj.col_rect = function(oobj, col={}){
		var llsx = this["position"][0]+this["offset"][0];
		var lrsx = llsx+this["size"][0];
		var llox = oobj["position"][0]+oobj["offset"][0];
		var lrox = llox+oobj["size"][0];
		var ltsy = this["position"][1]+this["offset"][1];
		var lbsy = ltsy+this["size"][1];
		var ltoy = oobj["position"][1]+oobj["offset"][1];
		var lboy = ltoy+oobj["size"][1];
		var testt = (ltsy>=ltoy)&&(ltsy<=lboy);
		var testb = (lbsy>=ltoy)&&(lbsy<=lboy);
		var testl = (llsx>=llox)&&(llsx<=lrox);
		var testr = (lrsx>=llox)&&(lrsx<=lrox);
		col.top = testt?lboy-ltsy:0;
		col.bottom = testb?lbsy-ltoy:0;
		col.left = testl?lrox-llsx:0;
		col.right = testr?lrsx-llox:0;
		col.has = (col.top||col.bottom)&&(col.left||col.right);
		return col;
	}
	
	renderobjs.push(obj);
	return obj;
}


/*
	Functions Browser-Interaction
*/
var _running = 60*100;//false;
var _ltime = 0;

function _Animate(time){
	var dt = (time-_ltime)/1000;
	_ltime = time;
	dt = 1/60;
	process(dt);
	renderScene(dt);
	if(_running){
		_running--;
		setTimeout(_Animate, 1/60);
	}
}

window.onload = function(){
	// _running = true;
	setup();
	_Animate(0);
}
