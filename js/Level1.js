class Level1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Level1' });
    }

    preload() {
        this.load.image('sky', 'assets/sky.webp');
        this.load.image('ground', 'assets/piso.png');
        this.load.image('ground2', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');

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
        this.setupPlatforms();
        this.setupPlayer();
        this.setupStars();
        this.setupBombs();
        this.setupCollisions();
        this.setupScore();
    }

    setupPlatforms() {
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 595, 'ground').setScale(1).refreshBody();
        this.platforms.create(720, 500, 'ground2');
        this.platforms.create(8, 380, 'ground2');
        this.platforms.create(720, 380, 'ground2');
        this.platforms.create(73, 500, 'ground2');
    }

    setupPlayer() {
        this.player = this.physics.add.sprite(100, 450, 'sprite0');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

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
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
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
    }

    setupScore() {
        this.scoreText = this.add.text(16, 16, 'Score: 0', { 
            fontSize: '32px', 
            fill: '#000' 
        });
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

            const x = (this.player.x < 400) ? 
                Phaser.Math.Between(400, 800) : 
                Phaser.Math.Between(0, 400);

            const bomb = this.bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            bomb.allowGravity = false;
        }
    }

    hitBomb(player, bomb) {
        this.physics.pause();
        player.setTint(0xff0000);
        this.gameOver = true;
    }
}