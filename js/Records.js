class Records extends Phaser.Scene {
    constructor() {
        super({ key: 'Records' });
    }
    
    preload() {
        this.load.image('sky', 'assets/sky.png');
    }

    create() {
        this.add.image(400, 300, 'sky');
        
        // Título
        const title = this.add.text(215, 50, 'REINO DE MICTLÁN', {
            fontSize: '40px',
            fill: '#FF0000',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 5
        });

        const aviso = this.add.text(215, 150, 'En construccion', {
            fontSize: '40px',
            fill: '#FF0000',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 5
        });
    }
}