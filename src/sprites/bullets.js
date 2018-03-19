import Phaser from 'phaser';

export default class extends Phaser.Group {
  constructor(game, parent) {
    super(game, parent);

    this.game.physics.arcade.enableBody(this);
    this.createMultiple(30, 'bullet');
    this.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', this.resetBullet, this);
    this.setAll('checkWorldBounds', true);
  }

  fireBullet(gameTimeNow, bulletTime, hero) {
    if (gameTimeNow > bulletTime) {
      this.bullet = this.getFirstExists(false);
      if (this.bullet) {
        // Disable bullet gravity
        this.bullet.body.allowGravity = false;
        if (hero.facing === 'left') {
          this.bullet.reset(hero.x - 6, hero.y - 8);
          this.bullet.body.velocity.x = -500;
        } else if (hero.facing === 'right') {
          this.bullet.reset(hero.x + 6, hero.y - 8);
          this.bullet.body.velocity.x = 500;
        }
        // bulletTime = gameTimeNow + 250;
      }
    }
  }

  resetBullet(bullet) {
    bullet.kill();
  }
}
