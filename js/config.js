// Variables globales compartidas entre escenas
const globalData = {
    score: 0,
    lives: 3,
    currentLevel: 1
};

// Configuración del juego
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    dom: {
        createContainer: true
    },
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 300 }, debug: false }
    },
    scene: [Presentacion, MainMenu,Usuario,Records, Creditos, Level1, Level2,Historia1,Puente, FinalLevel],
};

const game = new Phaser.Game(config);
