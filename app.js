/* ============================================================
   Student Event Registration Dashboard — app.js

   NOTE: Tailwind CDN cannot scan JS innerHTML strings at runtime,
   so all card-internal styles use plain CSS classes defined in
   style.css — NOT Tailwind responsive prefixes like sm:text-base.

   Required methods used:
     Arrays  : push, filter, find, map, reduce
     DOM     : getElementById, querySelector, createElement,
               appendChild, innerHTML, addEventListener, forEach
     Form    : preventDefault, value, trim
     Storage : localStorage.setItem/getItem, JSON.stringify/parse
   ============================================================ */

'use strict';

// ─── Storage key ─────────────────────────────────────────────
const STORAGE_KEY = 'eduevents_v1';

// ─── Category config ──────────────────────────────────────────
const CATEGORY_CONFIG = {
  Technology: {
    gradient:  'linear-gradient(90deg,#7c3aed,#4f46e5)',
    badgeBg:   'rgba(139,92,246,0.15)',
    badgeColor:'#c4b5fd',
    badgeBorder:'rgba(139,92,246,0.3)',
    dotColor:  '#a78bfa',
  },
  Science: {
    gradient:  'linear-gradient(90deg,#4338ca,#6366f1)',
    badgeBg:   'rgba(99,102,241,0.15)',
    badgeColor:'#a5b4fc',
    badgeBorder:'rgba(99,102,241,0.3)',
    dotColor:  '#818cf8',
  },
  Arts: {
    gradient:  'linear-gradient(90deg,#be185d,#ec4899)',
    badgeBg:   'rgba(236,72,153,0.15)',
    badgeColor:'#f9a8d4',
    badgeBorder:'rgba(236,72,153,0.3)',
    dotColor:  '#f472b6',
  },
  Sports: {
    gradient:  'linear-gradient(90deg,#059669,#10b981)',
    badgeBg:   'rgba(52,211,153,0.15)',
    badgeColor:'#6ee7b7',
    badgeBorder:'rgba(52,211,153,0.3)',
    dotColor:  '#34d399',
  },
  Business: {
    gradient:  'linear-gradient(90deg,#d97706,#f59e0b)',
    badgeBg:   'rgba(251,191,36,0.15)',
    badgeColor:'#fde68a',
    badgeBorder:'rgba(251,191,36,0.3)',
    dotColor:  '#fbbf24',
  },
  Health: {
    gradient:  'linear-gradient(90deg,#0d9488,#14b8a6)',
    badgeBg:   'rgba(20,184,166,0.15)',
    badgeColor:'#99f6e4',
    badgeBorder:'rgba(20,184,166,0.3)',
    dotColor:  '#2dd4bf',
  },
  Culture: {
    gradient:  'linear-gradient(90deg,#ea580c,#f97316)',
    badgeBg:   'rgba(249,115,22,0.15)',
    badgeColor:'#fed7aa',
    badgeBorder:'rgba(249,115,22,0.3)',
    dotColor:  '#fb923c',
  },
  Other: {
    gradient:  'linear-gradient(90deg,#475569,#64748b)',
    badgeBg:   'rgba(100,116,139,0.15)',
    badgeColor:'#cbd5e1',
    badgeBorder:'rgba(100,116,139,0.3)',
    dotColor:  '#94a3b8',
  },
};

// ─── Default seed data ────────────────────────────────────────
const DEFAULT_EVENTS = [
  { id: 1, title: 'AI Bootcamp',             category: 'Technology', seats: 30,  registered: 12 },
  { id: 2, title: 'Science Fair 2025',       category: 'Science',    seats: 50,  registered: 30 },
  { id: 3, title: 'Drama & Theatre Night',   category: 'Arts',       seats: 40,  registered: 5  },
  { id: 4, title: 'Inter-School Marathon',   category: 'Sports',     seats: 100, registered: 88 },
  { id: 5, title: 'Entrepreneurship Summit', category: 'Business',   seats: 60,  registered: 60 },
  { id: 6, title: 'Mental Health Workshop',  category: 'Health',     seats: 25,  registered: 10 },
];

// ─── App state ────────────────────────────────────────────────
let events      = [];
let searchQuery = '';
let nextId      = 1;
let alertTimer  = null;

// ════════════════════════════════════════════════════════════
// LOCAL STORAGE
// ════════════════════════════════════════════════════════════

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

// ════════════════════════════════════════════════════════════
// STATISTICS  — reduce()
// ════════════════════════════════════════════════════════════

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

// ════════════════════════════════════════════════════════════
// FILTER  — filter(), includes(), toLowerCase()
// ════════════════════════════════════════════════════════════

function getFilteredEvents() {
  if (!searchQuery) return events;
  const q = searchQuery.toLowerCase();
  return events.filter(e =>
    e.title.toLowerCase().includes(q) ||
    e.category.toLowerCase().includes(q)
  );
}

// ════════════════════════════════════════════════════════════
// XSS HELPER
// ════════════════════════════════════════════════════════════

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ════════════════════════════════════════════════════════════
// BUILD ONE CARD  — createElement(), appendChild(), innerHTML
//
// IMPORTANT: All CSS classes used here are plain class names
// defined in style.css. No Tailwind responsive prefixes (sm:,
// lg:) because Tailwind CDN cannot scan runtime innerHTML.
// ════════════════════════════════════════════════════════════

function createEventCard(event) {
  const remaining = event.seats - event.registered;
  const isFull    = remaining <= 0;
  const fillPct   = Math.min(100, Math.round((event.registered / event.seats) * 100));
  const cat       = CATEGORY_CONFIG[event.category] || CATEGORY_CONFIG['Other'];

  // Progress bar colour
  let barColor = '#10b981'; // green
  if      (fillPct >= 90) barColor = '#ef4444'; // red
  else if (fillPct >= 70) barColor = '#f59e0b'; // amber
  else if (fillPct >= 50) barColor = '#eab308'; // yellow

  // Percentage label colour
  let pctColor = '#34d399';
  if      (fillPct >= 90) pctColor = '#f87171';
  else if (fillPct >= 70) pctColor = '#fbbf24';

  // ── Outer card shell ─────────────────────────────────────
  const card = document.createElement('div');
  card.className  = 'event-card';
  card.dataset.id = event.id;

  // ── Accent bar (gradient via inline style) ───────────────
  const accent = document.createElement('div');
  accent.className       = 'card-accent';
  accent.style.background = cat.gradient;
  card.appendChild(accent);

  // ── Card body ────────────────────────────────────────────
  const body = document.createElement('div');
  body.className = 'card-body';

  // Title + badge row
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

  // Seat stats grid
  const seatGrid = document.createElement('div');
  seatGrid.className = 'seat-grid';
  seatGrid.innerHTML = `
    <div class="seat-box seat-box-default">
      <p class="seat-label">Total</p>
      <p class="seat-value" style="color:#e2e8f0;">${event.seats}</p>
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

  // Progress bar
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

  // Fully booked warning
  if (isFull) {
    const warn = document.createElement('p');
    warn.className   = 'full-badge';
    warn.textContent = '⚠ Event is fully booked';
    body.appendChild(warn);
  }

  card.appendChild(body);

  // ── Action buttons ───────────────────────────────────────
  const actions = document.createElement('div');
  actions.className = 'card-actions';

  const regBtn = document.createElement('button');
  regBtn.className = 'btn-register register-btn';
  regBtn.dataset.id = event.id;
  regBtn.textContent = isFull ? 'Fully Booked' : '✓ Register';
  if (isFull) regBtn.disabled = true;

  const canBtn = document.createElement('button');
  canBtn.className = 'btn-cancel cancel-btn';
  canBtn.dataset.id = event.id;
  canBtn.textContent = '✕ Cancel';
  if (event.registered === 0) canBtn.disabled = true;

  actions.appendChild(regBtn);
  actions.appendChild(canBtn);
  card.appendChild(actions);

  return card;
}

// ════════════════════════════════════════════════════════════
// RENDER  — map(), forEach(), appendChild()
// ════════════════════════════════════════════════════════════

function renderEvents() {
  const container  = document.getElementById('events-container');
  const emptyState = document.getElementById('empty-state');

  // map() — turn each event object into a card DOM node
  const filtered = getFilteredEvents();
  const cards    = filtered.map(event => createEventCard(event));

  container.innerHTML = '';

  if (cards.length === 0) {
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
    // forEach() + appendChild() — insert every card
    cards.forEach(card => container.appendChild(card));
  }

  updateStats();
}

// ════════════════════════════════════════════════════════════
// REGISTER  — find()
// ════════════════════════════════════════════════════════════

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

// ════════════════════════════════════════════════════════════
// CANCEL  — find()
// ════════════════════════════════════════════════════════════

function cancelRegistration(id) {
  const event = events.find(e => e.id === id);
  if (!event) return;

  if (event.registered <= 0) {
    showAlert('No registrations to cancel for this event.', 'error');
    return;
  }

  event.registered--;
  saveToStorage();
  renderEvents();
  showAlert(`Registration cancelled for "${event.title}".`, 'info');
}

// ════════════════════════════════════════════════════════════
// ADD EVENT  — push(), preventDefault(), value, trim()
// ════════════════════════════════════════════════════════════

function handleAddEvent(e) {
  e.preventDefault();

  // querySelector() to select each field
  const titleEl    = document.querySelector('#event-title');
  const categoryEl = document.querySelector('#event-category');
  const seatsEl    = document.querySelector('#event-seats');

  const title    = titleEl.value.trim();
  const category = categoryEl.value.trim();
  const seats    = parseInt(seatsEl.value, 10);

  // Clear old errors
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

  // push() — add new event object to the array
  events.push({ id: nextId++, title, category, seats, registered: 0 });
  saveToStorage();
  renderEvents();

  document.getElementById('add-event-form').reset();
  showAlert(`Event "${title}" added successfully!`, 'success');

  // Scroll to events list on mobile after adding
  if (window.innerWidth < 1024) {
    document.getElementById('events').scrollIntoView({ behavior: 'smooth' });
  }
}

// ════════════════════════════════════════════════════════════
// SEARCH  — filter(), includes(), toLowerCase()
// ════════════════════════════════════════════════════════════

function handleSearch(e) {
  searchQuery = e.target.value.trim();

  // Keep both search inputs in sync
  const d = document.getElementById('search-input');
  const m = document.getElementById('search-mobile');
  if (d && e.target !== d) d.value = e.target.value;
  if (m && e.target !== m) m.value = e.target.value;

  renderEvents();
}

// ════════════════════════════════════════════════════════════
// ALERT TOAST
// ════════════════════════════════════════════════════════════

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

  box.setAttribute('style',
    `background:${p.bg};color:${p.color};border-color:${p.border};`);
  box.innerHTML = `${icons[type] || icons.info}<span>${message}</span>`;
  box.classList.remove('hidden');

  if (alertTimer) clearTimeout(alertTimer);
  alertTimer = setTimeout(() => box.classList.add('hidden'), 3500);
}

// ════════════════════════════════════════════════════════════
// CARD CLICK DELEGATION
// ════════════════════════════════════════════════════════════

function attachCardListeners() {
  document.getElementById('events-container').addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn || btn.disabled) return;
    const id = parseInt(btn.dataset.id, 10);
    if (isNaN(id)) return;
    if (btn.classList.contains('register-btn')) registerForEvent(id);
    if (btn.classList.contains('cancel-btn'))   cancelRegistration(id);
  });
}

// ════════════════════════════════════════════════════════════
// MOBILE MENU
// ════════════════════════════════════════════════════════════

function attachMobileMenu() {
  const btn       = document.getElementById('hamburger-btn');
  const menu      = document.getElementById('mobile-menu');
  const iconOpen  = document.getElementById('icon-open');
  const iconClose = document.getElementById('icon-close');

  btn.addEventListener('click', () => {
    const nowHidden = menu.classList.toggle('hidden');
    iconOpen.classList.toggle('hidden',  !nowHidden);
    iconClose.classList.toggle('hidden',  nowHidden);
    btn.setAttribute('aria-expanded', String(!nowHidden));
  });

  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.add('hidden');
      iconOpen.classList.remove('hidden');
      iconClose.classList.add('hidden');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
}

// ════════════════════════════════════════════════════════════
// INIT
// ════════════════════════════════════════════════════════════

function init() {
  if (!loadFromStorage()) {
    events = DEFAULT_EVENTS.map(e => ({ ...e }));
    nextId = events.length + 1;
    saveToStorage();
  }

  renderEvents();
  attachCardListeners();
  attachMobileMenu();

  document.getElementById('add-event-form').addEventListener('submit', handleAddEvent);

  const desktopSearch = document.getElementById('search-input');
  const mobileSearch  = document.getElementById('search-mobile');
  if (desktopSearch) desktopSearch.addEventListener('input', handleSearch);
  if (mobileSearch)  mobileSearch.addEventListener('input',  handleSearch);
}

document.addEventListener('DOMContentLoaded', init);
