// Navigation functionality
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle mobile menu with GSAP integration
navToggle.addEventListener('click', () => {
    // Only use basic toggle if GSAP is not handling it
    if (typeof gsap === 'undefined' || !window.GSAPAnimationController) {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    }
    // GSAP handles the animation if available
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Navbar scroll effect with GSAP integration
window.addEventListener('scroll', () => {
    // Only apply basic scroll effects if GSAP is not handling it
    if (typeof gsap === 'undefined' || !window.GSAPAnimationController) {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Dynamic typing animation with backspace effect
function dynamicTypeWriter() {
    const dynamicElement = document.getElementById('dynamic-text');
    if (!dynamicElement) return;
    
    // Check if GSAP is available and use enhanced version
    if (typeof gsap !== 'undefined' && gsap.to) {
        // GSAP version will handle this
        return;
    }
    
    // Fallback to original typing animation
    const texts = [
        'Riddhesh Firake',
        'a Developer',
        'a Coder',
        'an Engineer',
        'a Problem Solver',
        'a Hackathon Winner',
        'an Innovator'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            // Backspacing
            dynamicElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50; // Faster backspacing
            
            if (charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typeSpeed = 500; // Pause before typing next word
            }
        } else {
            // Typing
            dynamicElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100; // Normal typing speed
            
            if (charIndex === currentText.length) {
                isDeleting = true;
                typeSpeed = 2000; // Pause before starting to delete
            }
        }
        
        setTimeout(type, typeSpeed);
    }
    
    // Start the animation
    setTimeout(type, 1000); // Initial delay
}

// Initialize dynamic typing animation when page loads
window.addEventListener('load', () => {
    dynamicTypeWriter();
    initializeCardStacks();
});

// Initialize Card Stack functionality
// Initialize Card Stack functionality
function initializeCardStacks() {
    initSkillsStack();
    initProjectsStack();
}

function initSkillsStack() {
    const stack = document.getElementById('skills-stack');
    const cards = stack.querySelectorAll('.stack-card');
    const currentElement = document.getElementById('skills-current');
    const totalElement = document.getElementById('skills-total');
    
    let currentIndex = 0;
    const totalCards = cards.length;
    
    totalElement.textContent = totalCards;
    updateCounter(currentElement, currentIndex + 1);
    
    // Initialize stack order immediately
    updateStackOrder(stack);
    
    cards.forEach((card, index) => {
        addCardInteraction(card, () => {
            removeTopCard(stack, currentElement, () => {
                currentIndex = (currentIndex + 1) % totalCards;
                updateCounter(currentElement, currentIndex + 1);
            });
        });
    });
}

function initProjectsStack() {
    const stack = document.getElementById('projects-stack');
    const cards = stack.querySelectorAll('.stack-card');
    const currentElement = document.getElementById('projects-current');
    const totalElement = document.getElementById('projects-total');
    
    let currentIndex = 0;
    const totalCards = cards.length;
    
    totalElement.textContent = totalCards;
    updateCounter(currentElement, currentIndex + 1);
    
    // Initialize stack order immediately
    updateStackOrder(stack);
    
    cards.forEach((card, index) => {
        addCardInteraction(card, () => {
            removeTopCard(stack, currentElement, () => {
                currentIndex = (currentIndex + 1) % totalCards;
                updateCounter(currentElement, currentIndex + 1);
            });
        });
    });
}

function addCardInteraction(card, onSwipe) {
    let startY = 0;
    let startX = 0;
    let currentY = 0;
    let currentX = 0;
    let isDragging = false;
    let isAnimating = false;
    let dragStarted = false;
    
    // Remove existing event listeners to prevent duplicates
    card.removeEventListener('mousedown', handleStart);
    card.removeEventListener('touchstart', handleStart);
    card.removeEventListener('click', handleClick);
    
    // Mouse events
    card.addEventListener('mousedown', handleStart);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('mouseleave', handleEnd); // Handle mouse leaving window
    
    // Touch events
    card.addEventListener('touchstart', handleStart, { passive: false });
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);
    document.addEventListener('touchcancel', handleEnd); // Handle touch cancellation
    
    // Click event (for simple click to swipe)
    card.addEventListener('click', handleClick);
    
    function handleClick(e) {
        const stack = card.closest('.card-stack');
        const topCard = stack.querySelector('.stack-card:first-child');
        if (!isDragging && !dragStarted && !isAnimating && card === topCard) {
            e.preventDefault();
            e.stopPropagation();
            // Simple click - swipe up
            isAnimating = true;
            swipeCard(card, 'up');
            setTimeout(() => {
                onSwipe();
                isAnimating = false;
            }, 250); // Reduced timeout
        }
    }
    
    function handleStart(e) {
        const stack = card.closest('.card-stack');
        const topCard = stack.querySelector('.stack-card:first-child');
        if (card !== topCard || isAnimating) return;
        
        if (card.classList.contains('swiped-left') || 
            card.classList.contains('swiped-right') || 
            card.classList.contains('swiped-up')) return;
            
        isDragging = true;
        dragStarted = false;
        const touch = e.type === 'touchstart' ? e.touches[0] : e;
        startY = touch.clientY;
        startX = touch.clientX;
        currentX = 0;
        currentY = 0;
        
        // Prevent any transitions and visual artifacts
        card.style.transition = 'none';
        card.style.willChange = 'transform';
        card.style.pointerEvents = 'auto';
        
        // Prevent default to avoid scrolling on mobile and selection on desktop
        e.preventDefault();
        e.stopPropagation();
    }
    
    function handleMove(e) {
        if (!isDragging || isAnimating) return;
        
        const touch = e.type === 'touchmove' ? e.touches[0] : e;
        if (!touch) return; // Safety check for mouse events
        
        currentY = touch.clientY - startY;
        currentX = touch.clientX - startX;
        
        // Mark that actual dragging has started (not just a tap)
        if (!dragStarted && (Math.abs(currentX) > 5 || Math.abs(currentY) > 5)) {
            dragStarted = true;
        }
        
        if (dragStarted) {
            // Apply transform based on drag
            const rotation = currentX * 0.06; // Reduced rotation for smoother feel
            const scale = Math.max(0.98, 1 - Math.abs(currentX) / 1000);
            card.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${rotation}deg) scale(${scale})`;
            
            // Different opacity handling for mobile vs desktop
            const isMobile = e.type.includes('touch');
            if (isMobile) {
                // Very subtle opacity change for mobile feedback
                const distance = Math.sqrt(currentX * currentX + currentY * currentY);
                const opacity = Math.max(0.9, 1 - distance / 500);
                card.style.opacity = opacity;
            } else {
                // NO opacity change for desktop - solid object behavior
                card.style.opacity = '1';
            }
        }
        
        e.preventDefault();
        e.stopPropagation();
    }
    
    function handleEnd(e) {
        if (!isDragging || isAnimating) return;
        isDragging = false;
        
        // Reset will-change immediately
        card.style.willChange = 'auto';
        
        // Only process swipe if actual dragging occurred
        if (dragStarted) {
            const distance = Math.sqrt(currentX * currentX + currentY * currentY);
            const threshold = 70; // Reduced threshold
            
            if (distance > threshold) {
                isAnimating = true;
                // Quick transition for swipe animation
                card.style.transition = 'all 0.25s cubic-bezier(0.4, 0.0, 0.2, 1)';
                
                // Determine swipe direction
                if (Math.abs(currentX) > Math.abs(currentY)) {
                    // Horizontal swipe
                    if (currentX > 0) {
                        swipeCard(card, 'right');
                    } else {
                        swipeCard(card, 'left');
                    }
                } else {
                    // Vertical swipe
                    if (currentY < 0) {
                        swipeCard(card, 'up');
                    } else {
                        // Snap back for down swipe
                        resetCard(card);
                        isAnimating = false;
                        dragStarted = false;
                        return;
                    }
                }
                
                // Faster callback with no flash
                setTimeout(() => {
                    onSwipe();
                    isAnimating = false;
                    dragStarted = false;
                }, 250);
            } else {
                // Snap back with quick transition
                card.style.transition = 'all 0.15s cubic-bezier(0.4, 0.0, 0.2, 1)';
                resetCard(card);
                dragStarted = false;
            }
        } else {
            // Just a tap, reset immediately
            resetCard(card);
            dragStarted = false;
        }
        
        currentX = 0;
        currentY = 0;
    }
}

function swipeCard(card, direction) {
    // Use very fast transition to minimize flash
    card.style.transition = 'all 0.25s cubic-bezier(0.4, 0.0, 0.2, 1)';
    card.style.willChange = 'transform, opacity';
    card.style.pointerEvents = 'none';
    
    switch(direction) {
        case 'left':
            card.style.transform = 'translateX(-130%) rotate(-20deg) scale(0.7)';
            card.classList.add('swiped-left');
            break;
        case 'right':
            card.style.transform = 'translateX(130%) rotate(20deg) scale(0.7)';
            card.classList.add('swiped-right');
            break;
        case 'up':
            card.style.transform = 'translateY(-130%) scale(0.6)';
            card.classList.add('swiped-up');
            break;
    }
    card.style.opacity = '0';
}

function resetCard(card) {
    // Reset to original position smoothly
    card.style.transform = '';
    card.style.opacity = '1';
    card.style.willChange = 'auto';
    card.style.pointerEvents = 'auto';
    
    // Clear transition after reset
    setTimeout(() => {
        card.style.transition = '';
    }, 150);
}

function removeTopCard(stack, counterElement, callback) {
    const topCard = stack.querySelector('.stack-card:first-child');
    
    if (topCard) {
        // Immediately hide the card to prevent flash
        topCard.style.visibility = 'hidden';
        
        // Move the top card to the bottom of the stack
        setTimeout(() => {
            // Reset all styles and classes instantly
            topCard.style.transition = 'none';
            topCard.style.visibility = 'visible';
            topCard.classList.remove('swiped-left', 'swiped-right', 'swiped-up');
            topCard.style.transform = '';
            topCard.style.opacity = '';
            topCard.style.pointerEvents = '';
            topCard.style.willChange = 'auto';
            
            // Move to bottom instantly
            stack.appendChild(topCard);
            
            // Force immediate reflow
            topCard.offsetHeight;
            
            // Update stack order instantly
            updateStackOrder(stack);
            
            // Execute callback immediately
            if (callback) callback();
        }, 250); // Match the swipe animation timing
    }
}

function updateStackOrder(stack) {
    const cards = Array.from(stack.querySelectorAll('.stack-card'));
    
    cards.forEach((card, index) => {
        // Set z-index immediately
        card.style.zIndex = cards.length - index;
        
        // Apply stacking transforms only to cards that aren't being swiped
        if (!card.classList.contains('swiped-left') && 
            !card.classList.contains('swiped-right') && 
            !card.classList.contains('swiped-up')) {
            
            // No transition for instant positioning
            card.style.transition = 'none';
            
            if (index === 0) {
                card.style.transform = 'translateY(0px) scale(1)';
                card.style.opacity = '1';
            } else if (index === 1) {
                card.style.transform = 'translateY(-10px) scale(0.95)';
                card.style.opacity = '0.9';
            } else if (index === 2) {
                card.style.transform = 'translateY(-20px) scale(0.9)';
                card.style.opacity = '0.8';
            } else if (index === 3) {
                card.style.transform = 'translateY(-30px) scale(0.85)';
                card.style.opacity = '0.7';
            } else {
                card.style.transform = 'translateY(-40px) scale(0.8)';
                card.style.opacity = '0.6';
            }
            
            // Re-enable transitions after positioning
            setTimeout(() => {
                if (!card.style.willChange || card.style.willChange === 'auto') {
                    card.style.transition = 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                }
            }, 50);
        }
    });
}

function updateCounter(element, value) {
    element.style.transform = 'scale(1.2)';
    element.style.color = 'var(--primary-color)';
    
    setTimeout(() => {
        element.textContent = value;
        element.style.transform = 'scale(1)';
        element.style.color = 'var(--text-primary)';
    }, 150);
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
        }
    });
}, observerOptions);

// Add animation classes to elements
function addScrollAnimations() {
    const animatedElements = [
        { selector: '.about-text', animation: 'fade-in' },
        { selector: '.about-image', animation: 'slide-in-right' },
        { selector: '.skill-category', animation: 'scale-in' },
        { selector: '.project-card', animation: 'fade-in' },
        { selector: '.timeline-item', animation: 'slide-in-left' },
        { selector: '.contact-info', animation: 'slide-in-left' },
        { selector: '.contact-form', animation: 'slide-in-right' }
    ];

    animatedElements.forEach(({ selector, animation }) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            element.classList.add(animation);
            element.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(element);
        });
    });
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', addScrollAnimations);

// Skills animation
function animateSkills() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.classList.add('animate-skill');
    });
}

// Add CSS for skill animation
const skillAnimation = `
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .animate-skill {
        animation: slideInUp 0.6s ease forwards;
        opacity: 0;
    }
`;

// Add the animation CSS to the document
const style = document.createElement('style');
style.textContent = skillAnimation;
document.head.appendChild(style);

// Animate skills when skills section comes into view
const skillsSection = document.getElementById('skills');
if (skillsSection) {
    observer.observe(skillsSection);
    skillsSection.addEventListener('animationstart', animateSkills);
}

// Contact form handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Here you would typically send the data to a server
        // For this demo, we'll just show a success message
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        
        // Reset form
        this.reset();
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Parallax effect for hero section with GSAP integration
window.addEventListener('scroll', () => {
    // Only apply basic parallax if GSAP is not handling it
    if (typeof gsap === 'undefined' || !window.GSAPAnimationController) {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero && scrolled < window.innerHeight) {
            // Reduced parallax effect and only apply within hero section
            hero.style.transform = `translateY(${scrolled * 0.2}px)`;
        }
    }
});

// Dynamic background particles
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    particlesContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        z-index: 0;
    `;
    
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.appendChild(particlesContainer);
        
        // Create floating particles
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                animation: float-particle ${Math.random() * 10 + 10}s linear infinite;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
            `;
            particlesContainer.appendChild(particle);
        }
    }
}

// Add particle animation CSS
const particleAnimation = `
    @keyframes float-particle {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;

style.textContent += particleAnimation;

// Initialize particles
createParticles();

// Project card hover effects with GSAP integration
document.querySelectorAll('.project-card').forEach(card => {
    // Only add basic hover effects if GSAP is not handling them
    if (typeof gsap === 'undefined' || !window.GSAPAnimationController) {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    }
    // GSAP handles enhanced hover effects if available
});

// Smooth reveal animation for elements
function revealElements() {
    const reveals = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
    
    reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

// Throttle scroll events for better performance
let ticking = false;

function updateScrollAnimations() {
    revealElements();
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateScrollAnimations);
        ticking = true;
    }
});

// Initialize on page load with GSAP integration
window.addEventListener('load', () => {
    dynamicTypeWriter();
    initializeCardStacks();
    
    // Ensure all sections are visible - fallback for GSAP issues
    const criticalSections = [
        '.achievements', '.achievement-card', 
        '.experience', '.timeline-item',
        '.contact', '.contact-form'
    ];
    
    criticalSections.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.style.opacity = '1';
            element.style.visibility = 'visible';
            element.style.transform = 'none';
        });
    });
    
    revealElements();
    
    // Enhanced loading animation with GSAP fallback
    if (typeof gsap === 'undefined') {
        // Fallback animation if GSAP is not loaded
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    }
    // GSAP handles page load animation if available
    
    console.log('Portfolio loaded - all sections should be visible');
});

// Dynamic year in footer
const currentYear = new Date().getFullYear();
const footerText = document.querySelector('.footer p');
if (footerText) {
    footerText.textContent = footerText.textContent.replace('2025', currentYear);
}

// Add ripple effect to buttons
function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add('ripple');
    
    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
        ripple.remove();
    }
    
    button.appendChild(circle);
}

// Add ripple CSS
const rippleCSS = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 600ms linear;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;

style.textContent += rippleCSS;

// Add ripple effect to all buttons with GSAP integration
document.querySelectorAll('.btn').forEach(btn => {
    // Only add basic ripple if GSAP is not handling it
    if (typeof gsap === 'undefined' || !window.GSAPAnimationController) {
        btn.addEventListener('click', createRipple);
    }
    // GSAP handles enhanced button animations if available
});

// Performance optimization: Lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
lazyLoadImages();

// Add smooth transitions for theme switching (future enhancement)
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            localStorage.setItem('darkTheme', document.body.classList.contains('dark-theme'));
        });
        
        // Load saved theme
        if (localStorage.getItem('darkTheme') === 'true') {
            document.body.classList.add('dark-theme');
        }
    }
}

initThemeToggle();

// Timeline Animation Setup
function setupTimelineAnimation() {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;

    // Trigger animation when timeline comes into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                timeline.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3
    });

    observer.observe(timeline);
}

// Initialize timeline animation when page loads
document.addEventListener('DOMContentLoaded', () => {
    setupTimelineAnimation();
});
