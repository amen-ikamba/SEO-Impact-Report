/* ========================================
   LEARNING & GROWTH SECTION - JAVASCRIPT
   Circular Progress Animation
   ======================================== */

(function() {
    'use strict';

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        console.log('Learning & Growth Script Initialized');

        const cards = document.querySelectorAll('.lg-card');

        if (cards.length === 0) {
            console.warn('No learning & growth cards found');
            return;
        }

        console.log(`Found ${cards.length} learning & growth cards`);

        // Create Intersection Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    const index = parseInt(card.dataset.index);
                    const delay = index * 150;

                    console.log(`Card ${index} is visible, animating with ${delay}ms delay`);

                    setTimeout(() => {
                        animateCard(card);
                    }, delay);

                    observer.unobserve(card);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        });

        // Observe all cards
        cards.forEach(card => {
            observer.observe(card);
        });
    }

    function animateCard(card) {
        // Add visible class
        card.classList.add('visible');

        // Animate all progress circles in this card
        const circles = card.querySelectorAll('.lg-circle-fill');

        circles.forEach((circle, index) => {
            setTimeout(() => {
                animateCircle(circle);
            }, index * 400);
        });
    }

    function animateCircle(circle) {
        const value = parseFloat(circle.dataset.value);
        const radius = 50;
        const circumference = 2 * Math.PI * radius; // 314.159

        console.log(`Animating circle to ${value}%`);

        // Calculate stroke-dashoffset for the percentage
        // 0% = full circumference (no fill)
        // 100% = 0 (complete fill)
        const offset = circumference - (value / 100) * circumference;

        // Add animated class and set the offset
        circle.classList.add('animated');
        circle.style.strokeDashoffset = offset;

        // Also animate the text value
        const progressContainer = circle.closest('.lg-circle-progress');
        if (progressContainer) {
            const valueElement = progressContainer.querySelector('.lg-percent-value');
            if (valueElement) {
                animateValue(valueElement, 0, value, 2000);
            }
        }
    }

    function animateValue(element, start, end, duration) {
        const startTime = performance.now();
        const initialValue = parseFloat(element.textContent) || start;

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);

            const currentValue = initialValue + (end - initialValue) * easeOutCubic;
            element.textContent = currentValue.toFixed(1);

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = end.toFixed(1);
            }
        }

        requestAnimationFrame(update);
    }

    // Add hover effects to cards
    document.addEventListener('DOMContentLoaded', () => {
        const cards = document.querySelectorAll('.lg-card');

        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-12px)';
            });

            card.addEventListener('mouseleave', function() {
                if (this.classList.contains('visible')) {
                    this.style.transform = 'translateY(0)';
                }
            });
        });
    });

})();
