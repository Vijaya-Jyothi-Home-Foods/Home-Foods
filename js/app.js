// Application state
const App = {
  isInitialized: false,
  isLoading: false,
  currentSection: 'home'
};

// Initialize the application
function initializeApp() {
  if (App.isInitialized) return;

  console.log("Initializing Vijaya Jyothi Home Foods App...");

  try {
    initializeProducts();
    initializeCart();
    setupEventListeners();
    loadInitialData();
    setupContactModal(); // 👈 Added contact modal support
    App.isInitialized = true;
    console.log("App initialized successfully");
  } catch (error) {
    console.error("Failed to initialize app:", error);
    showErrorToast("Failed to initialize application. Please refresh the page.");
  }
}

// Set up global event listeners
function setupEventListeners() {
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', handleResize);
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('online', handleOnlineStatus);
  window.addEventListener('offline', handleOnlineStatus);
}

// Load initial data
async function loadInitialData() {
  try {
    App.isLoading = true;
    showLoadingState();
    await loadProducts();
    loadCartFromStorage();
  } catch (error) {
    console.error("Failed to load initial data:", error);
    showErrorState("Failed to load application data");
  } finally {
    App.isLoading = false;
    hideLoadingState();
  }
}

// Scroll handler
function handleScroll() {
  const header = document.querySelector('.header');
  if (window.scrollY > 50) {
    header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
    header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
  } else {
    header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    header.style.boxShadow = 'none';
  }
}

// Resize handler
function handleResize() {
  if (window.innerWidth <= 480) {
    const cartSidebar = document.getElementById('cart-sidebar');
    if (cartSidebar) {
      cartSidebar.style.maxWidth = '100%';
    }
  }
}

// Keyboard navigation
function handleKeyDown(event) {
  if (event.key === 'Escape' && isCartOpen()) {
    closeCart();
    return;
  }

  if (event.key >= '1' && event.key <= '3' && !event.ctrlKey && !event.altKey) {
    const key = parseInt(event.key);
    if (key === 3) {
      const modal = document.getElementById("contactModal");
      if (modal) modal.style.display = "block";
    } else {
      const sections = ['products', 'about'];
      const sectionIndex = key - 1;
      if (sections[sectionIndex]) {
        scrollToSection(sections[sectionIndex]);
      }
    }
  }
}

// Scroll to section
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    const headerHeight = document.querySelector('.header').offsetHeight;
    const targetPosition = section.offsetTop - headerHeight - 20;
    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    App.currentSection = sectionId;
  }
}

// Visibility change
function handleVisibilityChange() {
  if (!document.hidden) {
    loadCartFromStorage();
    updateCartDisplay();
  }
}

// Online/offline events
function handleOnlineStatus() {
  const isOnline = navigator.onLine;
  if (isOnline) {
    showSuccessToast('Connection restored');
    if (document.getElementById('error').style.display !== 'none') {
      loadProducts();
    }
  } else {
    showErrorToast('You are offline. Some features may not work.');
  }
}

// Loading UI
function showLoadingState() {
  document.getElementById('loading').style.display = 'flex';
  document.getElementById('error').style.display = 'none';
  document.getElementById('empty').style.display = 'none';
  document.getElementById('products-grid').style.display = 'none';
}

function hideLoadingState() {
  document.getElementById('loading').style.display = 'none';
}

function showErrorState(message = "An error occurred") {
  document.getElementById('loading').style.display = 'none';
  const error = document.getElementById('error');
  error.style.display = 'flex';
  const errorText = error.querySelector('p');
  if (errorText) errorText.textContent = message;
  document.getElementById('empty').style.display = 'none';
  document.getElementById('products-grid').style.display = 'none';
}

function showEmptyState() {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('error').style.display = 'none';
  document.getElementById('empty').style.display = 'flex';
  document.getElementById('products-grid').style.display = 'none';
}

function showProductsGrid() {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('error').style.display = 'none';
  document.getElementById('empty').style.display = 'none';
  document.getElementById('products-grid').style.display = 'grid';
}

// Toast
function showToast(message, type = 'info', duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div style="display: flex; align-items: center; gap: 0.5rem;">
      <i class="fas ${getToastIcon(type)}"></i>
      <span>${message}</span>
    </div>`;

  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (toast.parentNode) container.removeChild(toast);
      }, 300);
    }
  }, duration);

  toast.addEventListener('click', () => {
    if (toast.parentNode) {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (toast.parentNode) container.removeChild(toast);
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

// Utils
function formatCurrency(amount) {
  return `₹${amount.toLocaleString('en-IN')}`;
}

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Contact Modal Setup
function setupContactModal() {
  const modal = document.getElementById("contactModal");
  const btn = document.getElementById("contactBtn");
  const closeBtn = modal?.querySelector(".close");

  if (btn && modal && closeBtn) {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      modal.style.display = "block";
    });

    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  }
}

// Error boundary
window.addEventListener('error', (event) => {
  console.error("Global error:", event.error);
  if (!App.isInitialized) {
    showErrorToast("Application failed to load. Please refresh the page.");
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.error("Unhandled rejection:", event.reason);
});

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  initializeApp();
}

// Export for testing
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
