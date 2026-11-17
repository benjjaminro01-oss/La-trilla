import {Save} from '../systems/save-manager.js';
const base=()=>({chapter:1,vars:{pacto:false,vinculoVieja:0,orgullo:0,desconfianza:0,pistas:0,quedarse:false},visited:[],decisions:{},done:false,stage:'',items:[]});
export const State={
  data:base(),
  reset(){this.data=base();Save.clear()},
  load(){const s=Save.read();if(!s)return false;this.data={...base(),...s,vars:{...base().vars,...s.vars}};return true},
  add(k,n=1){this.data.vars[k]+=n;this.save()},
  set(k,v){this.data.vars[k]=v;this.save()},
  decide(id,v){this.data.decisions[id]=v;this.save()},
  visit(id){if(!this.data.visited.includes(id))this.data.visited.push(id);this.save()},
  seen(id){return this.data.visited.includes(id)},
  startChapter(n){this.data.chapter=n;this.data.stage='camino';this.save()},
  setStage(s){this.data.stage=s;this.save()},
  addItem(id,estado){this.data.items=this.data.items.filter(i=>i.id!==id).concat({id,estado});this.save()},
  finish(){this.data.done=true;this.save()},
  save(){Save.write(this.data)}
  // NOTA: 'pacto' NO se activa en el capítulo 1. Solo debe activarse cuando Lucho acepta
  // y guarda en su pecho la bolsa llena que devuelve el Forastero (capítulo posterior).
};
