class DeathStar {
  constructor(game) {
    this.game = game;
    this.x = this.game.width * 0.5;
    this.y = 42;
    if (Math.random() < 0.5) {
      this.speedX = 2;
    } else {
      this.speedX = -2;
    }
    this.bombTimer = 0
    this.bombInterval = 500

    this.radius = 30;

    this.image = document.getElementById("deathStarImg");
  }
  update() {
    this.x += this.speedX;

    //edges
    if (this.x > this.game.width - this.radius || this.x < this.radius) {
      this.speedX *= -1;
    }
  }
  draw(context) {
    context.drawImage(
      this.image,
      this.x - this.radius + 5,
      this.y - this.radius + 3
    );
    if (this.game.debug) {
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      context.stroke();
    }
  }
  dropBombs() {
    const bomb = this.game.getDeathStarBomb();
    if (bomb && !this.game.gameOver) bomb.start(this.x, this.y);
  }
}
