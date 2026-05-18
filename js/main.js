(function() {

  document.documentElement.classList.add('js-enabled');

  /* ─── Splash Screen ─── */
  function initSplash() {
    var splash = document.getElementById('splash');
    var enterBtn = document.getElementById('splashEnter');
    var skipBtn = document.getElementById('splashSkip');
    var progressBar = document.getElementById('splashProgress');
    var brand = document.getElementById('splashBrand');
    var slides = document.querySelectorAll('.splash-slide');
    var dots = document.querySelectorAll('.dot');

    if (!splash) return;

    var dismissed = false;
    var splashDuration = 5500;
    var progressInterval;
    var slideIndex = 0;
    var slideInterval;

    function nextSlide() {
      if (slides.length === 0) return;
      slides[slideIndex].classList.remove('active');
      dots[slideIndex].classList.remove('active');
      slideIndex = (slideIndex + 1) % slides.length;
      slides[slideIndex].classList.add('active');
      dots[slideIndex].classList.add('active');
    }

    function startSlideshow() {
      if (slides.length < 2) return;
      slideInterval = setInterval(nextSlide, 3000);
    }

    function dismissSplash() {
      if (dismissed) return;
      dismissed = true;
      clearInterval(progressInterval);
      clearInterval(slideInterval);
      splash.classList.add('hidden');
      document.body.style.overflow = '';
      setTimeout(function() {
        splash.style.display = 'none';
      }, 800);
    }

    function startProgress() {
      var startTime = Date.now();
      progressInterval = setInterval(function() {
        var elapsed = Date.now() - startTime;
        var pct = Math.min((elapsed / splashDuration) * 100, 100);
        if (progressBar) progressBar.style.width = pct + '%';
        if (pct >= 100) clearInterval(progressInterval);
      }, 50);
    }

    document.body.style.overflow = 'hidden';

    startProgress();
    startSlideshow();

    setTimeout(function() {
      if (!dismissed && brand) brand.classList.add('revealed');
    }, 1800);

    if (enterBtn) {
      enterBtn.addEventListener('click', dismissSplash);
      enterBtn.addEventListener('touchend', function(e) {
        e.preventDefault();
        dismissSplash();
      });
    }

    if (skipBtn) {
      skipBtn.addEventListener('click', dismissSplash);
      skipBtn.addEventListener('touchend', function(e) {
        e.preventDefault();
        dismissSplash();
      });
    }

    splash.addEventListener('click', function(e) {
      if (e.target === splash) dismissSplash();
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        if (!dismissed && splash.style.display !== 'none') dismissSplash();
      }
    });

    setTimeout(function() {
      if (!dismissed) dismissSplash();
    }, 9000);
  }

  /* ─── Contact Form ─── */
  function initContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var feedback = document.getElementById('formFeedback');
      if (!feedback) return;
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Sending...';
      feedback.style.display = 'none';
      feedback.className = '';
      var formData = new FormData(form);
      var params = new URLSearchParams();
      formData.forEach(function(value, key) { params.append(key, value); });
      fetch('https://formspree.io/f/xqapqkqz', {
        method: 'POST',
        body: params,
        headers: { 'Accept': 'application/json' }
      }).then(function(res) {
        if (res.ok) {
          feedback.style.display = 'block';
          feedback.style.background = 'rgba(26,122,107,0.1)';
          feedback.style.color = 'var(--accent)';
          feedback.textContent = 'Thank you! Your enquiry has been sent. We\'ll be in touch shortly.';
          form.reset();
        } else {
          throw new Error('Server error');
        }
      }).catch(function() {
        feedback.style.display = 'block';
        feedback.style.background = 'rgba(201,149,45,0.1)';
        feedback.style.color = 'var(--secondary-dark)';
        feedback.textContent = 'Something went wrong. Please email us directly at info@pakanyo.co.za or call 087 255 6507.';
      }).finally(function() {
        btn.disabled = false;
        btn.textContent = 'Send Enquiry \u2192';
      });
    });
  }

  /* ─── Navbar ─── */
  function initNavbar() {
    var navbar = document.querySelector('.navbar');
    var hamburger = document.querySelector('.hamburger');
    var navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
      hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
      });

      navLinks.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
          hamburger.classList.remove('active');
          navLinks.classList.remove('open');
        }
      });
    }

    var ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          if (window.pageYOffset > 100) {
            navbar.classList.add('scrolled');
          } else {
            navbar.classList.remove('scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /* ─── Scroll Animations ─── */
  function initScrollAnimations() {
    var elements = document.querySelectorAll('.animate-on-scroll');
    if (elements.length === 0) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      elements.forEach(function(el) { observer.observe(el); });
    } else {
      elements.forEach(function(el) { el.classList.add('visible'); });
    }
  }

  /* ─── Active Link ─── */
  function initActiveLink() {
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(function(link) {
      var href = link.getAttribute('href');
      if (href === currentPage) {
        link.classList.add('active');
      }
    });
  }

  /* ─── Trust Counters ─── */
  function initTrustCounters() {
    var trustSection = document.querySelector('#trust');
    if (!trustSection) return;
    if (!('IntersectionObserver' in window)) {
      animateTrustItems(trustSection);
      return;
    }
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateTrustItems(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    observer.observe(trustSection);
  }

  function animateTrustItems(container) {
    var fills = container.querySelectorAll('.trust-fill');
    var values = container.querySelectorAll('.trust-value');
    fills.forEach(function(fill) {
      var w = parseInt(fill.getAttribute('data-width'), 10);
      fill.style.width = w + '%';
    });
    values.forEach(function(val) {
      var target = parseInt(val.getAttribute('data-target'), 10);
      if (isNaN(target)) return;
      var duration = 1500;
      var step = Math.ceil(target / (duration / 16));
      var current = 0;
      var suffix = target >= 1000 ? '+' : '+';
      function tick() {
        current += step;
        if (current >= target) {
          val.textContent = target + suffix;
          return;
        }
        val.textContent = current + suffix;
        requestAnimationFrame(tick);
      }
      tick();
    });
  }

  /* ─── Boot ─── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initSplash();
      initNavbar();
      initScrollAnimations();
      initActiveLink();
      initContactForm();
      initTrustCounters();
    });
  } else {
    initSplash();
    initNavbar();
    initScrollAnimations();
    initActiveLink();
    initContactForm();
    initTrustCounters();
  }

})();
