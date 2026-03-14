document.addEventListener("DOMContentLoaded", () => {

const navbar = document.querySelector(".navbar");

if(navbar){

window.addEventListener("scroll", () => {

if (window.scrollY > 50){
navbar.classList.add("scrolled");
}else{
navbar.classList.remove("scrolled");
}

});

}


/* ===== Load gallery ===== */
const categories = [
"portrait",
"wedding",
"food",
"event",
"landscape",
"creative"
];

const page = window.location.pathname
.split("/")
.pop()
.replace(".html","");

const gallery = document.getElementById("gallery");

if(gallery){

categories.forEach(cat=>{

if(page==="portfolio" || page===cat){

for(let i=1;i<=50;i++){

const num = String(i).padStart(3,"0");

const imgPath = `images/${cat}/${cat[0]}${num}.jpg`;

const img = new Image();

img.src = imgPath;

img.onload = ()=>{

const item = document.createElement("div");

item.className="gallery-item";

item.dataset.category = cat;

item.innerHTML=`
<img src="${imgPath}" class="lightbox-trigger">
`;

gallery.appendChild(item);

};

}

}

});

}
/* 自動排序 */

images.sort((a,b)=>{

return a.src.localeCompare(
b.src,
undefined,
{numeric:true}
);

});


images.forEach(img => {

const item = document.createElement("div");

item.className = "gallery-item";

item.dataset.category = img.category;

item.innerHTML = `
<img src="${img.src}" 
class="lightbox-trigger lazy-img" 
loading="lazy">
`;

gallery.appendChild(item);

});


initFilter();
initLightbox();
initLazyFade();
applyURLCategory();

});


/* ===== Filter ===== */

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
}else{
item.style.display = "none";
}

});

});

});

}


/* ===== Lightbox ===== */

function initLightbox(){

const lightbox = document.getElementById("lightbox");

if(!lightbox) return;

const lightboxImg = document.getElementById("lightbox-img");

const closeBtn = document.querySelector(".lightbox-close");

const images = document.querySelectorAll(".lightbox-trigger");

let currentIndex = 0;


images.forEach((img,index)=>{

img.addEventListener("click",()=>{

lightbox.style.display="flex";

lightboxImg.src = img.src;

currentIndex = index;

document.body.style.overflow="hidden";

});

});


function closeLightbox(){

lightbox.style.display="none";

document.body.style.overflow="auto";

}

if(closeBtn){
closeBtn.addEventListener("click",closeLightbox);
}

lightbox.addEventListener("click",e=>{
if(e.target===lightbox) closeLightbox();
});


document.addEventListener("keydown",(e)=>{

if(lightbox.style.display!=="flex") return;

if(e.key==="Escape") closeLightbox();

if(e.key==="ArrowRight") showNext();

if(e.key==="ArrowLeft") showPrev();

});


function showNext(){

currentIndex++;

if(currentIndex>=images.length) currentIndex=0;

lightboxImg.src = images[currentIndex].src;

}

function showPrev(){

currentIndex--;

if(currentIndex<0) currentIndex=images.length-1;

lightboxImg.src = images[currentIndex].src;

}


/* 手機滑動 */

let startX = 0;

lightbox.addEventListener("touchstart",e=>{
startX = e.touches[0].clientX;
});

lightbox.addEventListener("touchend",e=>{

let endX = e.changedTouches[0].clientX;

if(endX-startX>50) showPrev();

if(startX-endX>50) showNext();

});

}


/* ===== Lazy image ===== */

function initLazyFade(){

const lazyImages = document.querySelectorAll(".lazy-img");

lazyImages.forEach(img=>{

img.addEventListener("load",()=>{
img.classList.add("loaded");
});

});

}


/* ===== URL category ===== */

function applyURLCategory(){

const params = new URLSearchParams(window.location.search);

const category = params.get("cat");

if(!category) return;

document.querySelectorAll(".filter-btn").forEach(btn=>{

if(btn.dataset.filter===category){
btn.click();
}

});

}


/* ===== Language switch ===== */

const langBtn = document.getElementById("lang-toggle");

let currentLang = localStorage.getItem("site-lang") || "en";

function applyLanguage(lang){

document.querySelectorAll("[data-en]").forEach(el=>{
el.textContent = el.dataset[lang];
});

}

applyLanguage(currentLang);

if(langBtn){

langBtn.addEventListener("click",()=>{

currentLang = currentLang==="en" ? "zh":"en";

localStorage.setItem("site-lang",currentLang);

applyLanguage(currentLang);

});

}

