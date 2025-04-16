// Premium Tarot - Interactive Features
// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Shopping Cart Functionality
    initShoppingCart();
    // Product Category Filtering
    initCategoryFilters();
    // Blog Features
    initBlogFeatures();
    // Language Switcher
    initLanguageSwitcher();
    // WhatsApp Integration
    initWhatsAppIntegration();
});
// Initialize Shopping Cart
function initShoppingCart() {
    // Get cart from localStorage or initialize empty cart
    let cart = JSON.parse(localStorage.getItem('premiumTarotCart')) || [];
    // Cart toggle buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartPreview = document.getElementById('cart-preview');
    const closeCartBtn = document.querySelector('.close-cart');
    const checkoutBtn = document.querySelector('.checkout-btn');
    // Add to cart functionality
    if (addToCartButtons.length > 0) addToCartButtons.forEach((button)=>{
        button.addEventListener('click', function(e) {
            e.preventDefault();
            // Get product details
            const productCard = this.closest('.product-card') || this.closest('.offer-card');
            if (!productCard) return;
            const productName = productCard.querySelector('.product-title, .offer-title').textContent;
            let productPrice;
            // Handle different price formats (regular or discounted)
            if (productCard.querySelector('.discount-price')) productPrice = parseFloat(productCard.querySelector('.discount-price').textContent.replace(/[^\d.]/g, ''));
            else productPrice = parseFloat(productCard.querySelector('.product-price').textContent.replace(/[^\d.]/g, ''));
            // Get product image if available
            let productImage = '';
            if (productCard.querySelector('.product-image img')) productImage = productCard.querySelector('.product-image img').src;
            // Check if product is already in cart
            const existingItemIndex = cart.findIndex((item)=>item.name === productName);
            if (existingItemIndex !== -1) // Increment quantity if product already in cart
            cart[existingItemIndex].quantity += 1;
            else // Add new product to cart
            cart.push({
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            });
            // Save cart to localStorage
            localStorage.setItem('premiumTarotCart', JSON.stringify(cart));
            // Update cart display
            updateCartDisplay();
            // Show cart preview
            if (cartPreview) {
                cartPreview.classList.add('active');
                // Add animation class
                const cartItems = cartPreview.querySelector('.cart-items');
                if (cartItems) {
                    cartItems.classList.add('fade-in');
                    setTimeout(()=>{
                        cartItems.classList.remove('fade-in');
                    }, 1000);
                }
            }
            // Show success message
            showNotification("\u062A\u0645\u062A \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0645\u0646\u062A\u062C \u0625\u0644\u0649 \u0633\u0644\u0629 \u0627\u0644\u062A\u0633\u0648\u0642", 'success');
        });
    });
    // Close cart functionality
    if (closeCartBtn && cartPreview) closeCartBtn.addEventListener('click', function() {
        cartPreview.classList.remove('active');
    });
    // Checkout button functionality
    if (checkoutBtn) checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            showNotification("\u0633\u0644\u0629 \u0627\u0644\u062A\u0633\u0648\u0642 \u0641\u0627\u0631\u063A\u0629", 'error');
            return;
        }
        // Navigate to checkout page
        window.location.href = 'pages/checkout.html';
    });
    // Update cart display on page load
    updateCartDisplay();
    // Function to update cart display
    function updateCartDisplay() {
        const cartItems = document.querySelector('.cart-items');
        const totalAmount = document.querySelector('.total-amount');
        const emptyCartMessage = document.querySelector('.empty-cart-message');
        const cartCount = document.querySelector('.cart-count');
        if (!cartItems || !totalAmount) return;
        if (cart.length === 0) {
            if (emptyCartMessage) emptyCartMessage.style.display = 'block';
            totalAmount.textContent = "0 \u062C.\u0645";
            // Clear cart items
            cartItems.innerHTML = emptyCartMessage ? emptyCartMessage.outerHTML : '<p class="empty-cart-message">\u0633\u0644\u0629 \u0627\u0644\u062A\u0633\u0648\u0642 \u0641\u0627\u0631\u063A\u0629</p>';
            // Update cart count
            if (cartCount) cartCount.textContent = '0';
            return;
        }
        if (emptyCartMessage) emptyCartMessage.style.display = 'none';
        let cartHTML = '';
        let total = 0;
        let itemCount = 0;
        cart.forEach((item, index)=>{
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            itemCount += item.quantity;
            cartHTML += `
                <div class="cart-item">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>${item.price} \u{62C}.\u{645} \xd7 ${item.quantity}</p>
                    </div>
                    <div class="cart-item-actions">
                        <button class="quantity-btn decrease-quantity" data-index="${index}">-</button>
                        <span class="item-quantity">${item.quantity}</span>
                        <button class="quantity-btn increase-quantity" data-index="${index}">+</button>
                        <button class="remove-item" data-index="${index}">\xd7</button>
                    </div>
                </div>
            `;
        });
        cartItems.innerHTML = cartHTML;
        totalAmount.textContent = `${total} \u{62C}.\u{645}`;
        // Update cart count
        if (cartCount) cartCount.textContent = itemCount.toString();
        // Add event listeners to quantity and remove buttons
        document.querySelectorAll('.increase-quantity').forEach((button)=>{
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart[index].quantity += 1;
                localStorage.setItem('premiumTarotCart', JSON.stringify(cart));
                updateCartDisplay();
            });
        });
        document.querySelectorAll('.decrease-quantity').forEach((button)=>{
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                if (cart[index].quantity > 1) {
                    cart[index].quantity -= 1;
                    localStorage.setItem('premiumTarotCart', JSON.stringify(cart));
                    updateCartDisplay();
                }
            });
        });
        document.querySelectorAll('.remove-item').forEach((button)=>{
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart.splice(index, 1);
                localStorage.setItem('premiumTarotCart', JSON.stringify(cart));
                updateCartDisplay();
            });
        });
    }
}
// Initialize Category Filters
function initCategoryFilters() {
    const categoryFilters = document.querySelectorAll('.category-filter');
    if (categoryFilters.length > 0) {
        const itemsToFilter = document.querySelectorAll('[data-category]');
        categoryFilters.forEach((filter)=>{
            filter.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                // Update active filter
                categoryFilters.forEach((f)=>f.classList.remove('active'));
                this.classList.add('active');
                // Filter items
                itemsToFilter.forEach((item)=>{
                    if (category === 'all' || item.getAttribute('data-category') === category) {
                        item.style.display = 'block';
                        // Add animation
                        item.classList.add('fade-in');
                        setTimeout(()=>{
                            item.classList.remove('fade-in');
                        }, 1000);
                    } else item.style.display = 'none';
                });
            });
        });
    }
}
// Initialize Blog Features
function initBlogFeatures() {
    // Blog like functionality
    const likeButtons = document.querySelectorAll('.blog-likes');
    if (likeButtons.length > 0) {
        // Get liked posts from localStorage
        const likedPosts = JSON.parse(localStorage.getItem('premiumTarotLikedPosts')) || [];
        likeButtons.forEach((button)=>{
            const postId = button.closest('[data-post-id]')?.getAttribute('data-post-id') || button.closest('.blog-card')?.getAttribute('data-post-id') || 'unknown';
            // Check if post is already liked
            if (likedPosts.includes(postId)) {
                const likeIcon = button.querySelector('i');
                if (likeIcon) {
                    likeIcon.classList.remove('far');
                    likeIcon.classList.add('fas');
                }
            }
            button.addEventListener('click', function() {
                const likeIcon = this.querySelector('i');
                if (!likeIcon) return;
                const likeCount = parseInt(this.textContent.replace(/\D/g, '')) || 0;
                if (likeIcon.classList.contains('far')) {
                    // Like the post
                    likeIcon.classList.remove('far');
                    likeIcon.classList.add('fas');
                    this.innerHTML = this.innerHTML.replace(likeCount, likeCount + 1);
                    // Add to liked posts
                    if (!likedPosts.includes(postId)) {
                        likedPosts.push(postId);
                        localStorage.setItem('premiumTarotLikedPosts', JSON.stringify(likedPosts));
                    }
                } else {
                    // Unlike the post
                    likeIcon.classList.remove('fas');
                    likeIcon.classList.add('far');
                    this.innerHTML = this.innerHTML.replace(likeCount, likeCount - 1);
                    // Remove from liked posts
                    const index = likedPosts.indexOf(postId);
                    if (index !== -1) {
                        likedPosts.splice(index, 1);
                        localStorage.setItem('premiumTarotLikedPosts', JSON.stringify(likedPosts));
                    }
                }
            });
        });
    }
    // Blog comment functionality
    const commentForm = document.getElementById('comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const nameInput = document.getElementById('commenter-name');
            const commentInput = document.getElementById('comment-text');
            if (!nameInput || !commentInput) return;
            const name = nameInput.value.trim();
            const comment = commentInput.value.trim();
            if (!name || !comment) {
                showNotification("\u064A\u0631\u062C\u0649 \u0645\u0644\u0621 \u062C\u0645\u064A\u0639 \u0627\u0644\u062D\u0642\u0648\u0644 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629", 'error');
                return;
            }
            // Get post ID
            const postId = document.querySelector('.blog-post')?.getAttribute('data-post-id') || new URLSearchParams(window.location.search).get('id') || 'unknown';
            // Get existing comments
            let comments = JSON.parse(localStorage.getItem(`premiumTarotComments_${postId}`)) || [];
            // Add new comment
            comments.push({
                name: name,
                text: comment,
                date: new Date().toLocaleDateString('ar-EG')
            });
            // Save comments
            localStorage.setItem(`premiumTarotComments_${postId}`, JSON.stringify(comments));
            // Update comment count
            const commentCount = document.getElementById('comment-count');
            if (commentCount) commentCount.textContent = comments.length.toString();
            // Add comment to DOM
            addCommentToDOM(name, comment, new Date().toLocaleDateString('ar-EG'));
            // Clear form
            commentForm.reset();
            // Show success message
            showNotification("\u062A\u0645 \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u062A\u0639\u0644\u064A\u0642 \u0628\u0646\u062C\u0627\u062D", 'success');
        });
        // Load existing comments
        const postId = document.querySelector('.blog-post')?.getAttribute('data-post-id') || new URLSearchParams(window.location.search).get('id') || 'unknown';
        const comments = JSON.parse(localStorage.getItem(`premiumTarotComments_${postId}`)) || [];
        // Update comment count
        const commentCount = document.getElementById('comment-count');
        if (commentCount) commentCount.textContent = comments.length.toString();
        // Add comments to DOM
        const commentsList = document.getElementById('comments-list');
        if (commentsList && comments.length > 0) {
            // Remove no comments message
            const noCommentsMessage = commentsList.querySelector('.no-comments-message');
            if (noCommentsMessage) noCommentsMessage.remove();
            // Add comments
            comments.forEach((comment)=>{
                addCommentToDOM(comment.name, comment.text, comment.date);
            });
        }
    }
    // Function to add comment to DOM
    function addCommentToDOM(name, text, date) {
        const commentsList = document.getElementById('comments-list');
        if (!commentsList) return;
        // Remove no comments message
        const noCommentsMessage = commentsList.querySelector('.no-comments-message');
        if (noCommentsMessage) noCommentsMessage.remove();
        // Create comment element
        const commentElement = document.createElement('div');
        commentElement.className = 'comment fade-in';
        commentElement.innerHTML = `
            <div class="comment-header">
                <h5 class="commenter-name">${name}</h5>
                <span class="comment-date">${date}</span>
            </div>
            <div class="comment-body">
                <p>${text}</p>
            </div>
        `;
        // Add to DOM
        commentsList.appendChild(commentElement);
    }
}
// Initialize Language Switcher
function initLanguageSwitcher() {
    const langSwitchBtn = document.getElementById('lang-switch');
    if (langSwitchBtn) {
        // Get current language from localStorage or default to 'ar'
        const savedLang = localStorage.getItem('premiumTarotLanguage') || 'ar';
        // Set initial language
        setLanguage(savedLang);
        langSwitchBtn.addEventListener('click', function() {
            const currentLang = this.getAttribute('data-current-lang');
            const newLang = currentLang === 'ar' ? 'en' : 'ar';
            // Save language preference
            localStorage.setItem('premiumTarotLanguage', newLang);
            // Set language
            setLanguage(newLang);
        });
    }
    // Function to set language
    function setLanguage(lang) {
        // Update HTML lang and dir attributes
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        // Update language switch button
        const langSwitchBtn = document.getElementById('lang-switch');
        if (langSwitchBtn) {
            langSwitchBtn.textContent = lang === 'ar' ? 'English' : "\u0627\u0644\u0639\u0631\u0628\u064A\u0629";
            langSwitchBtn.setAttribute('data-current-lang', lang);
        }
        // Update Bootstrap CSS
        const bootstrapCSS = document.querySelector('link[href*="bootstrap"]');
        if (bootstrapCSS) {
            const basePath = bootstrapCSS.href.substring(0, bootstrapCSS.href.lastIndexOf('/') + 1);
            bootstrapCSS.href = lang === 'ar' ? `${basePath}bootstrap.rtl.min.css` : `${basePath}bootstrap.min.css`;
        }
        // Update translatable elements
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
                'all-rights-reserved': "\u062C\u0645\u064A\u0639 \u0627\u0644\u062D\u0642\u0648\u0642 \u0645\u062D\u0641\u0648\u0638\u0629",
                'all-categories': "\u062C\u0645\u064A\u0639 \u0627\u0644\u0641\u0626\u0627\u062A",
                'tarot-cards': "\u0628\u0637\u0627\u0642\u0627\u062A \u062A\u0627\u0631\u0648",
                'books': "\u0643\u062A\u0628",
                'candles': "\u0634\u0645\u0648\u0639",
                'accessories': "\u0625\u0643\u0633\u0633\u0648\u0627\u0631\u0627\u062A"
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
                'all-rights-reserved': 'All Rights Reserved',
                'all-categories': 'All Categories',
                'tarot-cards': 'Tarot Cards',
                'books': 'Books',
                'candles': 'Candles',
                'accessories': 'Accessories'
            }
        };
        document.querySelectorAll('[data-lang-key]').forEach((element)=>{
            const key = element.getAttribute('data-lang-key');
            if (translations[lang][key]) element.textContent = translations[lang][key];
        });
    }
}
// Initialize WhatsApp Integration
function initWhatsAppIntegration() {
    // Contact form WhatsApp integration
    const contactForm = document.getElementById('contactForm');
    if (contactForm) contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const whatsapp = document.getElementById('whatsapp').value.trim();
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value.trim();
        if (!name || !whatsapp || !subject || !message) {
            showNotification("\u064A\u0631\u062C\u0649 \u0645\u0644\u0621 \u062C\u0645\u064A\u0639 \u0627\u0644\u062D\u0642\u0648\u0644 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629", 'error');
            return;
        }
        // Prepare message for WhatsApp
        let whatsappMessage = `\u{631}\u{633}\u{627}\u{644}\u{629} \u{62C}\u{62F}\u{64A}\u{62F}\u{629} \u{645}\u{646} ${name}:\n\n`;
        whatsappMessage += `\u{627}\u{644}\u{645}\u{648}\u{636}\u{648}\u{639}: ${document.getElementById('subject').options[document.getElementById('subject').selectedIndex].text}\n\n`;
        whatsappMessage += `${message}\n\n`;
        whatsappMessage += `\u{631}\u{642}\u{645} WhatsApp \u{644}\u{644}\u{62A}\u{648}\u{627}\u{635}\u{644}: ${whatsapp}`;
        // Encode message for WhatsApp URL
        const encodedMessage = encodeURIComponent(whatsappMessage);
        // Open WhatsApp with the message
        window.open(`https://wa.me/YOUR_WHATSAPP_NUMBER?text=${encodedMessage}`, '_blank');
        // Reset form
        contactForm.reset();
        // Show success message
        showNotification("\u062A\u0645 \u0625\u0631\u0633\u0627\u0644 \u0631\u0633\u0627\u0644\u062A\u0643 \u0628\u0646\u062C\u0627\u062D! \u0633\u0646\u062A\u0648\u0627\u0635\u0644 \u0645\u0639\u0643 \u0642\u0631\u064A\u0628\u064B\u0627.", 'success');
    });
    // Checkout form WhatsApp integration
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Get cart from localStorage
        const cart = JSON.parse(localStorage.getItem('premiumTarotCart')) || [];
        if (cart.length === 0) {
            showNotification("\u0633\u0644\u0629 \u0627\u0644\u062A\u0633\u0648\u0642 \u0641\u0627\u0631\u063A\u0629. \u064A\u0631\u062C\u0649 \u0625\u0636\u0627\u0641\u0629 \u0645\u0646\u062A\u062C\u0627\u062A \u0642\u0628\u0644 \u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u0634\u0631\u0627\u0621.", 'error');
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
        const notes = document.getElementById('notes').value.trim();
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
        if (!recipientName || !whatsappNumber || !buildingNumber || !streetName || !regionDistrict || !city) {
            showNotification("\u064A\u0631\u062C\u0649 \u0645\u0644\u0621 \u062C\u0645\u064A\u0639 \u0627\u0644\u062D\u0642\u0648\u0644 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629", 'error');
            return;
        }
        // Generate order number
        const orderNumber = 'PT' + Date.now().toString().slice(-6);
        // Prepare cart items for WhatsApp message
        let cartMessage = "\u0637\u0644\u0628 \u062C\u062F\u064A\u062F #" + orderNumber + ":\n\n";
        cartMessage += "\u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A:\n";
        let total = 0;
        cart.forEach((item)=>{
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            cartMessage += `${item.name} \xd7 ${item.quantity} = ${itemTotal} \u{62C}.\u{645}
`;
        });
        cartMessage += `
\u{627}\u{644}\u{645}\u{62C}\u{645}\u{648}\u{639}: ${total} \u{62C}.\u{645}

`;
        // Add shipping information
        cartMessage += "\u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0627\u0644\u0634\u062D\u0646:\n";
        cartMessage += `\u{627}\u{644}\u{627}\u{633}\u{645}: ${recipientName}\n`;
        cartMessage += `\u{631}\u{642}\u{645} \u{627}\u{644}\u{645}\u{628}\u{646}\u{649}: ${buildingNumber}\n`;
        cartMessage += `\u{627}\u{644}\u{634}\u{627}\u{631}\u{639}: ${streetName}\n`;
        cartMessage += `\u{627}\u{644}\u{645}\u{646}\u{637}\u{642}\u{629}/\u{627}\u{644}\u{62D}\u{64A}: ${regionDistrict}\n`;
        cartMessage += `\u{627}\u{644}\u{645}\u{62F}\u{64A}\u{646}\u{629}: ${city}\n`;
        cartMessage += `\u{627}\u{644}\u{62F}\u{648}\u{644}\u{629}: ${country}\n`;
        if (notes) cartMessage += `
\u{645}\u{644}\u{627}\u{62D}\u{638}\u{627}\u{62A}: ${notes}\n`;
        cartMessage += `
\u{637}\u{631}\u{64A}\u{642}\u{629} \u{627}\u{644}\u{62F}\u{641}\u{639}: ${paymentMethod === 'whatsapp' ? "\u062A\u062D\u0648\u064A\u0644 \u0639\u0628\u0631 WhatsApp" : "\u0627\u0644\u062F\u0641\u0639 \u0639\u0646\u062F \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645"}\n`;
        // Encode message for WhatsApp URL
        const encodedMessage = encodeURIComponent(cartMessage);
        // Show order confirmation modal if it exists
        const orderConfirmationModal = document.getElementById('orderConfirmationModal');
        if (orderConfirmationModal) {
            const orderNumberElement = document.getElementById('order-number');
            if (orderNumberElement) orderNumberElement.textContent = orderNumber;
            const modal = new bootstrap.Modal(orderConfirmationModal);
            modal.show();
            // Clear cart after successful order
            localStorage.setItem('premiumTarotCart', JSON.stringify([]));
            // Open WhatsApp with the order message after a short delay
            setTimeout(()=>{
                window.open(`https://wa.me/YOUR_WHATSAPP_NUMBER?text=${encodedMessage}`, '_blank');
            }, 1000);
        } else {
            // If no modal, open WhatsApp directly
            window.open(`https://wa.me/YOUR_WHATSAPP_NUMBER?text=${encodedMessage}`, '_blank');
            // Clear cart after successful order
            localStorage.setItem('premiumTarotCart', JSON.stringify([]));
            // Show success message
            showNotification("\u062A\u0645 \u0625\u0631\u0633\u0627\u0644 \u0637\u0644\u0628\u0643 \u0628\u0646\u062C\u0627\u062D! \u0633\u0646\u062A\u0648\u0627\u0635\u0644 \u0645\u0639\u0643 \u0642\u0631\u064A\u0628\u064B\u0627 \u0639\u0628\u0631 WhatsApp.", 'success');
            // Reset form
            checkoutForm.reset();
        }
    });
}
// Notification function
function showNotification(message, type = 'info') {
    // Check if notification container exists, create if not
    let notificationContainer = document.querySelector('.notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .notification-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
            }
            
            .notification {
                padding: 15px 20px;
                margin-bottom: 10px;
                border-radius: 4px;
                color: white;
                font-weight: 500;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-width: 300px;
                max-width: 400px;
                animation: slideIn 0.3s ease-out forwards;
            }
            
            .notification.success {
                background-color: #28a745;
            }
            
            .notification.error {
                background-color: #dc3545;
            }
            
            .notification.info {
                background-color: #17a2b8;
            }
            
            .notification.warning {
                background-color: #ffc107;
                color: #212529;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                margin-left: 10px;
            }
            
            .notification.warning .notification-close {
                color: #212529;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            [dir="rtl"] .notification-container {
                right: auto;
                left: 20px;
            }
            
            [dir="rtl"] .notification-close {
                margin-left: 0;
                margin-right: 10px;
            }
            
            [dir="rtl"] @keyframes slideIn {
                from {
                    transform: translateX(-100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            [dir="rtl"] @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(-100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    // Add to container
    notificationContainer.appendChild(notification);
    // Add close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', function() {
        closeNotification(notification);
    });
    // Auto close after 5 seconds
    setTimeout(()=>{
        closeNotification(notification);
    }, 5000);
    // Function to close notification
    function closeNotification(notification) {
        notification.style.animation = 'slideOut 0.3s ease-in forwards';
        setTimeout(()=>{
            notification.remove();
        }, 300);
    }
}

//# sourceMappingURL=premium-tarot.d7f33fde.js.map
