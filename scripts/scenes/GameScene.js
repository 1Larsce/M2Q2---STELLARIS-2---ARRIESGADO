class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.video('bg2', 'assets/background/bg2.mp4', 'loadeddata', false, true);
        this.load.spritesheet('player', 'assets/player/player.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('enemy1', 'assets/player/enemy1.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('enemy1destroy', 'assets/player/enemy1destroy.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('enemy2', 'assets/player/enemy2.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('enemy2destroy', 'assets/player/enemy2destroy.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('projectile', 'assets/player/projectile.png', { frameWidth: 9, frameHeight: 9 });
        this.load.audio('mainbgm', 'assets/audio/mainbgm.mp3');
        this.load.audio('blaster', 'assets/audio/blaster.mp3');
        this.load.audio('deathSound', 'assets/audio/deathSound.wav');
        this.load.audio('move', 'assets/audio/move.mp3');
        this.load.audio('idle', 'assets/audio/idle.mp3');
        this.load.audio('event', 'assets/audio/event.mp3');

        // Create a particle texture
        const graphics = this.add.graphics();
        graphics.fillStyle(0xffffff, 1);
        graphics.fillRect(0, 0, 2, 2);
        graphics.generateTexture('particle', 2, 2);
        graphics.destroy();
    }

    create() {
        // Add video background
        let bgVideo = this.add.video(270, 480, 'bg2');
        bgVideo.play(true);
        bgVideo.setDepth(-1);

        this.mainbgm = this.sound.add('mainbgm', { volume: 0.5, loop: true });
        this.mainbgm.play();

        this.moveSound = this.sound.add('move');
        this.idleSound = this.sound.add('idle');

        this.player = this.physics.add.sprite(270, 800, 'player');
        this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'player_idle',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 8 }),
            frameRate: 24,
            repeat: -1
        });

        this.anims.create({
            key: 'enemy1_move',
            frames: this.anims.generateFrameNumbers('enemy1', { start: 0, end: 5 }),
            frameRate: 24,
            repeat: -1
        });

        this.anims.create({
            key: 'enemy1_destroy',
            frames: this.anims.generateFrameNumbers('enemy1destroy', { start: 0, end: 15 }),
            frameRate: 24,
            repeat: 0
        });

        this.anims.create({
            key: 'enemy2_move',
            frames: this.anims.generateFrameNumbers('enemy2', { start: 0, end: 5 }),
            frameRate: 24,
            repeat: -1
        });

        this.anims.create({
            key: 'enemy2_destroy',
            frames: this.anims.generateFrameNumbers('enemy2destroy', { start: 0, end: 15 }),
            frameRate: 24,
            repeat: 0
        });

        this.anims.create({
            key: 'projectile_anim',
            frames: this.anims.generateFrameNumbers('projectile', { start: 0, end: 4 }),
            frameRate: 24,
            repeat: -1
        });

        this.player.play('player_idle');

        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        this.projectiles = this.physics.add.group();

        this.enemies = this.physics.add.group();
        this.wave = 1;

        // Define enemy movements
        this.enemyMovements = ['straight', 'zigzag', 'wave'];

        this.createEnemies();

        this.physics.add.collider(this.projectiles, this.enemies, this.hitEnemy, null, this);
        this.physics.add.collider(this.player, this.enemies, this.playerHit, null, this);

        this.score = 0;
        this.hp = 100;
        this.projectileLevel = 1;
        
        this.isMoving = false;

        this.scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '20px', fill: '#ff0', fontFamily: 'Arial' });
        this.hpText = this.add.text(10, 40, 'HP: 100%', { fontSize: '20px', fill: '#ff0', fontFamily: 'Arial' });
        this.waveText = this.add.text(270, 480, 'Wave 1', { fontSize: '40px', fill: '#ff0', fontFamily: 'Arial' }).setOrigin(0.5);
        this.fadeInOut(this.waveText);

        // Add stars in the background
        this.addStarfield();
    }

    update() {
        this.player.setVelocity(0);
        let moving = false;

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
            moving = true;
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200);
            moving = true;
        }
        
        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-200);
            moving = true;
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(200);
            moving = true;
        }
        
        if (Phaser.Input.Keyboard.JustDown(this.spaceBar)) {
            this.shootProjectile();
        }

        if (moving) {
            if (!this.isMoving) {
                this.moveSound.play();
                this.idleSound.stop();
                this.isMoving = true;
            }
        } else {
            if (this.isMoving) {
                this.moveSound.stop();
                this.idleSound.play();
                this.isMoving = false;
            }
        }

        if (this.enemies.countActive(true) === 0) {
            this.wave++;
            this.waveText.setText('Wave ' + this.wave);
            this.fadeInOut(this.waveText);
            this.createEnemies();
            if (this.wave % 5 === 0) {
                this.sound.play('event');
            }
        }

        this.enemies.children.iterate(enemy => {
            if (enemy && enemy.y > this.sys.game.config.height) {
                enemy.destroy();
                this.score -= 10;
                this.scoreText.setText('Score: ' + this.score);
            }
        });
    }

    createEnemies() {
        let rows = 5;
        let cols = 5;
        let enemyCount = rows * cols;
        let startX = (this.sys.game.config.width - (cols - 1) * 80) / 2;
        let startY = -200;
        let spacingX = 80;
        let spacingY = 80;
        let hpAssigned = false;
        for (let i = 0; i < enemyCount; i++) {
            let enemyType = Phaser.Math.Between(1, 2) === 1 ? 'enemy1' : 'enemy2';
            let enemy = this.enemies.create(startX + (i % cols) * spacingX, startY + Math.floor(i / cols) * spacingY, enemyType);
            enemy.play(enemyType + '_move');

            // Randomly assign +HP to some enemies, 60% chance per wave
            if (!hpAssigned && Phaser.Math.Between(0, 100) < 60) {
                enemy.hasHP = true;
                enemy.hpText = this.add.text(enemy.x, enemy.y - 30, '+HP', { fontSize: '20px', fill: '#ff0', fontFamily: 'Arial' }).setOrigin(0.5);
                enemy.hpText.setDepth(1);
                enemy.update = () => {
                    if (enemy.hpText) {
                        enemy.hpText.setPosition(enemy.x, enemy.y - 30);
                    }
                }
                hpAssigned = true;
            }

            this.setEnemyMovement(enemy, this.enemyMovements[Phaser.Math.Between(0, this.enemyMovements.length - 1)]);
        }
    }

    setEnemyMovement(enemy, type) {
        switch (type) {
            case 'straight':
                enemy.setVelocityY(50 + this.wave * 10);
                break;
            case 'zigzag':
                enemy.direction = Phaser.Math.Between(0, 1) ? 'left' : 'right';
                enemy.setVelocityY(50 + this.wave * 10);
                this.time.addEvent({
                    delay: 500,
                    callback: () => {
                        if (enemy && enemy.active) {
                            if (enemy.direction === 'left') {
                                enemy.setVelocityX(-100);
                                enemy.direction = 'right';
                            } else {
                                enemy.setVelocityX(100);
                                enemy.direction = 'left';
                            }
                        }
                    },
                    loop: true
                });
                break;
            case 'wave':
                enemy.setVelocityY(50 + this.wave * 10);
                this.tweens.add({
                    targets: enemy,
                    x: enemy.x + Phaser.Math.Between(-100, 100),
                    duration: 1000,
                    ease: 'Sine.easeInOut',
                    yoyo: true,
                    repeat: -1
                });
                break;
        }
    }

    hitEnemy(projectile, enemy) {
        projectile.destroy();
        enemy.play(enemy.texture.key + '_destroy');
        this.createEmitter(enemy.x, enemy.y);
        this.time.delayedCall(500, () => {
            enemy.destroy();
            if (enemy.hasHP && enemy.hpText) {
                enemy.hpText.destroy();
            }
        });
        this.sound.play('blaster');

        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);

        if (this.score % 500 === 0 && this.projectileLevel < 5) {
            this.projectileLevel++;
        }

        if (enemy.hasHP) {
            this.hp += 10;
            if (this.hp > 100) this.hp = 100;
            this.hpText.setText('HP: ' + this.hp + '%');
            this.displayHPGain();
        }
    }

    playerHit(player, enemy) {
        enemy.destroy();
        this.sound.play('deathSound');

        this.hp -= 10;
        this.hpText.setText('HP: ' + this.hp + '%');
        this.projectileLevel = 1;

        if (this.hp <= 0) {
            this.mainbgm.stop();
            this.scene.start('GameOverScene', { score: this.score, wave: this.wave });
        }
    }

    shootProjectile() {
        for (let i = 0; i < this.projectileLevel; i++) {
            let projectile = this.projectiles.create(this.player.x - (i * 10) + ((this.projectileLevel - 1) * 5), this.player.y - 50, 'projectile');
            projectile.setVelocityY(-200);
            projectile.play('projectile_anim');
            projectile.setScale(2);  // Increase the size of the projectile
        }
        this.sound.play('blaster');
    }

    fadeInOut(text) {
        this.tweens.add({
            targets: text,
            alpha: { from: 0, to: 1 },
            duration: 500,
            yoyo: true,
            repeat: 0
        });
    }

    createEmitter(x, y) {
        let particles = this.add.particles('particle');

        let emitter = particles.createEmitter({
            x: x,
            y: y,
            speed: { min: -200, max: 200 },
            scale: { start: 0.5, end: 0 }, // Reduce the size of particles
            lifespan: 500,
            tint: [0x0000ff, 0xffff00], // Change the color of particles to blue and yellow
            blendMode: 'ADD'
        });

        this.time.delayedCall(500, () => {
            emitter.stop();
        });
    }

    addStarfield() {
        for (let i = 0; i < 100; i++) {
            let star = this.add.circle(Phaser.Math.Between(0, this.sys.game.config.width), Phaser.Math.Between(0, this.sys.game.config.height), 2, 0xffffff);
            this.tweens.add({
                targets: star,
                y: this.sys.game.config.height,
                duration: Phaser.Math.Between(2000, 4000),
                ease: 'Linear',
                repeat: -1,
                yoyo: false,
                delay: Phaser.Math.Between(0, 2000)
            });
        }
    }

    displayHPGain() {
        let hpGainText = this.add.text(this.player.x, this.player.y - 50, '+10 HP', { fontSize: '20px', fill: '#ff0', fontFamily: 'Arial' }).setOrigin(0.5);
        this.tweens.add({
            targets: hpGainText,
            y: this.player.y - 100,
            alpha: { from: 1, to: 0 },
            duration: 1000,
            onComplete: () => {
                hpGainText.destroy();
            }
        });
        
    }

    fadeIn() {
        this.cameras.main.fadeIn(2000, 0, 0, 0);
    }
}
