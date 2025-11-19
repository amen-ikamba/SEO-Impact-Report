// First Year Academy Animations
document.addEventListener('DOMContentLoaded', function() {

    // Counter Animation Function
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = current.toFixed(target % 1 === 0 ? 0 : 2);
            }
        }, 16);
    }

    // Star Rating Animation - Works for both FYA and Coaching stars
    function animateStars(starRating, rating) {
        const stars = starRating.querySelectorAll('.fya-star, .coaching-star');
        const fullStars = Math.floor(rating);
        const partialStar = rating % 1;

        stars.forEach((star, index) => {
            setTimeout(() => {
                if (index < fullStars) {
                    star.classList.add('filled');
                } else if (index === fullStars && partialStar > 0) {
                    star.classList.add('partial');
                    star.style.setProperty('--fill-percent', (partialStar * 100) + '%');
                }
            }, index * 100); // Reduced from 150ms to 100ms for smoother experience
        });
    }

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('visible', 'animated');

                // Animate the number
                const numberElement = entry.target.querySelector('.fya-stat-number');
                const target = parseFloat(numberElement.dataset.target);
                animateCounter(numberElement, target);

                // Animate stars if present
                const starRating = entry.target.querySelector('.fya-star-rating');
                if (starRating) {
                    const rating = parseFloat(starRating.dataset.rating);
                    setTimeout(() => {
                        animateStars(starRating, rating);
                    }, 800); // Delayed to avoid overwhelming, starts after number animation
                }

                // Animate the progress bar
                const progressFill = entry.target.querySelector('.fya-progress-fill');
                if (progressFill) {
                    const width = progressFill.dataset.width;
                    setTimeout(() => {
                        progressFill.style.width = width + '%';
                    }, 200);
                }
            }
        });
    }, observerOptions);

    // Observe all stat cards
    const statCards = document.querySelectorAll('.fya-stat-card');
    statCards.forEach(card => observer.observe(card));

    // Coaching Section Ratings Observer
    const coachingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('visible', 'animated');

                // Animate the number
                const scoreElement = entry.target.querySelector('.rating-score');
                if (scoreElement) {
                    const target = parseFloat(scoreElement.dataset.target);
                    animateCounter(scoreElement, target);
                }

                // Animate stars if present
                const starRating = entry.target.querySelector('.coaching-star-rating');
                if (starRating) {
                    const rating = parseFloat(starRating.dataset.rating);
                    setTimeout(() => {
                        animateStars(starRating, rating);
                    }, 1000); // Delayed to sequence after number, less overwhelming
                }

                // Animate progress bar
                const progressFill = entry.target.querySelector('.rating-progress-fill');
                if (progressFill) {
                    const width = progressFill.dataset.width;
                    setTimeout(() => {
                        progressFill.style.width = width + '%';
                    }, 300);
                }
            }
        });
    }, observerOptions);

    // Observe coaching rating items
    const ratingItems = document.querySelectorAll('.rating-item');
    ratingItems.forEach((item, index) => {
        item.style.animationDelay = (index * 0.2) + 's'; // Increased stagger for calmer entrance
        coachingObserver.observe(item);
    });

    // Add pulse effect on hover
    statCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const number = this.querySelector('.fya-stat-number');
            number.style.transform = 'scale(1.1)';
            number.style.transition = 'transform 0.3s ease';
        });

        card.addEventListener('mouseleave', function() {
            const number = this.querySelector('.fya-stat-number');
            number.style.transform = 'scale(1)';
        });
    });

    // Interactive star hover effect
    const allStars = document.querySelectorAll('.fya-star, .coaching-star');
    allStars.forEach(star => {
        star.addEventListener('mouseenter', function() {
            const starRating = this.parentElement;
            const starIndex = parseInt(this.dataset.star);
            const stars = starRating.querySelectorAll('.fya-star, .coaching-star');

            stars.forEach((s, idx) => {
                if (idx < starIndex) {
                    s.style.color = '#ffd700';
                    s.style.transform = 'scale(1.15)';
                }
            });
        });

        star.addEventListener('mouseleave', function() {
            const starRating = this.parentElement;
            const stars = starRating.querySelectorAll('.fya-star, .coaching-star');

            stars.forEach(s => {
                s.style.transform = 'scale(1)';
                if (!s.classList.contains('filled') && !s.classList.contains('partial')) {
                    s.style.color = '#ddd';
                }
            });
        });
    });
});
