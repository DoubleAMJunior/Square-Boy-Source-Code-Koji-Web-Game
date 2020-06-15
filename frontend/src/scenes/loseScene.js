import 'phaser';
import Koji from '@withkoji/vcc';
import config from '../config/config';
const setting = Koji.config.settings;
const images = Koji.config.images;
import fader from '../components/fader';
import Button from '../components/Button';
import mt from '../Assets/mt.png';
import mtd from '../Assets/mtd.png';

export default class loseScene extends Phaser.Scene{
    constructor(){
        super('loseScene');
    }
    init(data){
        this.highScore=data.highScore;
    }
    preload(){
        this.loading=this.add.text(this.cameras.main.centerX,this.cameras.main.centerY,'Loading...',{fontFamily: config.fonts, fontSize:30})
        this.loading.x-=this.loading.displayWidth/2;
        this.loading.y-=this.loading.displayHeight/2;
        this.load.image('try',Koji.config.images.again);
        this.load.image('muteSprite',mt);
        this.load.image('mutedSprite',mtd);
        let playerAdress=images.player+"?fit=crop&max-w=75&max-h=75";
        this.load.image('playerSprite',playerAdress);
    }
    
    create(){
        this.loading.destroy();
        this.tmp1 = this.physics.add.sprite(-20,-20,'block').setOrigin(0).setAlpha(0);

        this.buttonPressed=false;

        this.retryButton=new Button(this,this.cameras.main.centerX,this.cameras.main.centerY, 200, 100,'Play Again',()=>{
            location.reload();
        });
        this.retryButton.fade(true);


        this.score=this.add.text(this.cameras.main.centerX,0,'YOU WIN',{color:config.TextColor,fontSize:30});
        this.score.x-=this.score.displayWidth/2;
        this.score.y+=this.score.displayHeight/2+this.cameras.main.centerY*.1;
        this.win=this.add.text(this.cameras.main.centerX,0,'Thank you for playing !',{color:config.TextColor,fontSize:30});
        this.win.x-=this.win.displayWidth/2;
        this.win.y+=this.score.displayHeight+this.win.displayHeight/2+this.cameras.main.centerY*.1;
        fader(this.score,this,true);
        fader(this.win,this,true);
        
        this.muteBtn = this.physics.add.sprite(this.cameras.main.centerX*2 , 0,'muteSprite').setAlpha(0);
        this.muteBtn.x -= this.muteBtn.displayWidth;
        this.muteBtn.y += this.muteBtn.displayHeight;
        this.mutedBtn = this.physics.add.sprite(this.cameras.main.centerX*2 , 0,'mutedSprite').setAlpha(0);
        this.mutedBtn.x -= this.mutedBtn.displayWidth;
        this.mutedBtn.y += this.mutedBtn.displayHeight;
        this.muteActive=false;

        if(setting.mute){
            this.sound.setMute(true);
            fader(this.mutedBtn,this,true,config.fadeDuration,()=>{this.muteActive=true});
        }
        else{
            this.sound.setMute(false);
            fader(this.muteBtn,this,true,config.fadeDuration,()=>{this.muteActive=true});
        }

        this.muteBtn.setInteractive().on('pointerdown',()=>{
                if(!this.muteActive){
                    return;
                }
                this.buttonPressed=true;
                this.mutedBtn.setAlpha(1);
                this.muteBtn.setAlpha(0);
                setting.mute = true;
                this.sound.setMute(true);
                
                this.time.delayedCall(setting.shootingDelay,()=>{this.buttonPressed=false}
                        ,[]
                        ,this);
        });

        this.mutedBtn.setInteractive().on('pointerdown',()=>{
                if(!this.muteActive){
                    return;
                }
                this.buttonPressed=true;
                this.mutedBtn.setAlpha(0);
                this.muteBtn.setAlpha(1);
                setting.mute = false;
                this.sound.setMute(false);
                
                this.time.delayedCall(setting.shootingDelay,()=>{this.buttonPressed=false}
                        ,[]
                        ,this);
        });
    }


    startTransition(sceneName,data=null){
        if(!this.buttonPressed)
        {
            this.Ended = true;
            this.buttonPressed=true;
            fader(this.score,this,false,()=>{this.scene.start(sceneName,data);});
            fader(this.win,this,false,()=>{this.scene.start(sceneName,data);});
            this.retryButton.fade(false);
            this.submitScore.fade(false);
            if(setting.mute){
                fader(this.mutedBtn,this,false);
            }
            else{
                fader(this.muteBtn,this,false);
            }
        }   
    }
} 