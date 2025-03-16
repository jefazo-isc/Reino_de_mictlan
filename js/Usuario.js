class Usuario extends Phaser.Scene {
    constructor() {
        super({ key: 'Usuario' });
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
        
        let aliasString = '';

        //titulo
        const title = this.add.text(125, 50, 'REINO DE MICTLÁN', {
            fontSize: '60px',
            fill: '#d97f29',
            fontFamily: 'Viva_Mexico_cabrones',
            strokeThickness: 5,
            stroke: '#661b06'
        });
        
        // Texto inicial
        const aliasLabel = this.add.text(250, 150, 'Ingresa tu alias', {
            fontSize: '42px',
            padding: { left: 5, right: 5, top: 5, bottom: 5 },
            fontFamily: 'Mayan',
            fill: '#d97f29',
            strokeThickness: 3,
            stroke: '#661b06'
        });
        
        // Muestra lo que va escribiendo el usuario
        const aliasText = this.add.text(300, 320, '', {
            fontSize: '40px',
            padding: { left: 5, right: 5, top: 5, bottom: 5 },
            fontFamily: 'Mayan',
            fill: '#d97f29',
            strokeThickness: 3,
            stroke: '#661b06'
        });
        
        // Captura teclas
        this.input.keyboard.on('keydown', (event) => {
            console.log(event.key, event.code);

            const ignoreKeys = new Set([
                ' ', 'Enter', 'Shift', 'Control', 'Alt',
                'Insert', 'Tab', 'Escape', 'Home', 'PageUp', 'Delete',
                'End', 'PageDown', 'ArrowLeft', 'ArrowUp', 'Pause',
                'ArrowRight', 'ArrowDown',
                'F1', 'F2', 'F3', 'F4', 'F5', 'F6',
                'F7', 'F8', 'F9', 'F10', 'F11', 'F12',
            ]);

            if (event.key === 'Backspace' && aliasString.length > 0) {
                aliasString = aliasString.slice(0, -1);
            } else if (event.key.length === 1 && !ignoreKeys.has(event.key)) {
                aliasString += event.key;
            }
            aliasText.setText(aliasString);
        });
        
        // Botón para guardar e ir a Level1
        const startButton = this.add.text(300, 450, 'COMENZAR', {
            fontSize: '30px',
            padding: { left: 5, right: 5, top: 5, bottom: 5 },
            fontFamily: 'Mayan',
            fill: '#d97f29',
            strokeThickness: 5,
            stroke: '#661b06', 
        })
        .setInteractive()
        .on('pointerdown', () => {
            // Los caracteres permitidos
            const aliasRegex = /^[A-Za-z0-9_]{4,8}$/;
            
            // verificamos que cumpla con el formato
            if (aliasRegex.test(aliasString)) {
                // se revisa si ya existe en localStorage
                if (!localStorage.getItem(aliasString)) {
                    // Si no existe, se da de alta, con el  score y fecha
                    localStorage.setItem(aliasString, JSON.stringify({ 
                        score: 0,
                        registrado: new Date().toISOString().slice(0, 10)
                    }));
                    aliasLabel.setText('Alias registrado: ' + aliasString);

                    // Asigna alias y score a la variable global
                    globalData.alias = aliasString;
                    globalData.score = 0;
                    this.scene.start('Historia1', globalData);
                } else {
                    globalData.alias = aliasString;
                    globalData.score = 0;
                    globalData.lives = 3;
                    globalData.currentLevel = 1;
                    this.scene.start('Historia1', globalData); //Historia1
                }
            } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Algo anda mal...',
                  text: 'Alias inválido (4-8, letras, dígitos o "_" )',
                  customClass: {
                    title: 'swal2-title',
                    content: 'swal2-content',
                    htmlContainer: 'swal2-html-container'
                }
                });
            }
            
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
            this.tweens.killTweensOf(startButton);
            startButton.alpha = 1;
        })
        .on('pointerout', () => {
            this.tweens.killTweensOf(volverButton);
            volverButton.alpha = 1;
            this.tweens.add({
                targets: startButton,
                alpha: 0,
                duration: 800,
                ease: 'Linear',
                yoyo: true,
                repeat: -1
            });
        });

        // animaciones
        this.tweens.add({
            targets: startButton,
            alpha: 0,
            duration: 800,
            ease: 'Linear',
            yoyo: true,
            repeat: -1
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
};
