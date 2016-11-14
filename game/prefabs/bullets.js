'use strict';

var Bullets = function(game, parent) {
	Phaser.Group.call(this, game, parent);

	this.game.physics.arcade.enableBody(this);
	this.createMultiple(30, 'bullet');
	this.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', this.resetBullet, this);
	this.setAll('checkWorldBounds', true);	
};

Bullets.prototype = Object.create(Phaser.Group.prototype);
Bullets.prototype.constructor = Bullets;

Bullets.prototype.update = function() {

  // write your prefab's specific update code here
  
};

Bullets.prototype.fireBullet = function(gameTimeNow, bulletTime, hero) {
	if (gameTimeNow > bulletTime) {
		this.bullet = this.getFirstExists(false);
		if (this.bullet) {
      // Disable bullet gravity
      this.bullet.body.allowGravity = false;
      if (hero.facing == 'left') {
      	this.bullet.reset(hero.x - 6, hero.y - 8);
      	this.bullet.body.velocity.x = -500;
      } else if (hero.facing == 'right') {
      	this.bullet.reset(hero.x + 6, hero.y - 8);
      	this.bullet.body.velocity.x = 500;
      }
      bulletTime = gameTimeNow + 250;
    }
  }
};

Bullets.prototype.resetBullet = function(bullet) {
	bullet.kill();
}

module.exports = Bullets;
