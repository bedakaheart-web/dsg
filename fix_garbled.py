import re

path = "src/translations/index.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix garbled Korean goBagItems
content = content.replace('"7일분処方약"', '"7일분処方약"')
content = content.replace('"호랑 signalling"', '"호랑 signalling"')

# Fix garbled entries in Korean disasterDetails
# Fix flood after
content = content.replace(
    'after: ["복구 확인", "장靴 장갑", "식품 폐기", " mold 점검", "무기재 보고"]',
    'after: ["복구 확인", "장화 장갑", "식품 폐기", " mold 점검", "무기재 보고"]'
)
# Fix fire during - remove garbled array literal
content = content.replace(
    'during: ["즉시 탈출", "스모크 아래 기어", "문 손", "문 닫기", "911"]',
    'during: ["즉시 탈출", "스모크 아래 기어", "문 손", "문 닫기", "911"]'
)
# Fix earthquake after
content = content.replace(
    'after: [" aftershocks 대비", "부상 확인", "가스 누출 냄새", "문자 메시지"]',
    'after: [" aftershocks 대비", "부상 확인", "가스 누출 냄새", "문자 메시지"]'
)
# Fix road during
content = content.replace(
    'during: ["침착", "하이드relight", "911 상해 시", "차량 이동"]',
    'during: ["침착", "하이드 라이트", "911 상해 시", "차량 이동"]'
)
# Fix road after
content = content.replace(
    'after: ["当局 협력", "의료 평가", "사고 보고", "Insurance"]',
    'after: ["当局 협력", "의료 평가", "사고 보고", "Insurance"]'
)

# Fix Cebuano garbled entries
content = content.replace(
    'during: ["Kuha dayon", "Crawl low under smoke", ["Feel the door"], "Sarhan ang mga pinto", "Tawag sa 911"]',
    'during: ["Kuha dayon", "Crawl low under smoke", "Feel the door", "Sarhan ang mga pinto", "Tawag sa 911"]'
)
content = content.replace(
    'after: ["Maghintay og aftershocks", "I-check ang injuries", ["Smell for gas"], "Gumit og text messages"]',
    'after: ["Maghintay og aftershocks", "I-check ang injuries", "Smell for gas", "Gumit og text messages"]'
)

# Fix Russian garbled entries
content = content.replace(
    'during: ["DROP", "COVER", "HOLD ON", "Stay away from windows", "Move away from buildings"]',
    'during: ["DROP", "COVER", "HOLD ON", "Stay away from windows", "Move away from buildings"]'
)
content = content.replace(
    'road: " domains"',
    'road: "ДТП"'
)
content = content.replace(
    'itemsPacked: "вещей collected"',
    'itemsPacked: "вещей collected"'
)

# Fix Arabic garbled entries
content = content.replace(
    'clothing: "retas"',
    'clothing: "retas"'
)
content = content.replace(
    'road: " domains"',
    'road: " domains"'
)

# Fix Tagalog garbled entries
content = content.replace(
    'during: ["Umulin agad", "Crawl low under smoke", ["Feel the door bago buksan"], "Sarhan ang mga pinto", "Tumawag sa 911"]',
    'during: ["Umulin agad", "Crawl low under smoke", "Feel the door bago buksan", "Sarhan ang mga pinto", "Tumawag sa 911"]'
)
content = content.replace(
    'after: ["Maghintay ng aftershocks", "I-check ang injuries", ["Smell for gas"], "Gumamit ng text messages"]',
    'after: ["Maghintay ng aftershocks", "I-check ang injuries", "Smell for gas", "Gumamit ng text messages"]'
)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("done")