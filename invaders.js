class Invader {
  constructor(game, positionX, positionY) {
    this.game = game;
    this.x = 0;
    this.y = 0;
    this.radius = this.game.invaderSize / 2;
    this.positionX = positionX;
    this.positionY = positionY;
    this.markedForDeletion = false;

    this.image = document.getElementById("invaderImg");
  }
  update(x, y) {
    this.x = x + this.positionX;
    this.y = y + this.positionY;
    // laser invader collision
    this.game.laserPool.forEach((laser) => {
      if (!laser.free && this.game.checkCollision(this, laser)) {
        this.markedForDeletion = true;
        laser.reset();
        this.animateBangSprite();
        if (!this.game.gameOver) {
          this.game.score++;
          this.game.explosionSound.currentTime = 0;
          this.game.explosionSound.play();
        }
      }
    });

    //check collision invaders player
    if (this.game.checkCollision(this, this.game.player)) {
      this.markedForDeletion = true;
      if (!this.game.gameOver && this.game.score > 0) {
        this.game.score--;
        this.game.player.lives--;
        if (this.game.player.lives < 1) {
          this.game.gameOver = true;
        }
      }
    }

    //loose condition
    if (this.y + this.radius > this.game.height) {
      this.game.gameOver = true;
      this.markedForDeletion = true;
    }
  }
  animateBangSprite() {
    const bang = this.game.getBangSprite();
    if (bang && !this.game.gameOver) bang.start(this.x, this.y);
  }

  draw(context) {
    context.drawImage(this.image, this.x - this.radius, this.y - this.radius);
    if (this.game.debug) {
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      context.stroke();
    }
  }
}

class Wave {
  constructor(game) {
    this.game = game;
    this.width = this.game.cols * this.game.invaderSize;
    this.height = this.game.rows * this.game.invaderSize;
    this.x = 0;
    this.y = -this.height;
    this.speedX = 2;
    this.speedY = 0;
    this.invadersArray = [];
    this.nextWaveTrigger = false;
    this.createInvadersArray();
  }
  draw(context) {
    if (this.y < 0) {
      this.y += 5;
    }
    this.speedY = 0;
    if (this.game.debug) {
      context.beginPath();
      context.rect(this.x, this.y, this.width, this.height);
      context.stroke();
    }

    if (this.x > this.game.width - this.width || this.x < 0) {
      this.speedX *= -1;
      this.speedY = this.game.invaderSize;
    }

    this.x += this.speedX;
    this.y += this.speedY;

    this.invadersArray.forEach((invader) => {
      invader.update(this.x, this.y);
      invader.draw(context);
    });
    //remove destroyed invaders
    this.invadersArray = this.invadersArray.filter(
      (object) => !object.markedForDeletion
    );

    this.game.waveArray.forEach((wave) => {
      if (
        this.invadersArray.length < 1 &&
        !this.nextWaveTrigger &&
        !this.game.gameOver
      ) {
        this.game.newWave();
        this.game.waveCount++;
        this.game.player.lives++;
        this.nextWaveTrigger = true;
      }
    });
  }

  createInvadersArray() {
    for (let y = 0; y < this.game.rows; y++) {
      for (let x = 0; x < this.game.cols; x++) {
        let invaderX = x * this.game.invaderSize + 20;
        let invaderY = y * this.game.invaderSize + 20;
        this.invadersArray.push(new Invader(this.game, invaderX, invaderY));
      }
    }
  }
}
