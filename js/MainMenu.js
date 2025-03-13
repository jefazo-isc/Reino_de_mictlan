class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    create() {
        // Fondo
        this.add.image(400, 300, 'sky');
        
        // Título
        const title = this.add.text(215, 50, 'REINO DE MICTLÁN', {
            fontSize: '40px',
            fill: '#FF0000',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 5
        });
        
        // Botón de inicio
        const startButton = this.add.text(300, 200, 'INICIAR VIAJE', {
            fontSize: '24px',
            fill: '#fff',
            backgroundColor: '#1657a1',
            padding: { left: 5, right: 5, top: 5, bottom: 5 }
        })
        .setInteractive()
        .on('pointerdown', () => {
            this.scene.start('Usuario', globalData);
        });

        const recordsButton = this.add.text(300, 300, 'VER PUNTAJES', {
            fontSize: '24px',
            fill: '#fff',
            backgroundColor: '#1657a1',
            padding: { left: 5, right: 5, top: 5, bottom: 5 }
        })
        .setInteractive()
        .on('pointerdown', () => {
            this.scene.start('Records', globalData);
        });

        const instruccionesButton = this.add.text(300, 400, 'INSTRUCCIONES', {
            fontSize: '24px',
            fill: '#fff',
            backgroundColor: '#1657a1',
            padding: { left: 5, right: 5, top: 5, bottom: 5 }
        })
        .setInteractive()
        .on('pointerdown', () => {
            window.location.href = '../extra/instrucciones.html';
        });

        const creditosButton = this.add.text(300, 500, 'CRÉDITOS', {
            fontSize: '24px',
            fill: '#fff',
            backgroundColor: '#1657a1',
            padding: { left: 5, right: 5, top: 5, bottom: 5 }
        })
        .setInteractive()
        .on('pointerdown', () => {
            this.scene.start('Creditos', globalData);
        });
        

    }
    
    preload() {
        this.load.image('sky', '../assets/sky.png');
    }
}
