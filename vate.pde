

void setup() {
  size(630, 360);
  PFont f = createFont("Arial", 24);
  textFont(f);
  this.puts(this);
}

void draw() {
  background(102);
  fill(0);
  text(this.getHello(), width * 0.50, height * 0.50);
}



