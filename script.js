// Navigation functionality
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle mobile menu
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
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
    
    // Mouse events
    card.addEventListener('mousedown', handleStart);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    
    // Touch events
    card.addEventListener('touchstart', handleStart, { passive: true });
    document.addEventListener('touchmove', handleMove, { passive: true });
    document.addEventListener('touchend', handleEnd);
    
    // Click event (for simple click to swipe)
    card.addEventListener('click', (e) => {
        const topCard = card.closest('.card-stack').querySelector('.stack-card:first-child');
        if (!isDragging && card === topCard) {
            // Simple click - swipe up
            swipeCard(card, 'up');
            setTimeout(onSwipe, 300);
        }
    });
    
    function handleStart(e) {
        const topCard = card.closest('.card-stack').querySelector('.stack-card:first-child');
        if (card !== topCard) return; // Only allow interaction with top card
        
        if (card.classList.contains('swiped-left') || 
            card.classList.contains('swiped-right') || 
            card.classList.contains('swiped-up')) return;
            
        isDragging = true;
        const touch = e.type === 'touchstart' ? e.touches[0] : e;
        startY = touch.clientY;
        startX = touch.clientX;
        card.style.transition = 'none';
        e.preventDefault();
    }
    
    function handleMove(e) {
        if (!isDragging) return;
        
        const touch = e.type === 'touchmove' ? e.touches : e;
        currentY = touch.clientY - startY;
        currentX = touch.clientX - startX;
        
        // Apply transform based on drag
        const rotation = currentX * 0.1;
        card.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${rotation}deg)`;
        
        // Change opacity based on distance
        const distance = Math.sqrt(currentX * currentX + currentY * currentY);
        const opacity = Math.max(0.3, 1 - distance / 200);
        card.style.opacity = opacity;
        
        e.preventDefault();
    }
    
    function handleEnd(e) {
        if (!isDragging) return;
        isDragging = false;
        
        card.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        const distance = Math.sqrt(currentX * currentX + currentY * currentY);
        const threshold = 100;
        
        if (distance > threshold) {
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
                    return;
                }
            }
            setTimeout(onSwipe, 300);
        } else {
            // Snap back
            resetCard(card);
        }
        
        currentX = 0;
        currentY = 0;
    }
}

function swipeCard(card, direction) {
    card.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    
    switch(direction) {
        case 'left':
            card.style.transform = 'translateX(-150%) rotate(-30deg)';
            card.classList.add('swiped-left');
            break;
        case 'right':
            card.style.transform = 'translateX(150%) rotate(30deg)';
            card.classList.add('swiped-right');
            break;
        case 'up':
            card.style.transform = 'translateY(-150%) scale(0.8)';
            card.classList.add('swiped-up');
            break;
    }
    card.style.opacity = '0';
}

function resetCard(card) {
    card.style.transform = '';
    card.style.opacity = '';
}

function removeTopCard(stack, counterElement, callback) {
    const topCard = stack.querySelector('.stack-card:first-child');
    
    if (topCard) {
        // Move the top card to the bottom of the stack
        setTimeout(() => {
            // Reset all styles and classes
            topCard.classList.remove('swiped-left', 'swiped-right', 'swiped-up');
            topCard.style.transform = '';
            topCard.style.opacity = '';
            topCard.style.transition = '';
            
            // Move to bottom
            stack.appendChild(topCard);
            
            // Update stack order with a slight delay to ensure DOM update
            setTimeout(() => {
                updateStackOrder(stack);
                callback();
            }, 50);
        }, 300);
    }
}

function updateStackOrder(stack) {
    const cards = Array.from(stack.querySelectorAll('.stack-card'));
    
    cards.forEach((card, index) => {
        // Clear any existing inline styles that might interfere
        card.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        // Set z-index
        card.style.zIndex = cards.length - index;
        
        // Apply stacking transforms
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

// Parallax effect for hero section (reduced for better readability)
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero && scrolled < window.innerHeight) {
        // Reduced parallax effect and only apply within hero section
        hero.style.transform = `translateY(${scrolled * 0.2}px)`;
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

// Project card hover effects
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
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

// Initialize on page load
window.addEventListener('load', () => {
    revealElements();
    
    // Add loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
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

// Add ripple effect to all buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', createRipple);
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
