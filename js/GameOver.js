class GameOver extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOver' });
    }

    preload() {
        this.load.image('sky', '../assets/sky.png');
    }

    create() {
        this.add.image(400, 300, 'sky');
        
        // Título
        const title = this.add.text(215, 50, '¡GAME OVER!', {
            fontSize: '40px',
            fill: '#FF0000',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 5
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