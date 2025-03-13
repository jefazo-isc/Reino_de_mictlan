class Records extends Phaser.Scene {
    constructor() {
        super({ key: 'Records' });
    }
    
    preload() {
        this.load.image('sky', 'assets/sky.png');
    }

    create() {
        this.add.image(400, 300, 'sky');
        
        const title = this.add.text(215, 50, 'Puntajes', {
            fontSize: '40px',
            fill: '#FF0000',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 5
        });
        
        // array para los records
        let records = [];
        
        // vamos a recorrer el localStorage
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            try {
                const data = JSON.parse(localStorage.getItem(key));
                // Verificamos el objeto
                if (data && data.score !== undefined && data.registrado !== undefined) {
                    records.push({
                        alias: key,
                        score: data.score,
                        registrado: data.registrado
                    });
                }
            } catch (error) {
                //ignoramos los errores
                console.error(error + ' ' + key);
            }
        }
        
        // se ordenan de mayor a menor
        records.sort((a, b) => b.score - a.score);
        
        let yPos = 150;
        
        // Mostramos las puntuaciones ya ordenados
        records.forEach(record => {
            const text = `${record.alias}: Score ${record.score} (Fecha: ${record.registrado})`;
            this.add.text(100, yPos, text, {
                fontSize: '24px',
                fill: '#fff'
            });
            yPos += 30;
        });
    }
}