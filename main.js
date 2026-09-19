window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1300;
    canvas.height = 600;

    let gamepadIndex = null;


    class Player {
         constructor(canvasWidth, canvasHeight){
              this.canvasWidth = canvasWidth;
              this.canvasHeight = canvasHeight;
              this.image = document.getElementById('player');
              this.spriteWidth = 92;
              this.spriteHeight = 92;
              this.width = this.spriteWidth;
              this.height = this.spriteHeight;
              this.scale = 2;
              this.x = this.canvasWidth/13 - this.width/2;
              this.y = this.canvasHeight/13 - this.height/2;
              this.minFrame = 0;
              this.maxFrame = 8;
              this.frameX = 0;
              this.frameY = 0;

              this.frameTimer = 0;
              this.frameInterval = 4;

              this.vy = 0;

         }
         draw(context){
              context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width * this.scale, this.height * this.scale);
         }
         update(){

              this.frameTimer++;

              // Pas na 10 frames naar het volgende sprite-frame
              if(this.frameTimer >= this.frameInterval){
                   this.frameTimer = 0;

                   if (this.frameX < 7) this.frameX++
                   else this.frameX = this.minFrame;
              }

              this.vy += 0.30;
              this.y += this.vy

              if (this.y >= canvas.height - 145){
                   this.y = canvas.height - 145;
              }
              if(this.y >= canvas.height - 145){

                   this.y = canvas.height - 145;
                   this.vy = 0;

                   // terug naar idle animation
                   this.frameY = 0;
              } 
         }
    }

    const player = new Player(canvas.width, canvas.height);

    function animate(){

         if (gamepadIndex !== null) {
              const gamepads = navigator.getGamepads();
              const gp = gamepads[gamepadIndex];
     
              if (gp && gp.buttons[0].pressed) {
                   // Dit voert direct uit zolang je A ingedrukt houdt
                   player.frameY += 1;
                   player.vy = -8;
              }
         }

         ctx.clearRect(0, 0, canvas.width, canvas.height);
         player.draw(ctx);
         player.update();
         requestAnimationFrame(animate);
    }
    animate();

    addEventListener('keydown', function(e){
         if (e.code === 'Space'){
              player.frameY += 1;
              player.vy = -8;
         }
    });
    window.addEventListener("gamepadconnected", function(e) {
         gamepadIndex = e.gamepad.index;
    });

    window.addEventListener("gamepaddisconnected", function(e) {
         if (gamepadIndex === e.gamepad.index) gamepadIndex = null;

    });
});



