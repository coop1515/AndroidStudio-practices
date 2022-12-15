import Phaser from 'phaser'

import HelloWorldScene from './scenes/HelloWorldScene'
import Preloader from './scenes/Preloader';
import Game from './scenes/Game';
import GameOver from './scenes/GameOver';



const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 800,
	height: 640,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 },
			debug: true
		},
	},
	// 순서 신경 써줘야함.
	scene: [Preloader,Game,GameOver],
}

export default new Phaser.Game(config)
