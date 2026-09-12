import re

path = "src/translations/index.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Find all `    report: {` at 4-space indent
# Then count braces to find the matching close
# Check if it's a data block (has heroTitle: "...")

# Find all positions of `    report: {`
report_starts = []
for m in re.finditer(r'    report: \{', content):
    report_starts.append(m.start())

print(f"Found {len(report_starts)} report blocks")

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
for report_start in report_starts:
    # Check if this is a data block (has heroTitle: "...")
    # Look ahead 500 chars
    lookahead = content[report_start:report_start + 500]
    if 'heroTitle: "' not in lookahead:
        continue  # Skip type definitions
    
    # Find the matching closing brace
    depth = 0
    pos = report_start + len("    report: {")
    in_string = False
    string_char = None
    
    while pos < len(content):
        c = content[pos]
        
        if in_string:
            if c == '\\':
                pos += 2
                continue
            if c == string_char:
                in_string = False
            pos += 1
            continue
        
        if c in '"\'':
            in_string = True
            string_char = c
            pos += 1
            continue
        
        if c == '{':
            depth += 1
        elif c == '}':
            if depth == 0:
                # Found the closing brace for report
                # Check if followed by `,` and newline
                if pos + 1 < len(content) and content[pos + 1] == ',':
                    report_end = pos + 2  # after `},`
                    break
            depth -= 1
        
        pos += 1
    
    if pos >= len(content):
        continue
    
    # Get the report block text
    report_block = content[report_start:report_end]
    
    # Check if backToDashboard already exists
    if 'backToDashboard:' in report_block:
        continue
    
    # Find the position of `      },\n    },` (success block closing, then report block closing)
    # We want to insert before the report block's closing `    },`
    # The success block closes with `      },` then report closes with `    },`
    
    # Find the last `      },\n    },` in the report block
    closing_pattern = re.compile(r'(      \},\n)(    \},)')
    closing_match = closing_pattern.search(report_block)
    
    if closing_match:
        insert_pos = report_start + closing_match.start(1)
        content = content[:insert_pos] + add_keys + '\n' + content[insert_pos:]
        inserted += 1
        print(f"  Inserted at position {insert_pos}")

print(f"Inserted into {inserted} blocks")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("done")