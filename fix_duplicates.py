import re

path = "src/translations/index.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix: Remove duplicate form blocks
# Pattern: find `      },\n      form: {` and check if there's already a `      form: {` before it
# If so, remove the second form block

lines = content.split('\n')
new_lines = []
i = 0
while i < len(lines):
    line = lines[i]
    
    # Check if this is a duplicate form block
    if '      form: {' in line:
        # Look backwards for another form block
        found_form = False
        for j in range(max(0, i-50), i):
            if '      form: {' in lines[j]:
                found_form = True
                break
        
        if found_form:
            # Skip this form block
            depth = 0
            while i < len(lines):
                l = lines[i]
                depth += l.count('{')
                depth -= l.count('}')
                i += 1
                if depth <= 0:
                    break
            continue
    
    new_lines.append(line)
    i += 1

content = '\n'.join(new_lines)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("done")