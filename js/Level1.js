class Level1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Level1' });
    }

    preload() {
        this.load.image('vidas', 'assets/vidas.png');
        this.load.image('sky', 'assets/sky.webp');
        this.load.image('ground', 'assets/piso.webp');
        this.load.image('ground2', 'assets/plat1.webp');
        this.load.image('ground5', 'assets/plat2.webp');
        this.load.image('ground3', 'assets/plat3.webp');
        this.load.image('ground4', 'assets/plat4.webp');
        this.load.image('star', 'assets/flor.png');

        for (let i = 1; i <= 4; i++) {
            this.load.image(`bola${i}`, `assets/Bfuego/Bola(${i}).png`);
        }

        for (let i = 0; i <= 25; i++) {
            this.load.image(`sprite${i}`, `assets/sprites/sprite (${i}).png`);
        }

        for (let i = 0; i <= 12; i++) {
            this.load.image(`jump_i${i}`, `assets/jump/jump_i (${i}).png`);
            this.load.image(`jump_D${i}`, `assets/jump/jump_D (${i}).png`);
        }
    }

    create() {
        this.score = 0;
        this.gameOver = false;
        this.add.image(400, 300, 'sky');
        this.vidas = new Vidas(this, 90, 70);
        this.setupPlatforms();
        this.setupPlayer();
        this.setupStars();
        this.setupBombs();
        this.setupCollisions();
        this.setupScore();

        // Patrones de caída de bolas de fuego
        this.patternIndex = 0;
        this.patterns = [
            [100, 300, 500, 700], // Patrón 1
            [50, 150, 250, 350, 450, 550, 650, 750], // Patrón 2
            [200, 400, 600], // Patrón 3
            [80, 240, 400, 560, 720], // Patrón 4
            [120, 360, 600], // Patrón 5
            [50, 200, 350, 500, 650], // Patrón 6 (nuevo)
            [100, 250, 400, 550, 700], // Patrón 7 (nuevo)
            [150, 300, 450, 600, 750], // Patrón 8 (nuevo)
            [50, 300, 550] // Patrón 9 (nuevo)
        ];

        // Cambiar patrones cada 2 segundos
        this.time.addEvent({
            delay: 2000,
            callback: () => {
                this.patternIndex = (this.patternIndex + 1) % this.patterns.length;
            },
            loop: true
        });

        // Generar bolas de fuego cada 2 segundos
        this.time.addEvent({
            delay: 2000,
            callback: this.spawnBombs,
            callbackScope: this,
            loop: true
        });

        // Cambiar a la escena FinalLevel después de 30 segundos
        this.time.delayedCall(5000, () => {
            this.scene.start('Puente', { score: this.score });
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
        this.platforms.create(400, 595, 'ground').setScale(1).refreshBody();
        this.platforms.create(665, 378, 'ground2');
        this.platforms.create(138, 491, 'ground3');
        this.platforms.create(663, 494, 'ground4');
        this.platforms.create(103, 380, 'ground5');
    }

    setupPlayer() {
        this.player = this.physics.add.sprite(100, 450, 'sprite0');
        this.player.setCollideWorldBounds(true);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.currentFrame = 0;
        this.jumpFrame = 0;
    }

    setupStars() {
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        this.stars.children.iterate(child => {
            child.setBounceY(0);
        });
    }

    setupBombs() {
        this.bombs = this.physics.add.group();
    }

    setupCollisions() {
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.collider(this.bombs, this.platforms, this.hitpiso, null, this);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
    }

    hitpiso(bomb, platform) {
        bomb.destroy();
    }

    setupScore() {
        this.scoreText = this.add.text(16, 16, 'Score: 0', { 
            fontSize: '32px', 
            fill: '#fff' 
        });
    }

    spawnBombs() {
        const positions = this.patterns[this.patternIndex]; // Usar el patrón actual
        for (let i = 0; i < positions.length; i++) {
            this.time.delayedCall(i * 200, () => {
                const x = positions[i] + Phaser.Math.Between(-20, 20);
                const bomb = this.bombs.create(x, 0, 'bola1');
                bomb.setVelocityY(90); // Velocidad ajustada a 90
                bomb.setBounce(0);
                bomb.play('bolaAnim');
            });
        }
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
            this.animateJump("jump_i");
        } else if (isJumping && isMovingLeft) {
            this.animateJump("jump_D");
        } else if (isMovingLeft) {
            this.player.setVelocityX(-160);
            this.animateWalk(0, 12);
        } else if (isMovingRight) {
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
        bomb.disableBody(true, true);
        this.vidas.vidaperdida();

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