import Phaser from 'phaser';

export default class extends Phaser.Sprite {

  constructor(game, x, y, frame, name, speed, hp, skillCD) {
    super(game, x, y, 'hero', frame);
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
  }

    // update() {
    // }

  moveLeft() {
    this.body.velocity.x = -this.speed;
    if (this.facing !== 'left') {
      this.animations.play('left');
      this.facing = 'left';
      this.lastFacing = 'left';
    }
  }

  moveRight() {
    this.body.velocity.x = this.speed;
    if (this.facing !== 'right') {
      this.animations.play('right');
      this.facing = 'right';
      this.lastFacing = 'right';
    }
  }

  idle() {
    if (this.facing !== 'idle') {
      this.animations.stop();
      if (this.facing === 'left') {
        this.frame = 0;
      } else {
        this.frame = 5;
      }
      this.facing = 'idle';
    }
  }

  jump() {
    if (this.allowMultipleJump) {
      this.body.velocity.y = -400;
    } else if (this.body.onFloor()) {
      this.body.velocity.y = -400;
    }
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

  skillReady(skillNum) {
    return this.currSkillCD[skillNum] === 0;
  }

  skillPassive(skillNum) {
    return this.skillCD[skillNum] === -1;
  }
}
