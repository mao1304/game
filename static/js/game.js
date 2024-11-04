let words = ['python', 'java', 'ide'];
let wordsInGame = []; // Aquí se almacenarán objetos con la palabra y su texto correspondiente
let currentWord = '';
let position = -1; // posición inicial

export class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'game' });
        this.bullets = null;
    }

    preload() {
        this.load.image('space', '/static/image/space.jpeg');
        this.load.image('spaceship', '/static/image/spaceship-2.webp');
        this.load.image('bullet', '/static/image/Pop-Cat.webp'); // Carga la imagen de la bala
        this.load.image('enemy', '/static/image/paloma-2.webp'); // Carga la imagen del enemigo
    }

    create() {
        this.gameOver = false;
        wordsInGame = []; // Limpiar el array de palabras en juego
        currentWord = ''; // Restablecer la palabra actual
        position = -1; // Restablecer la posición // Marca el juego como terminado
        console.log("Game scene started"); 
        // Crear el fondo del espacio y la nave espacial
        this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'space');
        this.spaceship = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height - 50, 'spaceship');

        // Crear el grupo de balas
        this.bullets = new Bullets(this);

        // Crear un evento para generar palabras aleatorias cada 4 segundos
        this.time.addEvent({
            delay: 4000,
            callback: this.generateWord,
            callbackScope: this,
            loop: true
        });

        // Agregar un listener para las teclas presionadas
        this.input.keyboard.on('keydown', this.keyPress, this);

        // Crear el objeto gráfico para dibujar la línea
        this.graphics = this.add.graphics();
    }

    update() {
        // Limpiar el gráfico antes de redibujar la línea
        this.graphics.clear();
        this.graphics.lineStyle(2, 0xff0000); // Establecer grosor y color de la línea
        this.graphics.beginPath();
        this.graphics.moveTo(this.spaceship.x, this.spaceship.y); // Punto de inicio de la línea

        if (this.gameOver) return; // Evita que el juego siga actualizando si ya terminó

        wordsInGame.forEach(({ container }) => {
            // Verifica si el contenedor de la palabra ha pasado el límite inferior del canvas
            if (container.y >= this.sys.game.config.height) {
                this.gameOver = true; // Marca el juego como terminado
                this.scene.start('GameOverScene'); // Cambia a la escena de "Game Over"
            }
        });
    }
    generateWord() {
        this.gameOver = false;
        const word = Phaser.Utils.Array.GetRandom(words);
        const wordText = this.add.text(0,0, word, { fontSize: '32px', fill: '#fff' }); // Posición relativa al contenedor
        const wordIcon = this.add.image(50, 50, 'enemy').setScale(0.5); // Posición relativa al contenedor

        // Crear un contenedor que agrupe la imagen y el texto
        const wordContainer = this.add.container(Phaser.Math.Between(50, 470), -30, [wordIcon, wordText]);

        // Guardar el objeto con la palabra y su contenedor
        wordsInGame.push({ word: word, container: wordContainer, text: wordText });

        // Hacer que las palabras caigan en el eje y
        this.tweens.add({
            targets: wordContainer,
            y: this.sys.game.config.height,
            duration: 2000,
            ease: 'Linear',
            // onComplete:() => {
            //     this.scene.start('GameOverScene');
            // }
        });
    }

    keyPress(event) {
        if (currentWord === '') {
            for (const [index, element] of wordsInGame.entries()) {
                if (element.word.startsWith(event.key)) {
                    currentWord = element.word;
                    position = index;
                    wordsInGame[position].text.setFill('#e40d0d');
                    break;
                }
            }
        }

        if (event.key === currentWord[0] && currentWord !== '') {
            // Disparar una bala hacia la palabra seleccionada
            this.bullets.fireBullet(this.spaceship.x, this.spaceship.y, wordsInGame[position].container.x-20, wordsInGame[position].container.y-20);

            // Eliminar la primera letra de la palabra
            currentWord = currentWord.substring(1);
            wordsInGame[position].text.setText(currentWord);

            // Si la palabra está vacía después de eliminar la letra, eliminar el contenedor completo
            if (currentWord.length === 0) {
                wordsInGame[position].container.destroy();
                wordsInGame.splice(position, 1); // Eliminar del array de palabras
                currentWord = ''; // Restablecer currentWord
                position = -1; // Restablecer la posición
            }
        }
    }
}

// Clase Bullet
class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'bullet');
    }

    fire(x, y, targetX, targetY) {
        this.body.reset(x, y);
        this.setActive(true);
        this.setVisible(true);

        // Calcular la velocidad para mover la bala hacia el objetivo
        this.scene.physics.moveTo(this, targetX, targetY, 1500);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        // Si la bala sale de la pantalla, se desactiva
        if (this.y <= -32 || this.y >= this.scene.sys.game.config.height) {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}

// Grupo de Balas
class Bullets extends Phaser.Physics.Arcade.Group {
    constructor(scene) {
        super(scene.physics.world, scene);

        this.createMultiple({
            frameQuantity: 5,
            key: 'bullet',
            active: false,
            visible: false,
            classType: Bullet
        });
    }

    fireBullet(x, y, targetX, targetY) {
        const bullet = this.getFirstDead(false);

        if (bullet) {
            bullet.fire(x, y, targetX, targetY);
        }
    }
}
