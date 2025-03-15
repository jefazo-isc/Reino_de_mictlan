class Level1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Level1' });
    }

    preload() {
        this.load.image('vidas', 'assets/vidas.png'); // Ajusta la ruta si es necesario
        this.load.image('sky', 'assets/sky.webp');
        this.load.image('ground', 'assets/piso.webp');
        this.load.image('ground2', 'assets/plat1.webp');
        this.load.image('ground5', 'assets/plat2.webp');
        this.load.image('ground3', 'assets/plat3.webp');
        this.load.image('ground4', 'assets/plat4.webp');
        this.load.image('star', 'assets/flor.png');

        // Cargar sprites de bolas de fuego
        for (let i = 1; i <= 4; i++) {
            this.load.image(`bola${i}`, `assets/Bfuego/Bola(${i}).png`);
        }

        // Cargar sprites de caminar
        for (let i = 0; i <= 25; i++) {
            this.load.image(`sprite${i}`, `assets/sprites/sprite (${i}).png`);
        }

        // Cargar sprites de salto hacia la derecha
        for (let i = 0; i <= 12; i++) {
            this.load.image(`jump_i${i}`, `assets/jump/jump_i (${i}).png`);
        }

        // Cargar sprites de salto hacia la izquierda
        for (let i = 0; i <= 12; i++) {
            this.load.image(`jump_D${i}`, `assets/jump/jump_D (${i}).png`);
        }
    }

    create() {
        this.score = 0;
        this.gameOver = false;
        this.add.image(400, 300, 'sky');
        this.vidas = new Vidas(this, 3, 50, 26);
        this.setupPlatforms();
        this.setupPlayer();
        this.setupStars();
        this.setupBombs();
        this.setupCollisions();
        this.setupScore();

        // Iniciar la caída de bolas de fuego cada 2 segundos
        this.time.addEvent({
            delay: 2000,
            callback: this.spawnBomb,
            callbackScope: this,
            loop: true
        });

        // Crear animación de bolas de fuego
        this.anims.create({
            key: 'bolaAnim',
            frames: [
                { key: 'bola1' },
                { key: 'bola2' },
                { key: 'bola3' },
                { key: 'bola4' }
            ],
            frameRate: 10,
            repeat: -1
        });
    }

    setupPlatforms() {
        this.platforms = this.physics.add.staticGroup();

        // Crear las plataformas y asignarles un nombre único para identificarlas
        this.platforms.create(400, 595, 'ground').setName('piso').setScale(1).refreshBody();
        this.platforms.create(665, 378, 'ground2').setName('plat1');
        this.platforms.create(138, 491, 'ground3').setName('plat2');
        this.platforms.create(663, 494, 'ground4').setName('plat3');
        this.platforms.create(103, 380, 'ground5').setName('plat4');
    }

    setupPlayer() {
        this.player = this.physics.add.sprite(100, 450, 'sprite0');
        this.player.setCollideWorldBounds(true); // Sin rebote
        this.cursors = this.input.keyboard.createCursorKeys();

        this.currentFrame = 0; // Control para caminar
        this.jumpFrame = 0; // Control para salto
        this.frameDelay = 0; // Manejo de velocidad de animación
    }

    setupStars() {
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        this.stars.children.iterate(child => {
            child.setBounceY(0); // Sin rebote
        });
    }

    setupBombs() {
        this.bombs = this.physics.add.group();
    }

    setupCollisions() {
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);

        // Colisión de bolas de fuego con las plataformas
        this.physics.add.collider(this.bombs, this.platforms, this.hitpiso);
    
    }

    hitpiso(bombs, platform) {
        bombs.disableBody(true, true); // Desaparecer la bola de fuego al tocar al jugador
        bombs.destroy();
    }

    setupScore() {
        this.scoreText = this.add.text(16, 16, 'Score: 0', { 
            fontSize: '32px', 
            fill: '#fff' 
        });
    }

    spawnBomb() {
        const x = Phaser.Math.Between(50, 750); // Posición aleatoria en X
        const bomb = this.bombs.create(x, 0, 'bola1'); // Crear bola de fuego
        bomb.setVelocityY(200); // Caída constante
        bomb.setGravityY(1); // Sin gravedad adicional
        bomb.setBounce(0); // Sin rebote

        // Reproducir la animación de la bola de fuego
        bomb.play('bolaAnim');
    }

    update() {
        if (this.gameOver) return;

        let isJumping = this.cursors.up.isDown && this.player.body.touching.down;
        let isMovingRight = this.cursors.right.isDown;
        let isMovingLeft = this.cursors.left.isDown;

        if (isJumping) {
            this.player.setVelocityY(-330);
        }

        if (isJumping && isMovingRight) {
            this.animateJump("jump_i", 0, 12);
        } else if (isJumping && isMovingLeft) {
            this.animateJump("jump_D", 0, 12);
        } else if (isMovingLeft) {
            this.player.setVelocityX(-160);
            this.animateWalk(0, 12);
        } else if (isMovingRight) {
            this.player.setVelocityX(160);
            this.animateWalk(16, 25);
        } else {
            this.player.setVelocityX(0);
            this.player.setTexture('sprite12'); // Imagen de "quieto"
        }
    }

    animateWalk(start, end) {
        if (this.frameDelay % 3 === 0) { // Controla la velocidad de la animación
            this.currentFrame++;
            if (this.currentFrame > end) this.currentFrame = start;
            this.player.setTexture(`sprite${this.currentFrame}`);
        }
        this.frameDelay++;
    }

    animateJump(prefix, start, end) {
        if (this.frameDelay % 5 === 0) { // Controla la velocidad del cambio de imágenes al saltar
            if (prefix === "jump_D") {
                this.jumpFrame--;
                if (this.jumpFrame < start) {
                    this.jumpFrame = end;
                }
            } else if (prefix === "jump_i") {
                this.jumpFrame++;
                if (this.jumpFrame > end) {
                    this.jumpFrame = start;
                }
            }
            this.player.setTexture(`${prefix}${this.jumpFrame}`);
        }
        this.frameDelay++;
    }

    collectStar(player, star) {
        star.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText(`Score: ${this.score}`);

        if (this.stars.countActive(true) === 0) {
            this.stars.children.iterate(child => {
                child.enableBody(true, child.x, 0, true, true);
            });
        }
    }


    hitBomb(player, bomb) {
        bomb.disableBody(true, true); // Desaparecer la bola de fuego al tocar al jugador
        this.vidas.vidaperdida(); // Restar una vida

        if (this.vidas.vidas > 0) {
            player.setTint(0xff0000);
            this.time.delayedCall(500, () => {
                player.clearTint();
                this.physics.resume();
            });
        } else {
            this.physics.pause();
            player.setTint(0xff0000);
            this.gameOver = true;
        }
    }
}