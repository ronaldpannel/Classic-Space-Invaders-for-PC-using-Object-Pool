class Player {
  constructor(game) {
    this.game = game;
    this.x = this.game.width * 0.5;
    this.y = this.game.height - 30;
    this.radius = 20;
    this.speedX = 0;
    this.lives = 3

    this.image = document.getElementById("player");
  }
  update() {
    this.x += this.speedX;

    //edges
    if (this.x > this.game.width - this.radius) {
      this.x = this.game.width - this.radius;
      this.speedX = 0;
    }
    if (this.x < this.radius) {
      this.x = this.radius;
      this.speedX = 0;
    }
  }
  draw(context) {
    context.drawImage(this.image, this.x - this.radius, this.y - this.radius);
    if (this.game.debug) {
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      context.stroke();
    }
  }
  shoot() {
    const laser = this.game.getLaser();
    if (laser){
      laser.start(this.x, this.y);
      if(!this.game.gameOver){
        this.game.laserSound.currentTime = 0;
        this.game.laserSound.play();

      }
      
    }
  }
}
