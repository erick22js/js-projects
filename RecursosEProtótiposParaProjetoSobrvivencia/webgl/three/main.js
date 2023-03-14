
//Setting main objects
var loader = new THREE.TextureLoader();
var canvas = document.getElementById("screen");
var renderer = new THREE.WebGLRenderer({canvas});
var cam = new THREE.PerspectiveCamera(60, 1.6, 0.0001, 1000);
var scene = new THREE.Scene();

var textura = [
    loader.load("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAACACAYAAABqZmsaAAAACXBIWXMAADXUAAA11AFeZeUIAAAB0klEQVR4nO3Zv1HDMBQGcJmj4y4FC1CnyCbpXDJDpskMlO7YJAUlxwIULCAKzpxiSe+vFSWX71UOGH8/PzmybEJAoW66tpsYtpvoOcTgCn99+dt++wrh48d0LBsgDZ/LiNADSuEOhA5AhRsRcoAk3ICQATThSgQPsIQrEDTAEy5E1AFrhAsQZYB0dksnIkkVEI/SHbNaIo0z4YPlj9YsAAAAAAAAAACgvB5IS7o4qe3nWhPOB264KO0+BAAAAAAAAAAAAAAAAAAAAAAAoH8try328fxz7wtwVvchACB7RxSf35sGDt/7s8/dO+ACDMddGI67foA1CgAAAABADJDOetrZ8XY6MBd1dpb7ghgQDycyKP1Zui9X2ZqQWw9wZ8mFi9cDtSAqYPk7yQVpughLiBosHk4kwvwtSAOprnAd4P9vKERY9yM7sMaSixsC9bfAW1e3Ks6ugaWwdXXvAABDfAp4P3DfgPxeMDVOHM8/du8AAD7AGLIxvRxgrGxfBFAKNCL0ACrIgNAB0oCpsq1EyAG1cCdCPwTUTGmYRbvPA/LnAunZKbvQvQMAXDHAeZP5PwZznPYdmGhEe0D3DoRAzg00YIUFBzcE+ZPRva2K8WwIwC9ETJiiSKc5zwAAAABJRU5ErkJggg==")
];
textura[0].magFilter = textura[0].minFilter = THREE.NearestFilter;

function createTile(x, z, lv){
	var geometry = new THREE.PlaneGeometry(1,1,1);geometry.vertices = [new THREE.Vector3(-.5,1,-.5),new THREE.Vector3(.5,1,-.5),new THREE.Vector3(-.5,1,.5),new THREE.Vector3(.5,1,.5),new THREE.Vector3(-.5,0,.5),new THREE.Vector3(.5,0,.5),new THREE.Vector3(-.5,0,-.5),new THREE.Vector3(.5,0,-.5),new THREE.Vector3(-.5,2,0),new THREE.Vector3(.5,2,0),new THREE.Vector3(-.5,0,0),new THREE.Vector3(.5,0,0)];geometry.faces = [new THREE.Face3(0, 2, 1),new THREE.Face3(2, 3, 1),new THREE.Face3(2, 4, 3),new THREE.Face3(4, 5, 3),new THREE.Face3(0, 6, 2),new THREE.Face3(6, 4, 2),new THREE.Face3(3, 5, 1),new THREE.Face3(5, 7, 1),new THREE.Face3(8, 10, 9),new THREE.Face3(10, 11, 9)];
	geometry.faceVertexUvs = [[[new THREE.Vector2(0,.5),new THREE.Vector2(0,.25),new THREE.Vector2(1,.5)],[	new THREE.Vector2(0,.25),new THREE.Vector2(1,.25),new THREE.Vector2(1,.5) //top
		],[	new THREE.Vector2(0,.25),new THREE.Vector2(0,0),new THREE.Vector2(1,.25)],[	new THREE.Vector2(0,0),new THREE.Vector2(1,0),new THREE.Vector2(1,.25)//front
		],[	new THREE.Vector2(0,.25),new THREE.Vector2(0,0),new THREE.Vector2(1,.25)],[	new THREE.Vector2(0,0),new THREE.Vector2(1,0),new THREE.Vector2(1,.25)//side-left
		],[	new THREE.Vector2(0,.25),new THREE.Vector2(0,0),new THREE.Vector2(1,.25)],[	new THREE.Vector2(0,0),new THREE.Vector2(1,0),new THREE.Vector2(1,.25)//side-right
		],[new THREE.Vector2(0,1),new THREE.Vector2(0,.5),new THREE.Vector2(1,1)],[	new THREE.Vector2(0,.5),new THREE.Vector2(1,.5),new THREE.Vector2(1,1)//frame]
	]]]
	var material = new THREE.MeshBasicMaterial({map:textura[0], alphaTest:1});var mesh = new THREE.Mesh(geometry, material);mesh.position.set(x, lv, z);return mesh;
}
for(var y=0;y<10;y++)
	for(var x=0;x<16;x++){
		var tile = createTile(x, y, -1);
		scene.add(tile);
		var tile = createTile(x, y, 0);
		scene.add(tile);
		var tile = createTile(x, y, 1);
		scene.add(tile);
		var tile = createTile(x, y, 2);
		scene.add(tile);
	}

cam.position.z=10;
cam.position.y=6;
cam.position.x=19;
cam.rotation.x-=.9;

function updt(){
	cam.position.x -=.01;
	renderer.render(scene, cam);
	
	requestAnimationFrame(updt);
}
updt()
