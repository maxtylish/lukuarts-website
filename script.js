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

    /* ===== 2. 手機漢堡選單控制 ===== */
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if(mobileMenu) mobileMenu.classList.remove('active');
            if(navLinks) navLinks.classList.remove('active');
        });
    });

    /* ===== 3. 作品集渲染與過濾 (讀取 images.json) ===== */
    const gallery = document.getElementById("gallery");
    
    function renderGallery(items) {
        if (!gallery) return;
        gallery.innerHTML = items.map(item => `
            <div class="masonry-item" data-category="${item.category}">
                <img src="${item.url || item.src}" class="lazy-img" loading="lazy">
                <div class="item-overlay">
                    <div class="overlay-text">
                        <p>${item.category}</p>
                    </div>
                </div>
            </div>
        `).join("");
        
        if (typeof initLightbox === "function") initLightbox();
    }

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
            };
        });
    }

    if (gallery) {
        fetch("images.json")
            .then(res => res.json())
            .then(images => {
                renderGallery(images);
                initFilter(images);
            })
            .catch(err => console.error("圖片資料載入失敗:", err));
    }

    /* ===== 4. 櫻花雨產生器 ===== */
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

    /* ===== 5. 燈箱功能 (Lightbox) ===== */
    window.initLightbox = function() {
        const lightbox = document.getElementById("lightbox");
        const lightboxImg = document.getElementById("lightbox-img");
        const prevBtn = document.querySelector(".lightbox-prev");
        const nextBtn = document.querySelector(".lightbox-next");
        const closeBtn = document.querySelector(".lightbox-close");

        if (!lightbox || !lightboxImg) return;

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

        if (prevBtn) prevBtn.onclick = (e) => { e.stopPropagation(); showImage(currentIndex - 1); };
        if (nextBtn) nextBtn.onclick = (e) => { e.stopPropagation(); showImage(currentIndex + 1); };

        const closeLightbox = () => {
            lightbox.style.display = "none";
            document.body.style.overflow = "auto";
        };

        if (closeBtn) closeBtn.onclick = closeLightbox;
        lightbox.onclick = (e) => { if (e.target === lightbox) closeLightbox(); };
    };

    /* ===== 6. 初始化 Swiper 輪播圖 ===== */
    if (document.querySelector('.mySwiper')) {
        const swiper = new Swiper(".mySwiper", {
            loop: true,
            grabCursor: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            }
        });
    }

    /* ===== 7. 回到頂部功能 (SVG 金色光圈) ===== */
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

}); // 👈 整個腳本在這裡完美結束