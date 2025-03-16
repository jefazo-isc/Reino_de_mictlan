class Level1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Level1' });
        this.isPaused = false;
    }

    preload() {
        // Limpiar texturas anteriores
        this.cleanCharacterTextures();
        
        // Determinar prefijo del personaje
        this.characterPrefix = globalData.selectedCharacter === 'character1' ? 'p1' : 'p2';
        
        // Cargar assets del personaje
        this.loadCharacterAssets();

        // Cargar assets comunes
        this.load.image('vidas', 'assets/vidas.png');
        this.load.image('sky', 'assets/sky.webp');
        this.load.image('ground', 'assets/piso.webp');
        this.load.image('ground2', 'assets/plat1.webp');
        this.load.image('ground5', 'assets/plat2.webp');
        this.load.image('ground3', 'assets/plat3.webp');
        this.load.image('ground4', 'assets/plat4.webp');
        this.load.image('star', 'assets/flor.png');
        this.load.audio('musicaFondo', '../assets/sonido/MusicaAzteca.mp3');
        this.load.audio('fuego', '../assets/sonido/fire_ball.wav');
        this.load.audio('collect', '../assets/sonido/collect.wav');
        this.load.audio('hurt', '../assets/sonido/hurt_male.wav');

        // Bolas de fuego
        for (let i = 1; i <= 4; i++) {
            this.load.image(`bola${i}`, `assets/Bfuego/Bola(${i}).png`);
        }
    }

    cleanCharacterTextures() {
        // Eliminar texturas existentes
        const removeTexture = (key) => {
            if (this.textures.exists(key)) this.textures.remove(key);
        };

        removeTexture('parado');
        
        for (let i = 1; i <= 24; i++) removeTexture(`caminar${i}`);
        for (let i = 1; i <= 9; i++) {
            removeTexture(`saltoi${i}`);
            removeTexture(`saltod${i}`);
        }
    }

    loadCharacterAssets() {
        // Cargar nuevas texturas del personaje
        this.load.image('parado', `assets/caminar${this.characterPrefix}/Parado.png`);
        
        // Caminar (24 frames)
        for (let i = 1; i <= 24; i++) {
            this.load.image(`caminar${i}`, `assets/caminar${this.characterPrefix}/caminar(${i}).png`);
        }
        
        // Saltos (9 frames)
        for (let i = 1; i <= 9; i++) {
            this.load.image(`saltoi${i}`, `assets/jump${this.characterPrefix}/saltoi(${i}).png`);
            this.load.image(`saltod${i}`, `assets/jump${this.characterPrefix}/saltod(${i}).png`);
        }
    }

    create() {
        // Inicialización del juego
        this.score = globalData.score || 0;
        this.gameOver = false;
        this.add.image(400, 300, 'sky');
        this.vidas = new Vidas(this, 90, 70, globalData.vidas);
        this.setupPlatforms();
        this.setupPlayer();
        this.createPauseButton();
        this.setupStars();
        this.setupBombs();
        this.setupCollisions();
        this.setupScore();
        
        // Configurar música
        this.musica = this.sound.add('musicaFondo', { loop: true });
        this.musica.play();

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
        this.time.delayedCall(5000, () => {
            globalData.score = this.score;
            this.musica.stop();
            this.scene.start('Puente');
        });
    }

    createPauseButton() {
        this.pauseButton = this.add.text(750, 30, '⏸', {
            fontSize: '32px',
            fill: '#fff',
            backgroundColor: '#00000055',
            padding: { x: 10, y: 5 }
        })
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => this.togglePause())
        .setDepth(1000);
    }

    togglePause() {
        if (!this.gameOver) {
            this.isPaused = !this.isPaused;
            
            if (this.isPaused) {
                this.physics.world.pause();
                this.time.paused = true;
                if (this.musica && this.musica.isPlaying) this.musica.pause();
                this.showPauseMenu();
            } else {
                this.physics.world.resume();
                this.time.paused = false;
                if (this.musica && !this.musica.isPlaying) this.musica.resume();
                this.hidePauseMenu();
            }
        }
    }

    showPauseMenu() {
        this.pauseOverlay = this.add.graphics(400, 300, 800, 600, 0x000000, 0.7)
            .setDepth(999);

        this.resumeButton = this.add.text(400, 300, 'Reanudar', {
            fontSize: '48px',
            fill: '#fff',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => this.togglePause())
        .setDepth(1000);

        this.pauseText = this.add.text(400, 200, 'PAUSA', {
            fontSize: '64px',
            fill: '#FFD700',
            fontStyle: 'bold'
        })
        .setOrigin(0.5)
        .setDepth(1000);
    }

    hidePauseMenu() {
        this.pauseOverlay.destroy();
        this.resumeButton.destroy();
        this.pauseText.destroy();
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
        // Frame inicial basado en personaje
        const neutralFrame = this.characterPrefix === 'p1' ? 'caminar1' : 'caminar13';
        this.player = this.physics.add.sprite(100, 450, neutralFrame);
        this.player.setCollideWorldBounds(true);
        if (!this.player.body) {
            console.error('Player body not created properly');
        }
        this.cursors = this.input.keyboard.createCursorKeys();
        this.currentFrame = this.characterPrefix === 'p1' ? 1 : 13;
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
                this.sound.play('fuego');
            });
        });
    }

    update() {
        if (this.gameOver || this.isPaused || !this.player || !this.player.body) return;

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
            this.player.setTexture('parado');
        }
    }

    animateWalk(startFrame, endFrame) {
        this.currentFrame = this.currentFrame >= endFrame ? startFrame : this.currentFrame + 1;
        this.player.setTexture(`caminar${this.currentFrame}`);
    }

    animateJump(direction) {
        this.jumpFrame = (this.jumpFrame + 1) % 10;
        const frameIndex = Math.min(this.jumpFrame + 1, 9); // Asegurar máximo frame 9
        this.player.setTexture(`${direction}${frameIndex}`);
    }

    collectStar(player, star) {
        star.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText(`Score: ${this.score}`);
        this.sound.play('collect');
        globalData.score = this.score;

        if (this.stars.countActive(true) === 0) {
        }
    }

    hitBomb(player, bomb) {
        bomb.disableBody(true, true);
        this.vidas.vidaperdida();
        this.sound.play('hurt');

        if (this.vidas.vidas > 0) {
            player.setTint(0xff0000);
            this.time.delayedCall(500, () => player.clearTint());
        } else {
            this.physics.world.pause();
            player.setTint(0xff0000);
            this.gameOver = true;
            globalData.score = this.score;
            this.scene.start('GameOver');
        }
    }
}