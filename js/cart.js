/**
 * Cart Management System
 * Handles cart operations, localStorage persistence, and UI updates
 */

// Cart state
const Cart = {
    items: [],
    isOpen: false,
    isLoading: false
};

// Constants
const CART_STORAGE_KEY = 'vijaya_jyothi_cart';
const CART_VERSION = '1.0';

/**
 * Initialize cart system
 */
function initializeCart() {
    console.log('Initializing cart system...');
    
    try {
        loadCartFromStorage();
        updateCartDisplay();
        setupCartEventListeners();
        
        console.log('Cart system initialized successfully');
    } catch (error) {
        console.error('Failed to initialize cart:', error);
        Cart.items = [];
        updateCartDisplay();
    }
}

/**
 * Setup cart-specific event listeners
 */
function setupCartEventListeners() {
    // Close cart when clicking outside
    document.addEventListener('click', (event) => {
        const cartSidebar = document.getElementById('cart-sidebar');
        const floatingCart = document.getElementById('floating-cart');
        
        if (Cart.isOpen && 
            !cartSidebar.contains(event.target) && 
            !floatingCart.contains(event.target)) {
            // Don't close if clicking on product add-to-cart buttons
            if (!event.target.closest('.add-to-cart-btn, .quantity-selector')) {
                closeCart();
            }
        }
    });

    // Setup checkout modal event listeners
    setupCheckoutModalListeners();
}

/**
 * Add item to cart
 */
function addToCart(productId, quantity = 1) {
    try {
        const product = getProductById(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        
        if (quantity <= 0) {
            throw new Error('Invalid quantity');
        }
        
        // Check if item already exists in cart
        const existingItemIndex = Cart.items.findIndex(item => item.productId === productId);
        
        if (existingItemIndex > -1) {
            // Update existing item quantity
            Cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item to cart
            const cartItem = {
                productId: productId,
                name: product.name,
                price: product.price,
                weight: product.weight,
                image: product.image,
                quantity: quantity,
                addedAt: new Date().toISOString()
            };
            
            Cart.items.push(cartItem);
        }
        
        // Save to localStorage
        saveCartToStorage();
        
        // Update UI
        updateCartDisplay();
        updateFloatingCartBadge();
        
        // Show success message
        showSuccessToast(`${product.name} added to cart!`);
        
        // Add visual feedback to the add button
        const addButton = document.querySelector(`[data-product-id="${productId}"] .add-to-cart-btn`);
        if (addButton) {
            addButton.classList.add('added');
            addButton.innerHTML = '<i class="fas fa-check"></i> Added!';
            
            setTimeout(() => {
                addButton.classList.remove('added');
                addButton.innerHTML = '<i class="fas fa-cart-plus"></i> Add to Cart';
            }, 1500);
        }
        
        console.log('Item added to cart:', { productId, quantity });
        
    } catch (error) {
        console.error('Failed to add item to cart:', error);
        showErrorToast('Failed to add item to cart. Please try again.');
    }
}

/**
 * Remove item from cart
 */
function removeFromCart(productId) {
    try {
        const itemIndex = Cart.items.findIndex(item => item.productId === productId);
        
        if (itemIndex === -1) {
            throw new Error('Item not found in cart');
        }
        
        const removedItem = Cart.items[itemIndex];
        Cart.items.splice(itemIndex, 1);
        
        // Save to localStorage
        saveCartToStorage();
        
        // Update UI
        updateCartDisplay();
        updateFloatingCartBadge();
        
        // Show success message
        showSuccessToast(`${removedItem.name} removed from cart`);
        
        console.log('Item removed from cart:', productId);
        
    } catch (error) {
        console.error('Failed to remove item from cart:', error);
        showErrorToast('Failed to remove item from cart');
    }
}

/**
 * Update item quantity in cart
 */
function updateCartItemQuantity(productId, quantity) {
    try {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        
        const itemIndex = Cart.items.findIndex(item => item.productId === productId);
        
        if (itemIndex === -1) {
            throw new Error('Item not found in cart');
        }
        
        Cart.items[itemIndex].quantity = quantity;
        
        // Save to localStorage
        saveCartToStorage();
        
        // Update UI
        updateCartDisplay();
        updateFloatingCartBadge();
        
        console.log('Cart item quantity updated:', { productId, quantity });
        
    } catch (error) {
        console.error('Failed to update cart item quantity:', error);
        showErrorToast('Failed to update quantity');
    }
}

/**
 * Clear entire cart
 */
function clearCart() {
    try {
        Cart.items = [];
        
        // Save to localStorage
        saveCartToStorage();
        
        // Update UI
        updateCartDisplay();
        updateFloatingCartBadge();
        
        showSuccessToast('Cart cleared');
        
        console.log('Cart cleared');
        
    } catch (error) {
        console.error('Failed to clear cart:', error);
        showErrorToast('Failed to clear cart');
    }
}

/**
 * Get cart total amount
 */
function getCartTotal() {
    return Cart.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
}

/**
 * Get cart item count
 */
function getCartItemCount() {
    return Cart.items.reduce((count, item) => count + item.quantity, 0);
}

/**
 * Toggle cart sidebar
 */
function toggleCart() {
    if (Cart.isOpen) {
        closeCart();
    } else {
        openCart();
    }
}

/**
 * Open cart sidebar
 */
function openCart() {
    const cartOverlay = document.getElementById('cart-overlay');
    const cartSidebar = document.getElementById('cart-sidebar');
    
    if (cartOverlay && cartSidebar) {
        cartOverlay.classList.add('active');
        cartSidebar.classList.add('active');
        Cart.isOpen = true;
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Focus management for accessibility
        const firstFocusableElement = cartSidebar.querySelector('button, [tabindex]:not([tabindex="-1"])');
        if (firstFocusableElement) {
            firstFocusableElement.focus();
        }
    }
}

/**
 * Close cart sidebar
 */
function closeCart() {
    const cartOverlay = document.getElementById('cart-overlay');
    const cartSidebar = document.getElementById('cart-sidebar');
    
    if (cartOverlay && cartSidebar) {
        cartOverlay.classList.remove('active');
        cartSidebar.classList.remove('active');
        Cart.isOpen = false;
        
        // Restore body scroll
        document.body.style.overflow = '';
    }
}

/**
 * Check if cart is open
 */
function isCartOpen() {
    return Cart.isOpen;
}

/**
 * Update cart display in sidebar
 */
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSummary = document.getElementById('cart-summary');
    const emptyCart = document.getElementById('empty-cart');
    
    if (!cartItemsContainer || !cartSummary || !emptyCart) return;
    
    if (Cart.items.length === 0) {
        // Show empty cart state
        emptyCart.style.display = 'flex';
        cartSummary.style.display = 'none';
        cartItemsContainer.innerHTML = '';
    } else {
        // Show cart items
        emptyCart.style.display = 'none';
        cartSummary.style.display = 'block';
        
        // Render cart items
        cartItemsContainer.innerHTML = Cart.items.map(item => `
            <div class="cart-item" data-product-id="${item.productId}">
                <div class="cart-item-image">
                    ${item.image ? 
                        `<img src="${item.image}" alt="${item.name}" loading="lazy">` :
                        `<div class="cart-item-image-placeholder">
                            <i class="fas fa-candy-cane"></i>
                        </div>`
                    }
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <p class="cart-item-weight">${item.weight}</p>
                    <p class="cart-item-price">${formatCurrency(item.price * item.quantity)}</p>
                </div>
                <div class="cart-item-actions">
                    <div class="cart-item-quantity">
                        <button class="cart-quantity-btn" onclick="updateCartItemQuantity('${item.productId}', ${item.quantity - 1})" ${item.quantity <= 1 ? 'disabled' : ''}>
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="cart-quantity-display">${item.quantity}</span>
                        <button class="cart-quantity-btn" onclick="updateCartItemQuantity('${item.productId}', ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <button class="remove-item-btn" onclick="removeFromCart('${item.productId}')" title="Remove item">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        // Update cart summary
        updateCartSummary();
    }
}

/**
 * Update cart summary (totals)
 */
function updateCartSummary() {
    const subtotal = getCartTotal();
    const deliveryFee = subtotal >= 500 ? 0 : 50; // Free delivery over ₹500
    const total = subtotal + deliveryFee;
    
    const cartSubtotal = document.getElementById('cart-subtotal');
    const deliveryFeeElement = document.getElementById('delivery-fee');
    const cartTotal = document.getElementById('cart-total');
    
    if (cartSubtotal) cartSubtotal.textContent = formatCurrency(subtotal);
    if (deliveryFeeElement) {
        deliveryFeeElement.textContent = deliveryFee === 0 ? 'Free' : formatCurrency(deliveryFee);
    }
    if (cartTotal) cartTotal.textContent = formatCurrency(total);
}

/**
 * Update floating cart badge
 */
function updateFloatingCartBadge() {
    const cartCount = document.getElementById('cart-count');
    const itemCount = getCartItemCount();
    
    if (cartCount) {
        cartCount.textContent = itemCount;
        
        if (itemCount > 0) {
            cartCount.classList.add('show');
        } else {
            cartCount.classList.remove('show');
        }
    }
}

/**
 * Save cart to localStorage
 */
function saveCartToStorage() {
    try {
        const cartData = {
            version: CART_VERSION,
            items: Cart.items,
            savedAt: new Date().toISOString()
        };
        
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
        console.log('Cart saved to localStorage');
        
    } catch (error) {
        console.error('Failed to save cart to localStorage:', error);
        
        // Handle quota exceeded error
        if (error.name === 'QuotaExceededError') {
            showErrorToast('Storage is full. Some cart data may not be saved.');
        }
    }
}

/**
 * Load cart from localStorage
 */
function loadCartFromStorage() {
    try {
        const savedData = localStorage.getItem(CART_STORAGE_KEY);
        
        if (!savedData) {
            Cart.items = [];
            return;
        }
        
        const cartData = JSON.parse(savedData);
        
        // Version check for future compatibility
        if (cartData.version !== CART_VERSION) {
            console.warn('Cart data version mismatch, clearing cart');
            Cart.items = [];
            localStorage.removeItem(CART_STORAGE_KEY);
            return;
        }
        
        // Validate cart data
        if (Array.isArray(cartData.items)) {
            Cart.items = cartData.items.filter(item => 
                item.productId && 
                item.name && 
                typeof item.price === 'number' && 
                typeof item.quantity === 'number' && 
                item.quantity > 0
            );
        } else {
            Cart.items = [];
        }
        
        console.log('Cart loaded from localStorage:', Cart.items.length, 'items');
        
    } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
        Cart.items = [];
        
        // Clear corrupted data
        localStorage.removeItem(CART_STORAGE_KEY);
    }
}

/**
 * Get cart data for checkout or external use
 */
function getCartData() {
    return {
        items: [...Cart.items], // Return a copy
        itemCount: getCartItemCount(),
        subtotal: getCartTotal(),
        total: getCartTotal() + (getCartTotal() >= 500 ? 0 : 50)
    };
}

/**
 * Import cart data (for syncing or restoration)
 */
function importCartData(cartData) {
    try {
        if (cartData && Array.isArray(cartData.items)) {
            Cart.items = cartData.items.filter(item => 
                item.productId && 
                item.name && 
                typeof item.price === 'number' && 
                typeof item.quantity === 'number' && 
                item.quantity > 0
            );
            
            saveCartToStorage();
            updateCartDisplay();
            updateFloatingCartBadge();
            
            console.log('Cart data imported successfully');
        }
    } catch (error) {
        console.error('Failed to import cart data:', error);
    }
}

/**
 * Validate cart items against current products
 * (useful when products are updated)
 */
function validateCartItems() {
    const validItems = Cart.items.filter(item => {
        const product = getProductById(item.productId);
        return product !== null;
    });
    
    if (validItems.length !== Cart.items.length) {
        console.log('Removed invalid items from cart');
        Cart.items = validItems;
        saveCartToStorage();
        updateCartDisplay();
        updateFloatingCartBadge();
        
        showErrorToast('Some items in your cart are no longer available and have been removed.');
    }
}

/**
 * Setup checkout modal event listeners
 */
function setupCheckoutModalListeners() {
    // Checkout button click
    document.addEventListener('click', (event) => {
        if (event.target.closest('.checkout-btn')) {
            event.preventDefault();
            openCheckoutModal();
        }
    });

    // Close checkout modal
    document.getElementById('close-checkout-modal')?.addEventListener('click', closeCheckoutModal);

    // Instagram checkout option
    document.getElementById('instagram-checkout')?.addEventListener('click', () => {
        selectCheckoutOption('instagram');
    });

    // WhatsApp checkout option
    document.getElementById('whatsapp-checkout')?.addEventListener('click', () => {
        selectCheckoutOption('whatsapp');
    });

    // Close order summary modal
    document.getElementById('close-summary-modal')?.addEventListener('click', closeOrderSummaryModal);

    // Copy order details
    document.getElementById('copy-order-btn')?.addEventListener('click', copyOrderDetails);

    // Proceed to platform
    document.getElementById('proceed-to-platform')?.addEventListener('click', proceedToPlatform);

    // Close modals when clicking outside
    document.addEventListener('click', (event) => {
        const checkoutModal = document.getElementById('checkout-modal');
        const summaryModal = document.getElementById('order-summary-modal');
        
        if (event.target === checkoutModal) {
            closeCheckoutModal();
        }
        if (event.target === summaryModal) {
            closeOrderSummaryModal();
        }
    });
}

/**
 * Open checkout modal
 */
function openCheckoutModal() {
    if (Cart.items.length === 0) {
        showErrorToast('Your cart is empty. Add some items before checkout.');
        return;
    }

    const modal = document.getElementById('checkout-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Close checkout modal
 */
function closeCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

/**
 * Select checkout option
 */
function selectCheckoutOption(platform) {
    closeCheckoutModal();
    generateOrderSummary(platform);
    openOrderSummaryModal(platform);
}

/**
 * Generate order summary
 */
function generateOrderSummary(platform) {
    const orderDetails = document.getElementById('order-details');
    const proceedText = document.getElementById('proceed-text');
    
    // Update proceed button text
    proceedText.textContent = platform === 'instagram' ? 'Proceed to Instagram' : 'Proceed to WhatsApp';
    
    // Generate order summary HTML
    const currentDate = new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    let orderHTML = `
        <div class="order-header">
            <h4>Vijaya Jyothi Home Foods</h4>
            <div class="order-date">Order Date: ${currentDate}</div>
        </div>
        
        <div class="order-items">
    `;

    Cart.items.forEach(item => {
        const itemTotal = item.price * item.quantity;
        orderHTML += `
            <div class="order-item">
                <div class="order-item-info">
                    <div class="order-item-name">${item.name}</div>
                    <div class="order-item-details">Quantity: ${item.quantity} × ₹${item.price} | Weight: ${item.weight}</div>
                </div>
                <div class="order-item-price">₹${itemTotal}</div>
            </div>
        `;
    });

    const subtotal = getCartTotal();
    const deliveryFee = 0; // Free delivery
    const total = subtotal + deliveryFee;

    orderHTML += `
        </div>
        
        <div class="order-totals">
            <div class="order-total-row">
                <span>Subtotal:</span>
                <span>₹${subtotal}</span>
            </div>
            <div class="order-total-row">
                <span>Delivery:</span>
                <span>Free</span>
            </div>
            <div class="order-total-row">
                <span>Total:</span>
                <span>₹${total}</span>
            </div>
        </div>
    `;

    orderDetails.innerHTML = orderHTML;
    
    // Store platform selection for later use
    orderDetails.dataset.platform = platform;
}

/**
 * Open order summary modal
 */
function openOrderSummaryModal(platform) {
    const modal = document.getElementById('order-summary-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Close order summary modal
 */
function closeOrderSummaryModal() {
    const modal = document.getElementById('order-summary-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

/**
 * Copy order details to clipboard
 */
async function copyOrderDetails() {
    try {
        const orderText = generateOrderText();
        await navigator.clipboard.writeText(orderText);
        showSuccessToast('Order details copied to clipboard!');
    } catch (error) {
        console.error('Failed to copy order details:', error);
        showErrorToast('Failed to copy order details. Please try again.');
    }
}

/**
 * Generate order text for sharing
 */
function generateOrderText() {
    const currentDate = new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    let orderText = `🍯 Vijaya Jyothi Home Foods - Order\n`;
    orderText += `📅 Date: ${currentDate}\n\n`;
    orderText += `📦 Order Items:\n`;
    orderText += `${'-'.repeat(30)}\n`;

    Cart.items.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        orderText += `${index + 1}. ${item.name}\n`;
        orderText += `   Qty: ${item.quantity} × ₹${item.price} | Weight: ${item.weight}\n`;
        orderText += `   Total: ₹${itemTotal}\n\n`;
    });

    const subtotal = getCartTotal();
    const deliveryFee = 0;
    const total = subtotal + deliveryFee;

    orderText += `${'-'.repeat(30)}\n`;
    orderText += `💰 Order Summary:\n`;
    orderText += `Subtotal: ₹${subtotal}\n`;
    orderText += `Delivery: Free\n`;
    orderText += `Total: ₹${total}\n\n`;
    orderText += `📍 Please confirm your delivery address and preferred delivery time.\n`;
    orderText += `🙏 Thank you for choosing Vijaya Jyothi Home Foods!`;

    return orderText;
}

/**
 * Proceed to selected platform
 */
function proceedToPlatform() {
    const platform = document.getElementById('order-details').dataset.platform;
    const orderText = generateOrderText();
    
    if (platform === 'instagram') {
        // Open Instagram DM
        const instagramUrl = 'https://www.instagram.com/vj_homefoods?igsh=cmQxMTMxamV5amhp';
        window.open(instagramUrl, '_blank');
        showSuccessToast('Instagram opened! Please send the copied order details via DM.');
    } else if (platform === 'whatsapp') {
        // Open WhatsApp with pre-filled message
        const whatsappMessage = encodeURIComponent(orderText);
        const whatsappUrl = `https://wa.me/919493685339?text=${whatsappMessage}`;
        window.open(whatsappUrl, '_blank');
        showSuccessToast('WhatsApp opened with your order details!');
    }
    
    closeOrderSummaryModal();
    closeCart();
    
    // Clear cart after successful order
    setTimeout(() => {
        clearCart();
        showSuccessToast('Order placed successfully! We will contact you soon.');
    }, 1000);
}

// Export for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Cart,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        toggleCart,
        openCart,
        closeCart,
        getCartTotal,
        getCartItemCount,
        getCartData,
        importCartData
    };
}
