class Usuario extends Phaser.Scene {
    constructor() {
        super({ key: 'Usuario' });
    }

    preload() {
        this.load.image('sky', '../assets/sky.png');
    }

    create() {

        this.add.image(400, 300, 'sky');
        
        let aliasString = '';

        //titulo
        const title = this.add.text(225, 50, 'REINO DE MICTLÁN', {
            fontSize: '40px',
            fill: '#FF0000',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 5
        });
        
        // Texto inicial
        const aliasLabel = this.add.text(200, 150, 'Ingresa tu alias: ', {
            fontSize: '24px',
            fill: '#fff'
        });
        
        // Muestra lo que va escribiendo el usuario
        const aliasText = this.add.text(200, 200, '', {
            fontSize: '24px',
            fill: '#fff'
        });
        
        // Captura teclas
        this.input.keyboard.on('keydown', (event) => {
            // Acepta solo caracteres "visibles" (teclas normales)
            if (event.key.length === 1) {
                aliasString += event.key;
            } else if (event.key === 'Backspace' && aliasString.length > 0) {
                aliasString = aliasString.slice(0, -1);
            }
            aliasText.setText(aliasString);
        });
        
        // Botón para guardar e ir a Level1
        const startButton = this.add.text(200, 450, 'INICIAR VIAJE', {
            fontSize: '24px',
            fill: '#fff',
            backgroundColor: '#1657a1',
            padding: { left: 5, right: 5, top: 5, bottom: 5 }
        })
        .setInteractive()
        .on('pointerdown', () => {
            // Expresión regular para alias: 4-8 caracteres, letras, dígitos o _
            const aliasRegex = /^[A-Za-z0-9_]{4,8}$/;
            
            // Verifica que cumpla con el formato
            if (aliasRegex.test(aliasString)) {
                // Revisa si ya existe en localStorage
                if (!localStorage.getItem(aliasString)) {
                    // Si no existe, se da de alta
                    localStorage.setItem(aliasString, JSON.stringify({ score: 0 }));
                    aliasLabel.setText('Alias registrado: ' + aliasString);

                    // Asigna alias y score a la variable global
                    globalData.alias = aliasString;
                    globalData.score = 0;
                    this.scene.start('Level1', globalData);
                } else {
                    globalData.alias = aliasString;
                    globalData.score = 0;
                    this.scene.start('Level1', globalData);
                }
            } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Alias inválido (4-8, letras, dígitos o "_" )'
                });
            }
        });
    }
};