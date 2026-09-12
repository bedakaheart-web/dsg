#!/usr/bin/env bash
set -euo pipefail

FILE="${SAFETY_PAGE:-src/pages/SafetyTips.tsx}"

if [ ! -f "$FILE" ]; then
  echo "ERROR: $FILE not found from current directory. cd to your repo root first."
  exit 1
fi

cp "$FILE" "${FILE}.bak3"
echo "Backup written: ${FILE}.bak3 (this is the CURRENT broken file, saved before this fix)"

python3 - "$FILE" <<'PYEOF'
import sys, re

path = sys.argv[1]
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

start_marker = "disasterDetails: {"
end_marker = "const DISASTERS = ["

start_count = content.count(start_marker)
end_count = content.count(end_marker)

if start_count == 0:
    raise SystemExit(
        "Did not find 'disasterDetails: {' in the file — the orphaned block may already "
        "be removed, or the file differs from what was diagnosed. No changes made."
    )
if start_count > 1:
    raise SystemExit(
        f"Found 'disasterDetails: {{' {start_count} times (expected 1) — refusing to guess "
        "which one to remove. No changes made."
    )
if end_count != 1:
    raise SystemExit(
        f"Found 'const DISASTERS = [' {end_count} times (expected 1). No changes made."
    )

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx >= end_idx:
    raise SystemExit(
        "'disasterDetails: {' appears AFTER 'const DISASTERS = [' — unexpected file layout. "
        "No changes made."
    )

# Walk back from start_idx to the beginning of its line, so we remove the
# whole line (including its leading whitespace/newline), not just the marker text.
line_start = content.rfind("\n", 0, start_idx) + 1

# The removed region is [line_start, end_idx). Replace it with a single blank
# line so spacing before `const DISASTERS = [` looks the same as the original file.
new_content = content[:line_start] + "\n" + content[end_idx:]

removed_lines = content[line_start:end_idx].count("\n")
print(f"Removing {removed_lines} lines (the orphaned disasterDetails/goBagItems block).")

with open(path, "w", encoding="utf-8") as f:
    f.write(new_content)

print(f"Patched: {path}")

# Quick sanity check: brace/bracket balance across the whole file
o_brace, c_brace = new_content.count("{"), new_content.count("}")
o_brack, c_brack = new_content.count("["), new_content.count("]")
print(f"Brace balance:   {{ {o_brace}  }} {c_brace}  ({'OK' if o_brace == c_brace else 'MISMATCH'})")
print(f"Bracket balance: [ {o_brack}  ] {c_brack}  ({'OK' if o_brack == c_brack else 'MISMATCH'})")
PYEOF

echo ""
echo "Done. If this introduced a new problem, restore with:"
echo "  mv '${FILE}.bak3' '$FILE'"
echo ""
echo "NOTE: the component still calls things like:"
echo "  t(\`safetyTips.disasterDetails.\${disaster.labelKey}.signal\`)"
echo "  tList(\`safetyTips.disasterDetails.\${disaster.labelKey}.\${activePhase}\`)"
echo "  tList(\"safetyTips.goBagItems\")"
echo "For translations to actually show, your translations.ts needs matching"
echo "'disasterDetails' / 'goBagItems' keys under each language's safetyTips object —"
echo "not 'disasterData' / 'goBag.itemLabels' (which is what my earlier scripts wrote,"
echo "if you ran those). Run the check below to see which naming your translations.ts"
echo "actually has:"
echo ""
echo "  grep -n 'disasterData\\|disasterDetails\\|goBagItems\\|itemLabels' src/translations/index.ts"
