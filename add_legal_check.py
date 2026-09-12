import re

path = "src/translations/index.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Find all occurrences of legalSummary lines that are NOT followed by legalCheckText
# Pattern: legalSummary: "...", followed by submitBtn (no legalCheckText in between)
pattern = r'(legalSummary:\s*"[^"]*",\s*\n)(\s+submitBtn:)'
matches = list(re.finditer(pattern, content))

# Legal check text translations for each language
translations = {
    "en": "I confirm that the information I am providing is true and accurate to the best of my knowledge.",
    "tl": "Kinookumpirma ko na ang impormasyong ibinibigay ay totoo at wasto sa aking kaalaman.",
    "ceb": "Gikumpirma nako nga ang impormasyon nga gihatag tinuod ug tukma base sa akong nahibaloan.",
    "ko": "제공하는 정보가 저가 아는 한 사실이고 정확함을 확인합니다.",
    "zh": "我确认所提供的信息据我所知真实准确。",
    "ja": "提供した情報が知る限り真実かつ正確であることを確認します。",
    "ru": "Я подtvierzhdaju, что предоставленная информация является правдивой и точной, насколько мне известно.",
    "ar": "أنا أconfirm أن المعلومات التي قدمتها صحيحة ودقيقة على حد علمي.",
}

# We need to know which language block each match is in
# Let's find the language code before each match
lang_codes = ["en", "tl", "ceb", "ko", "zh", "ja", "ru", "ar"]
lang_positions = []
for code in lang_codes:
    # Find the data block start: `code: {` at top level (4-space indent)
    for m in re.finditer(r'\n(    ' + code + r': \{)', content):
        lang_positions.append((m.start(), code))

lang_positions.sort()

def get_lang_for_pos(pos):
    current = "en"
    for lp, code in lang_positions:
        if lp <= pos:
            current = code
        else:
            break
    return current

inserted = 0
for m in reversed(matches):
    lang = get_lang_for_pos(m.start())
    check_text = translations.get(lang, translations["en"])
    
    # Insert legalCheckText between legalSummary and submitBtn
    insert_pos = m.end(1)  # After the legalSummary line
    insert_text = f'        legalCheckText: "{check_text}",\n'
    content = content[:insert_pos] + insert_text + content[insert_pos:]
    inserted += 1

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Inserted legalCheckText into {inserted} blocks")