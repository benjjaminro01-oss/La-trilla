import {VW,VH} from './config.js';
import {BootScene} from './scenes/boot-scene.js';
import {MenuScene} from './scenes/menu-scene.js';
import {CampoScene} from './scenes/campo-scene.js';
import {Dialogue} from './core/dialogue-ui.js';
Dialogue.init();
new Phaser.Game({type:Phaser.AUTO,parent:'game',width:VW,height:VH,pixelArt:true,roundPixels:true,backgroundColor:'#1A1918',
  scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},scene:[BootScene,MenuScene,CampoScene]});
