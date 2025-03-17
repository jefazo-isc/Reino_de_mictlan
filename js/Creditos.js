class Creditos extends Phaser.Scene {
    constructor() {
        super({ key: 'Creditos' });
    }

    preload() {
        this.load.image('sky', '../assets/sky.webp');
        this.load.audio('musicaFondo', '../assets/sonido/menuMusica.mp3');
        
        // Cargar imágenes de los créditos
        this.load.image('yahir', '../assets/credits/yahir.png');
        this.load.image('saul', '../assets/credits/saul.png');
        this.load.image('carlos', '../assets/credits/carlos.png');
    }

    create() {
        this.add.image(400, 300, 'sky');
        const musica = this.sound.add('musicaFondo', { loop: true });
        if (globalData.musica === false) {
            musica.play();
            musica.pause();
        } else {
            musica.play();
        }

        // Título
        this.add.text(270, 50, 'Créditos', {
            fontSize: '50px',
            fill: '#d97f29',
            fontFamily: 'Viva_Mexico_cabrones',
            strokeThickness: 5,
            stroke: '#661b06'
        });

        const text0 = `
        Materia: Tecnologías Web
        Fecha: 18 de marzo de 2025
        `;
        this.add.text(200, 70, text0, {
            fontSize: '25px',
            padding: { left: 5, right: 5, top: 5, bottom: 5 },
            fontFamily: 'Mayan',
            fill: '#d97f29',
            strokeThickness: 5,
            stroke: '#661b06'
        });

        // Texto de créditos
        const text = `
        Desarrollado por:
        - Yahir Guevara Cardona
        - Saul Alvarez Gaspar
        - Carlos Franco Acosta
        `;
        this.add.text(200, 180, text, {
            fontSize: '25px',
            padding: { left: 5, right: 5, top: 5, bottom: 5 },
            fontFamily: 'Mayan',
            fill: '#d97f29',
            strokeThickness: 5,
            stroke: '#661b06'
        });

        // Imágenes de los desarrolladores
        this.add.image(100, 475, 'yahir').setScale(0.6);  // Ajusta el scale según necesidad
        this.add.image(250, 460, 'saul').setScale(0.5);
        this.add.image(450, 470, 'carlos').setScale(0.5);

        // Botón Volver
        const volverButton = this.add.text(640, 520, 'VOLVER', {
            fontSize: '30px',
            padding: { left: 5, right: 5, top: 5, bottom: 5 },
            fontFamily: 'Mayan',
            fill: '#fbc54e',
            strokeThickness: 6,
            stroke: '#1d0010'
        })
        .setInteractive()
        .on('pointerdown', () => {
            this.scene.start('MainMenu', globalData);
        })
        .on('pointerover', () => {
            this.tweens.add({
                targets: volverButton,
                alpha: 0,
                duration: 500,
                ease: 'Linear',
                yoyo: true,
                repeat: -1
            });
        })
        .on('pointerout', () => {
            this.tweens.killTweensOf(volverButton);
            volverButton.alpha = 1;
        });

        // Botón Música
        const musicaBotton = this.add.text(640, 470, 'Musica', {
            fontSize: '30px',
            padding: { left: 5, right: 5, top: 5, bottom: 5 },
            fontFamily: 'Mayan',
            fill: '#fbc54e',
            strokeThickness: 6,
            stroke: '#1d0010'
        })
        .setInteractive()
        .on('pointerdown', () => {
            if (globalData.musica === true) {
                musica.pause();
                globalData.musica = false;
            } else {
                musica.resume();
                globalData.musica = true;
            }
        })
        .on('pointerover', () => {
            this.tweens.add({
                targets: musicaBotton,
                alpha: 0,
                duration: 500,
                ease: 'Linear',
                yoyo: true,
                repeat: -1
            });
        })
        .on('pointerout', () => {
            this.tweens.killTweensOf(musicaBotton);
            musicaBotton.alpha = 1;
        });
    }
}
