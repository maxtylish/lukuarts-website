document.addEventListener("DOMContentLoaded", () => {
    
    /* ===== 1. 導覽列滾動效果 ===== */
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

    /* ===== 2. 作品集 (Portfolio) 邏輯 ===== */
    const gallery = document.getElementById("gallery");
    if (gallery) {
        fetch("images.json")
            .then(res => res.json())
            .then(images => {
                renderGallery(images);
                initFilter(images);
                initLightbox();
                applyLang(localStorage.getItem("site-lang") || "en");
            })
            .catch(err => console.error("Gallery 載入失敗:", err));
    }

    function renderGallery(items) {
        if (!gallery) return;
        gallery.innerHTML = items.map(item => `
            <div class="masonry-item" data-category="${item.category}">
                <img src="${item.url || item.src}" class="lazy-img" loading="lazy" alt="${item.title}">
                <div class="item-overlay">
                    <div class="overlay-text">
                        <p>${item.title || 'LUKUARTS'}</p>
                    </div>
                </div>
            </div>
        `).join("");
        
        document.querySelectorAll(".lazy-img").forEach(img => {
            img.onload = () => img.style.opacity = "1";
        });
    }

    /* ===== 3. 部落格 (Blog) 邏輯 ===== */
    const blogContainer = document.getElementById("blog-container");
    if (blogContainer) {
        fetch("blogs.json")
            .then(res => res.json())
            .then(posts => {
                renderBlogs(posts);
                applyLang(localStorage.getItem("site-lang") || "en");
            })
            .catch(err => console.error("Blog 載入失敗:", err));
    }

    function renderBlogs(posts) {
        if (!blogContainer) return;
        const lang = localStorage.getItem("site-lang") || "en";
        blogContainer.innerHTML = posts.map(post => `
            <article class="blog-card">
                <div class="blog-card-img-wrap">
                    <img src="${post.image}" class="blog-card-img" alt="cover">
                </div>
                <div class="blog-card-content">
                    <div class="blog-meta">
                        <span class="blog-date">${post.date}</span>
                        <span class="blog-category">${post.category}</span>
                    </div>
                    <h2 class="blog-title">${lang === 'zh' ? post.title_zh : post.title_en}</h2>
                    <p class="blog-excerpt">${lang === 'zh' ? post.excerpt_zh : post.excerpt_en}</p>
                    <a href="post.html?id=${post.id}" class="blog-link" data-zh="閱讀全文" data-en="READ MORE">
                        ${lang === 'zh' ? '閱讀全文' : 'READ MORE'}
                    </a>
                </div>
            </article>
        `).join("");
    }

    /* ===== 4. 分類過濾與燈箱 (Portfolio 專用) ===== */
    function initFilter(allData) {
        const filterBtns = document.querySelectorAll(".filter-btn");
        filterBtns.forEach(btn => {
            btn.onclick = () => {
                filterBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                const filter = btn.dataset.filter;
                const filtered = (filter === "all") ? allData : allData.filter(i => i.category === filter);
                renderGallery(filtered);
                initLightbox();
                applyLang(localStorage.getItem("site-lang") || "en");
            };
        });
    }

    function initLightbox() {
        const lightbox = document.getElementById("lightbox");
        const lightboxImg = document.getElementById("lightbox-img");
        if (!lightbox || !lightboxImg) return;

        const items = document.querySelectorAll(".masonry-item img");
        items.forEach(img => {
            img.onclick = () => {
                lightbox.style.display = "flex";
                lightboxImg.src = img.src;
                document.body.style.overflow = "hidden";
            };
        });

        const closeBtn = document.querySelector(".lightbox-close");
        if (closeBtn) {
            closeBtn.onclick = () => {
                lightbox.style.display = "none";
                document.body.style.overflow = "auto";
            };
        }
    }

    /* ===== 5. 多語系切換核心 ===== */
    function applyLang(l) {
        // A. 靜態文字切換
        document.querySelectorAll("[data-en]").forEach(el => {
            if (el.dataset[l]) {
                el.textContent = el.dataset[l];
            }
        });

        // B. 重新渲染部落格以更新動態標題 (如果人在 Blog 頁面)
        if (blogContainer) {
            fetch("blogs.json")
                .then(res => res.json())
                .then(posts => renderBlogs(posts));
        }

        // C. About 頁面區塊切換
        const zhBlocks = document.querySelectorAll(".lang-zh");
        const enBlocks = document.querySelectorAll(".lang-en");
        if (zhBlocks.length > 0) {
            zhBlocks.forEach(b => b.style.display = (l === "zh" ? "block" : "none"));
            enBlocks.forEach(b => b.style.display = (l === "en" ? "block" : "none"));
        }
        
        document.documentElement.lang = (l === "zh" ? "zh-Hant" : "en");
    }

    /* ===== 6. 語系按鈕監聽 ===== */
    const langBtn = document.getElementById("lang-toggle");
    if (langBtn) {
        langBtn.onclick = () => {
            const currentLang = localStorage.getItem("site-lang") === "zh" ? "en" : "zh";
            localStorage.setItem("site-lang", currentLang);
            applyLang(currentLang);
        };
    }

    /* ===== 7. 訪客計數器 ===== */
    const visitCount = document.getElementById('visit-count');
    if (visitCount) {
        fetch('https://api.counterapi.dev/v1/lukuarts/homepage/up')
            .then(res => res.json())
            .then(data => { visitCount.textContent = data.count; })
            .catch(() => { if(visitCount.parentElement) visitCount.parentElement.style.display = 'none'; });
    }

    // 初次載入執行一次語系設定
    applyLang(localStorage.getItem("site-lang") || "en");

});