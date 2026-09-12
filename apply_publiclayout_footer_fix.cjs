// apply_publiclayout_footer_fix.cjs
//
// Patches src/components/Publiclayout.tsx (or PublicLayout.tsx) to:
//   1. Add `import Footer from "./Footer";`
//   2. Delete the entire hardcoded `function PublicFooter() { ... }` block
//   3. Replace `<PublicFooter />` with `<Footer />`
//
// Usage (run from your project root, where package.json lives):
//   node apply_publiclayout_footer_fix.cjs

const fs = require("fs");
const path = require("path");

const CANDIDATES = [
  path.join(process.cwd(), "src", "components", "Publiclayout.tsx"),
  path.join(process.cwd(), "src", "components", "PublicLayout.tsx"),
];

const FILE = CANDIDATES.find((p) => fs.existsSync(p));

if (!FILE) {
  console.error("❌ Could not find Publiclayout.tsx / PublicLayout.tsx in src/components/");
  console.error("   Run this script from your project root (same folder as package.json).");
  process.exit(1);
}

console.log(`Found file: ${FILE}`);

let src = fs.readFileSync(FILE, "utf8");
const original = src;

const navbarImport = `import Navbar from "./Navbar";`;
const footerImport = `import Footer from "./Footer";`;

if (src.includes(footerImport)) {
  console.log("↷ Footer import already present — skipping");
} else if (src.includes(navbarImport)) {
  src = src.replace(navbarImport, `${navbarImport}\n${footerImport}`);
  console.log("✅ Added Footer import");
} else {
  console.warn("⚠️  Could not find the Navbar import line to anchor off of.");
  console.warn(`    Add this manually near the top of the file: ${footerImport}`);
}

const startMarker = "function PublicFooter() {";
const endMarker = "// ── PublicLayout";

const startIdx = src.indexOf(startMarker);
const endIdx = src.indexOf(endMarker, startIdx);

if (startIdx === -1) {
  console.log("↷ Old PublicFooter function not found — already removed, or already patched.");
} else if (endIdx === -1) {
  console.warn("⚠️  Found the start of PublicFooter() but not the end marker.");
  console.warn("    Please delete the PublicFooter function manually to be safe.");
} else {
  let cutStart = startIdx;
  const beforeStart = src.lastIndexOf("\n", startIdx - 2);
  const possibleCommentLine = src.slice(beforeStart + 1, startIdx).trim();
  if (possibleCommentLine.startsWith("//") && possibleCommentLine.includes("Footer")) {
    cutStart = beforeStart + 1;
  }
  src = src.slice(0, cutStart) + src.slice(endIdx);
  console.log("✅ Removed old PublicFooter function block");
}

const oldUsage = "<PublicFooter />";
const newUsage = "<Footer />";

if (src.includes(newUsage) && !src.includes(oldUsage)) {
  console.log("↷ <Footer /> already in place — skipping");
} else if (src.includes(oldUsage)) {
  src = src.split(oldUsage).join(newUsage);
  console.log("✅ Replaced <PublicFooter /> with <Footer />");
} else {
  console.warn("⚠️  Could not find <PublicFooter /> usage to replace.");
}

if (src === original) {
  console.log("\nNo changes were needed — file already matches the target state.");
  process.exit(0);
}

const backupPath = FILE + ".bak";
fs.writeFileSync(backupPath, original, "utf8");
fs.writeFileSync(FILE, src, "utf8");

console.log(`\nDone. Backup saved to: ${backupPath}`);
console.log("Now restart your dev server (Ctrl+C, then npm run dev) and hard-refresh the browser.");
