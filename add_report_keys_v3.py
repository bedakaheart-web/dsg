import re

path = "src/translations/index.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Find all `    report: {` data blocks (not type definitions)
# Data blocks have heroTitle: "..." (with quotes), type definitions have heroTitle: string
# We need to find each data block and add missing keys before its closing `    },`

# Strategy: find each `    report: {` at 4-space indent
# Then find the closing `    },` at 4-space indent
# Check if it's a data block (has heroTitle: "...")

# Find all report data blocks
pattern = re.compile(r'(    report: \{.*?heroTitle: "[^"]*".*?\n    \},)', re.DOTALL)
matches = list(pattern.finditer(content))

print(f"Found {len(matches)} report data blocks")

# Keys to add (English as fallback for non-English blocks)
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
for m in matches:
    block_text = m.group(1)
    block_start = m.start()
    block_end = m.end()
    
    # Check if this block already has backToDashboard
    if 'backToDashboard:' in block_text:
        continue
    
    # Find the position of `      },\n    },` (success block closing, then report block closing)
    # We want to insert before the report block's closing `    },`
    # The success block closes with `      },` then report closes with `    },`
    
    # Find the last `      },\n    },` in the block
    closing_pattern = re.compile(r'(      \},\n)(    \},)')
    closing_match = closing_pattern.search(block_text)
    
    if closing_match:
        insert_pos = block_start + closing_match.start(1)
        content = content[:insert_pos] + add_keys + '\n' + content[insert_pos:]
        inserted += 1
        print(f"  Inserted at position {insert_pos}")

print(f"Inserted into {inserted} blocks")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("done")