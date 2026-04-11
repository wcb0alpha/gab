# Grayson Anderson Brown: Design System
**Project Identity: "Cinematic Transmission" / "The Editorial Archive"**

This document establishes the visual and architectural standards for the Grayson portfolio, ensuring all future sections maintain the bespoke, high-end literary aesthetic.

---

## 🎨 Design Philosophy
The site is built as a **Digital Archive of Transmissions**. It eschews generic "blog" patterns in favor of clinical precision mixed with moody, cinematic lighting. It emphasizes archival discipline, high-contrast red accents, and sophisticated typographic layering.

---

## 🖤 Color Palette
| Token | Hex | Name | Usage |
| :--- | :--- | :--- | :--- |
| `--clr-bg` | `#030508` | Deep Black Glass | Primary page backgrounds, deep shadows. |
| `--clr-surface`| `#0e1520` | Cold Steel | Secondary layers, card backgrounds. |
| `--clr-accent` | `#ef4444` | Alarm Red Strobe | High-contrast actions, focus points, pills. |
| `--clr-text` | `#ffffff` | Clinical White | Primary body copy and headers. |
| `--clr-muted` | `#7f95ac` | Muted Cold Blue | Secondary text, inactive states, border hints. |

---

## 🖋️ Typography
The typographic system uses a strict hierarchy to establish "Wayfinding" within the archive.

- **Primary Sans (`Outfit`)**: Used for readability in body copy and modern, sleek headings.
- **Monospace Accent (`Space Mono`)**: Used for metadata, numbers, navigation labels, and "Eyebrow" content to evoke an archival/terminal aesthetic.

### Rules of Usage:
- **Eyebrows**: Always `uppercase`, `monospace`, and `accent red` with `2.5px tracking`. 
- **Quotes**: Displayed with high contrast, italicized for archival transmission logs.
- **Micro-Copy**: Always `Space Mono` at `0.7rem` to `0.8rem`.

---

## 🏛️ Component Architecture

### 1. The Vertical Quote Grid (Journal)
- **Layout**: 4-column responsive grid (`repeat(4, 1fr)` on desktop).
- **Core Unit**: `.journal-card` (Standard height: `580px`).
- **Media Box**: Top-aligned, dark gradient overlay. Prioritizes `imageUrl`; falls back to `blockquote`.
- **Badges**: Solid red "Pill" badges for categories.

### 2. The Archival Workstation
- **Format**: Vertical card matching the Grid.
- **Interaction**: 3D-flip on Y-axis. 
- **Front**: Dashed border with centralized "plus" icon.
- **Back**: Minimalist input fields with cold backgrounds.

### 3. The Split Editorial (Contact)
- **Layout**: Asymmetrical 1:1.2 split.
- **Typographic Weight**: Heavy focus on H2/H3 on the left to balance the minimalist input fields on the right.
- **Inputs**: Floating labels with clinical red focus states.

---

## 🌊 Motion Principles
- **Progressive Blur**: Navigation becomes denser as the user descends into the archive.
- **Staggered Character Reveals**: Headers utilize a character-by-character transformation on entry.
- **Cinematic Overlays**: Global `.grain-overlay` at `0.03 opacity` to add texture and break digital flatness.

---

## ✅ Future Work: Design Checklist
- [ ] Maintain the 4-column grid rhythm.
- [ ] Use signature red (`#ef4444`) only for intent and importance.
- [ ] Ensure all cards have the unified `inset shadow` or `red rim-light`.
- [ ] Keep monospace tracking consistent for wayfinding elements.
