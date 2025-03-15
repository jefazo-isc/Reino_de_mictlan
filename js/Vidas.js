class Vidas {
    constructor(scene, x, y, maxvidas = 3) {
        this.scene = scene;
        this.maxvidas = Math.min(maxvidas, 3);  // Limitar a un máximo de 3 vidas
        this.vidas = this.maxvidas;
        this.imgvida = [];

        console.log("Creando sistema de vidas...");

        // Crear las imágenes de vida en pantalla
        for (let i = 0; i < this.vidas; i++) {
            // Asegúrate de espaciar las imágenes entre sí
            let vida = this.scene.add.image(x + (i * 40), y, 'vidas').setScale(0.5);
            if (!vida) {
                console.error("Error al cargar la imagen de vida.");
            }
            this.imgvida.push(vida);
        }
    }

    vidaperdida() {
        if (this.vidas > 0) {
            this.vidas--;
            this.imgvida[this.vidas].setVisible(false);  // Ocultar la vida perdida
        }

        if (this.vidas === 0) {
            this.gameOver();
        }
    }

    gameOver() {
        console.log("Juego terminado. Sin vidas.");
        this.scene.physics.pause();
        if (this.scene.player) {
            this.scene.player.setTint(0xff0000);
        }
        this.scene.gameOver = true;
    }
}
