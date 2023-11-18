
var bytes = IOByte.createByteArray([56, 78, 43, 28, 256, 255]);
bytes[7] = 64;
document.write(IOByte.extractBytesFrom(bytes, 1, 0));


