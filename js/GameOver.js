class GameOver extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOver' });
    }

    preload() {
        this.load.image('sky', '../assets/sky.webp');
    }

    create() {
        this.add.image(400, 300, 'sky');
        
        const title = this.add.text(200, 200, '¡GAME OVER!', {
            fontSize: '60px',
            fill: '#FF0000',
            fontFamily: 'Mayan',
            stroke: '#000000',
            strokeThickness: 5
        });

        const aliasLabel = this.add.text(345, 320, globalData.alias, {
            fontSize: '30px',
            fill: '#FF0000',
            fontFamily: 'Mayan',
            stroke: '#000000',
            strokeThickness: 5
        });

        const text = this.add.text(320, 400, 'Tu puntaje: ', {
            fontSize: '30px',
            fill: '#FF0000',
            fontFamily: 'Mayan',
            stroke: '#000000',
            strokeThickness: 5
        });

        const score = this.add.text(370, 450, globalData.score, {
            fontSize: '30px',
            fill: '#FF0000',
            fontFamily: 'Mayan',
            stroke: '#000000',
            strokeThickness: 5
        });


        const volverMenu = this.add.text(50, 520, 'VOLVER AL MENU', {
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
                targets: volverMenu,
                alpha: 0,
                duration: 500,
                ease: 'Linear',
                yoyo: true,
                repeat: -1
            });
        })
        .on('pointerout', () => {
            this.tweens.killTweensOf(volverMenu);
            volverMenu.alpha = 1;
        });

        const volverButton = this.add.text(500, 520, 'VOLVER A INTENTARLO', {
            fontSize: '30px',
            padding: { left: 5, right: 5, top: 5, bottom: 5 },
            fontFamily: 'Mayan',
            fill: '#fbc54e',
            strokeThickness: 6,
            stroke: '#1d0010'
        })
        .setInteractive()
        .on('pointerdown', () => {
            globalData.score = 0;
            globalData.lives = 3;
            globalData.currentLevel = 1;
            this.scene.start('Level1', globalData);
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

        // Verificamos si ya esta el alias en el localStorage
        if (localStorage.getItem(globalData.alias)) {
            let registro = JSON.parse(localStorage.getItem(globalData.alias));
            
            // Actualizamos solo si el score actual es mayor que el anterior
            if (globalData.score > registro.score) {
                registro.score = globalData.score;
                registro.registrado = new Date().toISOString().slice(0, 10);
                localStorage.setItem(globalData.alias, JSON.stringify(registro));
            }
        }
    }
}