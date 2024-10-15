let words = ['python', 'java', 'ide'];
let wordsInGame = []; // Aquí se almacenarán objetos con la palabra y su texto correspondiente
let currentWord = '';
let position = 0; // position
export class Game extends Phaser.Scene {

    constructor() {
        super({ key: 'game' });
    }

    preload(){
        this.load.image('space', '/static/image/space.jpeg');
        this.load.image('spaceship', '/static/image/spaceship-2.webp');
    }

    create(){
        // this.add.image(this.sys.game.config.width/2, this.sys.game.config.height/2, 'space');
        this.spaceship = this.add.image(this.sys.game.config.width/2, this.sys.game.config.height-50, 'spaceship');

        // Loop para generar palabras aleatorias cada 10 segundos
        this.time.addEvent({
            delay: 3000,
            callback: this.generateWord,
            callbackScope: this,
            loop: true
        });

        this.input.keyboard.on('keydown', this.keyPress, this);
        
        // agregar una linea recta 
        this.graphics = this.add.graphics();
        this.graphics.lineStyle(2, 0xff0000); // Establecer grosor y color de la línea
        this.graphics.beginPath();
        this.graphics.moveTo(this.spaceship.x, this.spaceship.y); // Punto de inicio de la línea
        if (wordsInGame.length > 0) {
            this.graphics.lineTo(wordsInGame[position].text.x, wordsInGame[position].text.y); // Punto final de la línea
        }// Punto final de la línea
        this.graphics.strokePath();
    }

    generateWord(){
        const word = Phaser.Utils.Array.GetRandom(words);
        const wordText = this.add.text(Phaser.Math.Between(50, 470), -30, word, { fontSize: '32px', fill: '#fff' });

        // Guardar objeto con la palabra y su texto
        wordsInGame.push({ word: word, text: wordText });


        // Función para que caigan en el eje y 
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


    // Evaluar si la tecla presionada coincide con la primera letra de alguna de las palabras 
    keyPress(event){
        if (currentWord == 0) {
            for (const [index, element] of wordsInGame.entries()) {
                if (element.word.startsWith(event.key)) {
                    currentWord = element.word;
                    position = index;
                    wordsInGame[position].text.setFill('#000')
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
            }
        }
    }
}
