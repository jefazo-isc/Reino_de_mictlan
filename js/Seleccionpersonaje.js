class Seleccionpersonaje extends Phaser.Scene {
    constructor() {
        super({ key: 'Seleccionpersonaje' });
    }

    preload() {
        this.load.image('background', 'assets/sky.webp');
        this.load.image('character1', 'assets/caminarp1/Parado.png');
        this.load.image('character2', 'assets/caminarp2/Parado.png');
    }

    create() {
        // Fondo
        this.add.image(400, 300, 'background').setScale(1);
        
        // Título
        this.add.text(400, 100, 'SELECCIONA TU PERSONAJE', {
            fontSize: '32px',
            fill: '#FFD700',
            fontStyle: 'bold'
        }).setOrigin(0.5).setShadow(2, 2, '#000', 4);
        
        // Instrucciones
        this.add.text(400, 150, 'Arrastra un personaje al cuadro de selección', {
            fontSize: '20px',
            fill: '#FFF'
        }).setOrigin(0.5).setShadow(1, 1, '#000', 2);
        
        // Cuadro de selección
        const box = this.add.graphics()
            .lineStyle(6, 0xA0522D)
            .fillStyle(0x8B4513, 0.3)
            .strokeRect(325, 225, 150, 150)
            .fillRect(325, 225, 150, 150);
        
        // Texto del cuadro
        this.emptyBoxText = this.add.text(400, 300, 'Arrastra aquí', {
            fontSize: '16px',
            fill: '#FFD700',
            fontStyle: 'italic'
        }).setOrigin(0.5);
        
        // Personajes
        this.character1 = this.add.image(250, 450, 'character1')
            .setInteractive({ draggable: true })
            .setScale(1);
        
        this.character2 = this.add.image(550, 450, 'character2')
            .setInteractive({ draggable: true })
            .setScale(1);
        
        // Nombres de personajes
        this.add.text(250, 500, 'Personaje 1', {
            fontSize: '20px',
            fill: '#FFD700',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.add.text(550, 500, 'Personaje 2', {
            fontSize: '20px',
            fill: '#FFD700',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Configuración de arrastre
        this.input.on('dragstart', (pointer, gameObject) => {
            gameObject.setScale(1.1).setAlpha(0.8);
            gameObject.setDepth(20);
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('dragend', (pointer, gameObject) => {
            gameObject.setScale(1).setAlpha(1).setDepth(10);
            
            // Verificar si está en el área de selección
            if (gameObject.x > 325 && gameObject.x < 475 && 
                gameObject.y > 225 && gameObject.y < 375) {
                
                globalData.selectedCharacter = gameObject.texture.key;
                this.emptyBoxText.setVisible(false);
                
                // Posicionar correctamente
                gameObject.x = 400;
                gameObject.y = 300;
                
                // Desactivar otro personaje
                const other = (gameObject === this.character1) ? this.character2 : this.character1;
                other.disableInteractive().setAlpha(0.5);
                
                // Activar botón
                this.startButton.setInteractive().setAlpha(1);
            } else {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
        });

        // Botón de inicio
        this.startButton = this.add.graphics()
            .fillStyle(0x8B4513, 0.8)
            .fillRoundedRect(300, 500, 200, 50, 10)
            .setInteractive(new Phaser.Geom.Rectangle(300, 500, 200, 50), Phaser.Geom.Rectangle.Contains)
            .on('pointerdown', () => this.startGame())
            //.on('pointerover', () => this.startButton.setFillStyle(0xA0522D, 0.9))
            //.on('pointerout', () => this.startButton.setFillStyle(0x8B4513, 0.8))
            .setAlpha(0.5)
            .setDepth(15);

        this.add.text(400, 525, 'INICIAR JUEGO', {
            fontSize: '22px',
            fill: '#FFD700',
            fontStyle: 'bold'
        }).setOrigin(0.5);
    }

    startGame() {
        if (globalData.selectedCharacter === null) return;
        
        /*window.globalData = {
            selectedCharacter: selectedCharacter
        };*/
        
            this.cameras.main.fade(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('Historia1', globalData);
        });
    }
}