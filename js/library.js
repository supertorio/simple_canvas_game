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