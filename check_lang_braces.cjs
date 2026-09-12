const fs = require("fs");
const code = fs.readFileSync("src/translations/index.ts", "utf8");
const lines = code.split("\n");

let depth = 0;
const langStarts = [];
for (let i = 0; i < lines.length; i++) {
  const m = lines[i].match(/^\s*(en|tl|ceb|ko|zh|ja|ru|ar)\s*:/);
  if (m) langStarts.push({ lang: m[1], line: i + 1 });
}

let prevDepth = 0;
let prevLine = 0;
for (const ls of langStarts) {
  let d = 0;
  for (let i = prevLine; i < ls.line - 1; i++) {
    for (const ch of lines[i]) {
      if (ch === "{") d++;
      if (ch === "}") d--;
    }
  }
  const expectedDepth = prevLine === 0 ? 1 : 1; // should be 1 (inside translations, outside lang object)
  console.log(`Before ${ls.lang} (line ${ls.line}): depth=${d}, expected=${expectedDepth}`);
  prevLine = ls.line - 1;
}
