import {VW,VH,TILE,WORLD,GROUND} from '../config.js';
import {State} from '../core/game-state.js';
import {Dialogue} from '../core/dialogue-ui.js';
import {Audio} from '../systems/audio-manager.js';
import {INTRO,ITEMS,FORASTERO} from '../data/chapter-01.js';
import {setEnd} from '../data/chapter-02.js';
export class CampoScene extends Phaser.Scene{
  constructor(){super('Campo')}
  create(){
    this.busy=false;this.paused=false;this.ending=false;
    const cols=WORLD/TILE,rows=11,grid=()=>Array.from({length:rows},()=>Array(cols).fill(-1));
    const S=grid(),D=grid();
    for(let x=0;x<cols;x++){S[8][x]=x>=74?3:0;S[9][x]=1;S[10][x]=2}
    for(const [a,b] of [[18,24],[40,44],[60,66]])for(let x=a;x<=b;x++)D[7][x]=4;
    for(let x=28;x<40;x++)D[7][x]=5;
    for(let x=50;x<=53;x++)D[2][x]=7;for(let x=49;x<=54;x++)D[3][x]=7;for(let x=48;x<=55;x++)D[4][x]=7;
    for(let r=5;r<=7;r++)for(let x=48;x<=55;x++)D[r][x]=6;D[5][50]=10;D[5][53]=10;D[6][51]=11;D[7][51]=9;
    this.add.image(0,0,'sky').setOrigin(0).setScrollFactor(0).setDepth(-3);
    this.hills=this.add.tileSprite(0,38,VW,90,'hills').setOrigin(0).setScrollFactor(0).setDepth(-2);
    this.trees=this.add.tileSprite(0,58,VW,70,'trees').setOrigin(0).setScrollFactor(0).setDepth(-1);
    for(const [g,d] of [[S,0],[D,1]]){const m=this.make.tilemap({data:g,tileWidth:TILE,tileHeight:TILE});const ts=m.addTilesetImage('tiles','tiles',TILE,TILE,0,0);m.createLayer(0,ts,0,0).setDepth(d)}
    this.add.image(1130,GROUND,'tree').setOrigin(.5,1).setDepth(2);
    this.add.image(330,GROUND,'tools').setOrigin(.5,1).setDepth(2);
    this.add.image(1010,GROUND,'table').setOrigin(.5,1).setDepth(2);
    for(const x of [808,856]){const g=this.add.image(x,88,'glow').setBlendMode(Phaser.BlendModes.ADD).setDepth(10);this.tweens.add({targets:g,alpha:{from:.5,to:.9},duration:900+x,yoyo:true,repeat:-1})}
    this.vieja=this.add.sprite(190,GROUND+1,'vieja').setOrigin(.5,1).setDepth(3).play('vieja_idle');
    this.lucho=this.add.sprite(110,GROUND+1,'lucho').setOrigin(.5,1).setDepth(4).play('lucho_idle');
    this.fora=this.add.sprite(0,GROUND+1,'forastero').setOrigin(.5,1).setDepth(4).setAlpha(0).play('fora_idle');
    for(let i=0;i<5;i++){const m=this.add.image(i*280,GROUND-24+(i%2)*8,'mist').setDepth(12).setScrollFactor(.8).setAlpha(.9);this.tweens.add({targets:m,x:m.x+90,duration:9000+i*1300,yoyo:true,repeat:-1,ease:'Sine.easeInOut'})}
    for(let i=0;i<40;i++){const m=this.add.image(Math.random()*WORLD,40+Math.random()*90,'mote').setDepth(11).setAlpha(.3);this.tweens.add({targets:m,x:m.x+20+Math.random()*30,y:m.y-10+Math.random()*20,duration:4000+Math.random()*4000,yoyo:true,repeat:-1,ease:'Sine.easeInOut'})}
    this.fg=this.add.tileSprite(0,VH-40,VW,40,'fg').setOrigin(0).setScrollFactor(0).setDepth(20);
    this.dark=this.add.rectangle(0,0,VW,VH,0x000000,0).setOrigin(0).setScrollFactor(0).setDepth(30);
    this.add.image(0,0,'vig').setOrigin(0).setScrollFactor(0).setDepth(31);
    this.prompt=this.add.image(0,0,'ebox').setDepth(25).setVisible(false);
    const cam=this.cameras.main;cam.setBounds(0,0,WORLD,VH);cam.startFollow(this.lucho,true,.08,.08);cam.fadeIn(1200);
    const K=this.input.keyboard;this.k=K.addKeys({a:'A',d:'D',l:'LEFT',r:'RIGHT',e:'E'});
    this.esc=e=>{if(e.key==='Escape'&&!Dialogue.active&&!this.ending)this.togglePause()};window.addEventListener('keydown',this.esc);
    this.events.once('shutdown',()=>window.removeEventListener('keydown',this.esc));
    document.getElementById('b-resume').onclick=()=>this.togglePause();
    document.getElementById('b-menu').onclick=()=>{document.getElementById('pause').hidden=true;this.scene.start('Menu')};
    document.getElementById('b-again').onclick=()=>{document.getElementById('end').hidden=true;State.reset();this.scene.restart()};
    document.getElementById('b-next').onclick=()=>{document.getElementById('end').hidden=true;State.startChapter(2);this.scene.start('Camino')};setEnd(1);
    Audio.wind(.12);
    if(!State.seen('intro')){this.busy=true;this.time.delayedCall(1400,async()=>{await Dialogue.run(INTRO);State.visit('intro');this.busy=false})}
  }
  togglePause(){this.paused=!this.paused;document.getElementById('pause').hidden=!this.paused}
  get blocked(){return this.busy||this.paused||Dialogue.active}
  update(t,dt){
    const cam=this.cameras.main;this.hills.tilePositionX=cam.scrollX*.15;this.trees.tilePositionX=cam.scrollX*.4;this.fg.tilePositionX=cam.scrollX*1.5;
    if(this.blocked){if(this.lucho.anims.currentAnim?.key==='lucho_walk')this.lucho.play('lucho_idle');this.prompt.setVisible(false);return}
    const k=this.k,dir=(k.d.isDown||k.r.isDown?1:0)-(k.a.isDown||k.l.isDown?1:0);
    if(dir){this.lucho.x=Phaser.Math.Clamp(this.lucho.x+dir*46*dt/1000,16,WORLD-16);this.lucho.setFlipX(dir<0);if(this.lucho.anims.currentAnim.key!=='lucho_walk')this.lucho.play('lucho_walk')}
    else if(this.lucho.anims.currentAnim.key==='lucho_walk')this.lucho.play('lucho_idle');
    this.vieja.setFlipX(this.lucho.x<this.vieja.x-40);
    const it=ITEMS.find(i=>Math.abs(i.x-this.lucho.x)<26);this.near=it;
    this.prompt.setVisible(!!it);if(it)this.prompt.setPosition(it.x,GROUND-44+Math.round(Math.sin(t/300)));
    if(it&&Phaser.Input.Keyboard.JustDown(k.e))this.interact(it);
  }
  async interact(it){
    this.busy=true;this.lucho.play('lucho_act');
    if(it.id==='vieja'){this.vieja.play('vieja_neigh');this.vieja.once('animationcomplete',()=>this.vieja.play('vieja_idle'))}
    await Dialogue.run(State.seen(it.id)?it.again:it.lines);State.visit(it.id);
    this.lucho.play('lucho_idle');this.busy=false;
    const D=State.data.visited;if(!this.ending&&['vieja','cuaderno'].every(i=>D.includes(i))&&ITEMS.filter(i=>D.includes(i.id)).length>=4)this.forastero();
  }
  delay(ms){return new Promise(r=>this.time.delayedCall(ms,r))}
  tw(cfg){return new Promise(r=>this.tweens.add({...cfg,onComplete:r}))}
  async forastero(){
    this.ending=true;this.busy=true;await this.delay(800);
    this.tweens.add({targets:this.dark,alpha:.45,duration:3000});Audio.wind(.02,3);
    this.cameras.main.shake(900,.002);this.vieja.play('vieja_neigh');await this.delay(1800);
    this.fora.setPosition(Math.min(this.lucho.x+90,WORLD-20),GROUND+1).setFlipX(true);
    await this.tw({targets:this.fora,alpha:1,duration:3500});await this.delay(600);
    await Dialogue.run(FORASTERO);
    await this.tw({targets:this.fora,alpha:0,duration:3000});
    State.finish();this.cameras.main.fadeOut(1800);await this.delay(1900);
    document.getElementById('end').hidden=false;
  }
}
