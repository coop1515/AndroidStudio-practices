import Phaser from 'phaser'

import HelloWorldScene from './scenes/HelloWorldScene'
import Preloader from './scenes/Preloader';
import Game from './scenes/Game';
import GameOver from './scenes/GameOver';



const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	// 여기서 화면크기에 따라 게임 해상도를 맞춰줌.
	scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
	parent: 'app',
	width: 1280,
	height: 640,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 },
			// debug: true
		},
	},
	// 순서 신경 써줘야함.
	scene: [Preloader,Game,GameOver],
}

export default new Phaser.Game(config)
