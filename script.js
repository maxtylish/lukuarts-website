document.addEventListener("DOMContentLoaded", () => {
    
    /* ===== 1. 導覽列滾動與縮放效果 ===== */
    const navbar = document.querySelector(".navbar");
    if (navbar) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                // 捲動後的樣式
                navbar.style.background = "rgba(10, 10, 10, 0.95)";
                navbar.style.padding = "0.8rem 5%";
                navbar.style.backdropFilter = "blur(10px)";
            } else {
                // 回到頂部的樣式
                navbar.style.background = "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)";
                navbar.style.padding = "1.2rem 5%";
                navbar.style.backdropFilter = "none";
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
                                <h3 style="font-size: 1.2rem;">${titleText}</h3>
                                <p style="color: #c9a96e; font-size: 0.75rem; margin-top: 5px;">${categoryText}</p>
                            </div>
                        </div>
                    `;
                    gallery.appendChild(item);
                });
                // 載入完成後初始化功能
                initFilter();
                initLightbox();
            })
            .catch(err => console.error("作品集載入錯誤:", err));
    }

    /* ===== 3