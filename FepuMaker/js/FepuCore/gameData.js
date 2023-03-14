
var dataMap = JSON.parse(localStorage.getItem("map"));

const segs = dataMap.lines;
alert(JSON.stringify(dataMap.lines));
/*
for(var s=0; s<segs.length; s++){
	var arrays = {
		position:[],
		uv:[],
		indices: [
			0, 1, 2,  1, 3, 2,
			2, 3, 4,  3, 5, 4,
			4, 5, 6,  5, 7, 6,
		]
	};
	var v1 = segs[s].v1;
	var v2 = segs[s].v2;
	arrays.position = [
		v1.y, -15, v1.x,
		v2.y, -15, v2.x,
		
		v1.y, -5, v1.x,
		v2.y, -5, v2.x,
		v1.y,  5, v1.x,
		v2.y,  5, v2.x,
		
		v1.y,  15, v1.x,
		v2.y,  15, v2.x,
	];
	arrays.uv = [
		0, 2, 0,
		1, 2, 0,
		
		0, 1, 0,
		1, 1, 0,
		0, 0, 0,
		1, 0, 0,
		
		0, -1, 0,
		1, -1, 0,
	];
	const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
	segs[s].buffer = arrays;
	segs[s].bufferInfo = bufferInfo;
	console.log(gl);
}*/

//Setting manually a bsp tree and components
//Began from index 0
const BspTree = [
	{ //Father node
		isSubsector: false,
		splitter: {v1x:100, v1y:25,  v2x:100, v2y:-25},
		left: null,
		right: null,
	},
	{ //Child node
		isSubsector: true,
		lines: [
			{v1x:0,   v1y:-25, v2x:0,   v2y:75},
			{v1x:0,   v1y:75,  v2x:100, v2y:75},
			{v1x:100, v1y:75,  v2x:100, v2y:25},
			{v1x:100, v1y:25,  v2x:100, v2y:-25, oSide:null},
			{v1x:100, v1y:-25, v2x:0,   v2y:-25},
		],
	},
	{ //Child node
		isSubsector: true,
		lines: [
			{v1x:100, v1y:-25, v2x:150, v2y:-25},
			{v1x:150, v1y:-25, v2x:150, v2y:25},
			{v1x:150, v1y:25,  v2x:100, v2y:25},
			{v1x:100, v1y:25,  v2x:100, v2y:-25, oSide:null},
		],
	},
];

BspTree[0].left = BspTree[1];
BspTree[0].right = BspTree[2];
BspTree[1].lines[3].oSide = BspTree[2];
BspTree[2].lines[3].oSide = BspTree[1];

for(var ni=0; ni<BspTree.length; ni++){
	if(BspTree[ni].isSubsector)
		for(var li=0; li<BspTree[ni].lines.length; li++){
			var line = BspTree[ni].lines[li];
			var arrays = {
				position:[],
				uv:[],
				indices: [
					0, 1, 2,  1, 3, 2,
					2, 3, 4,  3, 5, 4,
					4, 5, 6,  5, 7, 6,
				]
			};
			//var v1 = ;
			//var v2 = segs[s].v2;
			arrays.position = [
				line.v1x, -15, -line.v1y,
				line.v2x, -15, -line.v2y,
				
				line.v1x, -5, -line.v1y,
				line.v2x, -5, -line.v2y,
				line.v1x,  5, -line.v1y,
				line.v2x,  5, -line.v2y,
				
				line.v1x,  15, -line.v1y,
				line.v2x,  15, -line.v2y,
			];
			arrays.uv = [
				0, 2, 0,
				1, 2, 0,
				
				0, 1, 0,
				1, 1, 0,
				0, 0, 0,
				1, 0, 0,
				
				0, -1, 0,
				1, -1, 0,
			];
			const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
			line.buffer = arrays;
			line.bufferInfo = bufferInfo;
			console.log(gl);
		}
}


console.log("Game data setted!");