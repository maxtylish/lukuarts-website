document.addEventListener("DOMContentLoaded", () => {
    // 1. 導覽列滾動
    const navbar = document.querySelector(".navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.style.background = "rgba(10, 10, 10, 0.95)";
        } else {
            navbar.style.background = "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)";
        }
    });

    // 2. 多語系切換 (修正標籤選取)
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