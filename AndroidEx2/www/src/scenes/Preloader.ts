import Phaser from "phaser";
import TextureKeys from "../consts/TextureKeys";
import SceneKeys from "../consts/SceneKeys";

export default class Preloader extends Phaser.Scene {

    constructor() {
        super(SceneKeys.Preloader)
    }

    preload() {
        this.load.image(TextureKeys.Background, 'house/bg_repeat_340x640.png')
        this.load.image(TextureKeys.MouseHole, 'house/object_mousehole.png')
        this.load.image(TextureKeys.Window1, 'house/object_window1.png')
        this.load.image(TextureKeys.Window2, 'house/object_window2.png')
        this.load.image(TextureKeys.BookCase1, 'house/object_bookcase1.png')
        this.load.image(TextureKeys.BookCase2, 'house/object_bookcase2.png')
        this.load.image(TextureKeys.LaserEnd, 'house/object_laser_end.png')
        this.load.image(TextureKeys.LaserMiddle, 'house/object_laser.png')
        this.load.image(TextureKeys.Coin, 'house/object_coin.png')
        // this.load.spritesheet(key, '.png', x, y, f) size = x * y, f=frame 를 사용해도 되지만
        // spritesheet는 각 프레임이 고정된 크기이고 ()
        // atlas는 크기가 다른 프레임을 가짐. -> 상황에 맞춰 사용하면 된다.
        this.load.atlas(
            TextureKeys.RocketMouse,
            'characters/rocket-mouse.png',
            'characters/rocket-mouse.json'
        )
    }

    create() {
        // RocketMouse.ts로 소스 이동
        // this.anims.create({
        //     key: AnimationKeys.RocketMouseRun,
        //     frames: this.anims.generateFrameNames(TextureKeys.RocketMouse, {
        //         start: 1,
        //         end: 4,
        //         prefix: 'rocketmouse_run',
        //         zeroPad: 2,
        //         suffix: '.png'
        //     }),
        //     frameRate: 10,
        //     repeat: -1
        // })

        // // fall animation
        // this.anims.create({
        //     key: AnimationKeys.RocketMousefall,
        //     frames: [{
        //         key: TextureKeys.RocketMouse,
        //         frame: 'rocketmouse_fall01.png'
        //     }]
        // })

        // // fly animation
        // this.anims.create({
        //     key: AnimationKeys.RocketMouseFly,
        //     frames: [{
        //         key: TextureKeys.RocketMouse,
        //         frame: 'rocketmouse_fly01.png'
        //     }]

        // })
        // // flame
        // this.anims.create({
        //     key: AnimationKeys.RocketFlamesOn,
        //     frames: this.anims.generateFrameNames(TextureKeys.RocketMouse,
        //         {
        //             start: 1,
        //             end: 2,
        //             prefix: 'flame',
        //             suffix: '.png'
        //         }),
        //     frameRate: 10,
        //     repeat: -1
        // })

        // //rocket dead
        // this.anims.create({
        //     key: AnimationKeys.RocketMouseDead,
        //     frames: this.anims.generateFrameNames(TextureKeys.RocketMouse,
        //         {
        //             start: 1,
        //             end : 2,
        //             prefix : 'rocketmouse_dead',
        //             zeroPad: 2,
        //             suffix: '.png'
        //         }),
        //         frameRate: 10
        // })

        this.scene.start(SceneKeys.Game)
    }

}