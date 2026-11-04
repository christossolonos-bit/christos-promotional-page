(() => {
  const products = window.YGIA_PRODUCTS || [];
  const welcome = window.YGIA_WELCOME || {};
  const grid = document.getElementById("product-grid");
  const guide = document.getElementById("guide");
  const guideStatus = document.getElementById("guide-status");
  const guideProduct = document.getElementById("guide-product");
  const guideText = document.getElementById("guide-text");
  const guideCta = document.getElementById("guide-cta");
  const muteBtn = document.getElementById("guide-mute");
  const guideToggle = document.getElementById("guide-toggle");
  const menuToggle = document.getElementById("menu-toggle");
  const siteNav = document.getElementById("site-nav");
  const searchInput = document.getElementById("product-search");
  const searchWrap = document.getElementById("catalog-search-wrap");
  const filtersEl = document.getElementById("product-filters");
  const countEl = document.getElementById("product-count");
  const categoryBack = document.getElementById("category-back");

  const isPhone = () =>
    window.matchMedia("(max-width: 768px)").matches ||
    window.matchMedia("(pointer: coarse)").matches;

  const idleCopy = {
    product: "Welcome",
    text:
      welcome.text ||
      "Browse the full YGIA range. Hover or tap any bottle and I’ll explain what it’s for — in plain language.",
    status: "Ready when you are",
    url: "https://ygianaturalhealth.com/collections/all-products",
    cta: "Browse all supplements",
    audio: welcome.audio || null,
  };

  const player = new Audio();
  player.preload = "auto";

  let typeTimer = null;
  let leaveTimer = null;
  let activeId = null;
  let audioUnlocked = false;
  let muted = false;
  let currentAudioSrc = null;
  // Phones start with no category so the user picks one first.
  let activeTag = isPhone() ? null : "All";
  let query = "";

  const categoryTags = [
    ...[...new Set(products.map((p) => p.tag).filter(Boolean))].sort((a, b) =>
      a.localeCompare(b)
    ),
  ];

  const tags = ["All", ...categoryTags];

  function categoryCounts() {
    const counts = Object.fromEntries(categoryTags.map((tag) => [tag, 0]));
    products.forEach((product) => {
      if (counts[product.tag] != null) counts[product.tag] += 1;
    });
    return counts;
  }

  function tracked(url, content) {
    return typeof window.ygiaAffiliateUrl === "function"
      ? window.ygiaAffiliateUrl(url, content)
      : url;
  }

  function openShop(url, meta) {
    const href = tracked(url, meta.content || meta.product || "site");
    if (typeof window.ygiaLogClick === "function") {
      window.ygiaLogClick({
        product: meta.product || "",
        content: meta.content || "",
        url: href,
      });
    }
    window.open(href, "_blank", "noopener");
  }

  function filteredProducts() {
    const q = query.trim().toLowerCase();
    return products.filter((product) => {
      if (isPhone() && !activeTag) return false;
      const tagOk = !activeTag || activeTag === "All" || product.tag === activeTag;
      if (!tagOk) return false;
      if (!q) return true;
      return (
        product.name.toLowerCase().includes(q) ||
        product.tag.toLowerCase().includes(q) ||
        (product.agent || "").toLowerCase().includes(q)
      );
    });
  }

  function showCategoryPicker() {
    return isPhone() && !activeTag;
  }

  function syncCatalogChrome() {
    const picking = showCategoryPicker();
    if (categoryBack) categoryBack.hidden = !isPhone() || picking || !activeTag;
    if (searchWrap) searchWrap.hidden = isPhone() && picking;
    if (filtersEl) filtersEl.hidden = isPhone();
  }

  function renderFilters() {
    if (!filtersEl) return;
    if (isPhone()) {
      filtersEl.innerHTML = "";
      return;
    }

    filtersEl.innerHTML = tags
      .map(
        (tag) => `
      <button type="button" role="tab" data-tag="${tag}" class="${
          tag === activeTag ? "is-active" : ""
        }" aria-selected="${tag === activeTag}">${tag}</button>`
      )
      .join("");

    filtersEl.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeTag = btn.dataset.tag;
        renderCatalog();
      });
    });
  }

  function renderCategoryPicker() {
    const counts = categoryCounts();
    if (countEl) {
      countEl.textContent = `${categoryTags.length} categories · ${products.length} products`;
    }

    grid.classList.add("is-categories");
    grid.innerHTML = categoryTags
      .map((tag) => {
        const sample = products.find((product) => product.tag === tag);
        return `
      <button type="button" class="category-card" data-tag="${tag}">
        <div class="category-card__image">
          <img src="${sample?.image || ""}" alt="" loading="lazy" />
        </div>
        <div class="category-card__copy">
          <h3 class="category-card__name">${tag}</h3>
          <p class="category-card__count">${counts[tag]} product${
            counts[tag] === 1 ? "" : "s"
          }</p>
        </div>
        <span class="category-card__chevron" aria-hidden="true">→</span>
      </button>`;
      })
      .join("");

    grid.querySelectorAll(".category-card").forEach((card) => {
      card.addEventListener("click", () => {
        activeTag = card.dataset.tag;
        query = "";
        if (searchInput) searchInput.value = "";
        resetGuide();
        renderCatalog();
        document.getElementById("products")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    });
  }

  function renderProducts() {
    const list = filteredProducts();
    grid.classList.remove("is-categories");

    if (countEl) {
      countEl.textContent = activeTag
        ? `${list.length} in ${activeTag}`
        : `${list.length} of ${products.length} products`;
    }

    grid.innerHTML = list.length
      ? list
          .map(
            (product) => `
      <article class="product" role="listitem" data-id="${product.id}">
        <button
          class="product__main"
          type="button"
          aria-label="Explain ${product.name}"
        >
          <div class="product__image">
            <img src="${product.image}" alt="${product.name}" loading="lazy" />
          </div>
          <span class="product__tag">${product.tag}</span>
          <h3 class="product__name">${product.name}</h3>
          <p class="product__price">${product.price}</p>
        </button>
        <a
          class="product__shop"
          href="${tracked(product.url, product.id)}"
          target="_blank"
          rel="noopener"
          data-product="${product.name.replace(/"/g, "&quot;")}"
          data-content="${product.id}"
        >View on YGIA shop</a>
      </article>`
          )
          .join("")
      : `<p class="catalog-count">No products match that search.</p>`;

    bindProductEvents();
  }

  function renderCatalog() {
    syncCatalogChrome();
    renderFilters();
    if (showCategoryPicker()) {
      renderCategoryPicker();
    } else {
      renderProducts();
    }
  }

  function setActiveCard(id) {
    grid.querySelectorAll(".product").forEach((card) => {
      card.classList.toggle("is-active", card.dataset.id === id);
    });
  }

  function shopLabel() {
    return isPhone() ? "Open this product" : "View on YGIA shop";
  }

  function typeText(text) {
    clearInterval(typeTimer);
    guideText.textContent = "";
    guideText.classList.add("is-typing");

    let i = 0;
    typeTimer = setInterval(() => {
      guideText.textContent = text.slice(0, i + 1);
      i += 1;
      if (i >= text.length) {
        clearInterval(typeTimer);
        guideText.classList.remove("is-typing");
      }
    }, 10);
  }

  function stopVoice() {
    player.pause();
    player.removeAttribute("src");
    player.load();
    currentAudioSrc = null;
    guide.classList.remove("is-speaking");
  }

  function playVoice(src) {
    if (!src || muted) {
      stopVoice();
      return;
    }

    if (currentAudioSrc === src && !player.paused) {
      return;
    }

    stopVoice();
    currentAudioSrc = src;
    player.src = src;
    guide.classList.add("is-speaking");

    const playPromise = player.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        guideStatus.textContent = "Tap a product to enable voice";
        guide.classList.remove("is-speaking");
      });
    }
  }

  function unlockAudio() {
    if (audioUnlocked) return;
    audioUnlocked = true;
    player.muted = true;
    player
      .play()
      .then(() => {
        player.pause();
        player.muted = muted;
        player.removeAttribute("src");
        player.load();
      })
      .catch(() => {
        player.muted = muted;
      });
  }

  function setGuideExpanded(expanded) {
    guide.classList.toggle("is-expanded", expanded);
    if (guideToggle) {
      guideToggle.setAttribute("aria-expanded", expanded ? "true" : "false");
      guideToggle.setAttribute(
        "aria-label",
        expanded ? "Collapse guide" : "Expand guide"
      );
    }
  }

  function explain(product) {
    activeId = product.id;
    guide.classList.add("is-active");
    // On phones keep the sheet compact; viewer expands it manually.
    if (isPhone()) setGuideExpanded(false);
    guideStatus.textContent = muted
      ? "Muted"
      : isPhone()
        ? "Tap bar for full guide"
        : "Speaking…";
    guideProduct.textContent = product.name;
    guideCta.href = tracked(product.url, product.id);
    guideCta.dataset.product = product.name;
    guideCta.dataset.content = product.id;
    guideCta.textContent = shopLabel();
    setActiveCard(product.id);
    // On mobile collapsed view, show full text instantly (clamped to 2 lines in CSS)
    if (isPhone()) {
      clearInterval(typeTimer);
      guideText.classList.remove("is-typing");
      guideText.textContent = product.agent;
    } else {
      typeText(product.agent);
    }
    playVoice(product.audio);
  }

  function resetGuide() {
    activeId = null;
    guide.classList.remove("is-active");
    if (isPhone()) setGuideExpanded(false);
    guideStatus.textContent = idleCopy.status;
    guideProduct.textContent = idleCopy.product;
    guideCta.href = tracked(idleCopy.url, "all-products");
    guideCta.dataset.product = "All products";
    guideCta.dataset.content = "all-products";
    guideCta.textContent = idleCopy.cta;
    setActiveCard(null);
    stopVoice();
    typeText(
      isPhone()
        ? activeTag
          ? "Tap a product in this category and I’ll explain what it’s for."
          : "Choose a category first — then tap a product and I’ll explain it."
        : idleCopy.text
    );
  }

  function bindProductEvents() {
    grid.querySelectorAll(".product").forEach((card) => {
      const product = products.find((item) => item.id === card.dataset.id);
      if (!product) return;
      const main = card.querySelector(".product__main") || card;

      main.addEventListener("pointerenter", (event) => {
        if (event.pointerType === "touch" || isPhone()) return;
        clearTimeout(leaveTimer);
        unlockAudio();
        explain(product);
      });

      main.addEventListener("focus", () => {
        clearTimeout(leaveTimer);
        unlockAudio();
        explain(product);
      });

      card.addEventListener("pointerleave", (event) => {
        if (event.pointerType === "touch" || isPhone()) return;
        leaveTimer = setTimeout(() => {
          if (activeId === product.id) resetGuide();
        }, 280);
      });

      main.addEventListener("click", () => {
        clearTimeout(leaveTimer);
        unlockAudio();
        explain(product);
        if (isPhone()) {
          guide.scrollTop = 0;
        }
      });
    });

    grid.querySelectorAll(".product__shop").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const product = products.find(
          (item) => item.id === link.dataset.content
        );
        openShop(product?.url || link.href, {
          product: link.dataset.product || product?.name || "",
          content: link.dataset.content || "product-shop",
        });
      });
    });
  }

  function bindChromeEvents() {
    guide.addEventListener("pointerenter", () => clearTimeout(leaveTimer));

    player.addEventListener("ended", () => {
      guide.classList.remove("is-speaking");
      if (activeId) guideStatus.textContent = "Explanation complete";
    });

    player.addEventListener("error", () => {
      guide.classList.remove("is-speaking");
      if (activeId) guideStatus.textContent = "Voice file missing — text only";
    });

    if (muteBtn) {
      muteBtn.addEventListener("click", () => {
        muted = !muted;
        player.muted = muted;
        muteBtn.setAttribute("aria-pressed", muted ? "true" : "false");
        muteBtn.textContent = muted ? "Unmute" : "Mute";
        if (muted) {
          stopVoice();
          guideStatus.textContent = activeId
            ? "Voice muted — reading…"
            : idleCopy.status;
        } else if (activeId) {
          const product = products.find((item) => item.id === activeId);
          if (product) playVoice(product.audio);
          guideStatus.textContent = "Speaking…";
        }
      });
    }

    function toggleGuideSheet() {
      if (!isPhone()) return;
      const next = !guide.classList.contains("is-expanded");
      setGuideExpanded(next);
      if (activeId) {
        guideStatus.textContent = muted
          ? "Muted"
          : next
            ? "Speaking…"
            : "Tap bar for full guide";
      }
    }

    if (guideToggle) {
      guideToggle.addEventListener("click", toggleGuideSheet);
    }

    guide.addEventListener("click", (event) => {
      if (!isPhone() || guide.classList.contains("is-expanded")) return;
      if (event.target.closest(".guide__cta, .guide__mute")) return;
      toggleGuideSheet();
    });

    if (menuToggle && siteNav) {
      menuToggle.addEventListener("click", () => {
        const open = !siteNav.classList.contains("is-open");
        siteNav.classList.toggle("is-open", open);
        menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
        menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      });

      siteNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          siteNav.classList.remove("is-open");
          menuToggle.setAttribute("aria-expanded", "false");
          menuToggle.setAttribute("aria-label", "Open menu");
        });
      });
    }

    document.addEventListener(
      "pointerdown",
      () => {
        unlockAudio();
      },
      { once: true }
    );

    guideCta.addEventListener("click", (event) => {
      event.preventDefault();
      openShop(guideCta.href, {
        product: guideCta.dataset.product || guideProduct.textContent,
        content: guideCta.dataset.content || "guide-cta",
      });
    });

    document.querySelectorAll("[data-affiliate-link]").forEach((link) => {
      const base = link.getAttribute("href");
      const content = link.getAttribute("data-affiliate-link") || "nav";
      link.setAttribute("href", tracked(base, content));
      link.addEventListener("click", () => {
        if (typeof window.ygiaLogClick === "function") {
          window.ygiaLogClick({
            product: link.textContent.trim(),
            content,
            url: link.href,
          });
        }
      });
    });

    if (searchInput) {
      searchInput.addEventListener("input", () => {
        query = searchInput.value || "";
        if (showCategoryPicker()) return;
        renderProducts();
        syncCatalogChrome();
      });
    }

    if (categoryBack) {
      categoryBack.addEventListener("click", () => {
        activeTag = null;
        query = "";
        if (searchInput) searchInput.value = "";
        resetGuide();
        renderCatalog();
      });
    }

    window.addEventListener("resize", () => {
      if (!isPhone()) {
        setGuideExpanded(true);
        if (siteNav) siteNav.classList.remove("is-open");
        if (activeTag == null) activeTag = "All";
      } else {
        if (!activeId) setGuideExpanded(false);
        if (activeTag === "All") activeTag = null;
      }
      renderCatalog();
    });
  }

  renderCatalog();
  bindChromeEvents();
  resetGuide();
})();
