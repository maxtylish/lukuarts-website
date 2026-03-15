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
                gallery.innerHTML = "";
                images.forEach((img, index) => {
                    const item = document.createElement("div");
                    item.className = "masonry-item";
                    item.innerHTML = `<img src="${img.src}" alt="Lukuarts Works" loading="lazy">`;
                    
                    item.onclick = () => {
                        const lightbox = document.getElementById("lightbox");
                        const lightboxImg = document.getElementById("lightbox-img");
                        lightbox.style.display = "flex";
                        lightboxImg.src = img.src;
                        document.body.style.overflow = "hidden";
                    };
                    gallery.appendChild(item);
                });
            });
    }

    // 3. 關閉燈箱
    const lightbox = document.getElementById("lightbox");
    if (lightbox) {
        document.querySelector(".lightbox-close").onclick = () => {
            lightbox.style.display = "none";
            document.body.style.overflow = "auto";
        };
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