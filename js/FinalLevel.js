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
        this.lastDirection = '';
    }

    preload() {
        // Cargar assets base

        
        this.load.image('xibalba_bg', 'assets/a.webp');
        this.load.image('ground', 'assets/piso.png');
        this.load.image('ground2', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');

        // Cargar sprites del jugador
        for (let i = 0; i <= 25; i++) {
            this.load.image(`sprite${i}`, `assets/sprites/sprite (${i}).png`);
        }

        // Cargar sprites de salto
        for (let i = 0; i <= 12; i++) {
            this.load.image(`jump_i${i}`, `assets/jump/jump_i (${i}).png`);
            this.load.image(`jump_D${i}`, `assets/jump/jump_D (${i}).png`);
        }



 for (let i = 0; i <= 18; i++) {
        this.load.image(`boss_${i}`, `assets/sprites/boss/${i}.webp`);
    }
		

		this.load.on('filecomplete', (key) => {
			console.log(`🔥 Asset cargado: ${key}`);
		});



		
    }//preload


    create() {

    this.input.once('pointerdown', () => {
        if (this.sound.context.state === 'suspended') {
            this.sound.context.resume();
        }
    });

		
        // Configuración inicial
        this.score = 0;
        this.gameOver = false;


       
    
        // Fondo y texto
        this.add.image(510, 300, 'xibalba_bg');
        this.add.text(300, 50, 'XIBALBÁ: EL INFIERNO MAYA', {
            fontSize: '32px',
            fill: '#FF3300'
        });

        // Plataformas
        this.setupPlatforms();
        
        // Jugador
        this.setupPlayer();
        
        // Objetos
        this.setupStars();
        this.setupBombs();
        
        // Jefe
        this.setupBoss();
        
        // Colisiones
        this.setupCollisions();
        
        // Interfaz
        this.setupScore();
        
        this.createBossHealthBar();
        
        // Animaciones del jefe
        this.createBossAnimations();

        
 this.anims.create({
        key: 'boss_entrance',
        frames: [
            { key: 'boss_0' },
            { key: 'boss_1' },
            // ... añade todos los frames hasta 31
            { key: 'boss_31' }
        ],
        frameRate: 10,
        repeat: 0
    });

    // Evento al terminar la animación
    this.boss.on('animationcomplete', () => {
        console.log('¡El jefe ha aparecido!');
        // Aquí puedes iniciar su comportamiento normal
    });

console.log('Texturas del jugador:', this.textures.get('sprite0'));
    console.log('Texturas del boss:', this.textures.get('boss_0'));

        
    }//create



   setupPlatforms() {
    this.platforms = this.physics.add.staticGroup();
    
    const platformsData = [
        {x: 400, y: 595, key: 'ground', scale: 1},
        {x: 720, y: 500, key: 'ground2'},
        {x: 8, y: 380, key: 'ground2'},
        {x: 720, y: 380, key: 'ground2'},
        {x: 73, y: 500, key: 'ground2'}
    ];

    platformsData.forEach(data => {
        const platform = this.platforms.create(data.x, data.y, data.key);
        if (data.scale) platform.setScale(data.scale).refreshBody();
        // Habilitar cuerpo físico y hacer inamovible
        platform.enableBody = true;
        platform.body.immovable = true;
    });
}

    setupPlayer() {
        this.player = this.physics.add.sprite(100, 450, 'sprite0');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        
        this.cursors = this.input.keyboard.createCursorKeys();

 this.player.body.onWorldBounds = true;
    this.player.body.world.on('worldbounds', () => {
        console.log('¡El jugador está chocando con los límites!');
    });
        
        // Variables de animación
        this.currentFrame = 0;
        this.jumpFrame = 0;
        this.frameDelay = 0;

		console.log(this.textures.exists('sprite0')); // Debe ser true

       
    }//setupPlayer

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

setupBoss() {
    // Crear sprite con físicas
    this.boss = this.physics.add.sprite(400, 300, 'boss_0')
        .setCollideWorldBounds(true)
        .setDepth(1);

    // Ajustar tamaño del cuerpo de colisión (ancho, alto)
    this.boss.body.setSize(120, 180);
    
    // Opcional: Ajustar offset si es necesario
    // this.boss.body.offset.set(60, 90);
    
    // Deshabilitar físicas inicialmente
    this.boss.body.enable = false;
}


createBossAnimations() {
    // Animación de aparición (hasta frame 28)
    this.anims.create({
        key: 'boss_entrance',
        frames: Array.from({length: 12}, (_, i) => ({ key: `boss_${i}` })), // 0-11
        frameRate: 10,
        repeat: 0
    });

    // Animación de reposo (idle) usando frames 20-28
    this.anims.create({
        key: 'boss_idle',
        frames: Array.from({length: 7}, (_, i) => ({ key: `boss_${i + 12}` })), // 12-18
        frameRate: 8,
        repeat: -1
    });

    // Animación de ataque (ajustar según tus frames disponibles)
    this.anims.create({
        key: 'boss_attack',
        frames: Array.from({length: 6}, (_, i) => ({ key: `boss_${i + 10}` })), // 10-15
        frameRate: 12,
        repeat: 0
    });

    this.boss.on('animationcomplete', (anim) => {
        if (anim.key === 'boss_entrance') {
            this.boss.body.enable = true;
            this.boss.play('boss_idle'); // Cambia a animación idle
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
        
        // Fondo
        this.bossHealthBar.fillStyle(0x444444);
        this.bossHealthBar.fillRect(50, 50, 400, 30);
        
        // Salud actual
        this.bossHealthBar.fillStyle(0xFF3300);
        const width = (this.bossHealth / 1000) * 400;
        this.bossHealthBar.fillRect(50, 50, width, 30);
    }

 setupCollisions() {
    // Colisiones básicas
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.collider(this.bombs, this.platforms);
    
    // Colisiones con el jefe
    this.physics.add.collider(this.boss, this.platforms); // ¡Nuevo! Para que el jefe no caiga
    
    // Overlaps con objetos
    this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
    this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
    
    // Colisión bombas-jefe
    this.physics.add.overlap(this.bombs, this.boss, (bomb, boss) => {
        bomb.disableBody(true, true);
        this.damageBoss(25);
    });
}


damageBoss(amount) {
    this.bossHealth -= amount;
    this.updateBossHealthBar();
    
    // Efectos visuales
    this.boss.play('boss_attack');
    this.cameras.main.shake(50, 0.01);
    
    // Destello de daño
    this.boss.setTint(0xFF0000);
    this.time.delayedCall(100, () => this.boss.clearTint());
    
    this.checkBossPhase();
}


    checkBossPhase() {
        if (this.bossHealth <= 0) {
            this.defeatBoss();
        } else if (this.bossHealth <= 300 && !this.isEnraged) {
            this.startEnragedPhase();
        } else if (this.bossHealth <= 600 && this.currentPhase === 1) {
            this.startPhaseTwo();
        }
    }

    startPhaseTwo() {
        this.currentPhase = 2;
        this.boss.setVelocityX(100);
        
        this.time.addEvent({
            delay: 2000,
            callback: () => {
                const bomb = this.bombs.create(this.boss.x, this.boss.y, 'bomb');
                bomb.setVelocity(Phaser.Math.Between(-200, 200), -200);
            },
            loop: true
        });
    }

    startEnragedPhase() {
        this.isEnraged = true;
        this.boss.setTint(0xFF0000);
        
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                const star = this.stars.create(this.boss.x, this.boss.y, 'star');
                star.setVelocity(Phaser.Math.Between(-300, 300), Phaser.Math.Between(-300, 300));
            },
            loop: true
        });
    }


    update() {

    if (this.gameOver) return;

    const { left, right, up } = this.cursors;
    const player = this.player;
    const isGrounded = player.body.touching.down;

    player.setVelocityX(0);

    // Movimiento izquierda
    if (left.isDown) {
        player.setVelocityX(-this.playerSpeed);
        player.setFlipX(false);  // ¡Nuevo! Voltea el sprite
        this.animateWalk(0, 12);
    } 
    // Movimiento derecha
    else if (right.isDown) {
        player.setVelocityX(this.playerSpeed);
        player.setFlipX(false); // ¡Nuevo! Restaura orientación
        this.animateWalk(16, 25);
    } 
    // Idle
    else {
        // Mantener última dirección
        player.setTexture(this.lastDirection.startsWith('0-12') ? 'sprite12' : 'sprite16');
    }

    // Salto
    if (up.isDown && isGrounded) {
        player.setVelocityY(this.jumpForce);
        this.handleJumpAnimation(left.isDown, right.isDown);
    }

    // Comportamiento del jefe en fase 2
    if (this.currentPhase === 2) {
        this.boss.x += Math.sin(this.time.now * 0.002) * 2.5;
    }
    
    // Comportamiento del jefe enfurecido
    if (this.isEnraged) {
        this.boss.rotation += 0.02; // Efecto visual de enfurecimiento
    }
}

    handlePlayerMovement() {
        const isGrounded = this.player.body.touching.down;
        const isJumping = this.cursors.up.isDown && isGrounded;
        const isMovingRight = this.cursors.right.isDown;
        const isMovingLeft = this.cursors.left.isDown;

        if (isJumping) {
            this.player.setVelocityY(this.jumpForce);
        }

        if (isJumping && isMovingRight) {
            this.animateJump("jump_i", 0, 12);
        } else if (isJumping && isMovingLeft) {
            this.animateJump("jump_D", 0, 12);
        } else if (isMovingLeft) {
            this.player.setVelocityX(-this.playerSpeed);
            this.animateWalk(0, 12);
        } else if (isMovingRight) {
            this.player.setVelocityX(this.playerSpeed);
            this.animateWalk(16, 25);
        } else {
            this.player.setVelocityX(0);
            this.player.setTexture('sprite12');
        }
    }

animateWalk(start, end) {
    // Reiniciar el contador si cambia de dirección
    if (this.lastDirection !== `${start}-${end}`) {
        this.currentFrame = start;
        this.lastDirection = `${start}-${end}`;
    }

    // Avanzar frames cada 5 updates (ajusta este valor para velocidad)
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
            start,
            end + 1
        );
        console.log(`Saltando - Frame: ${prefix}${this.jumpFrame}`); // Debug
        this.player.setTexture(`${prefix}${this.jumpFrame}`);
    }
    this.frameDelay++;
}

    collectStar(player, star) {
        star.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText(`Score: ${this.score}`);

        if (this.stars.countActive(true) === 0) {
            this.resetStars();
            this.spawnBomb();
        }
    }

    resetStars() {
        this.stars.children.iterate(child => {
            child.enableBody(true, child.x, 0, true, true);
        });
    }

    spawnBomb() {
        const x = this.player.x < 400 
            ? Phaser.Math.Between(400, 800) 
            : Phaser.Math.Between(0, 400);
        
        const bomb = this.bombs.create(x, 16, 'bomb');
        bomb.setBounce(1).setVelocity(Phaser.Math.Between(-200, 200), 20);
    }

    hitBomb(player, bomb) {
        this.physics.pause();
        player.setTint(0xff0000);
        this.gameOver = true;
    }

defeatBoss() {
    this.physics.pause();
    this.boss.play('boss_death');
    
    // Efecto de victoria
    this.time.delayedCall(2000, () => {
        this.cameras.main.fadeOut(1000, 0, 0, 0, (_, progress) => {
            if (progress === 1) {
                this.scene.start('Victoria', { 
                    score: this.score,
                    level: 'FinalLevel'
                });
            }
        });
    });
}


	setupScore() {
    this.scoreText = this.add.text(16, 16, 'Score: 0', { 
        fontSize: '32px', 
        fill: '#FFF', // Cambié el color a blanco para que combine con Xibalba
        fontFamily: 'Mayan' // Usa la fuente maya que cargaste
    });
	}



 handleJumpAnimation(isMovingLeft, isMovingRight) {
    if (isMovingLeft) {
        this.animateJump("jump_D", 0, 12);
    } else if (isMovingRight) {
        this.animateJump("jump_i", 0, 12);
    }
} 
}

// Hacer disponible la clase globalmente
window.FinalLevel = FinalLevel;
