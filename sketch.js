var PLAY = 1;
var END = 0;
var gameState = PLAY;
var gameOver,gameOverImage;
var restart,restartImage;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var jumpSound;
var checkPoint;
var dieSound;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var fondo;
var score;


function preload(){
  trex_running = loadAnimation("puma4.png");
  trex_collided = loadAnimation("puma3.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("nube.png");
  
  obstacle1 = loadImage("arbusto.png");
  obstacle2 = loadImage("arbusto.png");
  obstacle3 = loadImage("arbusto.png");
  obstacle4 = loadImage("arbusto.png");
  obstacle5 = loadImage("arbusto.png");
  obstacle6 = loadImage("arbusto.png");
  fondo=loadImage("fondo.jpg")
  gameOverImage=loadImage("gameOver.png");
  restartImage=loadImage("restart.png");
  //checkPoint=loadSound("checkPoint.mp3")
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.3;
  trex.setCollider("circle",0,0,40);
  trex.debug=true;
  
  gameOver = createSprite(300,100,200,20);
  gameOver.addImage("gameOver",gameOverImage);
  restart = createSprite(300,180,400,20);
  restart.addImage("restart",restartImage);
  gameOver.visible=false;
  restart.visible=false;
  ground = createSprite(width/2,height-60,width,125);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  
  invisibleGround = createSprite(width/2,height,width,125);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  console.log("Hello" + 5);
  
  score = 0;
}

function draw() {
  background(fondo);
  //displaying score
  text("Score: "+ score, 500,50);
  
  
  
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -4;
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
   if(touches.length<0||keyDown("space")&& trex.y >=2* height/3) {
        trex.velocityY = -13;
        jumpSound.play();
      touches=[];
    }
    if (score>0&&score%100==0){
      //checkPoint.play();
    }
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        dieSound.play();
    }
  }
   else if (gameState === END) {
     trex.velocityY=0;
      ground.velocityX = 0;
     trex.changeAnimation("collided" , trex_collided);
     obstaclesGroup.setVelocityXEach(-1);
     cloudsGroup.setVelocityXEach(-1);
     gameOver.visible=true;
     restart.visible=true;
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
if(touches.length<0||mousePressedOver(restart)){
  reset();
  touches=[];
}  
  
  drawSprites();
}
 function reset(){
      gameState=PLAY;
     gameOver.visible=false;
     restart.visible=false;
     score=0
   
    }
function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width,height-70,width,125);
   obstacle.velocityX = -(6+score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
   if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -(4+3*score/100);
    
     //assign lifetime to the variable
    cloud.lifetime = 134;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}

   


