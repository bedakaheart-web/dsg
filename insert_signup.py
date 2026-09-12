#!/usr/bin/env python3
"""Insert signup blocks at the correct positions for each non-English language."""

import re

PATH = r"C:\Users\User\Documents\dumasafe-guide\dumasafeguide\src\translations\index.ts"

with open(PATH, "r", encoding="utf-8") as f:
    src = f.read()

langs = ["tl", "ceb", "ko", "zh", "ja", "ru", "ar"]

def make_signup_block(prefix):
    return f"""
      signup: {{
        mobileBadge: "{prefix} signup mobile badge",
        eyebrow: "{prefix} signup eyebrow",
        heroLine1: "{prefix} signup hero line 1",
        heroAccent1: "{prefix} signup hero accent 1",
        heroAccent2: "{prefix} signup hero accent 2",
        heroDesc: "{prefix} signup hero desc",
        steps: {{
          create: {{ title: "{prefix} create title", desc: "{prefix} create desc" }},
          access: {{ title: "{prefix} access title", desc: "{prefix} access desc" }},
          report: {{ title: "{prefix} report title", desc: "{prefix} report desc" }},
        }},
        certBold: "{prefix} cert bold",
        certRest: "{prefix} cert rest",
        errors: {{
          missingFields: "{prefix} missing fields",
          invalidEmail: "{prefix} invalid email",
          disposableEmail: "{prefix} disposable email",
          passwordMismatch: "{prefix} password mismatch",
          passwordTooShort: "{prefix} password too short",
          needCaptcha: "{prefix} need captcha",
          unexpected: "{prefix} unexpected",
        }},
        success: {{
          title: "{prefix} success title",
          msgIntro: "{prefix} msg intro",
          msgBody: "{prefix} msg body",
          note: "{prefix} note",
          goToSignIn: "{prefix} go to sign in",
        }},
        backToHome: "{prefix} back to home",
        formTitle: "{prefix} form title",
        formSub: "{prefix} form sub",
        labels: {{
          firstName: "{prefix} first name",
          lastName: "{prefix} last name",
          barangay: "{prefix} barangay",
          phone: "{prefix} phone",
          email: "{prefix} email",
          password: "{prefix} password",
          confirmPassword: "{prefix} confirm password",
        }},
        placeholders: {{
          firstName: "{prefix} first name",
          lastName: "{prefix} last name",
          selectLocation: "{prefix} select location",
          phone: "{prefix} phone",
        }},
        emailInvalid: "{prefix} email invalid",
        emailHint: "{prefix} email hint",
        pwHint: "{prefix} pw hint",
        submitting: "{prefix} submitting",
        submitBtn: "{prefix} submit btn",
        footerHaveAccount: "{prefix} footer have account",
        footerSignIn: "{prefix} footer sign in",
      }},
"""

# Process from last to first to keep offsets valid
new_src = src
for lang in reversed(langs):
    # Find the language block
    lang_pattern = re.compile(r'  ' + re.escape(lang) + r': \{')
    m = lang_pattern.search(new_src)
    if not m:
        print(f"Could not find language block for {lang}")
        continue
    
    lang_start = m.end()
    
    # Find the next language block
    next_lang = None
    for l2 in langs + ["en"]:
        if l2 == lang:
            continue
        m2 = re.search(r'  ' + re.escape(l2) + r': \{', new_src[lang_start:])
        if m2:
            next_lang = lang_start + m2.start()
            break
    
    if next_lang is None:
        next_lang = len(new_src)
    
    section = new_src[lang_start:next_lang]
    
    # Find report block
    report_m = re.search(r'    report: \{', section)
    if not report_m:
        print(f"Could not find report block for {lang}")
        continue
    
    report_start = report_m.start()
    
    # Find the end of the report block by tracking braces
    depth = 0
    i = report_start + len('    report: {')
    while i < len(section):
        if section[i] == '{':
            depth += 1
        elif section[i] == '}':
            if depth == 0:
                # Found closing brace
                # The closing brace is at position i in the section
                # The absolute position in the file is lang_start + i
                abs_i = lang_start + i
                
                # Insert signup right after the closing brace
                block = make_signup_block(lang)
                new_src = new_src[:abs_i + 1] + block + new_src[abs_i + 1:]
                
                print(f"Added signup to {lang} at position {abs_i + 1}")
                break
            depth -= 1
        i += 1
    else:
        print(f"Could not find report close for {lang}")

with open(PATH, "w", encoding="utf-8") as f:
    f.write(new_src)

print("Done.")