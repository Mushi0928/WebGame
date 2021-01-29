var host;

var gameCanvas;
var ctx;

var deltaTime = 0;
var lastTimeStamp = 0;
var movingSpeed = 60;

var tileSet = new Image();
var playerSprite = new Image();

var player;
var keys = {};

window.onload = gameInit;

function gameInit(){
    host = window.location.host
    console.log(host);

    gameCanvas = document.getElementById("gameCanvas");
    ctx = gameCanvas.getContext("2d");
    ctx.fillStyle = "#CFB303";

    tileSet.src = "/static/res/tileset.png";
    playerSprite.src = "/static/res/playerSprite.png";
    player = new Player(playerSprite);

    window.addEventListener('keydown',function(e){
        keys[e.keyCode] = true;
        //console.log(e.keyCode);
    });
    window.addEventListener('keyup',function(e){
        keys[e.keyCode] = false;
        //console.log("keyup!");
    });

    window.requestAnimationFrame(gameLoop);
}
function gameLoop(timeStamp){
    deltaTime = (timeStamp - lastTimeStamp)/1000;
    lastTimeStamp = timeStamp;

    update();
    render();
    window.requestAnimationFrame(gameLoop);
}
function render(){
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    ctx.drawImage(tileSet,1*32,6*32,32,32,0,0,64,64);

    player.render();
    
}
function update(){
    player.update();
}
class Player {
    constructor(sprite){
        this.sprite = sprite;
        this.maxHP = 100;
        this.HP = this.maxHP;
        this.x = gameCanvas.width/2;
        this.y = gameCanvas.height/2;
        this.w = 64;
        this.h = 64;
        // 0 up , 1 left , 2 down , 3 right
        this.direction = 2;
        this.anim_timsStamp = 0;
        this.currentFrame = 0;
        this.walking = false;
        this.walking_delay = 0.1;
        this.walking_max_frame = 9;
        
    }
    update(){
        var dx = 0;
        var dy = 0;
        if(keys && keys[87]){
            dy -= 1;
        }
        if(keys && keys[65]){
            dx -= 1;
        }
        if(keys && keys[83]){
            dy += 1;
        }
        if(keys && keys[68]){
            dx += 1;
        }

        this.x += dx * movingSpeed * deltaTime;
        this.y += dy * movingSpeed * deltaTime;

        if(dy > 0)this.direction = 2;
        else if(dy < 0)this.direction = 0;
        if(dx > 0)this.direction = 3;
        else if(dx < 0)this.direction = 1;
        if(dx == 0 && dy == 0)this.walking = false;
        else this.walking = true;

        if(this.walking){
            this.anim_timsStamp += deltaTime;
            if(this.anim_timsStamp > this.walking_delay){
                this.currentFrame = (this.currentFrame + 1)%this.walking_max_frame;
                this.anim_timsStamp = 0;
            }
        }else{
            this.currentFrame = 0;
            this.anim_timsStamp = 0;
        }

        
    }
    render(){
        ctx.drawImage(this.sprite,(this.currentFrame)*this.w,(8+this.direction)*this.h,this.w,this.h,
                      this.x - this.w/2,this.y - this.h/2,this.w,this.h);
    }
}