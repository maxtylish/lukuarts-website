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

   /* ===== 3. 作品集渲染與過濾 (整合優化版) ===== */
const gallery = document.getElementById("gallery");

// 渲染畫廊函式
function renderGallery(items) {
    if (!gallery) return;
    
    gallery.innerHTML = items.map(item => `
        <div class="masonry-item" data-category="${item.category}">
            <img src="${item.url || item.src}" class="lazy-img" alt="${item.category}" loading="lazy">
            <div class="item-overlay">
                <div class="overlay-text">
                    <p>${item.category}</p>
                </div>
            </div>
        </div>
    `).join("");
    
    // 渲染完後重新綁定燈箱事件
    if (typeof window.initLightbox === "function") {
        window.initLightbox();
    }
}

// 初始化過濾器函式
function initFilter(allData) {
    const filterBtns = document.querySelectorAll(".filter-btn");
    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 切換 Active 樣式
            filterBtns.forEach(b => b.classList.remove("active"));
            this.classList.add("active");

            const filterValue = this.dataset.filter;
            const filteredData = (filterValue === "all") 
                ? allData 
                : allData.filter(item => item.category === filterValue);

            renderGallery(filteredData);
        });
    });
}

// 單一 Fetch 進入點：執行載入與自動過濾
if (gallery) {
    fetch("images.json")
        .then(res => {
            if (!res.ok) throw new Error("找不到 images.json 檔案");
            return res.json();
        })
        .then(images => {
            // 1. 先執行初始渲染與綁定過濾按鈕
            renderGallery(images);
            initFilter(images);

            // 2. ✨ 自動過濾邏輯：檢查網址是否有 ?filter=xxx
            const urlParams = new URLSearchParams(window.location.search);
            const filterParam = urlParams.get('filter');

            if (filterParam) {
                const targetBtn = document.querySelector(`.filter-btn[data-filter="${filterParam}"]`);
                if (targetBtn) {
                    // 模擬點擊按鈕來觸發過濾
                    targetBtn.click();
                    // 滾動到作品集位置
                    setTimeout(() => {
                        gallery.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 300); // 稍微延遲確保圖片已開始渲染
                }
            }
        })
        .catch(err => {
            console.error("圖片資料載入失敗:", err);
            gallery.innerHTML = `<p style="text-align:center; color:gray;">暫時無法載入作品，請稍後再試。</p>`;
        });
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

/* ===== ✨ 8. 升級版雙重雷達感測器：支援多個光圈 (精修版) ===== */
const laserApertures = document.querySelectorAll('.animated-aperture');
if (laserApertures.length > 0) {
    const observerOptions = {
        root: null, 
        threshold: 0.2, // 進入 20% 就開始跑動畫，視覺感更即時
        rootMargin: "0px 0px -50px 0px" // 稍微提前觸發
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 觸發雷射描繪
                entry.target.parentElement.classList.add('play-laser');
                // 一旦觸發後就停止監視，避免重複跑描繪動畫（除非你希望每次滑過都重跑）
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);
    
    laserApertures.forEach(aperture => {
        observer.observe(aperture);
    });
}
/* ===== 9. 多國語言切換邏輯 ===== */
const langToggle = document.getElementById('lang-toggle');
// 從 localStorage 讀取語系設定，預設為 'zh'
let currentLang = localStorage.getItem('preferred-lang') || 'zh';

function updateLanguage(lang) {
    // 儲存選擇到本地
    localStorage.setItem('preferred-lang', lang);
    
    // 1. 處理帶有 data-en/data-zh 的一般文字標籤
    const translatableElements = document.querySelectorAll('[data-en][data-zh]');
    translatableElements.forEach(el => {
        el.textContent = el.getAttribute(`data-${lang}`);
    });

    // 2. 處理關於我頁面的特殊區塊 (lang-en / lang-zh div)
    const langEnDivs = document.querySelectorAll('.lang-en');
    const langZhDivs = document.querySelectorAll('.lang-zh');
    
    if (lang === 'en') {
        langEnDivs.forEach(div => div.style.display = 'block');
        langZhDivs.forEach(div => div.style.display = 'none');
    } else {
        langEnDivs.forEach(div => div.style.display = 'none');
        langZhDivs.forEach(div => div.style.display = 'block');
    }

    // 3. 更新按鈕本身的文字 (選擇性)
    if (langToggle) {
        langToggle.textContent = lang === 'en' ? '中 / EN' : 'EN / 中';
    }
}

// 初始化語系
updateLanguage(currentLang);

// 綁定點擊事件
if (langToggle) {
    langToggle.addEventListener('click', () => {
        currentLang = (currentLang === 'zh') ? 'en' : 'zh';
        updateLanguage(currentLang);
    });
}
});