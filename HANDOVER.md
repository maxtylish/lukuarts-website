# 攝影作品集網站 — 交接清單
> 最後更新：2026-05-23 ｜ 分支：main（已推送，working tree clean）

---

## ✅ 已完成項目

| # | 項目 | 說明 |
|---|------|------|
| 1 | 全站 Editorial 重設計 | 電影感 Hero、Works Grid、極簡風格統一 |
| 2 | Hero Slideshow 優化 | 分割版面 55/45、6 張精選圖、8s 輪播、H001 雲海加入 |
| 3 | 圖片全面 WebP 轉換 | 壓縮率 -92%，原始 JPG 已移除 |
| 4 | 頁面載入動畫 | 品牌 Logo 淡入 Reveal 效果 |
| 5 | contact.html | 完整詢價表單（姓名、Email、服務類型、日期、預算、備註） |
| 6 | pricing.html | 獨立報價頁（婚禮 / 人像 / 活動 / 食物 4 個 Tab，含 CTA） |
| 7 | 導覽列更新 | 全站 nav 加入 Pricing 連結 |
| 8 | 服務頁 CTA 連結 | portrait / wedding / event / food / creative / landscape 均指向 pricing.html |
| 9 | SEO 結構化資料 | index / portrait / wedding / event / food 加入 PriceSpecification Schema |
| 10 | 圖片管理工具 | `image-manager.html`（1032 行）— 本地拖拉上傳、分類管理、批次操作 |
| 11 | 圖片位置微調系統 | `image-positions.json` + `image-positions.css` — 每張圖獨立 object-position |

---

## 🚧 尚未完成 / 建議下一步

### SEO 缺口（優先處理）

| 頁面 | OG Tags | Schema | Canonical | 建議 |
|------|---------|--------|-----------|------|
| `about.html` | ❌ | ❌ | ❌ | 加 Person Schema + OG |
| `blog.html` | ❌ | ❌ | ❌ | 加 Blog Schema + OG |
| `portfolio.html` | ❌ | ❌ | ❌ | 加 ImageGallery Schema + OG |
| `creative.html` | ✅ | ❌ | ✅ | 補 CreativeWork Schema |
| `landscape.html` | ✅ | ❌ | ✅ | 補 ImageObject Schema |
| `pricing.html` | ✅ | ❌ | ✅ | 補 PriceSpecification Schema |

### 功能面

| 項目 | 說明 | 優先度 |
|------|------|--------|
| Blog 系統 | `blog.html` / `post.html` 目前為空殼，需填入內容或串接 CMS | 中 |
| contact.html 後端 | 表單目前無實際送出功能，需接 Formspree / EmailJS | 高 |
| Google Analytics | 全站尚未埋入追蹤代碼 | 中 |
| sitemap.xml | 尚未建立，對 SEO 有幫助 | 中 |
| robots.txt | 尚未建立 | 低 |
| 圖片 Alt 文字 | 部分圖片缺 alt 描述，影響無障礙與 SEO | 中 |

### 內容面

| 項目 | 說明 |
|------|------|
| about.html | 個人介紹文字、攝影理念、獎項/媒體露出 |
| blog.html | 至少 3 篇文章讓 Blog 頁有實質內容 |
| pricing.html | 確認報價數字是否為最新版本 |

---

## 📁 專案結構總覽

```
photography-website/
├── index.html          # 首頁（Hero + Works Grid + SEO）
├── about.html          # 關於頁（⚠️ 缺 SEO）
├── portfolio.html      # 作品集總覽（⚠️ 缺 SEO）
├── portrait.html       # 人像服務（含 Schema）
├── wedding.html        # 婚禮服務（含 Schema）
├── event.html          # 活動服務（含 Schema）
├── food.html           # 食物攝影（含 Schema）
├── creative.html       # 創意攝影（缺 Schema）
├── landscape.html      # 風景攝影（缺 Schema）
├── pricing.html        # 報價頁（缺 Schema）
├── contact.html        # 聯絡 / 詢價表單（缺後端）
├── blog.html           # 部落格列表（⚠️ 空殼）
├── post.html           # 文章頁（⚠️ 空殼）
├── image-manager.html  # 🔧 圖片管理工具（本地用，勿上線）
├── generate-json.html  # 🔧 JSON 產生器（本地用）
├── style.css           # 全站樣式（2295 行）
├── script.js           # 全站腳本（391 行）
├── images.json         # 作品圖片清單（90 張）
├── image-positions.json # 圖片 object-position 設定
├── image-positions.css  # 圖片位置 CSS override
└── images/             # 所有圖片（全 WebP 格式）
    ├── portrait/
    ├── wedding/
    ├── event/
    ├── food/
    ├── creative/
    ├── landscape/
    ├── architecture/
    ├── kids/
    ├── street/
    ├── culture/
    └── homepage/
```

---

## 🔑 關鍵技術備忘

- **字型**：Cormorant Garamond (serif) + Noto Sans TC (中文)，透過 Google Fonts 非阻塞載入
- **圖片格式**：全站 `.webp`，Lazy Load 透過 `IntersectionObserver`
- **Hero Slideshow**：純 CSS + JS，interval 8000ms，6 張圖
- **色彩系統**：`--color-charcoal: #1a1a1a`、`--color-warm-white: #f8f6f3`、`--color-accent: #c8a96e`
- **image-manager.html**：純前端工具，不需部署，只在本地瀏覽器開啟使用

---

*此文件由 Claude Cowork 自動產生，如有異動請手動更新。*
