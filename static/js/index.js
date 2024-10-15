import { Game } from './game.js';

const config = {
    type: Phaser.AUTO,
    width:512,
    height: 768,
    scene: [Game],
    physics: {
        default: 'arcade',
        arcade: {
            // gravity: { y: 200 }
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

const game = new Phaser.Game(config);
