import re

path = "src/translations/index.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix: Find `    },\n      },\n    dashboard:` 
# which should be `      },\n    },\n    dashboard:`
# The success block should close with 6 spaces, then report closes with 4 spaces

# Pattern: 4-space closing brace, then 6-space closing brace, then dashboard
pattern = re.compile(r'(    \},\n)(      \},\n)(    dashboard: \{)')
matches = list(pattern.finditer(content))

fixed = 0
for m in reversed(matches):
    content = content[:m.start()] + '      },\n    },\n' + content[m.start() + len(m.group(1)) + len(m.group(2)):]
    fixed += 1

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Fixed {fixed} double closing braces")