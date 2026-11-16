/* =========================================================
   LA TRILLA — El precio de una decisión
   Parte 1: contenido y estado narrativo (sin DOM)
   Parte 2: motor de la experiencia (DOM, transiciones)

   Líneas de una escena:
     "texto"                  → narración
     ["Lucho", "texto"]       → diálogo
     N("texto", "dim")        → narración con efecto (dim | shake)
   Escena: { bg, cap, lines, choices, next, enter, final }
   Opción: { text, show(s), fx(), result(s, antes), next, transition }
   ========================================================= */
'use strict';

const CAP = {
  1: { n: "Capítulo 1", t: "El campo que ya no responde" },
  2: { n: "Capítulo 2", t: "El peso de la vergüenza" },
  3: { n: "Capítulo 3", t: "Una noche para ser otro" },
  4: { n: "Capítulo 4", t: "La cosecha y el silencio" },
  5: { n: "Capítulo 5", t: "El precio de una decisión" }
};

const UMBRAL = 3; // indicios necesarios para advertir al pueblo (Final 04)

const SCALE = {
  vinculo: ["bajo", "medio", "alto"],
  orgullo: ["bajo", "medio", "alto"],
  desconfianza: ["baja", "media", "alta"]
};

const CLUES = {
  huella: "La huella limpia",
  fuego: "El fuego apagado",
  bolsa: "La bolsa sin dueño",
  ofrecimiento: "Lo que el Forastero ofrece",
  copa: "El vaso intacto",
  cuaderno: "El cuaderno abandonado"
};

/* ---------- Estado ---------- */
const newState = () => ({
  pacto: false,          // true solo al guardar la bolsa devuelta (escena "decision")
  vinculo: "medio",      // bajo | medio | alto
  orgullo: "medio",      // bajo | medio | alto
  desconfianza: "baja",  // baja | media | alta
  pistas: 0,             // cantidad de indicios distintos
  quedarse: false,       // Lucho decidió permanecer en el campo
  clues: []              // ids de indicios (evita duplicados)
});

let s = newState();
let before = newState();   // estado previo a la última decisión

const clone = (o) => JSON.parse(JSON.stringify(o));
const lvl = (k, st = s) => SCALE[k].indexOf(st[k]);
const atLeast = (k, v, st = s) => lvl(k, st) >= SCALE[k].indexOf(v);
const raise = (k, v) => { if (!atLeast(k, v)) s[k] = v; };
const shift = (k, d) => { s[k] = SCALE[k][Math.max(0, Math.min(2, lvl(k) + d))]; };
const has = (id) => s.clues.includes(id);
const addClue = (id) => { if (!has(id)) { s.clues.push(id); s.pistas = s.clues.length; } };
const by = (k, map, st = s) => map[st[k]];
const N = (text, fx) => ["", text, fx];

/* ---------- Escenas ---------- */
const scenes = {

  /* ===== CAPÍTULO 1 ===== */
  campo: {
    bg: "noche", cap: 1,
    lines: [
      "Villa Alegre, Región del Maule. Junio de 2018.",
      "Noche. Un campo húmedo cubierto de bruma. El trigo está seco y la tierra, agrietada. Lucho, de 55 años, está sentado junto a Vieja, su yegua.",
      ["Lucho", "Paciencia, mi tonta. Si el taita estuviera vivo, nos pegaría un tiro a los dos por dejar que la tierra se nos ponga tan rancia."],
      ["Lucho", "Si no fuera por usté, ya me habría colgao del sauce más alto."],
      ["Lucho", "Solo nos quedó este campo que no sirve pa’ na’ y la deuda. Lo peor no es eso... es que ahora cualquiera me mira por encima."]
    ],
    choices: [
      { text: "Hablarle de su padre.",
        fx: () => { s.vinculo = "alto"; },
        result: () => ["Lucho se agacha y apoya la frente sobre la cabeza de Vieja.",
          ["Lucho", "Tuvo que ser buen hombre mi viejo pa’ dejarme una compañera como usté."],
          "Vieja resopla suavemente."] },
      { text: "Revisar las cuentas.",
        fx: () => { s.orgullo = "alto"; s.vinculo = "bajo"; },
        result: () => ["Lucho saca un cuaderno gastado y pasa las páginas, con los ojos clavados en las cifras.",
          "Vieja le roza el hombro con el hocico. Él la aparta sin mirarla.",
          ["Lucho", "Ni vendiendo hasta el último palo de este campo alcanzo a pagar."]] },
      { text: "Seguir trabajando.",
        fx: () => { s.vinculo = "medio"; },
        result: () => ["Lucho se levanta, toma el rastrillo y golpea el trillo con rabia.",
          N("El golpe resuena en todo el campo.", "shake")] }
    ],
    next: "encuentro"
  },

  encuentro: {
    bg: "bruma", cap: 1,
    lines: [
      "El fuego apenas chisporrotea. De repente, Vieja relincha bajo y grave. Lucho se detiene.",
      N("Un frío repentino, antinatural. El sonido del campo se apaga.", "dim"),
      ["Lucho", "¿Quién anda ahí?"],
      "La bruma se espesa. Una sombra alta se proyecta primero. Luego emerge el Forastero: impecable, sin una mota de barro.",
      ["Forastero", "Buenas noches, don Lucho. Viera usted que me dolió el corazón de puro escucharlo. Tanto trabajo, tanto esfuerzo pa’ tan poca cosecha."],
      ["Lucho", "¿Y usté de qué parte salió? Por acá no se ven caras nuevas y menos a estas horas."],
      ["Forastero", "Hay deudas que se heredan igual que la tierra."],
      ["Forastero", "Yo puedo enderezar tu destino. Que esta tierra vuelva a responderte. Que te miren distinto."],
      ["Lucho", "¿Y a cambio?"],
      ["Forastero", "Más tarde veremos. A la vuelta me darás lo que te pida."],
      ["Lucho", "¿Y acaso yo te he pedido algo a ti?"],
      ["Forastero", "A veces la ayuda llega mal vestida. Tómate tu tiempo, Lucho. Yo sé esperar."],
      "Se desvanece lentamente en la niebla. Vieja relincha. Lucho permanece inmóvil."
    ],
    choices: [
      { text: "Seguir al Forastero.",
        fx: () => { addClue("huella"); raise("desconfianza", "media"); },
        result: () => ["Lucho avanza unos pasos hacia la niebla. No encuentra a nadie.",
          "Entre la tierra, una huella limpia, como si alguien hubiera caminado sin tocar el barro."] },
      { text: "Calmar a Vieja.",
        fx: () => { shift("vinculo", +1); },
        result: (st) => ["Lucho vuelve junto a la yegua y la acaricia.",
          ["Lucho", st.vinculo === "alto" ? "Tranquila, mi vieja. No hay nadie." : "Tranquila, mujer. No hay nadie."],
          "Vieja sigue mirando hacia el lugar donde desapareció el Forastero."] },
      { text: "Revisar el fuego.",
        fx: () => { addClue("fuego"); raise("desconfianza", "media"); },
        result: () => ["La leña sigue intacta, pero las llamas se han apagado de golpe, sin dejar humo."] }
    ],
    next: "almacen"
  },

  /* ===== CAPÍTULO 2 ===== */
  almacen: {
    bg: "almacen", cap: 2,
    lines: (st) => [
      by("vinculo", {
        alto: "Mañana. Lucho acomoda la montura con cuidado y Vieja lo sigue sin que tenga que tirar de las riendas. Antes de salir se detiene frente a la fotografía de su padre. No dice nada.",
        medio: "Mañana. Lucho se detiene frente a la fotografía de su padre. No dice nada. Toma las riendas de Vieja y sale.",
        bajo: "Mañana. Lucho tira de las riendas sin mirar a Vieja; ella lo sigue arrastrando los cascos. En la pared, la fotografía de su padre. Él no la mira."
      }, st),
      "En el almacén paga con monedas. Don Ricardo, el comerciante y su acreedor, lo observa con desprecio.",
      ["Ricardo", "Deberías ir al banco, Lucho. A ti ya te negaron hasta el aire. Sigue envenenando el pueblo nomás."],
      ["Lucho", "Quién te creí vo’, quién te dijo que yo no tenía plata."],
      "Lucho se va molesto, choca con un saco y derrama una bolsa de harina. Queda cubierto de polvo blanco. Todos miran. Nadie lo ayuda."
    ],
    choices: [
      { text: "Enfrentar a Ricardo.",
        fx: () => { s.orgullo = "alto"; },
        result: (st, b) => b.orgullo === "alto"
          ? ["Lucho se vuelve hacia él, con la harina todavía en los hombros.",
             ["Lucho", "Algún día vai a tener que tragarte esas palabras."],
             ["Ricardo", "Primero paga lo que debes."]]
          : ["Lucho se vuelve a medias. Abre la boca, duda, y lo dice más bajo de lo que quisiera.",
             ["Lucho", "Algún día... vai a tener que tragarte esas palabras."],
             ["Ricardo", "Primero paga lo que debes."]] },
      { text: "Retirarse en silencio.",
        fx: () => { s.orgullo = "bajo"; },
        result: (st, b) => [by("orgullo", {
          alto: "Lucho aprieta los dientes, se sacude la harina y se marcha. Cada paso le cuesta.",
          medio: "Lucho se limpia la ropa y se marcha sin mirar atrás.",
          bajo: "Lucho baja la vista, se sacude la harina y sale. Ya está acostumbrado."
        }, b)] },
      { text: "Pedir un nuevo plazo.",
        fx: () => {},
        result: (st, b) => [
          b.orgullo === "alto" ? "A Lucho le cuesta pronunciar la palabra. La dice igual." : "Lucho se acerca al mostrador con la gorra en la mano.",
          ["Lucho", "Deme unos días, Ricardo. No le estoy pidiendo que me regale nada."],
          ["Ricardo", "Ya no tengo más paciencia contigo."]] }
    ],
    next: "bolsa"
  },

  bolsa: {
    bg: "dia", cap: 2,
    lines: (st) => [
      "Afuera, un letrero anuncia una celebración para esa misma tarde.",
      "Antes de montar a Vieja, Lucho ve una pequeña bolsa colgando de la montura. La abre: dinero.",
      ...(atLeast("desconfianza", "media", st)
        ? ["Nadie olvida una bolsa así. Mira a su alrededor: la calle está vacía y el polvo no guarda más huellas que las suyas."]
        : []),
      "Mira hacia el almacén donde lo humillaron y aprieta la bolsa."
    ],
    choices: [
      { text: "Guardarla de inmediato.",
        fx: () => { s.orgullo = "alto"; },
        result: (st) => ["Lucho guarda el dinero entre sus ropas.",
          atLeast("desconfianza", "media", st) ? "Lo guarda igual, aunque la mano no deja de dudar." : ["Lucho", "Por una vez, algo tenía que salir bien."]] },
      { text: "Buscar si tiene algún nombre.",
        fx: () => { raise("desconfianza", "media"); addClue("bolsa"); },
        result: () => ["Lucho revisa la bolsa por dentro y por fuera. No hay nombre ni documento.", "Solo dinero."] },
      { text: "Dejarla y marcharse.",
        fx: () => { s.orgullo = "medio"; },
        result: () => ["Lucho cuelga la bolsa de nuevo en la montura y se aleja. Unos metros después se detiene.",
          "Mira el almacén. Mira el camino. Finalmente regresa y recoge el dinero."] }
    ],
    next: "fiesta"
  },

  /* ===== CAPÍTULO 3 ===== */
  fiesta: {
    bg: "fiesta", cap: 3,
    lines: (st) => [
      "Atardecer. Lucho amarra a Vieja a un pilar de madera, con su mejor ropa, aunque gastada.",
      by("vinculo", {
        alto: ["Lucho", "Espéreme aquí, mi vieja. Hoy nos van a mirar distinto."],
        medio: ["Lucho", "Espéreme aquí, mujer. Hoy nos van a mirar distinto."],
        bajo: ["Lucho", "Quédese quieta. No demoro."]
      }, st),
      by("orgullo", {
        alto: "Entra con la barbilla en alto.",
        medio: "Entra con paso dudoso, mitad orgullo y mitad miedo.",
        bajo: "Entra con la vista baja, buscando una esquina donde no estorbar."
      }, st) + " Saca la bolsa en la barra para que lo vean con plata.",
      ["Lucho", "¡Hola, hola! Un whiskey..."],
      "En una mesa retirada, el Forastero lo observa. Margarita, que limpia el lugar, no levanta la vista.",
      ...(atLeast("desconfianza", "media", st)
        ? ["Lucho lo nota: el Forastero no ha tocado el vaso que tiene enfrente. Cuando los bailarines pasan junto a su mesa, se abren sin saber por qué."]
        : []),
      "Lucho gasta el dinero en tragos. El Forastero le hace una señal. Se acerca, algo mareado.",
      ["Forastero", "Ni con plata prestada te dejan entrar."],
      ["Lucho", "¿Pa’ eso me llamó? ¿Para reírse también?"],
      ["Forastero", "Al contrario. Quiero que te den el respeto que te mereces y no seas el hazmerreír del pueblo."],
      "Patricio, hijo de Ricardo, pasa por delante y le bota el vaso a propósito.",
      ["Patricio", "Cuidao’, Luchito. No te vai a endeudar por un vaso."],
      ["Lucho", "¿Qué te pasa, hueón?"],
      N("Lucho se levanta para enfrentarlo. Patricio le planta un golpe seco en el estómago. Lucho cae de rodillas.", "shake"),
      "La fiesta continúa como si nada hubiera ocurrido. La música se distorsiona lentamente."
    ],
    choices: [
      { text: "Enfrentar a Patricio.",
        fx: () => { s.orgullo = "alto"; },
        result: (st, b) => [
          b.orgullo === "alto" ? "Sin aire, Lucho se levanta a medias. Patricio lo empuja otra vez." : "Lucho intenta levantarse. Patricio lo empuja otra vez.",
          ["Patricio", "Quédate abajo, mejor."]] },
      { text: "Retirarse de la fiesta.",
        fx: () => { s.orgullo = "bajo"; },
        result: (st, b) => [b.orgullo === "alto"
          ? "Lucho se levanta con dificultad y se marcha sin responder. La rabia le sube por la garganta y no tiene dónde ponerla."
          : "Lucho se levanta con dificultad y se marcha sin responder."] },
      { text: "Mirar al Forastero.",
        fx: () => { if (atLeast("desconfianza", "media")) { addClue("copa"); s.desconfianza = "alta"; } },
        result: (st, b) => [
          "Lucho mira hacia la mesa. El Forastero sigue observándolo.",
          ...(atLeast("desconfianza", "media", b) ? ["El vaso sigue lleno. Intacto, como si nadie lo hubiera servido."] : []),
          ["Forastero", "Hay hombres que nacieron para mirar desde abajo. Y hay otros que simplemente se acostumbraron."]] }
    ],
    next: "decision"
  },

  decision: {
    bg: "pacto", cap: 3,
    lines: (st) => [
      "Noche. Lucho sale a rastras hacia Vieja. En el camino se le cae la bolsa y no se da cuenta.",
      by("vinculo", {
        alto: "Vieja se agita y no deja que se acerque. Él la llama por su nombre, bajito, pero ella retrocede: huele algo detrás de él.",
        medio: "Vieja se agita y no deja que se acerque. Huele al Forastero, que viene detrás.",
        bajo: "Vieja se agita y no deja que se acerque. Lucho ni se detiene a calmarla: un estorbo más."
      }, st),
      ["Forastero", "Mírate. Hasta borracho saben dónde pegarte."],
      "Le entrega la bolsa. Está otra vez llena de dinero. No explica cómo ocurrió.",
      "Lucho mira la bolsa. Luego mira a Vieja. El viento se detiene."
    ],
    choices: [
      { text: "Guardar la bolsa en el pecho.",
        fx: () => { s.pacto = true; },
        transition: "pacto",
        next: "a_cosecha",
        result: (st, b) => [
          "Lucho toma la bolsa con mano temblorosa y la guarda en su pecho.",
          ...(atLeast("desconfianza", "alta", b)
            ? ["Sabe que algo no cuadra: la huella, el fuego, el dinero que vuelve a llenarse. Lo sabe... y la guarda igual."] : []),
          by("orgullo", {
            alto: "Nunca más un golpe sin respuesta, piensa.",
            medio: "No quiere volver a levantarse del suelo sin que nadie lo vea.",
            bajo: "Ya no quiere ser el que mira desde abajo."
          }, b),
          by("vinculo", {
            alto: "Vieja relincha con desesperación. Ese relincho le duele como un golpe, y será la última vez que algo le duela.",
            medio: "Vieja relincha con desesperación.",
            bajo: "Vieja relincha con desesperación. Lucho apenas la oye."
          }, b),
          ["Lucho", "¿Qué tengo que hacer?"],
          ["Forastero", "Nada que no hayas hecho ya, Lucho. Ándate a tu casa y espera que el tiempo haga lo suyo. A veces la tierra solo necesita un cambio de aire."],
          N("La llama de una lámpara cercana se apaga. La música de la fiesta desaparece.", "dim"),
          "No hubo firma. No hubo sangre."
        ] },
      { text: "Devolver la bolsa.",
        fx: () => { if (!s.pacto) { s.desconfianza = "alta"; } },
        next: "b_campo",
        result: (st, b) => [
          ["Lucho", "No sé quién es usté ni qué quiere. Pero ya tengo suficientes problemas."],
          "Deja la bolsa en las manos del Forastero. Él no se enfurece.",
          ["Forastero", "Como quiera, Lucho. No todos están preparados para recibir lo que piden."],
          b.vinculo === "alto" ? ["Lucho", "Vámonos, mi vieja."] : "Lucho se marcha con Vieja.",
          "Vieja lo sigue sin mirar atrás."] },
      { text: "Preguntarle qué quiere realmente.",
        show: (st) => atLeast("desconfianza", "media", st),
        fx: () => { if (!s.pacto) { s.desconfianza = "alta"; addClue("ofrecimiento"); } },
        next: "b_campo",
        result: () => [
          ["Lucho", "Usté no hace todo esto porque sí. ¿Qué es lo que quiere?"],
          ["Forastero", "Todos cargamos algo, Lucho. Recuerdos, vergüenzas, penas... cosas que no dejan dormir. Yo puedo quitarte ese peso."],
          ["Lucho", "¿Y qué queda después?"],
          ["Forastero", "Lo que siempre quisiste. Una vida sin aquello que te atormenta."],
          "Lucho mira a Vieja. La yegua retrocede.",
          ["Lucho", "Entonces no."]] }
    ]
  },

  /* ===== CAPÍTULO 4 · RUTA A (PACTO) ===== */
  a_cosecha: {
    bg: "lluvia", cap: 4,
    lines: (st) => [
      "Semanas después. Una lluvia persistente, que el pueblo llama bendición, ha hecho que el campo de Lucho sea el único que no se pudrió. El trigo crece alto y fuerte, como si tuviera prisa.",
      "Lucho está de pie en la entrada, con un poncho de lana fina y botas nuevas. Desde aquella noche las cosas se le han ido apagando: el hambre ya no duele, la deuda ya no pesa.",
      by("vinculo", {
        alto: "Vieja lo mira desde el corral. La mano de Lucho, que antes buscaba su hocico, ahora cuelga quieta.",
        medio: "Vieja está en el corral. Lucho pasa a su lado sin detenerse.",
        bajo: "Vieja está en el corral, más flaca. Hace días que nadie le cambia el agua."
      }, st),
      "Pasan Ricardo y Patricio en su camioneta vieja. Se detienen. Con un movimiento lento y pesado, como si lo obligaran, Don Ricardo se saca el sombrero. Es un gesto de rendición.",
      ["Ricardo", "Buenos días, Lucho."],
      ["Lucho", "Buenos días."],
      "Lucho no sonríe. Su mirada es fija y vacía. Entra a su propiedad."
    ],
    next: "a_cobro"
  },

  a_cobro: {
    bg: "noche", cap: 4,
    lines: (st) => [
      "Noche. Hace años que no había una cosecha tan abundante. Lucho cuenta billetes frente a un libro de cuentas, bajo un farol.",
      by("vinculo", {
        alto: "Vieja, atada cerca, lanza un relincho que suena a llanto: busca al hombre que solía cuidarla con su vida. Lucho no gira la cabeza.",
        medio: "Vieja, atada cerca, lanza un relincho largo y bajo. Lucho no gira la cabeza.",
        bajo: "Vieja, atada cerca y descuidada, ya ni siquiera relincha. Lucho no recuerda cuándo fue la última vez que la miró."
      }, st),
      "El aire se vuelve pesado. El Forastero camina por el sendero, como un viajero cualquiera.",
      ["Forastero", "Linda noche para contar ganancias, patrón."],
      ["Lucho", "Es lo que corresponde, po, i’ñor. ¿Viene a buscar su pago? Dígame cuánto le debo por la inmensa ayuda que me dio."],
      ["Forastero", "Yo no te cobro por el trigo, Lucho. El trigo lo dio la tierra. Yo te cobro por el peso que te saqué de encima. Esa inquietud que le llaman sentir."],
      ["Forastero", "¿Te duele el recuerdo de tu padre, Lucho? ¿El desprecio del pueblo?"],
      "Lucho deja un billete sobre la mesa. Mira sus manos: no le tiemblan. No siente el frío de la noche ni el peso de la soledad.",
      ["Lucho", "No. No siento nada. Desde aquella noche, con el pasar del tiempo, dejé de sentir."],
      ["Forastero", "Ese es el éxito, Lucho. La paz de los que no tienen nada que perder."],
      "El Forastero mira a Vieja."
    ],
    choices: [
      { text: "Entregarle a Vieja.",
        fx: () => {},
        next: "final1",
        result: (st) => [
          by("vinculo", {
            alto: "Lucho observa a la yegua. Algo, muy hondo, intenta moverse. No se mueve.",
            medio: "Lucho observa a la yegua. No siente tristeza ni cariño.",
            bajo: "Lucho observa a la yegua. Es solo un animal que estorba."
          }, st),
          ["Lucho", "Que molesta, i’ñor. Llévesela si quiere. Ya no me sirve una bestia tan flaca."]] },
      { text: "Conservarla y pagar sus cuidados.",
        fx: () => {},
        next: "final2",
        result: (st) => [
          by("vinculo", {
            alto: "Lucho observa a Vieja. No siente amor ni pena, pero recuerda la voz de su padre, y esa voz todavía pesa más que el dinero.",
            medio: "Lucho observa a Vieja unos segundos. No siente amor ni pena, pero recuerda las palabras de su padre.",
            bajo: "Lucho observa a Vieja. No hay recuerdo que lo detenga. Solo un hábito y una deuda vieja de la que ya no sabe el origen."
          }, st),
          ["Lucho", "No. Esa yegua se queda. Fue de mi padre. No tiene por qué terminar en cualquier parte."],
          "Ordena que se construya un cobertizo y que se le dé alimento. No la acaricia. No vuelve a llamarla con cariño."] }
    ]
  },

  /* ===== CAPÍTULO 4 · RUTA B (SIN PACTO) ===== */
  b_campo: {
    bg: "seco", cap: 4,
    lines: (st) => [
      "Semanas después. El campo sigue seco. No hay cosecha milagrosa ni dinero inesperado. Lucho trabaja la tierra con Vieja a su lado.",
      by("vinculo", {
        alto: "Cada tanto Vieja le apoya el hocico en el hombro, y él se detiene un momento a respirar.",
        medio: "Vieja pasta cerca, atenta a cada ruido.",
        bajo: "Vieja pasta cerca. Hace tiempo que casi no se hablan."
      }, st),
      "Al otro lado del campo aparece el Forastero.",
      ["Forastero", "Veo que sigue trabajando."],
      ["Lucho", "Es lo que queda."],
      ["Forastero", "Podría ser diferente."],
      ["Lucho", "Ya me ofreció eso."],
      ["Forastero", "Y todavía puede aceptarlo."],
      ...(has("huella") ? [["Lucho", "Usté no deja huellas en el barro. Yo lo vi."], ["Forastero", "Los hombres ven lo que necesitan ver."]] : []),
      ...(has("fuego") && !has("huella") ? [["Lucho", "Ni el fuego quiere arder cuando usté anda cerca."], ["Forastero", "Qué observador."]] : []),
      ["Lucho", "No."],
      ["Forastero", "Qué curioso. Hay hombres que prefieren seguir sufriendo antes que soltar aquello que los mantiene atados."],
      "El Forastero comienza a alejarse. Lucho no responde."
    ],
    choices: [
      { text: "Marcharse con Vieja.",
        fx: () => { s.quedarse = false; },
        next: "final3",
        result: (st) => ["Lucho prepara algunas pertenencias y se acerca a la yegua.",
          ["Lucho", by("vinculo", { alto: "Vamos, compañera. Ya no tenemos nada que hacer aquí.", medio: "Vamos, compañera. Ya no tenemos nada que hacer aquí.", bajo: "Vamos. Ya no hay nada que hacer aquí." }, st)]] },
      { text: "Investigar al Forastero.",
        fx: () => {},
        next: "indicios",
        result: () => ["Lucho decide no marcharse todavía. Quiere saber quién es el hombre que apareció en su campo."] },
      { text: "Quedarse y seguir trabajando.",
        fx: () => { s.quedarse = true; s.orgullo = "alto"; },
        next: "final3",
        result: () => [["Lucho", "Este campo era de mi padre. No voy a salir arrancando."],
          "El Forastero lo observa desde lejos. Pasan los meses y la tierra no responde."] }
    ]
  },

  /* ===== CAPÍTULO 5 ===== */
  indicios: {
    bg: "dia", cap: 5,
    enter: () => addClue("cuaderno"),
    lines: (st) => {
      const L = [
        "Atardecer. Lucho sigue un camino de tierra hasta una propiedad abandonada: restos de herramientas, una carreta, un cobertizo con el techo hundido.",
        "Entre los tablones encuentra un cuaderno viejo. No es un libro de magia ni un manual para vencer a nadie: son cosechas, deudas, ventas, nombres.",
        "Una anotación dice: “El año que volvió a llover, también se fue el cariño de esta casa.”"
      ];
      if (has("huella")) L.push("En otra página, alguien dibujó una huella limpia sobre la tierra mojada. Al margen: “Caminaba sin tocar el barro.”");
      if (has("fuego")) L.push("Más abajo: “La noche que vino se apagó el fuego sin dejar humo.”");
      if (has("bolsa")) L.push("Otra línea: “Apareció una bolsa en mi montura. Yo no la puse.”");
      if (has("copa")) L.push("Y otra: “En la fiesta tenía el vaso lleno y nunca lo tocó.”");
      if (has("ofrecimiento")) L.push("Una más, con letra temblorosa: “Me ofreció quitarme el peso. Dije que sí.”");
      L.push("En una página posterior hay otro nombre y una frase: “El hombre del traje oscuro vino a buscar lo que faltaba.”");
      L.push(N("Un sonido de cascos interrumpe su lectura. Lucho levanta la mirada. No hay nadie.", "dim"));
      L.push(st.pistas >= UMBRAL
        ? "Lucho lo entiende: no es el primero. Y no será el último si nadie hace nada."
        : "Hay más preguntas que respuestas. Sospecha mucho, pero todavía no tiene con qué probarlo.");
      return L;
    },
    choices: (st) => st.pistas >= UMBRAL ? [
      { text: "Ir al pueblo a advertir a los vecinos.", fx: () => {}, next: "pueblo",
        result: () => ["Lucho guarda el cuaderno bajo el abrigo y toma el camino hacia Villa Alegre."] },
      { text: "Guardar el cuaderno y volver al campo.", fx: () => {}, next: "regreso",
        result: () => ["Lucho guarda el cuaderno. Sabe lo que sabe, pero no está seguro de que alguien quiera oírlo."] }
    ] : [],
    next: "regreso"
  },

  regreso: {
    bg: "seco", cap: 5,
    lines: (st) => [
      st.pistas >= UMBRAL
        ? "Lucho vuelve al campo seco con el cuaderno entre las manos."
        : "Lucho vuelve al campo seco. Con lo que tiene, nadie le creería.",
      by("vinculo", {
        alto: "Vieja lo espera junto a la cerca y le sale al encuentro apenas lo ve.",
        medio: "Vieja levanta la cabeza cuando lo oye llegar.",
        bajo: "Vieja lo mira desde lejos, sin acercarse. Él tampoco la llama."
      }, st),
      "La deuda sigue ahí. La tierra, también. Tiene que decidir qué hacer con ambas."
    ],
    choices: [
      { text: "Marcharse con Vieja.", fx: () => { s.quedarse = false; }, next: "final3",
        result: () => [["Lucho", "Vamos. Ya hicimos lo que pudimos."]] },
      { text: "Quedarse y seguir trabajando.", fx: () => { s.quedarse = true; s.orgullo = "alto"; }, next: "final3",
        result: () => [["Lucho", "Este campo era de mi padre. No voy a salir arrancando."]] }
    ]
  },

  pueblo: {
    bg: "dia", cap: 5,
    lines: (st) => [
      "Centro de Villa Alegre, de día. El pueblo sigue con su actividad cotidiana. Lucho busca a Ricardo.",
      ["Lucho", "Hay un hombre rondando el pueblo. Anda ofreciendo ayuda. No le acepten nada. Antes de mí hubo otros: lo dejaron escrito."],
      ["Ricardo", "Preocúpese de sus propias deudas, Lucho."],
      "Lucho intenta explicar lo que descubrió. Nadie le cree. Una mujer lo mira con preocupación. Un hombre se aleja.",
      "A lo lejos, el Forastero conversa tranquilamente con otro campesino. Levanta la mirada. Sus ojos se encuentran. El Forastero sonríe."
    ],
    choices: [
      { text: "Enfrentarlo públicamente.",
        show: (st) => atLeast("orgullo", "medio", st),
        fx: () => {}, next: "final4",
        result: (st) => [
          st.orgullo === "alto" ? "Lucho avanza hacia él sin pensarlo." : "Lucho duda un paso, y luego avanza.",
          "Pero el Forastero ya no está. Las personas creen que Lucho ha perdido la razón.",
          "Vieja se inquieta a su lado. Lucho comprende que no podrá convencerlos."] },
      { text: "Marcharse con Vieja.",
        fx: () => {}, next: "final4",
        result: () => ["Lucho comprende que no podrá convencerlos. Recoge las riendas de Vieja y se aleja del pueblo."] }
    ]
  },

  /* ===== FINALES ===== */
  final1: {
    bg: "final1", cap: 5, final: true,
    tag: "Final 01 · Trágico", title: "El precio del respeto",
    quote: "Todo tiene su precio. Hasta el respeto.",
    closing: "El respeto llegó, completo y puntual. Ya no quedó nadie dentro de Lucho para recibirlo.",
    lines: (st) => [
      "El Forastero sonríe. Se acerca a Vieja y le da unas palmadas suaves. La yegua intenta resistirse.",
      by("vinculo", {
        alto: "Vieja busca a Lucho con la mirada. Lo sigue buscando mientras el Forastero se la lleva hacia la bruma.",
        medio: "La yegua mira hacia Lucho.",
        bajo: "La yegua mira hacia Lucho, y él no levanta la vista."
      }, st),
      "Lucho vuelve a su libro de cuentas.",
      ["Forastero", "Buenas noches, patrón. Disfrute su respeto."],
      "El Forastero se aleja hacia la bruma. Los relinchos de Vieja se pierden en la distancia hasta que solo queda el silencio del campo.",
      "Lucho moja su dedo con saliva, pasa la página y sigue anotando números. Su rostro es una máscara de piedra.",
      "Mediodía en Villa Alegre. El sol cae sobre las paredes de adobe. Una carroza fúnebre negra, impecable, avanza por el centro del pueblo.",
      "En el pescante, el Forastero sostiene las riendas con serenidad. No se alcanza a ver el ataúd de Lucho.",
      "No hay cortejo. No hay flores. No hay nadie llorando. La carroza se detiene frente al portón abierto de la iglesia."
    ]
  },

  final2: {
    bg: "final2", cap: 5, final: true,
    tag: "Final 02 · Agridulce", title: "La última cosecha",
    quote: "La tierra volvió a dar. Él dejó de sentir.",
    closing: "Hay cosas que se pueden cuidar sin poder sentirlas. A veces eso es todo lo que queda.",
    lines: (st) => [
      "Atardecer. El campo está lleno de trigo. Hay dinero, herramientas nuevas y un cobertizo recién construido. Vieja descansa bajo techo, con alimento y agua.",
      "Lucho se acerca con un balde y lo deja frente a ella. La yegua levanta la cabeza y lo observa. Lucho no sonríe.",
      ["Lucho", "Coma. No tiene por qué pasar hambre."],
      by("vinculo", {
        alto: "Su mano se detiene a un palmo del lomo de Vieja. Durante unos segundos parece que recordará algo. Vuelve a bajar.",
        medio: "Durante unos segundos parece que recordará algo. Pero no ocurre nada.",
        bajo: "Vieja lo ve pasar y no levanta la cabeza. Ya casi no espera nada de él."
      }, st),
      "El Forastero aparece junto al portón.",
      ["Forastero", "Veo que decidió conservarla."],
      ["Lucho", "Fue de mi padre."],
      ["Forastero", "Y, sin embargo, ya no parece reconocerla. ¿No le pesa?"],
      ["Lucho", "No."],
      ["Forastero", "Entonces ha aprendido a disfrutar de lo que tiene."],
      "Lucho se aleja hacia la casa. Vieja continúa observándolo. Está viva y protegida, pero el vínculo que los unía ha desaparecido.",
      "Se escucha el viento."
    ]
  },

  final3: {
    bg: "final3", cap: 5, final: true,
    tag: "Final 03 · Liberación amarga", title: "La tierra sin dueño",
    quote: "No consiguió lo que quería. Pero conservó lo que era.",
    closing: (st) => st.quedarse
      ? "La deuda sigue ahí. Pero él también."
      : "Se fue con las manos vacías y el corazón entero.",
    lines: (st) => st.quedarse ? [
      "Pasan los meses. La sequía no cede y la deuda tampoco. Lucho vende la carreta, luego el arado. Don Ricardo viene a contar lo que queda y se va sin decir nada.",
      "Cada mañana saca a Vieja al campo y trabaja la misma tierra agrietada. No es heroico: es testarudo. Le duelen las manos. Le duele todo. Todavía puede sentirlo.",
      ["Lucho", by("vinculo", { alto: "Aquí nos quedamos, mi vieja. Que venga lo que venga.", medio: "Aquí nos quedamos, compañera. Que venga lo que venga.", bajo: "Aquí nos quedamos. Que venga lo que venga." }, st)],
      "Vieja resopla y lo sigue, surco abajo. No hay milagro ni cosecha inesperada. Hay un hombre, una yegua y una tierra que sigue siendo suya.",
      "A lo lejos, junto al camino, el Forastero los observa sin acercarse.",
      ["Forastero", "Ya volverá a necesitar algo."],
      "Lucho sigue trabajando."
    ] : [
      "Amanecer. Lucho prepara una pequeña carga con sus pertenencias. No tiene dinero suficiente para pagar sus deudas. El campo sigue seco. Mira la casa. Mira las herramientas. Finalmente se acerca a Vieja y le acomoda las riendas.",
      ["Lucho", "Vamos, compañera. Ya hicimos lo que pudimos."],
      by("vinculo", {
        alto: "La yegua relincha suavemente. Lucho la acaricia.",
        medio: "La yegua relincha suavemente. Lucho la acaricia.",
        bajo: "La yegua relincha suavemente. Lucho la acaricia, torpe: hace tiempo que no lo hacía."
      }, st),
      "Por primera vez en mucho tiempo, su rostro muestra una pequeña expresión de alivio.",
      "No ha recuperado su campo. No ha recuperado el respeto del pueblo. Pero conserva algo que el Forastero no pudo quitarle: su capacidad de sentir.",
      "Lucho comienza a caminar por el camino de tierra. A lo lejos, la bruma cubre el campo. El Forastero aparece junto a un árbol. No los persigue. Simplemente observa.",
      ["Forastero", "Ya volverá a necesitar algo."]
    ]
  },

  final4: {
    bg: "final4", cap: 5, final: true,
    tag: "Final 04 · Sobrenatural", title: "El último testigo",
    quote: "El diablo no necesita perseguirte. Solo necesita esperar al siguiente.",
    closing: "Hay advertencias que nadie escucha. Eso no las vuelve menos verdaderas.",
    lines: () => [
      "Lucho sale del centro del pueblo acompañado por Vieja. Se detiene en la calle. Al otro lado, el Forastero conversa con el campesino de rostro desesperado. Escucha con atención. No tiene prisa.",
      "Lucho comprende que la historia puede repetirse. Intenta acercarse, pero el Forastero levanta la mirada. Ambos se observan. El Forastero sonríe levemente.",
      ["Forastero", "Siempre hay alguien que necesita ayuda."],
      "Vieja se inquieta. Lucho aprieta las riendas.",
      ["Lucho", "Vámonos."],
      "Ambos se alejan. La cámara permanece en el centro del pueblo. El Forastero continúa conversando con el campesino. El viento mueve lentamente el polvo del camino."
    ]
  }
};

/* ===== FIN PARTE 1 ===== */

/* =========================================================
   MOTOR
   ========================================================= */
const $ = (id) => document.getElementById(id);
const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const wait = (ms) => new Promise((r) => setTimeout(r, reduced ? Math.min(ms, 60) : ms));
const veil = $("veil");

let busy = false, queue = [], idx = 0, onDone = null, current = null;
let lastCap = null, revealing = false, revealTimer = 0, toastTimer = 0, shownClues = 0;

function lock(b) { busy = b; document.body.classList.toggle("busy", b); }

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((el) => el.classList.remove("active", "ready"));
  $(id).classList.add("active");
}

/* ---------- Ambiente: partículas ligeras ---------- */
const AMB = { inicio: "dust", noche: "dust", bruma: "dust", almacen: "ember", fiesta: "ember", pacto: "none",
  lluvia: "rain", seco: "dust", dia: "dust", final1: "none", final2: "ember", final3: "dust", final4: "dust" };
const cv = $("fx");
const cx = cv.getContext ? cv.getContext("2d") : null;
let W = 0, H = 0, parts = [], mode = "dust", raf = 0;

function sizeCanvas() { W = cv.width = window.innerWidth; H = cv.height = window.innerHeight; }
function mkPart() {
  return { x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.5 + 0.4,
    vx: (Math.random() - 0.5) * 0.25, vy: Math.random() * 0.3 + 0.05, a: Math.random() * 0.35 + 0.1 };
}
function seedParts() {
  const n = mode === "rain" ? 90 : mode === "none" ? 0 : 36;
  parts = Array.from({ length: n }, mkPart);
}
function frame() {
  cx.clearRect(0, 0, W, H);
  for (const p of parts) {
    if (mode === "rain") {
      p.x += -1.6; p.y += 11;
      cx.strokeStyle = "rgba(200,215,220,.22)"; cx.beginPath();
      cx.moveTo(p.x, p.y); cx.lineTo(p.x + 1.6, p.y - 14); cx.stroke();
      if (p.y > H) { p.y = -20; p.x = Math.random() * (W + 60); }
    } else {
      p.x += p.vx; p.y += mode === "ember" ? -p.vy * 1.4 : p.vy;
      cx.fillStyle = mode === "ember" ? "rgba(200,157,84," + p.a + ")" : "rgba(245,242,240," + p.a * 0.7 + ")";
      cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, 6.283); cx.fill();
      if (p.y > H + 5) p.y = -5; if (p.y < -5) p.y = H + 5;
      if (p.x > W + 5) p.x = -5; if (p.x < -5) p.x = W + 5;
    }
  }
  raf = requestAnimationFrame(frame);
}
function startFx() {
  if (reduced || !cx) return;
  sizeCanvas(); seedParts(); cancelAnimationFrame(raf); raf = requestAnimationFrame(frame);
}
function setAmbience(bg) {
  document.body.dataset.bg = bg;
  mode = AMB[bg] || "dust";
  if (!reduced && cx) seedParts();
}
window.addEventListener("resize", () => { if (!reduced && cx) { sizeCanvas(); seedParts(); } });
document.addEventListener("visibilitychange", () => {
  if (reduced || !cx) return;
  if (document.hidden) cancelAnimationFrame(raf); else { cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); }
});

/* ---------- HUD: capítulo e indicios ---------- */
function syncClues() {
  const pips = document.querySelectorAll("#clues .pips i");
  pips.forEach((p, i) => p.classList.toggle("on", i < s.pistas));
  $("clues").classList.toggle("on", s.pistas > 0 && !s.pacto);
  $("clues").classList.toggle("full", s.pistas >= UMBRAL);
  if (s.pistas > shownClues) {
    const id = s.clues[s.clues.length - 1];
    if (!s.pacto) {
      showToast("Indicio · " + CLUES[id] + (s.pistas === UMBRAL ? ". Ya no es casualidad." : ""));
    }
  }
  shownClues = s.pistas;
}
function showToast(msg) {
  const t = $("toast");
  t.textContent = msg; t.classList.add("on");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("on"), 3800);
}

/* ---------- Texto progresivo ---------- */
function completeReveal() {
  clearTimeout(revealTimer);
  $("text").classList.add("done");
  revealing = false;
}

function showLine() {
  const line = queue[idx];
  const isArr = Array.isArray(line);
  const who = isArr ? line[0] : "";
  const text = isArr ? line[1] : line;
  const fx = isArr ? line[2] : null;

  $("stage").dataset.who = !who ? "narra" : who === "Lucho" ? "lucho" : who === "Forastero" ? "forastero" : "otro";
  $("speaker").textContent = who === "Forastero" ? "El Forastero" : who;

  const t = $("text");
  t.classList.remove("done");
  t.textContent = "";
  const words = (who ? "«" + text + "»" : text).split(" ");
  const step = Math.min(55, 2400 / words.length);
  words.forEach((w, i) => {
    const sp = document.createElement("span");
    sp.textContent = w + " ";
    sp.style.animationDelay = Math.round(i * step) + "ms";
    t.appendChild(sp);
  });

  clearTimeout(revealTimer);
  if (reduced) { t.classList.add("done"); revealing = false; }
  else { revealing = true; revealTimer = setTimeout(completeReveal, words.length * step + 700); }

  if (fx) {
    document.body.classList.add("fx-" + fx);
    setTimeout(() => document.body.classList.remove("fx-" + fx), 1500);
  }
  const nb = $("btn-next");
  nb.hidden = false;
}

function play(lines, done) {
  queue = lines || []; idx = 0; onDone = done;
  $("choices").innerHTML = "";
  if (!queue.length) { $("btn-next").hidden = true; done(); return; }
  showLine();
}

function advance() {
  if (busy) return;
  if (revealing) { completeReveal(); return; }
  if ($("btn-next").hidden) return;
  idx++;
  if (idx < queue.length) showLine();
  else { $("btn-next").hidden = true; const f = onDone; onDone = null; if (f) f(); }
}

/* ---------- Decisiones ---------- */
function getChoices(sc) {
  const list = typeof sc.choices === "function" ? sc.choices(s) : (sc.choices || []);
  return list.filter((c) => !c.show || c.show(s));
}

function showChoices() {
  const sc = current;
  const list = getChoices(sc);
  if (!list.length) { go(typeof sc.next === "function" ? sc.next(s) : sc.next); return; }
  const box = $("choices");
  box.innerHTML = "";
  list.forEach((c) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "btn";
    const sp = document.createElement("span"); sp.textContent = c.text; b.appendChild(sp);
    b.addEventListener("click", () => pick(c, b));
    box.appendChild(b);
  });
}

async function pick(c, btn) {
  if (busy) return;
  lock(true);
  const box = $("choices");
  Array.from(box.children).forEach((b) => b.classList.add(b === btn ? "picked" : "gone"));
  await wait(650);
  box.innerHTML = "";
  before = clone(s);
  if (c.fx) c.fx();
  syncClues();
  lock(false);
  const res = typeof c.result === "function" ? c.result(s, before) : (c.result || []);
  const nxt = c.next !== undefined ? c.next : current.next;
  const target = typeof nxt === "function" ? nxt(s) : nxt;
  play(res, () => go(target, c.transition || "scene"));
}

/* ---------- Escenas y transiciones ---------- */
async function go(id, kind) {
  const sc = scenes[id];
  if (!sc) { console.error("Escena inexistente:", id); return; }
  lock(true);
  $("btn-next").hidden = true;
  $("choices").innerHTML = "";
  const k = sc.final ? "final" : (kind || "scene");

  veil.className = "on " + k;
  await wait(k === "pacto" ? 2600 : k === "final" ? 3000 : 700);

  if (k === "pacto") {
    veil.querySelector(".veil-phrase").textContent = "No hubo firma. No hubo sangre. Ya no hay vuelta atrás.";
    veil.classList.add("phrase");
    await wait(3600);
    veil.classList.remove("phrase");
    await wait(1100);
  }

  current = sc;
  setAmbience(sc.bg);
  $("chapter").textContent = CAP[sc.cap].n + " · " + CAP[sc.cap].t;
  showScreen("game");
  $("stage").dataset.who = "narra";
  $("speaker").textContent = "";
  $("text").textContent = "";

  if (!sc.final && sc.cap !== lastCap) {
    veil.querySelector(".vc-n").textContent = CAP[sc.cap].n;
    veil.querySelector(".vc-t").textContent = CAP[sc.cap].t;
    veil.classList.add("card");
    await wait(2800);
    veil.classList.remove("card");
    await wait(900);
  }
  if (!sc.final) lastCap = sc.cap;

  if (sc.enter) sc.enter();
  syncClues();
  veil.className = "";
  await wait(1000);
  lock(false);

  const lines = typeof sc.lines === "function" ? sc.lines(s) : sc.lines;
  play(lines, () => { if (sc.final) showEnd(sc); else showChoices(); });
}

async function showEnd(sc) {
  lock(true);
  $("btn-next").hidden = true;
  veil.className = "on final";
  await wait(2400);
  $("end-tag").textContent = sc.tag;
  $("end-title").textContent = sc.title;
  $("end-quote").textContent = "«" + sc.quote + "»";
  $("end-closing").textContent = typeof sc.closing === "function" ? sc.closing(s) : sc.closing;
  showScreen("end");
  veil.className = "";
  await wait(reduced ? 0 : 7200);
  $("end").classList.add("ready");
  lock(false);
}

/* ---------- Inicio / reinicio ---------- */
function resetGame() {
  s = newState(); before = newState();
  lastCap = null; shownClues = 0;
  $("toast").classList.remove("on");
  syncClues();
}

function begin() {
  if (busy) return;
  resetGame();
  go("campo");
}

async function home() {
  if (busy) return;
  lock(true);
  veil.className = "on scene";
  await wait(900);
  resetGame();
  setAmbience("inicio");
  showScreen("start");
  veil.className = "";
  await wait(900);
  lock(false);
}

$("btn-start").addEventListener("click", begin);
$("btn-restart").addEventListener("click", begin);
$("btn-home").addEventListener("click", home);
$("btn-next").addEventListener("click", advance);
$("stage").addEventListener("click", () => { if (!$("btn-next").hidden) advance(); });

document.addEventListener("keydown", (e) => {
  if (busy) return;
  const n = parseInt(e.key, 10);
  if (n >= 1) {
    const b = $("choices").children[n - 1];
    if (b) { b.click(); return; }
  }
  if ((e.key === "Enter" || e.key === " ") && document.activeElement === document.body && !$("btn-next").hidden) {
    e.preventDefault(); advance();
  }
});

setAmbience("inicio");
startFx();
