export class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Cargar el audio de fondo
        this.load.audio('backgroundMusic', '/static/audio/base.ogg');
    }

    create() {
        // Iniciar el audio y configurarlo para que sea global y en bucle
        this.backgroundMusic = this.sound.add('backgroundMusic', {
            loop: true,
            // volume: 0.5 // Ajusta el volumen si es necesario
        });

        // Reproducir el audio si no está ya en reproducción
        if (!this.backgroundMusic.isPlaying) {
            this.backgroundMusic.play();
        }

        // Ir a la siguiente escena una vez que el audio esté configurado
        this.scene.start('MenuScene');
    }
}

// En cada escena, asegúrate de que el audio siga sonando, pero sin reiniciarlo
export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        // Asegúrate de que la música no se detenga al perder el foco de la ventana
        this.sound.pauseOnBlur = false;

        // Continuar con el resto de la configuración de la escena
    }
}
