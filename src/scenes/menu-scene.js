import {State} from '../core/game-state.js';
import {Audio} from '../systems/audio-manager.js';
export class MenuScene extends Phaser.Scene{
  constructor(){super('Menu')}
  create(){
    this.add.image(0,0,'sky').setOrigin(0);this.add.tileSprite(0,38,320,90,'hills').setOrigin(0);this.add.tileSprite(0,58,320,70,'trees').setOrigin(0);
    const m=document.getElementById('menu'),cont=document.getElementById('b-cont');m.hidden=false;
    cont.hidden=!State.load();
    const go=()=>{Audio.init();m.hidden=true;this.scene.start(State.data.chapter===2?'Camino':'Campo')};
    document.getElementById('b-start').onclick=()=>{State.reset();go()};
    cont.onclick=go;
  }
}
