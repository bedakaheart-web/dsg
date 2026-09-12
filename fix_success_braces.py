import re

path = "src/translations/index.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix: Find `      backToDashboard:` that appears right after `      },` (missing success closing brace)
# Pattern: `      },\n      backToDashboard:` should be `      },\n    },\n      backToDashboard:`
# i.e., the success block is missing its closing brace

# Find all occurrences where backToDashboard follows a `      },` without the success block closing
# This means the success block was not properly closed
pattern = re.compile(r'(      \},\n)(      backToDashboard:)')
matches = list(pattern.finditer(content))

fixed = 0
for m in reversed(matches):
    content = content[:m.start()] + '      },\n    },\n' + content[m.start() + len(m.group(1)):]
    fixed += 1

print(f"Fixed {fixed} missing success closing braces")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("done")