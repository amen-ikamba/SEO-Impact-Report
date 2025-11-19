/* ========================================
   CURRICULUM & AI IN EDUCATION - ANIMATIONS
   Subtle scroll-triggered animations
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
        console.log('Curriculum & AI sections animations initialized');

        // Animate sections on scroll
        initScrollAnimations();

        // Animate AI bullet points with stagger
        initAIPointsAnimation();
    }

    // Scroll animations for main sections
    function initScrollAnimations() {
        const sections = document.querySelectorAll('.curriculum-section, .ai-education-section, .community-section');

        if (sections.length === 0) {
            console.warn('No curriculum/AI/community sections found');
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Fade in the entire section
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.observe(section);
        });
    }

    // Animate AI bullet points with stagger effect
    function initAIPointsAnimation() {
        const pointItems = document.querySelectorAll('.ai-point-item');

        if (pointItems.length === 0) {
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const items = entry.target.querySelectorAll('.ai-point-item');

                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('visible');
                        }, index * 150); // Stagger by 150ms
                    });

                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe the parent container
        const aiKeyPoints = document.querySelector('.ai-key-points');
        if (aiKeyPoints) {
            observer.observe(aiKeyPoints);
        }
    }

    // Add hover effect to rating cards
    const ratingCards = document.querySelectorAll('.curriculum-rating-card');
    ratingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add hover effect to images
    const imageContainers = document.querySelectorAll('.curriculum-image-container, .ai-image-container, .community-image-container');
    imageContainers.forEach(container => {
        container.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
        });

        container.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

})();
