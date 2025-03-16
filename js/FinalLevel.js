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
		this.bossInvulnerable = false;
		this.isPowerUpActive = false;
    	this.powerUpTime = 0;
    }

    preload() {
    
        // Cargar assets base

        
        this.load.image('xibalba_bg', 'assets/a.jpeg');
        this.load.image('ground', 'assets/piso2.png');
        this.load.image('ground2', 'assets/piso.webp');
        this.load.image('bomb', 'assets/bomb.png');
       	this.load.image('powerup', 'assets/powerup.png'); // Asegúrate de tener esta imagen

        // Cargar sprites del jugador
        for (let i = 1; i <= 25; i++) {
            this.load.image(`sprite${i}`, `assets/caminarp1/caminar(${i}).png`);
        }


        // Cargar sprites de salto
        for (let i = 0; i <= 12; i++) {
            this.load.image(`jump_i${i}`, `assets/caminarp1/saltoi(${i}).png`);
            this.load.image(`jump_D${i}`, `assets/caminarp1/saltod(${i}).png`);
        }


	 for (let i = 0; i < 19; i++) {
        this.load.image(`boss_${i}`, `assets/caminarp1/boss/${i}.webp`);
    }
    

   	for (let i = 0; i < 19; i++) {
   		this.load.image(`boss_${i}`, `assets/caminarp1/boss/${i}.png`);
    }
		

		this.load.on('filecomplete', (key) => {
			console.log(`🔥 Asset cargado: ${key}`);
		});

		this.load.on('loaderror', (file) => {
				console.error(`Error cargando: ${file.key}`);
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
        this.add.image(400, 330, 'xibalba_bg');

        // Plataformas
        this.setupPlatforms();
        
        // Jugador
        this.setupPlayer();
        
        // Objetos
        this.setupBombs();
        
        // Jefe
        this.setupBoss();
        
   		this.powerups = this.physics.add.group();
   		this.setupPowerups();
        // Colisiones
        this.setupCollisions();
        
        // Interfaz
        this.setupScore();
        
        this.createBossHealthBar();
        
        // Animaciones del jefe
        this.createBossAnimations();

        

 

console.log('Texturas del jugador:', this.textures.get('sprite0'));
    console.log('Texturas del boss:', this.textures.get('boss_0'));

        
    }//create



setupPlatforms() {
    // Grupo de plataformas fijas (estáticas)
    this.platforms = this.physics.add.staticGroup();

    // Suelo fijo
    this.platforms.create(100, 595, 'ground').setScale(1).refreshBody();

    // Grupo de plataformas móviles (dinámicas)
    this.movingPlatforms = this.physics.add.group({
        allowGravity: false,
        immovable: true  // Para que no sean afectadas por el jugador
    });

    // Plataformas móviles con diferentes tamaños y movimientos
    const movingPlatformsData = [
        { x: 1100, y: 100, key: 'ground', scaleX: 1, moveX: 0, moveY: 510 }, //elevador
        { x: 250, y: 355, key: 'ground2', scaleX: 0.8, moveX: 100, moveY: 0 }, // Vertical
        { x: 600, y: 50, key: 'ground2', scaleX: 1.2, moveX: 120, moveY: 0 }, // Otra vertical
    ];

    movingPlatformsData.forEach(data => {
        const platform = this.movingPlatforms.create(data.x, data.y, data.key);
        platform.setScale(data.scaleX, 1);
        platform.setImmovable(true); // No se mueve por colisiones

        // Animación del movimiento
        this.tweens.add({
            targets: platform,
            x: platform.x + data.moveX,  // Movimiento horizontal
            y: platform.y + data.moveY,  // Movimiento vertical
            ease: 'Linear',
            duration: 13000,
            yoyo: true,
            repeat: -1
        });
    });
}//plataforms

    setupPlayer() {
        this.player = this.physics.add.sprite(100, 450, 'sprite0');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(false);
        
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



    setupBombs() {
        this.bombs = this.physics.add.group();
        
        // Evento para generar bombas cada 5 segundos
        this.time.addEvent({
            delay: 5000, // 5000 ms = 5 segundos
            callback: () => {
                // Generar en posición aleatoria en el área visible (ajustar según tu tamaño de juego)
                const x = Phaser.Math.Between(50, 750);
                const y = 16; // Parte superior
                
                // Crear bomba con física
                const bomb = this.bombs.create(x, y, 'bomb');
                bomb.setBounce(1);
                bomb.setCollideWorldBounds(true);
                
                // Velocidad aleatoria en X y Y
                bomb.setVelocity(
                    Phaser.Math.Between(-200, 200), // Velocidad horizontal
                    Phaser.Math.Between(50, 200) // Velocidad vertical (hacia abajo)
                );
                
                // Añadir efecto de rotación
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

setupBoss() {
	
	
    // Crear sprite con físicas
    this.boss = this.physics.add.sprite(400, 537, 'boss_0')
        .setCollideWorldBounds(true)
        .setDepth(1);

    // Ajustar tamaño del cuerpo de colisión (ancho, alto)
    this.boss.body.setSize(120, 180);
    
    // Deshabilitar físicas inicialmente
    this.boss.body.enable = false;
}


createBossAnimations() {
    // Animación de aparición (usando frames 0-11)
    this.anims.create({
        key: 'boss_entrance',
        frames: Array.from({length: 12}, (_, i) => ({ key: `boss_${i}` })),
        frameRate: 10,
        repeat: 0
    });

    // Animación idle (frames 12-18)
    this.anims.create({
        key: 'boss_idle',
        frames: Array.from({length: 7}, (_, i) => ({ key: `boss_${i + 12}` })),
        frameRate: 8,
        repeat: -1
    });

    // Animación de ataque (frames 7-11)
    this.anims.create({
        key: 'boss_attack',
        frames: Array.from({length: 5}, (_, i) => ({ key: `boss_${i + 7}` })),
        frameRate: 12,
        repeat: 0
    });


  this.anims.create({
        key: 'boss_death',
        frames: Array.from({length: 12}, (_, i) => ({ 
            key: `boss_${11 - i}` // Invertimos el orden (11-0)
        })),
        frameRate: 10,
        repeat: 0
    });


  // Cuando termina la animación de entrada, elevamos el jefe hasta su posición final
    this.boss.on('animationcomplete', (anim) => {
        if (anim.key === 'boss_entrance') {
            // Tween para elevar al jefe (de groundY a 300, por ejemplo)
            this.tweens.add({
                targets: this.boss,
                y: 300, // posición final deseada
                ease: 'Power2',
                duration: 3000,
                onComplete: () => {
                    
                    this.boss.play('boss_idle');
                }
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
        
        // Fondo
        this.bossHealthBar.fillStyle(0x444444);
        this.bossHealthBar.fillRect(50, 50, 400, 30);
        
        // Salud actual
        this.bossHealthBar.fillStyle(0xFF3300);
        const width = (this.bossHealth / 1000) * 400;
        this.bossHealthBar.fillRect(50, 50, width, 30);
    }

setupCollisions() {

	this.physics.add.collider(this.player, this.movingPlatforms);
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.bombs, this.movingPlatforms);
    this.physics.add.collider(this.bombs, this.platforms);
    this.physics.add.collider(this.boss, this.platforms);

    
    this.physics.add.overlap(this.player, this.powerups, this.collectPowerup, null, this);
    this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);

     this.physics.add.collider(this.powerups, this.platforms);
    this.physics.add.collider(this.powerups, this.movingPlatforms);

    this.physics.add.overlap(this.bombs, this.boss, (bomb, boss) => {
        if (this.bossInvulnerable || !boss.active) return;

            bomb.disableBody(true, true); // ¡Falta esta línea!
        this.cameras.main.shake(500, 0.02)
        this.damageBoss(25);
        
        // Activar invulnerabilidad CORRECTAMENTE
        this.bossInvulnerable = true;
        this.time.delayedCall(500, () => this.bossInvulnerable = false);
    });
}




damageBoss(amount) {
    if (this.gameOver || this.bossHealth <= 0 || this.bossInvulnerable) return;
    
    // Aplicar daño seguro
    this.bossHealth = Math.max(0, this.bossHealth - Math.min(amount, this.bossHealth));
    this.updateBossHealthBar();
    
    console.log(`Daño: ${amount} | Salud: ${this.bossHealth}`); // Debug
    
    // Efectos visuales sin cambiar animación principal
    this.boss.setTint(0xFF0000);
    this.time.delayedCall(100, () => this.boss.clearTint());
    
    this.checkBossPhase();
}


checkBossPhase() {
    // Verificar si ya está derrotado
    if (this.bossHealth <= 0) {
        if (!this.gameOver) {
            // Forzar salud a 0 para evitar valores negativos
            this.bossHealth = 0;
            this.defeatBoss();
        }
        return;
    }

    // Fase 2 (600 de vida)
    if (this.bossHealth <= 600 && this.currentPhase === 1) {
        this.currentPhase = 2;
        console.log('¡Fase 2 activada!');
        this.startPhaseTwo();
    }

    // Fase enfurecida (300 de vida)
    if (this.bossHealth <= 300 && !this.isEnraged) {
        this.isEnraged = true;
        console.log('¡Fase enfurecida activada!');
        this.startEnragedPhase();
    }
    
    console.log(`FASE: ${this.currentPhase} | SALUD: ${this.bossHealth} | ENFURECIDO: ${this.isEnraged}`);
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


  if(this.isPowerUpActive && this.time.now > this.powerUpTime) {
        this.isPowerUpActive = false;
        this.isInvincible = false; // Desactivar invencibilidad
        this.player.clearTint();
        this.playerSpeed = 160;
    }

this.physics.world.on('worldbounds', (body) => {
    if (body.gameObject === this.player) {
        // Si el jugador se sale por abajo, esperar antes de terminar el juego
        this.time.delayedCall(1000, () => {  // Esperar 2 segundos
            this.gameOver();
        });
    }
});

if (this.player.y > 700) {
        this.handleFallDamage();
    }
   
           console.log('Estado del jefe:',
    `Visible: ${this.boss.visible}`,
    `Salud: ${this.bossHealth}`,
    `Animación: ${this.boss.anims.currentAnim?.key}`
);
}//update

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


    spawnBomb() {
        const x = this.player.x < 400 
            ? Phaser.Math.Between(400, 800) 
            : Phaser.Math.Between(0, 400);
        
        const bomb = this.bombs.create(x, 16, 'bomb');
        bomb.setBounce(1).setVelocity(Phaser.Math.Between(-200, 200), 20);
    }

hitBomb(player, bomb) {
    if (this.gameOver || this.isInvincible) { // Añade condición de invencibilidad
        bomb.disableBody(true, true);
        return; // Salir sin aplicar daño
    }
    
    // Resto del código original para cuando NO es invencible
    globalData.lives--;
    this.livesText.setText(`Lives: ${globalData.lives}`);
    
    if (globalData.lives <= 0) {
        this.physics.pause();
        player.setTint(0xff0000);
        this.gameOver = true;
        this.showGameOver();
    } else {
        player.setPosition(100, 450);
        player.setVelocity(0, 0);
        player.clearTint();
    }
}

defeatBoss() {
    console.log('¡Jefe derrotado!');
    this.gameOver = true;
    
    // Solo detener movimientos
    this.boss.body.setVelocity(0);
    
    // Animación de muerte
    this.boss.play('boss_death');
    
    // Efecto visual
    this.boss.setTint(0xFF0000);
    
    this.time.delayedCall(2000, () => {
        this.cameras.main.fadeOut(1000, 0, 0, 0);
    });
}


	setupScore() {
    this.scoreText = this.add.text(16, 16, 'Score: 0', { 
        fontSize: '32px', 
        fill: '#FFF', // Cambié el color a blanco para que combine con Xibalba
        fontFamily: 'Mayan'
    });

			this.livesText = this.add.text(16, 60, `Lives: ${globalData.lives}`,  {
			fontSize: '32px',
			fill: '#FF3300'
    });
    
	}//setupScore



		handleJumpAnimation(isMovingLeft, isMovingRight) {
			if (isMovingLeft)	{	this.animateJump("jump_D", 0, 12);
			}else if (isMovingRight) {	this.animateJump("jump_i", 0, 12);	}
		}

	handleFallDamage() {
    if (this.gameOver) return;
    
    globalData.lives--;
    this.livesText.setText(`Lives: ${globalData.lives}`);
    
    // Efectos de caída
    this.cameras.main.shake(300, 0.02);
    this.player.setVelocity(0, 0);
    
    if (globalData.lives <= 0) {
        this.gameOver = true;
        this.showGameOver();
    } else {
        // Respawn seguro
        this.player.setPosition(100, 450);
        this.time.delayedCall(500, () => {
            this.player.clearTint();
        });
    }
}


setupPowerups() {
    // Generar power-up cada 10-15 segundos
    this.time.addEvent({
        delay: Phaser.Math.Between(10000, 15000),
        callback: () => {
            const platform = Phaser.Math.RND.pick([
                ...this.platforms.getChildren(), 
                ...this.movingPlatforms.getChildren()
            ]);
            
            const powerup = this.powerups.create(platform.x, platform.y - 30, 'powerup');
            
            // Ajustar el tamaño aquí
            powerup.setScale(0.05)
            powerup.body.setSize(
                powerup.width * 0.5, // Ancho ajustado
                powerup.height * 0.5 // Alto ajustado
            );
            
            powerup.body.setAllowGravity(false);
            powerup.body.setImmovable(true);
            
            // Si la plataforma es móvil
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
        loop: true
    });
}


collectPowerup(player, powerup) {
    powerup.destroy();
    this.isPowerUpActive = true;
    this.isInvincible = true; // Activar invencibilidad
    
    // Efectos visuales
    player.setTint(0x00FF00); // Tinte verde
    this.playerSpeed *= 1.5;
    
    // Temporizador para duración del powerup
    this.powerUpTime = this.time.now + 10000; // 10 segundos
    
    // Sonido opcional
    // this.sound.play('powerup_sound');
}




}//clase

// Hacer disponible la clase globalmente
window.FinalLevel = FinalLevel;
