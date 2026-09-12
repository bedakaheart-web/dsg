import re

path = "src/translations/index.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Sections to add to each language block after report: { ... },
# and before signup: { ... }
sections_data = """    dashboard: {
      statTotalFiled: "Total Filed", statPending: "Pending", statInProgress: "In Progress", statResolved: "Resolved",
      quickActionFileReport: "File Report", quickActionSafetyMap: "Safety Map", quickActionMyReports: "My Reports", quickActionSafetyTips: "Safety Tips",
      sidebarPortal: "Portal", portalLabel: "Citizen Portal", welcomeTitle: "Hello, {name}", dumagueteCity: "Dumaguete City",
      pendingReports: "You have {count} report(s) awaiting review.",
      view: "View All", recentReportsTitle: "Recent Reports", noReportsYet: "No reports yet",
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
      reportInfo: "Report Information", reportProgress: "Report Progress", uploadedEvidence: "Uploaded Evidence",
      viewDownloadEvidence: "View / Download Evidence", noEvidence: "No evidence was attached to this report.",
      responderNotes: "Responder Notes", hasUpdate: "Has Update", noUpdatesYet: "No updates yet",
      responderUpdateSub: "The responder hasn't left any notes for this report yet.",
      submittedLabel: "Submitted", submittedSub: "Your report has been received.",
      inProgressLabel: "In Progress", inProgressSub: "A responder is handling your report.",
      resolvedLabel: "Resolved", resolvedSub: "This report has been resolved.",
      type: "Type", reporter: "Reporter", anonymous: "Anonymous",
      incidentReport: "Incident Report",
    },
"""

# Find all report data blocks (not type definitions)
# Data blocks have actual string values like heroTitle: "Report an"
# Type definitions have heroTitle: string

# Strategy: find each `    report: {` (4-space indent = top level in language block)
# Then find its closing `    },` and check if dashboard follows

# First, let's find all positions of `    report: {` at the data level
# We need to distinguish data blocks from type definitions
# Data blocks contain `heroTitle: "..."` (with quotes), type definitions contain `heroTitle: string`

# Find all `    report: {` that are followed by `heroTitle:` with a string value
pattern = re.compile(r'(    report: \{.*?heroTitle: "[^"]*".*?\n    \},)', re.DOTALL)

matches = list(pattern.finditer(content))
print(f"Found {len(matches)} report data blocks")

inserted = 0
for m in matches:
    block_text = m.group(1)
    block_start = m.start()
    block_end = m.end()
    
    # Check if dashboard already follows this block
    after = content[block_end:block_end+500]
    if 'dashboard:' in after:
        continue
    
    # This is a data block missing dashboard/history/alerts/reportDetail
    # Insert before the closing `    },`
    closing_idx = block_text.rfind('\n    },')
    if closing_idx >= 0:
        insert_pos = block_start + closing_idx
        content = content[:insert_pos] + '\n' + sections_data + content[insert_pos:]
        inserted += 1
        print(f"  Inserted at position {insert_pos}")

print(f"Inserted into {inserted} blocks")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("done")