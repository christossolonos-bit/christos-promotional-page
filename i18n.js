(() => {
  const STRINGS = {
    en: {
      "nav.products": "Products",
      "nav.standard": "The Standard",
      "nav.founder": "Founder",
      "nav.shop": "Shop YGIA",
      "hero.title": "Clean by Design.<br />Powerful by Formulation.",
      "hero.lead":
        "Standardized herbal extracts. No fillers. Delayed-release capsules that deliver nature where it matters.",
      "hero.ctaFormulas": "Meet the formulas",
      "hero.ctaShop": "Visit the shop",
      "products.eyebrow": "Full YGIA catalogue",
      "products.headlineDesktop":
        "Hover a product.<br />Your herbalist guide explains.",
      "products.headlineMobile": "Choose a category.<br />Then tap a product.",
      "products.copyDesktop":
        "All YGIA formulas are here. Hover any bottle and the guide will explain what it’s for — then shop with your tracked referral link.",
      "products.copyMobile":
        "Pick a health category first to keep the list short. Then tap a bottle to hear what it’s for.",
      "products.backCategories": "← All categories",
      "products.searchLabel": "Search products",
      "products.searchPlaceholder": "Search products…",
      "products.countCategories": "{n} categories · {p} products",
      "products.countIn": "{n} in {tag}",
      "products.countOf": "{n} of {p} products",
      "products.empty": "No products match that search.",
      "products.productOne": "1 product",
      "products.productMany": "{n} products",
      "products.viewShop": "View on YGIA shop",
      "products.openProduct": "Open this product",
      "products.explain": "Explain {name}",
      "guide.label": "YGIA Guide",
      "guide.mute": "Mute",
      "guide.unmute": "Unmute",
      "guide.welcome": "Welcome",
      "guide.ready": "Ready when you are",
      "guide.ctaAll": "Browse all supplements",
      "guide.welcomeText":
        "Browse the full YGIA range. Hover or tap any bottle and I’ll explain what it’s for — in plain language.",
      "guide.pickCategory":
        "Choose a category first — then tap a product and I’ll explain it.",
      "guide.tapProduct":
        "Tap a product in this category and I’ll explain what it’s for.",
      "guide.muted": "Muted",
      "guide.speaking": "Speaking…",
      "guide.tapBar": "Tap bar for full guide",
      "guide.complete": "Explanation complete",
      "guide.voiceMissing": "Voice file missing — text only",
      "guide.enableVoice": "Tap a product to enable voice",
      "guide.voiceMuted": "Voice muted — reading…",
      "guide.expand": "Expand guide",
      "guide.collapse": "Collapse guide",
      "standard.eyebrow": "The YGIA difference",
      "standard.title": "A supplement is only as good as its absorption.",
      "standard.copy":
        "No industry-standard additives. Premium delayed-release capsules. Recyclable amber glass. Formulas built on research, tradition, and repeat results.",
      "standard.p1title": "Standardized extracts",
      "standard.p1body": "Potency you can trust — not mystery powders.",
      "standard.p2title": "Clean-label",
      "standard.p2body":
        "No fillers, no artificial elements, plant-based DRCaps.",
      "standard.p3title": "EU accredited",
      "standard.p3body":
        "Approved under EU regulation; HACCP & ISO 9001 lab.",
      "founder.quote":
        "“Let food be thy medicine and medicine be thy food.”",
      "founder.body":
        "Guided by Hippocrates — “Nature does not need teachers” — Costas Argyrides founded YGIA Natural Health on prevention, precise herbal craft, and formulas that move the needle.",
      "founder.name":
        "Costas Argyrides · Herbalist & Naturopath · Cyprus",
      "closing.title": "Ready to feel the difference?",
      "closing.copy":
        "Explore the full range on the official YGIA Natural Health shop.",
      "closing.cta": "Go to ygianaturalhealth.com",
      "dock.products": "Products",
      "dock.shop": "Shop",
      "dock.about": "About",
      "footer.html":
        'Promotional showcase for <a href="https://ygianaturalhealth.com/" target="_blank" rel="noopener" data-affiliate-link="footer">YGIA Natural Health</a>. Referrals tagged <code>ref=christos-solonos</code> (Christos Solonos). <a href="clicks.html">Click log</a> · <a href="kostas-email-setup.html">For Kostas: referral order tag</a> · Not medical advice — consult your practitioner.',
      "menu.open": "Open menu",
      "menu.close": "Close menu",
      "lang.toGreek": "Switch to Greek",
      "lang.toEnglish": "Switch to English",
    },
    el: {
      "nav.products": "Προϊόντα",
      "nav.standard": "Το Πρότυπο",
      "nav.founder": "Ιδρυτής",
      "nav.shop": "Κατάστημα YGIA",
      "hero.title": "Καθαρό εκ φύσεως.<br />Δυνατό στη σύνθεση.",
      "hero.lead":
        "Τυποποιημένα φυτικά εκχυλίσματα. Χωρίς πληρωτικά. Κάψουλες καθυστερημένης αποδέσμευσης που παραδίδουν τη φύση εκεί που μετράει.",
      "hero.ctaFormulas": "Δείτε τις φόρμουλες",
      "hero.ctaShop": "Επισκεφθείτε το κατάστημα",
      "products.eyebrow": "Πλήρης κατάλογος YGIA",
      "products.headlineDesktop":
        "Περάστε πάνω από ένα προϊόν.<br />Ο βοτανολόγος σας εξηγεί.",
      "products.headlineMobile":
        "Επιλέξτε κατηγορία.<br />Μετά πατήστε ένα προϊόν.",
      "products.copyDesktop":
        "Όλες οι φόρμουλες YGIA είναι εδώ. Περάστε πάνω από οποιοδήποτε μπουκάλι και ο οδηγός θα εξηγήσει σε τι χρησιμεύει — μετά αγοράστε με τον σύνδεσμο παραπομπής σας.",
      "products.copyMobile":
        "Επιλέξτε πρώτα κατηγορία για πιο σύντομη λίστα. Μετά πατήστε ένα μπουκάλι για να ακούσετε σε τι χρησιμεύει.",
      "products.backCategories": "← Όλες οι κατηγορίες",
      "products.searchLabel": "Αναζήτηση προϊόντων",
      "products.searchPlaceholder": "Αναζήτηση προϊόντων…",
      "products.countCategories": "{n} κατηγορίες · {p} προϊόντα",
      "products.countIn": "{n} σε {tag}",
      "products.countOf": "{n} από {p} προϊόντα",
      "products.empty": "Κανένα προϊόν δεν ταιριάζει στην αναζήτηση.",
      "products.productOne": "1 προϊόν",
      "products.productMany": "{n} προϊόντα",
      "products.viewShop": "Δείτε στο κατάστημα YGIA",
      "products.openProduct": "Ανοίξτε αυτό το προϊόν",
      "products.explain": "Εξήγηση {name}",
      "guide.label": "Οδηγός YGIA",
      "guide.mute": "Σίγαση",
      "guide.unmute": "Ήχος",
      "guide.welcome": "Καλώς ήρθατε",
      "guide.ready": "Έτοιμος όταν είστε",
      "guide.ctaAll": "Δείτε όλα τα συμπληρώματα",
      "guide.welcomeText":
        "Δείτε όλη τη σειρά YGIA. Περάστε ή πατήστε οποιοδήποτε μπουκάλι και θα σας εξηγήσω σε τι χρησιμεύει — με απλά λόγια.",
      "guide.pickCategory":
        "Επιλέξτε πρώτα κατηγορία — μετά πατήστε ένα προϊόν και θα σας το εξηγήσω.",
      "guide.tapProduct":
        "Πατήστε ένα προϊόν σε αυτή την κατηγορία και θα σας εξηγήσω σε τι χρησιμεύει.",
      "guide.muted": "Σε σίγαση",
      "guide.speaking": "Μιλάει…",
      "guide.tapBar": "Πατήστε για πλήρη οδηγό",
      "guide.complete": "Η εξήγηση ολοκληρώθηκε",
      "guide.voiceMissing": "Λείπει το αρχείο φωνής — μόνο κείμενο",
      "guide.enableVoice": "Πατήστε ένα προϊόν για φωνή",
      "guide.voiceMuted": "Φωνή σε σίγαση — ανάγνωση…",
      "guide.expand": "Άνοιγμα οδηγού",
      "guide.collapse": "Κλείσιμο οδηγού",
      "standard.eyebrow": "Η διαφορά YGIA",
      "standard.title":
        "Ένα συμπλήρωμα είναι τόσο καλό όσο η απορρόφησή του.",
      "standard.copy":
        "Χωρίς βιομηχανικά πρόσθετα. Κάψουλες καθυστερημένης αποδέσμευσης. Ανακυκλώσιμο κεχριμπαρένιο γυαλί. Φόρμουλες βασισμένες στην έρευνα, την παράδοση και τα αποτελέσματα.",
      "standard.p1title": "Τυποποιημένα εκχυλίσματα",
      "standard.p1body":
        "Ισχύς που μπορείτε να εμπιστευτείτε — όχι μυστηριώδεις σκόνες.",
      "standard.p2title": "Καθαρή ετικέτα",
      "standard.p2body":
        "Χωρίς πληρωτικά, χωρίς τεχνητά στοιχεία, φυτικές DRCaps.",
      "standard.p3title": "Διαπίστευση ΕΕ",
      "standard.p3body":
        "Εγκεκριμένο σύμφωνα με κανονισμούς ΕΕ· εργαστήριο HACCP & ISO 9001.",
      "founder.quote":
        "«Ας είναι η τροφή σου το φάρμακό σου και το φάρμακό σου η τροφή σου.»",
      "founder.body":
        "Με οδηγό τον Ιπποκράτη — «Η φύση δεν χρειάζεται δασκάλους» — ο Κώστας Αργυρίδης ίδρυσε την YGIA Natural Health πάνω στην πρόληψη, την ακριβή βοτανοθεραπεία και φόρμουλες που φέρνουν αποτέλεσμα.",
      "founder.name":
        "Κώστας Αργυρίδης · Βοτανολόγος & Νατουροπαθής · Κύπρος",
      "closing.title": "Έτοιμοι να δείτε τη διαφορά;",
      "closing.copy":
        "Εξερευνήστε όλη τη σειρά στο επίσημο κατάστημα YGIA Natural Health.",
      "closing.cta": "Μετάβαση στο ygianaturalhealth.com",
      "dock.products": "Προϊόντα",
      "dock.shop": "Κατάστημα",
      "dock.about": "Σχετικά",
      "footer.html":
        'Προωθητική παρουσίαση για την <a href="https://ygianaturalhealth.com/" target="_blank" rel="noopener" data-affiliate-link="footer">YGIA Natural Health</a>. Παραπομπές με ετικέτα <code>ref=christos-solonos</code> (Christos Solonos). <a href="clicks.html">Αρχείο κλικ</a> · <a href="kostas-email-setup.html">Για τον Κώστα: ετικέτα παραγγελίας</a> · Όχι ιατρική συμβουλή — συμβουλευτείτε τον ειδικό σας.',
      "menu.open": "Άνοιγμα μενού",
      "menu.close": "Κλείσιμο μενού",
      "lang.toGreek": "Αλλαγή στα Ελληνικά",
      "lang.toEnglish": "Switch to English",
    },
  };

  let lang =
    localStorage.getItem("ygia-lang") === "el" ? "el" : "en";

  function t(key, vars = {}) {
    const table = STRINGS[lang] || STRINGS.en;
    let text = table[key] ?? STRINGS.en[key] ?? key;
    Object.entries(vars).forEach(([k, v]) => {
      text = text.replaceAll(`{${k}}`, String(v));
    });
    return text;
  }

  function applyStatic() {
    document.documentElement.lang = lang === "el" ? "el" : "en";

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.getAttribute("data-i18n"));
    });

    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      el.innerHTML = t(el.getAttribute("data-i18n-html"));
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      el.setAttribute(
        "placeholder",
        t(el.getAttribute("data-i18n-placeholder"))
      );
    });

    const toggle = document.getElementById("lang-toggle");
    if (toggle) {
      const active = lang === "el";
      toggle.setAttribute("aria-pressed", active ? "true" : "false");
      toggle.setAttribute(
        "title",
        active ? t("lang.toEnglish") : t("lang.toGreek")
      );
      toggle.setAttribute(
        "aria-label",
        active ? t("lang.toEnglish") : t("lang.toGreek")
      );
      const current = toggle.querySelector(".lang-toggle__current");
      const other = toggle.querySelector(".lang-toggle__other");
      if (current) current.textContent = active ? "ΕΛ" : "EN";
      if (other) other.textContent = active ? "EN" : "ΕΛ";
    }

    // Re-apply affiliate tracking on footer links rewritten via innerHTML
    document.querySelectorAll("[data-affiliate-link]").forEach((link) => {
      const base = link.getAttribute("href");
      if (!base || !base.includes("ygianaturalhealth.com")) return;
      const content = link.getAttribute("data-affiliate-link") || "nav";
      if (typeof window.ygiaAffiliateUrl === "function") {
        const clean = base.split("?")[0];
        link.setAttribute("href", window.ygiaAffiliateUrl(clean, content));
      }
    });
  }

  function setLang(next) {
    lang = next === "el" ? "el" : "en";
    localStorage.setItem("ygia-lang", lang);
    applyStatic();
    window.dispatchEvent(
      new CustomEvent("ygia:lang", { detail: { lang } })
    );
  }

  function toggleLang() {
    setLang(lang === "el" ? "en" : "el");
  }

  window.ygiaI18n = { t, getLang: () => lang, setLang, toggleLang, applyStatic };

  let wired = false;
  function boot() {
    applyStatic();
    if (wired) return;
    const btn = document.getElementById("lang-toggle");
    if (!btn) return;
    btn.addEventListener("click", toggleLang);
    wired = true;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
