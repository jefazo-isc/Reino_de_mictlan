class FinalLevel extends Phaser.Scene {
    constructor() {
        super({ key: 'FinalLevel' });
        this.isPaused = false;

        // Variables del jefe
        this.bossHealth = 1000;
        this.currentPhase = 1;
        this.isEnraged = false;
        this.bossInvulnerable = false;
        
        // Variables del jugador
        this.playerSpeed = 160;
        this.jumpForce = -330;
        this.canThrow = true;
        this.isFacingLeft = false;
        this.isPowerUpActive = false;
        this.isInvincible = false;
    }

    preload() {
        // 1. Determinar prefijo del personaje
        this.characterPrefix = globalData.selectedCharacter === 'character1' ? 'p1' : 'p2';
        
        // 2. Cargar assets del personaje
        // Caminar (24 frames)
        for (let i = 1; i <= 24; i++) {
            this.load.image(`caminar${i}`, `assets/caminar${this.characterPrefix}/caminar(${i}).png`);
        }
        
        // Saltos (12 frames por dirección)
        for (let i = 1; i <= 9; i++) {
            this.load.image(`saltoi${i}`, `assets/jump${this.characterPrefix}/saltoi(${i}).png`);
            this.load.image(`saltod${i}`, `assets/jump${this.characterPrefix}/saltod(${i}).png`);
        }

        // Assets comunes
        this.load.image('xibalba_bg', 'assets/a.jpeg');
        this.load.image('ground', 'assets/piso2.png');
        this.load.image('ground2', 'assets/piso.webp');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.image('bomb_right', 'assets/Lanzad.png');
        this.load.image('powerup', 'assets/powerup.png');
        this.load.image('bomb_left', 'assets/Lanzai.png');
        this.load.image('vidas', 'assets/vidas.png');
        
        // Sprites del jefe
        for (let i = 0; i < 19; i++) {
            this.load.image(`boss_${i}`, `assets/caminarp1/boss/${i}.webp`);
        }
        
        for (let i = 0; i < 17; i++) {
            this.load.image(`boss_atk${i}`, `assets/caminarp1/boss/${i}.png`);
        }
        
        // Audio
        this.load.audio('hurt', '../assets/sonido/hurt_male.wav');
        this.load.audio('boss_hit', '../assets/sonido/hurt_male.wav');
        this.load.audio('power_up', '../assets/sonido/hurt_male.wav');
        this.load.audio('boss_music', '../assets/sonido/hurt_male.wav');
    }

    create() {
        // Configuración del personaje
        this.characterConfig = {
            idleFrame: this.characterPrefix === 'p1' ? 'caminar1' : 'caminar24',
            walkFrames: {
                left: this.characterPrefix === 'p1' ? { start: 13, end: 24 } : { start: 13, end: 24 },
                right: this.characterPrefix === 'p1' ? { start: 13, end: 24 } : { start: 13, end: 24 }
            },
            jumpFrames: {
                left: 'saltoi',
                right: 'saltod'
            }
        };
        this.createPauseButton();
 
        // Inicialización del juego
        this.score = globalData.score || 0;
        this.gameOver = false;
        this.currentFrame = this.characterPrefix === 'p1' ? 1 : 13;
        this.jumpFrame = 0;
        this.frameDelay = 0;
        this.lastDirection = '';
        this.playerBombs = this.physics.add.group();
        this.powerups = this.physics.add.group();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        // Configuración del escenario
        this.add.image(400, 330, 'xibalba_bg');
        this.musica = this.sound.add('boss_music', { loop: true });
        this.musica.play();
        
        // Sistema de vidas
        this.vidas = new Vidas(this, 90, 70);
        this.vidas.vidas = globalData.vidas || 3;
        globalData.vidas = this.vidas.vidas;
        
        // Actualizar iconos de vida
        this.vidas.iconos.forEach(icono => icono.destroy());
        this.vidas.iconos = [];
        for (let i = 0; i < this.vidas.vidas; i++) {
            this.vidas.iconos.push(this.add.image(90 + i * 35, 70, 'vidas').setScale(0.5));
        }
        
        // Configurar sistemas
        this.setupPlatforms();
        this.setupPlayer();
        this.setupBoss();
        this.setupBombs();
        this.setupPowerups();
        this.setupScore();
        this.setupCollisions();
        
        // Interfaces
        this.createBossHealthBar();
        this.createBossAnimations();
        
        // Habilitar audio
        this.input.once('pointerdown', () => {
            if (this.sound.context.state === 'suspended') {
                this.sound.context.resume();
            }
        });
    }

    setupPlatforms() {
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(100, 595, 'ground').setScale(3).refreshBody();
        
        this.movingPlatforms = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        
        const platformData = [
            { x: 1100, y: 100, key: 'ground', scaleX: 1, moveX: 0, moveY: 510 },
            { x: 250, y: 355, key: 'ground2', scaleX: 0.8, moveX: 100, moveY: 0 },
        ];
        
        platformData.forEach(data => {
            const platform = this.movingPlatforms.create(data.x, data.y, data.key);
            platform.setScale(data.scaleX, 1).setImmovable(true);
            
            this.tweens.add({
                targets: platform,
                x: platform.x + data.moveX,
                y: platform.y + data.moveY,
                ease: 'Linear',
                duration: 13000,
                yoyo: true,
                repeat: -1
            });
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
        this.player = this.physics.add.sprite(100, 450, this.characterConfig.idleFrame);
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(false);
        this.cursors = this.input.keyboard.createCursorKeys();
        
        this.player.body.onWorldBounds = true;
        this.physics.world.on('worldbounds', body => {
            if (body.gameObject === this.player && body.y > this.game.config.height) {
                this.handleFallDamage();
            }
        });
    }

    setupBoss() {
        this.boss = this.physics.add.sprite(400, 537, 'boss_0')
            .setCollideWorldBounds(true)
            .setDepth(1)
            .setImmovable(true);
        
        this.boss.body.setSize(120, 180);
        this.boss.body.setOffset(30, 20);
        this.boss.body.allowGravity = false;
    }

    setupBombs() {
        this.bombs = this.physics.add.group();
        
        this.time.addEvent({
            delay: 5000,
            callback: () => {
                if (this.gameOver) return;
                
                const x = Phaser.Math.Between(50, 750);
                const bomb = this.bombs.create(x, 16, 'bomb');
                bomb.setBounce(1);
                bomb.setCollideWorldBounds(true);
                bomb.setVelocity(
                    Phaser.Math.Between(-200, 200),
                    Phaser.Math.Between(50, 200)
                );
                
                this.tweens.add({
                    targets: bomb,
                    angle: 360,
                    duration: 1000,
                    repeat: -1
                });
            },
            callbackScope: this,
            loop: true
        });
    }

    setupPowerups() {
        this.time.addEvent({
            delay: Phaser.Math.Between(10000, 15000),
            callback: () => {
                if (this.gameOver) return;
                
                const platform = Phaser.Math.RND.pick([
                    ...this.platforms.getChildren(),
                    ...this.movingPlatforms.getChildren()
                ]);
                
                const powerup = this.powerups.create(platform.x, platform.y - 30, 'powerup');
                powerup.setScale(0.05);
                powerup.body.setSize(powerup.width * 0.5, powerup.height * 0.5);
                powerup.body.setAllowGravity(false);
                powerup.body.setImmovable(true);
                
                if (platform.body.moves) {
                    this.tweens.add({
                        targets: powerup,
                        x: platform.x + platform.body.velocity.x,
                        y: platform.y + platform.body.velocity.y - 30,
                        duration: 50,
                        repeat: -1
                    });
                }
            },
            callbackScope: this,
            loop: true
        });
    }

    setupScore() {
        this.scoreText = this.add.text(16, 16, 'Score: ' + this.score, { 
            fontSize: '32px',
            fill: '#FFF',
            fontFamily: 'Mayan'
        });
    }

    setupCollisions() {
        const allPlatforms = [this.platforms, this.movingPlatforms];
        
        this.physics.add.collider(this.player, allPlatforms);
        this.physics.add.collider(this.bombs, allPlatforms);
        this.physics.add.collider(this.playerBombs, allPlatforms);
        this.physics.add.collider(this.powerups, allPlatforms);
        this.physics.add.collider(this.boss, this.platforms, null, null, this);
        
        this.physics.add.overlap(this.player, this.powerups, this.collectPowerup, null, this);
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
        
        this.physics.add.overlap(this.playerBombs, this.boss, (bomb, boss) => {
            if (!bomb.active || this.bossInvulnerable || !boss.active) return;
            
            this.damageBoss(50);
            
            this.bossInvulnerable = true;
            this.time.delayedCall(500, () => {
                if (this.scene.isActive()) this.bossInvulnerable = false;
            });
            
            this.boss.setTint(0xFF0000);
            this.time.delayedCall(100, () => {
                if (this.boss && this.boss.active) this.boss.clearTint();
            });
            
            this.sound.play('boss_hit');
        });
    }

    createBossAnimations() {
        const createAnim = (key, frames, frameRate, repeat = 0) => {
            this.anims.create({
                key,
                frames,
                frameRate,
                repeat
            });
        };
        
        createAnim('boss_entrance', 
            Array.from({length: 12}, (_, i) => ({ key: `boss_${i}` })), 
            10);
            
        createAnim('boss_idle', 
            Array.from({length: 7}, (_, i) => ({ key: `boss_${i + 12}` })), 
            8, -1);
            
        createAnim('boss_atk', 
            Array.from({length: 17}, (_, i) => ({ key: `boss_atk${i}` })), 
            12);
            
        createAnim('boss_death', 
            Array.from({length: 12}, (_, i) => ({ key: `boss_${11 - i}` })), 
            10);
        
        this.boss.on('animationcomplete', anim => {
            if (anim.key === 'boss_entrance') {
                this.tweens.add({
                    targets: this.boss,
                    y: 300,
                    ease: 'Power2',
                    duration: 3000,
                    onComplete: () => this.boss.play('boss_idle')
                });
            }
            
            if (anim.key === 'boss_atk') {
                this.time.delayedCall(1000, () => {
                    if (this.boss.active) this.boss.play('boss_idle');
                });
            }
        });
        
        this.boss.play('boss_entrance');
    }

    createBossHealthBar() {
        this.bossHealthBar = this.add.graphics();
        this.updateBossHealthBar();
    }

    updateBossHealthBar() {
        this.bossHealthBar.clear();
        this.bossHealthBar.fillStyle(0x444444);
        this.bossHealthBar.fillRect(350, 50, 400, 30);
        
        this.bossHealthBar.fillStyle(0xFF3300);
        const width = (this.bossHealth / 1000) * 400;
        this.bossHealthBar.fillRect(350, 50, width, 30);
    }

    damageBoss(amount) {
        if (this.gameOver || this.bossHealth <= 0 || this.bossInvulnerable) return;
        
        this.bossHealth = Math.max(0, this.bossHealth - Math.min(amount, this.bossHealth));
        this.updateBossHealthBar();
        
        this.boss.setTint(0xFF0000);
        this.time.delayedCall(100, () => this.boss.clearTint());
        
        this.checkBossPhase();
    }

    checkBossPhase() {
        if (this.bossHealth <= 0) {
            this.bossHealth = 0;
            this.defeatBoss();
            return;
        }
        
        if (this.bossHealth <= 1000 && this.currentPhase === 1) {
            this.currentPhase = 2;
            this.startPhaseTwo();
        }
        
        if (this.bossHealth <= 300 && !this.isEnraged) {
            this.isEnraged = true;
            this.startEnragedPhase();
        }
    }

    startPhaseTwo() {
        this.boss.on('animationupdate', (anim, frame) => {
            if (anim.key === 'boss_atk' && frame.index === 9) {
                const bomb = this.bombs.create(this.boss.x + 50, this.boss.y - 50, 'bomb');
                bomb.setVelocity(Phaser.Math.Between(-300, 300), -250);
            }
        });
        
        this.time.addEvent({
            delay: 3000,
            callback: () => {
                if (!this.gameOver && this.boss.active) this.boss.play('boss_atk');
            },
            loop: true
        });
    }

    startEnragedPhase() {
        this.isEnraged = true;
        this.boss.setTint(0xFF0000);
    }

    defeatBoss() {
        this.gameOver = true;
        this.boss.play('boss_death');
        
        this.time.delayedCall(2000, () => {
            this.musica.stop();
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.time.delayedCall(1000, () => {
                globalData.score = this.score;
                globalData.vidas = this.vidas.vidas;
                this.scene.start('Victoria', {
                    score: this.score
                });
            });
        });
    }

    animateWalk(direction) {
        const frames = this.characterConfig.walkFrames[direction];
        
        if (this.lastDirection !== direction) {
            this.currentFrame = frames.start;
            this.lastDirection = direction;
        }
        
        if (this.frameDelay % 5 === 0) {
            this.currentFrame = Phaser.Math.Wrap(this.currentFrame + 1, frames.start, frames.end + 1);
            this.player.setTexture(`caminar${this.currentFrame}`);
        }
        this.frameDelay++;
    }

    animateJump(direction) {
        const prefix = direction === 'left' ? 
            this.characterConfig.jumpFrames.left : 
            this.characterConfig.jumpFrames.right;
        
        if (this.frameDelay % 5 === 0) {
            this.jumpFrame = Phaser.Math.Wrap(this.jumpFrame + 1, 1, 13);
            this.player.setTexture(`${prefix}${this.jumpFrame}`);
        }
        this.frameDelay++;
    }

    throwBomb() {
        if (!this.canThrow) return;
        
        const bomb = this.playerBombs.create(
            this.player.x + (this.isFacingLeft ? -40 : 40),
            this.player.y - 30,
            this.isFacingLeft ? 'bomb_left' : 'bomb_right'
        );
        
        bomb.setScale(0.8);
        bomb.setVelocityX(this.isFacingLeft ? -600 : 600);
        bomb.setVelocityY(-300);
        bomb.setGravityY(800);
        bomb.setBounce(0.3);
        
        this.canThrow = false;
        this.time.delayedCall(1000, () => this.canThrow = true);
    }

    hitBomb(player, bomb) {
        if (this.gameOver || this.isInvincible) return;
        
        bomb.destroy();
        this.vidas.vidaperdida();
        globalData.vidas = this.vidas.vidas;
        
        this.sound.play('hurt');
        
        if (this.vidas.vidas <= 0) {
            this.physics.pause();
            player.setTint(0xff0000);
            this.gameOver = true;
            this.musica.stop();
            this.time.delayedCall(1000, () => {
                globalData.score = this.score;
                this.scene.start('GameOver', globalData);
            });
        } else {
            player.setPosition(100, 450);
            player.setVelocity(0, 0);
            player.setTint(0xff0000);
            this.time.delayedCall(500, () => player.clearTint());
        }
    }

    handleFallDamage() {
        if (this.gameOver || this.isInvincible) return;
        
        this.vidas.vidaperdida();
        globalData.vidas = this.vidas.vidas;
        
        this.cameras.main.shake(300, 0.02);
        this.player.setVelocity(0, 0);
        
        if (this.vidas.vidas <= 0) {
            this.gameOver = true;
            this.musica.stop();
            this.time.delayedCall(1000, () => {
                globalData.score = this.score;
                this.scene.start('GameOver', { score: this.score });
            });
        } else {
            this.player.setPosition(100, 450);
            this.player.setTint(0xff0000);
            this.time.delayedCall(500, () => this.player.clearTint());
        }
    }

    collectPowerup(player, powerup) {
        powerup.destroy();
        this.isPowerUpActive = true;
        this.isInvincible = true;
        player.setTint(0x00FF00);
        this.playerSpeed *= 1.5;
        
        this.sound.play('power_up');
        this.powerUpTime = this.time.now + 10000;
    }

    update() {
        if (this.gameOver || this.isPaused) return;

        const { left, right, up } = this.cursors;
        const isGrounded = this.player.body.touching.down;
        
        // Movimiento básico
        this.player.setVelocityX(0);
        
        if (left.isDown) {
            this.player.setVelocityX(-this.playerSpeed);
            this.player.setFlipX(true);
            this.animateWalk('left');
            this.isFacingLeft = true;
        } else if (right.isDown) {
            this.player.setVelocityX(this.playerSpeed);
            this.player.setFlipX(false);
            this.animateWalk('right');
            this.isFacingLeft = false;
        } else {
            this.player.setTexture(this.characterConfig.idleFrame);
        }
        
        if (up.isDown && isGrounded) {
            this.player.setVelocityY(this.jumpForce);
            this.animateJump(this.isFacingLeft ? 'left' : 'right');
        }
        
        // Controles especiales
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.throwBomb();
        }
        
        // Caída
        if (this.player.y > 700) {
            this.handleFallDamage();
        }
        
        // Comportamiento del jefe
        if (this.currentPhase === 2) {
            this.boss.x += Math.sin(this.time.now * 0.002) * 2.5;
        }
        
        if (this.isEnraged) {
            this.boss.rotation += 0.02;
        }
        
        // PowerUp timing
        if (this.isPowerUpActive && this.time.now > this.powerUpTime) {
            this.isPowerUpActive = false;
            this.isInvincible = false;
            this.player.clearTint();
            this.playerSpeed = 160;
        }
    }
}

window.FinalLevel = FinalLevel;