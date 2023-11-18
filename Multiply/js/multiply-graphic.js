var MULTIPLY = function(data){
	var width = data.width||720;
	var height = data.height||360;
	//Initialize canvas
	var canvas = data.canvas==null?document.createElement("canvas"):document.getElementById(data.canvas)||document.createElement("canvas");
	canvas.id = document.createElement("canvas"); canvas.width = width; canvas.height = height;
	canvas.style.border = "1px solid black";
	var gl = canvas.getContext("webgl");
	var actProgram = null;
	
	var textureLocation = [
		gl.TEXTURE0,gl.TEXTURE1,gl.TEXTURE2,gl.TEXTURE3,gl.TEXTURE4,gl.TEXTURE5,gl.TEXTURE6,gl.TEXTURE7,
		gl.TEXTURE8,gl.TEXTURE9,gl.TEXTURE10,gl.TEXTURE11,gl.TEXTURE12,gl.TEXTURE13,gl.TEXTURE14,gl.TEXTURE15,
		gl.TEXTURE16,gl.TEXTURE17,gl.TEXTURE18,gl.TEXTURE19,gl.TEXTURE20,gl.TEXTURE21,gl.TEXTURE22,gl.TEXTURE23,gl.TEXTURE24,];
	
	//********************Hidden functions*******************************************************************
	
	
	//********************Export functions********************************************************************
	
		//******Clear color
	function _clearColor(r, g, b, a){
		gl.clearColor(r, g, b, a);
		gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
	}
	this.clearColor = _clearColor;
	
		//******Shader compile
	function createShader(source, type){
		var shader = gl.createShader(type);
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
			console.error("Error on create shader, because:\n"+gl.getShaderInfoLog(shader));
			return null;
		}
		return shader;
	}
	function createProgram(vs, fs, uniformsNames){
		var program = gl.createProgram();
		gl.attachShader(program, vs);
		gl.attachShader(program, fs);
		gl.linkProgram(program);
		if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
			console.error("Error on link program, because:\n"+gl.getProgramInfoLog(program));
			return null;
		}
		gl.validateProgram(program);
		if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)){
			console.error("Error on validate program, because:\n"+gl.getProgramInfoLog(program));
			return null;
		}
		var uniforms = {};
		if(uniformsNames!=null){
			for(var i=0; i<uniformsNames.length; i++){
				var uniform = gl.getUniformLocation(program, uniformsNames[i]);
				if(uniform==null){
					console.warn("Cannot get the uniform with the name '"+uniformsNames[i]+"'.");
					continue;
				}
				uniforms[uniformsNames[i]] = uniform;
			}
		}
		return {
			"program": program,
			"uniforms": uniforms,
		};
	}
	function _createShaderProgram(vertex_source, fragment_source, uniformsNames){
		var vs = createShader(vertex_source, gl.VERTEX_SHADER);
		var fs = createShader(fragment_source, gl.FRAGMENT_SHADER);
		return createProgram(vs, fs, uniformsNames);
	}
	this.createShaderProgram = _createShaderProgram;
	
		//******Generate Mesh
	function _createMesh(vertices, indicesVertices, attributes, ShaderProgram){
		attributesVertices = new Float32Array(vertices);
		var verticesBuffer = gl.createBuffer();
		var indicesBuffer = gl.createBuffer();
		var program = ShaderProgram.program;
		_setMeshVertices(verticesBuffer, attributesVertices);
		var locations = [];
		var fbytes = attributesVertices.BYTES_PER_ELEMENT;
		var atLength = 0;
		var vertexSize = 0;
		for(var a=0; a<attributes.length; a+=2)
			vertexSize += attributes[a+1];
		for(var a=0; a<attributes.length; a+=2){
			var location = gl.getAttribLocation(program, attributes[a]);
			if(location<0){
				atLength += attributes[a+1];
				console.warn("Cannot get the attribute with the name '"+attributes[a]+"'.");
				continue;
			}
			locations.push([attributes[a], attributes[a+1], vertexSize*fbytes, atLength*fbytes]);
			gl.vertexAttribPointer(
				location, attributes[a+1], gl.FLOAT, gl.FALSE, vertexSize*fbytes, atLength*fbytes);
			gl.enableVertexAttribArray(location);
			atLength += attributes[a+1];
			locations.push(location);
		}
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indicesVertices), gl.STATIC_DRAW);
		var mesh = {
			"vertices": vertices,
			"indices": indicesVertices,
			"verticesBuffer": verticesBuffer,
			"verticesData":attributesVertices,
			"indicesBuffer": indicesBuffer,
			"indicesData": new Uint8Array(indicesVertices),
			"shaderProgram": program,
			"locations": locations
		};
		return mesh;
	}
	this.createMesh = _createMesh;
	
	function _setMeshVertices(buffer, data){
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
	}
	this.changeMeshVertices = function(mesh, data){
		_setMeshVertices(mesh.verticesBuffer, new Float32Array(data));
	}
	
		//******Create/Load Texture
	function _createTexture2D(data){
		var texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		if(data.data instanceof Array){
			gl.texImage2D(
				gl.TEXTURE_2D, 0, gl.RGBA, 
				data.width, data.height, 0, gl.RGBA,  
				gl.UNSIGNED_BYTE,
				new Uint8Array(data.data)
			);
		}else{
			gl.texImage2D(
				gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
				gl.UNSIGNED_BYTE,
				data.data
			);
		}
		gl.bindTexture(gl.TEXTURE_2D, null);
		return {
			"texture": texture,
		};
	}
	this.createTexture2D = _createTexture2D;
	
		//******Bind ShaderShader
	function _bindShaderProgram(shaderProgram){
		gl.useProgram(shaderProgram.program);
		actProgram = shaderProgram;
	}
	this.bindShaderProgram = _bindShaderProgram;
	
		//******Bind Texture
	function _bindTexture(texture, index){
		gl.activeTexture(textureLocation[index]);
		gl.bindTexture(gl.TEXTURE_2D, texture.texture);
	}
	this.bindTexture = _bindTexture;
	
		//******Bind Texture to uniform
	function _bindTextureUniform(texture, uniform, index){
		gl.activeTexture(textureLocation[index]);
		gl.bindTexture(gl.TEXTURE_2D, texture.texture);
		_shaderUniformInt(uniform, index);
	}
	this.bindTextureUniform = _bindTextureUniform;
	
		//******Set uniform float
	function _shaderUniformFloat(uniformName, value){gl.uniform1f(actProgram.uniforms[uniformName], value);}this.shaderUniformFloat = _shaderUniformFloat;
	
		//******Set uniform float
	function _shaderUniformInt(uniformName, value){gl.uniform1i(actProgram.uniforms[uniformName], value);}this.shaderUniformInt = _shaderUniformInt;
	
		//******Set uniform vec2
	function _shaderUniformVec2(uniformName, value){gl.uniform2fv(actProgram.uniforms[uniformName], value);}this.shaderUniformVec2 = _shaderUniformVec2;
	
		//******Set uniform vec3
	function _shaderUniformVec3(uniformName, value){gl.uniform3fv(actProgram.uniforms[uniformName], value);}this.shaderUniformVec3 = _shaderUniformVec3;
	
		//******Set uniform vec4
	function _shaderUniformVec4(uniformName, value){gl.uniform4fv(actProgram.uniforms[uniformName], value);}this.shaderUniformVec4 = _shaderUniformVec4;
	
		//******Set uniform mat3
	function _shaderUniformMat3(uniformName, value){gl.uniformMatrix3fv(actProgram.uniforms[uniformName], gl.FALSE, value);}this.shaderUniformMat3 = _shaderUniformMat3;
	
		//******Set uniform mat4
	function _shaderUniformMat4(uniformName, value){gl.uniformMatrix4fv(actProgram.uniforms[uniformName], gl.FALSE, value);}this.shaderUniformMat4 = _shaderUniformMat4;   
	
		//******ENABLES&DISABLES
	//**depth test enable
	function _enableDepthTest(){
		gl.enable(gl.DEPTH_TEST);
	}
	this.enableDepthTest = _enableDepthTest;
	//**depth test disable
	function _disableDepthTest(){
		gl.disable(gl.DEPTH_TEST);
	}
	this.disableDepthTest = _disableDepthTest;
	//**cull face enable
	function _enableCullFace(){
		gl.enable(gl.CULL_FACE);
	}
	this.enableCullFace = _enableCullFace;
	//**cull face disable
	function _disableCullFace(){
		gl.disable(gl.CULL_FACE);
	}
	this.disableCullFace = _disableCullFace;
	
		//******Render Mesh
	function _renderMesh(mesh){
		gl.bindBuffer(gl.ARRAY_BUFFER, mesh.verticesBuffer);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indicesBuffer);
		for(var a=1; a<mesh.locations.length; a+=2){
			gl.vertexAttribPointer(
				mesh.locations[a], mesh.locations[a-1][1], gl.FLOAT, gl.FALSE, mesh.locations[a-1][2], mesh.locations[a-1][3]);
			gl.enableVertexAttribArray(mesh.locations[a]);
		}
		gl.drawElements(gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_BYTE, 0);
		for(var a=1; a<mesh.locations.length; a+=2){
			gl.disableVertexAttribArray(mesh.locations[a]);
		}
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	}
	this.renderMesh = _renderMesh;
	
		//******Get Context
	this.getContext = function(){
		return gl;
	}
	console.log("Multiply core loaded!");
}
