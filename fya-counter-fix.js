/* ========================================
   FIRST YEAR ACADEMY - Simple Counter Fix
   Works with your existing HTML structure
   ======================================== */

(function() {
    'use strict';

    // Counter animation function
    function animateCounter(element, target, suffix) {
        let startTime = null;
        const duration = 2000; // 2 seconds
        const startValue = 0;
        
        function updateCounter(currentTime) {
            if (!startTime) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (easeOutExpo)
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            
            const currentValue = Math.floor(startValue + (target - startValue) * easeProgress);
            element.textContent = currentValue + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + suffix;
            }
        }
        
        requestAnimationFrame(updateCounter);
    }

    // Initialize counters when section is visible
    function initCounters() {
        const statCards = document.querySelectorAll('.first-year-academy .stat-card');
        
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    
                    // Get the target count from data-count attribute
                    const targetCount = parseInt(entry.target.dataset.count) || 1000;
                    
                    // Find the stat-number element
                    const statNumber = entry.target.querySelector('.stat-number');
                    
                    if (statNumber) {
                        // Start counting animation
                        animateCounter(statNumber, targetCount, '+');
                    }
                }
            });
        }, observerOptions);

        // Observe all stat cards
        statCards.forEach(card => observer.observe(card));
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCounters);
    } else {
        initCounters();
    }

})();
