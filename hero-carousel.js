/* Hero Carousel JavaScript */

class HeroCarousel {
    constructor() {
        this.slides = document.querySelectorAll('.carousel-slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.currentSlide = 0;
        this.slideInterval = null;
        this.autoPlayDelay = 6000;
        this.isAnimating = false;

        if (this.slides.length === 0) return;
        this.init();
    }

    init() {
        this.prevBtn?.addEventListener('click', () => this.previousSlide());
        this.nextBtn?.addEventListener('click', () => this.nextSlide());

        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.previousSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });

        this.setupTouchSupport();

        const carouselContainer = document.querySelector('.hero-carousel');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => this.pauseAutoPlay());
            carouselContainer.addEventListener('mouseleave', () => this.startAutoPlay());
        }

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoPlay();
            } else {
                this.startAutoPlay();
            }
        });

        this.startAutoPlay();
    }

    goToSlide(index) {
        if (this.isAnimating || index === this.currentSlide) return;
        this.isAnimating = true;

        this.slides[this.currentSlide]?.classList.remove('active');
        this.indicators[this.currentSlide]?.classList.remove('active');

        this.currentSlide = index;

        this.slides[this.currentSlide]?.classList.add('active');
        this.indicators[this.currentSlide]?.classList.add('active');

        setTimeout(() => { this.isAnimating = false; }, 1000);
        this.resetAutoPlay();
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }

    previousSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevIndex);
    }

    startAutoPlay() {
        this.pauseAutoPlay();
        this.slideInterval = setInterval(() => { this.nextSlide(); }, this.autoPlayDelay);
    }

    pauseAutoPlay() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
            this.slideInterval = null;
        }
    }

    resetAutoPlay() {
        this.pauseAutoPlay();
        this.startAutoPlay();
    }

    setupTouchSupport() {
        let touchStartX = 0;
        let touchEndX = 0;
        const carousel = document.querySelector('.hero-carousel');
        if (!carousel) return;

        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        }, { passive: true });
    }

    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) { this.nextSlide(); } 
            else { this.previousSlide(); }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new HeroCarousel();
    
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            document.querySelector('.mission')?.scrollIntoView({ behavior: 'smooth' });
        });

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            scrollIndicator.style.opacity = scrolled > 100 ? '0' : '1';
            scrollIndicator.style.pointerEvents = scrolled > 100 ? 'none' : 'all';
        });
    }

    const logo = document.querySelector('.floating-logo');
    if (logo) {
        window.addEventListener('scroll', () => {
            logo.style.transform = window.pageYOffset > 50 ? 'scale(0.9)' : 'scale(1)';
        });
    }
});

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const activeSlide = document.querySelector('.carousel-slide.active .slide-image');
    if (activeSlide && scrolled < window.innerHeight) {
        activeSlide.style.transform = 'scale(1.1) translateY(' + (scrolled * 0.5) + 'px)';
    }
});
