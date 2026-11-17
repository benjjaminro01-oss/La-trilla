import {State} from '../core/game-state.js';
const add=(k,n=1)=>()=>State.add(k,n);
const dec=(id,v,...fx)=>()=>{State.decide(id,v);fx.forEach(f=>f())};
export const INTRO=[
 {t:'Villa Alegre, Región del Maule. Junio de 2018.'},
 {t:'Una noche húmeda. La tierra ya no responde como antes.'},
 {who:'Lucho',t:"Solo nos quedó este campo que no sirve pa' na' y la deuda."}];
// x en píxeles del mundo (1280 de ancho)
export const ITEMS=[
 {id:'vieja',x:190,lines:[
  {who:'Lucho',t:'Paciencia, mi tonta. Si el taita estuviera vivo, nos pegaría un tiro a los dos por dejar que la tierra se nos ponga tan rancia.'},
  {t:'Vieja baja la cabeza. Su aliento empaña el aire frío.',choices:[
   {t:'Hablarle de su padre',fx:dec('vieja','padre',add('vinculoVieja',2)),after:[{who:'Lucho',t:'Él también te hablaba así, ¿te acordái? Con la misma voz cansada.'},{t:'Vieja apoya el hocico en su hombro.'}]},
   {t:'Acariciarla en silencio',fx:dec('vieja','silencio',add('vinculoVieja')),after:[{t:'Lucho le pasa la mano por el lomo. Ninguno de los dos dice nada.'}]},
   {t:'Dejarla: hay trabajo',fx:dec('vieja','trabajo',add('orgullo')),after:[{who:'Lucho',t:'Después, Vieja. Ahora hay que seguir.'}]}]}],
  again:[{t:'Vieja lo mira. No pide nada.'}]},
 {id:'herr',x:330,lines:[
  {t:'El trillo y el rastrillo, gastados por años de uso. La madera está seca y agrietada.',choices:[
   {t:'Seguir trabajando',fx:dec('trabajo','seguir',add('orgullo')),after:[{t:'Cada golpe resuena con furia sorda. El campo no responde.'}]},
   {t:'Dejarlas donde están',fx:dec('trabajo','dejar'),after:[{who:'Lucho',t:'Pa qué.'}]}]}],
  again:[{t:'Las herramientas siguen ahí, esperando una cosecha que no llega.'}]},
 {id:'terreno',x:544,lines:[
  {t:'El trigo se dobla sobre sí mismo, vacío. La tierra está agrietada.'},
  {who:'Lucho',t:'Esta tierra no da ni pa la sopa.',choices:[
   {t:'Maldecir al campo',fx:dec('campo','maldecir',add('orgullo')),after:[{t:'Lucho escupe en la tierra inútil.'}]},
   {t:'Quedarse mirando',fx:dec('campo','mirar'),after:[{t:'El viento mueve las espigas secas. Nada más.'}]}]}],
  again:[{t:'Ni un brote verde.'}]},
 {id:'casa',x:832,lines:[
  {t:'Paredes de adobe agrietadas, tejas rotas. La luz de adentro apenas alcanza a salir.'},
  {who:'Lucho',t:'Lo peor no es eso. Es que ahora cualquiera me mira por encima.'}],
  again:[{t:'La casa guarda silencio.'}]},
 {id:'cuaderno',x:1010,lines:[
  {t:'El libro de cuentas. Cifras en rojo, página tras página.',choices:[
   {t:'Revisar las cuentas',fx:dec('cuentas','revisar',add('pistas')),after:[{t:'Las primeras páginas están escritas con otra letra: la del taita. La deuda es más vieja que él.'}]},
   {t:'Cerrarlo de golpe',fx:dec('cuentas','cerrar',add('orgullo'))}]}],
  again:[{t:'Lucho no quiere volver a abrirlo.'}]}
];
export const FORASTERO=[
 {t:'El frío cae de golpe, antinatural. Vieja relincha, bajo y grave.'},
 {who:'Lucho',t:'¿Quién anda ahí?',choices:[
  {t:'Levantar el rastrillo',fx:dec('encuentro','rastrillo',add('desconfianza'))},
  {t:'Plantarle cara',fx:dec('encuentro','cara',add('orgullo'))}]},
 {who:'Forastero',t:"Buenas noches, don Lucho. Viera usted que me dolió el corazón de puro escucharlo: tanto trabajo, tanto esfuerzo pa' tan poca cosecha."},
 {who:'Lucho',t:'¿Y usté de qué parte salió? Por acá no se ven caras nuevas y menos a estas horas.'},
 {who:'Forastero',t:'Hay deudas que se heredan igual que la tierra.'},
 {t:'Lucho se congela.'},
 {who:'Forastero',t:'Yo puedo enderezar tu destino. Que esta tierra vuelva a responderte. Que te miren distinto.'},
 {who:'Lucho',t:'¿Y a cambio?'},
 {who:'Forastero',t:'Más tarde veremos. A la vuelta me darás lo que te pida.'},
 {who:'Lucho',t:'¿Y acaso yo te he pedido algo a ti?'},
 {who:'Forastero',t:'A veces la ayuda llega mal vestida.'},
 {who:'Forastero',t:'Tómate tu tiempo, Lucho. Yo sé esperar.'},
 {t:'Se desvanece lentamente en la niebla. Lucho queda solo, desconcertado.'}];
