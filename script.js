document.addEventListener("DOMContentLoaded", () => {
    
    const gallery = document.getElementById("gallery");

    /* 1. 從 JSON 載入資料 */
    fetch("images.json")
        .then(res => {
            if (!res.ok) throw new Error("JSON 載入失敗");
            return res.json();
        })
        .then(images => {
            if (!gallery) return;
            gallery.innerHTML = ""; // 清空現有內容

            images.forEach(img => {
                const item = document.createElement("div");
                item.className = "masonry-item";
                item.dataset.category = img.category;

                const titleText = img.title ? img.title : "LUKUARTS VISUAL";
                const categoryText = img.category ? img.category.toUpperCase() : "PHOTOGRAPHY";

                item.innerHTML = `
                    <img src="${img.src}" class="lightbox-trigger" loading="lazy" alt="${titleText}">
                    <div class="item-overlay" style="pointer-events: none;">
                        <div class="overlay-text" style="text-align: center;">
                            <h3 style="font-size: 1.4rem;">${titleText}</h3>
                            <p style="color: #c9a96e; font-size: 0.8rem; margin-top: 5px;">${categoryText}</p>
                        </div>
                    </div>
                `;
                gallery.appendChild(item);
            });

            initFilter();
            initLightbox();
        })
        .catch(err => console.error("系統錯誤:", err));

    /* 2. 分類過濾功能 */
    function initFilter() {
        const btns = document.querySelectorAll(".filter-btn");
        btns.forEach(btn => {
            btn.addEventListener("click", () => {
                btns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                const filter = btn.dataset.filter;
                document.querySelectorAll(".masonry-item").forEach(item => {
                    item.style.display = (filter === "all" || item.dataset.category === filter) ? "block" : "none";
                });
                if (window.refreshLightbox) window.refreshLightbox();
            });
        });
    }

    /* 3. 燈箱功能 */
    function initLightbox() {
        const lightbox = document.getElementById("lightbox");
        const lightboxImg = document.getElementById("lightbox-img");
        if (!lightbox) return;

        let currentImages = [];
        let currentIndex = 0;

        window.refreshLightbox = () => {
            const items = Array.from(document.querySelectorAll(".masonry-item"))
                               .filter(el => el.style.display !== "none");
            currentImages = items.map(el => el.querySelector("img").src);
            
            items.forEach((item, index) => {
                item.onclick = () => {
                    lightbox.style.display = "flex";
                    lightboxImg.src = currentImages[index];
                    currentIndex = index;
                    document.body.style.overflow = "hidden";
                };
            });
        };

        window.refreshLightbox();

        document.querySelector(".lightbox-close").onclick = () => {
            lightbox.style.display = "none";
            document.body.style.overflow = "auto";
        };

        document.querySelector(".lightbox-next").onclick = () => {
            currentIndex = (currentIndex + 1) % currentImages.length;
            lightboxImg.src = currentImages[currentIndex];
        };

        document.querySelector(".lightbox-prev").onclick = () => {
            currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
            lightboxImg.src = currentImages[currentIndex];
        };
    }

    /* 4. 多語系功能 */
    const langBtn = document.getElementById("lang-toggle");
    let lang = localStorage.getItem("site-lang") || "en";

    const applyLang = (l) => {
        document.querySelectorAll("[data-en]").forEach(el => {
            el.textContent = el.dataset[l];
        });
    };

    applyLang(lang);

    if (langBtn) {
        langBtn.onclick = () => {
            lang = (lang === "en") ? "zh" : "en";
            localStorage.setItem("site-lang", lang);
            applyLang(lang);
        };
    }

    /* 5. 計數器 */
    fetch('https://api.counterapi.dev/v1/lukuarts/homepage/up')
        .then(res => res.json())
        .then(data => { 
            const counter = document.getElementById('visit-count');
            if(counter) counter.textContent = data.count; 
        });
});