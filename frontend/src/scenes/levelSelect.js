import 'phaser';
import Koji from '@withkoji/vcc';
// import levels from '../components/levels';
import config from '../config/config';
import {GAME_HEIGHT, GAME_WIDTH, MOBILE} from '../config/config'
import Button from '../components/Button';
import ButtonPic from '../components/ButtonPic';
import fader from '../components/fader';
import nextBtnImg from '../Assets/nextButton.png'
import previousBtnImg from '../Assets/previousButton.png'
import mt from '../Assets/mt.png';
import mtd from '../Assets/mtd.png';


const setting = Koji.config.settings;
const images = Koji.config.images;
const levels = Koji.config.levels.levels;

export default class levelSelect extends Phaser.Scene{
    constructor(){
        super({key:'levelSelect'})
    }
    preload(){
        this.load.image('muteSprite',mt);
        this.load.image('mutedSprite',mtd);
        this.load.image('next',nextBtnImg);
        this.load.image('previous',previousBtnImg);
        this.load.audio('click',[Koji.config.sounds.click],{instances:1});
    }
    create(){
        this.numOfLvls=levels.length;
        console.log(this.numOfLvls);
        this.pageWidthLevels=3;
        this.pageHeightLevels=4;
        let buttonWidth=80;
        let buttonHeight=80;

        config.levelSelectScale = Math.min(0.5*this.scale.width/(buttonWidth*this.pageWidthLevels) , 0.7*this.scale.height/(buttonHeight*this.pageHeightLevels),2)
        if(MOBILE){
            config.levelSelectScale = Math.min(0.6*this.scale.width/(buttonWidth*this.pageWidthLevels) , 0.9*this.scale.height/(buttonHeight*this.pageHeightLevels),2)
        }
        let scaleFactor = 2/3;
        // console.log("scaleMobile : " + config.scaleMobile);
        buttonWidth *= config.levelSelectScale*scaleFactor;
        buttonHeight *= config.levelSelectScale*scaleFactor;
        
        this.Ypos=this.cameras.main.centerY-(buttonHeight*1.5*(this.pageHeightLevels+1))/2;
        let counter=1;
        this.buttons=[];
        // console.log("start");
        for(let i=0;i<this.pageHeightLevels;i++){
            let rowButtons=[];
            this.Xpos=this.cameras.main.centerX-(buttonWidth*1.5*(this.pageWidthLevels-1)/2);
            this.Ypos+=buttonHeight*1.5;
            for (let j=0;j<this.pageWidthLevels;j++){
                // console.log(((config.pageOffset-1)*this.pageWidthLevels*this.pageHeightLevels)+counter);
                if(this.numOfLvls<((config.pageOffset-1)*this.pageWidthLevels*this.pageHeightLevels)+counter){
                    break;
                }
                let levelNum=counter+(config.pageOffset-1)*this.pageHeightLevels*this.pageWidthLevels;
                let button = new Button(this,this.Xpos,this.Ypos,buttonWidth,buttonHeight,levelNum,()=>{
                    if(config.clearedLevel >= levelNum){
                    config.currentLevel=levelNum;
                    this.sound.play('click');
                    this.startTransition("gameScene");
                    }
                },/*disable =*/ true, /*disableOnLevel =*/ levelNum, config.clearedLevel, config.buttonBackgroundColor, config.buttonBackgroundColorHover, 30 * config.levelSelectScale*scaleFactor);
                this.Xpos+=buttonWidth*1.5;
                // button.x-=buttonWidth/2;
                // button.y-=buttonHeight/2;
                button.fade(true);
                rowButtons.push(button);
                counter++;
            }
            this.buttons.push(rowButtons);
        }
        this.nextButton=new ButtonPic(this,this.cameras.main.centerX + ((this.pageWidthLevels+4)*buttonWidth/2)
            ,this.cameras.main.centerY,60 * config.levelSelectScale*scaleFactor,58 * config.levelSelectScale*scaleFactor,"next",()=>{
                // console.log(config.pageOffset);
                this.sound.play('click');
                if(config.pageOffset*this.pageWidthLevels*this.pageHeightLevels<this.numOfLvls){
                    config.pageOffset++;
                    this.startTransition("levelSelect",false);
                }
            });
        this.previousButton=new ButtonPic(this,this.cameras.main.centerX - ((this.pageWidthLevels+4)*buttonWidth/2)
            ,this.cameras.main.centerY,60 * config.levelSelectScale*scaleFactor,58 * config.levelSelectScale*scaleFactor,"previous",()=>{
                // console.log(config.pageOffset);
                this.sound.play('click');
                if(config.pageOffset>1){
                    config.pageOffset--;
                    this.startTransition("levelSelect",false);
                }
            });
    }

    startTransition(sceneName,cond=true){
        this.Ended = true;
        this.buttonPressed=true;
        this.buttons.forEach(e=>{
            e.forEach(e2=>{
                e2.fade(false);
            })
        });
        if(cond){
            this.nextButton.fade(false);
            this.previousButton.fade(false);
        }
        this.time.delayedCall(config.fadeDuration,()=>{this.scene.start(sceneName)}
        ,[]
        ,this);
    }
    
}