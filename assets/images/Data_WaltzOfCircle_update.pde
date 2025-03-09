/*
  based on: https://observablehq.com/@rreusser/instanced-webgl-circles
*/
// Set up some constant
import ddf.minim.*;
import ddf.minim.analysis.*;

Minim minim;
AudioPlayer song;
FFT fftLin;


final int MAX_CIRCLE_CNT = 2500, MIN_CIRCLE_CNT = 100, 
  MAX_VERTEX_CNT = 30, MIN_VERTEX_CNT = 3;

// Set two global variables: the number of circles in the picture and the number of vertices constituting the circle
int circleCnt, vertexCnt;

void setup() {
  size(700, 700);  
  
  minim = new Minim(this);
  song = minim.loadFile("onepiece.mp3", 2048);
  song.loop();
  
  fftLin = new FFT( song.bufferSize(), song.sampleRate() );
  fftLin.linAverages(512); //divide the whole spectrum into 30 parts
}

void draw() {
  background(0);
  translate(width / 2, height / 2);

  updateCntByMusic(); //inertaction part

  //Control the velocity, distrubution, and scale, and the two "for" used to conctrol both the cicle and vertex.
  for (int ci = 0; ci < circleCnt; ci++) {
    float time = float(frameCount) / 20;
    float thetaC = map(ci, 0, circleCnt, 0, TAU); //TAU is a mathematical constant with the value 6.2831855. It is the circle constant relating the circumference of a circle to its linear dimension, the ratio of the circumference of a circle to its radius. It is useful in combination with trigonometric functions such as sin() and cos()
    float scale = 300;

    //To get every circle's center, radius, and color.
    PVector circleCenter = getCenterByTheta(thetaC, time, scale);
    float circleSize = getSizeByTheta(thetaC, time, scale);
    color c = getColorByTheta(thetaC, time);

    //Display every vertex of a circle
    stroke(c);
    noFill();
    beginShape();
    for (int vi = 0; vi < vertexCnt; vi++) {
      float thetaV = map(vi, 0, vertexCnt, 0, TAU);
      float x = circleCenter.x + cos(thetaV) * circleSize;
      float y = circleCenter.y + sin(thetaV) * circleSize;
      vertex(x, y);
    }
    endShape(CLOSE); // to connect the last dots with the first dots make it become a close shape 
  }
}

void updateCntByMusic() {
   
   float songSale =song.mix.level();//I have not learning how to add buffer so it seems alittle bit wierd
   //println("songSale"+songSale);
   float cf= 0; // define center frequency
   fftLin.forward(song.mix);//perform a forward FFT on the samples in jingle's mix buffer
   
   for(int i=0;i< fftLin.avgSize(); i++){
     // cf = fftLin.getAverageCenterFrequency(i);
      cf = fftLin.indexToFreq(i);
      println("cf"+255*cf*0.0001);
  }
   circleCnt = int(map(255*cf*0.0001,0,width/2,MAX_CIRCLE_CNT, MIN_CIRCLE_CNT));
   vertexCnt = int(map(255*songSale*10, 0.2, height / 2, MAX_VERTEX_CNT, MIN_VERTEX_CNT));
}

//void updateCntByMouse() {
//  float xoffset = abs(mouseX - width / 2), yoffset = abs(mouseY - height / 2); //use the mouse position to define the ordinate
//  circleCnt = int(map(xoffset, 0, width / 2, MAX_CIRCLE_CNT, MIN_CIRCLE_CNT)); //The constant is set to control the whole structure
//  vertexCnt = int(map(yoffset, 0, height / 2, MAX_VERTEX_CNT, MIN_VERTEX_CNT));
//}

PVector getCenterByTheta(float theta, float time, float scale) {
  PVector direction = new PVector(cos(theta), sin(theta));
  float distance = 0.6 + 0.2 * cos(theta * 6.0 + cos(theta * 8.0 + time));
  PVector circleCenter =PVector.mult(direction, distance * scale);
  return circleCenter;
}

float getSizeByTheta(float theta, float time, float scale) {
  float offset = 0.2 + 0.12 * cos(theta * 9.0 - time * 2.0);
  float circleSize = scale * offset;
  return circleSize;
}

color getColorByTheta(float theta, float time) {
  float th = 8.0 * theta + time * 2.0;
  float r = 0.6 + 0.4 * cos(th), 
    g = 0.6 + 0.4 * cos(th - PI / 3), 
    b = 0.6 + 0.4 * cos(th - PI * 2.0 / 3.0), 
    alpha = map(circleCnt, MIN_CIRCLE_CNT, MAX_CIRCLE_CNT, 150, 30);
  return color(r * 255, g * 255, b * 255, alpha);
}
