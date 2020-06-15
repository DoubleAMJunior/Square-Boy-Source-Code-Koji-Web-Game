import 'phaser';
import Koji from '@withkoji/vcc';
import config from '../config/config';
import {MOBILE} from '../config/config';
import ButtonPic from '../components/ButtonPic';
import fader from '../components/fader';
const setting = Koji.config.settings;

export default class Player {
    constructor(scene, x, y, column, row, Sprite = '', type = ''){
        // console.log("bruh")
        this.x = x;
        this.y = y;
        this.column = column;
        this.row = row;
        this.type = type;
        this.scene=scene;
        if(Sprite && !Sprite == ''){
            // console.log("front")
            this.sprite = this.scene.physics.add.sprite(this.x, this.y -4, Sprite).setScale(0);
            this.scene.tweens.add({
                targets: this.sprite,
                scale: config.scaleMobile,
                ease: 'power2',
                duration: 280,
                delay: 310,
                // yoyo: true,
                // offset: 0,
                onComplete:()=>{
                    this.scene.inputBlock = false;
                }
            })
            // this.sprite.x += this.sprite.displayWidth/2 ;
            // this.sprite.y += this.sprite.displayHeight/2 ;
        }
    }

    telepoorto(fromB, movement){
        let toB = this.searchOtherT(fromB);
        if(!toB.occupy){
            fromB.occupy = false;
            this.scene.moving += 1;
            this.x = toB.x;
            this.y = toB.y;
            this.column = toB.column;
            this.row = toB.row;
            this.scene.tweens.add({
                targets: this.sprite,
                scale: 0,
                ease: 'linear',
                duration: 70,
                // yoyo: true,
                // offset: 0,
                onComplete:()=>{
                    this.sprite.x=toB.x,
                    this.sprite.y=toB.y-4,
                    
                    this.scene.tweens.add({
                        targets: this.sprite,
                        scale: config.scaleMobile,
                        ease: 'linear',
                        duration: 70,
                        // yoyo: true,
                        // offset: 0,
                        onComplete:()=>{
                            // toB.occupy = true;
                            this.scene.moving -= 1;
                            this.move(toB,movement);
                        }
                    })
                }
            })
        }
        else{
            if(this.scene.moving < 1){
                this.scene.moving = 0;
            }
            this.scene.inputBlock = false;
            this.move(fromB,movement,true);
        }
    }

    move(fromBlock, movement){
        // console.log("moving")
        let teleport = false;
        let emptyToBlock = false;
        let toBlock
        switch(movement){
            case "right":{
                toBlock = this.scene.map[fromBlock.row][fromBlock.column +1];
                break;
            }
            case "up":{
                if(fromBlock.row > 0){
                    toBlock = this.scene.map[fromBlock.row -1][fromBlock.column];}
                break;
            }
            case "left":{
                toBlock = this.scene.map[fromBlock.row][fromBlock.column -1];
                break;
            }
            case "down":{
                if(this.scene.map.length > fromBlock.row +1){
                    toBlock = this.scene.map[fromBlock.row +1][fromBlock.column];
                }
                break;
            }
        }
        if(!toBlock){
            toBlock = fromBlock;
            emptyToBlock = true;
            if(fromBlock.type == 'T'){
                fromBlock.occupy = true;
            }
            // console.log("t==f")
        }
        if(!emptyToBlock && toBlock.type == 'T'){
            teleport = true;
        }
        if(!toBlock.occupy){
            fromBlock.occupy = true;
            if(fromBlock.type == 'T'){
                fromBlock.occupy = false;
            }
            toBlock.occupy = true;
            if(toBlock.type == 'T'){
                toBlock.occupy = false;
            }
            this.scene.moving += 1;
            this.x = toBlock.x;
            this.y = toBlock.y;
            this.column = toBlock.column;
            this.row = toBlock.row;
            this.scene.tweens.add({
                targets: this.sprite,
                x:toBlock.x,
                y:toBlock.y -4,
                // angle: 1080 ,
                ease: 'linear',
                duration: (100 - setting.speed)*5,
                // offset: 0,
                onComplete:()=>{
                    // console.log("haha")
                    fromBlock.makeFront("PT");
                    this.scene.moving -= 1;
                    if(teleport){
                        this.telepoorto(toBlock,movement);
                    }
                    else{
                        this.move(toBlock,movement);
                    }
                }
            })
        }
        else{
            if(fromBlock.type == 'T'){
                fromBlock.occupy = true;
            }
            let scalingP = .85;
            let scaling = 1 - ((1 - scalingP)*3/5);
            let scaling2P = 1.15;
            let moreMove = 5/4;
            // console.log("scale:" + scaling)
            switch(movement){
                case "right":{
                    // console.log('r')
                    this.scene.tweens.add({
                        targets: this.sprite,
                        x:"+=" + (this.sprite.displayWidth*(1-scalingP) *moreMove),
                        // y:"+=15",
                        scaleX: scalingP * config.scaleMobile,
                        scaleY: scaling2P* config.scaleMobile,
                        // angle: 1080 ,
                        ease: 'power3',
                        duration: 70,
                        yoyo: true,
                        // offset: 0,
                        onComplete:()=>{
                            // console.log("haha")
                            // this.scene.moving -= 1;
                            // this.move(toBlock,movement);
                            if(this.scene.moving == 0){
                                this.scene.inputBlock=false;
                            }
                        }
                    })
                    
                    if(!emptyToBlock && toBlock.front && toBlock.type!='X' && toBlock.front.scale==config.scaleMobile){
                        this.scene.tweens.add({
                            targets: toBlock.front,
                            x:"+=" + (toBlock.front.displayWidth*(1-scaling)*moreMove *moreMove),
                            // y:"+=15",
                            scaleX: scaling* config.scaleMobile,
                            // scaleY: .85,
                            // angle: 1080 ,
                            ease: 'power3',
                            duration: 80,
                            yoyo: true,
                            // offset: 0,
                            onComplete:()=>{
                                // console.log("haha")
                                // this.scene.moving -= 1;
                                // this.move(toBlock,movement);
                                if(this.scene.moving == 0){
                                    this.scene.inputBlock=false;
                                }
                            }
                        })
                    }
                    break;
                }
                case "up":{
                    // console.log('u')
                    this.scene.tweens.add({
                        targets: this.sprite,
                        // x:"+=15",
                        y:"-=" + (this.sprite.displayHeight*(1-scalingP)*moreMove),
                        scaleX: scaling2P* config.scaleMobile,
                        scaleY: scalingP* config.scaleMobile,
                        // angle: 1080 ,
                        ease: 'power3',
                        duration: 70,
                        yoyo: true,
                        // offset: 0,
                        onComplete:()=>{
                            // console.log("haha")
                            // this.scene.moving -= 1;
                            // this.move(toBlock,movement);
                            if(this.scene.moving == 0){
                                this.scene.inputBlock=false;
                            }
                        }
                    })

                    if(!emptyToBlock && toBlock.front && toBlock.type!='X' && toBlock.front.scale==config.scaleMobile){
                        this.scene.tweens.add({
                            targets: toBlock.front,
                            // x:"+=" + (toBlock.front.displayWidth*(1-scaling)*5/4),
                            y:"-=" + (toBlock.front.displayHeight*(1-scaling)*moreMove *moreMove),
                            scaleY: scaling* config.scaleMobile,
                            // scaleY: .85,
                            // angle: 1080 ,
                            ease: 'power3',
                            duration: 80,
                            yoyo: true,
                            // offset: 0,
                            onComplete:()=>{
                                // console.log("haha")
                                // this.scene.moving -= 1;
                                // this.move(toBlock,movement);
                                if(this.scene.moving == 0){
                                    this.scene.inputBlock=false;
                                }
                            }
                        })
                    }
                    break;
                }
                case "left":{
                    // console.log('l')
                    this.scene.tweens.add({
                        targets: this.sprite,
                        x:"-=" + (this.sprite.displayWidth*(1-scalingP)*moreMove),
                        // y:"+=15",
                        scaleX: scalingP* config.scaleMobile,
                        scaleY: scaling2P* config.scaleMobile,
                        // scaleY: .85,
                        // angle: 1080 ,
                        ease: 'power3',
                        duration: 70,
                        yoyo: true,
                        // offset: 0,
                        onComplete:()=>{
                            // console.log("haha")
                            // this.scene.moving -= 1;
                            // this.move(toBlock,movement);
                            if(this.scene.moving == 0){
                                this.scene.inputBlock=false;
                            }
                        }
                    })
                    
                    if(!emptyToBlock && toBlock.front && toBlock.type!='X' && toBlock.front.scale==config.scaleMobile){
                        this.scene.tweens.add({
                            targets: toBlock.front,
                            x:"-=" + (toBlock.front.displayWidth*(1-scaling)*moreMove *moreMove),
                            // y:"+=15",
                            scaleX: scaling* config.scaleMobile,
                            // scaleY: .85,
                            // angle: 1080 ,
                            ease: 'power3',
                            duration: 80,
                            yoyo: true,
                            // offset: 0,
                            onComplete:()=>{
                                // console.log("haha")
                                // this.scene.moving -= 1;
                                // this.move(toBlock,movement);
                                if(this.scene.moving == 0){
                                    this.scene.inputBlock=false;
                                }
                            }
                        })
                    }
                    break;
                }
                case "down":{
                    // console.log('d')
                    this.scene.tweens.add({
                        targets: this.sprite,
                        // x:"+=15",
                        y:"+=" + (this.sprite.displayHeight*(1-scalingP)*moreMove),
                        scaleX: scaling2P* config.scaleMobile,
                        scaleY: scalingP* config.scaleMobile,
                        // angle: 1080 ,
                        ease: 'power3',
                        duration: 70,
                        yoyo: true,
                        // offset: 0,
                        onComplete:()=>{
                            // console.log("haha")
                            // this.scene.moving -= 1;
                            // this.move(toBlock,movement);
                            if(this.scene.moving == 0){
                                // console.log("MUHAHA")
                                this.scene.inputBlock=false;
                            }
                        }
                    })
                    
                    if(!emptyToBlock && toBlock.front && toBlock.type!='X' && toBlock.front.scale==config.scaleMobile){
                        this.scene.tweens.add({
                            targets: toBlock.front,
                            // x:"+=" + (toBlock.front.displayWidth*(1-scaling)*5/4),
                            y:"+=" + (toBlock.front.displayHeight*(1-scaling)*moreMove *moreMove),
                            scaleY: scaling* config.scaleMobile,
                            // scaleY: .85,
                            // angle: 1080 ,
                            ease: 'power3',
                            duration: 80,
                            yoyo: true,
                            // offset: 0,
                            onComplete:()=>{
                                // console.log("haha")
                                // this.scene.moving -= 1;
                                // this.move(toBlock,movement);
                                if(this.scene.moving == 0){
                                    this.scene.inputBlock=false;
                                }
                            }
                        })
                    }
                    break;
                }
            }
        }

        if(this.scene.moving == 0){
            // console.log("checkWin");
            if(this.scene.checkWin()){
                // console.log("WIN!");
                this.scene.sound.play('win');
                if(config.currentLevel == this.scene.numOfLvls){//ADD this to next btn 2
                    // console.log("last level WIN!");
                    this.scene.players.forEach((player, index)=> {
                        var particles = this.scene.add.particles('star')
                        var emitter = particles.createEmitter({
                            x: player.x,
                            y: player.y,
                            rotate: {start: 0, end: 180},
                            speed: 300,
                            lifespan: 700,
                            scale: config.scaleMobile * 2/3,
                            // blendMode: 'MULTIPLY',
                            maxParticles: 5,
                            gravityY: 1000,
                            angle: {min: 250, max: 290},
                            deathCallback:()=>{
                                // console.log("in end pf level particle death")
                                this.scene.scene.start('loseScene');
                            }
                        });
                    });
                }
                else{
                    this.loadNext();
                }
            }
        }

        // let win = false;
        // let recieved = 0;
        // if(this.scene.moving == 0){
        //     console.log("win check")
        //     this.scene.destinations.forEach((dest,dIndex) => {
        //         this.scene.players.forEach((plyr,pIndex) => {
        //             if((dest.type == plyr.type) && (dest.row == plyr.row) && (dest.column == plyr.column)){
        //                 recieved += 1;
        //             }
        //         });
        //     });
        //     if(recieved == this.scene.destinations.length){
        //         win = true;
        //         console.log("WIN!");
        //         if(config.currentLevel == this.scene.numOfLvls){//ADD this to next btn 2
        //             console.log("last level WIN!");
        //             this.scene.scene.start('loseScene');
        //         }
        //         else{
        //             this.loadNext();
        //         }
        //     }
        // }
        // return win;
    }

    searchOtherT(block){
        for (let j = 0; j < this.scene.map.length; j++) {
            for (let i = 0; i < this.scene.map[j].length; i++) {
                if(this.scene.map[j][i].type == 'T' && (this.scene.map[j][i].row !== block.row || this.scene.map[j][i].column != block.column)){
                    // console.log("did found!")
                    return this.scene.map[j][i];
                }
            }
        }
        // console.log("didnt found!")
        return block;
    }

    loadNext(){
        this.scene.moving = 3;
        this.scene.players.forEach((player, index)=> {
            var particles = this.scene.add.particles('star');
            var emitter = particles.createEmitter({
                x: player.x,
                y: player.y,
                rotate: {start: 0, end: 180},
                speed: 300,
                lifespan: 700,
                // scale: 1/3,
                // blendMode: 'MULTIPLY',
                maxParticles: 5,
                gravityY: 1000,
                angle: {min: 250, max: 290},
                deathCallback:()=>{
                    if(config.clearedLevel < this.scene.currentLevel+1){
                        config.clearedLevel = this.scene.currentLevel+1;
                    }
                    let x=this.scene.cameras.main.centerX;
                    let y=this.scene.cameras.main.centerY;
                    let width = MOBILE ? this.scene.cameras.main.centerX*2.2-x : this.scene.cameras.main.centerX*1.9-x;
                    let height = MOBILE ? this.scene.cameras.main.centerY*1.7-y : this.scene.cameras.main.centerY*1.9-y;
                    this.scene.winBg=this.scene.add.rexRoundRectangle(0,0,x*10,y*10,0,config.winBackGroundColor,1);
                    this.scene.winBg.setInteractive().setAlpha(0);
                    fader(this.scene.winBg,this.scene,true, config.fadeDuration,()=>{
                        var particles = this.scene.add.particles('star')
                        var emitter = particles.createEmitter({
                            x: 0,
                            y: {min:80, max: 120},
                            // rotate: {start: 0, end: Math.random > .5 ? 1800 : -1800},
                            speed: {min:600 * this.scene.cameras.main.centerX/900, max:750 * this.scene.cameras.main.centerX/900},
                            lifespan: 3000,
                            scale: {start: 1 / 7, end: 1 / 7},
                            blendMode: 'OVERLAY',
                            maxParticles: 15,
                            gravityY: 1300,
                            tint: [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff],
                            angle: {min: 320, max: 400},
                            deathCallback:()=>{
                            }
                        });
                        var emitter2 = particles.createEmitter({
                            x: this.scene.cameras.main.centerX*2,
                            y: 80,
                            // rotate: {start: 0, end: Math.random > .5 ? 1800 : -1800},
                            speed: {min:600 * this.scene.cameras.main.centerX/900, max:750 * this.scene.cameras.main.centerX/900},
                            lifespan: 3000,
                            scale: {start: 1 / 7, end: 1 / 7},
                            blendMode: 'OVERLAY',
                            maxParticles: 15,
                            gravityY: 1300,
                            tint: [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff],
                            angle: {min: 140, max: 220},
                            deathCallback:()=>{
                            }
                        });
            
                    },205);
                    this.scene.winPanel=this.scene.add.rexRoundRectangle(x, y, width, height, 10,config.winPanelColor, 1).setAlpha(0);
                    fader(this.scene.winPanel,this.scene,true, config.fadeDuration,()=>{
                        this.scene.winText=this.scene.add.text(x,y - height/4,setting.winText,{color:config.TextColor,fontSize:30 * (width/height)}).setAlpha(0);;
                        this.scene.winText.x-=this.scene.winText.displayWidth/2;
                        this.scene.winText.y-=this.scene.winText.displayHeight/2;
                        fader(this.scene.winText,this.scene,true)
                        this.scene.retryButtonWin=new ButtonPic(this.scene,x+(180), y + height/4, 90 ,90 ,"retry",()=>{this.scene.changeLevel(this.scene.currentLevel)});
                        this.scene.retryButtonWin.setalpha(0);
                        this.scene.retryButtonWin.fade(true)
                        this.scene.tweens.add({
                            targets: this.scene.retryButtonWin,
                            ease: 'linear',
                            duration: 1000,
                            y:y,
                        });
                        this.scene.nextLevelButtonWin=new ButtonPic(this.scene,x, y + height/4, 90 ,90 ,"next",()=>{
                            this.scene.changeLevel(this.scene.currentLevel+1)
                        });
                        this.scene.nextLevelButtonWin.setalpha(0);
                        this.scene.nextLevelButtonWin.fade(true)
                        this.scene.goToLevelSelect=new ButtonPic(this.scene,x-(180), y+ height/4, 90 ,90 ,"menu",()=>{
                            this.scene.scene.start("levelSelect");
                        });
                        this.scene.goToLevelSelect.setalpha(0);
                        this.scene.goToLevelSelect.fade(true)
                     
                    },190);                  
                }
            });
        });
    }
}

