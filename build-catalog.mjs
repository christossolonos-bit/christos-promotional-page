/**
 * Builds products.js from Shopify export (_all_products_slim.json).
 * Keeps hand-written agent lines for known ids; drafts the rest from product copy.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const slim = JSON.parse(
  fs.readFileSync(path.join(__dirname, "_all_products_slim.json"), "utf8")
);

// Original hand-written promo agents (locked to Shopify handles).
const HANDCRAFTED = {
  "nattokinase-10-000-fu-high-potency-enzyme-formula": {
    id: "nattokinase",
    name: "Nattokinase 10,000 FU",
    tag: "Heart & circulation",
    agent:
      "This is for cardiovascular vitality — the Japanese longevity enzyme. It supports healthy blood flow, helps manage plaque build-up, and looks after lipid balance. Think of it as circulation care in a capsule.",
  },
  "glp1-support": {
    id: "glp1",
    name: "GLP1 Support",
    tag: "Metabolism & appetite",
    agent:
      "This helps your body restore its own GLP-1 pathway — the natural signal for satiety and metabolism. It fuels gut L-cells, supports fat oxidation, and helps you feel in control of hunger without synthetic hormone analogues.",
  },
  "super-prostate-support-600-mg-std": {
    id: "prostate",
    name: "Super Prostate Support",
    tag: "Men’s urinary health",
    agent:
      "Formulated for prostate comfort and healthy urine flow. Four synergistic botanicals support normal size and function, testosterone balance, and a calmer inflammatory response — everyday men’s wellness support.",
  },
  "κολλαγόνο-από-πεπτίδια-ψαριού-υαλουρονικό-οξύ": {
    id: "collagen",
    name: "Marine Collagen & Hyaluronic",
    tag: "Skin, hair & joints",
    agent:
      "Beauty from within. Hydrolyzed marine collagen with hyaluronic acid hydrates skin, supports elasticity, strengthens hair and nails, and eases joint stiffness so you move — and look — more comfortably.",
  },
  "q10-98-100-mg-♦-60-enteric-veg-caps-x-500mg-♦-amber-glass-bottles-♦-100-natural-♦-non-gmo-♦-gluten-dairy-free-♦-no-additives-copy": {
    id: "coq10",
    name: "Co-Enzyme Q10 98% · 100 mg",
    tag: "Cellular energy & heart",
    agent:
      "High-potency CoQ10 for the engines of your cells. It supports heart function, lifts cellular energy when you feel drained, and protects reproductive cells from oxidative stress.",
  },
  "shilajit-50-fulvic-acid-natural-booster-energy-stamina": {
    id: "shilajit",
    name: "Shilajit 50% Fulvic Acid",
    tag: "Energy & vitality",
    agent:
      "Himalayan resin — traditionally called the destroyer of weakness. With 50% fulvic acid it boosts ATP and stamina, supports nutrient absorption, testosterone balance, and recovery when life asks more of you.",
  },
  "super-d3-5-000-iu-k2-mk7-100-mcg-magnesium-glycinate-picolinate-zinc": {
    id: "superd3",
    name: "Super D3 5,000 IU & K2 MK7",
    tag: "Bones & immunity",
    agent:
      "This trio guides calcium into bones — not arteries — while K2, magnesium, and zinc reinforce immunity, bone density, and healthy skin and hair. Foundational daily support, especially when sun is scarce.",
  },
  "berberine-97": {
    id: "berberine",
    name: "Berberine 97% HCL",
    tag: "Blood sugar & lipids",
    agent:
      "97% pure berberine for metabolic balance. It supports healthier fasting glucose and HbA1c, helps with waist-line fat signalling, and works on cholesterol — potent plant support for modern metabolic stress.",
  },
  "nad-longetivity-60-drcaps": {
    id: "nad",
    name: "NAD+ Longevity",
    tag: "Cellular aging",
    agent:
      "Nicotinamide riboside plus resveratrol — built for cellular energy and healthy aging. It helps restore mitochondrial output, activate longevity pathways, and protect brain and vessels as the years add up.",
  },
  "moringa-oleifera": {
    id: "moringa",
    name: "Moringa Oleifera 10:1",
    tag: "Whole-body nourishment",
    agent:
      "The king of superfoods in a concentrated 10:1 extract. Packed with amino acids and vitamins, it nourishes skin and hair, fights free radicals, and tops up everyday vitality when your diet needs a green lift.",
  },
  "curcumin-95-pepper": {
    id: "curcumin",
    name: "Curcumin 95%",
    tag: "Inflammation & recovery",
    agent:
      "High-strength curcumin — the active heart of turmeric. Delayed-release delivery supports a calmer inflammatory response, joint comfort, and recovery so daily movement feels easier.",
  },
  ashwangandha: {
    id: "ashwa",
    name: "Ashwagandha",
    tag: "Stress & resilience",
    agent:
      "The classic adaptogen for stress and performance. Ashwagandha helps the body cope with pressure, supports deeper sleep, athletic recovery, and healthy testosterone — calm strength, not sedation.",
  },
};

const CATEGORY_RULES = [
  { tag: "Heart & circulation", re: /nattokinase|hawthorn|crataegus|coq10|co-?enzyme|q10|omega|ginkgo|red yeast|olive leaf/i },
  { tag: "Metabolism & weight", re: /glp1|berberine|bitter melon|appetite|inositol|fenugreek|stevia|3.?days.?slim/i },
  { tag: "Bones & immunity", re: /vitamin d|d3|k2|echinacea|immunity|astragalus|elderberry|sambucus|vitamin c|zinc|rock rose|cistus|artemisia/i },
  { tag: "Energy & vitality", re: /shilajit|nad\+|pqq|cordyceps|b12|methyl b|moringa|tribulus|eros|daily male|daily lady/i },
  { tag: "Brain & mood", re: /lion.?s mane|memory|sharp mind|5.?htp|relive|l.?theanine|anxi|st\.?\s*john|second brain|ginkgo|passion flower/i },
  { tag: "Sleep & calm", re: /sleep|ashwagandha|magnesium|anxi|passion flower|l.?theanine/i },
  { tag: "Gut & digestion", re: /probiotic|lactobacillus|synbiotic|chicory|slippery elm|super lax|alfalfa|chios mastiha/i },
  { tag: "Joints & recovery", re: /glucosamine|collagen|curcumin|msm|chondroitin/i },
  { tag: "Men’s health", re: /prostate|daily male|eros|tribulus/i },
  { tag: "Women’s health", re: /daily lady|inositol/i },
  { tag: "Liver & detox", re: /milk thistle|chanca|uva ursi|glutathione/i },
  { tag: "Respiratory", re: /breath easy|olive leaf|echinacea/i },
  { tag: "Skin & beauty", re: /collagen|moringa|hyaluronic/i },
  { tag: "Eye health", re: /clear sight|eye/i },
  { tag: "Mushrooms", re: /chaga|reishi|shiitake|lion.?s mane|cordyceps/i },
];

function slugId(handle, title) {
  let slug = (handle || title)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  if (!slug) {
    // Greek / non-latin handles — stable ASCII id from URI encoding
    slug = `p-${encodeURIComponent(handle || title)
      .replace(/%/g, "")
      .toLowerCase()
      .slice(0, 40)}`;
  }
  return slug;
}

function shortName(title) {
  return title
    .replace(/[♦●]/g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*[-–—]?\s*\d+\s*DRCaps.*$/i, "")
    .replace(/\s*[-–—]?\s*\d+\s*VCaps.*$/i, "")
    .replace(/\s*[-–—]?\s*\d+\s*Delayed.*$/i, "")
    .replace(/\s*[-–—]?\s*60\s*(Veg|Delayed).*$/i, "")
    .replace(/\s*Χ\s*\d+\s*mg.*$/i, "")
    .replace(/\s*X\s*\d+\s*mg.*$/i, "")
    .replace(/\s*\|\s*.*$/, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function pickTag(title, body, shopTags) {
  const blob = `${title} ${body} ${(shopTags || []).join(" ")}`;
  for (const rule of CATEGORY_RULES) {
    if (rule.re.test(blob)) return rule.tag;
  }
  return "Wellness";
}

function cleanBody(body) {
  return (body || "")
    .replace(/Packaging Format:.*$/i, "")
    .replace(/PACKAGING.*$/i, "")
    .replace(/Ingredients Active Ingredients.*$/i, "")
    .replace(/Ingredients\b.*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function draftAgent(title, body) {
  const name = shortName(title);
  let text = cleanBody(body);

  const benefitsIdx = text.search(/\b(?:Key Benefits|Benefits|ACTIONS)\b/i);
  if (benefitsIdx >= 0) {
    text = text.slice(benefitsIdx).replace(/^\s*(?:Key Benefits|Benefits|ACTIONS)\s*[:\-–*]?\s*/i, "");
  }

  text = text
    .replace(/\*?\s*Short,\s*at-a-glance benefits of[^:]*:\s*/gi, "")
    .replace(/\(?Plain English\)?\s*/gi, "")
    .replace(/\*\s*/g, " ")
    .replace(/\s*[–—]\s*/g, " — ")
    .replace(/\s+/g, " ")
    .trim();

  // Keep first ~2 sentences worth of spoken copy
  const sentences = text.match(/[^.!?]+[.!?]?/g) || [text];
  let line = "";
  for (const sentence of sentences) {
    const next = `${line} ${sentence}`.trim();
    if (line && next.length > 240) break;
    line = next;
    if (line.length >= 160) break;
  }

  if (!line) line = text.slice(0, 220);
  if (line.length > 270) line = line.slice(0, 267).replace(/\s+\S*$/, "") + "…";
  if (!/[.!?…]$/.test(line)) line += ".";

  // Don't repeat the product name if the sentence already starts with it
  if (line.toLowerCase().startsWith(name.toLowerCase())) return line;
  return `${name} — ${line.charAt(0).toLowerCase()}${line.slice(1)}`;
}

function encodeProductUrl(handle) {
  return `https://ygianaturalhealth.com/products/${encodeURIComponent(handle)}`;
}

const usedIds = new Set();

const products = slim.map((item) => {
  const prior = HANDCRAFTED[item.handle] || null;

  let finalId = prior?.id || slugId(item.handle, item.title);
  if (usedIds.has(finalId)) {
    finalId = `${slugId(item.handle, item.title) || "item"}-2`;
  }
  usedIds.add(finalId);

  const name = prior?.name || shortName(item.title);
  const tag = prior?.tag || pickTag(item.title, item.body, item.tags);
  const agent = prior?.agent || draftAgent(item.title, item.body);

  return {
    id: finalId,
    name,
    tag,
    price: `€${Number(item.price).toFixed(2)}`,
    image: item.image || "",
    url: encodeProductUrl(item.handle),
    audio: `audio/${finalId}.mp3`,
    agent,
    handle: item.handle,
  };
});

products.sort((a, b) => a.name.localeCompare(b.name));

const welcome = {
  audio: "audio/welcome.mp3",
  text: "Browse the full YGIA range. Hover or tap any bottle and I’ll explain what it’s for — in plain language.",
};

const out = `window.YGIA_PRODUCTS = ${JSON.stringify(
  products.map(({ handle, ...rest }) => rest),
  null,
  2
)};\n\nwindow.YGIA_WELCOME = ${JSON.stringify(welcome, null, 2)};\n`;

fs.writeFileSync(path.join(__dirname, "products.js"), out);
console.log(`Wrote ${products.length} products to products.js`);
console.log("Categories:", [...new Set(products.map((p) => p.tag))].sort().join(", "));
