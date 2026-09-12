import re

path = "src/translations/index.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Find all top-level language blocks and check their brace balance
# Pattern: en: { ... }, tl: { ... }, etc.
languages = ['en', 'tl', 'ceb', 'ko', 'zh', 'ja', 'ru', 'ar']

for lang in languages:
    # Find the start of this language block
    pattern = rf'\b{lang}:\s*\{{'
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
                    if open_count != close_count:
                        print(f"{lang}: OPEN={open_count}, CLOSE={close_count}, DIFF={open_count - close_count}")
                    break
            i += 1
        else:
            print(f"{lang}: Could not find closing brace")