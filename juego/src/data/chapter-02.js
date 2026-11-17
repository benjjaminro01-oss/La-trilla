import {State} from '../core/game-state.js';
const add=(k,n=1)=>()=>State.add(k,n);
const sub=k=>()=>{if(State.data.vars[k]>0)State.add(k,-1)};
const dec=(id,v,...fx)=>()=>{State.decide(id,v);fx.forEach(f=>f())};
// Capítulo 2 · El peso de la vergüenza. x en píxeles del mundo.
export const CAMINO_INTRO=[
 {t:'A la mañana siguiente. Lucho sale con Vieja rumbo al pueblo.'},
 {t:'Antes de partir, mira la fotografía de su padre. No dice nada.'}];
export const CAMINO_ITEMS=[
 {id:'c_casa1',x:216,lines:[{t:'Una casa de adobe con los postigos cerrados. Tras la madera, algo se mueve y se queda quieto.'}],again:[{t:'Nadie abre.'}]},
 {id:'c_casa2',x:488,lines:[{t:'Tejas desparejas, paredes remendadas con barro. Aquí también se aprende a callar las deudas.'}],again:[{t:'La casa guarda silencio.'}]},
 {id:'c_casa3',x:728,lines:[{t:'Un perro flaco levanta la cabeza al verlo pasar. Vuelve a echarse.'}],again:[{t:'El perro ya no lo mira.'}]},
 {id:'c_huellas',x:900,lines:[{t:'Huellas de camioneta sobre el barro seco. El pueblo anda en vehículo; Lucho, con su yegua.'},{who:'Lucho',t:'Antes bastaba con la yegua.'}],again:[{t:'Las huellas se pierden hacia el almacén.'}]},
 {id:'c_muro',x:1110,lines:[{t:'Un muro encalado, descascarado por el sol. Avisos viejos, nombres que ya no están.'}],again:[{t:'Nadie se detiene a leerlo.'}]}
];
export const RICARDO=[
 {t:'Lucho compra algunos víveres y paga con monedas, una por una. Don Ricardo las cuenta en voz alta.'},
 {who:'Ricardo',t:'Deberías ir al banco, Lucho. A ti ya te negaron hasta el aire. Sigue envenenando el pueblo nomás.'},
 {t:'Las demás personas dejan de hablar. Todos miran.'},
 {who:'Lucho',t:"Quien te creí vo', quién te dijo que yo no tenía plata."},
 {t:'Ricardo lo mira con cara de decepción, sin bajar la voz.'},
 {t:'¿Qué hace Lucho?',choices:[
  {t:'Enfrentar a Ricardo',fx:dec('ricardo','enfrentar',add('orgullo')),after:[
    {who:'Lucho',t:'Algún día vas a tener que tragarte tus palabras, Ricardo.'},
    {who:'Ricardo',t:'Cuando llegue ese día, avíseme. Mientras, la cuenta sigue corriendo.'},
    {who:'Vecino',t:'Déjelo, don Lucho. No gana nada.'}]},
  {t:'Retirarse y soportar la humillación',fx:dec('ricardo','retirarse'),after:[
    {t:'Lucho aprieta la mandíbula, recoge sus cosas y no dice nada.'},
    {t:'Alguien suelta una risa corta. Nadie lo detiene.'}]},
  {t:'Pedirle más plazo',fx:dec('ricardo','plazo',sub('orgullo')),after:[
    {who:'Lucho',t:'Deme un plazo, don Ricardo. Un poco más y le pago todo.'},
    {who:'Ricardo',t:'Plazo tuvo años, Lucho. Vuelva cuando traiga algo en la mano.'}]}]}
];
export const ALMACEN_ITEMS=[
 {id:'a_estante',x:170,lines:[{t:'Latas, velas, yerba mate. Todo tiene precio y todo está anotado.'}],again:[{t:'Lucho mira los precios y aparta la vista.'}]},
 {id:'a_balanza',x:250,lines:[{t:'Una balanza de platillos, siempre lista para pesar lo que otros deben.'}],again:[{t:'El peso de la deuda no cabe en la balanza.'}]}
];
export const REACCION=d=>({
  enfrentar:[{who:'Lucho',t:'Ya veremos quién se traga qué.'}],
  retirarse:[{who:'Lucho',t:'Nadie me defendió. Tampoco yo.'}],
  plazo:[{who:'Lucho',t:'Una semana más... ¿y después?'}]}[d]||[{who:'Lucho',t:'Una más para la cuenta.'}]);
export const BOLSA=(onTake,onLeft)=>[
 {t:'¿Qué hace Lucho con la bolsa?',choices:[
  {t:'Guardarla',fx:()=>{State.decide('bolsa','guardar');State.addItem('bolsa','guardada');onTake()},after:[
    {t:'La bolsa pesa más de lo que parece. Lucho la guarda bajo el poncho.'},
    {who:'Lucho',t:'Ya no tengo nada que perder.'}]},
  {t:'Buscar si tiene nombre o identificación',fx:()=>{State.decide('bolsa','buscar');State.addItem('bolsa','buscada');if(!State.seen('pista_bolsa')){State.visit('pista_bolsa');State.add('pistas')}onTake()},after:[
    {t:'Busca un nombre, una marca, una inicial. Nada.'},
    {t:'Solo una tela oscura, limpia, sin una mota de polvo.'},
    {t:'Lucho la guarda, más intrigado que antes.'}]},
  {t:'Dejarla donde estaba',fx:()=>{State.decide('bolsa','dejar')},after:[
    {t:'Lucho se aleja unos pasos. Se detiene. Piensa en Ricardo, en las risas, en la harina.'},
    {t:'Regresa y recoge la bolsa.',},
    {fx:()=>{State.addItem('bolsa','recogida_tras_dudar');onTake()},t:'Esta vez no la suelta.'}]}]}
];
export const VIEJA_SIGUE=[{t:'Vieja resopla, inquieta, mirando el camino vacío. Algo en esa bolsa no le gusta.'}];
export const CARTEL=[
 {t:'Un letrero clavado a un poste anuncia una celebración en el pueblo, esa misma tarde.'},
 {who:'Lucho',t:'Si me ven con plata, otra cosa van a decir.'},
 {t:'Lucho decide asistir.'}];
export const setEnd=ch=>{
  const q=s=>document.querySelector('#end '+s);
  q('.sub').textContent=ch===1?'Capítulo 01 · El campo que ya no responde':'Capítulo 02 · El peso de la vergüenza';
  q('h2').textContent=ch===1?'Continuará en el pueblo':'Continuará: una noche para ser otro';
  q('.tag').textContent=ch===1?'«Yo sé esperar.»':'«Ya no tiene nada que perder.»';
  document.getElementById('b-next').hidden=ch!==1;
};
