/* ===================================================
   AKASHA MUSIC — Artist Page Script (shared template)
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- Nav scroll state ---
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('nav--scrolled', window.scrollY > 60);
    }, { passive: true });
  }

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

  // --- Count-up animation ---
  const counters = document.querySelectorAll('.stat__number[data-target]');

  function animateCounter(el) {
    if (el.dataset.animated) return;
    el.dataset.animated = 'true';

    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();

    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.round(easeOutExpo(progress) * target);
      el.textContent = current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }

  if (counters.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach(counter => observer.observe(counter));
  }

});
