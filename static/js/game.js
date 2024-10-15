let words = ['python', 'java', 'ide'];
let wordsInGame = []; // Aquí se almacenarán objetos con la palabra y su texto correspondiente
let currentWord = '';
let position = 0; // posición actual

export class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'game' });
    }

    preload() {
        this.load.image('space', '/static/image/space.jpeg');
        this.load.image('spaceship', '/static/image/spaceship-2.webp');
    }

    create() {
        // Agregar la nave espacial al juego
        // this.add.image(this.sys.game.config.width/2, this.sys.game.config.height/2, 'space');
        this.spaceship = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height - 50, 'spaceship');

        // Crear un evento para generar palabras aleatorias cada 3 segundos
        this.time.addEvent({
            delay: 3000,
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

        // Dibujar la línea hacia la palabra seleccionada, si existe
        if (wordsInGame.length > 0 && wordsInGame[position]) {
            this.graphics.lineTo(wordsInGame[position].text.x+30, wordsInGame[position].text.y+30); // Punto final de la línea
        }

        this.graphics.strokePath();
    }

    generateWord() {
        const word = Phaser.Utils.Array.GetRandom(words);
        const wordText = this.add.text(Phaser.Math.Between(50, 470), -30, word, { fontSize: '32px', fill: '#fff' });

        // Guardar objeto con la palabra y su texto
        wordsInGame.push({ word: word, text: wordText });

        // Hacer que las palabras caigan en el eje y
        this.tweens.add({
            targets: wordText,
            y: this.sys.game.config.height,
            duration: 20000,
            ease: 'Linear',
            onComplete: function () {
                wordText.destroy();
            }
        });
    }

    keyPress(event) {
        if (currentWord == '') {
            for (const [index, element] of wordsInGame.entries()) {
                if (element.word.startsWith(event.key)) {
                    currentWord = element.word;
                    position = index;
                    wordsInGame[position].text.setFill('#e40d0d');
                    break;
                }
            }
        }
        if (event.key == currentWord[0]) {
            // Eliminar la primera letra de la palabra
            currentWord = currentWord.substring(1);

            // Actualizar el texto en pantalla
            wordsInGame[position].text.setText(currentWord);

            // Si la palabra está vacía después de eliminar la letra, puedes eliminarla
            if (currentWord.length === 0) {
                wordsInGame[position].text.destroy(); // Eliminar texto de la pantalla
                wordsInGame.splice(position, 1); // Eliminar de wordsInGame
                currentWord = ''; // Restablecer currentWord
                position = 0; // Restablecer posición
            }
        }
    }
}
