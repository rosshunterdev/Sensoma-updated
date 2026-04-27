/* ================================================================
   SENSOMA — main.js
   1.  Element references
   2.  Footer year
   3.  Navbar scroll shadow
   4.  Hamburger / mobile menu
   5.  Booking panel open / close
   6.  Book-trigger buttons
   7.  Nav link active state (click-based, ::after underline via CSS)
   8.  Brand link & logo scroll-to-top
   9.  Scroll tracking → active nav link
   10. Scroll reveal (IntersectionObserver)
   11. Client-side form validation
   12. Booking form submission (Formspree)
   13. Contact form submission (Formspree)
   14. "Learn More" button
   15. "Contact me here" link
   16. Custom date picker (Fri/Sat/Sun only)
   ================================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ============================================================
     1. ELEMENT REFERENCES
     ============================================================ */
  const body           = document.body;
  const navbar         = document.getElementById('navbar');
  const navLogo        = document.getElementById('nav-logo');
  const brandLink      = document.getElementById('brand-link');
  const hamburger      = document.getElementById('hamburger');
  const navCenter      = document.getElementById('nav-center');
  const navLinks       = document.querySelectorAll('.nav-links a.nav-link:not(.book-trigger)');

  const bookingOverlay  = document.getElementById('booking-overlay');
  const bookingPanel    = document.getElementById('booking-panel');
  const closeBtns       = document.querySelectorAll('.close-booking');
  const bookingForm     = document.getElementById('booking-form');
  const bookingSuccess  = document.getElementById('booking-success');
  const bookingDoneBtn  = document.getElementById('booking-done-btn');
  const bookTriggers    = document.querySelectorAll('.book-trigger');

  const sections        = document.querySelectorAll('section[id], #bridge');
  const learnMoreBtn    = document.getElementById('learn-more-btn');
  const bookChatBtn     = document.getElementById('book-chat-btn');
  const contactForm     = document.getElementById('contact-form-simple');
  const bookingDateInput = document.getElementById('booking-date');
  const footerYear      = document.getElementById('footer-year');


  /* ============================================================
     2. FOOTER YEAR
     ============================================================ */
  if (footerYear) footerYear.textContent = new Date().getFullYear();


  /* ============================================================
     3. NAVBAR SCROLL SHADOW
     ============================================================ */
  function onScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  /* ============================================================
     4. HAMBURGER / MOBILE MENU
     ============================================================ */
  function openMobileMenu() {
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    navCenter.classList.add('active');
    body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    navCenter.classList.remove('active');
    // Restore scroll only if booking isn't open
    if (!body.classList.contains('booking-open')) {
      body.style.overflow = '';
    }
  }

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      navCenter.classList.contains('active') ? closeMobileMenu() : openMobileMenu();
    });
  }

  window.addEventListener('resize', function () {
    if (window.innerWidth > 640) closeMobileMenu();
  });

  // A3: focus trap + Escape close for the mobile menu
  if (navCenter) {
    navCenter.addEventListener('keydown', function (e) {
      if (!navCenter.classList.contains('active')) return;
      if (e.key === 'Escape') {
        closeMobileMenu();
        if (hamburger) hamburger.focus();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusable = Array.from(navCenter.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )).filter(function (el) { return el.getClientRects().length > 0; });
      if (focusable.length < 2) return;
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
      }
    });
  }


  /* ============================================================
     5. BOOKING PANEL OPEN / CLOSE
     ============================================================ */
  function openBookingPanel() {
    body.classList.add('booking-open');
    bookingOverlay.setAttribute('aria-hidden', 'false');
    bookingPanel.setAttribute('aria-hidden', 'false');
    setTimeout(function () {
      const firstInput = document.getElementById('booking-name');
      if (firstInput) firstInput.focus();
    }, 60);
  }

  function closeBookingPanel() {
    body.classList.remove('booking-open');
    body.style.overflow = '';
    bookingOverlay.setAttribute('aria-hidden', 'true');
    bookingPanel.setAttribute('aria-hidden', 'true');
  }

  closeBtns.forEach(function (btn) {
    btn.addEventListener('click', closeBookingPanel);
  });

  if (bookingOverlay) {
    bookingOverlay.addEventListener('click', closeBookingPanel);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && body.classList.contains('booking-open')) {
      closeBookingPanel();
    }
  });

  // A2: focus trap for the booking panel
  if (bookingPanel) {
    bookingPanel.addEventListener('keydown', function (e) {
      if (!body.classList.contains('booking-open') || e.key !== 'Tab') return;
      const focusable = Array.from(bookingPanel.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )).filter(function (el) { return el.getClientRects().length > 0; });
      if (focusable.length < 2) return;
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
      }
    });
  }


  /* ============================================================
     6. BOOK-TRIGGER BUTTONS
     ============================================================ */
  bookTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', function (e) {
      // U1: on touch/mobile viewports suppress the whole-card click — only the
      // explicit "Book this session" button inside the card should trigger booking.
      // Descriptions are always visible on mobile so no information is lost.
      if (trigger.tagName.toLowerCase() === 'article' && window.innerWidth <= 640) return;
      e.preventDefault();
      closeMobileMenu();
      openBookingPanel();
    });

    // A1: <article role="button"> elements don't fire click on Enter/Space natively
    if (trigger.tagName.toLowerCase() === 'article') {
      trigger.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          closeMobileMenu();
          openBookingPanel();
        }
      });
    }
  });


  /* ============================================================
     7. NAV UNDERLINE — stable offsetLeft-based sliding bar
     ============================================================ */
  const navUnderline = document.getElementById('nav-underline');
  const navLinksWrap = navUnderline ? navUnderline.closest('.nav-links') : null;

  // Build a lookup: href → { left, width } using offsetLeft/offsetWidth.
  // These are layout-relative (not scroll-relative) so they never jitter.
  const linkOffsets = {};

  function cacheOffsets() {
    if (!navLinksWrap) return;
    linkOffsets['#home'] = brandLink
      ? { left: brandLink.offsetLeft, width: brandLink.offsetWidth }
      : null;
    navLinks.forEach(function (l) {
      linkOffsets[l.getAttribute('href')] = {
        left:  l.offsetLeft,
        width: l.offsetWidth
      };
    });
  }

  function moveUnderlineTo(href) {
    if (!navUnderline) return;
    const pos = linkOffsets[href];
    if (!pos) return;
    navUnderline.style.left  = pos.left  + 'px';
    navUnderline.style.width = pos.width + 'px';
    navUnderline.classList.add('ready');
  }

  // Which href is currently "active" — single source of truth
  let currentHref = '#home';

  function setActiveLink(href) {
    if (!href) href = '#home';
    currentHref = href;

    navLinks.forEach(function (l) { l.classList.remove('active'); });
    if (brandLink) brandLink.classList.remove('active');

    if (href === '#home') {
      if (brandLink) brandLink.classList.add('active');
    } else {
      navLinks.forEach(function (l) {
        if (l.getAttribute('href') === href) l.classList.add('active');
      });
    }

    moveUnderlineTo(href);
  }

  // Cache on load, recache on resize
  cacheOffsets();
  window.addEventListener('resize', function () {
    cacheOffsets();
    moveUnderlineTo(currentHref);
  }, { passive: true });

  // ── Click handlers ──────────────────────────────────────────
  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      closeMobileMenu();

      const href = this.getAttribute('href');
      setActiveLink(href);                  // move underline immediately

      const wasOpen = body.classList.contains('booking-open');
      if (wasOpen) closeBookingPanel();

      const targetId = href.substring(1);
      const target   = document.getElementById(targetId);
      if (target) {
        const delay = wasOpen ? 700 : 0;
        setTimeout(function () {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, delay);
      }
    });
  });


  /* ============================================================
     8. BRAND LINK & LOGO — scroll to top
     ============================================================ */
  function handleHomeClick(e) {
    if (e) e.preventDefault();
    closeMobileMenu();
    setActiveLink('#home');                 // move underline immediately
    const wasOpen = body.classList.contains('booking-open');
    if (wasOpen) closeBookingPanel();
    const delay = wasOpen ? 700 : 0;
    setTimeout(function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, delay);
  }

  if (brandLink) brandLink.addEventListener('click', handleHomeClick);

  if (navLogo) {
    navLogo.addEventListener('click', handleHomeClick);
    navLogo.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') handleHomeClick(e);
    });
  }

  // Initialise — show underline under Sensoma on page load
  setTimeout(function () { setActiveLink('#home'); }, 80);


  /* ============================================================
     9. SCROLL TRACKING — drives underline while user scrolls freely
     Only fires when NO click-navigation is pending.
     ============================================================ */
  const scrollableSections = document.querySelectorAll('section[id]');
  let scrollRaf;
  let scrollPendingUntil = 0;   // timestamp: ignore scroll events before this

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      // Suppress scroll-tracking for 1 s after a deliberate click
      scrollPendingUntil = Date.now() + 1500;
    });
  });
  if (brandLink) brandLink.addEventListener('click', function () {
    scrollPendingUntil = Date.now() + 1500;
  });
  if (navLogo) navLogo.addEventListener('click', function () {
    scrollPendingUntil = Date.now() + 1500;
  });

  window.addEventListener('scroll', function () {
    if (Date.now() < scrollPendingUntil) return;   // click-nav in flight
    cancelAnimationFrame(scrollRaf);
    scrollRaf = requestAnimationFrame(function () {
      let found = '';
      scrollableSections.forEach(function (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 160 && rect.bottom >= 160) {
          found = '#' + section.getAttribute('id');
        }
      });

      if (found) {
        setActiveLink(found);
      } else if (window.scrollY < 100) {
        setActiveLink('#home');
      }
    });
  }, { passive: true });


  /* ============================================================
     10. SCROLL REVEAL — IntersectionObserver
     Adds .is-visible to elements with .reveal-up / .reveal-left /
     .reveal-right when they enter the viewport.
     ============================================================ */
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show everything immediately
    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }


  /* ============================================================
     11. CLIENT-SIDE FORM VALIDATION
     ============================================================ */
  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function showFieldError(el, msg) {
    el.classList.add('field-error');
    // Only inject the message element once; re-submitting won't duplicate it
    if (!el.nextElementSibling || !el.nextElementSibling.classList.contains('field-error-msg')) {
      const span = document.createElement('span');
      span.className = 'field-error-msg';
      span.textContent = msg;
      el.insertAdjacentElement('afterend', span);
      // Auto-clear the error state on the next user interaction with this field
      ['input', 'change'].forEach(function (ev) {
        el.addEventListener(ev, function () { clearFieldError(el); }, { once: true });
      });
    }
  }

  function clearFieldError(el) {
    el.classList.remove('field-error');
    const sibling = el.nextElementSibling;
    if (sibling && sibling.classList.contains('field-error-msg')) sibling.remove();
  }

  function validateBookingForm() {
    let valid = true;

    const nameEl = document.getElementById('booking-name');
    if (!nameEl.value.trim()) {
      showFieldError(nameEl, 'Required'); valid = false;
    }

    const emailEl = document.getElementById('booking-email');
    if (!isValidEmail(emailEl.value)) {
      showFieldError(emailEl, emailEl.value.trim() ? 'Enter a valid email address' : 'Required');
      valid = false;
    }

    const phoneEl = document.getElementById('booking-phone');
    if (!phoneEl.value.trim()) {
      showFieldError(phoneEl, 'Required'); valid = false;
    }

    const serviceEl = document.getElementById('booking-service');
    if (!serviceEl.value) {
      showFieldError(serviceEl, 'Required'); valid = false;
    }

    const timeEl = document.getElementById('booking-time');
    if (!timeEl.value) {
      showFieldError(timeEl, 'Required'); valid = false;
    }

    return valid;
  }

  function validateContactForm() {
    let valid = true;

    const nameEl = document.getElementById('contact-name');
    if (!nameEl.value.trim()) {
      showFieldError(nameEl, 'Required'); valid = false;
    }

    const emailEl = document.getElementById('contact-email');
    if (!isValidEmail(emailEl.value)) {
      showFieldError(emailEl, emailEl.value.trim() ? 'Enter a valid email address' : 'Required');
      valid = false;
    }

    const msgEl = document.getElementById('contact-message');
    if (!msgEl.value.trim()) {
      showFieldError(msgEl, 'Required'); valid = false;
    }

    return valid;
  }


  /* ============================================================
     12. BOOKING FORM SUBMISSION
     ============================================================ */
  if (bookingForm) {
    bookingForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (!validateBookingForm()) return;

      const submitBtn    = bookingForm.querySelector('.booking-submit-btn');
      const originalText = submitBtn.textContent;

      submitBtn.textContent = 'Sending…';
      submitBtn.disabled    = true;

      const formData = new FormData(bookingForm);
      formData.append('_subject', 'New Booking Request – Sensoma');

      try {
        const response = await fetch('https://formspree.io/f/xrbyqvjg', {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          bookingForm.classList.add('is-hidden');
          if (bookingSuccess) bookingSuccess.classList.remove('is-hidden');
        } else {
          throw new Error('error');
        }
      } catch {
        submitBtn.textContent = 'Failed — please try again';
        submitBtn.classList.add('btn-error');
        setTimeout(function () {
          submitBtn.textContent = originalText;
          submitBtn.classList.remove('btn-error');
          submitBtn.disabled    = false;
        }, 3000);
      }
    });
  }

  if (bookingDoneBtn) {
    bookingDoneBtn.addEventListener('click', function () {
      closeBookingPanel();
      setTimeout(function () {
        if (bookingForm)    { bookingForm.classList.remove('is-hidden'); bookingForm.reset(); }
        if (bookingSuccess) { bookingSuccess.classList.add('is-hidden'); }
      }, 750);
    });
  }


  /* ============================================================
     13. CONTACT FORM SUBMISSION
     ============================================================ */
  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (!validateContactForm()) return;

      const submitBtn    = contactForm.querySelector('.simple-submit-btn');
      const originalText = submitBtn.textContent;

      submitBtn.textContent = 'Sending…';
      submitBtn.disabled    = true;

      const formData = new FormData(contactForm);
      formData.append('_subject', 'New Contact Message – Sensoma');

      try {
        const response = await fetch('https://formspree.io/f/xrbyqvjg', {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          submitBtn.textContent = 'Message Sent ✓';
          submitBtn.classList.add('btn-success');
          contactForm.reset();
          setTimeout(function () {
            submitBtn.textContent = originalText;
            submitBtn.classList.remove('btn-success');
            submitBtn.disabled    = false;
          }, 3000);
        } else {
          throw new Error('error');
        }
      } catch {
        submitBtn.textContent = 'Failed — please try again';
        submitBtn.classList.add('btn-error');
        setTimeout(function () {
          submitBtn.textContent = originalText;
          submitBtn.classList.remove('btn-error');
          submitBtn.disabled    = false;
        }, 3000);
      }
    });
  }


  /* ============================================================
     14. LEARN MORE BUTTON
     ============================================================ */
  if (learnMoreBtn) {
    learnMoreBtn.addEventListener('click', function () {
      const about = document.getElementById('about');
      if (about) about.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }


  /* ============================================================
     15. CONTACT ME HERE LINK
     ============================================================ */
  if (bookChatBtn) {
    bookChatBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const contact = document.getElementById('contact');
      if (contact) contact.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }


  /* ============================================================
     16. CUSTOM DATE PICKER — Fri / Sat / Sun only
     Replaces the native date input with a styled calendar that
     greys out Mon–Thu and only allows Fri, Sat, Sun.
     ============================================================ */
  if (bookingDateInput) {

    // ── Helpers ───────────────────────────────────────────────
    function isAvailable(date) {
      const d = date.getDay();
      return d === 5 || d === 6 || d === 0; // Fri, Sat, Sun
    }

    function toYMD(date) {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return y + '-' + m + '-' + d;
    }

    function nextAvailable(from) {
      const d = new Date(from);
      d.setDate(d.getDate() + 1);
      while (!isAvailable(d)) d.setDate(d.getDate() + 1);
      return d;
    }

    // ── Initial selected date ─────────────────────────────────
    const today = new Date();
    today.setHours(0,0,0,0);
    let selectedDate = nextAvailable(new Date(today.getTime() - 86400000));
    bookingDateInput.value = toYMD(selectedDate);

    // ── Build the picker ──────────────────────────────────────
    let wrapper = bookingDateInput.closest('.booking-date-wrapper');
    if (!wrapper) wrapper = bookingDateInput.parentElement;

    // Hide the native input but keep it in the form
    bookingDateInput.style.cssText = 'position:absolute;opacity:0;pointer-events:none;width:1px;height:1px;';
    bookingDateInput.tabIndex = -1;

    // Display element — shows selected date, opens calendar on click
    const displayEl = document.createElement('div');
    displayEl.className = 'datepicker-display';
    displayEl.setAttribute('tabindex', '0');
    displayEl.setAttribute('role', 'button');
    displayEl.setAttribute('aria-label', 'Choose a date');

    // Calendar popup
    const calEl = document.createElement('div');
    calEl.className = 'datepicker-cal';
    calEl.setAttribute('aria-hidden', 'true');

    // Insert after the label
    const label = wrapper.querySelector('label');
    if (label) {
      label.after(displayEl);
      displayEl.after(calEl);
    } else {
      wrapper.insertBefore(displayEl, bookingDateInput);
      wrapper.insertBefore(calEl, bookingDateInput);
    }

    // Calendar state
    let viewYear  = selectedDate.getFullYear();
    let viewMonth = selectedDate.getMonth();
    let isOpen    = false;

    const MONTHS = ['January','February','March','April','May','June',
                    'July','August','September','October','November','December'];
    const DAYS   = ['Su','Mo','Tu','We','Th','Fr','Sa'];

    function formatDisplay(date) {
      return DAYS[date.getDay()] + ' ' +
             date.getDate() + ' ' +
             MONTHS[date.getMonth()] + ' ' +
             date.getFullYear();
    }

    function renderCal() {
      const firstDay = new Date(viewYear, viewMonth, 1).getDay();
      const daysIn   = new Date(viewYear, viewMonth + 1, 0).getDate();

      let html = '<div class="dp-header">' +
        '<button class="dp-prev" type="button" aria-label="Previous month">‹</button>' +
        '<span class="dp-month-year">' + MONTHS[viewMonth] + ' ' + viewYear + '</span>' +
        '<button class="dp-next" type="button" aria-label="Next month">›</button>' +
        '</div>' +
        '<div class="dp-grid">';

      // Day headers
      DAYS.forEach(function(d, i) {
        const unavail = (i !== 5 && i !== 6 && i !== 0);
        html += '<div class="dp-day-hdr' + (unavail ? ' dp-unavail-hdr' : '') + '">' + d + '</div>';
      });

      // Blank cells before 1st
      for (let b = 0; b < firstDay; b++) {
        html += '<div class="dp-day dp-empty"></div>';
      }

      // Day cells
      for (let day = 1; day <= daysIn; day++) {
        const date   = new Date(viewYear, viewMonth, day);
        const avail  = isAvailable(date);
        const isPast = date < today;
        const isSel  = toYMD(date) === toYMD(selectedDate);
        let cls      = 'dp-day';
        if (!avail || isPast) cls += ' dp-disabled';
        else cls += ' dp-available';
        if (isSel && avail && !isPast) cls += ' dp-selected';
        html += '<div class="' + cls + '" data-date="' + toYMD(date) + '">' + day + '</div>';
      }

      html += '</div>';
      calEl.innerHTML = html;

      // Bind prev/next
      calEl.querySelector('.dp-prev').addEventListener('click', function(e) {
        e.stopPropagation();
        viewMonth--;
        if (viewMonth < 0) { viewMonth = 11; viewYear--; }
        renderCal();
      });
      calEl.querySelector('.dp-next').addEventListener('click', function(e) {
        e.stopPropagation();
        viewMonth++;
        if (viewMonth > 11) { viewMonth = 0; viewYear++; }
        renderCal();
      });

      // Bind day clicks
      calEl.querySelectorAll('.dp-available').forEach(function(cell) {
        cell.addEventListener('click', function(e) {
          e.stopPropagation();
          const parts = this.getAttribute('data-date').split('-');
          selectedDate = new Date(+parts[0], +parts[1]-1, +parts[2]);
          bookingDateInput.value = toYMD(selectedDate);
          // Fire change event so any listeners pick it up
          bookingDateInput.dispatchEvent(new Event('change', { bubbles: true }));
          displayEl.textContent = formatDisplay(selectedDate);
          closeCal();
        });
      });
    }

    function openCal() {
      viewYear  = selectedDate.getFullYear();
      viewMonth = selectedDate.getMonth();
      renderCal();
      calEl.classList.add('open');
      calEl.setAttribute('aria-hidden', 'false');
      isOpen = true;
    }

    function closeCal() {
      calEl.classList.remove('open');
      calEl.setAttribute('aria-hidden', 'true');
      isOpen = false;
    }

    // Initialise display text
    displayEl.textContent = formatDisplay(selectedDate);

    // Toggle on click
    displayEl.addEventListener('click', function(e) {
      e.stopPropagation();
      isOpen ? closeCal() : openCal();
    });

    displayEl.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        isOpen ? closeCal() : openCal();
      }
      if (e.key === 'Escape') closeCal();
    });

    // Close on outside click
    document.addEventListener('click', function() { if (isOpen) closeCal(); });
  }

  /* ── Contact select: placeholder colour state ── */
  document.querySelectorAll('.select-wrap select').forEach(function (sel) {
    function updateState() {
      sel.classList.toggle('placeholder-state', sel.value === '');
    }
    updateState();
    sel.addEventListener('change', updateState);
  });

}); // end DOMContentLoaded
