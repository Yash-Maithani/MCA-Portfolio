/**
 * Portfolio scripts, Yash Maithani
 * Dark/light theme, mobile navigation, active nav highlighting,
 * the contact form, the hero sorting animation and the cursor swarm that builds the page.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Current Year in Footer
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // 2. Dark / Light Theme Toggle
  const themeToggle = document.getElementById('themeToggle');
  const rootHtml = document.documentElement;

  // Retrieve saved theme preference or default to dark
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  rootHtml.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = rootHtml.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      rootHtml.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
    });
  }

  // 3. Mobile Navigation Menu
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isExpanded = navMenu.classList.contains('active');
      hamburgerBtn.setAttribute('aria-expanded', isExpanded);
    });

    // Close menu when clicking on any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !hamburgerBtn.contains(e.target) && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 4. Active Navigation Link on Scroll (Intersection Observer)
  const sections = document.querySelectorAll('section[id]');
  
  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  }

  // 5. Contact Form Submission Handler
  // If the form has a data-endpoint (e.g. a Formspree URL), the message is POSTed there.
  // Otherwise it falls back to opening the visitor's email app with the message pre-filled.
  const contactForm = document.getElementById('contactForm');
  const formAlert = document.getElementById('formAlert');
  const submitBtn = document.getElementById('submitBtn');
  let alertTimer;

  function showAlert(type, message) {
    clearTimeout(alertTimer);
    formAlert.className = `form-alert ${type}`;
    formAlert.textContent = message;
    alertTimer = setTimeout(() => {
      formAlert.className = 'form-alert';
    }, 8000);
  }

  if (contactForm && formAlert) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const endpoint = contactForm.dataset.endpoint;
      const formData = new FormData(contactForm);

      if (!endpoint) {
        const subject = formData.get('subject');
        const body = `${formData.get('message')}\n\nFrom: ${formData.get('name')} (${formData.get('email')})`;
        window.location.href = `mailto:${contactForm.dataset.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        showAlert('info', 'Opening your email app with the message ready to send.');
        return;
      }

      // Visual feedback
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Sending...</span>';

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' }
        });
        if (!response.ok) throw new Error(`Request failed: ${response.status}`);

        showAlert('success', 'Thank you! Your message has been sent. I will get back to you shortly.');
        contactForm.reset();
      } catch (err) {
        showAlert('error', `Sorry, the message could not be sent. Please email me directly at ${contactForm.dataset.email}.`);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    });
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 6. Cursor swarm: the page builds itself in front of the visitor.
  // Every block starts as a dashed outline. Three labelled cursors (HTML, CSS, JS)
  // fly to the blocks that are on screen, top to bottom, and click each one into place.
  // Without JavaScript, or when reduced motion is requested, the page shows normally.
  const buildTargets = reduceMotion || !('IntersectionObserver' in window) ? [] : Array.from(document.querySelectorAll(
    '.hero-content > *, .hero-facts, .section-header, .about-text-card, .stat-card, .skill-category-card, ' +
    '.featured-project, .project-card, .education-card, .learning-card, .contact-card, .contact-form'
  ));

  if (buildTargets.length) {
    buildTargets.forEach(el => el.setAttribute('data-build', 'pending'));
    document.documentElement.classList.add('build-on');

    const pending = new Set(buildTargets);
    const claimed = new Set();
    const onScreenSince = new Map();
    let frame = null;

    const layer = document.createElement('div');
    layer.className = 'build-layer';
    layer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(layer);

    const arrow = '<svg viewBox="0 0 16 20" width="16" height="20"><path d="M1.5 1.5v15l4-3.6 2.8 6.3 2.4-1-2.8-6.2h5.4z"/></svg>';
    const cursors = ['HTML', 'CSS', 'JS'].map((name, i) => {
      const el = document.createElement('div');
      el.className = `build-cursor builder-${i + 1}`;
      el.innerHTML = `${arrow}<span class="build-cursor-label">${name}</span>`;
      layer.appendChild(el);
      // Each cursor flies in from a different edge
      const w = window.innerWidth;
      const h = window.innerHeight;
      const start = [[-40, h * 0.35], [w + 40, h * 0.55], [w * 0.5, h + 40]][i];
      return { el, index: i + 1, x: start[0], y: start[1], target: null, fx: 0, fy: 0, state: 'idle', idleSince: 0, until: 0 };
    });

    const finish = (el) => {
      pending.delete(el);
      claimed.delete(el);
      onScreenSince.delete(el);
      visibility.unobserve(el);
      el.setAttribute('data-build', 'done');
      // Hand the element back to its own hover styles once it has faded in
      setTimeout(() => {
        el.removeAttribute('data-build');
        el.style.removeProperty('--builder');
      }, 700);
    };

    const nextTarget = () => buildTargets.find(el => onScreenSince.has(el) && !claimed.has(el));

    const ripple = (x, y, index) => {
      const ring = document.createElement('span');
      ring.className = `build-ripple builder-${index}`;
      ring.style.left = `${x}px`;
      ring.style.top = `${y}px`;
      ring.addEventListener('animationend', () => ring.remove());
      layer.appendChild(ring);
    };

    const tick = (now) => {
      // Never leave a block waiting: if the cursors fall behind a fast scroll, place it directly
      onScreenSince.forEach((since, el) => {
        if (!claimed.has(el) && now - since > 3500) finish(el);
      });

      let waiting = 0;
      onScreenSince.forEach((_, el) => { if (!claimed.has(el)) waiting++; });
      const speed = 0.1 + Math.min(waiting, 6) * 0.025;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      cursors.forEach(c => {
        // Drop a block that scrolled away before the cursor reached it
        if (c.state === 'moving' && !onScreenSince.has(c.target)) {
          claimed.delete(c.target);
          c.target = null;
          c.state = 'idle';
          c.idleSince = now;
        }

        if (c.state === 'idle') {
          const target = nextTarget();
          if (target) {
            claimed.add(target);
            c.target = target;
            c.fx = 0.15 + Math.random() * 0.6;
            c.fy = 0.2 + Math.random() * 0.5;
            c.state = 'moving';
          }
        }

        if (c.target) {
          const r = c.target.getBoundingClientRect();
          const tx = Math.min(Math.max(r.left + r.width * c.fx, 8), vw - 60);
          const ty = Math.min(Math.max(r.top + r.height * c.fy, 8), vh - 40);

          if (c.state === 'moving') {
            c.x += (tx - c.x) * speed;
            c.y += (ty - c.y) * speed;
            if (Math.hypot(tx - c.x, ty - c.y) < 4) {
              c.state = 'clicking';
              c.until = now + 280;
              c.target.style.setProperty('--builder', `var(--builder-${c.index})`);
              c.target.setAttribute('data-build', 'active');
              ripple(c.x, c.y, c.index);
            }
          } else {
            // Stay on the block while it is being placed, even if the page scrolls
            c.x = tx;
            c.y = ty;
            if (now >= c.until) {
              finish(c.target);
              c.target = null;
              c.state = 'idle';
              c.idleSince = now;
            }
          }
        }

        c.el.classList.toggle('is-shown', c.state !== 'idle' || now - c.idleSince < 900);
        c.el.classList.toggle('is-clicking', c.state === 'clicking');
        c.el.style.transform = `translate3d(${c.x}px, ${c.y}px, 0)`;
      });

      const resting = cursors.every(c => c.state === 'idle' && now - c.idleSince > 1200);
      if (resting && pending.size === 0) {
        // Everything is built: clean up for good
        layer.remove();
        visibility.disconnect();
        frame = null;
        return;
      }
      if (resting && onScreenSince.size === 0) {
        // Nothing on screen to build: pause until a new block scrolls into view
        frame = null;
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const visibility = new IntersectionObserver((entries) => {
      const now = performance.now();
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!onScreenSince.has(entry.target)) onScreenSince.set(entry.target, now);
        } else {
          onScreenSince.delete(entry.target);
        }
      });
      start();
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

    buildTargets.forEach(el => visibility.observe(el));
  }

  // 7. Bubble sort animation in the hero card
  const sortViz = document.getElementById('sortViz');
  if (sortViz) {
    const size = 12;
    const shuffled = () => Array.from({ length: size }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
    let values = shuffled();
    const bars = values.map(() => {
      const bar = document.createElement('span');
      bar.className = 'sort-bar';
      sortViz.appendChild(bar);
      return bar;
    });

    const draw = (compared = []) => {
      bars.forEach((bar, i) => {
        bar.style.height = `${(values[i] / size) * 100}%`;
        bar.classList.toggle('is-compared', compared.includes(i));
      });
    };

    if (reduceMotion) {
      values.sort((a, b) => a - b);
      draw();
    } else {
      let pass = 0;
      let j = 0;
      let timer = null;
      let inView = true;

      const step = () => {
        if (pass >= size - 1) {
          draw();
          bars.forEach(bar => bar.classList.add('is-done'));
          timer = setTimeout(() => {
            values = shuffled();
            pass = 0;
            j = 0;
            bars.forEach(bar => bar.classList.remove('is-done'));
            draw();
            schedule(700);
          }, 1800);
          return;
        }
        if (values[j] > values[j + 1]) {
          [values[j], values[j + 1]] = [values[j + 1], values[j]];
        }
        draw([j, j + 1]);
        j++;
        if (j >= size - 1 - pass) {
          j = 0;
          pass++;
        }
        schedule(260);
      };

      const schedule = (delay) => {
        clearTimeout(timer);
        if (inView && !document.hidden) timer = setTimeout(step, delay);
      };

      // Only run while the card is on screen and the tab is visible
      if ('IntersectionObserver' in window) {
        new IntersectionObserver((entries) => {
          inView = entries[0].isIntersecting;
          if (inView) schedule(400); else clearTimeout(timer);
        }).observe(sortViz);
      }
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) clearTimeout(timer); else schedule(400);
      });

      draw();
      schedule(900);
    }
  }

});
