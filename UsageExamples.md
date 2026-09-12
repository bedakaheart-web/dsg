# Wiring `TranslatedDescription` into the three list/detail pages

The edge function + migration + `Report.tsx` change get translated text into
the database. These pages just need to render it. Same pattern in all three
— swap in wherever the report description currently renders.

## Dispatch.tsx

```tsx
import { TranslatedDescription } from "@/components/TranslatedDescription";

// inside the row/card render for a given `report`:
<TranslatedDescription
  description={report.description}
  descriptionLang={report.description_lang}
  descriptionTranslated={report.description_translated}
  className="text-sm text-gray-800"
/>
```

## IncidentsPage.tsx

Same component, likely in a detail panel rather than a row:

```tsx
<section className="border-t pt-3 mt-3">
  <h3 className="font-medium text-sm mb-1">Description</h3>
  <TranslatedDescription
    description={incident.description}
    descriptionLang={incident.description_lang}
    descriptionTranslated={incident.description_translated}
  />
</section>
```

## ResponderAlertsPage.tsx

Same again — for alert cards this one probably wants the compact
`className` used in Dispatch.tsx since space is tighter:

```tsx
<TranslatedDescription
  description={alert.description}
  descriptionLang={alert.description_lang}
  descriptionTranslated={alert.description_translated}
  className="text-sm"
/>
```

## Query note

Make sure whatever `select()` these pages use actually pulls the new
columns, e.g.:

```ts
supabase
  .from("reports")
  .select("id, created_at, description, description_lang, description_translated, ...")
```

If any of these pages fetch a narrower column list today, that's the one
change needed beyond dropping in the component.
