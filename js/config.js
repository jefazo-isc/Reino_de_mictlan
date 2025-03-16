// Variables globales compartidas entre escenas
const globalData = {
    score: 0,
    lives: 3,
    currentLevel: 1,
    alias: "",
    registrado: "",
    musica: true,
    selectedCharacter: null
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
    scene: [Presentacion, MainMenu,Usuario,Records, Creditos, Seleccionpersonaje,Level1, Level2,Historia1, Puente, FinalLevel, GameOver, Victoria],
};

const game = new Phaser.Game(config);
