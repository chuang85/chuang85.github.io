/* globals __DEV__ */
import Phaser from 'phaser';
import Hero from '../sprites/hero';
import Creep from '../sprites/creep';

export default class extends Phaser.State {
  create() {
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
    this.map.addTilesetImage('ground');
    this.map.setCollisionByExclusion([13]);
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
    // this.creepGenerator = this.game.time.events.loop(
    //     Phaser.Timer.SECOND * 2, this.generateCreeps, this);
    // this.creepGenerator.timer.start();

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
    for (let i = 0; i < 4; i += 1) {
      this.skillTimer[i] = this.game.time.create(false);
    }

    // add girl for victory
    this.girl = this.game.add.sprite(2735, 50, 'girl');
    this.game.physics.arcade.enableBody(this.girl);
    this.girl.animations.add('walk', [0, 1, 2], 10, true);
    this.girl.animations.play('walk');
  }

  update() {
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
  }

    /* Debug console */
  render() {
    if (__DEV__) {
        // this.game.debug.inputInfo(32, 32);
        // this.game.debug.spriteInfo(this.creep, 32, 32);
        // this.game.debug.spriteInfo(this.hero, 32, 32);
    }
  }

    /* Initialize the top ui panel for game */
  initUIPanel() {
    this.namePad = this.game.add.sprite(10, 15, 'namepad');
    this.profile = this.game.add.sprite(20, 20, 'profile');
    this.nameDisplay = this.game.add.text(80, 15, this.hero.name,
            { font: '30px LilyUPC', fill: '#000000', align: 'center' });
    this.healthbar = this.game.add.sprite(80, 45, 'healthbar');

    // Skill icons
    const skill1Icon = this.game.add.sprite(320, 20, 'skill1');
    const skill2Icon = this.game.add.sprite(390, 20, 'skill2');
    const skill3Icon = this.game.add.sprite(460, 20, 'skill3');
    const skill4Icon = this.game.add.sprite(530, 20, 'skill4');
    this.skillIcon = [skill1Icon, skill2Icon, skill3Icon, skill4Icon];

    // CD counters on skill icons
    const skill1CDcounter = this.game.add.bitmapText(335, 35, 'flappyfont', this.hero.currSkillCD[0].toString(), 24);
    const skill2CDcounter = this.game.add.bitmapText(405, 35, 'flappyfont', this.hero.currSkillCD[1].toString(), 24);
    const skill3CDcounter = this.game.add.bitmapText(475, 35, 'flappyfont', this.hero.currSkillCD[2].toString(), 24);
    const skill4CDcounter = this.game.add.bitmapText(545, 35, 'flappyfont', this.hero.currSkillCD[3].toString(), 24);
    this.skillCDcounter = [skill1CDcounter, skill2CDcounter, skill3CDcounter, skill4CDcounter];

    // Create a group for convenience
    this.UIGroup = this.game.add.group();
    this.UIGroup.add(this.namePad);
    this.UIGroup.add(this.profile);
    this.UIGroup.add(this.nameDisplay);
    this.UIGroup.add(this.healthbar);
    for (let i = 0; i < 4; i += 1) {
      this.UIGroup.add(this.skillIcon[i]);
      this.UIGroup.add(this.skillCDcounter[i]);
      this.skillCDcounter[i].visible = false;
    }
    this.UIGroup.fixedToCamera = true;
  }

    /* Initialize keyboard interations */
  initKeyboardLinstener() {
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
  }

    /* Main implementation for firing bullets */
  fireBullet() {
    if (!this.gameover) {
      if (this.game.time.now > this.bulletTime) {
        // Bullet time is the least time interval for next bullet
        this.bullet = this.bullets.getFirstExists(false);
        if (this.bullet) {
          this.hero.health -= 1;  // *************************comment later*************************
        // Disable bullet gravity
          this.bullet.body.allowGravity = false;
          if (this.hero.facing === 'left' || this.hero.lastFacing === 'left') {
            this.bullet.reset(this.hero.x - 6, this.hero.y - 8);
            this.bullet.body.velocity.x = -this.bulletSpeed;
          } else if (this.hero.facing === 'right' || this.hero.lastFacing === 'right') {
            this.bullet.reset(this.hero.x + 6, this.hero.y - 8);
            this.bullet.body.velocity.x = this.bulletSpeed;
          }
          this.bulletTime = this.game.time.now + 250;
        // bullet destroyed after 500ms
          this.bullet.lifespan = 300;
        }
      }
    }
  }

  resetBullet() {
    this.bullet.kill();
  }

    /* Create an explosion animation poll for reuse */
  createExplosionPoll() {
    this.explosions = this.game.add.group();
    for (let i = 0; i < 10; i += 1) {
      const explosionAnimation = this.explosions.create(0, 0, 'kaboom', [0], false);
      explosionAnimation.anchor.setTo(0.5, 0.5);
      explosionAnimation.animations.add('kaboom');
    }
  }

  cropHealthBar(origWidth) {
    const cropRect = {
      x: 0,
      y: 0,
      width: origWidth * (this.hero.health / this.hero.maxHealth),
      height: this.healthbar.height,
    };
    if (this.healthbar.width > 0) {
      this.healthbar.crop(cropRect);
    }
    if (this.healthbar.width <= 0) {
      this.makeGameOver();
    }
  }

  castSkill1() {
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
  }

  removeFury() {
    this.hero.loadTexture('hero', 6);
    this.hero.allowMultipleJump = false;
  }

  castSkill2() {
    // Handle the visual effects for cool down of skill icon and logic
    this.coolDownHandler(1);
    // Detail for skill 2
    if (this.hero.skillDetailReady[1]) {
      const healAmount = 2;
      this.hero.skillDetailReady[1] = false;
      // Avoid health overflow, which causes fatal texture error when rendering healthbar
      if (this.hero.health + healAmount > this.hero.maxHealth) {
        this.hero.health = this.hero.maxHealth;
      } else {
        this.hero.health += healAmount;
      }

      // Create emitter for heal animation
      const emitter = this.game.add.emitter(0, 0, 100);
      emitter.makeParticles('heal');
      emitter.setRotation(0, 0);
      emitter.gravity = -1500;
      emitter.minParticleScale = 0.6;
      emitter.maxParticleScale = 1;
      emitter.x = this.hero.x;
      emitter.y = this.hero.y;
      emitter.start(true, 1000, false, 4);
    }
  }

  castSkill3() {
    // Handle the visual effects for cool down of skill icon and logic
    this.coolDownHandler(2);
    // Detail for skill 3
  }

  castSkill4() {
    // Handle the visual effects for cool down of skill icon and logic
    this.coolDownHandler(3);
    // Detail for skill 4
  }

  coolDownHandler(skillNum) {
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
  }

  countDownCD(skillNum) {
    if (skillNum >= 0 && skillNum < 4) {
      this.hero.currSkillCD[skillNum] -= 1;
      this.skillCDcounter[skillNum].setText(this.hero.currSkillCD[skillNum].toString());
      if (this.hero.currSkillCD[skillNum] === 0) {
        this.skillTimer[skillNum].stop();
        this.skillIcon[skillNum].alpha = 1;
        this.skillCDcounter[skillNum].visible = false;
      }
    }
  }

  generateCreeps() {
    const creep = new Creep(this.game, 2000, 200, 30, 2);
    this.game.add.existing(creep);
    this.game.physics.arcade.collide(creep, this.ground);
  }

  deathHandler() {
    if (!this.gameover) {
      this.makeGameOver();
    }
  }

  /* Being called when game is over */
  makeGameOver() {
    this.gameover = true;
    this.hero.destroy();
    this.bullets.callAll('stop');
    for (let i = 0; i < 4; i += 1) {
      this.skillTimer[i].stop();
    }
    this.screenGray();
    this.game.time.events.add(Phaser.Timer.SECOND * 2, this.toGameOver, this);
  }

    /* Apply gray filter to entire game */
  screenGray() {
    this.background.filters = [this.gray];
    this.ground.filters = [this.gray];
    this.UIGroup.filters = [this.gray];
  }

    /* Handle game logic when bullet hits the creep */
  bulletHitsCreep() {
    this.bullet.kill();
    this.creep.damage();
        // create an explosion every time a bullet his the creep
    const explosionAnimation = this.explosions.getFirstExists(false);
    explosionAnimation.reset(this.bullet.body.x, this.bullet.body.y);
    explosionAnimation.play('kaboom', 30, false, true);
  }

    // creepHitsHero() {
    //
    // }

  toGameOver() {
    this.game.state.start('gameover');
  }

  vicrotyHandler() {
    const emitter = this.game.add.emitter(this.game.world.centerX, 0, 400);
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
}
