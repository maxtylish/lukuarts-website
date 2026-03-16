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

    /* ===== 2. 作品集核心載入邏輯 ===== */
    const gallery = document.getElementById("gallery");
    if (gallery) {
        fetch("images.json")
            .then(res => {
                if (!res.ok) throw new Error("找不到 images.json");
                return res.json();
            })
            .then(images => {
                renderGallery(images);
                initFilter(images);
                initLightbox();
                applyLang(localStorage.getItem("site-lang") || "en");
            })
            .catch(err => {
                console.error("載入失敗:", err);
                gallery.innerHTML = `<p style="color:red; text-align:center; padding:2rem;">圖片載入失敗，請確認 images.json 是否存在於根目錄</p>`;
            });
    }

    function renderGallery(items) {
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
        
        // 觸發圖片漸顯效果
        document.querySelectorAll(".lazy-img").forEach(img => {
            img.onload = () => img.style.opacity = "1";
        });
    }

    /* ===== 3. 分類過濾功能 ===== */
    function initFilter(allData) {
        const filterBtns = document.querySelectorAll(".filter-btn");
        filterBtns.forEach(btn => {
            btn.onclick = () => {
                filterBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                const filter = btn.dataset.filter;
                const filtered = (filter === "all") ? allData : allData.filter(i => i.category === filter);
                renderGallery(filtered);
                initLightbox(); // 重新綁定燈箱給新生成的圖片
            };
        });
    }

    /* ===== 4. 燈箱系統 (Lightbox) ===== */
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

    /* ===== 5. 多語系與計數器 ===== */
    const applyLang = (l) => {
        document.querySelectorAll("[data-en]").forEach(el => {
            if (el.dataset[l]) el.textContent = el.dataset[l];
        });
    };

    const langBtn = document.getElementById("lang-toggle");
    if (langBtn) {
        langBtn.onclick = () => {
            const currentLang = localStorage.getItem("site-lang") === "zh" ? "en" : "zh";
            localStorage.setItem("site-lang", currentLang);
            applyLang(currentLang);
        };
    }

    const visitCount = document.getElementById('visit-count');
    if (visitCount) {
        fetch('https://api.counterapi.dev/v1/lukuarts/homepage/up')
            .then(res => res.json())
            .then(data => { visitCount.textContent = data.count; })
            .catch(() => {});
    }
});