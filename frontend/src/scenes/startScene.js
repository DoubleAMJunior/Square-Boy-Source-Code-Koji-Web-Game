import 'phaser';
import Koji from '@withkoji/vcc';
import config from '../config/config';
import {GAME_HEIGHT, GAME_WIDTH, MOBILE} from '../config/config'
const setting = Koji.config.settings;
const images = Koji.config.images;
import fader from '../components/fader';
import Button from '../components/Button';
import mt from '../Assets/mt.png';
import mtd from '../Assets/mtd.png';

export default class startScene extends Phaser.Scene{
    constructor(){
        super('startScene');
    }
    preload(){
        this.loading=this.add.text(this.cameras.main.centerX,this.cameras.main.centerY,'Loading...',{fontFamily: config.fonts, fontSize:30})
        this.loading.x-=this.loading.displayWidth/2;
        this.loading.y-=this.loading.displayHeight/2;
        let logoAddress=Koji.config.images.logo+"?fit=fill&h=150&w=150";
        this.load.image('logo',logoAddress);
        this.load.audio('Bgm',[Koji.config.sounds.bgm],{instances:1});
        this.load.image('muteSprite',mt);
        this.load.image('mutedSprite',mtd);
    }

    create(){
        this.loading.destroy();
        this.tmp1 = this.physics.add.sprite(-20,-20,'block').setOrigin(0).setAlpha(0);
        
        this.buttonPressed=false;

        this.play=new Button(this,this.cameras.main.centerX,this.cameras.main.centerY, 200, 100,'Play',()=>{  
            this.bgm=this.sound.add('Bgm');
            this.bgm.play({loop:true});
            this.startTransition('levelSelect')});
        this.play.fade(true);
        

        this.logo=this.add.sprite(this.cameras.main.centerX,0,'logo');
        this.logo.y+=this.logo.height;
        fader(this.logo,this,true);

        this.muteBtn = this.physics.add.sprite(this.cameras.main.centerX*2 - this.tmp1.displayWidth, this.tmp1.displayHeight,'muteSprite').setAlpha(0);
        this.muteBtn.x -= this.muteBtn.displayWidth;
        this.muteBtn.y += this.muteBtn.displayHeight;
        this.mutedBtn = this.physics.add.sprite(this.cameras.main.centerX*2 - this.tmp1.displayWidth, this.tmp1.displayHeight,'mutedSprite').setAlpha(0);
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

    startTransition(sceneName){
        if(!this.buttonPressed)
        {
            this.Ended = true;
            this.buttonPressed=true;
            fader(this.logo,this,false,config.fadeDuration,()=>{this.scene.start(sceneName);});
            this.play.fade(false);
            if(setting.mute){
            fader(this.mutedBtn,this,false);
            }
            else{
                fader(this.muteBtn,this,false);
            }
        }
    }
}