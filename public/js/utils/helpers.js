// public/js/utils/sounds.js
// Audio feedback using Web Audio API (no external files needed)

export const SoundEngine = {
  ctx: null,
  enabled: true,

  init() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio not supported');
    }
  },

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  },

  play(type) {
    if (!this.enabled || !this.ctx) return;
    this.resume();
    switch (type) {
      case 'correct': this._playCorrect(); break;
      case 'wrong': this._playWrong(); break;
      case 'complete': this._playComplete(); break;
      case 'click': this._playClick(); break;
      case 'flip': this._playFlip(); break;
      case 'star': this._playStar(); break;
    }
  },

  _tone(freq, dur, type = 'sine', vol = 0.3) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + dur);
  },

  _playCorrect() {
    this._tone(523, 0.15, 'sine', 0.3);
    setTimeout(() => this._tone(659, 0.15, 'sine', 0.3), 150);
    setTimeout(() => this._tone(784, 0.25, 'sine', 0.3), 300);
  },

  _playWrong() {
    this._tone(200, 0.2, 'sawtooth', 0.2);
    setTimeout(() => this._tone(150, 0.3, 'sawtooth', 0.15), 200);
  },

  _playComplete() {
    const notes = [523, 587, 659, 698, 784, 880];
    notes.forEach((n, i) => setTimeout(() => this._tone(n, 0.2, 'sine', 0.25), i * 120));
  },

  _playClick() {
    this._tone(800, 0.05, 'square', 0.1);
  },

  _playFlip() {
    this._tone(440, 0.08, 'sine', 0.15);
    setTimeout(() => this._tone(550, 0.08, 'sine', 0.15), 80);
  },

  _playStar() {
    this._tone(1046, 0.15, 'sine', 0.2);
    setTimeout(() => this._tone(1318, 0.15, 'sine', 0.2), 100);
  }
};

// public/js/utils/confetti.js
export const Confetti = {
  colors: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A855F7', '#22C55E', '#F97316', '#EC4899', '#3B82F6'],

  launch(container) {
    if (!container) return;
    for (let i = 0; i < 80; i++) {
      setTimeout(() => this._createPiece(container), Math.random() * 800);
    }
  },

  _createPiece(container) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    const color = this.colors[Math.floor(Math.random() * this.colors.length)];
    const size = Math.random() * 12 + 6;
    const left = Math.random() * 100;
    const duration = Math.random() * 2 + 1.5;
    const delay = Math.random() * 0.5;

    piece.style.cssText = `
      left: ${left}%;
      background: ${color};
      width: ${size}px;
      height: ${size}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      animation: confettiFall ${duration}s ${delay}s ease-out forwards;
      position: absolute;
      top: -20px;
    `;
    container.appendChild(piece);
    setTimeout(() => piece.remove(), (duration + delay) * 1000 + 500);
  }
};

// public/js/utils/toast.js
export const Toast = {
  show(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'slideInRight 0.3s ease reverse';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
};

// public/js/utils/mascot.js
export const Mascot = {
  messages: {
    welcome: ["¡Bienvenido/a, Profe! ¿Qué vamos a aprender hoy? 🌟", "¡Listo para aprender! 📚", "¡Vamos a divertirnos aprendiendo! 🎉"],
    correct: ["¡Excelente! 🎉", "¡Muy bien! ⭐", "¡Correcto! 🏆", "¡Fantástico! 🌟", "¡Lo lograron! 💪"],
    wrong: ["¡Casi! Inténtalo de nuevo 💪", "¡Vamos, pueden! 🌟", "¡No se rindan! 🎯"],
    complete: ["¡Actividad completada! 🏆", "¡Lo hicieron genial! 🎊", "¡Son unos campeones! 🥇"],
    encourage: ["¡Siguen aprendiendo! 📖", "¡Cada día mejor! 🌱", "¡El esfuerzo vale la pena! ⭐"]
  },

  say(type) {
    const msgs = this.messages[type] || this.messages.welcome;
    const msg = msgs[Math.floor(Math.random() * msgs.length)];
    const speechEl = document.getElementById('mascot-speech');
    if (speechEl) {
      speechEl.textContent = msg;
      speechEl.style.animation = 'none';
      speechEl.offsetHeight; // reflow
      speechEl.style.animation = 'popIn 0.4s ease';
    }
    return msg;
  }
};