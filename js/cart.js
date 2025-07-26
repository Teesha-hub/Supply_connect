// cart.js - Handles cart logic, order placement, and receipt generation

// Load cart from localStorage
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartBody = document.getElementById('cartBody');
    const cartTotal = document.getElementById('cartTotal');
    cartBody.innerHTML = '';
    let total = 0;
    cart.forEach((item, idx) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.productName}</td>
            <td>${item.price}</td>
            <td><input type="number" min="1" value="${item.quantity}" onchange="updateQuantity(${idx}, this.value)"></td>
            <td>${item.supplierName}</td>
            <td>${subtotal}</td>
            <td><button onclick="removeFromCart(${idx})">Remove</button></td>
        `;
        cartBody.appendChild(row);
    });
    cartTotal.textContent = total;
}

function updateQuantity(idx, value) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart[idx].quantity = parseInt(value);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

function removeFromCart(idx) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.splice(idx, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

function placeOrder() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    // Get vendor id and name from sessionStorage (if available)
    let vendorId = 0;
    let vendorName = '';
    try {
        const user = JSON.parse(sessionStorage.getItem('user') || '{}');
        vendorId = user && user.id ? user.id : 0;
        vendorName = user && user.name ? user.name : '';
    } catch (e) {}
    // Send order to backend (AJAX)
    fetch('php/place-order.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart, vendorId, vendorName })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            showReceipt(data.receipt || cart);
            localStorage.removeItem('cart');
        } else {
            alert('Order failed. Please try again.');
        }
    })
    .catch(() => alert('Order failed. Please try again.'));
}

function showReceipt(receipt) {
    document.querySelector('.cart-section').style.display = 'none';
    const section = document.getElementById('receiptSection');
    section.style.display = 'block';
    let html = '<ul>';
    let total = 0;
    receipt.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        html += `<li>${item.productName} x ${item.quantity} @ ₹${item.price} = ₹${subtotal}</li>`;
    });
    html += `</ul><h3>Total: ₹${total}</h3>`;
    html += `<p>Date: ${new Date().toLocaleString()}</p>`;
    document.getElementById('receiptDetails').innerHTML = html;
}

window.onload = loadCart;
// Fallback: ensure 'Add More Items' button always works
document.addEventListener('DOMContentLoaded', function() {
    var addMoreBtn = document.getElementById('addMoreBtn');
    if (addMoreBtn) {
        addMoreBtn.onclick = function() {
            window.location.href = 'vendor-dashboard.html';
        };
    }
});
