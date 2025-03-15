class Records extends Phaser.Scene {
    constructor() {
        super({ key: 'Records' });
    }
    
    preload() {
        this.load.image('sky', 'assets/sky.webp');
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
        
        const textStyle = {
            fontSize: '32px',
            padding: { left: 5, right: 5, top: 5, bottom: 5 },
            fontFamily: 'Mayan',
            fill: '#d97f29',
            strokeThickness: 5,
            stroke: '#661b06'
        };
        const title = this.add.text(240, 50, 'PUNTAJES', {
            fontSize: '60px',
            fill: '#d97f29',
            fontFamily: 'Viva_Mexico_cabrones',
            strokeThickness: 5,
            stroke: '#661b06'
        });

        // Encabezados
        this.add.text(100, 150, 'Alias', textStyle);
        this.add.text(350, 150, 'Score', textStyle);
        this.add.text(550, 150, 'Fecha', textStyle);

        // Recuperar las puntuaciones del localStorage
        let records = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            try {
                const data = JSON.parse(localStorage.getItem(key));
                if (data && data.score !== undefined && data.registrado !== undefined) {
                    records.push({
                        alias: key,
                        score: data.score,
                        registrado: data.registrado
                    });
                }
            } catch (error) {
                console.error(error, key);
            }
        }

        // Ordenar
        records.sort((a, b) => b.score - a.score);
        let yPos = 200;
        records.forEach(record => {
            this.add.text(100, yPos, record.alias, textStyle);
            this.add.text(350, yPos, record.score.toString(), textStyle);
            this.add.text(550, yPos, record.registrado, textStyle);
            yPos += 40;
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