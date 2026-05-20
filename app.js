/* ============================================================
   FILE: app.js
   PROJECT: Student Event Registration Dashboard
   AUTHOR: Makuza Nadege
   DATE: 2025

   HOW TO SEARCH THIS FILE:
   Use Ctrl+F (or Cmd+F) and search for any keyword below:

   KEYWORD              → WHAT YOU WILL FIND
   ─────────────────────────────────────────────
   STORAGE KEY          → The key name used to save data in localStorage
   CATEGORY CONFIG      → Colors and gradients for each event category
   DEFAULT EVENTS       → The 6 starter events loaded on first visit
   APP STATE            → The main variables: events array, searchQuery, nextId
   SAVE TO STORAGE      → How events are saved to localStorage (JSON.stringify)
   LOAD FROM STORAGE    → How events are loaded from localStorage (JSON.parse)
   STATISTICS           → How Total Events, Registered, Remaining are calculated (reduce)
   FILTER               → How search works (filter + includes + toLowerCase)
   BUILD ONE CARD       → How each event card is created (createElement + appendChild)
   RENDER               → How all cards are shown on screen (map + forEach)
   REGISTER             → What happens when Register button is clicked (find)
   CANCEL CONFIRM       → The popup modal that asks "Are you sure?"
   CANCEL               → What happens when Cancel button is clicked (find)
   ADD EVENT            → What happens when the Add Event form is submitted (push)
   SEARCH               → How the search input filters events in real time
   ALERT TOAST          → The small notification that appears after actions
   CARD CLICK           → How Register and Cancel button clicks are detected
   DARK LIGHT MODE      → How the dark/light mode toggle works
   MOBILE MENU          → How the hamburger menu opens and closes
   INIT                 → Where everything starts when the page loads
   ============================================================ */

'use strict';

// ─────────────────────────────────────────────────────────────
// STORAGE KEY
// This is the name used to save and load data in localStorage.
// If you change this, old saved data will not be found.
// ─────────────────────────────────────────────────────────────
const STORAGE_KEY = 'eduevents_v1';

// ─────────────────────────────────────────────────────────────
// CATEGORY CONFIG
// Each event category has its own color scheme.
// - gradient  : the colored bar at the top of each card
// - badgeBg   : background color of the category pill badge
// - badgeColor: text color inside the badge
// - badgeBorder: border color of the badge
// - dotColor  : the small colored dot inside the badge
//
// HOW TO ADD A NEW CATEGORY:
// 1. Add a new option in index.html inside <select id="event-category">
// 2. Add a matching entry here with your chosen colors
// ─────────────────────────────────────────────────────────────
const CATEGORY_CONFIG = {
  Technology: {
    gradient:    'linear-gradient(90deg,#7c3aed,#4f46e5)', // purple
    badgeBg:     'rgba(139,92,246,0.15)',
    badgeColor:  '#c4b5fd',
    badgeBorder: 'rgba(139,92,246,0.3)',
    dotColor:    '#a78bfa',
  },
  Science: {
    gradient:    'linear-gradient(90deg,#4338ca,#6366f1)', // indigo
    badgeBg:     'rgba(99,102,241,0.15)',
    badgeColor:  '#a5b4fc',
    badgeBorder: 'rgba(99,102,241,0.3)',
    dotColor:    '#818cf8',
  },
  Arts: {
    gradient:    'linear-gradient(90deg,#be185d,#ec4899)', // pink
    badgeBg:     'rgba(236,72,153,0.15)',
    badgeColor:  '#f9a8d4',
    badgeBorder: 'rgba(236,72,153,0.3)',
    dotColor:    '#f472b6',
  },
  Sports: {
    gradient:    'linear-gradient(90deg,#059669,#10b981)', // green
    badgeBg:     'rgba(52,211,153,0.15)',
    badgeColor:  '#6ee7b7',
    badgeBorder: 'rgba(52,211,153,0.3)',
    dotColor:    '#34d399',
  },
  Business: {
    gradient:    'linear-gradient(90deg,#d97706,#f59e0b)', // amber
    badgeBg:     'rgba(251,191,36,0.15)',
    badgeColor:  '#fde68a',
    badgeBorder: 'rgba(251,191,36,0.3)',
    dotColor:    '#fbbf24',
  },
  Health: {
    gradient:    'linear-gradient(90deg,#0d9488,#14b8a6)', // teal
    badgeBg:     'rgba(20,184,166,0.15)',
    badgeColor:  '#99f6e4',
    badgeBorder: 'rgba(20,184,166,0.3)',
    dotColor:    '#2dd4bf',
  },
  Culture: {
    gradient:    'linear-gradient(90deg,#ea580c,#f97316)', // orange
    badgeBg:     'rgba(249,115,22,0.15)',
    badgeColor:  '#fed7aa',
    badgeBorder: 'rgba(249,115,22,0.3)',
    dotColor:    '#fb923c',
  },
  Other: {
    gradient:    'linear-gradient(90deg,#475569,#64748b)', // slate/gray
    badgeBg:     'rgba(100,116,139,0.15)',
    badgeColor:  '#cbd5e1',
    badgeBorder: 'rgba(100,116,139,0.3)',
    dotColor:    '#94a3b8',
  },
};

// ─────────────────────────────────────────────────────────────
// DEFAULT EVENTS
// These 6 events are loaded the very first time someone opens
// the app (when localStorage is empty).
// Each event is an OBJECT with these properties:
//   id         : unique number to identify the event
//   title      : name of the event
//   category   : must match one of the keys in CATEGORY_CONFIG
//   seats      : total number of seats available
//   registered : how many students have registered so far
//
// HOW TO ADD MORE STARTER EVENTS:
// Just add another object to this array following the same format.
// ─────────────────────────────────────────────────────────────
const DEFAULT_EVENTS = [
  { id: 1, title: 'AI Bootcamp',             category: 'Technology', seats: 30,  registered: 12 },
  { id: 2, title: 'Science Fair 2025',       category: 'Science',    seats: 50,  registered: 30 },
  { id: 3, title: 'Drama & Theatre Night',   category: 'Arts',       seats: 40,  registered: 5  },
  { id: 4, title: 'Inter-School Marathon',   category: 'Sports',     seats: 100, registered: 88 },
  { id: 5, title: 'Entrepreneurship Summit', category: 'Business',   seats: 60,  registered: 60 },
  { id: 6, title: 'Mental Health Workshop',  category: 'Health',     seats: 25,  registered: 10 },
];

// ─────────────────────────────────────────────────────────────
// APP STATE
// These three variables hold the current state of the app.
//
//   events      : the ARRAY of all event objects currently in memory
//                 (this is what gets saved to localStorage)
//   searchQuery : the current text typed in the search box
//                 (empty string = show all events)
//   nextId      : the next ID number to give a newly added event
//                 (always increases, never reused)
//   alertTimer  : used internally to auto-hide the toast notification
// ─────────────────────────────────────────────────────────────
let events      = [];   // starts empty, filled by loadFromStorage() or DEFAULT_EVENTS
let searchQuery = '';   // starts empty (no filter)
let nextId      = 1;    // starts at 1, increases with each new event
let alertTimer  = null; // holds the setTimeout reference for the alert

// ─────────────────────────────────────────────────────────────
// SAVE TO STORAGE
// Converts the events array to a JSON string and saves it
// in the browser's localStorage under the key 'eduevents_v1'.
//
// Called every time:
//   - A new event is added
//   - A student registers for an event
//   - A registration is cancelled
//
// METHOD USED: localStorage.setItem() + JSON.stringify()
// ─────────────────────────────────────────────────────────────
function saveToStorage() {
  // JSON.stringify turns the JavaScript object into a text string
  // so it can be stored in localStorage (which only stores strings)
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ events, nextId }));
}

// ─────────────────────────────────────────────────────────────
// LOAD FROM STORAGE
// Reads saved data from localStorage and puts it back into
// the events array and nextId variable.
//
// Called once when the page first loads (inside init()).
// Returns true if data was found, false if localStorage is empty.
//
// METHOD USED: localStorage.getItem() + JSON.parse()
// ─────────────────────────────────────────────────────────────
function loadFromStorage() {
  try {
    // localStorage.getItem() returns the saved string (or null if nothing saved)
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false; // nothing saved yet → use DEFAULT_EVENTS instead

    // JSON.parse() converts the text string back into a JavaScript object
    const data = JSON.parse(raw);

    // Restore the events array (make sure it's actually an array)
    events = Array.isArray(data.events) ? data.events : [];

    // Restore the nextId counter (make sure it's a number)
    nextId = typeof data.nextId === 'number' ? data.nextId : events.length + 1;

    return events.length > 0; // return true only if we actually have events
  } catch {
    // If JSON.parse fails (corrupted data), start fresh
    return false;
  }
}

// ─────────────────────────────────────────────────────────────
// STATISTICS
// Calculates and displays the three dashboard numbers:
//   - Total Events     : simply events.length
//   - Total Registered : sum of all event.registered values
//   - Remaining Seats  : sum of (event.seats - event.registered) for all events
//
// Also updates the "X events" badge next to the section heading.
//
// METHOD USED: reduce() — loops through the array and accumulates a total
//   reduce((accumulator, currentItem) => accumulator + currentItem.value, startValue)
// ─────────────────────────────────────────────────────────────
function updateStats() {
  // reduce() adds up all registered values across every event
  // starts at 0, adds event.registered for each event
  const totalRegistered = events.reduce((sum, e) => sum + e.registered, 0);

  // reduce() adds up remaining seats: (total seats - registered) for each event
  const remainingSeats  = events.reduce((sum, e) => sum + (e.seats - e.registered), 0);

  // textContent updates the number shown on screen (no HTML, just plain text)
  document.getElementById('stat-total-events').textContent     = events.length;
  document.getElementById('stat-total-registered').textContent = totalRegistered;
  document.getElementById('stat-remaining-seats').textContent  = remainingSeats;

  // Update the small badge that shows "6 events" or "1 event"
  const count = getFilteredEvents().length;
  document.getElementById('event-count-badge').textContent =
    count === 1 ? '1 event' : `${count} events`;
}

// ─────────────────────────────────────────────────────────────
// FILTER
// Returns only the events that match the current search query.
// If searchQuery is empty, returns ALL events (no filtering).
//
// Searches both the event title AND the category name.
// The search is case-insensitive (converts both to lowercase).
//
// METHODS USED:
//   filter()      → keeps only items where the condition is true
//   includes()    → checks if a string contains another string
//   toLowerCase() → makes comparison case-insensitive
//
// EXAMPLE:
//   searchQuery = "boot"
//   "AI Bootcamp".toLowerCase().includes("boot") → true ✓ (shown)
//   "Science Fair".toLowerCase().includes("boot") → false ✗ (hidden)
// ─────────────────────────────────────────────────────────────
function getFilteredEvents() {
  // If nothing is typed in the search box, return all events
  if (!searchQuery) return events;

  const q = searchQuery.toLowerCase(); // convert search text to lowercase once

  // filter() goes through every event and keeps only those that match
  return events.filter(e =>
    e.title.toLowerCase().includes(q) ||    // check if title contains the search text
    e.category.toLowerCase().includes(q)    // OR if category contains the search text
  );
}

// ─────────────────────────────────────────────────────────────
// XSS HELPER
// Escapes special HTML characters in user-provided text.
// This prevents malicious code from being injected into the page.
// For example: if someone types <script> in the event title,
// this function turns it into &lt;script&gt; (safe plain text).
// ─────────────────────────────────────────────────────────────
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')   // & → &amp;
    .replace(/</g, '&lt;')    // < → &lt;
    .replace(/>/g, '&gt;')    // > → &gt;
    .replace(/"/g, '&quot;')  // " → &quot;
    .replace(/'/g, '&#039;'); // ' → &#039;
}

// ─────────────────────────────────────────────────────────────
// BUILD ONE CARD
// Creates a single event card as a DOM element and returns it.
// This function is called once for each event in the filtered list.
//
// HOW THE CARD IS BUILT:
//   1. Calculate remaining seats and fill percentage
//   2. Create the outer card div with createElement()
//   3. Create the colored accent bar at the top
//   4. Create the card body (title, badge, seat boxes, progress bar)
//   5. Create the Register and Cancel buttons
//   6. Attach everything together with appendChild()
//
// METHODS USED:
//   createElement()  → creates a new HTML element
//   appendChild()    → adds a child element inside a parent element
//   innerHTML        → sets the HTML content of an element
//   dataset.id       → stores the event ID on the button for later use
// ─────────────────────────────────────────────────────────────
function createEventCard(event) {
  // Calculate how many seats are left
  const remaining = event.seats - event.registered;

  // isFull is true when no seats are left
  const isFull = remaining <= 0;

  // fillPct is the percentage of seats taken (0–100)
  // Used to draw the progress bar and choose its color
  const fillPct = Math.min(100, Math.round((event.registered / event.seats) * 100));

  // Get the color config for this event's category
  // Falls back to 'Other' if the category is not in CATEGORY_CONFIG
  const cat = CATEGORY_CONFIG[event.category] || CATEGORY_CONFIG['Other'];

  // Choose progress bar color based on how full the event is
  let barColor = '#10b981'; // green  = plenty of seats
  if      (fillPct >= 90) barColor = '#ef4444'; // red   = almost/fully booked
  else if (fillPct >= 70) barColor = '#f59e0b'; // amber = getting full
  else if (fillPct >= 50) barColor = '#eab308'; // yellow = half full

  // Choose the percentage label color (matches bar color)
  let pctColor = '#34d399';
  if      (fillPct >= 90) pctColor = '#f87171';
  else if (fillPct >= 70) pctColor = '#fbbf24';

  // ── Step 1: Create the outer card container ───────────────
  // createElement('div') creates a <div> element in memory (not on screen yet)
  const card = document.createElement('div');
  card.className  = 'event-card'; // CSS class from style.css
  card.dataset.id = event.id;     // store event ID so buttons can find it

  // ── Step 2: Create the colored accent bar at the top ─────
  // This is the thin colored stripe at the very top of each card
  const accent = document.createElement('div');
  accent.className        = 'card-accent';
  accent.style.background = cat.gradient; // gradient color from CATEGORY_CONFIG
  card.appendChild(accent); // attach accent bar inside the card

  // ── Step 3: Create the card body ─────────────────────────
  const body = document.createElement('div');
  body.className = 'card-body';

  // ── Step 4: Title row + category badge ───────────────────
  // innerHTML is used here because the inner structure is fixed HTML
  // (not user input — user input is escaped with escapeHtml first)
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
  body.appendChild(titleRow); // attach title row inside the body

  // ── Step 5: Seat stats (3 boxes: Total / Registered / Remaining) ──
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
  body.appendChild(seatGrid); // attach seat boxes inside the body

  // ── Step 6: Capacity progress bar ────────────────────────
  // Shows a colored bar that fills up as more students register
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

  // ── Step 7: "Fully booked" warning (only shown when isFull) ──
  if (isFull) {
    const warn = document.createElement('p');
    warn.className   = 'full-badge';
    warn.textContent = '⚠ Event is fully booked';
    body.appendChild(warn);
  }

  card.appendChild(body); // attach the whole body inside the card

  // ── Step 8: Action buttons (Register + Cancel) ───────────
  const actions = document.createElement('div');
  actions.className = 'card-actions';

  // Register button
  // - disabled when the event is fully booked
  // - class 'register-btn' is used by the click listener to identify it
  const regBtn = document.createElement('button');
  regBtn.className  = 'btn-register register-btn';
  regBtn.dataset.id = event.id;          // store event ID so the listener knows which event
  regBtn.textContent = isFull ? 'Fully Booked' : '✓ Register';
  if (isFull) regBtn.disabled = true;    // disable button when no seats left

  // Cancel button
  // - visually dimmed when registered = 0 (nothing to cancel)
  // - class 'cancel-btn' is used by the click listener to identify it
  const canBtn = document.createElement('button');
  canBtn.className  = 'btn-cancel cancel-btn';
  canBtn.dataset.id = event.id;          // store event ID so the listener knows which event
  canBtn.textContent = '✕ Cancel';
  // NOTE: we do NOT disable this button even when registered = 0
  // Instead we let the click reach cancelRegistration() which shows a helpful alert

  actions.appendChild(regBtn); // add Register button to actions row
  actions.appendChild(canBtn); // add Cancel button to actions row
  card.appendChild(actions);   // attach actions row to the card

  return card; // return the finished card element (not on screen yet)
}

// ─────────────────────────────────────────────────────────────
// RENDER
// Clears the events grid and redraws all cards from scratch.
// Called every time something changes (register, cancel, add, search).
//
// HOW IT WORKS:
//   1. Get the filtered list of events (based on searchQuery)
//   2. Use map() to convert each event object → card DOM element
//   3. Clear the container (container.innerHTML = '')
//   4. Use forEach() + appendChild() to insert each card
//   5. Show the "No events found" message if the list is empty
//   6. Update the statistics numbers
//
// METHODS USED:
//   map()         → transforms each event object into a card element
//   forEach()     → loops through cards and appends each one
//   appendChild() → inserts a card into the events grid
//   innerHTML     → used to clear the container quickly
// ─────────────────────────────────────────────────────────────
function renderEvents() {
  const container  = document.getElementById('events-container'); // the grid div
  const emptyState = document.getElementById('empty-state');      // "No events found" div

  // map() converts the array of event objects into an array of card DOM elements
  // For each event, createEventCard(event) is called and returns a <div> element
  const filtered = getFilteredEvents();
  const cards    = filtered.map(event => createEventCard(event));

  // Clear all existing cards from the grid
  container.innerHTML = '';

  if (cards.length === 0) {
    // No events match the search → show the empty state message
    emptyState.classList.remove('hidden');
  } else {
    // Hide the empty state message
    emptyState.classList.add('hidden');

    // forEach() loops through every card and appendChild() puts it in the grid
    cards.forEach(card => container.appendChild(card));
  }

  // Recalculate and update the statistics numbers
  updateStats();
}

// ─────────────────────────────────────────────────────────────
// REGISTER
// Called when the Register button on a card is clicked.
// Finds the event by ID, increases registered count by 1,
// saves to localStorage, and re-renders the UI.
//
// PREVENTS registration when the event is already full.
//
// METHOD USED: find() → searches the array for the event with matching id
// ─────────────────────────────────────────────────────────────
function registerForEvent(id) {
  // find() searches the events array and returns the first event where e.id === id
  // Returns undefined if no match is found
  const event = events.find(e => e.id === id);
  if (!event) return; // safety check: stop if event not found

  // Check if the event is already full
  if (event.registered >= event.seats) {
    showAlert('This event is fully booked.', 'error');
    return;
  }

  event.registered++; // increase the registered count by 1
  saveToStorage();    // save the updated data to localStorage
  renderEvents();     // redraw all cards to show the new numbers
  showAlert(`Registered for "${event.title}" successfully!`, 'success');
}

// ─────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────
// NO REGISTRATION ALERT
// Shows a friendly modal when the user clicks Cancel on an event
// that has 0 registered students.
// Tells them: "Nobody is registered — please register first."
// ─────────────────────────────────────────────────────────────
function showNoRegistrationAlert(eventTitle) {
  // Remove any existing modal first
  const existing = document.getElementById('cancel-modal');
  if (existing) existing.remove();

  // Create the full-screen overlay
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
      <!-- Info icon in amber/orange -->
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

      <!-- Title -->
      <h3 style="font-weight:700;font-size:1.05rem;color:var(--text-primary);margin-bottom:.5rem;">
        No Registrations Yet
      </h3>

      <!-- Message -->
      <p style="font-size:.875rem;color:var(--text-muted);line-height:1.6;margin-bottom:1.5rem;">
        Nobody is registered for<br>
        <strong style="color:var(--text-primary);">"${escapeHtml(eventTitle)}"</strong>.<br><br>
        Please click <strong style="color:#a78bfa;">✓ Register</strong> first before you can cancel.
      </p>

      <!-- OK button -->
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

  // Close on backdrop click
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.remove();
  });

  // Close on OK button click
  document.getElementById('no-reg-ok').addEventListener('click', () => overlay.remove());
}

// ─────────────────────────────────────────────────────────────
// CANCEL CONFIRM
// Shows a popup modal asking the user to confirm before cancelling.
// This prevents accidental cancellations.
//
// HOW IT WORKS:
//   1. Creates a full-screen overlay div
//   2. Puts a modal box inside it with the event name
//   3. "Keep Registration" button → removes the modal (nothing happens)
//   4. "Yes, Cancel" button → removes modal then calls onConfirm()
//   5. Clicking the dark backdrop also closes the modal
//
// PARAMETER:
//   eventTitle : the name of the event (shown in the modal message)
//   onConfirm  : a function to call if the user clicks "Yes, Cancel"
// ─────────────────────────────────────────────────────────────
function showCancelConfirm(eventTitle, onConfirm) {
  // Remove any existing modal (prevents duplicates)
  const existing = document.getElementById('cancel-modal');
  if (existing) existing.remove();

  // Create the dark overlay that covers the whole screen
  const overlay = document.createElement('div');
  overlay.id = 'cancel-modal';
  overlay.style.cssText = `
    position:fixed;inset:0;z-index:9999;
    display:flex;align-items:center;justify-content:center;
    background:rgba(0,0,0,0.6);backdrop-filter:blur(4px);
    padding:1rem;
  `;

  // Build the modal box content using innerHTML
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

  document.body.appendChild(overlay); // add the modal to the page

  // Close modal when clicking the dark backdrop (outside the box)
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.remove();
  });

  // "Keep Registration" → just close the modal
  document.getElementById('modal-keep').addEventListener('click', () => overlay.remove());

  // "Yes, Cancel" → close modal then run the cancel action
  document.getElementById('modal-confirm').addEventListener('click', () => {
    overlay.remove();
    onConfirm(); // this calls the actual cancel logic
  });
}

// ─────────────────────────────────────────────────────────────
// CANCEL
// Called when the Cancel button on a card is clicked.
// Shows a confirmation modal first (see CANCEL CONFIRM above).
// If the user confirms, decreases registered count by 1,
// saves to localStorage, and re-renders the UI.
//
// If registered = 0, shows an alert telling the user to register first.
//
// METHOD USED: find() → searches the array for the event with matching id
// ─────────────────────────────────────────────────────────────
function cancelRegistration(id) {
  // find() searches the events array and returns the matching event
  const event = events.find(e => e.id === id);
  if (!event) return; // safety check

  // If nobody is registered, show a friendly alert and stop
  if (event.registered <= 0) {
    showNoRegistrationAlert(event.title);
    return;
  }

  // Show the confirmation modal before doing anything
  // onConfirm is a callback function — it only runs if user clicks "Yes, Cancel"
  showCancelConfirm(event.title, () => {
    event.registered--; // decrease registered count by 1
    saveToStorage();    // save updated data to localStorage
    renderEvents();     // redraw all cards
    showAlert(`Registration cancelled for "${event.title}".`, 'info');
  });
}

// ─────────────────────────────────────────────────────────────
// ADD EVENT
// Called when the "Add Event" form is submitted.
// Validates the inputs, creates a new event object,
// adds it to the events array, saves, and re-renders.
//
// VALIDATION RULES:
//   - Event title must not be empty
//   - Category must be selected (not the placeholder option)
//   - Seats must be a number between 1 and 500
//
// METHODS USED:
//   preventDefault() → stops the form from reloading the page
//   querySelector()  → selects the form input elements
//   value.trim()     → reads the input value and removes extra spaces
//   push()           → adds the new event object to the events array
//   reset()          → clears all form fields after successful submission
// ─────────────────────────────────────────────────────────────
function handleAddEvent(e) {
  e.preventDefault(); // IMPORTANT: stops the browser from reloading the page

  // querySelector() selects each form field by its ID
  const titleEl    = document.querySelector('#event-title');
  const categoryEl = document.querySelector('#event-category');
  const seatsEl    = document.querySelector('#event-seats');

  // .value reads what the user typed, .trim() removes leading/trailing spaces
  const title    = titleEl.value.trim();
  const category = categoryEl.value.trim();
  const seats    = parseInt(seatsEl.value, 10); // convert text to a whole number

  // Hide all error messages before re-validating
  ['title-error', 'category-error', 'seats-error'].forEach(id =>
    document.getElementById(id).classList.add('hidden')
  );

  // Validate each field — if invalid, show its error message
  let valid = true;

  if (!title) {
    // Title is empty
    document.getElementById('title-error').classList.remove('hidden');
    valid = false;
  }
  if (!category) {
    // No category selected (user left the placeholder option)
    document.getElementById('category-error').classList.remove('hidden');
    valid = false;
  }
  if (!seatsEl.value || isNaN(seats) || seats < 1 || seats > 500) {
    // Seats is empty, not a number, or out of the 1–500 range
    document.getElementById('seats-error').classList.remove('hidden');
    valid = false;
  }

  // If any field failed validation, stop here (don't add the event)
  if (!valid) return;

  // All fields are valid — create the new event object
  // push() adds it to the END of the events array
  events.push({
    id:         nextId++, // assign the next available ID, then increment nextId
    title,                // shorthand for title: title
    category,             // shorthand for category: category
    seats,                // shorthand for seats: seats
    registered: 0,        // new events always start with 0 registrations
  });

  saveToStorage();  // save the updated array to localStorage
  renderEvents();   // redraw all cards (new card will appear)

  // reset() clears all form fields so the user can add another event
  document.getElementById('add-event-form').reset();
  showAlert(`Event "${title}" added successfully!`, 'success');

  // On mobile screens, scroll down to the events list so the user sees the new card
  if (window.innerWidth < 1024) {
    document.getElementById('events').scrollIntoView({ behavior: 'smooth' });
  }
}

// ─────────────────────────────────────────────────────────────
// SEARCH
// Called every time the user types in the search input.
// Updates the searchQuery variable and re-renders the events.
// The actual filtering happens inside getFilteredEvents().
//
// Also keeps the desktop and mobile search inputs in sync
// (so if you type in one, the other shows the same text).
//
// METHODS USED:
//   filter()      → inside getFilteredEvents()
//   includes()    → inside getFilteredEvents()
//   toLowerCase() → inside getFilteredEvents()
// ─────────────────────────────────────────────────────────────
function handleSearch(e) {
  // Update the global searchQuery with what the user typed
  searchQuery = e.target.value.trim();

  // Keep both search inputs (desktop + mobile) showing the same text
  const d = document.getElementById('search-desktop');
  const m = document.getElementById('search-mobile');
  if (d && e.target !== d) d.value = e.target.value; // sync desktop if mobile was typed in
  if (m && e.target !== m) m.value = e.target.value; // sync mobile if desktop was typed in

  renderEvents(); // re-render with the new filter applied
}

// ─────────────────────────────────────────────────────────────
// ALERT TOAST
// Shows a small notification bar at the top of the events section.
// Automatically disappears after 3.5 seconds.
//
// TYPES:
//   'success' → green  (e.g. "Registered successfully!")
//   'error'   → red    (e.g. "Event is fully booked")
//   'info'    → purple (e.g. "Registration cancelled")
//
// HOW IT WORKS:
//   1. Sets the background, text color, and border using inline styles
//   2. Puts an icon + message inside the box using innerHTML
//   3. Removes the 'hidden' class to make it visible
//   4. Sets a timer to hide it again after 3.5 seconds
// ─────────────────────────────────────────────────────────────
function showAlert(message, type = 'success') {
  const box = document.getElementById('alert-box');

  // Color palette for each alert type
  const palette = {
    success: { bg: 'rgba(52,211,153,0.12)',  color: '#34d399', border: 'rgba(52,211,153,0.3)'  },
    error:   { bg: 'rgba(239,68,68,0.12)',   color: '#f87171', border: 'rgba(239,68,68,0.3)'   },
    info:    { bg: 'rgba(139,92,246,0.12)',  color: '#a78bfa', border: 'rgba(139,92,246,0.3)'  },
  };
  const p = palette[type] || palette.info;

  // SVG icons for each alert type
  const icons = {
    success: `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="flex-shrink:0"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`,
    error:   `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="flex-shrink:0"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`,
    info:    `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="flex-shrink:0"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
  };

  // Apply colors and content
  box.setAttribute('style', `background:${p.bg};color:${p.color};border-color:${p.border};`);
  box.innerHTML = `${icons[type] || icons.info}<span>${message}</span>`;
  box.classList.remove('hidden'); // make the alert visible

  // Auto-hide after 3.5 seconds
  // clearTimeout cancels any previous timer so alerts don't stack
  if (alertTimer) clearTimeout(alertTimer);
  alertTimer = setTimeout(() => box.classList.add('hidden'), 3500);
}

// ─────────────────────────────────────────────────────────────
// CARD CLICK DELEGATION
// Instead of adding a click listener to every single button,
// we add ONE listener to the parent container.
// When any button inside is clicked, the event "bubbles up"
// to the container, and we check which button was clicked.
//
// This is called "event delegation" — it's more efficient
// because we only have one listener instead of dozens.
//
// HOW IT IDENTIFIES WHICH BUTTON WAS CLICKED:
//   e.target.closest('button') → finds the nearest button ancestor
//   btn.dataset.id             → reads the event ID stored on the button
//   btn.classList.contains()   → checks if it's a register or cancel button
// ─────────────────────────────────────────────────────────────
function attachCardListeners() {
  document.getElementById('events-container').addEventListener('click', e => {
    // Find the button that was clicked (or a parent button if an icon was clicked)
    const btn = e.target.closest('button');
    if (!btn) return; // click was not on a button → ignore

    // Read the event ID from the button's data-id attribute
    const id = parseInt(btn.dataset.id, 10);
    if (isNaN(id)) return; // no valid ID found → ignore

    // Register button clicked (and not disabled)
    if (btn.classList.contains('register-btn')) {
      if (!btn.disabled) registerForEvent(id);
      return;
    }

    // Cancel button clicked — always allow, handler shows confirm or error
    if (btn.classList.contains('cancel-btn')) {
      cancelRegistration(id);
    }
  });
}

// ─────────────────────────────────────────────────────────────
// DARK LIGHT MODE
// Handles switching between dark mode and light mode.
// The preference is saved in localStorage so it persists
// after the page is refreshed.
//
// HOW IT WORKS:
//   - applyTheme('dark')  → removes 'light' class from <html>
//   - applyTheme('light') → adds 'light' class to <html>
//   - CSS variables in style.css change based on html.light class
//   - Moon icon shown in dark mode, Sun icon shown in light mode
// ─────────────────────────────────────────────────────────────
function initDarkMode() {
  // Load saved theme preference, default to 'dark' if nothing saved
  const saved = localStorage.getItem('eduevents_theme') || 'dark';
  applyTheme(saved);

  // Wire up the toggle buttons (desktop and mobile versions)
  document.getElementById('mode-toggle')?.addEventListener('click', toggleTheme);
  document.getElementById('mode-toggle-mobile')?.addEventListener('click', toggleTheme);
}

function toggleTheme() {
  // Check current mode and switch to the opposite
  const isLight = document.documentElement.classList.contains('light');
  applyTheme(isLight ? 'dark' : 'light');
}

function applyTheme(theme) {
  const html    = document.documentElement; // the <html> element
  const isLight = theme === 'light';

  // Add or remove the 'light' class on <html>
  // CSS in style.css uses html.light { } to change all colors
  html.classList.toggle('light', isLight);

  // Swap the moon/sun icons on the desktop toggle button
  document.getElementById('icon-moon')?.classList.toggle('hidden',  isLight);  // hide moon in light mode
  document.getElementById('icon-sun')?.classList.toggle('hidden',  !isLight);  // show sun in light mode

  // Swap the moon/sun icons on the mobile toggle button
  document.getElementById('icon-moon-m')?.classList.toggle('hidden',  isLight);
  document.getElementById('icon-sun-m')?.classList.toggle('hidden',  !isLight);

  // Save the preference so it's remembered after refresh
  localStorage.setItem('eduevents_theme', theme);
}

// ─────────────────────────────────────────────────────────────
// MOBILE MENU
// Handles opening and closing the hamburger dropdown menu
// on small screens (below the md breakpoint = 768px).
//
// HOW IT WORKS:
//   - Clicking the hamburger button toggles the 'hidden' class
//     on the dropdown menu div
//   - The open/close icons swap when the menu opens/closes
//   - Clicking any link inside the menu closes it automatically
// ─────────────────────────────────────────────────────────────
function attachMobileMenu() {
  const btn       = document.getElementById('ham-btn');    // hamburger button
  const menu      = document.getElementById('mob-menu');   // dropdown menu div
  const iconOpen  = document.getElementById('ham-open');   // ☰ icon
  const iconClose = document.getElementById('ham-close');  // ✕ icon

  if (!btn || !menu) return; // safety check: stop if elements not found

  btn.addEventListener('click', () => {
    // Toggle the menu: if hidden → show, if shown → hide
    const nowHidden = menu.classList.toggle('hidden');

    // Swap icons: show ✕ when open, show ☰ when closed
    iconOpen?.classList.toggle('hidden',  !nowHidden);
    iconClose?.classList.toggle('hidden',  nowHidden);

    // Update aria-expanded for accessibility
    btn.setAttribute('aria-expanded', String(!nowHidden));
  });

  // Close the menu automatically when any nav link is tapped
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.add('hidden');       // hide the menu
      iconOpen?.classList.remove('hidden');  // show ☰
      iconClose?.classList.add('hidden');    // hide ✕
      btn.setAttribute('aria-expanded', 'false');
    });
  });
}

// ─────────────────────────────────────────────────────────────
// INIT
// This is the entry point — everything starts here.
// Called once when the page finishes loading (DOMContentLoaded).
//
// ORDER OF OPERATIONS:
//   1. Try to load saved events from localStorage
//   2. If nothing saved, load the DEFAULT_EVENTS instead
//   3. Render all event cards on screen
//   4. Attach the card click listener (Register / Cancel)
//   5. Attach the mobile menu toggle
//   6. Apply the saved dark/light mode preference
//   7. Attach the Add Event form submit listener
//   8. Attach the search input listeners (desktop + mobile)
// ─────────────────────────────────────────────────────────────
function init() {
  // Step 1 & 2: Load from storage or use defaults
  if (!loadFromStorage()) {
    // localStorage was empty → use the DEFAULT_EVENTS array
    // map() creates a shallow copy of each event object (so originals stay unchanged)
    events = DEFAULT_EVENTS.map(e => ({ ...e }));
    nextId = events.length + 1; // start nextId after the last default event
    saveToStorage(); // save defaults to localStorage for next time
  }

  // Step 3: Draw all event cards on screen
  renderEvents();

  // Step 4: Set up the Register/Cancel button click handler
  attachCardListeners();

  // Step 5: Set up the hamburger menu toggle
  attachMobileMenu();

  // Step 6: Apply saved dark/light mode
  initDarkMode();

  // Step 7: Listen for the Add Event form submission
  document.getElementById('add-event-form').addEventListener('submit', handleAddEvent);

  // Step 8: Listen for typing in the search boxes
  const desktopSearch = document.getElementById('search-desktop');
  const mobileSearch  = document.getElementById('search-mobile');
  if (desktopSearch) desktopSearch.addEventListener('input', handleSearch);
  if (mobileSearch)  mobileSearch.addEventListener('input',  handleSearch);
}

// ─────────────────────────────────────────────────────────────
// BOOTSTRAP
// DOMContentLoaded fires when the HTML is fully parsed and ready.
// We wait for this before calling init() so that all the
// getElementById() calls inside init() can find their elements.
// ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
