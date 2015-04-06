interface Vate {
  String hello();
  void puts(Object);
}

Vate vate;

void setup() {
  vate = this.vate();
  vate.puts(this); 

  size(630, 360);
  PFont f = createFont("Arial", 24);
  textFont(f);
}

void draw() {
  background(102);
  fill(0);
  text(vate.hello(), width * 0.50, height * 0.50);
  vate.draw();
}



