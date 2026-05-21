'use strict';
const STORAGE_KEY = 'eduevents_v1';

const CATEGORY_CONFIG = {
  Technology: {
    gradient:    'linear-gradient(90deg,#7c3aed,#4f46e5)',
    badgeBg:     'rgba(139,92,246,0.15)',
    badgeColor:  '#c4b5fd',
    badgeBorder: 'rgba(139,92,246,0.3)',
    dotColor:    '#a78bfa',
  },
  Science: {
    gradient:    'linear-gradient(90deg,#4338ca,#6366f1)',
    badgeBg:     'rgba(99,102,241,0.15)',
    badgeColor:  '#a5b4fc',
    badgeBorder: 'rgba(99,102,241,0.3)',
    dotColor:    '#818cf8',
  },
  Arts: {
    gradient:    'linear-gradient(90deg,#be185d,#ec4899)',
    badgeBg:     'rgba(236,72,153,0.15)',
    badgeColor:  '#f9a8d4',
    badgeBorder: 'rgba(236,72,153,0.3)',
    dotColor:    '#f472b6',
  },
  Sports: {
    gradient:    'linear-gradient(90deg,#059669,#10b981)',
    badgeBg:     'rgba(52,211,153,0.15)',
    badgeColor:  '#6ee7b7',
    badgeBorder: 'rgba(52,211,153,0.3)',
    dotColor:    '#34d399',
  },
  Business: {
    gradient:    'linear-gradient(90deg,#d97706,#f59e0b)',
    badgeBg:     'rgba(251,191,36,0.15)',
    badgeColor:  '#fde68a',
    badgeBorder: 'rgba(251,191,36,0.3)',
    dotColor:    '#fbbf24',
  },
  Health: {
    gradient:    'linear-gradient(90deg,#0d9488,#14b8a6)',
    badgeBg:     'rgba(20,184,166,0.15)',
    badgeColor:  '#99f6e4',
    badgeBorder: 'rgba(20,184,166,0.3)',
    dotColor:    '#2dd4bf',
  },
  Culture: {
    gradient:    'linear-gradient(90deg,#ea580c,#f97316)',
    badgeBg:     'rgba(249,115,22,0.15)',
    badgeColor:  '#fed7aa',
    badgeBorder: 'rgba(249,115,22,0.3)',
    dotColor:    '#fb923c',
  },
  Other: {
    gradient:    'linear-gradient(90deg,#475569,#64748b)',
    badgeBg:     'rgba(100,116,139,0.15)',
    badgeColor:  '#cbd5e1',
    badgeBorder: 'rgba(100,116,139,0.3)',
    dotColor:    '#94a3b8',
  },
};

const DEFAULT_EVENTS = [
  { id: 1, title: 'AI Bootcamp',             category: 'Technology', seats: 30,  registered: 12 },
  { id: 2, title: 'Science Fair 2025',       category: 'Science',    seats: 50,  registered: 30 },
  { id: 3, title: 'Drama & Theatre Night',   category: 'Arts',       seats: 40,  registered: 5  },
  { id: 4, title: 'Inter-School Marathon',   category: 'Sports',     seats: 100, registered: 88 },
  { id: 5, title: 'Entrepreneurship Summit', category: 'Business',   seats: 60,  registered: 60 },
  { id: 6, title: 'Mental Health Workshop',  category: 'Health',     seats: 25,  registered: 10 },
];

let events      = [];
let searchQuery = '';
let nextId      = 1;
let alertTimer  = null;

function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ events, nextId }));
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;

    const data = JSON.parse(raw);

    events = Array.isArray(data.events) ? data.events : [];

    nextId = typeof data.nextId === 'number' ? data.nextId : events.length + 1;

    return events.length > 0;
  } catch {
    return false;
  }
}

function updateStats() {
  const totalRegistered = events.reduce((sum, e) => sum + e.registered, 0);

  const remainingSeats  = events.reduce((sum, e) => sum + (e.seats - e.registered), 0);

  document.getElementById('stat-total-events').textContent     = events.length;
  document.getElementById('stat-total-registered').textContent = totalRegistered;
  document.getElementById('stat-remaining-seats').textContent  = remainingSeats;

  const count = getFilteredEvents().length;
  document.getElementById('event-count-badge').textContent =
    count === 1 ? '1 event' : `${count} events`;
}

function getFilteredEvents() {
  if (!searchQuery) return events;

  const q = searchQuery.toLowerCase();

  return events.filter(e =>
    e.title.toLowerCase().includes(q) ||
    e.category.toLowerCase().includes(q)
  );
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function createEventCard(event) {
  const remaining = event.seats - event.registered;

  const isFull = remaining <= 0;

  const fillPct = Math.min(100, Math.round((event.registered / event.seats) * 100));

  const cat = CATEGORY_CONFIG[event.category] || CATEGORY_CONFIG['Other'];

  let barColor = '#10b981';
  if      (fillPct >= 90) barColor = '#ef4444';
  else if (fillPct >= 70) barColor = '#f59e0b';
  else if (fillPct >= 50) barColor = '#eab308';

  let pctColor = '#34d399';
  if      (fillPct >= 90) pctColor = '#f87171';
  else if (fillPct >= 70) pctColor = '#fbbf24';

  const card = document.createElement('div');
  card.className  = 'event-card';
  card.dataset.id = event.id;

  const accent = document.createElement('div');
  accent.className        = 'card-accent';
  accent.style.background = cat.gradient;
  card.appendChild(accent);

  const body = document.createElement('div');
  body.className = 'card-body';

  const titleRow = document.createElement('div');
  titleRow.className = 'card-title-row';
  titleRow.innerHTML = `
    <h3 class="card-title">${escapeHtml(event.title)}</h3>
    <span class="card-badge"
      style="background:${cat.badgeBg};color:${cat.badgeColor};border-color:${cat.badgeBorder};">
      <span class="badge-dot" style="background:${cat.dotColor};"></span>
      ${escapeHtml(event.category)}
    </span>
  `;
  body.appendChild(titleRow);

  const seatGrid = document.createElement('div');
  seatGrid.className = 'seat-grid';
  seatGrid.innerHTML = `
    <div class="seat-box seat-box-default">
      <p class="seat-label">Total</p>
      <p class="seat-value" style="color:var(--text-primary);">${event.seats}</p>
    </div>
    <div class="seat-box seat-box-registered">
      <p class="seat-label" style="color:#a78bfa;">Registered</p>
      <p class="seat-value" style="color:#c4b5fd;">${event.registered}</p>
    </div>
    <div class="seat-box ${isFull ? 'seat-box-full' : 'seat-box-available'}">
      <p class="seat-label" style="color:${isFull ? '#f87171' : '#34d399'};">Remaining</p>
      <p class="seat-value" style="color:${isFull ? '#fca5a5' : '#6ee7b7'};">${remaining}</p>
    </div>
  `;
  body.appendChild(seatGrid);

  const progressWrap = document.createElement('div');
  progressWrap.innerHTML = `
    <div class="progress-row">
      <span>Capacity</span>
      <span style="font-weight:600;color:${pctColor};">${fillPct}%</span>
    </div>
    <div class="progress-track">
      <div class="bar-fill" style="width:${fillPct}%;background:${barColor};"></div>
    </div>
  `;
  body.appendChild(progressWrap);

  if (isFull) {
    const warn = document.createElement('p');
    warn.className   = 'full-badge';
    warn.textContent = '⚠ Event is fully booked';
    body.appendChild(warn);
  }

  card.appendChild(body);

  const actions = document.createElement('div');
  actions.className = 'card-actions';

  const regBtn = document.createElement('button');
  regBtn.className  = 'btn-register register-btn';
  regBtn.dataset.id = event.id;
  regBtn.textContent = isFull ? 'Fully Booked' : '✓ Register';
  if (isFull) regBtn.disabled = true;

  const canBtn = document.createElement('button');
  canBtn.className  = 'btn-cancel cancel-btn';
  canBtn.dataset.id = event.id;
  canBtn.textContent = '✕ Cancel';

  actions.appendChild(regBtn);
  actions.appendChild(canBtn);
  card.appendChild(actions);

  return card;
}

function renderEvents() {
  const container  = document.getElementById('events-container');
  const emptyState = document.getElementById('empty-state');

  const filtered = getFilteredEvents();
  const cards    = filtered.map(event => createEventCard(event));

  container.innerHTML = '';

  if (cards.length === 0) {
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');

    cards.forEach(card => container.appendChild(card));
  }

  updateStats();
}

function registerForEvent(id) {
  const event = events.find(e => e.id === id);
  if (!event) return;

  if (event.registered >= event.seats) {
    showAlert('This event is fully booked.', 'error');
    return;
  }

  event.registered++;
  saveToStorage();
  renderEvents();
  showAlert(`Registered for "${event.title}" successfully!`, 'success');
}

function showNoRegistrationAlert(eventTitle) {
  const existing = document.getElementById('cancel-modal');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'cancel-modal';
  overlay.style.cssText = `
    position:fixed;inset:0;z-index:9999;
    display:flex;align-items:center;justify-content:center;
    background:rgba(0,0,0,0.6);backdrop-filter:blur(4px);
    padding:1rem;
  `;

  overlay.innerHTML = `
    <div style="
      background:var(--bg-form);
      border:1px solid var(--border-form);
      border-radius:1.25rem;
      padding:1.75rem;
      max-width:360px;
      width:100%;
      box-shadow:0 24px 60px rgba(0,0,0,0.5);
      animation:modalIn .2s ease;
      text-align:center;
    ">
      <div style="
        width:56px;height:56px;border-radius:50%;
        background:rgba(251,191,36,0.12);
        border:1px solid rgba(251,191,36,0.3);
        display:flex;align-items:center;justify-content:center;
        margin:0 auto 1.25rem;
      ">
        <svg width="26" height="26" fill="none" stroke="#fbbf24" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>

      <h3 style="font-weight:700;font-size:1.05rem;color:var(--text-primary);margin-bottom:.5rem;">
        No Registrations Yet
      </h3>

      <p style="font-size:.875rem;color:var(--text-muted);line-height:1.6;margin-bottom:1.5rem;">
        Nobody is registered for<br>
        <strong style="color:var(--text-primary);">"${escapeHtml(eventTitle)}"</strong>.<br><br>
        Please click <strong style="color:#a78bfa;">✓ Register</strong> first before you can cancel.
      </p>

      <button id="no-reg-ok"
        style="
          width:100%;padding:.75rem 0;border-radius:.75rem;
          font-size:.875rem;font-weight:600;cursor:pointer;
          background:linear-gradient(135deg,#7c3aed,#4f46e5);
          color:#fff;border:none;
          box-shadow:0 2px 12px rgba(124,58,237,0.35);
          transition:opacity .2s;
        ">
        Got it, I'll Register First
      </button>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.remove();
  });

  document.getElementById('no-reg-ok').addEventListener('click', () => overlay.remove());
}

function showCancelConfirm(eventTitle, onConfirm) {
  const existing = document.getElementById('cancel-modal');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'cancel-modal';
  overlay.style.cssText = `
    position:fixed;inset:0;z-index:9999;
    display:flex;align-items:center;justify-content:center;
    background:rgba(0,0,0,0.6);backdrop-filter:blur(4px);
    padding:1rem;
  `;

  overlay.innerHTML = `
    <div style="
      background:var(--bg-form);
      border:1px solid var(--border-form);
      border-radius:1.25rem;
      padding:1.75rem;
      max-width:380px;
      width:100%;
      box-shadow:0 24px 60px rgba(0,0,0,0.5);
      animation:modalIn .2s ease;
    ">
      <div style="
        width:52px;height:52px;border-radius:50%;
        background:rgba(239,68,68,0.12);
        border:1px solid rgba(239,68,68,0.25);
        display:flex;align-items:center;justify-content:center;
        margin:0 auto 1.25rem;
      ">
        <svg width="24" height="24" fill="none" stroke="#ef4444" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        </svg>
      </div>
      <h3 style="font-weight:700;font-size:1.1rem;color:var(--text-primary);text-align:center;margin-bottom:.5rem;">
        Cancel Registration?
      </h3>
      <p style="font-size:.875rem;color:var(--text-muted);text-align:center;margin-bottom:1.5rem;line-height:1.5;">
        Are you sure you want to cancel your registration for<br>
        <strong style="color:var(--text-primary);">"${escapeHtml(eventTitle)}"</strong>?
      </p>
      <div style="display:flex;gap:.75rem;">
        <button id="modal-keep"
          style="
            flex:1;padding:.7rem 0;border-radius:.75rem;
            font-size:.875rem;font-weight:600;cursor:pointer;
            background:var(--bg-input);
            color:var(--text-primary);
            border:1px solid var(--border-input);
            transition:background .2s;
          ">
          Keep Registration
        </button>
        <button id="modal-confirm"
          style="
            flex:1;padding:.7rem 0;border-radius:.75rem;
            font-size:.875rem;font-weight:600;cursor:pointer;
            background:linear-gradient(135deg,#dc2626,#ef4444);
            color:#fff;border:none;
            box-shadow:0 2px 12px rgba(239,68,68,0.35);
            transition:opacity .2s;
          ">
          Yes, Cancel
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.remove();
  });

  document.getElementById('modal-keep').addEventListener('click', () => overlay.remove());

  document.getElementById('modal-confirm').addEventListener('click', () => {
    overlay.remove();
    onConfirm();
  });
}

function cancelRegistration(id) {
  const event = events.find(e => e.id === id);
  if (!event) return;

  if (event.registered <= 0) {
    showNoRegistrationAlert(event.title);
    return;
  }

  showCancelConfirm(event.title, () => {
    event.registered--;
    saveToStorage();
    renderEvents();
    showAlert(`Registration cancelled for "${event.title}".`, 'info');
  });
}

function handleAddEvent(e) {
  e.preventDefault();

  const titleEl    = document.querySelector('#event-title');
  const categoryEl = document.querySelector('#event-category');
  const seatsEl    = document.querySelector('#event-seats');

  const title    = titleEl.value.trim();
  const category = categoryEl.value.trim();
  const seats    = parseInt(seatsEl.value, 10);

  ['title-error', 'category-error', 'seats-error'].forEach(id =>
    document.getElementById(id).classList.add('hidden')
  );

  let valid = true;

  if (!title) {
    document.getElementById('title-error').classList.remove('hidden');
    valid = false;
  }
  if (!category) {
    document.getElementById('category-error').classList.remove('hidden');
    valid = false;
  }
  if (!seatsEl.value || isNaN(seats) || seats < 1 || seats > 500) {
    document.getElementById('seats-error').classList.remove('hidden');
    valid = false;
  }

  if (!valid) return;

  events.push({
    id:         nextId++,
    title,
    category,
    seats,
    registered: 0,
  });

  saveToStorage();
  renderEvents();

  document.getElementById('add-event-form').reset();
  showAlert(`Event "${title}" added successfully!`, 'success');

  if (window.innerWidth < 1024) {
    document.getElementById('events').scrollIntoView({ behavior: 'smooth' });
  }
}

function handleSearch(e) {
  searchQuery = e.target.value.trim();

  const d = document.getElementById('search-desktop');
  const m = document.getElementById('search-mobile');
  if (d && e.target !== d) d.value = e.target.value;
  if (m && e.target !== m) m.value = e.target.value;

  renderEvents();
}

function showAlert(message, type = 'success') {
  const box = document.getElementById('alert-box');

  const palette = {
    success: { bg: 'rgba(52,211,153,0.12)',  color: '#34d399', border: 'rgba(52,211,153,0.3)'  },
    error:   { bg: 'rgba(239,68,68,0.12)',   color: '#f87171', border: 'rgba(239,68,68,0.3)'   },
    info:    { bg: 'rgba(139,92,246,0.12)',  color: '#a78bfa', border: 'rgba(139,92,246,0.3)'  },
  };
  const p = palette[type] || palette.info;

  const icons = {
    success: `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="flex-shrink:0"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`,
    error:   `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="flex-shrink:0"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`,
    info:    `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="flex-shrink:0"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
  };

  box.setAttribute('style', `background:${p.bg};color:${p.color};border-color:${p.border};`);
  box.innerHTML = `${icons[type] || icons.info}<span>${message}</span>`;
  box.classList.remove('hidden');

  if (alertTimer) clearTimeout(alertTimer);
  alertTimer = setTimeout(() => box.classList.add('hidden'), 3500);
}

function attachCardListeners() {
  document.getElementById('events-container').addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const id = parseInt(btn.dataset.id, 10);
    if (isNaN(id)) return;

    if (btn.classList.contains('register-btn')) {
      if (!btn.disabled) registerForEvent(id);
      return;
    }

    if (btn.classList.contains('cancel-btn')) {
      cancelRegistration(id);
    }
  });
}

function initDarkMode() {
  const saved = localStorage.getItem('eduevents_theme') || 'dark';
  applyTheme(saved);

  document.getElementById('mode-toggle')?.addEventListener('click', toggleTheme);
  document.getElementById('mode-toggle-mobile')?.addEventListener('click', toggleTheme);
}

function toggleTheme() {
  const isLight = document.documentElement.classList.contains('light');
  applyTheme(isLight ? 'dark' : 'light');
}

function applyTheme(theme) {
  const html    = document.documentElement;
  const isLight = theme === 'light';

  html.classList.toggle('light', isLight);

  document.getElementById('icon-moon')?.classList.toggle('hidden',  isLight);
  document.getElementById('icon-sun')?.classList.toggle('hidden',  !isLight);

  document.getElementById('icon-moon-m')?.classList.toggle('hidden',  isLight);
  document.getElementById('icon-sun-m')?.classList.toggle('hidden',  !isLight);

  localStorage.setItem('eduevents_theme', theme);
}

function attachMobileMenu() {
  const btn       = document.getElementById('ham-btn');
  const menu      = document.getElementById('mob-menu');
  const iconOpen  = document.getElementById('ham-open');
  const iconClose = document.getElementById('ham-close');

  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const nowHidden = menu.classList.toggle('hidden');

    iconOpen?.classList.toggle('hidden',  !nowHidden);
    iconClose?.classList.toggle('hidden',  nowHidden);

    btn.setAttribute('aria-expanded', String(!nowHidden));
  });

  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.add('hidden');
      iconOpen?.classList.remove('hidden');
      iconClose?.classList.add('hidden');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
}

function init() {
  if (!loadFromStorage()) {
    events = DEFAULT_EVENTS.map(e => ({ ...e }));
    nextId = events.length + 1;
    saveToStorage();
  }

  renderEvents();

  attachCardListeners();

  attachMobileMenu();

  initDarkMode();

  document.getElementById('add-event-form').addEventListener('submit', handleAddEvent);

  const desktopSearch = document.getElementById('search-desktop');
  const mobileSearch  = document.getElementById('search-mobile');
  if (desktopSearch) desktopSearch.addEventListener('input', handleSearch);
  if (mobileSearch)  mobileSearch.addEventListener('input',  handleSearch);
}

document.addEventListener('DOMContentLoaded', init);
