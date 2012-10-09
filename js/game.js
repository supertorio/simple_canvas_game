// constants
var CANVAS_WIDTH = 640;
var CANVAS_HEIGHT = 480;
var PLAY_AREA_HEIGHT = 420;
var DIRECTION_FORWARD = 1;
var DIRECTION_LEFT = 2;
var DIRECTION_RIGHT = 3;
var DIRECTION_BACK = 4;
var CHARACTER_SPRITE_WIDTH = 32;
var CHARACTER_SPRITE_HEIGHT = 32;
var CHARACTER_SPRITE_WIDTH_SCALED = 48;
var CHARACTER_SPRITE_HEIGHT_SCALED = 48;
var CONTROL_PANEL_HEIGHT = 60;


// Game Loop / Timing
var then;
var gameLoop;
var gameRunning = false;


// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
document.body.appendChild(canvas);


/********* Start Load In Image Resources **********/
// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";


// Load Character Sprites Image
var characterSpritesReady = false;
var characterSpritesImage = new Image();
characterSpritesImage.onload = function () {
	characterSpritesReady = true;
};
characterSpritesImage.src = "images/characterSprites.png";

/********* End Load In Image Resources **********/


// Level Definitions
var currentLevel = 1;
var levels = Array();
levels[0] = {
	roomWidth: 1024,
	roomHeight: 768,
	monstersInGame: 3
}


// Game Pause/Resume Button
$('#toggleGame').click(function(){
	if( gameRunning ) {
		stopGameLoop();
	} else {
		startGameLoop();
	}
});


// Define Sprites
// Artwork from - http://doubleleggy.deviantart.com/gallery/?offset=168#/d2h3lq9
var sprites = new SpriteSheet({
	width: CHARACTER_SPRITE_WIDTH,
	height: CHARACTER_SPRITE_HEIGHT,
	sprites: [
		{ name: 'jill_forward_walk_1',		x: 0, y: 0 }, // Jill Valentine
		{ name: 'jill_forward_walk_2',		x: 1, y: 0 },
		{ name: 'jill_forward_walk_3',		x: 2, y: 0 },
		{ name: 'jill_left_walk_1',			x: 0, y: 1 },
		{ name: 'jill_left_walk_2',			x: 1, y: 1 },
		{ name: 'jill_left_walk_3',			x: 2, y: 1 },
		{ name: 'jill_right_walk_1',		x: 0, y: 2 },
		{ name: 'jill_right_walk_2',		x: 1, y: 2 },
		{ name: 'jill_right_walk_3',		x: 2, y: 2 },
		{ name: 'jill_back_walk_1',			x: 0, y: 3 },
		{ name: 'jill_back_walk_2',			x: 1, y: 3 },
		{ name: 'jill_back_walk_3',			x: 2, y: 3 },
		{ name: 'carlos_forward_walk_1',	x: 3, y: 0 }, // Carlos Oliveira
		{ name: 'carlos_forward_walk_2',	x: 4, y: 0 },
		{ name: 'carlos_forward_walk_3',	x: 5, y: 0 },
		{ name: 'carlos_left_walk_1',		x: 3, y: 1 },
		{ name: 'carlos_left_walk_2',		x: 4, y: 1 },
		{ name: 'carlos_left_walk_3',		x: 5, y: 1 },
		{ name: 'carlos_right_walk_1',		x: 3, y: 2 },
		{ name: 'carlos_right_walk_2',		x: 4, y: 2 },
		{ name: 'carlos_right_walk_3',		x: 5, y: 2 },
		{ name: 'carlos_back_walk_1',		x: 3, y: 3 },
		{ name: 'carlos_back_walk_2',		x: 4, y: 3 },
		{ name: 'carlos_back_walk_3',		x: 5, y: 3 },
		{ name: 'nicholai_forward_walk_1',	x: 6, y: 0 }, // Nicholai Ginovaef
		{ name: 'nicholai_forward_walk_2',	x: 7, y: 0 },
		{ name: 'nicholai_forward_walk_3',	x: 8, y: 0 },
		{ name: 'nicholai_left_walk_1',		x: 6, y: 1 },
		{ name: 'nicholai_left_walk_2',		x: 7, y: 1 },
		{ name: 'nicholai_left_walk_3',		x: 8, y: 1 },
		{ name: 'nicholai_right_walk_1',	x: 6, y: 2 },
		{ name: 'nicholai_right_walk_2',	x: 7, y: 2 },
		{ name: 'nicholai_right_walk_3',	x: 8, y: 2 },
		{ name: 'nicholai_back_walk_1',		x: 6, y: 3 },
		{ name: 'nicholai_back_walk_2',		x: 7, y: 3 },
		{ name: 'nicholai_back_walk_3',		x: 8, y: 3 },
		{ name: 'nemesis_forward_walk_1',	x: 9, y: 0 }, // Nemesis
		{ name: 'nemesis_forward_walk_2',	x: 10, y: 0 },
		{ name: 'nemesis_forward_walk_3',	x: 11, y: 0 },
		{ name: 'nemesis_left_walk_1',		x: 9,  y: 1 },
		{ name: 'nemesis_left_walk_2',		x: 10, y: 1 },
		{ name: 'nemesis_left_walk_3',		x: 11, y: 1 },
		{ name: 'nemesis_right_walk_1',		x: 9,  y: 2 },
		{ name: 'nemesis_right_walk_2',		x: 10, y: 2 },
		{ name: 'nemesis_right_walk_3',		x: 11, y: 2 },
		{ name: 'nemesis_back_walk_1',		x: 9,  y: 3 },
		{ name: 'nemesis_back_walk_2',		x: 10, y: 3 },
		{ name: 'nemesis_back_walk_3',		x: 11, y: 3 },
		{ name: 'cerberus_forward_walk_1',	x: 0, y: 4 }, // Cerberus
		{ name: 'cerberus_forward_walk_2',	x: 1, y: 4 },
		{ name: 'cerberus_forward_walk_3',	x: 2, y: 4 },
		{ name: 'cerberus_left_walk_1',		x: 0, y: 5 },
		{ name: 'cerberus_left_walk_2',		x: 1, y: 5 },
		{ name: 'cerberus_left_walk_3',		x: 2, y: 5 },
		{ name: 'cerberus_right_walk_1',	x: 0, y: 6 },
		{ name: 'cerberus_right_walk_2',	x: 1, y: 6 },
		{ name: 'cerberus_right_walk_3',	x: 2, y: 6 },
		{ name: 'cerberus_back_walk_1',		x: 0, y: 7 },
		{ name: 'cerberus_back_walk_2',		x: 1, y: 7 },
		{ name: 'cerberus_back_walk_3',		x: 2, y: 7 },
		{ name: 'crow_forward_walk_1',		x: 3, y: 4 }, // Crow
		{ name: 'crow_forward_walk_2',		x: 4, y: 4 },
		{ name: 'crow_forward_walk_3',		x: 5, y: 4 },
		{ name: 'crow_left_walk_1',			x: 3, y: 5 },
		{ name: 'crow_left_walk_2',			x: 4, y: 5 },
		{ name: 'crow_left_walk_3',			x: 5, y: 5 },
		{ name: 'crow_right_walk_1',		x: 3, y: 6 },
		{ name: 'crow_right_walk_2',		x: 4, y: 6 },
		{ name: 'crow_right_walk_3',		x: 5, y: 6 },
		{ name: 'crow_back_walk_1',			x: 3, y: 7 },
		{ name: 'crow_back_walk_2',			x: 4, y: 7 },
		{ name: 'crow_back_walk_3',			x: 5, y: 7 },
		{ name: 'zombie_forward_walk_1',	x: 6, y: 4 }, // Zombie
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


// Hero Animations
var heroAnimSpeed = 0.2;
var heroName = "nicholai"
var heroWalkForward = new Animation([
    { sprite: heroName+'_forward_walk_1', time: heroAnimSpeed },
    { sprite: heroName+'_forward_walk_2', time: heroAnimSpeed },
    { sprite: heroName+'_forward_walk_3', time: heroAnimSpeed },
    { sprite: heroName+'_forward_walk_2', time: heroAnimSpeed }
], sprites);
var heroWalkBackwards = new Animation([
    { sprite: heroName+'_back_walk_1', time: heroAnimSpeed },
    { sprite: heroName+'_back_walk_2', time: heroAnimSpeed },
    { sprite: heroName+'_back_walk_3', time: heroAnimSpeed },
    { sprite: heroName+'_back_walk_2', time: heroAnimSpeed }
], sprites);
var heroWalkLeft = new Animation([
    { sprite: heroName+'_left_walk_1', time: heroAnimSpeed },
    { sprite: heroName+'_left_walk_2', time: heroAnimSpeed },
    { sprite: heroName+'_left_walk_3', time: heroAnimSpeed },
    { sprite: heroName+'_left_walk_2', time: heroAnimSpeed }
], sprites);
var heroWalkRight = new Animation([
    { sprite: heroName+'_right_walk_1', time: heroAnimSpeed },
    { sprite: heroName+'_right_walk_2', time: heroAnimSpeed },
    { sprite: heroName+'_right_walk_3', time: heroAnimSpeed },
    { sprite: heroName+'_right_walk_2', time: heroAnimSpeed }
], sprites);




// Zombie Animations
var zombieAnimSpeed = .6;
var zombieWalkForward = new Animation([
    { sprite: 'zombie_forward_walk_1', time: zombieAnimSpeed },
    { sprite: 'zombie_forward_walk_2', time: zombieAnimSpeed },
    { sprite: 'zombie_forward_walk_3', time: zombieAnimSpeed },
    { sprite: 'zombie_forward_walk_2', time: zombieAnimSpeed }
], sprites);
var zombieWalkLeft = new Animation([
    { sprite: 'zombie_left_walk_1', time: zombieAnimSpeed },
    { sprite: 'zombie_left_walk_2', time: zombieAnimSpeed },
    { sprite: 'zombie_left_walk_3', time: zombieAnimSpeed },
    { sprite: 'zombie_left_walk_2', time: zombieAnimSpeed }
], sprites);
var zombieWalkRight = new Animation([
    { sprite: 'zombie_right_walk_1', time: zombieAnimSpeed },
    { sprite: 'zombie_right_walk_2', time: zombieAnimSpeed },
    { sprite: 'zombie_right_walk_3', time: zombieAnimSpeed },
    { sprite: 'zombie_right_walk_2', time: zombieAnimSpeed }
], sprites);
var zombieWalkBack = new Animation([
    { sprite: 'zombie_back_walk_1', time: zombieAnimSpeed },
    { sprite: 'zombie_back_walk_2', time: zombieAnimSpeed },
    { sprite: 'zombie_back_walk_3', time: zombieAnimSpeed },
    { sprite: 'zombie_back_walk_2', time: zombieAnimSpeed }
], sprites);



// Nemisis Animations
var nemesisAnimSpeed = .4;
var nemesisWalkForward = new Animation([
    { sprite: 'nemesis_forward_walk_1', time: nemesisAnimSpeed },
    { sprite: 'nemesis_forward_walk_2', time: nemesisAnimSpeed },
    { sprite: 'nemesis_forward_walk_3', time: nemesisAnimSpeed },
    { sprite: 'nemesis_forward_walk_2', time: nemesisAnimSpeed }
], sprites);
var nemesisWalkLeft = new Animation([
    { sprite: 'nemesis_left_walk_1', time: nemesisAnimSpeed },
    { sprite: 'nemesis_left_walk_2', time: nemesisAnimSpeed },
    { sprite: 'nemesis_left_walk_3', time: nemesisAnimSpeed },
    { sprite: 'nemesis_left_walk_2', time: nemesisAnimSpeed }
], sprites);
var nemesisWalkRight = new Animation([
    { sprite: 'nemesis_right_walk_1', time: nemesisAnimSpeed },
    { sprite: 'nemesis_right_walk_2', time: nemesisAnimSpeed },
    { sprite: 'nemesis_right_walk_3', time: nemesisAnimSpeed },
    { sprite: 'nemesis_right_walk_2', time: nemesisAnimSpeed }
], sprites);
var nemesisWalkBack = new Animation([
    { sprite: 'nemesis_back_walk_1', time: nemesisAnimSpeed },
    { sprite: 'nemesis_back_walk_2', time: nemesisAnimSpeed },
    { sprite: 'nemesis_back_walk_3', time: nemesisAnimSpeed },
    { sprite: 'nemesis_back_walk_2', time: nemesisAnimSpeed }
], sprites);






// Positions and Boundry Helpers
var roomOffsetTop = 0;
var roomOffsetLeft = 0;
var bounds = {
	top: 0,
	left: 0,
	right: (CANVAS_WIDTH - CHARACTER_SPRITE_WIDTH_SCALED),
	bottom: (PLAY_AREA_HEIGHT - CHARACTER_SPRITE_HEIGHT_SCALED )
}


// Game objects
var hero = {
	speed: 256, // movement in pixels per second
	animation: heroWalkForward,
	moving: false,
	direction: "forward",
	lifeRemaining: 3
};






function Monster() {}
Monster.prototype.reverseDirection = function()
{
	switch (this.direction)
	{
		case DIRECTION_BACK:
			this.direction = DIRECTION_FORWARD;
			this.animation = zombieWalkForward;
			break;
		case DIRECTION_FORWARD:
			this.direction = DIRECTION_BACK;
			this.animation = zombieWalkBack;
			break;
		case DIRECTION_LEFT:
			this.direction = DIRECTION_RIGHT;
			this.animation = zombieWalkRight;
			break;
		case DIRECTION_RIGHT:
			this.direction = DIRECTION_LEFT;
			this.animation = zombieWalkLeft;
			break;
	}
};

var monsters = Array();
var monstersCaught = 0;
for (var i=0;i<levels[currentLevel-1].monstersInGame;i++){
	monsters[i] = new Monster();
	monsters[i].speed = 20;
}







var nemisis = {
	speed: 100, // movement in pixels per second
	animation: nemesisWalkForward,
	direction: DIRECTION_FORWARD,
	lastRedirect: 0,
	redirectRate: 2500
};


function resetMonster(monsterId)
{
	// Randomly Position Monster
	monsters[monsterId].posX = 32 + (Math.random() * (levels[currentLevel-1].roomWidth - 64));
	monsters[monsterId].posY = 32 + (Math.random() * (levels[currentLevel-1].roomHeight - 64));
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


function resetHero()
{
	roomOffsetTop = 0;
	roomOffsetLeft = 0;
	hero.x = CANVAS_WIDTH / 2;
	hero.y = CANVAS_HEIGHT / 2;
}





// Handle keyboard controls
var keysDown = {};
addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);
addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);


// Update game objects
var update = function (modifier) {
	
	var backgroundSlideTrigger = 0;
	var roomOffsetBoundry = 0;
	var playerDelta = hero.speed * modifier;
	var currentCounter = Date.now();
	
	if (38 in keysDown)  // Player holding up
	{
		backgroundSlideTrigger = bounds.top+(2*CHARACTER_SPRITE_WIDTH);
		roomOffsetBoundry = 0;
		
		if ( hero.y <= backgroundSlideTrigger && roomOffsetTop > roomOffsetBoundry )
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
		backgroundSlideTrigger = bounds.bottom-(2*CHARACTER_SPRITE_WIDTH);
		roomOffsetBoundry = levels[currentLevel-1].roomHeight - PLAY_AREA_HEIGHT;
		
		if ( hero.y >= backgroundSlideTrigger && roomOffsetTop < roomOffsetBoundry )
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
		backgroundSlideTrigger = bounds.left+(2*CHARACTER_SPRITE_WIDTH);
		roomOffsetBoundry = 0;

		if ( hero.x <= backgroundSlideTrigger && roomOffsetLeft > roomOffsetBoundry )
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
		backgroundSlideTrigger = bounds.right-(2*CHARACTER_SPRITE_WIDTH);
		roomOffsetBoundry =  levels[currentLevel-1].roomWidth - CANVAS_WIDTH;
		
		if ( hero.x >= backgroundSlideTrigger && roomOffsetLeft < roomOffsetBoundry )
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
	
	
	// Hero / Nemisis Collisions
	if (
		hero.x <= (nemisis.x + CHARACTER_SPRITE_WIDTH_SCALED)
		&& nemisis.x <= (hero.x + CHARACTER_SPRITE_WIDTH_SCALED)
		&& hero.y <= (nemisis.y + CHARACTER_SPRITE_HEIGHT_SCALED)
		&& nemisis.y <= (hero.y + CHARACTER_SPRITE_HEIGHT_SCALED)
	) {
		--hero.lifeRemaining;
		resetHero();
	}


	// Move Nemisis
	// Check For Collisions
	// Increment Monster Movement
	var nemisisDelta = nemisis.speed * modifier;
	switch (nemisis.direction)
	{
		case DIRECTION_FORWARD:
			nemisis.posY += nemisisDelta;
			break;
		case DIRECTION_LEFT:
			nemisis.posX -= nemisisDelta;
			break;
		case DIRECTION_RIGHT:
			nemisis.posX += nemisisDelta;
			break;
		case DIRECTION_BACK:
			nemisis.posY -= nemisisDelta;
			break;
	}

	// Adjust for map movement
	nemisis.x = nemisis.posX - roomOffsetLeft;
	nemisis.y = nemisis.posY - roomOffsetTop;
	
	// Border Collisions
	if ( nemisis.posY <= 0 ) {
		nemisis.direction = DIRECTION_FORWARD;
		nemisis.animation = nemesisWalkForward;
		nemisis.lastRedirect = Date.now();
	}
	if ( (nemisis.posY + CHARACTER_SPRITE_HEIGHT_SCALED) >= levels[currentLevel-1].roomHeight ) {
		nemisis.direction = DIRECTION_BACK;
		nemisis.animation = nemesisWalkBack;
		nemisis.lastRedirect = Date.now();
	}
	if ( nemisis.posX <= 0 ) {
		nemisis.direction = DIRECTION_RIGHT;
		nemisis.animation = nemesisWalkRight;
		nemisis.lastRedirect = Date.now();
	}
	if ( (nemisis.posX + CHARACTER_SPRITE_WIDTH_SCALED) >=  levels[currentLevel-1].roomWidth ) {
		nemisis.direction = DIRECTION_LEFT;
		nemisis.animation = nemesisWalkLeft;
		nemisis.lastRedirect = Date.now();
	}
	
	// Update Nemisis Redirection every so often
	if( currentCounter - nemisis.lastRedirect > nemisis.redirectRate )
	{
		if (Math.random()>0.6) // Redirect 40% of the time
		{
			console.log('nemisis redirecting');
			var newDirection;
			do {
				newDirection = Math.floor((Math.random()*4)+1);
			} while ( newDirection == nemisis.direction );
			nemisis.direction = newDirection;
			switch( nemisis.direction ) {
				case DIRECTION_FORWARD:
					nemisis.animation = nemesisWalkForward;
					break;
				case DIRECTION_LEFT:
					nemisis.animation = nemesisWalkLeft;
					break;
				case DIRECTION_RIGHT:
					nemisis.animation = nemesisWalkRight;
					break;
				case DIRECTION_BACK:
					nemisis.animation = nemesisWalkBack;
					break; 
			}
			nemisis.lastRedirect = currentCounter;
		}
	}


	// Move the monster
	// Check For Collisions
	for (var i=0;i<levels[currentLevel-1].monstersInGame;i++)
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
			hero.x <= (monsters[i].x + CHARACTER_SPRITE_WIDTH_SCALED)
			&& monsters[i].x <= (hero.x + CHARACTER_SPRITE_WIDTH_SCALED)
			&& hero.y <= (monsters[i].y + CHARACTER_SPRITE_HEIGHT_SCALED)
			&& monsters[i].y <= (hero.y + CHARACTER_SPRITE_HEIGHT_SCALED)
		) {
			++monstersCaught;
			resetMonster(i)
		}
		
		
		// Nemesis / Monster Collisions
		if(
			nemisis.x <= (monsters[i].x + CHARACTER_SPRITE_WIDTH_SCALED)
			&& monsters[i].x <= (nemisis.x + CHARACTER_SPRITE_WIDTH_SCALED)
			&& nemisis.y <= (monsters[i].y + CHARACTER_SPRITE_HEIGHT_SCALED)
			&& monsters[i].y <= (nemisis.y + CHARACTER_SPRITE_HEIGHT_SCALED)
		) {
			
		}
		
		// Monster/Border Collisions
		if ( (monsters[i].posY <= 0 && monsters[i].direction == DIRECTION_BACK) ||
			 (monsters[i].posX <= 0 && monsters[i].direction == DIRECTION_LEFT) ||
			 ((monsters[i].posY + CHARACTER_SPRITE_HEIGHT_SCALED) >= levels[currentLevel-1].roomHeight && monsters[i].direction == DIRECTION_FORWARD) ||
			 ((monsters[i].posX + CHARACTER_SPRITE_WIDTH_SCALED) >=  levels[currentLevel-1].roomWidth && monsters[i].direction == DIRECTION_RIGHT)
		) {
			monsters[i].reverseDirection();
		}
	}


};




// Draw everything
var render = function (modifier) {
	ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
	
	if (bgReady) {
		ctx.drawImage(bgImage, roomOffsetLeft, roomOffsetTop, CANVAS_WIDTH, PLAY_AREA_HEIGHT, 0, 0, CANVAS_WIDTH, PLAY_AREA_HEIGHT);
	}

	if (characterSpritesReady)
	{
		var frame = '';
		
		// Update and draw Hero
		if (!hero.moving) {
			switch( hero.direction ) {
				case "forward":
					frame = sprites.getOffset(heroName+'_forward_walk_2');
					break;
				case "back":
					frame = sprites.getOffset(heroName+'_back_walk_2');
					break;
				case "left":
					frame = sprites.getOffset(heroName+'_left_walk_2');
					break;
				case "right":
					frame = sprites.getOffset(heroName+'_right_walk_2');
					break;
			}
			ctx.drawImage(characterSpritesImage, frame.x, frame.y, CHARACTER_SPRITE_WIDTH, CHARACTER_SPRITE_HEIGHT, hero.x, hero.y, CHARACTER_SPRITE_WIDTH_SCALED, CHARACTER_SPRITE_HEIGHT_SCALED);
		} else {
			hero.animation.animate(modifier);
			frame = hero.animation.getSprite();
			ctx.drawImage(characterSpritesImage, frame.x, frame.y, CHARACTER_SPRITE_WIDTH, CHARACTER_SPRITE_HEIGHT, hero.x, hero.y, CHARACTER_SPRITE_WIDTH_SCALED, CHARACTER_SPRITE_HEIGHT_SCALED);
		}

		// Update and Draw Each Zombie
		for (var i=0;i<levels[currentLevel-1].monstersInGame;i++)
		{
			monsters[i].animation.animate(modifier);
			frame = monsters[i].animation.getSprite();
			ctx.drawImage(characterSpritesImage, frame.x, frame.y, CHARACTER_SPRITE_WIDTH, CHARACTER_SPRITE_HEIGHT, monsters[i].x, monsters[i].y, CHARACTER_SPRITE_WIDTH_SCALED, CHARACTER_SPRITE_HEIGHT_SCALED);
		}
		
		// Update Nemisis
		nemisis.animation.animate(modifier);
		frame = nemisis.animation.getSprite();
		ctx.drawImage(characterSpritesImage, frame.x, frame.y, CHARACTER_SPRITE_WIDTH, CHARACTER_SPRITE_HEIGHT, nemisis.x, nemisis.y, CHARACTER_SPRITE_WIDTH_SCALED, CHARACTER_SPRITE_HEIGHT_SCALED);
	}
	
	// Draw Control Panel
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.fillRect(0,(CANVAS_HEIGHT-CONTROL_PANEL_HEIGHT),CANVAS_WIDTH,CONTROL_PANEL_HEIGHT);

	// Set up font Styles
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px 'VT323'";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";

	// Draw Score
	ctx.fillText("ZOMBIES SLAIN: " + monstersCaught, 20, 425);
	
	// Draw Level
	ctx.fillText("LEVEL: " + currentLevel, 20, 450);
	
	// Draw Life
	ctx.textAlign = "right";
	ctx.fillText("LIFE: " + hero.lifeRemaining, 620, 425);

	// Draw Timer
	// - To be implemented
	
	
};




function setUpLevel()
{
	// Throw the monster somewhere in the room randomly
	for (var i=0;i<levels[currentLevel-1].monstersInGame;i++){
		resetMonster(i);
	}
	
	nemisis.posX = 32 + (Math.random() * (levels[currentLevel-1].roomWidth - 64));
	nemisis.posY = 32 + (Math.random() * (levels[currentLevel-1].roomHeight - 64));
	nemisis.x = nemisis.posX - roomOffsetLeft;
	nemisis.y = nemisis.posY - roomOffsetTop;
	
	// Position Hero in the Center of the Screen
	hero.x = CANVAS_WIDTH / 2;
	hero.y = CANVAS_HEIGHT / 2;
}

function startGameLoop() {
	then = Date.now();
	gameLoop = setInterval(main, 1); // Execute as fast as possible
	gameRunning = true;
	$('#toggleGame').html("Pause Game");
}

function stopGameLoop() {
	clearInterval(gameLoop);
	gameRunning = false;
	$('#toggleGame').html("Resume Game");
}




// The main game loop
var main = function () {
	
	if( hero.lifeRemaining <= 0 )
	{
		stopGameLoop();
		alert('game over');
	}
	
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render(delta / 1000);

	then = now;
};


// Let's play this game!
$(document).ready(function()
{	
	setUpLevel()
	startGameLoop();
});





