import re

path = "src/translations/index.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix: },    signup: -> },\n    signup:
content = content.replace("},    signup:", "},\n    signup:")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("done")