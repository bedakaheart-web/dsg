import re

path = "src/translations/index.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Find the exact location of the brace imbalance by scanning line by line
lines = content.split('\n')
depth = 0
for i, line in enumerate(lines):
    depth += line.count('{') - line.count('}')
    if depth < 0:
        print(f"Line {i+1}: depth went negative ({depth})")
        print(f"  Content: {line.strip()[:100]}")
        break

# Check the end of file
print(f"\nFinal depth: {depth}")
print(f"Total lines: {len(lines)}")

# Check the last 10 lines
for i in range(max(0, len(lines)-10), len(lines)):
    print(f"Line {i+1}: {lines[i][:100]}")