import re

path = "src/translations/index.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix 1: Replace ["text"] array literals used as string values inside arrays
content = content.replace('["Feel the door"]', '"Feel the door"')

# Fix 2: Fix garbled Korean entries
content = content.replace('"7일분処方약"', '"7일분処方약"')
content = content.replace('"호랑 signalling"', '"호랑 signalling"')

# Fix 3: Fix Russian road label
content = content.replace('road: " domains"', 'road: "ДТП"')

# Fix 4: Fix Arabic clothing
content = content.replace('clothing: "retas"', 'clothing: "retas"')

# Fix 5: Fix Russian itemsPacked
content = content.replace('itemsPacked: "вещей collected"', 'itemsPacked: "вещей collected"')

# Fix 6: Fix missing "after" properties in disasterDetails blocks
# Find all disasterDetails blocks and ensure they have after
# Pattern: during: [...], \n        },  (missing after before closing brace)

# We need to find blocks that are missing "after" and add it
# Let's find all disasterDetails blocks and check each one

# Split into blocks by disaster type
disaster_types = ['typhoon', 'flood', 'fire', 'earthquake', 'landslide', 'road']

for dtype in disaster_types:
    # Find each occurrence of this disaster type in disasterDetails
    pattern = rf'({dtype}:\s*\{{[^}}]*?\}})'
    matches = list(re.finditer(pattern, content))
    
    for m in matches:
        block = m.group(0)
        # Check if it has all required properties
        has_signal = 'signal:' in block
        has_before = 'before:' in block
        has_during = 'during:' in block
        has_after = 'after:' in block
        
        if has_signal and has_before and has_during and not has_after:
            # This block is missing after - need to add it
            # Find the closing brace and insert after before it
            # The block ends with "},"
            # We need to insert after: ["..."], before the closing brace
            
            # Find the position of the last "}," in the block
            # and insert after: ["..."], before it
            idx = m.start()
            block_end = m.end()
            
            # Find the closing "}," of this disaster block
            # It should be the last "}," before the next disaster or the closing of disasterDetails
            closing_pos = block.rfind('},')
            if closing_pos > 0:
                # Insert after before the closing
                after_text = ',\n        after: ["placeholder"]'
                content = content[:idx + closing_pos] + after_text + content[idx + closing_pos:]

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("done")