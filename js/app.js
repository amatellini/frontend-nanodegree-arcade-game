'use strict';

var BOTTOM_LIMIT = 383;
var TOP_LIMIT = 63;
var RIGHT_LIMIT = 402.5;
var LEFT_LIMIT = 2.5;
var CLEAN_LIMIT = 63;

// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = x;
    this.y = y;
    this.speed = speed;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

  this.x += this.speed * dt;

  // Reset position if canvas right side reached
  if(this.x >= ctx.canvas.clientWidth) {
    this.x = 0;
  }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y, speed) {
  this.x = x;
  this.y = y;
  this.speed = speed;
  this.sprite = 'images/char-boy.png';

  // For reset player to original position
  this.START_X = x;
  this.START_Y = y;
};

Player.prototype.update = function() {
  this.checkIfPlayerWin();
  this.checkCollisionWithEnemies();
  this.checkCollisionWithBorders();
};


Player.prototype.checkIfPlayerWin = function () {

  if (this.y + TOP_LIMIT <= 0) {
    this.x = this.START_X;
    this.y = this.START_Y;

    increaseScore();
  }

  // Clean canvas top space because player image leave traces here
  if(this.y + 131 < TOP_LIMIT <= 0) {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, ctx.canvas.clientWidth, CLEAN_LIMIT);
  }
};

Player.prototype.checkCollisionWithEnemies = function () {
  var self = this;

  allEnemies.forEach(function(enemy) {
    if (
      self.y + 131 >= enemy.y + 90
      && self.x + 25 <= enemy.x + 88
      && self.y + 73 <= enemy.y + 135
      && self.x + 76 >= enemy.x + 11) {

      self.x = self.START_X;
      self.y = self.START_Y;

      decreaseScore();
    }
  });
};


Player.prototype.checkCollisionWithBorders = function () {
  if (this.y >= BOTTOM_LIMIT ) {
    this.y = this.START_Y;
  }
  if (this.x >= RIGHT_LIMIT) {
    this.x = RIGHT_LIMIT;
  }
  if (this.x <= LEFT_LIMIT) {
    this.x = LEFT_LIMIT;
  }
};

var increaseScore = function() {
  score += 1;

  if(score % 3 === 0) {
    increaseDifficulty(allEnemies.length + 1)
  }
};

var decreaseScore = function() {
  if(score > 0) {
    score -= 1;
  }
  else {
    score = 0;
  }
};

// Increase number of enemies on screen based on player's score
var increaseDifficulty = function(numEnemies) {
  // Remove all previous enemies
  allEnemies.length = 0;

  // Load new set of enemies
  for (var i = 0; i < numEnemies; i++) {
    var posY = Math.random() * 184 + 50;
    var speed = Math.random() * 200;

    var enemy = new Enemy(0, posY, speed);

    allEnemies.push(enemy);
  }
};

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);


  // ctx.strokeStyle = '#ff0000';
  //
  // ctx.rect(0 ,0 , ctx.canvas.clientWidth, ctx.canvas.clientHeight);
  // ctx.stroke();
  //
  // ctx.strokeStyle = '#000000';
  // ctx.beginPath();
  // ctx.moveTo(100, CLEAN_LIMIT);
  // ctx.lineTo(400, CLEAN_LIMIT);
  // ctx.stroke();
  //
  // ctx.strokeStyle = '#26ff29';
  // ctx.beginPath();
  // ctx.moveTo(100, TOP_LIMIT);
  // ctx.lineTo(400, TOP_LIMIT);
  // ctx.stroke();
  //
  // ctx.strokeStyle = '#ffa41a';
  // ctx.beginPath();
  // ctx.moveTo(100, BOTTOM_LIMIT);
  // ctx.lineTo(400, BOTTOM_LIMIT);
  // ctx.stroke();
  //
  // ctx.strokeStyle = '#ff32ab';
  // ctx.beginPath();
  // ctx.moveTo(RIGHT_LIMIT, 400);
  // ctx.lineTo(RIGHT_LIMIT, 360);
  // ctx.stroke();
  //
  // ctx.strokeStyle = '#4f16ff';
  // ctx.beginPath();
  // ctx.moveTo(LEFT_LIMIT, 400);
  // ctx.lineTo(LEFT_LIMIT, 360);
  // ctx.stroke();

  displayScore(score);
};


Player.prototype.handleInput = function(keyPress) {
  if(keyPress == 'left') {
    this.x -= this.speed;
  }
  if(keyPress == 'up') {
    this.y -= this.speed;
  }
  if(keyPress == 'right') {
    this.x += this.speed;
  }
  if(keyPress == 'down') {
    this.y += this.speed;
  }

  //console.log("X: " + player.x + " Y: " + player.y);
};

// Function to display player's score
var displayScore = function(aScore) {
  var canvas = document.getElementsByTagName('canvas');
  var firstCanvasTag = canvas[0];

  // add player score and level to div element created
  scoreDiv.innerHTML = 'Score: ' + aScore;
  document.body.insertBefore(scoreDiv, firstCanvasTag[0]);
};

var scoreDiv = document.createElement('div');

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
allEnemies.push(new Enemy(0, Math.random() * 184 + 50, 100));

// Create player
// image width 100
// x position = ((505 - 100) / 2) = 202.5,
// y position = 383 //try & error
var player = new Player(202.5, 383, 50);

// Initialize score
var score = 0;

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        65: 'left',
        87: 'up',
        68: 'right',
        83: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
