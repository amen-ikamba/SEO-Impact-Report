// Header scroll behavior - add solid background when scrolled
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Enhanced stat card interactions with counter animations
document.addEventListener('DOMContentLoaded', () => {
    const statCards = document.querySelectorAll('.key-stats .stat-card');

    statCards.forEach((card, index) => {
        // Add ripple effect on click
        card.addEventListener('click', function(e) {
            const ripple = document.createElement('div');
            ripple.className = 'ripple-effect';
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);

            // Add pulse animation
            this.style.animation = 'pulse 0.3s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 300);
        });

        // Add hover sound effect indicator (visual only)
        card.addEventListener('mouseenter', function() {
            this.style.setProperty('--hover-time', Date.now());
        });
    });

    // Key Stats Section - Scroll animations
    const keyStatsSection = document.querySelector('.key-stats');
    if (keyStatsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate header
                    const header = entry.target.querySelector('.stats-header');
                    if (header) {
                        setTimeout(() => header.classList.add('visible'), 100);
                    }

                    // Animate intro
                    const intro = entry.target.querySelector('.stats-intro-wrapper');
                    if (intro) {
                        setTimeout(() => intro.classList.add('visible'), 200);
                    }

                    // Animate stat cards with stagger
                    const cards = entry.target.querySelectorAll('.stat-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('visible');
                            // Start counter animation
                            animateStatCounter(card);
                        }, 400 + (index * 100));
                    });

                    // Animate chart container
                    const chartContainer = entry.target.querySelector('.chart-container');
                    if (chartContainer) {
                        setTimeout(() => chartContainer.classList.add('visible'), 800);
                    }

                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

        statsObserver.observe(keyStatsSection);
    }
});

// Animate stat numbers with counter effect
function animateStatCounter(card) {
    const numberElement = card.querySelector('.stat-number');
    if (!numberElement) return;

    const text = numberElement.textContent.trim();
    const hasPlus = text.includes('+');
    const numericValue = parseFloat(text.replace(/[^0-9.]/g, ''));

    if (isNaN(numericValue)) return;

    const duration = 2000;
    const startTime = performance.now();

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = easeOutQuart * numericValue;

        // Format based on the original value
        if (numericValue >= 1000) {
            numberElement.textContent = Math.floor(currentValue).toLocaleString() + (hasPlus ? '+' : '');
        } else if (numericValue % 1 !== 0) {
            numberElement.textContent = currentValue.toFixed(2);
        } else {
            numberElement.textContent = Math.floor(currentValue).toString();
        }

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            numberElement.textContent = text; // Restore original text
        }
    }

    requestAnimationFrame(updateCounter);
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Trigger counter animations
            const counters = entry.target.querySelectorAll('[data-count]');
            counters.forEach(counter => {
                animateCounter(counter);
            });
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Counter Animation
function animateCounter(element) {
    const target = parseFloat(element.getAttribute('data-count'));
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60fps
    let current = 0;
    const numberElement = element.querySelector('.stat-number, .stat-big-number');
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Format number based on value
        if (target >= 1000) {
            numberElement.textContent = Math.floor(current) + '+';
        } else if (target < 10) {
            numberElement.textContent = current.toFixed(2);
        } else {
            numberElement.textContent = Math.floor(current);
        }
    }, 16);
}

// Chart.js - Growth Chart
window.addEventListener('load', () => {
    const growthCtx = document.getElementById('growthChart');
    if (growthCtx) {
        // Create a larger, full-bleed chart with gradient fill for better visibility
        const gCtx = growthCtx.getContext('2d');
        // Create vertical gradient that fits the container height
        const gradient = gCtx.createLinearGradient(0, 0, 0, 520);
        gradient.addColorStop(0, 'rgba(235, 0, 41, 0.25)');
        gradient.addColorStop(0.5, 'rgba(235, 0, 41, 0.12)');
        gradient.addColorStop(1, 'rgba(235, 0, 41, 0.02)');

        const growthChart = new Chart(growthCtx, {
            type: 'line',
            data: {
                labels: ['2021', '2022', '2023', '2024', '2025'],
                datasets: [{
                    label: 'Accepted Students',
                    data: [62, 77, 111, 169, 164],
                    borderColor: '#b30017',
                    backgroundColor: gradient,
                    fill: true,
                    tension: 0.3,
                    borderWidth: 6,
                    pointRadius: 10,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: '#b30017',
                    pointBorderWidth: 5,
                    pointHoverRadius: 14,
                    pointHoverBorderWidth: 6,
                    pointHoverBackgroundColor: '#ffffff',
                    pointHoverBorderColor: '#eb0029'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 10,
                        right: 15,
                        bottom: 10,
                        left: 10
                    }
                },
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(17, 17, 17, 0.95)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        padding: 16,
                        displayColors: false,
                        borderColor: '#eb0029',
                        borderWidth: 2,
                        cornerRadius: 8,
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 16,
                            weight: '600'
                        },
                        callbacks: {
                            title: function(context) {
                                return 'Year ' + context[0].label;
                            },
                            label: function(context) {
                                return context.parsed.y + ' students accepted';
                            },
                            afterLabel: function(context) {
                                const index = context.dataIndex;
                                if (index > 0) {
                                    const current = context.parsed.y;
                                    const previous = context.chart.data.datasets[0].data[index - 1];
                                    const change = current - previous;
                                    const percentage = ((change / previous) * 100).toFixed(1);
                                    const arrow = change >= 0 ? '↑' : '↓';
                                    return arrow + ' ' + Math.abs(change) + ' (' + (change >= 0 ? '+' : '') + percentage + '%)';
                                }
                                return '';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 40,
                        max: 220,
                        ticks: {
                            stepSize: 40,
                            color: '#222222',
                            font: {
                                size: 14,
                                weight: '600'
                            }
                        },
                        grid: {
                            color: '#f0f0f0',
                            drawBorder: false,
                            lineWidth: 1.2
                        }
                    },
                    x: {
                        ticks: {
                            color: '#222222',
                            font: {
                                size: 14,
                                weight: '600'
                            }
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        });

        // Add hover effect to chart container
        const chartContainer = growthCtx.closest('.chart-container');
        if (chartContainer) {
            chartContainer.addEventListener('mouseenter', () => {
                growthChart.options.animation.duration = 300;
            });
        }
    }

    // Gauge Charts for Student Experience
    createGaugeChart('satisfactionGauge', 4.75, 5, '4.75/5');
    createGaugeChart('recommendGauge', 9.52, 10, '9.52/10');
    createGaugeChart('npsGauge', 87, 100, '87%');
});

// Create Gauge Chart
function createGaugeChart(elementId, value, max, label) {
    const ctx = document.getElementById(elementId);
    if (!ctx) return;
    
    const percentage = (value / max) * 100;
    const angle = (percentage / 100) * 180;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [value, max - value],
                backgroundColor: ['#eb0029', '#e5e7e7'],
                borderWidth: 0,
                circumference: 180,
                rotation: 270
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            cutout: '75%',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            }
        }
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header scroll effect
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
    } else {
        header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
    }
    
    lastScroll = currentScroll;
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// Lazy loading images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Program Overview timeline items - Intersection Observer
const timelineItems = document.querySelectorAll('.info-card');

const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            timelineObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

timelineItems.forEach(item => timelineObserver.observe(item));

// Add hover effects for interactive elements
document.querySelectorAll('.stat-card, .partner-logo, .event-card, .testimonial-card').forEach(element => {
    element.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });
});

// Console message
console.log('%c🚀 SEO Tech Developer 2025 Impact Report', 'font-size: 20px; font-weight: bold; color: #eb0029;');
console.log('%cBuilding Tomorrow\'s Tech Workforce', 'font-size: 14px; color: #4d4d4d;');


// new added script content
/* ========================================
   PROGRAM OVERVIEW SECTION - JAVASCRIPT ONLY
   ======================================== */

// Intersection Observer for scroll animations
const observeProgramOverview = () => {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger card animations
                const cards = entry.target.querySelectorAll('.info-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('animate-in');
                    }, index * 300);
                });
            }
        });
    }, observerOptions);

    // Observe the program overview section
    const section = document.querySelector('.program-overview');
    if (section) {
        observer.observe(section);
    }
};

// Parallax effect for decorative circles
const parallaxCircles = () => {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const section = document.querySelector('.program-overview');
        
        if (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const windowHeight = window.innerHeight;
            
            // Check if section is in viewport
            if (scrolled + windowHeight > sectionTop && scrolled < sectionTop + sectionHeight) {
                const circleLeft = section.querySelector('.circle-left');
                const circleRight = section.querySelector('.circle-right');
                
                if (circleLeft) {
                    const speed = (scrolled - sectionTop) * 0.3;
                    circleLeft.style.transform = `translateY(${speed}px) rotate(${speed * 0.1}deg)`;
                }
                
                if (circleRight) {
                    const speed = (scrolled - sectionTop) * 0.2;
                    circleRight.style.transform = `translateY(${-speed}px) rotate(${-speed * 0.1}deg)`;
                }
            }
        }
    });
};

// Animate curve drawing on scroll
const animateCurve = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const curveLine = entry.target.querySelector('.curve-line');
                if (curveLine) {
                    curveLine.style.animation = 'drawCurve 2s ease 0.3s forwards';
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const curveContainer = document.querySelector('.curve-container');
    if (curveContainer) {
        observer.observe(curveContainer);
    }
};

// Card hover effects with enhanced interactivity
const enhanceCardInteractions = () => {
    const cards = document.querySelectorAll('.info-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Subtle scale effect on hover
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
};

// Smooth scroll to section
const smoothScrollToOverview = () => {
    const scrollTriggers = document.querySelectorAll('a[href="#program-overview"]');
    
    scrollTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const section = document.querySelector('.program-overview');
            if (section) {
                section.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
};

// Initialize all functions when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    observeProgramOverview();
    parallaxCircles();
    animateCurve();
    enhanceCardInteractions();
    smoothScrollToOverview();
});

// Performance optimization: Use requestAnimationFrame for smooth animations
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            // Smooth scroll-based animations go here
            ticking = false;
        });
        ticking = true;
    }
});

/* ========================================
   SOLUTION SECTION - JAVASCRIPT ONLY
   ======================================== */

// Intersection Observer for scroll animations
const observeSolutionSection = () => {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger card animations sequentially
                const cards = entry.target.querySelectorAll('.solution-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 150);
                });
            }
        });
    }, observerOptions);

    const section = document.querySelector('.solution-section');
    if (section) {
        observer.observe(section);
    }
};

// Parallax effect for decorative blobs
const parallaxBlobs = () => {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const section = document.querySelector('.solution-section');
        
        if (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const windowHeight = window.innerHeight;
            
            // Check if section is in viewport
            if (scrolled + windowHeight > sectionTop && scrolled < sectionTop + sectionHeight) {
                const blobLeft = section.querySelector('.blob-left');
                const blobRight = section.querySelector('.blob-right');
                
                if (blobLeft) {
                    const speed = (scrolled - sectionTop) * 0.2;
                    blobLeft.style.transform = `translate(${speed}px, ${speed * 0.5}px)`;
                }
                
                if (blobRight) {
                    const speed = (scrolled - sectionTop) * 0.15;
                    blobRight.style.transform = `translate(${-speed}px, ${speed * 0.3}px)`;
                }
            }
        }
    });
};

// Enhanced card hover interactions
const enhanceSolutionCards = () => {
    const cards = document.querySelectorAll('.solution-card');
    
    cards.forEach(card => {
        // Mouse move effect - subtle tilt
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            this.style.transform = `translateY(-15px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
        });
        
        // Icon animation on card hover
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.card-icon');
            if (icon) {
                icon.style.animation = 'iconBounce 0.6s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.card-icon');
            if (icon) {
                icon.style.animation = '';
            }
        });
    });
};

// Add icon bounce animation dynamically
const addIconAnimation = () => {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes iconBounce {
            0%, 100% { transform: scale(1) rotate(0deg); }
            25% { transform: scale(1.1) rotate(5deg); }
            50% { transform: scale(1.15) rotate(-5deg); }
            75% { transform: scale(1.1) rotate(3deg); }
        }
    `;
    document.head.appendChild(style);
};

// Animate SVG icons on scroll into view
const animateSVGIcons = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const svg = entry.target.querySelector('.icon-svg');
                if (svg) {
                    // Add fade and scale animation
                    svg.style.opacity = '0';
                    svg.style.transform = 'scale(0.5)';
                    
                    setTimeout(() => {
                        svg.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                        svg.style.opacity = '1';
                        svg.style.transform = 'scale(1)';
                    }, 100);
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.card-icon').forEach(icon => {
        observer.observe(icon);
    });
};

// Counter animation for stats (if you add numbers later)
const animateCounters = () => {
    const counters = document.querySelectorAll('[data-count]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current);
        }, 16);
    });
};

// Smooth scroll to solution section
const smoothScrollToSolution = () => {
    const scrollTriggers = document.querySelectorAll('a[href="#solution"]');
    
    scrollTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const section = document.querySelector('.solution-section');
            if (section) {
                section.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
};

// Initialize all functions when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    observeSolutionSection();
    parallaxBlobs();
    enhanceSolutionCards();
    addIconAnimation();
    animateSVGIcons();
    smoothScrollToSolution();
});

// Performance optimization: Debounce scroll events
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }
    
    scrollTimeout = window.requestAnimationFrame(() => {
        // Scroll-based animations are handled in parallaxBlobs
    });
});

// Add resize listener for responsive adjustments
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Recalculate positions if needed
        const isMobile = window.innerWidth < 768;
        const cards = document.querySelectorAll('.solution-card');
        
        cards.forEach(card => {
            if (isMobile) {
                card.style.transform = '';
            }
        });
    }, 250);
});
// Impacts Section - Interactive Animations & Gauges

document.addEventListener('DOMContentLoaded', function() {
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe impact cards
    document.querySelectorAll('.impact-card').forEach(card => {
        observer.observe(card);
    });

    // Observe survey cards
    document.querySelectorAll('.survey-card').forEach(card => {
        observer.observe(card);
    });

    // Initialize gauges when they become visible
    const gaugeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                initializeGauges();
                gaugeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const studentExperience = document.querySelector('.student-experience');
    if (studentExperience) {
        gaugeObserver.observe(studentExperience);
    }
});

// Gauge Chart Initialization
function initializeGauges() {
    const gaugeConfig = {
        type: 'doughnut',
        options: {
            circumference: 180,
            rotation: -90,
            cutout: '75%',
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            },
            animation: {
                animateRotate: true,
                duration: 2000,
                easing: 'easeOutCubic'
            }
        }
    };

    // Satisfaction Gauge (4.75/5)
    const satisfactionCtx = document.getElementById('satisfactionGauge');
    if (satisfactionCtx) {
        new Chart(satisfactionCtx, {
            ...gaugeConfig,
            data: {
                datasets: [{
                    data: [4.75, 0.25],
                    backgroundColor: [
                        createGradient(satisfactionCtx, '#eb0029', '#ff4d6d'),
                        '#e5e7e7'
                    ],
                    borderWidth: 0
                }]
            }
        });
    }

    // Recommendation Gauge (9.52/10)
    const recommendCtx = document.getElementById('recommendGauge');
    if (recommendCtx) {
        new Chart(recommendCtx, {
            ...gaugeConfig,
            data: {
                datasets: [{
                    data: [9.52, 0.48],
                    backgroundColor: [
                        createGradient(recommendCtx, '#115a7f', '#4d9fd1'),
                        '#e5e7e7'
                    ],
                    borderWidth: 0
                }]
            }
        });
    }

    // NPS Gauge (87%)
    const npsCtx = document.getElementById('npsGauge');
    if (npsCtx) {
        new Chart(npsCtx, {
            ...gaugeConfig,
            data: {
                datasets: [{
                    data: [87, 13],
                    backgroundColor: [
                        createGradient(npsCtx, '#eb0029', '#115a7f'),
                        '#e5e7e7'
                    ],
                    borderWidth: 0
                }]
            }
        });
    }
}

// Create gradient for gauge
function createGradient(ctx, color1, color2) {
    const canvas = ctx.canvas;
    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    return gradient;
}

// Parallax effect on scroll
window.addEventListener('scroll', () => {
    const impactsSection = document.querySelector('.impacts-section');
    if (!impactsSection) return;

    const rect = impactsSection.getBoundingClientRect();
    const scrolled = window.pageYOffset;
    
    if (rect.top < window.innerHeight && rect.bottom > 0) {
        const yPos = -(scrolled * 0.3);
        impactsSection.style.backgroundPosition = `center ${yPos}px`;
    }
});

// ========================================
// IMPROVED HEADER - Interactive Effects
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Get header element
    const header = document.querySelector('.header');
    
    // Add scroll effect to header
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add 'scrolled' class when scrolled down
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Optional: Smooth scroll to top on logo click
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Optional: Add entrance animation
    setTimeout(() => {
        header.style.opacity = '1';
        header.style.transform = 'translateY(0)';
    }, 100);
});

// Optional: Initial state for entrance animation
document.querySelector('.header').style.opacity = '0';
document.querySelector('.header').style.transform = 'translateY(-20px)';
document.querySelector('.header').style.transition = 'opacity 0.5s ease, transform 0.5s ease';

// ========================================
// LEARNING & GROWTH OUTCOMES
// Animated Vertical Bar Charts
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Intersection Observer for cards
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                
                setTimeout(() => {
                    entry.target.classList.add('visible');
                    
                    // Animate bars after card becomes visible
                    setTimeout(() => {
                        animateBars(entry.target);
                    }, 300);
                }, delay);
                
                cardObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all outcome cards
    document.querySelectorAll('.outcome-card').forEach(card => {
        cardObserver.observe(card);
    });
});

// Animate bars function
function animateBars(card) {
    const bars = card.querySelectorAll('.bar');
    const growthIndicator = card.querySelector('.growth-indicator');
    
    bars.forEach((bar, index) => {
        const targetValue = parseFloat(bar.dataset.value);
        
        // Start animation with slight delay between bars
        setTimeout(() => {
            bar.style.height = targetValue + '%';
            bar.classList.add('animated');
            
            // Animate the number counting up
            animateCounter(bar, targetValue);
        }, index * 400);
    });
    
    // Show growth indicator after bars animate
    setTimeout(() => {
        if (growthIndicator) {
            growthIndicator.classList.add('visible');
        }
    }, 2000);
}

// Counter animation function
function animateCounter(bar, targetValue) {
    const valueElement = bar.querySelector('.bar-value');
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth acceleration/deceleration
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        
        const currentValue = easeOutCubic * targetValue;
        valueElement.textContent = currentValue.toFixed(1) + '%';
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            // Ensure final value is exact
            valueElement.textContent = targetValue.toFixed(1) + '%';
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Optional: Add hover effect to bars
document.addEventListener('DOMContentLoaded', function() {
    const bars = document.querySelectorAll('.bar');
    
    bars.forEach(bar => {
        bar.addEventListener('mouseenter', function() {
            this.style.transform = 'scaleX(1.1)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        bar.addEventListener('mouseleave', function() {
            this.style.transform = 'scaleX(1)';
        });
    });
});

// Optional: Parallax effect on scroll
window.addEventListener('scroll', () => {
    const section = document.querySelector('.learning-growth-section');
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const scrolled = window.pageYOffset;
    
    if (rect.top < window.innerHeight && rect.bottom > 0) {
        const yPos = -(scrolled * 0.15);
        section.style.backgroundPosition = `center ${yPos}px`;
    }
});


// ========================================
// TESTIMONIALS SECTION - Interactive Carousel
// ========================================

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
        name: " Anisha Bhaskar Torres",
        school: "The University of Texas at Austin",
        year: "Class of 2027",
        image: "images/members/anisha.jpg",
        quote: "I found the preparation for industry as most impactful. For example, learning about agile methodologies, building web apps end-to-end, the DSA/Leetcode training. Those were so helpful and I feel so much more confident about my abilities now. "
    },
    {
        name: "Chinmayi Ranade",
        school: "George Mason University",
        year: "Class of 2027",
        image: "images/members/Chinmayi.jpeg",
        quote: "The weekly Codio assignments were incredibly valuable. Each one introduced new concepts and skills that built on one another, and I feel like I gained a strong foundation that I’ll continue applying in future projects. "
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
        quote: "Having access to the [Teaching Assistants] as mentors was really great, they were so friendly and helpful, and I loved getting to connect with people working in industry because I've never had that opportunity before! I definitely learned a lot about planning and building projects and I feel much more confident about developing my own future personal projects. "
    }
];

// Current slide index
let currentSlide = 0;
let isAnimating = false;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeTestimonials();
    setupEventListeners();
    startAutoPlay();
});

// Initialize testimonials
function initializeTestimonials() {
    updateTestimonial(0, false);
    updateProgressIndicator();
}

// Setup event listeners
function setupEventListeners() {
    // Previous arrow
    const prevArrow = document.querySelector('.prev-arrow');
    if (prevArrow) {
        prevArrow.addEventListener('click', () => {
            navigateTestimonial('prev');
        });
    }
    
    // Next arrow
    const nextArrow = document.querySelector('.next-arrow');
    if (nextArrow) {
        nextArrow.addEventListener('click', () => {
            navigateTestimonial('next');
        });
    }
    
    // Thumbnail clicks
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            if (index !== currentSlide) {
                updateTestimonial(index);
            }
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            navigateTestimonial('prev');
        } else if (e.key === 'ArrowRight') {
            navigateTestimonial('next');
        }
    });
    
    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    const testimonialContent = document.querySelector('.testimonial-content');
    if (testimonialContent) {
        testimonialContent.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        testimonialContent.addEventListener('touchend', (e) => {
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
        }
    }
}

// Navigate testimonial
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
    if (isAnimating) return;
    
    isAnimating = true;
    currentSlide = index;
    
    const testimonial = testimonials[index];
    const testimonialText = document.querySelector('.testimonial-text');
    
    // Add fade animation
    if (animate) {
        testimonialText.style.opacity = '0';
        testimonialText.style.transform = 'translateX(20px)';
    }
    
    setTimeout(() => {
        // Update content
        document.getElementById('current-member-image').src = testimonial.image;
        document.getElementById('current-member-name').textContent = testimonial.name;
        document.getElementById('current-testimonial').textContent = testimonial.quote;
        document.getElementById('current-member-school').textContent = testimonial.school;
        document.getElementById('current-member-year').textContent = testimonial.year;
        
        // Update active thumbnail
        document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
        
        // Update progress
        updateProgressIndicator();
        
        // Fade in
        if (animate) {
            testimonialText.style.opacity = '1';
            testimonialText.style.transform = 'translateX(0)';
        }
        
        setTimeout(() => {
            isAnimating = false;
        }, 100);
    }, animate ? 300 : 0);
}

// Update progress indicator
function updateProgressIndicator() {
    const currentSlideEl = document.querySelector('.current-slide');
    const totalSlidesEl = document.querySelector('.total-slides');
    
    if (currentSlideEl) {
        currentSlideEl.textContent = currentSlide + 1;
    }
    
    if (totalSlidesEl) {
        totalSlidesEl.textContent = testimonials.length;
    }
}

// Auto-play functionality
let autoPlayInterval;

function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
        navigateTestimonial('next');
    }, 7000); // Change slide every 7 seconds
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

// Pause auto-play on hover
const testimonialMain = document.querySelector('.testimonial-main');
if (testimonialMain) {
    testimonialMain.addEventListener('mouseenter', stopAutoPlay);
    testimonialMain.addEventListener('mouseleave', startAutoPlay);
}

// Pause auto-play when page is hidden
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopAutoPlay();
    } else {
        startAutoPlay();
    }
});

// Smooth transition styles
const testimonialText = document.querySelector('.testimonial-text');
if (testimonialText) {
    testimonialText.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
}


