document.addEventListener("DOMContentLoaded", () => {
    // 1. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });

    // 2. Portfolio Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filterValue = btn.getAttribute('data-filter');

                galleryItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                        setTimeout(() => item.style.opacity = '1', 50);
                    } else {
                        item.style.opacity = '0';
                        setTimeout(() => item.style.display = 'none', 400);
                    }
                });
            });
        });
    }

    // 3. Lightbox Viewer
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');
    const triggers = document.querySelectorAll('.lightbox-trigger');

    if (lightbox) {
        triggers.forEach(img => {
            img.addEventListener('click', () => {
                lightbox.style.display = 'flex';
                lightboxImg.src = img.src;
                document.body.style.overflow = 'hidden';
            });
        });

        const closeLightbox = () => {
            lightbox.style.display = 'none';
            lightboxImg.src = '';
            document.body.style.overflow = 'auto';
        };

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }
});
const images = [

{src:"images/portrait/00001.jpg", category:"portrait"},
{src:"images/portrait/00002.jpg", category:"portrait"},

{src:"images/food/f01.jpg", category:"food"},

{src:"images/event/e01.jpg", category:"event"},

{src:"images/still/still001.jpg", category:"still"},
{src:"images/still/still002.jpg", category:"still"}

];

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
{src:"images/portrait/portrait001.jpg", category:"portrait"},
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

});