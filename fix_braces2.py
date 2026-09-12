import re

path = "src/translations/index.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix: Find patterns like `      },\n      },\n    dashboard:` 
# which should be `      },\n    },\n    dashboard:`
# i.e., the success block closing brace is wrong indentation

# Pattern: 6-space closing brace followed by 6-space closing brace followed by dashboard
pattern = re.compile(r'(      \},\n)(      \},\n)(    dashboard: \{)')
matches = list(pattern.finditer(content))

fixed = 0
for m in reversed(matches):
    content = content[:m.start()] + '      },\n    },\n' + content[m.start() + len(m.group(1)) + len(m.group(2)):]
    fixed += 1

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Fixed {fixed} double closing braces")