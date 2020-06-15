import 'phaser';
import config from '../config/config';
import {MOBILE} from '../config/config';

export default class Block {
    constructor(scene, x, y, column, row, frontSprite = '', backSprite = '', type = '_', occupy = false){//types : "X": blocked, "_": empty, "P": player
        // console.log("bruh")
        this.x = x;
        this.y = y;
        this.column = column;
        this.row = row;
        this.type = type;
        this.occupy = occupy;
        this.scene=scene;
        if(frontSprite && !frontSprite == ''){
            // console.log("front")
            this.front = this.scene.physics.add.sprite(this.x, this.y -4, frontSprite).setScale(0);
            this.scene.tweens.add({
                targets: this.front,
                scale: config.scaleMobile,
                ease: 'power2',
                duration: 320,
                delay: Math.random()*300,
                // yoyo: true,
                // offset: 0,
                onComplete:()=>{
                }
            })
            // this.front.x += this.front.displayWidth/2 ;
            // this.front.y += this.front.displayHeight/2 ;
        }
        if(backSprite && !backSprite == ''){
            // console.log("back")
            this.back = this.scene.physics.add.sprite(this.x, this.y, backSprite).setScale(0);;
            this.scene.tweens.add({
                targets: this.back,
                scale: config.scaleMobile,
                ease: 'power2',
                duration: 320,
                delay: Math.random()*250 + 70,
                // yoyo: true,
                // offset: 0,
                onComplete:()=>{
                }
            })
            // this.back.x += this.back.displayWidth/2 ;
            // this.back.y += this.back.displayHeight/2 ;
        }
    }
    makeFront(supuraito='PT'){
        if(this.type != 'T'){
            this.front = this.scene.physics.add.sprite(this.x, this.y -4, supuraito);
            // this.back.x += this.back.displayWidth/2 ;
            // this.back.y += this.back.displayHeight/2 ;
            this.front.setScale(0);
            this.scene.tweens.add({
                targets: this.front,
                scale: config.scaleMobile,
                ease: 'power3',
                duration: 100,
                // yoyo: true,
                // offset: 0,
                onComplete:()=>{
                }
            })
            
            // this.scene.players.forEach((player, index)=> {
            //     this.scene.children.bringToTop(player.sprite);
            // });
        }
    }
}