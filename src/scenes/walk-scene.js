import {VH,TILE,GROUND} from '../config.js';
import {State} from '../core/game-state.js';
import {Dialogue} from '../core/dialogue-ui.js';
// Base para escenas laterales del Capítulo 2 (mismos controles, velocidad, animaciones y cámara que el Capítulo 1).
export function tilemap(scene,grid,ts,depth){const m=scene.make.tilemap({data:grid,tileWidth:TILE,tileHeight:TILE});const t=m.addTilesetImage(ts,ts,TILE,TILE,0,0);return m.createLayer(0,t,0,0).setDepth(depth)}
export const grid=(c,r=11)=>Array.from({length:r},()=>Array(c).fill(-1));
export class WalkScene extends Phaser.Scene{
  initWalk(world,startX){
    this.world=world;this.busy=false;this.paused=false;this.items=[];this.layers=[];
    this.lucho=this.add.sprite(startX,GROUND+1,'lucho').setOrigin(.5,1).setDepth(4).play('lucho_idle');
    const cam=this.cameras.main;cam.setBounds(0,0,world,VH);cam.startFollow(this.lucho,true,.08,.08);
    this.k=this.input.keyboard.addKeys({a:'A',d:'D',l:'LEFT',r:'RIGHT',e:'E'});
    this.prompt=this.add.image(0,0,'ebox').setDepth(25).setVisible(false);
    this.esc=e=>{if(e.key==='Escape'&&!Dialogue.active&&!this.noPause)this.togglePause()};window.addEventListener('keydown',this.esc);
    this.events.once('shutdown',()=>{window.removeEventListener('keydown',this.esc);document.getElementById('pause').hidden=true});
    document.getElementById('b-resume').onclick=()=>this.togglePause();
    document.getElementById('b-menu').onclick=()=>{document.getElementById('pause').hidden=true;this.scene.start('Menu')};
  }
  togglePause(){this.paused=!this.paused;document.getElementById('pause').hidden=!this.paused}
  get blocked(){return this.busy||this.paused||Dialogue.active}
  delay(ms){return new Promise(r=>this.time.delayedCall(ms,r))}
  tw(cfg){return new Promise(r=>this.tweens.add({...cfg,onComplete:r}))}
  walkUpdate(t,dt){
    const cam=this.cameras.main;for(const [ts,f] of this.layers)ts.tilePositionX=cam.scrollX*f;
    if(this.blocked){if(this.lucho.anims.currentAnim?.key==='lucho_walk')this.lucho.play('lucho_idle');this.prompt.setVisible(false);return}
    const k=this.k,dir=(k.d.isDown||k.r.isDown?1:0)-(k.a.isDown||k.l.isDown?1:0);
    if(dir){this.lucho.x=Phaser.Math.Clamp(this.lucho.x+dir*46*dt/1000,16,this.world-16);this.lucho.setFlipX(dir<0);if(this.lucho.anims.currentAnim.key!=='lucho_walk')this.lucho.play('lucho_walk')}
    else if(this.lucho.anims.currentAnim.key==='lucho_walk')this.lucho.play('lucho_idle');
    const it=this.items.find(i=>(!i.when||i.when())&&Math.abs(i.x-this.lucho.x)<26);
    this.prompt.setVisible(!!it);if(it)this.prompt.setPosition(it.x,GROUND-44+Math.round(Math.sin(t/300)));
    if(it&&Phaser.Input.Keyboard.JustDown(k.e))this.interact(it);
  }
  async interact(it){
    this.busy=true;
    if(it.go)await it.go();else{this.lucho.play('lucho_act');await Dialogue.run(State.seen(it.id)&&it.again?it.again:it.lines);this.lucho.play('lucho_idle')}
    State.visit(it.id);this.busy=false;if(it.done)await it.done();
  }
}
