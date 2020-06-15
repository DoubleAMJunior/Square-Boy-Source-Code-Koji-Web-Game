import 'phaser';
import Koji from '@withkoji/vcc';
import Block from '../components/Block';
import Player from '../components/Player';
import config from '../config/config';
import {GAME_HEIGHT, GAME_WIDTH, MOBILE} from '../config/config'
// import levels from '../components/levels';
import fader from '../components/fader';
import Button from '../components/Button';
import ButtonPic from '../components/ButtonPic';
import mt from '../Assets/mt.png';
import mtd from '../Assets/mtd.png';
import retryBtnImg from '../Assets/retryButton.png'
import btm from '../Assets/backToMenu.png'
import finger from '../Assets/finger.png'


const setting = Koji.config.settings;
const images = Koji.config.images;
const levels = Koji.config.levels.levels;

var maxRegisteredDistance=50;
var cancelTime=1000;

export default class gameScene extends Phaser.Scene{
    constructor(){
        super("gameScene");
    }
    
    preload(){
        this.loading=this.add.text(this.cameras.main.centerX,this.cameras.main.centerY,'Loading...',{fontFamily: config.fonts, fontSize:30});
        this.loading.x-=this.loading.displayWidth/2;
        this.loading.y-=this.loading.displayHeight/2;
        let blockH = MOBILE ? 120 : 120;
        let blockW = MOBILE ? 120 : 120;
        // let blockAdress=images.block+"?h=" + blockH +  "&w=" + blockW + "&fit=scale";
        let blockAdress=images.block+"?width=120&height=120&fit=bounds";
        this.load.image('block',blockAdress);
        let blockBgAdress=images.blockBg+"?width=138&height=138&fit=bounds";
        this.load.image('blockBg',blockBgAdress);
        let teleportBgAdress=images.teleportBg+"?width=138&height=138&fit=bounds";
        this.load.image('teleport',teleportBgAdress);
        let playerAdress=images.player+"?width=120&height=120&fit=bounds";
        this.load.image('player',playerAdress);
        let PTAdress=images.playerTrail+"?width=120&height=120&fit=bounds";
        this.load.image('PT',PTAdress);
        
        this.load.image('retry',retryBtnImg);
        this.load.image('menu',btm);

        this.load.image('muteSprite',mt);
        this.load.image('mutedSprite',mtd);
        let starAdress=images.star+"?width=40&height=40&fit=bounds";
        this.load.image('star',starAdress);
        this.load.image('finger',finger);
        this.load.audio('click',[Koji.config.sounds.click],{instances:1});
        this.load.audio('win',[Koji.config.sounds.win],{instances:1});
    }

    create(){
        this.loading.destroy();
        
        this.tmp1 = this.physics.add.sprite(-20,-20,'blockBg').setOrigin(0).setAlpha(0);
        // if(MOBILE){
        //     this.tmp1.setScale(config.scaleMobile);
        // }
        // this.tmp2 = this.physics.add.sprite(this.tmp1.x + this.tmp1.displayWidth, this.tmp1.y /*+ this.tmp1.displayHeight*/, 'block').setOrigin(0);
        maxRegisteredDistance=this.tmp1.displayHeight;
        this.currentLevel = config.currentLevel;
        this.numOfLvls = levels.length;
        this.Menu=new ButtonPic(this,this.cameras.main.centerX-45,60,70,70,"menu",()=>{
                this.btnUse = true;
                this.sound.play('click');
                this.scene.start("levelSelect")
        });
        this.retryButton=new ButtonPic(this,this.cameras.main.centerX+45,60,70,70,"retry",()=>{
            this.btnUse = true;
            this.sound.play('click');
            this.changeLevel(this.currentLevel);
        });
        this.stoppu=false;
        this.inputBlock=false;
        this.btnUse = false;
        this.moving=0;
        this.map = []
        this.players = []
        this.destinations = []
        
        this.createLevel = function(lvl){
            this.inputBlock = true;
            let mappu = levels[this.currentLevel-1];
            let rows = levels[this.currentLevel-1].length;
            let columns = levels[this.currentLevel-1][0].length;

            // let rows = levels[this.currentLevel-1]["rows"];
            // let columns = levels[this.currentLevel-1]["columns"];
            // let mappu = levels[this.currentLevel-1]["map"];

            config.scaleMobile = Math.min(0.4*this.scale.width/(this.tmp1.displayWidth*columns) , 0.7*this.scale.height/(this.tmp1.displayHeight*rows),2)
            if(MOBILE){
                config.scaleMobile = Math.min(0.9*this.scale.width/(this.tmp1.displayWidth*columns) , 0.9*this.scale.height/(this.tmp1.displayHeight*rows),2)
            }
            // console.log("scaleMobile : " + config.scaleMobile);
            this.tmp1.setScale(config.scaleMobile);

            let X_NEO = this.cameras.main.centerX -(this.tmp1.displayWidth * (columns-1) /2);
            let Y_NEO = this.cameras.main.centerY -(this.tmp1.displayHeight * (rows-1) /2) + 45;
            let row = []
            for (let j = 0; j < rows; j++) {
                for (let i = 0; i < columns; i++) {
                    switch(mappu[j][i]){
                        case 1:{
                        // case 'X':{
                            let blck = new Block(this, X_NEO + (i*this.tmp1.displayWidth), Y_NEO + (j*this.tmp1.displayHeight), i, j, 'block', '', 'X', true);
                            row.push(blck);
                            break;
                        }
                        case 2:{
                        // case 'P':{
                            let blck = new Block(this, X_NEO + (i*this.tmp1.displayWidth), Y_NEO + (j*this.tmp1.displayHeight), i, j, '', 'blockBg', '_', true);
                            row.push(blck);
                            let plyr = new Player(this, X_NEO + (i*this.tmp1.displayWidth), Y_NEO + (j*this.tmp1.displayHeight), i, j, 'player', 'p');
                            this.players.push(plyr);
                            // plyr.move(undefined,this.map[0][0])//didnt move
                            break;
                        }
                        case 3:{
                        // case 'T':{
                            let blck = new Block(this, X_NEO + (i*this.tmp1.displayWidth), Y_NEO + (j*this.tmp1.displayHeight), i, j, '', 'teleport', 'T');
                            row.push(blck);
                            break;
                        }
                        case 0:{
                        // case '_':{
                            let blck = new Block(this, X_NEO + (i*this.tmp1.displayWidth), Y_NEO + (j*this.tmp1.displayHeight), i, j, '', 'blockBg', '_');
                            row.push(blck);
                            break;
                        }
                    }
                }
                this.map.push(row)
                row = []
            }
            this.players.forEach((player, index)=> {
                this.children.bringToTop(player.sprite);
            });
            // console.log(this.map)
        }
        this.createLevel();


        this.scene.scene.input.on('pointerdown',()=>{
            if(this.moving==0 && !this.inputBlock){
                this.inputStart(this)
            }
        })

        this.scene.scene.input.on('pointerup',(position)=>{
            if(this.moving==0 && !this.inputBlock){
            this.inputEnd(position,this);
            }
        })
        
        
        this.muteBtn = this.physics.add.sprite(this.cameras.main.centerX*2 , 0,'muteSprite').setAlpha(0);
        this.muteBtn.x -= this.muteBtn.displayWidth;
        this.muteBtn.y += this.muteBtn.displayHeight;
        this.mutedBtn = this.physics.add.sprite(this.cameras.main.centerX*2 , 0,'mutedSprite').setAlpha(0);
        this.mutedBtn.x -= this.mutedBtn.displayWidth;
        this.mutedBtn.y += this.mutedBtn.displayHeight;
        this.muteActive=false;
        
        // this.CS = this.sound.add('click');
        // this.WS = this.sound.add('win');
        // this.sound.play('click');
        // this.sound.play('win');
        

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
        if(this.currentLevel==1){
            this.tutorialAnim=this.add.sprite(this.cameras.main.centerX*0.8,this.cameras.main.centerY*1.5,"finger");
            this.tutorialAnim.scale*=0.2;
            this.tweens.add({
                targets: this.tutorialAnim,
                ease: 'linear',
                duration: 1500,
                x:this.cameras.main.centerX*1.2,
                repeat:-1,
                onComplete:()=>{this.tutorialAnim.x=this.cameras.main.centerX*0.8}
            });
            this.tutorialText=this.add.text(this.cameras.main.centerX,this.cameras.main.centerY*1.6,"Swipe",{color:config.TextColor});
            this.tutorialText.x-=this.tutorialText.displayWidth/2;
            this.tutorialText2=this.add.text(this.cameras.main.centerX,this.cameras.main.centerY*1.62,"Or use arrow keys",{color:config.TextColor});
            this.tutorialText2.x-=this.tutorialText2.displayWidth/2;
            this.tutorialText2.y+=this.tutorialText2.displayHeight;
        }
        this.rightKeyBlock=false;
        this.leftKeyBlock=false;
        this.downKeyBlock=false;
        this.upKeyBlock=false;

        this.input.keyboard.on('keydown-' + 'UP',  (event)=>{
            console.log(this.inputBlock);
            if(this.moving!=0 || this.inputBlock || this.upKeyBlock)
                return;
            this.upKeyBlock=true
            this.players.forEach((player, index)=> {
            player.move(this.map[player.row][player.column], "up")});
            this.inputBlock=true;
        });
        this.input.keyboard.on('keydown-' + 'DOWN', (event)=>{
            if(this.moving!=0 || this.inputBlock || this.downKeyBlock)
                return;
            this.downKeyBlock=true;
            this.players.forEach((player, index)=> {
                player.move(this.map[player.row][player.column], "down")
            });
            this.inputBlock=true;
         });
        this.input.keyboard.on('keydown-' + 'LEFT', (event)=>{
            if(this.moving!=0 || this.inputBlock||this.leftKeyBlock)
                return;
            this.leftKeyBlock=true;
            this.players.forEach((player, index)=> {
                player.move(this.map[player.row][player.column], "left")
            });
            this.inputBlock=true;
         });
        this.input.keyboard.on('keydown-' + 'RIGHT', (event)=>{
            if(this.moving!=0 || this.inputBlock||this.rightKeyBlock)
                return;
            this.rightKeyBlock=true;
            this.players.forEach((player, index)=> {
            player.move(this.map[player.row][player.column], "right")
        });
        this.inputBlock=true; });

        this.input.keyboard.on('keyup-' + 'UP',  (event)=>{
            this.upKeyBlock=false;
        });
        this.input.keyboard.on('keyup-' + 'DOWN', (event)=>{
            this.downKeyBlock=false;
         });
        this.input.keyboard.on('keyup-' + 'LEFT', (event)=>{
            this.leftKeyBlock=false;    
        });
        this.input.keyboard.on('keyup-' + 'RIGHT', (event)=>{
            this.rightKeyBlock=false;
        });

    }

    update(time,delta){
        
    }

    checkWin(){
        this.inputBlock = true;
        let win = true;
        let done = false;
        // this.map.forEach
        for (let j = 0; j < this.map.length; j++) {
            for (let i = 0; i < this.map[j].length; i++) {
                if(this.map[j][i].type == '_' && !this.map[j][i].occupy){
                    done = true;
                    win = false;
                }
                // console.log(done)
                if(done){
                    break;
                }
            }
            if(done){
                break;
            }
        }
        return win;
    }

    inputStart(scene){
        scene.previousPosx=window.game.input.activePointer.position.x;
        scene.previousPosy=window.game.input.activePointer.position.y;    
        scene.inputTime= new Date();
    }

    inputEnd(position,scene){
        let timeDiff=new Date();
        timeDiff=timeDiff-scene.inputTime;
        if(timeDiff>cancelTime){
            // console.log("cancelOnTime");
            return;
        }
        let deltaX=position.position.x-scene.previousPosx;
        let deltaY=position.position.y-scene.previousPosy;
        if(Math.abs(deltaX)>Math.abs(deltaY)){
            if(Math.abs(deltaX)<maxRegisteredDistance){
                // console.log("canceled")
                return;
            }
            if(deltaX>0){
                // console.log("right");
                this.players.forEach((player, index)=> {
                    player.move(this.map[player.row][player.column], "right")
                });
                scene.inputBlock=true;
                // player.move(this.map[player.row][player.column], "right")
            }
            else{
                // console.log("left");
                this.players.forEach((player, index)=> {
                    player.move(this.map[player.row][player.column], "left")
                });
                scene.inputBlock=true;
                // player.move(this.map[player.row][player.column], "left")
            }
        }
        else{
            if(Math.abs(deltaY)<maxRegisteredDistance){
                // console.log("canceled")
                return;
            }
            if(deltaY>0){
                // console.log("down")
                this.players.forEach((player, index)=> {
                    player.move(this.map[player.row][player.column], "down")
                });
                scene.inputBlock=true;
                // player.move(this.map[player.row][player.column], "down")
            }
            else{
                // console.log("up");
                this.players.forEach((player, index)=> {
                    player.move(this.map[player.row][player.column], "up")
                });
                scene.inputBlock=true;
                // player.move(this.map[player.row][player.column], "up")
            }
        }
    }

    setScore(newScore){
        this.score=newScore;
        this.scoreText.destroy();
        this.scoreText=this.add.text(this.cameras.main.centerX,this.cameras.main.centerY*.1,this.score,{fontFamily: config.fonts, color:config.scoreTextColor,fontSize:30});
        this.scoreText.x-=this.scoreText.displayWidth/2;
        this.scoreText.y+=this.scoreText.displayHeight/2;
    }

    changeLevel(num){
        if(num<1){
            // console.log("firstLevel")
            return;
        }
        if(num>this.numOfLvls){
            // console.log('lastLevel');
            return;
        }
        // console.log("changelvel");
        
        if(this.btnUse){
            config.currentLevel=num;
            this.scene.start("gameScene")
        }
        else{
            
            config.currentLevel=num;
            this.scene.start("gameScene")
        }
    }

    startLoseSceneSequence(){
        if(setting.mute){
            fader(this.mutedBtn,this,false);
        }
        else{
            fader(this.muteBtn,this,false);
        }
    }
}
