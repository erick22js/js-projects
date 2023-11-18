
const Matrix4 = new function(){
	var Mat4 = Float32Array;
	function _createMatrix(dest){
		var matrix = dest || new Mat4(16);
		matrix[0] = 1;
		matrix[1] = 0;
		matrix[2] = 0;
		matrix[3] = 0;
		matrix[4] = 0;
		matrix[5] = 1;
		matrix[6] = 0;
		matrix[7] = 0;
		matrix[8] = 0;
		matrix[9] = 0;
		matrix[10] = 1;
		matrix[11] = 0;
		matrix[12] = 0;
		matrix[13] = 0;
		matrix[14] = 0;
		matrix[15] = 1;
		return matrix;
	}
	this.createMatrix = _createMatrix;
	
	function _createPerspectiveMatrix(fieldOfView, aspect, zNear, zFar, dest){
		dest = dest || new Mat4(16);
		var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfView);
		var rangeInv = 1.0 / (zNear - zFar);
		dest[0]  = f / aspect;
		dest[1]  = 0;
		dest[2]  = 0;
		dest[3]  = 0;
		dest[4]  = 0;
		dest[5]  = f;
		dest[6]  = 0;
		dest[7]  = 0;
		dest[8]  = 0;
		dest[9]  = 0;
		dest[10] = (zNear + zFar) * rangeInv;
		dest[11] = -1;
		dest[12] = 0;
		dest[13] = 0;
		dest[14] = zNear * zFar * rangeInv * 2;
		dest[15] = 0;
		return dest;
	}
	this.createPerspectiveMatrix = _createPerspectiveMatrix;
	
	function _multiply(a, b, dest) {
		dest = dest || new Mat4(16);
		var a00 = a[0];
		var a01 = a[1];
		var a02 = a[2];
		var a03 = a[3];
		var a10 = a[ 4 + 0];
		var a11 = a[ 4 + 1];
		var a12 = a[ 4 + 2];
		var a13 = a[ 4 + 3];
		var a20 = a[ 8 + 0];
		var a21 = a[ 8 + 1];
		var a22 = a[ 8 + 2];
		var a23 = a[ 8 + 3];
		var a30 = a[12 + 0];
		var a31 = a[12 + 1];
		var a32 = a[12 + 2];
		var a33 = a[12 + 3];
		var b00 = b[0];
		var b01 = b[1];
		var b02 = b[2];
		var b03 = b[3];
		var b10 = b[ 4 + 0];
		var b11 = b[ 4 + 1];
		var b12 = b[ 4 + 2];
		var b13 = b[ 4 + 3];
		var b20 = b[ 8 + 0];
		var b21 = b[ 8 + 1];
		var b22 = b[ 8 + 2];
		var b23 = b[ 8 + 3];
		var b30 = b[12 + 0];
		var b31 = b[12 + 1];
		var b32 = b[12 + 2];
		var b33 = b[12 + 3];
		dest[ 0] = a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30;
		dest[ 1] = a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31;
		dest[ 2] = a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32;
		dest[ 3] = a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33;
		dest[ 4] = a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30;
		dest[ 5] = a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31;
		dest[ 6] = a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32;
		dest[ 7] = a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33;
		dest[ 8] = a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30;
		dest[ 9] = a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31;
		dest[10] = a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32;
		dest[11] = a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33;
		dest[12] = a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30;
		dest[13] = a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31;
		dest[14] = a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32;
		dest[15] = a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33;
		return dest;
	}
	this.multiply = _multiply;
	
	function _translate(matrix, vector, dest){
		dest = dest || new Mat4(16);
		var v0 = vector[0];
		var v1 = vector[1];
		var v2 = vector[2];
		var m00 = matrix[0];
		var m01 = matrix[1];
		var m02 = matrix[2];
		var m03 = matrix[3];
		var m10 = matrix[4];
		var m11 = matrix[5];
		var m12 = matrix[6];
		var m13 = matrix[7];
		var m20 = matrix[8];
		var m21 = matrix[9];
		var m22 = matrix[10];
		var m23 = matrix[11];
		var m30 = matrix[12];
		var m31 = matrix[13];
		var m32 = matrix[14];
		var m33 = matrix[15];
		if (matrix !== dest) {
			dest[ 0] = m00;
			dest[ 1] = m01;
			dest[ 2] = m02;
			dest[ 3] = m03;
			dest[ 4] = m10;
			dest[ 5] = m11;
			dest[ 6] = m12;
			dest[ 7] = m13;
			dest[ 8] = m20;
			dest[ 9] = m21;
			dest[10] = m22;
			dest[11] = m23;
		}
		dest[12] = m00 * v0 + m10 * v1 + m20 * v2 + m30;
		dest[13] = m01 * v0 + m11 * v1 + m21 * v2 + m31;
		dest[14] = m02 * v0 + m12 * v1 + m22 * v2 + m32;
		dest[15] = m03 * v0 + m13 * v1 + m23 * v2 + m33;
    return dest;
	}
	this.translate = _translate;
	function _rotateX(matrix, angle, dest) {
		dest = dest || new Mat4(16);
		var m10 = matrix[4];
		var m11 = matrix[5];
		var m12 = matrix[6];
		var m13 = matrix[7];
		var m20 = matrix[8];
		var m21 = matrix[9];
		var m22 = matrix[10];
		var m23 = matrix[11];
		var c = Math.cos(angle);
		var s = Math.sin(angle);
		dest[4]  = c * m10 + s * m20;
		dest[5]  = c * m11 + s * m21;
		dest[6]  = c * m12 + s * m22;
		dest[7]  = c * m13 + s * m23;
		dest[8]  = c * m20 - s * m10;
		dest[9]  = c * m21 - s * m11;
		dest[10] = c * m22 - s * m12;
		dest[11] = c * m23 - s * m13;
	if (matrix !== dest) {
		dest[ 0] = matrix[ 0];
		dest[ 1] = matrix[ 1];
		dest[ 2] = matrix[ 2];
		dest[ 3] = matrix[ 3];
		dest[12] = matrix[12];
		dest[13] = matrix[13];
		dest[14] = matrix[14];
		dest[15] = matrix[15];
	}
	return dest;
	}
	this.rotateX = _rotateX;
	
	function _rotateY(matrix, angle, dest) {
		dest = dest || new Mat4(16);
		var m00 = matrix[0 * 4 + 0];
		var m01 = matrix[0 * 4 + 1];
		var m02 = matrix[0 * 4 + 2];
		var m03 = matrix[0 * 4 + 3];
		var m20 = matrix[2 * 4 + 0];
		var m21 = matrix[2 * 4 + 1];
		var m22 = matrix[2 * 4 + 2];
		var m23 = matrix[2 * 4 + 3];
		var c = Math.cos(angle);
		var s = Math.sin(angle);
		dest[ 0] = c * m00 - s * m20;
		dest[ 1] = c * m01 - s * m21;
		dest[ 2] = c * m02 - s * m22;
		dest[ 3] = c * m03 - s * m23;
		dest[ 8] = c * m20 + s * m00;
		dest[ 9] = c * m21 + s * m01;
		dest[10] = c * m22 + s * m02;
		dest[11] = c * m23 + s * m03;
		if (matrix !== dest) {
			dest[ 4] = matrix[ 4];
			dest[ 5] = matrix[ 5];
			dest[ 6] = matrix[ 6];
			dest[ 7] = matrix[ 7];
			dest[12] = matrix[12];
			dest[13] = matrix[13];
			dest[14] = matrix[14];
			dest[15] = matrix[15];
		}
    return dest;
	}
	this.rotateY = _rotateY;
	
	function _rotateZ(matrix, angle, dest) {
		dest = dest || new Mat4(16);
		var m00 = matrix[0 * 4 + 0];
		var m01 = matrix[0 * 4 + 1];
		var m02 = matrix[0 * 4 + 2];
		var m03 = matrix[0 * 4 + 3];
		var m10 = matrix[1 * 4 + 0];
		var m11 = matrix[1 * 4 + 1];
		var m12 = matrix[1 * 4 + 2];
		var m13 = matrix[1 * 4 + 3];
		var c = Math.cos(angle);
		var s = Math.sin(angle);
		dest[ 0] = c * m00 + s * m10;
		dest[ 1] = c * m01 + s * m11;
		dest[ 2] = c * m02 + s * m12;
		dest[ 3] = c * m03 + s * m13;
		dest[ 4] = c * m10 - s * m00;
		dest[ 5] = c * m11 - s * m01;
		dest[ 6] = c * m12 - s * m02;
		dest[ 7] = c * m13 - s * m03;
		if (matrix !== dest) {
			dest[ 8] = matrix[ 8];
			dest[ 9] = matrix[ 9];
			dest[10] = matrix[10];
			dest[11] = matrix[11];
			dest[12] = matrix[12];
			dest[13] = matrix[13];
			dest[14] = matrix[14];
			dest[15] = matrix[15];
		}
		return dest;
	}
	this.rotateZ = _rotateZ;
	
	function _rotate(matrix, axis, angle, dest) {
		dest = dest || new Mat4(16);
		var x = axis[0];
		var y = axis[1];
		var z = axis[2];
		var n = Math.sqrt(x * x + y * y + z * z);
		x /= n;
		y /= n;
		z /= n;
		var xx = x * x;
		var yy = y * y;
		var zz = z * z;
		var c = Math.cos(angle);
		var s = Math.sin(angle);
		var oneMinusCosine = 1 - c;
		var r00 = xx + (1 - xx) * c;
		var r01 = x * y * oneMinusCosine + z * s;
		var r02 = x * z * oneMinusCosine - y * s;
		var r10 = x * y * oneMinusCosine - z * s;
		var r11 = yy + (1 - yy) * c;
		var r12 = y * z * oneMinusCosine + x * s;
		var r20 = x * z * oneMinusCosine + y * s;
		var r21 = y * z * oneMinusCosine - x * s;
		var r22 = zz + (1 - zz) * c;
		var m00 = matrix[0];
		var m01 = matrix[1];
		var m02 = matrix[2];
		var m03 = matrix[3];
		var m10 = matrix[4];
		var m11 = matrix[5];
		var m12 = matrix[6];
		var m13 = matrix[7];
		var m20 = matrix[8];
		var m21 = matrix[9];
		var m22 = matrix[10];
		var m23 = matrix[11];
		dest[ 0] = r00 * m00 + r01 * m10 + r02 * m20;
		dest[ 1] = r00 * m01 + r01 * m11 + r02 * m21;
		dest[ 2] = r00 * m02 + r01 * m12 + r02 * m22;
		dest[ 3] = r00 * m03 + r01 * m13 + r02 * m23;
		dest[ 4] = r10 * m00 + r11 * m10 + r12 * m20;
		dest[ 5] = r10 * m01 + r11 * m11 + r12 * m21;
		dest[ 6] = r10 * m02 + r11 * m12 + r12 * m22;
		dest[ 7] = r10 * m03 + r11 * m13 + r12 * m23;
		dest[ 8] = r20 * m00 + r21 * m10 + r22 * m20;
		dest[ 9] = r20 * m01 + r21 * m11 + r22 * m21;
		dest[10] = r20 * m02 + r21 * m12 + r22 * m22;
		dest[11] = r20 * m03 + r21 * m13 + r22 * m23;
		if (matrix !== dest) {
			dest[12] = matrix[12];
			dest[13] = matrix[13];
			dest[14] = matrix[14];
			dest[15] = matrix[15];
		}
		return dest;
	}
	this.rotate = _rotate;
	
	function scale(matrix, vector, dest) {
		dest = dest || new Mat4(16);
		var v0 = vector[0];
		var v1 = vector[1];
		var v2 = vector[2];
		dest[ 0] = v0 * matrix[0 * 4 + 0];
		dest[ 1] = v0 * matrix[0 * 4 + 1];
		dest[ 2] = v0 * matrix[0 * 4 + 2];
		dest[ 3] = v0 * matrix[0 * 4 + 3];
		dest[ 4] = v1 * matrix[1 * 4 + 0];
		dest[ 5] = v1 * matrix[1 * 4 + 1];
		dest[ 6] = v1 * matrix[1 * 4 + 2];
		dest[ 7] = v1 * matrix[1 * 4 + 3];
		dest[ 8] = v2 * matrix[2 * 4 + 0];
		dest[ 9] = v2 * matrix[2 * 4 + 1];
		dest[10] = v2 * matrix[2 * 4 + 2];
		dest[11] = v2 * matrix[2 * 4 + 3];
		if (matrix !== dest) {
			dest[12] = matrix[12];
			dest[13] = matrix[13];
			dest[14] = matrix[14];
			dest[15] = matrix[15];
		}
		return dest;
	}
}
