const fs = require("fs");
const code = fs.readFileSync("src/translations/index.ts", "utf8");
const lines = code.split("\n");

const langStarts = [];
for (let i = 0; i < lines.length; i++) {
  const m = lines[i].match(/^\s*(en|tl|ceb|ko|zh|ja|ru|ar)\s*:/);
  if (m) langStarts.push({ lang: m[1], line: i + 1 });
}

let prevLine = 0;
for (const ls of langStarts) {
  let d = 0;
  const changes = [];
  for (let i = prevLine; i < ls.line - 1; i++) {
    const before = d;
    for (const ch of lines[i]) {
      if (ch === "{") d++;
      if (ch === "}") d--;
    }
    if (d !== before) {
      changes.push(`  Line ${i+1}: ${d-before>0?"+":""}${d-before} → ${d} | ${lines[i].trim().substring(0,50)}`);
    }
  }
  console.log(`\nBefore ${ls.lang} (line ${ls.line}): final depth=${d}`);
  for (const c of changes.slice(-10)) console.log(c);
  prevLine = ls.line - 1;
}
