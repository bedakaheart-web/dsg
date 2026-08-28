import sys
import shutil

FILE = "src/pages/Signup.tsx"

with open(FILE, "r", encoding="utf-8") as f:
    content = f.read()

original = content

old_state = '''  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState("");
  const [success,       setSuccess]       = useState(false);
  const [captchaToken,  setCaptchaToken]  = useState("");'''

new_state = '''  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState("");
  const [success,       setSuccess]       = useState(false);
  const [captchaToken,  setCaptchaToken]  = useState("");
  const [emailTouched,  setEmailTouched]  = useState(false);'''

if old_state not in content:
    print("ERROR: Edit 1 anchor not found. No changes made to state block.")
    sys.exit(1)
content = content.replace(old_state, new_state, 1)

old_field = '''              <div className="su-field">
                <label className="su-label">Email Address</label>
                <div className="su-input-wrap">
                  <span className="su-field-icon"><IconMail /></span>
                  <input className="su-input" name="email" type="email"
                    placeholder="name@example.com"
                    value={formData.email} onChange={handleChange} />
                </div>
              </div>'''

new_field = '''              <div className="su-field">
                <label className="su-label">Email Address</label>
                <div className="su-input-wrap">
                  <span className="su-field-icon"><IconMail /></span>
                  <input className="su-input" name="email" type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={() => setEmailTouched(true)} />
                </div>
                {emailTouched && formData.email && !isValidEmailFormat(formData.email) && (
                  <p style={{ fontSize: 11.5, marginTop: 6, color: "#ff8877" }}>
                    Please enter a valid email address.
                  </p>
                )}
                {!(emailTouched && formData.email && !isValidEmailFormat(formData.email)) && (
                  <p style={{ fontSize: 11, marginTop: 6, color: "rgba(168,216,255,0.35)" }}>
                    Use an email you can check — we'll send a confirmation link before you can sign in.
                  </p>
                )}
              </div>'''

if old_field not in content:
    print("ERROR: Edit 2 anchor not found. No changes made to email field block.")
    sys.exit(1)
content = content.replace(old_field, new_field, 1)

if content == original:
    print("No changes were made.")
    sys.exit(1)

shutil.copy(FILE, FILE + ".bak")
with open(FILE, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Success. Backup saved to {FILE}.bak")
print("Both edits applied.")
