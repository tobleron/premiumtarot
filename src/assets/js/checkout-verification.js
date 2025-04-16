// Checkout WhatsApp Verification Module

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    initCheckoutVerification();
});

// Initialize Checkout Verification
function initCheckoutVerification() {
    const checkoutForm = document.getElementById('checkout-form');
    const verificationSection = document.querySelector('.verification-section');
    
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get cart from localStorage
            const cart = JSON.parse(localStorage.getItem('premiumTarotCart')) || [];
            
            if (cart.length === 0) {
                showNotification('سلة التسوق فارغة. يرجى إضافة منتجات قبل إتمام الشراء.', 'error');
                return;
            }
            
            // Get form data
            const recipientName = document.getElementById('recipient-name').value.trim();
            const whatsappNumber = document.getElementById('whatsapp-number').value.trim();
            const buildingNumber = document.getElementById('building-number').value.trim();
            const streetName = document.getElementById('street-name').value.trim();
            const regionDistrict = document.getElementById('region-district').value.trim();
            const city = document.getElementById('city').value.trim();
            const country = document.getElementById('country').value;
            const email = document.getElementById('email')?.value.trim() || ''; // Optional email
            const notes = document.getElementById('notes').value.trim();
            const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
            
            if (!recipientName || !whatsappNumber || !buildingNumber || !streetName || !regionDistrict || !city) {
                showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
                return;
            }
            
            // Store checkout data in session storage for verification step
            const checkoutData = {
                recipientName,
                whatsappNumber,
                buildingNumber,
                streetName,
                regionDistrict,
                city,
                country,
                email,
                notes,
                paymentMethod,
                cart: cart
            };
            
            sessionStorage.setItem('premiumTarotCheckoutData', JSON.stringify(checkoutData));
            
            // Generate verification code
            const verificationCode = generateVerificationCode();
            sessionStorage.setItem('premiumTarotVerificationCode', verificationCode);
            
            // Show verification section
            if (verificationSection) {
                checkoutForm.style.display = 'none';
                verificationSection.style.display = 'block';
                
                // In a real implementation, this would be sent via WhatsApp API
                // For demo purposes, show the code in a notification
                showNotification(`رمز التحقق هو: ${verificationCode} (للعرض التوضيحي فقط)`, 'info');
            } else {
                // If no verification section, proceed directly (for development purposes)
                processOrder(checkoutData);
            }
        });
    }
    
    // Verification form submission
    const verificationForm = document.getElementById('verification-form');
    if (verificationForm) {
        verificationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const code = document.getElementById('verification-code').value.trim();
            
            if (!code) {
                showNotification('يرجى إدخال رمز التحقق', 'error');
                return;
            }
            
            // Verify code
            const storedCode = sessionStorage.getItem('premiumTarotVerificationCode');
            
            if (code !== storedCode) {
                showNotification('رمز التحقق غير صحيح', 'error');
                return;
            }
            
            // Get checkout data
            const checkoutData = JSON.parse(sessionStorage.getItem('premiumTarotCheckoutData'));
            
            // Process order
            processOrder(checkoutData);
        });
    }
    
    // Resend verification code
    const resendCodeBtn = document.getElementById('resend-code-btn');
    if (resendCodeBtn) {
        resendCodeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Generate new verification code
            const verificationCode = generateVerificationCode();
            sessionStorage.setItem('premiumTarotVerificationCode', verificationCode);
            
            // In a real implementation, this would be sent via WhatsApp API
            // For demo purposes, show the code in a notification
            showNotification(`تم إرسال رمز التحقق الجديد: ${verificationCode} (للعرض التوضيحي فقط)`, 'info');
        });
    }
    
    // Back to checkout button
    const backToCheckoutBtn = document.getElementById('back-to-checkout-btn');
    if (backToCheckoutBtn) {
        backToCheckoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Show checkout form
            if (checkoutForm && verificationSection) {
                verificationSection.style.display = 'none';
                checkoutForm.style.display = 'block';
            }
        });
    }
}

// Process order after verification
function processOrder(checkoutData) {
    // Generate order number
    const orderNumber = 'PT' + Date.now().toString().slice(-6);
    
    // Calculate total
    let total = 0;
    checkoutData.cart.forEach(item => {
        total += item.price * item.quantity;
    });
    
    // Create order object
    const order = {
        orderNumber: orderNumber,
        date: new Date().toISOString(),
        items: checkoutData.cart,
        total: total,
        shippingAddress: {
            name: checkoutData.recipientName,
            whatsapp: checkoutData.whatsappNumber,
            buildingNumber: checkoutData.buildingNumber,
            streetName: checkoutData.streetName,
            regionDistrict: checkoutData.regionDistrict,
            city: checkoutData.city,
            country: checkoutData.country,
            email: checkoutData.email
        },
        notes: checkoutData.notes,
        paymentMethod: checkoutData.paymentMethod,
        status: 1 // 1 = confirmed, 2 = shipped, 3 = delivered
    };
    
    // Store order in localStorage
    const orders = JSON.parse(localStorage.getItem('premiumTarotOrders')) || [];
    orders.push(order);
    localStorage.setItem('premiumTarotOrders', JSON.stringify(orders));
    
    // Prepare WhatsApp message
    let cartMessage = "طلب جديد #" + orderNumber + ":\n\n";
    cartMessage += "المنتجات:\n";
    
    checkoutData.cart.forEach(item => {
        cartMessage += `${item.name} × ${item.quantity} = ${item.price * item.quantity} ج.م\n`;
    });
    
    cartMessage += `\nالمجموع: ${total} ج.م\n\n`;
    
    // Add shipping information
    cartMessage += "معلومات الشحن:\n";
    cartMessage += `الاسم: ${checkoutData.recipientName}\n`;
    cartMessage += `رقم المبنى: ${checkoutData.buildingNumber}\n`;
    cartMessage += `الشارع: ${checkoutData.streetName}\n`;
    cartMessage += `المنطقة/الحي: ${checkoutData.regionDistrict}\n`;
    cartMessage += `المدينة: ${checkoutData.city}\n`;
    cartMessage += `الدولة: ${checkoutData.country}\n`;
    
    if (checkoutData.email) {
        cartMessage += `البريد الإلكتروني: ${checkoutData.email}\n`;
    }
    
    if (checkoutData.notes) {
        cartMessage += `\nملاحظات: ${checkoutData.notes}\n`;
    }
    
    cartMessage += `\nطريقة الدفع: ${checkoutData.paymentMethod === 'whatsapp' ? 'تحويل عبر WhatsApp' : 'الدفع عند الاستلام'}\n`;
    
    // Encode message for WhatsApp URL
    const encodedMessage = encodeURIComponent(cartMessage);
    
    // Show order confirmation modal if it exists
    const orderConfirmationModal = document.getElementById('orderConfirmationModal');
    if (orderConfirmationModal) {
        const orderNumberElement = document.getElementById('order-number');
        if (orderNumberElement) {
            orderNumberElement.textContent = orderNumber;
        }
        
        const modal = new bootstrap.Modal(orderConfirmationModal);
        modal.show();
        
        // Clear cart after successful order
        localStorage.setItem('premiumTarotCart', JSON.stringify([]));
        
        // Clear checkout and verification data
        sessionStorage.removeItem('premiumTarotCheckoutData');
        sessionStorage.removeItem('premiumTarotVerificationCode');
        
        // Open WhatsApp with the order message after a short delay
        setTimeout(() => {
            window.open(`https://wa.me/YOUR_WHATSAPP_NUMBER?text=${encodedMessage}`, '_blank');
        }, 1000);
    } else {
        // If no modal, open WhatsApp directly
        window.open(`https://wa.me/YOUR_WHATSAPP_NUMBER?text=${encodedMessage}`, '_blank');
        
        // Clear cart after successful order
        localStorage.setItem('premiumTarotCart', JSON.stringify([]));
        
        // Clear checkout and verification data
        sessionStorage.removeItem('premiumTarotCheckoutData');
        sessionStorage.removeItem('premiumTarotVerificationCode');
        
        // Show success message
        showNotification('تم إرسال طلبك بنجاح! سنتواصل معك قريبًا عبر WhatsApp.', 'success');
        
        // Redirect to home page after a delay
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 3000);
    }
}

// Generate verification code
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
