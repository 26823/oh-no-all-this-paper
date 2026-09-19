window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1300;
    canvas.height = 600;

    let gamepadIndex = null;
    let aButtonLocked = false; // Houdt bij of de knop al ingedrukt was
    let xButtonLocked = false; // Houdt bij of de knop al ingedrukt was
    



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
              this.y = this.canvasHeight/2 - this.height/2;
              this.minFrame = 0;
              this.maxFrame = 8;
              this.frameX = 0;
              this.frameY = 0;

              this.frameTimer = 0;
              this.frameInterval = 4;
              this.attacking = false;
              this.attackTimer = 0;

              this.vy = 0;
              this.onGround = true; // <-- STAP 1: Volg de status van de speler

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

              if (this.y >= canvas.height - 170){
                   this.y = canvas.height - 170;
              }
              if(this.y >= canvas.height - 170){

                   this.y = canvas.height - 170;
                   this.vy = 0;
                   this.onGround = true; // <-- STAP 2: Speler raakt de grond weer

                   // terug naar idle animation
                   this.frameY = 0;
              } 
              if (this.attacking) {
              this.attackTimer++;

                    if (this.attackTimer >= 10) {
                          this.attackTimer = 0;
                          this.frameX++;

                          if (this.frameX >= 8) {
                               this.frameX = 0;
                               this.frameY = 0;
                               this.attacking = false;
                          }
                      }
                }
         }
    }

    const player = new Player(canvas.width, canvas.height);

        function animate(){
         if (gamepadIndex !== null) {
              const gamepads = navigator.getGamepads();
              const gp = gamepads[gamepadIndex];
     
              // Alleen springen als A is ingedrukt, de knop NIET vergrendeld is, EN de speler op de grond staat (vy === 0)
              if (gp && gp.buttons[0].pressed) {
                   if (!aButtonLocked && player.onGround) {
                        player.frameY += 1;
                        player.vy = -8;
                        player.onGround = false; // Speler gaat de lucht in
                        aButtonLocked = true; // Vergrendel de knop direct
                   }
              } else {
                   aButtonLocked = false; // Ontgrendel pas als je de knop fysiek loslaat
              }
             
              if (gp && (gp.buttons[2].pressed || gp.buttons[7].pressed)) {
                   if (!xButtonLocked) {
                        player.frameY += 1;
                        player.frameX += 5;
                        xButtonLocked = true; // Vergrendel de knop direct
                   }
              } else {
                   xButtonLocked = false; // Ontgrendel pas als je de knop fysiek loslaat
              }
         }

         ctx.clearRect(0, 0, canvas.width, canvas.height);
         player.draw(ctx);
         player.update();
         requestAnimationFrame(animate);
    }

    animate();

    addEventListener('keydown', function(e){
         if (e.code === 'Space' && player.onGround){
              player.frameY += 1;
              player.vy = -8;
         }
    });

    addEventListener('keydown', function(e){
         if (e.code === 'Enter'){
              player.attacking = true;
              player.attackTimer = 0;
              player.frameY = 2;
         }
    });
    
    window.addEventListener("gamepadconnected", function(e) {
         gamepadIndex = e.gamepad.index;
    });

    window.addEventListener("gamepaddisconnected", function(e) {
         if (gamepadIndex === e.gamepad.index) gamepadIndex = null;

    });
});



