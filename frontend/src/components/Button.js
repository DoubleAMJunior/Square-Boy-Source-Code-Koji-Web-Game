import config from "../config/config";
import fader from './fader';
export default class Button extends Phaser.GameObjects.Container{
    constructor(scene,x,y,width,height, text='',callBack = ()=>{}, disable = false, disableOnLevel = 0, currentLevel = config.clearedLevel, fillColor=config.buttonBackgroundColor,hovercolor=config.buttonBackgroundColorHover,fontSize=30,fontColor= config.buttonTextColor , fillAlpha=1,radius=15){
        super(scene,x,y);
        this.scene=scene;
        scene.add.existing(this);
        let FColor;
        if(disable && currentLevel < disableOnLevel){
            FColor=hovercolor;
        }
        else{
            FColor=fillColor;
        }
        this.buttonBackGround=scene.add.rexRoundRectangle(x, y, width, height, radius, FColor, fillAlpha);
        this.buttonText=scene.add.text(x,y,text,{fontFamily:config.fonts[0],color:fontColor,fontSize:fontSize});
        this.buttonText.x-=this.buttonText.displayWidth/2;
        this.buttonText.y-=this.buttonText.displayHeight/2;
        this.buttonBackGround.setInteractive().on('pointerdown',callBack);
        this.buttonBackGround.on('pointerover',()=>{
            this.buttonBackGround.fillColor=hovercolor;
        });
        this.buttonBackGround.on('pointerout',()=>{
            if(disable && currentLevel < disableOnLevel){
                this.buttonBackGround.fillColor=hovercolor;
            }
            else{
                this.buttonBackGround.fillColor=fillColor;
            }
        })

    }
    fade(fadeIn,duration=config.fadeDuration,callBack=()=>{}){
        fader(this.buttonText,this.scene,fadeIn,duration,callBack);
        fader(this.buttonBackGround,this.scene,fadeIn,duration,callBack);
    }

    changePosition(x,y){
        this.buttonText.x=x;
        this.buttonText.y=y;
        this.buttonText.x-=this.buttonText.displayWidth/2;
        this.buttonText.y-=this.buttonText.displayHeight/2;
        this.buttonBackGround.setPosition(x,y);
        this.scene.children.bringToTop(this.buttonBackGround);
        this.scene.children.bringToTop(this.buttonText);
    //     Phaser.Display.Bounds.SetCenterX(this.buttonBackGround,x);
    //     Phaser.Display.Bounds.SetCenterY(this.buttonBackGround,y);
        //this.setPosition(x,y);
    }
     setalpha(num){
        this.buttonBackGround.setAlpha(0);
        this.buttonText.setAlpha(num);
    }
}