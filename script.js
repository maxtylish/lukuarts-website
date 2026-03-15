document.addEventListener("DOMContentLoaded", () => {
    
    /* ===== 1. 導覽列與捲動控制 ===== */
    const navbar = document.querySelector(".navbar");
    if (navbar) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                navbar.style.background = "rgba(15, 15, 15, 0.95)";
                navbar.style.backdropFilter = "blur(10px)";
                navbar.style.padding = "1rem 5%";
            } else {
                navbar.style.background = "transparent";
                navbar.style.padding = "1.5rem 5%";
            }
        });
    }

    /* ===== 2. 作品集載入邏輯 (Portfolio / Home) ===== */
    const gallery = document.getElementById("gallery");
    if (gallery) {
        fetch("images.json")
            .then(res => {
                if (!res.ok) throw new Error("找不到 images.json");
                return res.json();
            })
            .then(images => {
                gallery.innerHTML = ""; 
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
            .catch(err => console.error("作品集載入錯誤:", err));
    }

    /* ===== 3. Blog 文章載入邏輯 ===== */
    const blogContainer = document.getElementById("blog-container");
    if (blogContainer) {
        fetch("blog.json")
            .then(res => {
                if (!res.ok) throw new Error("找不到 blog.json");
                return res.json();
            })
            .then(posts => {
                blogContainer.innerHTML = "";
                posts.forEach(post => {
                    const card = document.createElement("div");
                    card.className = "blog-card";
                    card.innerHTML = `
                        <img src="${post.thumbnail}" class="blog-card-img" alt="${post.title}">
                        <div class="blog-card-content">
                            <span class="blog-card-date">${post.date}</span>
                            <h3 class="blog-card-title">${post.title}</h3>
                            <p class="blog-card-excerpt">${post.excerpt}</p>
                            <a href="${post.link}" class="btn" style="padding: 0.5rem 1rem; font-size: 0.7rem; background: transparent; color: #c9a96e; border-color: #c9a96e;">READ MORE</a>
                        </div>
                    `;
                    blogContainer.appendChild(card);
                });
            })
            .catch(err => console.error("Blog 載入錯誤:", err));
    }

    /* ===== 4. 分類過濾 (Portfolio Only) ===== */
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

    /* ===== 5. 燈箱功能 (Lightbox) ===== */
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
                item.onclick = (e) => {
                    e.preventDefault();
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

        lightbox.onclick = (e) => { if (e.target === lightbox) lightbox.querySelector(".lightbox-close").click(); };
    }

    /* ===== 6. 多語系切換 ===== */
    const langBtn = document.getElementById("lang-toggle");
    let currentLang = localStorage.getItem("site-lang") || "en";

    const applyLanguage = (lang) => {
        document.querySelectorAll("[data-en]").forEach(el => {
            if (el.dataset[lang]) el.textContent = el.dataset[lang];
        });
        document.documentElement.lang = lang;
    };

    applyLanguage(currentLang);

    if (langBtn) {
        langBtn.addEventListener("click", () => {
            currentLang = (currentLang === "en") ? "zh" : "en";
            localStorage.setItem("site-lang", currentLang);
            applyLanguage(currentLang);
        });
    }

    /* ===== 7. 來訪人數計數器 ===== */
    const visitCount = document.getElementById('visit-count');
    if (visitCount) {
        fetch('https://api.counterapi.dev/v1/lukuarts/homepage/up')
            .then(res => res.json())
            .then(data => { visitCount.textContent = data.count; })
            .catch(() => { visitCount.parentElement.style.display = 'none'; });
    }
});