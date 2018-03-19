import Phaser from 'phaser';

export default class extends Phaser.State {
    create() {
        this.title = this.add.sprite(this.game.width / 2, this.game.height / 2, 'title');
        this.title.anchor.setTo(0.5, 0.5);
        this.title.alpha = 0;
        this.fade = this.game.add.tween(this.title).to({ alpha: 1 },
            4000, Phaser.Easing.Linear.None, true, 0, 1, true);
    }

    update() {
        // Stop fading out for the title when its alpha value becomes 1
        if (this.title.alpha === 1) {
            this.fade.pause();
        }
        if (this.game.input.activePointer.justPressed()) {
            this.game.state.start('Game');
        }
    }
}
