var bkgdColor, foreColor;
var colorCount;
var colorA = [];

var coreCell;

var outerRad = 500;
var innerRad = 100;

var ringCount = 8;
var pieCount = 80;
// var ringCount = 20;
// var pieCount = 60;

var animAng = [];
var animAngHold = [];
var animAngTarget = [];
var animAngTicker = [];
var animAngWindow = [];

var exportOn = false;

function preload(){
  tFont = loadFont("resources/Inter-Regular.ttf");
}

function setup(){
  createCanvas(windowWidth,windowHeight);

  bkgdColor = color('#000000');
  foreColor = color('#ffffff');  

  // OLD
  // colorA[0] = color('#EF1B17');
  // colorA[1] = color('#FFE503');
  // colorA[2] = color('#02BA1E');
  // colorA[3] = color('#2135BE');
  // colorA[4] = color('#A61CC8');

  // REMIX
  // colorA[4] = color('#EF1B17');
  // colorA[0] = color('#FFE503');
  // colorA[3] = color('#02BA1E');
  // colorA[1] = color('#2135BE');
  // colorA[2] = color('#A61CC8');

  /////////////////// GUIDELINES
  colorCount = 8
  colorA[0] = color('#6B1A80');
  colorA[1] = color('#E34D5F');
  colorA[2] = color('#FF808F');
  colorA[3] = color('#DF4599');
  colorA[4] = color('#8E1580');
  colorA[5] = color('#2E63B7');
  colorA[6] = color('#155E89');
  colorA[7] = color('#81C2B9');

  // REMIXED
  // colorCount = 8
  // colorA[0] = color('#6B1A80');
  // colorA[7] = color('#E34D5F');
  // colorA[2] = color('#FF808F');
  // colorA[6] = color('#DF4599');
  // colorA[3] = color('#8E1580');
  // colorA[4] = color('#2E63B7');
  // colorA[1] = color('#155E89');
  // colorA[5] = color('#81C2B9');

  // frameRate(6);
  rectMode(CENTER);
  noiseDetail(6, 0.25);

  for(var m = 0; m < ringCount; m++){
    animAng[m] = 0;
    animAngHold[m] = 0;
    animAngTarget[m] = 0;
    animAngTicker[m] = 0;
    animAngWindow[m] = 0;
  }

  coreCell = new Cell();
}

function draw() {
  background(bkgdColor);

  push();
    coreCell.run();
  pop();

  animateCypher();

  if(exportOn){
    save("decodingBio.svg");
    exportOn = false;

    resizeCanvas(windowWidth,windowHeight);
  }
}

function mouseMoved() {
  coreCell.moved();
}

function mousePressed() {
  coreCell.pressed();
}

function animateCypher(){
  for(var m = 0; m < ringCount; m++){
    if(animAngTicker[m] > 0){
      var tk0 = map(animAngTicker[m], animAngWindow[m], 0, 0, 1);
      animAng[m] = map(easeInOutExpo(tk0), 0, 1, animAngHold[m], animAngTarget[m]);

      animAngTicker[m] --;
    }
  }
}

function keyPressed(){
  if(key == 's'){
    createCanvas(windowWidth,windowHeight, SVG);
    exportOn = true;
  }
}