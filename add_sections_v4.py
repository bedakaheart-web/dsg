import re

path = "src/translations/index.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

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

# Find all `    },\n    signup: {` patterns
# Check backwards for a report data block (has heroTitle: "...")
pattern = re.compile(r'(    },\n)(    signup: \{)')
matches = list(pattern.finditer(content))

inserted = 0
for m in reversed(matches):
    before = content[:m.start()]
    
    # Find the last `    report: {` before this
    report_start = before.rfind('\n    report: {')
    if report_start < 0:
        continue
    
    # Get the text between report start and the closing `    },`
    report_block = content[report_start:m.start()]
    
    # Check if it's a data block (has heroTitle: "...")
    if 'heroTitle: "' not in report_block:
        continue
    
    # Check if dashboard already exists after this closing
    after = content[m.end():m.end() + 500]
    if 'dashboard:' in after:
        continue
    
    # Insert before the `    },`
    content = content[:m.start()] + sections_data + '\n' + content[m.start():]
    inserted += 1

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Inserted into {inserted} blocks")