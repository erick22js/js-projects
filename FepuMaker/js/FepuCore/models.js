
/*
 * @Módulos de modelos
*/

/* @Vértice
*/
const Vertex = function(
	x=0,
	y=0
){
	return {
		"x": x,
		"y": y,
	}
}

/* @Lado de segmento
*/
const Sidedef = function(
	v1=new Vertex(),
	v2=new Vertex()
){
	return {
		"v1": v1,
		"v2": v2,
		"s1": null,
		"s2": null,
	}
}