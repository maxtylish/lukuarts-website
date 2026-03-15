document.addEventListener("DOMContentLoaded", () => {

  /* ===== Navbar Scroll ===== */
  const navbar = document.querySelector(".navbar");

  if(navbar){
    window.addEventListener("scroll", () => {
      if(window.scrollY > 50){
        navbar.classList.add("scrolled");
      }else{
        navbar.classList.remove("scrolled");
      }
    });
  }

  /* ===== Load Gallery from JSON ===== */
  fetch("images.json")
    .then(res => res.json())
    .then(images => {
      const gallery = document.getElementById("gallery");
      if(!gallery) return;

      images.forEach(img => {
        const item = document.createElement("div");
        
        // 【修改點 1】統一使用 masonry-item 來對應新的 CSS
        item.className = "masonry-item"; 
        item.dataset.category = img.category;

        // 【修改點 2】設定預設文字 (如果 JSON 裡沒有 title，就顯示品牌名)
        const titleText = img.title ? img.title : "LUKUARTS VISUAL";
        // 將 category 的第一個字母大寫作為副標題
        const categoryText = img.category ? img.category.charAt(0).toUpperCase() + img.category.slice(1) : "Photography";

        // 【修改點 3】注入帶有遮罩層的 HTML 結構，並加入 pointer-events: none 確保 Lightbox 點擊不失效
        item.innerHTML = `
          <img src="${img.src}" class="lightbox-trigger lazy-img" loading="lazy" alt="${titleText}">
          
          <div class="item-overlay" style="pointer-events: none;">
            <div class="overlay-text">
              <h3>${titleText}</h3>
              <p>${categoryText}</p>
            </div>
          </div>
        `;

        gallery.appendChild(item);
      });

      initFilter();
      initLightbox();
      initLazyFade();
      applyURLCategory();
    });


  /* ===== Filter System ===== */
  function initFilter(){
    const filterBtns = document.querySelectorAll(".filter-btn");

    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.dataset.filter;

        // 【修改點 4】配合上方的 class 更改，這裡也要改成選取 masonry-item
        document.querySelectorAll(".masonry-item").forEach(item => {
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

    let images = [];
    let currentIndex = 0;

    function refreshImages(){
      images = document.querySelectorAll(".lightbox-trigger");

      images.forEach((img,index)=>{
        img.onclick = () => {
          lightbox.style.display = "flex";
          lightboxImg.src = img.src;
          currentIndex = index;
          document.body.style.overflow = "hidden";
        };
      });
    }

    setTimeout(refreshImages,300);

    function closeLightbox(){
      lightbox.style.display="none";
      document.body.style.overflow="auto";
    }

    if(closeBtn) closeBtn.onclick = closeLightbox;

    lightbox.onclick = (e)=>{
      if(e.target===lightbox) closeLightbox();
    };

    document.addEventListener("keydown",(e)=>{
      if(lightbox.style.display!=="flex") return;
      if(e.key==="Escape") closeLightbox();
      if(e.key==="ArrowRight") showNext();
      if(e.key==="ArrowLeft") showPrev();
    });

    function showNext(){
      currentIndex++;
      if(currentIndex >= images.length) currentIndex = 0;
      lightboxImg.src = images[currentIndex].src;
    }

    function showPrev(){
      currentIndex--;
      if(currentIndex < 0) currentIndex = images.length - 1;
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


  /* ===== Lazy Image Fade ===== */
  function initLazyFade(){
    document.querySelectorAll(".lazy-img").forEach(img=>{
      img.addEventListener("load",()=>{
        img.classList.add("loaded");
      });
    });
  }


  /* ===== URL Category Filter ===== */
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


  /* ===== Language Switch ===== */
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

});