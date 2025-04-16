let translations={ar:{home:"الرئيسية",products:"المنتجات",offers:"العروض",blog:"المدونة",contact:"اتصل بنا","hero-title":"تارو بريميوم","hero-description":"منتجات تارو عالية الجودة وكتب روحانية","shop-now":"تسوق الآن","featured-products":"منتجات مميزة","special-offers":"عروض خاصة","add-to-cart":"أضف إلى السلة","read-more":"اقرأ المزيد","shopping-cart":"سلة التسوق","empty-cart":"سلة التسوق فارغة",total:"المجموع:",checkout:"إتمام الشراء","about-us":"عن بريميوم تارو","about-description":"نقدم منتجات تارو عالية الجودة وكتب روحانية لمساعدتك في رحلتك الروحانية.","quick-links":"روابط سريعة","contact-us":"اتصل بنا","all-rights-reserved":"جميع الحقوق محفوظة"},en:{home:"Home",products:"Products",offers:"Offers",blog:"Blog",contact:"Contact","hero-title":"Premium Tarot","hero-description":"High-quality tarot products and spiritual books","shop-now":"Shop Now","featured-products":"Featured Products","special-offers":"Special Offers","add-to-cart":"Add to Cart","read-more":"Read More","shopping-cart":"Shopping Cart","empty-cart":"Your cart is empty",total:"Total:",checkout:"Checkout","about-us":"About Premium Tarot","about-description":"We offer high-quality tarot products and spiritual books to help you on your spiritual journey.","quick-links":"Quick Links","contact-us":"Contact Us","all-rights-reserved":"All Rights Reserved"}},langSwitchBtn=document.getElementById("lang-switch"),cartButtons=document.querySelectorAll(".add-to-cart"),cartPreview=document.getElementById("cart-preview"),closeCartBtn=document.querySelector(".close-cart"),checkoutBtn=document.querySelector(".checkout-btn"),cart=[],currentLang="ar";function updateCart(){let t=document.querySelector(".cart-items"),e=document.querySelector(".total-amount"),r=document.querySelector(".empty-cart-message");if(0===cart.length){r.style.display="block",e.textContent="0 ج.م",t.innerHTML=r.outerHTML;return}r.style.display="none";let o="",n=0;cart.forEach((t,e)=>{n+=t.price*t.quantity,o+=`
            <div class="cart-item">
                <div class="cart-item-details">
                    <h4>${t.name}</h4>
                    <p>${t.price} \u{62C}.\u{645} \xd7 ${t.quantity}</p>
                </div>
                <div class="cart-item-actions">
                    <button class="remove-item" data-index="${e}">\xd7</button>
                </div>
            </div>
        `}),t.innerHTML=o,e.textContent=`${n} \u{62C}.\u{645}`,document.querySelectorAll(".remove-item").forEach(t=>{t.addEventListener("click",function(){let t=parseInt(this.getAttribute("data-index"));cart.splice(t,1),updateCart()})})}langSwitchBtn&&langSwitchBtn.addEventListener("click",function(){let t="ar"===this.getAttribute("data-current-lang")?"en":"ar";document.documentElement.lang=t,document.documentElement.dir="ar"===t?"rtl":"ltr",this.textContent="ar"===t?"English":"العربية",this.setAttribute("data-current-lang",t),document.querySelectorAll("[data-lang-key]").forEach(e=>{let r=e.getAttribute("data-lang-key");translations[t][r]&&(e.textContent=translations[t][r])});let e=document.querySelector('link[href*="bootstrap"]');e&&("ar"===t?e.href="../node_modules/bootstrap/dist/css/bootstrap.rtl.min.css":e.href="../node_modules/bootstrap/dist/css/bootstrap.min.css")}),cartButtons.forEach(t=>{t.addEventListener("click",function(){let t,e=this.closest(".product-card")||this.closest(".offer-card"),r=e.querySelector(".product-title, .offer-title").textContent,o=e.querySelector(".product-price, .offer-price").textContent;t=o.includes("discount-price")?parseInt(e.querySelector(".discount-price").textContent.replace(/\D/g,"")):parseInt(o.replace(/\D/g,""));let n=cart.findIndex(t=>t.name===r);-1!==n?cart[n].quantity+=1:cart.push({name:r,price:t,quantity:1}),updateCart(),cartPreview.classList.add("active")})}),closeCartBtn&&closeCartBtn.addEventListener("click",function(){cartPreview.classList.remove("active")}),checkoutBtn&&checkoutBtn.addEventListener("click",function(){if(0===cart.length)return void alert(translations["ar"===currentLang?"ar":"en"]["empty-cart"]);let t="طلب جديد:\n\n";cart.forEach(e=>{t+=`${e.name} \xd7 ${e.quantity} = ${e.price*e.quantity} \u{62C}.\u{645}
`});let e=cart.reduce((t,e)=>t+e.price*e.quantity,0),r=encodeURIComponent(t+=`
\u{627}\u{644}\u{645}\u{62C}\u{645}\u{648}\u{639}: ${e} \u{62C}.\u{645}`);window.open(`https://wa.me/YOUR_WHATSAPP_NUMBER?text=${r}`,"_blank")}),document.querySelectorAll(".blog-likes").forEach(t=>{t.addEventListener("click",function(){let t=this.querySelector("i"),e=parseInt(this.textContent.replace(/\D/g,""));t.classList.contains("far")?(t.classList.remove("far"),t.classList.add("fas"),this.textContent=this.textContent.replace(e,e+1)):(t.classList.remove("fas"),t.classList.add("far"),this.textContent=this.textContent.replace(e,e-1))})}),document.addEventListener("DOMContentLoaded",function(){document.documentElement.lang="ar",document.documentElement.dir="rtl",updateCart();let t=document.createElement("style");t.textContent=`
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
    `,document.head.appendChild(t)});
//# sourceMappingURL=premium-tarot.01ae1494.js.map
