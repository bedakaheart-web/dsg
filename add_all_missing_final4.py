import re

path = "src/translations/index.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Sections to add after report block closes and before signup opens
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

# Find all report blocks that are missing dashboard/history/alerts/reportDetail
# Pattern: after "success: { ... }," and before "signup:" or "},"

# Find all report blocks and check what comes after
report_pattern = r'(report:\s*\{[^}]*?success:\s*\{[^}]*?\},?\s*\n)(\s+\},?)'
matches = list(re.finditer(report_pattern, content, re.DOTALL))

for m in matches:
    block = m.group(0)
    idx = m.start()
    block_end = m.end()
    
    # Check if this report block is followed by dashboard
    after_block = content[block_end:block_end+200]
    if 'dashboard:' not in after_block:
        # This block is missing dashboard/history/alerts/reportDetail
        # Insert them before the closing "},"
        closing_pos = block.rfind('},')
        if closing_pos > 0:
            content = content[:idx + closing_pos] + '\n' + sections_data + content[idx + closing_pos:]

# Fix 2: Add disasterDetails and goBagItems to safetyTips blocks that are missing them
# Pattern: after "categories: { ... }," and before "    },"
# We need to insert disasterDetails and goBagItems before the closing "    },"

# Find all safetyTips blocks and check if they have disasterDetails
# by finding the pattern: "categories: { ... }," followed by "    },"

# Find all positions of "categories: {" that are inside safetyTips
pattern = r'(safetyTips:\s*\{[^}]*?categories:\s*\{[^}]*?\},?\s*\n)(\s+\},)'
matches = list(re.finditer(pattern, content, re.DOTALL))

for m in matches:
    block = m.group(0)
    if 'disasterDetails:' not in block:
        # This block is missing disasterDetails
        # Insert before the closing "},"
        idx = m.start()
        block_end = m.end()
        
        # Find the closing "}," position
        closing_pos = block.rfind('},')
        if closing_pos > 0:
            # Insert disasterDetails and goBagItems before the closing
            insert_text = '''
      disasterDetails: {
        typhoon: { signal: "", before: [], during: [], after: [] },
        flood: { signal: "", before: [], during: [], after: [] },
        fire: { signal: "", before: [], during: [], after: [] },
        earthquake: { signal: "", before: [], during: [], after: [] },
        landslide: { signal: "", before: [], during: [], after: [] },
        road: { signal: "", before: [], during: [], after: [] },
      },
      goBagItems: [],'''
            content = content[:idx + closing_pos] + insert_text + content[idx + closing_pos:]

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("done")