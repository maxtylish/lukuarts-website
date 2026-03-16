document.addEventListener("DOMContentLoaded", () => {
    
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

    /* ===== 2. 作品集渲染函數 ===== */
    const gallery = document.getElementById("gallery");
    
    function renderGallery(items) {
        if (!gallery) return;
        gallery.innerHTML = items.map(item => `
            <div class="masonry-item" data-category="${item.category}">
                <img src="${item.url || item.src}" class="lazy-img" loading="lazy">
                <div class="item-overlay"><div class="overlay-text"><p>${item.title || 'LUKUARTS'}</p></div></div>
            </div>
        `).join("");
        
        // 渲染完後嘗試綁定燈箱
        if (typeof initLightbox === "function") initLightbox();
    }

    /* ===== 3. 分類過濾邏輯 ===== */
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
                applyLang(localStorage.getItem("site-lang") || "en");
            };
        });
    }

    // 啟動作品集載入
    if (gallery) {
        fetch("images.json")
            .then(res => res.json())
            .then(images => {
                renderGallery(images);
                initFilter(images);
                applyLang(localStorage.getItem("site-lang") || "en");
            })
            .catch(err => console.error("圖片資料載入失敗:", err));
    }

    /* ===== 4. 多語系核心 ===== */
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
            location.reload(); // 重新整理以確保所有動態內容更新
        };
    }

    /* ===== 5. 櫻花雨產生器 (放在最後確保不被卡住) ===== */
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

    /* ===== 6. 燈箱功能保底 ===== */
    window.initLightbox = function() {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const prevBtn = document.querySelector(".lightbox-prev");
    const nextBtn = document.querySelector(".lightbox-next");
    const closeBtn = document.querySelector(".lightbox-close");

    if (!lightbox || !lightboxImg) return;

    // 獲取目前畫面上顯示的所有圖片（考量到過濾後的結果）
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

    // 綁定左右按鈕點擊事件
    if (prevBtn) {
        prevBtn.onclick = (e) => {
            e.stopPropagation(); // 防止點擊按鈕時觸發關閉燈箱
            showImage(currentIndex - 1);
        };
    }

    if (nextBtn) {
        nextBtn.onclick = (e) => {
            e.stopPropagation();
            showImage(currentIndex + 1);
        };
    }

    // 關閉邏輯
    const closeLightbox = () => {
        lightbox.style.display = "none";
        document.body.style.overflow = "auto";
    };

    if (closeBtn) closeBtn.onclick = closeLightbox;
    
    // 點擊背景也可以關閉
    lightbox.onclick = (e) => {
        if (e.target === lightbox) closeLightbox();
    };
};

    // 初次載入多語系
    applyLang(localStorage.getItem("site-lang") || "en");
});