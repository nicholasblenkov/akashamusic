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
