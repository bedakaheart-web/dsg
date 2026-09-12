#!/usr/bin/env bash
set -e

echo "── Step 0: locating src/ ──"
if [ ! -d "src" ]; then
  echo "❌ No 'src' folder found here. cd into the folder with package.json first."
  exit 1
fi

echo "── Step 1: fixing Context/context folder casing ──"
if [ -d "src/Context" ] && [ ! -d "src/context" ]; then
  if command -v git >/dev/null 2>&1 && git -C . rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    git mv src/Context src/context__tmp__
    git mv src/context__tmp__ src/context
    echo "✅ Renamed src/Context -> src/context (via git mv)"
  else
    mv src/Context src/context__tmp__
    mv src/context__tmp__ src/context
    echo "✅ Renamed src/Context -> src/context (via mv)"
  fi
elif [ -d "src/context" ]; then
  echo "ℹ️  src/context already exists correctly — skipping rename."
else
  echo "⚠️  Neither src/Context nor src/context found. Skipping this step — check manually."
fi

echo "── Step 2: fixing import casing in all .ts/.tsx files ──"
grep -rIl --include="*.ts" --include="*.tsx" -E '[./]+[Cc]ontext/LanguageContext' src | while read -r file; do
  sed -i.bak -E 's#([./]+)[Cc]ontext/LanguageContext#\1context/LanguageContext#g' "$file"
  rm -f "$file.bak"
  echo "  fixed import in: $file"
done

echo "── Step 3: locating your actual translations file ──"
TRANSLATIONS_PATH=""
if [ -f "src/i18n/translations.ts" ]; then
  TRANSLATIONS_PATH="../i18n/translations"
  echo "ℹ️  Found src/i18n/translations.ts"
elif [ -f "src/translations/index.ts" ]; then
  TRANSLATIONS_PATH="../translations"
  echo "ℹ️  Found src/translations/index.ts"
elif [ -f "src/translations.ts" ]; then
  TRANSLATIONS_PATH="../translations"
  echo "ℹ️  Found src/translations.ts"
else
  found=$(find src -iname "translations*" 2>/dev/null | head -n 1)
  if [ -n "$found" ]; then
    echo "⚠️  Found a translations-like file at: $found — check manually."
  else
    echo "❌ Could not find any translations file under src/."
  fi
fi

if [ -n "$TRANSLATIONS_PATH" ] && [ -f "src/context/LanguageContext.tsx" ]; then
  sed -i.bak -E "s#from \"[./]+(translations|i18n/translations|translations/index)\"#from \"$TRANSLATIONS_PATH\"#g" src/context/LanguageContext.tsx
  rm -f src/context/LanguageContext.tsx.bak
  echo "✅ Repointed the translations import in src/context/LanguageContext.tsx to: $TRANSLATIONS_PATH"
fi

echo ""
echo "── Done. Summary of import lines now in your files: ──"
grep -rn "LanguageContext\"" src --include="*.tsx" --include="*.ts" || true
grep -n "from \"" src/context/LanguageContext.tsx 2>/dev/null | grep -i translat || true

echo ""
echo "Next: restart your dev server (stop and re-run 'npm run dev')."
