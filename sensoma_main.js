document.addEventListener('DOMContentLoaded', function() {
  console.log('JavaScript loaded');

  const navLinks = document.querySelectorAll('.nav-links .nav-link:not(.book-trigger)');
  const underline = document.querySelector('.nav-underline');
  const sections = document.querySelectorAll('.section, .hero-section');
  const brandLink = document.querySelector('.brand-link');
  const hamburger = document.querySelector('.hamburger');
  const navCenter = document.querySelector('.nav-center');
  
  
const bookTriggers = document.querySelectorAll('.book-trigger');
const bookingOverlay = document.querySelector('.booking-overlay');
const bookingPanel = document.querySelector('.booking-panel');
const closeBooking = document.querySelector('.close-booking');

// ============================================
// HAMBURGER MENU TOGGLE
// ============================================
function toggleMobileMenu() {
	hamburger.classList.toggle('active');
	navCenter.classList.toggle('active');
	
	// Prevent body scroll when menu is open
	if (navCenter.classList.contains('active')) {
		document.body.style.overflow = 'hidden';
	} else {
		document.body.style.overflow = '';
	}
}

function closeMobileMenu() {
	hamburger.classList.remove('active');
	navCenter.classList.remove('active');
	document.body.style.overflow = '';
}

if (hamburger) {
	hamburger.addEventListener('click', toggleMobileMenu);
}


function openBooking() {
	underline.classList.remove('active');
	navLinks.forEach(l => l.classList.remove('active'));
	
  bookingOverlay.classList.add('active');
  bookingPanel.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeBookingPanel() {
  bookingOverlay.classList.remove('active');
  bookingPanel.classList.remove('active');
  document.body.style.overflow = '';
}

// Add event listeners
bookTriggers.forEach(trigger => {
  trigger.addEventListener('click', function(e) {
    e.preventDefault();
    openBooking();
  });
  
  brandLink.classList.add('active');
  moveUnderlineToBrand();
});

closeBooking.addEventListener('click', closeBookingPanel);
bookingOverlay.addEventListener('click', closeBookingPanel);

  console.log('Found nav links:', navLinks.length);
  console.log('Found sections:', sections.length);

  function moveUnderline(activeLink) {
    const navLinksContainer = document.querySelector('.nav-links');
    const containerRect = navLinksContainer.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();

    const leftPosition = linkRect.left - containerRect.left;
    underline.style.width = linkRect.width + 'px';
    underline.style.left = leftPosition + 'px';
    underline.classList.add('active');
  }

  function moveUnderlineToBrand() {
    const navLinksContainer = document.querySelector('.nav-links');
    const containerRect = navLinksContainer.getBoundingClientRect();
    const brandRect = brandLink.getBoundingClientRect();

    const leftPosition = brandRect.left - containerRect.left;
    underline.style.width = brandRect.width + 'px';
    underline.style.left = leftPosition + 'px';
    underline.classList.add('active');
  }
  
  // Click handling for nav links
	navLinks.forEach(link => {
		link.addEventListener('mousedown', function () {
			this.classList.add('clicked')
		});
		link.addEventListener('mouseup', function () {
			this.classList.remove('clicked');
		});
		link.addEventListener('mouseleave', function () {
			this.classList.remove('clicked');
		});
	});
  
  
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
	  
	  closeMobileMenu();
	  
	  if (bookingPanel.classList.contains('active')) {
		  closeBookingPanel();
	  }

      navLinks.forEach(l => l.classList.remove('active'));
	  brandLink.classList.remove('active');
      this.classList.add('active');
      moveUnderline(this);

      this.classList.add('clicked');

      if (this._clickedTimer) {
        clearTimeout(this._clickedTimer);
      }
      this._clickedTimer = setTimeout(() => {
        this.classList.remove('clicked');
        this._clickedTimer = null;
      }, 900);

      const targetId = this.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);

      console.log('Target section:', targetSection);

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Click handling for brand link
  brandLink.addEventListener('click', function(e) {
    console.log('Brand link clicked');
    e.preventDefault();
	
	closeMobileMenu();
	
	if (bookingPanel.classList.contains('active')) {
		closeBookingPanel();
	}

    navLinks.forEach(l => l.classList.remove('active'));
	brandLink.classList.add('active');
    moveUnderlineToBrand();

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // Click handling for logo (nav-left)
const navLogo = document.querySelector('.nav-left');
if (navLogo) {
  navLogo.addEventListener('click', function(e) {
    console.log('Logo clicked');
    e.preventDefault();
	
	closeMobileMenu();
    
    if (bookingPanel.classList.contains('active')) {
      closeBookingPanel();
    }

    navLinks.forEach(l => l.classList.remove('active'));
    brandLink.classList.add('active');
    moveUnderlineToBrand();

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  navLogo.style.cursor = 'pointer';
}

  // Scroll handling
  let scrollTimeout;
  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
      let current = '';

      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 200 && rect.bottom >= 200) {
          current = section.getAttribute('id');
        }
      });

      if (current === 'home') {
        navLinks.forEach(l => l.classList.remove('active'));
		brandLink.classList.add('active');
        moveUnderlineToBrand();
      } else if (current) {
		  brandLink.classList.remove('active');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
            moveUnderline(link);
          }
        });
      }
    }, 100);
  });

  // Initialize
  moveUnderlineToBrand();
  

	const bookingForm = document.getElementById('booking-form');
	console.log('Booking form found:', bookingForm);

	bookingForm.addEventListener('submit', async function(e) {
	e.preventDefault();

	console.log('Form submitted!');
	
	const submitBtn = bookingForm.querySelector('.booking-submit-btn');
	const originalText = submitBtn.textContent;
	const originalBg = submitBtn.style.backgroundColor;

	submitBtn.textContent = 'Sending...';
	submitBtn.disabled = true;
	
	const formData = new FormData(bookingForm);
	formData.append('_subject', 'New Booking Request - Sensoma');

	try {
		const response = await fetch('https://formspree.io/f/xrbyqvjg', {
			method: 'POST',
			body: formData,
			headers: {
				'Accept': 'application/json'
			}
		});
		
		if (response.ok) {
			console.log('Booking sent successfully');
			bookingForm.style.display = 'none';
			const successDiv = document.getElementById('booking-success');
			successDiv.style.display = 'block';
		} else {
			throw new Error('Form submission failed');
		}
	} catch (error) {
		console.error('Booking submission error:', error);
		submitBtn.textContent = 'Failed to send. Try again.';
		submitBtn.style.backgroundColor = '#f44336';
		
		setTimeout(() => {
			submitBtn.textContent = originalText;
			submitBtn.style.backgroundColor = originalBg;
			submitBtn.disabled = false;
		}, 3000);
	}
});

	// CONTACT FORM HANDLER
	const contactForm = document.getElementById('contact-form-simple');
	console.log('Contact form found:', contactForm);
	
	if (contactForm) {
		contactForm.addEventListener('submit', async function(e) {
			e.preventDefault();
			
			console.log('Contact form submitted!');
			
			const submitBtn = contactForm.querySelector('.simple-submit-btn');
			const originalText = submitBtn.textContent;
			const originalBg = submitBtn.style.backgroundColor;
			
			submitBtn.textContent = 'Sending...';
			submitBtn.disabled = true;
			
			const formData = new FormData(contactForm);
			formData.append('_subject', 'New Contact Message - Sensoma');
			
			try {
				const response = await fetch('https://formspree.io/f/xrbyqvjg', {
					method: 'POST',
					body: formData,
					headers: {
						'Accept': 'application/json'
					}
				});
				
				if (response.ok) {
					console.log('Contact form sent successfully');
					submitBtn.textContent = 'Message Sent! ✓';
					submitBtn.style.backgroundColor = '#4CAF50';
					
					contactForm.reset();
					
					setTimeout(() => {
						submitBtn.textContent = originalText;
						submitBtn.style.backgroundColor = originalBg;
						submitBtn.disabled = false;
					}, 3000);
				} else {
					throw new Error('Form submission failed');
				}
			} catch (error) {
				console.error('Contact form submission error:', error);
				submitBtn.textContent = 'Failed to send. Try again.';
				submitBtn.style.backgroundColor = '#f44336';
				
				setTimeout(() => {
					submitBtn.textContent = originalText;
					submitBtn.style.backgroundColor = originalBg;
					submitBtn.disabled = false;
				}, 3000);
			}
		});
	}
	
	/* working 'learn more' button */
	// Add after line 40 in sensoma_main.js
	const learnMoreBtn = document.querySelector('.about-more-button button');
	if (learnMoreBtn) {
		learnMoreBtn.addEventListener('click', function() {
			document.getElementById('about').scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			});
		});
	}
	
	
	const bookingDateInput = document.getElementById('booking-date');

if (bookingDateInput) {
    const today = new Date();
    bookingDateInput.setAttribute('min', today.toISOString().split('T')[0]);

    function isValidBookingDate(date) {
        const day = date.getDay(); // 0 = Sunday, 5 = Friday, 6 = Saturday
        return day === 5 || day === 6 || day === 0;
    }

    function findNextValidDate(date) {
        let next = new Date(date);
        do {
            next.setDate(next.getDate() + 1);
        } while (!isValidBookingDate(next));
        return next;
    }

    bookingDateInput.addEventListener('input', function () {
        const selected = new Date(this.value);
        if (!isValidBookingDate(selected)) {
            const nextValid = findNextValidDate(selected);
            alert('Only Friday, Saturday, and Sunday are available. Automatically selecting next available date.');
            this.value = nextValid.toISOString().split('T')[0];
        }
    });

    // Automatically adjust on page load if current date is invalid
    const initialDate = new Date(bookingDateInput.value || today);
    if (!isValidBookingDate(initialDate)) {
        bookingDateInput.value = findNextValidDate(initialDate).toISOString().split('T')[0];
    }
}

/* Unable to get mouse tracking to work

// mouse tracking function
const hoverImages = document.querySelectorAll('.about-header img, .consultation-image img, .treatment-image img, .lisa-image img');

hoverImages.forEach(img => {
    img.addEventListener('mouseenter', function() {
        // Add a flag when mouse enters
        this.isHovered = true;
    });
    
    img.addEventListener('mousemove', function(e) {
        const rect = img.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        
        // Add lift only when hovering
        img.style.transform = `perspective(1000px) translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    
    img.addEventListener('mouseleave', function() {
        this.isHovered = false;
        img.style.transform = 'perspective(1000px) translateY(0) rotateX(0deg) rotateY(0deg) scale(1)';
    });
});

*/

});