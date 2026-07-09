/* =========================================================
   LUKUARTS VISUAL | 青玥影像
   Unified front-end script
   ========================================================= */

(() => {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const prefersReducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Navbar: scroll shadow + mobile hamburger ---------- */
  function initNavbar() {
    const navbar = $('.navbar');
    const toggle = $('#menu-toggle');
    const navLinks = $('#nav-links');

    if (navbar) {
      const onScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    if (toggle && navLinks) {
      const closeMenu = () => {
        navLinks.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      };
      const openMenu = () => {
        navLinks.classList.add('open');
        toggle.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
      };
      toggle.addEventListener('click', () => {
        navLinks.classList.contains('open') ? closeMenu() : openMenu();
      });
      // close when a link is clicked
      $$('.nav-links a').forEach(a =>
        a.addEventListener('click', closeMenu)
      );
      // close on escape
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeMenu();
      });
    }
  }

  /* ---------- 2. Scroll reveal via IntersectionObserver ---------- */
  function initReveal() {
    const items = $$('.reveal');
    if (!items.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      items.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    items.forEach(el => io.observe(el));
  }

  /* ---------- 3. Sakura rain (hero only) ---------- */
  function initSakura() {
    const box = $('#sakura-rain');
    if (!box || prefersReducedMotion) return;

    const MAX = 28;                      // cap petals on screen
    const makePetal = () => {
      if (box.childElementCount >= MAX) return;
      const petal = document.createElement('div');
      petal.className = 'sakura-petal';
      const size = Math.random() * 8 + 6;
      petal.style.width = `${size}px`;
      petal.style.height = `${size}px`;
      petal.style.left = `${Math.random() * 100}%`;
      const duration = Math.random() * 5 + 7;
      petal.style.animationDuration = `${duration}s`;
      petal.style.opacity = (Math.random() * 0.4 + 0.35).toFixed(2);
      box.appendChild(petal);
      setTimeout(() => petal.remove(), duration * 1000);
    };

    const interval = setInterval(makePetal, 350);

    // Pause when tab is hidden to save CPU
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) clearInterval(interval);
    });
  }

  /* ---------- 4. Hero parallax (legacy hero) ---------- */
  function initParallax() {
    const bg = $('.hero-bg');
    if (!bg || prefersReducedMotion) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const offset = Math.min(window.scrollY * 0.25, 200);
        bg.style.transform = `scale(1.08) translateY(${offset}px)`;
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- 4b. Editorial hero slideshow ---------- */
  function initEdHero() {
    const slides  = $$('.ed-slide');
    const curEl   = $('.ed-counter-cur');
    const totEl   = $('.ed-counter-tot');
    if (!slides.length) return;

    let idx   = 0;
    let timer = null;
    const pad = n => String(n).padStart(2, '0');

    if (totEl) totEl.textContent = pad(slides.length);

    function goTo(next) {
      slides[idx].classList.remove('active');
      idx = (next + slides.length) % slides.length;
      slides[idx].classList.add('active');
      if (curEl) curEl.textContent = pad(idx + 1);
    }

    function start() { timer = setInterval(() => goTo(idx + 1), 8000); }
    function stop()  { clearInterval(timer); }

    start();

    // Pause when tab hidden
    document.addEventListener('visibilitychange', () => {
      document.hidden ? stop() : start();
    });

    // Touch swipe
    const hero = $('.ed-hero');
    if (hero) {
      let sx = 0;
      hero.addEventListener('touchstart', e => { sx = e.changedTouches[0].clientX; }, { passive: true });
      hero.addEventListener('touchend',   e => {
        const dx = e.changedTouches[0].clientX - sx;
        if (Math.abs(dx) > 50) { stop(); goTo(idx + (dx < 0 ? 1 : -1)); start(); }
      }, { passive: true });
    }
  }

  /* ---------- 5. Portfolio gallery (images.json) ---------- */
  function initGallery() {
    const gallery = $('#gallery');
    if (!gallery) return;

    let allImages = [];

    const categoryLabel = {
      portrait:  '人像攝影',
      wedding:   '婚禮紀錄',
      street:    '街頭紀實',
      food:      '商業美食',
      event:     '活動紀錄',
      landscape: '風景攝影',
      culture:   '人文神像',
      creative:  '影像創作',
      kids:      '親子寫真',
      video:     '短影音剪輯'
    };

    const render = (data) => {
      gallery.innerHTML = '';
      if (!data.length) {
        gallery.innerHTML = `<div class="loading-msg">此分類暫無作品</div>`;
        return;
      }
      const frag = document.createDocumentFragment();
      data.forEach((img, i) => {
        const item = document.createElement('div');
        item.className = 'masonry-item';
        item.dataset.category = img.category;
        item.style.animationDelay = `${Math.min(i * 40, 600)}ms`;
        const label = categoryLabel[img.category] || img.category;
        // Allow optional per-image alt text from images.json; fall back to SEO-friendly default
        const altText = img.alt || `${label}作品 — 台中攝影師 劉志恆 LUKUARTS`;

        if (img.type === 'video') {
          // Video case study: poster thumbnail + play icon, opens in lightbox <video>
          item.classList.add('masonry-item--video');
          item.innerHTML = `
            <div class="video-trigger" data-video-src="${img.src}" data-poster="${img.poster || ''}" tabindex="0" role="button" aria-label="播放影片：${altText}">
              <img src="${img.poster || ''}" alt="${altText}" loading="lazy">
              <span class="video-play-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              </span>
            </div>
          `;
        } else {
          item.innerHTML = `
            <img src="${img.src}" alt="${altText}" class="lightbox-trigger" loading="lazy">
          `;
        }
        frag.appendChild(item);
      });
      gallery.appendChild(frag);
      bindLightboxTriggers();
    };

    const applyFilter = (filter) => {
      if (!filter || filter === 'all') {
        render(allImages);
      } else {
        render(allImages.filter(i => i.category === filter));
      }
    };

    fetch('images.json')
      .then(res => res.json())
      .then(images => {
        allImages = images;

        // Allow deep-linking from index portfolio preview,
        // or auto-filter via data-category on the gallery element (category landing pages)
        const params = new URLSearchParams(window.location.search);
        const initCat = params.get('category') || gallery.dataset.category || null;

        if (initCat) {
          // highlight the matching filter button
          const btn = $(`.filter-btn[data-filter="${initCat}"]`);
          if (btn) {
            $$('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
          }
          applyFilter(initCat);
        } else {
          render(allImages);
        }

        // Filter buttons
        $$('.filter-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            $$('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyFilter(btn.dataset.filter);
          });
        });
      })
      .catch(err => {
        console.error('images.json 讀取失敗', err);
        gallery.innerHTML = `<div class="loading-msg">作品載入失敗，請稍後再試</div>`;
      });
  }

  /* ---------- 6. Lightbox (keyboard + click; images + video case studies) ---------- */
  let lightboxBound = false;
  function initLightbox() {
    if (lightboxBound) return;
    const lightbox = $('#lightbox');
    if (!lightbox) return;

    const img = $('#lightbox-img');
    const video = $('#lightbox-video');
    const closeBtn = $('#lightbox-close');

    const open = (src, alt = '') => {
      if (video) { video.pause(); video.removeAttribute('src'); video.load(); video.style.display = 'none'; }
      img.style.display = '';
      img.src = src;
      img.alt = alt;
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    };
    const openVideo = (src, poster = '', alt = '') => {
      if (!video) return;
      img.style.display = 'none';
      img.src = '';
      video.style.display = 'block';
      if (poster) video.poster = poster;
      video.src = src;
      video.setAttribute('aria-label', alt);
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      video.play().catch(() => {});
    };
    const close = () => {
      lightbox.classList.remove('is-open');
      img.src = '';
      if (video) { video.pause(); video.removeAttribute('src'); video.load(); }
      document.body.style.overflow = '';
    };

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) close();
    });
    if (closeBtn) closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('is-open')) close();
    });

    // Expose opener to gallery
    window.__LUKU_lightbox = { open, openVideo, close };
    lightboxBound = true;
  }

  function bindLightboxTriggers() {
    initLightbox();
    $$('.lightbox-trigger').forEach(img => {
      img.onclick = () => window.__LUKU_lightbox?.open(img.src, img.alt);
    });
    $$('.video-trigger').forEach(trigger => {
      const openVideo = () => window.__LUKU_lightbox?.openVideo(
        trigger.dataset.videoSrc,
        trigger.dataset.poster,
        trigger.getAttribute('aria-label')
      );
      trigger.onclick = openVideo;
      trigger.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openVideo(); }
      };
    });
  }

  /* ---------- 7. Blog grid loader (blog.html) ---------- */
  function initBlogGrid() {
    const grid = $('#blog-grid');
    if (!grid) return;
    // Skip if this page uses Firebase to load blog posts
    if (window.__BLOG_USE_FIREBASE) return;

    fetch('blogs.json')
      .then(res => res.json())
      .then(posts => {
        if (!Array.isArray(posts) || !posts.length) {
          grid.innerHTML = `<div class="loading-msg">目前還沒有文章，敬請期待</div>`;
          return;
        }
        const frag = document.createDocumentFragment();
        posts.forEach(post => {
          const title = post.title_zh || post.title_en || '';
          const excerpt = post.excerpt_zh || post.excerpt_en || '';
          const a = document.createElement('a');
          a.className = 'blog-card reveal is-visible';
          a.href = `post.html?id=${encodeURIComponent(post.id)}`;
          a.innerHTML = `
            <div class="blog-card-img">
              <img src="${post.image}" alt="${title}" loading="lazy">
            </div>
            <div class="blog-card-body">
              <div class="blog-card-meta">
                <span>${post.date || ''}</span>
                ${post.category ? `&nbsp;·&nbsp;<span>${post.category}</span>` : ''}
              </div>
              <h3 class="blog-card-title">${title}</h3>
              <p class="blog-card-excerpt">${excerpt}</p>
            </div>
          `;
          frag.appendChild(a);
        });
        grid.innerHTML = '';
        grid.appendChild(frag);
      })
      .catch(() => {
        grid.innerHTML = `<div class="loading-msg">文章載入失敗，請稍後再試</div>`;
      });
  }

  /* ---------- 8. Smooth anchor scroll with navbar offset ---------- */
  function initAnchorOffset() {
    $$('a[href^="#"]').forEach(a => {
      const hash = a.getAttribute('href');
      if (!hash || hash === '#' || hash.length < 2) return;
      a.addEventListener('click', (e) => {
        const target = document.querySelector(hash);
        if (!target) return;
        e.preventDefault();
        const navbarH =
          parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-h')) || 72;
        const y = target.getBoundingClientRect().top + window.scrollY - navbarH + 1;
        window.scrollTo({ top: y, behavior: 'smooth' });
      });
    });
  }

  /* ---------- 9. Lazy-load fade-in ---------- */
  function initLazyFade() {
    const imgs = $$('img[loading="lazy"]');
    imgs.forEach(img => {
      if (img.complete) { img.classList.add('loaded'); return; }
      img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
    });
    // Watch for dynamically added lazy images (gallery renders)
    if ('MutationObserver' in window) {
      new MutationObserver(mutations => {
        mutations.forEach(m => m.addedNodes.forEach(node => {
          if (node.nodeType !== 1) return;
          const imgs = node.matches?.('img[loading="lazy"]')
            ? [node]
            : Array.from(node.querySelectorAll?.('img[loading="lazy"]') ?? []);
          imgs.forEach(img => {
            if (img.complete) img.classList.add('loaded');
            else img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
          });
        }));
      }).observe(document.body, { childList: true, subtree: true });
    }
  }

  /* ---------- Boot ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initReveal();
    initSakura();
    initParallax();
    initEdHero();
    initGallery();
    initBlogGrid();
    initAnchorOffset();
    initLazyFade();
    // Lightbox bound lazily when triggers exist (e.g., gallery render)

    // Remove loader from DOM after animation completes
    const loader = document.getElementById('page-loader');
    if (loader) setTimeout(() => loader.remove(), 2500);
  });
})();
