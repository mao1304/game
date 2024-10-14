import { Game } from './game.js';
class Bullet extends Phaser.Physics.Arcade.Sprite
{
    constructor (scene, x, y)
    {
        super(scene, x, y, 'bullet');
    }

    fire (x, y)
    {
        this.body.reset(x, y);

        this.setActive(true);
        this.setVisible(true);

        this.setVelocityY(-300);
    }

    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);

        if (this.y <= -32)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}

class Bullets extends Phaser.Physics.Arcade.Group
{
    constructor (scene)
    {
        super(scene.physics.world, scene);

        this.createMultiple({
            frameQuantity: 5,
            key: 'bullet',
            active: false,
            visible: false,
            classType: Bullet
        });
    }

    fireBullet (x, y)
    {
        const bullet = this.getFirstDead(false);

        if (bullet)
        {
            bullet.fire(x, y);
        }
    }
}

class Example extends Phaser.Scene
{
    constructor ()
    {
        super();

        this.bullets;
        this.ship;
    }

    preload ()
    {
        this.load.setBaseURL('https://cdn.phaserfiles.com/v385');
        this.load.image('bullet', 'assets/sprites/bullets/bullet7.png');
        this.load.image('ship', 'assets/sprites/bsquadron1.png');
    }

    create ()
    {
        this.bullets = new Bullets(this);

        this.ship = this.add.image(400, 500, 'ship');

        this.input.on('pointermove', (pointer) =>
        {

            this.ship.x = pointer.x;

        });

        this.input.on('pointerdown', (pointer) =>
        {

            this.bullets.fireBullet(this.ship.x, this.ship.y);

        });
    }
}
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
