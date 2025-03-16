class Creditos extends Phaser.Scene {
    constructor() {
        super({ key: 'Creditos' });
    }

    preload() {
        this.load.image('sky', '../assets/sky.webp');
        this.load.audio('musicaFondo', '../assets/sonido/menuMusica.mp3');
    }

    create() {

        this.add.image(400, 300, 'sky');
        const musica = this.sound.add('musicaFondo', { loop: true });
        if (globalData.musica === false) {
            musica.play();
            musica.pause();
        }else{
            musica.play();
        }

        const title = this.add.text(270, 50, 'Créditos', {
            fontSize: '50px',
            fill: '#d97f29',
            fontFamily: 'Viva_Mexico_cabrones',
            strokeThickness: 5,
            stroke: '#661b06'
        });

        const text = `
        Desarrollado por:
        - Yahir Guevara Cardona
        - Saul Alvarez Gaspar
        - Carlos Franco Acosta
        `;
        this.add.text(150, 150, text, {
            fontSize: '32px',
            //backgroundColor: '#1657a1',
            padding: { left: 5, right: 5, top: 5, bottom: 5 },
            fontFamily: 'Mayan',
            fill: '#d97f29',
            strokeThickness: 5,
            stroke: '#661b06'
        });

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