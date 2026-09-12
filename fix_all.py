import re

path = "src/translations/index.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix 1: Add legalCheckText to English data block
# Find the English form block that's missing legalCheckText
content = content.replace(
    'legalSummary: "By submitting this report, you confirm that the information provided is true and accurate to the best of your knowledge.",\n        submitBtn: "Submit Incident Report", submitting: "Submitting…",',
    'legalSummary: "By submitting this report, you confirm that the information provided is true and accurate to the best of your knowledge.",\n        legalCheckText: "I confirm that the information I am providing is true and accurate to the best of my knowledge.",\n        submitBtn: "Submit Incident Report", submitting: "Submitting…",'
)

# Fix 2: Remove duplicate form blocks (the ones inserted by the script that duplicate the original)
# Pattern: `      },\n      form: {` followed by another `      form: {` 
# We need to remove the second form block
pattern = re.compile(r'(      \},\n)(      form: \{[^}]*?\n      \},\n)')
matches = list(pattern.finditer(content))

# Find and remove duplicate form blocks
# We need to find blocks where form appears twice in the same report block
# Strategy: find `      },\n      form: {` and check if there's another `      form: {` before it
lines = content.split('\n')
new_lines = []
skip_next_form = False
form_depth = 0
for i, line in enumerate(lines):
    if '      form: {' in line and not skip_next_form:
        # Check if this is a duplicate (there's already a form block before)
        # Look backwards for another form block
        for j in range(max(0, i-50), i):
            if '      form: {' in lines[j] and '      },' in lines[j]:
                # This is a duplicate - skip this form block
                skip_next_form = True
                form_depth = 1
                break
    
    if skip_next_form:
        if '{' in line:
            form_depth += line.count('{')
        if '}' in line:
            form_depth -= line.count('}')
        if form_depth <= 0:
            skip_next_form = False
        continue
    
    new_lines.append(line)

content = '\n'.join(new_lines)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("done")