export const Dialogue={
  active:false,
  init(){this.el=document.getElementById('dlg');this.who=document.getElementById('d-who');this.txt=document.getElementById('d-txt');this.ch=document.getElementById('d-ch');
    this.el.addEventListener('click',()=>{if(!this.waiting)this.next()});
    window.addEventListener('keydown',e=>this.key(e));},
  run(lines){return new Promise(res=>{this.q=[...lines];this.res=res;this.active=true;this.el.hidden=false;this.next()})},
  next(){const l=this.q.shift();if(!l){this.active=false;this.el.hidden=true;this.res();return}
    if(l.fx)l.fx();this.cur=l;this.el.dataset.who=l.who?l.who.toLowerCase():'narra';this.who.textContent=(l.who||'').toUpperCase();this.txt.textContent=l.t;this.ch.innerHTML='';
    this.waiting=!!l.choices;
    if(l.choices)l.choices.forEach((c,i)=>{const b=document.createElement('button');b.textContent=(i+1)+'. '+c.t;b.onclick=e=>{e.stopPropagation();this.pick(c)};this.ch.appendChild(b)})},
  pick(c){if(c.fx)c.fx();if(c.after)this.q.unshift(...c.after);this.ch.innerHTML='';this.waiting=false;this.next()},
  key(e){if(!this.active)return;
    if(this.waiting){const n=parseInt(e.key);if(n>=1&&this.cur.choices[n-1])this.pick(this.cur.choices[n-1]);return}
    if(e.key==='Enter'||e.key===' '){e.preventDefault();this.next()}}
};
