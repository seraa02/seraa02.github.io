/**
 * main.js — Saher Thekedar Portfolio
 * All custom JavaScript in one file.
 * Dependencies (loaded via CDN before this file):
 *   jQuery, Bootstrap, Owl Carousel, AOS, jQuery Waypoints
 */

(function ($) {
  'use strict';

  /* ─────────────────────────────────────────────
     1. TYPING ANIMATION
  ───────────────────────────────────────────── */
  var typingEl = document.getElementById('typing-animation');
  if (typingEl) {
    var typingTexts = [
      'An Engineer ',
      'Data Scientist ',
      'Data Enthusiast '
    ];
    var currentIndex = 0;

    function playTyping(text) {
      typingEl.textContent = '';
      for (var i = 0; i < text.length; i++) {
        (function (char, delay) {
          setTimeout(function () {
            typingEl.textContent += char;
          }, delay);
        })(text[i], i * 150);
      }
      // pause then move to next
      setTimeout(function () {
        currentIndex = (currentIndex + 1) % typingTexts.length;
        // pause between words
        setTimeout(function () {
          playTyping(typingTexts[currentIndex]);
        }, 600);
      }, text.length * 150 + 800);
    }

    playTyping(typingTexts[0]);
  }

  /* ─────────────────────────────────────────────
     2. PAGE LOADER — hide after page load
  ───────────────────────────────────────────── */
  $(window).on('load', function () {
    var loader = $('#ftco-loader');
    setTimeout(function () {
      loader.removeClass('show');
      setTimeout(function () {
        loader.hide();
      }, 300);
    }, 300);
  });

  /* ─────────────────────────────────────────────
     3. NAVBAR SCROLL BEHAVIOUR
        - adds .scrolled when page is scrolled
        - .awake slides navbar down, .sleep hides it
  ───────────────────────────────────────────── */
  var navbar   = $('#ftco-navbar');
  var SCROLL_THRESHOLD = 200;
  var sleeping = false;
  var prevScrollY = window.scrollY;

  function handleNavScroll() {
    var currentY = window.scrollY;

    if (currentY > SCROLL_THRESHOLD) {
      if (!navbar.hasClass('scrolled')) {
        navbar.addClass('scrolled');
      }
      // direction logic: scrolling UP → awake, DOWN → sleep
      if (currentY < prevScrollY) {
        // scrolling up
        navbar.addClass('awake').removeClass('sleep');
        sleeping = false;
      } else {
        // scrolling down
        if (!sleeping) {
          navbar.addClass('sleep').removeClass('awake');
          sleeping = true;
        }
      }
    } else {
      navbar.removeClass('scrolled awake sleep');
      sleeping = false;
    }
    prevScrollY = currentY;
  }

  $(window).on('scroll.navbar', handleNavScroll);

  /* ─────────────────────────────────────────────
     4. ACTIVE NAV LINK based on scroll position
  ───────────────────────────────────────────── */
  var sections  = $('section[id]');
  var navLinks  = $('.site-navbar-target .nav-link');

  $(window).on('scroll.nav-active', function () {
    var scrollPos = $(window).scrollTop() + navbar.outerHeight() + 20;
    sections.each(function () {
      var top    = $(this).offset().top;
      var bottom = top + $(this).outerHeight();
      var id     = $(this).attr('id');
      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.parent().removeClass('active');
        navLinks.filter('[href="#' + id + '"]').parent().addClass('active');
      }
    });
  });

  /* ─────────────────────────────────────────────
     5. SMOOTH SCROLL for nav links
  ───────────────────────────────────────────── */
  $(document).on('click', 'a[href^="#"]', function (e) {
    var target = $(this.hash);
    if (target.length) {
      e.preventDefault();
      $('html, body').animate({
        scrollTop: target.offset().top - (navbar.outerHeight() || 0)
      }, 600, 'swing');
      // collapse mobile nav
      $('.navbar-collapse').collapse('hide');
    }
  });

  /* ─────────────────────────────────────────────
     6. MOBILE NAV TOGGLE (hamburger icon)
  ───────────────────────────────────────────── */
  var toggle = $('.js-fh5co-nav-toggle');
  toggle.on('click', function () {
    $(this).toggleClass('active');
  });

  /* ─────────────────────────────────────────────
     7. OWL CAROUSEL — hero slider
  ───────────────────────────────────────────── */
  if ($('.home-slider').length) {
    $('.home-slider').owlCarousel({
      loop: true,
      autoplay: true,
      autoplayTimeout: 5000,
      autoplayHoverPause: true,
      margin: 0,
      animateOut: 'fadeOut',
      nav: false,
      dots: true,
      items: 1,
      smartSpeed: 800
    });
  }

  /* ─────────────────────────────────────────────
     8. AOS (Animate On Scroll)
  ───────────────────────────────────────────── */
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'slide',
      once: true
    });
  }

  /* ─────────────────────────────────────────────
     9. FTCO ANIMATE — reveal elements on scroll
        Uses IntersectionObserver (modern, no Waypoints needed)
  ───────────────────────────────────────────── */
  function initFtcoAnimate() {
    var targets = document.querySelectorAll('.ftco-animate');
    if (!targets.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          el.classList.add('animated', 'fadeInUp');
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.1 });

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  // Add the keyframe + helper class to <head> if not present
  (function injectAnimationCSS() {
    if (document.getElementById('ftco-anim-style')) return;
    var style = document.createElement('style');
    style.id = 'ftco-anim-style';
    style.textContent = [
      '@keyframes fadeInUp {',
      '  from { opacity:0; transform: translateY(30px); }',
      '  to   { opacity:1; transform: translateY(0); }',
      '}',
      '.ftco-animate.animated {',
      '  opacity: 1 !important;',
      '  visibility: visible !important;',
      '  animation: fadeInUp .6s ease forwards;',
      '}'
    ].join('\n');
    document.head.appendChild(style);
  })();

  initFtcoAnimate();

  /* ─────────────────────────────────────────────
     10. COUNTER ANIMATION
         Animates [data-number] elements when visible
  ───────────────────────────────────────────── */
  function animateCounter(el) {
    var target    = parseInt(el.getAttribute('data-number'), 10);
    var duration  = 1500; // ms
    var start     = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(step);
  }

  var counterEls   = document.querySelectorAll('.number[data-number]');
  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterEls.forEach(function (el) {
    counterObserver.observe(el);
  });

  /* ─────────────────────────────────────────────
     11. PROGRESS BARS — animate width when in view
  ───────────────────────────────────────────── */
  var progressBars = document.querySelectorAll('.progress-bar');
  var progressObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var bar      = entry.target;
        var targetW  = bar.style.width || bar.getAttribute('aria-valuenow') + '%';
        bar.style.width = '0';
        // small delay so transition is visible
        setTimeout(function () {
          bar.style.transition = 'width 1.2s ease';
          bar.style.width = targetW;
        }, 200);
        progressObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  progressBars.forEach(function (bar) {
    progressObserver.observe(bar);
  });

  /* ─────────────────────────────────────────────
     12. BACK-TO-TOP (optional — uncomment to use)
  ───────────────────────────────────────────── */
  // $(window).on('scroll', function () {
  //   if ($(this).scrollTop() > 300) { $('#back-to-top').fadeIn(); }
  //   else { $('#back-to-top').fadeOut(); }
  // });
  // $('#back-to-top').on('click', function () {
  //   $('html, body').animate({ scrollTop: 0 }, 600); return false;
  // });

})(jQuery);