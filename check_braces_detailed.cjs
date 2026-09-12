const fs = require("fs");
const code = fs.readFileSync("src/translations/index.ts", "utf8");
const lines = code.split("\n");

let depth = 0;
const depthAtLine = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const before = depth;
  for (const ch of line) {
    if (ch === "{") depth++;
    if (ch === "}") depth--;
  }
  depthAtLine.push({ line: i + 1, before, after: depth, text: line.trim() });
}

// Find lines where depth goes negative or where we have unclosed braces at the end
console.log("Lines with depth changes:");
for (const d of depthAtLine) {
  if (d.before !== d.after) {
    console.log(`Line ${d.line}: depth ${d.before} -> ${d.after} | ${d.text.substring(0, 60)}`);
  }
}

console.log("\nFinal depth:", depth);
