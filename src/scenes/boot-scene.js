// Arte PROVISIONAL generado por código (Pixel Art 2D). Sustituir por sprites oficiales cuando existan las hojas de modelo.
let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
const R=(c,col,x,y,w,h)=>{c.fillStyle=col;c.fillRect(x|0,y|0,w,h)};
const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const mix=(a,b,t)=>{const A=hex(a),B=hex(b);return'rgb('+A.map((v,i)=>Math.round(v+(B[i]-v)*t)).join(',')+')'};
import {makeChapter2Textures} from './boot-ch2.js';
export class BootScene extends Phaser.Scene{
  constructor(){super('Boot')}
  tex(k,w,h,f){const t=this.textures.createCanvas(k,w,h);f(t.getContext(),w,h);t.refresh();return t}
  create(){
    const T=(...a)=>this.tex(...a);
    T('sky',320,180,(c,w,h)=>{for(let y=0;y<h;y+=3){const t=y/h;R(c,t<.6?mix('#0d0d0e','#1A1918',t/.6):mix('#1A1918','#3D2314',(t-.6)/.4),0,y,w,3)}
      for(let i=0;i<40;i++)R(c,'#F5F2F0',rnd()*320,rnd()*70,1,1);
      for(let y=-9;y<=9;y++)for(let x=-9;x<=9;x++){const d=x*x+y*y;if(d<=64)R(c,'#F5F2F0',250+x,30+y,1,1);else if(d<=110)R(c,'rgba(245,242,240,.12)',250+x,30+y,1,1)}});
    T('hills',320,90,(c,w,h)=>{for(let x=0;x<w;x++){const hh=36+Math.round(12*Math.sin(x*6.2832*2/w)+5*Math.sin(x*6.2832*5/w));R(c,'#242120',x,h-hh,1,hh)}});
    T('trees',320,70,(c,w,h)=>{for(let x=10;x<w;x+=32){const th=38+((x*7)%20);R(c,'#151413',x+3,h-8,2,8);for(let y=0;y<th;y++){const ww=Math.round(5*Math.sin(Math.PI*(y+4)/(th+8)))+1;R(c,'#1d1b1a',x+4-ww,h-8-y,ww*2,1)}}});
    T('fg',320,40,(c,w,h)=>{for(let x=0;x<w;x+=2){const bh=6+rnd()*26;R(c,'#0a0908',x,h-bh,1,bh)}});
    T('tiles',16*12,16,(c)=>{const dirt=(x)=>{R(c,'#3D2314',x,0,16,16);for(let i=0;i<10;i++)R(c,rnd()>.5?'#4d2e1b':'#2f1a0f',x+rnd()*15,rnd()*15,2,1)};
      dirt(0);R(c,'#5b4a2a',0,0,16,3);for(let i=0;i<5;i++)R(c,'#7a6538',rnd()*15,0,1,2);
      dirt(16);R(c,'#2f1a0f',32,0,16,16);for(let i=0;i<8;i++)R(c,'#1A1918',32+rnd()*15,rnd()*15,2,1);
      R(c,'#4d3524',48,0,16,16);R(c,'#7d6347',48,0,16,2);R(c,'#6a5238',48,2,16,2);
      R(c,'#2a1b10',64+2,2,3,14);R(c,'#2a1b10',64+11,2,3,14);R(c,'#3b2616',64,4,16,3);R(c,'#3b2616',64,10,16,3);
      for(let i=0;i<7;i++){const x=80+1+i*2;R(c,'#8a6f3a',x,4+(i%3)*2,1,12);if(i%3)R(c,'#C89D54',x,2+(i%3)*2,1,3)}
      R(c,'#6b5238',96,0,16,16);R(c,'#5b4533',96,5,16,1);R(c,'#5b4533',96,11,16,1);R(c,'#5b4533',96+7,0,1,5);R(c,'#5b4533',96+3,6,1,5);R(c,'#4a3828',96+10,11,1,5);
      R(c,'#3D2314',112,0,16,16);for(let y=0;y<16;y+=4)R(c,'#2a1b10',112,y,16,1);for(let i=0;i<6;i++)R(c,'#2a1b10',112+rnd()*15,rnd()*15,1,4);
      R(c,'#6b5238',128,0,16,16);R(c,'#1A1210',128+4,2,8,14);R(c,'#C89D54',128+10,9,1,1);
      R(c,'#6b5238',144,0,16,16);R(c,'#1A1210',144+3,3,10,10);R(c,'#C89D54',144+4,4,8,8);R(c,'#1A1210',144+8,4,1,8);R(c,'#1A1210',144+4,8,8,1);
      R(c,'#6b5238',160,0,16,16);R(c,'#1A1210',160+4,0,8,16);R(c,'#5b4533',160+4,0,8,1)});
    T('tree',48,64,(c)=>{R(c,'#1d130c',22,20,5,44);R(c,'#1d130c',18,56,13,8);for(const [x,y,w,h] of [[10,22,14,2],[27,16,14,2],[14,10,2,12],[33,8,2,10],[8,32,12,2],[28,30,12,2]])R(c,'#1d130c',x,y,w,h);for(let i=0;i<12;i++)R(c,'#2c2a1f',6+rnd()*36,6+rnd()*30,2,1)});
    T('tools',24,16,(c)=>{R(c,'#3b2616',3,2,2,14);R(c,'#6a5238',1,2,6,1);for(let i=0;i<4;i++)R(c,'#6a5238',1+i*2,3,1,2);R(c,'#4d3524',10,10,13,5);R(c,'#2a1b10',10,14,13,1);R(c,'#3b2616',13,6,2,5)});
    T('table',24,16,(c)=>{R(c,'#3b2616',0,8,24,2);R(c,'#2a1b10',2,10,2,6);R(c,'#2a1b10',20,10,2,6);R(c,'#7a2d1f',7,5,10,4);R(c,'#C89D54',7,5,10,1);R(c,'#F5F2F0',9,6,6,1)});
    T('glow',48,48,(c)=>{for(let r=24;r>0;r-=3){c.fillStyle='rgba(200,157,84,.07)';c.beginPath();c.arc(24,24,r,0,6.3);c.fill()}});
    T('mist',160,40,(c)=>{for(let r=20;r>0;r-=2){c.fillStyle='rgba(245,242,240,.045)';c.fillRect(20+(20-r)*2,20-r,120-(20-r)*4,r*2)}});
    T('mote',2,2,(c)=>R(c,'#F5F2F0',0,0,2,2));
    T('ebox',11,11,(c)=>{R(c,'#C89D54',0,0,11,11);R(c,'#1A1918',1,1,9,9);R(c,'#F5F2F0',3,2,5,1);R(c,'#F5F2F0',3,2,1,7);R(c,'#F5F2F0',3,5,4,1);R(c,'#F5F2F0',3,8,5,1)});
    T('vig',320,180,(c,w,h)=>{const g=c.createRadialGradient(160,90,50,160,90,190);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.75)');c.fillStyle=g;c.fillRect(0,0,w,h)});
    // Hojas de sprites provisionales: Lucho 24x32 (0-1 idle, 2-5 caminar, 6-7 interactuar)
    const lu=T('lucho',24*8,32,(c)=>{for(let f=0;f<8;f++){const o=f*24,walk=f>=2&&f<6,bob=[1,3,5].includes(f)?1:0,L=walk?[0,2,0,-2][f-2]:0;
      R(c,'#2C2A29',o+8+L,24,3,7);R(c,'#2C2A29',o+13-L,24,3,7);R(c,'#1A1918',o+8+L,30,4,2);R(c,'#1A1918',o+13-L,30,4,2);
      R(c,'#6b5a47',o+6,12+bob,12,13);R(c,'#8a6f3a',o+6,20+bob,12,1);R(c,'#4f4132',o+6,24+bob,12,1);R(c,'#6b5a47',o+4,14+bob,2,9);
      f>=6?R(c,'#6b5a47',o+18,14,6,2):R(c,'#6b5a47',o+18,14+bob,2,9);
      R(c,'#b98d68',o+8,6+bob,8,7);R(c,'#8a7a64',o+9,11+bob,6,2);R(c,'#1A1918',o+10,9+bob,1,1);R(c,'#1A1918',o+13,9+bob,1,1);
      R(c,'#2a1b10',o+6,4+bob,12,2);R(c,'#2a1b10',o+8,1+bob,8,4)}});
    // Vieja 40x24 (0-1 idle, 2-3 relincho)
    const vi=T('vieja',40*4,24,(c)=>{for(let f=0;f<4;f++){const o=f*40,hy=f>=2?3:0,dr=f%2;
      R(c,'#6e4a2e',o+8,8+dr,22,8);R(c,'#5a3b23',o+9,15+dr,20,1);for(const x of[9,13,24,28])R(c,'#5a3b23',o+x,16,2,8);
      R(c,'#6e4a2e',o+28,4-hy+dr,5,8);R(c,'#6e4a2e',o+31,3-hy+dr,8,5);R(c,'#2a1b10',o+27,3-hy+dr,2,8);R(c,'#2a1b10',o+31,1-hy+dr,2,2);R(c,'#1A1918',o+35,4-hy+dr,1,1);
      R(c,'#2a1b10',o+5,9,3,10);for(let i=0;i<4;i++)R(c,'#4d3524',o+12+i*4,10,1,4)}});
    // Forastero 24x36 (0-1 idle)
    const fo=T('forastero',24*2,36,(c)=>{for(let f=0;f<2;f++){const o=f*24,b=f;
      R(c,'#1A1918',o+7,12+b,10,20);R(c,'#1A1918',o+8,31,3,5);R(c,'#1A1918',o+13,31,3,5);R(c,'#F5F2F0',o+11,13+b,2,4);
      R(c,'#e7dfd6',o+9,6+b,6,7);R(c,'#1A1918',o+10,9+b,1,1);R(c,'#1A1918',o+13,9+b,1,1);R(c,'#0d0d0e',o+7,5+b,10,1);R(c,'#0d0d0e',o+8,0+b,8,5);R(c,'#1A1918',o+5,14,2,12);R(c,'#1A1918',o+17,14,2,12);R(c,'#0d0d0e',o+5,26,2,2);R(c,'#0d0d0e',o+17,26,2,2)}});
    const frames=(t,n,w,h)=>{for(let i=0;i<n;i++)t.add(i,0,i*w,0,w,h)};
    frames(lu,8,24,32);frames(vi,4,40,24);frames(fo,2,24,36);
    const A=(key,tex,fr,rate,rep=-1)=>this.anims.create({key,frames:fr.map(f=>({key:tex,frame:f})),frameRate:rate,repeat:rep});
    A('lucho_idle','lucho',[0,1],2);A('lucho_walk','lucho',[2,3,4,5],8);A('lucho_act','lucho',[6,7],3,2);
    A('vieja_idle','vieja',[0,1],1.5);A('vieja_neigh','vieja',[2,3,2,3],4,1);A('fora_idle','forastero',[0,1],1);
    makeChapter2Textures(this);
    this.scene.start('Menu');
  }
}
