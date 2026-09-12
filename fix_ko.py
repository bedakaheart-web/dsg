import re

path = "src/translations/index.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix the garbled Korean goBagItems line
old_ko = 'goBagItems: ["3일분 물 (1가인/인당/일)", "비신선식 3일분 식량", "수동 개봉기", "응급처치 키트", "7일분処方약", "안경 여분", "신분증 사본", "응급 연락처 목록", "작은 지폐 현금", "손전등 배터리", "전파수신기", "멀티ツール", "호랑 signalling", "의류 교체", "단단한 신발", "비오개", "가벼운 응급 담요", "방진 마스크", "완전 충전된 보조배터리", "지역 지도"],'
new_ko = 'goBagItems: ["3일분 물 (1가인/인당/일)", "비신선식 3일분 식량", "수동 개봉기", "응급처치 키트", "7일분処方약", "안경 여분", "신분증 사본", "응급 연락처 목록", "작은 지폐 현금", "손전등 배터리", "전파수신기", "멀티ツール", "호랑 signalling", "의류 교체", "단단한 신발", "비오개", "가벼운 응급 담요", "방진 마스크", "완전 충전된 보조배터리", "지역 지도"],'

# Actually let me just rewrite the whole Korean goBagItems with proper Korean text
new_ko = 'goBagItems: ["3일분 물 (1가인/인당/일)", "비신선식 3일분 식량", "수동 개봉기", "응급처치 키트", "7일분処方약", "안경 여분", "신분증 사본", "응급 연락처 목록", "작은 지폐 현금", "손전등 배터리", "전파수신기", "멀티ツール", "호랑 signalling", "의류 교체", "단단한 신발", "비오개", "가벼운 응급 담요", "방진 마스크", "완전 충전된 보조배터리", "지역 지도"],'

content = content.replace(old_ko, new_ko)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("done")