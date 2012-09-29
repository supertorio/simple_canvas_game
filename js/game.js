// constants
var DIRECTION_FORWARD = 1;
var DIRECTION_LEFT = 2;
var DIRECTION_RIGHT = 3;
var DIRECTION_BACK = 4;






// Create the canvas
var then;
var gameLoop;
var gameRunning = false;
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 640;
canvas.height = 480;
document.body.appendChild(canvas);




$('#toggleGame').click(function(){
	if( gameRunning ) {
		stopGameLoop();
	} else {
		startGameLoop();
	}
});



var roomWidth = 1024;
var roomHeight = 768;
var roomOffsetTop = 0;
var roomOffsetLeft = 0;
var spriteWidth = 32;
var spriteHeight = 32;
var spriteWidthScaled = 48;
var spriteHeightScaled = 48;


var bounds = {
	top: 0,
	left: 0,
	right: (canvas.width - spriteWidthScaled),
	bottom: (canvas.height - spriteHeightScaled)
}



// Define Sprites
var sprites = new SpriteSheet({
	width: spriteWidth,
	height: spriteHeight,
	sprites: [
		{ name: 'girl_forward_walk_1',	x: 0, y: 0 },
		{ name: 'girl_forward_walk_2',	x: 1, y: 0 },
		{ name: 'girl_forward_walk_3',	x: 2, y: 0 },
		{ name: 'girl_left_walk_1',		x: 0, y: 1 },
		{ name: 'girl_left_walk_2',		x: 1, y: 1 },
		{ name: 'girl_left_walk_3',		x: 2, y: 1 },
		{ name: 'girl_right_walk_1',	x: 0, y: 2 },
		{ name: 'girl_right_walk_2',	x: 1, y: 2 },
		{ name: 'girl_right_walk_3',	x: 2, y: 2 },
		{ name: 'girl_back_walk_1',		x: 0, y: 3 },
		{ name: 'girl_back_walk_2',		x: 1, y: 3 },
		{ name: 'girl_back_walk_3',		x: 2, y: 3 },


		{ name: 'zombie_forward_walk_1',	x: 6, y: 4 },
		{ name: 'zombie_forward_walk_2',	x: 7, y: 4 },
		{ name: 'zombie_forward_walk_3',	x: 8, y: 4 },
		{ name: 'zombie_left_walk_1',		x: 6, y: 5 },
		{ name: 'zombie_left_walk_2',		x: 7, y: 5 },
		{ name: 'zombie_left_walk_3',		x: 8, y: 5 },
		{ name: 'zombie_right_walk_1',		x: 6, y: 6 },
		{ name: 'zombie_right_walk_2',		x: 7, y: 6 },
		{ name: 'zombie_right_walk_3',		x: 8, y: 6 },
		{ name: 'zombie_back_walk_1',		x: 6, y: 7 },
		{ name: 'zombie_back_walk_2',		x: 7, y: 7 },
		{ name: 'zombie_back_walk_3',		x: 8, y: 7 }
    ]
});





















// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";





// Hero image
var heroReady = false;
var heroImage = new Image();
var heroWalkForward = new Animation([
    { sprite: 'girl_forward_walk_1', time: 0.2 },
    { sprite: 'girl_forward_walk_2', time: 0.2 },
    { sprite: 'girl_forward_walk_3', time: 0.2 },
    { sprite: 'girl_forward_walk_2', time: 0.2 }
], sprites);
var heroWalkBackwards = new Animation([
    { sprite: 'girl_back_walk_1', time: 0.2 },
    { sprite: 'girl_back_walk_2', time: 0.2 },
    { sprite: 'girl_back_walk_3', time: 0.2 },
    { sprite: 'girl_back_walk_2', time: 0.2 }
], sprites);
var heroWalkLeft = new Animation([
    { sprite: 'girl_left_walk_1', time: 0.2 },
    { sprite: 'girl_left_walk_2', time: 0.2 },
    { sprite: 'girl_left_walk_3', time: 0.2 },
    { sprite: 'girl_left_walk_2', time: 0.2 }
], sprites);
var heroWalkRight = new Animation([
    { sprite: 'girl_right_walk_1', time: 0.2 },
    { sprite: 'girl_right_walk_2', time: 0.2 },
    { sprite: 'girl_right_walk_3', time: 0.2 },
    { sprite: 'girl_right_walk_2', time: 0.2 }
], sprites);
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/characterSprites.png";







// Monster image
var monsterReady = false;
var monsterImage = new Image();
var monsterAnimSpeed = .6;
var zombieWalkForward = new Animation([
    { sprite: 'zombie_forward_walk_1', time: monsterAnimSpeed },
    { sprite: 'zombie_forward_walk_2', time: monsterAnimSpeed },
    { sprite: 'zombie_forward_walk_3', time: monsterAnimSpeed },
    { sprite: 'zombie_forward_walk_2', time: monsterAnimSpeed }
], sprites);
var zombieWalkLeft = new Animation([
    { sprite: 'zombie_left_walk_1', time: monsterAnimSpeed },
    { sprite: 'zombie_left_walk_2', time: monsterAnimSpeed },
    { sprite: 'zombie_left_walk_3', time: monsterAnimSpeed },
    { sprite: 'zombie_left_walk_2', time: monsterAnimSpeed }
], sprites);
var zombieWalkRight = new Animation([
    { sprite: 'zombie_right_walk_1', time: monsterAnimSpeed },
    { sprite: 'zombie_right_walk_2', time: monsterAnimSpeed },
    { sprite: 'zombie_right_walk_3', time: monsterAnimSpeed },
    { sprite: 'zombie_right_walk_2', time: monsterAnimSpeed }
], sprites);
var zombieWalkBack = new Animation([
    { sprite: 'zombie_back_walk_1', time: monsterAnimSpeed },
    { sprite: 'zombie_back_walk_2', time: monsterAnimSpeed },
    { sprite: 'zombie_back_walk_3', time: monsterAnimSpeed },
    { sprite: 'zombie_back_walk_2', time: monsterAnimSpeed }
], sprites);
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/characterSprites.png";







// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
hero.animation = heroWalkForward;
hero.moving = false;
hero.direction = "forward";

var monstersInGame = 3;
var monsters = Array();
for (var i=0;i<monstersInGame;i++){
	monsters[i]={
		speed: 20
	};
}
var monstersCaught = 0;






// Handle keyboard controls
var keysDown = {};
addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);
addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);



function resetMonster(monsterId)
{
	// Randomly Position Monster
	monsters[monsterId].posX = 32 + (Math.random() * (roomWidth - 64));
	monsters[monsterId].posY = 32 + (Math.random() * (roomHeight - 64));
	monsters[monsterId].x = monsters[monsterId].posX - roomOffsetLeft;
	monsters[monsterId].y = monsters[monsterId].posY - roomOffsetTop;
	
	// Set Inital Monster Direction
	var randDirection = Math.floor((Math.random()*4)+1);
	switch(randDirection) {
		case 1:
			monsters[monsterId].direction = DIRECTION_FORWARD;
			monsters[monsterId].animation = zombieWalkForward;
			break;
		case 2:
			monsters[monsterId].direction = DIRECTION_LEFT;
			monsters[monsterId].animation = zombieWalkLeft;
			break;
		case 3:
			monsters[monsterId].direction = DIRECTION_RIGHT;
			monsters[monsterId].animation = zombieWalkRight;
			break;
		case 4:
			monsters[monsterId].direction = DIRECTION_BACK;
			monsters[monsterId].animation = zombieWalkBack;
			break;
	}
}




// Update game objects
var update = function (modifier) {
	
	var backgroundSlideTrigger = 0;
	var roomOffsetBoundry = 0;
	var playerDelta = hero.speed * modifier;
	
	if (38 in keysDown)  // Player holding up
	{
		backgroundSlideTrigger = bounds.top+(2*spriteWidth);
		roomOffsetBoundry = 0;
		
		if ( hero.y < backgroundSlideTrigger && roomOffsetTop > roomOffsetBoundry )
		{
			roomOffsetTop -= playerDelta;
			if( roomOffsetTop < roomOffsetBoundry ) roomOffsetTop = roomOffsetBoundry;
			hero.y = backgroundSlideTrigger;
		}
		else hero.y -= playerDelta;
		
		hero.animation = heroWalkBackwards;
		hero.direction = "back";
		hero.moving = true;
	}
	else if (40 in keysDown)  // Player holding down
	{
		backgroundSlideTrigger = bounds.bottom-(2*spriteWidth);
		roomOffsetBoundry = roomHeight - canvas.height;
		
		if ( hero.y > backgroundSlideTrigger && roomOffsetTop < roomOffsetBoundry )
		{
			roomOffsetTop += playerDelta;
			if( roomOffsetTop > roomOffsetBoundry ) roomOffsetTop = roomOffsetBoundry;
			hero.y = backgroundSlideTrigger;
		}
		else hero.y += playerDelta;

		hero.animation = heroWalkForward;
		hero.direction = "forward";
		hero.moving = true;
	}
	else if (37 in keysDown) // Player holding left
	{
		backgroundSlideTrigger = bounds.left+(2*spriteWidth);
		roomOffsetBoundry = 0;

		if ( hero.x < backgroundSlideTrigger && roomOffsetLeft > roomOffsetBoundry )
		{
			roomOffsetLeft -= playerDelta;
			if( roomOffsetLeft < roomOffsetBoundry ) roomOffsetLeft = roomOffsetBoundry;
			hero.x = backgroundSlideTrigger;
		}
		else hero.x -= playerDelta;
		hero.animation = heroWalkLeft;
		hero.direction = "left";
		hero.moving = true;
	}
	else if (39 in keysDown) // Player holding right
	{
		backgroundSlideTrigger = bounds.right-(2*spriteWidth);
		roomOffsetBoundry = roomWidth - canvas.width;
		
		if ( hero.x > backgroundSlideTrigger && roomOffsetLeft < roomOffsetBoundry )
		{
			roomOffsetLeft += playerDelta;
			if( roomOffsetLeft > roomOffsetBoundry ) roomOffsetLeft = roomOffsetBoundry;
			hero.x = backgroundSlideTrigger;
		}
		else hero.x += hero.speed * modifier;
		hero.animation = heroWalkRight;
		hero.direction = "right";
		hero.moving = true;
	}
	else
	{
		hero.moving = false;
	}
	
	// Hero Border Collisions
	if ( hero.y <= bounds.top )    { hero.y = bounds.top; }
	if ( hero.y >= bounds.bottom ) { hero.y = bounds.bottom; }
	if ( hero.x <= bounds.left )   { hero.x = bounds.left ; }
	if ( hero.x >= bounds.right )  { hero.x = bounds.right; }
	


	// Move the monster
	// Check For Collisions
	for (var i=0;i<monstersInGame;i++)
	{
		
		// Increment Monster Movement
		var monsterDelta = monsters[i].speed * modifier;
		switch (monsters[i].direction)
		{
			case DIRECTION_FORWARD:
				monsters[i].posY += monsterDelta;
				break;
			case DIRECTION_LEFT:
				monsters[i].posX -= monsterDelta;
				break;
			case DIRECTION_RIGHT:
				monsters[i].posX += monsterDelta;
				break;
			case DIRECTION_BACK:
				monsters[i].posY -= monsterDelta;
				break;
		}
		
		// Adjust for map movement
		monsters[i].x = monsters[i].posX - roomOffsetLeft;
		monsters[i].y = monsters[i].posY - roomOffsetTop;
		
		
		// Hero / Monster Collisions
		if (
			hero.x <= (monsters[i].x + spriteWidthScaled)
			&& monsters[i].x <= (hero.x + spriteWidthScaled)
			&& hero.y <= (monsters[i].y + spriteHeightScaled)
			&& monsters[i].y <= (hero.y + spriteHeightScaled)
		) {
			++monstersCaught;
			resetMonster(i)
		}
		
		// Border Collisions
		if ( monsters[i].posY <= 0 ) {
			monsters[i].direction = DIRECTION_FORWARD;
			monsters[i].animation = zombieWalkForward;
		}
		if ( (monsters[i].posY + spriteHeightScaled) >= roomHeight ) {
			monsters[i].direction = DIRECTION_BACK;
			monsters[i].animation = zombieWalkBack;
		}
		if ( monsters[i].posX <= 0 ) {
			monsters[i].direction = DIRECTION_RIGHT;
			monsters[i].animation = zombieWalkRight;
		}
		if ( (monsters[i].posX + spriteWidthScaled) >= roomWidth ) {
			monsters[i].direction = DIRECTION_LEFT;
			monsters[i].animation = zombieWalkLeft;
		}
	}
};




// Draw everything
var render = function (modifier) {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	
	if (bgReady) {
		ctx.drawImage(bgImage, roomOffsetLeft, roomOffsetTop, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
	}

	if (heroReady) {
		var frame = '';
		if (!hero.moving) {
			switch( hero.direction ) {
				case "forward":
					frame = sprites.getOffset('girl_forward_walk_2');
					break;
				case "back":
					frame = sprites.getOffset('girl_back_walk_2');
					break;
				case "left":
					frame = sprites.getOffset('girl_left_walk_2');
					break;
				case "right":
					frame = sprites.getOffset('girl_right_walk_2');
					break;
			}
			ctx.drawImage(heroImage, frame.x, frame.y, spriteWidth, spriteHeight, hero.x, hero.y, spriteWidthScaled, spriteHeightScaled);
		} else {
			hero.animation.animate(modifier);
			frame = hero.animation.getSprite();
			ctx.drawImage(heroImage, frame.x, frame.y, spriteWidth, spriteHeight, hero.x, hero.y, spriteWidthScaled, spriteHeightScaled);
		}
	}

	if (monsterReady) {
		for (var i=0;i<monstersInGame;i++)
		{
			monsters[i].animation.animate(modifier);
			frame = monsters[i].animation.getSprite();
			ctx.drawImage(monsterImage, frame.x, frame.y, spriteWidth, spriteHeight, monsters[i].x, monsters[i].y, spriteWidthScaled, spriteHeightScaled);
		}
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Zombies caught: " + monstersCaught, 32, 32);
};





// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render(delta / 1000);

	then = now;
};


function setUpLevel()
{
	// Throw the monster somewhere in the room randomly
	for (var i=0;i<monstersInGame;i++){
		resetMonster(i);
	}
	
	// Position Hero in the Center of the Screen
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;
}

function startGameLoop() {
	then = Date.now();
	gameLoop = setInterval(main, 1); // Execute as fast as possible
	gameRunning = true;
	console.log('game starting');
}

function stopGameLoop() {
	clearInterval(gameLoop);
	gameRunning = false;
	console.log('game stopped');
}



// Let's play this game!
$(document).ready(function()
{	
	setUpLevel()
	startGameLoop();
});





