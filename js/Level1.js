class Level1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Level1' });
        this.characterPrefix = 'p1'; // Valor por defecto
    }

    preload() {
        // 1. Determinar prefijo del personaje seleccionado
        const selectedChar = window.globalData.selectedCharacter;
        this.characterPrefix = selectedChar.replace('character', 'p'); // Convierte "character1" a "p1"

        // 2. Cargar assets según personaje seleccionado
        // Caminar (24 frames: 1-12 izquierda, 13-24 derecha)
        for (let i = 1; i <= 24; i++) {
            this.load.image(`caminar${i}`, `assets/caminar${this.characterPrefix}/caminar(${i}).png`);
        }
        
        // Saltos (0-12 frames para ambas direcciones)
        for (let i = 0; i <= 12; i++) {
            this.load.image(`saltoi${i}`, `assets/caminar${this.characterPrefix}/saltoi(${i}).png`);
            this.load.image(`saltod${i}`, `assets/caminar${this.characterPrefix}/saltod(${i}).png`);
        }

        // 3. Cargar assets comunes
        this.load.image('vidas', 'assets/vidas.png');
        this.load.image('sky', 'assets/sky.webp');
        this.load.image('ground', 'assets/piso.webp');
        this.load.image('ground2', 'assets/plat1.webp');
        this.load.image('ground5', 'assets/plat2.webp');
        this.load.image('ground3', 'assets/plat3.webp');
        this.load.image('ground4', 'assets/plat4.webp');
        this.load.image('star', 'assets/flor.png');

        // Bolas de fuego
        for (let i = 1; i <= 4; i++) {
            this.load.image(`bola${i}`, `assets/Bfuego/Bola(${i}).png`);
        }
    }

    create() {
        // Inicialización del juego
        this.score = window.globalData.score || 0;
        this.gameOver = false;
        this.add.image(400, 300, 'sky');
        this.vidas = new Vidas(this, 90, 70);
        this.setupPlatforms();
        this.setupPlayer();
        this.setupStars();
        this.setupBombs();
        this.setupCollisions();
        this.setupScore();

        // Configuración de patrones de bolas
        this.patternIndex = 0;
        this.patterns = [
            [100, 300, 500, 700],
            [50, 150, 250, 350, 450, 550, 650, 750],
            [200, 400, 600],
            [80, 240, 400, 560, 720],
            [120, 360, 600],
            [50, 200, 350, 500, 650],
            [100, 250, 400, 550, 700],
            [150, 300, 450, 600, 750],
            [50, 300, 550]
        ];

        // Eventos temporales
        this.time.addEvent({
            delay: 2000,
            callback: () => this.patternIndex = (this.patternIndex + 1) % this.patterns.length,
            loop: true
        });

        this.time.addEvent({
            delay: 2000,
            callback: this.spawnBombs,
            callbackScope: this,
            loop: true
        });

        // Animación de bolas de fuego
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

        // Transición a Puente
        this.time.delayedCall(20000, () => {
            window.globalData.score = this.score;
            this.scene.start('Puente');
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
        this.player = this.physics.add.sprite(100, 450, 'caminar1');
        this.player.setCollideWorldBounds(true);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.currentFrame = 1;
        this.jumpFrame = 0;
    }

    setupStars() {
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        this.stars.children.iterate(child => child.setBounceY(0));
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
        this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, { 
            fontSize: '32px', 
            fill: '#fff' 
        });
    }

    spawnBombs() {
        const positions = this.patterns[this.patternIndex];
        positions.forEach((pos, i) => {
            this.time.delayedCall(i * 200, () => {
                const x = pos + Phaser.Math.Between(-20, 20);
                const bomb = this.bombs.create(x, 0, 'bola1');
                bomb.setVelocityY(90).play('bolaAnim');
            });
        });
    }

    update() {
        if (this.gameOver) return;

        const isJumping = this.cursors.up.isDown && this.player.body.touching.down;
        const isMovingRight = this.cursors.right.isDown;
        const isMovingLeft = this.cursors.left.isDown;

        // Lógica de movimiento
        if (isJumping) {
            this.player.setVelocityY(-330);
            if (isMovingRight) this.animateJump('saltod');
            else if (isMovingLeft) this.animateJump('saltoi');
        } 
        else if (isMovingLeft) {
            this.player.setVelocityX(-160);
            this.animateWalk(1, 12); // Frames 1-12: izquierda
        } 
        else if (isMovingRight) {
            this.player.setVelocityX(160);
            this.animateWalk(13, 24); // Frames 13-24: derecha
        } 
        else {
            this.player.setVelocityX(0);
            this.player.setTexture('caminar1'); // Posición neutral
        }
    }

    animateWalk(startFrame, endFrame) {
        this.currentFrame = this.currentFrame >= endFrame ? startFrame : this.currentFrame + 1;
        this.player.setTexture(`caminar${this.currentFrame}`);
    }

    animateJump(direction) {
        this.jumpFrame = (this.jumpFrame + 1) % 13; // Ciclo 0-12
        this.player.setTexture(`${direction}${this.jumpFrame}`);
    }

    collectStar(player, star) {
        star.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText(`Score: ${this.score}`);
        window.globalData.score = this.score;

        if (this.stars.countActive(true) === 0) {
            this.stars.children.iterate(child => child.enableBody(true, child.x, 0, true, true));
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
            window.globalData.score = this.score;
            this.scene.start('GameOver');
        }
    }
}