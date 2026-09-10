/**
 * PORTFOLIO JAVASCRIPT - YASH.DEV
 * Features: Dark/Light Mode, Mobile Navigation, Typing Effect,
 * Active Nav Highlights, and Contact Form Feedback.
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

  // 4. Typing Effect for Hero Subtitle
  const typedTextSpan = document.getElementById('typedText');
  if (typedTextSpan) {
    const roles = [
      'I build useful digital experiences.',
      'Student Developer',
      'Java & OOP Programmer',
      'Android App Developer',
      'AI & Computer Vision Explorer',
      'Web Developer (HTML/CSS/JS)'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const delayBetweenWords = 1800;

    function type() {
      const currentRole = roles[roleIndex];
      
      if (isDeleting) {
        typedTextSpan.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typedTextSpan.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
      }

      let typeDelay = isDeleting ? deletingSpeed : typingSpeed;

      if (!isDeleting && charIndex === currentRole.length) {
        typeDelay = delayBetweenWords;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeDelay = 400;
      }

      setTimeout(type, typeDelay);
    }

    setTimeout(type, 800);
  }

  // 5. Active Navigation Link on Scroll (Intersection Observer)
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

  // 6. Interactive Contact Form Submission Handler
  const contactForm = document.getElementById('contactForm');
  const formAlert = document.getElementById('formAlert');
  const submitBtn = document.getElementById('submitBtn');

  if (contactForm && formAlert) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Visual feedback
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Sending...</span>';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        formAlert.className = 'form-alert success';
        formAlert.textContent = 'Thank you! Your message has been sent successfully. I will get back to you shortly.';
        contactForm.reset();

        setTimeout(() => {
          formAlert.style.display = 'none';
        }, 6000);
      }, 1000);
    });
  }
});
