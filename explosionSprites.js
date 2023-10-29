class ExplosionSprite {
  constructor(game) {
    this.game = game;
    this.x = 0;
    this.y = 0;
    this.radius = 25;
    this.spriteWidth = 50;
    this.spriteHeight = 36;
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrames = 4;
    this.markedForDeletion = false;
    this.free = true;

    this.image = document.getElementById("boomImg");
  }
  draw(context) {
    if (!this.free) {
      context.drawImage(
        this.image,
        this.frameX * this.spriteWidth,
        0,
        this.spriteWidth,
        this.spriteHeight,
        this.x - this.radius,
        this.y - this.radius,
        this.spriteWidth,
        this.spriteHeight
      );
      if (this.game.debug) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.stroke();
      }
    }
  }
  update() {
    if (!this.free) {
      if (this.frameX < this.maxFrames) {
        if (this.game.spriteUpdate){
        this.frameX++;
        }
      } else {
        this.frameX = 0;
        this.markedForDeletion = false
        this.reset();
      }
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
