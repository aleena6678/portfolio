/**
 * Aleena Saji Portfolio - Astronaut EVA Spacewalk Simulation
 * Interactive Space Canvas, Zero-G Parallax, Helmet HUD & Controls
 */

document.addEventListener('DOMContentLoaded', () => {
  // ----------------------------------------------------
  // ----------------------------------------------------
  // 1. Deep Space Canvas Simulation (Astronaut Spacewalk Floating Gait)
  // ----------------------------------------------------
  const canvas = document.getElementById('space-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Responsive Canvas Resize
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initStars();
  });

  // Mouse Tracking with smooth Lerp for Zero-G Look Parallax
  let targetMouseX = 0;
  let targetMouseY = 0;
  let currentMouseX = 0;
  let currentMouseY = 0;

  window.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX - width / 2) / (width / 2);
    targetMouseY = (e.clientY - height / 2) / (height / 2);
  });

  // Spacewalk Gait Dynamics & Scroll Parallax
  let targetScrollY = window.scrollY;
  let smoothScrollY = window.scrollY;
  let lastScrollY = window.scrollY;
  let walkStepPhase = 0;
  let targetMotionFactor = 0;
  let walkMotionFactor = 0;

  window.addEventListener('scroll', () => {
    const currentY = window.scrollY;
    const deltaY = currentY - lastScrollY;
    lastScrollY = currentY;

    // Advance astronaut walking gait step phase with scroll distance (slow, gentle cadence)
    const clampedDelta = Math.max(-50, Math.min(50, deltaY));
    walkStepPhase += Math.abs(clampedDelta) * 0.007;
    targetMotionFactor = 1.0;

    // Distant Nebula Celestial Parallax (subtle, slow drift)
    document.documentElement.style.setProperty('--nebula-scroll', `${-currentY * 0.025}px`);
  }, { passive: true });

  // Starfield Configuration
  const STAR_COUNT = Math.min(380, Math.floor((width * height) / 3200));
  let stars = [];

  const starColors = [
    { r: 248, g: 250, b: 252 }, // Starlight White
    { r: 186, g: 230, b: 253 }, // Visor Cyan / Ice Blue
    { r: 254, g: 240, b: 138 }, // Distant Warm Solar Gold
    { r: 233, g: 213, b: 255 }  // Cosmic Violet
  ];

  function initStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      const depth = Math.random() * 2.5 + 0.5; // 0.5 (far) to 3.0 (near)
      const color = starColors[Math.floor(Math.random() * starColors.length)];
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        depth: depth,
        baseRadius: Math.random() * 1.4 + (depth > 2 ? 1.0 : 0.4),
        color: color,
        alpha: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.03 + 0.008,
        twinklePhase: Math.random() * Math.PI * 2,
        hasFlare: Math.random() > 0.88 && depth > 1.8
      });
    }
  }

  initStars();

  // Shooting Stars / Meteors Simulation
  const meteors = [];

  function spawnMeteor() {
    if (meteors.length < 2 && Math.random() < 0.35) {
      const startX = Math.random() * width * 0.8;
      const startY = Math.random() * height * 0.4;
      const speed = Math.random() * 14 + 10;
      const angle = (Math.PI / 180) * (Math.random() * 20 + 25); // 25-45 deg downward streak
      const length = Math.random() * 100 + 80;
      meteors.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: length,
        life: 1.0,
        decay: Math.random() * 0.02 + 0.015
      });
    }
  }

  setInterval(spawnMeteor, 2400);

  // Floating Visor Micro-Stardust Particles
  const stardust = [];
  for (let i = 0; i < 28; i++) {
    stardust.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3 - 0.1, // slow zero-G upward drift
      radius: Math.random() * 1.8 + 0.8,
      alpha: Math.random() * 0.4 + 0.2
    });
  }

  // Animation Loop
  let time = 0;

  function renderSpace() {
    time += 0.016;

    // Smooth Lerp for Mouse Parallax
    currentMouseX += (targetMouseX - currentMouseX) * 0.04;
    currentMouseY += (targetMouseY - currentMouseY) * 0.04;

    // Smooth scroll interpolation for gentle spacewalk traverse
    targetScrollY = window.scrollY;
    smoothScrollY += (targetScrollY - smoothScrollY) * 0.05;

    // Spacewalk Gait Dynamics (calm, slowed astronaut footsteps bob & lateral sway)
    walkMotionFactor += (targetMotionFactor - walkMotionFactor) * 0.10;
    targetMotionFactor *= 0.90; // decay walking impulse when stopped

    // Buoyant vertical step rise & dip, lateral weight transfer sway (slowed & gentle)
    const walkBobY = Math.sin(walkStepPhase) * (2.2 * walkMotionFactor);
    const walkSwayX = Math.cos(walkStepPhase * 0.5) * (1.6 * walkMotionFactor);

    // Slowed Zero-G Autonomous Space Drift combined with spacewalk gait
    const zeroGDriftX = Math.sin(time * 0.1) * 4 + walkSwayX;
    const zeroGDriftY = Math.cos(time * 0.08) * 3 + walkBobY;

    // Helmet Visor & Reticle Spacewalk Head-Bob (subtle & calm)
    const glare = document.getElementById('visor-glare');
    if (glare) {
      const glareOffsetX = targetMouseX * 25 + walkSwayX * 1.2;
      const glareOffsetY = targetMouseY * 20 + walkBobY * 1.2;
      glare.style.transform = `rotate(-12deg) translate(${glareOffsetX}px, ${glareOffsetY}px)`;
    }

    const crosshair = document.getElementById('hud-crosshair');
    if (crosshair) {
      crosshair.style.transform = `translate(calc(-50% + ${targetMouseX * 15 + walkSwayX}px), calc(-50% + ${targetMouseY * 15 + walkBobY}px))`;
    }

    ctx.clearRect(0, 0, width, height);

    // 1. Draw Stars with Slowed Spacewalk Multi-Depth Parallax (Crisp points, NO warp lines)
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];

      // Multi-layer parallax: slowed down for serene, majestic depth
      const starScrollShift = smoothScrollY * s.depth * 0.08;
      const offsetX = currentMouseX * s.depth * 18 + zeroGDriftX * (s.depth / 2);
      const offsetY = currentMouseY * s.depth * 18 + zeroGDriftY * (s.depth / 2) - starScrollShift;

      let px = (s.x + offsetX) % width;
      let py = (s.y + offsetY) % height;
      if (px < 0) px += width;
      if (py < 0) py += height;

      // Twinkle calculation
      const twinkle = Math.sin(time * s.twinkleSpeed * 100 + s.twinklePhase);
      const currentAlpha = Math.max(0.15, Math.min(1, s.alpha + twinkle * 0.35));

      ctx.beginPath();
      ctx.arc(px, py, s.baseRadius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, ${currentAlpha})`;
      ctx.fill();

      // Diffraction Spike Flare for prominent stars
      if (s.hasFlare && currentAlpha > 0.6) {
        ctx.strokeStyle = `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, ${currentAlpha * 0.45})`;
        ctx.lineWidth = 0.75;
        const flareLen = s.baseRadius * 5.5;

        ctx.beginPath();
        ctx.moveTo(px - flareLen, py);
        ctx.lineTo(px + flareLen, py);
        ctx.moveTo(px, py - flareLen);
        ctx.lineTo(px, py + flareLen);
        ctx.stroke();
      }
    }

    // 2. Draw Meteors
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      m.x += m.vx;
      m.y += m.vy;
      m.life -= m.decay;

      if (m.life <= 0 || m.x > width || m.y > height) {
        meteors.splice(i, 1);
        continue;
      }

      const tailX = m.x - (m.vx / Math.hypot(m.vx, m.vy)) * m.length;
      const tailY = m.y - (m.vy / Math.hypot(m.vx, m.vy)) * m.length;

      const grad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
      grad.addColorStop(0, 'rgba(56, 189, 248, 0)');
      grad.addColorStop(0.7, `rgba(56, 189, 248, ${m.life * 0.6})`);
      grad.addColorStop(1, `rgba(255, 255, 255, ${m.life})`);

      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(m.x, m.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.8;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Meteor head spark
      ctx.beginPath();
      ctx.arc(m.x, m.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${m.life})`;
      ctx.fill();
    }

    // 3. Draw Visor Micro-Stardust (gentle drift with spacewalk footsteps)
    for (let i = 0; i < stardust.length; i++) {
      const p = stardust[i];
      p.x += p.vx + walkSwayX * 0.05;
      p.y += p.vy - (targetScrollY - smoothScrollY) * 0.02 + walkBobY * 0.04;

      if (p.x < 0) p.x += width;
      if (p.x > width) p.x -= width;
      if (p.y < 0) p.y += height;
      if (p.y > height) p.y -= height;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(186, 230, 253, ${p.alpha * 0.7})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = 'rgba(56, 189, 248, 0.5)';
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    requestAnimationFrame(renderSpace);
  }

  renderSpace();

  // ----------------------------------------------------
  // 2. Astronaut Visor HUD Toggle Control
  // ----------------------------------------------------
  const hudToggleBtn = document.getElementById('hud-toggle-btn');
  const astronautHud = document.getElementById('astronaut-hud');
  const hudBtnStatus = document.getElementById('hud-btn-status');

  let hudActive = true;
  if (hudToggleBtn && astronautHud) {
    hudToggleBtn.addEventListener('click', () => {
      hudActive = !hudActive;
      if (hudActive) {
        astronautHud.classList.remove('hidden');
        if (hudBtnStatus) hudBtnStatus.textContent = 'ON';
        hudToggleBtn.style.borderColor = 'rgba(56, 189, 248, 0.4)';
      } else {
        astronautHud.classList.add('hidden');
        if (hudBtnStatus) hudBtnStatus.textContent = 'OFF';
        hudToggleBtn.style.borderColor = 'rgba(148, 163, 184, 0.3)';
      }
    });
  }

  // ----------------------------------------------------
  // 3. Astronaut EVA Audio Synthesizer (Web Audio API)
  // ----------------------------------------------------
  const audioToggleBtn = document.getElementById('audio-toggle-btn');
  const audioBtnStatus = document.getElementById('audio-btn-status');
  const audioBtnIcon = document.getElementById('audio-btn-icon');

  let audioCtx = null;
  let humOsc = null;
  let noiseNode = null;
  let gainNode = null;
  let audioPlaying = false;

  function initSpaceAudio() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();

      // Low frequency spacesuit atmosphere hum
      humOsc = audioCtx.createOscillator();
      humOsc.type = 'sine';
      humOsc.frequency.setValueAtTime(68, audioCtx.currentTime); // 68Hz cabin drone

      // Filtered gentle airflow noise (spacesuit life-support O2 circulation)
      const bufferSize = audioCtx.sampleRate * 2;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      noiseNode = audioCtx.createBufferSource();
      noiseNode.buffer = noiseBuffer;
      noiseNode.loop = true;

      const bandpass = audioCtx.createBiquadFilter();
      bandpass.type = 'lowpass';
      bandpass.frequency.setValueAtTime(320, audioCtx.currentTime);

      gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.045, audioCtx.currentTime); // gentle ambient volume

      humOsc.connect(gainNode);
      noiseNode.connect(bandpass);
      bandpass.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      humOsc.start();
      noiseNode.start();
    } catch (err) {
      console.warn('Web Audio not supported or blocked:', err);
    }
  }

  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      if (!audioCtx) {
        initSpaceAudio();
        audioPlaying = true;
      } else if (audioCtx.state === 'suspended') {
        audioCtx.resume();
        audioPlaying = true;
      } else if (audioCtx.state === 'running') {
        audioCtx.suspend();
        audioPlaying = false;
      }

      if (audioPlaying) {
        if (audioBtnStatus) audioBtnStatus.textContent = 'ON';
        if (audioBtnIcon) audioBtnIcon.className = 'fas fa-volume-high';
        audioToggleBtn.style.borderColor = 'var(--accent)';
      } else {
        if (audioBtnStatus) audioBtnStatus.textContent = 'OFF';
        if (audioBtnIcon) audioBtnIcon.className = 'fas fa-volume-xmark';
        audioToggleBtn.style.borderColor = 'rgba(56, 189, 248, 0.4)';
      }
    });
  }

  // ----------------------------------------------------
  // 4. Navbar & HUD Scroll Effects
  // ----------------------------------------------------
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    if (window.scrollY > 120) {
      astronautHud?.classList.add('scrolled-down');
    } else {
      astronautHud?.classList.remove('scrolled-down');
    }
  });

  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');

  function closeMobileNav() {
    if (mobileNav && mobileMenuBtn) {
      mobileNav.style.display = 'none';
      mobileNav.classList.remove('open');
      mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }
  }

  function openMobileNav() {
    if (mobileNav && mobileMenuBtn) {
      mobileNav.style.display = 'block';
      mobileNav.classList.add('open');
      mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
    }
  }

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isClosed = mobileNav.style.display === 'none' || mobileNav.style.display === '';
      if (isClosed) {
        openMobileNav();
      } else {
        closeMobileNav();
      }
    });

    const mobileLinks = mobileNav.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileNav();
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        closeMobileNav();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMobileNav();
      }
    });

    // Reset on window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        closeMobileNav();
      }
    });
  }

  // ----------------------------------------------------
  // 5. Scroll Fade-In Animations (IntersectionObserver)
  // ----------------------------------------------------
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in-section').forEach(section => {
    observer.observe(section);
  });

  // ----------------------------------------------------
  // 6. Direct Message Contact Form Backend Handler
  // ----------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const contactSubmitBtn = document.getElementById('contact-submit-btn');
  const formStatus = document.getElementById('form-status');

  if (contactForm && contactSubmitBtn && formStatus) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name')?.value.trim();
      const email = document.getElementById('contact-email')?.value.trim();
      const subject = document.getElementById('contact-subject')?.value.trim();
      const message = document.getElementById('contact-message')?.value.trim();

      if (!name || !email || !subject || !message) {
        showStatus('Please fill in all fields before sending.', 'error');
        return;
      }

      // UI Loading State
      const originalBtnHTML = contactSubmitBtn.innerHTML;
      contactSubmitBtn.disabled = true;
      contactSubmitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
      formStatus.style.display = 'none';

      try {
        const payload = {
          name: name,
          email: email,
          _subject: `Portfolio Message from ${name}: ${subject}`,
          subject: subject,
          message: message,
          _template: 'table',
          _captcha: 'false'
        };

        const response = await fetch('https://formsubmit.co/ajax/aleenasaji0905@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json().catch(() => ({}));

        if (response.ok || data.success === 'true' || data.success === true) {
          showStatus('<i class="fas fa-check-circle"></i> Thank you! Your message has been sent successfully.', 'success');
          contactForm.reset();
        } else {
          throw new Error(data.message || 'Submission failed');
        }
      } catch (err) {
        console.warn('Form submission notice:', err);
        const mailtoLink = `mailto:aleenasaji0905@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Hi Aleena,\n\n${message}\n\nFrom: ${name} (${email})`)}`;
        showStatus(`Direct delivery encountered an issue. <a href="${mailtoLink}" class="status-mailto-btn" target="_blank"><i class="fas fa-paper-plane"></i> Send via Email Client</a>`, 'error');
      } finally {
        contactSubmitBtn.disabled = false;
        contactSubmitBtn.innerHTML = originalBtnHTML;
      }
    });

    function showStatus(msg, type) {
      formStatus.innerHTML = msg;
      formStatus.className = `form-status ${type}`;
      formStatus.style.display = 'block';
    }
  }

  // ----------------------------------------------------
  // 7. Tiny Astronaut Custom Cursor Controller
  // ----------------------------------------------------
  const astronautCursor = document.getElementById('astronaut-cursor');
  if (astronautCursor) {
    let isCursorActive = false;

    // Instant tracking: index fingertip (15px from left, 2px from top) pinned to pointer
    window.addEventListener('mousemove', (e) => {
      document.body.classList.add('custom-cursor-enabled');
      if (!isCursorActive) {
        isCursorActive = true;
        astronautCursor.classList.add('active');
        astronautCursor.style.display = 'block';
      }
      astronautCursor.style.transform = `translate3d(${e.clientX - 15}px, ${e.clientY - 2}px, 0)`;
    });

    // Touch support: follow touch position comfortably above finger without disappearing
    window.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) {
        if (!isCursorActive) {
          isCursorActive = true;
          astronautCursor.classList.add('active');
          astronautCursor.style.display = 'block';
        }
        astronautCursor.style.transform = `translate3d(${e.touches[0].clientX - 15}px, ${e.touches[0].clientY - 50}px, 0)`;
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        astronautCursor.style.transform = `translate3d(${e.touches[0].clientX - 15}px, ${e.touches[0].clientY - 50}px, 0)`;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      // Gently keep active or fade after idle on touch devices
      setTimeout(() => {
        if (!isCursorActive) {
          astronautCursor.classList.remove('active');
        }
      }, 2500);
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      astronautCursor.classList.remove('active');
      isCursorActive = false;
    });

    document.addEventListener('mouseenter', () => {
      astronautCursor.classList.add('active');
      isCursorActive = true;
    });

    document.addEventListener('mousedown', () => {
      astronautCursor.classList.add('clicking');
    });

    document.addEventListener('mouseup', () => {
      astronautCursor.classList.remove('clicking');
    });

    // Detect clickable elements for interactive hover reaction
    const clickableSelectors = 'a, button, input, textarea, select, .btn, .glass-card, [role="button"], .play-btn, .mobile-menu-btn, .nav-links a';

    document.addEventListener('mouseover', (e) => {
      if (e.target && e.target.closest && e.target.closest(clickableSelectors)) {
        astronautCursor.classList.add('hovering');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target && e.target.closest && e.target.closest(clickableSelectors)) {
        astronautCursor.classList.remove('hovering');
      }
    });
  }

  // ----------------------------------------------------
  // 8. Featured Work Single Project Showcase Controller
  // ----------------------------------------------------
  const projectsViewport = document.getElementById('projects-viewport');
  const projectsTrack = document.getElementById('projects-track');
  const projectsPrevBtn = document.getElementById('projects-prev-btn');
  const projectsNextBtn = document.getElementById('projects-next-btn');
  const projectDots = document.querySelectorAll('.project-dot');
  const counterCurrent = document.getElementById('project-counter-current');
  const counterTotal = document.getElementById('project-counter-total');

  if (projectsTrack) {
    const slides = Array.from(projectsTrack.querySelectorAll('.project-slide'));
    const totalSlides = slides.length;
    let currentIndex = 0;
    let autoSlideTimer = null;
    let isUserInteracting = false;

    if (counterTotal) {
      counterTotal.textContent = String(totalSlides).padStart(2, '0');
    }

    function goToSlide(index, animate = true) {
      if (totalSlides === 0) return;

      // Circular wrap around
      currentIndex = (index + totalSlides) % totalSlides;

      // Smooth slide transform
      projectsTrack.style.transition = animate ? 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)' : 'none';
      projectsTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

      // Update active classes
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentIndex);
        slide.setAttribute('aria-hidden', i === currentIndex ? 'false' : 'true');
      });

      // Update dots
      projectDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
        dot.setAttribute('aria-current', i === currentIndex ? 'true' : 'false');
      });

      // Update counter
      if (counterCurrent) {
        counterCurrent.textContent = String(currentIndex + 1).padStart(2, '0');
      }
    }

    // Prev / Next button navigation
    if (projectsPrevBtn) {
      projectsPrevBtn.addEventListener('click', () => {
        pauseAutoSlideTemporarily();
        goToSlide(currentIndex - 1);
      });
    }

    if (projectsNextBtn) {
      projectsNextBtn.addEventListener('click', () => {
        pauseAutoSlideTemporarily();
        goToSlide(currentIndex + 1);
      });
    }

    // Dot indicators navigation
    projectDots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const targetIndex = parseInt(dot.getAttribute('data-index'), 10);
        if (!isNaN(targetIndex)) {
          pauseAutoSlideTemporarily();
          goToSlide(targetIndex);
        }
      });
    });

    // Touch Swipe Gestures
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    if (projectsViewport) {
      projectsViewport.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
        isUserInteracting = true;
      }, { passive: true });

      projectsViewport.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipeGesture();
        pauseAutoSlideTemporarily();
      }, { passive: true });

      // Keyboard navigation (Left / Right Arrow)
      projectsViewport.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          pauseAutoSlideTemporarily();
          goToSlide(currentIndex - 1);
        } else if (e.key === 'ArrowRight') {
          pauseAutoSlideTemporarily();
          goToSlide(currentIndex + 1);
        }
      });

      // Pause auto-sliding when hovering
      projectsViewport.addEventListener('mouseenter', () => {
        isUserInteracting = true;
      });
      projectsViewport.addEventListener('mouseleave', () => {
        isUserInteracting = false;
      });
    }

    function handleSwipeGesture() {
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
        if (diffX < 0) {
          goToSlide(currentIndex + 1); // Swipe left -> Next project
        } else {
          goToSlide(currentIndex - 1); // Swipe right -> Previous project
        }
      }
    }

    // Subtle gentle auto-rotation every 7 seconds when idle
    function startAutoSlide() {
      stopAutoSlide();
      autoSlideTimer = setInterval(() => {
        if (!isUserInteracting) {
          goToSlide(currentIndex + 1);
        }
      }, 7000);
    }

    function stopAutoSlide() {
      if (autoSlideTimer) {
        clearInterval(autoSlideTimer);
        autoSlideTimer = null;
      }
    }

    let pauseTimeout = null;
    function pauseAutoSlideTemporarily(ms = 8000) {
      if (firstProjectTimer) {
        clearTimeout(firstProjectTimer);
        firstProjectTimer = null;
        hasTriggeredFirstView = true;
      }
      isUserInteracting = true;
      if (pauseTimeout) clearTimeout(pauseTimeout);
      pauseTimeout = setTimeout(() => {
        isUserInteracting = false;
      }, ms);
    }

    // Initialize slide 0 (Double Bell)
    goToSlide(0, false);

    // When recruiter scrolls to Featured Work, wait on Double Bell for ~5.5s so they can understand it, then scroll to project 2
    const projectsSection = document.getElementById('projects');
    let hasTriggeredFirstView = false;
    let firstProjectTimer = null;

    function handleProjectsInView() {
      if (!hasTriggeredFirstView) {
        hasTriggeredFirstView = true;
        goToSlide(0, false); // Ensure recruiter starts at Double Bell

        firstProjectTimer = setTimeout(() => {
          if (!isUserInteracting) {
            goToSlide(1, true); // Smoothly slide to the second project
            startAutoSlide();   // Resume gentle rotation for subsequent projects
          } else {
            startAutoSlide();
          }
        }, 5500);
      } else {
        startAutoSlide();
      }
    }

    function handleProjectsOutOfView() {
      stopAutoSlide();
      if (firstProjectTimer && !hasTriggeredFirstView) {
        clearTimeout(firstProjectTimer);
        firstProjectTimer = null;
      }
    }

    if (projectsSection && 'IntersectionObserver' in window) {
      const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            handleProjectsInView();
          } else {
            handleProjectsOutOfView();
          }
        });
      }, {
        threshold: 0.25
      });

      sectionObserver.observe(projectsSection);
    } else {
      setTimeout(() => {
        goToSlide(1, true);
        startAutoSlide();
      }, 5500);
    }
  }

  // ----------------------------------------------------
  // 9. Hero Greeting Typewriter Animation
  // ----------------------------------------------------
  const typingElement = document.querySelector('.hero-greeting .typing-text');
  if (typingElement) {
    const textToType = (typingElement.textContent && typingElement.textContent.trim()) ? typingElement.textContent.trim() : "Hi, I am";
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 120;
    const deleteSpeed = 65;
    const holdFullTime = 4000;
    const holdEmptyTime = 600;

    function typeLoop() {
      if (!isDeleting) {
        charIndex++;
        typingElement.textContent = textToType.slice(0, charIndex);

        if (charIndex === textToType.length) {
          isDeleting = true;
          setTimeout(typeLoop, holdFullTime);
          return;
        }
        setTimeout(typeLoop, typingSpeed + (Math.random() * 30 - 15));
      } else {
        charIndex--;
        typingElement.textContent = textToType.slice(0, charIndex);

        if (charIndex === 0) {
          isDeleting = false;
          setTimeout(typeLoop, holdEmptyTime);
          return;
        }
        setTimeout(typeLoop, deleteSpeed);
      }
    }

    // Start typing on page load after a brief initial pause
    setTimeout(() => {
      typingElement.textContent = '';
      typeLoop();
    }, 450);
  }

  // ----------------------------------------------------
  // 10. Developer Spec Terminal Code Typewriter Animation
  // ----------------------------------------------------
  const codeTerminal = document.getElementById('code-snippet-terminal') || document.querySelector('.code-snippet');
  if (codeTerminal) {
    const codeLines = [
      {
        indent: false,
        tokens: [
          { text: 'const', class: 'keyword' },
          { text: ' ' },
          { text: 'developer', class: 'variable' },
          { text: ' = {' }
        ]
      },
      {
        indent: true,
        tokens: [
          { text: 'name: ' },
          { text: '"Aleena Saji"', class: 'string' },
          { text: ',' }
        ]
      },
      {
        indent: true,
        tokens: [
          { text: 'role: ' },
          { text: '"Software Engineer & Flutter Developer"', class: 'string' },
          { text: ',' }
        ]
      },
      {
        indent: true,
        tokens: [
          { text: 'publishedApp: ' },
          { text: '"Double Bell (Google Play)"', class: 'string' },
          { text: ',' }
        ]
      },
      {
        indent: true,
        tokens: [
          { text: 'playStoreId: ' },
          { text: '"com.aleenasaji.double_bell"', class: 'string' },
          { text: ',' }
        ]
      },
      {
        indent: true,
        tokens: [
          { text: 'skills: [' },
          { text: '"Flutter"', class: 'string' },
          { text: ', ' },
          { text: '"Firebase"', class: 'string' },
          { text: ', ' },
          { text: '"Dart"', class: 'string' },
          { text: ', ' },
          { text: '"Python"', class: 'string' },
          { text: ', ' },
          { text: '"Java"', class: 'string' },
          { text: '],' }
        ]
      },
      {
        indent: true,
        tokens: [
          { text: 'mission: ' },
          { text: '"Building Ideas Beyond Limits"', class: 'string' }
        ]
      },
      {
        indent: false,
        tokens: [
          { text: '};' }
        ]
      }
    ];

    let typingTimer = null;
    let isTyping = false;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function renderStaticCode() {
      codeTerminal.innerHTML = '';
      codeLines.forEach((line) => {
        const p = document.createElement('p');
        if (line.indent) p.className = 'indent';
        line.tokens.forEach((t) => {
          if (t.class) {
            const span = document.createElement('span');
            span.className = t.class;
            span.textContent = t.text;
            p.appendChild(span);
          } else {
            p.appendChild(document.createTextNode(t.text));
          }
        });
        codeTerminal.appendChild(p);
      });
      const cursor = document.createElement('span');
      cursor.className = 'code-cursor';
      cursor.setAttribute('aria-hidden', 'true');
      const lastP = codeTerminal.lastElementChild;
      if (lastP) lastP.appendChild(cursor);
    }

    function typeCodeSnippet() {
      if (prefersReducedMotion) {
        renderStaticCode();
        return;
      }

      if (isTyping) return;
      isTyping = true;
      if (typingTimer) clearTimeout(typingTimer);

      codeTerminal.innerHTML = '';

      const cursor = document.createElement('span');
      cursor.className = 'code-cursor';
      cursor.setAttribute('aria-hidden', 'true');

      let lineIdx = 0;
      let tokenIdx = 0;
      let charIdx = 0;
      let currentLineEl = null;
      let currentTokenEl = null;

      function startLine() {
        if (lineIdx >= codeLines.length) {
          if (currentLineEl) currentLineEl.appendChild(cursor);
          isTyping = false;
          return;
        }

        const line = codeLines[lineIdx];
        currentLineEl = document.createElement('p');
        if (line.indent) currentLineEl.className = 'indent';
        currentLineEl.appendChild(cursor);
        codeTerminal.appendChild(currentLineEl);

        tokenIdx = 0;
        charIdx = 0;
        currentTokenEl = null;
        typeChar();
      }

      function typeChar() {
        const line = codeLines[lineIdx];
        if (tokenIdx >= line.tokens.length) {
          lineIdx++;
          typingTimer = setTimeout(startLine, 130);
          return;
        }

        const token = line.tokens[tokenIdx];
        if (!currentTokenEl) {
          if (token.class) {
            currentTokenEl = document.createElement('span');
            currentTokenEl.className = token.class;
            currentLineEl.insertBefore(currentTokenEl, cursor);
          } else {
            currentTokenEl = document.createTextNode('');
            currentLineEl.insertBefore(currentTokenEl, cursor);
          }
        }

        if (charIdx < token.text.length) {
          const char = token.text[charIdx];
          if (token.class) {
            currentTokenEl.textContent += char;
          } else {
            currentTokenEl.nodeValue += char;
          }
          charIdx++;

          let delay = 34 + Math.random() * 12;
          if (char === ',' || char === ':' || char === '{') {
            delay += 55;
          }
          typingTimer = setTimeout(typeChar, delay);
        } else {
          tokenIdx++;
          charIdx = 0;
          currentTokenEl = null;
          typeChar();
        }
      }

      startLine();
    }

    // Start typing after initial load pause (600ms)
    setTimeout(typeCodeSnippet, 600);

    // Replay on button click or console card click
    const replayBtn = document.getElementById('console-replay-btn');
    if (replayBtn) {
      replayBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        typeCodeSnippet();
      });
    }

    const consoleShape = document.querySelector('.abstract-shape');
    if (consoleShape) {
      consoleShape.addEventListener('click', () => {
        if (!isTyping) {
          typeCodeSnippet();
        }
      });
    }
  }
});

