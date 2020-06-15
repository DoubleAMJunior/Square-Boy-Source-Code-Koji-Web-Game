import RoundRectanglePlugin from 'phaser3-rex-plugins/plugins/roundrectangle-plugin.js';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';

import Koji from '@withkoji/vcc';
const setting = Koji.config.settings;
import {newHeight,newWidth,scale} from "../index.js"

const DEFAULT_WIDTH = 1024;
const DEFAULT_HEIGHT = 576;
const MAX_WIDTH = 1536;
const MAX_HEIGHT = 864;
let SCALE_MODE = 'SMOOTH';
export const MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export const GAME_WIDTH = () => (document.documentElement.clientWidth || window.innerWidth) * window.devicePixelRatio
export const GAME_HEIGHT = () => (document.documentElement.clientHeight || window.innerHeight) * window.devicePixelRatio
export const GAME_MIN_WIDTH = 480
export const GAME_MIN_HEIGHT = 720
export const SCALE_WIDTH = () => GAME_WIDTH() / GAME_MIN_WIDTH
export const SCALE_HEIGHT = () => GAME_HEIGHT() / GAME_MIN_HEIGHT
export const SCALE = () => (SCALE_WIDTH >= SCALE_HEIGHT) ? SCALE_HEIGHT() : SCALE_WIDTH()
export {DEFAULT_HEIGHT,DEFAULT_WIDTH,MAX_HEIGHT,MAX_WIDTH,SCALE_MODE}

const backend = Koji.config.serviceMap.backend

export default {
    type: Phaser.AUTO,
    transparent: true,
    physics: {
        default: 'arcade',
        arcade:{
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        width: GAME_WIDTH(),
        height: GAME_HEIGHT(),
        // zoom: 1 / window.devicePixelRatio,
        parent: 'phaser-game',
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
    },
    audio:{
        disableWebAudio:true
    }, plugins: {
        global: [{
            key: 'rexRoundRectanglePlugin',
            plugin: RoundRectanglePlugin,
            start: true
        },
        // ...
        ],
        scene: [{
            key: 'rexUI',
            plugin: RexUIPlugin,
            mapping: 'rexUI'
        },
        // ...
        ]
    },
    dom: {
        createContainer: true
    },
    parent: 'phaser-game',
    mute:setting.mute,
    TextColor:setting.TextColor,
    fadeDuration:setting.fadeDuration,
    buttonTextColor:setting.buttonTextColor,
    winBackGroundColor:Phaser.Display.Color.HexStringToColor("#ffffff").color,
    buttonBackgroundColor:Phaser.Display.Color.HexStringToColor(setting.buttonBackgroundColor).color,
    buttonBackgroundColorHover:Phaser.Display.Color.HexStringToColor(setting.buttonBackgroundColorHover).color,
    borderColor:Phaser.Display.Color.HexStringToColor(setting.borderColor).color,
    fonts:[setting.fontFamily, 'sans-serif'],
    leaderboardFontSize:36,
    ENDPOINTS:{
        LEADERBOARD: backend + '/leaderboard',
        SUBMIT: backend + '/leaderboard/save'
    },
    currentLevel:1,
    pageOffset:1,
    scaleMobile:1,
    levelSelectScale:1,
    clearedLevel:1
};