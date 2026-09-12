import re

path = "src/translations/index.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Find all safetyTips blocks that are missing disasterDetails and goBagItems
# Pattern: after "categories: { ... }," and before "    },"
# We need to insert disasterDetails and goBagItems before the closing "    },"

# Find all safetyTips blocks and check if they have disasterDetails
# by finding the pattern: "categories: { ... }," followed by "    },"

# Let me find all safetyTips blocks and fix them one by one
# by finding the closing "    }," after "categories:"

# Find all positions of "categories: {" that are inside safetyTips
pattern = r'(safetyTips:\s*\{[^}]*?categories:\s*\{[^}]*?\},?\s*\n)(\s+\},)'
matches = list(re.finditer(pattern, content, re.DOTALL))

for m in matches:
    block = m.group(0)
    if 'disasterDetails:' not in block:
        # This block is missing disasterDetails
        # Insert before the closing "},"
        idx = m.start()
        block_end = m.end()
        
        # Find the closing "}," position
        closing_pos = block.rfind('},')
        if closing_pos > 0:
            # Insert disasterDetails and goBagItems before the closing
            insert_text = '''
      disasterDetails: {
        typhoon: { signal: "", before: [], during: [], after: [] },
        flood: { signal: "", before: [], during: [], after: [] },
        fire: { signal: "", before: [], during: [], after: [] },
        earthquake: { signal: "", before: [], during: [], after: [] },
        landslide: { signal: "", before: [], during: [], after: [] },
        road: { signal: "", before: [], during: [], after: [] },
      },
      goBagItems: [],'''
            content = content[:idx + closing_pos] + insert_text + content[idx + closing_pos:]

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("done")