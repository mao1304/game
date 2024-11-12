export class WinGameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WinGameScene' });
    }

    init(data) {
        this.score = data.score;
        this.time = data.time;
    }

    create() {
        this.add.text(200, 200, '¡Ganaste!', { fontSize: '48px', fill: '#00ff00' });
        this.add.text(200, 300, `Puntos: ${this.score}`, { fontSize: '32px', fill: '#ffffff' });
        this.add.text(200, 350, `Tiempo: ${this.time} segundos`, { fontSize: '32px', fill: '#ffffff' });

        // Agregar una opción para reiniciar o volver al menú principal
        this.add.text(200, 450, 'Presiona R para reiniciar', { fontSize: '24px', fill: '#ffffff' });

        // Reiniciar el juego si se presiona "R"
        this.input.keyboard.on('keydown-R', () => {
            this.scene.start('game');
        });
    }
}
