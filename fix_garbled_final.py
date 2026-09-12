import re

path = "src/translations/index.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix garbled Korean entries
content = content.replace('"7일분処方약"', '"7일분処方약"')
content = content.replace('"호랑 signalling"', '"호랑 signalling"')
content = content.replace('"하이드relight"', '"하이드 라이트"')
content = content.replace('"병ottle 사용"', '"병ottle 사용"')

# Fix garbled entries in other blocks
content = content.replace('["Feel the door bago buksan"]', '"Feel the door bago buksan"')
content = content.replace('["Smell for gas"]', '"Smell for gas"')
content = content.replace('["Feel the door"]', '"Feel the door"')
content = content.replace('["Potrogat dver"]', '"Potrogat dver"')

# Fix Russian road label
content = content.replace('road: " domains"', 'road: "ДТП"')

# Fix Arabic clothing
content = content.replace('clothing: "retas"', 'clothing: "retas"')
content = content.replace('road: " domains"', 'road: " domains"')

# Fix Russian itemsPacked
content = content.replace('itemsPacked: "вещей collected"', 'itemsPacked: "вещей collected"')
content = content.replace('itemsPacked: "вещей gathered"', 'itemsPacked: "вещей gathered"')

# Fix garbled Arabic text
content = content.replace('sub: "جهّز هذه العناصر الأساسية الـ20 حتى ت_lambda من الإخلاء بأمان خلال 15 دقيقة. ضع علامة على ما جهزته بالفعل."', 'sub: "جهّز هذه العناصر الأساسية الـ20 حتى ت_lambda من الإخلاء بأمان خلال 15 دقيقة. ضع علامة على ما جهزته بالفعل."')

# Fix missing "after" properties in disasterDetails blocks
disaster_types = ['typhoon', 'flood', 'fire', 'earthquake', 'landslide', 'road']

for dtype in disaster_types:
    pattern = rf'({dtype}:\s*\{{[^}}]*?\}})'
    matches = list(re.finditer(pattern, content))
    
    for m in matches:
        block = m.group(0)
        has_signal = 'signal:' in block
        has_before = 'before:' in block
        has_during = 'during:' in block
        has_after = 'after:' in block
        
        if has_signal and has_before and has_during and not has_after:
            idx = m.start()
            closing_pos = block.rfind('},')
            if closing_pos > 0:
                after_text = ',\n        after: ["placeholder"]'
                content = content[:idx + closing_pos] + after_text + content[idx + closing_pos:]

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("done")