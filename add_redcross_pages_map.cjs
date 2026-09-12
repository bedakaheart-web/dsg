const fs = require("fs");
const path = require("path");

const FILE = path.join(process.cwd(), "src", "pages", "Map.tsx");

if (!fs.existsSync(FILE)) {
  console.error(`Could not find ${FILE}`);
  process.exit(1);
}

let src = fs.readFileSync(FILE, "utf8");
const original = src;

if (src.includes("Philippine Red Cross (Negros Oriental)")) {
  console.log(`Red Cross marker already present in ${FILE} - skipping.`);
  process.exit(0);
}

const anchor = `  { id: 16, category: "evacuation", label: "City Central Elementary School",   address: "Poblacion 1, Dumaguete City",                    phone: "09264603953",     lat: 9.3072,  lng: 123.3058 },
];`;

const replacement = `  { id: 16, category: "evacuation", label: "City Central Elementary School",   address: "Poblacion 1, Dumaguete City",                    phone: "09264603953",     lat: 9.3072,  lng: 123.3058 },
  { id: 17, category: "emergency",  label: "Philippine Red Cross (Negros Oriental)", address: "Bishop Epifanio Surban St., Brgy. 4, Dumaguete City", phone: "(035) 225-2835",  lat: 9.2992,  lng: 123.3043 },
];`;

if (!src.includes(anchor)) {
  console.error(`Anchor text not found in ${FILE}.`);
  process.exit(1);
}

src = src.replace(anchor, replacement);

const backupPath = FILE + ".bak";
fs.writeFileSync(backupPath, original, "utf8");
fs.writeFileSync(FILE, src, "utf8");

console.log(`Red Cross marker inserted into ${FILE}`);
console.log(`Backup saved to: ${backupPath}`);
