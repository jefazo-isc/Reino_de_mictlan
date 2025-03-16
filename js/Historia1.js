class Historia1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Historia1' });
    }

    init(data) {
        globalData.score = data.score || 0;
        globalData.selectedCharacter = data.selectedCharacter;
    }

    preload() {
        this.load.image('Historia1', 'assets/Historia1.webp');
    }

    create() {
        // Fondo centrado (con profundidad baja para que quede detrás de los demás elementos)
        const fondo = this.add.image(400, 300, 'Historia1')
            .setDisplaySize(800, 600)
            .setDepth(0); // Fondo detrás de todo

        // Título centrado (con profundidad para que quede sobre el fondo)
        this.add.text(400, 50, '      Escena 1: \nCamino al Señor de la Muerte', {
            fontSize: '40px', // Tamaño similar al de Usuario.js
            fill: '#d97f29', // Color similar al de Usuario.js
            fontFamily: 'Viva_Mexico_cabrones', // Fuente similar
            strokeThickness: 5, // Borde similar
            stroke: '#661b06', // Color del borde similar
            shadow: { offsetX: 2, offsetY: 2, color: '#000', blur: 2, fill: true }
        }).setOrigin(0.5).setDepth(1); // Mostrar sobre el fondo

        // Crear cuadro de texto usando Graphics (en lugar de rectangle)
        const graphics = this.add.graphics();
        graphics.fillStyle(0x000000, 0.9); // Color y opacidad
        graphics.fillRect(50, 390, 700, 120); // Dibujar un rectángulo
        graphics.setDepth(2); // Mostrar sobre el fondo y título

        // Añadir texto dentro del cuadro (centrado)
        const text = this.add.text(400, 450, 
            'Después de una vida llena de berrinches, Tzilacatzin despertó en el Mictlán después de ser arrastrado ahí por el mismo señor del inframundo, Mictlantecuhtli. Ahora emprende su viaje para regresar a su mundo.', 
            {
                fontSize: '20px', // Tamaño similar al de Usuario.js
                fill: '#d97f29', // Color similar al de Usuario.js
                fontFamily: 'Mayan', // Fuente similar
                wordWrap: { width: 650 },
                align: 'center',
                strokeThickness: 3, // Borde similar
                stroke: '#661b06' // Color del borde similar
            }
        ).setOrigin(0.5).setDepth(4); // Mostrar sobre el cuadro de texto

        // Dibujar borde alrededor del cuadro de texto
        graphics.lineStyle(2, 0xFFFFFF, 1);
        graphics.strokeRect(50, 390, 700, 120); // Dibujar un borde alrededor del rectángulo
        graphics.setDepth(4); // Mostrar sobre todo lo demás

        // Botón para continuar (más abajo para que no quede pegado al cuadro)
        const continueButton = this.add.text(400, 530, 'CONTINUAR', {
            fontSize: '30px', // Tamaño similar al de Usuario.js
            padding: { left: 5, right: 5, top: 5, bottom: 5 },
            fontFamily: 'Mayan', // Fuente similar
            fill: '#d97f29', // Color similar al de Usuario.js
            strokeThickness: 5, // Borde similar
            stroke: '#661b06' // Color del borde similar
        }).setOrigin(0.5).setInteractive().setDepth(5); // Mostrar sobre todo lo demás

        continueButton.on('pointerdown', () => {
            this.scene.start('Level1', globalData);
        });

        // Animación del botón (similar a Usuario.js)
        this.tweens.add({
            targets: continueButton,
            alpha: 0,
            duration: 800,
            ease: 'Linear',
            yoyo: true,
            repeat: -1
        });
    }
}