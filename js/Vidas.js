// Modificar la clase Vidas para usar globalData
class Vidas {
    constructor(scene, x, y) {
        this.scene = scene;
        this.vidas = globalData.vidas || 3; // Inicializar desde globalData
        this.iconos = [];
        
        for (let i = 0; i < this.vidas; i++) {
            const vida = scene.add.image(x + i * 35, y, 'vidas').setScale(0.5);
            this.iconos.push(vida);
        }
    }

    vidaperdida() {
        if (this.vidas > 0) {
            this.vidas--;
            this.iconos[this.vidas].destroy();
            globalData.vidas = this.vidas; // Actualizar globalData
        }
    }

    restaurarVidas() {
        this.vidas = 3;
        this.iconos.forEach(icono => icono.destroy());
        this.iconos = [];
        for (let i = 0; i < this.vidas; i++) {
            this.iconos.push(this.scene.add.image(90 + i * 35, 70, 'vidas').setScale(0.5));
        }
        globalData.vidas = this.vidas;
    }
}