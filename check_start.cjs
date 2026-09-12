const fs = require("fs");
const code = fs.readFileSync("src/translations/index.ts", "utf8");
const lines = code.split("\n");

let depth = 0;
for (let i = 0; i < Math.min(lines.length, 500); i++) {
  const line = lines[i];
  const before = depth;
  for (const ch of line) {
    if (ch === "{") depth++;
    if (ch === "}") depth--;
  }
  if (depth !== before) {
    console.log(`Line ${i+1}: depth ${before} -> ${depth} | ${line.trim().substring(0, 60)}`);
  }
}
console.log("Depth at line 500:", depth);
