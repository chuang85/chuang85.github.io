import 'pixi';
import 'p2';
import Phaser from 'phaser';

import BootState from './states/boot';
import PreloadState from './states/preload';
import MenuState from './states/menu';
import GameState from './states/game';
import GameoverState from './states/gameover';

import config from './config';

class Game extends Phaser.Game {

  constructor() {
    const docElement = document.documentElement;
    const width = docElement.clientWidth > config.gameWidth
        ? config.gameWidth : docElement.clientWidth;
    const height = docElement.clientHeight > config.gameHeight
        ? config.gameHeight : docElement.clientHeight;

    super(width, height, Phaser.AUTO, 'pixeldota2', null);

    this.state.add('Boot', BootState, false);
    this.state.add('Preload', PreloadState, false);
    this.state.add('Menu', MenuState, false);
    this.state.add('Game', GameState, false);
    this.state.add('Gameover', GameoverState, false);

    this.state.start('Boot');
  }
}

window.game = new Game();
