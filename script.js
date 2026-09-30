(() => {
    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', () => {
        // 12. Smooth Page Load
        document.body.classList.add('loaded');

        // 1. Announcement Ribbon Dismiss
        const ribbon = document.getElementById('ribbon');
        const ribbonClose = document.getElementById('ribbonClose');
        
        if (ribbon && ribbonClose) {
            const isRibbonDismissed = localStorage.getItem('kiranAcademyRibbonDismissed');
            
            if (isRibbonDismissed) {
                ribbon.style.display = 'none';
            } else {
                ribbonClose.addEventListener('click', () => {
                    ribbon.style.transition = 'margin-top 0.3s ease-in-out, opacity 0.3s ease-in-out';
                    ribbon.style.marginTop = `-${ribbon.offsetHeight}px`;
                    ribbon.style.opacity = '0';
                    setTimeout(() => {
                        ribbon.style.display = 'none';
                        localStorage.setItem('kiranAcademyRibbonDismissed', 'true');
                    }, 300);
                });
            }
        }

        // 2. Sticky Header with Background Transition
        const siteHeader = document.getElementById('siteHeader');
        let isScrolled = false;

        const handleScroll = () => {
            if (window.scrollY > 80 && !isScrolled) {
                siteHeader.classList.add('scrolled');
                isScrolled = true;
            } else if (window.scrollY <= 80 && isScrolled) {
                siteHeader.classList.remove('scrolled');
                isScrolled = false;
            }
        };

        window.addEventListener('scroll', () => {
            window.requestAnimationFrame(handleScroll);
        }, { passive: true });

        // Initial check for scroll
        handleScroll();

        // 3. Mobile Navigation Toggle
        const navToggle = document.getElementById('navToggle');
        const navPanel = document.getElementById('navPanel');
        
        if (navToggle && navPanel) {
            const toggleMenu = () => {
                const isOpen = navToggle.classList.contains('open');
                navToggle.classList.toggle('open');
                navPanel.classList.toggle('open');
                document.body.classList.toggle('nav-open');
                navToggle.setAttribute('aria-expanded', !isOpen);
            };

            navToggle.addEventListener('click', toggleMenu);

            // Close nav when clicking a link inside
            const navLinks = navPanel.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (navToggle.classList.contains('open')) toggleMenu();
                });
            });

            // Close nav when clicking outside
            document.addEventListener('click', (e) => {
                if (navToggle.classList.contains('open') && !navToggle.contains(e.target) && !navPanel.contains(e.target)) {
                    toggleMenu();
                }
            });
        }

        // 4. Mega Menu (Desktop)
        const coursesBtn = document.getElementById('coursesBtn');
        const megaMenu = document.getElementById('megaMenu');
        
        if (coursesBtn && megaMenu) {
            const toggleMegaMenu = (e) => {
                if (e) e.preventDefault();
                const isActive = megaMenu.classList.contains('active');
                megaMenu.classList.toggle('active');
                coursesBtn.classList.toggle('active');
                coursesBtn.setAttribute('aria-expanded', !isActive);
            };

            coursesBtn.addEventListener('click', toggleMegaMenu);

            // Tab switching logic
            const megaTabs = megaMenu.querySelectorAll('.mega-tab');
            const megaPanels = megaMenu.querySelectorAll('.mega-panel');

            megaTabs.forEach(tab => {
                const activateTab = () => {
                    const targetPanel = tab.getAttribute('data-tab');
                    
                    megaTabs.forEach(t => t.classList.remove('active'));
                    megaPanels.forEach(p => p.classList.remove('active'));
                    
                    tab.classList.add('active');
                    const panel = megaMenu.querySelector(`.mega-panel[data-panel="${targetPanel}"]`);
                    if (panel) panel.classList.add('active');
                };
                
                tab.addEventListener('click', activateTab);
                tab.addEventListener('mouseenter', activateTab);
            });

            // Close mega menu clicking outside
            document.addEventListener('click', (e) => {
                if (megaMenu.classList.contains('active') && !coursesBtn.contains(e.target) && !megaMenu.contains(e.target)) {
                    toggleMegaMenu();
                }
            });

            // Close on escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && megaMenu.classList.contains('active')) {
                    toggleMegaMenu();
                    coursesBtn.focus();
                }
            });
        }

        // 5. Scroll Reveal Animations
        const revealElements = document.querySelectorAll('[data-reveal]');
        if (revealElements.length > 0) {
            const revealObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                root: null,
                threshold: 0.15,
                rootMargin: '0px 0px -50px 0px'
            });

            revealElements.forEach(el => revealObserver.observe(el));
        }

        // 6. Animated Number Counters
        const statsSection = document.getElementById('stats');
        const statNumbers = document.querySelectorAll('.stat-item__number');
        
        if (statsSection && statNumbers.length > 0) {
            let hasAnimated = false;

            const easeOutExpo = (t) => {
                return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
            };

            const animateNumbers = () => {
                if (hasAnimated) return;
                hasAnimated = true;

                const duration = 2000;
                let startTime = null;

                const step = (timestamp) => {
                    if (!startTime) startTime = timestamp;
                    const progress = timestamp - startTime;
                    const percent = Math.min(progress / duration, 1);
                    const easedPercent = easeOutExpo(percent);

                    statNumbers.forEach(num => {
                        const target = parseInt(num.getAttribute('data-count'), 10);
                        const current = Math.floor(target * easedPercent);
                        num.textContent = current.toLocaleString('en-US');
                    });

                    if (percent < 1) {
                        window.requestAnimationFrame(step);
                    } else {
                        statNumbers.forEach(num => {
                            const target = parseInt(num.getAttribute('data-count'), 10);
                            num.textContent = target.toLocaleString('en-US');
                        });
                    }
                };
                window.requestAnimationFrame(step);
            };

            const statsObserver = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    animateNumbers();
                    statsObserver.disconnect();
                }
            }, { threshold: 0.5 });

            statsObserver.observe(statsSection);
        }

        // 7. Testimonial Carousel
        const carousel = document.getElementById('testimonialCarousel');
        if (carousel) {
            const track = carousel.querySelector('.testimonials__track');
            const cards = carousel.querySelectorAll('.testimonial-card');
            const prevBtn = document.getElementById('carouselPrev');
            const nextBtn = document.getElementById('carouselNext');
            const dotsContainer = document.getElementById('carouselDots');
            
            let currentIndex = 0;
            let autoAdvanceTimer;
            const cardCount = cards.length;

            const getCardsPerView = () => {
                if (window.innerWidth < 768) return 1;
                if (window.innerWidth < 1024) return 2;
                return 3;
            };

            // Generate dots
            for (let i = 0; i < cardCount; i++) {
                const dot = document.createElement('button');
                dot.className = 'carousel-dot';
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                if (i === 0) dot.classList.add('active');
                
                dot.addEventListener('click', () => {
                    goToSlide(i);
                    resetAutoAdvance();
                });
                
                dotsContainer.appendChild(dot);
            }
            
            const dots = dotsContainer.querySelectorAll('.carousel-dot');

            const updateCarousel = () => {
                const cardsPerView = getCardsPerView();
                const maxIndex = Math.max(0, cardCount - cardsPerView);
                
                // Clamp index
                if (currentIndex > maxIndex) currentIndex = maxIndex;
                if (currentIndex < 0) currentIndex = 0;

                const cardWidth = cards[0].offsetWidth;
                // Add gap size depending on your CSS, assuming gap is 20px
                const style = window.getComputedStyle(track);
                const gap = parseInt(style.gap) || 0;
                
                const translation = -(currentIndex * (cardWidth + gap));
                track.style.transform = `translateX(${translation}px)`;

                // Update dots
                dots.forEach((dot, index) => {
                    if (index === currentIndex) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });

                // Update buttons state
                if (prevBtn) prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
                if (nextBtn) nextBtn.style.opacity = currentIndex === maxIndex ? '0.5' : '1';
            };

            const goToSlide = (index) => {
                currentIndex = index;
                updateCarousel();
            };

            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    if (currentIndex > 0) goToSlide(currentIndex - 1);
                    resetAutoAdvance();
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    const maxIndex = Math.max(0, cardCount - getCardsPerView());
                    if (currentIndex < maxIndex) goToSlide(currentIndex + 1);
                    resetAutoAdvance();
                });
            }

            const startAutoAdvance = () => {
                autoAdvanceTimer = setInterval(() => {
                    const maxIndex = Math.max(0, cardCount - getCardsPerView());
                    if (currentIndex < maxIndex) {
                        goToSlide(currentIndex + 1);
                    } else {
                        goToSlide(0);
                    }
                }, 5000);
            };

            const resetAutoAdvance = () => {
                clearInterval(autoAdvanceTimer);
                startAutoAdvance();
            };

            carousel.addEventListener('mouseenter', () => clearInterval(autoAdvanceTimer));
            carousel.addEventListener('mouseleave', startAutoAdvance);

            window.addEventListener('resize', () => {
                updateCarousel();
            });

            // Init
            updateCarousel();
            startAutoAdvance();
        }

        // 8. Smooth Scroll for Anchor Links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    
                    // Account for sticky header
                    const headerHeight = siteHeader ? siteHeader.offsetHeight : 0;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.scrollY - headerHeight;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // 9. Lead Form Basic Validation (Demo)
        const leadForm = document.getElementById('leadForm');
        if (leadForm) {
            leadForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                let isValid = true;
                const nameInput = document.getElementById('lf-name');
                const phoneInput = document.getElementById('lf-phone');
                
                // Clear previous errors
                const existingErrors = leadForm.querySelectorAll('.error-msg');
                existingErrors.forEach(err => err.remove());
                nameInput.classList.remove('error');
                phoneInput.classList.remove('error');

                if (!nameInput.value.trim()) {
                    isValid = false;
                    nameInput.classList.add('error');
                    const errorSpan = document.createElement('span');
                    errorSpan.className = 'error-msg';
                    errorSpan.style.color = '#ef4444';
                    errorSpan.style.fontSize = '12px';
                    errorSpan.textContent = ' Name is required';
                    nameInput.parentElement.appendChild(errorSpan);
                }

                const phoneRegex = /^[0-9]{10}$/;
                if (!phoneRegex.test(phoneInput.value.trim())) {
                    isValid = false;
                    phoneInput.classList.add('error');
                    const errorSpan = document.createElement('span');
                    errorSpan.className = 'error-msg';
                    errorSpan.style.color = '#ef4444';
                    errorSpan.style.fontSize = '12px';
                    errorSpan.textContent = ' Enter a valid 10-digit number';
                    phoneInput.parentElement.appendChild(errorSpan);
                }

                if (isValid) {
                    leadForm.innerHTML = `
                        <div style="text-align: center; padding: 2rem 0; animation: fadeIn 0.5s;">
                            <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
                            <h3 style="margin-bottom: 0.5rem;">Demo Booked Successfully!</h3>
                            <p style="color: #64748b;">Our team will contact you shortly.</p>
                        </div>
                    `;
                }
            });

            // Remove error on input
            const formInputs = leadForm.querySelectorAll('input');
            formInputs.forEach(input => {
                input.addEventListener('input', function() {
                    this.classList.remove('error');
                    const errorMsg = this.parentElement.querySelector('.error-msg');
                    if (errorMsg) errorMsg.remove();
                });
            });
        }

        // 10. Sticky Demo Bar (Mobile)
        const stickyDemo = document.getElementById('stickyDemo');
        const heroSection = document.getElementById('hero');
        const leadFormSection = document.getElementById('lead-form');
        
        if (stickyDemo && heroSection && leadFormSection) {
            const checkStickyDemoVisibility = () => {
                const heroBottom = heroSection.getBoundingClientRect().bottom;
                const formTop = leadFormSection.getBoundingClientRect().top;
                
                // Show if scrolled past hero AND not yet reached the form
                if (heroBottom < 0 && formTop > window.innerHeight) {
                    stickyDemo.style.transform = 'translateY(0)';
                    stickyDemo.style.opacity = '1';
                    stickyDemo.style.pointerEvents = 'auto';
                } else {
                    stickyDemo.style.transform = 'translateY(100%)';
                    stickyDemo.style.opacity = '0';
                    stickyDemo.style.pointerEvents = 'none';
                }
            };
            
            // Set initial state via style if needed or handle via CSS, here handled via JS
            stickyDemo.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
            stickyDemo.style.transform = 'translateY(100%)';
            stickyDemo.style.opacity = '0';
            
            window.addEventListener('scroll', () => {
                window.requestAnimationFrame(checkStickyDemoVisibility);
            }, { passive: true });
        }

        // 11. Marquee Pause on Hover
        const marquees = document.querySelectorAll('.marquee-track');
        marquees.forEach(marquee => {
            marquee.addEventListener('mouseenter', () => {
                marquee.classList.add('paused');
                // You would need CSS: .marquee-track.paused { animation-play-state: paused; }
                marquee.style.animationPlayState = 'paused';
            });
            marquee.addEventListener('mouseleave', () => {
                marquee.classList.remove('paused');
                marquee.style.animationPlayState = 'running';
            });
        });

    });
})();
