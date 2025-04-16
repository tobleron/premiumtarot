/**
 * Premium Tarot Admin Panel JavaScript
 * This file handles all admin panel functionality including:
 * - Authentication with GitHub API
 * - Order management
 * - Product management
 * - Blog post management
 * - Site settings
 */

// Global variables
let githubToken = '';
let currentOrderId = null;
let currentProductId = null;
let currentPostId = null;

// DOM Elements
const adminLogin = document.getElementById('admin-login');
const adminDashboard = document.getElementById('admin-dashboard');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');

// Admin sections
const ordersSection = document.getElementById('orders-section');
const productsSection = document.getElementById('products-section');
const blogSection = document.getElementById('blog-section');
const settingsSection = document.getElementById('settings-section');

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const storedToken = localStorage.getItem('githubToken');
    if (storedToken) {
        githubToken = storedToken;
        showDashboard();
        loadOrders();
    }

    // Set up event listeners
    setupEventListeners();
});

// Set up all event listeners
function setupEventListeners() {
    // Login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const token = document.getElementById('github-token').value;
        authenticateWithGitHub(token);
    });

    // Logout button
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });

    // Admin navigation
    document.querySelectorAll('.admin-nav .nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
            
            // Set active class
            document.querySelectorAll('.admin-nav .nav-link').forEach(navLink => {
                navLink.classList.remove('active');
            });
            this.classList.add('active');
            
            // Load section data if needed
            if (section === 'orders') loadOrders();
            if (section === 'products') loadProducts();
            if (section === 'blog') loadBlogPosts();
            if (section === 'settings') loadSettings();
        });
    });

    // Orders section
    document.getElementById('refresh-orders').addEventListener('click', loadOrders);
    document.getElementById('order-status-filter').addEventListener('change', filterOrders);
    document.getElementById('order-search').addEventListener('input', filterOrders);
    
    // Order details modal
    document.getElementById('update-status-btn').addEventListener('click', updateOrderStatus);
    
    // Products section
    document.getElementById('add-product-btn').addEventListener('click', showProductForm);
    document.getElementById('save-product-btn').addEventListener('click', saveProduct);
    document.getElementById('product-image').addEventListener('change', previewProductImage);
    
    // Blog section
    document.getElementById('add-post-btn').addEventListener('click', showBlogForm);
    document.getElementById('save-post-btn').addEventListener('click', saveBlogPost);
    document.getElementById('post-image').addEventListener('change', previewPostImage);
    
    // Settings form
    document.getElementById('settings-form').addEventListener('submit', saveSettings);
}

// Authentication with GitHub
function authenticateWithGitHub(token) {
    // Test the token by making a request to the GitHub API
    fetch('https://api.github.com/user', {
        headers: {
            'Authorization': `token ${token}`
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Authentication failed');
        }
    })
    .then(data => {
        // Store token and show dashboard
        githubToken = token;
        localStorage.setItem('githubToken', token);
        showDashboard();
        loadOrders();
    })
    .catch(error => {
        alert('Authentication failed. Please check your token and try again.');
        console.error('Authentication error:', error);
    });
}

// Logout function
function logout() {
    githubToken = '';
    localStorage.removeItem('githubToken');
    showLoginForm();
}

// Show dashboard and hide login form
function showDashboard() {
    adminLogin.style.display = 'none';
    adminDashboard.style.display = 'block';
}

// Show login form and hide dashboard
function showLoginForm() {
    adminLogin.style.display = 'block';
    adminDashboard.style.display = 'none';
    loginForm.reset();
}

// Show specific admin section
function showSection(section) {
    // Hide all sections
    ordersSection.style.display = 'none';
    productsSection.style.display = 'none';
    blogSection.style.display = 'none';
    settingsSection.style.display = 'none';
    
    // Show selected section
    if (section === 'orders') ordersSection.style.display = 'block';
    if (section === 'products') productsSection.style.display = 'block';
    if (section === 'blog') blogSection.style.display = 'block';
    if (section === 'settings') settingsSection.style.display = 'block';
}

// ===== ORDER MANAGEMENT =====

// Load orders from local storage
function loadOrders() {
    // In a real implementation, this would fetch from a database
    // For now, we'll use localStorage to simulate data storage
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // If no orders exist, create some sample data
    if (orders.length === 0) {
        orders = createSampleOrders();
        localStorage.setItem('orders', JSON.stringify(orders));
    }
    
    displayOrders(orders);
}

// Create sample orders for demonstration
function createSampleOrders() {
    return [
        {
            id: 'ORD-' + Date.now() + '-1',
            customerName: 'أحمد محمد',
            whatsapp: '+201005684094',
            email: 'arto.eg@gmail.com',
            address: 'شارع 10، رقم 5',
            city: 'القاهرة',
            country: 'مصر',
            date: new Date().toISOString(),
            status: 'pending',
            statusNotes: '',
            products: [
                { name: 'مجموعة تارو رايدر وايت', price: 850, quantity: 1 },
                { name: 'كتاب أسرار التارو', price: 350, quantity: 1 }
            ],
            subtotal: 1200,
            shipping: 0,
            total: 1200
        },
        {
            id: 'ORD-' + Date.now() + '-2',
            customerName: 'سارة أحمد',
            whatsapp: '+201234567890',
            email: 'sara@example.com',
            address: 'شارع المعز، رقم 15',
            city: 'الإسكندرية',
            country: 'مصر',
            date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
            status: 'confirmed',
            statusNotes: 'تم تأكيد الطلب وجاري تجهيزه',
            products: [
                { name: 'مجموعة أوراكل الملائكة', price: 950, quantity: 1 }
            ],
            subtotal: 950,
            shipping: 50,
            total: 1000
        },
        {
            id: 'ORD-' + Date.now() + '-3',
            customerName: 'محمد علي',
            whatsapp: '+201987654321',
            email: 'mohamed@example.com',
            address: 'شارع النصر، رقم 8',
            city: 'الجيزة',
            country: 'مصر',
            date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            status: 'shipped',
            statusNotes: 'تم شحن الطلب مع شركة أرامكس، رقم التتبع: ARX123456789',
            products: [
                { name: 'مجموعة تارو الظلال', price: 750, quantity: 1 },
                { name: 'حامل بلوري للتارو', price: 450, quantity: 1 },
                { name: 'شموع معطرة للتأمل', price: 200, quantity: 2 }
            ],
            subtotal: 1600,
            shipping: 0,
            total: 1600
        }
    ];
}

// Display orders in the table
function displayOrders(orders) {
    const tableBody = document.getElementById('orders-table-body');
    tableBody.innerHTML = '';
    
    if (orders.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center">لا توجد طلبات</td></tr>';
        return;
    }
    
    orders.forEach(order => {
        const row = document.createElement('tr');
        
        // Format date
        const orderDate = new Date(order.date);
        const formattedDate = orderDate.toLocaleDateString('ar-EG');
        
        // Create status badge
        const statusBadge = `<span class="status-badge ${order.status}">${getStatusText(order.status)}</span>`;
        
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.customerName}</td>
            <td><a href="https://wa.me/${order.whatsapp.replace('+', '')}" target="_blank">${order.whatsapp}</a></td>
            <td>${order.total} ج.م</td>
            <td>${formattedDate}</td>
            <td>${statusBadge}</td>
            <td>
                <button class="action-btn view" onclick="viewOrderDetails('${order.id}')">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Filter orders based on status and search term
function filterOrders() {
    const statusFilter = document.getElementById('order-status-filter').value;
    const searchTerm = document.getElementById('order-search').value.toLowerCase();
    
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Filter by status
    if (statusFilter !== 'all') {
        orders = orders.filter(order => order.status === statusFilter);
    }
    
    // Filter by search term
    if (searchTerm) {
        orders = orders.filter(order => 
            order.id.toLowerCase().includes(searchTerm) ||
            order.customerName.toLowerCase().includes(searchTerm)
        );
    }
    
    displayOrders(orders);
}

// View order details
function viewOrderDetails(orderId) {
    currentOrderId = orderId;
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.id === orderId);
    
    if (!order) return;
    
    // Fill modal with order details
    document.getElementById('modal-order-id').textContent = order.id;
    document.getElementById('modal-customer-name').textContent = order.customerName;
    document.getElementById('modal-whatsapp').textContent = order.whatsapp;
    document.getElementById('modal-email').textContent = order.email || 'غير متوفر';
    document.getElementById('modal-address').textContent = order.address;
    document.getElementById('modal-city').textContent = order.city;
    document.getElementById('modal-country').textContent = order.country;
    
    // Products
    const productsTable = document.getElementById('modal-products');
    productsTable.innerHTML = '';
    
    order.products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.price} ج.م</td>
            <td>${product.quantity}</td>
            <td>${product.price * product.quantity} ج.م</td>
        `;
        productsTable.appendChild(row);
    });
    
    // Totals
    document.getElementById('modal-subtotal').textContent = `${order.subtotal} ج.م`;
    document.getElementById('modal-shipping').textContent = order.shipping > 0 ? `${order.shipping} ج.م` : 'مجاني';
    document.getElementById('modal-total').textContent = `${order.total} ج.م`;
    
    // Status
    document.getElementById('update-status').value = order.status;
    document.getElementById('status-notes').value = order.statusNotes || '';
    
    // Update progress bar and status icons
    updateStatusVisuals(order.status);
    
    // Show modal
    const orderDetailsModal = new bootstrap.Modal(document.getElementById('orderDetailsModal'));
    orderDetailsModal.show();
}

// Update order status
function updateOrderStatus() {
    if (!currentOrderId) return;
    
    const newStatus = document.getElementById('update-status').value;
    const statusNotes = document.getElementById('status-notes').value;
    
    // Update order in localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderIndex = orders.findIndex(o => o.id === currentOrderId);
    
    if (orderIndex !== -1) {
        orders[orderIndex].status = newStatus;
        orders[orderIndex].statusNotes = statusNotes;
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Update status visuals
        updateStatusVisuals(newStatus);
        
        // Refresh orders table
        displayOrders(orders);
        
        // Show success message
        alert('تم تحديث حالة الطلب بنجاح');
    }
}

// Update status visuals in the modal
function updateStatusVisuals(status) {
    // Update progress bar
    const progressBar = document.getElementById('modal-progress-bar');
    let progressPercentage = 0;
    
    switch (status) {
        case 'pending':
            progressPercentage = 25;
            break;
        case 'confirmed':
            progressPercentage = 50;
            break;
        case 'shipped':
            progressPercentage = 75;
            break;
        case 'delivered':
            progressPercentage = 100;
            break;
    }
    
    progressBar.style.width = `${progressPercentage}%`;
    progressBar.setAttribute('aria-valuenow', progressPercentage);
    
    // Update status icons
    const statusSteps = document.querySelectorAll('.status-step .status-icon');
    statusSteps.forEach(icon => {
        icon.classList.remove('active');
    });
    
    // Activate current and previous steps
    const statusOrder = ['pending', 'confirmed', 'shipped', 'delivered'];
    const currentStatusIndex = statusOrder.indexOf(status);
    
    for (let i = 0; i <= currentStatusIndex; i++) {
        const step = document.querySelector(`.status-step[data-status="${statusOrder[i]}"] .status-icon`);
        if (step) step.classList.add('active');
    }
}

// Get status text in Arabic
function getStatusText(status) {
    switch (status) {
        case 'pending':
            return 'قيد الانتظار';
        case 'confirmed':
            return 'تم التأكيد';
        case 'shipped':
            return 'تم الشحن';
        case 'delivered':
            return 'تم التسليم';
        default:
            return status;
    }
}

// ===== PRODUCT MANAGEMENT =====

// Load products from local storage
function loadProducts() {
    // In a real implementation, this would fetch from a database or GitHub repo
    let products = JSON.parse(localStorage.getItem('products')) || [];
    
    // If no products exist, create some sample data
    if (products.length === 0) {
        products = createSampleProducts();
        localStorage.setItem('products', JSON.stringify(products));
    }
    
    displayProducts(products);
}

// Create sample products for demonstration
function createSampleProducts() {
    return [
        {
            id: 'PROD-' + Date.now() + '-1',
            name: 'مجموعة تارو رايدر وايت',
            category: 'tarot-decks',
            price: 850,
            stock: 15,
            description: 'مجموعة تارو رايدر وايت الكلاسيكية، تحتوي على 78 بطاقة مع كتيب تعليمات باللغة العربية.',
            image: 'https://via.placeholder.com/800x800.png?text=Rider+Waite+Tarot'
        },
        {
            id: 'PROD-' + Date.now() + '-2',
            name: 'مجموعة أوراكل الملائكة',
            category: 'oracle-decks',
            price: 950,
            stock: 10,
            description: 'مجموعة أوراكل الملائكة، تحتوي على 44 بطاقة مع رسومات جميلة للملائكة وكتيب تفسير.',
            image: 'https://via.placeholder.com/800x800.png?text=Angel+Oracle'
        },
        {
            id: 'PROD-' + Date.now() + '-3',
            name: 'كتاب أسرار التارو',
            category: 'books',
            price: 350,
            stock: 20,
            description: 'كتاب شامل عن أسرار التارو وتفسير البطاقات وطرق القراءة المختلفة.',
            image: 'https://via.placeholder.com/800x800.png?text=Tarot+Book'
        },
        {
            id: 'PROD-' + Date.now() + '-4',
            name: 'حامل بلوري للتارو',
            category: 'accessories',
            price: 450,
            stock: 8,
            description: 'حامل بلوري فاخر لعرض بطاقات التارو أثناء القراءة، مصنوع من الكريستال عالي الجودة.',
            image: 'https://via.placeholder.com/800x800.png?text=Crystal+Stand'
        }
    ];
}

// Display products in the table
function displayProducts(products) {
    const tableBody = document.getElementById('products-table-body');
    tableBody.innerHTML = '';
    
    if (products.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center">لا توجد منتجات</td></tr>';
        return;
    }
    
    products.forEach(product => {
        const row = document.createElement('tr');
        
        // Format category
        const categoryText = getCategoryText(product.category);
        
        row.innerHTML = `
            <td><img src="${product.image}" alt="${product.name}" class="product-image-small"></td>
            <td>${product.name}</td>
            <td>${categoryText}</td>
            <td>${product.price} ج.م</td>
            <td>${product.stock}</td>
            <td>
                <button class="action-btn edit" onclick="editProduct('${product.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="deleteProduct('${product.id}')">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Show product form for adding/editing
function showProductForm(productId = null) {
    currentProductId = productId;
    
    // Reset form
    document.getElementById('product-form').reset();
    document.getElementById('product-image-preview').style.display = 'none';
    
    if (productId) {
        // Edit existing product
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const product = products.find(p => p.id === productId);
        
        if (product) {
            document.getElementById('product-id').value = product.id;
            document.getElementById('product-name').value = product.name;
            document.getElementById('product-category').value = product.category;
            document.getElementById('product-price').value = product.price;
            document.getElementById('product-stock').value = product.stock;
            document.getElementById('product-description').value = product.description;
            
            // Show image preview if available
            if (product.image) {
                const previewContainer = document.getElementById('product-image-preview');
                previewContainer.style.display = 'block';
                previewContainer.querySelector('img').src = product.image;
            }
            
            // Update modal title
            document.getElementById('productFormModalLabel').textContent = 'تعديل المنتج';
        }
    } else {
        // Add new product
        document.getElementById('product-id').value = '';
        document.getElementById('productFormModalLabel').textContent = 'إضافة منتج جديد';
    }
    
    // Show modal
    const productFormModal = new bootstrap.Modal(document.getElementById('productFormModal'));
    productFormModal.show();
}

// Preview product image
function previewProductImage(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
        alert('حجم الملف كبير جدًا. الحد الأقصى هو 2 ميجابايت.');
        event.target.value = '';
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const previewContainer = document.getElementById('product-image-preview');
        previewContainer.style.display = 'block';
        previewContainer.querySelector('img').src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Save product
function saveProduct() {
    const productId = document.getElementById('product-id').value;
    const name = document.getElementById('product-name').value;
    const category = document.getElementById('product-category').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const stock = parseInt(document.getElementById('product-stock').value);
    const description = document.getElementById('product-description').value;
    
    // Validate form
    if (!name || !category || isNaN(price) || isNaN(stock)) {
        alert('يرجى ملء جميع الحقول المطلوبة');
        return;
    }
    
    // Get products from localStorage
    let products = JSON.parse(localStorage.getItem('products')) || [];
    
    // Handle image
    let imageUrl = '';
    const imagePreview = document.getElementById('product-image-preview');
    if (imagePreview.style.display !== 'none') {
        imageUrl = imagePreview.querySelector('img').src;
    } else if (productId) {
        // Keep existing image if editing
        const existingProduct = products.find(p => p.id === productId);
        if (existingProduct) {
            imageUrl = existingProduct.image;
        }
    } else {
        // Default placeholder for new products without image
        imageUrl = `https://via.placeholder.com/800x800.png?text=${encodeURIComponent(name)}`;
    }
    
    if (productId) {
        // Update existing product
        const productIndex = products.findIndex(p => p.id === productId);
        if (productIndex !== -1) {
            products[productIndex] = {
                ...products[productIndex],
                name,
                category,
                price,
                stock,
                description,
                image: imageUrl
            };
        }
    } else {
        // Add new product
        const newProduct = {
            id: 'PROD-' + Date.now(),
            name,
            category,
            price,
            stock,
            description,
            image: imageUrl
        };
        products.push(newProduct);
    }
    
    // Save to localStorage
    localStorage.setItem('products', JSON.stringify(products));
    
    // Refresh products table
    displayProducts(products);
    
    // Close modal
    const productFormModal = bootstrap.Modal.getInstance(document.getElementById('productFormModal'));
    productFormModal.hide();
    
    // Show success message
    alert(productId ? 'تم تحديث المنتج بنجاح' : 'تم إضافة المنتج بنجاح');
}

// Edit product
function editProduct(productId) {
    showProductForm(productId);
}

// Delete product
function deleteProduct(productId) {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    
    // Get products from localStorage
    let products = JSON.parse(localStorage.getItem('products')) || [];
    
    // Remove product
    products = products.filter(p => p.id !== productId);
    
    // Save to localStorage
    localStorage.setItem('products', JSON.stringify(products));
    
    // Refresh products table
    displayProducts(products);
    
    // Show success message
    alert('تم حذف المنتج بنجاح');
}

// Get category text in Arabic
function getCategoryText(category) {
    switch (category) {
        case 'tarot-decks':
            return 'مجموعات تارو';
        case 'oracle-decks':
            return 'مجموعات أوراكل';
        case 'books':
            return 'كتب';
        case 'accessories':
            return 'إكسسوارات';
        default:
            return category;
    }
}

// ===== BLOG MANAGEMENT =====

// Load blog posts from local storage
function loadBlogPosts() {
    // In a real implementation, this would fetch from a database or GitHub repo
    let posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    
    // If no posts exist, create some sample data
    if (posts.length === 0) {
        posts = createSampleBlogPosts();
        localStorage.setItem('blogPosts', JSON.stringify(posts));
    }
    
    displayBlogPosts(posts);
}

// Create sample blog posts for demonstration
function createSampleBlogPosts() {
    return [
        {
            id: 'POST-' + Date.now() + '-1',
            title: 'مقدمة في قراءة التارو للمبتدئين',
            content: `# مقدمة في قراءة التارو للمبتدئين

التارو هو نظام من البطاقات المصورة التي تستخدم للتأمل والاستبصار. في هذا المقال، سنتعرف على أساسيات قراءة التارو للمبتدئين.

## الأركانا الكبرى والصغرى

تنقسم بطاقات التارو إلى قسمين رئيسيين:

1. **الأركانا الكبرى**: 22 بطاقة تمثل دروسًا روحية كبرى ومراحل في رحلة الحياة.
2. **الأركانا الصغرى**: 56 بطاقة مقسمة إلى أربعة أقسام (العصي، الكؤوس، السيوف، والدنانير).

## خطوات بسيطة لبدء قراءة التارو

- اختر مجموعة تارو تشعر بارتباط معها
- تعرف على معاني البطاقات الأساسية
- ابدأ بقراءات بسيطة من 1-3 بطاقات
- ثق في حدسك وتفسيراتك الشخصية

تذكر أن قراءة التارو هي مهارة تتطور مع الممارسة والصبر.`,
            image: 'https://via.placeholder.com/1200x800.png?text=Tarot+for+Beginners',
            date: new Date().toISOString(),
            likes: 24,
            comments: [
                { name: 'سارة', text: 'مقال رائع ومفيد للمبتدئين، شكرًا لك!', date: new Date().toISOString() },
                { name: 'محمد', text: 'هل يمكنك التوصية بمجموعة تارو جيدة للمبتدئين؟', date: new Date().toISOString() }
            ]
        },
        {
            id: 'POST-' + Date.now() + '-2',
            title: 'رموز وأسرار بطاقات الكؤوس',
            content: `# رموز وأسرار بطاقات الكؤوس

بطاقات الكؤوس في التارو ترتبط بعنصر الماء وتمثل العواطف والعلاقات والإبداع. في هذا المقال سنتعمق في رموز ومعاني هذه المجموعة المهمة.

## معاني بطاقات الكؤوس

- **آس الكؤوس**: بداية جديدة عاطفية، الحب، السعادة
- **ملك الكؤوس**: الرجل العاطفي، المستشار، الفنان
- **ملكة الكؤوس**: المرأة الحدسية، الرعاية، الحكمة العاطفية

## الرموز المتكررة في بطاقات الكؤوس

- **الماء**: يمثل العواطف والحدس
- **الكؤوس**: تمثل وعاء المشاعر
- **الأسماك**: ترمز للحياة الروحية والوفرة

فهم هذه الرموز يساعدك على تعميق قراءاتك وفهم الرسائل الخفية في البطاقات.`,
            image: 'https://via.placeholder.com/1200x800.png?text=Cups+Symbolism',
            date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
            likes: 18,
            comments: [
                { name: 'نور', text: 'استفدت كثيرًا من هذا الشرح، شكرًا جزيلًا!', date: new Date().toISOString() }
            ]
        }
    ];
}

// Display blog posts in the table
function displayBlogPosts(posts) {
    const tableBody = document.getElementById('blog-table-body');
    tableBody.innerHTML = '';
    
    if (posts.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center">لا توجد منشورات</td></tr>';
        return;
    }
    
    posts.forEach(post => {
        const row = document.createElement('tr');
        
        // Format date
        const postDate = new Date(post.date);
        const formattedDate = postDate.toLocaleDateString('ar-EG');
        
        row.innerHTML = `
            <td><img src="${post.image}" alt="${post.title}" class="blog-image-small"></td>
            <td>${post.title}</td>
            <td>${formattedDate}</td>
            <td>${post.likes}</td>
            <td>${post.comments ? post.comments.length : 0}</td>
            <td>
                <button class="action-btn edit" onclick="editBlogPost('${post.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="deleteBlogPost('${post.id}')">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Show blog form for adding/editing
function showBlogForm(postId = null) {
    currentPostId = postId;
    
    // Reset form
    document.getElementById('blog-form').reset();
    document.getElementById('post-image-preview').style.display = 'none';
    
    if (postId) {
        // Edit existing post
        const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        const post = posts.find(p => p.id === postId);
        
        if (post) {
            document.getElementById('post-id').value = post.id;
            document.getElementById('post-title').value = post.title;
            document.getElementById('post-content').value = post.content;
            
            // Show image preview if available
            if (post.image) {
                const previewContainer = document.getElementById('post-image-preview');
                previewContainer.style.display = 'block';
                previewContainer.querySelector('img').src = post.image;
            }
            
            // Update modal title
            document.getElementById('blogFormModalLabel').textContent = 'تعديل المنشور';
        }
    } else {
        // Add new post
        document.getElementById('post-id').value = '';
        document.getElementById('blogFormModalLabel').textContent = 'إضافة منشور جديد';
    }
    
    // Show modal
    const blogFormModal = new bootstrap.Modal(document.getElementById('blogFormModal'));
    blogFormModal.show();
}

// Preview post image
function previewPostImage(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
        alert('حجم الملف كبير جدًا. الحد الأقصى هو 2 ميجابايت.');
        event.target.value = '';
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const previewContainer = document.getElementById('post-image-preview');
        previewContainer.style.display = 'block';
        previewContainer.querySelector('img').src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Save blog post
function saveBlogPost() {
    const postId = document.getElementById('post-id').value;
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;
    
    // Validate form
    if (!title || !content) {
        alert('يرجى ملء جميع الحقول المطلوبة');
        return;
    }
    
    // Get posts from localStorage
    let posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    
    // Handle image
    let imageUrl = '';
    const imagePreview = document.getElementById('post-image-preview');
    if (imagePreview.style.display !== 'none') {
        imageUrl = imagePreview.querySelector('img').src;
    } else if (postId) {
        // Keep existing image if editing
        const existingPost = posts.find(p => p.id === postId);
        if (existingPost) {
            imageUrl = existingPost.image;
        }
    } else {
        // Default placeholder for new posts without image
        imageUrl = `https://via.placeholder.com/1200x800.png?text=${encodeURIComponent(title)}`;
    }
    
    if (postId) {
        // Update existing post
        const postIndex = posts.findIndex(p => p.id === postId);
        if (postIndex !== -1) {
            posts[postIndex] = {
                ...posts[postIndex],
                title,
                content,
                image: imageUrl,
                date: new Date().toISOString() // Update date on edit
            };
        }
    } else {
        // Add new post
        const newPost = {
            id: 'POST-' + Date.now(),
            title,
            content,
            image: imageUrl,
            date: new Date().toISOString(),
            likes: 0,
            comments: []
        };
        posts.push(newPost);
    }
    
    // Save to localStorage
    localStorage.setItem('blogPosts', JSON.stringify(posts));
    
    // Refresh posts table
    displayBlogPosts(posts);
    
    // Close modal
    const blogFormModal = bootstrap.Modal.getInstance(document.getElementById('blogFormModal'));
    blogFormModal.hide();
    
    // Show success message
    alert(postId ? 'تم تحديث المنشور بنجاح' : 'تم إضافة المنشور بنجاح');
}

// Edit blog post
function editBlogPost(postId) {
    showBlogForm(postId);
}

// Delete blog post
function deleteBlogPost(postId) {
    if (!confirm('هل أنت متأكد من حذف هذا المنشور؟')) return;
    
    // Get posts from localStorage
    let posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    
    // Remove post
    posts = posts.filter(p => p.id !== postId);
    
    // Save to localStorage
    localStorage.setItem('blogPosts', JSON.stringify(posts));
    
    // Refresh posts table
    displayBlogPosts(posts);
    
    // Show success message
    alert('تم حذف المنشور بنجاح');
}

// ===== SETTINGS MANAGEMENT =====

// Load settings from local storage
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('siteSettings')) || getDefaultSettings();
    
    // Fill form with settings
    document.getElementById('whatsapp-number').value = settings.whatsappNumber;
    document.getElementById('facebook-url').value = settings.facebookUrl;
    document.getElementById('free-shipping-threshold').value = settings.freeShippingThreshold;
    document.getElementById('shipping-cost').value = settings.shippingCost;
}

// Get default settings
function getDefaultSettings() {
    return {
        whatsappNumber: '+201005684094',
        facebookUrl: 'https://www.facebook.com/premiumtarot',
        freeShippingThreshold: 1000,
        shippingCost: 50
    };
}

// Save settings
function saveSettings(e) {
    e.preventDefault();
    
    const settings = {
        whatsappNumber: document.getElementById('whatsapp-number').value,
        facebookUrl: document.getElementById('facebook-url').value,
        freeShippingThreshold: parseFloat(document.getElementById('free-shipping-threshold').value),
        shippingCost: parseFloat(document.getElementById('shipping-cost').value)
    };
    
    // Save to localStorage
    localStorage.setItem('siteSettings', JSON.stringify(settings));
    
    // Show success message
    alert('تم حفظ الإعدادات بنجاح');
}

// Make functions available globally
window.viewOrderDetails = viewOrderDetails;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.editBlogPost = editBlogPost;
window.deleteBlogPost = deleteBlogPost;
