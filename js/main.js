/**
 * SAM AI Technologies — Web Development Internship
 * Task 3 & 1: Modern Interactive Developer Portfolio
 * Author: Ajay Hukkeri
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Theme Management (Dark / Light Mode)
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Initialize theme from localStorage, defaulting to cinematic dark
  const savedTheme = localStorage.getItem('sam_portfolio_theme');
  if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
  } else {
    htmlElement.setAttribute('data-theme', 'dark');
  }

  // Theme toggle click handler
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      htmlElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('sam_portfolio_theme', newTheme);
      
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
    });
  }

  // --------------------------------------------------------------------------
  // 2. Mobile Menu Navigation Toggle
  // --------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
    });

    // Close mobile menu when a nav link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('active')) {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 3. Scroll Spy & Active Navigation Link Update
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.getElementById('back-to-top');

  function handleScrollSpy() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Toggle Back to Top button visibility
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.pointerEvents = 'auto';
      } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.pointerEvents = 'none';
      }
    }

    // Determine active section
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetNavLink = document.querySelector(`.nav-menu a[href*='${sectionId}']`);

      if (targetNavLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          targetNavLink.classList.add('active');
        } else {
          targetNavLink.classList.remove('active');
        }
      }
    });
  }

  window.addEventListener('scroll', handleScrollSpy, { passive: true });
  handleScrollSpy(); // Run once on load

  // --------------------------------------------------------------------------
  // 4. Contact Form Validation & Submission
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const subjectError = document.getElementById('subject-error');
  const messageError = document.getElementById('message-error');

  // Helper validation functions
  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(String(email).toLowerCase());
  };

  const clearErrors = () => {
    [nameError, emailError, subjectError, messageError].forEach(el => {
      if (el) el.textContent = '';
    });
    [nameInput, emailInput, subjectInput, messageInput].forEach(el => {
      if (el) el.classList.remove('is-invalid');
    });
  };

  // Real-time input error clearing
  [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
    if (input) {
      input.addEventListener('input', () => {
        input.classList.remove('is-invalid');
        const errEl = document.getElementById(`${input.id}-error`);
        if (errEl) errEl.textContent = '';
      });
    }
  });

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();

      let isValid = true;

      // Validate Name
      const nameVal = nameInput.value.trim();
      if (!nameVal) {
        nameError.textContent = 'Please enter your full name.';
        nameInput.classList.add('is-invalid');
        isValid = false;
      } else if (nameVal.length < 2) {
        nameError.textContent = 'Name must be at least 2 characters long.';
        nameInput.classList.add('is-invalid');
        isValid = false;
      }

      // Validate Email
      const emailVal = emailInput.value.trim();
      if (!emailVal) {
        emailError.textContent = 'Please enter your email address.';
        emailInput.classList.add('is-invalid');
        isValid = false;
      } else if (!isValidEmail(emailVal)) {
        emailError.textContent = 'Please enter a valid email address (e.g., name@example.com).';
        emailInput.classList.add('is-invalid');
        isValid = false;
      }

      // Validate Subject
      const subjectVal = subjectInput.value.trim();
      if (!subjectVal) {
        subjectError.textContent = 'Please enter a subject for your message.';
        subjectInput.classList.add('is-invalid');
        isValid = false;
      }

      // Validate Message
      const messageVal = messageInput.value.trim();
      if (!messageVal) {
        messageError.textContent = 'Please enter your message.';
        messageInput.classList.add('is-invalid');
        isValid = false;
      } else if (messageVal.length < 10) {
        messageError.textContent = 'Message must be at least 10 characters long.';
        messageInput.classList.add('is-invalid');
        isValid = false;
      }

      // Handle Submission Success
      if (isValid) {
        const submitBtn = document.getElementById('submit-btn');
        const originalBtnHTML = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

        // Simulate network submission delay
        setTimeout(() => {
          contactForm.reset();
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;
          showToast('Thank you! Your message has been sent successfully.', 'success');
        }, 800);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 5. Toast Notification System
  // --------------------------------------------------------------------------
  const toast = document.getElementById('toast');
  let toastTimeout;

  function showToast(message, type = 'success') {
    if (!toast) return;

    // Reset previous timer and state
    clearTimeout(toastTimeout);
    toast.className = 'toast';

    if (type === 'error') {
      toast.classList.add('error');
    } else if (type === 'info') {
      toast.style.background = '#6366f1';
    } else {
      toast.style.background = '#10b981';
    }

    toast.textContent = message;
    toast.classList.add('show');

    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }

  // --------------------------------------------------------------------------
  // 6. Resume Download Handler Feedback
  // --------------------------------------------------------------------------
  const resumeDownloadBtn = document.getElementById('download-resume-btn');
  if (resumeDownloadBtn) {
    resumeDownloadBtn.addEventListener('click', () => {
      showToast('Downloading resume PDF...', 'info');
    });
  }
});
