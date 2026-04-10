/* ===================================================
   AKASHA MUSIC — Script
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- Accordion ---
  const triggers = document.querySelectorAll('.accordion__trigger');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const accordion = trigger.parentElement;
      const isOpen = accordion.classList.contains('is-open');

      // Close all others
      document.querySelectorAll('.accordion.is-open').forEach(open => {
        open.classList.remove('is-open');
        open.querySelector('.accordion__trigger').setAttribute('aria-expanded', 'false');
      });

      // Toggle clicked
      if (!isOpen) {
        accordion.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // --- Lazy-load videos via IntersectionObserver ---
  const lazyVideos = document.querySelectorAll('video[data-src]');

  if (lazyVideos.length) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const video = entry.target;
          video.src = video.dataset.src;
          video.removeAttribute('data-src');
          video.load();
          video.play().catch(() => {});
          videoObserver.unobserve(video);
        }
      });
    }, { rootMargin: '200px 0px' });

    lazyVideos.forEach(video => videoObserver.observe(video));
  }

  // --- Mobile Menu Toggle ---
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (menuToggle && mobileMenu) {
    const closeMenu = () => {
      menuToggle.classList.remove('is-open');
      mobileMenu.classList.remove('is-open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      menuToggle.setAttribute('aria-expanded', 'false');
    };
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.classList.toggle('is-open');
      mobileMenu.classList.toggle('is-open');
      mobileMenu.setAttribute('aria-hidden', !isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen);
    });
    const backdrop = mobileMenu.querySelector('.mobile-menu__backdrop');
    if (backdrop) backdrop.addEventListener('click', closeMenu);
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  // --- Faster snap settling ---
  const container = document.querySelector('.scroll-container');
  if (container) {
    let scrollTimeout;
    container.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const sections = document.querySelectorAll('.section');
        const containerTop = container.scrollTop;
        const viewHeight = container.clientHeight;
        let closest = sections[0];
        let minDist = Infinity;
        sections.forEach(s => {
          const dist = Math.abs(s.offsetTop - containerTop);
          if (dist < minDist) { minDist = dist; closest = s; }
        });
        if (minDist > 5 && minDist < viewHeight * 0.4) {
          closest.scrollIntoView({ behavior: 'smooth' });
        }
      }, 80);
    }, { passive: true });
  }

  // --- Nav link smooth scroll within snap container ---
  const scrollContainer = document.querySelector('.scroll-container');
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});
