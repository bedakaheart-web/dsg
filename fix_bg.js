const fs = require('fs');

['src/citizen/CitizenResources.tsx', 'src/citizen/CitizenDirectory.tsx'].forEach(f => {
  let c = fs.readFileSync(f, 'utf8');

  // Add CSS import if missing
  if (!c.includes('citizenPages.css')) {
    c = c.replace(/^(import )/m, "import './citizenPages.css';\n\nimport ");
  }

  // Add className to first div in return
  c = c.replace(
    /return \(\s*\n(\s*)<div style=\{\{[^}]*minHeight[^}]*\}\}/,
    'return (\n$1<div className="citizen-page"'
  );

  fs.writeFileSync(f, c);
  console.log('Fixed:', f);
});
