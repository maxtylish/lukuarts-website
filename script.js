document.addEventListener("DOMContentLoaded", () => {

```
// 1️⃣ Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
});

// 2️⃣ Load Gallery Images from JSON
fetch("images.json")
.then(response => response.json())
.then(images => {

    const gallery = document.getElementById("gallery");

    images.forEach(img => {

        const item = document.createElement("div");
        item.className = "gallery-item";
        item.dataset.category = img.category;

        item.innerHTML = `
            <img src="${img.src}" class="lightbox-trigger" loading="lazy">
        `;

        gallery.appendChild(item);

    });

    initFiltering();
    initLightbox();

});


// 3️⃣ Portfolio Filtering
function initFiltering(){

    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {

        btn.addEventListener('click', () => {

            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.dataset.filter;

            galleryItems.forEach(item => {

                if(filterValue === "all" || item.dataset.category === filterValue){
                    item.style.display = "block";
                } else {
                    item.style.display = "none";
                }

            });

        });

    });

}


// 4️⃣ Lightbox Viewer
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

    lightbox.addEventListener("click", (e) => {
        if(e.target === lightbox) closeLightbox();
    });

}
```

});
