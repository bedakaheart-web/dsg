const fs = require('fs');

const FILE = process.argv[2] || 'src/pages/Report.tsx';

const oldBlock = `<span className="rp-check-text">I understand that submitting <strong>false, misleading, or malicious reports</strong> is punishable under the <strong>Cybercrime Prevention Act of 2012 (RA 10175)</strong>, the <strong>Penal Code</strong>, and other applicable Philippine laws. Penalties may include fines and imprisonment. All reports are logged and may be investigated by authorities.</span>`;

const newBlock = `<span
                      className="rp-check-text"
                      dangerouslySetInnerHTML={{ __html: t("report.form.legalCheckText") }}
                    />`;

let src = fs.readFileSync(FILE, 'utf8');

if (!src.includes(oldBlock)) {
  console.log('SKIP: old hardcoded span not found verbatim.');
  console.log('This can happen if whitespace/quotes differ slightly from what I expect.');
  console.log('Search your file manually for: rp-check-text');
  process.exit(1);
}

src = src.replace(oldBlock, newBlock);
fs.writeFileSync(FILE, src, 'utf8');
console.log('Replaced hardcoded legal text span with t("report.form.legalCheckText") call.');
