/**
 * Portfolio scripts, Yash Maithani
 * Dark/light theme, mobile navigation, active nav highlighting
 * and the contact form.
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
});
