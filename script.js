document.addEventListener("DOMContentLoaded", () => {
    
    // 1. 導覽列滾動監聽
    const navbar = document.querySelector(".navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // 2. 載入作品集
    const gallery = document.getElementById("gallery");
    if (gallery) {
        fetch("images.json")
            .then(res => res.json())
            .then(images => {
                gallery.innerHTML = ""; // 先清空容器
                images.forEach(img => {
                    const item = document.createElement("div");
                    item.className = "masonry-item";
                    
                    // ⚡ 這裡包含 item-overlay 結構，CSS 的金色字才跑得出來
                    item.innerHTML = `
                        <img src="${img.src}" alt="Works" loading="lazy">
                        <div class="item-overlay">
                            <div class="overlay-text">
                                <p>${img.category ? img.category.toUpperCase() : 'VIEW'}</p>
                            </div>
                        </div>
                    `;
                    
                    item.onclick = () => openLightbox(img.src);
                    gallery.appendChild(item);
                });
            })
            .catch(err => console.error("無法載入 images.json:", err));
    }

    // 3. 燈箱邏輯
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");

    function openLightbox(src) {
        if (lightbox && lightboxImg) {
            lightbox.style.display = "flex";
            lightboxImg.src = src;
            document.body.style.overflow = "hidden"; // 禁止背景捲動
        }
    }

    if (lightbox) {
        // 點擊關閉按鈕
        document.querySelector(".lightbox-close").onclick = () => {
            lightbox.style.display = "none";
            document.body.style.overflow = "auto";
        };
        // 點擊背景關閉
        lightbox.onclick = (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = "none";
                document.body.style.overflow = "auto";
            }
        };
    }

    // 4. 多語系
    const langBtn = document.getElementById("lang-toggle");
    let currentLang = localStorage.getItem("site-lang") || "en";

    const updateLang = (lang) => {
        document.querySelectorAll("[data-en]").forEach(el => {
            const text = el.getAttribute(`data-${lang}`);
            if (text) el.textContent = text;
        });
    };
    updateLang(currentLang);

    if (langBtn) {
        langBtn.onclick = () => {
            currentLang = currentLang === "en" ? "zh" : "en";
            localStorage.setItem("site-lang", currentLang);
            updateLang(currentLang);
        };
    }
});