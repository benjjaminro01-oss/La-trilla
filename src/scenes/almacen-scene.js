import {VW,VH,GROUND} from '../config.js';
import {State} from '../core/game-state.js';
import {Dialogue} from '../core/dialogue-ui.js';
import {WalkScene,tilemap,grid} from './walk-scene.js';
import {RICARDO,ALMACEN_ITEMS} from '../data/chapter-02.js';
const WORLD=480,COLS=30;
export class AlmacenScene extends WalkScene{
  constructor(){super('Almacen')}
  create(){
    const S=grid(COLS),D=grid(COLS);
    for(let x=0;x<COLS;x++){for(let r=0;r<8;r++)S[r][x]=1;S[8][x]=0;S[9][x]=3;S[10][x]=3}
    for(const x of [6,7,8,9,20,21,22,23,24]){S[3][x]=2;S[5][x]=2}
    for(const x of [3,13,27])S[3][x]=4;
    this.add.rectangle(0,0,VW,VH,0x1A1918).setOrigin(0).setScrollFactor(0).setDepth(-3);
    tilemap(this,S,'tiles3',0);
    this.initWalk(WORLD,40);this.noPause=false;
    this.add.image(95,GROUND,'sacos').setOrigin(.5,1).setDepth(2);
    this.ricardo=this.add.sprite(300,GROUND-2,'ricardo').setOrigin(.5,1).setDepth(2).play('ricardo_idle');
    this.add.image(300,GROUND+1,'mostrador').setOrigin(.5,1).setDepth(3);
    this.v1=this.add.sprite(215,GROUND+1,'aldeano').setOrigin(.5,1).setDepth(2).setFlipX(true).play('aldeano_idle');
    this.v2=this.add.sprite(395,GROUND+1,'aldeano').setOrigin(.5,1).setDepth(2).setTint(0xb9a98f).play('aldeano_idle');
    for(const x of [120,240,380]){const g=this.add.image(x,50,'glow').setBlendMode(Phaser.BlendModes.ADD).setDepth(10).setAlpha(.45);this.tweens.add({targets:g,alpha:.7,duration:1300+x,yoyo:true,repeat:-1})}
    this.add.rectangle(0,0,VW,VH,0x000000,.25).setOrigin(0).setScrollFactor(0).setDepth(30);
    this.add.image(0,0,'vig').setOrigin(0).setScrollFactor(0).setDepth(31);
    this.cameras.main.fadeIn(900);
    this.items=[...ALMACEN_ITEMS,{id:'a_ricardo',x:285,go:()=>this.ricardoEscena()}];
    this.busy=true;this.time.delayedCall(700,async()=>{await Dialogue.run([{t:'El almacén de don Ricardo. Olor a harina, a leña y a deudas.'}]);this.busy=false});
  }
  async ricardoEscena(){
    this.lucho.play('lucho_idle');
    await Dialogue.run(RICARDO);
    this.lucho.setFlipX(true).play('lucho_walk');
    await this.tw({targets:this.lucho,x:112,duration:1700});
    this.lucho.play('lucho_idle');this.cameras.main.shake(350,.003);
    for(let i=0;i<22;i++){const m=this.add.image(this.lucho.x+Phaser.Math.Between(-14,14),GROUND-30,'mote').setDepth(15).setScale(2).setTint(0xf0ece6);this.tweens.add({targets:m,y:GROUND-Phaser.Math.Between(0,26),x:m.x+Phaser.Math.Between(-18,18),alpha:0,duration:1600+i*50})}
    this.lucho.setTint(0xe6e1d9);
    await Dialogue.run([{t:'Al irse, Lucho choca con un saco. La harina se derrama sobre él.'},{t:'La humillación es profunda. Nadie lo ayuda.'}]);
    State.setStage('almacen_hecho');this.cameras.main.fadeOut(1000);await this.delay(1050);this.scene.start('Camino');
  }
  update(t,dt){if(this.lucho)this.walkUpdate(t,dt)}
}
