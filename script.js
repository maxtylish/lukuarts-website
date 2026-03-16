document.addEventListener("DOMContentLoaded", () => {
    
    // 1. 導覽列效果
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

    // 2. 作品集載入
    const gallery = document.getElementById("gallery");
    if (gallery) {
        fetch("images.json").then(res => res.json()).then(images => {
            gallery.innerHTML = images.map(item => 
                '<div class="masonry-item" data-category="' + item.category + '">' +
                '<img src="' + (item.url || item.src) + '" class="lazy-img" loading="lazy">' +
                '<div class="item-overlay"><div class="overlay-text"><p>' + (item.title || 'LUKUARTS') + '</p></div></div>' +
                '</div>'
            ).join("");
            initFilter(images);
            initLightbox();
            applyLang(localStorage.getItem("site-lang") || "en");
        });
    }

    // 3. 部落格載入
    const blogContainer = document.getElementById("blog-container");
    if (blogContainer) {
        fetch("blogs.json").then(res => res.json()).then(posts => {
            renderBlogs(posts);
            applyLang(localStorage.getItem("site-lang") || "en");
        });
    }
    function renderBlogs(posts) {
        if (!blogContainer) return;
        const lang = localStorage.getItem("site-lang") || "en";
        blogContainer.innerHTML = posts.map(post => 
            '<article class="blog-card">' +
            '<div class="blog-card-img-wrap"><img src="' + post.image + '" class="blog-card-img"></div>' +
            '<div class="blog-card-content">' +
            '<div class="blog-meta"><span class="blog-date">' + post.date + '</span></div>' +
            '<h2 class="blog-title">' + (lang === 'zh' ? post.title_zh : post.title_en) + '</h2>' +
            '<p class="blog-excerpt">' + (lang === 'zh' ? post.excerpt_zh : post.excerpt_en) + '</p>' +
            '<a href="post.html?id=' + post.id + '" class="blog-link">' + (lang === 'zh' ? '閱讀全文' : 'READ MORE') + '</a>' +
            '</div></article>'
        ).join("");
    }

    function applyLang(l) {
        document.querySelectorAll("[data-en]").forEach(el => {
            if (el.dataset[l]) el.textContent = el.dataset[l];
        });
        const zhBlocks = document.querySelectorAll(".lang-zh");
        const enBlocks = document.querySelectorAll(".lang-en");
        if (zhBlocks.length > 0) {
            zhBlocks.forEach(b => b.style.display = (l === "zh" ? "block" : "none"));
            enBlocks.forEach(b => b.style.display = (l === "en" ? "block" : "none"));
        }
        document.documentElement.lang = (l === "zh" ? "zh-Hant" : "en");
    }
    function renderBlogs(posts) {
        if (!blogContainer) return;
        const lang = localStorage.getItem("site-lang") || "en";
        blogContainer.innerHTML = posts.map(post => 
            '<article class="blog-card">' +
            '<div class="blog-card-img-wrap"><img src="' + post.image + '" class="blog-card-img"></div>' +
            '<div class="blog-card-content">' +
            '<div class="blog-meta"><span class="blog-date">' + post.date + '</span></div>' +
            '<h2 class="blog-title">' + (lang === 'zh' ? post.title_zh : post.title_en) + '</h2>' +
            '<p class="blog-excerpt">' + (lang === 'zh' ? post.excerpt_zh : post.excerpt_en) + '</p>' +
            '<a href="post.html?id=' + post.id + '" class="blog-link">' + (lang === 'zh' ? '閱讀全文' : 'READ MORE') + '</a>' +
            '</div></article>'
        ).join("");
    }

    function applyLang(l) {
        document.querySelectorAll("[data-en]").forEach(el => {
            if (el.dataset[l]) el.textContent = el.dataset[l];
        });
        const zhBlocks = document.querySelectorAll(".lang-zh");
        const enBlocks = document.querySelectorAll(".lang-en");
        if (zhBlocks.length > 0) {
            zhBlocks.forEach(b => b.style.display = (l === "zh" ? "block" : "none"));
            enBlocks.forEach(b => b.style.display = (l === "en" ? "block" : "none"));
        }
        document.documentElement.lang = (l === "zh" ? "zh-Hant" : "en");
    }
    const langBtn = document.getElementById("lang-toggle");
    if (langBtn) {
        langBtn.onclick = () => {
            const currentLang = localStorage.getItem("site-lang") === "zh" ? "en" : "zh";
            localStorage.setItem("site-lang", currentLang);
            applyLang(currentLang);
            if (blogContainer) fetch("blogs.json").then(res => res.json()).then(p => renderBlogs(p));
        };
    }

    const sakuraBox = document.getElementById('sakura-rain');
    if (sakuraBox) {
        setInterval(() => {
            const petal = document.createElement('div');
            petal.classList.add('sakura-petal');
            const size = Math.random() * 7 + 8 + 'px';
            petal.style.width = size; petal.style.height = size;
            petal.style.left = Math.random() * 100 + '%';
            const duration = Math.random() * 6 + 6;
            petal.style.animationDuration = duration + 's';
            sakuraBox.appendChild(petal);
            setTimeout(() => petal.remove(), duration * 1000 + 2000);
        }, 400);
    }
    applyLang(localStorage.getItem("site-lang") || "en");
}); // DOMContentLoaded 結束