/* ===================================================
   AKASHA MUSIC — Esoteric About Page (V4)
   Scroll-driven cosmic journey — rAF loop, instant show/hide
   No text overlap. One text visible at a time.
   =================================================== */

(function () {

  /* ---------------------------------------------------
     REDUCED MOTION — show everything statically
     --------------------------------------------------- */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.void__title, .void__subtitle').forEach(el => {
      el.style.opacity = '1';
    });
    return;
  }

  /* ---------------------------------------------------
     HELPERS
     --------------------------------------------------- */
  function clamp01(val) {
    return val < 0 ? 0 : val > 1 ? 1 : val;
  }

  function getSectionProgress(section) {
    const vh = window.innerHeight;
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const scrollable = sectionHeight - vh;
    if (scrollable <= 0) return clamp01((window.scrollY - sectionTop) / 1);
    return clamp01((window.scrollY - sectionTop) / scrollable);
  }

  function lerpColorArray(colors, t) {
    t = clamp01(t);
    const colorProgress = t * (colors.length - 1);
    const idx = Math.min(Math.floor(colorProgress), colors.length - 2);
    const localT = colorProgress - idx;
    return [
      Math.round(colors[idx][0] + (colors[idx + 1][0] - colors[idx][0]) * localT),
      Math.round(colors[idx][1] + (colors[idx + 1][1] - colors[idx][1]) * localT),
      Math.round(colors[idx][2] + (colors[idx + 1][2] - colors[idx][2]) * localT)
    ];
  }

  /* ---------------------------------------------------
     ELEMENT REFS
     --------------------------------------------------- */
  const nav = document.querySelector('.nav');
  const sections = document.querySelectorAll('[data-esoteric-section]');

  /* ---------------------------------------------------
     COLOR PALETTES
     --------------------------------------------------- */
  const descentColors = [
    [0, 0, 0],       // #000000 (black)
    [65, 105, 225],  // #4169E1
    [135, 206, 235], // #87CEEB
    [255, 182, 193], // #FFB6C1
    [255, 218, 185], // #FFDAB9
    [245, 240, 235]  // #F5F0EB
  ];

  const returnColors = [
    [245, 240, 235], // #F5F0EB (cream — start light)
    [255, 218, 185], // #FFDAB9
    [255, 182, 193], // #FFB6C1
    [135, 206, 235], // #87CEEB
    [65, 105, 225],  // #4169E1
    [46, 26, 107]    // #2E1A6B (deep indigo — end dark)
  ];

  /* ---------------------------------------------------
     MAIN UPDATE — rAF loop, no scroll event listener
     --------------------------------------------------- */
  function update() {
    const scrollY = window.scrollY;

    // Nav scroll state
    if (nav) {
      nav.classList.toggle('nav--scrolled', scrollY > 60);
    }

    sections.forEach(section => {
      const type = section.dataset.esotericSection;
      const progress = getSectionProgress(section);

      // ----- S1: THE VOID -----
      if (type === 'void') {
        section.style.setProperty('--void-progress', progress);

        const title = section.querySelector('.void__title');
        const subtitle = section.querySelector('.void__subtitle');
        const content = section.querySelector('.void__content');

        if (title) title.style.opacity = progress > 0.3 ? '1' : '0';
        if (subtitle) subtitle.style.opacity = progress > 0.5 ? '1' : '0';

        // Hide content when scrolled past void
        if (content) {
          const sectionBottom = section.offsetTop + section.offsetHeight;
          content.style.opacity = scrollY > sectionBottom - window.innerHeight * 0.5 ? '0' : '';
        }
      }

      // ----- S2: THE DESCENT (4 texts, one at a time) -----
      if (type === 'descent') {
        // Background color interpolation
        const bg = lerpColorArray(descentColors, progress);
        section.style.backgroundColor = `rgb(${bg[0]},${bg[1]},${bg[2]})`;

        // Text: instant show/hide, one at a time
        const texts = section.querySelectorAll('[data-index]');
        const stepSize = 1 / (texts.length + 1);
        texts.forEach((el, i) => {
          const showStart = stepSize * (i + 0.5);
          const showEnd = stepSize * (i + 1.5);
          const visible = progress >= showStart && progress < showEnd;
          el.style.opacity = visible ? '1' : '0';

          // Text color: switch to dark when background gets light
          if (visible) {
            el.style.color = progress > 0.55 ? '#1A1A1A' : '';
          }
        });
      }

      // ----- S3: THE ORB -----
      if (type === 'orb') {
        const orbTrack = section.querySelector('.orb-track');
        if (orbTrack) {
          orbTrack.style.transform = `translateY(${-progress * 120}px) rotate(${progress * 15}deg)`;
        }
        const content = section.querySelector('.orb-section__content');
        if (content) content.style.opacity = progress > 0.2 ? '1' : '0';
      }

      // ----- S4: SERVICES ORBIT -----
      if (type === 'orbit') {
        const cards = section.querySelectorAll('.orbit__card');
        const totalCards = cards.length;
        const isMobile = window.innerWidth < 768;

        if (isMobile) {
          // Mobile: show one card at a time, centered
          const segment = 1 / totalCards;
          cards.forEach((card, i) => {
            const start = i * segment;
            const end = start + segment;
            const visible = progress >= start && progress < end;
            card.style.opacity = visible ? '1' : '0';
            card.style.transform = visible ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0.8)';
            card.style.filter = 'none';
            card.style.left = '50%';
            card.style.top = '50%';
          });
        } else {
          // Desktop: clockwise orbit
          const radius = window.innerWidth < 1024 ? 180 : 220;
          const baseAngle = progress * 288;

          cards.forEach((card, i) => {
            const angle = ((baseAngle - i * 72 + 180) % 360 + 360) % 360;
            const rad = angle * Math.PI / 180;
            const x = Math.sin(rad) * radius;
            const y = -Math.cos(rad) * radius + 30;

            let distFrom180 = Math.abs(angle - 180);
            if (distFrom180 > 180) distFrom180 = 360 - distFrom180;

            const isActive = distFrom180 < 36;
            const activity = clamp01(1 - distFrom180 / 72);
            const scale = 0.7 + activity * 0.4;
            const opacity = 0.25 + activity * 0.75;
            const blur = (1 - activity) * 2.5;

            const hw = card.offsetWidth / 2 || 130;
            const hh = card.offsetHeight / 2 || 85;

            card.style.transform = `translate(${x - hw}px, ${y - hh}px) scale(${scale})`;
            card.style.opacity = opacity;
            card.style.zIndex = isActive ? '10' : '1';
            card.style.filter = blur > 0.1 ? `blur(${blur}px)` : 'none';
          });
        }
      }

      // ----- S5: PRINCIPLES (one at a time, slide in from position) -----
      if (type === 'principles') {
        const principles = section.querySelectorAll('.principle');
        const count = principles.length;
        principles.forEach((el, i) => {
          const showStart = (i / count) * 0.9;
          const showEnd = ((i + 1) / count) * 0.9;
          const isActive = progress >= showStart && progress < showEnd;
          if (isActive) {
            el.classList.add('is-active');
          } else {
            el.classList.remove('is-active');
          }
        });
      }

      // ----- S6: THE ARCH (5 texts, one at a time inside arch shape) -----
      if (type === 'arch') {
        const archEl = section.querySelector('.arch');
        if (archEl) {
          archEl.style.setProperty('--arch-glow', progress);
          archEl.style.setProperty('--arch-hue', progress * 90 + 'deg');
        }

        const texts = section.querySelectorAll('[data-index]');
        const stepSize = 1 / (texts.length + 1);
        texts.forEach((el, i) => {
          const showStart = stepSize * (i + 0.5);
          const showEnd = stepSize * (i + 1.5);
          el.style.opacity = (progress >= showStart && progress < showEnd) ? '1' : '0';
        });
      }

      // ----- S7: RETURN TO EARTH (3 texts, one at a time) -----
      if (type === 'return') {
        // Background color interpolation
        const bg = lerpColorArray(returnColors, progress);
        section.style.backgroundColor = `rgb(${bg[0]},${bg[1]},${bg[2]})`;

        // Text color: dark on light bg, white on dark bg (switches as bg darkens)
        const textColor = progress > 0.45 ? '#FFFFFF' : '#1A1A1A';

        const texts = section.querySelectorAll('[data-index]');
        const stepSize = 1 / (texts.length + 1);
        texts.forEach((el, i) => {
          const showStart = stepSize * (i + 0.5);
          const showEnd = stepSize * (i + 1.5);
          const visible = progress >= showStart && progress < showEnd;
          el.style.opacity = visible ? '1' : '0';
          el.style.color = textColor;
        });
      }

      // ----- S8: REVERSE VOID -----
      if (type === 'reverse-void') {
        const inverted = 1 - progress;
        section.style.setProperty('--reverse-void-progress', inverted);
      }
    });

    requestAnimationFrame(update);
  }

  // Start the loop
  requestAnimationFrame(update);

})();
