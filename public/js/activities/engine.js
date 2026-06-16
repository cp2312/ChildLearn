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
