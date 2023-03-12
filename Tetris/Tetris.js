const ctx = Tela.getContext("2d");
const WIDTH = Number(Tela.width);
const HEIGHT = Number(Tela.height);

const Pal = [
	["#2d5","#083","#060"],
	["#e1d","#a0a","#506"],
	["#21f","#00b","#115"],
	["#e81","#a30","#710"],
	["#d11","#900","#411"],
	["#cc0","#880","#440"],
	["#5bf","#39b","#148"],
];
const Brick = [];
var actualPiece = [];
var nextPiece = [];
var Piece = {
	x: 4,
	y: 0,
	direction: 0,
	directions: 2,
	index: 0,
	nxt_index: 0,
	blocked: false,
	block_time: 0,
	delay: 1,
	delay_speed: 1,
};
var Settings = {
	score: 0,
	level: 1,
	time: 100,
	combo: 0,
	gameOver: false,
};

const Keys = {};
const Inputs = {
	delay: 0,
	delayAd: 2,
};

function Start(){
	//Instanciate Brick Grid
	for(var y=0; y<20; y++){
		var line = [];
		for(var x=0; x<10; x++){
			line.push(-1);
		}
		Brick.push(line);
	}
	PickRandomPiece();
	PickRandomPiece();
}
function Update(deltatime=0){
	if(Settings.gameOver){
		Redraw();
		ctx.strokeStyle = "black";
		ctx.fillStyle = "#f56";
		ctx.font = "37px Arial";
		ctx.fillText("GAME OVER!", 25, 200);
		ctx.strokeText("GAME OVER!", 25, 200);
		return;
	}
	Piece.delay -= deltatime;
	Settings.time -= deltatime;
	if(Settings.time<=0){
		Settings.time = 100;
		Settings.level++;
		Piece.delay_speed = 1-(Settings.level*.05);
	}
	executeInputs();
	if(Piece.blocked&&Piece.block_time<=0){
		Redraw();
		if(clearAnimation()){
			Piece.blocked = false;
			PickRandomPiece();
			Piece.delay = Piece.delay_speed;
		}
	}else if(Piece.block_time>0){
		Piece.block_time-= deltatime;
		Redraw();
	}else{
		if(Piece.delay <= 0){
			FallDownPiece(true);
			Piece.delay = Piece.delay_speed;
		}
		Redraw();
	}
}

function Redraw(){
	ctx.clearRect(0, 0, WIDTH, HEIGHT);
	
	//Draw brick scene
	for(var y=0; y<20; y++){
		for(var x=0; x<10; x++){
			DrawBrick(Brick[y][x], x*30, y*30, true);
		}
	}
	//Draw piece
	DrawPiece();
	DrawBkpPiece();
	
	//Draw ui
	ctx.fillStyle = "black";
	ctx.font = "25px Serif";
	ctx.fillText("Score:", 310, 200);
	ctx.fillText(Settings.score, 310, 225);
	ctx.fillText("Level:", 310, 275);
	ctx.fillText(Settings.level, 310, 300);
	ctx.fillText("Next in:", 310, 350);
	ctx.fillText(~~Settings.time, 310, 375);
	
	
	ctx.fillText("Combo "+Settings.combo+"x", 310, 450);
	
	ctx.fillStyle = "black";
	ctx.fillRect(300, 0, 1, HEIGHT);
	
}
function DrawBrick(data, x, y, fixed){
	if(data>-1){
		ctx.fillStyle = Pal[data][fixed?2:0];
		ctx.beginPath();
		ctx.moveTo(x, y+30);
		ctx.lineTo(x+30, y);
		ctx.lineTo(x, y);
		ctx.fill();
		ctx.fillStyle = Pal[data][fixed?0:2];
		ctx.beginPath();
		ctx.moveTo(x, y+30);
		ctx.lineTo(x+30, y);
		ctx.lineTo(x+30, y+30);
		ctx.fill();
		ctx.fillStyle = Pal[data][1];
		if(fixed)
			ctx.fillRect(x+4, y+4, 22, 22);
		else
			ctx.fillRect(x+6, y+6, 18, 18);
	}
}

// Clearing

var linesForClear = null;
var clearAnimP = 0;

function checkForClear(){
	linesForClear = [];
	linesloop: for(var i=0; i<20; i++){
		for(var r=0; r<10; r++){
			if(Brick[i][r]==-1){
				continue linesloop;
			}
		}
		Settings.score++;
		linesForClear.push(i);
	}
	if(linesForClear.length==0)
		linesForClear = null;
}

function cleanFilledLines(){
	var ind = 0;
	var cleaneds = 0;
	linefloop: while(ind<linesForClear.length){
		for(var i=19; i>-1; i--){
			if(ind>=linesForClear.length)
				return;
			if(linesForClear[ind]==(i)){
				for(var y=i; y>-1; y--){
					for(var x=0; x<10; x++){
						if(y==0)
							Brick[y][x] = -1;
						else
							Brick[y][x] = Brick[y-1][x];
					}
				}
				//cleaneds++;
				ind++;
				continue linefloop;
			}
		}
	}
}

function clearAnimation(){
	if(linesForClear==null){
		checkForClear();
		if(linesForClear==null){
			Settings.combo = 0;
			return true;
		}
		else{
			Settings.combo++;
		}
	}else{
		clearAnimP+=10;
		for(var i=0; i<linesForClear.length; i++){
			ctx.fillStyle = "white";
			ctx.fillRect(0, linesForClear[i]*30, clearAnimP, 30);
		}
		if(clearAnimP>=300){
			cleanFilledLines();
			linesForClear = null;
			clearAnimP = 0;
			return true;
		}
	}
	return false;
}


/*
 * Functions with out piece
*/

function DrawPiece(piece){
	for(var i=0; i<actualPiece.length; i++){
		var Sp = PieceModalToSpace(i);
		DrawBrick(Piece.index, Sp[0]*30, Sp[1]*30, false);
	}
}

function DrawBkpPiece(piece){
	var minX = Infinity;
	var maxX = -Infinity;
	var minY = Infinity;
	var maxY = -Infinity;
	for(var i=0; i<nextPiece.length; i++){
		minX = nextPiece[i][0]<minX?nextPiece[i][0]:minX;
		maxX = (nextPiece[i][0]+1)>maxX?nextPiece[i][0]+1:maxX;
		minY = nextPiece[i][1]<minY?nextPiece[i][1]:minY;
		maxY = (nextPiece[i][1]+1)>maxY?nextPiece[i][1]+1:maxY;
	}
	var offX = -((maxX-minX)*.5+minX)*30;
	var offY = -((maxY-minY)*.5+minY)*30;
	for(var i=0; i<nextPiece.length; i++){
		DrawBrick(Piece.next_index, (nextPiece[i][0])*30+400+offX, (nextPiece[i][1])*30+80+offY, false);
	}
}

function PieceModalToSpace(i){
	var p = actualPiece[i];
	var x = p[0];
	var y = p[1];
	x += Piece.x;
	y += Piece.y;
	return [x, y];
}


function FallDownPiece(byGravity=false){
	if(Piece.blocked)
		return;
	Piece.y++;
	if(CheckPieceColision()){
		Piece.y--;
		if(byGravity)
			FixPiece();
		//else if(Piece.delay<=Piece.delay_speed*.5)
		//	Piece.delay = Piece.delay_speed;
	}
}

function ImediateFallPiece(){
	if(Piece.blocked)
		return;
}

function MoveLeftPiece(){
	if(Piece.blocked)
		return;
	Piece.x--;
	if(CheckPieceColision())
		Piece.x++;
}

function MoveRightPiece(){
	if(Piece.blocked)
		return;
	Piece.x++;
	if(CheckPieceColision())
		Piece.x--;
}

function RotateLeftPiece(){
	if(Piece.blocked)
		return;
	var last = Piece.direction;
	Piece.direction--;
	Piece.direction += Piece.direction<0?Piece.directions:0;
	actualPiece = ModalPieces[Piece.index][Piece.direction];
	if(CheckPieceColision()){
		Piece.direction = last;
		actualPiece = ModalPieces[Piece.index][Piece.direction];
	}
}

function RotateRightPiece(){
	if(Piece.blocked)
		return;
	var last = Piece.direction;
	Piece.direction++;
	Piece.direction -= Piece.direction>=Piece.directions?Piece.directions:0;
	actualPiece = ModalPieces[Piece.index][Piece.direction];
	if(CheckPieceColision()){
		Piece.direction = last;
		actualPiece = ModalPieces[Piece.index][Piece.direction];
	}
}

function PickRandomPiece(){
	actualPiece = nextPiece;
	Piece.index = Piece.next_index;
	Piece.direction = 0;
	Piece.directions = ModalPieces[Piece.index||0].length;
	var random = ~~(Math.random()*ModalPieces.length);
	PickNewPiece(random);
}

function PickNewPiece(i){
	Piece.next_index = i;
	nextPiece = ModalPieces[Piece.next_index][0];
	Piece.y = 0;
	Piece.x = 4;
	if(CheckPieceColision()){
		Settings.gameOver = true;
		osc.stop();
	}
}

function FixPiece(){
	for(var i=0; i<actualPiece.length; i++){
		var p = PieceModalToSpace(i);
		if(p[1]>=0)
			Brick[p[1]][p[0]] = Piece.index;
	}
	Piece.blocked = true;
	Piece.block_time = .5;
}

function CheckPieceColision(){
	for(var i=0; i<actualPiece.length; i++){
		var p = PieceModalToSpace(i);
		//if(p[1]<0)
		//	continue;
		//Check X
		if(p[0]<0||p[0]>=10)
			return true;
		//Check Y
		if(p[1]>=20)
			return true;
		//Check table
		if(p[1]>=0)
			if(Brick[p[1]][p[0]]>-1)
				return true;
	}
	return false;
}

/*
 ****************@Inputs*********************
*/

window.onkeydown = function(ev){
	if(!tPlaying)
		playTrack();
	Keys[ev.code] = true;
	switch(ev.code){
		case "KeyE":
			RotateRightPiece();
		break;
		case "KeyQ":
			RotateLeftPiece();
		break;
	}
}
window.onkeyup = function(ev){
	Keys[ev.code] = false;
	
}
function executeInputs(){
	if(Inputs.delay>0){
		Inputs.delay--;
		return;
	}else{
		Inputs.delay = Inputs.delayAd;
	}
	if(Keys["KeyD"]){
		MoveRightPiece();
	}
	if(Keys["KeyA"]){
		MoveLeftPiece();
	}
	if(Keys["KeyS"]){
		FallDownPiece();
	}
}

/*
 ************@Music and sounds***************
*/

const Track = [
	{note:"E5", time:500},
	{note:"B4", time:200},
	{note:"C5", time:200},
	{note:"D5", time:400},
	{note:"C5", time:200},
	{note:"B4", time:200},
	{note:"A4", time:350},
	{note:null, time:50},
	{note:"A4", time:200},
	{note:"C5", time:200},
	{note:"E5", time:400},
	{note:null, time:50},
	{note:"D5", time:200},
	{note:"C5", time:200},
	{note:"B4", time:400},
	{note:null, time:200},
	{note:"C5", time:200},
	{note:"D5", time:400},
	{note:"E5", time:400},
	{note:"C5", time:400},
	{note:"A4", time:400},
	{note:null, time:50},
	{note:"A4", time:400},
	
	{note:null, time:600},
	
	{note:"D5", time:500},
	{note:"F5", time:200},
	{note:"A5", time:400},
	{note:null, time:50},
	{note:"G5", time:200},
	{note:"F5", time:200},
	{note:"E5", time:500},
	{note:null, time:50},
	{note:"C5", time:200},
	{note:"E5", time:400},
	{note:null, time:50},
	{note:"D5", time:200},
	{note:"C5", time:200},
	{note:"B4", time:400},
	{note:null, time:50},
	{note:"B4", time:200},
	{note:"C5", time:200},
	{note:"D5", time:400},
	{note:null, time:50},
	{note:"E5", time:400},
	{note:null, time:50},
	{note:"C5", time:400},
	{note:null, time:50},
	{note:"A4", time:400},
	{note:null, time:50},
	{note:"A4", time:400},
	
	{note:null, time:600},
	
]
var trackP = 0;
var tPlaying = false;

var actx = new AudioContext();
var gain = actx.createGain();
var osc = actx.createOscillator();
gain.connect(actx.destination);
osc.connect(gain);

function stepTrack(){
	if(trackP>=Track.length)
		trackP = 0;
	var ev = Track[trackP];
	if(ev.note==null){
		gain.gain.value = 0;
	}
	else{
		gain.gain.value = .03;
		osc.frequency.value = Notes[ev.note];
	}
	trackP++;
	setTimeout(stepTrack, ev.time);
}
function playTrack(){
	osc.start();
	osc.type = "square";
	tPlaying = true;
	stepTrack();
}

/*
 *****************@Modals********************
*/

var ModalPieces = [
	// S1
	[
		[
			[ 0, 0], [ 1, 0],
					 [ 1, 1], [ 2, 1],
		],[
				     [ 1,-1],
			[ 0, 0], [ 1, 0],
			[ 0, 1]
		],
	],
	// S2
	[
		[
					 [ 1, 0], [ 2, 0],
			[ 0, 1], [ 1, 1],
		],[
			[ 1,-1],
			[ 1, 0], [ 2, 0],
					 [ 2, 1]
		],
	],
	// L1
	[
		[
			[-1,-1], [ 0,-1],
					 [ 0, 0],
					 [ 0, 1],
		],[
							  [ 1,-1],
			[-1, 0], [ 0, 0], [ 1, 0],
		],[
					 [ 0,-1],
					 [ 0, 0],
					 [ 0, 1], [ 1, 1],
		],[
			[-1, 0], [ 0, 0], [ 1, 0],
			[-1, 1],
		]
	],
	// L2
	[
		[
					 [ 0,-1], [ 1,-1],
					 [ 0, 0],
					 [ 0, 1],
		],[
			[-1, 0], [ 0, 0], [ 1, 0],
							  [ 1, 1],
		],[
					 [ 0,-1],
					 [ 0, 0],
			[-1, 1], [ 0, 1],
		],[
			[-1,-1],
			[-1, 0], [ 0, 0], [ 1, 0],
		]
	],
	// I
	[
		[
					 [ 0,-2],
					 [ 0,-1],
					 [ 0, 0],
					 [ 0, 1],
		],
		[
			[-1, 0], [ 0, 0], [ 1, 0], [ 2, 0],
		],
	],
	// O
	[
		[
			[-1,-1], [ 0,-1],
			[-1, 0], [ 0, 0],
		]
	],
	// T
	[
		[
					 [ 0,-1],
			[-1, 0], [ 0, 0], [ 1, 0],
		],
		[
					 [ 0,-1],
					 [ 0, 0], [ 1, 0],
					 [ 0, 1],
		],[
			[-1, 0], [ 0, 0], [ 1, 0],
					 [ 0, 1],
		],[
					 [ 0,-1],
			[-1, 0], [ 0, 0],
					 [ 0, 1],
		],
	],
]

const Notes = {
   "C0":   16.35,
  "C#0":   17.32,
  "Db0":   17.32,
   "D0":   18.35,
  "D#0":   19.45,
  "Eb0":   19.45,
   "E0":   20.60,
   "F0":   21.83,
  "F#0":   23.12,
  "Gb0":   23.12,
   "G0":   24.50,
  "G#0":   25.96,
  "Ab0":   25.96,
   "A0":   27.50,
  "A#0":   29.14,
  "Bb0":   29.14,
   "B0":   30.87,
   "C1":   32.70,
  "C#1":   34.65,
  "Db1":   34.65,
   "D1":   36.71,
  "D#1":   38.89,
  "Eb1":   38.89,
   "E1":   41.20,
   "F1":   43.65,
  "F#1":   46.25,
  "Gb1":   46.25,
   "G1":   49.00,
  "G#1":   51.91,
  "Ab1":   51.91,
   "A1":   55.00,
  "A#1":   58.27,
  "Bb1":   58.27,
   "B1":   61.74,
   "C2":   65.41,
  "C#2":   69.30,
  "Db2":   69.30,
   "D2":   73.42,
  "D#2":   77.78,
  "Eb2":   77.78,
   "E2":   82.41,
   "F2":   87.31,
  "F#2":   92.50,
  "Gb2":   92.50,
   "G2":   98.00,
  "G#2":  103.83,
  "Ab2":  103.83,
   "A2":  110.00,
  "A#2":  116.54,
  "Bb2":  116.54,
   "B2":  123.47,
   "C3":  130.81,
  "C#3":  138.59,
  "Db3":  138.59,
   "D3":  146.83,
  "D#3":  155.56,
  "Eb3":  155.56,
   "E3":  164.81,
   "F3":  174.61,
  "F#3":  185.00,
  "Gb3":  185.00,
   "G3":  196.00,
  "G#3":  207.65,
  "Ab3":  207.65,
   "A3":  220.00,
  "A#3":  233.08,
  "Bb3":  233.08,
   "B3":  246.94,
   "C4":  261.63,
  "C#4":  277.18,
  "Db4":  277.18,
   "D4":  293.66,
  "D#4":  311.13,
  "Eb4":  311.13,
   "E4":  329.63,
   "F4":  349.23,
  "F#4":  369.99,
  "Gb4":  369.99,
   "G4":  392.00,
  "G#4":  415.30,
  "Ab4":  415.30,
   "A4":  440.00,
  "A#4":  466.16,
  "Bb4":  466.16,
   "B4":  493.88,
   "C5":  523.25,
  "C#5":  554.37,
  "Db5":  554.37,
   "D5":  587.33,
  "D#5":  622.25,
  "Eb5":  622.25,
   "E5":  659.26,
   "F5":  698.46,
  "F#5":  739.99,
  "Gb5":  739.99,
   "G5":  783.99,
  "G#5":  830.61,
  "Ab5":  830.61,
   "A5":  880.00,
  "A#5":  932.33,
  "Bb5":  932.33,
   "B5":  987.77,
   "C6": 1046.50,
  "C#6": 1108.73,
  "Db6": 1108.73,
   "D6": 1174.66,
  "D#6": 1244.51,
  "Eb6": 1244.51,
   "E6": 1318.51,
   "F6": 1396.91,
  "F#6": 1479.98,
  "Gb6": 1479.98,
   "G6": 1567.98,
  "G#6": 1661.22,
  "Ab6": 1661.22,
   "A6": 1760.00,
  "A#6": 1864.66,
  "Bb6": 1864.66,
   "B6": 1975.53,
   "C7": 2093.00,
  "C#7": 2217.46,
  "Db7": 2217.46,
   "D7": 2349.32,
  "D#7": 2489.02,
  "Eb7": 2489.02,
   "E7": 2637.02,
   "F7": 2793.83,
  "F#7": 2959.96,
  "Gb7": 2959.96,
   "G7": 3135.96,
  "G#7": 3322.44,
  "Ab7": 3322.44,
   "A7": 3520.00,
  "A#7": 3729.31,
  "Bb7": 3729.31,
   "B7": 3951.07,
   "C8": 4186.01,
  "C#8": 4434.92,
  "Db8": 4434.92,
   "D8": 4698.64,
  "D#8": 4978.03,
  "Eb8": 4978.03
};

/*
 ****************@Modules********************
*/

var lastTime = 0;
function Animate(time=0){
	deltaTime = (time-lastTime)*.001;
	lastTime = time;
	Update(deltaTime);
	requestAnimationFrame(Animate)
}
window.onload = function(){
	Start();
	Animate(0);
}
