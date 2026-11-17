// Audio provisional: viento sintetizado. Para audio real, cargar archivos desde assets/audio/ en BootScene.
export const Audio={
  ctx:null,
  init(){if(this.ctx)return;try{const c=this.ctx=new (window.AudioContext||window.webkitAudioContext)();
    const b=c.createBuffer(1,c.sampleRate*2,c.sampleRate),d=b.getChannelData(0);let l=0;for(let i=0;i<d.length;i++){l=(l+0.02*(Math.random()*2-1))/1.02;d[i]=l*3}
    const s=c.createBufferSource();s.buffer=b;s.loop=true;const f=c.createBiquadFilter();f.type='lowpass';f.frequency.value=380;this.g=c.createGain();this.g.gain.value=.12;s.connect(f).connect(this.g).connect(c.destination);s.start()}catch(e){}},
  wind(v,t=2){if(this.g)this.g.gain.linearRampToValueAtTime(v,this.ctx.currentTime+t)}
};
