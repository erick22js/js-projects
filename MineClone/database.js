
const gl = tela.getContext("webgl", {
  premultipliedAlpha: false,  // Ask for non-premultiplied alpha
  alpha: false,
})

var vertices = {
	a_position:[
		-.5,  .5, -4,
		-.5, -.5, -4,
		 .5, -.5, -4,
		 .5,  .5, -4,
	],
	a_color:[
		  1,   0,   0,   1,
		  0,   1,   0,   1,
		  0,   0,   1,   1,
		  1,   1,   0,   1,
	],
	a_uv:[
		  0,   0, 0,
		  0, .25, 0,
		.25, .25, 0,
		.25,   0, 0,
	],
	indices:[0, 1, 2,   0, 2, 3]
};
var programInfo = twgl.createProgramInfo(gl, [Shaders.defaultV, Shaders.defaultF]);
var bufferInfo = twgl.createBufferInfoFromArrays(gl, vertices);

var globalMatrix = m4.perspective(Math.PI/180*60, 2, .0078125, 128);

var textures = twgl.createTextures(gl, {
	"terrain": {"src":"terrain.png", "mag":gl.NEAREST},
});

const Sides = {
	"Bottom": 0,
	"Top": 1,
	"Left": 2,
	"Right": 3,
	"Back": 4,
	"Front": 5,
}
const Blocks = [
	{ //#0- Air
		transparent: true,
	},
	{ //#1- Dirt with grass
		solid: true,
		textures: [[2, 0],[0, 0],[1, 0],[1, 0],[1, 0],[1, 0]],
	},
	{ //#2- Dirt
		solid: true,
		textures: [[2, 0],[2, 0],[2, 0],[2, 0],[2, 0],[2, 0]],
	},
	{ //#3- Stone
		solid: true,
		textures: [[3, 0],[3, 0],[3, 0],[3, 0],[3, 0],[3, 0]],
	},
]