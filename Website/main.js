document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('js-ready');
    
    // 0. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 1. Custom Cursor Tracking
    const cursor = document.getElementById('cursor');
    const strobe = document.getElementById('cursor-strobe');
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Strobe follows mouse instantly
        if (strobe) {
            strobe.style.left = `${mouseX}px`;
            strobe.style.top = `${mouseY}px`;
        }
    });

    // Cursor (outer ring) follows with a slight delay
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        
        if (cursor) {
            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;
        }
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // 2. Cursor Hover Interactions & Magnetic Buttons
    const interactiveElements = document.querySelectorAll('a, button, .service-card, .book-card, .blog-card');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
            if (el.classList.contains('magnetic')) {
                el.style.transform = `translate(0px, 0px)`;
            }
        });

        // Magnetic Effect
        if (el.classList.contains('btn-primary') || el.classList.contains('btn-outline')) {
            el.classList.add('magnetic');
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });
        }
    });

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
    revealTitles.forEach(title => splitText(title));

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
    window.addEventListener('scroll', () => {
        const scrollPercent = Math.min(window.scrollY / 400, 1);
        if (nav) {
            nav.style.backdropFilter = `blur(${12 + scrollPercent * 20}px)`;
            nav.style.background = `rgba(10, 12, 16, ${0.7 + scrollPercent * 0.2})`;
            nav.style.padding = `${1.5 - scrollPercent * 0.5}rem 0`;
        }
    });

    // 6. Gallery Parallax & Injection
    const galleryContainer = document.getElementById('gallery-container');
    if (galleryContainer) {
        const galleryImages = [
            "image_01_newborn_god_fantasy_1772342846066.png",
            "image_02_singing_wall_1772341986211.png",
            "image_02_singing_wall_fantasy_1772342753149.png",
            "image_03_crown_of_whispers_1772342002058.png",
            "image_03_crown_of_whispers_fantasy_1772342768249.png",
            "image_04_one_way_kingdom_1772342014003.png",
            "image_04_one_way_kingdom_fantasy_1772342781286.png",
            "image_05_stolen_fluid_1772342026464.png",
            "image_05_stolen_fluid_fantasy_1772342800013.png",
            "image_06_tear_never_lands_1772342038004.png",
            "image_06_tear_never_lands_fantasy_1772342813076.png",
            "image_07_silent_panic_fantasy_1772342954963.png",
            "image_08_thousand_burning_farewells_fantasy_1772342968585.png",
            "image_09_annunciation_test_1772342609271.png",
            "image_09_blue_annunciation_fantasy_1772364584377.png",
            "image_10_first_sensation_fantasy_1772364597233.png",
            "image_11_prismatic_ceiling_fantasy_1772364759365.png",
            "image_12_laughing_wind_fantasy_1772364775764.png",
            "image_13_beacon_fantasy_1772364789310.png",
            "image_14_mud_fingernails_fantasy_1772364817303.png",
            "image_15_the_maw_fantasy_1772364829439.png",
            "image_16_the_two_eyes_fantasy_1772365030402.png",
            "image_17_giants_geometry_fantasy_1772365050612.png",
            "image_18_word_made_floor_fantasy_1772365062851.png",
            "image_19_sentient_corridor_fantasy_1772365076711.png",
            "image_20_neural_vines_fantasy_1772365089719.png",
            "image_21_warm_words_fantasy_1772365101680.png",
            "image_22_five_pillars_fantasy_1772365299234.png",
            "image_23_eyes_that_breathe_fantasy_1772365317134.png",
            "image_24_paradox_prison_fantasy_1772365332567.png",
            "image_25_invisible_assault_fantasy_1772365348967.png",
            "image_26_face_stone_1772386083269.png",
            "image_27_unreachable_sphere_1772386111608.png",
            "image_28_three_dawns_1772386374385.png",
            "image_29_palace_rises_1772386388094.png",
            "image_30_immortals_landing_1772386410040.png"
        ];

        let galleryHTML = '';
        galleryImages.forEach((img, index) => {
            galleryHTML += `
                <div class="gallery-item animate-on-scroll">
                    <img src="assets/Final Conceptual Images/${img}" 
                         class="parallax-img" 
                         loading="lazy" 
                         alt="Endings Wake Concept Art ${index + 1}">
                    <div class="gallery-overlay"></div>
                </div>
            `;
        });
        galleryContainer.innerHTML = galleryHTML;
        
        // Parallax effect on scroll
        lenis.on('scroll', () => {
            const items = document.querySelectorAll('.parallax-img');
            items.forEach((item, i) => {
                const speed = 0.05 + (i % 3) * 0.02;
                const yPos = window.scrollY * speed;
                item.style.transform = `scale(1.1) translateY(${yPos % 30}px)`;
            });
        });

        const newElements = document.querySelectorAll('.gallery-item.animate-on-scroll');
        newElements.forEach(el => scrollObserver.observe(el));
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

// ===== FIREBASE BLOG LOADER =====
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore, collection, getDocs, query, orderBy, limit } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

async function loadBlogPosts() {
    const blogContainer = document.getElementById('blog-container');
    if (!blogContainer) return;

    // Skip Firebase if no project ID is configured
    if (firebaseConfig.projectId === "YOUR_PROJECT_ID") {
        blogContainer.innerHTML = `
            <div class="blog-error">
                ⚠ Firebase not configured yet. 
                <br><small>Connect your Firebase project to load blog posts.</small>
            </div>`;
        return;
    }

    try {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        const postsQuery = query(
            collection(db, 'posts'),
            orderBy('createdAt', 'desc'),
            limit(6)
        );

        const snapshot = await getDocs(postsQuery);

        if (snapshot.empty) {
            blogContainer.innerHTML = `<div class="blog-loading">No posts yet. Check back soon.</div>`;
            return;
        }

        let html = '';
        snapshot.forEach(doc => {
            const post = doc.data();
            const date = post.createdAt?.toDate
                ? post.createdAt.toDate().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                : 'Recent';

            html += `
                <div class="blog-card animate-on-scroll">
                    <div class="blog-card-image" style="${post.imageUrl ? `background-image:url('${post.imageUrl}'); background-size:cover; background-position:center;` : ''}">
                        ${!post.imageUrl ? 'No Image' : ''}
                    </div>
                    <div class="blog-card-body">
                        <div class="blog-card-meta">
                            <span class="blog-card-tag">${post.category || 'Writing'}</span>
                            <span>${date}</span>
                        </div>
                        <h3 class="blog-card-title">${post.title || 'Untitled'}</h3>
                        <p class="blog-card-excerpt">${post.excerpt || post.content?.substring(0, 120) + '...' || ''}</p>
                        <a href="${post.slug ? 'blog/' + post.slug + '.html' : '#blog'}" class="btn-text">Read More →</a>
                    </div>
                </div>`;
        });

        blogContainer.innerHTML = html;

        // Animate new cards
        document.querySelectorAll('.blog-card.animate-on-scroll').forEach(el => {
            const scrollObserver = new IntersectionObserver((entries) => {
                entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('active'); scrollObserver.unobserve(e.target); } });
            }, { threshold: 0.1 });
            scrollObserver.observe(el);
        });

    } catch (err) {
        console.error('Firebase blog error:', err);
        blogContainer.innerHTML = `<div class="blog-error">Could not load posts. Please try again later.</div>`;
    }
}

loadBlogPosts();
