document.addEventListener('DOMContentLoaded', () => {

    // ── Register GSAP plugins ──
    gsap.registerPlugin(ScrollTrigger);


    // ═══════════════════════════════════════════════
    // 0. PROPERTY IMAGE SLIDER
    // ═══════════════════════════════════════════════
    // ═══════════════════════════════════════════════
    // 0. PROPERTY BACKGROUND SWIPERS
    // ═══════════════════════════════════════════════
    document.querySelectorAll('.prop-bg-swiper').forEach(el => {
        new Swiper(el, {
            loop: true,
            speed: 800,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            navigation: {
                nextEl: el.querySelector('.swiper-button-next'),
                prevEl: el.querySelector('.swiper-button-prev'),
            },
        });
    });


    // ═══════════════════════════════════════════════
    // 1. HERO ENTRANCE
    // ═══════════════════════════════════════════════
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroTl
        .from('.hero-video', { opacity: 0, duration: 2, ease: 'expo.out' })
        .from('.hero-badge', { y: 20, opacity: 0, duration: 0.8 }, '-=1')
        .from('.hero-title', { y: 36, opacity: 0, duration: 1.0 }, '-=0.65')
        .from('.hero-description', { y: 24, opacity: 0, duration: 0.8 }, '-=0.7')
        .from('.hero-btns', { y: 20, opacity: 0, duration: 0.8 }, '-=0.6')
        .from('.hero-scroll-hint', { opacity: 0, duration: 0.8 }, '-=0.4');

    // Video playback
    const heroVideo = document.getElementById('hero-video');
    if (heroVideo) {
        heroVideo.playbackRate = 0.65;
        const tryPlay = () => {
            heroVideo.play().then(() => {
                window.removeEventListener('click', tryPlay);
                window.removeEventListener('scroll', tryPlay);
                window.removeEventListener('touchstart', tryPlay);
            }).catch(() => { });
        };
        tryPlay();
        window.addEventListener('click', tryPlay, { once: true });
        window.addEventListener('scroll', tryPlay, { once: true });
        window.addEventListener('touchstart', tryPlay, { once: true });
    }


    // ═══════════════════════════════════════════════
    // 2. STICKY HEADER
    // ═══════════════════════════════════════════════
    const header = document.getElementById('main-header');

    const handleScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // run on init


    // ═══════════════════════════════════════════════
    // 3. SCROLL REVEAL (IntersectionObserver)
    // ═══════════════════════════════════════════════
    const revealEls = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));


    // ═══════════════════════════════════════════════
    // 4. COUNTER ANIMATION
    // ═══════════════════════════════════════════════
    const counters = document.querySelectorAll('.stat-number[data-count]');

    const counterObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-count'), 10);
            const suffix = target >= 25 ? '+' : '+';
            let start = 0;
            const duration = 1600;
            const step = (timestamp) => {
                if (!start) start = timestamp;
                const progress = Math.min((timestamp - start) / duration, 1);
                const ease = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.floor(ease * target) + suffix;
                if (progress < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
            obs.unobserve(el);
        });
    }, { threshold: 0.4 });

    counters.forEach(c => counterObserver.observe(c));


    // ═══════════════════════════════════════════════
    // 5. SMOOTH SCROLL (native anchor links)
    // ═══════════════════════════════════════════════
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            const id = this.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            const offset = header.offsetHeight;
            const top = target.getBoundingClientRect().top + window.scrollY - offset + 1;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });


    // ═══════════════════════════════════════════════
    // 6. MOBILE MENU
    // ═══════════════════════════════════════════════
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const mobileClose = document.getElementById('mobile-close');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    const openMenu = () => {
        mobileOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        mobileToggle.innerHTML = '<i class="fas fa-times"></i>';
    };
    const closeMenu = () => {
        mobileOverlay.classList.remove('open');
        document.body.style.overflow = '';
        mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
    };

    mobileToggle?.addEventListener('click', () => {
        mobileOverlay.classList.contains('open') ? closeMenu() : openMenu();
    });
    mobileClose?.addEventListener('click', closeMenu);
    mobileLinks.forEach(l => l.addEventListener('click', closeMenu));

    // Close on outside tap
    mobileOverlay?.addEventListener('click', e => {
        if (e.target === mobileOverlay) closeMenu();
    });


    // ═══════════════════════════════════════════════
    // 9. REFRESH ScrollTrigger after load
    // ═══════════════════════════════════════════════
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');

    form?.addEventListener('submit', e => {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending&nbsp; <i class="fas fa-spinner fa-spin"></i>';

        setTimeout(() => {
            submitBtn.innerHTML = 'Enquiry Sent! &nbsp;<i class="fas fa-check"></i>';
            submitBtn.style.background = '#2d6a4f';
            submitBtn.style.borderColor = '#2d6a4f';
            form.reset();

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Enquiry &nbsp; <i class="fas fa-arrow-right"></i>';
                submitBtn.style.background = '';
                submitBtn.style.borderColor = '';
            }, 3500);
        }, 1600);
    });


    // ═══════════════════════════════════════════════
    // 9. REFRESH ScrollTrigger after load
    // ═══════════════════════════════════════════════
    window.addEventListener('load', () => ScrollTrigger.refresh());

});
