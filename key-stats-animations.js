// Key Stats Interactive Animations
document.addEventListener('DOMContentLoaded', function() {

    // Counter Animation Function
    function animateCounter(element, target, duration = 1500) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        // Determine if the number has a decimal
        const hasDecimal = target % 1 !== 0;
        const decimalPlaces = hasDecimal ? 1 : 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target.toFixed(decimalPlaces);
                clearInterval(timer);
            } else {
                element.textContent = current.toFixed(decimalPlaces);
            }
        }, 16);
    }

    // Parse number from stat card text (handles %, +, commas, etc.)
    function parseStatNumber(text) {
        // Remove all non-numeric characters except decimal point and minus
        const cleaned = text.replace(/[^0-9.-]/g, '');
        return parseFloat(cleaned);
    }

    // Intersection Observer for Scroll-Triggered Animations
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('stat-animated')) {
                entry.target.classList.add('stat-animated');

                // Find the stat number element
                const numberElement = entry.target.querySelector('.stat-number');
                if (numberElement) {
                    const originalText = numberElement.textContent;
                    const targetNumber = parseStatNumber(originalText);

                    // Store suffix (%, +, etc.) if present
                    const suffix = originalText.match(/[%+]/) ? originalText.match(/[%+]/)[0] : '';

                    // Start from 0 and animate
                    numberElement.textContent = '0';

                    // Animate the counter
                    setTimeout(() => {
                        const start = 0;
                        const duration = 1500;
                        const increment = targetNumber / (duration / 16);
                        let current = start;

                        const hasDecimal = targetNumber % 1 !== 0;
                        const decimalPlaces = hasDecimal ? 1 : 0;

                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= targetNumber) {
                                numberElement.textContent = targetNumber.toFixed(decimalPlaces) + suffix;
                                clearInterval(timer);
                            } else {
                                numberElement.textContent = current.toFixed(decimalPlaces) + suffix;
                            }
                        }, 16);
                    }, 200);
                }
            }
        });
    }, observerOptions);

    // Observe all stat cards
    const statCards = document.querySelectorAll('.key-stats .stat-card');
    statCards.forEach(card => {
        observer.observe(card);
    });

    // Enhanced Hover Interactions
    statCards.forEach((card, index) => {
        // Add ripple effect on click
        card.addEventListener('click', function(e) {
            const ripple = document.createElement('div');
            ripple.className = 'stat-ripple';

            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            ripple.style.cssText = `
                position: absolute;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: rgba(235, 0, 41, 0.3);
                transform: translate(-50%, -50%);
                left: ${x}px;
                top: ${y}px;
                animation: ripple-expand 0.6s ease-out;
                pointer-events: none;
            `;

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });

        // Parallax effect on mouse move
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;

            const rotateX = deltaY * 5;
            const rotateY = deltaX * 5;

            this.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });

    // Add ripple animation style
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple-expand {
            from {
                width: 10px;
                height: 10px;
                opacity: 1;
            }
            to {
                width: 200px;
                height: 200px;
                opacity: 0;
            }
        }

        .key-stats .stat-card {
            position: relative;
            transition: transform 0.3s ease;
        }
    `;
    document.head.appendChild(style);

    // Chart container hover effect
    const chartContainer = document.querySelector('.chart-container');
    if (chartContainer) {
        chartContainer.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });

        chartContainer.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    }

    // Add subtle floating animation to decorative circles
    const decorativeCircles = document.querySelectorAll('.key-stats::before, .key-stats::after');

    // Parallax scroll effect for background gradients
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const scrolled = window.pageYOffset;
                const keyStatsSection = document.querySelector('.key-stats');

                if (keyStatsSection) {
                    const offset = scrolled * 0.3;
                    keyStatsSection.style.backgroundPosition = `center ${offset}px`;
                }

                ticking = false;
            });
            ticking = true;
        }
    });

    console.log('Key Stats animations initialized successfully!');
});
