/* ===================================================
   AKASHA MUSIC — Esoteric About Page (V4)
   Scroll-driven cosmic journey engine
   Fixed: text overlap, scroll perf, smooth transitions
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

  // Smooth ease-in-out (cubic)
  function easeInOut(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  // Envelope: fade in over [inS, inE], sustain, fade out over [outS, outE]
  // Now applies smooth easing to both fade-in and fade-out
  function envelope(t, inS, inE, outS, outE) {
    if (t < inS) return 0;
    if (t < inE) return easeInOut((t - inS) / (inE - inS));
    if (t < outS) return 1;
    if (t < outE) return 1 - easeInOut((t - outS) / (outE - outS));
    return 0;
  }

  /* ---------------------------------------------------
     SECTION REGISTRATION & DIMENSION CACHE
     --------------------------------------------------- */
  let vh = window.innerHeight;
  let vw = window.innerWidth;
  let cachedScrollY = window.scrollY;
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

  // Cached card dimensions (avoid per-frame layout reads)
  let cardDimsCache = [];

  function cacheDimensions() {
    vh = window.innerHeight;
    vw = window.innerWidth;
    sectionData.forEach(s => {
      s.top = s.el.offsetTop;
      s.height = s.el.offsetHeight;
    });
    // Cache orbit card dimensions
    cardDimsCache = Array.from(orbitCards).map(card => ({
      hw: card.offsetWidth / 2 || CARD_HALF_W,
      hh: card.offsetHeight / 2 || CARD_HALF_H
    }));
  }

  function getProgress(section) {
    const scrollable = section.height - vh;
    if (scrollable <= 0) return clamp((cachedScrollY - section.top) / 1, 0, 1);
    return clamp((cachedScrollY - section.top) / scrollable, 0, 1);
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

  const reverseVoidSection = document.getElementById('reverse-void');

  const nav = document.querySelector('.nav');

  /* ---------------------------------------------------
     COLOR STOPS
     --------------------------------------------------- */
  const descentColors = [
    { pos: 0,   color: hexToRgb('#2E1A6B') },
    { pos: 0.2, color: hexToRgb('#4169E1') },
    { pos: 0.4, color: hexToRgb('#87CEEB') },
    { pos: 0.6, color: hexToRgb('#FFB6C1') },
    { pos: 0.8, color: hexToRgb('#FFDAB9') },
    { pos: 1,   color: hexToRgb('#F5F0EB') }
  ];

  const returnColors = [
    { pos: 0, color: hexToRgb('#1A1A2E') },
    { pos: 1, color: hexToRgb('#F5F0EB') }
  ];

  const returnTextColors = [
    { pos: 0,   color: { r: 255, g: 255, b: 255 } },
    { pos: 0.35, color: { r: 255, g: 255, b: 255 } },
    { pos: 0.6, color: hexToRgb('#1A1A1A') },
    { pos: 1,   color: hexToRgb('#1A1A1A') }
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

    // Keep content fixed only while void is in view (use cached dims)
    if (voidContent) {
      const voidData = sectionData.find(s => s.id === 'void');
      const sectionBottom = voidData ? voidData.top + voidData.height : 0;
      if (cachedScrollY > sectionBottom - vh * 0.5) {
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
      const fadeInT = easeInOut(clamp((progress - range.in[0]) / (range.in[1] - range.in[0]), 0, 1));
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
    return vw < 768;
  }

  function updateOrbit(progress) {
    if (isMobile()) {
      updateOrbitMobile(progress);
      return;
    }

    const radius = vw < 1024 ? 180 : ORBIT_RADIUS_DESKTOP;

    // 4 transitions between 5 cards, each 72deg apart
    // Card 0 starts at bottom (180deg), scrolling brings 1→2→3→4 to bottom
    const baseAngle = easeInOut(progress) * 288;

    orbitCards.forEach((card, i) => {
      // Clockwise rotation: card moves bottom → left → top → right
      const angle = ((baseAngle - i * 72 + 180) % 360 + 360) % 360;
      const rad = angle * Math.PI / 180;
      const x = Math.sin(rad) * radius;
      const y = -Math.cos(rad) * radius + 30;

      // Distance from bottom (180deg) — determines activity
      let distFrom180 = Math.abs(angle - 180);
      if (distFrom180 > 180) distFrom180 = 360 - distFrom180;

      const activity = clamp(1 - distFrom180 / 72, 0, 1);
      const easedActivity = easeInOut(activity);
      const scale = 0.7 + easedActivity * 0.4;
      const opacity = 0.25 + easedActivity * 0.75;
      const blur = (1 - easedActivity) * 2.5;

      // Use cached card dimensions
      const dims = cardDimsCache[i] || { hw: CARD_HALF_W, hh: CARD_HALF_H };

      card.style.transform = `translate(${x - dims.hw}px, ${y - dims.hh}px) scale(${scale})`;
      card.style.opacity = opacity;
      card.style.filter = blur > 0.1 ? `blur(${blur}px)` : 'none';
    });
  }

  function updateOrbitMobile(progress) {
    // On mobile: show cards sequentially 01→05, one at a time
    const count = orbitCards.length;
    const segment = 1 / count;

    orbitCards.forEach((card, i) => {
      const start = i * segment;
      const end = start + segment;
      const fadeIn = start + segment * 0.15;
      const fadeOut = end - segment * 0.15;

      const opacity = envelope(progress, start, fadeIn, fadeOut, end);
      const direction = i % 2 === 0 ? -1 : 1;
      const slideT = easeInOut(clamp((progress - start) / (fadeIn - start), 0, 1));
      const xOffset = direction * 60 * (1 - slideT);

      // Use cached card dimensions
      const dims = cardDimsCache[i] || { hw: CARD_HALF_W, hh: CARD_HALF_H };

      card.style.transform = `translate(calc(-50% + ${xOffset}px), -50%) scale(1)`;
      card.style.opacity = opacity;
      card.style.filter = 'none';
      card.style.left = '50%';
      card.style.top = '50%';
      card.style.marginTop = `-${dims.hh}px`;
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
  // Non-overlapping ranges: each text fully fades out before next fades in
  const returnRanges = [
    { in: [0.05, 0.12], out: [0.25, 0.32] },
    { in: [0.36, 0.43], out: [0.56, 0.63] },
    { in: [0.67, 0.74], out: [0.90, 0.97] }
  ];

  function updateReturn(progress) {
    if (!returnSection) return;

    // Background interpolation
    const bg = lerpColor(returnColors, progress);
    returnSection.style.backgroundColor = rgbStr(bg);

    // Global text color based on bg brightness
    const textColor = lerpColor(returnTextColors, progress);

    // Text fades — strictly one at a time, no overlap
    returnTexts.forEach((el, i) => {
      const range = returnRanges[i];
      if (!range) return;

      const opacity = envelope(progress, range.in[0], range.in[1], range.out[0], range.out[1]);
      const fadeInT = easeInOut(clamp((progress - range.in[0]) / (range.in[1] - range.in[0]), 0, 1));
      const yOffset = 30 * (1 - fadeInT);

      el.style.opacity = opacity;
      el.style.transform = `translateY(${yOffset}px)`;
      el.style.color = rgbStr(textColor);
    });
  }

  /* ---------------------------------------------------
     S8 — REVERSE VOID (portal closes)
     --------------------------------------------------- */
  function updateReverseVoid(progress) {
    if (!reverseVoidSection) return;
    // Invert progress: gradient starts expanded (1) and collapses to a dot (0)
    const inverted = 1 - progress;
    reverseVoidSection.style.setProperty('--reverse-void-progress', inverted);
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
    return: updateReturn,
    'reverse-void': updateReverseVoid
  };

  function update() {
    // Cache scroll position for this frame
    cachedScrollY = window.scrollY;

    // Nav scroll state
    if (nav) {
      nav.classList.toggle('nav--scrolled', cachedScrollY > 60);
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
