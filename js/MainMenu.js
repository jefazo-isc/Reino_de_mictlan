class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
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
        

        const title = this.add.text(125, 50, 'REINO DE MICTLÁN', {
            fontSize: '60px',
            fill: '#d97f29',
            fontFamily: 'Viva_Mexico_cabrones',
            strokeThickness: 5,
            stroke: '#661b06'
        });
        
        // Botón de inicio
        const startButton = this.add.text(275, 200, 'INICIAR VIAJE', {
            fontSize: '32px',
            //backgroundColor: '#1657a1',
            padding: { left: 5, right: 5, top: 5, bottom: 5 },
            fontFamily: 'Mayan',
            fill: '#d97f29',
            strokeThickness: 5,
            stroke: '#661b06'
            
        })
        .setInteractive()
        .on('pointerdown', () => {
            this.scene.start('Usuario', globalData);
        })
        .on('pointerover', () => {
            this.tweens.add({
                targets: startButton,
                alpha: 0,
                duration: 500,
                ease: 'Linear',
                yoyo: true,
                repeat: -1
            });
        })
        .on('pointerout', () => {
            this.tweens.killTweensOf(startButton);
            startButton.alpha = 1;
        });

        const recordsButton = this.add.text(278, 300, 'VER PUNTAJES', {
            fontSize: '32px',
            fill: '#fff',
            padding: { left: 5, right: 5, top: 5, bottom: 5 },
            fontFamily: 'Mayan',
            fill: '#d97f29',
            strokeThickness: 5,
            stroke: '#661b06'
        })
        .setInteractive()
        .on('pointerdown', () => {
            this.scene.start('Records', globalData);
        })
        .on('pointerover', () => {
            this.tweens.add({
                targets: recordsButton,
                alpha: 0,
                duration: 500,
                ease: 'Linear',
                yoyo: true,
                repeat: -1
            });
        })
        .on('pointerout', () => {
            this.tweens.killTweensOf(recordsButton);
            recordsButton.alpha = 1;
        });

        const instruccionesButton = this.add.text(265, 400, 'INSTRUCCIONES', {
            fontSize: '32px',
            fill: '#fff',
            padding: { left: 5, right: 5, top: 5, bottom: 5 },
            fontFamily: 'Mayan',
            fill: '#d97f29',
            strokeThickness: 5,
            stroke: '#661b06'
        })
        .setInteractive()
        .on('pointerdown', () => {
            window.location.href = '../extra/instrucciones.html';
        })
        .on('pointerover', () => {
            this.tweens.add({
                targets: instruccionesButton,
                alpha: 0,
                duration: 500,
                ease: 'Linear',
                yoyo: true,
                repeat: -1
            });
        })
        .on('pointerout', () => {
            this.tweens.killTweensOf(instruccionesButton);
            instruccionesButton.alpha = 1;
        });

        const creditosButton = this.add.text(310, 500, 'CRÉDITOS', {
            fontSize: '32px',
            fill: '#fff',
            padding: { left: 5, right: 5, top: 5, bottom: 5 },
            fontFamily: 'Mayan',
            fill: '#d97f29',
            strokeThickness: 5,
            stroke: '#661b06'
        })
        .setInteractive()
        .on('pointerdown', () => {
            this.scene.start('Creditos', globalData);
        })
        .on('pointerover', () => {
            this.tweens.add({
                targets: creditosButton,
                alpha: 0,
                duration: 500,
                ease: 'Linear',
                yoyo: true,
                repeat: -1
            });
        })
        .on('pointerout', () => {
            this.tweens.killTweensOf(creditosButton);
            creditosButton.alpha = 1;
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
    
    preload() {
        this.load.image('sky', '../assets/sky.webp');
        this.load.audio('musicaFondo', '../assets/sonido/menuMusica.mp3');
    }
}
