class Victoria extends Phaser.Scene {
    constructor() {
        super({ key: 'Victoria' });
    }

    preload() {
        this.load.image('sky', '../assets/sky.png');
    }

    create() {

        this.add.image(400, 300, 'sky');
        
        // Título
        const title = this.add.text(215, 50, '¡Ganaste!', {
            fontSize: '40px',
            fill: '#FF0000',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 5
        });
        
        // Supongamos que globalData.alias y globalData.score ya están actualizados
        if (localStorage.getItem(globalData.alias)) {
            // Recupera el registro 
            let registro = JSON.parse(localStorage.getItem(globalData.alias));
            
            // Se actualiza la puntuación y la fecha
            registro.score = globalData.score;
            registro.registrado = new Date().toISOString().slice(0, 10);
            
            // Se gaurada de nuevo
            localStorage.setItem(globalData.alias, JSON.stringify(registro));
        }
    }
}