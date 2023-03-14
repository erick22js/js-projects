
var permutation_table = [
	151,160,137,91,90,15,
	131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
	190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
	88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
	77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
	102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
	135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
	5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
	223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
	129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
	251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
	49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
	138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180
];

function fade_(a){
	return ((6*a-15)*a+10)*a*a*a;
}

function lerp_(v1, v2, a){
	return v1 + ((v2 - v1)*a);
}

function noise1d(x){
	var a = fade_(x-(~~x));
	x = ~~x;
	var v1 = permutation_table[(x)&0xff]/256;
	var v2 = permutation_table[(x+1)&0xff]/256;
	return (v1*(1-a))+(v2*a);
}

function getvec2d_(v){
	switch(v&0b111){
		case 0:{
			return [1, 1];
		}
		break;
		case 1:{
			return [1, 0];
		}
		break;
		case 2:{
			return [1, -1];
		}
		break;
		case 3:{
			return [0, -1];
		}
		break;
		case 4:{
			return [-1, -1];
		}
		break;
		case 5:{
			return [-1, 0];
		}
		break;
		case 6:{
			return [-1, 1];
		}
		break;
		case 7:{
			return [0, 1];
		}
		break;
	}
}

function calcvec2(vx, vy, x, y){
	var iv = permutation_table[vx&0xff]*permutation_table[vy&0xff];
	var pv = permutation_table[(iv)&0xff];
	var ovec = getvec2d_(pv);
	var pvec = [x-vx, y-vy];
	var dot = ovec[0]*pvec[0]+ovec[1]*pvec[1];
	return dot;
}

function noise2d(x, y){
	// Rounded Axis
	var rx = ~~x;
	var ry = ~~y;
	// Linear Progression
	var ax = x-rx;
	var ay = y-ry;
	// Smooth Fade
	var tx = fade_(ax);
	var ty = fade_(ay);
	
	// Pointer vector retrieving and dot product
	var tl = calcvec2(rx+0, ry+0, x, y);
	var tr = calcvec2(rx+1, ry+0, x, y);
	var bl = calcvec2(rx+0, ry+1, x, y);
	var br = calcvec2(rx+1, ry+1, x, y);
	
	// Interpolation calculation between edges values
	var vt = lerp_(tl, tr, tx);
	var vb = lerp_(bl, br, tx);
	var v = lerp_(vt, vb, ty);
	
	return v;
}

function getvec3d_(v){
	switch(v%26){
		case 0:{
			return [1, 1, -1];
		}
		break;
		case 1:{
			return [1, 0, -1];
		}
		break;
		case 2:{
			return [1, -1, -1];
		}
		break;
		case 3:{
			return [0, -1, -1];
		}
		break;
		case 4:{
			return [-1, -1, -1];
		}
		break;
		case 5:{
			return [-1, 0, -1];
		}
		break;
		case 6:{
			return [-1, 1, -1];
		}
		break;
		case 7:{
			return [0, 1, -1];
		}
		break;
		case 8:{
			return [1, 1, 0];
		}
		break;
		case 9:{
			return [1, 0, 0];
		}
		break;
		case 10:{
			return [1, -1, 0];
		}
		break;
		case 11:{
			return [0, -1, 0];
		}
		break;
		case 12:{
			return [-1, -1, 0];
		}
		break;
		case 13:{
			return [-1, 0, 0];
		}
		break;
		case 14:{
			return [-1, 1, 0];
		}
		break;
		case 15:{
			return [0, 1, 0];
		}
		break;
		case 16:{
			return [1, 1, 1];
		}
		break;
		case 17:{
			return [1, 0, 1];
		}
		break;
		case 18:{
			return [1, -1, 1];
		}
		break;
		case 19:{
			return [0, -1, 1];
		}
		break;
		case 20:{
			return [-1, -1, 1];
		}
		break;
		case 21:{
			return [-1, 0, 1];
		}
		break;
		case 22:{
			return [-1, 1, 1];
		}
		break;
		case 23:{
			return [0, 1, 1];
		}
		break;
		case 24:{
			return [0, 0, -1];
		}
		break;
		case 25:{
			return [0, 0, 1];
		}
		break;
	}
}

function calcvec3(vx, vy, vz, x, y, z){
	var iv = permutation_table[vx&0xff]*permutation_table[vy&0xff]*permutation_table[vz&0xff];
	var pv = permutation_table[(iv)&0xff];
	var ovec = getvec3d_(pv);
	var pvec = [x-vx, y-vy, z-vz];
	var dot = ovec[0]*pvec[0] + ovec[1]*pvec[1] + ovec[2]*pvec[2];
	return dot;
}

function noise3d(x, y, z){
	// Rounded Axis
	var rx = ~~x;
	var ry = ~~y;
	var rz = ~~z;
	// Linear Progression
	var ax = x-rx;
	var ay = y-ry;
	var az = z-rz;
	// Smooth Fade
	var tx = fade_(ax);
	var ty = fade_(ay);
	var tz = fade_(az);
	
	// Pointer vector retrieving and dot product
	var tlf = calcvec3(rx+0, ry+0, rz+0, x, y, z);
	var trf = calcvec3(rx+1, ry+0, rz+0, x, y, z);
	var blf = calcvec3(rx+0, ry+1, rz+0, x, y, z);
	var brf = calcvec3(rx+1, ry+1, rz+0, x, y, z);
	var tlb = calcvec3(rx+0, ry+0, rz+1, x, y, z);
	var trb = calcvec3(rx+1, ry+0, rz+1, x, y, z);
	var blb = calcvec3(rx+0, ry+1, rz+1, x, y, z);
	var brb = calcvec3(rx+1, ry+1, rz+1, x, y, z);
	
	// Interpolation calculation between edges values
	var vtf = lerp_(tlf, trf, tx);
	var vbf = lerp_(blf, brf, tx);
	var vtb = lerp_(tlb, trb, tx);
	var vbb = lerp_(blb, brb, tx);
	var vf = lerp_(vtf, vbf, ty);
	var vb = lerp_(vtb, vbb, ty);
	var v = lerp_(vf, vb, tz);
	
	return v;
}