/*
 * @ Motor personalizado de rasterização produzido por Erick Santos (geick22)
 *   Com finalidades unicamente educacional, entretando, sinta-se livre a gerar 
 *   otimizações e criar seu próprio motor personalizado por cima, apesar de talvez não 
 *   lhe oferecer qualquer vantagem sobre a API WebGL.
 */
 
 /*
  *  MORE é uma biblioteca personalizada, seu nome vem do inglês e significa
  *  "My Own Raster Engine" - Meu Próprio Motor de Rasterização
  *  Em inglês fica mais bonito.
  */

function MORE(canvas){
	//Variáveis com propriedades
	var gl = canvas.getContext("2d"); //"gl" fica charmoso e rápido
	var width = Number(canvas.width);
	var height = Number(canvas.height);
	
	//Buffers para realizar o desenho na tela
	var buffer_color = null;
	var buffer_depth = [];
	this.export_depth = buffer_depth;
	
	//Propriedades para o programa definido
	var attribs = {};
	var uniforms = {};
	
	//Programas para serem executados
	var vertex_program = null;
	var fragment_program = null;
	
	//Array constante que servirá para testar posições dos vértices
	var testArray = [
		[0, 1, 2],
		[0, 2, 1],
		[1, 0, 2],
		[1, 2, 0],
		[2, 0, 1],
		[2, 1, 0],
	];
	var div256 = 1/256;
	
	//Redefine os buffers com base na tela cedida
	{
		buffer_color = gl.getImageData(0, 0, width, height);
		for(var i=0; i<width*height; i++){
			buffer_depth.push(0);
		}
	}
	
	//Define um atributo para o programa
	this.setAttribute = function(name, buffer, attribSize){
		var attributes = [];
		if(attribSize<=0)
			throw new Error("AttribSize invalid");
		for(var i=0; i<buffer.length; i+=attribSize){
			var attrib = [];
			for(var at=0; at<attribSize; at++)
				attrib.push(buffer[i+at]);
			attributes.push(attrib);
		}
		attribs[name] = attributes;
	}
	
	//Define uma propriedade uniforme para o programa
	this.setUniform = function(name, value){
		if(name==null)
			throw new Error("Uniform name invalid!");
		uniforms[name] = value;
	}
	
	//Define um novo programa com base nas funções de execução
	//cedidas, no caso, um para cada vértice, outro para cada pixel
	this.setProgram = function(perVertex, perPixel){
		if(!perVertex||!perPixel)
			throw new Error("Programa inválido! É requerido duas função para o sombreador");
		vertex_program = perVertex;
		fragment_program = perPixel;
		attribs = {};
		uniforms = {};
	}
	
	//Obtém uma textura de uma imagem carregada (ou canvas)
	this.buildTexture = function(image){
		var canvas = document.createElement("canvas");
		canvas.width = image.width;
		canvas.height = image.height;
		var c = canvas.getContext("2d");
		c.drawImage(image, 0, 0);
		var data = c.getImageData(0, 0, canvas.width, canvas.height);
		data.wid = Number(image.width);
		data.heig = Number(image.height);
		return data;
	}
	//Obtém
	this.texture2D = function(texture, uv){
		solveUv(uv);
		var nuv = [uv[0]*texture.wid, uv[1]*texture.heig];
		var pu = nuv[0]-~~(nuv[0]);
		var pv = nuv[1]-~~(nuv[1]);
		var p1 = ((~~nuv[0])*4+(~~nuv[1])*texture.wid*4);
		var p2 = ((~~nuv[0]+1)*4+(~~nuv[1]+1)*texture.wid*4);
		var cl1 = [texture.data[p1]*div256, texture.data[p1+1]*div256, texture.data[p1+2]*div256, texture.data[p1+3]*div256];
		var cl2 = [texture.data[p2]*div256, texture.data[p2+1]*div256, texture.data[p2+2]*div256, texture.data[p2+3]*div256];
		return cl1;//[cl1[0]*(1-p1)+cl2[0]*p1, cl1[1]*(1-p1)+cl2[1]*p1, cl1[2]*(1-p1)+cl2[2]*p1, cl1[3]*(1-p1)+cl2[3]*p1];//texture.data[p+3]*div256];
	}
	function solveUv(uv){
		uv[0] = uv[0]<0?1-uv[0]:uv[0];
		uv[1] = uv[1]<0?1-uv[1]:uv[1];
	}
	
	//Desenha um triangulo na tela
	this.drawTriangle = function(){
		if(!vertex_program||!fragment_program)
			throw new Error("Não é possível rasterizar sem especificar um programa de rasterização");
		var positions = [];
		for(var i=0; i<3; i++){
			var atts = {};
			for(var a in attribs){
				atts[a] = attribs[a][i];
			}
			var position = vertex_program(JSON.parse(JSON.stringify(atts)), JSON.parse(JSON.stringify(uniforms)));
			position[0] *= width;//(position[0]+1)*.5 * width;
			position[1] *= height;//(position[1]*.5+.5) * height;//(position[1]+1)*.5 * height;
			positions.push(position);
		}
		if(!positions[0])
			throw new Error("Deve-se retornar um array como vetor para definir as posições!");
		if(positions[0].length!=3)
			throw new Error("As posições precisam conter 3 dimensões!");
		raster(positions);
	}
	
	//Função interna, inicializa a rasterização com as posições concedidas
	function raster(positions){
		var startY = Math.min(
			positions[0][1],positions[1][1],positions[2][1]);
		var endY = Math.max(
			positions[0][1],positions[1][1],positions[2][1]);
		var startX = Math.min(
			positions[0][0],positions[1][0],positions[2][0]);
		var endX = Math.max(
			positions[0][0],positions[1][0],positions[2][0]);
		
		var intersections = [];
		
		var attribas = JSON.parse(JSON.stringify(attribs));
		var unifs = JSON.parse(JSON.stringify(uniforms));
		
		for(var y=startY<0?0:startY; y<endY&&y<height; y++){
			var interset = insideTriangle(x, y+.5, positions);
			for(var x=interset.start<0?0:~~interset.start; x<interset.end&&x<width; x++){
				var p = (x-interset.start)/(interset.end-interset.start);
				var v1 = (interset.v1[1]-interset.v1[0])*p+interset.v1[0];
				var v2 = (interset.v2[1]-interset.v2[0])*p+interset.v2[0];
				var v3 = (interset.v3[1]-interset.v3[0])*p+interset.v3[0];
				
				var relopos = interpolateAttribute(positions, v1, v2, v3);
				
				var attributes = {};
				for(a in attribs)
					attributes[a] = interpolateAttribute(attribs[a], v1, v2, v3);
				
				var properties = {
					fragColor: getPixel(x, y),
					fragCoord: [width/x, height/y]
				};
				
				var color = fragment_program(attributes, unifs, properties);
				drawPixel(x, y, relopos[2], color[0], color[1], color[2], color[3]);
			}
		}
	}
	
	//Função interna, cuida em interpolar atributos com as influências de vértices cedidas
	function interpolateAttribute(attr, v1, v2, v3){
		var nattr = [];
		for(var t = 0; t<attr[0].length; t++){
			nattr[t] = 
				attr[0][t]*v1+attr[1][t]*v2+attr[2][t]*v3;
		}
		return nattr;
	}
	
	function insideTriangle(x, y, pos){
		return testRevertexes(x, y, pos, testArray);
	}
	
	//Testa cada vértice, isso é necessário para não ter que efetuar mais cálculos
	//em outros tipos diferentes de triângulos
	function testRevertexes(x, y, pos, listIndices){
		for(var item=0; item<listIndices.length; item++){
			var itm = listIndices[item];
			var sit = triangleSituation(x, y, pos[itm[0]], pos[itm[1]], pos[itm[2]]);
			if(sit!=null){
				var rever = {
					start: sit.start,
					end: sit.end,
				}
				rever.v1 = sit["v"+(itm[0]+1)];
				rever.v2 = sit["v"+(itm[1]+1)];
				rever.v3 = sit["v"+(itm[2]+1)];
				return rever;
			}
		}
		return {start:-1,end:-1,v1:[0,0],v2:[0,0],v3:[0,0]};
	}
	
	//Testa o triângulo em uma situação fornecida, se for aprovado, retorna intersecções
	function triangleSituation(x, y, p1, p2, p3){
		var dec1 = (p2[0]-p1[0])/(p2[1]-p1[1]);
		var dec2 = (p3[0]-p1[0])/(p3[1]-p1[1]);
		var dec3 = (p2[0]-p3[0])/(p2[1]-p3[1]);
		
		var dy1 = y-p1[1];
		var dy2 = y-p2[1];
		var dy3 = y-p3[1];
		
		if(dy1<0||dy3<dy2)
			return null;
		
		if(dy3<0){
			var test = testDraw(y, p1, p1, dec1, dec2, p2, p3, dy1, dy1);
			test.v1 = test.ord?[1-test.inf1, 1-test.inf2]:[1-test.inf2, 1-test.inf1];
			test.v2 = test.ord?[0, test.inf2]:[test.inf2, 0];
			test.v3 = test.ord?[test.inf1, 0]:[0, test.inf1];
			return test;
		}else{
			var test = testDraw(y, p1, p3, dec1, dec3, p2, p2, dy1, dy3);
			test.v1 = test.ord?[0, 1-test.inf2]:[1-test.inf2, 0];
			test.v2 = test.ord?[test.inf1, test.inf2]:[test.inf2, test.inf1];
			test.v3 = test.ord?[1-test.inf1, 0]:[0, 1-test.inf1];
			return test;
		}
	}
	
	//Apenas obtém intersecções e calcula influências
	function testDraw(y, ps1, ps2, dec1, dec2, pe1, pe2, dy1, dy2){
		var extremo1 = (ps2[0]+dec2*dy2);
		var extremo2 = (ps1[0]+dec1*dy1);
		var influen1 = distance(ps2, [extremo1, y])/distance(ps2, pe2);
		var influen2 = distance(ps1, [extremo2, y])/distance(ps1, pe1);
		
		var ordered = extremo1<=extremo2;
		
		var dataIntersected = {
			start: ordered?extremo1:extremo2,
			end: ordered?extremo2:extremo1,
			ord: ordered,
			inf1: influen1,
			inf2: influen2,
		}
		
		return dataIntersected;
	}
	
	//Função simples, apenas calcula distância
	function distance(p1, p2){
		return Math.sqrt(
			(p2[0]-p1[0])*(p2[0]-p1[0])+(p2[1]-p1[1])*(p2[1]-p1[1])
			);
	}
	
	//Desenha um pixel no buffer
	function drawPixel(x, y, z, r, g, b, a){
		var ib = y*width+x;
		if(x>=width||x<0||y>=height||y<0||buffer_depth[ib]>z)
			return;
		var i = y*width*4+x*4;
		buffer_color.data[i] = r*256;
		buffer_color.data[i+1] = g*256;
		buffer_color.data[i+2] = b*256;
		buffer_color.data[i+3] = a*256;
		buffer_depth[ib] = z;
	}
	
	//Função interna, obtêm um pixel do buffer de cor
	function getPixel(x, y){
		var i = y*width*4+x*4;
		return [
			buffer_color.data[i]*div256,
			buffer_color.data[i+1]*div256,
			buffer_color.data[i+2]*div256,
			buffer_color.data[i+3]*div256
		];
	}
	
	//Função de teste, exporta a função de pintar pixels
	this.draw = drawPixel;
	
	//Função que limpa o buffer de profundidade, e pinta com uma cor fornecida
	this.clear = function(r, g, b, a){
		for(var i=0; i<buffer_color.data.length; i+=4){
			buffer_color.data[i] = r*256;
			buffer_color.data[i+1] = g*256;
			buffer_color.data[i+2] = b*256;
			buffer_color.data[i+3] = a*256;
			buffer_depth[~~(i/4)] = -Infinity;
		}
	}
	
	//Função trivial de desenho, resesenhará o buffer de cor na tela
	//Se não for usada, a tela não exibirá nada
	this.flush = function(){
		gl.putImageData(buffer_color, 0, 0);
	}
	
}