/************************************************************************************/
/*																					*/
/*		a player entity																*/
/*																					*/
/************************************************************************************/

var weaponEntity = me.ObjectEntity.extend({	


	init: function (x, y, settings) {

		mainPlayer = me.game.getEntityByName('mainPlayer')
		// console.log(mainPlayer[0].pos.x)

		this.parent(mainPlayer[0].pos.x+10, mainPlayer[0].pos.y, settings);
		
		// make it collidable
		this.collidable = true;
		this.weapon = 'sword';
		this.cooldown = true;
		

	},

	attack : function () {

		var self = this;
		if (self.cooldown == true) {

			self.cooldown = false;
			setTimeout(function(){self.cooldown = true},700);
			// Which side is the player attacking?	
			if (clientData[0] == 'left') {
				this.updateColRect(-0,60, 20,25);
			}
			if (clientData[0] == 'right') {
				this.updateColRect(80,60, 20,25);
			} 	
		}
	},

	update : function () {

		this.updateColRect(0,0, 0,0);
		mainPlayer = me.game.getEntityByName('mainPlayer')
		this.pos.x = mainPlayer[0].pos.x;
		this.pos.y = mainPlayer[0].pos.y;

		if (mainPlayer[0].attack == true) { 
			this.attack(); 
		}

		// COLLISIONS with various objects
		var res = me.game.collide(this);
		// console.log(res);
		
		if (res) {
			switch (res.obj.type) {	
				case me.game.ENEMY_OBJECT : {
					// if ((res.y>0) && this.falling) {
					// 	// jump
					// 	this.vel.y -= this.maxVel.y * me.timer.tick;
					// } else {
					// 	this.hurt();
					// 	this.enemyhit();
					// }
					// break;
					// alert('test')
				}
				
				case "spikeObject" :{
					// jump & die
					this.vel.y -= this.maxVel.y * me.timer.tick;
					this.hurt();

					break;
				}

				default : break;
			}
		}
	}
});

var PlayerEntity = me.ObjectEntity.extend({	
	init: function(x, y, settings) { 

		y = nextScreenY;

		y = 1232;
		// Check if player reached screen and set position accordingly to new screen
		if (levelDirection == 'west') {
			x = 1550;
		}
		if (levelDirection == 'east') {
			x = 80;  
		}
		if (levelDirection == 'south') {
			y = 100;
			x = nextScreenX;
		}
		if (levelDirection == 'north') {
			y = 1100;
			x = nextScreenX;
		}

		// call the constructor
		this.parent(x, y , settings); 

		// Weapon delay
		this.cooldown = true;
		
		var socketArray = Array(); 
		socketArray[0] = clientid;
		socketArray[1] = me.levelDirector.getCurrentLevelId();

		// Setting our map in server 
		socketResponse('changemapserver', socketArray);  

		// walking & jumping speed 
		this.setVelocity(6, 22); 
		
		this.setFriction(0.4,0); 

		 
		// update the hit box
		this.updateColRect(20,32, -1,0); 
		this.dying = false;
		
		this.mutipleJump = 1;
		
		// set the display around our position 
		me.game.viewport.follow(this, me.game.viewport.AXIS.BOTH);

		if (settings.animationspeed) {
			this.renderable.animationspeed = settings.animationspeed; 
		}
				
		// enable keyboard
		me.input.bindKey(me.input.KEY.LEFT,	 "left");
		me.input.bindKey(me.input.KEY.RIGHT, "right"); 
		me.input.bindKey(me.input.KEY.UP,	"jump", true); 
		me.input.bindKey(me.input.KEY.X,	"attack"); 
		me.input.bindKey(me.input.KEY.DOWN,	"down");
		
		// define a basic walking animatin
		this.renderable.addAnimation ("walk",  [0,1,2]); 
		this.renderable.addAnimation ("crouch",  [3]);
		this.renderable.addAnimation ("jumpup",  [5]);
		this.renderable.addAnimation ("jumpdown", [4]);
		this.renderable.addAnimation ("attack",  [6,7,8]);
		// set as default
		this.renderable.setCurrentAnimation("walk"); 

		// set the renderable position to bottom center
		this.anchorPoint.set(0.5, 1.0); 


	},

	
	/* -----

		update the player pos
		
	------			*/
	update : function () { 

		var self = this;

		// Updating hit box every frame
		this.updateColRect(0,75, -1,0); 
		this.attack = false;

		this.renderable.setCurrentAnimation("walk");

		if (me.input.isKeyPressed('down')) {

			this.renderable.setCurrentAnimation("crouch");
		}
		if (me.input.isKeyPressed('attack'))	{ 

	
				this.renderable.setCurrentAnimation("attack");
				this.attack = true;
	

		} else if (me.input.isKeyPressed('left'))	{ 

			this.renderable.setCurrentAnimation("walk");

			// Loading next/previous level if at the end of the screen
			if (this.pos.x < 200) {levelDirection = 'west';}
			if (this.pos.x > 1100) {levelDirection = 'east';}
			if (this.pos.y > 1232) {levelDirection = 'south';}
			nextScreenX = this.pos.x
			nextScreenY = this.pos.y

			// Chopping up client data to be passed to server
    		clientData[0] = 'left';
    		clientData[1] = clientid; 
    		clientData[2] = this.pos.x; 
    		clientData[3] = this.pos.y;

			// socketResponse('keypress',clientData);  
			// socketResponse("syncplayers", 'left');

			this.vel.x -= this.accel.x * me.timer.tick;
			this.flipX(true);

		} else if (me.input.isKeyPressed('right')) {

			this.renderable.setCurrentAnimation("walk");

			// Loading next/previous level if at the end of the screen
			if (this.pos.x < 200) {levelDirection = 'west';}
			if (this.pos.x > 1100) {levelDirection = 'east';}
			if (this.pos.y > 1232) {levelDirection = 'south';}
			nextScreenX = this.pos.x
			nextScreenY = this.pos.y
			// console.log(nextScreenY);
			// console.log(levelDirection);

    		clientData[0] = 'right';
    		clientData[1] = clientid; 
    		clientData[2] = this.pos.x; 
    		clientData[3] = this.pos.y;

			// socketResponse('keypress',clientData);  
			this.vel.x += this.accel.x * me.timer.tick;
			this.flipX(false);
		}
		
		if (me.input.isKeyPressed('jump')) { 
			
			// Loading next/previous level if at the end of the screen
			if (this.pos.x < 200) {levelDirection = 'west';}
			if (this.pos.x > 1100) {levelDirection = 'east';}
			if (this.pos.y > 1232) {levelDirection = 'south';}
			nextScreenX = this.pos.x
			nextScreenY = this.pos.y
			// console.log(nextScreenY);
			// console.log(levelDirection);
			
    		clientData[0] = 'up';
    		clientData[1] = clientid; 
    		clientData[2] = this.pos.x;
    		clientData[3] = this.pos.y;

    		// socketResponse('keypress',clientData); 
			// reset the dblJump flag if off the ground
			this.mutipleJump = (this.vel.y === 0)?1:this.mutipleJump;
			
			if (this.mutipleJump<=1) {  // 2 for double jump

				// easy 'math' for double jump
				this.vel.y -= (this.maxVel.y * this.mutipleJump++) * me.timer.tick;
				me.audio.play("jump", false);
			}
		} 
		else if (this.vel.y > 0) {
			this.renderable.setCurrentAnimation("jumpdown"); 
			if (me.input.isKeyPressed('attack'))	{ 
				this.renderable.setCurrentAnimation("attack");
				this.attack = true;
			}
		}
		else if (this.vel.y < 0) {
			this.renderable.setCurrentAnimation("jumpup")
			if (me.input.isKeyPressed('attack'))	{ 
				this.renderable.setCurrentAnimation("attack");
				this.attack = true;
			}
		}	

	    // clientData[0] = 'up';
		clientData[1] = clientid; 
		clientData[2] = this.pos.x;
		clientData[3] = this.pos.y;
		socketResponse('keypress',clientData); 

		// Setting which way we want to go if map is changing
		if (this.vel.y > 0 && this.pos.y > 1230 ) {
			levelDirection = 'south';
		} 
		if (this.vel.y > 0 && this.pos.y < 150 ) {
			levelDirection = 'north';
		} 

		// check for collision with environment
		this.updateMovement();
		
		// check if we fell into a hole
		if (!this.inViewport && (this.pos.y > me.video.getHeight())) {
			// if yes reset the game
			me.game.remove(this);
			me.game.viewport.fadeIn('#fff', 150, function(){
				me.audio.play("die", false);
				me.levelDirector.reloadLevel();
				me.game.viewport.fadeOut('#fff', 150);
			});
			return true;
		}
		
		// COLLISIONS with various objects
		var res = me.game.collide(this);
		// console.log(res);
		
		if (res) {
			switch (res.obj.type) {	
				case me.game.ENEMY_OBJECT : {
					if ((res.y>0) && this.falling) {
						// jump
						this.vel.y -= this.maxVel.y * me.timer.tick;
					} else {
						this.hurt();
						this.enemyhit();
					}
					break;
				}
				
				case "spikeObject" :{
					// jump & die
					this.vel.y -= this.maxVel.y * me.timer.tick;
					this.hurt();

					break;
				}

				default : break;
			}
		}
		
		// check if we moved (a "stand" animation would definitely be cleaner)
		if (this.vel.x!=0 || this.vel.y!=0 || (this.renderable&&this.renderable.isFlickering())) {
			this.parent();
			return true;
		}

		return false;
	},

	
	/**
	 * ouch
	 */
	hurt : function () {
		if (!this.renderable.flickering)
		{
			this.renderable.flicker(45);
			// flash the screen
			me.game.viewport.fadeIn("#FFFFFF", 75);
			me.audio.play("die", false);
		}
	},

	enemyhit : function () {

		me.audio.play("die", false);
		
		this.hit = true;
		// console.log(this.hit);
	},


});


