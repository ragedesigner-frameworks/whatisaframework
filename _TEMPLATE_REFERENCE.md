# WHATISAFRAMEWORK.COM - TEMPLATE REFERENCE
## Source of Truth for All Page Components
**Last Updated:** January 10, 2026
**Source File:** index.html (SHA: 5410a011dfefb663d5e13a0721600406ef82e81a)

---

## ⚠️ CRITICAL: READ BEFORE EDITING ANY PAGE

When editing ANY page on whatisaframework.com:
1. **DO NOT reconstruct header/footer from memory**
2. **COPY the exact HTML from this reference**
3. **Only modify page-specific content (title, meta, body)**

This prevents the "fix one thing, break another" pattern.

---

## 🎨 CSS VARIABLES (Required in every page)

```css
:root {
    --charcoal-blue: #1A2332;
    --primary: #E67E50;
    --white: #ffffff;
    --light-gray: #f5f5f5;
    --text-medium: #666666;
    --text-xs: 0.75rem;
    --text-sm: 0.875rem;
    --text-base: 1rem;
    --text-lg: 1.25rem;
    --text-xl: 1.5625rem;
    --text-2xl: 1.953rem;
    --text-3xl: 2.441rem;
    --text-4xl: 3.052rem;
    --space-1: 0.5rem;
    --space-2: 1rem;
    --space-3: 1.5rem;
    --space-4: 2rem;
    --space-6: 3rem;
    --space-8: 4rem;
}
```

---

## 📋 REQUIRED META TAGS

Every page MUST include these in `<head>`:

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>[PAGE TITLE] | WhatIsAFramework</title>
<meta name="description" content="[PAGE DESCRIPTION]">
<meta property="og:title" content="[PAGE TITLE]">
<meta property="og:description" content="[PAGE DESCRIPTION]">
<meta property="og:image" content="https://app.ragedesigner.com/wp-content/uploads/2025/11/Rage-designer-landing-page-cover.png">
<meta property="og:url" content="https://whatisaframework.com/[PAGE-SLUG]">
<meta property="og:type" content="article">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://app.ragedesigner.com/wp-content/uploads/2025/11/Rage-designer-landing-page-cover.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&display=swap" rel="stylesheet">
```

**Default OG Image:** `https://app.ragedesigner.com/wp-content/uploads/2025/11/Rage-designer-landing-page-cover.png`

---

## 🔝 CANONICAL HEADER (Desktop + Mobile)

### Header HTML Structure
```html
<nav id="main-header">
    <a href="/"><img src="https://app.ragedesigner.com/wp-content/uploads/2025/11/whatisaframework.png" alt="What Is A Framework" class="logo"></a>
    <div class="nav-links desktop-nav">
        <a href="#definition">Definition</a>
        <a href="#topics">Topics</a>
        <a href="/interactive-lab.html">Interactive Lab</a>
        <a href="https://howtoframework.com" class="nav-cta">Learn to Build Frameworks</a>
    </div>
    <button class="mobile-menu-toggle" aria-label="Toggle menu">
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
    </button>
</nav>

<div class="mobile-nav-drawer">
    <button class="mobile-nav-close" aria-label="Close menu">×</button>
    <nav class="mobile-nav">
        <a href="#definition" class="mobile-nav-link">Definition</a>
        <a href="#topics" class="mobile-nav-link">Topics</a>
        <a href="/interactive-lab.html" class="mobile-nav-link">Interactive Lab</a>
        <a href="https://howtoframework.com" class="mobile-nav-cta">Learn to Build Frameworks</a>
    </nav>
</div>
<div class="mobile-nav-overlay"></div>
```

### Header CSS (Required)
```css
nav#main-header { background: var(--white); padding: var(--space-2) var(--space-4); display: flex; justify-content: space-between; align-items: center; position: fixed; top: 0; left: 0; right: 0; z-index: 1000; box-shadow: 0 2px 10px rgba(0,0,0,0.1); transition: all 0.3s ease; }
nav#main-header.scrolled { padding: 12px var(--space-4); box-shadow: 0 2px 20px rgba(26, 35, 50, 0.08); }
.logo { height: 50px; transition: height 0.3s ease; }
nav#main-header.scrolled .logo { height: 44px; }
.nav-links { display: flex; gap: var(--space-3); align-items: center; }
.nav-links a { text-decoration: none; color: var(--charcoal-blue); font-weight: 500; transition: color 0.3s; }
.nav-links a:hover { color: var(--primary); }
.nav-cta { background: var(--primary); color: var(--white) !important; padding: var(--space-1) var(--space-3); border-radius: 6px; border: 2px solid var(--primary); transition: all 0.3s ease; }
.nav-cta:hover { background: transparent; color: var(--primary) !important; }
.mobile-menu-toggle { display: none; flex-direction: column; gap: 6px; background: none; border: none; padding: 8px; cursor: pointer; }
.hamburger-line { width: 28px; height: 3px; background: var(--charcoal-blue); border-radius: 2px; transition: all 0.3s ease; }
.mobile-menu-toggle:hover .hamburger-line { background: var(--primary); }
.mobile-menu-toggle.active .hamburger-line:nth-child(1) { transform: rotate(45deg) translateY(9px); }
.mobile-menu-toggle.active .hamburger-line:nth-child(2) { opacity: 0; }
.mobile-menu-toggle.active .hamburger-line:nth-child(3) { transform: rotate(-45deg) translateY(-9px); }
.mobile-nav-drawer { position: fixed; top: 0; right: -100%; width: 300px; height: 100vh; background: var(--charcoal-blue); padding: 48px 40px; transition: right 0.4s ease; z-index: 1002; }
.mobile-nav-drawer.active { right: 0; }
.mobile-nav-close { position: absolute; top: 16px; right: 16px; background: var(--primary); color: white; border: none; width: 40px; height: 40px; border-radius: 50%; font-size: 28px; cursor: pointer; transition: transform 0.3s ease; }
.mobile-nav-close:hover { transform: rotate(90deg); }
.mobile-nav { display: flex; flex-direction: column; gap: 16px; margin-top: 48px; }
.mobile-nav-link { color: white; text-decoration: none; font-size: 18px; font-weight: 500; padding: 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); transition: all 0.3s ease; position: relative; }
.mobile-nav-link::before { content: ''; position: absolute; left: 0; top: 0; height: 100%; width: 4px; background: var(--primary); transform: translateX(-4px); transition: transform 0.3s ease; }
.mobile-nav-link:hover { padding-left: 24px; color: var(--primary); }
.mobile-nav-link:hover::before { transform: translateX(0); }
.mobile-nav-cta { margin-top: 24px; background: var(--primary); color: white !important; padding: 16px 24px; border-radius: 8px; text-align: center; font-weight: 600; text-decoration: none; transition: all 0.3s ease; border: 2px solid var(--primary); }
.mobile-nav-cta:hover { background: transparent; transform: translateY(-2px); }
.mobile-nav-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(26, 35, 50, 0.8); opacity: 0; visibility: hidden; transition: all 0.3s ease; z-index: 1001; }
.mobile-nav-overlay.active { opacity: 1; visibility: visible; }

@media (max-width: 768px) {
    .nav-links.desktop-nav { display: none; }
    .mobile-menu-toggle { display: flex; }
}
```

---

## 🔻 CANONICAL FOOTER

### Footer HTML Structure
```html
<footer>
    <div class="ai-badge">🤖 This site is built and managed autonomously by AI</div>
    <div class="footer-links">
        <a href="https://howtoframework.com">How to Framework</a>
        <a href="/interactive-lab.html">Interactive Lab</a>
        <a href="/ai">AI Reference</a>
    </div>
    <p>Built by <a href="https://ragedesigner.com">RageDesigner</a> | © 2026</p>
</footer>
```

### Footer CSS (Required)
```css
footer { background: #0f151d; color: var(--white); padding: var(--space-6) var(--space-4); text-align: center; }
.ai-badge { display: inline-block; background: rgba(230, 126, 80, 0.2); border: 1px solid var(--primary); padding: var(--space-1) var(--space-2); border-radius: 20px; font-size: var(--text-xs); margin-bottom: var(--space-3); color: var(--primary); }
.footer-links { margin-bottom: var(--space-3); }
.footer-links a { color: var(--white); text-decoration: none; margin: 0 var(--space-2); transition: color 0.3s ease; }
.footer-links a:hover { color: var(--primary); }
footer p { opacity: 0.7; font-size: var(--text-sm); color: var(--white); }
footer p a { color: var(--primary); text-decoration: none; }
```

### ⚠️ CRITICAL FOOTER NOTES:
- **Footer text color:** `var(--white)` (#ffffff) - NOT charcoal-blue
- **RageDesigner link color:** `var(--primary)` (#E67E50 orange)
- **Footer background:** `#0f151d` (darker than charcoal-blue)
- **Footer links:** White text, hover to orange
- **NO contact link in footer** (contact is on ragedesigner.com, not whatisaframework)

---

## 📜 MOBILE MENU JAVASCRIPT (Required)

```javascript
(function() {
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 50) { header.classList.add('scrolled'); }
        else { header.classList.remove('scrolled'); }
    });
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mobileDrawer = document.querySelector('.mobile-nav-drawer');
    const mobileOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileClose = document.querySelector('.mobile-nav-close');
    function openMobileMenu() {
        mobileToggle.classList.add('active');
        mobileDrawer.classList.add('active');
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    function closeMobileMenu() {
        mobileToggle.classList.remove('active');
        mobileDrawer.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            if (mobileDrawer.classList.contains('active')) { closeMobileMenu(); }
            else { openMobileMenu(); }
        });
    }
    if (mobileClose) { mobileClose.addEventListener('click', closeMobileMenu); }
    if (mobileOverlay) { mobileOverlay.addEventListener('click', closeMobileMenu); }
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    document.querySelectorAll('.mobile-nav-link, .mobile-nav-cta').forEach(function(link) {
        link.addEventListener('click', closeMobileMenu);
    });
})();
```

---

## ✅ CHECKLIST: Before Deploying Any Page

- [ ] CSS variables include all required values
- [ ] og:image meta tag present with correct URL
- [ ] twitter:image meta tag present
- [ ] Header HTML matches this reference exactly
- [ ] Footer HTML matches this reference exactly
- [ ] Footer text is WHITE (`var(--white)`)
- [ ] RageDesigner link is ORANGE (`var(--primary)`)
- [ ] Mobile menu JS included
- [ ] Logo URL: `https://app.ragedesigner.com/wp-content/uploads/2025/11/whatisaframework.png`

---

## 🚫 KNOWN BAD PATTERNS (Do Not Use)

### Wrong Footer (causes invisible text):
```html
<!-- BAD - footer p color inherits charcoal-blue -->
footer p { color: var(--charcoal-blue); }
```

### Wrong Contact URL:
```html
<!-- BAD - missing app. prefix -->
<a href="https://ragedesigner.com/contact">Contact</a>

<!-- GOOD - correct URL -->
<a href="https://app.ragedesigner.com/contact">Contact</a>
```

### Missing og:image:
```html
<!-- BAD - no social sharing image -->
<head>
    <title>Page Title</title>
    <!-- missing og:image -->
</head>
```

---

## 📁 FILE LOCATIONS

- **Logo:** `https://app.ragedesigner.com/wp-content/uploads/2025/11/whatisaframework.png`
- **Default OG Image:** `https://app.ragedesigner.com/wp-content/uploads/2025/11/Rage-designer-landing-page-cover.png`
- **Academy Badge:** `https://app.ragedesigner.com/wp-content/uploads/2025/11/strategic-thinking-academy-ragedesigner.png`

---

## 🔄 VERSION HISTORY

| Date | Change | Source |
|------|--------|--------|
| 2026-01-10 | Initial template reference created | index.html SHA: 5410a011 |

---

*This is the source of truth. When in doubt, copy from here.*
