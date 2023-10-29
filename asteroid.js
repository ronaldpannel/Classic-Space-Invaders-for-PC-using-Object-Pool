class Asteroid {
  constructor(game) {
    this.game = game;
    this.x = 0;
    this.y = 0;
    this.r = Math.random() * (4 - 2) + 2;
    this.velX = -3;
    this.velY = 3;
    this.color = "rgba(255, 255, 255, 1)";
    this.history = [];
    this.timer = 0;
    this.interval = 500;
    this.free = true;
  }
  update() {
     
      this.x += this.velX;
      this.y += this.velY;
      let v = { x: this.x, y: this.y };
      this.history.push(v);
  }
  draw(context) {
    if (!this.free) {
      context.save();
      context.beginPath();
      context.fillStyle = 'red';
      context.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      context.fill();

      for (let i = 0; i < this.history.length; i++) {
        if (this.history[i].x < Math.random() * (200 - 150) +150 || this.history[i].y > Math.random() * (320 - 220) + 220)  {
          context.beginPath();
          context.fillStyle = "rgba(255, 149, 0, .8)";
          context.arc(
            this.history[i].x,
            this.history[i].y,
            this.r * 0.5,
            0,
            Math.PI * 2
          );
          context.fill();
          if (this.history.length > 100) {
            this.history.splice(i, 1);
          }
        }
      }
      context.restore();
      if(!this.free && this.y > this.game.height + 50 || this.x < -50){
        this.reset()
      }
    }
  }
  start(x, y) {
    this.x = x;
    this.y = y;
    this.history =[]
    this.free = false;
  }
  reset() {
    this.free = true;
  }
  initAsteroids() {
    this.timer++
    if(this.timer% 100 == 0 && !this.game.gameOver){
       const asteroid = this.game.getAsteroid();
       if (asteroid)
         asteroid.start(
           Math.random() * (650 - 550) + 500,
           Math.random() * (400 - -30) + 30
         );

         if(this.timer > 5000){
          this.timer = 0
         }

    }
   
  }
}
