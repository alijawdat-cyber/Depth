/**
 * ========================================
 * DEPTH PLATFORM - PROFESSIONAL INTERACTIVE COMPONENTS V3.0
 * ========================================
 * @author Depth Agency Development Team
 * @version 3.0.0
 * @description Complete interactive system for UI mockups
 */

// Namespace for all Depth components
const DepthUI = (() => {
    'use strict';

    // === CONFIGURATION ===
    const config = {
        animations: {
            duration: 300,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        },
        breakpoints: {
            mobile: 480,
            tablet: 768,
            desktop: 1024
        },
        locale: 'ar-IQ',
        currency: 'IQD',
        dateFormat: 'DD/MM/YYYY'
    };

    // === UTILITY FUNCTIONS ===
    const utils = {
        // Debounce function for performance
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // Throttle function
        throttle(func, limit) {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        // Format currency
        formatCurrency(amount, currency = config.currency) {
            return new Intl.NumberFormat(config.locale, {
                style: 'currency',
                currency: currency,
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(amount);
        },

        // Format date
        formatDate(date, format = config.dateFormat) {
            const d = new Date(date);
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            
            return format
                .replace('DD', day)
                .replace('MM', month)
                .replace('YYYY', year);
        },

        // Generate unique ID
        generateId() {
            return `depth-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        },

        // Animate value
        animateValue(element, start, end, duration = 1000) {
            const startTime = performance.now();
            
            const updateValue = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const current = Math.floor(start + (end - start) * easeOutQuart);
                
                element.textContent = this.formatNumber(current);
                
                if (progress < 1) {
                    requestAnimationFrame(updateValue);
                }
            };
            
            requestAnimationFrame(updateValue);
        },

        // Format number with locale
        formatNumber(num) {
            return new Intl.NumberFormat(config.locale).format(num);
        },

        // Check if element is in viewport
        isInViewport(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        },

        // Copy to clipboard
        async copyToClipboard(text) {
            try {
                await navigator.clipboard.writeText(text);
                return true;
            } catch (err) {
                console.error('Failed to copy:', err);
                return false;
            }
        }
    };

    // === THEME MANAGER ===
    class ThemeManager {
        constructor() {
            this.currentTheme = localStorage.getItem('depth-theme') || 'light';
            this.init();
        }

        init() {
            this.applyTheme(this.currentTheme);
            this.setupToggle();
            this.watchSystemPreference();
        }

        applyTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            this.currentTheme = theme;
            localStorage.setItem('depth-theme', theme);
            this.updateToggleButtons();
        }

        toggle() {
            const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
            this.applyTheme(newTheme);
        }

        setupToggle() {
            document.querySelectorAll('[data-theme-toggle]').forEach(button => {
                button.addEventListener('click', () => this.toggle());
            });
        }

        updateToggleButtons() {
            document.querySelectorAll('[data-theme-toggle]').forEach(button => {
                const icon = button.querySelector('.theme-icon');
                if (icon) {
                    icon.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
                }
            });
        }

        watchSystemPreference() {
            if (window.matchMedia) {
                const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
                darkModeQuery.addEventListener('change', (e) => {
                    if (!localStorage.getItem('depth-theme')) {
                        this.applyTheme(e.matches ? 'dark' : 'light');
                    }
                });
            }
        }
    }

    // === OTP INPUT COMPONENT ===
    class OTPInput {
        constructor(container) {
            this.container = container;
            this.inputs = container.querySelectorAll('.otp-input');
            this.submitBtn = container.querySelector('[data-otp-submit]');
            this.resendBtn = container.querySelector('[data-otp-resend]');
            this.timerElement = container.querySelector('[data-otp-timer]');
            this.timer = null;
            this.timeLeft = 60;
            
            this.init();
        }

        init() {
            this.setupInputs();
            this.setupButtons();
            this.startTimer();
            this.addKeyboardShortcuts();
        }

        setupInputs() {
            this.inputs.forEach((input, index) => {
                // Set attributes
                input.setAttribute('inputmode', 'numeric');
                input.setAttribute('maxlength', '1');
                input.setAttribute('pattern', '[0-9]');
                input.setAttribute('autocomplete', 'one-time-code');
                
                // Input event
                input.addEventListener('input', (e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    e.target.value = value.slice(-1);
                    
                    if (value) {
                        input.classList.add('filled');
                        if (index < this.inputs.length - 1) {
                            this.inputs[index + 1].focus();
                        }
                    } else {
                        input.classList.remove('filled');
                    }
                    
                    this.checkComplete();
                });

                // Keydown event
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Backspace' && !input.value && index > 0) {
                        this.inputs[index - 1].focus();
                        this.inputs[index - 1].value = '';
                        this.inputs[index - 1].classList.remove('filled');
                    } else if (e.key === 'ArrowLeft' && index > 0) {
                        this.inputs[index - 1].focus();
                    } else if (e.key === 'ArrowRight' && index < this.inputs.length - 1) {
                        this.inputs[index + 1].focus();
                    }
                });

                // Paste event
                input.addEventListener('paste', (e) => {
                    e.preventDefault();
                    const pasteData = (e.clipboardData || window.clipboardData).getData('text');
                    const digits = pasteData.replace(/\D/g, '').slice(0, this.inputs.length);
                    
                    digits.split('').forEach((digit, i) => {
                        if (this.inputs[i]) {
                            this.inputs[i].value = digit;
                            this.inputs[i].classList.add('filled');
                        }
                    });
                    
                    const lastFilledIndex = Math.min(digits.length, this.inputs.length) - 1;
                    if (this.inputs[lastFilledIndex]) {
                        this.inputs[lastFilledIndex].focus();
                    }
                    
                    this.checkComplete();
                });

                // Focus effects
                input.addEventListener('focus', () => {
                    input.select();
                });
            });
        }

        setupButtons() {
            if (this.submitBtn) {
                this.submitBtn.addEventListener('click', () => this.handleSubmit());
            }

            if (this.resendBtn) {
                this.resendBtn.addEventListener('click', () => this.handleResend());
            }
        }

        startTimer() {
            if (!this.timerElement) return;
            
            this.timeLeft = parseInt(this.timerElement.dataset.seconds || '60');
            this.updateTimer();
            
            this.timer = setInterval(() => {
                this.timeLeft--;
                this.updateTimer();
                
                if (this.timeLeft <= 0) {
                    this.stopTimer();
                }
            }, 1000);
        }

        updateTimer() {
            if (this.timerElement) {
                const minutes = Math.floor(this.timeLeft / 60);
                const seconds = this.timeLeft % 60;
                const display = minutes > 0 
                    ? `${minutes}:${seconds.toString().padStart(2, '0')}` 
                    : `${seconds} ثانية`;
                this.timerElement.textContent = display;
            }
        }

        stopTimer() {
            clearInterval(this.timer);
            this.timer = null;
            
            if (this.resendBtn) {
                this.resendBtn.disabled = false;
                this.resendBtn.classList.remove('disabled');
            }
        }

        checkComplete() {
            const isComplete = Array.from(this.inputs).every(input => input.value);
            
            if (this.submitBtn) {
                this.submitBtn.disabled = !isComplete;
                this.submitBtn.classList.toggle('btn-primary', isComplete);
                this.submitBtn.classList.toggle('btn-secondary', !isComplete);
            }

            if (isComplete) {
                this.animateSuccess();
            }
        }

        animateSuccess() {
            this.inputs.forEach((input, index) => {
                setTimeout(() => {
                    input.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        input.style.transform = 'scale(1)';
                    }, 150);
                }, index * 50);
            });
        }

        handleSubmit() {
            const code = Array.from(this.inputs).map(input => input.value).join('');
            
            // Show loading state
            if (this.submitBtn) {
                const originalText = this.submitBtn.textContent;
                this.submitBtn.innerHTML = '<span class="spinner spinner-sm"></span> جاري التحقق...';
                this.submitBtn.disabled = true;

                // Simulate API call
                setTimeout(() => {
                    this.showToast('تم التحقق بنجاح!', 'success');
                    this.submitBtn.innerHTML = originalText;
                    
                    // Trigger custom event
                    this.container.dispatchEvent(new CustomEvent('otp-verified', {
                        detail: { code }
                    }));
                }, 2000);
            }
        }

        handleResend() {
            if (this.resendBtn) {
                this.resendBtn.disabled = true;
                this.resendBtn.classList.add('disabled');
            }

            // Clear inputs
            this.inputs.forEach(input => {
                input.value = '';
                input.classList.remove('filled');
            });
            this.inputs[0].focus();

            // Restart timer
            this.timeLeft = 60;
            this.startTimer();

            this.showToast('تم إرسال الرمز مرة أخرى', 'info');
        }

        addKeyboardShortcuts() {
            document.addEventListener('keydown', (e) => {
                // Ctrl/Cmd + Enter to submit
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    const isComplete = Array.from(this.inputs).every(input => input.value);
                    if (isComplete) {
                        this.handleSubmit();
                    }
                }
            });
        }

        showToast(message, type = 'info') {
            ToastManager.show(message, type);
        }
    }

    // === GALLERY COMPONENT ===
    class Gallery {
        constructor(container) {
            this.container = container;
            this.mainImage = container.querySelector('.gallery-image');
            this.thumbnails = container.querySelectorAll('.gallery-thumb');
            this.prevBtn = container.querySelector('[data-gallery-prev]');
            this.nextBtn = container.querySelector('[data-gallery-next]');
            this.counter = container.querySelector('.gallery-counter');
            this.fullscreenBtn = container.querySelector('[data-gallery-fullscreen]');
            this.downloadBtn = container.querySelector('[data-gallery-download]');
            
            this.currentIndex = 0;
            this.images = [];
            this.isFullscreen = false;
            
            this.init();
        }

        init() {
            this.loadImages();
            this.setupNavigation();
            this.setupThumbnails();
            this.setupKeyboardNavigation();
            this.setupTouchGestures();
            this.setupFullscreen();
            this.setupLazyLoading();
        }

        loadImages() {
            this.thumbnails.forEach((thumb, index) => {
                const img = thumb.querySelector('img');
                if (img) {
                    this.images.push({
                        thumb: img.src,
                        full: img.dataset.full || img.src,
                        title: img.alt || `صورة ${index + 1}`
                    });
                }
            });
        }

        setupNavigation() {
            if (this.prevBtn) {
                this.prevBtn.addEventListener('click', () => this.previous());
            }

            if (this.nextBtn) {
                this.nextBtn.addEventListener('click', () => this.next());
            }
        }

        setupThumbnails() {
            this.thumbnails.forEach((thumb, index) => {
                thumb.addEventListener('click', () => this.goTo(index));
            });
        }

        goTo(index) {
            if (index < 0 || index >= this.images.length) return;
            
            this.currentIndex = index;
            this.updateDisplay();
        }

        previous() {
            const newIndex = this.currentIndex > 0 
                ? this.currentIndex - 1 
                : this.images.length - 1;
            this.goTo(newIndex);
        }

        next() {
            const newIndex = this.currentIndex < this.images.length - 1 
                ? this.currentIndex + 1 
                : 0;
            this.goTo(newIndex);
        }

        updateDisplay() {
            // Update main image with transition
            if (this.mainImage && this.images[this.currentIndex]) {
                this.mainImage.style.opacity = '0';
                setTimeout(() => {
                    this.mainImage.src = this.images[this.currentIndex].full;
                    this.mainImage.alt = this.images[this.currentIndex].title;
                    this.mainImage.style.opacity = '1';
                }, 150);
            }

            // Update thumbnails
            this.thumbnails.forEach((thumb, index) => {
                thumb.classList.toggle('active', index === this.currentIndex);
            });

            // Update counter
            if (this.counter) {
                this.counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
            }

            // Update navigation buttons
            this.updateNavigationState();
        }

        updateNavigationState() {
            if (this.prevBtn) {
                this.prevBtn.disabled = false;
            }
            if (this.nextBtn) {
                this.nextBtn.disabled = false;
            }
        }

        setupKeyboardNavigation() {
            document.addEventListener('keydown', (e) => {
                if (!this.container.contains(document.activeElement)) return;
                
                switch(e.key) {
                    case 'ArrowLeft':
                        this.previous();
                        break;
                    case 'ArrowRight':
                        this.next();
                        break;
                    case 'Escape':
                        if (this.isFullscreen) {
                            this.exitFullscreen();
                        }
                        break;
                    case 'f':
                    case 'F':
                        this.toggleFullscreen();
                        break;
                }
            });
        }

        setupTouchGestures() {
            let touchStartX = 0;
            let touchEndX = 0;

            this.container.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            });

            this.container.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe();
            });

            const handleSwipe = () => {
                const swipeThreshold = 50;
                const diff = touchStartX - touchEndX;

                if (Math.abs(diff) > swipeThreshold) {
                    if (diff > 0) {
                        this.next(); // Swipe left
                    } else {
                        this.previous(); // Swipe right
                    }
                }
            };

            this.handleSwipe = handleSwipe;
        }

        setupFullscreen() {
            if (this.fullscreenBtn) {
                this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
            }
        }

        toggleFullscreen() {
            if (!this.isFullscreen) {
                this.enterFullscreen();
            } else {
                this.exitFullscreen();
            }
        }

        enterFullscreen() {
            const elem = this.container;
            
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            }
            
            this.isFullscreen = true;
            this.container.classList.add('fullscreen');
        }

        exitFullscreen() {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            
            this.isFullscreen = false;
            this.container.classList.remove('fullscreen');
        }

        setupLazyLoading() {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.dataset.src;
                        
                        if (src && !img.src) {
                            img.src = src;
                            img.classList.add('loaded');
                            observer.unobserve(img);
                        }
                    }
                });
            });

            this.thumbnails.forEach(thumb => {
                const img = thumb.querySelector('img[data-src]');
                if (img) {
                    imageObserver.observe(img);
                }
            });
        }
    }

    // === FORM VALIDATION ===
    class FormValidator {
        constructor(form) {
            this.form = form;
            this.fields = form.querySelectorAll('[data-validate]');
            this.submitBtn = form.querySelector('[type="submit"]');
            
            this.rules = {
                required: (value) => value.trim() !== '',
                email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
                phone: (value) => /^[\d\s\-\+\(\)]+$/.test(value) && value.replace(/\D/g, '').length >= 10,
                minLength: (value, min) => value.length >= min,
                maxLength: (value, max) => value.length <= max,
                pattern: (value, pattern) => new RegExp(pattern).test(value),
                match: (value, targetId) => value === document.getElementById(targetId)?.value
            };
            
            this.messages = {
                required: 'هذا الحقل مطلوب',
                email: 'يرجى إدخال بريد إلكتروني صحيح',
                phone: 'يرجى إدخال رقم هاتف صحيح',
                minLength: 'يجب أن يكون على الأقل {min} أحرف',
                maxLength: 'يجب أن لا يتجاوز {max} أحرف',
                pattern: 'القيمة المدخلة غير صحيحة',
                match: 'القيمتان غير متطابقتين'
            };
            
            this.init();
        }

        init() {
            this.setupValidation();
            this.setupSubmit();
        }

        setupValidation() {
            this.fields.forEach(field => {
                // Real-time validation
                field.addEventListener('blur', () => this.validateField(field));
                field.addEventListener('input', utils.debounce(() => {
                    if (field.classList.contains('error') || field.classList.contains('success')) {
                        this.validateField(field);
                    }
                }, 500));
            });
        }

        validateField(field) {
            const validations = field.dataset.validate.split(',');
            const value = field.value;
            let isValid = true;
            let errorMessage = '';

            for (const validation of validations) {
                const [rule, ...params] = validation.trim().split(':');
                
                if (this.rules[rule]) {
                    const ruleValid = this.rules[rule](value, ...params);
                    
                    if (!ruleValid) {
                        isValid = false;
                        errorMessage = this.messages[rule].replace('{min}', params[0]).replace('{max}', params[0]);
                        break;
                    }
                }
            }

            this.updateFieldState(field, isValid, errorMessage);
            return isValid;
        }

        updateFieldState(field, isValid, errorMessage) {
            const wrapper = field.closest('.form-group');
            const errorElement = wrapper?.querySelector('.form-error') || this.createErrorElement(field);

            if (isValid) {
                field.classList.remove('error');
                field.classList.add('success');
                errorElement.style.display = 'none';
            } else {
                field.classList.remove('success');
                field.classList.add('error');
                errorElement.textContent = errorMessage;
                errorElement.style.display = 'block';
            }
        }

        createErrorElement(field) {
            const error = document.createElement('div');
            error.className = 'form-error';
            error.style.color = 'var(--danger)';
            error.style.fontSize = '0.875rem';
            error.style.marginTop = '0.25rem';
            field.parentNode.appendChild(error);
            return error;
        }

        setupSubmit() {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                if (this.validateAll()) {
                    this.handleSubmit();
                }
            });
        }

        validateAll() {
            let isValid = true;
            
            this.fields.forEach(field => {
                if (!this.validateField(field)) {
                    isValid = false;
                }
            });
            
            return isValid;
        }

        handleSubmit() {
            // Show loading
            if (this.submitBtn) {
                const originalText = this.submitBtn.textContent;
                this.submitBtn.innerHTML = '<span class="spinner spinner-sm"></span> جاري الإرسال...';
                this.submitBtn.disabled = true;

                // Simulate API call
                setTimeout(() => {
                    this.submitBtn.innerHTML = originalText;
                    this.submitBtn.disabled = false;
                    
                    ToastManager.show('تم الإرسال بنجاح!', 'success');
                    this.form.reset();
                    
                    // Clear validation states
                    this.fields.forEach(field => {
                        field.classList.remove('success', 'error');
                    });
                }, 2000);
            }
        }
    }

    // === TOAST MANAGER ===
    class ToastManager {
        static container = null;
        static toasts = [];

        static init() {
            if (!this.container) {
                this.container = document.createElement('div');
                this.container.className = 'toast-container';
                document.body.appendChild(this.container);
            }
        }

        static show(message, type = 'info', duration = 3000) {
            this.init();
            
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.innerHTML = `
                <span class="toast-icon">${this.getIcon(type)}</span>
                <span class="toast-message">${message}</span>
                <button class="toast-close">×</button>
            `;
            
            this.container.appendChild(toast);
            
            // Animate in
            setTimeout(() => toast.classList.add('show'), 10);
            
            // Setup close button
            const closeBtn = toast.querySelector('.toast-close');
            closeBtn.addEventListener('click', () => this.remove(toast));
            
            // Auto remove
            const timeout = setTimeout(() => this.remove(toast), duration);
            
            this.toasts.push({ element: toast, timeout });
        }

        static remove(toast) {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
                this.toasts = this.toasts.filter(t => t.element !== toast);
            }, 300);
        }

        static getIcon(type) {
            const icons = {
                success: '✓',
                error: '✕',
                warning: '⚠',
                info: 'ℹ'
            };
            return icons[type] || icons.info;
        }

        static clear() {
            this.toasts.forEach(({ element, timeout }) => {
                clearTimeout(timeout);
                this.remove(element);
            });
        }
    }

    // === MODAL MANAGER ===
    class ModalManager {
        static modals = new Map();

        static create(options) {
            const {
                id = utils.generateId(),
                title = '',
                content = '',
                size = 'medium',
                closable = true,
                buttons = []
            } = options;

            const modal = document.createElement('div');
            modal.className = 'modal-overlay';
            modal.innerHTML = `
                <div class="modal-content modal-${size}">
                    <div class="modal-header">
                        <h3 class="modal-title">${title}</h3>
                        ${closable ? '<button class="modal-close">×</button>' : ''}
                    </div>
                    <div class="modal-body">${content}</div>
                    ${buttons.length ? `
                        <div class="modal-footer">
                            ${buttons.map(btn => `
                                <button class="btn ${btn.class || 'btn-secondary'}" data-action="${btn.action}">
                                    ${btn.text}
                                </button>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            `;

            document.body.appendChild(modal);
            
            // Setup events
            if (closable) {
                const closeBtn = modal.querySelector('.modal-close');
                closeBtn.addEventListener('click', () => this.close(id));
                
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        this.close(id);
                    }
                });
            }

            // Setup button actions
            buttons.forEach(btn => {
                const button = modal.querySelector(`[data-action="${btn.action}"]`);
                if (button && btn.handler) {
                    button.addEventListener('click', btn.handler);
                }
            });

            this.modals.set(id, modal);
            
            // Animate in
            setTimeout(() => modal.classList.add('show'), 10);
            
            return id;
        }

        static close(id) {
            const modal = this.modals.get(id);
            if (modal) {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.remove();
                    this.modals.delete(id);
                }, 300);
            }
        }

        static closeAll() {
            this.modals.forEach((modal, id) => this.close(id));
        }
    }

    // === DATA TABLE ===
    class DataTable {
        constructor(container, options = {}) {
            this.container = container;
            this.options = {
                searchable: true,
                sortable: true,
                paginated: true,
                pageSize: 10,
                ...options
            };
            
            this.data = [];
            this.filteredData = [];
            this.currentPage = 1;
            this.sortColumn = null;
            this.sortDirection = 'asc';
            
            this.init();
        }

        init() {
            this.loadData();
            this.render();
            this.setupSearch();
            this.setupSort();
            this.setupPagination();
        }

        loadData() {
            // Load data from table or options
            const table = this.container.querySelector('table');
            if (table) {
                const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent);
                const rows = Array.from(table.querySelectorAll('tbody tr')).map(tr => {
                    return Array.from(tr.querySelectorAll('td')).map(td => td.textContent);
                });
                
                this.data = rows.map(row => {
                    const obj = {};
                    headers.forEach((header, index) => {
                        obj[header] = row[index];
                    });
                    return obj;
                });
            } else if (this.options.data) {
                this.data = this.options.data;
            }
            
            this.filteredData = [...this.data];
        }

        render() {
            // Render will be implemented based on the current state
            this.updateDisplay();
        }

        setupSearch() {
            if (!this.options.searchable) return;
            
            const searchInput = this.container.querySelector('[data-table-search]');
            if (searchInput) {
                searchInput.addEventListener('input', utils.debounce((e) => {
                    this.search(e.target.value);
                }, 300));
            }
        }

        search(query) {
            if (!query) {
                this.filteredData = [...this.data];
            } else {
                const lowerQuery = query.toLowerCase();
                this.filteredData = this.data.filter(row => {
                    return Object.values(row).some(value => 
                        String(value).toLowerCase().includes(lowerQuery)
                    );
                });
            }
            
            this.currentPage = 1;
            this.updateDisplay();
        }

        setupSort() {
            if (!this.options.sortable) return;
            
            const headers = this.container.querySelectorAll('th[data-sortable]');
            headers.forEach(header => {
                header.style.cursor = 'pointer';
                header.addEventListener('click', () => {
                    const column = header.dataset.column;
                    this.sort(column);
                });
            });
        }

        sort(column) {
            if (this.sortColumn === column) {
                this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                this.sortColumn = column;
                this.sortDirection = 'asc';
            }
            
            this.filteredData.sort((a, b) => {
                const aVal = a[column];
                const bVal = b[column];
                
                if (this.sortDirection === 'asc') {
                    return aVal > bVal ? 1 : -1;
                } else {
                    return aVal < bVal ? 1 : -1;
                }
            });
            
            this.updateDisplay();
        }

        setupPagination() {
            if (!this.options.paginated) return;
            
            const prevBtn = this.container.querySelector('[data-table-prev]');
            const nextBtn = this.container.querySelector('[data-table-next]');
            
            if (prevBtn) {
                prevBtn.addEventListener('click', () => this.previousPage());
            }
            
            if (nextBtn) {
                nextBtn.addEventListener('click', () => this.nextPage());
            }
        }

        previousPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.updateDisplay();
            }
        }

        nextPage() {
            const totalPages = Math.ceil(this.filteredData.length / this.options.pageSize);
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.updateDisplay();
            }
        }

        updateDisplay() {
            // Update table body with current page data
            const tbody = this.container.querySelector('tbody');
            if (!tbody) return;
            
            const start = (this.currentPage - 1) * this.options.pageSize;
            const end = start + this.options.pageSize;
            const pageData = this.filteredData.slice(start, end);
            
            // Clear and populate tbody
            tbody.innerHTML = '';
            pageData.forEach(row => {
                const tr = document.createElement('tr');
                Object.values(row).forEach(value => {
                    const td = document.createElement('td');
                    td.textContent = value;
                    tr.appendChild(td);
                });
                tbody.appendChild(tr);
            });
            
            // Update pagination info
            this.updatePaginationInfo();
        }

        updatePaginationInfo() {
            const info = this.container.querySelector('[data-table-info]');
            if (info) {
                const total = this.filteredData.length;
                const start = (this.currentPage - 1) * this.options.pageSize + 1;
                const end = Math.min(start + this.options.pageSize - 1, total);
                
                info.textContent = `عرض ${start} إلى ${end} من ${total} سجل`;
            }
        }
    }

    // === INITIALIZATION ===
    const init = () => {
        // Initialize theme manager
        new ThemeManager();

        // Initialize OTP inputs
        document.querySelectorAll('.otp-container').forEach(container => {
            new OTPInput(container);
        });

        // Initialize galleries
        document.querySelectorAll('.gallery-container').forEach(container => {
            new Gallery(container);
        });

        // Initialize forms
        document.querySelectorAll('form[data-validate]').forEach(form => {
            new FormValidator(form);
        });

        // Initialize data tables
        document.querySelectorAll('[data-table]').forEach(table => {
            new DataTable(table);
        });

        // Setup smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Setup lazy loading for images
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });

        // Setup animation on scroll
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    animationObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('[data-animate]').forEach(element => {
            animationObserver.observe(element);
        });

        // Setup tooltips
        document.querySelectorAll('[data-tooltip]').forEach(element => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = element.dataset.tooltip;
            
            element.addEventListener('mouseenter', () => {
                document.body.appendChild(tooltip);
                const rect = element.getBoundingClientRect();
                tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
                tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
                tooltip.classList.add('show');
            });
            
            element.addEventListener('mouseleave', () => {
                tooltip.classList.remove('show');
                setTimeout(() => tooltip.remove(), 300);
            });
        });

        console.log('✅ DepthUI initialized successfully');
    };

    // Auto-initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Public API
    return {
        utils,
        ThemeManager,
        OTPInput,
        Gallery,
        FormValidator,
        ToastManager,
        ModalManager,
        DataTable,
        init
    };
})();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DepthUI;
}