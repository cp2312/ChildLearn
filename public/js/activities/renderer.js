// public/js/activities/renderer.js
// Renders each question type into the class-mode body

import { SoundEngine } from '../utils/helpers.js';

export const ActivityRenderer = {
  onAnswer: null, // callback(isCorrect)

  render(question, container) {
    container.innerHTML = '';
    const type = question.type;

    switch (type) {
      case 'identify-color':
      case 'select-color':
        return this._renderColorQuestion(question, container);
      case 'object-color':
        return this._renderObjectColor(question, container);
      case 'recognize-vocal':
      case 'recognize-animal':
      case 'recognize-shape':
      case 'identify-body':
      case 'identify-fruit':
      case 'fruit-color':
      case 'identify-transport':
      case 'sound-animal':
      case 'animal-sound-match':
      case 'identify-sound':
        return this._renderMultipleChoice(question, container);
        case 'habitat':
  return this._renderMultipleChoice(question, container);
      case 'touch-body':
        return this._renderTouchBody(question, container);
      case 'complete-body':
        return this._renderCompleteBody(question, container);
      case 'listen-vocal':
        return this._renderListenSelect(question, container);
      case 'complete-word':
        return this._renderCompleteWord(question, container);
      case 'image-vocal':
      case 'word-image':
        return this._renderImageVocal(question, container);
      case 'count-objects':
        return this._renderCountObjects(question, container);
      case 'select-number':
      case 'number-sequence':
        return this._renderMultipleChoice(question, container);
      case 'order-numbers':
        return this._renderOrderNumbers(question, container);
      case 'sum-objects':
        return this._renderSumObjects(question, container);
      case 'sum-numbers':
      case 'sub-numbers':
        return this._renderMathQuestion(question, container);
      case 'eng-colors':
      case 'eng-animals':
      case 'eng-greetings':
      case 'eng-body':
        return this._renderEnglishQuestion(question, container);
      case 'memory':
      case 'memory-bilingual':
        return this._renderMemoryGame(question, container);
      case 'classify-two':
        return this._renderClassifyTwo(question, container);
      case 'odd-one-out':
        return this._renderOddOneOut(question, container);
      case 'pattern':
        return this._renderPattern(question, container);
      case 'classify-transport':
        return this._renderMultipleChoice(question, container);
      default:
        return this._renderMultipleChoice(question, container);
    }
  },

  // ===== COLOR QUESTION =====
  _renderColorQuestion(q, container) {
    const isIdentify = q.type === 'identify-color';
    container.innerHTML = `
      <div class="question-container">
        <div class="question-title">${q.question}</div>
        ${isIdentify ? `<div class="color-target" style="background:${q.target.hex}"></div>` : ''}
        ${!isIdentify ? `<div class="question-subtitle">${q.target.name}</div>` : ''}
        <div class="color-options-row">
          ${q.options.map(opt => `
            <button class="color-option-btn" 
              style="background:${opt.hex}" 
              data-answer="${opt.name}"
              title="${opt.name}">
              <span>${opt.emoji}</span>
              <span style="font-size:0.7rem;text-shadow:0 1px 3px rgba(0,0,0,0.8)">${opt.name}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
    this._attachOptionListeners(container, '.color-option-btn', q.correct);
  },

  // ===== OBJECT COLOR =====
  _renderObjectColor(q, container) {
    container.innerHTML = `
      <div class="question-container">
        <div class="question-title">${q.question}</div>
        <div class="question-subtitle" style="font-size:5rem;margin:1rem 0">${q.emoji}</div>
        <div class="options-grid cols-2">
          ${q.options.map(opt => `
            <button class="option-btn" data-answer="${opt}">
              <span class="opt-emoji">${COLORS_DATA_MAP[opt] || '🎨'}</span>
              <span class="opt-label">${opt}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
    this._attachOptionListeners(container, '.option-btn', q.correct);
  },

  // ===== MULTIPLE CHOICE (generic) =====
  _renderMultipleChoice(q, container) {
    const cols = q.options?.length <= 2 ? 'cols-2' : q.options?.length <= 4 ? 'cols-2' : 'cols-3';
    container.innerHTML = `
      <div class="question-container">
        <div class="question-title">${q.question}</div>
        ${q.emoji ? `<div class="question-subtitle" style="font-size:clamp(4rem,10vw,7rem);margin:0.5rem 0">${q.emoji}</div>` : ''}
        ${q.sequence ? `
          <div class="pattern-row">
            ${q.sequence.map(s => `<div class="pattern-item ${s==='?'?'blank':''}">${s}</div>`).join('')}
          </div>
        ` : ''}
        <div class="options-grid ${cols}" style="margin-top:1.5rem">
          ${(q.options||[]).map(opt => `
            <button class="option-btn" data-answer="${opt}">
              <span class="opt-label" style="font-size:clamp(1.2rem,3vw,2rem)">${opt}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
    this._attachOptionListeners(container, '.option-btn', String(q.correct));
  },

  // ===== TOUCH BODY (teacher says it, options show emoji + name) =====
  _renderTouchBody(q, container) {
    container.innerHTML = `
      <div class="question-container">
        <div class="question-title">${q.question}</div>
        <div class="question-subtitle" style="margin-bottom:0.5rem;opacity:0.8">El profesor lo dice en voz alta, los niños señalan 👇</div>
        <div class="options-grid cols-2">
          ${q.options.map(opt => `
            <button class="option-btn" data-answer="${opt.name}">
              <span class="opt-emoji">${opt.emoji}</span>
              <span class="opt-label">${opt.name}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
    this._attachOptionListeners(container, '.option-btn', q.correct);
  },

  // ===== COMPLETE BODY (figure missing a part) =====
  _renderCompleteBody(q, container) {
    const partsRow = q.parts.map(p => {
      if (p.isMissing) {
        return `<div class="letter-box blank" style="width:clamp(60px,10vw,90px);height:clamp(60px,10vw,90px);font-size:2rem" title="¿Qué falta?">❓</div>`;
      }
      return `<div style="font-size:clamp(2rem,5vw,3rem)" title="${p.name}">${p.emoji}</div>`;
    }).join('');

    container.innerHTML = `
      <div class="question-container">
        <div class="question-title">${q.question}</div>
        <div style="display:flex;flex-wrap:wrap;gap:0.75rem;justify-content:center;align-items:center;margin:1.25rem 0;max-width:700px">
          ${partsRow}
        </div>
        <div class="options-grid cols-2" style="margin-top:1rem">
          ${q.options.map(opt => `
            <button class="option-btn" data-answer="${opt}">
              <span class="opt-label">${opt}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
    this._attachOptionListeners(container, '.option-btn', q.correct);
  },

  // ===== LISTEN & SELECT =====
  _renderListenSelect(q, container) {
    container.innerHTML = `
      <div class="question-container">
        <div class="question-title">${q.question}</div>
        <button class="listen-btn" id="play-sound-btn" title="Escuchar">🔊</button>
        <div class="options-grid cols-3" style="margin-top:1.5rem">
          ${q.options.map(opt => `
            <button class="option-btn" data-answer="${opt}">
              <span class="opt-label" style="font-size:3rem;font-family:'Fredoka One',cursive">${opt}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
    // Speak the vocal when button clicked
    const speakBtn = container.querySelector('#play-sound-btn');
    speakBtn?.addEventListener('click', () => {
      if (window.speechSynthesis) {
        const utter = new SpeechSynthesisUtterance(q.vocal);
        utter.lang = 'es-CO';
        utter.rate = 0.7;
        window.speechSynthesis.speak(utter);
      }
    });
    // Auto-speak on render
    setTimeout(() => speakBtn?.click(), 500);
    this._attachOptionListeners(container, '.option-btn', q.correct);
  },

  // ===== COMPLETE WORD =====
  _renderCompleteWord(q, container) {
    const display = q.word.split('').map(ch =>
      `<div class="letter-box ${ch==='_'?'blank':''}">${ch==='_'?'_':ch}</div>`
    ).join('');
    container.innerHTML = `
      <div class="question-container">
        <div class="question-title">${q.question}</div>
        <div style="font-size:5rem;margin:0.75rem 0">${q.emoji}</div>
        <div class="word-display">${display}</div>
        <div class="options-grid cols-3" style="margin-top:1.5rem">
          ${q.options.map(opt => `
            <button class="option-btn" data-answer="${opt}">
              <span class="opt-label" style="font-size:2.5rem;font-family:'Fredoka One',cursive">${opt}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
    this._attachOptionListeners(container, '.option-btn', q.correct, (btn) => {
      const blanks = container.querySelectorAll('.letter-box.blank');
      blanks.forEach(b => b.textContent = btn.dataset.answer);
    });
  },

  // ===== IMAGE VOCAL =====
  _renderImageVocal(q, container) {
    container.innerHTML = `
      <div class="question-container">
        <div class="question-title">${q.question}</div>
        <div style="font-size:6rem;margin:1rem 0">${q.emoji}</div>
        <div class="question-subtitle">${q.word || ''}</div>
        <div class="options-grid cols-3" style="margin-top:1.5rem">
          ${q.options.map(opt => `
            <button class="option-btn" data-answer="${opt}">
              <span class="opt-label" style="font-size:2.5rem;font-family:'Fredoka One',cursive">${opt}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
    this._attachOptionListeners(container, '.option-btn', q.correct);
  },

  // ===== COUNT OBJECTS =====
  _renderCountObjects(q, container) {
    const objects = Array(q.count).fill(q.emoji).map((e, i) =>
      `<span class="count-obj" style="animation-delay:${i*0.05}s">${e}</span>`
    ).join('');
    container.innerHTML = `
      <div class="question-container">
        <div class="question-title">${q.question}</div>
        <div class="count-objects">${objects}</div>
        <div class="options-grid cols-2" style="margin-top:1.5rem;max-width:400px">
          ${q.options.map(opt => `
            <button class="option-btn" data-answer="${opt}">
              <span class="opt-label" style="font-size:2.5rem;font-family:'Fredoka One',cursive">${opt}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
    this._attachOptionListeners(container, '.option-btn', String(q.correct));
  },

  // ===== ORDER NUMBERS =====
  _renderOrderNumbers(q, container) {
    let current = [];
    const update = () => {
      container.querySelector('.order-slots').innerHTML = current.map((n, i) =>
        `<div class="order-slot filled" data-idx="${i}"><div class="order-item">${n}</div></div>`
      ).join('') + Array(q.correct.length - current.length).fill(
        '<div class="order-slot"></div>'
      ).join('');
    };
    container.innerHTML = `
      <div class="question-container">
        <div class="question-title">${q.question}</div>
        <div class="order-items">
          ${q.items.map(n => `<div class="order-item" data-num="${n}">${n}</div>`).join('')}
        </div>
        <div class="question-subtitle" style="margin:1rem 0;font-size:1rem;opacity:0.7">↓ Coloca los números en orden ↓</div>
        <div class="order-slots">
          ${q.correct.map(() => '<div class="order-slot"></div>').join('')}
        </div>
        <button class="class-btn primary" id="check-order" style="margin-top:1rem">✓ Verificar</button>
      </div>
    `;
    container.querySelectorAll('.order-item').forEach(item => {
      item.addEventListener('click', () => {
        const num = parseInt(item.dataset.num);
        if (!current.includes(num)) {
          current.push(num);
          item.style.opacity = '0.3';
          item.style.pointerEvents = 'none';
          update();
        }
      });
    });
    container.querySelector('#check-order')?.addEventListener('click', () => {
      const isCorrect = JSON.stringify(current) === JSON.stringify(q.correct);
      this.onAnswer?.(isCorrect);
    });
  },

  // ===== SUM OBJECTS =====
  _renderSumObjects(q, container) {
    const groupA = Array(q.a).fill(q.emoji).join(' ');
    const groupB = Array(q.b).fill(q.emoji).join(' ');
    container.innerHTML = `
      <div class="question-container">
        <div class="question-title">${q.question}</div>
        <div class="math-display" style="gap:2rem;flex-wrap:wrap">
          <div style="text-align:center">
            <div style="font-size:clamp(1.5rem,4vw,2.5rem);letter-spacing:4px">${groupA}</div>
            <div class="math-num">${q.a}</div>
          </div>
          <div class="math-op">+</div>
          <div style="text-align:center">
            <div style="font-size:clamp(1.5rem,4vw,2.5rem);letter-spacing:4px">${groupB}</div>
            <div class="math-num">${q.b}</div>
          </div>
          <div class="math-op">=</div>
          <div class="math-result">?</div>
        </div>
        <div class="options-grid cols-2" style="max-width:400px;margin-top:1.5rem">
          ${q.options.map(opt => `
            <button class="option-btn" data-answer="${opt}">
              <span class="opt-label" style="font-size:2.5rem;font-family:'Fredoka One',cursive">${opt}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
    this._attachOptionListeners(container, '.option-btn', String(q.correct), (btn) => {
      const res = container.querySelector('.math-result');
      if (res) res.textContent = btn.dataset.answer;
    });
  },

  // ===== MATH QUESTION =====
  _renderMathQuestion(q, container) {
    const op = q.type === 'sum-numbers' ? '+' : '−';
    const a = q.a;
    const b = q.b;
    container.innerHTML = `
      <div class="question-container">
        <div class="question-title">${q.question}</div>
        <div class="math-display">
          <div class="math-num">${a}</div>
          <div class="math-op">${op}</div>
          <div class="math-num">${b}</div>
          <div class="math-op">=</div>
          <div class="math-result">?</div>
        </div>
        <div class="options-grid cols-2" style="max-width:400px;margin-top:1.5rem">
          ${q.options.map(opt => `
            <button class="option-btn" data-answer="${opt}">
              <span class="opt-label" style="font-size:2.5rem;font-family:'Fredoka One',cursive">${opt}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
    this._attachOptionListeners(container, '.option-btn', String(q.correct), (btn) => {
      const res = container.querySelector('.math-result');
      if (res) res.textContent = btn.dataset.answer;
    });
  },

  // ===== ENGLISH QUESTION =====
  _renderEnglishQuestion(q, container) {
    container.innerHTML = `
      <div class="question-container">
        <div class="question-title">${q.question}</div>
        ${q.emoji ? `<div style="font-size:5rem;margin:0.5rem 0">${q.emoji}</div>` : ''}
        ${q.hex ? `<div class="color-target" style="background:${q.hex};width:120px;height:120px;margin:0.5rem auto"></div>` : ''}
        <div class="options-grid cols-2" style="margin-top:1.5rem">
          ${q.options.map(opt => `
            <button class="option-btn" data-answer="${opt}">
              <span class="opt-label">${opt}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
    this._attachOptionListeners(container, '.option-btn', q.correct);
  },

  // ===== MEMORY GAME =====
  _renderMemoryGame(q, container) {
    const isBilingual = q.type === 'memory-bilingual';
    const allCards = [];
    q.pairs.forEach(pair => {
      allCards.push({ id: pair.name, display: pair.emoji, match: pair.name });
      allCards.push({ id: pair.name, display: isBilingual ? pair.pair : pair.emoji, match: pair.name, isText: isBilingual });
    });
    const shuffled = this._shuffleArr([...allCards]);
    let flipped = [], matched = [], locked = false;

    const cardEls = shuffled.map((card, i) => {
      const el = document.createElement('div');
      el.className = 'memory-card';
      el.dataset.match = card.match;
      el.dataset.idx = i;
      el.innerHTML = `
        <div class="card-front">?</div>
        <div class="card-back" style="${card.isText ? 'font-family:Fredoka One,cursive;font-size:1.2rem' : ''}">${card.display}</div>
      `;
      return el;
    });

    container.innerHTML = `
      <div class="question-container">
        <div class="question-title">🧠 Encuentra los pares</div>
        <div class="memory-grid" style="grid-template-columns:repeat(${q.gridCols||4},1fr);max-width:${q.gridCols===4?'500px':'640px'}"></div>
      </div>
    `;
    const grid = container.querySelector('.memory-grid');
    cardEls.forEach(el => {
      grid.appendChild(el);
      el.addEventListener('click', () => {
        if (locked || flipped.includes(el) || el.classList.contains('matched')) return;
        SoundEngine.play('flip');
        el.classList.add('flipped');
        flipped.push(el);
       if (flipped.length === 2) {
  locked = true;

  const first = flipped[0];
  const second = flipped[1];

  setTimeout(() => {
    if (
      first.dataset.match === second.dataset.match &&
      first !== second
    ) {
      first.classList.add('matched');
      second.classList.add('matched');

      matched.push(first.dataset.match);

      SoundEngine.play('correct');

      if (matched.length === q.pairs.length) {
        setTimeout(() => this.onAnswer?.(true), 500);
      }
    } else {
      SoundEngine.play('wrong');

      setTimeout(() => {
        first.classList.remove('flipped');
        second.classList.remove('flipped');
      }, 800);
    }

    flipped = [];
    locked = false;
  }, 900);
}
      });
    });
  },

  // ===== CLASSIFY TWO CATEGORIES =====
  _renderClassifyTwo(q, container) {
    let placed = {};
    let selectedItem = null;

    const check = () => {
      const allPlaced = q.items.every(item => placed[item.name]);
      if (allPlaced) {
        const allCorrect = q.items.every(item => placed[item.name] === item.cat);
        setTimeout(() => this.onAnswer?.(allCorrect), 500);
      }
    };

    container.innerHTML = `
      <div class="question-container">
        <div class="question-title">${q.question}</div>
        <div class="question-subtitle" style="margin-bottom:0.5rem;opacity:0.8">Toca el objeto y luego el grupo donde va 👇</div>
        <div class="order-items" id="classify-items">
          ${q.items.map(item => `
            <div class="order-item" data-name="${item.name}" data-cat="${item.cat}" style="font-size:2rem">
              ${item.emoji} ${item.name}
            </div>
          `).join('')}
        </div>
        <div style="display:flex;gap:1.5rem;justify-content:center;flex-wrap:wrap;margin-top:1.5rem">
          ${q.categories.map(cat => `
            <div class="classify-zone" data-cat="${cat}" style="
              min-width:200px;min-height:120px;
              background:rgba(255,255,255,0.1);border:3px dashed rgba(255,255,255,0.4);
              border-radius:20px;padding:1rem;text-align:center;
              font-weight:700;font-size:1.1rem;color:white;transition:all 0.2s;
              cursor:pointer;
            ">
              <div style="margin-bottom:0.5rem">${cat}</div>
              <div class="zone-items" style="display:flex;flex-wrap:wrap;gap:0.5rem;justify-content:center;min-height:40px"></div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    const items = container.querySelectorAll('.order-item');
    const zones = container.querySelectorAll('.classify-zone');

    items.forEach(item => {
      item.addEventListener('click', () => {
        if (item.style.pointerEvents === 'none') return;
        items.forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
        selectedItem = item;
      });
    });

    zones.forEach(zone => {
      zone.addEventListener('click', () => {
        if (!selectedItem) return;
        const chosenCat = zone.dataset.cat;
        const correctCat = selectedItem.dataset.cat;
        const isCorrect = chosenCat === correctCat;

        if (isCorrect) {
          const zoneItems = zone.querySelector('.zone-items');
          const mini = document.createElement('span');
          mini.style.cssText = 'font-size:1.5rem;background:rgba(34,197,94,0.3);border-radius:8px;padding:4px 8px;';
          mini.textContent = selectedItem.textContent.trim().split(' ')[0];
          zoneItems.appendChild(mini);
          placed[selectedItem.dataset.name] = chosenCat;
          selectedItem.style.opacity = '0.3';
          selectedItem.style.pointerEvents = 'none';
          selectedItem.classList.remove('selected');
          SoundEngine.play('correct');
          selectedItem = null;
          check();
        } else {
          zone.classList.add('wrong-match');
          SoundEngine.play('wrong');
          setTimeout(() => zone.classList.remove('wrong-match'), 500);
        }
      });
    });
  },

  // ===== ODD ONE OUT =====
  _renderOddOneOut(q, container) {
    container.innerHTML = `
      <div class="question-container">
        <div class="question-title">${q.question}</div>
        <div class="options-grid cols-2" style="max-width:500px;margin-top:1rem">
          ${q.items.map(item => `
            <button class="option-btn" data-answer="${item}">
              <span class="opt-emoji">${item}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
    this._attachOptionListeners(container, '.option-btn', q.odd || q.correct);
  },

  // ===== PATTERN =====
  _renderPattern(q, container) {
    container.innerHTML = `
      <div class="question-container">
        <div class="question-title">${q.question}</div>
        <div class="pattern-row" style="margin:1.5rem auto">
          ${q.sequence.map(s => `
            <div class="pattern-item ${s==='?'?'blank':''}" style="font-size:2.5rem">${s}</div>
          `).join('')}
        </div>
        <div class="options-grid cols-2" style="max-width:400px">
          ${q.options.map(opt => `
            <button class="option-btn" data-answer="${opt}">
              <span class="opt-emoji" style="font-size:2rem">${opt}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
    this._attachOptionListeners(container, '.option-btn', q.correct);
  },

  // ===== HELPER: Attach option listeners =====
  _attachOptionListeners(container, selector, correct, onSelect = null) {
    container.querySelectorAll(selector).forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll(selector).forEach(b => b.classList.add('disabled'));
        const isCorrect = btn.dataset.answer === String(correct);
        btn.classList.add(isCorrect ? 'correct' : 'wrong');
        if (!isCorrect) {
          container.querySelectorAll(selector).forEach(b => {
            if (b.dataset.answer === String(correct)) b.classList.add('correct');
          });
        }
        if (onSelect) onSelect(btn);
        SoundEngine.play(isCorrect ? 'correct' : 'wrong');
        setTimeout(() => this.onAnswer?.(isCorrect), 800);
      });
    });
  },

  _shuffleArr(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
};

// Helper for color names in object-color render
const COLORS_DATA_MAP = {
  'Rojo': '🔴', 'Azul': '🔵', 'Verde': '🟢', 'Amarillo': '🟡',
  'Naranja': '🟠', 'Morado': '🟣', 'Rosa': '🌸', 'Café': '🟤',
  'Negro': '⚫', 'Blanco': '⚪'
};