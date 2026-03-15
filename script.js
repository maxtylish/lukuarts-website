document.addEventListener("DOMContentLoaded", () => {
    
    // 1. 導覽列滾動變色
    const navbar = document.querySelector(".navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // 2. 載入作品集資料
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
            })
            .catch(err => console.error("無法載入 images.json:", err));
    }

    // 3. 關閉燈箱
    const closeBtn = document.querySelector(".lightbox-close");
    if (closeBtn) {
        closeBtn.onclick = () => {
            document.getElementById("lightbox").style.display = "none";
            document.body.style.overflow = "auto";
        };
    }

    // 4. 多語系切換
    const langBtn = document.getElementById("lang-toggle");
    let currentLang = localStorage.getItem("site-lang") || "en";

    const updateLang = (lang) => {
        document.querySelectorAll("[data-en]").forEach(el => {
            el.textContent = el.dataset[lang];
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

    // 5. 訪客計數器
    fetch('https://api.counterapi.dev/v1/lukuarts/homepage/up')
        .then(res => res.json())
        .then(data => {
            const countEl = document.getElementById('visit-count');
            if (countEl) countEl.textContent = data.count;
        }).catch(() => {});
});