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

    function speakWelcome() {
      if (!('speechSynthesis' in window)) return;
      var utterance = new SpeechSynthesisUtterance('Welcome to Pakanyo HR Solutions');
      utterance.rate = 0.92;
      utterance.pitch = 1.05;
      utterance.volume = 1;
      var voices = window.speechSynthesis.getVoices();
      var femaleVoice = voices.find(function(v) {
        var name = v.name.toLowerCase();
        return /female/i.test(name) && /english/i.test(name) && (/south africa/i.test(name) || /za/i.test(v.lang));
      });
      if (!femaleVoice) {
        femaleVoice = voices.find(function(v) {
          var name = v.name.toLowerCase();
          return /female/i.test(name) && /english/i.test(name);
        });
      }
      if (femaleVoice) utterance.voice = femaleVoice;
      window.speechSynthesis.speak(utterance);
    }

    if (window.speechSynthesis) {
      if (window.speechSynthesis.getVoices().length) {
        speakWelcome();
      } else {
        window.speechSynthesis.addEventListener('voiceschanged', speakWelcome, { once: true });
      }
    }

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
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
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

  /* ─── Boot ─── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initSplash();
      initNavbar();
      initScrollAnimations();
      initActiveLink();
    });
  } else {
    initSplash();
    initNavbar();
    initScrollAnimations();
    initActiveLink();
  }

})();
