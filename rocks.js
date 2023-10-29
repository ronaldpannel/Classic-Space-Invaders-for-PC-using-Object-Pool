class Rock {
  constructor(game, x, y) {
    this.game = game;
    this.x = x
    this.y = y
    this.radius = 25;

    this.image = document.getElementById("rockImg");
  }
  draw(context) {
    context.drawImage(this.image,this.x-this.radius, this.y - this.radius)
    if(this.game.debug){
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      context.stroke();

    }
    
  }
}
