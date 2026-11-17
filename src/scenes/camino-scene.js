import {VW,VH,WORLD as _W,GROUND} from '../config.js';
import {State} from '../core/game-state.js';
import {Dialogue} from '../core/dialogue-ui.js';
import {Audio} from '../systems/audio-manager.js';
import {WalkScene,tilemap,grid} from './walk-scene.js';
import {CAMINO_INTRO,CAMINO_ITEMS,REACCION,BOLSA,VIEJA_SIGUE,CARTEL,setEnd} from '../data/chapter-02.js';
const WORLD=1600,COLS=100;
function casa(D,a,b,top,open){
  for(let r=top;r<=4;r++){const o=4-r;for(let x=a+o;x<=b-o;x++)D[r][x]=4}
  for(let r=5;r<=7;r++)for(let x=a;x<=b;x++)D[r][x]=r===7?10:3;
  const m=(a+b)>>1;D[5][a+1]=open?8:7;D[5][b-1]=open?8:7;D[6][m]=6;D[7][m]=5;return m;
}
export class CaminoScene extends WalkScene{
  constructor(){super('Camino')}
  create(){
    setEnd(2);Audio.wind(.1);
    if(State.data.stage==='fin2'){this.noPause=true;this.endChapter();return}
    const afuera=State.data.stage==='almacen_hecho';
    const S=grid(COLS),D=grid(COLS);for(let x=0;x<COLS;x++){S[8][x]=0;S[9][x]=1;S[10][x]=2}
    casa(D,10,17,3,false);casa(D,26,34,3,true);casa(D,42,49,3,false);const door=casa(D,76,90,2,true);D[5][78]=8;D[5][88]=8;
    this.add.image(0,0,'sky_dia').setOrigin(0).setScrollFactor(0).setDepth(-3);
    const h=this.add.tileSprite(0,38,VW,90,'hills').setOrigin(0).setScrollFactor(0).setDepth(-2).setAlpha(.5);
    const t=this.add.tileSprite(0,58,VW,70,'trees').setOrigin(0).setScrollFactor(0).setDepth(-1).setAlpha(.4);this.layers=[[h,.15],[t,.4]];
    tilemap(this,S,'tiles2',0);tilemap(this,D,'tiles2',1);
    this.initWalk(WORLD,afuera?1340:60);
    this.add.image(door*16+8,86,'letrero').setDepth(2);
    this.add.image(1500,GROUND,'cartel').setOrigin(.5,1).setDepth(2);
    this.vieja=this.add.sprite(afuera?1285:20,GROUND+1,'vieja').setOrigin(.5,1).setDepth(3).play('vieja_idle');
    this.bolsa=this.add.image(this.vieja.x,GROUND-14,'bolsa').setOrigin(.5,1).setDepth(4).setVisible(afuera);
    for(let i=0;i<4;i++){const m=this.add.image(i*420,GROUND-22,'mist').setDepth(12).setScrollFactor(.8).setAlpha(.5);this.tweens.add({targets:m,x:m.x+80,duration:10000+i*1200,yoyo:true,repeat:-1,ease:'Sine.easeInOut'})}
    this.add.rectangle(0,0,VW,VH,0x000000,0).setOrigin(0).setScrollFactor(0).setDepth(30);
    this.add.image(0,0,'vig').setOrigin(0).setScrollFactor(0).setDepth(31).setAlpha(.6);
    this.cameras.main.fadeIn(1000);this.cartelListo=false;
    this.items=[...CAMINO_ITEMS,
      {id:'c_almacen',x:door*16+8,go:async()=>{this.lucho.play('lucho_idle');await Dialogue.run([{t:'La puerta del almacén de don Ricardo. Detrás, el murmullo de gente que sabe cuánto debe.'}]);this.cameras.main.fadeOut(900);await this.delay(950);this.scene.start('Almacen')},when:()=>!afuera},
      {id:'c_cartel',x:1500,lines:CARTEL,when:()=>afuera&&this.cartelListo,done:()=>this.endChapter(true)}];
    this.busy=true;
    this.time.delayedCall(900,async()=>{afuera?await this.escenaBolsa():await Dialogue.run(CAMINO_INTRO);this.busy=false});
  }
  async escenaBolsa(){
    const dec=State.data.decisions.ricardo;
    await Dialogue.run([...REACCION(dec),{t:'Al salir del almacén, Lucho se sacude la harina con el orgullo en el suelo.'},{t:'Algo cuelga de la montura de Vieja: una bolsa pequeña. Contiene dinero.'}]);
    await Dialogue.run(BOLSA(()=>this.bolsa.setVisible(false)));
    this.vieja.play('vieja_neigh');this.vieja.once('animationcomplete',()=>this.vieja.play('vieja_idle'));
    await Dialogue.run(VIEJA_SIGUE);this.cartelListo=true;
  }
  endChapter(fade){
    State.finish();State.setStage('fin2');
    const show=()=>{document.getElementById('end').hidden=false};
    document.getElementById('b-again').onclick=()=>{document.getElementById('end').hidden=true;State.reset();this.scene.start('Campo')};
    if(fade){this.cameras.main.fadeOut(1800);this.time.delayedCall(1900,show)}else show();
  }
  update(t,dt){
    if(!this.lucho)return;this.walkUpdate(t,dt);
    if(State.data.stage!=='almacen_hecho'){const tx=this.lucho.x-(this.lucho.flipX?-30:30),d=tx-this.vieja.x;if(Math.abs(d)>1)this.vieja.x+=d*Math.min(1,dt/450);this.vieja.setFlipX(this.lucho.x<this.vieja.x-8)}
  }
}
