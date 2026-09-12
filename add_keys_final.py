import re

path = "src/translations/index.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Step 1: Add legalCheckText to all form blocks that are missing it
# Pattern: legalSummary: "...",\n        submitBtn: (no legalCheckText in between)
pattern1 = re.compile(r'(legalSummary:\s*"[^"]*",\s*\n)(\s+submitBtn:)')
count1 = 0
for m in list(pattern1.finditer(content)):
    before = content[:m.start()]
    if 'legalCheckText:' in before[-500:]:
        continue
    content = content[:m.end(1)] + '        legalCheckText: "I confirm that the information I am providing is true and accurate to the best of my knowledge.",\n' + content[m.end(1):]
    count1 += 1
print(f"Added legalCheckText to {count1} form blocks")

# Step 2: Add missing keys (backToDashboard etc.) after success block closing
# Pattern: `      },\n    },` inside a report data block that doesn't have backToDashboard
pattern2 = re.compile(r'(      \},\n)(    \},)')
matches = list(pattern2.finditer(content))
print(f"Found {len(matches)} closing patterns")

add_keys = """      backToDashboard: "Back to Dashboard",
      reportingLiveIncident: "Reporting Live Incident",
      trackMyReport: "Track My Report",
      trackIncidentReport: "Track Incident Report",
      myReportsBtn: "My Reports",
      call: "Call",
      selected: "Selected: {type}",
      acquiringLocation: "Acquiring GPS location — please wait…",
      locationUnavailable: "GPS access denied or timed out",
      searchingGps: "Searching for GPS signal…",
      highAccuracy: "High accuracy",
      mediumAccuracy: "Medium accuracy",
      lowAccuracy: "Low accuracy",
      approximateLocation: "Approximate location (IP-based)",
      moveOutdoors: "Move to an open area for better signal",
      detailedDescription: "Detailed Description",
      photosAccepted: "Photos and videos accepted",
      uploadingEvidence: "Uploading evidence…",
      evidenceUploaded: "Evidence uploaded",
      uploadFailed: "Upload failed","""

count2 = 0
for m in reversed(matches):
    pos = m.start()
    before = content[max(0, pos - 3000):pos]
    if 'heroTitle: "' not in before:
        continue
    if 'backToDashboard:' in before[-2000:]:
        continue
    content = content[:pos] + add_keys + '\n' + content[pos:]
    count2 += 1
    print(f"  Inserted at position {pos}")

print(f"Inserted keys into {count2} blocks")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("done")