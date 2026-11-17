// Texturas PROVISIONALES del Capítulo 2 (generadas por código, mismo estilo Pixel Art del Capítulo 1).
// Lucho, Vieja y el Forastero se reutilizan sin cambios desde boot-scene.js. Ricardo y los vecinos son diseños provisionales.
const R=(c,col,x,y,w,h)=>{c.fillStyle=col;c.fillRect(x|0,y|0,w,h)};
let sd=5;const rnd=()=>{sd=(sd*16807)%2147483647;return sd/2147483647};
export function makeChapter2Textures(s){
  const T=(k,w,h,f)=>{const t=s.textures.createCanvas(k,w,h);f(t.getContext(),w,h);t.refresh();return t};
  T('sky_dia',320,180,(c,w,h)=>{const a=[122,112,98],b=[184,168,140];for(let y=0;y<h;y+=3){const t=y/h;R(c,'rgb('+a.map((v,i)=>Math.round(v+(b[i]-v)*t)).join(',')+')',0,y,w,3)}});
  const wall=(c,x)=>{R(c,'#8a6f4e',x,0,16,16);R(c,'#7a5f40',x,5,16,1);R(c,'#7a5f40',x,11,16,1);for(let i=0;i<4;i++)R(c,'#9a7f5c',x+rnd()*14,rnd()*14,2,2)};
  T('tiles2',16*12,16,c=>{
    R(c,'#6a5238',0,0,16,16);R(c,'#7d6347',0,0,16,3);for(let i=0;i<5;i++)R(c,'#4d3524',rnd()*14,3+rnd()*12,2,1);
    R(c,'#4d3524',16,0,16,16);for(let i=0;i<8;i++)R(c,'#3a281a',16+rnd()*14,rnd()*14,2,1);
    R(c,'#3a281a',32,0,16,16);for(let i=0;i<6;i++)R(c,'#1A1918',32+rnd()*14,rnd()*14,2,1);
    wall(c,48);R(c,'#5b4533',48+6,0,1,5);
    R(c,'#6a3a24',64,0,16,16);for(let y=0;y<16;y+=4){R(c,'#4d2a1a',64,y,16,1);R(c,'#4d2a1a',64+((y/4)%2?4:10),y+1,1,3)}
    wall(c,80);R(c,'#3b2616',80+3,0,10,16);R(c,'#C89D54',80+11,8,1,1);
    wall(c,96);R(c,'#3b2616',96+3,2,10,14);R(c,'#2a1b10',96+8,2,1,14);
    wall(c,112);R(c,'#4d3524',112+3,3,10,10);for(let y=4;y<13;y+=2)R(c,'#2a1b10',112+3,y,10,1);
    wall(c,128);R(c,'#1A1918',128+3,3,10,10);R(c,'#2C2A29',128+8,3,1,10);R(c,'#2C2A29',128+3,8,10,1);R(c,'#3a3a35',128+4,4,2,2);
    R(c,'#b9ad98',144,0,16,16);R(c,'#a89c86',144,8,16,1);
    R(c,'#6b5238',160,0,16,16);R(c,'#5b4533',160,12,16,4)});
  T('tiles3',16*6,16,c=>{
    R(c,'#4d3524',0,0,16,16);R(c,'#3a281a',0,5,16,1);R(c,'#3a281a',0,11,16,1);
    R(c,'#6b4a30',16,0,16,16);for(let x=2;x<16;x+=4)R(c,'#4d3524',16+x,0,1,16);
    R(c,'#6b4a30',32,0,16,16);R(c,'#3b2616',32,5,16,2);R(c,'#3b2616',32,12,16,2);for(let i=0;i<3;i++){R(c,['#8a6f3a','#7a2d1f','#5a6b4a'][i],32+2+i*5,1,3,4);R(c,['#5a6b4a','#8a6f3a','#7a2d1f'][i],32+2+i*5,8,3,4)}
    R(c,'#3a281a',48,0,16,16);R(c,'#2a1b10',48,5,16,1);
    R(c,'#6b4a30',64,0,16,16);R(c,'#d8c9a0',64+3,3,10,10);R(c,'#8a7a5a',64+8,3,1,10);R(c,'#8a7a5a',64+3,8,10,1);
    R(c,'#4d3524',80,0,16,16);R(c,'#3a281a',80,0,16,2)});
  const person=(key,shirt,hat,skin,extra)=>{const t=T(key,48,32,c=>{for(let f=0;f<2;f++){const o=f*24,b=f;
    R(c,'#2C2A29',o+8,25,3,7);R(c,'#2C2A29',o+13,25,3,7);R(c,'#1A1918',o+8,30,4,2);R(c,'#1A1918',o+13,30,4,2);
    R(c,shirt,o+6,12+b,12,13);R(c,shirt,o+4,14+b,2,9);R(c,shirt,o+18,14+b,2,9);extra(c,o,b);
    R(c,skin,o+8,6+b,8,7);R(c,'#2a1b10',o+9,11+b,6,1);R(c,'#1A1918',o+10,9+b,1,1);R(c,'#1A1918',o+13,9+b,1,1);
    R(c,hat,o+6,4+b,12,2);R(c,hat,o+8,1+b,8,4)}});t.add(0,0,0,0,24,32);t.add(1,0,24,0,24,32)};
  person('ricardo','#7a2d1f','#3b2616','#c49a74',(c,o,b)=>R(c,'#b9ad98',o+8,18+b,8,8));
  person('aldeano','#4f5a4a','#6b5a47','#b98d68',()=>{});
  s.anims.create({key:'ricardo_idle',frames:[{key:'ricardo',frame:0},{key:'ricardo',frame:1}],frameRate:2,repeat:-1});
  s.anims.create({key:'aldeano_idle',frames:[{key:'aldeano',frame:0},{key:'aldeano',frame:1}],frameRate:1.6,repeat:-1});
  T('mostrador',96,28,c=>{R(c,'#3b2616',0,0,96,4);R(c,'#2a1b10',0,4,96,24);for(let x=6;x<96;x+=12)R(c,'#3b2616',x,5,1,23);R(c,'#8a7a64',60,-0,10,0);R(c,'#C89D54',70,0,6,3)});
  T('sacos',32,22,c=>{for(const [x,y,w] of [[1,8,14],[15,8,15],[7,0,16]]){R(c,'#c9bfae',x,y,w,14);R(c,'#b9ad98',x,y+12,w,2);R(c,'#8a7a64',x+3,y,w-6,2)}});
  T('letrero',64,14,c=>{R(c,'#2a1b10',0,0,64,14);R(c,'#4d3524',1,1,62,12);c.font='bold 9px monospace';c.fillStyle='#C89D54';c.fillText('ALMACEN',8,10)});
  T('cartel',22,40,c=>{R(c,'#3b2616',10,12,3,28);R(c,'#c9bfae',2,2,18,16);R(c,'#4d3524',5,6,12,1);R(c,'#4d3524',5,9,12,1);R(c,'#7a2d1f',5,12,8,2)});
  T('bolsa',10,9,c=>{R(c,'#5b4d3a',1,2,8,7);R(c,'#7a6a4a',2,3,6,5);R(c,'#2a1b10',3,0,4,3)});
}
