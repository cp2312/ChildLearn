// public/js/curriculum.js
// Complete curriculum for Pre Jardín, Jardín, Transición

export const CURRICULUM = {
  prejarden: {
    name: "Pre Jardín",
    emoji: "🌱",
    age: "3 - 4 años",
    color: "#FF6B6B",
    topics: {
      colores: {
        name: "Colores",
        emoji: "🎨",
        color: "#FF6B6B",
        activities: [
          { id: "color-identify", name: "¿De qué color es?", desc: "Identificar el color mostrado", icon: "👁️", type: "identify-color" },
          { id: "color-select", name: "Selecciona el color", desc: "Elige el color correcto", icon: "☝️", type: "select-color" },
          { id: "color-object", name: "Color del objeto", desc: "Relaciona objeto con su color", icon: "🔗", type: "object-color" },
          { id: "color-memory", name: "Memoria de colores", desc: "Encuentra los pares de colores", icon: "🧠", type: "memory-color" },
          { id: "color-classify", name: "Clasifica colores", desc: "Agrupa objetos por color", icon: "📂", type: "classify-color" }
        ]
      },
      vocales: {
        name: "Vocales",
        emoji: "🔤",
        color: "#4ECDC4",
        activities: [
          { id: "vocal-recognize", name: "Reconocer vocal", desc: "¿Cuál es esta vocal?", icon: "👀", type: "recognize-vocal" },
          { id: "vocal-listen", name: "Escuchar y elegir", desc: "Escucha y selecciona la vocal", icon: "👂", type: "listen-vocal" },
          { id: "vocal-complete", name: "Completar palabra", desc: "¿Qué vocal falta?", icon: "✏️", type: "complete-word" },
          { id: "vocal-image", name: "Imagen y vocal", desc: "Relaciona imagen con vocal", icon: "🖼️", type: "image-vocal" },
          { id: "vocal-memory", name: "Memoria de vocales", desc: "Encuentra los pares", icon: "🧠", type: "memory-vocal" }
        ]
      },
      animales: {
        name: "Animales",
        emoji: "🐾",
        color: "#A855F7",
        activities: [
          { id: "animal-recognize", name: "¿Qué animal es?", desc: "Identifica el animal", icon: "👁️", type: "recognize-animal" },
          { id: "animal-sound", name: "Sonido del animal", desc: "¿Qué animal hace ese sonido?", icon: "🔊", type: "sound-animal" },
          { id: "animal-classify", name: "Clasificar animales", desc: "Doméstico o salvaje", icon: "📂", type: "classify-animal" },
          { id: "animal-memory", name: "Memoria de animales", desc: "Encuentra los pares", icon: "🧠", type: "memory-animal" },
          { id: "animal-habitat", name: "¿Dónde vive?", desc: "Selecciona el hábitat", icon: "🏠", type: "habitat-animal" }
        ]
      },
      cuerpo: {
        name: "Partes del cuerpo",
        emoji: "🧍",
        color: "#F97316",
        activities: [
          { id: "body-identify", name: "¿Qué parte es?", desc: "Identifica la parte del cuerpo", icon: "👁️", type: "identify-body" },
          { id: "body-touch", name: "Toca tu...", desc: "Señala la parte indicada", icon: "☝️", type: "touch-body" },
          { id: "body-complete", name: "Completa el cuerpo", desc: "¿Qué parte falta?", icon: "✏️", type: "complete-body" },
          { id: "body-memory", name: "Memoria del cuerpo", desc: "Encuentra los pares", icon: "🧠", type: "memory-body" }
        ]
      },
      sonidos: {
        name: "Sonidos",
        emoji: "🔊",
        color: "#3B82F6",
        activities: [
          { id: "sound-identify", name: "¿Qué hace ese sonido?", desc: "Identifica la fuente del sonido", icon: "👂", type: "identify-sound" },
          { id: "sound-animal", name: "Sonidos de animales", desc: "¿Qué animal es?", icon: "🐾", type: "animal-sound-match" },
          { id: "sound-memory", name: "Memoria de sonidos", desc: "Empareja los sonidos", icon: "🧠", type: "memory-sound" }
        ]
      },
      frutas: {
        name: "Frutas",
        emoji: "🍎",
        color: "#22C55E",
        activities: [
          { id: "fruit-identify", name: "¿Qué fruta es?", desc: "Identifica la fruta", icon: "👁️", type: "identify-fruit" },
          { id: "fruit-color", name: "Color de la fruta", desc: "Relaciona fruta y color", icon: "🎨", type: "fruit-color" },
          { id: "fruit-memory", name: "Memoria de frutas", desc: "Encuentra los pares", icon: "🧠", type: "memory-fruit" },
          { id: "fruit-classify", name: "Clasifica las frutas", desc: "Agrupa por características", icon: "📂", type: "classify-fruit" }
        ]
      },
      transporte: {
        name: "Transporte",
        emoji: "🚗",
        color: "#EC4899",
        activities: [
          { id: "transport-identify", name: "¿Qué es?", desc: "Identifica el transporte", icon: "👁️", type: "identify-transport" },
          { id: "transport-classify", name: "Tierra, mar o aire", desc: "Clasifica el transporte", icon: "📂", type: "classify-transport" },
          { id: "transport-memory", name: "Memoria de transportes", desc: "Encuentra los pares", icon: "🧠", type: "memory-transport" }
        ]
      }
    }
  },

  jardin: {
    name: "Jardín",
    emoji: "🌸",
    age: "4 - 5 años",
    color: "#4ECDC4",
    topics: {
      numeros: {
        name: "Números 1-20",
        emoji: "🔢",
        color: "#3B82F6",
        activities: [
          { id: "num-count", name: "Contar objetos", desc: "¿Cuántos hay?", icon: "🔢", type: "count-objects" },
          { id: "num-select", name: "Seleccionar número", desc: "Elige el número correcto", icon: "☝️", type: "select-number" },
          { id: "num-relate", name: "Cantidad y número", desc: "Relaciona cantidad con número", icon: "🔗", type: "relate-number" },
          { id: "num-order", name: "Ordenar números", desc: "Pon los números en orden", icon: "📋", type: "order-numbers" },
          { id: "num-sequence", name: "Completar secuencia", desc: "¿Qué número sigue?", icon: "➡️", type: "number-sequence" }
        ]
      },
      figuras: {
        name: "Figuras geométricas",
        emoji: "🔷",
        color: "#A855F7",
        activities: [
          { id: "shape-recognize", name: "¿Qué figura es?", desc: "Identifica la figura", icon: "👁️", type: "recognize-shape" },
          { id: "shape-classify", name: "Clasificar figuras", desc: "Agrupa por tipo", icon: "📂", type: "classify-shape" },
          { id: "shape-object", name: "Figura en el objeto", desc: "¿Qué figura tiene?", icon: "🔗", type: "shape-object" },
          { id: "shape-count", name: "Contar lados", desc: "¿Cuántos lados tiene?", icon: "🔢", type: "count-sides" }
        ]
      },
      coloresAvanzados: {
        name: "Colores avanzados",
        emoji: "🌈",
        color: "#F97316",
        activities: [
          { id: "color-adv-mix", name: "Mezcla de colores", desc: "¿Qué color forman?", icon: "🎨", type: "color-mixing" },
          { id: "color-adv-shades", name: "Claro y oscuro", desc: "Identifica tonos", icon: "💡", type: "color-shades" },
          { id: "color-adv-memory", name: "Memoria avanzada", desc: "8 pares de colores", icon: "🧠", type: "memory-color-adv" }
        ]
      },
      animalesJardin: {
        name: "Animales",
        emoji: "🦁",
        color: "#22C55E",
        activities: [
          { id: "animal-j-recognize", name: "¿Quién soy?", desc: "Identifica el animal por silueta", icon: "👁️", type: "silhouette-animal" },
          { id: "animal-j-habitat", name: "Mi hogar", desc: "Empareja animal con hábitat", icon: "🏠", type: "habitat-match" },
          { id: "animal-j-classify", name: "Mamífero, ave o reptil", desc: "Clasifica por tipo", icon: "📂", type: "classify-animal-type" },
          { id: "animal-j-memory", name: "Memoria animal", desc: "12 pares", icon: "🧠", type: "memory-animal-adv" }
        ]
      },
      inglesBasico: {
        name: "Inglés básico",
        emoji: "🇬🇧",
        color: "#EC4899",
        activities: [
          { id: "eng-colors", name: "Colors", desc: "Aprende colores en inglés", icon: "🎨", type: "eng-colors" },
          { id: "eng-numbers", name: "Numbers", desc: "Números en inglés", icon: "🔢", type: "eng-numbers" },
          { id: "eng-animals", name: "Animals", desc: "Animales en inglés", icon: "🐾", type: "eng-animals" },
          { id: "eng-greetings", name: "Greetings", desc: "Saludos en inglés", icon: "👋", type: "eng-greetings" },
          { id: "eng-memory", name: "Memory Game", desc: "Empareja español-inglés", icon: "🧠", type: "eng-memory" }
        ]
      },
      secuencias: {
        name: "Secuencias",
        emoji: "➡️",
        color: "#FF6B6B",
        activities: [
          { id: "seq-pattern", name: "¿Qué sigue?", desc: "Completa el patrón", icon: "➡️", type: "pattern-sequence" },
          { id: "seq-story", name: "Ordena la historia", desc: "Secuencia de imágenes", icon: "📖", type: "story-sequence" },
          { id: "seq-sizes", name: "De pequeño a grande", desc: "Ordena por tamaño", icon: "📏", type: "size-sequence" }
        ]
      },
      clasificacion: {
        name: "Clasificación",
        emoji: "📂",
        color: "#4ECDC4",
        activities: [
          { id: "clas-group", name: "¿A cuál grupo pertenece?", desc: "Clasifica el objeto", icon: "📂", type: "group-classify" },
          { id: "clas-odd", name: "¿Cuál no pertenece?", desc: "Encuentra el intruso", icon: "❌", type: "odd-one-out" },
          { id: "clas-alike", name: "Son iguales", desc: "Agrupa los iguales", icon: "🔗", type: "group-alike" }
        ]
      }
    }
  },

  transicion: {
    name: "Transición",
    emoji: "🌺",
    age: "5 - 6 años",
    color: "#A855F7",
    topics: {
      conteoAvanzado: {
        name: "Conteo avanzado",
        emoji: "🔢",
        color: "#3B82F6",
        activities: [
          { id: "count-adv-20", name: "Contar hasta 20", desc: "Cuenta objetos hasta 20", icon: "🔢", type: "count-to-20" },
          { id: "count-adv-compare", name: "Más o menos", desc: "Compara cantidades", icon: "⚖️", type: "compare-quantities" },
          { id: "count-adv-skip", name: "Contar de 2 en 2", desc: "Conteo salteado", icon: "⏭️", type: "skip-count" },
          { id: "count-adv-before-after", name: "Antes y después", desc: "¿Qué número va?", icon: "↔️", type: "before-after" }
        ]
      },
      sumas: {
        name: "Sumas básicas",
        emoji: "➕",
        color: "#22C55E",
        activities: [
          { id: "sum-objects", name: "Suma con objetos", desc: "Une y cuenta", icon: "🔢", type: "sum-objects" },
          { id: "sum-numbers", name: "¿Cuánto es?", desc: "Suma números", icon: "➕", type: "sum-numbers" },
          { id: "sum-complete", name: "Completa la suma", desc: "¿Qué número falta?", icon: "❓", type: "complete-sum" },
          { id: "sum-word", name: "Suma en palabras", desc: "Resuelve el problema", icon: "📝", type: "word-sum" }
        ]
      },
      restas: {
        name: "Restas básicas",
        emoji: "➖",
        color: "#FF6B6B",
        activities: [
          { id: "sub-objects", name: "Resta con objetos", desc: "Quita y cuenta", icon: "🔢", type: "sub-objects" },
          { id: "sub-numbers", name: "¿Cuánto queda?", desc: "Resta números", icon: "➖", type: "sub-numbers" },
          { id: "sub-complete", name: "Completa la resta", desc: "¿Qué número falta?", icon: "❓", type: "complete-sub" }
        ]
      },
      ingles: {
        name: "Inglés",
        emoji: "🇬🇧",
        color: "#EC4899",
        activities: [
          { id: "eng-t-body", name: "Body Parts", desc: "Partes del cuerpo en inglés", icon: "🧍", type: "eng-body" },
          { id: "eng-t-colors", name: "Colors & Shapes", desc: "Colores y figuras", icon: "🎨", type: "eng-colors-shapes" },
          { id: "eng-t-numbers", name: "Numbers 1-20", desc: "Números hasta 20", icon: "🔢", type: "eng-numbers-20" },
          { id: "eng-t-animals", name: "Wild Animals", desc: "Animales salvajes", icon: "🦁", type: "eng-wild-animals" },
          { id: "eng-t-memory", name: "Word Memory", desc: "Memoria de palabras", icon: "🧠", type: "eng-word-memory" },
          { id: "eng-t-match", name: "Word Match", desc: "Empareja palabra-imagen", icon: "🔗", type: "eng-word-match" }
        ]
      },
      memoria: {
        name: "Memoria",
        emoji: "🧠",
        color: "#4ECDC4",
        activities: [
          { id: "mem-pairs4", name: "Memoria 4 pares", desc: "Nivel fácil", icon: "🟢", type: "memory-4" },
          { id: "mem-pairs6", name: "Memoria 6 pares", desc: "Nivel medio", icon: "🟡", type: "memory-6" },
          { id: "mem-pairs8", name: "Memoria 8 pares", desc: "Nivel difícil", icon: "🔴", type: "memory-8" },
          { id: "mem-sequence", name: "Sigue la secuencia", desc: "Recuerda y repite", icon: "📋", type: "sequence-memory" }
        ]
      },
      logica: {
        name: "Lógica",
        emoji: "🧩",
        color: "#F97316",
        activities: [
          { id: "log-pattern", name: "Completa el patrón", desc: "Sigue la secuencia lógica", icon: "🔷", type: "logic-pattern" },
          { id: "log-classify", name: "Clasificación lógica", desc: "Agrupa por criterio", icon: "📂", type: "logic-classify" },
          { id: "log-odd", name: "¿Cuál es diferente?", desc: "Encuentra al intruso", icon: "❌", type: "logic-odd" },
          { id: "log-differences", name: "Encuentra diferencias", desc: "¿Qué cambió?", icon: "🔍", type: "find-differences" },
          { id: "log-size-order", name: "Ordenar por tamaño", desc: "De menor a mayor", icon: "📏", type: "size-order" }
        ]
      },
      asociacion: {
        name: "Asociación",
        emoji: "🔗",
        color: "#A855F7",
        activities: [
          { id: "assoc-word-img", name: "Palabra e imagen", desc: "Une la palabra con su imagen", icon: "🔗", type: "word-image" },
          { id: "assoc-shadow", name: "Sombra y objeto", desc: "Une el objeto con su sombra", icon: "🌑", type: "shadow-match" },
          { id: "assoc-use", name: "¿Para qué sirve?", desc: "Relaciona objeto y uso", icon: "💡", type: "object-use" },
          { id: "assoc-opposite", name: "Opuestos", desc: "Relaciona contrarios", icon: "↔️", type: "opposites" }
        ]
      },
      patrones: {
        name: "Patrones",
        emoji: "🔷",
        color: "#FFE66D",
        activities: [
          { id: "pat-color", name: "Patrón de colores", desc: "¿Qué color sigue?", icon: "🎨", type: "color-pattern" },
          { id: "pat-shape", name: "Patrón de figuras", desc: "¿Qué figura sigue?", icon: "🔷", type: "shape-pattern" },
          { id: "pat-num", name: "Patrón numérico", desc: "¿Qué número sigue?", icon: "🔢", type: "number-pattern" },
          { id: "pat-size", name: "Patrón de tamaño", desc: "¿Qué tamaño sigue?", icon: "📏", type: "size-pattern" }
        ]
      }
    }
  }
};

// Color data
export const COLORS_DATA = [
  { name: "Rojo", emoji: "🔴", hex: "#EF4444", eng: "Red" },
  { name: "Azul", emoji: "🔵", hex: "#3B82F6", eng: "Blue" },
  { name: "Verde", emoji: "🟢", hex: "#22C55E", eng: "Green" },
  { name: "Amarillo", emoji: "🟡", hex: "#EAB308", eng: "Yellow" },
  { name: "Naranja", emoji: "🟠", hex: "#F97316", eng: "Orange" },
  { name: "Morado", emoji: "🟣", hex: "#A855F7", eng: "Purple" },
  { name: "Rosa", emoji: "🌸", hex: "#EC4899", eng: "Pink" },
  { name: "Café", emoji: "🟤", hex: "#92400E", eng: "Brown" },
  { name: "Negro", emoji: "⚫", hex: "#1E293B", eng: "Black" },
  { name: "Blanco", emoji: "⚪", hex: "#F8FAFC", eng: "White" }
];

// Vowels data
export const VOWELS_DATA = [
  { letter: "A", upper: "A", lower: "a", words: [{ word: "Avión", emoji: "✈️" }, { word: "Árbol", emoji: "🌳" }, { word: "Araña", emoji: "🕷️" }] },
  { letter: "E", upper: "E", lower: "e", words: [{ word: "Elefante", emoji: "🐘" }, { word: "Estrella", emoji: "⭐" }, { word: "Espejo", emoji: "🪞" }] },
  { letter: "I", upper: "I", lower: "i", words: [{ word: "Iglú", emoji: "🏠" }, { word: "Isla", emoji: "🏝️" }, { word: "Iguana", emoji: "🦎" }] },
  { letter: "O", upper: "O", lower: "o", words: [{ word: "Oso", emoji: "🐻" }, { word: "Oveja", emoji: "🐑" }, { word: "Orca", emoji: "🐋" }] },
  { letter: "U", upper: "U", lower: "u", words: [{ word: "Uva", emoji: "🍇" }, { word: "Unicornio", emoji: "🦄" }, { word: "Urraca", emoji: "🐦" }] }
];

// Animals data
export const ANIMALS_DATA = {
  domestic: [
    { name: "Perro", emoji: "🐕", sound: "Guau guau", habitat: "casa", eng: "Dog" },
    { name: "Gato", emoji: "🐈", sound: "Miau miau", habitat: "casa", eng: "Cat" },
    { name: "Vaca", emoji: "🐄", sound: "Muuu", habitat: "granja", eng: "Cow" },
    { name: "Cerdo", emoji: "🐷", sound: "Oink oink", habitat: "granja", eng: "Pig" },
    { name: "Gallina", emoji: "🐔", sound: "Cococó", habitat: "granja", eng: "Hen" },
    { name: "Oveja", emoji: "🐑", sound: "Beee", habitat: "granja", eng: "Sheep" }
  ],
  wild: [
    { name: "León", emoji: "🦁", sound: "Roooar", habitat: "sabana", eng: "Lion" },
    { name: "Elefante", emoji: "🐘", sound: "Pruuum", habitat: "sabana", eng: "Elephant" },
    { name: "Mono", emoji: "🐒", sound: "Ji ji ji", habitat: "selva", eng: "Monkey" },
    { name: "Tigre", emoji: "🐯", sound: "Grrrr", habitat: "selva", eng: "Tiger" },
    { name: "Oso", emoji: "🐻", sound: "Uhmm uhmm", habitat: "bosque", eng: "Bear" },
    { name: "Jirafa", emoji: "🦒", sound: "Mmmh", habitat: "sabana", eng: "Giraffe" },
    { name: "Cebra", emoji: "🦓", sound: "Hiii hiii", habitat: "sabana", eng: "Zebra" },
    { name: "Hipopótamo", emoji: "🦛", sound: "Jom jom", habitat: "río", eng: "Hippo" }
  ],
  birds: [
    { name: "Pájaro", emoji: "🐦", sound: "Pío pío", habitat: "árbol", eng: "Bird" },
    { name: "Pinguino", emoji: "🐧", sound: "Cuic cuic", habitat: "polo", eng: "Penguin" },
    { name: "Pato", emoji: "🦆", sound: "Cuac cuac", habitat: "lago", eng: "Duck" },
    { name: "Búho", emoji: "🦉", sound: "Uuu uuu", habitat: "árbol", eng: "Owl" }
  ],
  marine: [
    { name: "Pez", emoji: "🐟", sound: "", habitat: "mar", eng: "Fish" },
    { name: "Delfín", emoji: "🐬", sound: "Ii ii ii", habitat: "mar", eng: "Dolphin" },
    { name: "Tortuga", emoji: "🐢", sound: "", habitat: "mar", eng: "Turtle" }
  ]
};

// Fruits data
export const FRUITS_DATA = [
  { name: "Manzana", emoji: "🍎", color: "rojo", eng: "Apple" },
  { name: "Banano", emoji: "🍌", color: "amarillo", eng: "Banana" },
  { name: "Uvas", emoji: "🍇", color: "morado", eng: "Grapes" },
  { name: "Naranja", emoji: "🍊", color: "naranja", eng: "Orange" },
  { name: "Fresa", emoji: "🍓", color: "rojo", eng: "Strawberry" },
  { name: "Sandía", emoji: "🍉", color: "verde", eng: "Watermelon" },
  { name: "Piña", emoji: "🍍", color: "amarillo", eng: "Pineapple" },
  { name: "Pera", emoji: "🍐", color: "verde", eng: "Pear" },
  { name: "Mango", emoji: "🥭", color: "naranja", eng: "Mango" },
  { name: "Limón", emoji: "🍋", color: "amarillo", eng: "Lemon" }
];

// Shapes data
export const SHAPES_DATA = [
  { name: "Círculo", emoji: "⭕", sides: 0, color: "#EF4444", eng: "Circle" },
  { name: "Triángulo", emoji: "🔺", sides: 3, color: "#F97316", eng: "Triangle" },
  { name: "Cuadrado", emoji: "🟥", sides: 4, color: "#3B82F6", eng: "Square" },
  { name: "Rectángulo", emoji: "▬", sides: 4, color: "#22C55E", eng: "Rectangle" },
  { name: "Estrella", emoji: "⭐", sides: 5, color: "#EAB308", eng: "Star" },
  { name: "Hexágono", emoji: "⬡", sides: 6, color: "#A855F7", eng: "Hexagon" },
  { name: "Corazón", emoji: "❤️", sides: 0, color: "#EC4899", eng: "Heart" },
  { name: "Diamante", emoji: "💎", sides: 4, color: "#06B6D4", eng: "Diamond" }
];

// Body parts
export const BODY_PARTS = [
  { name: "Cabeza", emoji: "🗣️", eng: "Head" },
  { name: "Ojos", emoji: "👀", eng: "Eyes" },
  { name: "Nariz", emoji: "👃", eng: "Nose" },
  { name: "Boca", emoji: "👄", eng: "Mouth" },
  { name: "Orejas", emoji: "👂", eng: "Ears" },
  { name: "Brazos", emoji: "💪", eng: "Arms" },
  { name: "Manos", emoji: "🙌", eng: "Hands" },
  { name: "Piernas", emoji: "🦵", eng: "Legs" },
  { name: "Pies", emoji: "🦶", eng: "Feet" },
  { name: "Barriga", emoji: "🤰", eng: "Belly" }
];

// Transport
export const TRANSPORT_DATA = [
  { name: "Auto", emoji: "🚗", type: "tierra", eng: "Car" },
  { name: "Bus", emoji: "🚌", type: "tierra", eng: "Bus" },
  { name: "Bicicleta", emoji: "🚲", type: "tierra", eng: "Bicycle" },
  { name: "Tren", emoji: "🚂", type: "tierra", eng: "Train" },
  { name: "Moto", emoji: "🏍️", type: "tierra", eng: "Motorcycle" },
  { name: "Avión", emoji: "✈️", type: "aire", eng: "Airplane" },
  { name: "Helicóptero", emoji: "🚁", type: "aire", eng: "Helicopter" },
  { name: "Barco", emoji: "🚢", type: "agua", eng: "Ship" },
  { name: "Lancha", emoji: "🚤", type: "agua", eng: "Boat" }
];

// English greetings
export const GREETINGS_DATA = [
  { eng: "Hello!", esp: "¡Hola!", emoji: "👋" },
  { eng: "Good morning!", esp: "¡Buenos días!", emoji: "🌅" },
  { eng: "Good afternoon!", esp: "¡Buenas tardes!", emoji: "☀️" },
  { eng: "Good night!", esp: "¡Buenas noches!", emoji: "🌙" },
  { eng: "Goodbye!", esp: "¡Adiós!", emoji: "👋" },
  { eng: "Thank you!", esp: "¡Gracias!", emoji: "🙏" },
  { eng: "Please!", esp: "¡Por favor!", emoji: "😊" },
  { eng: "Yes / No", esp: "Sí / No", emoji: "✅" }
];

// Environmental sounds (non-animal) for the "Sonidos" topic in Pre Jardín
export const SOUNDS_DATA = [
  { name: "Campana", emoji: "🔔", sound: "Riiing riiing" },
  { name: "Teléfono", emoji: "📞", sound: "Rin rin" },
  { name: "Lluvia", emoji: "🌧️", sound: "Tic tic tic" },
  { name: "Trueno", emoji: "⛈️", sound: "Bruuum" },
  { name: "Carro", emoji: "🚗", sound: "Bip bip" },
  { name: "Tren", emoji: "🚂", sound: "Chuu chuu" },
  { name: "Reloj", emoji: "⏰", sound: "Tic tac" },
  { name: "Aplausos", emoji: "👏", sound: "Clap clap" },
  { name: "Viento", emoji: "💨", sound: "Fiuuu" },
  { name: "Tambor", emoji: "🥁", sound: "Pum pum" }
];