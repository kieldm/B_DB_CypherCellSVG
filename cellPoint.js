class CellPoint {
  constructor(rPoint, pPoint){
    this.rPoint = rPoint;
    this.pPoint = pPoint;

    this.rDist = (outerRad - innerRad)/ringCount;
    this.ang = TWO_PI/pieCount;

    this.currentRad = 0;
    this.currentRadOut = 0;
    this.updateRad();

    this.currentAng = this.pPoint * this.ang + animAng[this.rPoint];
    this.coreX = width/2 + cos(this.currentAng) * (innerRad + this.currentRad);
    this.coreY = height/2 + sin(this.currentAng) * (innerRad + this.currentRad);
    this.x = this.coreX;
    this.y = this.coreY;

    this.coreXout = width/2 + cos(this.currentAng) * (innerRad + this.currentRadOut);
    this.coreYout = height/2 + sin(this.currentAng) * (innerRad + this.currentRadOut);
    this.xOut = this.coreXout;
    this.yOut = this.coreYout;

    this.nSpeed = 0.0025;
    this.nXspeed = 0.005;
    this.nYspeed = 0.001;
    this.nDetail = 0.005;
    this.nRad = 40;

    this.fColor = color("#000000");

    this.colorTicker = 0;

    this.label = false;
    if(random(10) < 1){
      this.label = true;
    }
  }

  updateRad(){
    for(var r = 0; r < this.rPoint; r++){
      this.currentRad += map(noise(r * 0.5, frameCount * 0.0025), 0, 1, this.rDist/4, this.rDist * 3);
    }
    this.currentRadOut = this.currentRad + map(noise(this.rPoint * 0.5, frameCount * 0.0025), 0, 1, this.rDist/4, this.rDist * 3);
  }

  run(){
    this.update();
  }

  update(){
    if(animAngTicker[this.rPoint] > 0){
      this.animAngle();
    }

    if(this.colorTicker > 0 || this.fColor != bkgdColor){
      this.animColor();
    }

    ////////////////////// CORE RADIAL NOISE
    this.currentRad = 0;
    this.currentRadOut = 0;
    this.updateRad();

    this.currentAng = this.pPoint * this.ang + animAng[this.rPoint];
    this.coreX = width/2 + cos(this.currentAng) * (innerRad + this.currentRad);
    this.coreY = height/2 + sin(this.currentAng) * (innerRad + this.currentRad);

    this.coreXout = width/2 + cos(this.currentAng) * (innerRad + this.currentRadOut);
    this.coreYout = height/2 + sin(this.currentAng) * (innerRad + this.currentRadOut);

    ////////////////////// IND NOISE
    var tkn = noise(this.coreX * this.nDetail + frameCount * this.nXspeed, this.coreY * this.nDetail + frameCount * this.nYspeed, frameCount * this.nSpeed);
    var noiser = map(tkn, 0, 1, -PI, PI);

    this.x = this.coreX + cos(noiser) * this.nRad;
    this.y = this.coreY + sin(noiser) * this.nRad;

    var tknOut = noise(this.coreXout * this.nDetail + frameCount * this.nXspeed, this.coreYout * this.nDetail + frameCount * this.nYspeed, frameCount * this.nSpeed);
    var noiser = map(tknOut, 0, 1, -PI, PI);

    this.xOut = this.coreXout + cos(noiser) * this.nRad;
    this.yOut = this.coreYout + sin(noiser) * this.nRad;
  }

  pressed(){
    ///////////////////// DETECT FOR ANG ANIM
    var distAway = dist(width/2, height/2, mouseX, mouseY);
    var distIn = dist(width/2, height/2, this.coreX, this.coreY);
    var distOut = dist(width/2, height/2, this.xOut, this.yOut);

    if(distAway > distIn && distAway < distOut){
    // if(mouseX > this.x - 20 && mouseX < this.x + 20 && mouseY > this.y - 20 && mouseY < this.y + 20){
      // var rs0 = int(random(1, 5));
      var rs0 = int(random(4, 10));

      var direct = 1;
      if(random(10) < 5){
        direct *= -1;
      }

      animAngHold[this.rPoint] = animAng[this.rPoint];
      animAngTarget[this.rPoint] = direct * rs0 * this.ang;
      animAngWindow[this.rPoint] = int(random(55, 120));
      animAngTicker[this.rPoint] = animAngWindow[this.rPoint];

      if(this.rPoint > 1){
        animAngHold[this.rPoint - 1] = animAng[this.rPoint - 1];
        animAngTarget[this.rPoint - 1] = -direct * round(rs0 * 2/3) * this.ang;
        animAngWindow[this.rPoint - 1] = int(random(20, 60));
        animAngTicker[this.rPoint - 1] = animAngWindow[this.rPoint - 1];
      }
      if(this.rPoint > 2){
        animAngHold[this.rPoint - 2] = animAng[this.rPoint - 2];
        animAngTarget[this.rPoint - 2] = direct * round(rs0 * 1/4) * this.ang;
        animAngWindow[this.rPoint - 2] = int(random(5, 20));
        animAngTicker[this.rPoint - 2] = animAngWindow[this.rPoint - 2];
      }

      if(this.rPoint < ringCount - 2){
        animAngHold[this.rPoint + 1] = animAng[this.rPoint + 1];
        animAngTarget[this.rPoint + 1] = -direct * round(rs0 * 2/3) * this.ang;
        animAngWindow[this.rPoint + 1] = int(random(20, 60));
        animAngTicker[this.rPoint + 1] = animAngWindow[this.rPoint + 1];
      }
      if(this.rPoint < ringCount - 3){
        animAngHold[this.rPoint + 2] = animAng[this.rPoint + 2];
        animAngTarget[this.rPoint + 2] = direct * round(rs0 * 1/4) * this.ang;
        animAngWindow[this.rPoint + 2] = int(random(5, 20));
        animAngTicker[this.rPoint + 2] = animAngWindow[this.rPoint + 2];
      }
    }

    ///////////////////// DETECT FOR COLOR
    var distMouse = dist(this.x, this.y, mouseX, mouseY);

    ////// OPT 1;
    if(distMouse < 500){
      this.colorTicker = map(distMouse, 500, 0, 0, 120) + random(-20, 20);
    }

    ////// OPT 2;
    // if(distMouse < 500){
    //   var tempTicker = random(50, 120);
    //   var resDist = map(distMouse, 0, 500, 1, 0);
    //   if(random(10) < 3){
    //     resDist = 0;
    //   }
    //   tempTicker *= resDist;
    //   this.colorTicker += tempTicker;
    // }

    ////// OPT 3;
    // if(distMouse < 500){
    //   var tempTicker = random(80, 100);
    //   var resDist = map(distMouse, 0, 500, random(2, 0.5), 0.25);
    //   if(random(10) < 3){
    //     resDist = 0;
    //   }
    //   tempTicker *= resDist;
    //   this.colorTicker += tempTicker;
    // }
   }

  moved(){
    var distMouse = dist(this.x, this.y, mouseX, mouseY);

    ////// OPT 1;
    // if(distMouse < 300){
    //   var ranWindow = random(-2, 10);
    //   this.colorTicker += map(distMouse, 300, 0, 0, ranWindow);
    // }

    ////// OPT 2;
    if(distMouse < 300){
      var tempTicker = map(distMouse, 300, 0, 0, 2.5);
      
      var scatterFactor = map(distMouse, 300, 0, random(0.25), random(1, 4));
      tempTicker *= scatterFactor;

      this.colorTicker += tempTicker;
    }
  }

  randomAdd(){
    var thisNoise = noise(this.x * 0.0025, this.y * 0.0025, frameCount * 0.01);

    if(thisNoise > 0.5){
      var tempTicker = map(thisNoise, 0.5, 1, 0, 5);

      var scatterFactor = map(thisNoise, 0.5, 1, random(3, 4), random(1,2));
      tempTicker *= scatterFactor;

      this.colorTicker += tempTicker;
    }
  }

  animAngle(){
    this.currentAng = this.pPoint * this.ang + animAng[this.rPoint];
    this.coreX = width/2 + cos(this.currentAng) * (innerRad + this.rPoint * this.rDist);
    this.coreY = height/2 + sin(this.currentAng) * (innerRad + this.rPoint * this.rDist);
    this.coreXout = width/2 + cos(this.currentAng) * (innerRad + (this.rPoint + 1) * this.rDist);
    this.coreYout = height/2 + sin(this.currentAng) * (innerRad + (this.rPoint + 1) * this.rDist);  
  
    this.x = this.coreX;
    this.y = this.coreY;
    this.xOut = this.coreXout;
    this.yOut = this.coreYout;
  }

  animColor(){
    // this.colorTicker -= 0.5;
    this.colorTicker -= random(0.25, 0.75);

    if(this.colorTicker > 120){
      this.colorTicker = 120;
    }
    if(this.colorTicker < 0){
      this.colorTicker = 0;
    }

    //////////// FULL SPECTRUM
    // if(this.colorTicker >= 80){
    //   var tk0 = map(this.colorTicker, 120, 80, 0, 1);
    //   this.fColor = lerpColor(colorA[0], colorA[1], tk0);
    // } else if(this.colorTicker >= 60){
    //   var tk0 = map(this.colorTicker, 80, 60, 0, 1);
    //   this.fColor = lerpColor(colorA[1], colorA[2], tk0);
    // } else if(this.colorTicker >= 40){
    //   var tk0 = map(this.colorTicker, 60, 40, 0, 1);
    //   this.fColor = lerpColor(colorA[2], colorA[3], tk0);
    // } else if(this.colorTicker >= 20){
    //   var tk0 = map(this.colorTicker, 40, 20, 0, 1);
    //   this.fColor = lerpColor(colorA[3], colorA[4], tk0);
    // } else if(this.colorTicker > 0) {
    //   var tk0 = map(this.colorTicker, 20, 0, 0, 1);
    //   this.fColor = lerpColor(colorA[4], bkgdColor, tk0);
    // } else {
    //   this.fColor = bkgdColor;
    // }

    //////////// RING SPECTRUM
    // var tk0 = map(this.colorTicker, 120, 0, 0, 1);
    // this.fColor = lerpColor(colorA[this.rPoint%colorCount], bkgdColor, tk0);
  
    //////////// RING SPECTRUM TWO
    // if(this.colorTicker >= 50){
    //   var tk0 = map(this.colorTicker, 120, 50, 0, 1);
    //   this.fColor = lerpColor(colorA[this.rPoint%colorCount], colorA[(this.rPoint + 1)%colorCount], tk0);      
    // } else {
    //   var tk0 = map(this.colorTicker, 50, 0, 0, 1);
    //   this.fColor = lerpColor(colorA[(this.rPoint + 1)%colorCount], bkgdColor, tk0);
    // }

    //////////// RING SPECTRUM TWO
    if(this.colorTicker >= 66){
      var tk0 = map(this.colorTicker, 120, 66, 0, 1);
      this.fColor = lerpColor(colorA[this.rPoint%colorCount], colorA[(this.rPoint + 1)%colorCount], tk0);      
    } else if(this.colorTicker >= 33){
      var tk0 = map(this.colorTicker, 66, 33, 0, 1);
      this.fColor = lerpColor(colorA[(this.rPoint + 1)%colorCount], colorA[(this.rPoint + 2)%colorCount], tk0);
    } else {
      var tk0 = map(this.colorTicker, 33, 0, 0, 1);
      this.fColor = lerpColor(colorA[(this.rPoint + 2)%colorCount], bkgdColor, tk0);
    }
  }
}