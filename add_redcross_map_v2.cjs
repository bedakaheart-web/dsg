// add_redcross_map_v2.cjs
//
// Fixed version: searches specifically for "LOCATIONS: Location[]" which
// is unique to the CitizenMap component, avoiding the false match with
// Directory.tsx (which also happens to contain "City Central Elementary School").
//
// Usage (from your project root, where package.json lives):
//   node add_redcross_map_v2.cjs

const fs = require("fs");
const path = require("path");

const SRC_DIR = path.join(process.cwd(), "src");

if (!fs.existsSync(SRC_DIR)) {
  console.error(`❌ Could not find ${SRC_DIR}`);
  console.error("   Run this script from your project root (same folder as package.json).");
  process.exit(1);
}

const anchor = `  { id: 16, category: "evacuation", label: "City Central Elementary School",   address: "Poblacion 1, Dumaguete City",                    phone: "09264603953",     lat: 9.3072,  lng: 123.3058 },
];`;

const replacement = `  { id: 16, category: "evacuation", label: "City Central Elementary School",   address: "Poblacion 1, Dumaguete City",                    phone: "09264603953",     lat: 9.3072,  lng: 123.3058 },
  { id: 17, category: "emergency",  label: "Philippine Red Cross (Negros Oriental)", address: "Bishop Epifanio Surban St., Brgy. 4, Dumaguete City", phone: "(035) 225-2835",  lat: 9.2992,  lng: 123.3043 },
];`;

// ── Find ALL candidate files, then pick the one with the unique marker ──
function findAllFiles(dir, results = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules") continue;
      findAllFiles(fullPath, results);
    } else if (entry.isFile() && (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts"))) {
      results.push(fullPath);
    }
  }
  return results;
}

const allFiles = findAllFiles(SRC_DIR);

// The unique marker: only the map component declares this typed array.
const uniqueMarker = "LOCATIONS: Location[]";

const candidates = allFiles.filter((f) => {
  const content = fs.readFileSync(f, "utf8");
  return content.includes(uniqueMarker);
});

if (candidates.length === 0) {
  console.error(`❌ Could not find any file containing '${uniqueMarker}'.`);
  console.error("   Your map component may use a different variable name or type now.");
  console.error("   Open the file yourself and search for the LOCATIONS array to edit manually.");
  process.exit(1);
}

if (candidates.length > 1) {
  console.warn(`⚠️  Found ${candidates.length} files containing '${uniqueMarker}':`);
  candidates.forEach((f) => console.warn(`     - ${f}`));
  console.warn("   Using the first match. If that's wrong, edit TARGET_OVERRIDE below and re-run.");
}

const targetFile = candidates[0];

let src = fs.readFileSync(targetFile, "utf8");
const original = src;

if (src.includes("Philippine Red Cross (Negros Oriental)")) {
  console.log(`↷ Red Cross marker already present in ${targetFile} — skipping (no changes made).`);
  process.exit(0);
}

if (!src.includes(anchor)) {
  console.error(`⚠️  Found the correct file (${targetFile}) but the exact anchor text didn't match.`);
  console.error("    This can happen if whitespace/formatting differs slightly from what this script expects.");
  console.error('    Open the file, search for `id: 16` and `City Central Elementary School`,');
  console.error("    and paste this new line right after that entry, before the closing `];`:\n");
  console.error(`  { id: 17, category: "emergency",  label: "Philippine Red Cross (Negros Oriental)", address: "Bishop Epifanio Surban St., Brgy. 4, Dumaguete City", phone: "(035) 225-2835",  lat: 9.2992,  lng: 123.3043 },`);
  process.exit(1);
}

src = src.replace(anchor, replacement);

const backupPath = targetFile + ".bak";
fs.writeFileSync(backupPath, original, "utf8");
fs.writeFileSync(targetFile, src, "utf8");

console.log(`✅ Red Cross marker inserted into ${targetFile}`);
console.log(`   Backup of original saved to: ${backupPath}`);
console.log("\nRestart your dev server and hard-refresh the browser to see it on the map.");
