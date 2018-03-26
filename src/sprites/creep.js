import Phaser from 'phaser';

export default class extends Phaser.Sprite {
  constructor(game, x, y, frame, hp) {
    super(game, x, y, 'creep', frame);
    this.anchor.setTo(0.5, 0.5);

    this.animations.add('left', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 15, true);
    this.animations.add('right', [10, 11, 12, 13, 14, 15, 16, 17, 18, 19], 15, true);

    this.maxHealth = hp;
    this.health = this.maxHealth;

    // enable physics on the hero
    this.game.physics.arcade.enableBody(this);
    this.animations.play('left');
  }

  damage() {
    this.health -= 1;

    if (this.health <= 0) {
      this.alive = false;
      this.kill();
      return true;
    }
    return false;
  }
}
