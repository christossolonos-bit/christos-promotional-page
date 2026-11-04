/**
 * ElevenLabs Greek voiceovers for the promo page (ΕΛ mode).
 * Model: eleven_multilingual_v2 (supports Greek)
 * Default voice: George (warm narrator) — override with ELEVEN_VOICE_ID
 *
 * Usage:
 *   set ELEVENLABS_API_KEY=your_key
 *   node generate-voices-el.mjs
 *   node generate-voices-el.mjs --force
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "audio", "el");
const FORCE = process.argv.includes("--force");
const MODEL = "eleven_multilingual_v2";
// George — multilingual narrator (approved test voice for Greek)
const VOICE_ID =
  process.env.ELEVEN_VOICE_ID || "JBFqnCBsd6RMkjVDRZzb";

function readKeyFromEnvFile(filePath) {
  try {
    const text = fs.readFileSync(filePath, "utf8");
    const match = text.match(
      /^\s*(?:ELEVENLABS_API_KEY|ELEVEN_API_KEY|XI_API_KEY)\s*=\s*(.+)\s*$/m
    );
    return match ? match[1].trim().replace(/^["']|["']$/g, "") : "";
  } catch {
    return "";
  }
}

const apiKey =
  process.env.ELEVENLABS_API_KEY ||
  process.env.ELEVEN_API_KEY ||
  process.env.XI_API_KEY ||
  readKeyFromEnvFile(path.join(__dirname, ".env")) ||
  readKeyFromEnvFile("D:/Luna discord voice/GiadaAssistant/.env");

if (!apiKey) {
  console.error(
    "Missing ELEVENLABS_API_KEY. Set it in the environment or .env, then run again."
  );
  process.exit(1);
}

function loadSandbox(file) {
  const code = fs.readFileSync(path.join(__dirname, file), "utf8");
  const sandbox = { window: {} };
  vm.runInNewContext(code, sandbox);
  return sandbox.window;
}

/** Speak pure Greek body — strip English product-name prefix for natural Greek TTS */
function spokenGreek(full) {
  const parts = String(full).split(" — ");
  if (parts.length > 1) {
    const rest = parts.slice(1).join(" — ").trim();
    if (/[\u0370-\u03FF\u1F00-\u1FFF]/.test(rest)) return rest;
  }
  return full;
}

function loadClips() {
  const agents = loadSandbox("agents-el.js").YGIA_AGENTS_EL || {};
  const products = loadSandbox("products.js").YGIA_PRODUCTS || [];
  const clips = products.map((p) => ({
    id: p.id,
    text: spokenGreek(agents[p.id] || p.agent),
    file: path.join(OUT_DIR, `${p.id}.mp3`),
  }));

  clips.unshift({
    id: "welcome",
    text: "Δείτε όλη τη σειρά YGIA. Περάστε ή πατήστε οποιοδήποτε μπουκάλι και θα σας εξηγήσω σε τι χρησιμεύει — με απλά λόγια.",
    file: path.join(OUT_DIR, "welcome.mp3"),
  });

  return clips;
}

async function synthesize(text, outFile) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: MODEL,
      voice_settings: {
        stability: 0.45,
        similarity_boost: 0.75,
        style: 0.15,
        use_speaker_boost: true,
      },
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
  const clips = loadClips();
  console.log(
    `ElevenLabs Greek TTS — voice=${VOICE_ID} model=${MODEL} clips=${clips.length}`
  );

  let ok = 0;
  let skip = 0;
  let fail = 0;

  for (const clip of clips) {
    if (
      !FORCE &&
      fs.existsSync(clip.file) &&
      fs.statSync(clip.file).size > 1000
    ) {
      // Old Fish files may exist — force regenerate when --force
      console.log(`skip  ${clip.id}`);
      skip += 1;
      continue;
    }
    process.stdout.write(`make  ${clip.id} … `);
    try {
      const bytes = await synthesize(clip.text, clip.file);
      console.log(`ok (${Math.round(bytes / 1024)} KB)`);
      ok += 1;
    } catch (err) {
      console.log("FAIL");
      console.error(`  ${err.message}`);
      fail += 1;
      process.exitCode = 1;
      // Stop on auth errors
      if (/401|403|missing.*key/i.test(err.message)) break;
    }
    await new Promise((r) => setTimeout(r, 250));
  }

  console.log(`Done. ok=${ok} skip=${skip} fail=${fail} → audio/el/`);
}

main();
