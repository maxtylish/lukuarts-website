document.addEventListener("DOMContentLoaded", () => {
    
    /* ===== 1. 導覽列滾動效果 ===== */
    const navbar = document.querySelector(".navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.style.background = "rgba(10, 10, 10, 0.95)";
            navbar.style.padding = "1rem 5%";
        } else {
            navbar.style.background = "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)";
            navbar.style.padding = "1.5rem 5%";
        }
    });

    /* ===== 2. 核心：從 JSON 載入圖片 (修正重點) ===== */
    const gallery = document.getElementById("gallery");
    
    if (gallery) {
        fetch("images.json")
            .then(res => {
                if (!res.ok) throw new Error("找不到 images.json 檔案");
                return res.json();
            })
            .then(images => {
                gallery.innerHTML = ""; // 先清空容器
                
                images.forEach((img, index) => {
                    const item = document.createElement("div");
                    item.className = "masonry-item";
                    
                    // 生成圖片 HTML
                    item.innerHTML = `
                        <img src="${img.src}" alt="Photography" loading="lazy">
                        <div class="item-overlay">
                            <div class="overlay-text">
                                <p>${img.category ? img.category.toUpperCase() : 'VIEW'}</p>
                            </div>
                        </div>
                    `;

                    // 綁定點擊燈箱事件
                    item.onclick = () => openLightbox(img.src);
                    
                    gallery.appendChild(item);
                });
            })
            .catch(err => {
                console.error("圖片載入失敗:", err);
                gallery.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:#666;">Images currently unavailable.</p>`;
            });
    }

    /* ===== 3. 燈箱功能 (Lightbox) ===== */
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    
    function openLightbox(src) {
        if (lightbox && lightboxImg) {
            lightbox.style.display = "flex";
            lightboxImg.src = src;
            document.body.style.overflow = "hidden"; // 禁止背景捲動
        }
    }

    const closeBtn = document.querySelector(".lightbox-close");
    if (closeBtn) {
        closeBtn.onclick = () => {
            lightbox.style.display = "none";
            document.body.style.overflow = "auto";
        };
    }

    // 點擊背景也可以關閉燈箱
    if (lightbox) {
        lightbox.onclick = (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = "none";
                document.body.style.overflow = "auto";
            }
        };
    }

    /* ===== 4. 多語系切換 ===== */
    const langBtn = document.getElementById("lang-toggle");
    let currentLang = localStorage.getItem("site-lang") || "en";

    const updateLang = (lang) => {
        document.querySelectorAll("[data-en]").forEach(el => {
            const text = el.getAttribute(`data-${lang}`);
            if (text) el.textContent = text;
        });
        document.documentElement.lang = lang;
    };
    
    updateLang(currentLang);

    if (langBtn) {
        langBtn.onclick = () => {
            currentLang = currentLang === "en" ? "zh" : "en";
            localStorage.setItem("site-lang", currentLang);
            updateLang(currentLang);
        };
    }

    /* ===== 5. 訪客計數器 ===== */
    const countEl = document.getElementById('visit-count');
    if (countEl) {
        fetch('https://api.counterapi.dev/v1/lukuarts/homepage/up')
            .then(res => res.json())
            .then(data => { countEl.textContent = data.count; })
            .catch(() => {});
    }
});