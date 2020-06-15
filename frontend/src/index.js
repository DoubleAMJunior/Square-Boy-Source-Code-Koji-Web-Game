import Phaser from "phaser";
import Koji from '@withkoji/vcc';
const images = Koji.config.images;
import config from './config/config';
import gameScene from "./scenes/gameScene";
import loseScene from "./scenes/loseScene";
import startScene from "./scenes/startScene";
import levelSelect from "./scenes/levelSelect";
import {DEFAULT_HEIGHT,DEFAULT_WIDTH,MAX_HEIGHT,MAX_WIDTH,SCALE_MODE,MOBILE} from './config/config';

class game extends Phaser.Game{
  constructor(){
    super(config);
    this.scene.add('gameScene',gameScene);
    this.scene.add('loseScene',loseScene);
    this.scene.add('startScene',startScene);
    this.scene.add('levelSelect',levelSelect);
    this.scene.start('startScene');
  }
}


var WebFont = require('webfontloader');

if (Koji.config.settings.fontFamily) {
  WebFont.load({
    google: {
      families: [Koji.config.settings.fontFamily]
    },
    active: () => {
      
        let bg= Koji.config.images.background+"?fit=scale&w=1500h=1000";
        document.body.style.backgroundImage="url("+bg+")";
      
        document.getElementById('loadingu').remove();
        window.game=new game();
    
    }
  })
}

export var ressetCurrentScene=()=>{
  let arr=  window.game.scene.getScenes(true);
  arr[0].scene.restart();
}

if(module.hot){
  module.hot.accept('./scenes/startScene',()=>{ressetCurrentScene();});
  module.hot.accept('./scenes/gameScene',()=>{ressetCurrentScene();});
  module.hot.accept('./scenes/loseScene',()=>{ressetCurrentScene();});
  module.hot.accept('./scenes/levelSelect',()=>{ressetCurrentScene();});
}