import config from "../config/config"
import Button from "./Button";
import fader from './fader'
export default class ButtonPic extends Phaser.GameObjects.Container{
    constructor(scene,x,y,width,height, spriteName ,callBack = ()=>{}, disable = false, disableOnLevel = 0, currentLevel = config.clearedLevel, fillColor=config.buttonBackgroundColor,hovercolor=config.buttonBackgroundColorHover,fontSize=30,fontColor= config.buttonTextColor , fillAlpha=1,radius=15){
        super(scene,x,y);
        this.button= new Button(scene,x,y,width,height,"",callBack,disable,disableOnLevel,currentLevel,fillColor,hovercolor,fontSize,fontColor,fillAlpha,radius);
        this.sprite=scene.add.sprite(x,y,spriteName);
        this.scene=scene;
    }
    fade(fadeIn,duration=config.fadeDuration,callBack=()=>{}){
        this.button.fade(fadeIn,duration);
        fader(this.sprite,this.scene,fadeIn,duration,callBack);
    }
     setalpha(num){
        this.sprite.setAlpha(num);
        this.button.setalpha(num);
    }
}