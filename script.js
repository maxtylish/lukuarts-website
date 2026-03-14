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


    /* ===== Load gallery images ===== */

 fetch("images.json")
.then(res=>res.json())
.then(images=>{

images.sort((a,b)=>{

return a.src.localeCompare(
b.src,
undefined,
{numeric:true,sensitivity:'base'}
);

});

const gallery = document.getElementById("gallery");

images.forEach(img=>{

const item = document.createElement("div");

item.className="gallery-item";

item.innerHTML=`
<img src="${img.src}" class="lightbox-trigger">
`;

gallery.appendChild(item);


        });

        initFilter();
        initLightbox();
        initLazyFade();
        applyURLCategory();

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

        if(!lightbox) return;

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


    /* ===== Lazy image fade ===== */

    function initLazyFade(){

        const lazyImages = document.querySelectorAll(".lazy-img");

        lazyImages.forEach(img => {

            img.addEventListener("load", () => {

                img.classList.add("loaded");

            });

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


    /* ===== URL category filter ===== */

    function applyURLCategory(){

        const params = new URLSearchParams(window.location.search);

        const category = params.get("cat");

        if(category){

            document.querySelectorAll(".filter-btn").forEach(btn => {

                if(btn.dataset.filter === category){

                    btn.click();

                }

            });

        }

    }

});
let startX = 0;

const lightbox = document.getElementById("lightbox");

lightbox.addEventListener("touchstart",(e)=>{

startX = e.touches[0].clientX;

});

lightbox.addEventListener("touchend",(e)=>{

let endX = e.changedTouches[0].clientX;

if(endX - startX > 50){

document.querySelector(".lightbox-prev").click();

}

if(startX - endX > 50){

document.querySelector(".lightbox-next").click();

}

});