import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, orderBy, query, limit, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('js-ready');
    


    // 3. Character-Staggered Text Reveal
    function splitText(element) {
        const text = element.innerText;
        element.innerHTML = '';
        text.split('').forEach((char, i) => {
            const span = document.createElement('span');
            span.innerText = char === ' ' ? '\u00A0' : char;
            span.style.transitionDelay = `${i * 0.03}s`;
            span.classList.add('char');
            element.appendChild(span);
        });
    }

    const revealTitles = document.querySelectorAll('.reveal');
    revealTitles.forEach(title => {
        splitText(title);
        setTimeout(() => title.classList.add('active'), 100);
    });

    // 4. Interaction Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => scrollObserver.observe(el));

    // 5. Navbar progressive blur
    const nav = document.querySelector('.glass-nav');
    const navLogo = document.getElementById('nav-logo');
    function updateNav() {
        const scrollPercent = Math.min(window.scrollY / 400, 1);
        if (nav) {
            nav.style.backdropFilter = `blur(${8 + scrollPercent * 4}px)`;
            nav.style.background = `rgba(10, 12, 16, ${0.1 + scrollPercent * 0.75})`;
            nav.style.padding = `${2.5 - scrollPercent * 1.0}rem 0`;
            nav.style.borderBottomColor = `rgba(255, 255, 255, ${scrollPercent * 0.05})`;
        }
        if (navLogo) {
            if (window.scrollY > window.innerHeight * 0.4) {
                navLogo.style.opacity = '1';
                navLogo.style.pointerEvents = 'auto';
            } else {
                navLogo.style.opacity = '0';
                navLogo.style.pointerEvents = 'none';
            }
        }
    }
    window.addEventListener('scroll', updateNav);
    updateNav(); // Init immediately

    // 6. Gallery Parallax & Injection
    const galleryContainer = document.getElementById('gallery-container');
    if (galleryContainer) {
        const galleryData = [
            { src: "image_01_newborn_god_fantasy_1772342846066.png", title: "Vigil of the Unspoken Genesis", desc: "Suspended within a penumbral hush, the radiant core pulses with the weight of unspent universes, held captive by the desperate choreography of reaching hands. This is the moment before ascension—a collective vigil where the mortal world brushes against the terrifying threshold of the divine." },
            { src: "image_02_singing_wall_fantasy_1772342753149.png", title: "Indifference to Red", desc: "A wide shot of a medical corridor pulsing in frantic red strobe lights, while the subject's chamber remains a cool, indifferent purple—a sanctuary of stillness in a world of rhythmic alarm." },
            { src: "image_03_crown_of_whispers_fantasy_1772342768249.png", title: "Sovereignty of the Gossamer Mind", desc: "A jagged halo of crystalline thought ascends, claiming a throne built of ancient, echoing secrets. The flickering light catches the edges of a consciousness finally breaking its mortal chains to embrace a cold, royal clarity." },
            { src: "image_04_one_way_kingdom_fantasy_1772342781286.png", title: "Threshold of the Irreversible", desc: "A vast, monochromatic landscape stretches toward a horizon that promises no return, guarded by the silent sentinels of memory. Here, the soul stands before a kingdom of light, weighing the burden of a journey that demands the final sacrifice of the past." },
            { src: "image_05_stolen_fluid_1772342026464.png", title: "Stained Terror", desc: "A close-up of the mirrored glass from the outside, showing the fog of a person's breath as they press their face against it in fear—a visceral portrait of the thin barrier between safety and the unknown." },
            { src: "image_06_tear_never_lands_fantasy_1772342813076.png", title: "The Liturgy of the Burning Sky", desc: "The atmosphere itself catches fire in a grand, orange-hued liturgy of abandonment, as a thousand suns bleed into the clouds. Each streak is a signature of escape, leaving behind a world that is now only a memory of warmth." },
            { src: "image_07_silent_panic_fantasy_1772342954963.png", title: "Cacophony of the Soundless Glass", desc: "The frame captures a frantic, desperate humanity pressed against the invisible barriers of their own making, their screams swallowed by an indifferent silence. It is a chilling study of isolation, where the visual roar of terror is rendered mute by the clinical perfection of the divide." },
            { src: "image_08_thousand_burning_farewells_fantasy_1772342968585.png", title: "The Pyres of Departure", desc: "The atmosphere itself catches fire in a grand, orange-hued liturgy of abandonment, as a thousand suns bleed into the clouds. Each streak is a signature of escape, leaving behind a world that is now only a memory of warmth." },
            { src: "image_09_blue_annunciation_fantasy_1772364584377.png", title: "Gospel of the Sapphire Intrusion", desc: "A terrifying, vertical descent of sapphire light pierces the heart of the medical center, a divine intrusion into the realm of the calculated. This is the annunciation of the impossible—a shattering of mirrors that signals a new truth." },
            { src: "image_10_first_sensation_fantasy_1772364597233.png", title: "The Braille of Awakening", desc: "Here, the biological map of the skin becomes a landscape of tactile revelation, as the first touch of the beyond ripples through the nerves. It is the moment the body recognizes it is no longer alone in the dark." },
            { src: "image_11_prismatic_ceiling_fantasy_1772364759365.png", title: "Refractions of the Infinite", desc: "Through a ceiling of rigid logic, we catch the refracted light of an infinite, uncontained joy. The prisms of the mind break the white light of existence into a thousand vibrant possibilities, each one a different dream of being whole." },
            { src: "image_12_laughing_wind_fantasy_1772364775764.png", title: "The Ghost of an Ancient Joy", desc: "The air itself becomes a medium for memory, carrying the swirling, sun-drenched echoes of a laugh that predates the silence. It is a portrait of a presence felt but unseen, a kinetic ghost inhabiting the empty spaces of the heart." },
            { src: "image_13_beacon_test_1772342597508.png", title: "Vigil of the Last Ember", desc: "At the center of a bottomless volcanic silence, a single crystal spire holds the golden line against the encroaching dark. It is the ultimate vigil—a solitary, golden obelisk that refuses to let the night claim the summit of the soul." },
            { src: "image_14_mud_fingernails_fantasy_1772364817303.png", title: "Sacrament of the Grit", desc: "The divine is not found in the clouds, but in the dirt beneath the fingernails and the sweat of the survivor's brow. This is the sacrament of the struggle—a portrait of the physical cost required to reach the threshold of the stars." },
            { src: "image_15_the_maw_fantasy_1772364829439.png", title: "The Threshold of the Devouring", desc: "The survivor crawls through the ashy remnants of a world toward the gaping maw of the abyss, where fire and shadow become one. It is a study of inevitable descent into the throat of the infinite." },
            { src: "image_16_grasmere_test_1772342287261.png", title: "The Grey Magnificence", desc: "The Grasmere Palace emerges from the haze, a stone monument to a thinly veiled magnificence. It is a structure built of weathered grief and ancient stone, rising like a cold prayer from the surface of a dying world." },
            { src: "image_16_the_two_eyes_fantasy_1772365030402.png", title: "The Symbiotic Gaze", desc: "Two windows, etched with the geometry of forgotten gods, watch the slow decay of the world from behind a weathered stone mask. They are the eyes of a palace that has forgotten how to sleep." },
            { src: "image_17_giants_geometry_fantasy_1772365050612.png", title: "The Ruins of a Living God", desc: "The divine body is no longer a whole, but a series of monumental fractures—a fallen geometry that marks the place where a god once stood. We wander through the ruined architecture of a soul." },
            { src: "image_18_word_made_floor_fantasy_1772365062851.png", title: "The Lexicon of Ascension", desc: "Every step upward is a word deciphered, a marble staircase built from the literal language of the creators. To ascend is to read the floor beneath your feet, turning the act of climbing into a long, difficult poem." },
            { src: "image_19_sentient_corridor_fantasy_1772365076711.png", title: "The Neural Hall of Light", desc: "The corridor is not merely a path, but a living nerve, pulsing with the white vines of a ship's sentience. As we walk, we are felt by the architecture itself—a rhythmic illumination that maps the survivor's presence." },
            { src: "image_20_neural_vines_fantasy_1772365089719.png", title: "The Fabric of Cosmic Memory", desc: "A bioluminescent tapestry of neural vines weaves through the void, carrying the electric pulse of a thousand-year history. It is the living internet of the gods, where every node is a memory." },
            { src: "image_21_warm_words_fantasy_1772365101680.png", title: "The Radiance of the Deciphered", desc: "The cold stone is warmed by the very language it carries—a golden heat that bleeds from the inscriptions as they are understood. It is a reminder that truth is not just seen, but felt, a comforting fire ignited by recognition." },
            { src: "image_22_five_pillars_fantasy_1772365299234.png", title: "The Pantheon of the Obscured", desc: "Five plinths wait in a marble hall of light, their inhabitants hidden by the rotating breath of a localized fog. We stand before the gods we cannot see, offering our presence to the shadows of those who have forgotten us." },
            { src: "image_23_eyes_that_breathe_fantasy_1772365317134.png", title: "The Sculpture of Eternal Agony", desc: "Lord Bil-by is carved from the color of pain, a deep red stone that thrums with a restless energy. His glaring eyes are the only part of him left unarmored—a window into a torment that stone was never meant to hold." },
            { src: "image_24_paradox_prison_fantasy_1772365332567.png", title: "The Dissolution of the Self", desc: "The features of the man are surrendered to the roar of the machine, a paradox of orange fire and red energy that dissolves the ego into a blur. In this prison of light, the self is no longer a boundary, but a frequency." },
            { src: "image_25_invisible_assault_fantasy_1772365348967.png", title: "The Anatomy of a Neural Storm", desc: "The assault is invisible, felt only as a shattering of the internal geometry and a storm of light across the mind's eye. It is the visual record of a soul being unmade, a chaotic ballet of shadows where the only casualty is the past." },
            { src: "image_26_face_stone_1772386083269.png", title: "The Mirror of the Running Lord", desc: "The seeker meets his own stone image, frozen in mid-sprint toward a blue sphere of flickering specks. It is a chilling mirror—a recursive loop of desire and stasis where the athlete is both the runner and the finish line." },
            { src: "image_27_unreachable_sphere_1772386111608.png", title: "The Core of the Lost Horizon", desc: "The blue sphere drifts within a void of Logistan dark, carrying the flickering specks of a million potential dawns. It is the ultimate prize—the core of a memory so vast it can only be touched by those who have surrendered their shadow." },
            { src: "image_28_three_dawns_1772386374385.png", title: "The Dreamer of the Triple Sky", desc: "Cappa lies dwarfed by jagged boulders beneath a tri-colored heavens. Above him, cyan, purple, and green suns collide in a sky that has forgotten how to be night, watching over a dreamer who has forgotten how to wake." },
            { src: "image_29_palace_rises_1772386388094.png", title: "The Citadel of the Silver Mist", desc: "The Grasmere Palace emerges from the haze, a stone monument to a thinly veiled magnificence. It is a structure built of weathered grief and ancient stone, rising like a cold prayer from the surface of a dying world." },
            { src: "image_30_immortals_landing_1772386410040.png", title: "Reflections on the Event Horizon", desc: "Captain Aluz's reflection is caught in the cold glow of the monitor as the divine pod enters the ship's maw. It is a final watch over the moment the world's weight shifted forever, caught between curiosity and dread." }
        ];

        let galleryHTML = '';
        galleryData.forEach((item, index) => {
            galleryHTML += `
                <div class="gallery-item animate-on-scroll reveal-blur">
                    <img src="assets/Final Conceptual Images/${item.src}" 
                         class="parallax-img" 
                         loading="lazy" 
                         alt="${item.title}">
                    <div class="gallery-overlay"></div>
                </div>
            `;
        });
        galleryContainer.innerHTML = galleryHTML;
        
        const viewerImg = document.getElementById('viewer-img');
        const archiveId = document.getElementById('archive-id');
        const observationTitle = document.getElementById('observation-title');
        const observationText = document.getElementById('observation-text');
        const galleryItems = document.querySelectorAll('.gallery-item');

        let typeInterval;

        function typeWriter(element, text) {
            clearInterval(typeInterval);
            element.innerHTML = '';
            let i = 0;
            typeInterval = setInterval(() => {
                if (i < text.length) {
                    element.innerHTML += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typeInterval);
                }
            }, 10);
        }

        function updateViewer(index) {
            const data = galleryData[index];
            if (!viewerImg || !data) return;

            // Start swap animation
            viewerImg.classList.add('swapping');

            setTimeout(() => {
                viewerImg.src = `assets/Final Conceptual Images/${data.src}`;
                viewerImg.alt = data.title;
                if (archiveId) archiveId.innerText = `ARC_${(index + 1).toString().padStart(2, '0')}`;
                
                // Update text content
                if (observationTitle) observationTitle.innerText = data.title;
                if (observationText) typeWriter(observationText, data.desc);

                // End swap animation
                viewerImg.classList.remove('swapping');

                // Update active state in grid
                galleryItems.forEach((item, i) => {
                    if (i === index) item.classList.add('active-thumbnail');
                    else item.classList.remove('active-thumbnail');
                });
            }, 300);
        }

        // Initialize with first image
        updateViewer(0);

        // Add click events to thumbnails
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                updateViewer(index);
                // Smooth scroll to viewer on mobile (when stacked)
                if (window.innerWidth < 1100) {
                    document.getElementById('main-viewer').scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
        });
        
        // Parallax effect removed for museum-grade stability

        galleryItems.forEach(el => scrollObserver.observe(el));
    }

    // 7. Hamburger Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('open');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });
    }

});

// ===== FIREBASE BLOG LOADER & JOURNAL INTERFACE =====
// Firebase Configuration is already handled or below

const firebaseConfig = {
    apiKey: "AIzaSyAZI6Gbesc4U6d0oU4Us1HT0pK6Z6_m1UU",
    authDomain: "grayson-cdc2e.firebaseapp.com",
    projectId: "grayson-cdc2e",
    storageBucket: "grayson-cdc2e.firebasestorage.app",
    messagingSenderId: "862954707657",
    appId: "1:862954707657:web:8a880e5a039fad95888b18",
    measurementId: "G-T8B1VDZ77S"
};

const FALLBACK_POSTS = [
    {
        title: "The Sterile Edge: Redefining Design for 2026",
        category: "Art Direction",
        excerpt: "Exploring the boundary between clinical precision and literary warmth in modern digital interfaces.",
        content: "Design in 2026 is moving away from the loud and chaotic. We are entering an era of 'The Sterile Edge'—where high-contrast, monochromatic layouts meet high-fidelity micro-interactions.",
        imageUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800",
        createdAt: { toDate: () => new Date(2026, 3, 11) }
    },
    {
        title: "South London Noir: A Poet's Field Guide",
        category: "Reflections",
        excerpt: "Walking the rain-slicked streets of Brixton and Peckham in search of the perfect line.",
        content: "South London isn't just a place; it's a cadence. It's the rhythm of the Overground and the low hum of nighttime sirens.",
        imageUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=800",
        createdAt: { toDate: () => new Date(2026, 3, 8) }
    },
    {
        title: "Body as Prison: The Full Lyric Essay",
        category: "Literature",
        excerpt: "An exploration of confinement, physicality, and the liberation found within the written word.",
        content: "If the body is a prison, the mind is its most prolific inmate. We spend our lives testing the bars, mapping the shadows of our own skin.",
        imageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800",
        createdAt: { toDate: () => new Date(2026, 2, 25) }
    },
    {
        title: "Fragments of a Dying Sun",
        category: "Poetry",
        excerpt: "Recent verses exploring entropy, memory, and the cold light of the future.",
        content: "The light comes in slices now / thin and sharp like a clinical knife / We are keepers of the glow.",
        imageUrl: "https://images.unsplash.com/photo-1506466010722-395aa2bef877?auto=format&fit=crop&q=80&w=800",
        createdAt: { toDate: () => new Date(2026, 2, 12) }
    },
    {
        title: "On the Book Edit Writers’ Prize 2025",
        category: "News",
        excerpt: "A personal reflection on the recent honor and what it means for the next chapter of 'Until Time Runs Out'.",
        content: "Winning the Book Edit Writers' Prize 2025 was a moment of profound clarity. After twenty years of writing, this recognition feels less like a finish line and more like a gateway.",
        imageUrl: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80&w=800",
        createdAt: { toDate: () => new Date(2026, 1, 28) }
    }
];

class JournalInterface {
    constructor() {
        this.posts = [];
        this.db = null;
        this.currentDate = new Date();
        // filterMode: 'today' | 'month' | 'day'
        this.filterMode = 'today';
        this.selectedDate = null; // 'YYYY-MM-DD'
        this.isAuth = false;

        this.els = {
            grid: document.getElementById('blog-container'),
            calendarSidebar: document.getElementById('calendar-panel')
        };

        if (this.els.grid) this.init();
    }

    rebindCalendarElements() {
        this.els.calendarGrid = document.getElementById('calendar-grid');
        this.els.monthDisplay = document.getElementById('current-month-display');
        this.els.prevMonth = document.getElementById('prev-month');
        this.els.nextMonth = document.getElementById('next-month');
        this.els.viewAllMonth = document.getElementById('view-all-month');
        this.els.resetFilter = document.getElementById('reset-filter');
    }

    initializeFirebase() {
        if (typeof firebaseConfig === 'undefined' || firebaseConfig.projectId === "YOUR_PROJECT_ID") return;
        try {
            const app = initializeApp(firebaseConfig);
            this.db = getFirestore(app);
        } catch (e) {
            console.error("Firebase Error //", e);
        }
    }

    async init() {
        this.initializeFirebase();
        await this.fetchPosts();

        this.renderCalendarFrame(); 
        this.renderCalendar();      
        this.filterAndRender();
        this.bindEvents(); 
    }

    // Converts a Date to 'YYYY-MM-DD' in LOCAL time (not UTC)
    toLocalDateStr(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    async fetchPosts() {
        if (!this.db) {
            this.posts = FALLBACK_POSTS;
            return;
        }

        try {
            const q = query(collection(this.db, "blog_posts"), orderBy("createdAt", "desc"), limit(50));
            
            const querySnapshot = await getDocs(q);
            this.posts = [];
            querySnapshot.forEach(doc => this.posts.push({ id: doc.id, ...doc.data() }));
            
            if (this.posts.length === 0) this.posts = FALLBACK_POSTS;
        } catch (err) {
            console.warn("Transmission interrupted, using fallback archival data:", err);
            this.posts = FALLBACK_POSTS;
        }
    }

    renderCalendarFrame() {
        if (!this.els.calendarSidebar) return;
        
        this.els.calendarSidebar.innerHTML = `
            <div class="calendar-nav">
                <button id="prev-month" class="cal-btn" style="background:none; border:none; color:inherit; cursor:pointer;"><i class='bx bx-chevron-left'></i></button>
                <span id="current-month-display" class="month-label">---</span>
                <button id="next-month" class="cal-btn" style="background:none; border:none; color:inherit; cursor:pointer;"><i class='bx bx-chevron-right'></i></button>
            </div>
            <div id="calendar-grid" class="calendar-grid"></div>
            <div class="calendar-actions" style="margin-top:25px; display:flex; gap:15px; border-top:1px solid rgba(255,255,255,0.05); padding-top:15px;">
                <button id="view-all-month" style="background:none; border:none; color:var(--clr-accent); font-family:var(--font-mono); font-size:0.6rem; letter-spacing:1px; cursor:pointer; font-weight:700;">VIEW ALL</button>
                <button id="reset-filter" style="background:none; border:none; color:rgba(255,255,255,0.3); font-family:var(--font-mono); font-size:0.6rem; letter-spacing:1px; cursor:pointer;">RESET</button>
            </div>
        `;
        this.rebindCalendarElements();
        // Bind nav events ONCE here — never inside renderCalendar
        this.bindCalendarNavEvents();
    }

    bindCalendarNavEvents() {
        this.els.prevMonth?.addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.filterMode = 'month';
            this.selectedDate = null;
            this.renderCalendar();
            this.filterAndRender();
        });
        this.els.nextMonth?.addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.filterMode = 'month';
            this.selectedDate = null;
            this.renderCalendar();
            this.filterAndRender();
        });
        // VIEW ALL: show every post in the currently displayed month
        this.els.viewAllMonth?.addEventListener('click', () => {
            this.filterMode = 'month';
            this.selectedDate = null;
            this.renderCalendar();
            this.filterAndRender();
        });
        // RESET: return to today and show only today's posts
        this.els.resetFilter?.addEventListener('click', () => {
            this.currentDate = new Date();
            this.filterMode = 'today';
            this.selectedDate = null;
            this.renderCalendar();
            this.filterAndRender();
        });
    }

    renderCalendar() {
        if (!this.els.calendarGrid) return;

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        if (this.els.monthDisplay) {
            this.els.monthDisplay.innerText = this.currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        }
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        let html = '';
        const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        days.forEach(d => html += `<div class="cal-day-label" style="font-size:0.6rem; opacity:0.3; margin-bottom:5px; font-family:var(--font-mono);">${d}</div>`);

        for (let i = 0; i < firstDay; i++) html += '<div class="cal-day empty"></div>';
        
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const hasPosts = this.posts.some(p => {
                const d = p.createdAt?.toDate ? p.createdAt.toDate() : new Date(p.createdAt);
                // Use local date comparison to avoid UTC timezone shift
                return this.toLocalDateStr(d) === dateStr;
            });
            const isSelected = this.selectedDate === dateStr;
            
            html += `<div class="cal-day ${hasPosts ? 'has-posts' : ''} ${isSelected ? 'selected' : ''}" data-date="${dateStr}">${day}</div>`;
        }
        
        this.els.calendarGrid.innerHTML = html;
        
        // Day clicks — mode switches to 'day'
        this.els.calendarGrid.querySelectorAll('.cal-day:not(.empty)').forEach(el => {
            el.addEventListener('click', (e) => {
                this.selectedDate = e.target.dataset.date;
                this.filterMode = 'day';
                this.renderCalendar();
                this.filterAndRender();
            });
        });
        // Note: nav button events are bound ONCE in bindCalendarNavEvents()
    }

    filterAndRender() {
        let filtered = [...this.posts];
        
        if (this.filterMode === 'day' && this.selectedDate) {
            // Show only posts on the exact selected date (local time)
            filtered = filtered.filter(p => {
                const d = p.createdAt?.toDate ? p.createdAt.toDate() : new Date(p.createdAt);
                return this.toLocalDateStr(d) === this.selectedDate;
            });
        } else if (this.filterMode === 'month') {
            // Show all posts for the displayed month
            const year = this.currentDate.getFullYear();
            const month = this.currentDate.getMonth();
            filtered = filtered.filter(p => {
                const d = p.createdAt?.toDate ? p.createdAt.toDate() : new Date(p.createdAt);
                return d.getFullYear() === year && d.getMonth() === month;
            });
        } else {
            // 'today' — default mode; only show today's posts
            const todayStr = this.toLocalDateStr(new Date());
            filtered = filtered.filter(p => {
                const d = p.createdAt?.toDate ? p.createdAt.toDate() : new Date(p.createdAt);
                return this.toLocalDateStr(d) === todayStr;
            });
        }
        
        this.renderPosts(filtered);
    }

    renderPosts(posts) {
        if (!this.els.grid) return;
        let html = '';

        // 1. Render Archival Output Boxes (Now Fully 3D Interactive)
        posts.forEach((post) => {
            const dateStr = post.createdAt?.toDate
                ? post.createdAt.toDate().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                : 'Archive // Sync';

            const mediaContent = post.imageUrl 
                ? `<div class="elite-card-media" style="background-image: url('${post.imageUrl}'); background-size: cover; background-position: center;"></div>`
                : `<div class="elite-card-media"><blockquote>"${post.excerpt ? post.excerpt.substring(0, 60) : 'Archive Sync'}..."</blockquote></div>`;

            html += `
                <article class="elite-card animate-on-scroll">
                    <div class="flip-card-inner">
                        <div class="card-front">
                            ${mediaContent}
                            <div class="elite-card-info">
                                <div class="elite-meta-row">
                                    <span class="elite-badge">${post.category || 'Log'}</span>
                                    <span class="elite-date">${dateStr}</span>
                                </div>
                                <h3 class="elite-title">${post.title || 'Untitled Transmission'}</h3>
                                <p class="elite-content">${post.excerpt || post.content?.substring(0, 100) + '...' || ''}</p>
                                <span class="read-more-trigger">Read More <i class='bx bx-right-arrow-alt'></i></span>
                            </div>
                        </div>
                        
                        <div class="card-back">
                            <h3 style="font-family: var(--font-mono); font-size: 0.7rem; color: #ff3b30; letter-spacing: 1px; padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 15px; text-transform: uppercase;">
                                // ${post.title || 'READOUT'}
                            </h3>
                            
                            <div class="full-content-scroll" onclick="event.stopPropagation()">
                                ${post.content || post.excerpt || 'No additional data available.'}
                            </div>
                            
                            <button class="btn-terminal small close-flip-btn" style="width: 100%; margin-top: auto; border-color: rgba(255, 59, 48, 0.4); color: rgba(255, 255, 255, 0.7);">Close Readout</button>
                        </div>
                    </div>
                </article>`;
        });

        // 2. Render The Input Box (Synchronized with Output Structure)
        // 3D Flip Terminal — Ultra Minimal Front
        html += `
            <div class="elite-card input-card animate-on-scroll" id="new-entry-card">
                <div class="flip-card-inner">
                    <div class="card-front new-entry-front">
                        <i class='bx bx-plus-circle'></i>
                        <h3>Add New Entry</h3>
                    </div>
                    
                    <div class="card-back">
                        <span class="new-badge">// TERMINAL_ACTIVE</span>
                        
                        <input type="text" id="grid-entry-category" class="ghost-field" placeholder="GENRE // CATEGORY" onclick="event.stopPropagation()">
                        <input type="text" id="grid-entry-image" class="ghost-field" placeholder="MEDIA // IMAGE URL" onclick="event.stopPropagation()">
                        <input type="text" id="grid-entry-title" class="ghost-field" placeholder="ID // TITLE" onclick="event.stopPropagation()">
                        
                        <textarea id="grid-entry-message" class="ghost-field" placeholder="TRANSMIT // MESSAGE" style="resize:none;" onclick="event.stopPropagation()"></textarea>
                        
                        <div style="display:flex; gap: 10px; margin-top: auto;">
                            <button class="btn-terminal small btn-cancel close-flip-btn" style="flex: 1;" onclick="event.stopPropagation()">Cancel</button>
                            <button id="grid-dispatch-btn" class="btn-terminal small" style="flex: 1;" onclick="event.stopPropagation()">Confirm</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.els.grid.innerHTML = html;

        // 3. Bind Universal Flip Logic for ALL cards
        document.querySelectorAll('.elite-card').forEach(card => {
            // Flip on card click (ignoring inner inputs/buttons)
            card.addEventListener('click', (e) => {
                if (e.target.tagName.toLowerCase() === 'input' || 
                    e.target.tagName.toLowerCase() === 'textarea' || 
                    e.target.classList.contains('full-content-scroll')) return;
                card.classList.toggle('flipped');
            });
            
            // Explicit close button binding
            const closeBtn = card.querySelector('.close-flip-btn');
            if(closeBtn) {
                closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    card.classList.remove('flipped');
                });
            }
        });

        // 4. Bind Upgraded Dispatch Logic
        const dispatchBtn = document.getElementById('grid-dispatch-btn');
        dispatchBtn?.addEventListener('click', async (e) => {
            e.stopPropagation();
            const titleField = document.getElementById('grid-entry-title');
            const categoryField = document.getElementById('grid-entry-category');
            const imageField = document.getElementById('grid-entry-image');
            const messageField = document.getElementById('grid-entry-message');

            if (!titleField.value || !messageField.value) {
                alert("TRANSMISSION ERROR: Identification and Message properties are required.");
                return;
            }

            dispatchBtn.innerText = "SYNCING...";
            dispatchBtn.disabled = true;

            try {
                await addDoc(collection(this.db, "blog_posts"), {
                    title: titleField.value,
                    category: categoryField.value || "Log",
                    imageUrl: imageField.value || "",
                    content: messageField.value,
                    excerpt: messageField.value.substring(0, 80) + '...',
                    createdAt: serverTimestamp()
                });

                // Clear & Refresh
                titleField.value = '';
                categoryField.value = '';
                imageField.value = '';
                messageField.value = '';
                
                this.filterMode = 'today';
                this.selectedDate = null;
                await this.fetchPosts();
                this.renderCalendar();
                this.filterAndRender();

            } catch (err) {
                console.error("Transmission failed", err);
                alert("TRANSMISSION FAILED: " + err.message);
                dispatchBtn.innerText = "Confirm";
                dispatchBtn.disabled = false;
            }
        });

        // Scroll animations
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('active'); observer.unobserve(e.target); } });
            }, { threshold: 0.1 });
            observer.observe(el);
        });
    }
}

// Initialize the interface
new JournalInterface();
