import Phaser from 'phaser';

export default class extends Phaser.State {
    create() {
        // this.game.add.image(0, 0, 'gameover');
        for (let i = 0; i < 9; i += 1) {
            this.item = this.game.add.sprite((50 * i) + 80, -90, 'gameover', i);

            // Add a simple bounce tween to each character's position.
            this.game.add.tween(this.item).to({
                y: (this.game.height / 2) - 25,
            }, 2400, Phaser.Easing.Bounce.Out, true, 1000 + (400 * i), false);
        }
    }

    update() {
        if (this.game.input.activePointer.justPressed()) {
            this.game.state.start('play');
        }
    }
}
