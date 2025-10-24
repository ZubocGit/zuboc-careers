// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Testimonials Carousel
class TestimonialCarousel {
    constructor() {
        this.currentIndex = 0;
        this.testimonials = document.querySelectorAll('.testimonial-item');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        
        this.init();
    }
    
    init() {
        if (this.testimonials.length === 0) return;
        
        this.showTestimonial(0);
        
        this.prevBtn.addEventListener('click', () => this.previousTestimonial());
        this.nextBtn.addEventListener('click', () => this.nextTestimonial());
        
        // Auto-rotate testimonials every 5 seconds
        setInterval(() => this.nextTestimonial(), 5000);
    }
    
    showTestimonial(index) {
        this.testimonials.forEach((testimonial, i) => {
            testimonial.classList.toggle('active', i === index);
        });
    }
    
    nextTestimonial() {
        this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
        this.showTestimonial(this.currentIndex);
    }
    
    previousTestimonial() {
        this.currentIndex = (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
        this.showTestimonial(this.currentIndex);
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 248, 243, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 248, 243, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    // Add scroll animations to sections
    const animatedElements = document.querySelectorAll('.value-item, .position-card, .benefit-item, .process-step');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Newsletter form submission
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value.trim();
        const button = newsletterForm.querySelector('button');
        const originalText = button.textContent;
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        // Show loading state
        button.textContent = 'Subscribing...';
        button.disabled = true;
        
        try {
            // Send email to webhook
            const response = await fetch('https://n8n.srv1052463.hstgr.cloud/webhook-test/email_collecting', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    timestamp: new Date().toISOString(),
                    source: 'zuboc-career-newsletter'
                })
            });
            
            if (response.ok) {
                // Show success message
                button.textContent = 'Subscribed!';
                button.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.background = 'linear-gradient(135deg, var(--rose-gold), var(--dusty-rose))';
                    button.disabled = false;
                    newsletterForm.reset();
                }, 3000);
            } else {
                throw new Error(`Subscription failed: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error('Newsletter subscription error:', error);
            alert('There was an error subscribing to our newsletter. Please try again.');
            button.textContent = originalText;
            button.disabled = false;
        }
    });
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Job positions data
const jobPositions = {
    'creative-specialist': {
        id: 'creative-specialist',
        title: 'Creative Specialist',
        department: 'Design',
        type: 'Full-time',
        location: 'Malappuram, Kerala (On-site)'
    },
    'creative-head': {
        id: 'creative-head',
        title: 'Creative Head',
        department: 'Creative',
        type: 'Full-time',
        location: 'Malappuram, Kerala (On-site)'
    },
    'business-development-executive': {
        id: 'business-development-executive',
        title: 'Business Development Executive',
        department: 'Business Development',
        type: 'Full-time',
        location: 'Malappuram, Kerala (On-site)'
    }
};

// Application Modal Functionality
class ApplicationModal {
    constructor() {
        this.modal = document.getElementById('apply-modal');
        this.form = document.getElementById('apply-form');
        this.roleIdInput = document.getElementById('apply-role-id');
        this.roleSelect = document.getElementById('apply-role-select');
        this.titleElement = document.getElementById('apply-title');
        this.toast = document.getElementById('toast');
        
        this.init();
    }
    
    init() {
        if (!this.modal || !this.form) return;
        
        // Bind close buttons
        document.querySelectorAll('[data-close]').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });
        
        // Close modal when clicking outside
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.hasAttribute('open')) {
                this.closeModal();
            }
        });
        
        // Handle form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Populate role dropdown
        this.populateRoles();

        // Initialize file upload
        this.initFileUpload();

        // Bind apply buttons
        document.querySelectorAll('[data-apply]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const roleId = e.target.getAttribute('data-apply');
                this.openModal(roleId);
            });
        });
    }
    
    populateRoles() {
        if (!this.roleSelect) return;
        const options = Object.values(jobPositions).map(r => {
            const opt = document.createElement('option');
            opt.value = r.id;
            opt.textContent = r.title;
            return opt;
        });
        // Remove any old dynamic options
        while (this.roleSelect.options.length > 1) this.roleSelect.remove(1);
        options.forEach(opt => this.roleSelect.appendChild(opt));
    }

    openModal(roleId) {
        const role = jobPositions[roleId];
        if (!role) return;
        
        this.roleIdInput.value = role.id;
        this.titleElement.textContent = `Apply for ${role.title}`;
        if (this.roleSelect) {
            this.roleSelect.value = role.id;
        }
        this.modal.showModal();
        
        // Focus on first input after modal opens
        setTimeout(() => {
            const firstInput = this.form.querySelector('input[required]');
            if (firstInput) firstInput.focus();
        }, 100);
    }
    
    closeModal() {
        this.modal.close();
        this.form.reset();
        this.clearErrors();
    }
    
    setFieldError(inputEl, message) {
        const errorEl = document.querySelector(`[data-error-for="${inputEl.id}"]`);
        if (errorEl) {
            errorEl.textContent = message || '';
        }
        inputEl.setAttribute('aria-invalid', message ? 'true' : 'false');
    }
    
    clearErrors() {
        document.querySelectorAll('.error').forEach(el => {
            el.textContent = '';
        });
        document.querySelectorAll('[aria-invalid]').forEach(el => {
            el.removeAttribute('aria-invalid');
        });
    }
    
    validateForm() {
        let isValid = true;
        
        // Validate name
        const nameInput = document.getElementById('apply-name');
        const name = nameInput.value.trim();
        if (!name) {
            this.setFieldError(nameInput, 'Please enter your full name');
            isValid = false;
        } else {
            this.setFieldError(nameInput, '');
        }
        
        // Validate email
        const emailInput = document.getElementById('apply-email');
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            this.setFieldError(emailInput, 'Please enter a valid email address');
            isValid = false;
        } else {
            this.setFieldError(emailInput, '');
        }
        
        // Validate CV file
        const cvInput = document.getElementById('apply-cv');
        const cvFile = cvInput.files && cvInput.files[0];
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
        const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt'];
        
        if (!cvFile) {
            this.setFieldError(cvInput, 'Please upload your resume');
            isValid = false;
        } else {
            const fileExtension = '.' + cvFile.name.split('.').pop().toLowerCase();
            const isValidType = allowedTypes.includes(cvFile.type) || allowedExtensions.includes(fileExtension);
            const isValidSize = cvFile.size <= 5 * 1024 * 1024; // 5MB limit
            
            if (!isValidType) {
                this.setFieldError(cvInput, 'Please upload a valid file (PDF, DOC, DOCX, or TXT)');
                isValid = false;
            } else if (!isValidSize) {
                this.setFieldError(cvInput, 'File size must be less than 5MB');
                isValid = false;
            } else {
                this.setFieldError(cvInput, '');
            }
        }

        // Validate phone number
        const phoneInput = document.getElementById('apply-phone');
        const phone = phoneInput.value.trim();
        const phoneRegex = /^[0-9]{10}$/; // 10 digits for Indian numbers
        if (!phone) {
            this.setFieldError(phoneInput, 'Please enter your phone number');
            isValid = false;
        } else if (!phoneRegex.test(phone)) {
            this.setFieldError(phoneInput, 'Please enter a valid 10-digit phone number');
            isValid = false;
        } else {
            this.setFieldError(phoneInput, '');
        }

        // Validate role select
        if (this.roleSelect) {
            if (!this.roleSelect.value) {
                this.setFieldError(this.roleSelect, 'Please select a position');
                isValid = false;
            } else {
                this.setFieldError(this.roleSelect, '');
            }
        }
        
        return isValid;
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) return;
        
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;
        
        try {
            const formData = new FormData(this.form);
            
            // Add additional metadata
            formData.append('timestamp', new Date().toISOString());
            formData.append('source', 'zuboc-career-page');
            // Ensure role id is consistent
            if (this.roleSelect && this.roleSelect.value) {
                formData.set('roleId', this.roleSelect.value);
                formData.set('role', this.roleSelect.options[this.roleSelect.selectedIndex].textContent);
            }

            // Submit to webhook
            const response = await fetch('https://n8n.srv1052463.hstgr.cloud/webhook/candidate-application', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                this.showToast('Application submitted successfully!', 'success');
                this.form.reset();
                // Clear file preview and show upload area again
                const filePreview = document.getElementById('file-preview');
                const uploadArea = document.getElementById('file-upload-area');
                if (filePreview && uploadArea) {
                    filePreview.style.display = 'none';
                    uploadArea.style.display = '';
                }
                this.closeModal();
            } else {
                const respText = await response.text().catch(() => '');
                throw new Error(`Submission failed (${response.status} ${response.statusText}) ${respText}`);
            }
        } catch (error) {
            console.error('Application submission error:', error);
            this.showToast('There was an error submitting your application. Please try again.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }
    
    showToast(message, type = 'success') {
        this.toast.textContent = message;
        this.toast.classList.add('show');
        if (type === 'success') {
            this.toast.style.background = 'var(--SUCCESS-GREEN, #30f783)';
        } else if (type === 'error') {
            this.toast.style.background = 'var(--ERROR-RED, #e74c3c)';
        } else {
            this.toast.style.background = '';
        }
        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 5000);
    }

    initFileUpload() {
        const fileInput = document.getElementById('apply-cv');
        const uploadArea = document.getElementById('file-upload-area');
        const filePreview = document.getElementById('file-preview');
        const removeFileBtn = document.getElementById('remove-file');

        if (!fileInput || !uploadArea) return;

        // File input change
        fileInput.addEventListener('change', (e) => {
            this.handleFileSelect(e.target.files[0]);
        });

        // Drag and drop events
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFileSelect(files[0]);
            }
        });

        // Remove file
        removeFileBtn.addEventListener('click', () => {
            fileInput.value = '';
            uploadArea.style.display = 'block';
            filePreview.style.display = 'none';
        });
    }

    handleFileSelect(file) {
        if (!file) return;

        const uploadArea = document.getElementById('file-upload-area');
        const filePreview = document.getElementById('file-preview');
        const fileName = document.querySelector('.file-name');
        const fileSize = document.querySelector('.file-size');

        // Update file input
        const fileInput = document.getElementById('apply-cv');
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;

        // Show preview
        fileName.textContent = file.name;
        fileSize.textContent = this.formatFileSize(file.size);
        
        uploadArea.style.display = 'none';
        filePreview.style.display = 'flex';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

}

// Multi-link field logic for application form
(function() {
  const linkFieldGroup = document.getElementById('apply-link-field-group');
  if (!linkFieldGroup) return;
  const multiInputs = linkFieldGroup.querySelector('.multi-link-inputs');
  const addBtn = document.getElementById('add-link-btn');

  function createLinkInput() {
    const wrapper = document.createElement('div');
    wrapper.className = 'link-input-wrapper';
    const input = document.createElement('input');
    input.type = 'url';
    input.name = 'link[]';
    input.placeholder = 'https://...';
    input.className = 'extra-link-input';
    input.required = false;
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'remove-link-btn';
    removeBtn.innerHTML = '<i class="fas fa-times"></i>';
    removeBtn.title = 'Remove this link';
    removeBtn.onclick = function() {
      wrapper.remove();
      updateResponsiveLinks();
    };
    wrapper.appendChild(input);
    wrapper.appendChild(removeBtn);
    return wrapper;
  }

  addBtn.addEventListener('click', function() {
    multiInputs.appendChild(createLinkInput());
    updateResponsiveLinks();
  });

  function updateResponsiveLinks() {
    // Add a class if more than 2 fields for responsive stacking
    if (multiInputs.children.length > 2) {
      multiInputs.classList.add('multi-link-stack');
    } else {
      multiInputs.classList.remove('multi-link-stack');
    }
  }
})();

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TestimonialCarousel();
    new ApplicationModal();
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Keyboard navigation for carousel
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        document.querySelector('.prev-btn')?.click();
    } else if (e.key === 'ArrowRight') {
        document.querySelector('.next-btn')?.click();
    }
});

// Touch/swipe support for testimonials
let touchStartX = 0;
let touchEndX = 0;

document.querySelector('.testimonials-carousel')?.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.querySelector('.testimonials-carousel')?.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next testimonial
            document.querySelector('.next-btn')?.click();
        } else {
            // Swipe right - previous testimonial
            document.querySelector('.prev-btn')?.click();
        }
    }
}

// Add hover effects to cards
document.querySelectorAll('.position-card, .benefit-item, .value-item').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Form validation for application buttons
document.querySelectorAll('.apply-button').forEach(button => {
    button.addEventListener('click', (e) => {
        // Add a subtle animation to the button
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    });
});

// Add scroll-to-top functionality
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: #55434b;
    border: none;
    border-radius: 50%;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 5px 20px rgba(85, 67, 75, 0.3);
`;

document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopBtn.style.opacity = '1';
        scrollToTopBtn.style.visibility = 'visible';
    } else {
        scrollToTopBtn.style.opacity = '0';
        scrollToTopBtn.style.visibility = 'hidden';
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Add CSS for scroll-to-top button
const style = document.createElement('style');
style.textContent = `
    .scroll-to-top:hover {
        transform: translateY(-3px) !important;
        box-shadow: 0 8px 25px rgba(212, 165, 116, 0.4) !important;
    }
`;
document.head.appendChild(style);
