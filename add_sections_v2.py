import re

path = "src/translations/index.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

sections_data = """    dashboard: {
      statTotalFiled: "Total Filed", statPending: "Pending", statInProgress: "In Progress", statResolved: "Resolved",
      quickActionFileReport: "File Report", quickActionSafetyMap: "Safety Map", quickActionMyReports: "My Reports", quickActionSafetyTips: "Safety Tips",
      sidebarPortal: "Portal", portalLabel: "Citizen Portal", welcomeTitle: "Hello, {name}", dumagueteCity: "Dumaguete City",
      pendingReports: "Pending Reports", view: "View All", recentReportsTitle: "Recent Reports", noReportsYet: "No reports yet",
      fileAReport: "File a Report", alertsTitle: "Active Alerts", noActiveAlerts: "No active alerts",
      updatesAutomatically: "Updates automatically", viewAllAlerts: "View All Alerts",
      bottomNavReport: "Report", bottomNavHistory: "History", bottomNavTips: "Tips", myReportsCount: "{count} Reports",
      citizenPortal: "Citizen Portal",
    },
    history: {
      overview: "Overview", actions: "Actions", fileReport: "File Report", myReports: "My Reports",
      barangayAlerts: "Barangay Alerts", safetyMap: "Safety Map", safetyTips: "Safety Tips",
      info: "Information", directory: "Directory", resources: "Resources", signOut: "Sign Out",
      citizen: "Citizen", pageTitle: "My History", subtitle: "Track your submitted incident reports and status updates.",
      allReports: "All Reports", totalLabel: "Total", loadingReports: "Loading reports…",
      noReportsYet: "No reports yet", noReportsSub: "You haven't submitted any incident reports yet.",
      fileAReport: "File a Report",
    },
    alerts: {
      backToDashboard: "Back to Dashboard", citizenPortal: "Citizen Portal", barangayAlerts: "Barangay Alerts",
      live: "Live", connecting: "Connecting…", allAlerts: "All Alerts", alert: "Alert", isNew: "New",
      loadingAlerts: "Loading alerts…", noActiveAlerts: "No active alerts", noAlertsYet: "No alerts yet",
      noAlertsMatch: "No alerts match your filter", total: "Total",
    },
    reportDetail: {
      backToHistory: "Back to History", reportDetail: "Report Detail", reportDetails: "Report Details",
      description: "Description", noDescription: "No description provided", location: "Location",
      notSpecified: "Not specified", submitted: "Submitted", evidence: "Evidence",
      statusTimeline: "Status Timeline", reportFiled: "Report Filed", reportFiledSub: "Your report has been received.",
      claimedByResponder: "Claimed by Responder", awaitingResponder: "Awaiting Responder",
      awaitingResponderSub: "Your report is in the queue.", responderOnIt: "Responder On It",
      responderOnItSub: "A responder is handling your report.", statusResolved: "Resolved",
      resolutionPending: "Resolution Pending", responderUpdates: "Responder Updates",
      resolutionSummary: "Resolution Summary", responseNotes: "Response Notes", noNotesProvided: "No notes provided",
      actionTaken: "Action Taken", noActionDetails: "No action details", resolvedOn: "Resolved on {date}",
    },
"""

# Find all report data blocks (not type definitions)
# A data block has actual string values, not type annotations like `title: string`
# We look for `report: {` followed by content that includes `heroTitle:` or similar data keys

# Strategy: find each `report: {` that is at the top level of a language block
# (indented with 4 spaces, not 6+ which would be inside another block)
# Then find its closing `    },` and check if dashboard follows

# Find all occurrences of `\n    report: {` (4-space indent = top level in language block)
pattern = re.compile(r'\n(    report: \{.*?\n    \},)', re.DOTALL)

matches = list(pattern.finditer(content))
print(f"Found {len(matches)} report data blocks")

inserted = 0
for m in matches:
    block_text = m.group(1)
    block_start = m.start()
    block_end = m.end()
    
    # Skip if this is a type definition (contains `: string` or `: {` type annotations)
    if re.search(r':\s*string\b', block_text) or re.search(r':\s*\{[^"]*:\s*string', block_text):
        continue
    
    # Check if dashboard already follows this block
    after = content[block_end:block_end+500]
    if 'dashboard:' in after:
        continue
    
    # This is a data block missing dashboard/history/alerts/reportDetail
    # Insert before the closing `    },`
    # The block ends with `\n    },` - we want to insert before that
    closing_idx = block_text.rfind('\n    },')
    if closing_idx >= 0:
        insert_pos = block_start + closing_idx
        content = content[:insert_pos] + '\n' + sections_data + content[insert_pos:]
        inserted += 1
        print(f"  Inserted at position {insert_pos}")

print(f"Inserted into {inserted} blocks")

# Now add disasterDetails and goBagItems to safetyTips blocks
# Find safetyTips data blocks
pattern2 = re.compile(r'\n(    safetyTips: \{.*?\n    \},)', re.DOTALL)
matches2 = list(pattern2.finditer(content))
print(f"Found {len(matches2)} safetyTips data blocks")

inserted2 = 0
for m in matches2:
    block_text = m.group(1)
    block_start = m.start()
    block_end = m.end()
    
    if 'disasterDetails:' in block_text:
        continue
    
    # Insert before closing `    },`
    closing_idx = block_text.rfind('\n    },')
    if closing_idx >= 0:
        insert_pos = block_start + closing_idx
        insert_text = """
      disasterDetails: {
        typhoon: { signal: "", before: [], during: [], after: [] },
        flood: { signal: "", before: [], during: [], after: [] },
        fire: { signal: "", before: [], during: [], after: [] },
        earthquake: { signal: "", before: [], during: [], after: [] },
        landslide: { signal: "", before: [], during: [], after: [] },
        road: { signal: "", before: [], during: [], after: [] },
      },
      goBagItems: [],"""
        content = content[:insert_pos] + insert_text + content[insert_pos:]
        inserted2 += 1
        print(f"  Inserted disasterDetails at position {insert_pos}")

print(f"Inserted disasterDetails into {inserted2} blocks")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("done")