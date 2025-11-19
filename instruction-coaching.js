/* ========================================
   INSTRUCTION & COACHING - SIMPLE SCROLL ANIMATIONS
   Subtle fade-in effects on scroll
   ======================================== */

(function() {
    'use strict';

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        console.log('Instruction & Coaching animations initialized');

        const cards = document.querySelectorAll('.ic-card');

        if (cards.length === 0) {
            console.warn('No instruction & coaching cards found');
            return;
        }

        // Create Intersection Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add a slight delay for staggered effect
                    const delay = entry.target.classList.contains('projects-card') ? 200 : 0;

                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, delay);

                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        // Set initial state and observe cards
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });

        // Add subtle hover interaction to rating cards
        const ratingCards = document.querySelectorAll('.ic-rating-card');
        ratingCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px)';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });

        // Add hover effect to project images
        const projectItems = document.querySelectorAll('.ic-project-item');
        projectItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.zIndex = '10';
            });

            item.addEventListener('mouseleave', function() {
                this.style.zIndex = '1';
            });
        });
    }

})();
