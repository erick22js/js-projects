
const CUBE_FACES = {
	"bottom": [
		0, 0, 1,
		0, 0, 0,
		1, 0, 0,
		1, 0, 1,
	],
	"top": [
		1, 1, 0,
		0, 1, 0,
		0, 1, 1,
		1, 1, 1,
	],
	"left": [
		0, 1, 0,
		0, 0, 0,
		0, 0, 1,
		0, 1, 1,
	],
	"right": [
		1, 1, 1,
		1, 0, 1,
		1, 0, 0,
		1, 1, 0,
	],
	"back": [
		1, 1, 0,
		1, 0, 0,
		0, 0, 0,
		0, 1, 0,
	],
	"front": [
		0, 1, 1,
		0, 0, 1,
		1, 0, 1,
		1, 1, 1,
	],
};
const CHUNK_SIZE = [16, 64, 16];

const Chunk = function(){
	var verticesArrays = {};
	this.bufferInfo = null;
	this.blocks = [];
	
	var actInd = 0;
	var chunkIndex = [0, 0, 0];
	var chunkPosition = [0, 0, 0];
	
	var self = this;
	
	this.getBlock = function(x=0, y=0, z=0){
		if(x<0||x>=CHUNK_SIZE[0]||y<0||y>=CHUNK_SIZE[1]||z<0||z>=CHUNK_SIZE[2])
			return [Blocks[0], 0];
		var ind = self.blocks[x*CHUNK_SIZE[2]*CHUNK_SIZE[1]+y*CHUNK_SIZE[2]+z];
		return [Blocks[(ind>>>19)&0b11111111111], ind];
	}
	
	this.updateChunk = function(blocks){
		self.blocks = blocks;
		actInd = 0;
		facesBuilded = 0;
		verticesArrays = {
			a_position:[],
			a_color:[],
			a_uv:[],
			indices:[]
		};
		for(var x=0; x<CHUNK_SIZE[0]; x++)
			for(var y=0; y<CHUNK_SIZE[1]; y++)
				for(var z=0; z<CHUNK_SIZE[2]; z++){
					var block = self.getBlock(x, y, z);
					if(block[1]){
						createCube(block[0], x, y, z, x+chunkPosition[0], y+chunkPosition[1], z+chunkPosition[2]);
					}
		}
		self.bufferInfo = twgl.createBufferInfoFromArrays(gl, verticesArrays);
	}
	this.setPosition = function(x=0, y=0, z=0){
		chunkIndex = [x, y, z];
		chunkPosition = [x*CHUNK_SIZE[0], y*CHUNK_SIZE[1], z*CHUNK_SIZE[2]];
	}
	function createCube(block, ofx=0, ofy=0, ofz=0 , x=0, y=0, z=0){
		if(!self.getBlock(ofx, ofy-1, ofz)[1])
			createFace(CUBE_FACES.bottom, block.textures[Sides.Bottom], 
				x, y, z);
		if(!self.getBlock(ofx, ofy+1, ofz)[1])
			createFace(CUBE_FACES.top, block.textures[Sides.Top], 
				x, y, z);
		if(!self.getBlock(ofx-1, ofy, ofz)[1])
			createFace(CUBE_FACES.left, block.textures[Sides.Left], 
				x, y, z);
		if(!self.getBlock(ofx+1, ofy, ofz)[1])
			createFace(CUBE_FACES.right, block.textures[Sides.Right], 
				x, y, z);
		if(!self.getBlock(ofx, ofy, ofz-1)[1])
			createFace(CUBE_FACES.back, block.textures[Sides.Back], 
				x, y, z);
		if(!self.getBlock(ofx, ofy, ofz+1)[1])
			createFace(CUBE_FACES.front, block.textures[Sides.Front], 
				x, y, z);
	}
	function createFace(face, uv_ind, x=0, y=0, z=0){
		verticesArrays.a_position.push(
			face[0]+x, face[1]+y, face[2]+z,
			face[3]+x, face[4]+y, face[5]+z,
			face[6]+x, face[7]+y, face[8]+z,
			face[9]+x, face[10]+y, face[11]+z,
		);
		verticesArrays.a_color.push(
			1, 1, 1, 1,
			1, 1, 1, 1,
			1, 1, 1, 1,
			1, 1, 1, 1,
		);
		verticesArrays.a_uv.push(
			 uv_ind[0]  , uv_ind[1]  , 0,
			 uv_ind[0]  , uv_ind[1]+1, 0,
			 uv_ind[0]+1, uv_ind[1]+1, 0,
			 uv_ind[0]+1, uv_ind[1]  , 0,
		);
		verticesArrays.indices.push(actInd, actInd+1, actInd+2,   actInd, actInd+2, actInd+3);
		actInd += 4;
	}
}

function generateChunk(x=0, y=0, z=0){
	var chunk = new Chunk();
	chunk.setPosition(x, y, z);
	var terrain = [];
	for(var x=0; x<CHUNK_SIZE[0]; x++)
		for(var y=0; y<CHUNK_SIZE[1]; y++)
			for(var z=0; z<CHUNK_SIZE[2]; z++){
				var block = 0;
				if(y<48)
					block = 1<<19|(1<<30);
				if(y<47)
					block = 2<<19|(1<<30);
				if(y<40)
					block = 3<<19|(1<<30);
				terrain.push(block);
			}
	chunk.updateChunk(terrain);
	return chunk;
}

function renderChunk(chunk){
	
	var globalMatrix = m4.perspective(Math.PI/180*60, 2, .0078125, 128);
	globalMatrix = m4.rotateX(globalMatrix, Transform.rotation[0]);
	globalMatrix = m4.rotateY(globalMatrix, Transform.rotation[1]);
	globalMatrix = m4.rotateZ(globalMatrix, Transform.rotation[2]);
	globalMatrix = m4.translate(globalMatrix, Transform.position);
	
	const uniforms = {
		"globalMatrix": globalMatrix,
		"texture": textures.terrain,
	}
	twgl.setBuffersAndAttributes(gl, programInfo, chunk.bufferInfo);
	twgl.setUniforms(programInfo, uniforms);
	twgl.drawBufferInfo(gl, gl.TRIANGLES, chunk.bufferInfo);
}
