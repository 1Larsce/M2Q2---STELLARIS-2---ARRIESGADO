var config = {
    type: Phaser.AUTO,
    width: 540,
    height: 960,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    dom: {
        createContainer: true
    },
    scene: [OpeningScene, MainMenuScene, GameScene, HighScoresScene, GameOverScene],
    render: {
        pixelArt: true
    },
};

const game = new Phaser.Game(config);
