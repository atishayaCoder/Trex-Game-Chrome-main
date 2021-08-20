//TREX GAme by Atishaya using JS

//Declare variables for game objects and behaviour indicators(FLAGS)
var trex, trexRun, trexDead;
var ground, invisGround, gtoundImage;
var cloud, cloudsGroup, cloudImg;
var cactus, cactiiGroup;
var cactusImg1, cactusImg2, cactusImg3, cactusImg4, cactusImg5, cactusImg6;
var score, highScore, displayHS;
var gameState;
var PLAY, END;
var restartIcon, iconImg;
var gameOver, overImg;
var jumpsSound, checkpointSound, dieSound;

//Create Media library and load to use it during the course of the software
//executed only once at the start of the program
function preload() {

  jumpSound = loadSound("jump.mp3");
  checkpointSound = loadSound("checkPoint.mp3");
  dieSound = loadSound("die.mp3");

  trexRun = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trexDead = loadImage("trex_collided.png");

  groundImage = loadImage("ground2.png");

  cloudImg = loadImage("cloud.png");

  overImg = loadImage("gameOver.png");

  iconImg = loadImage("restart.png");

  cactusImg1 = loadImage("obstacle1.png");
  cactusImg2 = loadImage("obstacle2.png");
  cactusImg3 = loadImage("obstacle3.png");
  cactusImg4 = loadImage("obstacle4.png");
  cactusImg5 = loadImage("obstacle5.png");
  cactusImg6 = loadImage("obstacle6.png");


}

//define the intial environment of the software(before it is used)
//by defining the declared variables with default values
//executed only once at the start of the program
function setup() {

  createCanvas(600, 300);

  //create a trex sprite
  trex = createSprite(50, height - 20, 20, 50);
  trex.addAnimation("trexRun", trexRun);
  trex.addAnimation("trexDead", trexDead);
  trex.scale = 0.7;
  trex.debug = false;
  trex.setCollider("circle", 0, 0, 40);

  //create a ground sprite
  ground = createSprite(width / 2, height - 20, width, 20);
  ground.addImage("groundImage", groundImage);
  ground.x = ground.width / 2;

  //creact invisible ground
  invisGround = createSprite(width / 2, height - 10, width, 5);
  invisGround.visible = false;

  //set score
  score = 0;
  highScore = 0;
  displayHS = false;

  //game states 
  PLAY = 1;
  END = 0;
  gameState = PLAY;

  //creating groups
  cactiiGroup = createGroup();
  cloudsGroup = createGroup();

  //game over
  gameOver = createSprite(width / 2, height / 2, 20, 20);
  gameOver.addImage("overImg", overImg);
  gameOver.scale = 0.8;

  //restart icon
  restartIcon = createSprite(width / 2, height / 2 + 50, 20, 20);
  restartIcon.addImage("iconImg", iconImg);
  restartIcon.scale = 0.5;




}

//All modifications, changes, conditions, manipulations, actions during the course of the program are written inside function draw.
//All commands to be executed and checked continously or applied throughout the program are written inside function draw.
//function draw is executed for every frame created since the start of the program.
function draw() {

  //set background to white
  background("white");

  //display score
  text("score =" + score, width - 100, 100);

  //in gamestate play
  if (gameState == PLAY) {

    //score calculation
    score = score + Math.round(World.frameRate / 60);
    if (score % 100 == 0 && score > 0) {
      checkpointSound.play();
    }

    //display High Score when needed 
    if (displayHS == true) {
      text("high score =" + highScore, width - 127, 80);
    }

    //ground behavior
    ground.velocityX = -(7 + score / 100);
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }
    console.log(trex.y)
    //trex behavior 
    if (keyDown("space") && trex.y > height - 50) {
      trex.velocityY = -15;
      jumpSound.play();
    }
    trex.velocityY = trex.velocityY + 0.8;

    //function call to creat clouds
    spawnClouds();

    // function call to creat cactus
    spawnCactus();

    if (cactiiGroup.isTouching(trex)) {
      gameState = END;
      dieSound.play();
    }

    restartIcon.visible = false;
    gameOver.visible = false;
  }

  //in gamestate end
  else if (gameState == END) {

    //calculation and display of high score
    if (score > highScore) {
      highScore = score;
    }

    text("high score =" + highScore, width - 127, 80);

    trex.velocityY = 0;
    trex.changeAnimation("trexDead", trexDead);

    cloudsGroup.setVelocityXEach(0);
    cloudsGroup.setLifetimeEach(-1);
    cactiiGroup.setVelocityXEach(0);
    cactiiGroup.setLifetimeEach(-1);

    ground.velocityX = 0;

    restartIcon.visible = true;
    gameOver.visible = true;

    //restartIcon behavior
    if (mousePressedOver(restartIcon)) {
      gameState = PLAY;
      cactiiGroup.destroyEach();
      cloudsGroup.destroyEach();
      trex.changeAnimation("trexRun", trexRun);
      score = 0;
      displayHS = true;
    }

  }

  //stop trex from falling down
  trex.collide(invisGround);


  drawSprites();
}
//function definition to creat clouds
function spawnClouds() {
  if (World.frameCount % 40 == 0) {
    cloud = createSprite(width, height / 2, 40, 10);
    cloud.velocityX = -4;
    cloud.y = random(height / 2 - 50, height / 2 + 50);
    cloud.addImage("cloudImg", cloudImg);
    cloud.scale = 0.5;
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloud.lifetime = (-1) * (width/cloud.velocityX);
    cloudsGroup.add(cloud);
  }

}

//function definition to creat cactus
function spawnCactus() {
  if (World.frameCount % 80 == 0) {
    cactus = createSprite(width, height - 35, 10, 40);
    cactus.velocityX = ground.velocityX;

    var caseNo = Math.round(random(1, 6));
    switch (caseNo) {
      case 1:
        cactus.addImage("cactusImg1", cactusImg1);
        break;
      case 2:
        cactus.addImage("cactusImg2", cactusImg2);
        break;
      case 3:
        cactus.addImage("cactusImg3", cactusImg3);
        break;
      case 4:
        cactus.addImage("cactusImg4", cactusImg4);
        break;
      case 5:
        cactus.addImage("cactusImg5", cactusImg5);
        break;
      case 6:
        cactus.addImage("cactusImg6", cactusImg6);
        break;
      default:
        cactus.addImage("cactusImg1", cactusImg1);
    }
    cactus.scale = 0.5;
    cactus.depth = trex.depth;
    cactus.depth = 2;
    cactus.lifetime = (-1) * (width/cactus.velocityX);
    cactiiGroup.add(cactus);
  }
}