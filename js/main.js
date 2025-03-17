// Cart state management
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [
    {
        id: 1,
        name: "Fresh Tomatoes",
        price: 2.99,
        image: "https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg",
        description: "Farm fresh organic tomatoes",
        farmer: "Farmer John",
        category: "Vegetables",
        unit: "kg"
    },
    {
        id: 2,
        name: "Fresh Apples",
        price: 3.99,
        image: "https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg",
        description: "Sweet and juicy apples",
        farmer: "Farmer Sarah",
        category: "Fruits",
        unit: "kg"
    },
    {
        id: 3,
        name: "Fresh Carrots",
        price: 1.99,
        image: "https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg",
        description: "Organic garden carrots",
        farmer: "Farmer Mike",
        category: "Vegetables",
        unit: "kg"
    },
    {
        id: 4,
        name: "Fresh Oranges",
        price: 4.99,
        image: "https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg",
        description: "Sweet citrus oranges",
        farmer: "Farmer Sarah",
        category: "Fruits",
        unit: "kg"
    }
];

// Update cart count in the UI
function updateCartCount() {
    const cartCount = document.querySelector('.cart span');
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
}

// Add item to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`Added ${product.name} to cart!`);
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg';
    notification.textContent = message;
    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Search functionality
function setupSearch() {
    const searchInput = document.querySelector('input[type="text"]');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
        
        // Update UI with filtered products
        updateProductsUI(filteredProducts);
    });
}

// Update products UI
function updateProductsUI(productsToShow) {
    const productsContainer = document.querySelector('#products .grid');
    if (!productsContainer) return;

    productsContainer.innerHTML = productsToShow.map(product => `
        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
            <img src="${product.image}" 
                 alt="${product.name}" 
                 class="w-full h-48 object-cover">
            <div class="p-4">
                <div class="flex justify-between items-center mb-2">
                    <h3 class="text-lg font-semibold">${product.name}</h3>
                    <span class="text-green-600 font-bold">$${product.price}/${product.unit}</span>
                </div>
                <p class="text-gray-600 text-sm mb-4">${product.description}</p>
                <button onclick="addToCart(${product.id})" 
                        class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    setupSearch();
    
    // Initialize products
    updateProductsUI(products);
    
    // Add click handlers to all "Add to Cart" buttons
    function initializeCartButtons() {
        document.querySelectorAll('#products button').forEach(button => {
            const productCard = button.closest('.bg-white');
            const productName = productCard.querySelector('h3').textContent;
            const product = products.find(p => p.name === productName);
            if (product) {
                button.onclick = () => addToCart(product.id);
            }
        });
    }
    
    // Initialize cart buttons
    initializeCartButtons();
});
