        document.addEventListener("DOMContentLoaded", () => {
            
            // --- Cache DOM elements for performance ---
            const sections = document.querySelectorAll("section");
            const navLinks = document.querySelectorAll(".nav-menu a");
            const filterContainer = document.querySelector(".portfolio-filter");
            const portfolioItems = document.querySelectorAll(".portfolio-item");
            const revealElements = document.querySelectorAll(".reveal");
            const skillCards = document.querySelectorAll(".skill-card");
            const contactForm = document.getElementById("contact-form");
            const typeText = document.getElementById("type-js");
            const toastNotification = document.getElementById("toast-notification");
            let toastTimer;

            // --- UI/UX New Elements ---
            const mobileNavToggle = document.querySelector(".mobile-nav-toggle");
            const sidebar = document.getElementById("sidebar");
            const backToTopBtn = document.querySelector(".back-to-top");
            const themeToggleBtn = document.getElementById("theme-toggle");
            const statNumbers = document.querySelectorAll(".stat-item h3[data-target]");
            const skillPercentages = document.querySelectorAll(".skill-percentage[data-target]");
            const submitBtn = document.getElementById("submit-btn");


            // --- 1. DYNAMIC TYPING EFFECT (No changes) ---
            (function initTypingEffect() {
                if (!typeText) return;
                const phrases = ["Creative Designer", "Frontend Developer", "UI/UX Enthusiast"];
                let phraseIndex = 0, charIndex = 0, isDeleting = false;

                function type() {
                    const currentPhrase = phrases[phraseIndex];
                    let speed = isDeleting ? 50 : 150;
                    typeText.textContent = currentPhrase.substring(0, charIndex);
                    charIndex += isDeleting ? -1 : 1;
                    if (!isDeleting && charIndex === currentPhrase.length) {
                        speed = 1500; isDeleting = true;
                    } else if (isDeleting && charIndex === 0) {
                        isDeleting = false; phraseIndex = (phraseIndex + 1) % phrases.length;
                    }
                    setTimeout(type, speed);
                }
                type();
            })();


            // --- 2. ACTIVE NAV LINK ON SCROLL (No changes) ---
            (function initNavObserver() {
                if (!sections.length || !navLinks.length) return;
                const navObserverOptions = { root: null, rootMargin: "0px", threshold: 0.6 };
                const navObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const id = entry.target.getAttribute("id");
                            navLinks.forEach(link => {
                                link.classList.remove("active");
                                if (link.getAttribute("href") === `#${id}`) {
                                    link.classList.add("active");
                                }
                            });
                        }
                    });
                }, navObserverOptions);
                sections.forEach(section => navObserver.observe(section));
            })();


            // --- 3. PORTFOLIO FILTERING (No changes) ---
            (function initPortfolioFilter() {
                if (!filterContainer || !portfolioItems.length) return;
                const filterBtns = filterContainer.querySelectorAll(".filter-btn");

                filterContainer.addEventListener("click", (e) => {
                    const targetButton = e.target.closest(".filter-btn");
                    if (!targetButton) return;

                    filterBtns.forEach(btn => btn.classList.remove("active"));
                    targetButton.classList.add("active");
                    const filterValue = targetButton.dataset.filter;

                    portfolioItems.forEach(item => {
                        const itemCategory = item.dataset.category;
                        const shouldShow = (filterValue === "all" || filterValue === itemCategory);
                        
                        if (shouldShow) {
                            item.classList.remove("hide");
                            item.style.display = 'block';
                        } else {
                            item.classList.add("hide");
                            item.addEventListener('transitionend', function onTransitionEnd() {
                                item.style.display = 'none';
                                item.removeEventListener('transitionend', onTransitionEnd);
                            });
                        }
                    });
                });
            })();


            // --- 4. ANIMATE-ON-SCROLL FOR SECTIONS (No changes) ---
            (function initRevealOnScroll() {
                if (!revealElements.length) return;
                const revealObserverOptions = { root: null, rootMargin: "0px", threshold: 0.15 };
                const revealObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add("active");
                            observer.unobserve(entry.target); 
                        }
                    });
                }, revealObserverOptions);
                revealElements.forEach(el => revealObserver.observe(el));
            })();
            
            
            // --- UI/UX: 5. COUNT-UP ANIMATION FUNCTION ---
            /**
             * Animates a number from 0 to a target value.
             * @param {HTMLElement} el - The element containing the number.
             * @param {number} target - The final number.
             * @param {number} [duration=2000] - Animation duration in ms.
             * @param {string} [suffix=''] - Suffix to add (e.g., '%').
             */
            function animateCountUp(el, target, duration = 2000, suffix = '') {
                let start = 0;
                const stepTime = 20; // 50 frames per second
                const steps = duration / stepTime;
                const increment = target / steps;
                
                const timer = setInterval(() => {
                    start += increment;
                    if (start >= target) {
                        clearInterval(timer);
                        start = target;
                    }
                    el.textContent = Math.floor(start) + suffix;
                }, stepTime);
            }


            // --- UI/UX: 6. SKILL BAR & COUNTER OBSERVER ---
            (function initSkillAndStatObserver() {
                if (!skillCards.length && !statNumbers.length) return;
                
                const observerOptions = { root: null, rootMargin: "0px", threshold: 0.5 };
                
                const observer = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            // Check if it's a skill card
                            if (entry.target.classList.contains('skill-card')) {
                                const skillProgress = entry.target.querySelector(".skill-progress");
                                const percentageEl = entry.target.querySelector(".skill-percentage");
                                if (skillProgress && percentageEl) {
                                    const targetWidth = skillProgress.dataset.width;
                                    const targetPercent = parseInt(percentageEl.dataset.target, 10);
                                    skillProgress.style.width = targetWidth;
                                    animateCountUp(percentageEl, targetPercent, 1500, '%');
                                }
                            }
                            
                            // Check if it's a stat item
                            if (entry.target.classList.contains('stat-item')) {
                                const numberEl = entry.target.querySelector("h3[data-target]");
                                if (numberEl) {
                                    const targetNum = parseInt(numberEl.dataset.target, 10);
                                    animateCountUp(numberEl, targetNum, 1500);
                                }
                            }
                            
                            // Stop observing this element
                            observer.unobserve(entry.target);
                        }
                    });
                }, observerOptions);

                skillCards.forEach(card => observer.observe(card));
                statNumbers.forEach(num => observer.observe(num.parentElement)); // Observe the parent card
            })();

            
            // --- 7. PROFESSIONAL FORM SUBMISSION ---
            function showToast(message, type = 'success') {
                if (!toastNotification) return;
                clearTimeout(toastTimer);
                toastNotification.textContent = message;
                toastNotification.className = `toast-notification ${type} show`;
                toastTimer = setTimeout(() => {
                    toastNotification.classList.remove('show');
                }, 3000);
            }

            (function initContactForm() {
                if (!contactForm || !submitBtn) return;
                
                contactForm.addEventListener("submit", (e) => {
                    e.preventDefault();
                    
                    // UI/UX: Add loading state
                    submitBtn.classList.add('loading');
                    submitBtn.disabled = true;
                    
                    if (contactForm.checkValidity()) {
                        // Simulate a network request
                        setTimeout(() => {
                            showToast("Message sent successfully! (This is a demo)");
                            contactForm.reset();
                            // UI/UX: Remove loading state
                            submitBtn.classList.remove('loading');
                            submitBtn.disabled = false;
                            // Manually trigger labels to reset
                            contactForm.querySelectorAll('.form-control').forEach(input => {
                                if (input.placeholder === " ") input.placeholder = " ";
                            });
                        }, 1500); // 1.5 second delay
                        
                    } else {
                        showToast("Please correct the errors in the form.", "error");
                        // UI/UX: Remove loading state
                        submitBtn.classList.remove('loading');
                        submitBtn.disabled = false;
                    }
                });
            })();
            
            
            // --- UI/UX: 8. MOBILE NAVIGATION TOGGLE ---
            (function initMobileNav() {
                if (!mobileNavToggle || !sidebar) return;
                
                const navLinks = sidebar.querySelectorAll('[data-navlink]');
                
                function toggleNav(isActive) {
                    const show = typeof isActive === 'boolean' ? isActive : !document.body.classList.contains('mobile-nav-active');
                    document.body.classList.toggle('mobile-nav-active', show);
                    sidebar.classList.toggle('mobile-nav-active', show);
                    mobileNavToggle.setAttribute('aria-expanded', show);
                }
                
                // Toggle with hamburger button
                mobileNavToggle.addEventListener('click', () => toggleNav());
                
                // Close nav when a link is clicked
                navLinks.forEach(link => {
                    link.addEventListener('click', () => toggleNav(false));
                });
            })();
            
            
            // --- UI/UX: 9. "BACK TO TOP" BUTTON ---
            (function initBackToTop() {
                if (!backToTopBtn) return;
                
                // Use a simple scroll listener for this
                window.addEventListener('scroll', () => {
                    if (window.scrollY > 300) {
                        backToTopBtn.classList.add('active');
                    } else {
                        backToTopBtn.classList.remove('active');
                    }
                });
            })();
            
            
            // --- UI/UX: 10. DARK MODE THEME TOGGLE ---
            (function initThemeToggle() {
                if (!themeToggleBtn) return;
                
                const root = document.documentElement;
                
                // Get theme from localStorage or system preference
                let currentTheme = localStorage.getItem('theme') || 
                                   (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                
                function setTheme(theme) {
                    root.setAttribute('data-theme', theme);
                    localStorage.setItem('theme', theme);
                }
                
                // Set initial theme on load
                setTheme(currentTheme);
                
                // Toggle on click
                themeToggleBtn.addEventListener('click', () => {
                    currentTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
                    setTheme(currentTheme);
                });
            })();

        });