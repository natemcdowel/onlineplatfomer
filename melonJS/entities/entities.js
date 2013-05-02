

/**
 * a coin (collectable) entiry
 */
var CoinEntity = me.CollectableEntity.extend({	
	/** 
	 * constructor
	 */
	init: function (x, y, settings) {
		
		// call the parent constructor
		this.parent(x, y , settings);

		// add the coin sprite as renderable
		this.renderable = game.texture.createSpriteFromName("coin.png");
		
		// set the renderable position to bottom center
		this.anchorPoint.set(0.5, 1.0);
		var count = me.game.getEntityByGUID(this.GUID)
		
		
	},		
	

	/** 
	 * collision handling
	 */
	onCollision : function () {
		// do something when collide
		me.audio.play("cling", false);
		// give some score
		me.game.HUD.updateItemValue("score", 250);
		
		//avoid further collision and delete it
		this.collidable = false;
		coinid = this.GUID;
		socketResponse('destroy',coinid);    
	// me.game.remove(this); 	
		// console.log(Player2Entity)  
	},

	update : function () {

		socket.on('destroys', function (data) { 
			coinid = data;
		}); 

		if(coinid == this.GUID) 
		me.game.remove(this);

	}
	
}); 


var inventoryEntity = me.CollectableEntity.extend({	
	/** 
	 * constructor
	 */
	init: function (x, y, settings) {
		
		// call the parent constructor
		this.parent(x, y , settings);

		// add the coin sprite as renderable
		this.renderable = game.texture.createSpriteFromName("coin.png");
		
		// set the renderable position to bottom center
		this.anchorPoint.set(0.5, 1.0);
		var count = me.game.getEntityByGUID(this.GUID)
		
		
	},		
	

	/** 
	 * collision handling
	 */
	onCollision : function () {
		// do something when collide
		me.audio.play("cling", false);
		// give some score
		me.game.HUD.updateItemValue("score", 250);
		
		//avoid further collision and delete it
		this.collidable = false;
		coinid = this.GUID;
		socketResponse('destroy',coinid);    
	// me.game.remove(this); 	
		// console.log(Player2Entity)  
	},

	update : function () {

		socket.on('destroys', function (data) { 
			coinid = data;
		}); 

		if(coinid == this.GUID) 
		me.game.remove(this);

	}
	
}); 

/**
 * An enemy entity
 * follow a horizontal path defined by the box size in Tiled
 */
var PathEnemyEntity = me.ObjectEntity.extend({	
	/**
	 * constructor
	 */
	init: function (x, y, settings) {
		// call the parent constructor
		this.parent(x, y , settings);
		
		// apply gravity setting if specified
		this.gravity = settings.gravity || me.sys.gravity;
		
		// set start/end position
		this.startX = x;
		this.endX   = x + settings.width - settings.spritewidth
		this.pos.x  = x + settings.width - settings.spritewidth;
		
		this.walkLeft = false;

		// walking & jumping speed
		this.setVelocity(settings.velX || 1, settings.velY || 6);
		
		// make it collidable
		this.collidable = true;
		this.type = me.game.ENEMY_OBJECT;
	},
		
	
	/**
	 * manage the enemy movement
	 */
	update : function () {


		// do nothing if not visible
		if (!this.inViewport) {
			return false;
		}
		
		if (this.alive)	{
			if (this.walkLeft && this.pos.x <= this.startX) {
				this.vel.x = this.accel.x * me.timer.tick;
				this.walkLeft = false;
				this.flipX(true);
			} else if (!this.walkLeft && this.pos.x >= this.endX) {
				this.vel.x = -this.accel.x * me.timer.tick;
				this.walkLeft = true;
				this.flipX(false);
			}
		} else {
			this.vel.x = 0;
		}
		
		// check & update movement
		this.updateMovement();
		
		// return true if we moved of if flickering
		return (this.parent() || this.vel.x != 0 || this.vel.y != 0);
	},
	
	/**
	 * collision handle
	 */
	onCollision : function (res, obj) {
		// res.y >0 means touched by something on the bottom
		// which mean at top position for this one
		if (this.alive && (res.y > 0) && obj.falling) {
			// make it dead
			this.alive = false;
			// and not collidable anymore
			this.collidable = false;
			// set dead animation
			this.renderable.setCurrentAnimation("dead");
			// make it flicker and call destroy once timer finished
			var self = this;
			this.renderable.flicker(45, function(){me.game.remove(self)});
			// dead sfx
			me.audio.play("enemykill", false);
			// give some score
			me.game.HUD.updateItemValue("score", 150);
		}
	}

});

/**
 * An Slime enemy entity
 * follow a horizontal path defined by the box size in Tiled
 */
var SlimeEnemyEntity = PathEnemyEntity.extend({	
	/**
	 * constructor
	 */
	init: function (x, y, settings) {
		// parent constructor
		this.parent(x, y, settings);
	
		// set a renderable
		this.renderable = game.texture.createAnimationFromName([
			"slime_normal.png", "slime_walk.png", "slime_dead.png"
		]);

		// custom animation speed ?
		if (settings.animationspeed) {
			this.renderable.animationspeed = settings.animationspeed; 
		}

		// walking animatin
		this.renderable.addAnimation ("walk", [0,1]);
		// dead animatin
		this.renderable.addAnimation ("dead", [2]);
		
		// set default one
		this.renderable.setCurrentAnimation("walk");

		// set the renderable position to bottom center
		this.anchorPoint.set(0.5, 1.0);		
	}
});

/**
 * An Fly enemy entity
 * follow a horizontal path defined by the box size in Tiled
 */
var FlyEnemyEntity = PathEnemyEntity.extend({	
	/**
	 * constructor
	 */
	init: function (x, y, settings) {
		// parent constructor
		this.parent(x, y, settings);
	
		// set a renderable
		this.renderable = game.texture.createAnimationFromName([
			"fly_normal.png", "fly_fly.png", "fly_dead.png"
		]);

		// custom animation speed ?
		if (settings.animationspeed) {
			this.renderable.animationspeed = settings.animationspeed; 
		}

		// walking animatin
		this.renderable.addAnimation ("walk", [0,1]);
		// dead animatin
		this.renderable.addAnimation ("dead", [2]);
		
		// set default one
		this.renderable.setCurrentAnimation("walk");

		// set the renderable position to bottom center
		this.anchorPoint.set(0.5, 1.0);		
	}
});


/** 
 * a GUI object 
 * display score on screen
 */
var ScoreObject = me.HUD_Item.extend( {	
	/** 
	 * constructor
	 */
	init: function(x, y) {
		// call the parent constructor
		this.parent(x, y);
		// create a font
		this.font = new me.BitmapFont("atascii", {x:24});
		this.font.set("right", 1.6);
	},
	/**
	 * draw the score
	 */
	draw : function (context, x, y) {
		this.font.draw (context, this.value, this.pos.x +x, this.pos.y+y);
	}
});


/** 
 * a GUI object 
 * display score on screen
 */
var InventoryObject = me.HUD_Item.extend( {	
	/** 
	 * constructor
	 */
	init: function(x, y) {
		// call the parent constructor
		this.parent(x, y);
		// create a font
		this.font = new me.BitmapFont("atascii", {x:24});
		this.font.set("right", 1.6); 
	},
	/**
	 * draw the score
	 */
	draw : function (context, x, y) {
		this.font.draw (context, this.value, this.pos.x +x, this.pos.y+y);
	}
});

