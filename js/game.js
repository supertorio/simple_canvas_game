// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

var spriteWidth = 32;
var spriteHeight = 32;








// Image Sprite Base
var SpriteSheet = function(data) {
    this.load(data);
};
 
SpriteSheet.prototype = {
    _sprites: [],
    _width: 0,
    _height: 0,
 
    load: function(data) {
        this._height = data.height;
        this._width = data.width;
        this._sprites = data.sprites;
    },
 
    getOffset: function(spriteName) {
        //Go through all sprites to find the required one
        for(var i = 0, len = this._sprites.length; i < len; i++) {
            var sprite = this._sprites[i];
 
            if(sprite.name == spriteName) {
                //To get the offset, multiply by sprite width
                //Sprite-specific x and y offset is then added into it.
                return {
                    x: ((sprite.x*this._width)||0),
                    y: ((sprite.y*this._height)||0),
                    width: this._width,
                    height: this._height
                };
            }
        }
 
        return null;
    }
};

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
        { name: 'girl_back_walk_3',		x: 2, y: 3 }
    ]
});





var Animation = function(data, sprites) {
    this.load(data);
    this._sprites = sprites;
};
 
Animation.prototype = {
    _frames: [],
    _frame: null,
    _frameDuration: 0,
 
    load: function(data) {
        this._frames = data;
 
        //Initialize the first frame
        this._frameIndex = 0;
        this._frameDuration = data[0].time;
    },
 
    animate: function(deltaTime) {
        //Reduce time passed from the duration to show a frame        
        this._frameDuration -= deltaTime;
 
        //When the display duration has passed
        if(this._frameDuration <= 0) {
            //Change to next frame, or the first if ran out of frames
            this._frameIndex++;
            if(this._frameIndex == this._frames.length) {
                this._frameIndex = 0;
            }
 
            //Change duration to duration of new frame
            this._frameDuration = this._frames[this._frameIndex].time;
        }
    },
 
    getSprite: function() {
        //Return the sprite for the current frame
        return this._sprites.getOffset(this._frames[this._frameIndex].sprite);
    }
}













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
heroImage.src = "images/RE3___Monster_Sprites_v1_0_by_DoubleLeggy.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
hero.animation = heroWalkForward;
hero.moving = false;
hero.direction = "forward";
var monster = {};
var monstersCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {
	if (!hero.x) hero.x = canvas.width / 2;
	if (!hero.y) hero.y = canvas.height / 2;

	// Throw the monster somewhere on the screen randomly
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
		hero.animation = heroWalkBackwards;
		hero.direction = "back";
		hero.moving = true;
	}
	else if (40 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
		hero.animation = heroWalkForward;
		hero.direction = "forward";
		hero.moving = true;
	}
	else if (37 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
		hero.animation = heroWalkLeft;
		hero.direction = "left";
		hero.moving = true;
	}
	else if (39 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
		hero.animation = heroWalkRight;
		hero.direction = "right";
		hero.moving = true;
	} else {
		hero.moving = false;
	}

	// Are they touching?
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {
		++monstersCaught;
		reset();
	}
	
	// Border Collisions
	var bounds = {
		top: 0,
		left: 0,
		right: (canvas.width - spriteWidth),
		bottom: (canvas.height - spriteHeight)
	}
	if ( hero.y <= bounds.top )    { hero.y = bounds.top; }
	if ( hero.y >= bounds.bottom ) { hero.y = bounds.bottom; }
	if ( hero.x <= bounds.left )   { hero.x = bounds.left ; }
	if ( hero.x >= bounds.right )  { hero.x = bounds.right; }
};

// Draw everything
var render = function (modifier) {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
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
			ctx.drawImage(heroImage, frame.x, frame.y, spriteWidth, spriteHeight, hero.x, hero.y, 33, 33);
		} else {
			hero.animation.animate(modifier);
			frame = hero.animation.getSprite();
			ctx.drawImage(heroImage, frame.x, frame.y, spriteWidth, spriteHeight, hero.x, hero.y, 33, 33);
		}
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render(delta / 1000);

	then = now;
};

// Let's play this game!
reset();
var then = Date.now();
setInterval(main, 1); // Execute as fast as possible
