#!/usr/bin/env bash
set -euo pipefail

FILE="${SAFETY_PAGE:-src/pages/SafetyTips.tsx}"

if [ ! -f "$FILE" ]; then
  echo "ERROR: $FILE not found from current directory. cd to your repo root first."
  exit 1
fi

start_count=$(grep -c "disasterDetails: {" "$FILE" || true)
end_count=$(grep -c "const DISASTERS = \[" "$FILE" || true)

if [ "$start_count" -eq 0 ]; then
  echo "Did not find 'disasterDetails: {' in $FILE — the orphaned block may already be"
  echo "removed. No changes made."
  exit 0
fi

if [ "$start_count" -gt 1 ]; then
  echo "ERROR: found 'disasterDetails: {' $start_count times (expected 1)."
  echo "Refusing to guess which one to remove. No changes made."
  exit 1
fi

if [ "$end_count" -ne 1 ]; then
  echo "ERROR: found 'const DISASTERS = [' $end_count times (expected exactly 1)."
  echo "Refusing to remove anything without a reliable end marker. No changes made."
  exit 1
fi

start_line=$(grep -n "disasterDetails: {" "$FILE" | head -1 | cut -d: -f1)
end_line=$(grep -n "const DISASTERS = \[" "$FILE" | head -1 | cut -d: -f1)

if [ "$start_line" -ge "$end_line" ]; then
  echo "ERROR: 'disasterDetails: {' (line $start_line) appears AFTER 'const DISASTERS = ['"
  echo "(line $end_line) — unexpected file layout. No changes made."
  exit 1
fi

cp "$FILE" "${FILE}.bak3"
echo "Backup written: ${FILE}.bak3"
echo "Removing lines $start_line through $((end_line - 1)) ($(( end_line - start_line )) lines)."

awk '
/disasterDetails: \{/ { skip=1; print ""; next }
/const DISASTERS = \[/ { skip=0 }
skip { next }
{ print }
' "$FILE" > "${FILE}.tmp"

mv "${FILE}.tmp" "$FILE"
echo "Patched: $FILE"

echo ""
echo "=== Sanity check: brace/bracket balance (pure bash count) ==="
open_brace=$(tr -cd '{' < "$FILE" | wc -c)
close_brace=$(tr -cd '}' < "$FILE" | wc -c)
open_brack=$(tr -cd '[' < "$FILE" | wc -c)
close_brack=$(tr -cd ']' < "$FILE" | wc -c)
echo "{ $open_brace  vs  } $close_brace"
echo "[ $open_brack  vs  ] $close_brack"

if [ "$open_brace" -ne "$close_brace" ] || [ "$open_brack" -ne "$close_brack" ]; then
  echo ""
  echo "WARNING: braces/brackets are unbalanced. This may be pre-existing (JSX curly"
  echo "braces in template strings can throw off a naive count) — don't panic on this"
  echo "alone, but do check your editor's Problems panel after this."
fi

echo ""
echo "Done. If anything looks wrong, restore with:"
echo "  mv '${FILE}.bak3' '$FILE'"
