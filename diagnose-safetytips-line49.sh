#!/usr/bin/env bash
# Precise diagnostic for the esbuild error at src/pages/SafetyTips.tsx:49
# Non-destructive — only reads and prints, changes nothing.

FILE="src/pages/SafetyTips.tsx"

if [ ! -f "$FILE" ]; then
  echo "ERROR: $FILE not found from current directory. cd to your repo root first."
  exit 1
fi

echo "############################################"
echo "# Lines 1-60 of $FILE (with line numbers)"
echo "# — this is the region esbuild is choking on"
echo "############################################"
sed -n '1,60p' "$FILE" | cat -n

echo ""
echo "############################################"
echo "# Brace/bracket balance up to line 60"
echo "# (mismatch here = the real cause)"
echo "############################################"
head -n 60 "$FILE" | python3 -c "
import sys
s = sys.stdin.read()
print('{ count:', s.count('{'), '  } count:', s.count('}'))
print('[ count:', s.count('['), '  ] count:', s.count(']'))
print('( count:', s.count('('), '  ) count:', s.count(')'))
"

echo ""
echo "############################################"
echo "# Do you have a pre-patch backup available?"
echo "############################################"
if [ -f "${FILE}.bak" ]; then
  echo "YES: ${FILE}.bak exists (this is the ORIGINAL file from before script 1 ran)."
  echo ""
  echo "Diff between backup and current file:"
  diff "${FILE}.bak" "$FILE" || true
else
  echo "No ${FILE}.bak found in this directory."
fi

echo ""
echo "############################################"
echo "DONE. Paste everything above back to Claude."
echo "############################################"
