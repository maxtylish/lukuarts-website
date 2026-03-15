document.addEventListener("DOMContentLoaded", () => {
    
    /* ===== 1. 導覽列滾動效果 ===== */
    const navbar = document.querySelector(".navbar");
    if (navbar) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                // 捲動後的樣式
                navbar.style.background = "rgba(10, 10, 10, 0.95)";
                navbar.style.padding = "0.8rem 5%";
                navbar.style.backdropFilter = "blur(10px)";
                navbar.style.borderBottom = "1px solid rgba(255,255,255,0.05)";
            } else {
                // 回到頂部的樣式
                navbar.style.background = "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)";
                navbar.style.padding = "1.2rem 5%";
                navbar.style.backdropFilter = "none";
                navbar.style.borderBottom = "none";
            }
        });
    }

    /* ===== 2. 作品集載入與過濾邏輯 ===== */
    const gallery = document.getElementById("gallery");
    if (gallery) {
        fetch("images.json")
            .then(res => {
                if (!res.ok) throw new Error("找不到 images.json，請檢查檔案名稱與位置");
                return res.json();
            })
            .then(images => {
                gallery.innerHTML = ""; // 清空現有內容

                // 動態生成每一張圖
                images.forEach((img, index) => {
                    const item = document.createElement("div");
                    item.className = "masonry-item";
                    item.dataset.category = img.category; // ⚡ 這是篩選邏輯的核心，必須寫入 data-category

                    const titleText = img.title ? img.title : "LUKUARTS VISUAL";
                    const categoryText = img.category ? img.category.toUpperCase() : "PHOTOGRAPHY";

                    // 確保這裡的 HTML 包含懸停遮罩 (item-overlay)
                    item.innerHTML = `
                        <img src="${img.src}" class="lazy-img" loading="lazy" alt="${titleText}">
                        <div class="item-overlay" style="pointer-events: none;">
                            <div class="overlay-text">
                                <p>${categoryText}</p>
                            </div>
                        </div>
                    `;
                    gallery.appendChild(item);
                });

                // ⚡ 核心：圖片生成後，立即初始化所有功能
                initLazyFade();     // 漸顯效果與滑鼠滑過效果
                initFilter();       // 分類篩選邏輯
                initLightbox();     // 燈箱控制
                applyLang(localStorage.getItem("site-lang") || "en"); // 確保生成出的文字語系正確
            })
            .catch(err => {
                console.error("【載入錯誤】:", err.message);
                gallery.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:red; padding: 2rem;">圖片載入失敗: ${err.message}<br>請檢查 images.json 路徑是否正確</p>`;
            });
    }

    /* ===== 3. 分類過濾功能 ===== */
    function initFilter() {
        const filterBtns = document.querySelectorAll(".filter-btn");
        if (filterBtns.length === 0) return;

        filterBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                // 按鈕樣式切換
                filterBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                const filter = btn.dataset.filter;
                // ⚡ 修正過濾圖片顯示
                document.querySelectorAll(".masonry-item").forEach(item => {
                    if (filter === "all" || item.dataset.category === filter) {
                        item.style.display = "block"; // 符合分類則顯示
                    } else {
                        item.style.display = "none"; // 不符合則隱藏
                    }
                });

                // 過濾後，必須重新初始化燈箱控制，確保在新的圖片隊列中點擊正常
                initLightbox();
            });
        });
    }

    /* ===== 4. Lightbox 燈箱系統 (修正功能切換與箭頭問題) ===== */
    function initLightbox() {
        const lightbox = document.getElementById("lightbox");
        const lightboxImg = document.getElementById("lightbox-img");
        if (!lightbox) return;

        let currentImages = [];
        let currentIndex = 0;

        // 刷新燈箱的隊列 (只抓取目前「顯示」的圖片)
        function refreshLightboxQueue() {
            // 從 gallery 中抓取所有 Masonry Item
            const items = Array.from(gallery.querySelectorAll(".masonry-item"));
            // 只過濾出 `display !== "none"` 的 Item
            currentImages = items.filter(el => el.style.display !== "none")
                                 .map(el => el.querySelector("img").src);
        }

        refreshLightboxQueue();

        // 重新綁定點擊事件
        document.querySelectorAll(".masonry-item").forEach(item => {
            // 點擊 Item 容器開啟燈箱
            item.onclick = (e) => {
                // 如果目前的隊列中沒有這張圖 (這代表 JS 的同步問題)，重新抓取一次
                if (currentImages.length === 0) refreshLightboxQueue();
                
                lightbox.style.display = "flex";
                lightboxImg.src = item.querySelector("img").src;
                // 找出點擊這張圖在 currentImages 中的索引
                currentIndex = currentImages.indexOf(lightboxImg.src);
                document.body.style.overflow = "hidden"; // 禁止背景捲動
            };
        });

        // 關閉燈箱
        const closeLightbox = () => {
            lightbox.style.display = "none";
            document.body.style.overflow = "auto";
        };

        const closeBtn = document.querySelector(".lightbox-close");
        if (closeBtn) closeBtn.onclick = closeLightbox;
        // 點擊背景也可關閉
        lightbox.onclick = (e) => { if (e.target === lightbox) closeLightbox(); };

        // 切換控制
        function showNext(e) {
            e.stopPropagation(); // 防止點擊箭頭也關閉燈箱
            if (currentImages.length <= 1) return;
            currentIndex = (currentIndex + 1) % currentImages.length;
            lightboxImg.src = currentImages[currentIndex];
        }

        function showPrev(e) {
            e.stopPropagation();
            if (currentImages.length <= 1) return;
            currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
            lightboxImg.src = currentImages[currentIndex];
        }

        const nextBtn = document.querySelector(".lightbox-next");
        const prevBtn = document.querySelector(".lightbox-prev");
        if (nextBtn) nextBtn.onclick = showNext;
        if (prevBtn) prevBtn.onclick = showPrev;

        // 鍵盤控制 (左右切換與 Esc 關閉)
        document.addEventListener("keydown", (e) => {
            if (lightbox.style.display !== "flex") return;
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowRight") {
                currentIndex = (currentIndex + 1) % currentImages.length;
                lightboxImg.src = currentImages[currentIndex];
            }
            if (e.key === "ArrowLeft") {
                currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
                lightboxImg.src = currentImages[currentIndex];
            }
        });
    }

    /* ===== 5. 圖片漸顯效果與功能補全 (修正滑鼠效果) ===== */
    function initLazyFade() {
        document.querySelectorAll(".lazy-img").forEach(img => {
            if (img.complete) {
                img.classList.add("loaded");
            } else {
                img.addEventListener("load", () => img.classList.add("loaded"));
            }
        });
    }

    /* ===== 6. 多語系切換功能 (強化版) ===== */
    const langBtn = document.getElementById("lang-toggle");
    let lang = localStorage.getItem("site-lang") || "en";

    const applyLang = (l) => {
        document.querySelectorAll("[data-en]").forEach(el => {
            if (el.dataset[l]) el.textContent = el.dataset[l];
        });
        document.documentElement.lang = l;
    };

    applyLang(lang); // 初始套用

    if (langBtn) {
        langBtn.addEventListener("click", () => {
            lang = (lang === "en") ? "zh" : "en";
            localStorage.setItem("site-lang", lang);
            applyLang(lang);
        });
    }

    /* ===== 7. 訪客計數器 (Counter API) ===== */
    const visitCount = document.getElementById('visit-count');
    if (visitCount) {
        fetch('https://api.counterapi.dev/v1/lukuarts/homepage/up')
            .then(res => res.json())
            .then(data => { visitCount.textContent = data.count; })
            .catch(() => { if(visitCount.parentElement) visitCount.parentElement.style.display = 'none'; });
    }
});