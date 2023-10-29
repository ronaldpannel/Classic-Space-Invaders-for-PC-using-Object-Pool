class DeathStarBomb {
  constructor(game) {
    this.game = game;
    this.x = 0;
    this.y = 0;
    this.radius = 10;
    this.speedY = Math.floor(Math.random() * (3 - 1.5) + 1.5);
    this.free = true;
    this.markedForDeletion = false;

    this.image = document.getElementById("deathStarBombImg");
  }
  draw(context) {
    if (!this.free) {
      context.drawImage(this.image, this.x - this.radius, this.y - this.radius);
      if (this.game.debug) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.stroke();
      }
    }
  }
  update() {
    if (!this.free) {
      this.y += this.speedY;

      if (this.y > this.game.height + this.radius) {
        this.reset();
      }
      //deathStar Bomb /' rock collision
      this.game.deathStarBombsArray.forEach((bomb) => {
        this.game.rocksArray.forEach((rock) => {
          if (!this.free && this.game.checkCollision(bomb, rock)) {
            this.markedForDeletion = true;
            bomb.reset();
          }
        });
      });

      //deathStar bomb / laser collision
      this.game.deathStarBombsArray.forEach((bomb) => {
        this.game.laserPool.forEach((laser) => {
          if (
            !this.free &&
            !laser.free &&
            this.game.checkCollision(bomb, laser)
          ) {
            if (!this.game.gameOver) {
              this.game.score += 10;
              this.game.explosionSound.currentTime = 0;
              this.game.explosionSound.play();
            }
            bomb.reset();
            laser.reset();
          }
        });
      });

      // deathStar bomb player collision
      this.game.deathStarBombsArray.forEach((bomb) => {
        if (!bomb.free && this.game.checkCollision(bomb, this.game.player)) {
          bomb.reset();
          this.game.gameOver = true;
        }
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
