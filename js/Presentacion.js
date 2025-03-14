class Presentacion extends Phaser.Scene {
    constructor() {
        super({ key: 'Presentacion' });
    }

    create() {
        this.add.image(400, 300, 'sky');
        
        const title = this.add.text(125, 50, 'REINO DE MICTLÁN', {
            fontSize: '60px',
            fill: '#d97f29',
            fontFamily: 'Viva_Mexico_cabrones',
            strokeThickness: 5,
            stroke: '#661b06'
        });

        const text = this.add.text(150, 520, 'Presiona cualquier tecla para continuar', {
            fontSize: '30px',
            fill: '#fff',
            padding: { left: 5, right: 5, top: 5, bottom: 5 },
            fontFamily: 'Mayan',
            fill: '#d97f29',
            strokeThickness: 5,
            stroke: '#661b06'
        });

        this.input.keyboard.on('keydown', () => {
            this.scene.start('MainMenu');
        });

        this.tweens.add({
            targets: text,
            alpha: 0,
            duration: 500,
            ease: 'Linear',
            yoyo: true,
            repeat: -1
        });

    }

    preload() {
        this.load.image('sky', '../assets/sky.webp');
    }
}