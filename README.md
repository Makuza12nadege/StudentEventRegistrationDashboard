# 🎓 Student Event Registration Dashboard

A fully responsive, dynamic Student Event Registration Dashboard built with **HTML5**, **Tailwind CSS**, and **Vanilla JavaScript**.

---

## 🌐 Live Demo

🔗 [View on GitHub Pages](https://makuza12nadege.github.io/StudentEventRegistrationDashboard/)

---

## 📋 Project Overview

This application allows users to:
- View all available school events
- Register for events (with seat limit enforcement)
- Cancel registrations
- Add new events via a form
- Search/filter events in real time
- See live statistics (total events, registered students, remaining seats)
- All data persists after page refresh using **Local Storage**

---

## 🚀 Features

| Feature | Description |
|---|---|
| 📱 Fully Responsive | Works on mobile phones, tablets, and desktop computers |
| 🎨 Dark Theme UI | Deep slate + violet + emerald colour scheme |
| ➕ Add Events | Form with full validation (title, category, seats) |
| ✅ Register | One-click registration with seat limit check |
| ❌ Cancel | Cancel any registration instantly |
| 🔍 Live Search | Filter events by title or category as you type |
| 📊 Live Statistics | Total events, registered students, remaining seats update in real time |
| 💾 Local Storage | All data saved and restored on page refresh |
| 🍔 Mobile Menu | Hamburger menu with search on small screens |

---

## 🛠️ Technologies Used

- **HTML5** — Semantic structure
- **Tailwind CSS** (CDN) — Utility-first responsive styling
- **Vanilla JavaScript** — All interactivity, no frameworks
- **Local Storage** — Client-side data persistence
- **Google Fonts** — Inter typeface

---

## 📁 Project Structure

```
StudentEventRegistrationDashboard/
├── index.html      # Main HTML structure (navbar, hero, stats, events, form)
├── app.js          # All JavaScript logic
├── style.css       # Custom CSS (gradients, animations, card responsive styles)
└── README.md       # Project documentation
```

---

## 🧠 JavaScript Methods Used

| Method | Purpose |
|---|---|
| `push()` | Add new events to the array |
| `filter()` | Search/filter events |
| `find()` | Locate event by ID for register/cancel |
| `map()` | Convert event objects to card DOM elements |
| `reduce()` | Calculate total registered students and remaining seats |
| `getElementById()` | Access DOM elements |
| `querySelector()` | Select form fields |
| `createElement()` | Build card elements dynamically |
| `appendChild()` | Insert cards into the DOM |
| `innerHTML` | Render card inner content |
| `addEventListener()` | Handle clicks, form submit, search input |
| `forEach()` | Loop through cards and menu links |
| `localStorage.setItem()` + `JSON.stringify()` | Save data |
| `localStorage.getItem()` + `JSON.parse()` | Load data |
| `preventDefault()` | Stop form page reload |
| `value.trim()` | Read and sanitise form inputs |

---

## 📱 Responsive Breakpoints

| Screen | Layout |
|---|---|
| Mobile (< 640px) | Single column, form on top, events below, hamburger menu |
| Tablet (640px–1023px) | 2-column event grid, form full width above events |
| Desktop (1024px+) | Events grid on left, form as sticky sidebar on right |

---

## 🗂️ Git Commit History

1. `Initialize repository and setup basic HTML structure`
2. `Build responsive Navbar and Hero section`
3. `Create Statistics Section with Tailwind CSS`
4. `Design Event Cards and Add Event Form`
5. `Implement JavaScript array and object structure for events`
6. `Add DOM manipulation to dynamically render events`
7. `Implement Register and Cancel functionality`
8. `Add form validation for inputs and seat limits`
9. `Integrate Local Storage for saving and retrieving events`
10. `Final UI polish, responsive improvements and README`

---

## ⚙️ How to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/Makuza12nadege/StudentEventRegistrationDashboard.git
   ```
2. Open `index.html` in any modern browser — no build step needed.

---

## 👤 Author

**Makuza Nadege**  
Frontend Web Development — Student Project 2025
