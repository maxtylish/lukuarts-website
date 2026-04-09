document.addEventListener("DOMContentLoaded", () => {

    const gallery = document.getElementById("gallery");
    if (!gallery) return;

    let allImages = [];

    /* ===== 載入圖片 ===== */
    fetch("images.json")
        .then(res => res.json())
        .then(images => {

            allImages = images;

            renderGallery(allImages);
            initFilter();

        })
        .catch(err => {
            console.error("JSON 讀取失敗", err);
        });

    /* ===== 渲染 ===== */
    function renderGallery(data){

        gallery.innerHTML = "";

        data.forEach(img => {

            const item = document.createElement("div");
            item.className = "masonry-item";
            item.dataset.category = img.category;

            item.innerHTML = `
                <img src="${img.src}" class="lightbox-trigger" loading="lazy">
            `;

            gallery.appendChild(item);

        });

        initLightbox();
    }

    /* ===== Filter ===== */
    function initFilter(){

        const btns = document.querySelectorAll(".filter-btn");

        btns.forEach(btn => {

            btn.addEventListener("click", () => {

                btns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                const filter = btn.dataset.filter;

                if(filter === "all"){
                    renderGallery(allImages);
                } else {
                    const filtered = allImages.filter(img => img.category === filter);
                    renderGallery(filtered);
                }

            });

        });

    }

    /* ===== Lightbox ===== */
    function initLightbox(){

        const lightbox = document.getElementById("lightbox");
        const lightboxImg = document.getElementById("lightbox-img");

        if(!lightbox) return;

        const imgs = document.querySelectorAll(".lightbox-trigger");

        imgs.forEach(img => {
            img.onclick = () => {
                lightbox.style.display = "flex";
                lightboxImg.src = img.src;
                document.body.style.overflow = "hidden";
            };
        });

        lightbox.onclick = () => {
            lightbox.style.display = "none";
            document.body.style.overflow = "auto";
        };

    }

});
/* ===== Sakura effect ===== */

const sakuraBox = document.getElementById('sakura-rain');

if (sakuraBox) {

    setInterval(() => {

        const petal = document.createElement('div');
        petal.classList.add('sakura-petal');

        const size = Math.random() * 8 + 6 + 'px';
        petal.style.width = size;
        petal.style.height = size;

        petal.style.left = Math.random() * 100 + '%';

        const duration = Math.random() * 5 + 6;
        petal.style.animationDuration = duration + 's';

        sakuraBox.appendChild(petal);

        setTimeout(() => {
            petal.remove();
        }, duration * 1000);

    }, 300);

}