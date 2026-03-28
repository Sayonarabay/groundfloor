// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing
  await prisma.script.deleteMany()
  await prisma.walk.deleteMany()

  const walks = [
    {
      title: "Le jardin fermé",
      city: "Paris",
      district: "13ème — BNF",
      protagonist: "Autor editorial",
      status: "en-desarrollo",
      recordingDate: new Date("2026-04-18"),
      publishDate: new Date("2026-04-28"),
      cost: 550,
      duration: 22,
      notes: "Walk de autor. Esplanade → interior zona libre → pasarela Simone de Beauvoir → Los Frigos. Todo acceso gratuito.",
      script: {
        create: {
          arrivalSpeaker: "Narrador",
          arrivalText: `Antes de mirar las torres, mira a la gente.\n\nEs lo primero que hago siempre. No el edificio — la gente alrededor del edificio. Cómo se mueve, adónde mira, qué ignora. Y aquí hay algo que me inquieta cada vez que vengo: nadie mira hacia arriba.\n\nTreinta y nueve pisos de vidrio, cuatro torres que deberían ser imposibles de ignorar, y la gente cruza esta esplanade con la cabeza baja, deprisa, como si hubieran llegado a un acuerdo tácito con el monumento. Tú sigues ahí. Yo paso por delante. Ninguno le debemos nada al otro.\n\nEso me parece más interesante que cualquier dato sobre el arquitecto.`,
          arrivalNotes: "Instrucción: Sube las escalinatas desde el Quai François-Mauriac. Camina hasta el borde interior de la esplanade.",

          observationText: `El jardín que ves ahora no puedes pisarlo.\n\nNadie puede. Existe para ser mirado desde aquí, desde los cristales de las salas de lectura, desde los despachos de las torres. Perrault lo diseñó como el jardín de un claustro: en el centro de todo, inaccesible para todos.\n\nCiento veintiséis pinos traídos de los bosques de Normandía. Los especialistas lo sabían desde el principio: sacar un pino adulto de su suelo, privarlo del viento, de la lluvia directa, del contacto real con el mundo, es pedirle que finja estar vivo en condiciones que no reconoce.\n\nY sin embargo el jardín existe. Vive sin nosotros mejor que con nosotros. Un halcón peregrino ha anidado en lo alto de una de las torres.`,
          observationSpeaker: "Narrador",
          observationNotes: "Instrucción: Camina hasta donde las torres abren el hueco. El jardín está abajo.",

          discoveryText: `Para un momento.\n\nMira quién está aquí.\n\nLos estudiantes que han venido a estudiar porque en casa no pueden concentrarse. Los jubilados que leen el periódico porque aquí está caliente y tranquilo. Los investigadores que llevan años consultando los mismos fondos y conocen a los bibliotecarios por su nombre.\n\nEste es el uso real de un monumento presidencial. No el que Mitterrand imaginó cuando le pidió a Perrault un edificio eterno — el que la ciudad le impuso después, como siempre hace.`,
          discoverySpeaker: "Narrador",
          discoveryNotes: "Instrucción: Entra por el Hall Est. No necesitas credencial para la zona de libre acceso.",

          expansionText: `Esta pasarela se llama Simone de Beauvoir.\n\nLa inauguraron en 2006. Es el único puente peatonal de París construido en el siglo XXI, y tiene una forma que no tiene ningún otro puente de la ciudad: dos arcos que se cruzan en el centro, creando un espacio intermedio que no es ni una orilla ni la otra. Un lugar que solo existe en el cruce.\n\nMira hacia el sur desde aquí. Ese edificio de hormigón con los muros taguéados que parece un bunker industrial es Los Frigos.`,
          expansionSpeaker: "Narrador",
          expansionNotes: "Instrucción: Sal del Hall Est. La pasarela está a dos minutos hacia el este.",

          reframingText: `Estás frente a un edificio que nadie diseñó para que fuera hermoso.\n\nLos muros de hormigón tienen setenta centímetros de espesor. Las ventanas las abrieron a golpe de martillo neumático. Los tags cubren cada superficie exterior disponible.\n\nY sin embargo hay algo aquí que la BNF, con todo su presupuesto y toda su voluntad de eternidad, no tiene: la sensación de que dentro pasa algo ahora mismo.\n\nLa diferencia es que uno lo decidió un presidente, y el otro lo decidió la gente que no tenía adónde ir.`,
          reframingSpeaker: "Narrador",
          reframingNotes: "Instrucción: Baja de la pasarela. Rue des Frigos 19.",
        }
      }
    },
    {
      title: "Les murs de JR",
      city: "Paris",
      district: "Belleville — 20ème",
      protagonist: "JR",
      status: "idea",
      recordingDate: new Date("2026-06-01"),
      cost: 0,
      duration: 25,
      notes: "Protagonista: JR. Empezó pegando fotos en muros de Belleville con 17 años. Proponer co-autoría, no fee fijo.",
    },
    {
      title: "Ici c'était nous",
      city: "Paris",
      district: "Châtelet — Les Halles",
      protagonist: "Abd Al Malik",
      status: "idea",
      cost: 0,
      duration: 20,
      notes: "La escena del rap francés nació en las escaleras del RER de Châtelet en los 90. Contactar via editorial.",
    },
    {
      title: "La table",
      city: "Paris",
      district: "Aligre — 11ème",
      protagonist: "Iñaki Aizpitarte",
      status: "idea",
      cost: 0,
      duration: 22,
      notes: "Marché d'Aligre a las 8h. El más accesible de los protagonistas. Sin gran aparato de representación.",
    },
    {
      title: "Le son",
      city: "Paris",
      district: "Rex Club — 10ème",
      protagonist: "Laurent Garnier",
      status: "idea",
      cost: 0,
      duration: 24,
      notes: "Tiene libro Electrochoc. Accesible via Rex Club directamente.",
    },
  ]

  for (const walk of walks) {
    await prisma.walk.create({ data: walk as any })
  }

  console.log('✓ Seed complete — 5 walks created')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
