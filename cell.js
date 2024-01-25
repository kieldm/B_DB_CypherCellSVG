class Cell {
  constructor(){
    this.cellPoints = [];

    for(var m = 0; m <= ringCount; m++){
      this.cellPoints[m] = [];
      for(var n = 0; n <= pieCount; n++){
        this.cellPoints[m][n] = new CellPoint(m, n);
      }
    }
  }

  run(){
    this.update();
    this.display();
  }

  update(){
    for(var m = 0; m <= ringCount; m++){
      for(var n = 0; n <= pieCount; n++){
        this.cellPoints[m][n].run();
      }
    }
  }

  display(){
    strokeWeight(0.25);
    stroke(foreColor);
    noFill();
    // noStroke();

    /////////// CELL
    for(var m = 0; m < ringCount; m++){
      for(var n = 0; n < pieCount; n++){
        fill(this.cellPoints[m][n].fColor);

        beginShape();
          vertex(this.cellPoints[m][n].x, this.cellPoints[m][n].y);
          vertex(this.cellPoints[m][n].xOut, this.cellPoints[m][n].yOut);
          vertex(this.cellPoints[m][n + 1].xOut, this.cellPoints[m][n + 1].yOut);
          vertex(this.cellPoints[m][n + 1].x, this.cellPoints[m][n + 1].y);
        endShape(CLOSE);
      }
    }

    /////////// LABEL
    for(var m = 0; m < ringCount; m++){
      for(var n = 0; n < pieCount; n++){
        if(this.cellPoints[m][n].label){
          textSize(10);
          noStroke();
          fill(foreColor);

          var labelX = round(this.cellPoints[m][n].x);
          var labelY = round(this.cellPoints[m][n].y);

          text(labelX + ", " + labelY, this.cellPoints[m][n].x, this.cellPoints[m][n].y)
        }
      }
    }
  }

  pressed(){
    for(var m = 0; m <= ringCount; m++){
      for(var n = 0; n <= pieCount; n++){
        this.cellPoints[m][n].pressed();
      }
    }
  }

  moved(){
    for(var m = 0; m <= ringCount; m++){
      for(var n = 0; n <= pieCount; n++){
        this.cellPoints[m][n].moved();
      }
    }
  }
}