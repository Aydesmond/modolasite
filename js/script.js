/* =========================================================================
   MODOLA MINING COMPANY LIMITED — script.js
   Sticky header, mobile nav, scroll-reveal, ripple buttons, counters,
   parallax hero, contact form validation.
   ========================================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------------- Sticky header ---------------- */
  var header = document.querySelector('.site-header');
  function onScroll () {
    if (!header) return;
    if (window.scrollY > 40) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------- Mobile hamburger menu ---------------- */
  var hamburger = document.querySelector('.hamburger');
  var navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('is-open');
      navLinks.classList.toggle('is-open');
      document.body.style.overflow = navLinks.classList.contains('is-open') ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('is-open');
        navLinks.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------------- Active nav link highlighting ---------------- */
  var current = (window.location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.nav-links a[href]').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      a.classList.add('is-active');
    }
  });

  /* ---------------- Hero load-in ---------------- */
  var hero = document.querySelector('.hero, .page-hero');
  if (hero) {
    requestAnimationFrame(function () {
      setTimeout(function () { hero.classList.add('is-loaded'); }, 60);
    });
  }

  /* ---------------- Scroll-triggered reveal ---------------- */
  var revealEls = document.querySelectorAll('[data-reveal], [data-stagger]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------------- Hero parallax ---------------- */
  var heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    document.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (y < window.innerHeight * 1.2) {
        heroBg.style.transform = 'translateY(' + (y * 0.35) + 'px) scale(1.08)';
      }
    }, { passive: true });
  }

  /* ---------------- Ripple effect on buttons ---------------- */
  document.querySelectorAll('.btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var rect = btn.getBoundingClientRect();
      var ripple = document.createElement('span');
      var size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 650);
    });
  });

  /* ---------------- Animated counters (glance strip) ---------------- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var counted = new WeakSet();
    var cIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !counted.has(entry.target)) {
          counted.add(entry.target);
          animateCount(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cIo.observe(el); });
  }
  function animateCount (el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1400;
    var start = null;
    function step (ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = target * eased;
      el.textContent = (target % 1 === 0 ? Math.floor(value) : value.toFixed(1)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }

  /* ---------------- Contact form validation ---------------- */
  var form = document.getElementById('contact-form');
  if (form) {
    var statusBox = document.getElementById('form-status');

    var validators = {
      fullname: function (v) { return v.trim().length >= 2; },
      company: function () { return true; }, // optional
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); },
      phone: function (v) { return v.trim().length >= 7; },
      subject: function (v) { return v.trim().length >= 2; },
      message: function (v) { return v.trim().length >= 10; }
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      Object.keys(validators).forEach(function (name) {
        var input = form.elements[name];
        if (!input) return;
        var field = input.closest('.field');
        var ok = validators[name](input.value);
        if (!ok) {
          valid = false;
          field.classList.add('has-error');
        } else {
          field.classList.remove('has-error');
        }
      });

      statusBox.className = 'form-status';
      if (!valid) {
        statusBox.classList.add('error');
        statusBox.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><span>Please correct the highlighted fields before sending your message.</span>';
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      var originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      setTimeout(function () {
        statusBox.classList.add('success');
        statusBox.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg><span>Thank you. Your message has been received — the Modola Mining team will respond shortly.</span>';
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        form.reset();
      }, 900);
    });

    // Clear error state as user types
    form.querySelectorAll('input, textarea').forEach(function (input) {
      input.addEventListener('input', function () {
        var field = input.closest('.field');
        if (field) field.classList.remove('has-error');
      });
    });
  }

});


const circle = document.getElementById('cursorCircle');
  let mouseX = 0, mouseY = 0;
  let circleX = 0, circleY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth trailing animation
  function animate() {
    circleX += (mouseX - circleX) * 0.15;
    circleY += (mouseY - circleY) * 0.15;
    circle.style.left = circleX + 'px';
    circle.style.top = circleY + 'px';
    requestAnimationFrame(animate);
  }
  animate();

  // Optional: grow circle on hover over links/buttons
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => circle.classList.add('active'));
    el.addEventListener('mouseleave', () => circle.classList.remove('active'));
  });

  // scrol
  const track = document.getElementById("tickerTrack");

// Duplicate content for seamless infinite scrolling
track.innerHTML += track.innerHTML;