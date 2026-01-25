/**
 * EmailJS Contact Form Handler for KOMOTRAKS
 * Handles form submission and email sending via EmailJS
 */

(function() {
    'use strict';

    // Initialize EmailJS with your public key
    function initEmailJS() {
        if (typeof emailjs !== 'undefined' && CONFIG && CONFIG.EMAILJS_PUBLIC_KEY) {
            emailjs.init(CONFIG.EMAILJS_PUBLIC_KEY);
            console.log('✅ EmailJS initialized successfully');
        } else {
            console.error('❌ EmailJS or CONFIG not loaded. Check if config.js is included before this script.');
        }
    }

    // Show notification message to user
    function showNotification(message, type) {
        // Remove any existing notifications
        const existingNotification = document.querySelector('.email-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `email-notification alert alert-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 30px;
            z-index: 9999;
            min-width: 300px;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            font-size: 16px;
            font-weight: 600;
            animation: slideInRight 0.5s ease;
        `;
        
        // Set icon based on type
        const icon = type === 'success' ? '✅' : '❌';
        notification.innerHTML = `${icon} ${message}`;
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(function() {
            notification.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(function() {
                notification.remove();
            }, 500);
        }, 5000);
    }

    // Show loading state on button
    function setButtonLoading(button, isLoading) {
        if (isLoading) {
            button.disabled = true;
            button.dataset.originalText = button.innerHTML;
            button.innerHTML = '<span class="spinner-border spinner-border-sm mr-2"></span>Šalje se...';
        } else {
            button.disabled = false;
            button.innerHTML = button.dataset.originalText || 'Pošaljite Upit';
        }
    }

    // Handle form submission
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitButton = form.querySelector('button[type="submit"]');
        
        // Get form data
        const formData = {
            from_name: form.querySelector('input[name="name"]').value,
            from_phone: form.querySelector('input[name="phone"]').value,
            from_email: form.querySelector('input[name="email"]').value || 'Nije unet email',
            service_type: form.querySelector('select[name="service"]').value || 'Nije izabrano',
            location: form.querySelector('input[name="location"]').value,
            message: form.querySelector('textarea[name="message"]').value || 'Nema dodatnih informacija',
            // Additional metadata
            to_name: 'KOMOTRAKS Tim',
            reply_to: form.querySelector('input[name="email"]').value || form.querySelector('input[name="phone"]').value
        };
        
        // Validate required fields
        if (!formData.from_name || !formData.from_phone || !formData.location) {
            showNotification('Molimo popunite sva obavezna polja!', 'danger');
            return;
        }
        
        // Show loading state
        setButtonLoading(submitButton, true);
        
        // Send email via EmailJS
        emailjs.send(
            CONFIG.EMAILJS_SERVICE_ID,
            CONFIG.EMAILJS_TEMPLATE_ID,
            formData
        )
        .then(function(response) {
            console.log('✅ Email sent successfully!', response.status, response.text);
            showNotification('✅ Uspešno! Vaš upit je poslat. Kontaktiraćemo vas uskoro!', 'success');
            form.reset(); // Clear form
            setButtonLoading(submitButton, false);
        })
        .catch(function(error) {
            console.error('❌ Email sending failed:', error);
            showNotification('❌ Greška! Pokušajte ponovo ili nas pozovite direktno.', 'danger');
            setButtonLoading(submitButton, false);
        });
    }

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        initEmailJS();
        
        // Find and attach event listener to contact form
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', handleFormSubmit);
            console.log('✅ Contact form event listener attached');
        } else {
            console.warn('⚠️ Contact form not found on this page');
        }
    });

})();
