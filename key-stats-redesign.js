/* ========================================
   KEY STATS SECTION - INTERACTIVE JAVASCRIPT
   Complete Redesign with Modern Animations
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    initKeyStatsSection();
});

function initKeyStatsSection() {
    const section = document.querySelector('.key-stats');
    if (!section) return;

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSection();
                sectionObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sectionObserver.observe(section);

    // Add interactive effects to stat cards
    addStatCardInteractions();
}

function animateSection() {
    // Animate header
    setTimeout(() => {
        const header = document.querySelector('.stats-header');
        if (header) header.classList.add('visible');
    }, 100);

    // Animate intro
    setTimeout(() => {
        const intro = document.querySelector('.stats-intro-wrapper');
        if (intro) intro.classList.add('visible');
    }, 300);

    // Animate stat cards with stagger
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('visible');
            animateCounter(card);
        }, 500 + (index * 120));
    });

    // Animate chart
    setTimeout(() => {
        const chartContainer = document.querySelector('.chart-container');
        if (chartContainer) {
            chartContainer.classList.add('visible');
        }
    }, 1200);

    // Animate chart summary
    setTimeout(() => {
        const summary = document.querySelector('.chart-stats-summary');
        if (summary) {
            summary.classList.add('visible');
        }
    }, 1500);
}

function animateCounter(card) {
    const numberElement = card.querySelector('.stat-number');
    const targetValue = parseFloat(card.getAttribute('data-stat'));
    const suffix = card.getAttribute('data-suffix') || '';

    if (!numberElement || isNaN(targetValue)) return;

    const duration = 2000;
    const startTime = performance.now();
    const isDecimal = targetValue % 1 !== 0;

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = easeOutQuart * targetValue;

        // Format the number
        if (isDecimal) {
            numberElement.textContent = currentValue.toFixed(2) + suffix;
        } else if (targetValue >= 1000) {
            numberElement.textContent = Math.floor(currentValue).toLocaleString() + suffix;
        } else {
            numberElement.textContent = Math.floor(currentValue) + suffix;
        }

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }

    requestAnimationFrame(updateCounter);
}

function addStatCardInteractions() {
    const statCards = document.querySelectorAll('.stat-card');

    statCards.forEach(card => {
        // Add ripple effect on click
        card.addEventListener('click', function(e) {
            createRipple(e, this);
        });

        // Add magnetic cursor effect
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const icon = this.querySelector('.stat-icon');
            const number = this.querySelector('.stat-number');

            if (icon) {
                icon.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.15) rotate(5deg)`;
            }
            if (number) {
                number.style.transform = `translate(${x * 0.05}px, ${y * 0.05}px) scale(1.1)`;
            }
        });

        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.stat-icon');
            const number = this.querySelector('.stat-number');

            if (icon) {
                icon.style.transform = '';
            }
            if (number) {
                number.style.transform = '';
            }
        });
    });
}

function createRipple(event, element) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple-effect';

    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(235, 0, 41, 0.3) 0%, transparent 70%);
        transform: scale(0);
        animation: rippleAnimation 0.6s ease-out;
        pointer-events: none;
        z-index: 10;
    `;

    element.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
}

// Enhanced Chart Configuration
window.addEventListener('load', () => {
    const growthCtx = document.getElementById('growthChart');
    if (!growthCtx) return;

    const ctx = growthCtx.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 480);
    gradient.addColorStop(0, 'rgba(235, 0, 41, 0.3)');
    gradient.addColorStop(0.5, 'rgba(235, 0, 41, 0.15)');
    gradient.addColorStop(1, 'rgba(235, 0, 41, 0.02)');

    const chart = new Chart(growthCtx, {
        type: 'line',
        data: {
            labels: ['2021', '2022', '2023', '2024', '2025'],
            datasets: [{
                label: 'Accepted Students',
                data: [62, 77, 111, 169, 164],
                borderColor: '#b30017',
                backgroundColor: gradient,
                fill: true,
                tension: 0.4,
                borderWidth: 4,
                pointRadius: 8,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#b30017',
                pointBorderWidth: 4,
                pointHoverRadius: 12,
                pointHoverBorderWidth: 5,
                pointHoverBackgroundColor: '#ffffff',
                pointHoverBorderColor: '#eb0029',
                pointHitRadius: 20
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: 15,
                    right: 20,
                    bottom: 15,
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
                    enabled: true,
                    backgroundColor: 'rgba(26, 26, 26, 0.95)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    padding: 16,
                    displayColors: false,
                    borderColor: '#eb0029',
                    borderWidth: 2,
                    cornerRadius: 10,
                    titleFont: {
                        size: 15,
                        weight: 'bold',
                        family: "'Founders Grotesk', sans-serif"
                    },
                    bodyFont: {
                        size: 16,
                        weight: '600',
                        family: "'Founders Grotesk', sans-serif"
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
                                const sign = change >= 0 ? '+' : '';
                                return `${arrow} ${Math.abs(change)} (${sign}${percentage}% from previous year)`;
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
                    max: 190,
                    ticks: {
                        stepSize: 30,
                        color: '#333333',
                        font: {
                            size: 13,
                            weight: '600',
                            family: "'Founders Grotesk', sans-serif"
                        },
                        padding: 10
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false,
                        lineWidth: 1
                    }
                },
                x: {
                    ticks: {
                        color: '#333333',
                        font: {
                            size: 14,
                            weight: '700',
                            family: "'Founders Grotesk', sans-serif"
                        },
                        padding: 10
                    },
                    grid: {
                        display: false
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart',
                onComplete: function() {
                    // Add subtle pulse to the chart after loading
                    const container = growthCtx.closest('.chart-container');
                    if (container) {
                        container.style.animation = 'none';
                    }
                }
            }
        }
    });

    // Add hover effect to chart container
    const chartContainer = growthCtx.closest('.chart-container');
    if (chartContainer) {
        chartContainer.addEventListener('mouseenter', () => {
            chart.options.animation.duration = 300;
        });
    }
});

// Add ripple animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleAnimation {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
