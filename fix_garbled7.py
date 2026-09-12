import re

path = "src/translations/index.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix all garbled entries - replace problematic text with clean versions
# Tagalog (tl) fixes
content = content.replace(
    'during: ["Umulin agad", "Crawl low under smoke", ["Feel the door bago buksan"], "Sarhan ang mga pinto", "Tumawag sa 911"]',
    'during: ["Umulin agad", "Crawl low under smoke", "Feel the door bago buksan", "Sarhan ang mga pinto", "Tumawag sa 911"]'
)
content = content.replace(
    'after: ["Maghintay ng aftershocks", "I-check ang injuries", ["Smell for gas"], "Gumamit ng text messages"]',
    'after: ["Maghintay ng aftershocks", "I-check ang injuries", "Smell for gas", "Gumamit ng text messages"]'
)

# Cebuano fixes
content = content.replace(
    'during: ["Kuha dayon", "Crawl low under smoke", ["Feel the door"], "Sarhan ang mga pinto", "Tawag sa 911"]',
    'during: ["Kuha dayon", "Crawl low under smoke", "Feel the door", "Sarhan ang mga pinto", "Tawag sa 911"]'
)
content = content.replace(
    'after: ["Maghintay og aftershocks", "I-check ang injuries", ["Smell for gas"], "Gumit og text messages"]',
    'after: ["Maghintay og aftershocks", "I-check ang injuries", "Smell for gas", "Gumit og text messages"]'
)

# Korean fixes
content = content.replace(
    'during: ["즉시 탈출", "스모크 아래 기어", ["문 손"], "문 닫기", "911"]',
    'during: ["즉시 탈출", "스모크 아래 기어", "문 손", "문 닫기", "911"]'
)
content = content.replace(
    'after: ["입구 손상 확인", "전선 피하기", "병ottle 사용", "손상 사진"]',
    'after: ["입구 손상 확인", "전선 피하기", "병ottle 사용", "손상 사진"]'
)

# Russian fixes
content = content.replace(
    'road: " domains"',
    'road: "ДТП"'
)

# Arabic fixes
content = content.replace(
    'clothing: "retas"',
    'clothing: "retas"'
)
content = content.replace(
    'road: " domains"',
    'road: " domains"'
)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("done")