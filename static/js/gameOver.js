export class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    create() {
        // Agregar texto de "Game Over"
        this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'Game Over', {
            fontSize: '64px',
            fill: '#ff0000'
        }).setOrigin(0.5);

        // Agregar botón para reiniciar el juego
        const restartButton = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2 + 100, 'Restart', {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5).setInteractive();

        // Agrega el botón para ir al menu
        const menuButton = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2 + 150, 'Menu', {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5).setInteractive();

        // Al hacer clic en el botón de reinicio, volver a la escena de juego
restartButton.on('pointerdown', () => {
            this.scene.start('game'); // Reinicia el juego
        });

        // Al hacer clic en el botón de menu, volver a la escena de menu
        menuButton.on('pointerdown', () => {
            this.scene.start('MenuScene'); // Vuelve a la escena de menu
        });
    }
}
