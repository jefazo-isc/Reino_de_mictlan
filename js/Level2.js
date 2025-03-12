// Level2.js
class Level2 extends Phaser.Scene {
    constructor() {
        super({ key: 'Level2' });
    }

    init(data) {
        globalData.score = data.score || 0;
    }

    create() {
        this.add.text(400, 300, 'Nivel 2', { fontSize: '32px', fill: '#FFF' });
        // ... lógica del nivel 2 ...
    }
}
