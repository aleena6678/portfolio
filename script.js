/**
 * Aleena Saji Portfolio - Astronaut EVA Spacewalk Simulation
 * Interactive Space Canvas, Zero-G Parallax, Helmet HUD & Controls
 */

document.addEventListener('DOMContentLoaded', () => {
  // ----------------------------------------------------
  // 1. Deep Space Canvas Simulation
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

  // Mouse Tracking with smooth Lerp for Zero-G Parallax
  let targetMouseX = 0;
  let targetMouseY = 0;
  let currentMouseX = 0;
  let currentMouseY = 0;

  window.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX - width / 2) / (width / 2);
    targetMouseY = (e.clientY - height / 2) / (height / 2);

    // Dynamic Visor Glare Parallax
    const glare = document.getElementById('visor-glare');
    if (glare) {
      const glareOffsetX = targetMouseX * 25;
      const glareOffsetY = targetMouseY * 20;
      glare.style.transform = `rotate(-12deg) translate(${glareOffsetX}px, ${glareOffsetY}px)`;
    }

    // Dynamic Horizon Pitch Reticle
    const crosshair = document.getElementById('hud-crosshair');
    if (crosshair) {
      crosshair.style.transform = `translate(calc(-50% + ${targetMouseX * 15}px), calc(-50% + ${targetMouseY * 15}px))`;
    }
  });

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

    // Zero-G Autonomous Space Drift
    const zeroGDriftX = Math.sin(time * 0.2) * 8;
    const zeroGDriftY = Math.cos(time * 0.15) * 6;

    ctx.clearRect(0, 0, width, height);

    // 1. Draw Stars
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];

      // Parallax Shift based on depth
      const offsetX = currentMouseX * s.depth * 18 + zeroGDriftX * (s.depth / 2);
      const offsetY = currentMouseY * s.depth * 18 + zeroGDriftY * (s.depth / 2);

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

    // 3. Draw Visor Micro-Stardust
    for (let i = 0; i < stardust.length; i++) {
      const p = stardust[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

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

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', () => {
      const isHidden = mobileNav.style.display === 'none' || mobileNav.style.display === '';
      if (isHidden) {
        mobileNav.style.display = 'block';
        mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
      } else {
        mobileNav.style.display = 'none';
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
      }
    });

    const mobileLinks = mobileNav.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.style.display = 'none';
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
      });
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
});
