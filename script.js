document.addEventListener("DOMContentLoaded", () => {

    /* ===== Navbar scroll ===== */

    const navbar = document.querySelector(".navbar");

    window.addEventListener("scroll", () => {

        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }

    });


    /* ===== Load gallery ===== */

    fetch("images.json")
    .then(res => res.json())
    .then(images => {

        const gallery = document.getElementById("gallery");

        if(!gallery) return;

        images.forEach(img => {

            const item = document.createElement("div");
            item.className = "gallery-item";
            item.dataset.category = img.category;

            item.innerHTML = `
                <img src="${img.src}" class="lightbox-trigger" loading="lazy">
            `;

            gallery.appendChild(item);

        });

        initFilter();
        initLightbox();

    });


    /* ===== Filter system ===== */

    function initFilter(){

        const filterBtns = document.querySelectorAll(".filter-btn");
        const galleryItems = document.querySelectorAll(".gallery-item");

        filterBtns.forEach(btn => {

            btn.addEventListener("click", () => {

                filterBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                const filter = btn.dataset.filter;

                galleryItems.forEach(item => {

                    if(filter === "all" || item.dataset.category === filter){
                        item.style.display = "block";
                    } else {
                        item.style.display = "none";
                    }

                });

            });

        });

    }


    /* ===== Lightbox ===== */

    function initLightbox(){

        const lightbox = document.getElementById("lightbox");
        const lightboxImg = document.getElementById("lightbox-img");
        const closeBtn = document.querySelector(".lightbox-close");

        document.querySelectorAll(".lightbox-trigger").forEach(img => {

            img.addEventListener("click", () => {

                lightbox.style.display = "flex";
                lightboxImg.src = img.src;
                document.body.style.overflow = "hidden";

            });

        });

        const closeLightbox = () => {
            lightbox.style.display = "none";
            lightboxImg.src = "";
            document.body.style.overflow = "auto";
        };

        if(closeBtn){
            closeBtn.addEventListener("click", closeLightbox);
        }

        lightbox.addEventListener("click", e => {
            if(e.target === lightbox) closeLightbox();
        });

    }


    /* ===== Language switch ===== */

    const langBtn = document.getElementById("lang-toggle");

    let currentLang = localStorage.getItem("site-lang") || "en";

    function applyLanguage(lang){

        document.querySelectorAll("[data-en]").forEach(el => {

            el.textContent = el.dataset[lang];

        });

    }

    applyLanguage(currentLang);

    if(langBtn){

        langBtn.addEventListener("click", ()=>{

            currentLang = currentLang === "en" ? "zh" : "en";

            localStorage.setItem("site-lang", currentLang);

            applyLanguage(currentLang);

        });

    }

});
const page = window.location.pathname.split("/").pop().replace(".html","");

fetch("images.json")
.then(res=>res.json())
.then(images=>{

const gallery = document.getElementById("gallery");

images.forEach(img=>{

if(page==="portfolio" || page==="index" || img.category===page){

const item = document.createElement("div");

item.className="gallery-item";

item.innerHTML=`
<img src="${img.src}">
`;

gallery.appendChild(item);

}

});

});