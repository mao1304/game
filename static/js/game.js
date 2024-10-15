let words = ['python', 'java', 'ide'];
let wordsInGame = []; // Aquí se almacenarán objetos con la palabra y su texto correspondiente
let currentWord = '';

export class Game extends Phaser.Scene {
    
    constructor() {
        super({ key: 'game' });
    }

    preload(){
        this.load.image('space', '/static/image/space.jpeg');
        this.load.image('spaceship', '/static/image/spaceship-2.webp');
    }

    create(){
        this.add.image(this.sys.game.config.width/2, this.sys.game.config.height/2, 'space');
        this.gameoverImage = this.add.image(this.sys.game.config.width/2, this.sys.game.config.height-50, 'spaceship');

        // Loop para generar palabras aleatorias cada 10 segundos
        this.time.addEvent({
            delay: 3000,
            callback: this.generateWord,
            callbackScope: this,
            loop: true
        });

        this.input.keyboard.on('keydown', this.keyPress, this);
    }

    generateWord(){
        const word = Phaser.Utils.Array.GetRandom(words);
        const wordText = this.add.text(Phaser.Math.Between(50, 470), -30, word, { fontSize: '32px', fill: '#fff' });

        // Guardar objeto con la palabra y su texto
        wordsInGame.push({ word: word, text: wordText });
        console.log(word);
        console.log(wordsInGame);

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
        console.log("Letra presionada: " + event.key);
        if (currentWord == 0) {
        for (let i = 0; i < wordsInGame.length; i++) {
            if (wordsInGame[i].word.startsWith(event.key)) {
                console.log("Coincide con la primera letra de la palabra: " + wordsInGame[i].word);
                currentWord = wordsInGame[i].word;
            }
                // Eliminar la primera letra de la palabra
                const updatedWord = currentWord.substring(1);

                // Actualizar el arreglo
                wordsInGame[i].word = updatedWord;

                // Actualizar el texto en pantalla
                wordsInGame[i].text.setText(updatedWord);

                // Si la palabra está vacía después de eliminar la letra, puedes eliminarla
                if (updatedWord.length === 0) {
                    wordsInGame[i].text.destroy(); // Eliminar texto de la pantalla
                    wordsInGame.splice(i, 1); // Eliminar de wordsInGame
                }

                // break; // Salir del bucle después de encontrar una coincidencia
            }
        }
    }
}
