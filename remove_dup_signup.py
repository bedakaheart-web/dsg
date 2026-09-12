#!/usr/bin/env python3
"""Remove auto-generated signup blocks that were inserted inside report objects."""

import re

PATH = r"C:\Users\User\Documents\dumasafe-guide\dumasafeguide\src\translations\index.ts"

with open(PATH, "r", encoding="utf-8") as f:
    src = f.read()

# Remove all signup blocks that contain language prefixes (EN, TL, CEB, KO, ZH, JA, RU, AR)
# These are the auto-generated ones that ended up inside report objects.
# Pattern: `      signup: {` ... `      },` with prefix strings
prefixes = ["EN", "TL", "CEB", "KO", "ZH", "JA", "RU", "AR"]

for prefix in prefixes:
    # Match a signup block that contains the prefix
    pattern = re.compile(
        r'      signup: \{\n(?:        \w+: "[^"]*"\n|        \w+: \{[^}]*\}\n|      \},\n)*      \},',
        re.MULTILINE
    )
    # This is too broad. Let's use a different approach.
    # Find each `      signup: {` and check if it contains the prefix
    pass

# Simpler: find all `      signup: {` blocks and remove those that contain a prefix
def remove_prefixed_signup_blocks(src):
    result = []
    i = 0
    while i < len(src):
        # Find next `      signup: {`
        idx = src.find('      signup: {', i)
        if idx == -1:
            result.append(src[i:])
            break
        
        # Add everything before this signup block
        result.append(src[i:idx])
        
        # Find the end of this signup block
        # It ends with `      },` at the same indent level
        # We need to find the matching `      },`
        depth = 1
        j = idx + len('      signup: {')
        while j < len(src) and depth > 0:
            if src[j:j+2] == '{':
                depth += 1
            elif src[j:j+2] == '}':
                depth -= 1
                if depth == 0:
                    # Found the closing brace
                    # Find the `      },` after it
                    k = j + 1
                    while k < len(src) and src[k] in ' \n':
                        k += 1
                    if src[k:k+2] == '},':
                        j = k + 2
                    break
            j += 1
        
        block = src[idx:j]
        
        # Check if this block contains a language prefix
        has_prefix = False
        for pfx in prefixes:
            if f'"{pfx} ' in block:
                has_prefix = True
                break
        
        if has_prefix:
            # Skip this block (remove it)
            print(f"Removing prefixed signup block at {idx}")
            i = j
        else:
            # Keep this block
            result.append(block)
            i = j
    
    return ''.join(result)

new_src = remove_prefixed_signup_blocks(src)

with open(PATH, "w", encoding="utf-8") as f:
    f.write(new_src)

print("Done. Removed prefixed signup blocks.")