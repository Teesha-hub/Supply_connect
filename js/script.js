// Load purchases for vendor dashboard
function loadVendorPurchases() {
    fetch('php/get-purchases.php')
        .then(res => res.json())
        .then(data => {
            const purchasesBody = document.getElementById('purchasesBody');
            if (!purchasesBody) return;
            purchasesBody.innerHTML = '';
            (data.purchases || []).forEach(purchase => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${purchase.orderId}</td>
                    <td>${purchase.date}</td>
                    <td>${purchase.productName}</td>
                    <td>${purchase.quantity}</td>
                    <td>${purchase.supplierName}</td>
                    <td>${purchase.total}</td>
                `;
                purchasesBody.appendChild(row);
            });
        });
}

// Auto-load purchases if on vendor dashboard
if (document.getElementById('purchasesBody')) {
    loadVendorPurchases();
}
// Load incoming orders for supplier dashboard
function loadSupplierOrders(supplierId = null) {
    fetch('php/get-orders.php')
        .then(res => res.json())
        .then(data => {
            const ordersBody = document.getElementById('ordersBody');
            if (!ordersBody) return;
            ordersBody.innerHTML = '';
            let orders = data.orders || [];
            // Optionally filter by supplierId
            if (supplierId) {
                orders = orders.filter(o => o.supplierId == supplierId);
            }
            orders.forEach(order => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${order.orderId}</td>
                    <td>${order.productName}</td>
                    <td>${order.quantity}</td>
                    <td>${order.vendor}</td>
                    <td>${order.date}</td>
                `;
                ordersBody.appendChild(row);
            });
        });
}

// Auto-load orders if on supplier dashboard
if (document.getElementById('ordersBody')) {
    loadSupplierOrders();
}
// Add to Cart function for Vendor Dashboard
function addToCart(btn) {
    const productId = btn.getAttribute('data-product-id');
    const supplierId = btn.getAttribute('data-supplier-id');
    const productName = btn.getAttribute('data-product-name');
    const price = parseFloat(btn.getAttribute('data-price'));
    const location = btn.getAttribute('data-location');
    const supplierName = btn.getAttribute('data-supplier-name');
    const quantity = 1; // Default to 1, can be enhanced to allow user input

    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    // Check if already in cart
    const idx = cart.findIndex(item => item.productId === productId && item.supplierId === supplierId);
    if (idx > -1) {
        cart[idx].quantity += 1;
    } else {
        cart.push({ productId, supplierId, productName, price, location, supplierName, quantity });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.location.href = 'cart.html';
}
// Authentication and Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in and redirect appropriately
    checkAuthStatus();
    
    // Handle login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Handle signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // Handle add product form
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', handleAddProduct);
        loadMyProducts();
    }
    
    // Load products for vendor dashboard
    if (document.getElementById('productsTable')) {
        loadAllProducts();
        updateVendorStats();
    }
    
    // Set user name in dashboard
    setUserName();
    
    // Update dashboard stats
    if (document.getElementById('myProductsTable')) {
        updateSupplierStats();
    }
});

// Check authentication status
function checkAuthStatus() {
    const currentPage = window.location.pathname.split('/').pop();
    const user = JSON.parse(sessionStorage.getItem('user') || 'null');
    
    // Redirect based on authentication status
    if (user) {
        if (currentPage === 'login.html' || currentPage === 'signup.html') {
            if (user.role === 'supplier') {
                window.location.href = 'supplier-dashboard.html';
            } else {
                window.location.href = 'vendor-dashboard.html';
            }
        }
        
        // Check if user is on correct dashboard
        if (currentPage === 'supplier-dashboard.html' && user.role !== 'supplier') {
            window.location.href = 'vendor-dashboard.html';
        }
        if (currentPage === 'vendor-dashboard.html' && user.role !== 'vendor') {
            window.location.href = 'supplier-dashboard.html';
        }
    } else {
        // Redirect to login if trying to access dashboard without authentication
        if (currentPage.includes('dashboard')) {
            window.location.href = 'login.html';
        }
    }
}

// Handle login form submission
async function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    try {
        const response = await fetch('php/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Store user data in session storage
            sessionStorage.setItem('user', JSON.stringify(result.user));
            
            // Redirect based on role
            if (result.user.role === 'supplier') {
                window.location.href = 'supplier-dashboard.html';
            } else {
                window.location.href = 'vendor-dashboard.html';
            }
        } else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showMessage('Login failed. Please try again.', 'error');
    }
}

// Handle signup form submission
async function handleSignup(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const userData = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        role: formData.get('role')
    };
    
    try {
        const response = await fetch('php/signup.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('Account created successfully! Please login.', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        console.error('Signup error:', error);
        showMessage('Signup failed. Please try again.', 'error');
    }
}

// Handle add product form submission
async function handleAddProduct(e) {
    e.preventDefault();
    
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    const formData = new FormData(e.target);
    const productData = {
        productName: formData.get('productName'),
        price: formData.get('price'),
        quantity: formData.get('quantity'),
        location: formData.get('location'),
        supplierId: user.id
    };
    
    try {
        const response = await fetch('php/add-product.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('Product added successfully!', 'success');
            e.target.reset();
            loadMyProducts(); // Reload products table
            updateSupplierStats(); // Update stats
        } else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        console.error('Add product error:', error);
        showMessage('Failed to add product. Please try again.', 'error');
    }
}

// Load supplier's products
async function loadMyProducts() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user) return;
    
    try {
        const response = await fetch(`php/get-products.php?supplier_id=${user.id}`);
        const result = await response.json();
        
        if (result.success) {
            displayMyProducts(result.products);
            updateSupplierStats();
        }
    } catch (error) {
        console.error('Load products error:', error);
    }
}

// Load all products for vendor
async function loadAllProducts() {
    try {
        const response = await fetch('php/get-products.php');
        const result = await response.json();
        
        if (result.success) {
            displayAllProducts(result.products);
            updateVendorStats();
        }
    } catch (error) {
        console.error('Load all products error:', error);
    }
}

// Load products for vendor dashboard and add 'Order Now' button to each row
function loadVendorProducts(products) {
    const productsBody = document.getElementById('productsBody');
    if (!productsBody) return;
    productsBody.innerHTML = '';
    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.productName}</td>
            <td>${product.price}</td>
            <td>${product.quantity}</td>
            <td>${product.location}</td>
            <td>${product.supplierName}</td>
            <td>${product.stockStatus || 'In Stock'}</td>
            <td>
                <button class="order-btn" onclick="addToCart(this)"
                    data-product-id="${product.productId}"
                    data-supplier-id="${product.supplierId}"
                    data-product-name="${product.productName}"
                    data-price="${product.price}"
                    data-location="${product.location}"
                    data-supplier-name="${product.supplierName}"
                >Order Now</button>
            </td>
        `;
        productsBody.appendChild(row);
    });
}

// Example usage: fetch products and render
if (document.getElementById('productsBody')) {
    fetch('php/get-products.php')
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data.products)) {
                loadVendorProducts(data.products);
            }
        });
}

// Display supplier's products
function displayMyProducts(products) {
    const tbody = document.getElementById('myProductsBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No products added yet</td></tr>';
        return;
    }
    
    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>₹${parseFloat(product.price).toFixed(2)}</td>
            <td>${product.quantity}</td>
            <td>${product.location}</td>
            <td><span class="stock-badge ${getStockClass(product.quantity)}">${getStockStatus(product.quantity)}</span></td>
        `;
        tbody.appendChild(row);
    });
}

// Display all products for vendor
function displayAllProducts(products) {
    const tbody = document.getElementById('productsBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No products available</td></tr>';
        return;
    }
    
    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>₹${parseFloat(product.price).toFixed(2)}</td>
            <td>${product.quantity}</td>
            <td>${product.location}</td>
            <td>${product.supplier_name}</td>
            <td><span class="stock-badge ${getStockClass(product.quantity)}">${getStockStatus(product.quantity)}</span></td>
            <td>
                <button class="order-btn" onclick="addToCart(this)"
                    data-product-id="${product.id || product.productId || ''}"
                    data-supplier-id="${product.supplier_id || product.supplierId || ''}"
                    data-product-name="${product.name}"
                    data-price="${product.price}"
                    data-location="${product.location}"
                    data-supplier-name="${product.supplier_name}"
                >Order Now</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Get stock status class
function getStockClass(quantity) {
    if (quantity > 50) return 'stock-available';
    if (quantity > 10) return 'stock-low';
    return 'stock-out';
}

// Get stock status text
function getStockStatus(quantity) {
    if (quantity > 50) return 'Available';
    if (quantity > 10) return 'Low Stock';
    return 'Out of Stock';
}

// Search products
async function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value;
    
    try {
        const response = await fetch(`php/get-products.php?search=${encodeURIComponent(searchTerm)}`);
        const result = await response.json();
        
        if (result.success) {
            displayAllProducts(result.products);
            updateVendorStats();
        }
    } catch (error) {
        console.error('Search error:', error);
    }
}

// Set user name in dashboard
function setUserName() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const userNameElement = document.getElementById('userName');
    
    if (user && userNameElement) {
        userNameElement.textContent = user.name;
    }
}

// Logout function
function logout() {
    sessionStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Update supplier dashboard stats
function updateSupplierStats() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user) return;
    
    fetch(`php/get-products.php?supplier_id=${user.id}`)
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                const products = result.products;
                const totalProducts = products.length;
                const activeProducts = products.filter(p => p.quantity > 0).length;
                
                const totalProductsEl = document.getElementById('totalProducts');
                const activeProductsEl = document.getElementById('activeProducts');
                
                if (totalProductsEl) totalProductsEl.textContent = totalProducts;
                if (activeProductsEl) activeProductsEl.textContent = activeProducts;
            }
        })
        .catch(error => console.error('Stats update error:', error));
}

// Update vendor dashboard stats
function updateVendorStats() {
    fetch('php/get-products.php')
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                const products = result.products;
                const availableProducts = products.filter(p => p.quantity > 0).length;
                const suppliers = [...new Set(products.map(p => p.supplier_id))].length;
                
                const availableProductsEl = document.getElementById('availableProducts');
                const totalSuppliersEl = document.getElementById('totalSuppliers');
                
                if (availableProductsEl) availableProductsEl.textContent = availableProducts;
                if (totalSuppliersEl) totalSuppliersEl.textContent = suppliers;
            }
        })
        .catch(error => console.error('Stats update error:', error));
}

// Show message to user
function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // Insert at top of form or page
    const form = document.querySelector('.auth-form') || document.querySelector('.product-form');
    if (form) {
        form.parentNode.insertBefore(messageDiv, form);
    } else {
        document.body.insertBefore(messageDiv, document.body.firstChild);
    }
    
    // Auto remove message after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Allow Enter key for search
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && e.target.id === 'searchInput') {
        searchProducts();
    }
});



document.querySelectorAll(".order-btn").forEach(button => {
  button.addEventListener("click", function () {
    const productId = this.getAttribute("data-product-id");
    const supplierId = this.getAttribute("data-supplier-id");
    const quantity = this.previousElementSibling.value;

    fetch("../php/place_order.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `product_id=${productId}&supplier_id=${supplierId}&quantity=${quantity}`
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        window.location.href = `../html/receipt.html?order_id=${data.order_id}`;
      } else {
        alert("Failed to place order: " + data.message);
      }
    });
  });
});



