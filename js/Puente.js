class Puente extends Phaser.Scene {
    constructor() {
        super({ key: 'Puente' });
    }

    preload() {
        // Cargar imágenes estáticas
        this.load.image('vidas', 'assets/vidas.png');
        this.load.image('Puente', 'assets/Puente.webp');
        this.load.image('ground', 'assets/piso.webp');
        this.load.image('ground4', 'assets/plat4.webp');
        this.load.image('lanzas', 'assets/Lanza.png');

        // Cargar sprites dinámicos
        const assets = [
            { prefix: 'sprite', start: 0, end: 25 },
            { prefix: 'jump_i', start: 0, end: 12 },
            { prefix: 'jump_D', start: 0, end: 12 }
        ];

        assets.forEach(asset => {
            for (let i = asset.start; i <= asset.end; i++) {
                this.load.image(`${asset.prefix}${i}`, `assets/${asset.prefix}/${asset.prefix} (${i}).png`);
            }
        });
    }

    create() {
        this.score = 0;
        this.gameOver = false;
        this.lanzasRecogidas = 0;

        // Fondo
        this.add.image(400, 300, 'Puente');

        // Vidas
        this.vidas = new Vidas(this, 90, 70);

        // Plataformas
        this.setupPlatforms();

        // Jugador
        this.setupPlayer();

        // Lanzas
        this.setupLanzas();

        // Colisiones y overlaps
        this.setupCollisions();

        // Texto de puntuación
        this.setupScore();

        // Contador de lanzas
        this.setupLanzasCounter();

        // Generar lanzas cada 1 segundo
        this.time.addEvent({
            delay: 1000,
            callback: this.spawnLanzas,
            callbackScope: this,
            loop: true
        });

        // Cambiar a la escena FinalLevel después de 45 segundos
        this.time.delayedCall(45000, () => this.endLevel());
    }

    setupPlatforms() {
        this.platforms = this.physics.add.staticGroup();
        const platformData = [
            { x: 400, y: 595, key: 'ground', scale: 1 },
            { x: 230, y: 494, key: 'ground4' },
            { x: 570, y: 494, key: 'ground4' },
            { x: 400, y: 494, key: 'ground4' }
        ];

        platformData.forEach(data => {
            const platform = this.platforms.create(data.x, data.y, data.key);
            if (data.scale) platform.setScale(data.scale).refreshBody();
        });
    }

    setupPlayer() {
        this.player = this.physics.add.sprite(100, 450, 'sprite0');
        this.player.setCollideWorldBounds(true);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.currentFrame = 0;
        this.jumpFrame = 0;
    }

    setupLanzas() {
        this.lanzas = this.physics.add.group(); // Grupo para las lanzas activas
        this.lanzasClavadas = this.physics.add.staticGroup(); // Volvemos a usar staticGroup para las lanzas clavadas
    }

    setupCollisions() {
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.lanzas, this.platforms, this.clavarLanza, null, this); // Lanzas se clavan en el suelo
        this.physics.add.collider(this.player, this.lanzas, this.hitLanza, null, this);
        
        // Usamos overlap para detectar cuando el jugador toca una lanza clavada
        this.physics.add.overlap(this.player, this.lanzasClavadas, this.recogerLanza, null, this);
    }

    setupScore() {
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '32px',
            fill: '#fff'
        });
    }

    setupLanzasCounter() {
        this.lanzasIcon = this.add.image(80, 100, 'lanzas').setScale(0.5);
        this.lanzasText = this.add.text(90, 90, 'x 0', {
            fontSize: '32px',
            fill: '#fff'
        });
    }

    spawnLanzas() {
        const directions = [
            // Desde arriba (hacia abajo, con gravedad)
            { x: Phaser.Math.Between(0, 800), y: -50, velocityX: 0, velocityY: 100, rotation: 0, gravity: true },
            // Desde la izquierda (hacia la derecha, sin gravedad)
            { x: -50, y: Phaser.Math.Between(0, 600), velocityX: 300, velocityY: 0, rotation: -Math.PI / 2, gravity: false },
            // Desde la derecha (hacia la izquierda, sin gravedad)
            { x: 850, y: Phaser.Math.Between(0, 600), velocityX: -300, velocityY: 0, rotation: Math.PI / 2, gravity: false },
            // Diagonal desde la esquina superior izquierda (hacia abajo y derecha, con gravedad)
            { x: -50, y: Phaser.Math.Between(-100, 300), velocityX: 300, velocityY: 100, rotation: -Math.PI / 4, gravity: true },
            // Diagonal desde la esquina superior derecha (hacia abajo y izquierda, con gravedad)
            { x: 850, y: Phaser.Math.Between(-100, 300), velocityX: -300, velocityY: 100, rotation: Math.PI / 4, gravity: true }
        ];

        const direction = Phaser.Math.RND.pick(directions);
        const lanza = this.lanzas.create(direction.x, direction.y, 'lanzas');

        // Configurar la gravedad
        lanza.body.allowGravity = direction.gravity;

        // Configurar velocidad y rotación
        lanza.setVelocity(direction.velocityX, direction.velocityY);
        lanza.rotation = direction.rotation;

        lanza.setBounce(0);
    }

    clavarLanza(lanza, platform) {
        // Crear una nueva lanza clavada en la misma posición
        const lanzaClavada = this.lanzasClavadas.create(lanza.x, lanza.y, 'lanzas');
        
        // Mantener la misma rotación
        lanzaClavada.rotation = lanza.rotation;
        
        // Refrescar el cuerpo físico
        lanzaClavada.refreshBody();
        
        // Eliminar la lanza original
        lanza.destroy();
        
        // Console.log para depuración
        console.log("Lanza clavada. Total lanzas clavadas:", this.lanzasClavadas.getChildren().length);
        
        // Timer para eliminar la lanza después de 1.5 segundos
        this.time.delayedCall(1500, () => {
            if (lanzaClavada && lanzaClavada.active) {
                lanzaClavada.destroy();
                console.log("Lanza eliminada por timer");
            }
        });
    }
    
    recogerLanza(player, lanza) {
        console.log("Overlap detectado - recogerLanza llamado");
        
        // Verificar que la lanza existe y está activa
        if (lanza && lanza.active) {
            lanza.destroy();
            this.lanzasRecogidas++;
            this.lanzasText.setText(`x ${this.lanzasRecogidas}`);
            
            // Efecto visual al recoger lanza
            this.tweens.add({
                targets: this.lanzasIcon,
                scale: 0.6,
                duration: 100,
                yoyo: true
            });
            
            console.log("Lanza recogida. Total munición:", this.lanzasRecogidas);
        }
    }

    endLevel() {
        this.gameOver = true;
        this.scene.start('FinalLevel', { score: this.score, lanzas: this.lanzasRecogidas });
    }

    update() {
        if (this.gameOver) return;

        const { up, right, left } = this.cursors;
        const { touching } = this.player.body;

        if (up.isDown && touching.down) {
            this.player.setVelocityY(-330);
            if (right.isDown) this.animateJump("jump_i");
            else if (left.isDown) this.animateJump("jump_D");
        } else if (left.isDown) {
            this.player.setVelocityX(-160);
            this.animateWalk(0, 12);
        } else if (right.isDown) {
            this.player.setVelocityX(160);
            this.animateWalk(16, 25);
        } else {
            this.player.setVelocityX(0);
            this.player.setTexture('sprite12');
        }
    }

    animateWalk(start, end) {
        this.currentFrame = this.currentFrame >= end ? start : this.currentFrame + 1;
        this.player.setTexture(`sprite${this.currentFrame}`);
    }

    animateJump(prefix) {
        this.jumpFrame = prefix === "jump_D" ? this.jumpFrame - 1 : this.jumpFrame + 1;
        this.jumpFrame = this.jumpFrame < 0 ? 12 : (this.jumpFrame > 12 ? 0 : this.jumpFrame);
        this.player.setTexture(`${prefix}${this.jumpFrame}`);
    }

    hitLanza(player, lanza) {
        if (!this.lanzasClavadas.contains(lanza)) { // Solo si la lanza no está clavada
            lanza.disableBody(true, true);
            this.vidas.vidaperdida();
    
            if (this.vidas.vidas > 0) {
                player.setTint(0xff0000);
                this.time.delayedCall(500, () => player.clearTint());
            } else {
                this.physics.pause();
                player.setTint(0xff0000);
                this.gameOver = true;
                this.scene.start('GameOver');
            }
        }
    }
}