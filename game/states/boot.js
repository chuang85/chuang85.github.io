
'use strict';

function Boot() {
}

Boot.prototype = {
	preload: function() {
		this.load.image('preloader', 'assets/preloader.gif');
		this.load.spritesheet('button', 'assets/button_sprite_sheet.png', 193, 71);
	},
	create: function() {
		this.game.input.maxPointers = 1;
		this.game.state.start('preload');

		// this.game.load.onLoadStart.add(loadStart, this);
		// this.game.load.onFileComplete.add(fileComplete, this);
		// this.game.load.onLoadComplete.add(loadComplete, this);

		// this.button = this.game.add.button(this.game.world.centerX - 95, 400, 'button', this.start, this, 2, 1, 0);
		// this.text = this.game.add.text(32, 32, 'Click to start load', { fill: '#ffffff' });
	},

	start: function() {
		this.game.load.start();
	},

	loadStart: function() {
		this.text.setText("Loading ...");
	},

	fileComplete: function() {
		this.text.setText("File Complete: " + progress + "% - " + totalLoaded + " out of " + totalFiles);
		var newImage = game.add.image(x, y, cacheKey);
		newImage.scale.set(0.3);
		x += newImage.width + 20;
		if (x > 700) {
			x = 32;
			y += 332;
		}
	},

	loadComplete: function() {
		this.text.setText("Load Complete");
	}
};

module.exports = Boot;
