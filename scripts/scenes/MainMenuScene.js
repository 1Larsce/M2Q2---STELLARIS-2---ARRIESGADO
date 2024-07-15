class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    preload() {
        this.load.image('title', 'assets/misc/title.png');
        this.load.video('bg2', 'assets/background/bg2.mp4', 'loadeddata', false, true);
        this.load.audio('mainbgm', 'assets/audio/mainbgm.mp3');
        this.load.audio('select', 'assets/audio/select.mp3');
        this.load.image('uiStart', 'assets/misc/uiStart.png'); // Load Start button image
        this.load.image('uiHs', 'assets/misc/uiHs.png'); // Load High Scores button image
        this.load.image('uiQuit', 'assets/misc/uiQuit.png'); // Load Quit button image
    }

    create() {
        this.add.video(270, 480, 'bg2').play(true);
        let title = this.add.image(270, 100, 'title').setOrigin(0.5);
        title.setScale(0.8); // Set the scale of the title

        if (!this.mainbgm) {
            this.mainbgm = this.sound.add('mainbgm', { volume: 0.5, loop: true });
        }
        if (!this.mainbgm.isPlaying) {
            this.mainbgm.play();
        }

        this.selectSound = this.sound.add('select');

        let startButton = this.add.image(270, 400, 'uiStart').setOrigin(0.5).setInteractive();
        let highScoreButton = this.add.image(270, 500, 'uiHs').setOrigin(0.5).setInteractive();
        let quitButton = this.add.image(270, 580, 'uiQuit').setOrigin(0.5).setInteractive();

        // Scale the buttons to increase their size
        startButton.setScale(1.6);  // Increase the size by 60%
        highScoreButton.setScale(1.3);  // Increase the size by 30%
        quitButton.setScale(1);  // Original size

        startButton.on('pointerdown', () => {
            this.selectSound.play();
            this.fadeOut('GameScene');
        });

        highScoreButton.on('pointerdown', () => {
            this.selectSound.play();
            this.fadeOut('HighScoresScene');
        });

        quitButton.on('pointerdown', () => {
            this.selectSound.play();
            window.close();
        });

        const controlsText = this.add.text(270, 670, ' CONTROLS:\n\nARROW KEYS TO MOVE ⋅ SPACE TO SHOOT ⋅ MOUSE FOR NAVIGATION', {
            fontSize: '12px',
            fill: '#ff0',
            fontFamily: 'Tahoma',
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5);

        
        const mechanicsText = this.add.text(270, 760, '\n\nMECHANICS:\n\nKILL AS MANY AS YOU CAN. 10 PTS PER KILL. \n\nDONT LET ENEMIES PASS THROUGH YOU OR 10 PTS WILL BE DEDUCTED TO YOUR SCORE PER ENEMY.\n\nENEMIES WILL DROP +HP OF 10%.\n\nSURIVE AS MANY WAVES AS YOU CAN.\n\nBULLET UPGRADE PER 500 SCORE', {
            fontSize: '9px',
            fill: '#ff0',
            fontFamily: 'Tahoma',
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5);

        const authorText = this.add.text(270, 850, '\n\n\n\n\n\nA VERTICAL SHOOTING ARCADE GAME BY:\n\nHILARIO B. ARRIESGADO II', {
            fontSize: '12px',
            fill: '#ff0',
            fontFamily: 'Tahoma',
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5);

        const copyrightText = this.add.text(270, 900, '\n\n\n\n\n\n © 2023-2024    Lars- Larsche1/Koh ', {
            fontSize: '12px',
            fill: '#ff0',
            fontFamily: 'Tahoma',
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5);
    }

    fadeOut(targetScene) {
        this.cameras.main.fadeOut(2000, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.mainbgm.stop();
            this.scene.start(targetScene);
        });
    }

    fadeIn() {
        this.cameras.main.fadeIn(2000, 0, 0, 0);
    }
}
