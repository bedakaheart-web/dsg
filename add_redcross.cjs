// add_redcross.cjs
//
// Inserts a Philippine Red Cross (Negros Oriental Chapter) entry into
// the `emergency` array in src/pages/Directory.tsx.
//
// Usage (from your project root, where package.json lives):
//   node add_redcross.cjs

const fs = require("fs");
const path = require("path");

const FILE = path.join(process.cwd(), "src", "pages", "Directory.tsx");

if (!fs.existsSync(FILE)) {
  console.error(`❌ Could not find ${FILE}`);
  console.error("   Edit the FILE path at the top of this script if Directory.tsx lives elsewhere.");
  process.exit(1);
}

let src = fs.readFileSync(FILE, "utf8");
const original = src;

const anchor = `  {
    agency: "Metro Water", label: "Water District",
    address: "Dumaguete City", icon: "💧", accent: "#38bdf8",
    phones: [
      { label: "Office",    number: "(035) 422-6951" },
      { label: "Emergency", number: "0998 847 5656" },
    ],
    notes: "Metro Dumaguete Water District — supply interruptions & pipe emergencies",
  },
];`;

const replacement = `  {
    agency: "Metro Water", label: "Water District",
    address: "Dumaguete City", icon: "💧", accent: "#38bdf8",
    phones: [
      { label: "Office",    number: "(035) 422-6951" },
      { label: "Emergency", number: "0998 847 5656" },
    ],
    notes: "Metro Dumaguete Water District — supply interruptions & pipe emergencies",
  },
  {
    agency: "Red Cross", label: "PRC Negros Oriental",
    address: "Bishop Epifanio Surban St., Brgy. 4, Dumaguete City", icon: "➕", accent: "#e8372a",
    phones: [
      { label: "Landline 1", number: "(035) 225-2835" },
      { label: "Landline 2", number: "(035) 522-2815" },
    ],
    facebook: "prcnegrosoriental",
    notes: "Philippine Red Cross — blood services, disaster response & emergency medical assistance",
  },
];`;

if (src.includes(`agency: "Red Cross"`)) {
  console.log("↷ Red Cross entry already present — skipping (no changes made).");
  process.exit(0);
}

if (!src.includes(anchor)) {
  console.error("⚠️  Could not find the exact anchor block (Metro Water entry).");
  console.error("    Your file may have been edited/reformatted since. Open Directory.tsx");
  console.error('    and search for `agency: "Metro Water"` to insert the new entry manually.');
  process.exit(1);
}

src = src.replace(anchor, replacement);

const backupPath = FILE + ".bak";
fs.writeFileSync(backupPath, original, "utf8");
fs.writeFileSync(FILE, src, "utf8");

console.log("✅ Red Cross entry inserted into Directory.tsx");
console.log(`   Backup of original saved to: ${backupPath}`);
console.log("\nRestart your dev server and hard-refresh the browser to see it.");
