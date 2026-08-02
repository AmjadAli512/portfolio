document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    //  SETUP AND INITIALIZATION
    // =========================================================================

    const mobileNavPanel = document.querySelector('.mobile-nav-panel');
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-panel a');
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Fallback HTML used when running directly from file:// where fetch is blocked.
    const localContentFallback = {
        'certifications.html': `
<a href="https://www.coursera.org/account/accomplishments/certificate/ZJTHJ4RMSTIU" target="_blank" rel="noopener noreferrer" class="certification-card">
    <span>Generative AI: Prompt Engineering</span>
    <span class="certification-meta">
        <i class="fas fa-certificate cert-provider-icon" aria-hidden="true"></i>
        <i class="fas fa-external-link-alt"></i>
    </span>
</a>
<a href="https://www.coursera.org/account/accomplishments/certificate/QF9G0BEALGGT" target="_blank" rel="noopener noreferrer" class="certification-card">
    <span>Computer Vision and Image Processing</span>
    <span class="certification-meta">
        <i class="fas fa-certificate cert-provider-icon" aria-hidden="true"></i>
        <i class="fas fa-external-link-alt"></i>
    </span>
</a>
<a href="https://www.coursera.org/account/accomplishments/certificate/KHNA0BBFBOVC" target="_blank" rel="noopener noreferrer" class="certification-card">
    <span>Quantum Computing with Qiskit and Advanced Algorithms</span>
    <span class="certification-meta">
        <i class="fas fa-certificate cert-provider-icon" aria-hidden="true"></i>
        <i class="fas fa-external-link-alt"></i>
    </span>
</a>
<a href="https://www.coursera.org/account/accomplishments/certificate/33BPU0Z1MIDJ" target="_blank" rel="noopener noreferrer" class="certification-card">
    <span>CCNA Routing and Switching</span>
    <span class="certification-meta">
        <i class="fas fa-certificate cert-provider-icon" aria-hidden="true"></i>
        <i class="fas fa-external-link-alt"></i>
    </span>
</a>
<a href="https://www.mindluster.com/student/certificate/11285952576" target="_blank" rel="noopener noreferrer" class="certification-card">
    <span>Core Java</span>
    <span class="certification-meta">
        <i class="fas fa-certificate cert-provider-icon" aria-hidden="true"></i>
        <i class="fas fa-external-link-alt"></i>
    </span>
</a>
<a href="https://www.udemy.com/certificate/UC-b811059b-7024-4a9c-a8dd-94d17bee9fec/" target="_blank" rel="noopener noreferrer" class="certification-card">
    <span>Flutter UI BootCamp</span>
    <span class="certification-meta">
        <i class="fas fa-certificate cert-provider-icon" aria-hidden="true"></i>
        <i class="fas fa-external-link-alt"></i>
    </span>
</a>
<a href="https://www.udemy.com/certificate/UC-944284bf-15a9-4a1a-96ae-1f077046a581/" target="_blank" rel="noopener noreferrer" class="certification-card">
    <span>Flutter Development</span>
    <span class="certification-meta">
        <i class="fas fa-certificate cert-provider-icon" aria-hidden="true"></i>
        <i class="fas fa-external-link-alt"></i>
    </span>
</a>`,
        'projects.html': `
<div class="project-item">
    <div class="project-header">
        <h3 class="project-title">Weather Forecast App</h3>
    </div>
    <div class="project-body">
        <p class="project-description">A responsive, full-screen weather application featuring real-time data from the OpenWeather API, city search, and voice command integration for a seamless user experience.</p>
        <p class="project-tech"><strong>Tech Used:</strong> HTML, CSS, JavaScript, OpenWeather API</p>
    </div>
    <div class="project-footer">
        <a href="https://amjadali512.github.io/Weather-Forecast-AI-Web-App/" target="_blank" rel="noopener noreferrer" class="project-button">Live Demo</a>
        <a href="https://github.com/AmjadAli512/Weather-Forecast-AI-Web-App" target="_blank" rel="noopener noreferrer" class="project-button secondary">Source Code</a>
    </div>
</div>

<div class="project-item">
    <div class="project-header">
        <h3 class="project-title">Hostel Management System</h3>
    </div>
    <div class="project-body">
        <p class="project-description">An MVC-based management system featuring student CRUD operations, dynamic room allocation, and real-time availability tracking.</p>
        <p class="project-tech"><strong>Tech Used:</strong> ASP.NET Core, Azur SQL Database</p>
    </div>
    <div class="project-footer">
        <a href="https://hostelmanagementsystem-a0gafpbedmcfexh4.eastasia-01.azurewebsites.net/" target="_blank" rel="noopener noreferrer" class="project-button">Live Demo</a>
        <a href="https://github.com/AmjadAli51214/Hostel_Management_System" target="_blank" rel="noopener noreferrer" class="project-button secondary">Source Code</a>
    </div>
</div>

<div class="project-item">
    <div class="project-header">
        <h3 class="project-title">Real-Time Tic-Tac-Toe Game</h3>
    </div>
    <div class="project-body">
        <p class="project-description">A dynamic multiplayer Tic-Tac-Toe game built with Flutter, featuring real-time gameplay powered by Firebase Firestore. Challenge friends from anywhere!</p>
        <p class="project-tech"><strong>Tech Used:</strong> Flutter, Dart, Firebase</p>
    </div>
    <div class="project-footer">
        <a href="https://drive.google.com/file/d/1m_xoy9O9oHFz7n798WPSskBQVEB_qJwB/view?usp=drive_link" target="_blank" rel="noopener noreferrer" download class="project-button">Download APK</a>
        <a href="https://github.com/AmjadAli51214/tic_tac_toe" target="_blank" rel="noopener noreferrer" class="project-button secondary">Source Code</a>
    </div>
</div>

<div class="project-item">
    <div class="project-header">
        <h3 class="project-title">AI Home Automation UXD</h3>
    </div>
    <div class="project-body">
        <p class="project-description">A conceptual UI/UX design for an AI-powered home automation app. This Figma project showcases a seamless user experience for controlling smart devices like lights, fans, and ACs.</p>
        <p class="project-tech"><strong>Tech Used:</strong> Figma</p>
    </div>
    <div class="project-footer">
        <a href="https://www.figma.com/design/MDJ3SUXIRvA06DewLigHZl/smart_Home_control_App?node-id=0-1&t=NwTOLaUcjUfPgKIa-1" target="_blank" rel="noopener noreferrer" class="project-button">Live Demo</a>
    </div>
</div>`
    };

    // =========================================================================
    //  DYNAMIC CONTENT LOADING
    // =========================================================================

    async function loadContent(url, containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) {
            console.error(`Container not found: ${containerSelector}`);
            return;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to load ${url}: ${response.statusText}`);
            const content = await response.text();
            container.innerHTML = content;
        } catch (error) {
            // Browsers often block fetch for local files opened via file://
            if (window.location.protocol === 'file:' && localContentFallback[url]) {
                container.innerHTML = localContentFallback[url];
                console.warn(`Loaded ${url} from local fallback because fetch is blocked on file://`);
                return;
            }

            console.error('Error loading content:', error);
        }
    }

    // Load content and then set up animations that depend on that content
    Promise.all([
        loadContent('certifications.html', '#certifications .certifications-list'),
        loadContent('projects.html', '#projects .projects-list')
    ]).then(() => {
        setupProjectPreviews();
        setupProjectScrollAnimation(); // This runs only after projects.html is loaded
    });

    setupCounters();
    setupSectionDots();


    // =========================================================================
    //  MOBILE NAVIGATION
    // =========================================================================

    if (menuToggle && mobileNavPanel) {
        menuToggle.addEventListener('click', () => {
            mobileNavPanel.classList.toggle('active');
        });
    }

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileNavPanel.classList.contains('active')) {
                mobileNavPanel.classList.remove('active');
            }
        });
    });


    // =========================================================================
    //  THEME TOGGLE
    // =========================================================================
    
    // This part is preserved from your original code
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
        if (themeToggle) themeToggle.querySelector('i').className = 'fas fa-moon';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('light-theme');
            const isLightTheme = body.classList.contains('light-theme');
            localStorage.setItem('theme', isLightTheme ? 'light' : 'dark');
            themeToggle.querySelector('i').className = isLightTheme ? 'fas fa-moon' : 'fas fa-sun';
        });
    }


    // =========================================================================
    //  SERVICES CAROUSEL
    // =========================================================================

    const services = [
        { icon: "fas fa-mobile-alt", title: "Flutter App Development", desc: "Building interactive mobile applications for Android and iOS." },
        { icon: "fas fa-code", title: "Web Development", desc: "Creating responsive and dynamic websites using modern technologies." },
        { icon: "fas fa-headset", title: "IT Support & Troubleshooting", desc: "Providing technical support and solving complex hardware/software problems." },
        { icon: "fas fa-palette", title: "UI/UX Design", desc: "Designing user-friendly and visually appealing interfaces for digital products." },
        { icon: "fas fa-users-cog", title: "Agile & Scrum Basics", desc: "Applying agile methodologies for efficient project management and delivery." },
    ];

    const servicesList = document.querySelector('.services-list');

    if (servicesList) {
        const allServices = [...services, ...services]; // Duplicate for seamless loop

        allServices.forEach(service => {
            const card = document.createElement('div');
            card.className = 'service-card';
            card.innerHTML = `
                <i class="${service.icon}"></i>
                <div>
                    <h3>${service.title}</h3>
                    <p>${service.desc}</p>
                </div>
            `;
            servicesList.appendChild(card);
        });

        const animationDuration = services.length * 5; // Adjust 5 to change speed
        servicesList.style.setProperty('--services-animation-duration', `${animationDuration}s`);
    }

    // =========================================================================
    //  PROJECTS SCROLL ANIMATION
    // =========================================================================

    function setupProjectScrollAnimation() {
        const projectItems = document.querySelectorAll('.project-item');
        if (projectItems.length === 0) return; // Don't run if no projects loaded
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        projectItems.forEach(item => {
            observer.observe(item);
        });
    }

    function setupProjectPreviews() {
        const iconByTitle = {
            'Weather Forecast App': 'fas fa-cloud-sun-rain',
            'Hostel Management System': 'fas fa-building',
            'Real-Time Tic-Tac-Toe Game': 'fas fa-gamepad',
            'AI Home Automation UXD': 'fas fa-house-signal'
        };

        const previewUrlByTitle = {
            'Hostel Management System': 'https://image.thum.io/get/width/1200/noanimate/https://hostelmanagementsystem-a0gafpbedmcfexh4.eastasia-01.azurewebsites.net/'
        };

        document.querySelectorAll('.project-item').forEach((item) => {
            if (item.querySelector('.project-thumb')) return;

            const title = item.querySelector('.project-title')?.textContent?.trim() || 'Project';
            const liveLink = item.querySelector('.project-button')?.getAttribute('href');
            if (!liveLink) return;

            const thumb = document.createElement('div');
            thumb.className = 'project-thumb';

            const img = document.createElement('img');
            img.loading = 'lazy';
            img.decoding = 'async';
            img.alt = `${title} preview`;
            img.src = previewUrlByTitle[title] || `https://s.wordpress.com/mshots/v1/${encodeURIComponent(liveLink)}?w=1200`;

            const fallback = document.createElement('div');
            fallback.className = 'project-thumb-fallback';
            fallback.innerHTML = `<i class="${iconByTitle[title] || 'fas fa-laptop-code'}"></i>`;

            img.addEventListener('error', () => {
                thumb.classList.add('no-image');
                img.remove();
            }, { once: true });

            thumb.appendChild(img);
            thumb.appendChild(fallback);
            item.prepend(thumb);
        });
    }

    function setupCounters() {
        const values = document.querySelectorAll('.stat-value');
        if (values.length === 0) return;

        const animateCounter = (element) => {
            const target = Number(element.dataset.target || 0);
            const suffix = element.dataset.suffix || '';
            const duration = 1200;
            const start = performance.now();

            const tick = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const current = Math.floor(progress * target);
                element.textContent = `${current}${suffix}`;

                if (progress < 1) {
                    requestAnimationFrame(tick);
                }
            };

            requestAnimationFrame(tick);
        };

        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.45 });

        values.forEach((value) => {
            counterObserver.observe(value);
        });
    }

    function setupSectionDots() {
        const dotLinks = document.querySelectorAll('.section-dots a[data-section]');
        if (dotLinks.length === 0) return;

        const sections = Array.from(dotLinks)
            .map((dot) => document.getElementById(dot.dataset.section))
            .filter(Boolean);

        const setActiveDot = (id) => {
            dotLinks.forEach((dot) => {
                dot.classList.toggle('active', dot.dataset.section === id);
            });
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            const visible = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

            if (visible?.target?.id) {
                setActiveDot(visible.target.id);
            }
        }, { threshold: [0.3, 0.55, 0.8] });

        sections.forEach((section) => sectionObserver.observe(section));
        setActiveDot('home');
    }


    // =========================================================================
    //  CONTACT FORM
    // =========================================================================

    const contactForm = document.getElementById('contact-form');
    const thankYouMessage = document.getElementById('form-thank-you');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const actionUrl = (contactForm.getAttribute('action') || '').trim();
            const submitButton = contactForm.querySelector('.submit-button');

            if (!actionUrl || actionUrl.includes('YOUR_UNIQUE_CODE')) {
                alert('Contact form is not configured yet. Replace YOUR_UNIQUE_CODE in the form action with your real Formspree form ID.');
                return;
            }

            let requestPending = true;
            const slowTimer = setTimeout(() => {
                if (requestPending) {
                    contactForm.classList.add('is-submitting-slow');
                }
            }, 600);

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Submitting...';
            }

            try {
                const response = await fetch(actionUrl, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    contactForm.reset();
                    contactForm.style.display = 'none';
                    if (thankYouMessage) {
                        thankYouMessage.style.display = 'block';
                    }
                } else {
                    alert('There was a problem submitting your form. Please try again.');
                }
            } catch (error) {
                alert('An error occurred. Please check your internet connection and try again.');
            } finally {
                requestPending = false;
                clearTimeout(slowTimer);
                contactForm.classList.remove('is-submitting-slow');

                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Send Message';
                }
            }
        });
    }
});