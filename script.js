document.addEventListener("DOMContentLoaded", () => {
/* ===== 9. 手機漢堡選單控制 ===== */
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // 點擊連結後自動收起選單
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });    
    /* ===== 1. 導覽列效果 ===== */
    const navbar = document.querySelector(".navbar");
    if (navbar) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                navbar.style.background = "rgba(10, 10, 10, 0.95)";
                navbar.style.padding = "0.8rem 5%";
                navbar.style.backdropFilter = "blur(10px)";
            } else {
                navbar.style.background = "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)";
                navbar.style.padding = "1.2rem 5%";
                navbar.style.backdropFilter = "none";
            }
        });
    }

    /* ===== 2. 作品集渲染與過濾 ===== */
    const gallery = document.getElementById("gallery");
    
    function renderGallery(items) {
        if (!gallery) return;
        gallery.innerHTML = items.map(item => `
            <div class="masonry-item" data-category="${item.category}">
                <img src="${item.url || item.src}" class="lazy-img" loading="lazy">
                <div class="item-overlay">
                    <div class="overlay-text">
                        <p>${item.category}</p>
                    </div>
                </div>
            </div>
        `).join("");
        
        if (typeof initLightbox === "function") initLightbox();
    }

    function initFilter(allData) {
        const filterBtns = document.querySelectorAll(".filter-btn");
        if (!filterBtns.length) return;

        filterBtns.forEach(btn => {
            btn.onclick = () => {
                filterBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                const filter = btn.dataset.filter;
                const filteredData = (filter === "all") ? allData : allData.filter(i => i.category === filter);
                renderGallery(filteredData);
            };
        });
    }

    if (gallery) {
        fetch("images.json")
            .then(res => res.json())
            .then(images => {
                renderGallery(images);
                initFilter(images);
            })
            .catch(err => console.error("圖片資料載入失敗:", err));
    }

    /* ===== 3. 多語系核心 ===== */
    function applyLang(l) {
        document.querySelectorAll("[data-en]").forEach(el => {
            if (el.dataset[l]) el.textContent = el.dataset[l];
        });
        const zhBlocks = document.querySelectorAll(".lang-zh");
        const enBlocks = document.querySelectorAll(".lang-en");
        if (zhBlocks.length > 0) {
            zhBlocks.forEach(b => b.style.display = (l === "zh" ? "block" : "none"));
            enBlocks.forEach(b => b.style.display = (l === "en" ? "block" : "none"));
        }
        document.documentElement.lang = (l === "zh" ? "zh-Hant" : "en");
    }

    const langBtn = document.getElementById("lang-toggle");
    if (langBtn) {
        langBtn.onclick = () => {
            const currentLang = localStorage.getItem("site-lang") === "zh" ? "en" : "zh";
            localStorage.setItem("site-lang", currentLang);
            applyLang(currentLang);
        };
    }

    /* ===== 4. 櫻花雨產生器 ===== */
    const sakuraBox = document.getElementById('sakura-rain');
    if (sakuraBox) {
        setInterval(() => {
            const petal = document.createElement('div');
            petal.classList.add('sakura-petal');
            const size = Math.random() * 7 + 8 + 'px';
            petal.style.width = size; 
            petal.style.height = size;
            petal.style.left = Math.random() * 100 + '%';
            const duration = Math.random() * 5 + 5;
            petal.style.animationDuration = duration + 's';
            sakuraBox.appendChild(petal);
            setTimeout(() => petal.remove(), duration * 1000 + 1000);
        }, 400);
    }

    /* ===== 5. 燈箱功能 (Lightbox) ===== */
    window.initLightbox = function() {
        const lightbox = document.getElementById("lightbox");
        const lightboxImg = document.getElementById("lightbox-img");
        const prevBtn = document.querySelector(".lightbox-prev");
        const nextBtn = document.querySelector(".lightbox-next");
        const closeBtn = document.querySelector(".lightbox-close");

        if (!lightbox || !lightboxImg) return;

        const allImgs = Array.from(document.querySelectorAll(".masonry-item img"));
        let currentIndex = 0;

        allImgs.forEach((img, index) => {
            img.onclick = () => {
                currentIndex = index;
                showImage(currentIndex);
                lightbox.style.display = "flex";
                document.body.style.overflow = "hidden";
            };
        });

        function showImage(index) {
            if (index < 0) currentIndex = allImgs.length - 1;
            else if (index >= allImgs.length) currentIndex = 0;
            else currentIndex = index;
            lightboxImg.src = allImgs[currentIndex].src;
        }

        if (prevBtn) {
            prevBtn.onclick = (e) => {
                e.stopPropagation();
                showImage(currentIndex - 1);
            };
        }

        if (nextBtn) {
            nextBtn.onclick = (e) => {
                e.stopPropagation();
                showImage(currentIndex + 1);
            };
        }

        const closeLightbox = () => {
            lightbox.style.display = "none";
            document.body.style.overflow = "auto";
        };

        if (closeBtn) closeBtn.onclick = closeLightbox;
        
        lightbox.onclick = (e) => {
            if (e.target === lightbox) closeLightbox();
        };
    };

    /* ===== 6. 部落格清單渲染 (Blog List) ===== */
    const blogGrid = document.getElementById("blog-grid");
    if (blogGrid) {
        fetch("blogs.json")
            .then(res => res.json())
            .then(posts => {
                const lang = localStorage.getItem("site-lang") || "en";
                
                blogGrid.innerHTML = posts.map(post => {
                    const title = lang === 'zh' ? post.title_zh : post.title_en;
                    const excerpt = lang === 'zh' ? post.excerpt_zh : post.excerpt_en;
                    const btnText = lang === 'zh' ? '閱讀全文' : 'READ MORE';
                    
                    return `
                        <div class="blog-card">
                            <div class="blog-card-img-wrap">
                                <img src="${post.image}" class="blog-card-img" alt="${title}" loading="lazy">
                            </div>
                            <div class="blog-card-content">
                                <div class="blog-meta">
                                    <span>${post.date}</span>
                                    <span>${post.category || 'NOTE'}</span>
                                </div>
                                <h3 class="blog-title">${title}</h3>
                                <p class="blog-excerpt">${excerpt}</p>
                                <a href="post.html?id=${post.id}" class="blog-link">${btnText}</a>
                            </div>
                        </div>
                    `;
                }).join("");
            })
            .catch(err => {
                console.error("部落格載入失敗:", err);
                blogGrid.innerHTML = `<p style="color: #ff4d4d; grid-column: 1/-1;">無法載入文章，請檢查 blogs.json 檔案。</p>`;
            });
    }

    // 初次載入
    applyLang(localStorage.getItem("site-lang") || "en");

}); // 👈 整個腳本的結尾
// 初始化 Swiper 輪播圖
document.addEventListener('DOMContentLoaded', () => {
    // 確保只在有 swiper 元素的頁面上執行
    if (document.querySelector('.mySwiper')) {
        const swiper = new Swiper(".mySwiper", {
            loop: true,
            grabCursor: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
        });
    }
});