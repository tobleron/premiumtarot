// Premium Tarot - Main JavaScript File
// Language translations
const translations = {
    'ar': {
        'home': "\u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629",
        'products': "\u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A",
        'offers': "\u0627\u0644\u0639\u0631\u0648\u0636",
        'blog': "\u0627\u0644\u0645\u062F\u0648\u0646\u0629",
        'contact': "\u0627\u062A\u0635\u0644 \u0628\u0646\u0627",
        'hero-title': "\u062A\u0627\u0631\u0648 \u0628\u0631\u064A\u0645\u064A\u0648\u0645",
        'hero-description': "\u0645\u0646\u062A\u062C\u0627\u062A \u062A\u0627\u0631\u0648 \u0639\u0627\u0644\u064A\u0629 \u0627\u0644\u062C\u0648\u062F\u0629 \u0648\u0643\u062A\u0628 \u0631\u0648\u062D\u0627\u0646\u064A\u0629",
        'shop-now': "\u062A\u0633\u0648\u0642 \u0627\u0644\u0622\u0646",
        'featured-products': "\u0645\u0646\u062A\u062C\u0627\u062A \u0645\u0645\u064A\u0632\u0629",
        'special-offers': "\u0639\u0631\u0648\u0636 \u062E\u0627\u0635\u0629",
        'add-to-cart': "\u0623\u0636\u0641 \u0625\u0644\u0649 \u0627\u0644\u0633\u0644\u0629",
        'read-more': "\u0627\u0642\u0631\u0623 \u0627\u0644\u0645\u0632\u064A\u062F",
        'shopping-cart': "\u0633\u0644\u0629 \u0627\u0644\u062A\u0633\u0648\u0642",
        'empty-cart': "\u0633\u0644\u0629 \u0627\u0644\u062A\u0633\u0648\u0642 \u0641\u0627\u0631\u063A\u0629",
        'total': "\u0627\u0644\u0645\u062C\u0645\u0648\u0639:",
        'checkout': "\u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u0634\u0631\u0627\u0621",
        'about-us': "\u0639\u0646 \u0628\u0631\u064A\u0645\u064A\u0648\u0645 \u062A\u0627\u0631\u0648",
        'about-description': "\u0646\u0642\u062F\u0645 \u0645\u0646\u062A\u062C\u0627\u062A \u062A\u0627\u0631\u0648 \u0639\u0627\u0644\u064A\u0629 \u0627\u0644\u062C\u0648\u062F\u0629 \u0648\u0643\u062A\u0628 \u0631\u0648\u062D\u0627\u0646\u064A\u0629 \u0644\u0645\u0633\u0627\u0639\u062F\u062A\u0643 \u0641\u064A \u0631\u062D\u0644\u062A\u0643 \u0627\u0644\u0631\u0648\u062D\u0627\u0646\u064A\u0629.",
        'quick-links': "\u0631\u0648\u0627\u0628\u0637 \u0633\u0631\u064A\u0639\u0629",
        'contact-us': "\u0627\u062A\u0635\u0644 \u0628\u0646\u0627",
        'all-rights-reserved': "\u062C\u0645\u064A\u0639 \u0627\u0644\u062D\u0642\u0648\u0642 \u0645\u062D\u0641\u0648\u0638\u0629"
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
if (langSwitchBtn) langSwitchBtn.addEventListener('click', function() {
    const currentLang = this.getAttribute('data-current-lang');
    const newLang = currentLang === 'ar' ? 'en' : 'ar';
    // Update HTML lang and dir attributes
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    // Update button text and data attribute
    this.textContent = newLang === 'ar' ? 'English' : "\u0627\u0644\u0639\u0631\u0628\u064A\u0629";
    this.setAttribute('data-current-lang', newLang);
    // Update all translatable elements
    document.querySelectorAll('[data-lang-key]').forEach((element)=>{
        const key = element.getAttribute('data-lang-key');
        if (translations[newLang][key]) element.textContent = translations[newLang][key];
    });
    // Update CSS for RTL/LTR
    const bootstrapCSS = document.querySelector('link[href*="bootstrap"]');
    if (bootstrapCSS) {
        if (newLang === 'ar') bootstrapCSS.href = '../node_modules/bootstrap/dist/css/bootstrap.rtl.min.css';
        else bootstrapCSS.href = '../node_modules/bootstrap/dist/css/bootstrap.min.css';
    }
});
// Shopping cart functionality
function updateCart() {
    const cartItems = document.querySelector('.cart-items');
    const totalAmount = document.querySelector('.total-amount');
    const emptyCartMessage = document.querySelector('.empty-cart-message');
    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
        totalAmount.textContent = "0 \u062C.\u0645";
        cartItems.innerHTML = emptyCartMessage.outerHTML;
        return;
    }
    emptyCartMessage.style.display = 'none';
    let cartHTML = '';
    let total = 0;
    cart.forEach((item, index)=>{
        total += item.price * item.quantity;
        cartHTML += `
            <div class="cart-item">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>${item.price} \u{62C}.\u{645} \xd7 ${item.quantity}</p>
                </div>
                <div class="cart-item-actions">
                    <button class="remove-item" data-index="${index}">\xd7</button>
                </div>
            </div>
        `;
    });
    cartItems.innerHTML = cartHTML;
    totalAmount.textContent = `${total} \u{62C}.\u{645}`;
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach((button)=>{
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            cart.splice(index, 1);
            updateCart();
        });
    });
}
// Add to cart functionality
cartButtons.forEach((button)=>{
    button.addEventListener('click', function() {
        const productCard = this.closest('.product-card') || this.closest('.offer-card');
        const productName = productCard.querySelector('.product-title, .offer-title').textContent;
        const productPriceText = productCard.querySelector('.product-price, .offer-price').textContent;
        // Extract price from text (assuming format like "250 ج.م" or discount price)
        let productPrice;
        if (productPriceText.includes('discount-price')) productPrice = parseInt(productCard.querySelector('.discount-price').textContent.replace(/\D/g, ''));
        else productPrice = parseInt(productPriceText.replace(/\D/g, ''));
        // Check if product is already in cart
        const existingItemIndex = cart.findIndex((item)=>item.name === productName);
        if (existingItemIndex !== -1) cart[existingItemIndex].quantity += 1;
        else cart.push({
            name: productName,
            price: productPrice,
            quantity: 1
        });
        updateCart();
        cartPreview.classList.add('active');
    });
});
// Close cart functionality
if (closeCartBtn) closeCartBtn.addEventListener('click', function() {
    cartPreview.classList.remove('active');
});
// Checkout functionality
if (checkoutBtn) checkoutBtn.addEventListener('click', function() {
    if (cart.length === 0) {
        alert(translations[currentLang === 'ar' ? 'ar' : 'en']['empty-cart']);
        return;
    }
    // Prepare cart items for WhatsApp message
    let cartMessage = "\u0637\u0644\u0628 \u062C\u062F\u064A\u062F:\n\n";
    cart.forEach((item)=>{
        cartMessage += `${item.name} \xd7 ${item.quantity} = ${item.price * item.quantity} \u{62C}.\u{645}
`;
    });
    // Calculate total
    const total = cart.reduce((sum, item)=>sum + item.price * item.quantity, 0);
    cartMessage += `
\u{627}\u{644}\u{645}\u{62C}\u{645}\u{648}\u{639}: ${total} \u{62C}.\u{645}`;
    // Encode message for WhatsApp URL
    const encodedMessage = encodeURIComponent(cartMessage);
    // Open WhatsApp with the cart message
    window.open(`https://wa.me/YOUR_WHATSAPP_NUMBER?text=${encodedMessage}`, '_blank');
});
// Blog like functionality
document.querySelectorAll('.blog-likes').forEach((likeButton)=>{
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

//# sourceMappingURL=premium-tarot.4f492e9b.js.map
