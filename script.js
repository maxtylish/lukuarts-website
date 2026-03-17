// 初始化 Swiper 輪播圖
document.addEventListener('DOMContentLoaded', () => {
    // 確保只在有 swiper 元素的頁面上執行
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
        }); // 👈 Swiper 設定在這裡結束
    }

    /* ===== 10. 回到頂部功能 (SVG 金色光圈) ===== */
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth' /* 平滑滾動效果 */
            });
        });
    }
});