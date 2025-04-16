// WhatsApp Login and User Authentication Module

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    initWhatsAppLogin();
});

// Initialize WhatsApp Login
function initWhatsAppLogin() {
    // Login form
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const verificationForm = document.getElementById('verification-form');
    const userProfileSection = document.querySelector('.user-profile');
    
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('premiumTarotCurrentUser'));
    
    // Update UI based on login status
    updateLoginUI(currentUser);
    
    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const whatsappNumber = document.getElementById('login-whatsapp').value.trim();
            
            if (!whatsappNumber) {
                showNotification('يرجى إدخال رقم WhatsApp', 'error');
                return;
            }
            
            // Check if user exists
            const users = JSON.parse(localStorage.getItem('premiumTarotUsers')) || [];
            const user = users.find(u => u.whatsapp === whatsappNumber);
            
            if (!user) {
                showNotification('رقم WhatsApp غير مسجل. يرجى التسجيل أولاً.', 'error');
                
                // Show registration form if it exists
                if (registerForm) {
                    loginForm.style.display = 'none';
                    registerForm.style.display = 'block';
                    document.getElementById('register-whatsapp').value = whatsappNumber;
                }
                
                return;
            }
            
            // Generate verification code
            const verificationCode = generateVerificationCode();
            
            // Save verification code (in a real implementation, this would be sent via WhatsApp API)
            user.verificationCode = verificationCode;
            localStorage.setItem('premiumTarotUsers', JSON.stringify(users));
            
            // Show verification form
            if (verificationForm) {
                loginForm.style.display = 'none';
                verificationForm.style.display = 'block';
                document.getElementById('verification-whatsapp').value = whatsappNumber;
                
                // In a real implementation, this would be sent via WhatsApp API
                // For demo purposes, show the code in a notification
                showNotification(`رمز التحقق هو: ${verificationCode} (للعرض التوضيحي فقط)`, 'info');
            }
        });
    }
    
    // Registration form submission
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('register-name').value.trim();
            const whatsappNumber = document.getElementById('register-whatsapp').value.trim();
            const email = document.getElementById('register-email')?.value.trim() || '';
            
            if (!name || !whatsappNumber) {
                showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
                return;
            }
            
            // Check if user already exists
            const users = JSON.parse(localStorage.getItem('premiumTarotUsers')) || [];
            if (users.some(u => u.whatsapp === whatsappNumber)) {
                showNotification('رقم WhatsApp مسجل بالفعل. يرجى تسجيل الدخول.', 'error');
                
                // Show login form if it exists
                if (loginForm) {
                    registerForm.style.display = 'none';
                    loginForm.style.display = 'block';
                    document.getElementById('login-whatsapp').value = whatsappNumber;
                }
                
                return;
            }
            
            // Generate verification code
            const verificationCode = generateVerificationCode();
            
            // Create new user
            const newUser = {
                name: name,
                whatsapp: whatsappNumber,
                email: email,
                verificationCode: verificationCode,
                orders: [],
                createdAt: new Date().toISOString()
            };
            
            // Save user
            users.push(newUser);
            localStorage.setItem('premiumTarotUsers', JSON.stringify(users));
            
            // Show verification form
            if (verificationForm) {
                registerForm.style.display = 'none';
                verificationForm.style.display = 'block';
                document.getElementById('verification-whatsapp').value = whatsappNumber;
                
                // In a real implementation, this would be sent via WhatsApp API
                // For demo purposes, show the code in a notification
                showNotification(`رمز التحقق هو: ${verificationCode} (للعرض التوضيحي فقط)`, 'info');
            }
        });
    }
    
    // Verification form submission
    if (verificationForm) {
        verificationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const whatsappNumber = document.getElementById('verification-whatsapp').value.trim();
            const code = document.getElementById('verification-code').value.trim();
            
            if (!whatsappNumber || !code) {
                showNotification('يرجى إدخال رمز التحقق', 'error');
                return;
            }
            
            // Verify code
            const users = JSON.parse(localStorage.getItem('premiumTarotUsers')) || [];
            const userIndex = users.findIndex(u => u.whatsapp === whatsappNumber);
            
            if (userIndex === -1) {
                showNotification('رقم WhatsApp غير مسجل', 'error');
                return;
            }
            
            const user = users[userIndex];
            
            if (user.verificationCode !== code) {
                showNotification('رمز التحقق غير صحيح', 'error');
                return;
            }
            
            // Clear verification code
            user.verificationCode = '';
            users[userIndex] = user;
            localStorage.setItem('premiumTarotUsers', JSON.stringify(users));
            
            // Set current user
            localStorage.setItem('premiumTarotCurrentUser', JSON.stringify(user));
            
            // Show success message
            showNotification('تم تسجيل الدخول بنجاح', 'success');
            
            // Update UI
            updateLoginUI(user);
            
            // Redirect to account page or reload current page
            setTimeout(() => {
                if (window.location.pathname.includes('account.html')) {
                    window.location.reload();
                } else {
                    window.location.href = 'account.html';
                }
            }, 1000);
        });
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear current user
            localStorage.removeItem('premiumTarotCurrentUser');
            
            // Show success message
            showNotification('تم تسجيل الخروج بنجاح', 'success');
            
            // Update UI
            updateLoginUI(null);
            
            // Redirect to home page
            setTimeout(() => {
                window.location.href = window.location.pathname.includes('/pages/') ? '../index.html' : 'index.html';
            }, 1000);
        });
    }
    
    // Resend verification code
    const resendCodeBtn = document.getElementById('resend-code-btn');
    if (resendCodeBtn) {
        resendCodeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const whatsappNumber = document.getElementById('verification-whatsapp').value.trim();
            
            if (!whatsappNumber) {
                showNotification('رقم WhatsApp غير صالح', 'error');
                return;
            }
            
            // Generate new verification code
            const verificationCode = generateVerificationCode();
            
            // Save verification code
            const users = JSON.parse(localStorage.getItem('premiumTarotUsers')) || [];
            const userIndex = users.findIndex(u => u.whatsapp === whatsappNumber);
            
            if (userIndex === -1) {
                showNotification('رقم WhatsApp غير مسجل', 'error');
                return;
            }
            
            users[userIndex].verificationCode = verificationCode;
            localStorage.setItem('premiumTarotUsers', JSON.stringify(users));
            
            // In a real implementation, this would be sent via WhatsApp API
            // For demo purposes, show the code in a notification
            showNotification(`تم إرسال رمز التحقق الجديد: ${verificationCode} (للعرض التوضيحي فقط)`, 'info');
        });
    }
}

// Update UI based on login status
function updateLoginUI(user) {
    const loginSection = document.querySelector('.login-section');
    const userProfileSection = document.querySelector('.user-profile');
    const userNameElement = document.querySelector('.user-name');
    const userWhatsappElement = document.querySelector('.user-whatsapp');
    const userEmailElement = document.querySelector('.user-email');
    const loginNavItem = document.querySelector('.login-nav-item');
    const accountNavItem = document.querySelector('.account-nav-item');
    
    if (user) {
        // User is logged in
        if (loginSection) loginSection.style.display = 'none';
        if (userProfileSection) userProfileSection.style.display = 'block';
        if (userNameElement) userNameElement.textContent = user.name;
        if (userWhatsappElement) userWhatsappElement.textContent = user.whatsapp;
        if (userEmailElement) userEmailElement.textContent = user.email || 'لم يتم تحديد البريد الإلكتروني';
        if (loginNavItem) loginNavItem.style.display = 'none';
        if (accountNavItem) accountNavItem.style.display = 'block';
        
        // Load user orders if on account page
        if (window.location.pathname.includes('account.html')) {
            loadUserOrders(user);
        }
    } else {
        // User is not logged in
        if (loginSection) loginSection.style.display = 'block';
        if (userProfileSection) userProfileSection.style.display = 'none';
        if (loginNavItem) loginNavItem.style.display = 'block';
        if (accountNavItem) accountNavItem.style.display = 'none';
    }
}

// Load user orders
function loadUserOrders(user) {
    const ordersContainer = document.querySelector('.user-orders');
    if (!ordersContainer) return;
    
    if (!user.orders || user.orders.length === 0) {
        ordersContainer.innerHTML = '<p class="no-orders-message">لا توجد طلبات سابقة</p>';
        return;
    }
    
    let ordersHTML = '';
    
    user.orders.forEach(order => {
        let orderItemsHTML = '';
        let total = 0;
        
        order.items.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            orderItemsHTML += `
                <div class="order-item">
                    <div class="order-item-details">
                        <h5>${item.name}</h5>
                        <p>${item.price} ج.م × ${item.quantity}</p>
                    </div>
                    <div class="order-item-total">
                        ${itemTotal} ج.م
                    </div>
                </div>
            `;
        });
        
        ordersHTML += `
            <div class="order-card">
                <div class="order-header">
                    <h4>طلب #${order.orderNumber}</h4>
                    <span class="order-date">${new Date(order.date).toLocaleDateString('ar-EG')}</span>
                </div>
                <div class="order-status">
                    <div class="status-progress">
                        <div class="status-step ${order.status >= 1 ? 'active' : ''}">
                            <div class="status-icon"><i class="fas fa-check-circle"></i></div>
                            <div class="status-text">تم تأكيد الطلب</div>
                        </div>
                        <div class="status-line ${order.status >= 2 ? 'active' : ''}"></div>
                        <div class="status-step ${order.status >= 2 ? 'active' : ''}">
                            <div class="status-icon"><i class="fas fa-box"></i></div>
                            <div class="status-text">تم الشحن</div>
                        </div>
                        <div class="status-line ${order.status >= 3 ? 'active' : ''}"></div>
                        <div class="status-step ${order.status >= 3 ? 'active' : ''}">
                            <div class="status-icon"><i class="fas fa-home"></i></div>
                            <div class="status-text">تم الاستلام</div>
                        </div>
                    </div>
                </div>
                <div class="order-items">
                    ${orderItemsHTML}
                </div>
                <div class="order-total">
                    <span>المجموع:</span>
                    <span>${total} ج.م</span>
                </div>
                <div class="order-address">
                    <h5>عنوان الشحن:</h5>
                    <p>${order.shippingAddress.name}</p>
                    <p>${order.shippingAddress.buildingNumber} ${order.shippingAddress.streetName}, ${order.shippingAddress.regionDistrict}</p>
                    <p>${order.shippingAddress.city}, ${order.shippingAddress.country}</p>
                </div>
            </div>
        `;
    });
    
    ordersContainer.innerHTML = ordersHTML;
}

// Generate verification code
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Add order to user history
function addOrderToUserHistory(orderData) {
    const currentUser = JSON.parse(localStorage.getItem('premiumTarotCurrentUser'));
    
    if (!currentUser) return false;
    
    // Get users
    const users = JSON.parse(localStorage.getItem('premiumTarotUsers')) || [];
    const userIndex = users.findIndex(u => u.whatsapp === currentUser.whatsapp);
    
    if (userIndex === -1) return false;
    
    // Add order to user
    if (!users[userIndex].orders) {
        users[userIndex].orders = [];
    }
    
    users[userIndex].orders.push(orderData);
    
    // Update localStorage
    localStorage.setItem('premiumTarotUsers', JSON.stringify(users));
    localStorage.setItem('premiumTarotCurrentUser', JSON.stringify(users[userIndex]));
    
    return true;
}
