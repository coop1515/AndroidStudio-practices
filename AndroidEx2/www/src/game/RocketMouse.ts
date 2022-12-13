import Phaser from "phaser";
import AnimationKeys from "../consts/AnimationKeys";
import TextureKeys from "../consts/TextureKeys";
import SceneKeys from './../consts/SceneKeys';

enum MouseState {
    Running,
    killed,
    Dead
}

export default class RocketMouse extends Phaser.GameObjects.Container {


    private flames: Phaser.GameObjects.Sprite
    private mouse: Phaser.GameObjects.Sprite
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys

    private mouseState = MouseState.Running

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y)

        this.mouse = scene.add.sprite(0, 0, TextureKeys.RocketMouse)
            .setOrigin(0.5, 1)
        // .play(AnimationKeys.RocketMouseRun)

        this.flames = scene.add.sprite(-63, -15, TextureKeys.RocketMouse)
        // .play(AnimationKeys.RocketFlamesOn)

        this.createAnimations()
        this.mouse.play(AnimationKeys.RocketMouseRun)
        this.flames.play(AnimationKeys.RocketFlamesOn)

        this.enableJetpack(false)
        this.add(this.flames)
        this.add(this.mouse)

        // console.log(this)
        scene.physics.add.existing(this)

        const body = this.body as Phaser.Physics.Arcade.Body
        body.setSize(this.mouse.width * 0.5, this.mouse.height * 0.7)
        body.setOffset(this.mouse.width * -0.3, -this.mouse.height + 15) // 이거 대신 setOrigin으로도 위치조정 가능.

        this.cursors = scene.input.keyboard.createCursorKeys()
    }

    enableJetpack(enabled: boolean) {
        this.flames.setVisible(enabled)
    }

    kill() {
        // 이게 없으면 죽은 상태로 레이저에 닿게 되어도 kill()함수가 무한으로 불려짐.
        if (this.mouseState !== MouseState.Running) {
            return
        }

        this.mouseState = MouseState.killed;

        this.mouse.play(AnimationKeys.RocketMouseDead)

        const body = this.body as Phaser.Physics.Arcade.Body
        body.setAccelerationY(0)
        body.setVelocity(1000, 0)
        this.enableJetpack(false)
    }

    preUpdate() {

        const body = this.body as Phaser.Physics.Arcade.Body

        switch (this.mouseState) {
            case MouseState.Running:
                {
                    // check is space pressed
                    if (this.cursors.space?.isDown) {
                        body.setAccelerationY(-600)
                        this.enableJetpack(true)

                        this.mouse.play(AnimationKeys.RocketMouseFly, true)
                    }
                    else {
                        //AccelerationY를 다시 0으로 세팅.
                        body.setAccelerationY(0)
                        this.enableJetpack(false)
                        // this.mouse.play(AnimationKeys.RocketMousefall,true)
                    }

                    // check touching ground
                    if (body.blocked.down) {
                        this.mouse.play(AnimationKeys.RocketMouseRun, true)
                    }
                    else if (body.velocity.y > 0) {
                        this.mouse.play(AnimationKeys.RocketMousefall, true)
                    }
                    break;
                }

            case MouseState.killed: {
                body.velocity.x *= 0.99
                // console.log(body.velocity.x)
                if (body.velocity.x <= 5) {
                    this.mouseState = MouseState.Dead
                }
                break;
            }

            case MouseState.Dead: {
                body.setVelocity(0, 0)
                this.scene.scene.run(SceneKeys.GameOver)
                break;
            }
        }
    }

    private createAnimations() {
        this.mouse.anims.create({
            key: AnimationKeys.RocketMouseRun,
            frames: this.mouse.anims.generateFrameNames(TextureKeys.RocketMouse, {
                start: 1,
                end: 4,
                prefix: 'rocketmouse_run',
                zeroPad: 2,
                suffix: '.png'
            }),
            frameRate: 10,
            repeat: -1
        })

        // fall animation
        this.mouse.anims.create({
            key: AnimationKeys.RocketMousefall,
            frames: [{
                key: TextureKeys.RocketMouse,
                frame: 'rocketmouse_fall01.png'
            }]

        })

        // fly animation
        this.mouse.anims.create({
            key: AnimationKeys.RocketMouseFly,
            frames: [{
                key: TextureKeys.RocketMouse,
                frame: 'rocketmouse_fly01.png'
            }]

        })
        // flame
        this.flames.anims.create({
            key: AnimationKeys.RocketFlamesOn,
            frames: this.mouse.anims.generateFrameNames(TextureKeys.RocketMouse,
                {
                    start: 1,
                    end: 2,
                    prefix: 'flame',
                    suffix: '.png'
                }),
            frameRate: 10,
            repeat: -1
        })

        //rocket dead
        this.mouse.anims.create({
            key: AnimationKeys.RocketMouseDead,
            frames: this.mouse.anims.generateFrameNames(TextureKeys.RocketMouse,
                {
                    start: 1,
                    end: 2,
                    prefix: 'rocketmouse_dead',
                    zeroPad: 2,
                    suffix: '.png'
                }),
            frameRate: 10
        })
    }

}