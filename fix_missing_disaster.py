import re

path = "src/translations/index.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix 1: Add disasterDetails and goBagItems to safetyTips blocks that are missing them
# Pattern: after "categories: { ... }," and before "    },"
# We need to insert disasterDetails and goBagItems before the closing "    },"

# Find all safetyTips blocks that don't have disasterDetails
# Pattern: safetyTips: { ... categories: { ... }, \n    },
# We need to insert before the closing "    },"

# Let me find all safetyTips blocks and check if they have disasterDetails
# by finding the pattern: "categories: { ... }," followed by "    },"

lines = content.split('\n')
result = []
i = 0
while i < len(lines):
    line = lines[i]
    result.append(line)
    
    # Check if this line ends a categories block inside safetyTips
    # Pattern: "      categories: { ... }," followed by "    },"
    if re.match(r'^\s+categories:\s*\{.*\},?\s*$', line) and i+1 < len(lines) and re.match(r'^\s+\},?\s*$', lines[i+1]):
        # Check if we're inside a safetyTips block that's missing disasterDetails
        # Look backwards for "safetyTips:" and check if disasterDetails is present
        context_start = max(0, i-50)
        context = '\n'.join(lines[context_start:i+1])
        if 'safetyTips:' in context and 'disasterDetails:' not in context:
            # This safetyTips block is missing disasterDetails
            # Add disasterDetails and goBagItems before the closing "},"
            # But we need to be careful - the next line is "    }," which closes safetyTips
            # We need to insert before that line
            pass  # We'll handle this differently
    
    i += 1

# Let me try a simpler approach: find each language block's safetyTips section
# and add the missing fields

# Actually, let's just find all safetyTips blocks and fix them one by one
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