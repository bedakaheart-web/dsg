import re

path = "src/translations/index.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Find the exact location of the brace imbalance by scanning line by line
lines = content.split('\n')
depth = 0
max_depth = 0
for i, line in enumerate(lines):
    depth += line.count('{') - line.count('}')
    if depth > max_depth:
        max_depth = depth

print(f"Final depth: {depth}")
print(f"Max depth: {max_depth}")
print(f"Total lines: {len(lines)}")

# Check the last 5 lines
for i in range(max(0, len(lines)-5), len(lines)):
    try:
        print(f"Line {i+1}: {lines[i][:100]}")
    except:
        print(f"Line {i+1}: [encoding error]")