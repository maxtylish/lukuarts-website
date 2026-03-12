document.addEventListener("DOMContentLoaded", () => {

    // Navbar scroll
    const navbar = document.querySelector(".navbar");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });


    // Load gallery images
    fetch("images.json")
    .then(response => response.json())
    .then(images => {

        const gallery = document.getElementById("gallery");

if (gallery) {

images.forEach(img => {

const item = document.createElement("div");
item.className = "gallery-item";
item.dataset.category = img.category;

item.innerHTML = `
<img src="${img.src}" class="lightbox-trigger" loading="lazy">
`;

gallery.appendChild(item);

});

}

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


    // Filter system
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


    // Lightbox
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

        closeBtn.addEventListener("click", closeLightbox);

        lightbox.addEventListener("click", e => {
            if(e.target === lightbox) closeLightbox();
        });

    }
    const langBtn = document.getElementById("lang-toggle");

let currentLang = "en";

langBtn.addEventListener("click", () => {

currentLang = currentLang === "en" ? "zh" : "en";

document.querySelectorAll("[data-en]").forEach(el => {

el.textContent = el.dataset[currentLang];

});

});