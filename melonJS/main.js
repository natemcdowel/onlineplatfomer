/* -----

	main 
	
	------*/
	

var game = {

	// game assets
	assets : [	
		{name: "tileset",		type:"image",	src: "data/gfx/Forestground@4x.png"},
		{name: "tileset",		type:"image",	src: "data/gfx/tileset.png"},
		{name: "atascii",		type:"image",	src: "data/gfx/atascii_24px.png"},
		{name: "background",	type:"image",	src: "data/gfx/background.png"},
		{name: "cling",			type: "audio",	src: "data/audio/",	channel : 2},
		{name: "die",			type: "audio",	src: "data/audio/",	channel : 1},
		{name: "enemykill",		type: "audio",	src: "data/audio/",	channel : 1},
		{name: "jump",			type: "audio",	src: "data/audio/",	channel : 2},
		// {name: "DST-GameForest",type: "audio",	src: "data/audio/",	channel : 1},
		// level map
		{name: "map1",			type: "tmx",	src: "data/map/map1.tmx"},
		{name: "map2",			type: "tmx",	src: "data/map/map2.tmx"},
		{name: "map3",			type: "tmx",	src: "data/map/map3.tmx"}, 

		// Lower tier
		{name: "map1-1",			type: "tmx",	src: "data/map/map1-1.tmx"},
		{name: "map2-1",			type: "tmx",	src: "data/map/map2-1.tmx"},
		// {name: "map3-1",			type: "tmx",	src: "data/map/map3-1.tmx"},

		// texturePacker
		// {name: "texture",		type: "tps",	src: "data/gfx/goblin.json"},
		{name: "simon",		type:"image",	src: "data/gfx/x-example-full4x.png"}, 
		{name: "skeleton",		type:"image",	src: "data/gfx/Skeleton3@4x.png"},
		{name: "crow",		type:"image",	src: "data/gfx/Crow@4x.png"}, 
		{name: "bat",		type:"image",	src: "data/gfx/Bat.png"},
		{name: "symph",		type:"image",	src: "data/gfx/sword.png"}, 
		{name: "goblin",		type:"image",	src: "data/gfx/gobl.png"},   
		{name: "lameenemy",		type:"image",	src: "data/gfx/lameenemyspr.png"},   
		{name: "texture",		type: "tps",	src: "data/gfx/texture.json"},
		{name: "texture",		type:"image",	src: "data/gfx/texture.png"}, 
		 
	],  

	
	/* ---
	
		Initialize the application
		
		---										*/

		
	onload: function()
	{
		// init the video

		if (!me.video.init('screen', 1280, 720, true, 'auto')) { 
			alert("Sorry but your browser does not support html 5 canvas. Please try with another one!");
			return;
		}
		// disable interpolation when scaling
		me.video.setImageSmoothing(false);

        // me.debug.renderHitBox = true;
		
		// install the debug panel plugin
		//me.plugin.register(debugPanel, "debug");
		
		// initialize the "sound engine"
		me.audio.init("mp3,ogg");
		
		// set all ressources to be loaded
		me.loader.onload = this.loaded.bind(this);
		
		// set all ressources to be loaded
		me.loader.preload(game.assets);
		
		// load everything & display a loading screen
		me.state.change(me.state.LOADING);

		// Debugger
		me.debug.renderHitBox;
	},
	
	
	/* ---
	
		callback when everything is loaded
		
		---										*/
	loaded: function ()	{

		// set the "Play/Ingame" Screen Object
		me.state.set(me.state.PLAY, new PlayScreen());
		
		// set the fade transition effect
		me.state.transition("fade","#FFFFFF", 250);

		// add our enemy entity in the entity pool
		
		me.entityPool.add("FlyEntity", FlyEnemyEntity);
		me.entityPool.add("SlimeEntity", SlimeEnemyEntity);
		var coin2 = me.entityPool.add("CoinEntity", CoinEntity); 

		// add our player entity in the entity pool

		
		me.entityPool.add("mainPlayer", PlayerEntity); 
		me.entityPool.add("sword", weaponEntity);   
		me.entityPool.add("secondPlayer", Player2Entity); 
		
		console.log(weapon); 

		// me.AnimationSheet(0, 0, "simon", spritewidth, spriteheight)

		// load the texture atlas file
		// this will be used by object entities later
		game.texture = new me.TextureAtlas(me.loader.getAtlas("texture"), me.loader.getImage("texture"));
		
		// switch to PLAY state
		me.state.change(me.state.PLAY);

	}
};

/* game initialization */
var PlayScreen = me.ScreenObject.extend( {
	// we just defined what to be done on reset
	// no need to do somehting else
	onResetEvent: function() {
		// load a level
		me.levelDirector.loadLevel("map1");
		
		// add a default HUD to the game mngr
		// me.game.addHUD(0,560,800,40);

		// add a default HUD to the game mngr
		me.game.addHUD(0,0,800,40);
		
		// add a new HUD item 
		me.game.HUD.addItem("score", new ScoreObject(700,00));
		// me.game.HUD.addItem("score", new ScoreObject(00,790));  
		
		// play some music
		// me.audio.playTrack("DST-GameForest");

	}

});

 /* Bootstrap */
window.onReady(function onReady() {
	game.onload();
});

