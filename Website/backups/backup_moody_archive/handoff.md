# Handoff Architecture: Grayson Portfolio Transition
**Recipient:** nanobanana / AI Studio
**Project ID:** Grayson Anderson Brown - Cinematic Literature Archive

This document provides all necessary technical and creative context to continue the development of the Grayson portfolio.

---

## 🚀 Current Technical State
The project has undergone a series of high-fidelity architectural refactors. The current codebase is **locally verified** and operating via a local dev server (default port `3000`).

### 🛠️ Tech Stack
- **Core**: Semantic HTML5 / Vanilla JavaScript (ESM).
- **Styling**: Vanilla CSS3 (Custom Design System).
- **Database**: Firebase Firestore (Direct modular imports).
- **Hosting Target**: Vercel (Current state NOT pushed; local state is ahead).

### 📁 Core File Manifest
- `index.html`: Main structure; uses `main_v2.js` as a module.
- `index.css`: The "Premium Design System" containing 1,600+ lines of bespoke architecture.
- `main_v2.js`: The rendering engine. Handles dynamic Journal grid injection and tool binding.
- `admin.html/js`: Content management portal for archival transmissions.

---

## 🎨 The "Gold Standard" Design System
*See [design.md](file:///c:/Users/wcb0a/OneDrive/Documents/Personal/AI%20Business/Sites/Grayson/Website/design.md) for full specs.*

- **Layout Grid**: 4-column responsive Archival Grid (stable metrics: `580px` card height).
- **Visual Identity**: "Cinematic Transmission". High-contrast red accents (`#ef4444`) against deep dark backgrounds (`#030508`).
- **Contact Layout**: Asymmetrical "Split Editorial" (1:1.2 ratio).

---

## 🧠 Technical Nuances for nanobanana

### 1. Journal Rendering Cache & Logic
The `JournalInterface` class in `main_v2.js` uses a precise slot-injection logic:
- **Index 0**: Always reserved for the **Modular Calendar**.
- **After Latest Post**: Injects the **3D-Flip Workstation**.
- **Media Content**: Prioritizes `imageUrl`. If null, falls back to the typographic `blockquote` pull-quote.

### 2. Firebase Connectivity
Firebase is loaded via CDN ESM imports. The `firebaseConfig` is embedded in `main_v2.js` at line 225. 
> [!IMPORTANT]
> The database target is the `blog_posts` collection. Ensure all future data mutations remain compatible with this schema.

### 3. Motion System
- **Staggered Character Reveals**: Handled via `splitText()` and `reveal` classes.
- **Perspective**: Grid items use `perspective: 2000px` for the 3D interaction engine.

---

## 📍 Pending Tasks & Future Roadmap
1. **Literature Section Refinement**: The "Literature" cards need to be synced with the new vertical grid standards if they aren't already.
2. **Persistence Audit**: Ensure the Firestore seeder is populating the `blog_posts` collection with enough content to test the 4-column rhythm.
3. **Deployment**: Sync the local main/css/index with the Vercel production environment once review is complete.

---

## 📦 Backup Location
A snapshot of the codebase as of April 11 is stored in:
`C:\Users\wcb0a\.gemini\antigravity\brain\19ee5bd0-eb33-4c21-9dd0-1309e85f4073\scratch\backup_2026-04-11\`
