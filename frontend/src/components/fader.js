// import config from "../config/config";
import Koji from '@withkoji/vcc';
import config from '../config/config';
const setting = Koji.config.settings;
export default (gameObject,scene,fadeInBool,fadeDuration=config.fadeDuration,callBack=null)=>{
    // console.log(fadeDuration);
    if(fadeInBool){
        scene.tweens.add({
            targets:gameObject,
            alpha:{from:0,to:1},
            ease:'Linear',
            duration:fadeDuration,
            repeat:0,
            yoyo:false,
            onComplete:callBack
        });
    }
    else{
        scene.tweens.add({
            targets:gameObject,
            alpha:{from:1,to:0},
            ease:'Linear',
            duration:fadeDuration,
            repeat:0,
            yoyo:false,
            onComplete:callBack
        });
    }
}