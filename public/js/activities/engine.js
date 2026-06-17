// public/js/activities/engine.js
// Generates activity question sets for all types

import {
  COLORS_DATA,
  VOWELS_DATA,
  ANIMALS_DATA,
  FRUITS_DATA,
  SHAPES_DATA,
  BODY_PARTS,
  TRANSPORT_DATA,
  GREETINGS_DATA,
  SOUNDS_DATA,
} from "../curriculum.js";

// Shuffle array
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Random sample
function sample(arr, n) {
  return shuffle(arr).slice(0, n);
}

// Pick random wrong options
function pickWrong(arr, correct, n, key = "name") {
  return shuffle(arr.filter((x) => x[key] !== correct[key])).slice(0, n);
}

// ===== ACTIVITY GENERATORS =====

const generators = {
  // --- COLORS ---
  "identify-color": () => {
    return sample(COLORS_DATA, 6).map((color) => ({
      type: "identify-color",
      question: "¿De qué color es este círculo?",
      target: color,
      options: shuffle([color, ...pickWrong(COLORS_DATA, color, 3)]),
      correct: color.name,
    }));
  },

  "select-color": () => {
    return sample(COLORS_DATA, 6).map((color) => ({
      type: "select-color",
      question: `Selecciona el color: ${color.name}`,
      target: color,
      options: shuffle([color, ...pickWrong(COLORS_DATA, color, 3)]),
      correct: color.name,
    }));
  },

  "object-color": () => {
    const items = [
      { obj: "Manzana", emoji: "🍎", color: "Rojo" },
      { obj: "Banana", emoji: "🍌", color: "Amarillo" },
      { obj: "Hierba", emoji: "🌿", color: "Verde" },
      { obj: "Cielo", emoji: "🌤️", color: "Azul" },
      { obj: "Naranja", emoji: "🍊", color: "Naranja" },
      { obj: "Uvas", emoji: "🍇", color: "Morado" },
    ];
    return shuffle(items)
      .slice(0, 5)
      .map((item) => ({
        type: "object-color",
        question: `¿De qué color es la ${item.obj}?`,
        emoji: item.emoji,
        options: shuffle([
          item.color,
          ...["Rojo", "Azul", "Verde", "Amarillo", "Naranja", "Morado"]
            .filter((c) => c !== item.color)
            .slice(0, 3),
        ]),
        correct: item.color,
      }));
  },

  "memory-color": () => {
    const pairs = sample(COLORS_DATA, 4).map((c) => ({
      name: c.name,
      emoji: c.emoji,
      hex: c.hex,
    }));
    return [{ type: "memory", pairs, gridCols: 4 }];
  },

  "memory-color-adv": () => {
    const pairs = sample(COLORS_DATA, Math.min(8, COLORS_DATA.length)).map((c) => ({
      name: c.name,
      emoji: c.emoji,
      hex: c.hex,
    }));
    return [{ type: "memory", pairs, gridCols: 6 }];
  },

  "classify-color": () => {
    const warm = COLORS_DATA.filter((c) =>
      ["Rojo", "Naranja", "Amarillo", "Rosa"].includes(c.name),
    );
    const cool = COLORS_DATA.filter((c) =>
      ["Azul", "Verde", "Morado"].includes(c.name),
    );
    return [
      {
        type: "classify-two",
        question: "¿Cálido o frío?",
        categories: ["🔥 Cálido", "❄️ Frío"],
        items: [
          ...sample(warm, 3).map((c) => ({ ...c, cat: "🔥 Cálido" })),
          ...sample(cool, 3).map((c) => ({ ...c, cat: "❄️ Frío" })),
        ],
      },
    ];
  },

  "color-mixing": () => {
    // Real primary-color mixing facts, simplified for Jardín level
    const mixes = [
      { a: { name: "Rojo", hex: "#EF4444", emoji: "🔴" }, b: { name: "Amarillo", hex: "#EAB308", emoji: "🟡" }, result: "Naranja" },
      { a: { name: "Azul", hex: "#3B82F6", emoji: "🔵" }, b: { name: "Amarillo", hex: "#EAB308", emoji: "🟡" }, result: "Verde" },
      { a: { name: "Rojo", hex: "#EF4444", emoji: "🔴" }, b: { name: "Azul", hex: "#3B82F6", emoji: "🔵" }, result: "Morado" },
      { a: { name: "Blanco", hex: "#F8FAFC", emoji: "⚪" }, b: { name: "Rojo", hex: "#EF4444", emoji: "🔴" }, result: "Rosa" },
    ];
    return shuffle(mixes).map((m) => ({
      type: "color-mixing",
      question: `¿Qué color se forma al mezclar ${m.a.name} y ${m.b.name}?`,
      colorA: m.a,
      colorB: m.b,
      options: shuffle([
        m.result,
        ...COLORS_DATA.filter((c) => c.name !== m.result).map((c) => c.name).sort(() => Math.random() - 0.5).slice(0, 3),
      ]),
      correct: m.result,
    }));
  },

  "color-shades": () => {
    // Light vs dark tone identification using the same base hue at different lightness
    const shadePairs = [
      { name: "Azul", light: "#93C5FD", dark: "#1E3A8A" },
      { name: "Verde", light: "#86EFAC", dark: "#14532D" },
      { name: "Rojo", light: "#FCA5A5", dark: "#7F1D1D" },
      { name: "Morado", light: "#D8B4FE", dark: "#581C87" },
      { name: "Naranja", light: "#FDBA74", dark: "#7C2D12" },
    ];
    return shuffle(shadePairs).map((s) => {
      const askLight = Math.random() > 0.5;
      return {
        type: "color-shades",
        question: askLight
          ? `¿Cuál es el ${s.name} CLARO?`
          : `¿Cuál es el ${s.name} OSCURO?`,
        hexA: s.light,
        hexB: s.dark,
        correct: askLight ? "A" : "B",
      };
    });
  },

  // --- VOWELS ---
 "recognize-vocal": () => {
  return shuffle(VOWELS_DATA).map((v) => ({
    type: "recognize-vocal",
    question: "¿Cuál es esta letra?",
    emoji: v.letter,
    options: shuffle([
      v.letter,
      ...VOWELS_DATA.filter((x) => x.letter !== v.letter)
        .map((x) => x.letter)
        .slice(0, 3),
    ]),
    correct: v.letter,
  }));
},

  "listen-vocal": () => {
    return shuffle(VOWELS_DATA).map((v) => ({
      type: "listen-vocal",
      question: `Escucha y selecciona la vocal: "${v.letter}"`,
      vocal: v.letter,
      options: shuffle([
        v.letter,
        ...VOWELS_DATA.filter((x) => x.letter !== v.letter).map(
          (x) => x.letter,
        ),
      ]),
      correct: v.letter,
    }));
  },

  "complete-word": () => {
    const words = [
      { word: "P_LO", full: "PELO", vocal: "E", emoji: "💇" },
      { word: "_SA", full: "OSA", vocal: "O", emoji: "🐻" },
      { word: "_VA", full: "UVA", vocal: "U", emoji: "🍇" },
      { word: "_VE", full: "AVE", vocal: "A", emoji: "🐦" },
      { word: "H_LO", full: "HILO", vocal: "I", emoji: "🧵" },
    ];
    return shuffle(words).map((w) => ({
      type: "complete-word",
      question: "¿Qué vocal falta?",
      word: w.word,
      full: w.full,
      emoji: w.emoji,
      options: shuffle(["A", "E", "I", "O", "U"]),
      correct: w.vocal,
    }));
  },

  "image-vocal": () => {
    return shuffle(VOWELS_DATA).map((v) => ({
      type: "image-vocal",
      question: `¿Con qué vocal empieza?`,
      word: v.words[0].word,
      emoji: v.words[0].emoji,
      options: shuffle(["A", "E", "I", "O", "U"]),
      correct: v.letter,
    }));
  },

  "memory-vocal": () => {
    const pairs = VOWELS_DATA.map((v) => ({
      name: v.letter,
      emoji: v.words[0].emoji,
    }));
    return [{ type: "memory", pairs, gridCols: 4 }];
  },

  // --- ANIMALS ---
  "recognize-animal": () => {
    const allAnimals = [...ANIMALS_DATA.domestic, ...ANIMALS_DATA.wild];
    return sample(allAnimals, 6).map((a) => ({
      type: "recognize-animal",
      question: "¿Qué animal es?",
      emoji: a.emoji,
      options: shuffle([
        a.name,
        ...pickWrong(allAnimals, a, 3).map((x) => x.name),
      ]),
      correct: a.name,
    }));
  },

  "sound-animal": () => {
    const withSounds = [...ANIMALS_DATA.domestic, ...ANIMALS_DATA.wild].filter(
      (a) => a.sound,
    );
    return sample(withSounds, 5).map((a) => ({
      type: "sound-animal",
      question: `¿Qué animal dice "${a.sound}"?`,
      sound: a.sound,
      options: shuffle([
        a.name,
        ...pickWrong(withSounds, a, 3).map((x) => x.name),
      ]),
      correct: a.name,
    }));
  },

  "animal-sound-match": () => {
    // Inverse of sound-animal: shown the animal, choose its sound
    const withSounds = [...ANIMALS_DATA.domestic, ...ANIMALS_DATA.wild].filter(
      (a) => a.sound,
    );
    return sample(withSounds, 5).map((a) => ({
      type: "animal-sound-match",
      question: `¿Qué sonido hace el ${a.name}?`,
      emoji: a.emoji,
      options: shuffle([
        a.sound,
        ...pickWrong(withSounds, a, 3).map((x) => x.sound),
      ]),
      correct: a.sound,
    }));
  },

  "classify-animal": () => {
    const items = [
      ...ANIMALS_DATA.domestic
        .slice(0, 3)
        .map((a) => ({ ...a, cat: "🏠 Doméstico" })),
      ...ANIMALS_DATA.wild
        .slice(0, 3)
        .map((a) => ({ ...a, cat: "🌿 Salvaje" })),
    ];
    return [
      {
        type: "classify-two",
        question: "¿Doméstico o salvaje?",
        categories: ["🏠 Doméstico", "🌿 Salvaje"],
        items: shuffle(items),
      },
    ];
  },

  "memory-animal": () => {
    const pairs = sample(
      [...ANIMALS_DATA.domestic, ...ANIMALS_DATA.wild],
      4,
    ).map((a) => ({ name: a.name, emoji: a.emoji }));
    return [{ type: "memory", pairs, gridCols: 4 }];
  },
"habitat-animal": () => {
  const animals = sample(
    [
      ...ANIMALS_DATA.domestic,
      ...ANIMALS_DATA.wild,
      ...ANIMALS_DATA.birds,
      ...ANIMALS_DATA.marine,
    ],
    5
  );

  const habitatLabels = {
    casa: "🏠 Casa",
    granja: "🏠 Casa",
    selva: "🌿 Selva",
    sabana: "🌾 Sabana",
    bosque: "🌲 Bosque",
    mar: "🌊 Mar",
    río: "🌊 Mar",
    lago: "🌊 Mar",
    árbol: "🌲 Bosque",
    polo: "🌊 Mar",
  };

  return animals.map((a) => ({
    type: "habitat",
    question: `¿Dónde vive el ${a.name}?`,
    emoji: a.emoji,
    options: ["🏠 Casa", "🌿 Selva", "🌾 Sabana", "🌊 Mar", "🌲 Bosque"],
    correct: habitatLabels[a.habitat],
  }));
},

  "silhouette-animal": () => {
    // Same recognition mechanic as recognize-animal, but visually styled as a
    // dark silhouette by the renderer (CSS filter), which is what "¿Quién soy?" implies.
    const allAnimals = [...ANIMALS_DATA.domestic, ...ANIMALS_DATA.wild, ...ANIMALS_DATA.birds];
    return sample(allAnimals, 6).map((a) => ({
      type: "silhouette-animal",
      question: "¿Quién soy?",
      emoji: a.emoji,
      options: shuffle([
        a.name,
        ...pickWrong(allAnimals, a, 3).map((x) => x.name),
      ]),
      correct: a.name,
    }));
  },

  "habitat-match": () => {
    // Matching mechanic (not multiple choice): pair each animal with its habitat
    const habitatLabels = {
      casa: "🏠 Casa", granja: "🏠 Granja", selva: "🌿 Selva",
      sabana: "🌾 Sabana", bosque: "🌲 Bosque", mar: "🌊 Mar",
      río: "🌊 Río", lago: "🌊 Lago", árbol: "🌳 Árbol", polo: "❄️ Polo",
    };
    const pool = sample(
      [...ANIMALS_DATA.domestic, ...ANIMALS_DATA.wild, ...ANIMALS_DATA.birds, ...ANIMALS_DATA.marine],
      5
    );
    return [{
      type: "matching-pairs",
      question: "Une cada animal con su hábitat",
      pairs: pool.map((a) => ({
        left: { label: a.name, emoji: a.emoji },
        right: { label: habitatLabels[a.habitat] || a.habitat }
      }))
    }];
  },

  "classify-animal-type": () => {
    // Real biological classification (mammal / bird / reptile), curated by hand
    // since ANIMALS_DATA is organized by environment, not taxonomy.
    const mammals = [
      ANIMALS_DATA.domestic.find(a => a.name === "Perro"),
      ANIMALS_DATA.domestic.find(a => a.name === "Gato"),
      ANIMALS_DATA.domestic.find(a => a.name === "Vaca"),
      ANIMALS_DATA.wild.find(a => a.name === "León"),
      ANIMALS_DATA.wild.find(a => a.name === "Elefante"),
      ANIMALS_DATA.wild.find(a => a.name === "Mono"),
    ].filter(Boolean);
    const birds = ANIMALS_DATA.birds.filter(Boolean);
    const reptiles = [
      ANIMALS_DATA.marine.find(a => a.name === "Tortuga"),
    ].filter(Boolean);

    const items = [
      ...sample(mammals, 3).map(a => ({ ...a, cat: "🐾 Mamífero" })),
      ...sample(birds, Math.min(2, birds.length)).map(a => ({ ...a, cat: "🐦 Ave" })),
      ...reptiles.map(a => ({ ...a, cat: "🦎 Reptil" })),
    ];
    return [{
      type: "classify-three",
      question: "Clasifica el animal: ¿mamífero, ave o reptil?",
      categories: ["🐾 Mamífero", "🐦 Ave", "🦎 Reptil"],
      items: shuffle(items),
    }];
  },

  "memory-animal-adv": () => {
    const pool = [...ANIMALS_DATA.domestic, ...ANIMALS_DATA.wild, ...ANIMALS_DATA.birds];
    const pairs = sample(pool, Math.min(6, pool.length)).map(a => ({ name: a.name, emoji: a.emoji }));
    return [{ type: "memory", pairs, gridCols: 4 }];
  },

  // --- SOUNDS (environmental, non-animal) ---
  "identify-sound": () => {
    return sample(SOUNDS_DATA, 6).map((s) => ({
      type: "identify-sound",
      question: `¿Qué hace ese sonido: "${s.sound}"?`,
      sound: s.sound,
      options: shuffle([
        s.name,
        ...pickWrong(SOUNDS_DATA, s, 3).map((x) => x.name),
      ]),
      correct: s.name,
    }));
  },

  "memory-sound": () => {
    const pairs = sample(SOUNDS_DATA, 4).map((s) => ({
      name: s.name,
      emoji: s.emoji,
    }));
    return [{ type: "memory", pairs, gridCols: 4 }];
  },

  // --- NUMBERS ---
  "count-objects": () => {
    return Array.from({ length: 6 }, (_, i) => {
      const count = Math.floor(Math.random() * 9) + 1;
      const emojis = ["🍎", "🌟", "🐾", "🎈", "🦋", "🌸", "🔴", "💧", "🎯"];
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      return {
        type: "count-objects",
        question: "¿Cuántos hay?",
        emoji,
        count,
        options: shuffle(
          [
            count,
            ...new Set(
              [count - 1, count + 1, count + 2, count - 2].filter(
                (n) => n > 0 && n <= 20,
              ),
            ),
          ].slice(0, 4),
        ),
        correct: count,
      };
    });
  },

  "select-number": () => {
    return Array.from({ length: 6 }, () => {
      const n = Math.floor(Math.random() * 19) + 1;
      return {
        type: "select-number",
        question: `Selecciona el número ${n}`,
        options: shuffle(
          [
            n,
            ...new Set(
              [n - 2, n - 1, n + 1, n + 2].filter((x) => x > 0 && x <= 20),
            ),
          ].slice(0, 4),
        ),
        correct: n,
      };
    });
  },

  "relate-number": () => {
    // Shows a quantity of objects; child relates it to the matching numeral
    const emojis = ["🍎", "⭐", "🐾", "🎈", "🌸"];
    return Array.from({ length: 6 }, () => {
      const count = Math.floor(Math.random() * 12) + 1;
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      return {
        type: "relate-number",
        question: "¿Qué número representa esta cantidad?",
        emoji,
        count,
        options: shuffle(
          [
            count,
            ...new Set(
              [count - 2, count - 1, count + 1, count + 2].filter(
                (n) => n > 0 && n <= 20,
              ),
            ),
          ].slice(0, 4),
        ),
        correct: count,
      };
    });
  },

  "order-numbers": () => {
    const start = Math.floor(Math.random() * 10) + 1;
    const nums = Array.from({ length: 5 }, (_, i) => start + i);
    return [
      {
        type: "order-numbers",
        question: "Ordena los números de menor a mayor",
        items: shuffle(nums),
        correct: nums,
      },
    ];
  },

  "pattern-sequence": () => {
    // Drag-to-order version of a repeating pattern (distinct from color-pattern's multiple choice)
    const patterns = [
      ["🔴", "🔵", "🔴", "🔵", "🔴"],
      ["🟡", "🟢", "🟢", "🟡", "🟢"],
      ["⭐", "🌙", "⭐", "🌙", "⭐"],
      ["🔺", "🔺", "⭕", "🔺", "🔺"],
    ];
    return shuffle(patterns).map((seq) => ({
      type: "order-sequence",
      question: "Ordena la secuencia como va el patrón",
      items: shuffle(seq),
      correct: seq,
    }));
  },

  "size-sequence": () => {
    // Order by size: small to large
    const sets = [
      ["🐜", "🐈", "🐕", "🐎", "🐘"],
      ["🌱", "🌿", "🌳"],
      ["⚪", "🟡", "🟠", "🔴"],
    ];
    return shuffle(sets).map((seq) => ({
      type: "order-sequence",
      question: "Ordena de más pequeño a más grande",
      items: shuffle(seq),
      correct: seq,
    }));
  },

  "story-sequence": () => {
    // Order simple daily-routine steps logically (age-appropriate for Jardín)
    const stories = [
      { steps: ["😴 Dormir", "⏰ Despertar", "🪥 Cepillarse", "🍳 Desayunar", "🎒 Ir al colegio"] },
      { steps: ["🌱 Semilla", "🌿 Brote", "🌳 Árbol"] },
      { steps: ["🥚 Huevo", "🐛 Oruga", "🦋 Mariposa"] },
      { steps: ["🛁 Bañarse", "👕 Vestirse", "🍽️ Comer", "😴 Dormir"] },
    ];
    return shuffle(stories).map((s) => ({
      type: "order-sequence",
      question: "Ordena la historia en el orden correcto",
      items: shuffle(s.steps),
      correct: s.steps,
    }));
  },

  "number-sequence": () => {
    return Array.from({ length: 5 }, () => {
      const start = Math.floor(Math.random() * 12) + 1;
      const seq = [start, start + 1, start + 2, "?", start + 4];
      return {
        type: "number-sequence",
        question: "¿Qué número sigue?",
        sequence: seq,
        options: shuffle([start + 3, start + 5, start + 1, start + 6]).slice(
          0,
          4,
        ),
        correct: start + 3,
      };
    });
  },

  // --- SHAPES ---
  "recognize-shape": () => {
    return sample(SHAPES_DATA, 5).map((s) => ({
      type: "recognize-shape",
      question: "¿Qué figura es?",
      emoji: s.emoji,
      options: shuffle([
        s.name,
        ...pickWrong(SHAPES_DATA, s, 3).map((x) => x.name),
      ]),
      correct: s.name,
    }));
  },

  "classify-shape": () => {
    const items = SHAPES_DATA.map((s) => ({
      ...s,
      cat:
        s.sides === 0
          ? "⭕ Sin esquinas"
          : s.sides === 3
            ? "3️⃣ 3 lados"
            : "4️⃣ 4 lados",
    }));
    return [
      {
        type: "classify-three",
        question: "Clasifica la figura",
        categories: ["⭕ Sin esquinas", "3️⃣ 3 lados", "4️⃣ 4 lados"],
        items: shuffle(items),
      },
    ];
  },

  "count-sides": () => {
    // Only shapes with a clear, countable number of sides (excludes circle/heart which are 0/curved)
    const countable = SHAPES_DATA.filter((s) => s.sides > 0);
    return sample(countable, 5).map((s) => ({
      type: "count-sides",
      question: `¿Cuántos lados tiene esta figura?`,
      emoji: s.emoji,
      options: shuffle([
        s.sides,
        ...new Set(
          [s.sides - 1, s.sides + 1, s.sides + 2].filter((n) => n > 0),
        ),
      ].slice(0, 4)),
      correct: s.sides,
    }));
  },

  "shape-object": () => {
    // Real-world objects that visually correspond to a geometric shape
    const objectShapeMap = [
      { obj: "Pizza", emoji: "🍕", shape: "Círculo" },
      { obj: "Reloj", emoji: "🕐", shape: "Círculo" },
      { obj: "Sandía (corte)", emoji: "🍉", shape: "Círculo" },
      { obj: "Caja de regalo", emoji: "🎁", shape: "Cuadrado" },
      { obj: "Ventana", emoji: "🪟", shape: "Cuadrado" },
      { obj: "Sandwich", emoji: "🥪", shape: "Triángulo" },
      { obj: "Porción de pizza", emoji: "🍕", shape: "Triángulo" },
      { obj: "Señal de tránsito", emoji: "⚠️", shape: "Triángulo" },
      { obj: "Puerta", emoji: "🚪", shape: "Rectángulo" },
      { obj: "Libro", emoji: "📖", shape: "Rectángulo" },
      { obj: "Señal de stop", emoji: "🛑", shape: "Hexágono" },
    ];
    return shuffle(objectShapeMap).slice(0, 5).map((o) => ({
      type: "shape-object",
      question: `¿Qué figura tiene este objeto?`,
      emoji: o.emoji,
      options: shuffle([
        o.shape,
        ...new Set(
          SHAPES_DATA.filter((s) => s.name !== o.shape).map((s) => s.name),
        ),
      ].slice(0, 4)),
      correct: o.shape,
    }));
  },

  // --- MATH: SUMS ---
  "sum-objects": () => {
    return Array.from({ length: 6 }, () => {
      const a = Math.floor(Math.random() * 5) + 1;
      const b = Math.floor(Math.random() * 5) + 1;
      const total = a + b;
      const emojis = ["🍎", "⭐", "🎈", "🐾", "🌸"];
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      return {
        type: "sum-objects",
        a,
        b,
        total,
        emoji,
        question: `¿Cuántos hay en total?`,
        options: shuffle(
          [
            total,
            ...[total - 1, total + 1, total + 2].filter((n) => n > 0),
          ].slice(0, 4),
        ),
        correct: total,
      };
    });
  },

  "sum-numbers": () => {
    return Array.from({ length: 6 }, () => {
      const a = Math.floor(Math.random() * 8) + 1;
      const b = Math.floor(Math.random() * 8) + 1;
      const total = a + b;
      return {
        type: "sum-numbers",
        a,
        b,
        total,
        question: `¿Cuánto es ${a} + ${b}?`,
        options: shuffle(
          [
            total,
            ...[total - 1, total + 1, total + 2, total - 2].filter(
              (n) => n >= 0,
            ),
          ].slice(0, 4),
        ),
        correct: total,
      };
    });
  },

  "sub-numbers": () => {
    return Array.from({ length: 6 }, () => {
      const b = Math.floor(Math.random() * 5) + 1;
      const a = b + Math.floor(Math.random() * 8) + 1;
      const res = a - b;
      return {
        type: "sub-numbers",
        a,
        b,
        res,
        question: `¿Cuánto es ${a} - ${b}?`,
        options: shuffle(
          [
            res,
            ...[res - 1, res + 1, res + 2, res - 2].filter((n) => n >= 0),
          ].slice(0, 4),
        ),
        correct: res,
      };
    });
  },

  // --- ENGLISH ---
  "eng-colors": () => {
    return sample(COLORS_DATA, 6).map((c) => ({
      type: "eng-colors",
      question: `¿Cómo se dice "${c.name}" en inglés?`,
      emoji: c.emoji,
      hex: c.hex,
      options: shuffle([
        c.eng,
        ...pickWrong(COLORS_DATA, c, 3).map((x) => x.eng),
      ]),
      correct: c.eng,
    }));
  },

  "eng-numbers": () => {
    // Numbers 1-10 in English, appropriate for Jardín level (basic counting)
    const numbersEng = [
      { n: 1, eng: "One" }, { n: 2, eng: "Two" }, { n: 3, eng: "Three" },
      { n: 4, eng: "Four" }, { n: 5, eng: "Five" }, { n: 6, eng: "Six" },
      { n: 7, eng: "Seven" }, { n: 8, eng: "Eight" }, { n: 9, eng: "Nine" },
      { n: 10, eng: "Ten" },
    ];
    return sample(numbersEng, 6).map((item) => ({
      type: "eng-numbers",
      question: `¿Cómo se dice el número "${item.n}" en inglés?`,
      emoji: String(item.n),
      options: shuffle([
        item.eng,
        ...numbersEng.filter((x) => x.n !== item.n).map((x) => x.eng).sort(() => Math.random() - 0.5).slice(0, 3),
      ]),
      correct: item.eng,
    }));
  },

  "eng-animals": () => {
    const all = [...ANIMALS_DATA.domestic, ...ANIMALS_DATA.wild];
    return sample(all, 6).map((a) => ({
      type: "eng-animals",
      question: `¿Cómo se dice "${a.name}" en inglés?`,
      emoji: a.emoji,
      options: shuffle([a.eng, ...pickWrong(all, a, 3).map((x) => x.eng)]),
      correct: a.eng,
    }));
  },

  "eng-greetings": () => {
    return shuffle(GREETINGS_DATA).map((g) => ({
      type: "eng-greetings",
      question: `¿Qué significa "${g.eng}"?`,
      emoji: g.emoji,
      options: shuffle([
        g.esp,
        ...GREETINGS_DATA.filter((x) => x.eng !== g.eng)
          .map((x) => x.esp)
          .slice(0, 3),
      ]),
      correct: g.esp,
    }));
  },

  "eng-body": () => {
    return sample(BODY_PARTS, 6).map((b) => ({
      type: "eng-body",
      question: `¿Cómo se dice "${b.name}" en inglés?`,
      emoji: b.emoji,
      options: shuffle([
        b.eng,
        ...pickWrong(BODY_PARTS, b, 3).map((x) => x.eng),
      ]),
      correct: b.eng,
    }));
  },

  "eng-memory": () => {
    const pairs = sample(COLORS_DATA, 4).map((c) => ({
      name: c.esp || c.name,
      emoji: c.emoji,
      pair: c.eng,
    }));
    return [{ type: "memory-bilingual", pairs, gridCols: 4 }];
  },

  // --- MEMORY GAMES ---
  "memory-4": () => {
    const items = sample([...ANIMALS_DATA.domestic, ...FRUITS_DATA], 4);
    return [
      {
        type: "memory",
        pairs: items.map((x) => ({ name: x.name, emoji: x.emoji })),
        gridCols: 4,
      },
    ];
  },

  "memory-6": () => {
    const items = sample(
      [...ANIMALS_DATA.domestic, ...ANIMALS_DATA.wild, ...FRUITS_DATA],
      6,
    );
    return [
      {
        type: "memory",
        pairs: items.map((x) => ({ name: x.name, emoji: x.emoji })),
        gridCols: 4,
      },
    ];
  },

  "memory-8": () => {
    const items = sample(
      [
        ...ANIMALS_DATA.domestic,
        ...ANIMALS_DATA.wild,
        ...FRUITS_DATA,
        ...SHAPES_DATA,
      ],
      8,
    );
    return [
      {
        type: "memory",
        pairs: items.map((x) => ({ name: x.name, emoji: x.emoji })),
        gridCols: 4,
      },
    ];
  },

  // --- PATTERNS ---
  "color-pattern": () => {
    const colors = [
      ["🔴", "🔵"],
      ["🟡", "🟢"],
      ["🔴", "🟡", "🔵"],
    ];
    return Array.from({ length: 4 }, () => {
      const pat = colors[Math.floor(Math.random() * colors.length)];
      const seq = [...pat, ...pat, ...pat.slice(0, 1)];
      const blank = seq.length - 1;
      const correct = seq[blank];
      return {
        type: "pattern",
        question: "¿Qué sigue en el patrón?",
        sequence: [...seq.slice(0, blank), "?"],
        options: shuffle(
          [correct, ...pat.filter((x) => x !== correct), "🟣", "🟤"].slice(
            0,
            4,
          ),
        ),
        correct,
      };
    });
  },

  "logic-odd": () => {
    const groups = [
      { items: ["🍎", "🍌", "🍊", "🚗"], odd: "🚗", reason: "No es fruta" },
      { items: ["🐕", "🐈", "🐟", "✈️"], odd: "✈️", reason: "No es animal" },
      { items: ["🔴", "🔵", "🟢", "🍎"], odd: "🍎", reason: "No es color" },
      { items: ["1", "2", "3", "A"], odd: "A", reason: "No es número" },
      { items: ["⭕", "🔺", "🟥", "🍕"], odd: "🍕", reason: "No es figura" },
    ];
    return shuffle(groups)
      .slice(0, 4)
      .map((g) => ({
        type: "odd-one-out",
        question: "¿Cuál NO pertenece al grupo?",
        items: shuffle(g.items),
        correct: g.odd,
        reason: g.reason,
      }));
  },

  // Alias: curriculum.js uses "odd-one-out" as the type name for this same mechanic
  "odd-one-out": () => generators["logic-odd"](),

  "group-classify": () => {
    // General-purpose "which group does this belong to" using everyday categories
    const groups = [
      { items: ["🍎", "🍌", "🍊"], cat: "🍎 Frutas" },
      { items: ["🐕", "🐈", "🐄"], cat: "🐾 Animales" },
      { items: ["🚗", "🚌", "✈️"], cat: "🚗 Transportes" },
      { items: ["🔴", "🔵", "🟢"], cat: "🎨 Colores" },
      { items: ["⭕", "🔺", "🟥"], cat: "🔷 Figuras" },
    ];
    const items = groups.flatMap((g) =>
      sample(g.items, Math.min(2, g.items.length)).map((emoji) => ({ name: emoji, emoji, cat: g.cat }))
    );
    return [{
      type: "classify-two",
      question: "¿A cuál grupo pertenece?",
      categories: groups.map((g) => g.cat),
      items: shuffle(items),
    }];
  },

  "group-alike": () => {
    // "Find the ones that are alike": pick all items sharing the same category among a mixed set
    const categories = [
      { label: "🍎 Frutas", items: ["🍎", "🍌", "🍊", "🍇"] },
      { label: "🐾 Animales", items: ["🐕", "🐈", "🐄", "🐷"] },
    ];
    const target = categories[Math.floor(Math.random() * categories.length)];
    const other = categories.find((c) => c.label !== target.label);
    const correctItems = sample(target.items, 3);
    const distractor = sample(other.items, 1);
    return [{
      type: "select-alike",
      question: `Selecciona los que son ${target.label}`,
      items: shuffle([...correctItems, ...distractor]),
      correctItems,
    }];
  },

  // --- BODY PARTS ---
  "identify-body": () => {
    return sample(BODY_PARTS, 5).map((b) => ({
      type: "identify-body",
      question: "¿Qué parte del cuerpo es?",
      emoji: b.emoji,
      options: shuffle([
        b.name,
        ...pickWrong(BODY_PARTS, b, 3).map((x) => x.name),
      ]),
      correct: b.name,
    }));
  },

  "touch-body": () => {
    // Teacher reads "Toca tu nariz" out loud; children point at the screen
    return sample(BODY_PARTS, 5).map((b) => ({
      type: "touch-body",
      question: `Toca tu: ${b.name}`,
      options: shuffle([b, ...pickWrong(BODY_PARTS, b, 3)]),
      correct: b.name,
    }));
  },

  "complete-body": () => {
    // Shows a body figure missing one part (described in text), choose the missing part
    const scenarios = BODY_PARTS.map((b) => ({
      missing: b,
      figureEmoji: "🧍",
    }));
    return shuffle(scenarios)
      .slice(0, 5)
      .map((s) => ({
        type: "complete-body",
        question: "¿Qué parte le falta a la figura?",
        parts: BODY_PARTS.map((p) => ({
          ...p,
          isMissing: p.name === s.missing.name,
        })),
        options: shuffle([
          s.missing.name,
          ...pickWrong(BODY_PARTS, s.missing, 3).map((x) => x.name),
        ]),
        correct: s.missing.name,
      }));
  },

  "memory-body": () => {
    const pairs = sample(BODY_PARTS, 4).map((b) => ({
      name: b.name,
      emoji: b.emoji,
    }));
    return [{ type: "memory", pairs, gridCols: 4 }];
  },

  // --- FRUITS ---
  "identify-fruit": () => {
    return sample(FRUITS_DATA, 5).map((f) => ({
      type: "identify-fruit",
      question: "¿Qué fruta es?",
      emoji: f.emoji,
      options: shuffle([
        f.name,
        ...pickWrong(FRUITS_DATA, f, 3).map((x) => x.name),
      ]),
      correct: f.name,
    }));
  },

  "fruit-color": () => {
    const colorEmoji = {
      rojo: "🔴",
      amarillo: "🟡",
      verde: "🟢",
      morado: "🟣",
      naranja: "🟠",
    };
    return sample(FRUITS_DATA, 6).map((f) => ({
      type: "fruit-color",
      question: `¿De qué color es la ${f.name}?`,
      emoji: f.emoji,
      options: shuffle(
        [
          f.color,
          ...new Set(
            FRUITS_DATA.filter((x) => x.color !== f.color).map((x) => x.color),
          ),
        ].slice(0, 4),
      ).map((c) => `${colorEmoji[c] || "🎨"} ${c}`),
      correct: `${colorEmoji[f.color] || "🎨"} ${f.color}`,
    }));
  },

  "classify-fruit": () => {
    // Classify by color group: warm-colored fruit vs cool-colored fruit
    const warm = FRUITS_DATA.filter((f) =>
      ["rojo", "amarillo", "naranja"].includes(f.color),
    );
    const cool = FRUITS_DATA.filter((f) =>
      ["verde", "morado"].includes(f.color),
    );
    const items = [
      ...sample(warm, 3).map((f) => ({
        ...f,
        cat: "🔥 Rojo/Amarillo/Naranja",
      })),
      ...sample(cool, 3).map((f) => ({ ...f, cat: "🌿 Verde/Morado" })),
    ];
    return [
      {
        type: "classify-two",
        question: "Clasifica la fruta por su color",
        categories: ["🔥 Rojo/Amarillo/Naranja", "🌿 Verde/Morado"],
        items: shuffle(items),
      },
    ];
  },

  "memory-fruit": () => {
    const pairs = sample(FRUITS_DATA, 4).map((f) => ({
      name: f.name,
      emoji: f.emoji,
    }));
    return [{ type: "memory", pairs, gridCols: 4 }];
  },

  // --- TRANSPORT ---
  "identify-transport": () => {
    return sample(TRANSPORT_DATA, 5).map((t) => ({
      type: "identify-transport",
      question: "¿Qué transporte es?",
      emoji: t.emoji,
      options: shuffle([
        t.name,
        ...pickWrong(TRANSPORT_DATA, t, 3).map((x) => x.name),
      ]),
      correct: t.name,
    }));
  },

  "classify-transport": () => {
    return TRANSPORT_DATA.map((t) => ({
      type: "classify-transport",
      question: `¿Por dónde viaja el ${t.name}?`,
      emoji: t.emoji,
      options: ["🛤️ Tierra", "✈️ Aire", "🌊 Agua"],
      correct:
        t.type === "tierra"
          ? "🛤️ Tierra"
          : t.type === "aire"
            ? "✈️ Aire"
            : "🌊 Agua",
    })).slice(0, 5);
  },

  "memory-transport": () => {
    const pairs = sample(TRANSPORT_DATA, 4).map((t) => ({
      name: t.name,
      emoji: t.emoji,
    }));
    return [{ type: "memory", pairs, gridCols: 4 }];
  },

  // --- WORD-IMAGE ASSOCIATION ---
  "word-image": () => {
    const all = [...ANIMALS_DATA.domestic, ...FRUITS_DATA, ...BODY_PARTS];
    return sample(all, 6).map((item) => ({
      type: "word-image",
      question: "Selecciona la imagen correcta",
      word: item.name,
      emoji: item.emoji,
      options: shuffle([
        item,
        ...sample(
          all.filter((x) => x.name !== item.name),
          3,
        ),
      ]).map((x) => x.emoji),
      correct: item.emoji,
    }));
  },

  // Fallback
  default: () => {
    return [
      {
        type: "default",
        question: "Actividad en desarrollo 🚧",
        options: [],
        correct: null,
      },
    ];
  },
};

// Main generate function
export function generateActivity(activityId, activityType) {
  const generator =
    generators[activityType] || generators[activityId] || generators["default"];
  try {
    const questions = generator();
    return questions.filter(Boolean);
  } catch (e) {
    console.error("Activity generation error:", e);
    return generators["default"]();
  }
}
