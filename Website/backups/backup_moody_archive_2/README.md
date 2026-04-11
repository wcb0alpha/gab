# Grayson Anderson Brown - Digital Archive 

A high-end, editorial-grade literary portfolio and archive built with a focus on immersive typography and "Crown of Whispers" branding.

## 🏛 Architecture

- **Core:** Vanilla HTML5, CSS3, and ES6+ JavaScript.
- **Backend:** Firebase (Firestore) for data persistence.
- **Design System:** Bespoke "Crown of Whispers" dark-mode aesthetic featuring high-contrast typography and moody cinematic gradients.

## 🖋 Features

### 1. The Journal (Literary Archive)
- **Dynamic Calendar:** A sophisticated date-based filtering system that allows readers to navigate the archive by day and month.
- **Typographic Hooks:** Posts without images are automatically rendered with elegant, serif-based typographic quotes to maintain the editorial feel.
- **Feature Layering:** A balanced 3-column grid that provides clear visual hierarchy for fictional, journalistic, and poetic entries.
- **Mobile Optimized:** A responsive "Filter by Date" toggle for smaller viewports to prioritize content readability.

### 2. Contributor Portal
- **Flip-Card Submission:** An interactive 3D card integrated into the Journal grid that allows users to submit their own reflections.
- **Moderation Pipeline:** Submissions are sent to a `user_submissions` collection in Firestore with a `pending` status for owner review.

### 3. Admin Portal (`admin.html`)
- **Secure Access:** A hidden administration portal for managing transmissions.
- **Archive Management:** Full CRUD operations for official blog posts, including title, category, content, and date management.

## 🛠 Setup & Development

### Local Server
Run a local static server (e.g., `Serve` or `Live Server`) at the root directory.

### Firebase Integration
The site is pre-configured with the `grayson-cdc2e` project.
- **Blog Posts:** `blog_posts` collection.
- **User Reflections:** `user_submissions` collection.

---
*Created by Antigravity for Grayson Anderson Brown.*
