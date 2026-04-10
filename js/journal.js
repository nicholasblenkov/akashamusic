/* ===================================================
   AKASHA MUSIC — Journal Page Script
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

  // --- Article Grid Carousel / Pagination ---
  const CARDS_PER_PAGE = 6;
  const grid = document.querySelector('#journalCarousel .journal-grid');
  const paginationNav = document.getElementById('journalPagination');

  if (grid && paginationNav) {
    const cards = Array.from(grid.querySelectorAll('.journal-card'));
    const totalPages = Math.ceil(cards.length / CARDS_PER_PAGE);
    let currentPage = 0;

    // Build dots
    function buildDots() {
      paginationNav.innerHTML = '';
      for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('span');
        dot.className = 'journal-pagination__dot' + (i === currentPage ? ' journal-pagination__dot--active' : '');
        dot.setAttribute('aria-label', 'Page ' + (i + 1));
        dot.setAttribute('role', 'button');
        dot.setAttribute('tabindex', '0');
        if (i === currentPage) dot.setAttribute('aria-current', 'page');
        dot.addEventListener('click', () => goToPage(i));
        dot.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            goToPage(i);
          }
        });
        paginationNav.appendChild(dot);
      }
    }

    function showPage(page) {
      cards.forEach((card, i) => {
        const start = page * CARDS_PER_PAGE;
        const end = start + CARDS_PER_PAGE;
        if (i >= start && i < end) {
          card.classList.remove('is-hidden');
        } else {
          card.classList.add('is-hidden');
        }
      });

      // Update dots
      const dots = paginationNav.querySelectorAll('.journal-pagination__dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('journal-pagination__dot--active', i === page);
        if (i === page) {
          dot.setAttribute('aria-current', 'page');
        } else {
          dot.removeAttribute('aria-current');
        }
      });
    }

    function goToPage(page) {
      if (page === currentPage || page < 0 || page >= totalPages) return;

      // Fade out
      grid.classList.add('is-transitioning');

      setTimeout(() => {
        currentPage = page;
        showPage(currentPage);

        // Force reflow then fade in
        void grid.offsetHeight;
        grid.classList.remove('is-transitioning');
      }, 400);
    }

    // Init
    buildDots();
    showPage(0);
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

});
