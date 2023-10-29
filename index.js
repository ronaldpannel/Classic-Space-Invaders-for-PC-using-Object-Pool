/**@type{HTMLCanvasElement} */

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;

    this.cols = 9;
    this.rows = 3;
    this.invaderSize = 40;
    this.waveArray = [];
    this.waveArray.push(new Wave(this));
    this.waveCount = 1;
    this.highScore = localStorage.getItem("classicSpaceHighScore") || 0;

    this.numberOfLasers = 10;
    this.laserPool = [];
    this.createLaserPool();

    this.fired = false;
    this.explosionSound = document.getElementById("explosionSound");
    this.laserSound = document.getElementById("laserSound");

    this.numberOfDeathStarBombs = 20;
    this.deathStarBombsArray = [];
    this.createDeathStarBombs();

    this.numberOfAsteroids = 10;
    this.asteroidsPool = [];
    this.createAsteroidPool();

    this.numBangSprites = 20;
    this.bangSpritePool = [];
    this.createBangSpritePool();

    this.rocksArray = [];
    this.createRocksArray();

    this.player = new Player(this);

    this.deathStar = new DeathStar(this);

    this.wave = new Wave(this);
    this.debug = false;
    this.gameOver = false;
    this.score = 0;
    this.spriteUpdate = false;
    this.spriteTimer = 0;
    this.spriteInterval = 250;

    //event listeners
    window.addEventListener("keydown", (e) => {
      if (e.key == "ArrowLeft") {
        this.player.speedX = -5;
      }
      if (e.key == "ArrowRight") {
        this.player.speedX = 5;
      }
      if (e.key == "f" && !this.fired) {
        this.player.shoot();
        this.fired = true;
      }
      if (e.key == "d") {
        this.debug = !this.debug;
      }
      if (e.key == "r" && this.gameOver) {
        location.reload();
      }
    });
    window.addEventListener("keyup", (e) => {
      this.player.speedX = 0;

      if (e.key == "f") {
        this.fired = false;
      }
    });
  }
  createLaserPool() {
    for (let i = 0; i < this.numberOfLasers; i++) {
      this.laserPool.push(new Laser(this));
    }
  }
  t;
  getLaser() {
    for (let i = 0; i < this.laserPool.length; i++) {
      if (this.laserPool[i].free) {
        return this.laserPool[i];
      }
    }
  }

  createDeathStarBombs() {
    for (let i = 0; i < this.numberOfDeathStarBombs; i++)
      this.deathStarBombsArray.push(new DeathStarBomb(this));
  }
  getDeathStarBomb() {
    for (let i = 0; i < this.deathStarBombsArray.length; i++) {
      if (this.deathStarBombsArray[i].free) {
        return this.deathStarBombsArray[i];
      }
    }
  }

  createBangSpritePool() {
    for (let i = 0; i < this.numBangSprites; i++) {
      this.bangSpritePool.push(new ExplosionSprite(this));
    }
  }

  getBangSprite() {
    for (let i = 0; i < this.bangSpritePool.length; i++) {
      if (this.bangSpritePool[i].free) {
        return this.bangSpritePool[i];
      }
    }
  }

  createAsteroidPool() {
    for (let i = 0; i < this.numberOfAsteroids; i++) {
      this.asteroidsPool.push(new Asteroid(this));
    }
  }

  getAsteroid() {
    for (let i = 0; i < this.asteroidsPool.length; i++) {
      if (this.asteroidsPool[i].free) {
        return this.asteroidsPool[i];
      }
    }
  }
  createRocksArray(x, y) {
    for (let i = 0; i < 5; i++) {
      x = 120 * i + 60;
      y = this.height - 80;
      this.rocksArray.push(new Rock(this, x, y));
    }
  }

  render(context, deltaTime) {
    this.laserPool.forEach((laser) => {
      laser.draw(context);
      laser.update();
    });
    this.player.draw(context);
    this.player.update();
    this.deathStar.draw(context);
    this.deathStar.update();

    this.waveArray.forEach((wave) => {
      wave.draw(context);
    });

    this.rocksArray.forEach((rock) => {
      rock.draw(context);
    });

    this.asteroidsPool.forEach((asteroid) => {
      asteroid.draw(context);
      asteroid.update();
      asteroid.initAsteroids();
    });
    this.deathStarBombsArray.forEach((bomb) => {
      bomb.draw(context);
      bomb.update();
    });

    this.bangSpritePool.forEach((bang) => {
      bang.draw(context);
      bang.update();
    });

    //periodically generate deathStar bombs
    if (this.deathStar.bombTimer < this.deathStar.bombInterval) {
      this.deathStar.bombTimer += deltaTime;
    } else {
      this.deathStar.bombTimer = 0;
      this.deathStar.dropBombs();
    }

    this.scoreboardText(context);
    this.updateHighScore();

    //spite Timing
    if (this.spriteTimer > this.spriteInterval) {
      this.spriteUpdate = true;
      this.spriteTimer = 0;
    } else {
      this.spriteUpdate = false;
      this.spriteTimer += deltaTime;
    }

    //remove bang sprite
    this.bangSpritePool = this.bangSpritePool.filter(
      (object) => !object.markedForDeletion
    );
    if (this.bangSpritePool.length <= 5) {
      // this.markedForDeletion = true;

    }
  }

  checkCollision(a, b) {
    let dx = a.x - b.x;
    let dy = a.y - b.y;
    let distance = Math.hypot(dx, dy);
    let sumOfRadii = a.radius + b.radius;
    return distance < sumOfRadii;
  }
  scoreboardText(context) {
    context.save();
    context.fillText(`Score ${this.score}`, 20, 40);
    context.fillText(`High Score ${this.highScore}`, 20, 80);
    context.fillText(`Wave ${this.waveCount}`, 20, 120);
    context.fillText(`Player Lives ${this.player.lives}`, 20, 160);
    if (this.gameOver) {
      context.textAlign = "center";
      context.font = "100px impact";
      context.fillText("GAME OVER", this.width * 0.5, this.height * 0.5);
      context.font = "25px impact";
      context.fillText(
        `Your Score was ${this.score} You Completed ${this.waveCount} Waves`,
        this.width * 0.5,
        this.height * 0.5 + 50
      );
      context.font = "20px impact";
      context.fillText(
        "Press 'R' to Restart!",
        this.width * 0.5,
        this.height * 0.5 + 80
      );
    }
    context.restore();
  }
  newWave() {
    if (
      Math.random() < 0.5 &&
      this.cols * this.invaderSize < this.width * 0.8
    ) {
      this.cols++;
    } else if (this.rows * this.invaderSize < this.height * 0.6) {
      this.rows++;
    }
    this.waveArray.push(new Wave(this));
  }
  updateHighScore() {
    if (this.score > localStorage.getItem("classicSpaceHighScore")) {
      localStorage.setItem("classicSpaceHighScore", this.score);
      let hsScore = localStorage.getItem("classicSpaceHighScore");
      this.highScore = hsScore;
    }
  }
}
window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 600;
  canvas.height = 600;

  ctx.fillStyle = "white";
  ctx.strokeStyle = "white";
  ctx.lineWidth = 3;
  ctx.font = "20px impact";

  const game = new Game(canvas);

  let lastTime = 0;
  function animate(timeStamp) {
    let deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render(ctx, deltaTime);
    requestAnimationFrame(animate);
  }
  animate(0);
});
