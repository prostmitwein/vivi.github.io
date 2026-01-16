document.addEventListener('DOMContentLoaded', () => {
    // --- Custom Scrollbar Logic ---
    const sections = document.querySelectorAll('section');
    const scrollbarContainer = document.getElementById('customScrollbar');

    // Create indicators
    sections.forEach((section, index) => {
        const indicator = document.createElement('div');
        indicator.classList.add('scroll-indicator');
        if (index === 0) indicator.classList.add('active');

        // Click to scroll
        indicator.addEventListener('click', () => {
            section.scrollIntoView({ behavior: 'smooth' });
        });

        scrollbarContainer.appendChild(indicator);
    });

    const indicators = document.querySelectorAll('.scroll-indicator');

    // Observer to update active indicator
    const observerOptions = {
        threshold: 0.5 // Trigger when 50% of section is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Find index of intersecting section
                const index = Array.from(sections).indexOf(entry.target);

                // Update indicators
                indicators.forEach((ind, i) => {
                    if (i === index) {
                        ind.classList.add('active');
                    } else {
                        ind.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    // --- Interactive Expanding Pills (Bento Items) ---
    const bentoItems = document.querySelectorAll('.bento-item');

    bentoItems.forEach(item => {
        item.addEventListener('click', () => {
            // Toggle expanded state
            const isExpanded = item.classList.contains('expanded');

            // Collapse all others first
            bentoItems.forEach(other => {
                if (other !== item) {
                    other.classList.remove('expanded');
                }
            });

            // Toggle current
            if (!isExpanded) {
                item.classList.add('expanded');
            } else {
                item.classList.remove('expanded');
            }

            // Optional: Scroll to view if expanded
            if (!isExpanded) {
                setTimeout(() => {
                    item.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            }
        });
    });

    // --- 3D Tilt Effect ---
    const tiltElements = document.querySelectorAll('.bento-item, .morph-card, .carousel-card');

    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            if (el.classList.contains('expanded')) return; // Disable tilt when expanded

            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calculate rotation (max 15 degrees)
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // --- Smooth Reveal on Scroll ---
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        revealElements.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;

            if (elementTop < windowHeight - elementVisible) {
                reveal.style.opacity = '1';
                reveal.style.transform = 'translateY(0) scale(1)';
            }
        });
    };

    // Initial styles
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px) scale(0.95)';
        el.style.transition = 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
    });

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();
});
