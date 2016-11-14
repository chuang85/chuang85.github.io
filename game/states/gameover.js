
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
