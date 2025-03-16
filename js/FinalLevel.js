class FinalLevel extends Phaser.Scene {
    constructor() {
        super({ key: 'FinalLevel' });
        
        // Variables del jefe
        this.bossHealth = 1000;
        this.currentPhase = 1;
        this.isEnraged = false;
        
        // Variables del jugador
        this.playerSpeed = 160;
        this.jumpForce = -330;
        this.canThrow = true;
        this.isFacingLeft = false;
        this.isPowerUpActive = false;
        this.isInvincible = false;
    }

    preload() {
        // Optimización: usar spritesheets en lugar de imágenes individuales
        this.load.image('xibalba_bg', 'assets/a.jpeg');
        this.load.image('ground', 'assets/piso2.png');
        this.load.image('ground2', 'assets/piso.webp');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.image('powerup', 'assets/powerup.png');
        this.load.image('bomb_left', 'assets/star.png');
        
        // Cargar spritesheet del jugador (mejora futura)
        this.load.spritesheet('player_walk', 'assets/caminarp1/caminar_sheet.png', {
            frameWidth: 64, frameHeight: 64, startFrame: 0, endFrame: 24
        });
        
        // Usar cargas individuales como fallback
        for (let i = 1; i < 25; i++) {
            this.load.image(`sprite${i}`, `assets/caminarp1/caminar(${i}).png`);
        }
        
        // Sprites de salto
        for (let i = 1; i <= 12; i++) {
            this.load.image(`jump_i${i}`, `assets/caminarp1/saltoi(${i}).png`);
            this.load.image(`jump_D${i}`, `assets/caminarp1/saltod(${i}).png`);
        }
        
        // Boss sprites
        for (let i = 0; i < 19; i++) {
            this.load.image(`boss_${i}`, `assets/caminarp1/boss/${i}.webp`);
        }
        
        for (let i = 0; i < 17; i++) {
            this.load.image(`boss_atk${i}`, `assets/caminarp1/boss/${i}.png`);
        }
    }

    create() {
        // Inicialización
        this.score = 0;
        this.gameOver = false;
        this.currentFrame = 0;
        this.jumpFrame = 0;
        this.frameDelay = 0;
        this.lastDirection = '';
        this.playerBombs = this.physics.add.group();
        this.powerups = this.physics.add.group();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        // Configuración del juego
        this.add.image(400, 330, 'xibalba_bg');
        
        // Configuración de sistemas
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
    
    // SISTEMAS DEL JUEGO
    
    setupPlatforms() {
        // Plataformas estáticas
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(100, 595, 'ground').setScale(1).refreshBody();
        
        // Plataformas móviles
        this.movingPlatforms = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        
        const platformData = [
            { x: 1100, y: 100, key: 'ground', scaleX: 1, moveX: 0, moveY: 510 },
            { x: 250, y: 355, key: 'ground2', scaleX: 0.8, moveX: 100, moveY: 0 },
            { x: 600, y: 50, key: 'ground2', scaleX: 1.2, moveX: 120, moveY: 0 }
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

    setupPlayer() {
        this.player = this.physics.add.sprite(100, 450, 'sprite1');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(false);
        this.cursors = this.input.keyboard.createCursorKeys();
        
        this.player.body.onWorldBounds = true;
        this.physics.world.on('worldbounds', body => {
            if (body.gameObject === this.player && body.y > this.game.config.height) {
                this.time.delayedCall(1000, () => this.handleFallDamage());
            }
        });
    }
    
    setupBoss() {
        this.boss = this.physics.add.sprite(400, 537, 'boss_0')
            .setCollideWorldBounds(true)
            .setDepth(1);
            
        this.boss.body.setSize(120, 180);
        this.boss.body.setOffset(30, 20);
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
        this.scoreText = this.add.text(16, 16, 'Score: 0', { 
            fontSize: '32px',
            fill: '#FFF',
            fontFamily: 'Mayan'
        });
        
        this.livesText = this.add.text(16, 60, `Lives: ${globalData.lives || 3}`, {
            fontSize: '32px',
            fill: '#FF3300'
        });
    }
    
    setupCollisions() {
        // Optimización: agrupar plataformas para reducir colisiones
        const allPlatforms = [this.platforms, this.movingPlatforms];
        
        this.physics.add.collider([this.player, this.bombs, this.boss, this.playerBombs, this.powerups], allPlatforms);
        
        this.physics.add.overlap(this.player, this.powerups, this.collectPowerup, null, this);
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
        
        this.physics.add.overlap(this.playerBombs, this.boss, (bomb, boss) => {
            if (!bomb.active || this.bossInvulnerable) return;
            
            this.damageBoss(50);
            bomb.destroy();
            
            this.bossInvulnerable = true;
            this.time.delayedCall(500, () => this.bossInvulnerable = false);
            
            this.boss.setTint(0xFF0000);
            this.time.delayedCall(100, () => this.boss.clearTint());
        });
    }
    
    // SISTEMAS DEL BOSS
    
    createBossAnimations() {
        // Animaciones del boss optimizadas
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
        
        // Gestión de ciclo de animaciones
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
        this.bossHealthBar.fillRect(100, 50, 400, 30);
        
        this.bossHealthBar.fillStyle(0xFF3300);
        const width = (this.bossHealth / 1000) * 400;
        this.bossHealthBar.fillRect(50, 50, width, 30);
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
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.time.delayedCall(1000, () => {
                this.scene.start('Victoria', {
                    score: this.score
                });
            });
        });
    }
    
    // JUGADOR Y CONTROLES
    
    animateWalk(start, end) {
        if (this.lastDirection !== `${start}-${end}`) {
            this.currentFrame = start;
            this.lastDirection = `${start}-${end}`;
        }
        
        if (this.frameDelay % 5 === 0) {
            this.currentFrame = Phaser.Math.Wrap(this.currentFrame + 1, start, end + 1);
            this.player.setTexture(`sprite${this.currentFrame}`);
        }
        this.frameDelay++;
    }
    
    animateJump(prefix, start, end) {
        if (this.frameDelay % 5 === 0) {
            this.jumpFrame = Phaser.Math.Wrap(
                prefix === "jump_D" ? this.jumpFrame - 1 : this.jumpFrame + 1,
                start, end + 1
            );
            this.player.setTexture(`${prefix}${this.jumpFrame}`);
        }
        this.frameDelay++;
    }
    
    throwBomb() {
        if (!this.canThrow) return;
        
        const bomb = this.playerBombs.create(
            this.player.x + (this.isFacingLeft ? -40 : 40),
            this.player.y - 30,
            this.isFacingLeft ? 'bomb_left' : 'bomb'
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
        
        globalData.lives--;
        this.livesText.setText(`Lives: ${globalData.lives}`);
        
        if (globalData.lives <= 0) {
            this.physics.pause();
            player.setTint(0xff0000);
            this.gameOver = true;
            this.time.delayedCall(1000, () => {
                this.scene.start('GameOver', { score: this.score });
            });
        } else {
            player.setPosition(100, 450);
            player.setVelocity(0, 0);
            player.clearTint();
        }
    }
    
    handleFallDamage() {
        if (this.gameOver) return;
        
        globalData.lives--;
        this.livesText.setText(`Lives: ${globalData.lives}`);
        
        this.cameras.main.shake(300, 0.02);
        this.player.setVelocity(0, 0);
        
        if (globalData.lives <= 0) {
            this.gameOver = true;
            this.time.delayedCall(1000, () => {
                this.scene.start('GameOver', { score: this.score });
            });
        } else {
            this.player.setPosition(100, 450);
            this.time.delayedCall(500, () => {
                this.player.clearTint();
            });
        }
    }
    
    collectPowerup(player, powerup) {
        powerup.destroy();
        this.isPowerUpActive = true;
        this.isInvincible = true;
        
        player.setTint(0x00FF00);
        this.playerSpeed *= 1.5;
        
        this.powerUpTime = this.time.now + 10000;
    }
    
    update() {
        if (this.gameOver) return;
        
        const { left, right, up } = this.cursors;
        const isGrounded = this.player.body.touching.down;
        
        // Control del jugador
        this.player.setVelocityX(0);
        
        if (left.isDown) {
            this.player.setVelocityX(-this.playerSpeed);
            this.player.setFlipX(true);
            this.animateWalk(0, 12);
            this.isFacingLeft = true;
        } else if (right.isDown) {
            this.player.setVelocityX(this.playerSpeed);
            this.player.setFlipX(false);
            this.animateWalk(16, 25);
            this.isFacingLeft = false;
        } else {
            this.player.setTexture(this.lastDirection.startsWith('0-12') ? 'sprite12' : 'sprite16');
        }
        
        if (up.isDown && isGrounded) {
            this.player.setVelocityY(this.jumpForce);
            this.animateJump(left.isDown ? "jump_D" : "jump_i", 0, 12);
        }
        
        // Controles especiales
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.throwBomb();
        }
        
        // Caída
        if (this.player.y > 700) {
            this.handleFallDamage();
        }
        
        // Boss updates
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