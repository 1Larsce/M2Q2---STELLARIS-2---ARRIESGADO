class HighScoresScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HighScoresScene' });
    }

    preload() {
        this.load.video('bg2', 'assets/background/bg2.mp4', 'loadeddata', false, true);
    }

    create() {
        this.add.video(270, 480, 'bg2').play(true);

        const title = this.add.text(270, 50, 'High Scores', {
            fontSize: '32px',
            fill: '#ff0',
            fontFamily: 'Tahoma',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const highScores = this.getHighScores();
        let yPosition = 120;

        highScores.forEach((score, index) => {
            this.add.text(270, yPosition, `${index + 1}. ${score.name} - ${score.score} (Wave ${score.wave})`, {
                fontSize: '24px',
                fill: '#ff0',
                fontFamily: 'Tahoma',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            yPosition += 40;
        });

        const backButton = this.add.text(270, 700, 'Back', {
            fontSize: '32px',
            fill: '#ff0',
            fontFamily: 'Tahoma',
            fontStyle: 'bold'
        }).setOrigin(0.5).setInteractive();

        backButton.on('pointerover', () => backButton.setStyle({ fill: '#00f' }));
        backButton.on('pointerout', () => backButton.setStyle({ fill: '#ff0' }));

        backButton.on('pointerdown', () => {
            this.sound.stopAll(); // Stop all sounds when returning to main menu
            this.fadeOut('MainMenuScene');
        });

        this.fadeIn(); // Fade in when the scene starts
    }

    getHighScores() {
        const highScores = localStorage.getItem('highScores');
        return highScores ? JSON.parse(highScores) : [];
    }

    fadeOut(targetScene) {
        this.cameras.main.fadeOut(2000, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start(targetScene);
        });
    }

    fadeIn() {
        this.cameras.main.fadeIn(2000, 0, 0, 0);
    }
}
