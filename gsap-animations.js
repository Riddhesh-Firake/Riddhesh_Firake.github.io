// GSAP Animations for Portfolio
// This file contains all GSAP-based animations while preserving existing functionality

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// GSAP Animation Controller
class GSAPAnimationController {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupAnimations());
        } else {
            this.setupAnimations();
        }
        
        // Ensure animations work on page refresh
        window.addEventListener('load', () => {
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 100);
        });
    }

    setupAnimations() {
        // Ensure all sections are visible by default before animating
        this.ensureElementsVisible();
        this.setupPreloader();
        this.setupNavbarAnimations();
        this.setupHeroAnimations();
        this.setupTypingAnimation();
        this.setupScrollAnimations();
        this.setupCardStackAnimations();
        this.setupTimelineAnimations();
        this.setupParallaxEffects();
        this.setupHoverAnimations();
        this.setupButtonAnimations();
        this.setupCounterAnimations();
        this.setupFormAnimations();
    }

    ensureElementsVisible() {
        // Make sure all critical sections are visible by default
        const criticalSections = [
            '.achievements', '.achievements-grid', '.achievement-card',
            '.experience', '.timeline', '.timeline-item', '.timeline-content',
            '.contact', '.contact-form', '.form-group',
            '.about', '.skills', '.projects',
            '.skills-grid', '.skill-category-card', '.skill-item',
            '.projects-grid', '.project-grid-card'
        ];

        criticalSections.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            if (elements.length === 0) {
                console.warn(`GSAP: No elements found for selector: ${selector}`);
            }
            elements.forEach(element => {
                gsap.set(element, { 
                    opacity: 1, 
                    visibility: 'visible',
                    clearProps: 'transform'
                });
            });
        });

        // Debug log
        console.log('GSAP: All sections set to visible');
    }

    setupPreloader() {
        // Gentle page load animation without hiding content
        gsap.set("body", { opacity: 0.3 });
        
        gsap.to("body", {
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            delay: 0.2
        });

        // Animate navbar entrance
        gsap.fromTo(".navbar", 
            { y: -50, opacity: 0.5 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.5 }
        );
    }

    setupNavbarAnimations() {
        // Enhanced navbar scroll animation
        ScrollTrigger.create({
            trigger: "body",
            start: "100px top",
            end: "bottom bottom",
            onUpdate: (self) => {
                if (self.direction === 1) {
                    // Scrolling down
                    gsap.to(".navbar", {
                        y: -100,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                } else {
                    // Scrolling up
                    gsap.to(".navbar", {
                        y: 0,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            }
        });

        // Mobile menu animations
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    gsap.to(".nav-menu", {
                        opacity: 0,
                        y: -20,
                        duration: 0.3,
                        ease: "power2.out",
                        onComplete: () => {
                            navMenu.classList.remove('active');
                        }
                    });
                } else {
                    navMenu.classList.add('active');
                    gsap.fromTo(".nav-menu", 
                        { opacity: 0, y: -20 },
                        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
                    );
                }
            });
        }

        // Smooth navigation link hover effects
        gsap.utils.toArray('.nav-link').forEach(link => {
            link.addEventListener('mouseenter', () => {
                gsap.to(link, { scale: 1.05, duration: 0.2, ease: "power2.out" });
            });
            
            link.addEventListener('mouseleave', () => {
                gsap.to(link, { scale: 1, duration: 0.2, ease: "power2.out" });
            });
        });
    }

    setupHeroAnimations() {
        // Hero content entrance animation
        const tl = gsap.timeline({ delay: 0.8 });
        
        tl.from(".hero-title", {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: "power3.out"
        })
        .from(".hero-subtitle", {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: "power3.out"
        }, "-=0.5")
        .from(".hero-description", {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: "power3.out"
        }, "-=0.4")
        .from(".hero-buttons .btn", {
            opacity: 0,
            y: 30,
            duration: 0.6,
            stagger: 0.2,
            ease: "power3.out"
        }, "-=0.3")
        .from(".profile-card", {
            opacity: 0,
            scale: 0.8,
            rotation: 10,
            duration: 1,
            ease: "back.out(1.7)"
        }, "-=0.8");

        // Enhanced floating animation for profile card
        gsap.to(".profile-card", {
            y: -20,
            duration: 3,
            ease: "power1.inOut",
            yoyo: true,
            repeat: -1
        });

        // Scroll indicator animation
        gsap.from(".scroll-indicator", {
            opacity: 0,
            y: 20,
            duration: 1,
            delay: 2,
            ease: "power2.out"
        });

        gsap.to(".scroll-arrow", {
            y: 10,
            duration: 1.5,
            ease: "power1.inOut",
            yoyo: true,
            repeat: -1
        });
    }

    setupScrollAnimations() {
        // Section titles animation - ensure they're visible by default
        gsap.utils.toArray('.section-title').forEach(title => {
            // Set initial state but don't hide completely
            gsap.set(title, { opacity: 1, y: 0 });
            
            gsap.fromTo(title, 
                { opacity: 0.3, y: 30 },
                {
                    scrollTrigger: {
                        trigger: title,
                        start: "top 85%",
                        end: "bottom 20%",
                        toggleActions: "play none none reverse"
                    },
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power3.out"
                }
            );
        });

        // About section animations
        ScrollTrigger.create({
            trigger: ".about",
            start: "top 80%",
            animation: gsap.timeline()
                .fromTo(".about-text", 
                    { opacity: 0.5, x: -30 },
                    { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }
                )
                .fromTo(".about-image", 
                    { opacity: 0.5, x: 30 },
                    { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }, "-=0.4"
                )
                .fromTo(".stat", 
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power3.out" }, "-=0.3"
                )
        });

        // Skills Grid Animation (Desktop)
        ScrollTrigger.create({
            trigger: ".skills-grid",
            start: "top 80%",
            animation: gsap.fromTo(".skill-category-card", 
                { 
                    opacity: 0, 
                    y: 40,
                    scale: 0.95
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: "back.out(1.7)"
                }
            )
        });

        // Skills section animation (Mobile Stack)
        ScrollTrigger.create({
            trigger: ".skills",
            start: "top 80%",
            animation: gsap.timeline()
                .fromTo(".card-stack", 
                    { opacity: 0.3, scale: 0.9 },
                    { opacity: 1, scale: 1, duration: 1, ease: "back.out(1.7)" }
                )
                .fromTo(".stack-indicators", 
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.5"
                )
        });

        // Projects Grid Animation (Desktop)
        ScrollTrigger.create({
            trigger: ".projects-grid",
            start: "top 80%",
            animation: gsap.fromTo(".project-grid-card", 
                { 
                    opacity: 0, 
                    y: 50,
                    scale: 0.9
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: "back.out(1.7)"
                }
            )
        });

        // Projects section animation (Mobile Stack)
        ScrollTrigger.create({
            trigger: ".projects",
            start: "top 80%",
            animation: gsap.timeline()
                .fromTo(".projects .card-stack", 
                    { opacity: 0.3, scale: 0.9 },
                    { opacity: 1, scale: 1, duration: 1, ease: "back.out(1.7)" }
                )
                .fromTo(".projects .stack-indicators", 
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.5"
                )
        });

        // Achievements section animation - FIXED
        ScrollTrigger.create({
            trigger: ".achievements",
            start: "top 80%",
            animation: gsap.fromTo(".achievement-card", 
                { 
                    opacity: 0, 
                    y: 40,
                    scale: 0.95
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: "back.out(1.7)"
                }
            )
        });

        // Experience/Education section animation - FIXED
        ScrollTrigger.create({
            trigger: ".experience",
            start: "top 80%",
            animation: gsap.timeline()
                .fromTo(".timeline", 
                    { opacity: 0.3 },
                    { opacity: 1, duration: 0.8, ease: "power3.out" }
                )
                .fromTo(".timeline-item", 
                    { opacity: 0, x: -40 },
                    { opacity: 1, x: 0, duration: 0.8, stagger: 0.2, ease: "power3.out" }, "-=0.4"
                )
        });

        // Contact section animation - FIXED
        ScrollTrigger.create({
            trigger: ".contact",
            start: "top 80%",
            animation: gsap.timeline()
                .fromTo(".contact-info", 
                    { opacity: 0, x: -40 },
                    { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }
                )
                .fromTo(".contact-form", 
                    { opacity: 0, x: 40 },
                    { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }, "-=0.5"
                )
                .fromTo(".form-group", 
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" }, "-=0.3"
                )
        });
    }

    setupCardStackAnimations() {
        // Enhanced card stack animations
        gsap.utils.toArray('.card-stack').forEach(stack => {
            ScrollTrigger.create({
                trigger: stack,
                start: "top 80%",
                animation: gsap.from(stack.querySelectorAll('.stack-card'), {
                    opacity: 0,
                    y: 100,
                    rotation: 5,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "back.out(1.7)"
                })
            });
        });

        // Skill items individual animations
        gsap.utils.toArray('.skill-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                gsap.to(item, {
                    scale: 1.05,
                    y: -5,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            item.addEventListener('mouseleave', () => {
                gsap.to(item, {
                    scale: 1,
                    y: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });
    }

    setupTimelineAnimations() {
        // Enhanced timeline animations
        const timeline = document.querySelector('.timeline');
        if (!timeline) return;

        // Make sure timeline is visible by default
        gsap.set(timeline, { opacity: 1 });

        // Animate timeline line drawing - but ensure visibility
        const timelineLine = timeline;
        if (timelineLine) {
            ScrollTrigger.create({
                trigger: timeline,
                start: "top 80%",
                animation: gsap.timeline()
                    .set(".pencil-container", { opacity: 1 })
                    .fromTo(".pencil-container", 
                        { y: -40, scale: 0.8 },
                        { y: 0, scale: 1, duration: 0.6, ease: "back.out(1.7)" }
                    )
                    .to(".pencil-container", {
                        y: 300,
                        duration: 2,
                        ease: "power1.inOut"
                    }, "+=0.3")
                    .to(".pencil-container", { 
                        opacity: 0, 
                        duration: 0.5 
                    }, "-=0.5")
            });
        }

        // Timeline items animation - ensure they're visible
        gsap.utils.toArray('.timeline-item').forEach((item, index) => {
            // Set initial visibility
            gsap.set(item, { opacity: 1 });
            gsap.set(item.querySelector('.timeline-dot'), { opacity: 1 });
            gsap.set(item.querySelector('.timeline-content'), { opacity: 1 });

            ScrollTrigger.create({
                trigger: item,
                start: "top 85%",
                animation: gsap.timeline()
                    .fromTo(item, 
                        { opacity: 0.3, x: -30 },
                        { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }
                    )
                    .fromTo(item.querySelector('.timeline-dot'), 
                        { scale: 0.3 },
                        { scale: 1, duration: 0.4, ease: "back.out(1.7)" }, "-=0.4"
                    )
                    .fromTo(item.querySelector('.timeline-content'), 
                        { opacity: 0.5, y: 15 },
                        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.2"
                    )
            });
        });
    }

    setupParallaxEffects() {
        // Enhanced parallax for hero section
        gsap.to(".hero::before", {
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: 1
            },
            y: -200,
            ease: "none"
        });

        // Parallax for profile image
        gsap.to(".profile-image img", {
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: 1
            },
            y: -100,
            ease: "none"
        });

        // Background elements parallax
        gsap.utils.toArray('.achievement-card').forEach((card, index) => {
            gsap.to(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1
                },
                y: -30 * (index % 2 === 0 ? 1 : -1),
                ease: "none"
            });
        });
    }

    setupHoverAnimations() {
        // Enhanced project grid card hover effects
        gsap.utils.toArray('.project-grid-card').forEach(card => {
            const tl = gsap.timeline({ paused: true });
            
            tl.to(card, {
                y: -15,
                scale: 1.02,
                duration: 0.3,
                ease: "power2.out"
            })
            .to(card.querySelector('.project-grid-image img'), {
                scale: 1.1,
                duration: 0.3,
                ease: "power2.out"
            }, 0)
            .to(card.querySelector('.project-grid-overlay'), {
                opacity: 1,
                duration: 0.3,
                ease: "power2.out"
            }, 0);

            card.addEventListener('mouseenter', () => tl.play());
            card.addEventListener('mouseleave', () => tl.reverse());
        });

        // Skill category card hover animations
        gsap.utils.toArray('.skill-category-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    y: -10,
                    scale: 1.02,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    y: 0,
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });

        // Enhanced skill item hover effects
        gsap.utils.toArray('.skill-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                gsap.to(item, {
                    scale: 1.05,
                    y: -5,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            item.addEventListener('mouseleave', () => {
                gsap.to(item, {
                    scale: 1,
                    y: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });

        // Enhanced project card hover effects (for mobile stack)
        gsap.utils.toArray('.project-card').forEach(card => {
            const tl = gsap.timeline({ paused: true });
            
            tl.to(card, {
                y: -15,
                scale: 1.02,
                duration: 0.3,
                ease: "power2.out"
            })
            .to(card.querySelector('.project-image img'), {
                scale: 1.1,
                duration: 0.3,
                ease: "power2.out"
            }, 0)
            .to(card.querySelector('.project-overlay'), {
                opacity: 1,
                duration: 0.3,
                ease: "power2.out"
            }, 0);

            card.addEventListener('mouseenter', () => tl.play());
            card.addEventListener('mouseleave', () => tl.reverse());
        });

        // Achievement card hover animations
        gsap.utils.toArray('.achievement-card').forEach(card => {
            const icon = card.querySelector('.achievement-icon');
            
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    y: -15,
                    scale: 1.02,
                    duration: 0.4,
                    ease: "power2.out"
                });
                
                gsap.to(icon, {
                    scale: 1.15,
                    rotation: 360,
                    duration: 0.6,
                    ease: "back.out(1.7)"
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    y: 0,
                    scale: 1,
                    duration: 0.4,
                    ease: "power2.out"
                });
                
                gsap.to(icon, {
                    scale: 1,
                    rotation: 0,
                    duration: 0.4,
                    ease: "power2.out"
                });
            });
        });

        // Social link hover effects
        gsap.utils.toArray('.social-link').forEach(link => {
            link.addEventListener('mouseenter', () => {
                gsap.to(link, {
                    scale: 1.2,
                    y: -5,
                    duration: 0.3,
                    ease: "back.out(1.7)"
                });
            });

            link.addEventListener('mouseleave', () => {
                gsap.to(link, {
                    scale: 1,
                    y: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });
    }

    setupButtonAnimations() {
        // Enhanced button animations
        gsap.utils.toArray('.btn').forEach(btn => {
            // Ripple effect on click
            btn.addEventListener('click', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const ripple = document.createElement('span');
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.6);
                    transform: scale(0);
                    left: ${x}px;
                    top: ${y}px;
                    width: 20px;
                    height: 20px;
                    margin-left: -10px;
                    margin-top: -10px;
                    pointer-events: none;
                `;

                btn.appendChild(ripple);

                gsap.to(ripple, {
                    scale: 10,
                    opacity: 0,
                    duration: 0.6,
                    ease: "power2.out",
                    onComplete: () => ripple.remove()
                });
            });

            // Hover effects
            btn.addEventListener('mouseenter', () => {
                gsap.to(btn, {
                    scale: 1.05,
                    y: -3,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    scale: 1,
                    y: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });
    }

    setupCounterAnimations() {
        // Animated counters for stats
        gsap.utils.toArray('.stat h3').forEach(stat => {
            ScrollTrigger.create({
                trigger: stat,
                start: "top 80%",
                onEnter: () => {
                    const finalValue = stat.textContent;
                    const isDecimal = finalValue.includes('.');
                    
                    gsap.fromTo(stat, 
                        { textContent: 0 },
                        {
                            textContent: finalValue,
                            duration: 2,
                            ease: "power2.out",
                            snap: isDecimal ? { textContent: 0.01 } : { textContent: 1 },
                            onUpdate: function() {
                                if (!isDecimal) {
                                    stat.textContent = Math.ceil(this.targets()[0].textContent);
                                }
                            }
                        }
                    );
                }
            });
        });
    }

    // Enhanced typing animation with GSAP
    setupTypingAnimation() {
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
        
        const typeText = () => {
            const currentText = texts[textIndex];
            
            gsap.to(dynamicElement, {
                text: currentText,
                duration: currentText.length * 0.05,
                ease: "none",
                onComplete: () => {
                    gsap.to(dynamicElement, {
                        text: "",
                        duration: currentText.length * 0.02,
                        ease: "none",
                        delay: 2,
                        onComplete: () => {
                            textIndex = (textIndex + 1) % texts.length;
                            typeText();
                        }
                    });
                }
            });
        };

        // Start typing animation
        setTimeout(typeText, 2000);
    }

    // Form animations
    setupFormAnimations() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        // Input focus animations
        gsap.utils.toArray('.form-group input, .form-group textarea').forEach(input => {
            input.addEventListener('focus', () => {
                gsap.to(input, {
                    scale: 1.02,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            input.addEventListener('blur', () => {
                gsap.to(input, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });

        // Form submission animation
        form.addEventListener('submit', (e) => {
            const submitBtn = form.querySelector('.btn');
            
            gsap.to(submitBtn, {
                scale: 0.95,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut"
            });
        });
    }
}

// Initialize GSAP animations
const gsapController = new GSAPAnimationController();

// Export for potential external use
window.GSAPAnimationController = GSAPAnimationController;
