import Phaser from './lib/phaser.js';

import Game from './scenes/Game.js';

import GameOver from "./scenes/GameOver.js";

// console.dir(Phaser);

// console.log("Hello, World!");

export default new Phaser.Game({
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    width: 480,
    height: 640,
    scene: [Game, GameOver],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },
            // debug: true
        }
    }
})