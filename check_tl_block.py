import re

path = "src/translations/index.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Find the Tagalog block
pattern = r'\btl:\s*\{'
match = re.search(pattern, content)
if match:
    start = match.start()
    # Find the matching closing brace by counting
    depth = 0
    i = start
    while i < len(content):
        if content[i] == '{':
            depth += 1
        elif content[i] == '}':
            depth -= 1
            if depth == 0:
                end = i + 1
                block = content[start:end]
                open_count = block.count('{')
                close_count = block.count('}')
                print(f"tl block: chars={len(block)}, OPEN={open_count}, CLOSE={close_count}")
                break
        i += 1
    else:
        print("tl: Could not find closing brace")
        # Let's find where it goes wrong
        depth = 0
        i = start
        while i < len(content):
            if content[i] == '{':
                depth += 1
            elif content[i] == '}':
                depth -= 1
            if depth < 0:
                print(f"  Depth went negative at char {i}")
                print(f"  Context: ...{content[max(0,i-50):i+50]}...")
                break
            i += 1