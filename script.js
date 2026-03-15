document.addEventListener("DOMContentLoaded", () => {
    
    /* ===== 1. 導覽列滾動效果 ===== */
    const navbar = document.querySelector(".navbar");
    if (navbar) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }
        });
    }

    /* ===== 2. 從 JSON 載入作品集資料 ===== */
    const gallery = document.getElementById("gallery");
    
    // 執行載入
    fetch("images.json")
        .then(res => {
            if (!res.ok) throw new Error("找不到 images.json 檔案");
            return res.json();
        })
        .then(images => {
            if (!gallery) return;

            // 清空 HTML 預設的內容，改由 JSON 動態生成
            gallery.innerHTML = ""; 

            images.forEach(img => {
                const item = document.createElement("div");
                item.className = "masonry-item";
                item.dataset.category = img.category;

                const titleText = img.title ? img.title : "LUKUARTS VISUAL";
                const categoryText = img.category ? img.category.charAt(0).toUpperCase() + img.category.slice(1) : "Photography";

                item.innerHTML = `
                    <img src="${img.src}" class="lightbox-trigger lazy-img" loading="lazy" alt="${titleText}">
                    <div class="item-overlay" style="pointer-events: none;">
                        <div class="overlay-text">
                            <h3>${titleText}</h3>
                            <p>${categoryText}</p>
                        </div>
                    </div>
                `;
                gallery.appendChild(item);
            });

            // 初始化所有動態生成後的相簿功能
            initFilter();
            initLightbox();
            initLazyFade();
            applyURLCategory();
        })
        .catch(error => {
            console.error("【LUKUARTS 系統報錯】:", error.message);
            // 失敗時仍要確保基本功能能跑
            initFilter();
            initLightbox();
        });

    /* ===== 3. 作品分類過濾系統 ===== */
    function initFilter() {
        const filterBtns = document.querySelectorAll(".filter-btn");
        filterBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                // 按鈕樣式切換
                filterBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                const filter = btn.dataset.filter;
                // 過濾圖片顯示
                document.querySelectorAll(".masonry-item").forEach(item => {
                    if (filter === "all" || item.dataset.category === filter) {
                        item.style.display = "block";
                    } else {
                        item.style.display = "none";
                    }
                });
                // 過濾後需更新燈箱的圖片隊列
                if (window.refreshLightbox) window.refreshLightbox();
            });
        });
    }

    /* ===== 4. Lightbox 燈箱系統 (支援過濾與切換) ===== */
    function initLightbox() {
        const lightbox = document.getElementById("lightbox");
        if (!lightbox) return;

        const lightboxImg = document.getElementById("lightbox-img");
        const closeBtn = document.querySelector(".lightbox-close");
        const prevBtn = document.querySelector(".lightbox-prev");
        const nextBtn = document.querySelector(".lightbox-next");

        let currentImages = [];
        let currentIndex = 0;

        // 定義一個刷新隊列的函式，讓分類過濾後也能正確切換
        window.refreshLightbox = function() {
            const visibleItems = Array.from(document.querySelectorAll(".masonry-item"))
                                    .filter(item => item.style.display !== "none");
            
            currentImages = visibleItems.map(item => item.querySelector(".lightbox-trigger"))
                                      .filter(img => img !== null);

            currentImages.forEach((img, index) => {
                img.onclick = (e) => {
                    e.preventDefault();
                    lightbox.style.display = "flex";
                    lightboxImg.src = img.src;
                    currentIndex = index;
                    document.body.style.overflow = "hidden";
                };
            });
        };

        window.refreshLightbox();

        function closeLightbox() {
            lightbox.style.display = "none";
            document.body.style.overflow = "auto";
        }

        if (closeBtn) closeBtn.onclick = closeLightbox;
        lightbox.onclick = (e) => { if (e.target === lightbox) closeLightbox(); };

        function showNext() {
            if (currentImages.length === 0) return;
            currentIndex = (currentIndex + 1) % currentImages.length;
            lightboxImg.src = currentImages[currentIndex].src;
        }

        function showPrev() {
            if (currentImages.length === 0) return;
            currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
            lightboxImg.src = currentImages[currentIndex].src;
        }

        if (prevBtn) prevBtn.onclick = showPrev;
        if (nextBtn) nextBtn.onclick = showNext;

        // 鍵盤控制
        document.addEventListener("keydown", (e) => {
            if (lightbox.style.display !== "flex") return;
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowRight") showNext();
            if (e.key === "ArrowLeft") showPrev();
        });
    }

    /* ===== 5. 圖片漸顯效果 ===== */
    function initLazyFade() {
        document.querySelectorAll(".lazy-img").forEach(img => {
            if (img.complete) {
                img.classList.add("loaded");
            } else {
                img.addEventListener("load", () => img.classList.add("loaded"));
            }
        });
    }

    /* ===== 6. 網址參數偵測 ===== */
    function applyURLCategory() {
        const params = new URLSearchParams(window.location.search);
        const category = params.get("cat");
        if (category) {
            document.querySelectorAll(".filter-btn").forEach(btn => {
                if (btn.dataset.filter === category) btn.click();
            });
        }
    }

    /* ===== 7. 多語系切換 ===== */
    function applyLanguage(lang) {
        document.querySelectorAll("[data-en]").forEach(el => {
            if (el.dataset[lang]) el.textContent = el.dataset[lang];
        });
        document.documentElement.lang = lang;
    }

    let currentLang = localStorage.getItem("site-lang") || "en";
    applyLanguage(currentLang);

    const langBtn = document.getElementById("lang-toggle");
    if (langBtn) {
        langBtn.addEventListener("click", () => {
            currentLang = (currentLang === "en") ? "zh" : "en";
            localStorage.setItem("site-lang", currentLang);
            applyLanguage(currentLang);
        });
    }

    /* ===== 8. 來訪計數器 ===== */
    const countDisplay = document.getElementById('visit-count');
    if (countDisplay) {
        fetch('https://api.counterapi.dev/v1/lukuarts/homepage/up')
            .then(res => res.json())
            .then(data => { countDisplay.textContent = data.count; })
            .catch(() => {});
    }
});