import {GAME_HEIGHT, GAME_WIDTH, SCALE} from '../config/config'
import config from '../config/config';

export default class Text extends Phaser.GameObjects.Text {
    constructor(scene, x = 0, y = 0, text = ''/*, config = TEXT_STYLE.DEFAULT*/, center = false) {
        const originX = center ? 0.5 : 0

        super(scene, x, y, text, {
            fontFamily: config.fonts,
            // fontSize: config.size,
            fontSize:config.leaderboardFontSize,
            fontFamily:config.fonts,
            color: config.buttonTextColor,
            align: 'center',
            wordWrap: {
              width: GAME_WIDTH() * 0.8
            }
        })

        // this.setShadow(1, 1, "#333333", 2, false, true)
        this.setOrigin(originX, 0.5)

        scene.add.existing(this)
    }
}