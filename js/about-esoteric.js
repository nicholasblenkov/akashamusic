/* ===================================================
   AKASHA MUSIC — Esoteric About Page (V1)
   Scroll-driven cosmic journey engine
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

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
  function clamp(val, min, max) {
    return Math.min(max, Math.max(min, val));
  }

  function hexToRgb(hex) {
    return {
      r: parseInt(hex.slice(1, 3), 16),
      g: parseInt(hex.slice(3, 5), 16),
      b: parseInt(hex.slice(5, 7), 16)
    };
  }

  function lerpColor(stops, t) {
    t = clamp(t, 0, 1);
    let i = 0;
    while (i < stops.length - 1 && stops[i + 1].pos <= t) i++;
    if (i >= stops.length - 1) {
      const c = stops[stops.length - 1].color;
      return { r: c.r, g: c.g, b: c.b };
    }
    const from = stops[i];
    const to = stops[i + 1];
    const localT = (t - from.pos) / (to.pos - from.pos);
    return {
      r: Math.round(from.color.r + (to.color.r - from.color.r) * localT),
      g: Math.round(from.color.g + (to.color.g - from.color.g) * localT),
      b: Math.round(from.color.b + (to.color.b - from.color.b) * localT)
    };
  }

  function rgbStr(c) {
    return `rgb(${c.r},${c.g},${c.b})`;
  }

  // Envelope: fade in over [inS, inE], sustain, fade out over [outS, outE]
  function envelope(t, inS, inE, outS, outE) {
    if (t < inS) return 0;
    if (t < inE) return (t - inS) / (inE - inS);
    if (t < outS) return 1;
    if (t < outE) return 1 - (t - outS) / (outE - outS);
    return 0;
  }

  /* ---------------------------------------------------
     SECTION REGISTRATION & DIMENSION CACHE
     --------------------------------------------------- */
  let vh = window.innerHeight;
  const sectionData = [];
  const sectionMap = new Map();

  document.querySelectorAll('[data-esoteric-section]').forEach(el => {
    const data = {
      el,
      id: el.dataset.esotericSection,
      top: 0,
      height: 0,
      near: false
    };
    sectionData.push(data);
    sectionMap.set(el, data);
  });

  function cacheDimensions() {
    vh = window.innerHeight;
    sectionData.forEach(s => {
      s.top = s.el.offsetTop;
      s.height = s.el.offsetHeight;
    });
  }

  function getProgress(section) {
    const scrollable = section.height - vh;
    if (scrollable <= 0) return clamp((window.scrollY - section.top) / 1, 0, 1);
    return clamp((window.scrollY - section.top) / scrollable, 0, 1);
  }

  /* ---------------------------------------------------
     INTERSECTION OBSERVER — near-viewport gating
     --------------------------------------------------- */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const data = sectionMap.get(entry.target);
      if (data) data.near = entry.isIntersecting;
    });
  }, { rootMargin: '300px 0px' });

  sectionData.forEach(s => observer.observe(s.el));

  /* ---------------------------------------------------
     ELEMENT REFS
     --------------------------------------------------- */
  const voidSection = document.getElementById('void');
  const voidDarken = document.querySelector('.void__darken');
  const voidTitle = document.querySelector('.void__title');
  const voidSubtitle = document.querySelector('.void__subtitle');
  const voidContent = document.querySelector('.void__content');

  const descentSection = document.getElementById('descent');
  const descentTexts = document.querySelectorAll('.descent__text');

  const orbTrack = document.querySelector('.orb-track');

  const orbitCards = document.querySelectorAll('.orbit__card');
  const ORBIT_RADIUS_DESKTOP = 220;
  const CARD_HALF_W = 130;
  const CARD_HALF_H = 85;

  const principleEls = document.querySelectorAll('.principle');

  const archEl = document.getElementById('arch');
  const archTexts = document.querySelectorAll('.arch__text');

  const returnSection = document.getElementById('return-section');
  const returnTexts = document.querySelectorAll('.return__text');

  const nav = document.querySelector('.nav');

  /* ---------------------------------------------------
     COLOR STOPS
     --------------------------------------------------- */
  const descentColors = [
    { pos: 0,   color: hexToRgb('#1A1A4E') },
    { pos: 0.2, color: hexToRgb('#2B4B8C') },
    { pos: 0.4, color: hexToRgb('#6B8EC4') },
    { pos: 0.6, color: hexToRgb('#C4A0AA') },
    { pos: 0.8, color: hexToRgb('#D4B0A0') },
    { pos: 1,   color: hexToRgb('#F5F0EB') }
  ];

  const returnColors = [
    { pos: 0, color: hexToRgb('#1A1A2E') },
    { pos: 1, color: hexToRgb('#F5F0EB') }
  ];

  const returnTextColors = [
    { pos: 0,   color: { r: 255, g: 255, b: 255 } },
    { pos: 0.45, color: { r: 255, g: 255, b: 255 } },
    { pos: 0.8, color: hexToRgb('#2A2A2A') },
    { pos: 1,   color: hexToRgb('#2A2A2A') }
  ];

  /* ---------------------------------------------------
     S1 — THE VOID
     --------------------------------------------------- */
  function updateVoid(progress) {
    if (!voidSection) return;

    voidSection.style.setProperty('--void-progress', progress);

    // Title at ~30%
    if (voidTitle) {
      voidTitle.style.opacity = clamp((progress - 0.25) / 0.1, 0, 1);
    }

    // Subtitle at ~50%
    if (voidSubtitle) {
      voidSubtitle.style.opacity = clamp((progress - 0.45) / 0.1, 0, 1) * 0.6;
    }

    // Deep indigo overlay from 80-100% (matches descent start color)
    if (voidDarken) {
      const darken = clamp((progress - 0.8) / 0.2, 0, 1) * 0.7;
      voidDarken.style.opacity = darken;
    }

    // Keep content fixed only while void is in view
    if (voidContent) {
      const sectionBottom = voidSection.offsetTop + voidSection.offsetHeight;
      if (window.scrollY > sectionBottom - vh * 0.5) {
        voidContent.style.opacity = '0';
      } else {
        voidContent.style.opacity = '';
      }
    }
  }

  /* ---------------------------------------------------
     S2 — THE DESCENT
     --------------------------------------------------- */
  const descentRanges = [
    { in: [0.03, 0.10], out: [0.22, 0.28] },
    { in: [0.25, 0.32], out: [0.42, 0.48] },
    { in: [0.45, 0.52], out: [0.67, 0.73] },
    { in: [0.70, 0.77], out: [0.92, 0.98] }
  ];

  function updateDescent(progress) {
    if (!descentSection) return;

    // Background interpolation
    const bg = lerpColor(descentColors, progress);
    descentSection.style.backgroundColor = rgbStr(bg);

    // Text fades
    descentTexts.forEach((el, i) => {
      const range = descentRanges[i];
      if (!range) return;

      const opacity = envelope(progress, range.in[0], range.in[1], range.out[0], range.out[1]);
      const fadeInT = clamp((progress - range.in[0]) / (range.in[1] - range.in[0]), 0, 1);
      const yOffset = 40 * (1 - fadeInT);

      el.style.opacity = opacity;
      el.style.transform = `translateY(${yOffset}px)`;

      // Last text: color transitions from white to dark
      if (i === 3) {
        const colorT = clamp((progress - 0.70) / 0.25, 0, 1);
        const tc = lerpColor([
          { pos: 0, color: { r: 255, g: 255, b: 255 } },
          { pos: 1, color: hexToRgb('#2A2A2A') }
        ], colorT);
        el.style.color = rgbStr(tc);
      }
    });
  }

  /* ---------------------------------------------------
     S3 — THE ORB
     --------------------------------------------------- */
  function updateOrb(progress) {
    if (!orbTrack) return;
    const yOffset = progress * -120;
    const rotation = progress * 15;
    orbTrack.style.transform = `translateY(${yOffset}px) rotate(${rotation}deg)`;
  }

  /* ---------------------------------------------------
     S4 — SERVICES ORBIT (sequential 01→05)
     --------------------------------------------------- */
  function isMobile() {
    return window.innerWidth < 768;
  }

  function updateOrbit(progress) {
    if (isMobile()) {
      updateOrbitMobile(progress);
      return;
    }

    const radius = window.innerWidth < 1024 ? 180 : ORBIT_RADIUS_DESKTOP;

    // 4 transitions between 5 cards, each 72deg apart
    // Card 0 starts at bottom (180deg), scrolling brings 1→2→3→4 to bottom
    const baseAngle = progress * 288;

    orbitCards.forEach((card, i) => {
      // Negative rotation so next card arrives at bottom as we scroll
      const angle = ((-baseAngle + i * 72 + 180) % 360 + 360) % 360;
      const rad = angle * Math.PI / 180;
      const x = Math.sin(rad) * radius;
      const y = -Math.cos(rad) * radius + 30;

      // Distance from bottom (180deg) — determines activity
      let distFrom180 = Math.abs(angle - 180);
      if (distFrom180 > 180) distFrom180 = 360 - distFrom180;

      const activity = clamp(1 - distFrom180 / 72, 0, 1);
      const scale = 0.7 + activity * 0.4;
      const opacity = 0.25 + activity * 0.75;
      const blur = (1 - activity) * 2.5;

      const hw = card.offsetWidth / 2 || CARD_HALF_W;
      const hh = card.offsetHeight / 2 || CARD_HALF_H;

      card.style.transform = `translate(${x - hw}px, ${y - hh}px) scale(${scale})`;
      card.style.opacity = opacity;
      card.style.filter = blur > 0.1 ? `blur(${blur}px)` : 'none';

      // Sphere brightness: active cards glow bigger and brighter
      const sphereOpacity = 0.1 + activity * 0.5;
      const sphereScale = 0.7 + activity * 0.5;
      card.style.setProperty('--sphere-opacity', sphereOpacity);
      card.style.setProperty('--sphere-scale', sphereScale);
    });
  }

  function updateOrbitMobile(progress) {
    // On mobile: show cards sequentially 01→05, one at a time
    const count = orbitCards.length;
    const segment = 1 / count;

    orbitCards.forEach((card, i) => {
      const start = i * segment;
      const end = start + segment;
      const fadeIn = start + segment * 0.1;
      const fadeOut = end - segment * 0.1;

      const opacity = envelope(progress, start, fadeIn, fadeOut, end);
      const direction = i % 2 === 0 ? -1 : 1;
      const slideT = clamp((progress - start) / (fadeIn - start), 0, 1);
      const xOffset = direction * 60 * (1 - slideT);

      card.style.transform = `translate(calc(-50% + ${xOffset}px), -50%) scale(1)`;
      card.style.opacity = opacity;
      card.style.filter = 'none';
      card.style.left = '50%';
      card.style.top = '50%';
      card.style.marginTop = `-${(card.offsetHeight || 160) / 2}px`;

      // Sphere brightness on mobile
      card.style.setProperty('--sphere-opacity', opacity > 0.5 ? 0.45 : 0.1);
      card.style.setProperty('--sphere-scale', opacity > 0.5 ? 1.1 : 0.7);
    });
  }

  /* ---------------------------------------------------
     S5 — PRINCIPLES
     --------------------------------------------------- */
  function updatePrinciples(progress) {
    const count = principleEls.length;
    const segment = 1 / count;

    principleEls.forEach((el, i) => {
      const start = i * segment;
      const localT = clamp((progress - start) / segment, 0, 1);

      // Smooth ease
      const eased = localT < 0.5
        ? 2 * localT * localT
        : 1 - 2 * (1 - localT) * (1 - localT);

      const watermark = el.querySelector('.principle__watermark');
      const content = el.querySelector('.principle__content');

      // Watermark slides from left
      if (watermark) {
        const xOff = -100 * (1 - eased);
        watermark.style.transform = `translateX(${xOff}px)`;
        watermark.style.opacity = clamp(eased, 0, 0.15);
      }

      // Content slides from right
      if (content) {
        const xOff = 50 * (1 - eased);
        content.style.transform = `translateX(${xOff}px)`;
        content.style.opacity = eased;
      }

      // Fade out previous principle when next one starts
      if (i < count - 1) {
        const nextStart = (i + 1) * segment;
        const fadeOutT = clamp((progress - nextStart) / (segment * 0.3), 0, 1);
        if (fadeOutT > 0) {
          const overallOpacity = 1 - fadeOutT;
          if (watermark) watermark.style.opacity = clamp(eased, 0, 0.15) * overallOpacity;
          if (content) content.style.opacity = eased * overallOpacity;
        }
      }
    });
  }

  /* ---------------------------------------------------
     S6 — THE ARCH
     --------------------------------------------------- */
  const archRanges = [
    { in: [0.03, 0.10], out: [0.20, 0.26] },
    { in: [0.22, 0.28], out: [0.40, 0.46] },
    { in: [0.42, 0.48], out: [0.60, 0.66] },
    { in: [0.62, 0.70], out: [0.82, 0.88] },
    { in: [0.84, 0.90], out: [0.96, 1.0] }
  ];

  function updateArch(progress) {
    // Glow + hue rotation via CSS custom properties
    if (archEl) {
      archEl.style.setProperty('--arch-glow', progress);
      archEl.style.setProperty('--arch-hue', progress * 90 + 'deg');
    }

    // Text swaps
    archTexts.forEach((el, i) => {
      const range = archRanges[i];
      if (!range) return;
      el.style.opacity = envelope(progress, range.in[0], range.in[1], range.out[0], range.out[1]);
    });
  }

  /* ---------------------------------------------------
     S7 — RETURN TO EARTH
     --------------------------------------------------- */
  const returnRanges = [
    { in: [0.08, 0.18], out: [0.38, 0.48] },
    { in: [0.35, 0.45], out: [0.65, 0.75] },
    { in: [0.60, 0.70], out: [0.95, 1.0] }
  ];

  function updateReturn(progress) {
    if (!returnSection) return;

    // Background interpolation
    const bg = lerpColor(returnColors, progress);
    returnSection.style.backgroundColor = rgbStr(bg);

    // Global text color based on bg brightness
    const textColor = lerpColor(returnTextColors, progress);

    // Text fades
    returnTexts.forEach((el, i) => {
      const range = returnRanges[i];
      if (!range) return;

      const opacity = envelope(progress, range.in[0], range.in[1], range.out[0], range.out[1]);
      const fadeInT = clamp((progress - range.in[0]) / (range.in[1] - range.in[0]), 0, 1);
      const yOffset = 30 * (1 - fadeInT);

      el.style.opacity = opacity;
      el.style.transform = `translateY(${yOffset}px)`;
      el.style.color = rgbStr(textColor);
    });
  }

  /* ---------------------------------------------------
     UPDATE DISPATCH
     --------------------------------------------------- */
  const updateFns = {
    void: updateVoid,
    descent: updateDescent,
    orb: updateOrb,
    orbit: updateOrbit,
    principles: updatePrinciples,
    arch: updateArch,
    return: updateReturn
  };

  function update() {
    // Nav scroll state
    if (nav) {
      nav.classList.toggle('nav--scrolled', window.scrollY > 60);
    }

    // Per-section updates
    sectionData.forEach(section => {
      if (!section.near) return;
      const progress = getProgress(section);
      const fn = updateFns[section.id];
      if (fn) fn(progress);
    });
  }

  /* ---------------------------------------------------
     SCROLL HANDLER (rAF throttled)
     --------------------------------------------------- */
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------------------------------------------------
     RESIZE HANDLER
     --------------------------------------------------- */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      cacheDimensions();
      update();
    }, 150);
  });

  /* ---------------------------------------------------
     INIT
     --------------------------------------------------- */
  cacheDimensions();
  update();

});
