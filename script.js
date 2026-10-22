/**
 * Portfolio scripts, Yash Maithani
 * Dark/light theme, mobile navigation, active nav highlighting,
 * the contact form, scroll reveal and the hero sorting animation.
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

  // 6. Reveal cards as they scroll into view
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const revealTargets = document.querySelectorAll(
      '.section-header, .about-text-card, .stat-card, .skill-category-card, .featured-project, ' +
      '.project-card, .education-card, .learning-card, .contact-card, .contact-form'
    );

    revealTargets.forEach(el => {
      el.setAttribute('data-reveal', '');
      // Stagger cards that sit side by side in the same grid
      const index = Array.prototype.indexOf.call(el.parentElement.children, el);
      el.style.transitionDelay = `${Math.min(index, 3) * 80}ms`;
    });
    document.documentElement.classList.add('reveal-on');

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.classList.add('is-visible');
          revealObserver.unobserve(el);
          // Hand the element back to its own hover transitions once it has appeared
          setTimeout(() => {
            el.removeAttribute('data-reveal');
            el.classList.remove('is-visible');
            el.style.transitionDelay = '';
          }, 1000);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealTargets.forEach(el => revealObserver.observe(el));
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
