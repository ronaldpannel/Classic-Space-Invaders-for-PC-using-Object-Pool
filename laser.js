class Laser {
  constructor(game) {
    this.game = game;
    this.x = 0;
    this.y = 0;
    this.radius = 5;
    this.free = true;
  }
  draw(context) {
    if (!this.free) {
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      this.speedY = 20;
      context.fill();
    }
  }
  update() {
    if (!this.free) {
      this.y -= this.speedY;
      //reset laser
      if (this.y < 0) this.reset();
       
      //laser rock collision
      this.game.rocksArray.forEach((rock) => {
        this.game.laserPool.forEach((laser) => {
          if (!laser.free && this.game.checkCollision(rock, laser)) {
            this.reset();
          }
        });
      });
    }
  }
  start(x, y) {
    this.x = x;
    this.y = y;
    this.free = false;
  }
  reset() {
    this.free = true;
  }
}
