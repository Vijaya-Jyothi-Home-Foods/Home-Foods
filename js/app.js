/**
 * Main Application Controller
 * Handles app initialization, navigation, and global functionality
 */

// Application state
const App = {
    isInitialized: false,
    isLoading: false,
    currentSection: 'home'
};

/**
 * Initialize the application
 */
function initializeApp() {
    if (App.isInitialized) return;
    
    console.log('Initializing Vijaya Jyothi Home Foods App...');
    
    try {
        // Initialize products
        initializeProducts();
        
        // Initialize cart
        initializeCart();
        
        // Set up event listeners
        setupEventListeners();
        
        // Load initial data
        loadInitialData();
        
        App.isInitialized = true;
        console.log('App initialized successfully');
        
    } catch (error) {
        console.error('Failed to initialize app:', error);
        showErrorToast('Failed to initialize application. Please refresh the page.');
    }
}

/**
 * Set up global event listeners
 */
function setupEventListeners() {
    // Handle scroll events for header
    window.addEventListener('scroll', handleScroll);
    
    // Handle resize events
    window.addEventListener('resize', handleResize);
    
    // Handle keyboard navigation
    document.addEventListener('keydown', handleKeyDown);
    
    // Handle visibility change (for localStorage sync)
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Handle online/offline status
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
}

/**
 * Load initial application data
 */
async function loadInitialData() {
    try {
        App.isLoading = true;
        showLoadingState();
        
        // Load products (this will handle empty state)
        await loadProducts();
        
        // Load cart from localStorage
        loadCartFromStorage();
        
    } catch (error) {
        console.error('Failed to load initial data:', error);
        showErrorState('Failed to load application data');
    } finally {
        App.isLoading = false;
        hideLoadingState();
    }
}

/**
 * Handle scroll events
 */
function handleScroll() {
    const header = document.querySelector('.header');
    const scrollY = window.scrollY;
    
    if (scrollY > 50) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
}

/**
 * Handle window resize events
 */
function handleResize() {
    // Close cart on mobile orientation change
    if (window.innerWidth > 768 && isCartOpen()) {
        // Keep cart open on desktop
    } else if (window.innerWidth <= 480) {
        // Adjust cart width on very small screens
        const cartSidebar = document.getElementById('cart-sidebar');
        if (cartSidebar) {
            cartSidebar.style.maxWidth = '100%';
        }
    }
}

/**
 * Handle keyboard navigation
 */
function handleKeyDown(event) {
    // Close cart with Escape key
    if (event.key === 'Escape' && isCartOpen()) {
        closeCart();
        return;
    }
    
    // Scroll to sections with number keys
    if (event.key >= '1' && event.key <= '3' && !event.ctrlKey && !event.altKey) {
        const sections = ['products', 'about', 'contact'];
        const sectionIndex = parseInt(event.key) - 1;
        if (sections[sectionIndex]) {
            scrollToSection(sections[sectionIndex]);
        }
    }
}

/**
 * Handle visibility change (tab switching)
 */
function handleVisibilityChange() {
    if (!document.hidden) {
        // Tab became visible - sync cart data
        loadCartFromStorage();
        updateCartDisplay();
    }
}

/**
 * Handle online/offline status
 */
function handleOnlineStatus() {
    const isOnline = navigator.onLine;
    
    if (isOnline) {
        showSuccessToast('Connection restored');
        // Retry loading if there was an error
        if (document.getElementById('error').style.display !== 'none') {
            loadProducts();
        }
    } else {
        showErrorToast('You are offline. Some features may not work.');
    }
}

/**
 * Scroll to a specific section
 */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = section.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        App.currentSection = sectionId;
    }
}

/**
 * Show loading state
 */
function showLoadingState() {
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const empty = document.getElementById('empty');
    const productsGrid = document.getElementById('products-grid');
    
    if (loading) loading.style.display = 'flex';
    if (error) error.style.display = 'none';
    if (empty) empty.style.display = 'none';
    if (productsGrid) productsGrid.style.display = 'none';
}

/**
 * Hide loading state
 */
function hideLoadingState() {
    const loading = document.getElementById('loading');
    if (loading) loading.style.display = 'none';
}

/**
 * Show error state
 */
function showErrorState(message = 'An error occurred') {
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const empty = document.getElementById('empty');
    const productsGrid = document.getElementById('products-grid');
    
    if (loading) loading.style.display = 'none';
    if (error) {
        error.style.display = 'flex';
        const errorText = error.querySelector('p');
        if (errorText) errorText.textContent = message;
    }
    if (empty) empty.style.display = 'none';
    if (productsGrid) productsGrid.style.display = 'none';
}

/**
 * Show empty state
 */
function showEmptyState() {
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const empty = document.getElementById('empty');
    const productsGrid = document.getElementById('products-grid');
    
    if (loading) loading.style.display = 'none';
    if (error) error.style.display = 'none';
    if (empty) empty.style.display = 'flex';
    if (productsGrid) productsGrid.style.display = 'none';
}

/**
 * Show products grid
 */
function showProductsGrid() {
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const empty = document.getElementById('empty');
    const productsGrid = document.getElementById('products-grid');
    
    if (loading) loading.style.display = 'none';
    if (error) error.style.display = 'none';
    if (empty) empty.style.display = 'none';
    if (productsGrid) productsGrid.style.display = 'grid';
}

/**
 * Toast notification system
 */
function showToast(message, type = 'info', duration = 3000) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas ${getToastIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove toast
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toastContainer.removeChild(toast);
                }
            }, 300);
        }
    }, duration);
    
    // Allow manual dismissal
    toast.addEventListener('click', () => {
        if (toast.parentNode) {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toastContainer.removeChild(toast);
                }
            }, 300);
        }
    });
}

function showSuccessToast(message, duration = 3000) {
    showToast(message, 'success', duration);
}

function showErrorToast(message, duration = 5000) {
    showToast(message, 'error', duration);
}

function getToastIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

/**
 * Utility functions
 */
function formatCurrency(amount) {
    return `₹${amount.toLocaleString('en-IN')}`;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Error boundary
 */
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    
    if (!App.isInitialized) {
        showErrorToast('Application failed to load. Please refresh the page.');
    }
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    // Don't show toast for every promise rejection, but log it
    if (event.reason && event.reason.message) {
        console.error('Promise rejection details:', event.reason.message);
    }
});

/**
 * Performance monitoring
 */
function measurePerformance(name, fn) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
    return result;
}

/**
 * Initialize app when DOM is ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Export for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        App,
        initializeApp,
        scrollToSection,
        showToast,
        showSuccessToast,
        showErrorToast,
        formatCurrency,
        debounce,
        throttle
    };
}
