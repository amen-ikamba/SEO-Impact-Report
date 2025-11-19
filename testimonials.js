/* ========================================
   TESTIMONIALS CAROUSEL - IMPROVED
   "Hear from Our Members" Section
   ======================================== */

(function() {
    'use strict';

    // Testimonial Data
    const testimonials = [
        {
            name: "Amen Divine Ikamba",
            school: "Pitzer College",
            year: "Class of 2027",
            image: "images/members/amen.jpg",
            quote: "What I found most impactful about the program was the environment of like-minded students and mentors who genuinely believed in me. Being surrounded by people who share similar ambitions and values was incredibly empowering and encouraging—it made me feel supported, motivated, and confident in my abilities."
        },
        {
            name: "Ayush Parambath",
            school: "University of South Carolina",
            year: "Class of 2027",
            image: "images/members/Ayush.jpeg",
            quote: "I found the projects to be the most impactful. They gave us an opportunity to really experience the full software development cycle from generating an idea to building a working application to presenting it to a business and technical oriented audience with AI fluency."
        },
        {
            name: "Riddhima Yadav",
            school: "The University of Texas at Austin",
            year: "Class of 2027",
            image: "images/members/rid.jpg",
            quote: "The most impactful part of the program was the incredible guidance and supportive culture. I truly felt that everyone was invested in my growth and success, and it opened doors I never could have imagined. Before joining, I felt somewhat lost in navigating the job market, but the mentorship, resources, and encouragement I received here have given me clarity and confidence in my next steps."
        },
        {
            name: "Anisha Bhaskar Torres",
            school: "The University of Texas at Austin",
            year: "Class of 2027",
            image: "images/members/anisha.jpg",
            quote: "I found the preparation for industry as most impactful. For example, learning about agile methodologies, building web apps end-to-end, the DSA/Leetcode training. Those were so helpful and I feel so much more confident about my abilities now."
        },
        {
            name: "Chinmayi Ranade",
            school: "George Mason University",
            year: "Class of 2027",
            image: "images/members/Chinmayi.jpeg",
            quote: "The weekly Codio assignments were incredibly valuable. Each one introduced new concepts and skills that built on one another, and I feel like I gained a strong foundation that I'll continue applying in future projects."
        },
        {
            name: "Carolyn Lu",
            school: "Rice University",
            year: "Class of 2027",
            image: "images/members/Carolyn.jpg",
            quote: "My TechDevCon experience was incredibly rewarding. From the mix of panels and talks, I gained valuable insights from industry leaders who shared practical advice as well as their journeys in tech. It was also an opportunity to not only meet the interns from my EM group that I have worked with on projects, but also to meet everyone else that I have only seen through Zoom. I was able to build meaningful connections with a cohort of genuinely kind and supportive people. The conference helped me feel more connected to the tech community and motivated me to keep learning and pushing myself."
        },
        {
            name: "Sahara Smith",
            school: "The University of Tulsa",
            year: "Class of 2028",
            image: "images/members/Sahara.jpeg",
            quote: "Having access to the [Teaching Assistants] as mentors was really great, they were so friendly and helpful, and I loved getting to connect with people working in industry because I've never had that opportunity before! I definitely learned a lot about planning and building projects and I feel much more confident about developing my own future personal projects."
        }
    ];

    // State
    let currentSlide = 0;
    let isAnimating = false;
    let autoPlayInterval = null;

    // DOM Elements
    let elements = {};

    // Initialize
    function init() {
        console.log('Testimonials Carousel Initialized');

        // Get DOM elements
        elements = {
            prevArrow: document.querySelector('.prev-arrow'),
            nextArrow: document.querySelector('.next-arrow'),
            testimonialText: document.querySelector('.testimonial-text'),
            memberImage: document.getElementById('current-member-image'),
            memberName: document.getElementById('current-member-name'),
            testimonialQuote: document.getElementById('current-testimonial'),
            memberSchool: document.getElementById('current-member-school'),
            memberYear: document.getElementById('current-member-year'),
            currentSlideEl: document.querySelector('.current-slide'),
            totalSlidesEl: document.querySelector('.total-slides'),
            thumbnails: document.querySelectorAll('.thumbnail'),
            testimonialContent: document.querySelector('.testimonial-content')
        };

        // Check if elements exist
        if (!elements.memberImage || !elements.memberName) {
            console.error('Testimonials: Required elements not found');
            return;
        }

        // Setup event listeners
        setupEventListeners();

        // Initialize display
        updateTestimonial(0, false);

        // Start autoplay
        startAutoPlay();
    }

    // Setup event listeners
    function setupEventListeners() {
        // Arrow navigation
        if (elements.prevArrow) {
            elements.prevArrow.addEventListener('click', () => navigateTestimonial('prev'));
        }

        if (elements.nextArrow) {
            elements.nextArrow.addEventListener('click', () => navigateTestimonial('next'));
        }

        // Thumbnail clicks
        elements.thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                if (index !== currentSlide && !isAnimating) {
                    updateTestimonial(index);
                    resetAutoPlay();
                }
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                navigateTestimonial('prev');
                resetAutoPlay();
            } else if (e.key === 'ArrowRight') {
                navigateTestimonial('next');
                resetAutoPlay();
            }
        });

        // Touch swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        if (elements.testimonialContent) {
            elements.testimonialContent.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            });

            elements.testimonialContent.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            });
        }

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    navigateTestimonial('next');
                } else {
                    navigateTestimonial('prev');
                }
                resetAutoPlay();
            }
        }

        // Pause on hover
        if (elements.testimonialContent) {
            elements.testimonialContent.addEventListener('mouseenter', stopAutoPlay);
            elements.testimonialContent.addEventListener('mouseleave', startAutoPlay);
        }
    }

    // Navigate to next/prev testimonial
    function navigateTestimonial(direction) {
        if (isAnimating) return;

        let newIndex;
        if (direction === 'next') {
            newIndex = (currentSlide + 1) % testimonials.length;
        } else {
            newIndex = (currentSlide - 1 + testimonials.length) % testimonials.length;
        }

        updateTestimonial(newIndex);
    }

    // Update testimonial display
    function updateTestimonial(index, animate = true) {
        if (isAnimating || index === currentSlide) return;

        isAnimating = true;
        currentSlide = index;

        const testimonial = testimonials[index];

        // Fade out animation
        if (animate && elements.testimonialText) {
            elements.testimonialText.style.opacity = '0';
            elements.testimonialText.style.transform = 'translateX(20px)';
        }

        setTimeout(() => {
            // Update content
            if (elements.memberImage) elements.memberImage.src = testimonial.image;
            if (elements.memberName) elements.memberName.textContent = testimonial.name;
            if (elements.testimonialQuote) elements.testimonialQuote.textContent = testimonial.quote;
            if (elements.memberSchool) elements.memberSchool.textContent = testimonial.school;
            if (elements.memberYear) elements.memberYear.textContent = testimonial.year;

            // Update active thumbnail
            elements.thumbnails.forEach((thumb, i) => {
                thumb.classList.toggle('active', i === index);
            });

            // Update progress indicator
            updateProgressIndicator();

            // Fade in animation
            if (animate && elements.testimonialText) {
                setTimeout(() => {
                    elements.testimonialText.style.opacity = '1';
                    elements.testimonialText.style.transform = 'translateX(0)';
                }, 50);
            }

            setTimeout(() => {
                isAnimating = false;
            }, animate ? 350 : 0);
        }, animate ? 300 : 0);
    }

    // Update progress indicator
    function updateProgressIndicator() {
        if (elements.currentSlideEl) {
            elements.currentSlideEl.textContent = currentSlide + 1;
        }
        if (elements.totalSlidesEl) {
            elements.totalSlidesEl.textContent = testimonials.length;
        }
    }

    // Auto-play functionality
    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(() => {
            navigateTestimonial('next');
        }, 7000); // Change slide every 7 seconds
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }

    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    // Pause when page is hidden
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoPlay();
        } else {
            startAutoPlay();
        }
    });

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
