class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    preload() {
        this.load.video('bg2', 'assets/background/bg2.mp4', 'loadeddata', false, true);
    }

    create(data) {
        const { score, wave } = data; // Retrieve wave from data

        // Add video background
        this.add.video(270, 480, 'bg2').play(true);

        const title = this.add.text(270, 100, 'Game Over', {
            fontSize: '32px',
            fill: '#ff0',
            fontFamily: 'Tahoma',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const scoreText = this.add.text(270, 200, `Your score: ${score}`, {
            fontSize: '24px',
            fill: '#ff0',
            fontFamily: 'Tahoma',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const waveText = this.add.text(270, 250, `Waves survived: ${wave}`, {
            fontSize: '24px',
            fill: '#ff0',
            fontFamily: 'Tahoma',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const playerName = this.generatePlayerName();

        const nameText = this.add.text(270, 300, `Generated name: ${playerName}`, {
            fontSize: '24px',
            fill: '#ff0',
            fontFamily: 'Tahoma',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const saveButton = this.add.text(270, 400, 'Save Score', {
            fontSize: '32px',
            fill: '#ff0',
            fontFamily: 'Tahoma',
            fontStyle: 'bold'
        }).setOrigin(0.5).setInteractive();

        saveButton.on('pointerover', () => saveButton.setStyle({ fill: '#00f' }));
        saveButton.on('pointerout', () => saveButton.setStyle({ fill: '#ff0' }));

        saveButton.on('pointerdown', () => {
            this.saveHighScore(score, playerName, wave); // Pass wave to saveHighScore
            this.scene.start('HighScoresScene'); // Transition to the high scores scene after saving the score
        });

        const restartButton = this.add.text(270, 500, 'Restart', {
            fontSize: '32px',
            fill: '#ff0',
            fontFamily: 'Tahoma',
            fontStyle: 'bold'
        }).setOrigin(0.5).setInteractive();

        restartButton.on('pointerover', () => restartButton.setStyle({ fill: '#00f' }));
        restartButton.on('pointerout', () => restartButton.setStyle({ fill: '#ff0' }));

        restartButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        const mainMenuButton = this.add.text(270, 600, 'Main Menu', {
            fontSize: '32px',
            fill: '#ff0',
            fontFamily: 'Tahoma',
            fontStyle: 'bold'
        }).setOrigin(0.5).setInteractive();

        mainMenuButton.on('pointerover', () => mainMenuButton.setStyle({ fill: '#00f' }));
        mainMenuButton.on('pointerout', () => mainMenuButton.setStyle({ fill: '#ff0' }));

        mainMenuButton.on('pointerdown', () => {
            this.scene.start('MainMenuScene');
        });
    }

    generatePlayerName() {
        const highScores = localStorage.getItem('highScores') ? JSON.parse(localStorage.getItem('highScores')) : [];
        const playerCount = highScores.length > 0 ? highScores[highScores.length - 1].name.match(/\d+/) : 0;
        const newPlayerNumber = playerCount ? parseInt(playerCount[0]) + 1 : 1;
        return `Player${newPlayerNumber}`;
    }

    saveHighScore(score, name, wave) {
        const highScores = localStorage.getItem('highScores') ? JSON.parse(localStorage.getItem('highScores')) : [];
        highScores.push({ name, score, wave }); // Include wave in the score object
        highScores.sort((a, b) => b.score - a.score);
        if (highScores.length > 10) {
            highScores.pop(); // Keep only top 10 scores
        }
        localStorage.setItem('highScores', JSON.stringify(highScores));
    }
}
