document.addEventListener('DOMContentLoaded', () => {
    const detectDevice = () => {
        const isMobile = window.matchMedia("(max-width: 768px)").matches;
        if (isMobile) {
            document.body.classList.add('is-mobile');
            document.body.classList.remove('is-desktop');
        } else {
            document.body.classList.add('is-desktop');
            document.body.classList.remove('is-mobile');
        }
    };

    detectDevice();
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(detectDevice, 250);
    });

    const themeToggleBtn = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;

    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeToggleBtn) return;
        themeToggleBtn.innerHTML = theme === 'light' ? '🌙' : '☀️';
    }

    const cursor = document.getElementById('customCursor');
    if (cursor && !document.body.classList.contains('is-mobile')) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        const hoverElements = document.querySelectorAll('a, button, .bento-item, .morph-card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursor.style.background = 'var(--accent-pink)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursor.style.background = 'var(--accent-orange)';
            });
        });
    }

    const newsContainer = document.getElementById('newsGrid');
    if (newsContainer) {
        fetchNews();
    }

    async function fetchNews() {
        try {
            const response = await fetch('https://api.github.com/repos/vivizzz007/vivi-music/contents/news');
            const files = await response.json();

            const jsonFiles = files.filter(file => file.name.endsWith('.json'));

            for (const file of jsonFiles) {
                const contentRes = await fetch(file.download_url);
                const newsItem = await contentRes.json();
                renderNewsItem(newsItem);
            }
        } catch (error) {
            if (newsContainer) newsContainer.innerHTML = '<p>Failed to load news.</p>';
        }
    }

    function renderNewsItem(item) {
        const card = document.createElement('div');
        card.className = 'news-card reveal';
        card.innerHTML = `
            <span class="news-date">${item.date || 'Recent'}</span>
            <h3>${item.title || 'Update'}</h3>
            <p>${item.description || item.content || 'No description available.'}</p>
        `;
        newsContainer.appendChild(card);
        
        // Observe the new card
        if (revealObserver) revealObserver.observe(card);
    }

    const contributorsGrid = document.getElementById('contributorsGrid');
    if (contributorsGrid) {
        fetchContributors();
    }

    async function fetchContributors() {
        try {
            const response = await fetch('https://api.github.com/repos/vivizzz007/vivi-music/contributors');
            const data = await response.json();

            const contributors = data.filter(user => user.login !== 'Copilot');

            let leadDev = contributors.find(user => user.login === 'vivizzz007');
            if (!leadDev) {
                leadDev = {
                    login: 'vivizzz007',
                    avatar_url: 'https://avatars.githubusercontent.com/u/0?v=4',
                    html_url: 'https://github.com/vivizzz007'
                };
            }

            const others = contributors.filter(user => user.login !== 'vivizzz007' && user.login !== 'prostmitwein');

            const webDev = {
                login: 'prostmitwein',
                avatar_url: 'https://avatars.githubusercontent.com/u/0?v=4',
                html_url: 'https://linktr.ee/prostmitwein'
            };

            const sortedTeam = [leadDev, webDev, ...others];

            sortedTeam.forEach(user => {
                if (user) renderContributor(user);
            });

        } catch (error) {
            console.error('Error fetching contributors:', error);
        }
    }

    function renderContributor(user) {
        const card = document.createElement('a');
        card.className = 'contributor-card reveal';

        let title = 'Contributor';
        let roleClass = 'role-contrib';

        if (user.login === 'vivizzz007') {
            card.classList.add('large');
            title = 'Lead Dev';
            roleClass = 'role-lead';
        } else if (user.login === 'prostmitwein') {
            card.classList.add('large');
            card.classList.add('contributor-prost');
            title = 'Web Developer';
            roleClass = 'role-web';
        }

        card.href = user.html_url;
        card.target = '_blank';

        let avatar = user.avatar_url;
        if (user.login === 'prostmitwein' || user.login === 'vivizzz007') {
            avatar = `https://github.com/${user.login}.png`;
        }

        card.innerHTML = `
            <img src="${avatar}" alt="${user.login}" class="contributor-avatar">
            <div>
                <h3>${user.login}</h3>
                <span class="role-badge ${roleClass}">${title}</span>
            </div>
        `;
        contributorsGrid.appendChild(card);
        
        // Observe the new card
        if (revealObserver) revealObserver.observe(card);
    }

    const sections = document.querySelectorAll('section');
    const scrollbarContainer = document.getElementById('customScrollbar');

    if (scrollbarContainer && sections.length > 0) {
        sections.forEach((section, index) => {
            const indicator = document.createElement('div');
            indicator.classList.add('scroll-indicator');
            if (index === 0) indicator.classList.add('active');

            indicator.addEventListener('click', () => {
                section.scrollIntoView({ behavior: 'smooth' });
            });

            scrollbarContainer.appendChild(indicator);
        });

        const indicators = document.querySelectorAll('.scroll-indicator');

        const observerOptions = {
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = Array.from(sections).indexOf(entry.target);

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
    }

    const bentoItems = document.querySelectorAll('.bento-item');

    bentoItems.forEach(item => {
        item.addEventListener('click', () => {
            const isExpanded = item.classList.contains('expanded');
            bentoItems.forEach(other => {
                if (other !== item) other.classList.remove('expanded');
            });
            if (!isExpanded) {
                item.classList.add('expanded');
            } else {
                item.classList.remove('expanded');
            }
            if (!isExpanded) {
                setTimeout(() => {
                    item.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            }
        });
    });

    const tiltElements = document.querySelectorAll('.bento-item, .morph-card, .carousel-card');

    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            if (document.body.classList.contains('is-mobile')) return;
            if (el.classList.contains('expanded')) return;

            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px) scale(0.95)';
        el.style.transition = 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
        revealObserver.observe(el);
    });
});
