import re

path = "src/translations/index.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Find all `      },\n    },` patterns that are inside a report data block
# and don't have backToDashboard before them
pattern = re.compile(r'(      \},\n)(    \},)')
matches = list(pattern.finditer(content))
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
      uploadFailed: "Upload failed",
      form: {
        fullName: "Full Name", optional: "(Optional)", contactNumber: "Contact Number",
        detectedLocation: "Detected Location", refreshGps: "📍 Refresh GPS", verifyMaps: "Verify on Maps →",
        descriptionPlaceholder: "Describe what happened — include time, number of people involved, severity, and any other relevant details…",
        uploadHint: "Click to select or drag & drop",
        legalTitle: "Legal Acknowledgment",
        legalSummary: "By submitting this report, you confirm that the information provided is true and accurate to the best of your knowledge.",
        legalCheckText: "I confirm that the information I am providing is true and accurate to the best of my knowledge.",
        submitBtn: "Submit Incident Report", submitting: "Submitting…",
      },"""

inserted = 0
for m in reversed(matches):
    pos = m.start()
    before = content[max(0, pos - 3000):pos]
    if 'heroTitle: "' not in before:
        continue
    if 'backToDashboard:' in before[-2000:]:
        continue
    content = content[:pos] + add_keys + '\n' + content[pos:]
    inserted += 1
    print(f"  Inserted at position {pos}")

print(f"Inserted into {inserted} blocks")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("done")