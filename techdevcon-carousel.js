/* ========================================
   TECHDEVCON CAROUSEL - INTERACTIVE EVENT SHOWCASE
   ======================================== */

class TechDevConCarousel {
    constructor() {
        this.slides = document.querySelectorAll('.event-slide');
        this.thumbnails = document.querySelectorAll('.thumbnail-item');
        this.prevBtn = document.querySelector('.prev-event-btn');
        this.nextBtn = document.querySelector('.next-event-btn');
        this.currentSlideEl = document.querySelector('.current-event');
        this.totalSlidesEl = document.querySelector('.total-events');

        this.currentSlide = 0;
        this.slideInterval = null;
        this.autoPlayDelay = 5000;
        this.isAnimating = false;

        if (this.slides.length === 0) return;
        this.init();
    }

    init() {
        // Set total slides
        if (this.totalSlidesEl) {
            this.totalSlidesEl.textContent = this.slides.length;
        }

        // Navigation buttons
        this.prevBtn?.addEventListener('click', () => this.previousSlide());
        this.nextBtn?.addEventListener('click', () => this.nextSlide());

        // Thumbnail navigation
        this.thumbnails.forEach((thumbnail, index) => {
            thumbnail.addEventListener('click', () => this.goToSlide(index));
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.previousSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });

        // Touch support
        this.setupTouchSupport();

        // Pause autoplay on hover
        const carouselContainer = document.querySelector('.carousel-slides-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => this.pauseAutoPlay());
            carouselContainer.addEventListener('mouseleave', () => this.startAutoPlay());
        }

        // Pause when page is hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoPlay();
            } else {
                this.startAutoPlay();
            }
        });

        // Start autoplay
        this.startAutoPlay();
    }

    goToSlide(index) {
        if (this.isAnimating || index === this.currentSlide) return;
        this.isAnimating = true;

        // Remove active class from current slide and thumbnail
        this.slides[this.currentSlide]?.classList.remove('active');
        this.thumbnails[this.currentSlide]?.classList.remove('active');

        // Update current slide
        this.currentSlide = index;

        // Add active class to new slide and thumbnail
        this.slides[this.currentSlide]?.classList.add('active');
        this.thumbnails[this.currentSlide]?.classList.add('active');

        // Update progress indicator
        if (this.currentSlideEl) {
            this.currentSlideEl.textContent = this.currentSlide + 1;
        }

        // Reset animation lock
        setTimeout(() => {
            this.isAnimating = false;
        }, 800);

        // Reset autoplay
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
        this.slideInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
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
        const carousel = document.querySelector('.carousel-slides-container');
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
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.previousSlide();
            }
        }
    }
}

// Initialize carousel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new TechDevConCarousel();
});
