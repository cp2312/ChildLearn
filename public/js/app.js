// public/js/app.js
// Main orchestrator: navigation, class mode, activity flow, progress

import { AuthService, TeacherService, ProgressService } from './firebase-init.js';
import { CURRICULUM } from './curriculum.js';
import { generateActivity } from './activities/engine.js';
import { ActivityRenderer } from './activities/renderer.js';
import { SoundEngine, Confetti, Toast, Mascot } from './utils/helpers.js';

const App = {
  // ===== STATE =====
  state: {
    teacher: null,
    groups: [],
    activeGroup: null,
    activeGrade: null,
    activeTopicKey: null,
    activeActivity: null,
    questions: [],
    currentIndex: 0,
    score: 0,
    correctCount: 0,
    startTime: null,
    history: [],
    stats: {}
  },

  // ===== INIT =====
  init() {
    SoundEngine.init();
    this._bindGlobalEvents();
    this._showSplash();

    AuthService.onAuthChange(async (user) => {
      if (user) {
        await this._onLogin(user);
      } else {
        this._showLogin();
      }
    });
  },

  _showSplash() {
    setTimeout(() => {
      const splash = document.getElementById('splash-screen');
      if (splash) {
        splash.classList.add('hiding');
        setTimeout(() => splash.classList.add('hidden'), 800);
      }
    }, 1200);
  },

  _showLogin() {
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('app').classList.add('hidden');
  },

  async _onLogin(user) {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');

    let profile = await TeacherService.getProfile(user.uid);
    if (!profile) {
      // First-time login: create a basic profile so the teacher isn't stuck
      profile = {
        name: user.email.split('@')[0],
        email: user.email,
        groups: ['Grupo 1']
      };
      await TeacherService.saveProfile(user.uid, profile);
    }

    this.state.teacher = profile;
    this.state.groups = profile.groups || ['Grupo 1'];

    document.getElementById('teacher-name').textContent = profile.name || user.email;
    document.getElementById('hero-teacher-name').textContent = profile.name || user.email;

    this._renderGroupSelector();
    Mascot.say('welcome');
    await this._loadStats();
    this._populateProfileSettings();
    Toast.show(`¡Bienvenido/a, ${profile.name}!`, 'success');
  },

  // ===== GLOBAL EVENT BINDINGS =====
  _bindGlobalEvents() {
    // Login form
    document.getElementById('login-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      const errorEl = document.getElementById('login-error');
      const btn = document.getElementById('login-btn');
      errorEl.classList.add('hidden');
      btn.disabled = true;
      btn.innerHTML = '<span>Entrando...</span> ⏳';
      try {
        await AuthService.login(email, password);
      } catch (err) {
        errorEl.textContent = this._friendlyAuthError(err);
        errorEl.classList.remove('hidden');
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<span>Entrar</span> 🚀';
      }
    });

    // Logout
    document.getElementById('logout-btn')?.addEventListener('click', async () => {
      await AuthService.logout();
      this._resetState();
      Toast.show('Sesión cerrada', 'info');
    });

    // Top nav section switching
    document.querySelectorAll('.nav-btn[data-section]').forEach(btn => {
      btn.addEventListener('click', () => this.goToSection(btn.dataset.section));
    });

    // Mobile menu toggle
    document.getElementById('mobile-menu-btn')?.addEventListener('click', () => {
      const nav = document.querySelector('.nav-right');
      nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
    });

    // Grade cards (dashboard) — replaces inline onclick to comply with strict CSP
    document.querySelectorAll('.grade-card[data-grade]').forEach(card => {
      card.addEventListener('click', () => this.selectGrade(card.dataset.grade));
    });

    // Back to dashboard (from activities section)
    document.getElementById('back-to-dashboard')?.addEventListener('click', () => {
      const topicsView = document.getElementById('topics-view');
      const activitiesView = document.getElementById('activities-view');
      if (!activitiesView.classList.contains('hidden')) {
        // Go back from activity list to topics grid
        activitiesView.classList.add('hidden');
        topicsView.classList.remove('hidden');
        document.getElementById('activities-grade-title').textContent =
          CURRICULUM[this.state.activeGrade]?.name || 'Selecciona un grado';
      } else {
        this.goToSection('dashboard');
      }
    });

    // Class mode controls
    document.getElementById('class-exit-btn')?.addEventListener('click', () => this._confirmExitClassMode());
    document.getElementById('class-next-btn')?.addEventListener('click', () => this._nextQuestion());
    document.getElementById('class-prev-btn')?.addEventListener('click', () => this._prevQuestion());

    // Completion screen buttons
    document.getElementById('save-result-btn')?.addEventListener('click', () => this._saveResult());
    document.getElementById('retry-btn')?.addEventListener('click', () => this._retryActivity());
    document.getElementById('exit-activity-btn')?.addEventListener('click', () => this._exitClassMode());

    // Settings: sound toggle
    document.getElementById('sound-enabled')?.addEventListener('change', (e) => {
      SoundEngine.enabled = e.target.checked;
    });

    // Settings: theme switch
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const theme = btn.dataset.theme;
        if (theme === 'colorful') document.body.removeAttribute('data-theme');
        else document.body.setAttribute('data-theme', theme);
      });
    });

    // Settings: edit groups
    document.getElementById('edit-groups-btn')?.addEventListener('click', () => this._openEditGroupsModal());

    // Modal close
    document.getElementById('modal-close')?.addEventListener('click', () => this._closeModal());
    document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
      if (e.target.id === 'modal-overlay') this._closeModal();
    });

    // Progress filters
    document.getElementById('filter-group')?.addEventListener('change', () => this._renderProgressSection());
    document.getElementById('filter-period')?.addEventListener('change', () => this._renderProgressSection());

    // Unlock audio context on first interaction (browser requirement)
    document.body.addEventListener('click', () => SoundEngine.resume(), { once: true });
  },

  _friendlyAuthError(err) {
    const code = err?.code || '';
    if (code.includes('user-not-found') || code.includes('invalid-credential')) return 'Correo o contraseña incorrectos.';
    if (code.includes('wrong-password')) return 'Contraseña incorrecta.';
    if (code.includes('invalid-email')) return 'Correo no válido.';
    if (code.includes('too-many-requests')) return 'Demasiados intentos. Intenta más tarde.';
    return 'No se pudo iniciar sesión. Verifica tus datos.';
  },

  _resetState() {
    this.state.teacher = null;
    this.state.activeGroup = null;
    this.state.activeGrade = null;
  },

  // ===== NAVIGATION =====
  goToSection(sectionName) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
    const target = document.getElementById(`section-${sectionName}`);
    if (target) {
      target.classList.remove('hidden');
      target.classList.add('active');
    }
    document.querySelectorAll('.nav-btn[data-section]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.section === sectionName);
    });

    if (sectionName === 'progress') this._renderProgressSection();
    if (sectionName === 'activities' && !this.state.activeGrade) {
      document.getElementById('activities-grade-title').textContent = 'Selecciona un grado primero';
    }
  },

  // ===== GROUP SELECTOR =====
  _renderGroupSelector() {
    const container = document.getElementById('group-selector');
    if (!container) return;
    container.innerHTML = this.state.groups.map((g, i) => `
      <button class="group-btn ${i === 0 ? 'active' : ''}" data-group="${g}">${g}</button>
    `).join('') + `<button class="group-btn" id="add-group-btn">+ Agregar grupo</button>`;

    container.querySelectorAll('.group-btn[data-group]').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.group-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.state.activeGroup = btn.dataset.group;
        Toast.show(`Grupo activo: ${btn.dataset.group}`, 'info', 1500);
      });
    });
    container.querySelector('#add-group-btn')?.addEventListener('click', () => this._openEditGroupsModal());

    if (this.state.groups.length > 0) this.state.activeGroup = this.state.groups[0];

    // Also populate filter dropdown in progress section
    const filterSelect = document.getElementById('filter-group');
    if (filterSelect) {
      filterSelect.innerHTML = '<option value="">Todos los grupos</option>' +
        this.state.groups.map(g => `<option value="${g}">${g}</option>`).join('');
    }
  },

  // ===== GRADE / TOPIC / ACTIVITY SELECTION =====
  selectGrade(gradeKey) {
    if (!this.state.activeGroup) {
      Toast.show('Selecciona primero un grupo en el inicio', 'error');
      this.goToSection('dashboard');
      return;
    }
    this.state.activeGrade = gradeKey;
    this.goToSection('activities');
    this._renderTopicsGrid(gradeKey);
  },

  _renderTopicsGrid(gradeKey) {
    const grade = CURRICULUM[gradeKey];
    if (!grade) return;

    document.getElementById('activities-grade-title').textContent =
      `${grade.emoji} ${grade.name} — Grupo: ${this.state.activeGroup}`;

    document.getElementById('topics-view').classList.remove('hidden');
    document.getElementById('activities-view').classList.add('hidden');

    const grid = document.getElementById('topics-grid');
    grid.innerHTML = Object.entries(grade.topics).map(([key, topic]) => `
      <div class="topic-card" data-topic="${key}" style="border-color:${topic.color}33">
        <div class="topic-emoji">${topic.emoji}</div>
        <div class="topic-name">${topic.name}</div>
        <div class="topic-count">${topic.activities.length} actividades</div>
        <div class="topic-progress"><div class="topic-progress-bar" style="width:0%;background:${topic.color}"></div></div>
      </div>
    `).join('');

    grid.querySelectorAll('.topic-card').forEach(card => {
      card.addEventListener('click', () => this._renderActivitiesList(gradeKey, card.dataset.topic));
    });

    // Fill in mastery progress bars from stats if available
    this._applyTopicProgressBars(gradeKey);
  },

  _applyTopicProgressBars(gradeKey) {
    const groupStats = this.state.stats[this.state.activeGroup];
    if (!groupStats) return;
    const grade = CURRICULUM[gradeKey];
    Object.keys(grade.topics).forEach(topicKey => {
      const topicName = grade.topics[topicKey].name;
      const topicStat = groupStats.topics?.[topicName];
      if (topicStat) {
        const bar = document.querySelector(`.topic-card[data-topic="${topicKey}"] .topic-progress-bar`);
        if (bar) bar.style.width = `${topicStat.avgScore}%`;
      }
    });
  },

  _renderActivitiesList(gradeKey, topicKey) {
    const grade = CURRICULUM[gradeKey];
    const topic = grade.topics[topicKey];
    if (!topic) return;

    this.state.activeTopicKey = topicKey;

    document.getElementById('activities-grade-title').textContent = `${topic.emoji} ${topic.name}`;
    document.getElementById('topics-view').classList.add('hidden');
    document.getElementById('activities-view').classList.remove('hidden');

    const list = document.getElementById('activities-list');
    list.innerHTML = topic.activities.map(act => `
      <div class="activity-card" data-activity="${act.id}" data-type="${act.type}" style="border-left-color:${topic.color}">
        <div class="activity-icon">${act.icon}</div>
        <div class="activity-info">
          <h4>${act.name}</h4>
          <p>${act.desc}</p>
          <span class="activity-tag">${topic.name}</span>
        </div>
      </div>
    `).join('');

    list.querySelectorAll('.activity-card').forEach(card => {
      card.addEventListener('click', () => {
        const act = topic.activities.find(a => a.id === card.dataset.activity);
        this._startActivity(gradeKey, topic, act);
      });
    });
  },

  // ===== CLASS MODE: START ACTIVITY =====
  _startActivity(gradeKey, topic, activity) {
    const questions = generateActivity(activity.id, activity.type);
    if (!questions || questions.length === 0) {
      Toast.show('Esta actividad aún no tiene contenido', 'error');
      return;
    }

    this.state.activeActivity = { gradeKey, topic, activity };
    this.state.questions = questions;
    this.state.currentIndex = 0;
    this.state.score = 0;
    this.state.correctCount = 0;
    this.state.startTime = Date.now();

    document.getElementById('class-topic-name').textContent = topic.name;
    document.getElementById('class-activity-name').textContent = activity.name;
    document.getElementById('class-score').textContent = '0';

    document.getElementById('class-mode').classList.remove('hidden');
    document.getElementById('completion-screen').classList.add('hidden');

    this._renderDots();
    this._renderCurrentQuestion();

    // Request fullscreen if supported
    const el = document.getElementById('class-mode');
    if (el.requestFullscreen) {
      el.requestFullscreen().catch(() => {});
    }
  },

  _renderDots() {
    const dotsContainer = document.getElementById('class-dots');
    dotsContainer.innerHTML = this.state.questions.map((_, i) =>
      `<div class="class-dot ${i === this.state.currentIndex ? 'active' : ''}"></div>`
    ).join('');
  },

  _updateDots() {
    document.querySelectorAll('.class-dot').forEach((dot, i) => {
      dot.classList.remove('active', 'done');
      if (i < this.state.currentIndex) dot.classList.add('done');
      if (i === this.state.currentIndex) dot.classList.add('active');
    });
  },

  _renderCurrentQuestion() {
    const question = this.state.questions[this.state.currentIndex];
    const body = document.getElementById('class-body');

    ActivityRenderer.onAnswer = (isCorrect) => this._handleAnswer(isCorrect);
    ActivityRenderer.render(question, body);

    // Update progress bar
    const pct = ((this.state.currentIndex) / this.state.questions.length) * 100;
    document.getElementById('class-progress-fill').style.width = `${pct}%`;

    // Prev/Next button states
    document.getElementById('class-prev-btn').disabled = this.state.currentIndex === 0;
    const isLast = this.state.currentIndex === this.state.questions.length - 1;
    document.getElementById('class-next-btn').textContent = isLast ? 'Finalizar 🏁' : 'Siguiente →';

    this._updateDots();
  },

  _handleAnswer(isCorrect) {
    if (isCorrect) {
      this.state.score += 10;
      this.state.correctCount++;
      document.getElementById('class-score').textContent = this.state.score;
      this._showFeedback('correct');
      Mascot.say('correct');
    } else {
      this._showFeedback('wrong');
      Mascot.say('wrong');
    }
    // Auto-advance shortly after feedback
    setTimeout(() => this._nextQuestion(), 1100);
  },

  _showFeedback(type) {
    const el = document.getElementById(`feedback-${type}`);
    if (!el) return;
    el.classList.remove('hidden');
    setTimeout(() => el.classList.add('hidden'), 900);
  },

  _nextQuestion() {
    if (this.state.currentIndex < this.state.questions.length - 1) {
      this.state.currentIndex++;
      this._renderCurrentQuestion();
    } else {
      this._completeActivity();
    }
  },

  _prevQuestion() {
    if (this.state.currentIndex > 0) {
      this.state.currentIndex--;
      this._renderCurrentQuestion();
    }
  },

  _completeActivity() {
    const total = this.state.questions.length;
    const pct = Math.round((this.state.correctCount / total) * 100);

    document.getElementById('class-progress-fill').style.width = '100%';
    document.getElementById('final-score').textContent = this.state.score;
    document.getElementById('final-pct').textContent = `${pct}%`;

    const starsCount = pct >= 90 ? 3 : pct >= 70 ? 2 : pct >= 50 ? 1 : 0;
    document.getElementById('completion-stars').innerHTML =
      Array(3).fill(0).map((_, i) => `<span class="star-appear">${i < starsCount ? '⭐' : '☆'}</span>`).join('');

    const medal = pct >= 90 ? '🥇 Medalla de Oro' : pct >= 70 ? '🥈 Medalla de Plata' : pct >= 50 ? '🥉 Medalla de Bronce' : '💪 ¡Sigan practicando!';
    document.getElementById('completion-medal').textContent = medal;

    document.getElementById('completion-screen').classList.remove('hidden');
    SoundEngine.play('complete');
    Mascot.say('complete');

    const confettiContainer = document.getElementById('completion-confetti');
    Confetti.launch(confettiContainer);

    // Reset save button state
    const saveBtn = document.getElementById('save-result-btn');
    saveBtn.disabled = false;
    saveBtn.innerHTML = '💾 Guardar resultado';
  },

  async _saveResult() {
    const { gradeKey, topic, activity } = this.state.activeActivity;
    const total = this.state.questions.length;
    const pct = Math.round((this.state.correctCount / total) * 100);
    const duration = Math.round((Date.now() - this.state.startTime) / 1000);

    const saveBtn = document.getElementById('save-result-btn');
    saveBtn.disabled = true;
    saveBtn.innerHTML = '⏳ Guardando...';

    try {
      await ProgressService.saveSession({
        group: this.state.activeGroup,
        grade: CURRICULUM[gradeKey].name,
        topic: topic.name,
        activity: activity.name,
        score: pct,
        totalQuestions: total,
        correct: this.state.correctCount,
        duration
      });
      saveBtn.innerHTML = '✅ ¡Guardado!';
      Toast.show('Resultado guardado correctamente', 'success');
      await this._loadStats();
    } catch (err) {
      console.error(err);
      saveBtn.disabled = false;
      saveBtn.innerHTML = '💾 Guardar resultado';
      Toast.show('No se pudo guardar. Intenta de nuevo.', 'error');
    }
  },

  _retryActivity() {
    const { gradeKey, topic, activity } = this.state.activeActivity;
    this._startActivity(gradeKey, topic, activity);
  },

  _confirmExitClassMode() {
    const completionVisible = !document.getElementById('completion-screen').classList.contains('hidden');
    if (completionVisible) {
      this._exitClassMode();
      return;
    }
    if (confirm('¿Salir de la actividad? Se perderá el progreso actual.')) {
      this._exitClassMode();
    }
  },

  _exitClassMode() {
    document.getElementById('class-mode').classList.add('hidden');
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    this.goToSection('activities');
  },

  // ===== PROGRESS SECTION =====
  async _loadStats() {
    try {
      const user = AuthService.currentUser();
      if (!user) return;
      this.state.stats = await ProgressService.getStats(user.uid);
      this._updateDashboardStats();
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  },

  _updateDashboardStats() {
    const groupStats = this.state.stats[this.state.activeGroup];
    const allSessions = Object.values(this.state.stats).reduce((sum, g) => sum + g.sessions, 0);
    const allTopics = new Set();
    Object.values(this.state.stats).forEach(g => Object.keys(g.topics || {}).forEach(t => allTopics.add(t)));

    document.getElementById('stat-sessions').textContent = groupStats?.sessions || 0;
    document.getElementById('stat-score').textContent = `${groupStats?.avgScore || 0}%`;
    document.getElementById('stat-topics').textContent = allTopics.size;
    document.getElementById('stat-streak').textContent = allSessions > 0 ? Math.min(Math.ceil(allSessions / 2), 30) : 0;
  },

  async _renderProgressSection() {
    const user = AuthService.currentUser();
    if (!user) return;

    const groupFilter = document.getElementById('filter-group')?.value || null;

    // Progress cards (one per group)
    const cardsContainer = document.getElementById('progress-cards');
    const groupsToShow = groupFilter ? [groupFilter] : Object.keys(this.state.stats);
    cardsContainer.innerHTML = groupsToShow.map(g => {
      const s = this.state.stats[g];
      if (!s) return `<div class="progress-card"><h4>${g}</h4><p>Sin datos aún</p></div>`;
      return `
        <div class="progress-card">
          <h4 style="font-family:'Fredoka One',cursive;color:var(--primary)">${g}</h4>
          <div class="stat-value" style="font-size:1.8rem">${s.avgScore}%</div>
          <div class="stat-label">${s.sessions} actividades realizadas</div>
        </div>
      `;
    }).join('') || '<p style="color:var(--text-soft)">Aún no hay actividades registradas.</p>';

    // Mastery bars (aggregate by topic across selected group(s))
    const masteryContainer = document.getElementById('mastery-bars');
    const topicAgg = {};
    groupsToShow.forEach(g => {
      const s = this.state.stats[g];
      if (!s) return;
      Object.entries(s.topics || {}).forEach(([topicName, t]) => {
        if (!topicAgg[topicName]) topicAgg[topicName] = [];
        topicAgg[topicName].push(t.avgScore);
      });
    });
    const masteryEntries = Object.entries(topicAgg).map(([name, scores]) => ({
      name, avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    }));
    masteryContainer.innerHTML = masteryEntries.length > 0 ? masteryEntries.map(t => `
      <div class="mastery-bar-item">
        <div class="mastery-label"><span>${t.name}</span><span>${t.avg}%</span></div>
        <div class="mastery-track">
          <div class="mastery-fill" style="width:${t.avg}%;background:${t.avg >= 70 ? 'var(--green)' : t.avg >= 50 ? 'var(--orange)' : 'var(--primary)'}"></div>
        </div>
      </div>
    `).join('') : '<p style="color:var(--text-soft)">Aún no hay temas registrados.</p>';

    // History list
    try {
      const history = await ProgressService.getHistory(user.uid, groupFilter, 30);
      const historyList = document.getElementById('history-list');
      historyList.innerHTML = history.length > 0 ? history.map(h => {
        const scoreClass = h.score >= 70 ? 'score-good' : h.score >= 50 ? 'score-mid' : 'score-low';
        const date = new Date(h.date).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
        return `
          <div class="history-item">
            <div class="history-score ${scoreClass}">${h.score}%</div>
            <div class="history-info">
              <strong>${h.activity}</strong>
              <small>${h.topic} · ${h.grade} · ${h.group}</small>
            </div>
            <div class="history-date">${date}</div>
          </div>
        `;
      }).join('') : '<p style="color:var(--text-soft)">No hay historial todavía. ¡Realiza tu primera actividad!</p>';
    } catch (err) {
      console.error('Error loading history:', err);
    }
  },

  // ===== SETTINGS =====
  _populateProfileSettings() {
    const info = document.getElementById('profile-info');
    if (!info || !this.state.teacher) return;
    info.innerHTML = `
      <p><strong>Nombre:</strong> ${this.state.teacher.name}</p>
      <p><strong>Correo:</strong> ${this.state.teacher.email}</p>
      <p><strong>Grupos:</strong> ${(this.state.teacher.groups || []).join(', ')}</p>
    `;
  },

  _openEditGroupsModal() {
    const content = document.getElementById('modal-content');
    content.innerHTML = `
      <h3 style="font-family:'Fredoka One',cursive;color:var(--primary);margin-bottom:1rem">✏️ Mis grupos</h3>
      <div id="groups-edit-list" style="display:flex;flex-direction:column;gap:0.5rem;margin-bottom:1rem">
        ${this.state.groups.map((g, i) => `
          <div style="display:flex;gap:0.5rem">
            <input type="text" class="group-input" value="${g}" data-idx="${i}"
              style="flex:1;padding:0.5rem;border:2px solid var(--border);border-radius:10px;font-family:inherit">
            <button class="remove-group-btn" data-idx="${i}" style="background:#FEE2E2;color:#DC2626;border:none;border-radius:10px;padding:0.5rem 0.8rem;cursor:pointer">✕</button>
          </div>
        `).join('')}
      </div>
      <button id="add-group-input-btn" class="btn-secondary" style="width:100%;margin-bottom:1rem">+ Agregar grupo</button>
      <button id="save-groups-btn" class="btn-primary" style="width:100%">💾 Guardar cambios</button>
    `;

    const refreshList = () => {
      content.querySelectorAll('.remove-group-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.idx);
          this._tempGroups = this._tempGroups || [...this.state.groups];
          this._tempGroups.splice(idx, 1);
          this._rebuildGroupsList(content, refreshList);
        });
      });
    };
    refreshList();

    content.querySelector('#add-group-input-btn')?.addEventListener('click', () => {
      this._tempGroups = this._tempGroups || [...this.state.groups];
      this._tempGroups.push(`Grupo ${this._tempGroups.length + 1}`);
      this._rebuildGroupsList(content, refreshList);
    });

    content.querySelector('#save-groups-btn')?.addEventListener('click', async () => {
      const inputs = content.querySelectorAll('.group-input');
      const newGroups = Array.from(inputs).map(i => i.value.trim()).filter(Boolean);
      if (newGroups.length === 0) {
        Toast.show('Debes tener al menos un grupo', 'error');
        return;
      }
      this.state.groups = newGroups;
      await TeacherService.saveProfile(AuthService.currentUser().uid, { groups: newGroups });
      this._renderGroupSelector();
      this._populateProfileSettings();
      this._closeModal();
      Toast.show('Grupos actualizados', 'success');
      this._tempGroups = null;
    });

    this._showModal();
  },

  _rebuildGroupsList(content, refreshCallback) {
    const list = content.querySelector('#groups-edit-list');
    list.innerHTML = this._tempGroups.map((g, i) => `
      <div style="display:flex;gap:0.5rem">
        <input type="text" class="group-input" value="${g}" data-idx="${i}"
          style="flex:1;padding:0.5rem;border:2px solid var(--border);border-radius:10px;font-family:inherit">
        <button class="remove-group-btn" data-idx="${i}" style="background:#FEE2E2;color:#DC2626;border:none;border-radius:10px;padding:0.5rem 0.8rem;cursor:pointer">✕</button>
      </div>
    `).join('');
    refreshCallback();
  },

  _showModal() {
    document.getElementById('modal-overlay').classList.remove('hidden');
  },

  _closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
    this._tempGroups = null;
  }
};

// Expose globally for inline onclick handlers in index.html (grade cards)
window.App = App;

// Boot the app
App.init();