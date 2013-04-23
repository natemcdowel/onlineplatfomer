/************************************************************************************/
/*																					*/
/*		a player 2 entity    														*/
/*																					*/
/************************************************************************************/

var Player2Entity = me.ObjectEntity.extend({	
	init: function(x, y, settings) {  

		// call the constructor
		this.parent(x, y , settings);
			 
		// walking & jumping speed
		this.setVelocity(6, 25);
		
		this.setFriction(0.4,0);
		
		// update the hit box
		this.updateColRect(20,32, -1,0);
		this.dying = false;
		
		this.mutipleJump = 1;
	
		// set the display around our position 
		me.game.viewport.follow(this, me.game.viewport.AXIS.BOTH);
				
		// enable keyboard
		me.input.bindKey(me.input.KEY.A,	 "2left");
		me.input.bindKey(me.input.KEY.D, "2right");
		me.input.bindKey(me.input.KEY.W,	"2jump", true);
		me.input.bindKey(me.input.KEY.UP,	"2up");
		me.input.bindKey(me.input.KEY.DOWN,	"2down");

		
		// set a renderable
		this.renderable = game.texture.createAnimationFromName([
			"walk0001.png", "walk0002.png", "walk0003.png",
			"walk0004.png", "walk0005.png", "walk0006.png",
			"walk0007.png", "walk0008.png", "walk0009.png",
			"walk0010.png", "walk0011.png"
		]);
		
		// define a basic walking animatin
		this.renderable.addAnimation ("walk",  [0,2,1]);
		// set as default
		this.renderable.setCurrentAnimation("walk");

		// set the renderable position to bottom center
		this.anchorPoint.set(0.5, 1.0);

	},

	
	/* -----

		update the player pos
		
	------			*/
	update : function () {

		
		
		// socket.on('playermove', function (keystroke, clientIndex, x, y, map) {

		// 	// if (clientIndex != clientid) {
		// 		playerX = x;
		// 		playerY = y;  
		// 		playerMap = map;
		// 		socketUpdated = true;
		// 	// }
		// 	// return;
		// 	// alert(playerX + ' ' +playerY);
		// 	// // if (clientIndex == 1) {
		// 	// 	if (keystroke == 'left' ) left = true;
		// 	// 	if (keystroke == 'right') right = true;
		// 	// 	if (keystroke == 'up') up = true;

		// 	// 	globalClientIndex = clientIndex; 
		// 	// } 
		// 	// me.input.isKeyPressed('2left') = true
		// });

		socket.on('updateclientpos', function (users) {

 
			// console.log(users); 
			// alert(users[clientid][2]); 

			// Player x, y, map
			if (clientid == 0) {
				playerX = users[1][2];
				playerY = users[1][3];
			}
			if (clientid == 1) {
				playerX = users[0][2];
				playerY = users[0][3];
			}
			users = users;
		});  

			// console.log(playerMap + ' | ' + me.levelDirector.getCurrentLevelId())

			// if (playerMap != me.levelDirector.getCurrentLevelId()) {
			// 	console.log('not on the same level')
			// 	this.visible = false 
			// }
			

		

			// if ((left == true && clientid != globalClientIndex) || me.input.isKeyPressed('2left')) 	{ 

			// 		// alert(globalClientIndex);

			// 		this.vel.x -= this.accel.x * me.timer.tick; 
			// 		this.flipX(true); 
			// 		left = false; 

			// } else if ((right == true && clientid != globalClientIndex) || me.input.isKeyPressed('2right')) { 
			// 	this.vel.x += this.accel.x * me.timer.tick;
			// 	this.flipX(false);
			// 	right = false; 
			// }
			
			// if ((up == true && clientid != globalClientIndex)|| me.input.isKeyPressed('2jump')) {
				 
			// 	// reset the dblJump flag if off the ground
			// 	this.mutipleJump = (this.vel.y === 0)?1:this.mutipleJump;
				
			// 	if (this.mutipleJump<=1) {
			// 		// easy 'math' for double jump
			// 		this.vel.y -= (this.maxVel.y * this.mutipleJump++) * me.timer.tick;
			// 		me.audio.play("2jump", false);
			// 	}
			// 	up = false;  
			// }
		  
			
		// check for collision with environment
		// this.updateMovement();
		
		// // check if we fell into a hole
		// if (!this.inViewport && (this.pos.y > me.video.getHeight())) {
		// 	// if yes reset the game
		// 	me.game.remove(this);
		// 	me.game.viewport.fadeIn('#fff', 150, function(){
		// 		me.audio.play("die", false);
		// 		me.levelDirector.reloadLevel();
		// 		me.game.viewport.fadeOut('#fff', 150);
		// 	});
		// 	return true;
		// } 
		
		// // check for collision with sthg
		// var res = me.game.collide(this);

		// if (res) {
		// 	switch (res.obj.type) {	
		// 		case me.game.ENEMY_OBJECT : {
		// 			if ((res.y>0) && this.falling) {
		// 				// jump
		// 				this.vel.y -= this.maxVel.y * me.timer.tick;
		// 			} else {
		// 				this.hurt();
		// 			}
		// 			break;
		// 		}
				
		// 		case "spikeObject" :{
		// 			// jump & die
		// 			this.vel.y -= this.maxVel.y * me.timer.tick;
		// 			this.hurt();
		// 			break;
		// 		}

		// 		default : break;
		// 	}
		// }
		
		// // check if we moved (a "stand" animation would definitely be cleaner)
		// if (this.vel.x!=0 || this.vel.y!=0 || (this.renderable&&this.renderable.isFlickering())) {
		// 	this.parent();
		// 	return true;
		// }
		// if (socketUpdated == false) { 

		// 	console.log('socketno')
		// 	playerXlast = playerX;
		// 	playerYlast = playerX;;

		// 	this.pos.x = playerXlast;
		// 	this.pos.y = playerYlast;  
		// }
		// if (socketUpdated == true) { 
		// 	alert('yes')
			// console.log('socketyes')

		// }


		//Checking map against other player to see if they are in map
		socketResponse('checkmapserver',clientid);   
		socket.on('checkmapclient', function (users) {	

			// alert(users[clientid][4])

			if(users[0][4] != users[1][4]) {

				visiblePlayer = false;

			} 
			else {visiblePlayer = true;} 
		});   

		this.visible = visiblePlayer;  
		this.pos.x = playerX;
		this.pos.y = playerY; 

		return true;
	},

	
	/**
	 * ouch
	 */
	hurt : function () {
		// if (!this.renderable.flickering)
		// {
		// 	this.renderable.flicker(45);
		// 	// flash the screen
		// 	me.game.viewport.fadeIn("#FFFFFF", 75);
		// 	me.audio.play("die", false);
		// }
	}
});