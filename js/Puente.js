class Puente extends Phaser.Scene {
    constructor() {
        super({ key: 'Puente' });
        this.isPaused = false;

    }

    preload() {
        // 1. Determinar prefijo del personaje
        const selectedChar = globalData.selectedCharacter;
        this.characterPrefix = selectedChar.replace('character', 'p');

        // 2. Cargar assets del personaje
        this.load.image('parado', `assets/caminar${this.characterPrefix}/Parado.png`);
        
        // Caminar (24 frames: 1-12 izquierda, 13-24 derecha)
        for (let i = 1; i <= 24; i++) {
            this.load.image(`caminar${i}`, `assets/caminar${this.characterPrefix}/caminar(${i}).png`);
        }
        
        // Saltos (0-12 frames para ambas direcciones)
        
        for (let i = 1; i <= 9; i++) {
            this.load.image(`saltoi${i}`, `assets/jump${this.characterPrefix}/saltoi(${i}).png`);
            this.load.image(`saltod${i}`, `assets/jump${this.characterPrefix}/saltod(${i}).png`);
        }

        // 3. Cargar assets comunes
        this.load.image('vidas', 'assets/vidas.png');
        this.load.image('Puente', 'assets/Puente.webp');
        this.load.image('ground', 'assets/piso.webp');
        this.load.image('ground4', 'assets/plat4.webp');
        this.load.image('lanzas', 'assets/Lanza.png');
        this.load.audio('hurt', '../assets/sonido/hurt_male.wav');
        this.load.audio('lanza', '../assets/sonido/lanza.wav');
        this.load.audio('musicaFondo', '../assets/sonido/MusicaAzteca.mp3');
    }

    create() {
        this.score = globalData.score || 0;
        this.gameOver = false;
        this.lanzasRecogidas = 0;
        this.createPauseButton();

        // Configuración inicial
        this.add.image(400, 300, 'Puente');
        this.musica = this.sound.add('musicaFondo', { loop: true });
        this.musica.play();
        this.vidas = new Vidas(this, 90, 70);
        globalData.vidas = this.vidas.vidas; // Mantener sincronizado
        globalData.currentLevel = 2;
        this.alias = this.add.text(190, 15, 'Jugador: ' + globalData.alias, {
            fontSize: '32px',
            fill: '#fff',
        });
        this.fechaText = this.add.text(470, 16, 'Fecha: ' + globalData.registrado, { 
            fontSize: '32px',
            fill: '#FFF',
            fontFamily: 'Mayan'
        });
        
        this.nivelText = this.add.text(16, 155, 'Nivel: ' + globalData.currentLevel, { 
            fontSize: '32px',
            fill: '#FFF',
            fontFamily: 'Mayan'
        });
        this.setupPlatforms();
        this.setupPlayer();
        this.setupLanzas();
        this.setupCollisions();
        this.setupScore();
        this.setupLanzasCounter();

        // Eventos temporales
        this.time.addEvent({
            delay: 500,
            callback: this.spawnLanzas,
            callbackScope: this,
            loop: true
        });

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

    setupPlayer() {
        this.player = this.physics.add.sprite(100, 450, 'parado');
        this.player.setCollideWorldBounds(true);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.currentFrame = 1;
        this.jumpFrame = 0;
    }

    setupLanzas() {
        this.lanzas = this.physics.add.group();
        this.lanzasClavadas = this.physics.add.staticGroup();
    }

    setupCollisions() {
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.lanzas, this.platforms, this.clavarLanza, null, this);
        this.physics.add.collider(this.player, this.lanzas, this.hitLanza, null, this);
        this.physics.add.overlap(this.player, this.lanzasClavadas, this.recogerLanza, null, this);
    }

    setupScore() {
        this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, {
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
            { x: Phaser.Math.Between(0, 800), y: -50, velocityX: 0, velocityY: 200, rotation: 0, gravity: true },
            { x: -50, y: Phaser.Math.Between(0, 600), velocityX: 350, velocityY: 0, rotation: -Math.PI / 2, gravity: false },
            { x: 850, y: Phaser.Math.Between(0, 600), velocityX: -350, velocityY: 0, rotation: Math.PI / 2, gravity: false },
            { x: -50, y: Phaser.Math.Between(-100, 300), velocityX: 350, velocityY: 200, rotation: -Math.PI / 4, gravity: true },
            { x: 850, y: Phaser.Math.Between(-100, 300), velocityX: -350, velocityY: 200, rotation: Math.PI / 4, gravity: true }
        ];

        const direction = Phaser.Math.RND.pick(directions);
        const lanza = this.lanzas.create(direction.x, direction.y, 'lanzas');

        lanza.body.allowGravity = direction.gravity;
        lanza.setVelocity(direction.velocityX, direction.velocityY);
        lanza.rotation = direction.rotation;
        lanza.setBounce(0);
        this.sound.play('lanza');
    }

    clavarLanza(lanza, platform) {
        const lanzaClavada = this.lanzasClavadas.create(lanza.x, lanza.y, 'lanzas');
        lanzaClavada.rotation = lanza.rotation;
        lanzaClavada.refreshBody();
        lanza.destroy();

        this.time.delayedCall(3000, () => {
            if (lanzaClavada?.active) lanzaClavada.destroy();
        });
    }

    recogerLanza(player, lanza) {
        if (lanza?.active) {
            lanza.destroy();
            this.score += 15;
            this.scoreText.setText(`Score: ${this.score}`);
            this.lanzasRecogidas++;
            this.lanzasText.setText(`x ${this.lanzasRecogidas}`);

            this.tweens.add({
                targets: this.lanzasIcon,
                scale: 0.6,
                duration: 100,
                yoyo: true
            });

            if (this.lanzasRecogidas >= 3) this.endLevel();
        }
    }

    endLevel() {
        this.gameOver = true;
        this.musica.stop();
        globalData.score = this.score;
        this.scene.start('FinalLevel', globalData);
    }

    update() {
        if (this.gameOver || this.isPaused) return;

        const { up, right, left } = this.cursors;
        const { touching } = this.player.body;

        if (up.isDown && touching.down) {
            this.player.setVelocityY(-330);
            if (right.isDown) this.animateJump('saltod');
            else if (left.isDown) this.animateJump('saltoi');
        } else if (left.isDown) {
            this.player.setVelocityX(-160);
            this.animateWalk(1, 12); // Izquierda: frames 1-12
        } else if (right.isDown) {
            this.player.setVelocityX(160);
            this.animateWalk(13, 24); // Derecha: frames 13-24
        } else {
            this.player.setVelocityX(0);
            this.player.setTexture('parado');
        }
    }

    animateWalk(startFrame, endFrame) {
        this.currentFrame = this.currentFrame >= endFrame ? startFrame : this.currentFrame + 1;
        this.player.setTexture(`caminar${this.currentFrame}`);
    }

    animateJump(direction) {
        this.jumpFrame = (this.jumpFrame + 1) % 13;
        this.player.setTexture(`${direction}${this.jumpFrame}`);
    }

    hitLanza(player, lanza) {
        if (!this.lanzasClavadas.contains(lanza)) {
            lanza.disableBody(true, true);
            this.vidas.vidaperdida();
            this.sound.play('hurt');

            if (this.vidas.vidas > 0) {
                player.setTint(0xff0000);
                this.time.delayedCall(500, () => player.clearTint());
            } else {
                this.physics.pause();
                player.setTint(0xff0000);
                this.gameOver = true;
                globalData.score = this.score;
                this.musica.stop();
                this.scene.start('GameOver', globalData);
            }
        }
    }
}