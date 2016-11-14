(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(600, 400, Phaser.AUTO, 'pixeldota2');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":4,"./states/gameover":5,"./states/menu":6,"./states/play":7,"./states/preload":8}],2:[function(require,module,exports){
'use strict';

var Creep = function(game, x, y, frame, hp) {
	Phaser.Sprite.call(this, game, x, y, 'creep', frame);
	this.anchor.setTo(0.5, 0.5);

	this.animations.add('left', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 15, true);
	this.animations.add('right', [10, 11, 12, 13, 14, 15, 16, 17, 18, 19], 15, true);

	this.maxHealth = hp;
	this.health = this.maxHealth;

	// enable physics on the hero
	this.game.physics.arcade.enableBody(this);
	this.animations.play('left');
};

Creep.prototype = Object.create(Phaser.Sprite.prototype);
Creep.prototype.constructor = Creep;

Creep.prototype.update = function() {


};

Creep.prototype.damage = function() {
	this.health -= 1;

	if (this.health <= 0) {
		this.alive = false;
		this.kill();
		return true;
	}
	return false;
};

module.exports = Creep;

},{}],3:[function(require,module,exports){
'use strict';

var Hero = function(game, x, y, frame, name, speed, hp, skillCD) {
	Phaser.Sprite.call(this, game, x, y, 'hero', frame);
	this.anchor.setTo(0.5, 0.5);

	// Add animations and facing right initially
	this.animations.add('left', [0, 1, 2], 10, true);
	this.animations.add('right', [3, 4, 5], 10, true);
	this.facing = 'right';
	this.lastFacing = 'right';

	this.name = name;
	this.speed = speed;
	this.maxHealth = hp;
	this.health = this.maxHealth;

	this.allowMultipleJump = false;

	// cool down of skills
	// -1 for passive skills
	// TODO: may change constructor for customizing hero
	this.skillCD = [skillCD[0], skillCD[1], skillCD[2], skillCD[3]];
	this.currSkillCD = [0, 0, 0, 0];

	// flags indicating whether hero is casting skill
	this.skillDetailReady = [false, false, false, false];

 	// enable physics on the hero
 	this.game.physics.arcade.enableBody(this);
 	this.body.collideWorldBounds = true;
 	// this.body.bounce.y = 0.2;
 	this.idle();
 };

 Hero.prototype = Object.create(Phaser.Sprite.prototype);
 Hero.prototype.constructor = Hero;

 Hero.prototype.update = function() {

 };

 Hero.prototype.moveLeft = function() {
 	this.body.velocity.x = -this.speed;
 	if (this.facing != 'left') {
 		this.animations.play('left');
 		this.facing = 'left';
 		this.lastFacing = 'left';
 	} 
 };

 Hero.prototype.moveRight = function() {
 	this.body.velocity.x = this.speed;
 	if (this.facing != 'right') {
 		this.animations.play('right');
 		this.facing = 'right';
 		this.lastFacing = 'right';
 	} 
 };

 Hero.prototype.idle = function() {
 	if (this.facing != 'idle') {
 		this.animations.stop();
 		if (this.facing == 'left') {
 			this.frame = 0;
 		} else {
 			this.frame = 5;
 		}
 		this.facing = 'idle';
 	}
 };

 Hero.prototype.jump = function() {
 	if (this.allowMultipleJump) {
 		this.body.velocity.y = -400;
 	}
 	else if (this.body.onFloor()) {
 		this.body.velocity.y = -400;
 	}	
 };

 Hero.prototype.damage = function() {
 	this.health -= 1;

 	if (this.health <= 0) {
 		this.alive = false;
 		this.kill();
 		return true;
 	}
 	return false;
 };

 Hero.prototype.skillReady = function(skillNum) {
 	return this.currSkillCD[skillNum] == 0;
 };

 Hero.prototype.skillPassive = function(skillNum) {
 	return this.skillCD[skillNum] == -1;
 };

 module.exports = Hero;

},{}],4:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
	preload: function() {
		this.load.image('preloader', 'assets/preloader.gif');
		this.load.spritesheet('button', 'assets/button_sprite_sheet.png', 193, 71);
	},
	create: function() {
		this.game.input.maxPointers = 1;
		this.game.state.start('preload');

		// this.game.load.onLoadStart.add(loadStart, this);
		// this.game.load.onFileComplete.add(fileComplete, this);
		// this.game.load.onLoadComplete.add(loadComplete, this);

		// this.button = this.game.add.button(this.game.world.centerX - 95, 400, 'button', this.start, this, 2, 1, 0);
		// this.text = this.game.add.text(32, 32, 'Click to start load', { fill: '#ffffff' });
	},

	start: function() {
		this.game.load.start();
	},

	loadStart: function() {
		this.text.setText("Loading ...");
	},

	fileComplete: function() {
		this.text.setText("File Complete: " + progress + "% - " + totalLoaded + " out of " + totalFiles);
		var newImage = game.add.image(x, y, cacheKey);
		newImage.scale.set(0.3);
		x += newImage.width + 20;
		if (x > 700) {
			x = 32;
			y += 332;
		}
	},

	loadComplete: function() {
		this.text.setText("Load Complete");
	}
};

module.exports = Boot;

},{}],5:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    // this.game.add.image(0, 0, 'gameover');
    for (var i = 0; i < 9; i++) {
      this.item = this.game.add.sprite(80 + 50* i, -90, 'gameover', i);

      // Add a simple bounce tween to each character's position.
      this.game.add.tween(this.item).to({y: this.game.height/2 - 25}, 2400, Phaser.Easing.Bounce.Out, true, 1000 + 400 * i, false);
    }
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;

},{}],6:[function(require,module,exports){

'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    this.title = this.add.sprite(this.game.width/2,this.game.height/2,'title');
    this.title.anchor.setTo(0.5,0.5);
    this.title.alpha = 0;
    this.fade = this.game.add.tween(this.title).to( { alpha: 1 }, 4000, Phaser.Easing.Linear.None, true, 0, 1, true);
  },
  update: function() {
    // Stop fading out for the title when its alpha value becomes 1
    if (this.title.alpha == 1) {
      this.fade.pause();
    }
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};

module.exports = Menu;

},{}],7:[function(require,module,exports){

'use strict';
var Hero = require('../prefabs/hero');
var Creep = require('../prefabs/creep');

function Play() {}
Play.prototype = {
  create: function() {
    // set world size
    // start the phaser arcade physics engine
    // give our world an initial gravity
    this.game.world.setBounds(0, 0, 3000, 400);
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 1200;

    // add the background sprite
    this.background = this.game.add.sprite(0, 0, 'background');

    // generate ground from tiled map
    this.map = this.game.add.tilemap('testlevel');
    this.map.addTilesetImage('tile_ground');
    this.map.setCollisionByExclusion([ 13 ]);
    this.ground = this.map.createLayer('Layer1');

    // create and add a new Hero object 400
    // speed = 200
    // hp = 10
    this.skillCDs = [15, 10, -1, 60];
    this.hero = new Hero(this.game, 900, 50, 30, 'Juggernaut', 200, 10, this.skillCDs);
    this.game.add.existing(this.hero);
    this.game.camera.follow(this.hero);

    // creep generated at x = 1700
    this.creep = new Creep(this.game, 2300, 100, 30, 4);
    this.game.add.existing(this.creep);

    this.creeps = this.game.add.group();

    // creep generator
    this.creepGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 2, this.generateCreeps, this);
    this.creepGenerator.timer.start();

    // bullets
    this.bulletTime = 0;
    this.bulletSpeed = 500;
    this.bullets = this.game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(30, 'bullet');
    this.bullets.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', this.resetBullet, this);
    this.bullets.setAll('checkWorldBounds', true);

    // setting top UI
    this.initUIPanel();

    // add keyboard controls
    this.initKeyboardLinstener();

    // game over setting
    this.gameover = false;
    this.gray = this.game.add.filter('Gray');

    //  explosion pool
    this.createExplosionPoll();

    // timers for skill CD
    this.skillTimer = new Array(4);
    for (var i = 0; i < 4; i++) {
      this.skillTimer[i] = this.game.time.create(false);
    }

    // add girl for victory
    this.girl = this.game.add.sprite(2735, 50, 'girl');
    this.game.physics.arcade.enableBody(this.girl);
    this.girl.animations.add('walk', [0, 1, 2], 10, true);
    this.girl.animations.play('walk');
  },
  update: function() {
    // Set initial velocity
    this.hero.body.velocity.x = 0;
    this.creep.body.velocity.x = -80;

    // Avoid creep stuck in river
    if (this.creep.y > 260) {
      this.creep.body.velocity.y = -300;
    }

    // Crop healthbar
    this.cropHealthBar(180);

    // Set collisions
    this.game.physics.arcade.collide(this.hero, this.ground);
    this.game.physics.arcade.collide(this.hero, this.creep);
    this.game.physics.arcade.collide(this.creep, this.ground);
    this.game.physics.arcade.collide(this.girl, this.ground);
    this.game.physics.arcade.collide(this.creep, this.hero, this.deathHandler, null, this);
    
    // Set overlaps
    this.game.physics.arcade.overlap(this.bullets, this.creep, this.bulletHitsCreep, null, this);
    this.game.physics.arcade.overlap(this.girl, this.hero, this.vicrotyHandler, null, this);

    // Allow the hero moving left and right
    // Handle hero facing direction, adjust when left or right is pressed
    if (this.cursors.left.isDown) {
      this.hero.moveLeft();
    } else if (this.cursors.right.isDown) {
      this.hero.moveRight();
    } else {
      this.hero.idle();
    }
  },

  // Debug console
  render: function() {
    // this.game.debug.inputInfo(32, 32);
    // this.game.debug.spriteInfo(this.creep, 32, 32);
    this.game.debug.spriteInfo(this.hero, 32, 32);
  },

  /* Initialize the top ui panel for game */
  initUIPanel: function() {
    this.namePad = this.game.add.sprite(10, 15, 'namepad');
    this.profile = this.game.add.sprite(20, 20, 'profile');
    this.nameDisplay = this.game.add.text(80, 15, this.hero.name, { font: "30px LilyUPC", fill: "#000000", align: "center" });
    this.healthbar = this.game.add.sprite(80, 45, 'healthbar');

    // Skill icons
    var skill1Icon = this.game.add.sprite(320, 20, 'skill1');
    var skill2Icon = this.game.add.sprite(390, 20, 'skill2');
    var skill3Icon = this.game.add.sprite(460, 20, 'skill3');
    var skill4Icon = this.game.add.sprite(530, 20, 'skill4');
    this.skillIcon = [skill1Icon, skill2Icon, skill3Icon, skill4Icon];

    // CD counters on skill icons
    var skill1CDcounter = this.game.add.bitmapText(335, 35, 'flappyfont',this.hero.currSkillCD[0].toString(), 24);
    var skill2CDcounter = this.game.add.bitmapText(405, 35, 'flappyfont',this.hero.currSkillCD[1].toString(), 24);
    var skill3CDcounter = this.game.add.bitmapText(475, 35, 'flappyfont',this.hero.currSkillCD[2].toString(), 24);
    var skill4CDcounter = this.game.add.bitmapText(545, 35, 'flappyfont',this.hero.currSkillCD[3].toString(), 24);
    this.skillCDcounter = [skill1CDcounter, skill2CDcounter, skill3CDcounter, skill4CDcounter];

    // Create a group for convenience
    this.UIGroup = this.game.add.group();
    this.UIGroup.add(this.namePad);
    this.UIGroup.add(this.profile);
    this.UIGroup.add(this.nameDisplay);
    this.UIGroup.add(this.healthbar);
    for (var i = 0; i < 4; i ++) {
      this.UIGroup.add(this.skillIcon[i]);
      this.UIGroup.add(this.skillCDcounter[i]);
      this.skillCDcounter[i].visible = false;
    }
    this.UIGroup.fixedToCamera = true;
  },

  /* Initialize keyboard interations */
  initKeyboardLinstener: function() {
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.jumpKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.jumpKey.onDown.add(this.hero.jump, this.hero);
    this.attackKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.attackKey.onDown.add(this.fireBullet, this);
    this.skill1Key = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
    this.skill2Key = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.skill3Key = this.game.input.keyboard.addKey(Phaser.Keyboard.E);
    this.skill4Key = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
    this.skill1Key.onDown.add(this.castSkill1, this);
    this.skill2Key.onDown.add(this.castSkill2, this);
    this.skill3Key.onDown.add(this.castSkill3, this);
    this.skill4Key.onDown.add(this.castSkill4, this);
  },

  /* Main implementation for firing bullets */
  fireBullet: function() {
    if (!this.gameover) {
      if (this.game.time.now > this.bulletTime) {
        // Bullet time is the least time interval for next bullet
        this.bullet = this.bullets.getFirstExists(false);
        if (this.bullet) {
          this.hero.health -= 1;  // *************************comment later*************************
          // Disable bullet gravity
          this.bullet.body.allowGravity = false;
          if (this.hero.facing == 'left' || this.hero.lastFacing == 'left') {
            this.bullet.reset(this.hero.x - 6, this.hero.y - 8);
            this.bullet.body.velocity.x = -this.bulletSpeed;
          } else if (this.hero.facing == 'right' || this.hero.lastFacing == 'right') {
            this.bullet.reset(this.hero.x + 6, this.hero.y - 8);
            this.bullet.body.velocity.x = this.bulletSpeed;
          }
          this.bulletTime = this.game.time.now + 250;
          // bullet destroyed after 500ms
          this.bullet.lifespan = 300;
        }
      }
    }
  },

  resetBullet: function(bullet) {
    this.bullet.kill();
  },

  /* Create an explosion animation poll for reuse */
  createExplosionPoll: function() {
    this.explosions = this.game.add.group();
    for (var i = 0; i < 10; i++) {
      var explosionAnimation = this.explosions.create(0, 0, 'kaboom', [0], false);
      explosionAnimation.anchor.setTo(0.5, 0.5);
      explosionAnimation.animations.add('kaboom');
    }
  },

  cropHealthBar: function(origWidth) {
    var cropRect = {x : 0, y : 0 , width : origWidth*(this.hero.health / this.hero.maxHealth), height : this.healthbar.height};
    if (this.healthbar.width > 0) {
      this.healthbar.crop(cropRect);
    }
    if (this.healthbar.width <= 0) {
      this.makeGameOver()
    }
  },

  castSkill1: function() {
    // Handle the visual effects for cool down of skill icon and logic
    this.coolDownHandler(0);
    // Detail for skill 1
    // TODO: think of refactoring for more hero
    if (this.hero.skillDetailReady[0]) {
      this.hero.loadTexture('tornado', 3);
      // this.skill1LastTimer = this.game.time.create(false);
      this.hero.animations.add('fury', [0, 1, 2], 10, true);
      this.hero.animations.play('fury');
      this.hero.skillDetailReady[0] = false;
      this.hero.allowMultipleJump = true;
      this.game.time.events.add(Phaser.Timer.SECOND * 4, this.removeFury, this);
    }
  },

  removeFury: function() {
    this.hero.loadTexture('hero', 6);
    this.hero.allowMultipleJump = false;
  },

  castSkill2: function() {
    // Handle the visual effects for cool down of skill icon and logic
    this.coolDownHandler(1);
    // Detail for skill 2
    if (this.hero.skillDetailReady[1]) {
      var healAmount = 2;
      this.hero.skillDetailReady[1] = false;
      // Avoid health overflow, which causes fatal texture error when rendering healthbar
      if (this.hero.health + healAmount > this.hero.maxHealth) {
        this.hero.health = this.hero.maxHealth;
      } else {
        this.hero.health += healAmount;
      }

      // Create emitter for heal animation
      var emitter = this.game.add.emitter(0, 0, 100);
      emitter.makeParticles('heal');
      emitter.setRotation(0, 0);
      emitter.gravity = -1500;
      emitter.minParticleScale = 0.6;
      emitter.maxParticleScale = 1;
      emitter.x = this.hero.x;
      emitter.y = this.hero.y;
      emitter.start(true, 1000, false, 4);
    }
  },

  castSkill3: function() {
    // Handle the visual effects for cool down of skill icon and logic
    this.coolDownHandler(2);
    // Detail for skill 3
  },
  
  castSkill4: function() {
    // Handle the visual effects for cool down of skill icon and logic
    this.coolDownHandler(3);
    // Detail for skill 4
  },

  coolDownHandler: function(skillNum) {
    if (skillNum >= 0 && skillNum < 4) {
      if (this.hero.skillReady(skillNum) && !this.hero.skillPassive(skillNum)) {
        // set icon to be semitransparent
        this.skillIcon[skillNum].alpha = 0.5;
        // change skill status
        this.hero.skillDetailReady[skillNum] = true;
        // starting counting down CD
        this.hero.currSkillCD[skillNum] = this.hero.skillCD[skillNum];
        this.skillCDcounter[skillNum].setText(this.hero.currSkillCD[skillNum].toString());
        this.skillCDcounter[skillNum].visible = true;

        this.skillTimer[skillNum].loop(Phaser.Timer.SECOND, this.countDownCD, this, skillNum);
        this.skillTimer[skillNum].start();
      }
    }
  },

  countDownCD: function(skillNum) {
    if (skillNum >= 0 && skillNum < 4) {
      this.hero.currSkillCD[skillNum] --;
      this.skillCDcounter[skillNum].setText(this.hero.currSkillCD[skillNum].toString());
      if (this.hero.currSkillCD[skillNum] == 0) {
        this.skillTimer[skillNum].stop();
        this.skillIcon[skillNum].alpha = 1;
        this.skillCDcounter[skillNum].visible = false;
      }
    }
  },

  generateCreeps: function() {
    // var creep = this.creeps.getFirstExists(false);
    // if (!creep) {
    //   creep = new Creep(this.game, 1000, 200, 30, 2);
    // }
    // creep.reset(this.game, 400, 200, 30, 2);
    // this.game.physics.arcade.collide(creep, this.ground);
    // creep.body.velocity.x = -150;
    var creep = new Creep(this.game, 2000, 200, 30, 2);
    this.game.add.existing(creep);
    this.game.physics.arcade.collide(creep, this.ground);
  },

  deathHandler: function() {
    if (!this.gameover) {
      this.makeGameOver();
    }
  },

  /* Being called when game is over */
  makeGameOver: function() {
    this.gameover = true;
    this.hero.destroy();
    this.bullets.callAll('stop');
    for (var i = 0; i < 4; i++) {
      this.skillTimer[i].stop();
    }
    this.screenGray();
    this.game.time.events.add(Phaser.Timer.SECOND * 2, this.toGameOver, this);
  },

  /* Apply gray filter to entire game */
  screenGray: function() {
    this.background.filters = [this.gray];
    this.ground.filters = [this.gray];
    this.UIGroup.filters = [this.gray];
  },

  /* Handle game logic when bullet hits the creep */
  bulletHitsCreep: function() {
    this.bullet.kill();
    var destroyed = this.creep.damage();
    // create an explosion every time a bullet his the creep
    var explosionAnimation = this.explosions.getFirstExists(false);
    explosionAnimation.reset(this.bullet.body.x, this.bullet.body.y);
    explosionAnimation.play('kaboom', 30, false, true);
  },

  creepHitsHero: function() {

  },

  toGameOver: function() {
    this.game.state.start('gameover');
  },

  vicrotyHandler: function() {
    var emitter = this.game.add.emitter(this.game.world.centerX, 0, 400);
    emitter.width = this.game.world.width;
    // emitter.angle = 30; // uncomment to set an angle for the rain.
    emitter.makeParticles('rain');
    emitter.minParticleScale = 0.1;
    emitter.maxParticleScale = 0.5;
    emitter.setYSpeed(300, 500);
    emitter.setXSpeed(-5, 5);
    emitter.minRotation = 0;
    emitter.maxRotation = 0;
    emitter.start(false, 1600, 5, 0);
  }
};

module.exports = Play;
},{"../prefabs/creep":2,"../prefabs/hero":3}],8:[function(require,module,exports){

'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.asset = this.add.sprite(this.width/2, this.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);
    this.load.setPreloadSprite(this.asset);

    this.load.image('title', 'assets/title.png');
    this.load.image('background', 'assets/background.png');
    this.load.image('bullet', 'assets/bullet.png');
    this.load.spritesheet('kaboom', 'assets/explosion.png', 64, 64, 23);
    this.load.image('critical', 'assets/criticalhit.png');

    // tilemap
    this.load.tilemap('testlevel', 'assets/ground.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('tile_ground', 'assets/ground.png');

    this.load.image('namepad', 'assets/hero/namepad.png');
    this.load.image('profile', 'assets/hero/jugg/jugg_profile.png');
    this.load.image('healthbar', 'assets/hero/healthbar.png');
    this.load.image('skill1', 'assets/hero/jugg/jugg_skill1.png');
    this.load.image('skill2', 'assets/hero/jugg/jugg_skill2.png');
    this.load.image('skill3', 'assets/hero/jugg/jugg_skill3.png');
    this.load.image('skill4', 'assets/hero/jugg/jugg_skill4.png');

    this.load.spritesheet('hero', 'assets/hero.png', 32, 32);
    this.load.spritesheet('creep', 'assets/babby.png', 114, 89);
    this.load.spritesheet('tornado', 'assets/hero/jugg/tornado_h48.png', 61, 48);
    this.load.spritesheet('girl', 'assets/girl.png', 32, 32);
    this.load.image('heal', 'assets/hero/jugg/heal.png');

    // fonts, gray effects
    this.load.bitmapFont('flappyfont', 'assets/fonts/flappyfont/flappyfont.png', 'assets/fonts/flappyfont/flappyfont.fnt');
    this.load.script('gray', 'assets/filters/Gray.js');
    this.load.spritesheet('gameover', 'assets/gameover_white.png', 50, 50);

    // rain
    this.load.spritesheet('rain', 'assets/rain.png', 17, 17);
  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;

},{}]},{},[1])