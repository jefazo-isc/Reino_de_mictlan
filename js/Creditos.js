class Creditos extends Phaser.Scene {
    constructor() {
        super({ key: 'Creditos' });
    }

    preload() {
        this.load.image('sky', '../assets/sky.png');
    }

    create() {

        this.add.image(400, 300, 'sky');

        const title = this.add.text(215, 50, 'Créditos', {
            fontSize: '40px',
            fill: '#FF0000',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 5
        });

        const text = `
        Desarrollado por:
        - Yahir Guevara Cardona
        - Saul Alvarez Gaspar
        - Carlos Franco Acosta
        `;
        this.add.text(100, 150, text, {
            fontSize: '24px',
            fill: '#fff'
        });
    }
}