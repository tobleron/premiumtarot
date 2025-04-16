// Premium Tarot - Main JavaScript File

// Language translations
const translations = {
    'ar': {
        'home': 'الرئيسية',
        'products': 'المنتجات',
        'offers': 'العروض',
        'blog': 'المدونة',
        'contact': 'اتصل بنا',
        'hero-title': 'تارو بريميوم',
        'hero-description': 'منتجات تارو عالية الجودة وكتب روحانية',
        'shop-now': 'تسوق الآن',
        'featured-products': 'منتجات مميزة',
        'special-offers': 'عروض خاصة',
        'add-to-cart': 'أضف إلى السلة',
        'read-more': 'اقرأ المزيد',
        'shopping-cart': 'سلة التسوق',
        'empty-cart': 'سلة التسوق فارغة',
        'total': 'المجموع:',
        'checkout': 'إتمام الشراء',
        'about-us': 'عن بريميوم تارو',
        'about-description': 'نقدم منتجات تارو عالية الجودة وكتب روحانية لمساعدتك في رحلتك الروحانية.',
        'quick-links': 'روابط سريعة',
        'contact-us': 'اتصل بنا',
        'all-rights-reserved': 'جميع الحقوق محفوظة'
    },
    'en': {
        'home': 'Home',
        'products': 'Products',
        'offers': 'Offers',
        'blog': 'Blog',
        'contact': 'Contact',
        'hero-title': 'Premium Tarot',
        'hero-description': 'High-quality tarot products and spiritual books',
        'shop-now': 'Shop Now',
        'featured-products': 'Featured Products',
        'special-offers': 'Special Offers',
        'add-to-cart': 'Add to Cart',
        'read-more': 'Read More',
        'shopping-cart': 'Shopping Cart',
        'empty-cart': 'Your cart is empty',
        'total': 'Total:',
        'checkout': 'Checkout',
        'about-us': 'About Premium Tarot',
        'about-description': 'We offer high-quality tarot products and spiritual books to help you on your spiritual journey.',
        'quick-links': 'Quick Links',
        'contact-us': 'Contact Us',
        'all-rights-reserved': 'All Rights Reserved'
    }
};

// DOM Elements
const langSwitchBtn = document.getElementById('lang-switch');
const cartButtons = document.querySelectorAll('.add-to-cart');
const cartPreview = document.getElementById('cart-preview');
const closeCartBtn = document.querySelector('.close-cart');
const checkoutBtn = document.querySelector('.checkout-btn');

// Initialize cart
let cart = [];
let currentLang = 'ar';

// Language switcher functionality
if (langSwitchBtn) {
    langSwitchBtn.addEventListener('click', function() {
        const currentLang = this.getAttribute('data-current-lang');
        const newLang = currentLang === 'ar' ? 'en' : 'ar';
        
        // Update HTML lang and dir attributes
        document.documentElement.lang = newLang;
        document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
        
        // Update button text and data attribute
        this.textContent = newLang === 'ar' ? 'English' : 'العربية';
        this.setAttribute('data-current-lang', newLang);
        
        // Update all translatable elements
        document.querySelectorAll('[data-lang-key]').forEach(element => {
            const key = element.getAttribute('data-lang-key');
            if (translations[newLang][key]) {
                element.textContent = translations[newLang][key];
            }
        });
        
        // Update CSS for RTL/LTR
        const bootstrapCSS = document.querySelector('link[href*="bootstrap"]');
        if (bootstrapCSS) {
            if (newLang === 'ar') {
                bootstrapCSS.href = '../node_modules/bootstrap/dist/css/bootstrap.rtl.min.css';
            } else {
                bootstrapCSS.href = '../node_modules/bootstrap/dist/css/bootstrap.min.css';
            }
        }
    });
}

// Shopping cart functionality
function updateCart() {
    const cartItems = document.querySelector('.cart-items');
    const totalAmount = document.querySelector('.total-amount');
    const emptyCartMessage = document.querySelector('.empty-cart-message');
    
    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
        totalAmount.textContent = '0 ج.م';
        cartItems.innerHTML = emptyCartMessage.outerHTML;
        return;
    }
    
    emptyCartMessage.style.display = 'none';
    
    let cartHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        cartHTML += `
            <div class="cart-item">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>${item.price} ج.م × ${item.quantity}</p>
                </div>
                <div class="cart-item-actions">
                    <button class="remove-item" data-index="${index}">×</button>
                </div>
            </div>
        `;
    });
    
    cartItems.innerHTML = cartHTML;
    totalAmount.textContent = `${total} ج.م`;
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            cart.splice(index, 1);
            updateCart();
        });
    });
}

// Add to cart functionality
cartButtons.forEach(button => {
    button.addEventListener('click', function() {
        const productCard = this.closest('.product-card') || this.closest('.offer-card');
        const productName = productCard.querySelector('.product-title, .offer-title').textContent;
        const productPriceText = productCard.querySelector('.product-price, .offer-price').textContent;
        
        // Extract price from text (assuming format like "250 ج.م" or discount price)
        let productPrice;
        if (productPriceText.includes('discount-price')) {
            productPrice = parseInt(productCard.querySelector('.discount-price').textContent.replace(/\D/g, ''));
        } else {
            productPrice = parseInt(productPriceText.replace(/\D/g, ''));
        }
        
        // Check if product is already in cart
        const existingItemIndex = cart.findIndex(item => item.name === productName);
        
        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push({
                name: productName,
                price: productPrice,
                quantity: 1
            });
        }
        
        updateCart();
        cartPreview.classList.add('active');
    });
});

// Close cart functionality
if (closeCartBtn) {
    closeCartBtn.addEventListener('click', function() {
        cartPreview.classList.remove('active');
    });
}

// Checkout functionality
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            alert(translations[currentLang === 'ar' ? 'ar' : 'en']['empty-cart']);
            return;
        }
        
        // Prepare cart items for WhatsApp message
        let cartMessage = "طلب جديد:\n\n";
        cart.forEach(item => {
            cartMessage += `${item.name} × ${item.quantity} = ${item.price * item.quantity} ج.م\n`;
        });
        
        // Calculate total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartMessage += `\nالمجموع: ${total} ج.م`;
        
        // Encode message for WhatsApp URL
        const encodedMessage = encodeURIComponent(cartMessage);
        
        // Open WhatsApp with the cart message
        window.open(`https://wa.me/YOUR_WHATSAPP_NUMBER?text=${encodedMessage}`, '_blank');
    });
}

// Blog like functionality
document.querySelectorAll('.blog-likes').forEach(likeButton => {
    likeButton.addEventListener('click', function() {
        const likeIcon = this.querySelector('i');
        const likeCount = parseInt(this.textContent.replace(/\D/g, ''));
        
        if (likeIcon.classList.contains('far')) {
            // Like the post
            likeIcon.classList.remove('far');
            likeIcon.classList.add('fas');
            this.textContent = this.textContent.replace(likeCount, likeCount + 1);
        } else {
            // Unlike the post
            likeIcon.classList.remove('fas');
            likeIcon.classList.add('far');
            this.textContent = this.textContent.replace(likeCount, likeCount - 1);
        }
    });
});

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Set initial language
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';
    
    // Initialize cart
    updateCart();
    
    // Add CSS for cart items
    const style = document.createElement('style');
    style.textContent = `
        .cart-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 0;
            border-bottom: 1px solid var(--medium-gray);
        }
        
        .cart-item-details h4 {
            font-size: 1rem;
            margin-bottom: 0.25rem;
        }
        
        .remove-item {
            background: none;
            border: none;
            color: var(--primary-color);
            font-size: 1.2rem;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);
});
