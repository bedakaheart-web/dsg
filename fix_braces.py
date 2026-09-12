import re

path = "src/translations/index.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix: Find `      },\n    dashboard: {` and add `    },\n` before dashboard
# This happens when the report block's closing brace is missing
pattern = re.compile(r'(      },\n)(    dashboard: \{)')
matches = list(pattern.finditer(content))

fixed = 0
for m in reversed(matches):
    content = content[:m.start()] + '    },\n' + content[m.start():]
    fixed += 1

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Fixed {fixed} missing closing braces")