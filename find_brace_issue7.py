import re

path = "src/translations/index.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Find the exact location of the brace imbalance by scanning line by line
lines = content.split('\n')
depth = 0
for i, line in enumerate(lines):
    depth += line.count('{') - line.count('}')
    if depth > 10:
        print(f"Line {i+1}: depth went high ({depth})")
        print(f"  Content: {line.strip()[:100]}")
        break

print(f"\nFinal depth: {depth}")
print(f"Total lines: {len(lines)}")

# Check the last 5 lines
for i in range(max(0, len(lines)-5), len(lines)):
    try:
        print(f"Line {i+1}: {lines[i][:100]}")
    except:
        print(f"Line {i+1}: [encoding error]")