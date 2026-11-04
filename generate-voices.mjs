/**
 * One-time Fish Audio generator — creates ready-made MP3s for the site.
 * Voice: 821e7fa63a2c402ebf8203d680965831
 *
 * Usage:
 *   set FISH_API_KEY=your_key
 *   node generate-voices.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VOICE_ID = "821e7fa63a2c402ebf8203d680965831";
const API_URL = "https://api.fish.audio/v1/tts";
const MODEL = "s2.1-pro-free";
const OUT_DIR = path.join(__dirname, "audio");

function readKeyFromEnvFile(filePath) {
  try {
    const text = fs.readFileSync(filePath, "utf8");
    const match = text.match(/^\s*FISH_AUDIO_API_KEY\s*=\s*(.+)\s*$/m);
    return match ? match[1].trim().replace(/^["']|["']$/g, "") : "";
  } catch {
    return "";
  }
}

const apiKey =
  process.env.FISH_API_KEY ||
  process.env.FISH_AUDIO_API_KEY ||
  readKeyFromEnvFile("D:/Luna discord voice/GiadaAssistant/.env");
if (!apiKey) {
  console.error("Missing FISH_API_KEY. Set it, then run: node generate-voices.mjs");
  process.exit(1);
}

function loadProducts() {
  const code = fs.readFileSync(path.join(__dirname, "products.js"), "utf8");
  const sandbox = { window: {} };
  vm.runInNewContext(code, sandbox);
  const products = sandbox.window.YGIA_PRODUCTS || [];
  const welcome = sandbox.window.YGIA_WELCOME;
  const clips = products.map((p) => ({
    id: p.id,
    text: p.agent,
    file: path.join(OUT_DIR, `${p.id}.mp3`),
  }));
  if (welcome?.text) {
    clips.unshift({
      id: "welcome",
      text: welcome.text,
      file: path.join(OUT_DIR, "welcome.mp3"),
    });
  }
  return clips;
}

async function synthesize(text, outFile) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      model: MODEL,
    },
    body: JSON.stringify({
      text,
      reference_id: VOICE_ID,
      format: "mp3",
      mp3_bitrate: 128,
      normalize: true,
      latency: "normal",
      prosody: { speed: 1, volume: 0, normalize_loudness: true },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`${response.status}: ${errText}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(outFile, buffer);
  return buffer.length;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const clips = loadProducts();
  console.log(`Generating ${clips.length} clips with voice ${VOICE_ID}…`);

  for (const clip of clips) {
    if (fs.existsSync(clip.file) && fs.statSync(clip.file).size > 1000) {
      console.log(`skip  ${clip.id} (exists)`);
      continue;
    }
    process.stdout.write(`make  ${clip.id} … `);
    try {
      const bytes = await synthesize(clip.text, clip.file);
      console.log(`ok (${Math.round(bytes / 1024)} KB)`);
    } catch (err) {
      console.log("FAIL");
      console.error(`  ${err.message}`);
      process.exitCode = 1;
    }
    await new Promise((r) => setTimeout(r, 400));
  }

  console.log("Done. MP3s are in /audio — the site plays these on hover (no live TTS).");
}

main();
