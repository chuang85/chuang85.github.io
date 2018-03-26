import Phaser from 'phaser';

export default class extends Phaser.State {
  init() {
    this.asset = null;
    this.ready = false;
  }

  preload() {
    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.asset = this.add.sprite(this.width / 2, this.height / 2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);
    this.load.setPreloadSprite(this.asset);

    this.load.image('title', 'assets/pd2/title.png');
    this.load.image('background', 'assets/pd2/background.png');
    this.load.image('bullet', 'assets/pd2/bullet.png');
    this.load.spritesheet('kaboom', 'assets/pd2/explosion.png', 64, 64, 23);
    this.load.image('critical', 'assets/pd2/criticalhit.png');

    // tilemap
    this.load.tilemap('testlevel', 'assets/pd2/ground.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('ground', 'assets/pd2/ground.png');

    this.load.image('namepad', 'assets/pd2/hero/namepad.png');
    this.load.image('profile', 'assets/pd2/hero/jugg/jugg_profile.png');
    this.load.image('healthbar', 'assets/pd2/hero/healthbar.png');
    this.load.image('skill1', 'assets/pd2/hero/jugg/jugg_skill1.png');
    this.load.image('skill2', 'assets/pd2/hero/jugg/jugg_skill2.png');
    this.load.image('skill3', 'assets/pd2/hero/jugg/jugg_skill3.png');
    this.load.image('skill4', 'assets/pd2/hero/jugg/jugg_skill4.png');

    this.load.spritesheet('hero', 'assets/pd2/hero.png', 32, 32);
    this.load.spritesheet('creep', 'assets/pd2/babby.png', 114, 89);
    this.load.spritesheet('tornado', 'assets/pd2/hero/jugg/tornado_h48.png', 61, 48);
    this.load.spritesheet('girl', 'assets/pd2/girl.png', 32, 32);
    this.load.image('heal', 'assets/pd2/hero/jugg/heal.png');

    // fonts, gray effects
    this.load.bitmapFont('flappyfont',
        'assets/pd2/fonts/flappyfont/flappyfont.png', 'assets/pd2/fonts/flappyfont/flappyfont.fnt');
    this.load.script('gray', 'assets/pd2/filters/Gray.js');
    this.load.spritesheet('gameover', 'assets/pd2/gameover_white.png', 50, 50);

    // rain
    this.load.spritesheet('rain', 'assets/pd2/rain.png', 17, 17);
  }

  create() {
    this.asset.cropEnabled = false;
  }

  update() {
    if (this.ready) {
      this.game.state.start('Menu');
    }
  }

  onLoadComplete() {
    this.ready = true;
  }
}
