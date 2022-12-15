import Phaser from "phaser";
import SceneKeys from "../consts/SceneKeys";
import TextureKeys from "../consts/TextureKeys";
import LaserObstacle from "../game/LaserObstacle";
import RocketMouse from './../game/RocketMouse';

export default class Game extends Phaser.Scene {
    private background !: Phaser.GameObjects.TileSprite;
    private mouseHole !: Phaser.GameObjects.Image;
    private window1 !: Phaser.GameObjects.Image;
    private window2 !: Phaser.GameObjects.Image;
    private bookCase1 !: Phaser.GameObjects.Image;
    
    private bookCase2 !: Phaser.GameObjects.Image;
    private bookcases: Phaser.GameObjects.Image[] = []
    private windows: Phaser.GameObjects.Image[] = []
    private laserObstacle !: LaserObstacle;
    private coins !: Phaser.Physics.Arcade.StaticGroup;
    private scoreLabel !: Phaser.GameObjects.Text
    private score = 0
    private mouse !: RocketMouse;

    init(){
        this.score = 0
    }



    constructor() {
        super(SceneKeys.Game)
    }

    // preload(){
    //     console.dir(Phaser);
    //     // this.load.image('background', 'house/bg_repeat_340x640.png')
    //     // this.load.atlas(
    //     //     'rocket-mouse',
    //     //     'characters/rocket-mouse.png',
    //     //     'characters/rocket-mouse.json'
    //     // )
    // }

    create() {

        // Preloader.ts로 소스 이동.
        // this.anims.create({
        //     key: 'rocket-mouse-run',
        //     frames: this.anims.generateFrameNames('rocket-mouse', {
        //         start: 1,
        //         end: 4,
        //         prefix: 'rocketmouse_run',
        //         zeroPad: 2,
        //         suffix: '.png'
        //     }),
        //     frameRate: 10,
        //     repeat: -1
        // })

        // background
        // this.add.image(0,0, 'background')
        //     .setOrigin(0,0)

        const width = this.scale.width
        const height = this.scale.height

        //tileSprite로 맞지않는 이미지 크기를 맞춰줌. 이어붙이기.
        this.background = this.add.tileSprite(0, 0, width, height, TextureKeys.Background)
            .setOrigin(0)
            .setScrollFactor(0, 0)

        this.mouseHole = this.add.image(
            Phaser.Math.Between(900, 1500),
            501,
            TextureKeys.MouseHole
        )

        this.window1 = this.add.image(
            Phaser.Math.Between(900, 1300),
            200,
            TextureKeys.Window1
        )

        this.window2 = this.add.image(
            Phaser.Math.Between(1600, 2000),
            200,
            TextureKeys.Window2
        )
        
        // 하나로 묶음
        this.windows = [this.window1, this.window2]

        this.bookCase1 = this.add.image(
            Phaser.Math.Between(2200, 2700),
            580,
            TextureKeys.BookCase1
        )
            .setOrigin(0.5, 1)

        this.bookCase2 = this.add.image(
            Phaser.Math.Between(2900, 3400),
            580,
            TextureKeys.BookCase2
        )
            .setOrigin(0.5, 1)
        
        // 하나로 묶음
        this.bookcases = [this.bookCase1, this.bookCase2]

        this.laserObstacle = new LaserObstacle(this, 900, 100)
        this.add.existing(this.laserObstacle)
        
        this.coins = this.physics.add.staticGroup()
        this.spawnCoins()

        // player
        // this.add.sprite(
        //     width * 0.5,
        //     height * 0.5,
        //     TextureKeys.RocketMouse,
        //     'rocketmouse_fly01.png'
        // ).play(AnimationKeys.RocketMouseRun)
        // const mouse = this.physics.add.sprite(
        //     width * 0.5,
        //     height * 0.5,
        //     TextureKeys.RocketMouse,
        //     'rocketmouse_fly01.png'
        // )
        // .setOrigin(0.5,1) //setOrigin 초기 시작 지점 x,y
        // .play(AnimationKeys.RocketMouseRun)

        this.mouse = new RocketMouse(this, width * 0.5, height - 30)
        this.add.existing(this.mouse)

        const body = this.mouse.body as Phaser.Physics.Arcade.Body;
        body.setCollideWorldBounds(true); //true 하면 화면 밖으로 못나감. false시 화면 밖으로 튀어나감.
        body.setVelocityX(200); // player가 X축으로 움직이는 속도.

        this.physics.world.setBounds(
            0, 0, // x y 게임화면의 x y
            Number.MAX_SAFE_INTEGER, height - 55 // width, height 플레이어가 이동할 수 있는 거리
        )
        
        this.cameras.main.startFollow(this.mouse) // this.mouse를 카메라가 따라간다.
        this.cameras.main.setBounds(0, 0, Number.MAX_SAFE_INTEGER, height) // 카메라가 볼 수있는 범위 설정

        // 레이저 overlap
        this.physics.add.overlap(
            this.laserObstacle,
            this.mouse,
            this.handleOverlapLaser,
            undefined,
            this
        )

        // 코인 overlap
        this.physics.add.overlap(
            this.coins,
            this.mouse,
            this.handleCollectionCoin,
            undefined,
            this
        )

        this.scoreLabel = this.add.text(10, 10, `Score: ${this.score}`, {
            fontSize: '24px',
            color: '#080808',
            backgroundColor: '#F8E71C',
            shadow: {fill:true, blur: 0, offsetY: 0},
            padding: {left: 15, right: 15, top: 10, bottom: 10}
        })
        .setScrollFactor(0)
    }

    update(t: number, dt: number) {
        // 쥐구멍 재생성
        this.wrapMouseHole()

        // 창문 다시 재생성
        this.WrapWindows()

        // 책장 재생성
        this.WrapBookcases()

        // 레이저 재생성
        this.wrapLaserObtacle()

        // 카메라따라 백그라운드도 이미지도 이동.
        this.background.setTilePosition(this.cameras.main.scrollX)

        this.teleportBackwards()


    }

    private wrapMouseHole() {
        const scrollX = this.cameras.main.scrollX
        const rightEdge = scrollX + this.scale.width

        if (this.mouseHole.x + this.mouseHole.width < scrollX) {
            this.mouseHole.x = Phaser.Math.Between(
                rightEdge + 100,
                rightEdge + 1000
            )
        }
    }

    private WrapWindows() {
        const scrollX = this.cameras.main.scrollX;
        const rightEdge = scrollX + this.scale.width //scrollX = 0에서 3(player속도에 따라 다름)씩 증가, this.scale.width 는 800
        // console.log(scrollX)
        // console.log(rightEdge)
        // multiply by 2 to add some more padding
        let width = this.window1.width * 2 //this.window1.width = 270 png파일크기 width window2도 동일.
        // console.log(this.window1.x) x의 값은 위에서 설정한대로 900 ~ 1300 사이
        if (this.window1.x + width < scrollX) {
            this.window1.x = Phaser.Math.Between(
                rightEdge + width,
                rightEdge + width + 800
            )
            // console.log(this.window1.x)
            const overlap = this.bookcases.find(bc => { // find함수 bookcases에 있는 bookcase1 bookcsae2 반복문
                // console.log(this.bookCase1.x)
                // console.log(this.bookCase2.x)
                // console.log(" bc " ,bc.x) // bc.x = bookcase?(2 after 1).x
                // console.log(" window1.x ", this.window1.x)
                // console.log(" window.width ", this.window1.width)
                // console.log(Math.abs(this.window1.x - bc.x) <= this.window1.width) 

                // window1.x와 bookcase의 거리가 270(this.window1.width)이 안되면 overlap되어있는거니까 TRUE를 반환.
                return Math.abs(this.window1.x - bc.x) <= this.window1.width 
            })

            this.window1.visible = !overlap // window1은 overlap = true 안보임. false면 보임 
        }

        width = this.window2.width // this.window2.width = 270 png 파일크기
        // console.log(width)
        if (this.window2.x + width < scrollX) {
            // console.log(" 2 ",this.window1.x)
            this.window2.x = Phaser.Math.Between(
                this.window1.x + width,
                this.window1.x + width + 800
            )

            const overlap = this.bookcases.find(bc => {
                return Math.abs(this.window2.x - bc.x) <= this.window2.width
            })

            this.window2.visible = !overlap
        }
    }

    private WrapBookcases() {
        const scrollX = this.cameras.main.scrollX; // 0부터 3(플레이어 이동속도)씩 증가.
        const rightEdge = scrollX + this.scale.width // this.scale.width = 800 게임 해상도 
        // console.log(rightEdge)
        // multiply by 2 to add some more padding
        let width = this.bookCase1.width * 2 // this.bookCase1.width = 262 png파일 크기
        if (this.bookCase1.x + width < scrollX) {
            this.bookCase1.x = Phaser.Math.Between(
                rightEdge + width,
                rightEdge + width + 800
            )
            
            //windows overlap과 동일.
            const overlap = this.windows.find(win => {
                return Math.abs(this.bookCase1.x - win.x) <= this.bookCase1.width
            })

            this.bookCase1.visible = !overlap
        }

        width = this.bookCase2.width //tihs.bookCase2.width = 262

        if (this.bookCase2.x + width < scrollX) {
            this.bookCase2.x = Phaser.Math.Between(
                this.bookCase1.x + width,
                this.bookCase1.x + width + 800
            )

            const overlap = this.windows.find(win => {
                return Math.abs(this.bookCase2.x - win.x) <= this.bookCase2.width
            })

            this.bookCase2.visible = !overlap
            this.spawnCoins()
        }
    }

    private wrapLaserObtacle() {
        const scrollX = this.cameras.main.scrollX
        const rightEdge = scrollX + this.scale.width

        const body = this.laserObstacle.body as Phaser.Physics.Arcade.StaticBody;

        const width = body.width;
        if(this.laserObstacle.x + width < scrollX) {
            
            this.laserObstacle.x = Phaser.Math.Between(
            rightEdge + width,
            rightEdge + width + 1000)

            this.laserObstacle.y = Phaser.Math.Between(0, 300)
            
            // console.log(this.laserObstacle.x)
            // console.log(body.offset.x);
            body.position.x = this.laserObstacle.x + body.offset.x;
            body.position.y = this.laserObstacle.y
        }

    }

    private handleOverlapLaser(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject)
	{   
        // console.log('overlap')
        // console.log(" obj ", obj1, " obj2 ", obj2)
		// const laser = obj1 as LaserObstacle
		const mouse = obj2 as RocketMouse // 이부분 다시 체크 obj1이랑 2 차이

		mouse.kill()
	}

    private spawnCoins(){
        
        // this.coins.children.each(child => {
        //     const coin = child as Phaser.Physics.Arcade.Sprite
        //     this.coins.killAndHide(coin) // 그룹.killAndHide(그룹원)
        //     coin.body.enable = false
        // })

        const scrollX = this.cameras.main.scrollX
        const rightEdge = scrollX + this.scale.width

        let x = rightEdge + 100

        // console.log("sc ", scrollX, " scale ", this.scale.width)
        // console.log(x)

        // 생성할 코인 갯수
        const numCoins = Phaser.Math.Between(1,20)
        // console.log(numCoins)

        // 코인 생성
        for (let i = 0; i < numCoins; ++i){
            const coin = this.coins.get(
                x,
                Phaser.Math.Between(100, this.scale.height - 100),
                TextureKeys.Coin
            ) as Phaser.Physics.Arcade.Sprite

            coin.setVisible(true)
            coin.setActive(true) // true로 설정하면 scenes uopdatelist에 의해 업데이트 됨

            const body = coin.body as Phaser.Physics.Arcade.StaticBody
            
            body.setCircle(body.width * 0.5) //hitbox의 모양을 원으로 만듬.
            
            //body와 충돌을 가능하게 함. -> player와 coin이 부딪히는걸 가능하게 해줌. 
            body.enable = true

            //  물리적 본체 활성화
            body.updateFromGameObject() // coin object body의 position, width, height를 update해주는것.

            x += coin.width * 1.5
        }

    }

    private handleCollectionCoin(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject)
    {
        // obj1 = rocketMouse, obj2 : ArcadeSprite2
        // console.log(obj2)
        const coin = obj2 as Phaser.Physics.Arcade.Sprite

        this.coins.killAndHide(coin)
        coin.body.enable = false // 안끄면 이미 획득한 coin의 hitbox에 닿을때도 계속 count됨.

        this.score += 1
        this.scoreLabel.text = `Scroe: ${this.score}`
    }

    private teleportBackwards(){ 
        const scrollX = this.cameras.main.scrollX
        const maxX = 2380
        // console.log(scrollX)
        if(scrollX > maxX)
        {
            this.mouse.x -= maxX // this.mouse.x == this.cameras.main.scrollX == scrollX
            this.mouseHole.x -= maxX

            this.windows.forEach(win => {
                win.x -= maxX
            })

            this.bookcases.forEach(bc => {
                bc.x -= maxX
            })

            this.laserObstacle.x -= maxX
            const laserBody = this.laserObstacle.body as Phaser.Physics.Arcade.StaticBody

            laserBody.x -= maxX

            this.spawnCoins()

            this.coins.children.each(child => {
                const coin = child as Phaser.Physics.Arcade.Sprite
                if(!coin.active){
                    return
                }

                coin.x -= maxX
                const body = coin.body as Phaser.Physics.Arcade.StaticBody
                body.updateFromGameObject()
            })

        }
    }
}