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
        
        item.className = "masonry-item"; 
        item.dataset.category = img.category;

        const titleText = img.title ? img.title : "LUKUARTS VISUAL";
        const categoryText = img.category ? img.category.charAt(0).toUpperCase() + img.category.slice(1) : "Photography";

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

      // 當圖片都載入 HTML 後，初始化所有功能
      initFilter();
      initLightbox();
      initLazyFade();
      applyURLCategory();
    })
    .catch(error => console.log("載入作品失敗:", error));


  /* ===== Filter System ===== */
  function initFilter(){
    const filterBtns = document.querySelectorAll(".filter-btn");

    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        // 切換按鈕的 Active 狀態
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.dataset.filter;

        // 隱藏或顯示對應的作品
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


  /* ===== Lightbox (升級版：支援左右按鈕與分類過濾) ===== */
  function initLightbox(){
    const lightbox = document.getElementById("lightbox");
    if(!lightbox) return;

    const lightboxImg = document.getElementById("lightbox-img");
    const closeBtn = document.querySelector(".lightbox-close");
    const prevBtn = document.querySelector(".lightbox-prev");
    const nextBtn = document.querySelector(".lightbox-next");

    let currentImages = [];
    let currentIndex = 0;

    // 重新抓取目前「顯示中」的圖片
    function refreshImages(){
      // 只抓取沒有被 Filter 隱藏的作品
      const visibleItems = Array.from(document.querySelectorAll(".masonry-item"))
                                .filter(item => item.style.display !== "none");
                                
      currentImages = visibleItems.map(item => item.querySelector(".lightbox-trigger"))
                                  .filter(img => img !== null);

      currentImages.forEach((img, index)=>{
        img.onclick = (e) => {
          e.preventDefault();
          lightbox.style.display = "flex";
          lightboxImg.src = img.src;
          currentIndex = index;
          document.body.style.overflow = "hidden"; // 鎖定背景滾動
        };
      });
    }

    // 初次載入時綁定點擊事件
    setTimeout(refreshImages, 300);

    // 當使用者點擊分類 (Filter) 時，重新整理 Lightbox 的陣列
    document.querySelectorAll(".filter-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        setTimeout(refreshImages, 300); // 等待過濾動畫完成後重新抓取
      });
    });

    // 關閉 Lightbox
    function closeLightbox(){
      lightbox.style.display="none";
      document.body.style.overflow="auto"; // 恢復背景滾動
    }

    if(closeBtn) closeBtn.onclick = closeLightbox;
    lightbox.onclick = (e)=>{
      if(e.target === lightbox) closeLightbox();
    };

    // 切換下一張 / 上一張
    function showNext(){
      if(currentImages.length === 0) return;
      currentIndex++;
      if(currentIndex >= currentImages.length) currentIndex = 0; // 回到第一張
      lightboxImg.src = currentImages[currentIndex].src;
    }

    function showPrev(){
      if(currentImages.length === 0) return;
      currentIndex--;
      if(currentIndex < 0) currentIndex = currentImages.length - 1; // 回到最後一張
      lightboxImg.src = currentImages[currentIndex].src;
    }

    // 綁定畫面的左右箭頭按鈕
    if(prevBtn) prevBtn.onclick = showPrev;
    if(nextBtn) nextBtn.onclick = showNext;

    // 綁定鍵盤控制
    document.addEventListener("keydown",(e)=>{
      if(lightbox.style.display!=="flex") return;
      if(e.key==="Escape") closeLightbox();
      if(e.key==="ArrowRight") showNext();
      if(e.key==="ArrowLeft") showPrev();
    });

    // 綁定手機滑動控制
    let startX = 0;
    lightbox.addEventListener("touchstart", e => {
      startX = e.touches[0].clientX;
    });
    lightbox.addEventListener("touchend", e => {
      let endX = e.changedTouches[0].clientX;
      if(endX - startX > 50) showPrev(); // 向右滑
      if(startX - endX > 50) showNext(); // 向左滑
    });
  }


  /* ===== Lazy Image Fade ===== */
  function initLazyFade(){
    document.querySelectorAll(".lazy-img").forEach(img=>{
      // 如果圖片已經載入完成 (快取)，直接顯示
      if(img.complete) {
        img.classList.add("loaded");
      } else {
        img.addEventListener("load", ()=>{
          img.classList.add("loaded");
        });
      }
    });
  }


  /* ===== URL Category Filter ===== */
  function applyURLCategory(){
    const params = new URLSearchParams(window.location.search);
    const category = params.get("cat");

    if(!category) return;

    // 如果網址有帶參數 (例如 ?cat=wedding)，自動點擊對應的分類按鈕
    document.querySelectorAll(".filter-btn").forEach(btn=>{
      if(btn.dataset.filter === category){
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

  // 載入時套用記憶的語系
  applyLanguage(currentLang);

  if(langBtn){
    langBtn.addEventListener("click", ()=>{
      currentLang = currentLang === "en" ? "zh" : "en";
      localStorage.setItem("site-lang", currentLang);
      applyLanguage(currentLang);
    });
  }

});