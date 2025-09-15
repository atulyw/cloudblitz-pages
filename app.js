// Home page navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling and enhanced interactions
    initializePage();
});

function initializePage() {
    // Add loading animation
    addLoadingAnimation();
    
    // Add card hover effects
    addCardEffects();
    
    // Add keyboard navigation
    addKeyboardNavigation();
}

function addLoadingAnimation() {
    const cards = document.querySelectorAll('.nav-card');
    const features = document.querySelector('.features');
    
    // Stagger the animation of cards
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // Animate features section
    setTimeout(() => {
        features.style.opacity = '0';
        features.style.transform = 'translateY(30px)';
        features.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            features.style.opacity = '1';
            features.style.transform = 'translateY(0)';
        }, 100);
    }, 600);
}

function addCardEffects() {
    const cards = document.querySelectorAll('.nav-card');
    
    cards.forEach(card => {
        // Add ripple effect on click
        card.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
        
        // Add focus styles for accessibility
        const button = card.querySelector('.nav-button');
        button.addEventListener('focus', function() {
            card.style.outline = '2px solid #667eea';
            card.style.outlineOffset = '4px';
        });
        
        button.addEventListener('blur', function() {
            card.style.outline = 'none';
        });
    });
}

function addKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // Allow Enter key to trigger navigation
        if (e.key === 'Enter') {
            const focusedElement = document.activeElement;
            if (focusedElement.classList.contains('nav-button')) {
                focusedElement.click();
            }
        }
        
        // Allow number keys for quick navigation
        if (e.key === '1') {
            navigateToEMI();
        } else if (e.key === '2') {
            navigateToTL();
        }
    });
}

// Navigation functions
function navigateToEMI() {
    // Add loading state
    const emiButton = document.querySelector('#emi-card .nav-button');
    const originalText = emiButton.innerHTML;
    
    emiButton.innerHTML = '<span>Loading...</span>';
    emiButton.disabled = true;
    
    // Add loading animation
    emiButton.style.background = 'linear-gradient(135deg, #4a5568, #2d3748)';
    
    // Simulate loading delay for better UX
    setTimeout(() => {
        window.location.href = './emi/';
    }, 500);
}

function navigateToTL() {
    // Add loading state
    const tlButton = document.querySelector('#tl-card .nav-button');
    const originalText = tlButton.innerHTML;
    
    tlButton.innerHTML = '<span>Loading...</span>';
    tlButton.disabled = true;
    
    // Add loading animation
    tlButton.style.background = 'linear-gradient(135deg, #4a5568, #2d3748)';
    
    // Simulate loading delay for better UX
    setTimeout(() => {
        window.location.href = './tl/';
    }, 500);
}

// Add ripple effect CSS
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .nav-card {
        position: relative;
        overflow: hidden;
    }
    
    .nav-button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;
document.head.appendChild(style);

// Add analytics tracking (optional)
function trackNavigation(platform) {
    // You can add analytics tracking here
    console.log(`User navigated to ${platform} platform`);
    
    // Example: Google Analytics
    // gtag('event', 'navigation', {
    //     'platform': platform,
    //     'page_title': 'Home Page'
    // });
}

// Enhanced navigation with tracking
function navigateToEMI() {
    trackNavigation('EMI');
    
    // Add loading state
    const emiButton = document.querySelector('#emi-card .nav-button');
    const originalText = emiButton.innerHTML;
    
    emiButton.innerHTML = '<span>Loading...</span>';
    emiButton.disabled = true;
    
    // Add loading animation
    emiButton.style.background = 'linear-gradient(135deg, #4a5568, #2d3748)';
    
    // Simulate loading delay for better UX
    setTimeout(() => {
        window.location.href = './emi/';
    }, 500);
}

function navigateToTL() {
    trackNavigation('TL');
    
    // Add loading state
    const tlButton = document.querySelector('#tl-card .nav-button');
    const originalText = tlButton.innerHTML;
    
    tlButton.innerHTML = '<span>Loading...</span>';
    tlButton.disabled = true;
    
    // Add loading animation
    tlButton.style.background = 'linear-gradient(135deg, #4a5568, #2d3748)';
    
    // Simulate loading delay for better UX
    setTimeout(() => {
        window.location.href = './tl/';
    }, 500);
}

// Add error handling for navigation
window.addEventListener('error', function(e) {
    console.error('Navigation error:', e);
    
    // Reset button states on error
    const buttons = document.querySelectorAll('.nav-button');
    buttons.forEach(button => {
        button.disabled = false;
        button.innerHTML = '<span>Enter Platform</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        button.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
    });
});

// Add service worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}
