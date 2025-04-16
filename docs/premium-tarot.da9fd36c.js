function initShoppingCart(){let t=JSON.parse(localStorage.getItem("premiumTarotCart"))||[],e=document.querySelectorAll(".add-to-cart"),o=document.getElementById("cart-preview"),n=document.querySelector(".close-cart"),a=document.querySelector(".checkout-btn");function r(){let e=document.querySelector(".cart-items"),o=document.querySelector(".total-amount"),n=document.querySelector(".empty-cart-message"),a=document.querySelector(".cart-count");if(!e||!o)return;if(0===t.length){n&&(n.style.display="block"),o.textContent="0 ج.م",e.innerHTML=n?n.outerHTML:'<p class="empty-cart-message">سلة التسوق فارغة</p>',a&&(a.textContent="0");return}n&&(n.style.display="none");let i="",c=0,u=0;t.forEach((t,e)=>{let o=t.price*t.quantity;c+=o,u+=t.quantity,i+=`
                <div class="cart-item">
                    <div class="cart-item-details">
                        <h4>${t.name}</h4>
                        <p>${t.price} \u{62C}.\u{645} \xd7 ${t.quantity}</p>
                    </div>
                    <div class="cart-item-actions">
                        <button class="quantity-btn decrease-quantity" data-index="${e}">-</button>
                        <span class="item-quantity">${t.quantity}</span>
                        <button class="quantity-btn increase-quantity" data-index="${e}">+</button>
                        <button class="remove-item" data-index="${e}">\xd7</button>
                    </div>
                </div>
            `}),e.innerHTML=i,o.textContent=`${c} \u{62C}.\u{645}`,a&&(a.textContent=u.toString()),document.querySelectorAll(".increase-quantity").forEach(e=>{e.addEventListener("click",function(){let e=parseInt(this.getAttribute("data-index"));t[e].quantity+=1,localStorage.setItem("premiumTarotCart",JSON.stringify(t)),r()})}),document.querySelectorAll(".decrease-quantity").forEach(e=>{e.addEventListener("click",function(){let e=parseInt(this.getAttribute("data-index"));t[e].quantity>1&&(t[e].quantity-=1,localStorage.setItem("premiumTarotCart",JSON.stringify(t)),r())})}),document.querySelectorAll(".remove-item").forEach(e=>{e.addEventListener("click",function(){let e=parseInt(this.getAttribute("data-index"));t.splice(e,1),localStorage.setItem("premiumTarotCart",JSON.stringify(t)),r()})})}e.length>0&&e.forEach(e=>{e.addEventListener("click",function(e){let n;e.preventDefault();let a=this.closest(".product-card")||this.closest(".offer-card");if(!a)return;let i=a.querySelector(".product-title, .offer-title").textContent;n=a.querySelector(".discount-price")?parseFloat(a.querySelector(".discount-price").textContent.replace(/[^\d.]/g,"")):parseFloat(a.querySelector(".product-price").textContent.replace(/[^\d.]/g,""));let c="";a.querySelector(".product-image img")&&(c=a.querySelector(".product-image img").src);let u=t.findIndex(t=>t.name===i);if(-1!==u?t[u].quantity+=1:t.push({name:i,price:n,image:c,quantity:1}),localStorage.setItem("premiumTarotCart",JSON.stringify(t)),r(),o){o.classList.add("active");let t=o.querySelector(".cart-items");t&&(t.classList.add("fade-in"),setTimeout(()=>{t.classList.remove("fade-in")},1e3))}showNotification("تمت إضافة المنتج إلى سلة التسوق","success")})}),n&&o&&n.addEventListener("click",function(){o.classList.remove("active")}),a&&a.addEventListener("click",function(){if(0===t.length)return void showNotification("سلة التسوق فارغة","error");window.location.href="pages/checkout.html"}),r()}function initCategoryFilters(){let t=document.querySelectorAll(".category-filter");if(t.length>0){let e=document.querySelectorAll("[data-category]");t.forEach(o=>{o.addEventListener("click",function(){let o=this.getAttribute("data-category");t.forEach(t=>t.classList.remove("active")),this.classList.add("active"),e.forEach(t=>{"all"===o||t.getAttribute("data-category")===o?(t.style.display="block",t.classList.add("fade-in"),setTimeout(()=>{t.classList.remove("fade-in")},1e3)):t.style.display="none"})})})}}function initBlogFeatures(){let t=document.querySelectorAll(".blog-likes");if(t.length>0){let e=JSON.parse(localStorage.getItem("premiumTarotLikedPosts"))||[];t.forEach(t=>{let o=t.closest("[data-post-id]")?.getAttribute("data-post-id")||t.closest(".blog-card")?.getAttribute("data-post-id")||"unknown";if(e.includes(o)){let e=t.querySelector("i");e&&(e.classList.remove("far"),e.classList.add("fas"))}t.addEventListener("click",function(){let t=this.querySelector("i");if(!t)return;let n=parseInt(this.textContent.replace(/\D/g,""))||0;if(t.classList.contains("far"))t.classList.remove("far"),t.classList.add("fas"),this.innerHTML=this.innerHTML.replace(n,n+1),e.includes(o)||(e.push(o),localStorage.setItem("premiumTarotLikedPosts",JSON.stringify(e)));else{t.classList.remove("fas"),t.classList.add("far"),this.innerHTML=this.innerHTML.replace(n,n-1);let a=e.indexOf(o);-1!==a&&(e.splice(a,1),localStorage.setItem("premiumTarotLikedPosts",JSON.stringify(e)))}})})}let e=document.getElementById("comment-form");if(e){e.addEventListener("submit",function(t){t.preventDefault();let n=document.getElementById("commenter-name"),a=document.getElementById("comment-text");if(!n||!a)return;let r=n.value.trim(),i=a.value.trim();if(!r||!i)return void showNotification("يرجى ملء جميع الحقول المطلوبة","error");let c=document.querySelector(".blog-post")?.getAttribute("data-post-id")||new URLSearchParams(window.location.search).get("id")||"unknown",u=JSON.parse(localStorage.getItem(`premiumTarotComments_${c}`))||[];u.push({name:r,text:i,date:new Date().toLocaleDateString("ar-EG")}),localStorage.setItem(`premiumTarotComments_${c}`,JSON.stringify(u));let s=document.getElementById("comment-count");s&&(s.textContent=u.length.toString()),o(r,i,new Date().toLocaleDateString("ar-EG")),e.reset(),showNotification("تم إضافة التعليق بنجاح","success")});let t=document.querySelector(".blog-post")?.getAttribute("data-post-id")||new URLSearchParams(window.location.search).get("id")||"unknown",n=JSON.parse(localStorage.getItem(`premiumTarotComments_${t}`))||[],a=document.getElementById("comment-count");a&&(a.textContent=n.length.toString());let r=document.getElementById("comments-list");if(r&&n.length>0){let t=r.querySelector(".no-comments-message");t&&t.remove(),n.forEach(t=>{o(t.name,t.text,t.date)})}}function o(t,e,o){let n=document.getElementById("comments-list");if(!n)return;let a=n.querySelector(".no-comments-message");a&&a.remove();let r=document.createElement("div");r.className="comment fade-in",r.innerHTML=`
            <div class="comment-header">
                <h5 class="commenter-name">${t}</h5>
                <span class="comment-date">${o}</span>
            </div>
            <div class="comment-body">
                <p>${e}</p>
            </div>
        `,n.appendChild(r)}}function initLanguageSwitcher(){let t=document.getElementById("lang-switch");function e(t){document.documentElement.lang=t,document.documentElement.dir="ar"===t?"rtl":"ltr";let e=document.getElementById("lang-switch");e&&(e.textContent="ar"===t?"English":"العربية",e.setAttribute("data-current-lang",t));let o=document.querySelector('link[href*="bootstrap"]');if(o){let e=o.href.substring(0,o.href.lastIndexOf("/")+1);o.href="ar"===t?`${e}bootstrap.rtl.min.css`:`${e}bootstrap.min.css`}let n={ar:{home:"الرئيسية",products:"المنتجات",offers:"العروض",blog:"المدونة",contact:"اتصل بنا","hero-title":"تارو بريميوم","hero-description":"منتجات تارو عالية الجودة وكتب روحانية","shop-now":"تسوق الآن","featured-products":"منتجات مميزة","special-offers":"عروض خاصة","add-to-cart":"أضف إلى السلة","read-more":"اقرأ المزيد","shopping-cart":"سلة التسوق","empty-cart":"سلة التسوق فارغة",total:"المجموع:",checkout:"إتمام الشراء","about-us":"عن بريميوم تارو","about-description":"نقدم منتجات تارو عالية الجودة وكتب روحانية لمساعدتك في رحلتك الروحانية.","quick-links":"روابط سريعة","contact-us":"اتصل بنا","all-rights-reserved":"جميع الحقوق محفوظة","all-categories":"جميع الفئات","tarot-cards":"بطاقات تارو",books:"كتب",candles:"شموع",accessories:"إكسسوارات"},en:{home:"Home",products:"Products",offers:"Offers",blog:"Blog",contact:"Contact","hero-title":"Premium Tarot","hero-description":"High-quality tarot products and spiritual books","shop-now":"Shop Now","featured-products":"Featured Products","special-offers":"Special Offers","add-to-cart":"Add to Cart","read-more":"Read More","shopping-cart":"Shopping Cart","empty-cart":"Your cart is empty",total:"Total:",checkout:"Checkout","about-us":"About Premium Tarot","about-description":"We offer high-quality tarot products and spiritual books to help you on your spiritual journey.","quick-links":"Quick Links","contact-us":"Contact Us","all-rights-reserved":"All Rights Reserved","all-categories":"All Categories","tarot-cards":"Tarot Cards",books:"Books",candles:"Candles",accessories:"Accessories"}};document.querySelectorAll("[data-lang-key]").forEach(e=>{let o=e.getAttribute("data-lang-key");n[t][o]&&(e.textContent=n[t][o])})}t&&(e(localStorage.getItem("premiumTarotLanguage")||"ar"),t.addEventListener("click",function(){let t="ar"===this.getAttribute("data-current-lang")?"en":"ar";localStorage.setItem("premiumTarotLanguage",t),e(t)}))}function initWhatsAppIntegration(){let t=document.getElementById("contactForm");t&&t.addEventListener("submit",function(e){e.preventDefault();let o=document.getElementById("name").value.trim(),n=document.getElementById("whatsapp").value.trim(),a=document.getElementById("subject").value,r=document.getElementById("message").value.trim();if(!o||!n||!a||!r)return void showNotification("يرجى ملء جميع الحقول المطلوبة","error");let i=`\u{631}\u{633}\u{627}\u{644}\u{629} \u{62C}\u{62F}\u{64A}\u{62F}\u{629} \u{645}\u{646} ${o}:

`,c=encodeURIComponent(i+=`\u{627}\u{644}\u{645}\u{648}\u{636}\u{648}\u{639}: ${document.getElementById("subject").options[document.getElementById("subject").selectedIndex].text}

${r}

\u{631}\u{642}\u{645} WhatsApp \u{644}\u{644}\u{62A}\u{648}\u{627}\u{635}\u{644}: ${n}`);window.open(`https://wa.me/YOUR_WHATSAPP_NUMBER?text=${c}`,"_blank"),t.reset(),showNotification("تم إرسال رسالتك بنجاح! سنتواصل معك قريبًا.","success")});let e=document.getElementById("checkout-form");e&&e.addEventListener("submit",function(t){t.preventDefault();let o=JSON.parse(localStorage.getItem("premiumTarotCart"))||[];if(0===o.length)return void showNotification("سلة التسوق فارغة. يرجى إضافة منتجات قبل إتمام الشراء.","error");let n=document.getElementById("recipient-name").value.trim(),a=document.getElementById("whatsapp-number").value.trim(),r=document.getElementById("building-number").value.trim(),i=document.getElementById("street-name").value.trim(),c=document.getElementById("region-district").value.trim(),u=document.getElementById("city").value.trim(),s=document.getElementById("country").value,l=document.getElementById("notes").value.trim(),d=document.querySelector('input[name="payment-method"]:checked').value;if(!n||!a||!r||!i||!c||!u)return void showNotification("يرجى ملء جميع الحقول المطلوبة","error");let m="PT"+Date.now().toString().slice(-6),p="طلب جديد #"+m+":\n\n";p+="المنتجات:\n";let f=0;o.forEach(t=>{let e=t.price*t.quantity;f+=e,p+=`${t.name} \xd7 ${t.quantity} = ${e} \u{62C}.\u{645}
`}),p+=`
\u{627}\u{644}\u{645}\u{62C}\u{645}\u{648}\u{639}: ${f} \u{62C}.\u{645}

\u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0627\u0644\u0634\u062D\u0646:
\u{627}\u{644}\u{627}\u{633}\u{645}: ${n}
\u{631}\u{642}\u{645} \u{627}\u{644}\u{645}\u{628}\u{646}\u{649}: ${r}
\u{627}\u{644}\u{634}\u{627}\u{631}\u{639}: ${i}
\u{627}\u{644}\u{645}\u{646}\u{637}\u{642}\u{629}/\u{627}\u{644}\u{62D}\u{64A}: ${c}
\u{627}\u{644}\u{645}\u{62F}\u{64A}\u{646}\u{629}: ${u}
\u{627}\u{644}\u{62F}\u{648}\u{644}\u{629}: ${s}
`,l&&(p+=`
\u{645}\u{644}\u{627}\u{62D}\u{638}\u{627}\u{62A}: ${l}
`);let g=encodeURIComponent(p+=`
\u{637}\u{631}\u{64A}\u{642}\u{629} \u{627}\u{644}\u{62F}\u{641}\u{639}: ${"whatsapp"===d?"تحويل عبر WhatsApp":"الدفع عند الاستلام"}
`),y=document.getElementById("orderConfirmationModal");if(y){let t=document.getElementById("order-number");t&&(t.textContent=m),new bootstrap.Modal(y).show(),localStorage.setItem("premiumTarotCart",JSON.stringify([])),setTimeout(()=>{window.open(`https://wa.me/YOUR_WHATSAPP_NUMBER?text=${g}`,"_blank")},1e3)}else window.open(`https://wa.me/YOUR_WHATSAPP_NUMBER?text=${g}`,"_blank"),localStorage.setItem("premiumTarotCart",JSON.stringify([])),showNotification("تم إرسال طلبك بنجاح! سنتواصل معك قريبًا عبر WhatsApp.","success"),e.reset()})}function showNotification(t,e="info"){let o=document.querySelector(".notification-container");if(!o){(o=document.createElement("div")).className="notification-container",document.body.appendChild(o);let t=document.createElement("style");t.textContent=`
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
        `,document.head.appendChild(t)}let n=document.createElement("div");function a(t){t.style.animation="slideOut 0.3s ease-in forwards",setTimeout(()=>{t.remove()},300)}n.className=`notification ${e}`,n.innerHTML=`
        <span>${t}</span>
        <button class="notification-close">&times;</button>
    `,o.appendChild(n),n.querySelector(".notification-close").addEventListener("click",function(){a(n)}),setTimeout(()=>{a(n)},5e3)}document.addEventListener("DOMContentLoaded",function(){initShoppingCart(),initCategoryFilters(),initBlogFeatures(),initLanguageSwitcher(),initWhatsAppIntegration()});
//# sourceMappingURL=premium-tarot.da9fd36c.js.map
