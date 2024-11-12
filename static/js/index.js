import { BootScene } from './base.js';
import { MenuScene } from './menu.js';
import { Game } from './game.js';
import { GameOverScene } from './gameOver.js'; 
import { WinGameScene } from './winGame.js';
const config = {
    type: Phaser.AUTO,
    width:1080,
    height: 768,
    scene: [BootScene, MenuScene, Game, GameOverScene,WinGameScene],
    physics: {
        default: 'arcade',
        arcade: {
            // gravity: { y: 200 }
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        // autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

const game = new Phaser.Game(config);
