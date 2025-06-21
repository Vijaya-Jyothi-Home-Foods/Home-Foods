/**
 * Products Management System
 * Handles product data, display, and interactions
 */

// Products state
const Products = {
    list: [],
    isLoaded: false,
    isLoading: false
};

// Authentic products data from Vijaya Jyothi Home Foods - Grouped by sweet type
const SAMPLE_PRODUCTS = [
    {
        id: 'bellam-sunnundalu',
        name: 'Bellam Sunnundalu',
        description: 'Traditional sesame seed balls made with jaggery, rich in nutrients and authentic flavor.',
        image: './Attachments/Sunnundalu_Bellam.jpg',
        category: 'traditional',
        isPopular: true,
        isNew: false,
        inStock: true,
        variants: [
            { weight: '250g', price: 140, id: 'bellam-sunnundalu-250g' },
            { weight: '500g', price: 260, id: 'bellam-sunnundalu-500g' },
            { weight: '1kg', price: 500, id: 'bellam-sunnundalu-1kg' }
        ]
    },
    {
        id: 'sugar-sunnundalu',
        name: 'Sugar Sunnundalu',
        description: 'Sweet sesame seed balls made with sugar, perfect for festivals and celebrations.',
        image: './Attachments/Sugar_Sunnundalu.jpeg',
        category: 'traditional',
        isPopular: false,
        isNew: false,
        inStock: true,
        variants: [
            { weight: '250g', price: 120, id: 'sugar-sunnundalu-250g' },
            { weight: '500g', price: 240, id: 'sugar-sunnundalu-500g' },
            { weight: '1kg', price: 450, id: 'sugar-sunnundalu-1kg' }
        ]
    },
    {
        id: 'bellam-putharekulu',
        name: 'Bellam Putharekulu',
        description: 'Paper-thin sweet layers filled with jaggery, a traditional delicacy from Andhra Pradesh.',
        image: './Attachments/Bellam_Pootharekulu.jpg',
        category: 'traditional',
        isPopular: true,
        isNew: false,
        inStock: true,
        variants: [
            { weight: '10 pieces/box', price: 150, id: 'bellam-putharekulu-10pieces' },
            { weight: '10 pieces/box (Extra Dry Fruits)', price: 280, id: 'bellam-putharekulu-10pieces-dryfruits' },
            { weight: '20 pieces/box', price: 280, id: 'bellam-putharekulu-20pieces' },
            { weight: '20 pieces/box (Extra Dry Fruits)', price: 530, id: 'bellam-putharekulu-20pieces-dryfruits' }
        ]
    },
    {
        id: 'sugar-putharekulu',
        name: 'Sugar Putharekulu',
        description: 'Paper-thin sweet layers filled with sugar, light and delicious.',
        image: './Attachments/sugar-kaju-putharekulu.jpg',
        category: 'traditional',
        isPopular: false,
        isNew: false,
        inStock: true,
        variants: [
            { weight: '10 pieces/box', price: 130, id: 'sugar-putharekulu-10pieces' },
            { weight: '10 pieces/box (Extra Dry Fruits)', price: 250, id: 'sugar-putharekulu-10pieces-dryfruits' },
            { weight: '20 pieces/box', price: 250, id: 'sugar-putharekulu-20pieces' },
            { weight: '20 pieces/box (Extra Dry Fruits)', price: 480, id: 'sugar-putharekulu-20pieces-dryfruits' }
        ]
    },
    {
        id: 'kobbari-undalu',
        name: 'Kobbari Undalu',
        description: 'Sweet coconut balls made with fresh coconut and jaggery.',
        image: './Attachments/KobbariUndalu.jpg',
        category: 'traditional',
        isPopular: false,
        isNew: false,
        inStock: true,
        variants: [
            { weight: '250g', price: 100, id: 'kobbari-undalu-250g' },
            { weight: '500g', price: 180, id: 'kobbari-undalu-500g' },
            { weight: '1kg', price: 350, id: 'kobbari-undalu-1kg' }
        ]
    },
    {
        id: 'motichoor-laddu',
        name: 'Motichoor Laddu',
        description: 'Classic round sweet made with fine gram flour pearls and sugar syrup.',
        image: './Attachments/Mothi_choor.jpg',
        category: 'traditional',
        isPopular: true,
        isNew: false,
        inStock: true,
        variants: [
            { weight: '250g', price: 100, id: 'motichoor-laddu-250g' },
            { weight: '500g', price: 180, id: 'motichoor-laddu-500g' },
            { weight: '1kg', price: 350, id: 'motichoor-laddu-1kg' }
        ]
    },
    {
        id: 'bundhi-laddu',
        name: 'Bundhi Laddu',
        description: 'Traditional round sweet made with gram flour droplets and aromatic spices.',
        image: './Attachments/boondi-laddu.jpg',
        category: 'traditional',
        isPopular: false,
        isNew: false,
        inStock: true,
        variants: [
            { weight: '250g', price: 100, id: 'bundhi-laddu-250g' },
            { weight: '500g', price: 180, id: 'bundhi-laddu-500g' },
            { weight: '1kg', price: 350, id: 'bundhi-laddu-1kg' }
        ]
    },
    {
        id: 'ravva-laddu',
        name: 'Ravva Laddu',
        description: 'Semolina-based sweet balls with cashews and raisins, perfectly roasted.',
        image: './Attachments/Rava-Ladoo.jpg',
        category: 'traditional',
        isPopular: false,
        isNew: false,
        inStock: true,
        variants: [
            { weight: '250g', price: 100, id: 'ravva-laddu-250g' },
            { weight: '500g', price: 180, id: 'ravva-laddu-500g' },
            { weight: '1kg', price: 350, id: 'ravva-laddu-1kg' }
        ]
    },
    {
        id: 'mavidi-tandri',
        name: 'Mavidi Tandri',
        description: 'Traditional mango-flavored sweet made with fresh mango pulp and jaggery.',
        image: './Attachments/mamidi_Tandra.jpeg',
        category: 'traditional',
        isPopular: false,
        isNew: true,
        inStock: true,
        variants: [
            { weight: '250g', price: 100, id: 'mavidi-tandri-250g' },
            { weight: '500g', price: 180, id: 'mavidi-tandri-500g' },
            { weight: '1kg', price: 350, id: 'mavidi-tandri-1kg' }
        ]
    },
    {
        id: 'palakova',
        name: 'Palakova',
        description: 'Rich milk-based sweet made by slow cooking milk until thick and creamy.',
        image: './Attachments/Palakova.jpg',
        category: 'premium',
        isPopular: true,
        isNew: false,
        inStock: true,
        variants: [
            { weight: '250g', price: 200, id: 'palakova-250g' },
            { weight: '500g', price: 380, id: 'palakova-500g' },
            { weight: '1kg', price: 750, id: 'palakova-1kg' }
        ]
    },
    {
        id: 'bobbatlu',
        name: 'Bobbatlu',
        description: 'Stuffed flatbread with sweet lentil filling, served warm and fresh.',
        image: './Attachments/Bobbatu_Hires.jpg',
        category: 'traditional',
        isPopular: true,
        isNew: false,
        inStock: true,
        variants: [
            { weight: '10 pieces', price: 100, id: 'bobbatlu-10pieces' },
            { weight: '20 pieces', price: 180, id: 'bobbatlu-20pieces' }
        ]
    }
];

/**
 * Initialize products system
 */
function initializeProducts() {
    console.log('Initializing products system...');
    
    try {
        // Set up product quantities tracking
        Products.quantities = {};
        
        console.log('Products system initialized successfully');
    } catch (error) {
        console.error('Failed to initialize products:', error);
    }
}

/**
 * Load products (simulate API call)
 */
async function loadProducts() {
    if (Products.isLoading) return;
    
    Products.isLoading = true;
    
    try {
        console.log('Loading products...');
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, this would be an API call
        // const response = await fetch('/api/products');
        // const products = await response.json();
        
        // For this demo, we'll use the sample data
        Products.list = SAMPLE_PRODUCTS;
        Products.isLoaded = true;
        
        // Initialize quantities and selected variants for each product
        Products.list.forEach(product => {
            Products.quantities[product.id] = 1;
            Products.selectedVariants = Products.selectedVariants || {};
            Products.selectedVariants[product.id] = 0; // Default to first variant
        });
        
        console.log('Products loaded successfully:', Products.list.length, 'products');
        
        // Render products
        renderProducts();
        
    } catch (error) {
        console.error('Failed to load products:', error);
        showErrorState('Failed to load products. Please check your connection and try again.');
        throw error;
    } finally {
        Products.isLoading = false;
    }
}

/**
 * Render products in the grid
 */
function renderProducts() {
    const productsGrid = document.getElementById('products-grid');
    
    if (!productsGrid) {
        console.error('Products grid container not found');
        return;
    }
    
    if (Products.list.length === 0) {
        showEmptyState();
        return;
    }
    
    // Clear existing content
    productsGrid.innerHTML = '';
    
    // Render each product
    Products.list.forEach(product => {
        const productElement = createProductElement(product);
        productsGrid.appendChild(productElement);
    });
    
    showProductsGrid();
    console.log('Products rendered successfully');
}

/**
 * Create product element
 */
function createProductElement(product) {
    const productDiv = document.createElement('div');
    productDiv.className = 'product-card';
    productDiv.setAttribute('data-product-id', product.id);
    
    const selectedVariantIndex = Products.selectedVariants[product.id] || 0;
    const selectedVariant = product.variants[selectedVariantIndex];
    
    productDiv.innerHTML = `
        <div class="product-image">
            ${product.image ? 
                `<img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.style.display='none';">` :
                ''
            }
            ${!product.image ? getImagePlaceholder(product.name) : ''}
            ${(product.isPopular || product.isNew) ? `
                <div class="product-badge ${product.isPopular ? 'popular' : 'new'}">
                    ${product.isPopular ? 'Popular' : 'New'}
                </div>
            ` : ''}
        </div>
        
        <div class="product-content">
            <div class="product-header">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
            </div>
            
            <div class="product-details">
                <div class="product-variant-selector">
                    <label for="variant-${product.id}" class="variant-label">
                        <i class="fas fa-weight-hanging"></i>
                        Size/Weight:
                    </label>
                    <select id="variant-${product.id}" class="variant-select" onchange="updateProductVariant('${product.id}', this.value)">
                        ${product.variants.map((variant, index) => `
                            <option value="${index}" ${index === selectedVariantIndex ? 'selected' : ''}>
                                ${variant.weight} - ${formatCurrency(variant.price)}
                            </option>
                        `).join('')}
                    </select>
                </div>
                <div class="product-price" id="price-${product.id}">
                    ${formatCurrency(selectedVariant.price)}
                </div>
            </div>
            
            <div class="product-actions">
                <div class="quantity-selector">
                    <button class="quantity-btn" onclick="updateProductQuantity('${product.id}', -1)" data-action="decrease">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity-display" id="quantity-${product.id}">1</span>
                    <button class="quantity-btn" onclick="updateProductQuantity('${product.id}', 1)" data-action="increase">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                
                <button class="add-to-cart-btn" onclick="handleAddToCart('${product.id}')" ${!product.inStock ? 'disabled' : ''}>
                    ${product.inStock ? 
                        '<i class="fas fa-cart-plus"></i> Add to Cart' : 
                        '<i class="fas fa-times"></i> Out of Stock'
                    }
                </button>
            </div>
        </div>
    `;
    
    return productDiv;
}

/**
 * Get image placeholder for products
 */
function getImagePlaceholder(productName) {
    const icons = {
        'Bellam Sunnundalu': 'fa-circle',
        'Sugar Sunnundalu': 'fa-circle',
        'Bellam Putharekulu': 'fa-layer-group',
        'Bellam Putharekulu (Extra Dry Fruits)': 'fa-layer-group',
        'Sugar Putharekulu': 'fa-layer-group',
        'Sugar Putharekulu (Extra Dry Fruits)': 'fa-layer-group',
        'Kobbari Undalu': 'fa-circle',
        'Motichoor Laddu': 'fa-dot-circle',
        'Bundhi Laddu': 'fa-dot-circle',
        'Ravva Laddu': 'fa-dot-circle',
        'Mavidi Tandri': 'fa-leaf',
        'Palakova': 'fa-square',
        'Bobbatlu': 'fa-bread-slice'
    };
    
    const icon = icons[productName] || 'fa-candy-cane';
    
    return `
        <div class="product-image-placeholder">
            <i class="fas ${icon}"></i>
            <span>Image not available</span>
        </div>
    `;
}

/**
 * Update product variant selection
 */
function updateProductVariant(productId, variantIndex) {
    const product = getProductById(productId);
    if (!product || !product.variants[variantIndex]) return;
    
    Products.selectedVariants[productId] = parseInt(variantIndex);
    const selectedVariant = product.variants[variantIndex];
    
    // Update price display
    const priceDisplay = document.getElementById(`price-${productId}`);
    if (priceDisplay) {
        priceDisplay.textContent = formatCurrency(selectedVariant.price);
    }
}

/**
 * Update product quantity selector
 */
function updateProductQuantity(productId, change) {
    const currentQuantity = Products.quantities[productId] || 1;
    const newQuantity = Math.max(1, Math.min(10, currentQuantity + change)); // Min 1, Max 10
    
    Products.quantities[productId] = newQuantity;
    
    // Update display
    const quantityDisplay = document.getElementById(`quantity-${productId}`);
    if (quantityDisplay) {
        quantityDisplay.textContent = newQuantity;
    }
    
    // Update button states
    const productCard = document.querySelector(`[data-product-id="${productId}"]`);
    if (productCard) {
        const decreaseBtn = productCard.querySelector('[data-action="decrease"]');
        const increaseBtn = productCard.querySelector('[data-action="increase"]');
        
        if (decreaseBtn) {
            decreaseBtn.disabled = newQuantity <= 1;
        }
        if (increaseBtn) {
            increaseBtn.disabled = newQuantity >= 10;
        }
    }
}

/**
 * Handle add to cart button click
 */
function handleAddToCart(productId) {
    const quantity = Products.quantities[productId] || 1;
    const product = getProductById(productId);
    
    if (!product) {
        showErrorToast('Product not found');
        return;
    }
    
    if (!product.inStock) {
        showErrorToast('This product is currently out of stock');
        return;
    }
    
    // Get selected variant
    const selectedVariantIndex = Products.selectedVariants[productId] || 0;
    const selectedVariant = product.variants[selectedVariantIndex];
    const variantId = selectedVariant.id;
    
    // Add visual feedback
    const button = document.querySelector(`[data-product-id="${productId}"] .add-to-cart-btn`);
    if (button) {
        button.classList.add('adding');
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
        
        // Simulate processing time
        setTimeout(() => {
            addToCart(variantId, quantity);
            button.classList.remove('adding');
        }, 500);
    } else {
        // Fallback if button not found
        addToCart(variantId, quantity);
    }
}

/**
 * Get product by ID (handles both main product ID and variant ID)
 */
function getProductById(productId) {
    // First try to find by main product ID
    let product = Products.list.find(product => product.id === productId);
    if (product) return product;
    
    // If not found, search through variants
    for (const mainProduct of Products.list) {
        const variant = mainProduct.variants.find(v => v.id === productId);
        if (variant) {
            return {
                ...mainProduct,
                id: variant.id,
                price: variant.price,
                weight: variant.weight,
                variantId: variant.id,
                mainProductId: mainProduct.id
            };
        }
    }
    
    return null;
}

/**
 * Get products by category
 */
function getProductsByCategory(category) {
    return Products.list.filter(product => product.category === category);
}

/**
 * Search products
 */
function searchProducts(query) {
    const searchTerm = query.toLowerCase().trim();
    
    if (!searchTerm) {
        return Products.list;
    }
    
    return Products.list.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
}

/**
 * Sort products
 */
function sortProducts(sortBy = 'name', order = 'asc') {
    const sortedProducts = [...Products.list];
    
    sortedProducts.sort((a, b) => {
        let aValue, bValue;
        
        switch (sortBy) {
            case 'price':
                aValue = a.price;
                bValue = b.price;
                break;
            case 'name':
                aValue = a.name.toLowerCase();
                bValue = b.name.toLowerCase();
                break;
            case 'popularity':
                aValue = a.isPopular ? 1 : 0;
                bValue = b.isPopular ? 1 : 0;
                break;
            default:
                aValue = a.name.toLowerCase();
                bValue = b.name.toLowerCase();
        }
        
        if (aValue < bValue) return order === 'asc' ? -1 : 1;
        if (aValue > bValue) return order === 'asc' ? 1 : -1;
        return 0;
    });
    
    return sortedProducts;
}

/**
 * Filter products by price range
 */
function filterProductsByPriceRange(minPrice, maxPrice) {
    return Products.list.filter(product => 
        product.price >= minPrice && product.price <= maxPrice
    );
}

/**
 * Get product recommendations (similar products)
 */
function getProductRecommendations(productId, limit = 3) {
    const currentProduct = getProductById(productId);
    if (!currentProduct) return [];
    
    // Get products from same category, excluding current product
    const recommendations = Products.list
        .filter(product => 
            product.id !== productId && 
            product.category === currentProduct.category &&
            product.inStock
        )
        .slice(0, limit);
    
    // If not enough recommendations, add popular products
    if (recommendations.length < limit) {
        const popularProducts = Products.list
            .filter(product => 
                product.id !== productId && 
                product.isPopular &&
                product.inStock &&
                !recommendations.includes(product)
            )
            .slice(0, limit - recommendations.length);
        
        recommendations.push(...popularProducts);
    }
    
    return recommendations;
}

/**
 * Get featured products
 */
function getFeaturedProducts() {
    return Products.list.filter(product => product.isPopular || product.isNew);
}

/**
 * Update product stock status
 */
function updateProductStock(productId, inStock) {
    const product = getProductById(productId);
    if (product) {
        product.inStock = inStock;
        
        // Re-render the specific product
        const productElement = document.querySelector(`[data-product-id="${productId}"]`);
        if (productElement) {
            const newProductElement = createProductElement(product);
            productElement.parentNode.replaceChild(newProductElement, productElement);
        }
        
        console.log(`Product ${productId} stock updated:`, inStock);
    }
}

/**
 * Calculate product discount percentage
 */
function getProductDiscount(product) {
    if (!product.originalPrice || product.originalPrice <= product.price) {
        return 0;
    }
    
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
}

/**
 * Get products statistics
 */
function getProductsStats() {
    return {
        total: Products.list.length,
        inStock: Products.list.filter(p => p.inStock).length,
        outOfStock: Products.list.filter(p => !p.inStock).length,
        popular: Products.list.filter(p => p.isPopular).length,
        new: Products.list.filter(p => p.isNew).length,
        categories: [...new Set(Products.list.map(p => p.category))],
        priceRange: {
            min: Math.min(...Products.list.map(p => p.price)),
            max: Math.max(...Products.list.map(p => p.price))
        }
    };
}

// Export for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Products,
        loadProducts,
        getProductById,
        getProductsByCategory,
        searchProducts,
        sortProducts,
        filterProductsByPriceRange,
        getProductRecommendations,
        getFeaturedProducts,
        updateProductStock,
        getProductDiscount,
        getProductsStats
    };
}
