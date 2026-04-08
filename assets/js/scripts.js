document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.querySelector('i').classList.remove('fa-times');
            hamburger.querySelector('i').classList.add('fa-bars');
        });
    });

    // Sticky Header
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Active Link on Scroll
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Scroll Animation (Fade Up)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-up');
    fadeElements.forEach(el => observer.observe(el));

    // Appointment Form Submission
    const appointmentForm = document.getElementById('appointmentForm');
    const formFeedback = document.getElementById('formFeedback');
    const submitBtn = document.getElementById('submitBtn');

    if (appointmentForm) {
        appointmentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Clear previous feedback
            formFeedback.style.display = 'none';
            formFeedback.className = 'form-feedback';
            
            // Basic Validation
            const phone = document.getElementById('userPhone').value.trim();
            const phoneRegex = /^(\+92|0)[3-9][0-9]{8,9}$/; // Pakistan phone format
            
            if (!phoneRegex.test(phone)) {
                showFeedback('Please enter a valid Pakistan phone number (e.g. 03311234567)', 'error');
                return;
            }

            // Set loading state
            submitBtn.disabled = true;
            submitBtn.classList.add('btn-loading');
            submitBtn.innerText = 'Sending Request...';

            // Prepare Data
            const formData = {
                name: document.getElementById('userName').value,
                phone: phone,
                date: document.getElementById('userDate').value,
                condition: document.getElementById('userCondition').value,
                message: document.getElementById('userMessage').value
            };

            // Prepare formatted message for WhatsApp
            const whatsappMessage = `*New Appointment Request*%0A%0A` +
                `*Name:* ${formData.name}%0A` +
                `*Phone:* ${formData.phone}%0A` +
                `*Date/Time:* ${formData.date}%0A` +
                `*Condition:* ${formData.condition}%0A` +
                `*Details:* ${formData.message || 'No additional details'}`;

            // Open WhatsApp link
            const waLink = `https://wa.me/923314341212?text=${whatsappMessage}`;
            window.open(waLink, '_blank');

            // Show success feedback
            showFeedback('Redirecting to WhatsApp for final confirmation...', 'success');
            appointmentForm.reset();
            
            submitBtn.disabled = false;
            submitBtn.classList.remove('btn-loading');
            submitBtn.innerText = 'Get Pain Relief Today';
        });
    }

    function showFeedback(message, type) {
        formFeedback.innerText = message;
        formFeedback.classList.add(type);
        formFeedback.style.display = 'block';
        formFeedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});
