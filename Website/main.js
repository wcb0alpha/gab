/**
 * Grayson Anderson Brown - Interactions & Animations
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Unobserve after animation triggered
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => scrollObserver.observe(el));

    // 2. Subtle Hero Parallax
    const hero = document.querySelector('.hero');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        if (hero) {
            hero.style.backgroundPositionY = (scrolled * 0.5) + 'px';
        }
    });

    // 3. Navbar background shift on scroll
    const nav = document.querySelector('.glass-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.padding = '1rem 0';
            nav.style.background = 'rgba(10, 12, 16, 0.9)';
        } else {
            nav.style.padding = '1.5rem 0';
            nav.style.background = 'rgba(10, 12, 16, 0.7)';
        }
    });

    // 4. Smooth Anchor Links (Legacy support / fine-tuning)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navHeight = nav.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. Contact Form Simulation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.textContent;
            
            btn.disabled = true;
            btn.textContent = 'Sending...';
            
            // Simulate API call
            setTimeout(() => {
                btn.textContent = 'Message Sent!';
                btn.style.background = '#10b981'; // Green
                contactForm.reset();
                
                setTimeout(() => {
                    btn.disabled = false;
                    btn.textContent = originalText;
                    btn.style.background = 'var(--clr-accent)';
                }, 3000);
            }, 1500);
        });
    }

    // 6. Gallery Injection
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
            "image_13_beacon_test_1772342597508.png",
            "image_14_mud_fingernails_fantasy_1772364817303.png",
            "image_15_the_maw_fantasy_1772364829439.png",
            "image_16_grasmere_test_1772342287261.png",
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
                <div class="gallery-item animate-on-scroll" style="transition-delay: ${(index % 3) * 0.1}s">
                    <img src="assets/Final Conceptual Images/${img}" loading="lazy" alt="Endings Wake Concept Art ${index + 1}">
                    <div class="gallery-overlay"></div>
                </div>
            `;
        });
        
        galleryContainer.innerHTML = galleryHTML;
        
        // Re-observe the newly injected elements
        const newElements = document.querySelectorAll('.gallery-item.animate-on-scroll');
        newElements.forEach(el => scrollObserver.observe(el));
    }
});

