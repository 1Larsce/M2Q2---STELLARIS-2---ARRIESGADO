class OpeningScene extends Phaser.Scene {
    constructor() {
        super({ key: 'OpeningScene' });
    }

    preload() {
        this.load.image('stellarisLogo', 'assets/misc/stellaris2.png'); // Load the logo
    }

    create() {
        // Set the background color to black
        this.cameras.main.setBackgroundColor('#000000');

        const skipText = this.add.text(270, 900, 'Press Space to Skip Intro', {
            fontSize: '20px',
            fill: '#ff0000',
            align: 'center'
        }).setOrigin(0.5);

        const openingText = `
            STELLARIS II - ANDROMEDA

            A long time ago in a galaxy far, far away...\n\n
            The galaxy lies in a fragile state of reconstruction after the GREAT INTERSTELLAR WARS.\n\n
            \nIn the far reaches of space, the ancient planet of STELLARIS has resurfaced, holding secrets of unparalleled power.\n\n
            \nAs the GALACTIC FEDERATION struggles to maintain order, the REBEL ALLIANCE seeks freedom, and the CORPORATE CONSORTIUM,\n\n driven by greed, deploys its mercenary fleets to secure Stellaris for its own nefarious purposes.\n\n
            \n\nAmid this chaos, two unlikely heroes, LARS and ESTELLE, find themselves thrust into the heart of the conflict.\n
            \n\nLars, a seasoned pilot, and Estelle, a brilliant scientist with a mysterious connection to Stellaris, must navigate alliances and betrayals to unlock the ultimate power of STELLARIS II.\n
            \n\n\n\nLet the stars guide you, for the journey has just begun...
        `;

        this.typewriteText(270, 480, openingText, 20);

        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.start('MainMenuScene');
        });
    }

    typewriteText(x, y, text, speed) {
        let length = text.length;
        let i = 0;
        let textObject = this.add.text(x, y, '', {
            fontSize: '20px',
            fill: '#ff0',
            align: 'center',
            wordWrap: { width: 500, useAdvancedWrap: true }
        }).setOrigin(0.5);

        this.time.addEvent({
            callback: () => {
                textObject.text += text[i];
                i++;
                if (i === length) {
                    this.time.delayedCall(500, () => {
                        this.fadeOutText(textObject);
                    });
                }
            },
            repeat: length - 1,
            delay: speed
        });
    }

    fadeOutText(textObject) {
        this.tweens.add({
            targets: textObject,
            alpha: { from: 1, to: 0 },
            duration: 2000,
            onComplete: () => {
                this.showLogo();
            }
        });
    }

    showLogo() {
        let logo = this.add.image(270, 480, 'stellarisLogo').setOrigin(0.5).setAlpha(0).setScale(0.3);

        this.tweens.add({
            targets: logo,
            alpha: { from: 0, to: 1 },
            duration: 2000,
            onComplete: () => {
                this.time.delayedCall(2000, () => {
                    this.fadeOutLogo(logo);
                });
            }
        });
    }

    fadeOutLogo(logo) {
        this.tweens.add({
            targets: logo,
            alpha: { from: 1, to: 0 },
            duration: 2000,
            onComplete: () => {
                this.scene.start('MainMenuScene');
            }
        });
    }
}
