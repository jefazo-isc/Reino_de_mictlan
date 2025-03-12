class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    create() {
        // Fondo
        this.add.image(400, 300, 'sky');
        
        // Título
        const title = this.add.text(250, 200, 'REINO DE MICTLÁN', {
            fontSize: '40px',
            fill: '#FF0000',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 5
        });
        
        // Botón de inicio
        const startButton = this.add.text(350, 300, 'INICIAR VIAJE', {
            fontSize: '24px',
            fill: '#FFFFFF',
            backgroundColor: '#333333',
            padding: { x: 20, y: 10 }
        })
        .setInteractive()
        .on('pointerdown', () => {
            this.scene.start('Level1', globalData);
        });
    }
}
