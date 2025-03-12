class FinalLevel extends Phaser.Scene {
    constructor() {
        super({ key: 'FinalLevel' });
    }

    preload() {
        this.load.image('xibalba_bg', 'assets/images/xibalba_background.png');
    }

    create() {
        // Fondo grotesco del infierno maya
        this.add.image(400, 300, 'xibalba_bg');
        
        // Texto del nivel final
        this.add.text(300, 50, 'XIBALBÁ: EL INFIERNO MAYA', {
            fontSize: '32px',
            fill: '#FF3300'
        });
        
        // Lógica única del nivel final
        this.setupFinalBoss();
    }

    setupFinalBoss() {
        // Tu mecánica de jefe final aquí
    }
}
