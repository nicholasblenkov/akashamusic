/* ===================================================
   AKASHA MUSIC — About Page (Scroll-Hijack Engine)
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------
     REDUCED MOTION: skip hijack, show everything
     --------------------------------------------------- */
  if (prefersReducedMotion) {
    document.body.classList.add('reduced-motion', 'hijack-done');
    const hijack = document.getElementById('hijack');
    if (hijack) {
      hijack.style.position = 'relative';
      hijack.style.display = 'block';
      const panels = hijack.querySelectorAll('.panel');
      panels.forEach(p => {
        p.style.position = 'relative';
        p.style.opacity = '1';
        p.style.visibility = 'visible';
        p.style.minHeight = '100vh';
      });
      const steps = hijack.querySelectorAll('.step');
      steps.forEach(s => {
        s.style.opacity = '1';
        s.style.transform = 'none';
        s.style.position = 'relative';
      });
      const cards = hijack.querySelectorAll('.carousel__card');
      cards.forEach(c => {
        c.style.position = 'relative';
        c.style.opacity = '1';
        c.style.transform = 'none';
        c.style.display = 'block';
        c.style.marginBottom = '1rem';
        c.style.width = '100%';
        c.style.maxWidth = '600px';
        c.style.left = 'auto';
        c.style.top = 'auto';
        c.style.margin = '1rem auto';
      });
      const principles = hijack.querySelectorAll('.principle');
      principles.forEach(p => {
        p.style.position = 'relative';
        p.style.top = 'auto';
        p.style.left = 'auto';
        p.style.right = 'auto';
        p.style.transform = 'none';
        p.style.opacity = '1';
        p.style.marginBottom = '2rem';
        p.style.width = '100%';
        p.style.maxWidth = '700px';
      });
      const billboards = hijack.querySelectorAll('.billboard');
      billboards.forEach(b => {
        b.style.position = 'relative';
        b.style.top = 'auto';
        b.style.left = 'auto';
        b.style.transform = 'none';
        b.style.opacity = '1';
        b.style.width = '100%';
        b.style.marginBottom = '3rem';
      });
    }
    const after = document.getElementById('afterHijack');
    if (after) after.style.display = 'block';
    const tw = document.getElementById('typewriter');
    if (tw) tw.textContent = 'Shaping Artists Into Cultural Forces';
    document.querySelectorAll('.fade-in').forEach(el => el.classList.add('is-visible'));
    const pb = document.getElementById('progressBar');
    if (pb) pb.style.display = 'none';
    return;
  }

  /* ---------------------------------------------------
     STATE
     --------------------------------------------------- */
  const panels = document.querySelectorAll('.panel');
  const totalSections = panels.length;
  let currentSection = 0;
  let currentStep = 0;
  let locked = false;
  let justExited = false;
  const LOCK_MS = 200;
  const DELTA_THRESHOLD = 15;

  /* ---------------------------------------------------
     PROGRESS BAR
     --------------------------------------------------- */
  const progressBar = document.getElementById('progressBar');
  let totalSteps = 0;
  panels.forEach(p => { totalSteps += parseInt(p.dataset.steps, 10) || 1; });

  function updateProgress() {
    if (!progressBar) return;
    if (document.body.classList.contains('hijack-done')) return;
    let completed = 0;
    for (let i = 0; i < currentSection; i++) {
      completed += parseInt(panels[i].dataset.steps, 10) || 1;
    }
    completed += currentStep;
    const pct = (completed / Math.max(totalSteps - 1, 1)) * 80;
    progressBar.style.width = Math.min(pct, 80) + '%';
  }

  function updateScrollProgress() {
    if (!document.body.classList.contains('hijack-done')) return;
    if (!progressBar) return;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPct = scrollHeight > 0 ? window.scrollY / scrollHeight : 1;
    const pct = 80 + scrollPct * 20;
    progressBar.style.width = Math.min(pct, 100) + '%';
  }

  /* ---------------------------------------------------
     PANEL / STEP VISIBILITY
     --------------------------------------------------- */
  function showPanel(index) {
    panels.forEach((p, i) => {
      p.classList.toggle('is-active', i === index);
    });
  }

  function getStepCount(sectionIndex) {
    return parseInt(panels[sectionIndex].dataset.steps, 10) || 1;
  }

  function showSteps(sectionIndex, upToStep) {
    const panel = panels[sectionIndex];
    const steps = panel.querySelectorAll('.step');
    steps.forEach((s) => {
      const stepIdx = parseInt(s.dataset.step, 10);
      if (stepIdx <= upToStep) {
        s.classList.add('is-visible');
      } else {
        s.classList.remove('is-visible');
      }
    });
  }

  function hideAllSteps(sectionIndex) {
    const panel = panels[sectionIndex];
    panel.querySelectorAll('.step').forEach(s => s.classList.remove('is-visible'));
    panel.querySelectorAll('.carousel__card').forEach(c => {
      c.classList.remove('is-active', 'is-prev', 'is-next');
    });
  }

  /* ---------------------------------------------------
     CAROUSEL — Cover Flow (Section 5)
     --------------------------------------------------- */
  const carouselCards = document.querySelectorAll('.carousel__card');
  const carouselDots = document.querySelectorAll('.carousel__dot');

  function showCarouselCard(index) {
    carouselCards.forEach((card, i) => {
      card.classList.remove('is-active', 'is-prev', 'is-next');
      if (i === index) {
        card.classList.add('is-active');
      } else if (i === index - 1) {
        card.classList.add('is-prev');
      } else if (i === index + 1) {
        card.classList.add('is-next');
      }
    });
    carouselDots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === index);
    });
  }

  /* ---------------------------------------------------
     PRINCIPLES — One at a time (Section 6)
     --------------------------------------------------- */
  function showPrinciple(index) {
    const sectionEl = document.querySelector('[data-section="6"]');
    if (!sectionEl) return;
    sectionEl.querySelectorAll('.step').forEach(s => {
      const stepIdx = parseInt(s.dataset.step, 10);
      s.classList.toggle('is-visible', stepIdx === index);
    });
  }

  /* ---------------------------------------------------
     PHILOSOPHY — One at a time + bg transition (Section 7)
     --------------------------------------------------- */
  const philosophyPanel = document.getElementById('philosophyPanel');
  const philBgs = ['#1a1a1a', '#222019', '#2c2822', '#352f28', '#D5CFC5'];

  function showPhilosophy(index) {
    if (!philosophyPanel) return;
    philosophyPanel.querySelectorAll('.step').forEach(s => {
      const stepIdx = parseInt(s.dataset.step, 10);
      s.classList.toggle('is-visible', stepIdx === index);
    });
    philosophyPanel.style.background = philBgs[index] || philBgs[0];
  }

  /* ---------------------------------------------------
     UPDATE STEPS FOR CURRENT SECTION
     --------------------------------------------------- */
  function updateStepsForCurrentSection() {
    const sectionNum = parseInt(panels[currentSection].dataset.section, 10);
    if (sectionNum === 5) {
      showCarouselCard(currentStep);
    } else if (sectionNum === 6) {
      showPrinciple(currentStep);
    } else if (sectionNum === 7) {
      showPhilosophy(currentStep);
    } else {
      showSteps(currentSection, currentStep);
    }
    updateProgress();
  }

  /* ---------------------------------------------------
     TRANSITION TO NORMAL SCROLL
     --------------------------------------------------- */
  function exitHijack() {
    justExited = true;
    document.body.classList.add('hijack-done');
    window.scrollTo(0, 0);
    window.removeEventListener('wheel', onWheel);
    window.removeEventListener('touchstart', onTouchStart);
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('touchend', onTouchEnd);
    window.removeEventListener('keydown', onKeyDown);
    if (progressBar) progressBar.style.width = '80%';
    initFadeObserver();
    initNavScroll();
    setTimeout(() => { justExited = false; }, 600);
  }

  function enterHijack() {
    document.body.classList.remove('hijack-done');
    window.scrollTo(0, 0);
    currentSection = totalSections - 1;
    currentStep = getStepCount(currentSection) - 1;
    showPanel(currentSection);
    updateStepsForCurrentSection();
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('keydown', onKeyDown);
  }

  /* ---------------------------------------------------
     STEP / SECTION NAVIGATION
     --------------------------------------------------- */
  function advance() {
    if (locked) return;

    const maxSteps = getStepCount(currentSection);

    if (currentStep < maxSteps - 1) {
      currentStep++;
      updateStepsForCurrentSection();
      lock();
    } else if (currentSection < totalSections - 1) {
      hideAllSteps(currentSection);
      currentSection++;
      currentStep = 0;
      showPanel(currentSection);
      requestAnimationFrame(() => {
        updateStepsForCurrentSection();
      });
      lock();
    } else {
      exitHijack();
    }
  }

  function retreat() {
    if (locked) return;

    if (currentStep > 0) {
      currentStep--;
      updateStepsForCurrentSection();
      lock();
    } else if (currentSection > 0) {
      hideAllSteps(currentSection);
      currentSection--;
      currentStep = getStepCount(currentSection) - 1;
      showPanel(currentSection);
      requestAnimationFrame(() => {
        updateStepsForCurrentSection();
      });
      lock();
    }
  }

  function lock() {
    locked = true;
    setTimeout(() => { locked = false; }, LOCK_MS);
  }

  /* ---------------------------------------------------
     WHEEL EVENT
     --------------------------------------------------- */
  function onWheel(e) {
    e.preventDefault();
    if (Math.abs(e.deltaY) < DELTA_THRESHOLD) return;
    if (e.deltaY > 0) {
      advance();
    } else {
      retreat();
    }
  }

  /* ---------------------------------------------------
     TOUCH EVENTS
     --------------------------------------------------- */
  let touchStartY = 0;

  function onTouchStart(e) {
    touchStartY = e.touches[0].clientY;
  }

  function onTouchMove(e) {
    e.preventDefault();
    const diff = touchStartY - e.touches[0].clientY;
    if (Math.abs(diff) >= 25) {
      if (diff > 0) {
        advance();
      } else {
        retreat();
      }
      touchStartY = e.touches[0].clientY;
    }
  }

  function onTouchEnd() {}

  /* ---------------------------------------------------
     KEYBOARD NAVIGATION
     --------------------------------------------------- */
  function onKeyDown(e) {
    if (e.key === 'ArrowDown' || e.key === ' ') {
      e.preventDefault();
      advance();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      retreat();
    }
  }

  /* ---------------------------------------------------
     SCROLL BACK INTO HIJACK (from normal scroll)
     --------------------------------------------------- */
  function checkScrollBack() {
    if (justExited) return;
    if (!document.body.classList.contains('hijack-done')) return;
    if (window.scrollY <= 0) {
      enterHijack();
    }
  }

  /* ---------------------------------------------------
     NAV SCROLL STATE (for after-hijack mode)
     --------------------------------------------------- */
  function initNavScroll() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    function onScroll() {
      nav.classList.toggle('nav--scrolled', window.scrollY > 60);
      updateScrollProgress();
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scroll', checkScrollBack, { passive: true });
  }

  /* ---------------------------------------------------
     FADE-IN OBSERVER (for after-hijack sections)
     --------------------------------------------------- */
  function initFadeObserver() {
    const fadeElements = document.querySelectorAll('.fade-in');
    if (!fadeElements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    fadeElements.forEach(el => observer.observe(el));
  }

  /* ---------------------------------------------------
     TYPEWRITER EFFECT — completes in ~0.7s
     --------------------------------------------------- */
  const typewriterEl = document.getElementById('typewriter');
  if (typewriterEl) {
    const text = 'Shaping Artists Into Cultural Forces';
    let i = 0;
    function type() {
      if (i < text.length) {
        typewriterEl.textContent += text.charAt(i);
        i++;
        setTimeout(type, 18);
      }
    }
    // Start right after title animation (300ms)
    setTimeout(type, 350);
  }

  /* ---------------------------------------------------
     LAZY-LOAD VIDEOS — load immediately
     --------------------------------------------------- */
  const lazyVideos = document.querySelectorAll('video[data-src]');
  if (lazyVideos.length) {
    lazyVideos.forEach(video => {
      video.src = video.dataset.src;
      video.removeAttribute('data-src');
      video.load();
      video.play().catch(() => {});
    });
  }

  /* ---------------------------------------------------
     INIT
     --------------------------------------------------- */
  showPanel(0);
  currentStep = 0;
  updateProgress();

  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: false });
  window.addEventListener('touchend', onTouchEnd, { passive: true });
  window.addEventListener('keydown', onKeyDown);

});
