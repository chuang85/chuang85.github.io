
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
