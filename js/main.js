(function() {

  document.documentElement.classList.add('js-enabled');

  /* ─── Splash Screen ─── */
  function initSplash() {
    var splash = document.getElementById('splash');
    if (!splash) return;

    if (localStorage.getItem('pakanyoSplashSeen')) {
      splash.style.display = 'none';
      return;
    }

    var enterBtn = document.getElementById('splashEnter');
    var skipBtn = document.getElementById('splashSkip');
    var progressBar = document.getElementById('splashProgress');
    var brand = document.getElementById('splashBrand');
    var slides = document.querySelectorAll('.splash-slide');
    var dots = document.querySelectorAll('.dot');

    var dismissed = false;
    var splashDuration = 5500;
    var progressInterval;
    var slideIndex = 0;
    var slideInterval;

    function nextSlide() {
      if (slides.length === 0) return;
      slides[slideIndex].classList.remove('active');
      if (dots[slideIndex]) dots[slideIndex].classList.remove('active');
      slideIndex = (slideIndex + 1) % slides.length;
      slides[slideIndex].classList.add('active');
      if (dots[slideIndex]) dots[slideIndex].classList.add('active');
    }

    function startSlideshow() {
      if (slides.length < 2) return;
      slideInterval = setInterval(nextSlide, 3000);
    }

    function dismissSplash() {
      if (dismissed) return;
      dismissed = true;
      localStorage.setItem('pakanyoSplashSeen', 'true');
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
      var feedback = document.getElementById('formFeedback');
      if (!feedback) return;
      var btn = form.querySelector('button[type="submit"]');
      if (!btn) return;
      btn.disabled = true;
      btn.textContent = 'Sending...';
      feedback.style.display = 'none';
      feedback.className = '';
      var formData = new FormData(form);
      var params = new URLSearchParams();
      formData.forEach(function(value, key) { params.append(key, value); });
      fetch('https://api.web3forms.com/submit', {
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
            if (navbar) navbar.classList.add('scrolled');
          } else {
            if (navbar) navbar.classList.remove('scrolled');
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
      fill.style.width = '0';
    });
    values.forEach(function(val) {
      val.textContent = '0';
    });

    fills.forEach(function(fill, i) {
      var w = parseFloat(fill.getAttribute('data-width')) || 0;
      setTimeout(function() {
        fill.style.width = w + '%';
      }, i * 200);
    });

    values.forEach(function(val, i) {
      var target = parseInt(val.getAttribute('data-target'), 10);
      if (isNaN(target)) return;
      setTimeout(function() {
        var duration = 1500;
        var step = Math.ceil(target / (duration / 16));
        var current = 0;
        function tick() {
          current += step;
          if (current >= target) {
            val.textContent = target + '+';
            return;
          }
          val.textContent = current + '+';
          requestAnimationFrame(tick);
        }
        tick();
      }, i * 200 + 100);
    });
  }

  /* ─── Consultation Modal ─── */
  function initConsultModal() {
    var openBtns = document.querySelectorAll('.book-consult-btn');
    var modal = document.getElementById('consultModal');
    var closeBtn = document.getElementById('consultModalClose');
    if (openBtns.length === 0 || !modal) return;

    function openModal() {
      modal.classList.add('open');
      document.body.classList.add('modal-open');
    }

    function closeModal() {
      modal.classList.remove('open');
      document.body.classList.remove('modal-open');
    }

    openBtns.forEach(function(btn) {
      btn.addEventListener('click', openModal);
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', function(e) {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });

    var form = document.getElementById('consultForm');
    if (form) {
      form.addEventListener('submit', function(e) {
        var feedback = document.getElementById('consultFeedback');
        if (!feedback) return;
        var btn = form.querySelector('button[type="submit"]');
        if (!btn) return;
        btn.disabled = true;
        btn.textContent = 'Sending...';
        feedback.style.display = 'none';
        feedback.className = '';
        var formData = new FormData(form);
        var params = new URLSearchParams();
        formData.forEach(function(value, key) { params.append(key, value); });
        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: params,
          headers: { 'Accept': 'application/json' }
        }).then(function(res) {
          if (res.ok) {
            feedback.style.display = 'block';
            feedback.style.background = 'rgba(26,122,107,0.1)';
            feedback.style.color = 'var(--accent)';
            feedback.textContent = 'Thank you! Your booking request has been sent. We\'ll be in touch within 24 hours.';
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
          btn.textContent = 'Send Booking Request';
        });
      });
    }
  }

  /* ─── Testimonials ─── */
  function initTestimonials() {
    var card = document.querySelector('.testimonials-card');
    if (!card) return;
    var slides = card.querySelectorAll('.testimonial-slide');
    var dotsContainer = card.querySelector('.testimonial-dots');
    if (!dotsContainer || slides.length < 2) return;

    slides.forEach(function(_, i) {
      var dot = document.createElement('span');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', function() {
        showSlide(i);
      });
      dotsContainer.appendChild(dot);
    });

    var dots = dotsContainer.querySelectorAll('span');
    var current = 0;
    var interval;

    function showSlide(index) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = index;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }

    function startRotation() {
      interval = setInterval(function() {
        showSlide((current + 1) % slides.length);
      }, 5000);
    }

    function stopRotation() {
      clearInterval(interval);
    }

    card.addEventListener('mouseenter', stopRotation);
    card.addEventListener('mouseleave', startRotation);
    startRotation();
  }

  /* ─── Hero & CTA Slideshow ─── */
  function initSlideshows() {
    var heroSlides = document.querySelectorAll('.page-hero-slideshow .hero-bg-slide');
    if (heroSlides.length >= 2) {
      var heroIndex = 0;
      setInterval(function() {
        heroSlides[heroIndex].classList.remove('active');
        heroIndex = (heroIndex + 1) % heroSlides.length;
        heroSlides[heroIndex].classList.add('active');
      }, 4000);
    }

    var ctaSlides = document.querySelectorAll('.cta-contact .cta-bg-slide');
    if (ctaSlides.length >= 2) {
      var ctaIndex = 0;
      setInterval(function() {
        ctaSlides[ctaIndex].classList.remove('active');
        ctaIndex = (ctaIndex + 1) % ctaSlides.length;
        ctaSlides[ctaIndex].classList.add('active');
      }, 4500);
    }
  }

  /* ─── Hero Carousel ─── */
  function initHeroCarousel() {
    var carousel = document.querySelector('.hero-carousel');
    if (!carousel) return;
    var slides = carousel.querySelectorAll('.hero-carousel-slide');
    var dotsContainer = carousel.querySelector('.hero-carousel-dots');
    if (slides.length < 2 || !dotsContainer) return;

    slides.forEach(function(_, i) {
      var dot = document.createElement('button');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', function() { goToSlide(i); });
      dotsContainer.appendChild(dot);
    });

    var dots = dotsContainer.querySelectorAll('button');
    var current = 0;
    var interval;

    function goToSlide(index) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = index;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }

    function nextSlide() {
      goToSlide((current + 1) % slides.length);
    }

    function startAuto() {
      interval = setInterval(nextSlide, 5000);
    }

    function stopAuto() {
      clearInterval(interval);
    }

    carousel.addEventListener('mouseenter', stopAuto);
    carousel.addEventListener('mouseleave', startAuto);
    carousel.addEventListener('touchstart', stopAuto, { passive: true });
    carousel.addEventListener('touchend', startAuto, { passive: true });
    startAuto();
  }

  /* ─── Boot ─── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initSplash();
      initHeroCarousel();
      initNavbar();
      initScrollAnimations();
      initActiveLink();
      initContactForm();
      initTrustCounters();
      initConsultModal();
      initSlideshows();
      initTestimonials();
    });
  } else {
    initSplash();
    initHeroCarousel();
    initNavbar();
    initScrollAnimations();
    initActiveLink();
    initContactForm();
    initTrustCounters();
    initConsultModal();
    initSlideshows();
    initTestimonials();
  }

})();
