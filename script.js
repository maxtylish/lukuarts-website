document.addEventListener("DOMContentLoaded", () => {
    // 捲動效果
    const navbar = document.querySelector(".navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.style.background = "rgba(10, 10, 10, 0.95)";
        } else {
            navbar.style.background = "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)";
        }
    });

    // 多語系切換 (修正按鈕文字消失問題)
    const langBtn = document.getElementById("lang-toggle");
    let currentLang = localStorage.getItem("site-lang") || "en";

    const updateLang = (lang) => {
        document.querySelectorAll("[data-en]").forEach(el => {
            if (el.dataset[lang]) {
                el.textContent = el.dataset[lang];
            }
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