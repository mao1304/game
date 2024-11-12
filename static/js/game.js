const words = [
    'import', 'java',  'util',  'scanner',
    'public', 'class', 'sumanumeros', 
    'public', 'static', 'void', 'main',  'string', 'args', 
     'int', 'n1',  'n2',  'suma', 
    'scanner', 'teclado', 'new', 'scanner',  'system',  'in', 
    'system',  'out',  'print', 'introduzca', 'primer', 'numero:',
    'n1', 'teclado',  'nextInt', 
    'system',  'out',  'print', '"introduzca', 'segundo', 'numero:', 
    'suma', 'n1', 'n2',
    'system',  'out',  'println', '"La', 'suma', 'de', 'n1',  'mas', 'n2',  'es',  'suma', 
  ];
let wordsInGame = []; // Palabras que están cayendo en el juego
let enteredWords = []; // Palabras que el jugador ha ingresado correctamente
let wordsTextRight = []; // Palabras que se mostrarán en el lado derecho
let currentWord = '';
let position = -1;
let score = 0;
let timer = 0;

export class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'game' });
        this.bullets = null;
    }

    preload() {
        this.load.image('space', '/static/image/space.jpeg');
        this.load.image('spaceship', '/static/image/spaceship-2.webp');
        this.load.image('bullet', '/static/image/Pop-Cat.webp');
        this.load.image('enemy', '/static/image/paloma-2.webp');
    }

    create() {
        this.gameOver = false;
        wordsInGame = [];
        enteredWords = [];
        wordsTextRight = words.slice(); // Inicializamos las palabras en el texto derecho
        currentWord = '';
        position = -1;
        score = 0;
        timer = 0;

        console.log("Game scene started");

        // Crear el fondo del espacio y la nave espacial
        this.add.image(this.sys.game.config.width / 4, this.sys.game.config.height / 2, 'space');
        this.spaceship = this.add.image(this.sys.game.config.width / 4, this.sys.game.config.height - 50, 'spaceship');

        // Crear el grupo de balas
        this.bullets = new Bullets(this);

        // Crear un evento para generar palabras aleatorias cada 4 segundos
        this.time.addEvent({
            delay: 2000,
            callback: this.generateWord,
            callbackScope: this,
            loop: true
        });

        // Agregar un listener para las teclas presionadas
        this.input.keyboard.on('keydown', this.keyPress, this);

        // Crear el objeto gráfico para dibujar la línea
        this.graphics = this.add.graphics();

        // Crear texto para el puntaje y el tiempo
        this.scoreText = this.add.text(16, 16, 'Puntos: 0', { fontSize: '32px', fill: '#fff' });
        this.timerText = this.add.text(16, 50, 'Tiempo: 0', { fontSize: '32px', fill: '#fff' });

        // Crear el texto que muestra todas las palabras en el lado derecho
        this.fullText = this.add.text(this.sys.game.config.width / 2 + 50, 100, this.getFormattedRightText(), { fontSize: '32px', fill: '#ffffff', wordWrap: { width: 300 } });

        // Actualizar el contador de tiempo cada segundo
        this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    }

    update() {
        this.graphics.clear();
        this.graphics.lineStyle(2, 0xff0000);
        this.graphics.beginPath();
        this.graphics.moveTo(this.spaceship.x, this.spaceship.y);

        if (this.gameOver) return;

        wordsInGame.forEach(({ container }) => {
            if (container.y >= this.sys.game.config.height) {
                this.gameOver = true;
                this.scene.start('GameOverScene');
            }
        });
    }

    generateWord() {
        this.gameOver = false;
        const word = Phaser.Utils.Array.GetRandom(words);
        const wordText = this.add.text(0, 0, word, { fontSize: '32px', fill: '#fff' });
        const wordIcon = this.add.image(50, 50, 'enemy').setScale(0.5);

        const wordContainer = this.add.container(Phaser.Math.Between(50, 470), -30, [wordIcon, wordText]);

        wordsInGame.push({ word: word, container: wordContainer, text: wordText });

        this.tweens.add({
            targets: wordContainer,
            y: this.sys.game.config.height,
            duration: 4000,
            ease: 'Linear',
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
            this.bullets.fireBullet(this.spaceship.x, this.spaceship.y, wordsInGame[position].container.x - 20, wordsInGame[position].container.y - 20);

            currentWord = currentWord.substring(1);
            wordsInGame[position].text.setText(currentWord);

            if (currentWord.length === 0) {
                // Agregar la palabra a enteredWords
                enteredWords.push(wordsInGame[position].word);

                // Eliminar la palabra del arreglo de palabras en juego
                wordsInGame[position].container.destroy();
                wordsInGame.splice(position, 1);

                // Actualizar el puntaje
                score += 10;
                this.scoreText.setText('Puntos: ' + score);

                // Actualizar el texto de la derecha
                this.updateRightText();

                currentWord = '';
                position = -1;
            }
        }
    }

    updateTimer() {
        timer += 1;
        this.timerText.setText('Tiempo: ' + timer);
    }

    // Función para generar el texto de la derecha con el color adecuado
    updateRightText() {
        this.fullText.setText(this.getFormattedRightText());
    }

    // Función para generar el texto de la derecha con las palabras correctas en color rojo
    getFormattedRightText() {
        return wordsTextRight.map(word => {
            if (enteredWords.includes(word)) {
                return `<font color="#e40d0d">${word}</font>`; // Colorear las palabras correctas
            } else {
                return word;
            }
        }).join(' ');
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
        this.scene.physics.moveTo(this, targetX, targetY, 1500);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (this.y <= -32 || this.y >= this.scene.sys.game.config.height) {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}

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
