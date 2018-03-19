import Phaser from 'phaser';

export default class extends Phaser.State {
  preload() {
    this.load.image('preloader', 'assets/pd2/preloader.gif');
  }

  create() {
    this.game.input.maxPointers = 1;
    this.game.state.start('Preload');
  }
}
