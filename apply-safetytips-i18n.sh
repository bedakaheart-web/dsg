#!/usr/bin/env bash
set -euo pipefail

# ── Adjust these if your files live elsewhere ──────────────────────────
TRANSLATIONS="${TRANSLATIONS:-src/i18n/translations.ts}"
SAFETY_PAGE="${SAFETY_PAGE:-src/pages/SafetyTips.tsx}"
# ────────────────────────────────────────────────────────────────────────

for f in "$TRANSLATIONS" "$SAFETY_PAGE"; do
  if [ ! -f "$f" ]; then
    echo "ERROR: file not found: $f"
    echo "Set TRANSLATIONS / SAFETY_PAGE env vars to the correct paths and re-run."
    exit 1
  fi
done

cp "$TRANSLATIONS" "$TRANSLATIONS.bak"
cp "$SAFETY_PAGE" "$SAFETY_PAGE.bak"
echo "Backups written: *.bak"

python3 - "$TRANSLATIONS" "$SAFETY_PAGE" <<'PYEOF'
import sys

translations_path, safety_page_path = sys.argv[1:3]

def must_replace_once(text, old, new, label):
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"ERROR: anchor for '{label}' found {count} times (expected 1). Aborting without writing any file. Anchor was:\n{old!r}")
    return text.replace(old, new, 1)

# ============================================================
# 1) SafetyTips.tsx
# ============================================================
with open(safety_page_path, "r", encoding="utf-8") as f:
    st = f.read()

# 1a) useLanguage() destructure -> add tList
st = must_replace_once(
    st,
    'const { t } = useLanguage();',
    'const { t, tList } = useLanguage();',
    "SafetyTips useLanguage() destructure",
)

# 1b) add goBagLabels derivation right after bagFilter state
st = must_replace_once(
    st,
    '  const [bagFilter,   setBagFilter]   = useState("All");',
    '  const [bagFilter,   setBagFilter]   = useState("All");\n\n  const goBagLabels = tList("safetyTips.goBag.itemLabels");',
    "SafetyTips goBagLabels insertion point",
)

# 1c) GO_BAG_ITEMS: strip hardcoded labels
old_gobag_items = '''const GO_BAG_ITEMS = [
  { id: 1,  category: "Water & Food",   label: "3-day water supply (1 gal/person/day)"     },
  { id: 2,  category: "Water & Food",   label: "Non-perishable food (3-day supply)"         },
  { id: 3,  category: "Water & Food",   label: "Manual can opener"                          },
  { id: 4,  category: "Medical",        label: "First aid kit with manual"                  },
  { id: 5,  category: "Medical",        label: "7-day supply of prescription medications"   },
  { id: 6,  category: "Medical",        label: "Extra eyeglasses or contact lens supplies"  },
  { id: 7,  category: "Documents",      label: "Copies of IDs and important documents"      },
  { id: 8,  category: "Documents",      label: "Emergency contact list (printed)"           },
  { id: 9,  category: "Documents",      label: "Cash in small bills"                        },
  { id: 10, category: "Tools",          label: "Flashlight with extra batteries"            },
  { id: 11, category: "Tools",          label: "Battery-powered or hand-crank radio"        },
  { id: 12, category: "Tools",          label: "Multi-tool or Swiss Army knife"             },
  { id: 13, category: "Tools",          label: "Whistle to signal for help"                 },
  { id: 14, category: "Clothing",       label: "Change of clothes per family member"        },
  { id: 15, category: "Clothing",       label: "Sturdy closed-toe shoes"                   },
  { id: 16, category: "Clothing",       label: "Rain poncho or waterproof jacket"           },
  { id: 17, category: "Shelter",        label: "Lightweight emergency blanket"              },
  { id: 18, category: "Shelter",        label: "Dust masks or N95 respirators"              },
  { id: 19, category: "Communication",  label: "Fully charged power bank"                  },
  { id: 20, category: "Communication",  label: "Local hazard map and evacuation route"      },
];'''

new_gobag_items = '''const GO_BAG_ITEMS = [
  { id: 1,  category: "Water & Food"   },
  { id: 2,  category: "Water & Food"   },
  { id: 3,  category: "Water & Food"   },
  { id: 4,  category: "Medical"        },
  { id: 5,  category: "Medical"        },
  { id: 6,  category: "Medical"        },
  { id: 7,  category: "Documents"      },
  { id: 8,  category: "Documents"      },
  { id: 9,  category: "Documents"      },
  { id: 10, category: "Tools"          },
  { id: 11, category: "Tools"          },
  { id: 12, category: "Tools"          },
  { id: 13, category: "Tools"          },
  { id: 14, category: "Clothing"       },
  { id: 15, category: "Clothing"       },
  { id: 16, category: "Clothing"       },
  { id: 17, category: "Shelter"        },
  { id: 18, category: "Shelter"        },
  { id: 19, category: "Communication"  },
  { id: 20, category: "Communication"  },
];'''

st = must_replace_once(st, old_gobag_items, new_gobag_items, "SafetyTips GO_BAG_ITEMS array")

# 1d) render: go-bag label
st = must_replace_once(
    st,
    '<div className="st-check-label">{item.label}</div>',
    '<div className="st-check-label">{goBagLabels[item.id - 1] ?? ""}</div>',
    "SafetyTips go-bag item label render",
)

# 1e) render: disaster signal
st = must_replace_once(
    st,
    '<div className="st-panel-signal">{disaster.signal}</div>',
    '<div className="st-panel-signal">{t(`safetyTips.disasterData.${disaster.id}.signal`)}</div>',
    "SafetyTips disaster signal render",
)

# 1f) render: phase tips list source
st = must_replace_once(
    st,
    '{disaster[activePhase].map((tip, i) => {',
    '{tList(`safetyTips.disasterData.${disaster.id}.${activePhase}`).map((tip, i) => {',
    "SafetyTips phase tips list source",
)

with open(safety_page_path, "w", encoding="utf-8") as f:
    f.write(st)
print(f"Patched: {safety_page_path}")
print("NOTE: This script does NOT rewrite the DISASTERS array in SafetyTips.tsx")
print("      (signal/before/during/after fields are now unused dead data but")
print("      harmless to leave in place). Remove them by hand if you want a")
print("      fully clean file, or ask for a follow-up patch to strip them.")

# ============================================================
# 2) translations.ts — extend TranslationDict type
# ============================================================
with open(translations_path, "r", encoding="utf-8") as f:
    tr = f.read()

type_anchor = '''    goBag: {
      tabLabel: string; titleStart: string; titleAccent: string; titleEnd: string;
      sub: string; itemsPacked: string; resetBtn: string;
    };
    categories: {
      all: string; waterFood: string; medical: string; documents: string;
      tools: string; clothing: string; shelter: string; communication: string;
    };
  };'''

type_addition = '''    goBag: {
      tabLabel: string; titleStart: string; titleAccent: string; titleEnd: string;
      sub: string; itemsPacked: string; resetBtn: string;
      itemLabels: string[];
    };
    categories: {
      all: string; waterFood: string; medical: string; documents: string;
      tools: string; clothing: string; shelter: string; communication: string;
    };
    disasterData: {
      typhoon:    { signal: string; before: string[]; during: string[]; after: string[] };
      flood:      { signal: string; before: string[]; during: string[]; after: string[] };
      fire:       { signal: string; before: string[]; during: string[]; after: string[] };
      earthquake: { signal: string; before: string[]; during: string[]; after: string[] };
      landslide:  { signal: string; before: string[]; during: string[]; after: string[] };
      road:       { signal: string; before: string[]; during: string[]; after: string[] };
    };
  };'''

tr = must_replace_once(tr, type_anchor, type_addition, "TranslationDict safetyTips type")

# ============================================================
# 3) translations.ts — patch en / tl / ceb data
# ============================================================

LANGS = {
"en": {
  "gobag_anchor": '      goBag: { tabLabel: "Go Bag", titleStart: "Your", titleAccent: "Go Bag", titleEnd: "Checklist", sub: "Pack these 20 essentials so you can evacuate safely within 15 minutes. Check off what you\'ve already prepared.", itemsPacked: "items packed", resetBtn: "Reset checklist" },',
  "gobag_new": '''      goBag: {
        tabLabel: "Go Bag", titleStart: "Your", titleAccent: "Go Bag", titleEnd: "Checklist",
        sub: "Pack these 20 essentials so you can evacuate safely within 15 minutes. Check off what you've already prepared.",
        itemsPacked: "items packed", resetBtn: "Reset checklist",
        itemLabels: [
          "3-day water supply (1 gal/person/day)", "Non-perishable food (3-day supply)", "Manual can opener",
          "First aid kit with manual", "7-day supply of prescription medications", "Extra eyeglasses or contact lens supplies",
          "Copies of IDs and important documents", "Emergency contact list (printed)", "Cash in small bills",
          "Flashlight with extra batteries", "Battery-powered or hand-crank radio", "Multi-tool or Swiss Army knife", "Whistle to signal for help",
          "Change of clothes per family member", "Sturdy closed-toe shoes", "Rain poncho or waterproof jacket",
          "Lightweight emergency blanket", "Dust masks or N95 respirators",
          "Fully charged power bank", "Local hazard map and evacuation route",
        ],
      },''',
  "categories_anchor": '      categories: { all: "All", waterFood: "Water & Food", medical: "Medical", documents: "Documents", tools: "Tools", clothing: "Clothing", shelter: "Shelter", communication: "Communication" },\n    },',
  "categories_new_suffix": '''      categories: { all: "All", waterFood: "Water & Food", medical: "Medical", documents: "Documents", tools: "Tools", clothing: "Clothing", shelter: "Shelter", communication: "Communication" },
      disasterData: {
        typhoon: {
          signal: "PAGASA Signal #1\u20135",
          before: [
            "Stock at least 3 days of food, water, and medicines",
            "Secure or bring inside loose outdoor objects (furniture, pots, signages)",
            "Reinforce windows and doors with tape or boards",
            "Charge all devices and power banks before the storm",
            "Know your evacuation route and nearest evacuation center",
            "Trim trees near your house that could fall on the roof",
          ],
          during: [
            "Stay indoors and away from windows and glass doors",
            "Do not go outside during the eye of the storm \u2014 the second eyewall is coming",
            "Avoid flooded roads; 6 inches of moving water can knock you down",
            "Do not use generators indoors \u2014 carbon monoxide is lethal",
            "Monitor PAGASA updates via battery-powered radio",
          ],
          after: [
            "Check for structural damage before re-entering your home",
            "Avoid downed power lines \u2014 treat them as live",
            "Use bottled or boiled water; floodwaters contaminate pipes",
            "Document damage with photos for insurance claims",
            "Help vulnerable neighbors: elderly, children, PWDs",
          ],
        },
        flood: {
          signal: "NDRRMC Flood Advisory",
          before: [
            "Elevate important documents, appliances, and furniture",
            "Know your flood zone level \u2014 consult your barangay hazard map",
            "Keep an emergency kit and go bag ready at all times",
            "Install check valves in plumbing to prevent sewage backflow",
            "Identify a safe meeting place above the flood zone for your family",
          ],
          during: [
            "Evacuate immediately when authorities issue an order \u2014 don't wait",
            "Never walk or drive through floodwater; 12 inches can sweep a car",
            "Turn off utilities at main switches if instructed and safe to do so",
            "Avoid contact with floodwater \u2014 it may contain sewage and chemicals",
            "Move to the highest floor, not the attic, where you can escape if needed",
          ],
          after: [
            "Return home only when authorities declare it safe",
            "Wear rubber boots and gloves when cleaning \u2014 health hazard",
            "Discard food that contacted floodwater \u2014 do not risk it",
            "Check for mold growth and ventilate thoroughly",
            "Report damaged infrastructure (roads, bridges) to your barangay",
          ],
        },
        fire: {
          signal: "BFP Fire Alert",
          before: [
            "Install working smoke detectors on every floor and test monthly",
            "Create and practice a home fire escape plan with two exits per room",
            "Keep a dry chemical fire extinguisher in the kitchen and know how to use it",
            "Never leave cooking, candles, or mosquito coils unattended",
            "Store flammable materials (LPG, gasoline) away from heat sources",
            "Check electrical wiring \u2014 overloaded sockets are a leading fire cause",
          ],
          during: [
            "Get out immediately \u2014 do NOT stop to collect belongings",
            "Crawl low under smoke; cleaner air is near the floor",
            "Before opening a door, feel it with the back of your hand \u2014 hot means fire on the other side",
            "Close doors behind you to slow the spread of fire",
            "Call 911 once you are safely outside \u2014 never from inside",
            "If trapped, seal door gaps with cloth and signal from a window",
          ],
          after: [
            "Do not re-enter a burned building until fire officials clear it",
            "Contact your local BFP office for investigation and documentation",
            "Seek medical help for smoke inhalation even if you feel fine",
            "Watch for hidden embers that can reignite hours later",
            "Contact the Red Cross or DSWD for emergency assistance",
          ],
        },
        earthquake: {
          signal: "PHIVOLCS Intensity Scale",
          before: [
            "Secure heavy furniture (bookshelves, cabinets) to walls with straps",
            "Store heavy items on lower shelves; glass and breakables in secured cabinets",
            "Identify safe spots in each room: under sturdy tables, against interior walls",
            "Know how to shut off gas, water, and electricity at the main valves",
            "Prepare an earthquake kit including water, food, flashlight, first aid",
            "Practice DROP, COVER, HOLD ON with all household members",
          ],
          during: [
            "DROP to hands and knees immediately \u2014 protects from being knocked down",
            "COVER your head and neck under a sturdy table or desk, or against an interior wall",
            "HOLD ON until the shaking stops \u2014 stay in position",
            "Stay away from windows, exterior walls, and anything that can fall",
            "If outdoors, move away from buildings, trees, streetlights, and power lines",
            "If in a vehicle, pull over away from overpasses and stop carefully",
          ],
          after: [
            "Expect aftershocks \u2014 they can be strong; apply DROP-COVER-HOLD ON again",
            "Check yourself and others for injuries before moving",
            "Smell for gas leaks \u2014 if detected, open windows and leave immediately",
            "Use text messages rather than calls; networks are overloaded after quakes",
            "Check PHIVOLCS and local authorities before returning to damaged structures",
          ],
        },
        landslide: {
          signal: "MGB Landslide Advisory",
          before: [
            "Know if your community is in a landslide-prone zone (consult your barangay)",
            "Observe warning signs: cracks in ground or walls, tilting trees, unusual sounds",
            "Do not build or live on steep slopes, at canyon bases, or near river channels",
            "Plant deep-rooted vegetation on slopes around your property",
            "Clear drainage channels to prevent water buildup on slopes",
            "Prepare an evacuation route to higher ground away from slopes",
          ],
          during: [
            "Move away from the landslide path immediately \u2014 go perpendicular, not straight",
            "If escape is impossible, curl into a ball and protect your head",
            "Listen for unusual sounds: snapping trees, boulders knocking \u2014 early warning",
            "Avoid valleys and low-lying areas near the source of a slide",
            "If driving, watch for collapsed pavement, mud, or debris flows on roads",
          ],
          after: [
            "Stay away from the slide area \u2014 additional slides are likely",
            "Check for injured and trapped persons but do not enter unstable areas",
            "Report the landslide to your barangay or MGB immediately",
            "Watch for flooding which often follows landslides",
            "Do not use roads damaged by slides until officially inspected",
          ],
        },
        road: {
          signal: "LTO / MMDA Traffic Alert",
          before: [
            "Always wear a seatbelt \u2014 front and rear passengers",
            "Never text or use a phone while driving; use hands-free if necessary",
            "Conduct a simple vehicle check before long trips: tires, brakes, lights, fluids",
            "Observe speed limits; adjust speed for weather, traffic, and road conditions",
            "Never drive under the influence of alcohol or drowsiness",
            "Keep a roadside emergency kit: triangle reflectors, jumper cables, first aid",
          ],
          during: [
            "Stay calm \u2014 assess yourself and passengers for injuries before moving",
            "Turn on hazard lights and place triangle reflectors at safe distance",
            "Call 911 immediately if there are injuries; do not move injured persons unless there is immediate danger",
            "Move vehicles out of traffic if safe and if there are no injuries",
            "Do not argue about fault at the scene \u2014 document with photos instead",
          ],
          after: [
            "Cooperate with responding authorities and provide your license and registration",
            "Seek medical evaluation even if you feel fine \u2014 injuries can be delayed",
            "File an incident report at the nearest police station within 24 hours",
            "Notify your insurance company as soon as possible",
            "Contact LTO for procedures on vehicle damage and road incident documentation",
          ],
        },
      },
    },'''
},
"tl": {
  "gobag_anchor": '      goBag: { tabLabel: "Go Bag", titleStart: "Iyong", titleAccent: "Go Bag", titleEnd: "Checklist", sub: "Ihanda ang 20 mahahalagang bagay para makapag-evacuate nang ligtas sa loob ng 15 minuto. Markahan ang mga nahanda mo na.", itemsPacked: "item ang nahanda", resetBtn: "I-reset ang checklist" },',
  "gobag_new": '''      goBag: {
        tabLabel: "Go Bag", titleStart: "Iyong", titleAccent: "Go Bag", titleEnd: "Checklist",
        sub: "Ihanda ang 20 mahahalagang bagay para makapag-evacuate nang ligtas sa loob ng 15 minuto. Markahan ang mga nahanda mo na.",
        itemsPacked: "item ang nahanda", resetBtn: "I-reset ang checklist",
        itemLabels: [
          "3 araw na suplay ng tubig (1 galon/tao/araw)", "Pagkaing hindi nasisira (3 araw na suplay)", "Manual na abrelata",
          "First aid kit na may manual", "7 araw na suplay ng inirereseta na gamot", "Extra na salamin sa mata o contact lens supplies",
          "Kopya ng mga ID at importanteng dokumento", "Naka-print na listahan ng emergency contacts", "Pera sa maliliit na denominasyon",
          "Flashlight na may extra na baterya", "Radyo na de-baterya o hand-crank", "Multi-tool o Swiss Army knife", "Pito para sa pag-signal ng tulong",
          "Palit na damit para sa bawat miyembro ng pamilya", "Matibay na sapatos na sarado ang dulo", "Rain poncho o waterproof na jacket",
          "Magaan na emergency blanket", "Dust mask o N95 respirator",
          "Fully charged na power bank", "Lokal na hazard map at evacuation route",
        ],
      },''',
  "categories_anchor": '      categories: { all: "Lahat", waterFood: "Tubig at Pagkain", medical: "Medikal", documents: "Mga Dokumento", tools: "Kagamitan", clothing: "Damit", shelter: "Silungan", communication: "Komunikasyon" },\n    },',
  "categories_new_suffix": '''      categories: { all: "Lahat", waterFood: "Tubig at Pagkain", medical: "Medikal", documents: "Mga Dokumento", tools: "Kagamitan", clothing: "Damit", shelter: "Silungan", communication: "Komunikasyon" },
      disasterData: {
        typhoon: {
          signal: "PAGASA Signal Blg. 1\u20135",
          before: [
            "Mag-imbak ng hindi bababa sa 3 araw na pagkain, tubig, at gamot",
            "I-secure o dalhin sa loob ang maluluwag na bagay sa labas (muwebles, paso, signage)",
            "Patibayin ang mga bintana at pinto gamit ang tape o tabla",
            "I-charge ang lahat ng device at power bank bago ang bagyo",
            "Alamin ang iyong evacuation route at pinakamalapit na evacuation center",
            "Putulin ang mga sanga ng puno malapit sa iyong bahay na maaaring bumagsak sa bubong",
          ],
          during: [
            "Manatili sa loob ng bahay, malayo sa mga bintana at salaming pinto",
            "Huwag lumabas habang nasa mata ng bagyo \u2014 parating na ang pangalawang eyewall",
            "Iwasan ang mga baha sa kalsada; 6 pulgada ng gumagalaw na tubig ay maaaring magpatumba sa iyo",
            "Huwag gumamit ng generator sa loob \u2014 nakamamatay ang carbon monoxide",
            "Subaybayan ang mga update ng PAGASA gamit ang de-baterya na radyo",
          ],
          after: [
            "Suriin ang estruktural na pinsala bago muling pumasok sa iyong bahay",
            "Iwasan ang mga nahulog na linya ng kuryente \u2014 ituring itong buhay",
            "Gumamit ng bote o pinakuluang tubig; ang baha ay kumokontamina sa tubig",
            "I-dokumento ang pinsala gamit ang litrato para sa insurance claim",
            "Tulungan ang mga vulnerable na kapitbahay: matatanda, bata, PWD",
          ],
        },
        flood: {
          signal: "NDRRMC Flood Advisory",
          before: [
            "Itaas ang mahahalagang dokumento, appliances, at muwebles",
            "Alamin ang antas ng flood zone mo \u2014 kumonsulta sa hazard map ng barangay",
            "Panatilihing handa ang emergency kit at go bag sa lahat ng oras",
            "Mag-install ng check valve sa tubero para maiwasan ang sewage backflow",
            "Tukuyin ang ligtas na tagpuan sa itaas ng flood zone para sa pamilya",
          ],
          during: [
            "Agad na lumikas kapag nag-utos ang mga awtoridad \u2014 huwag maghintay",
            "Huwag lumakad o magmaneho sa baha; 12 pulgada ay makakaanod ng sasakyan",
            "Patayin ang utilities sa main switch kung inutusan at ligtas gawin",
            "Iwasan ang pakikipag-ugnayan sa baha \u2014 maaaring may dumi at kemikal ito",
            "Lumipat sa pinakamataas na palapag, hindi sa attic, kung saan makakatakas ka",
          ],
          after: [
            "Bumalik lang sa bahay kapag idineklara ng awtoridad na ligtas na",
            "Magsuot ng rubber boots at gloves habang naglilinis \u2014 panganib sa kalusugan",
            "Itapon ang pagkaing nadikit sa baha \u2014 huwag rin ito panganibin",
            "Suriin ang paglago ng amag at maayos na paliparin",
            "I-report sa barangay ang sirang imprastruktura (kalsada, tulay)",
          ],
        },
        fire: {
          signal: "BFP Fire Alert",
          before: [
            "Mag-install ng gumaganang smoke detector sa bawat palapag at subukan buwan-buwan",
            "Gumawa at magsanay ng home fire escape plan na may dalawang labasan bawat kwarto",
            "Maglagay ng dry chemical fire extinguisher sa kusina at alamin gamitin ito",
            "Huwag iiwanang walang bantay ang nagluluto, kandila, o katol",
            "Itago ang mga nasusunog na materyales (LPG, gasolina) malayo sa init",
            "Suriin ang electrical wiring \u2014 overloaded na socket ay isang pangunahing sanhi ng sunog",
          ],
          during: [
            "Lumabas agad \u2014 HUWAG huminto para mangolekta ng gamit",
            "Gumapang nang mababa sa usok; mas malinis ang hangin malapit sa sahig",
            "Bago magbukas ng pinto, damhin ito ng likod ng kamay \u2014 mainit ibig sabihin may apoy sa kabila",
            "Isara ang mga pinto sa likod mo para bumagal ang pagkalat ng apoy",
            "Tumawag ng 911 kapag ligtas ka na sa labas \u2014 huwag mula sa loob",
            "Kung nakulong, takpan ang gaps ng pinto gamit ang tela at mag-signal mula sa bintana",
          ],
          after: [
            "Huwag bumalik sa nasunog na gusali hanggang idineklarang ligtas ng fire officials",
            "Kontakin ang lokal na opisina ng BFP para sa imbestigasyon at dokumentasyon",
            "Humingi ng medical na tulong para sa paglanghap ng usok kahit pakiramdam mo ay okay ka",
            "Bantayan ang mga natitirang baga na maaaring muling magsindi pagkalipas ng ilang oras",
            "Kontakin ang Red Cross o DSWD para sa emergency assistance",
          ],
        },
        earthquake: {
          signal: "PHIVOLCS Intensity Scale",
          before: [
            "I-secure ang mabibigat na muwebles (bookshelf, cabinet) sa dingding gamit ang straps",
            "Ilagay ang mabibigat na bagay sa mas mababang istante; salamin at nabubuong bagay sa naka-secure na cabinet",
            "Tukuyin ang ligtas na lugar sa bawat kwarto: sa ilalim ng matibay na mesa, laban sa interior wall",
            "Alamin kung paano isara ang gas, tubig, at kuryente sa main valve",
            "Maghanda ng earthquake kit kasama ang tubig, pagkain, flashlight, first aid",
            "Sanayin ang DROP, COVER, HOLD ON kasama ang lahat ng miyembro ng sambahayan",
          ],
          during: [
            "DROP sa mga kamay at tuhod agad \u2014 proteksyon laban sa pagkatumba",
            "COVER ang iyong ulo at leeg sa ilalim ng matibay na mesa o laban sa interior wall",
            "HOLD ON hanggang tumigil ang pagyanig \u2014 manatili sa posisyon",
            "Lumayo sa mga bintana, panlabas na dingding, at anumang maaaring mahulog",
            "Kung nasa labas, lumayo sa mga gusali, puno, poste ng ilaw, at linya ng kuryente",
            "Kung nasa sasakyan, huminto sa gilid, malayo sa overpass, at mag-ingat sa paghinto",
          ],
          after: [
            "Asahan ang mga aftershock \u2014 maaaring malakas ito; gawin ulit ang DROP-COVER-HOLD ON",
            "Suriin ang sarili at iba pa para sa pinsala bago gumalaw",
            "Amuyin kung may gas leak \u2014 kung meron, buksan ang bintana at lumabas agad",
            "Gumamit ng text message sa halip na tawag; overload ang network pagkatapos ng lindol",
            "Suriin sa PHIVOLCS at lokal na awtoridad bago bumalik sa nasirang estruktura",
          ],
        },
        landslide: {
          signal: "MGB Landslide Advisory",
          before: [
            "Alamin kung ang komunidad mo ay nasa landslide-prone zone (kumonsulta sa barangay)",
            "Obserbahan ang mga babala: bitak sa lupa o dingding, humihilig na puno, kakaibang tunog",
            "Huwag magtayo o manirahan sa matarik na dalisdis, sa paanan ng bangin, o malapit sa ilog",
            "Magtanim ng malalim ang ugat na halaman sa mga dalisdis palibot ng ari-arian mo",
            "Linisin ang mga drainage channel para maiwasan ang pag-ipon ng tubig sa dalisdis",
            "Maghanda ng ruta ng paglikas patungong mas mataas na lugar, malayo sa dalisdis",
          ],
          during: [
            "Lumayo agad sa daanan ng landslide \u2014 pumunta patagilid, hindi diretso",
            "Kung imposible ang pagtakas, gumulong pababa at protektahan ang ulo",
            "Makinig sa kakaibang tunog: pumuputok na puno, batong nagbabanggaan \u2014 maagang babala",
            "Iwasan ang mga lambak at mababang lugar malapit sa pinanggalingan ng guho",
            "Kung nagmamaneho, bantayan ang gumuhong daan, putik, o debris sa kalsada",
          ],
          after: [
            "Lumayo sa lugar ng guho \u2014 malamang na may karagdagang guho",
            "Suriin ang mga nasugatan at nakulong ngunit huwag pumasok sa hindi matatag na lugar",
            "I-report agad ang landslide sa iyong barangay o MGB",
            "Bantayan ang baha na kadalasang sumusunod sa landslide",
            "Huwag gamitin ang kalsadang sinira ng guho hanggang opisyal na naimbestigahan",
          ],
        },
        road: {
          signal: "LTO / MMDA Traffic Alert",
          before: [
            "Palaging magsuot ng seatbelt \u2014 harap at likod na pasahero",
            "Huwag mag-text o gumamit ng telepono habang nagmamaneho; gamitin ang hands-free kung kailangan",
            "Magsagawa ng simpleng pagsusuri sa sasakyan bago ang malayong biyahe: gulong, preno, ilaw, likido",
            "Sundin ang speed limit; iakma ang bilis sa panahon, trapiko, at kondisyon ng kalsada",
            "Huwag magmaneho kung nakainom o antok",
            "Maghanda ng roadside emergency kit: triangle reflector, jumper cable, first aid",
          ],
          during: [
            "Manatiling kalmado \u2014 suriin ang sarili at pasahero para sa pinsala bago gumalaw",
            "Buksan ang hazard lights at ilagay ang triangle reflector sa ligtas na distansya",
            "Tumawag agad sa 911 kung may sugatan; huwag igalaw ang sugatan maliban kung may agarang panganib",
            "Alisin ang sasakyan sa daloy ng trapiko kung ligtas at walang sugatan",
            "Huwag mag-away tungkol sa kasalanan sa eksena \u2014 mag-dokumento na lang gamit ang litrato",
          ],
          after: [
            "Makipagtulungan sa mga tumutugon na awtoridad at ibigay ang lisensya at rehistrasyon",
            "Humingi ng medical evaluation kahit maayos ang pakiramdam \u2014 maaaring maantala ang pinsala",
            "Magsampa ng incident report sa pinakamalapit na himpilan ng pulis sa loob ng 24 oras",
            "Ipaalam sa insurance company sa lalong madaling panahon",
            "Kontakin ang LTO para sa mga proseso sa pinsala ng sasakyan at dokumentasyon ng insidente",
          ],
        },
      },
    },'''
},
"ceb": {
  "gobag_anchor": '      goBag: { tabLabel: "Go Bag", titleStart: "Imong", titleAccent: "Go Bag", titleEnd: "Checklist", sub: "Andama ang 20 ka importanteng butang aron makagawas nga luwas sulod sa 15 minutos. Markahi ang mga naandam na nimo.", itemsPacked: "ka butang naandam na", resetBtn: "I-reset ang checklist" },',
  "gobag_new": '''      goBag: {
        tabLabel: "Go Bag", titleStart: "Imong", titleAccent: "Go Bag", titleEnd: "Checklist",
        sub: "Andama ang 20 ka importanteng butang aron makagawas nga luwas sulod sa 15 minutos. Markahi ang mga naandam na nimo.",
        itemsPacked: "ka butang naandam na", resetBtn: "I-reset ang checklist",
        itemLabels: [
          "3 ka adlaw nga suplay sa tubig (1 galon/tawo/adlaw)", "Pagkaon nga dili daling madunot (3 ka adlaw nga suplay)", "Manual nga abrelata",
          "First aid kit nga adunay manual", "7 ka adlaw nga suplay sa gireseta nga tambal", "Extra nga salamin sa mata o contact lens supplies",
          "Kopya sa mga ID ug importanteng dokumento", "Naka-print nga listahan sa emergency contacts", "Kwarta sa gagmayng denominasyon",
          "Flashlight nga adunay extra nga baterya", "Radyo nga de-baterya o hand-crank", "Multi-tool o Swiss Army knife", "Pito para sa pag-signal og tabang",
          "Ilis nga sinina para sa matag miyembro sa pamilya", "Lig-on nga sapatos nga sirado ang tumoy", "Rain poncho o waterproof nga jacket",
          "Gaan nga emergency blanket", "Dust mask o N95 respirator",
          "Fully charged nga power bank", "Lokal nga hazard map ug evacuation route",
        ],
      },''',
  "categories_anchor": '      categories: { all: "Tanan", waterFood: "Tubig ug Pagkaon", medical: "Medikal", documents: "Mga Dokumento", tools: "Galamiton", clothing: "Sinina", shelter: "Puy-anan", communication: "Komunikasyon" },\n    },',
  "categories_new_suffix": '''      categories: { all: "Tanan", waterFood: "Tubig ug Pagkaon", medical: "Medikal", documents: "Mga Dokumento", tools: "Galamiton", clothing: "Sinina", shelter: "Puy-anan", communication: "Komunikasyon" },
      disasterData: {
        typhoon: {
          signal: "PAGASA Signal Blg. 1\u20135",
          before: [
            "Pagtigom og dili moubos sa 3 ka adlaw nga pagkaon, tubig, ug tambal",
            "I-secure o dad-a sa sulod ang naluag nga butang sa gawas (muwebles, kolon, signage)",
            "Palig-ona ang mga bintana ug pultahan gamit ang tape o tabla",
            "I-charge ang tanang device ug power bank sa dili pa ang bagyo",
            "Hibaloi ang imong evacuation route ug pinakaduol nga evacuation center",
            "Putla ang mga sanga sa kahoy duol sa balay nga mahimong mahulog sa atop",
          ],
          during: [
            "Pabilin sa sulod, layo sa mga bintana ug salamin nga pultahan",
            "Ayaw pagawas sa panahon nga naa sa mata sa bagyo \u2014 muabot ang ikaduhang eyewall",
            "Likayi ang gibahaan nga dalan; 6 ka pulgada nga nagdagayday nga tubig makatumba kanimo",
            "Ayaw paggamit og generator sa sulod \u2014 makamatay ang carbon monoxide",
            "Bantayi ang mga update sa PAGASA gamit ang de-baterya nga radyo",
          ],
          after: [
            "Susiha ang estruktural nga kadaot sa dili pa mosulod pag-usab sa imong balay",
            "Likayi ang nahulog nga linya sa kuryente \u2014 atimana kini nga buhi",
            "Gamita ang bote o pinabukalang tubig; ang baha makadaot sa tubo sa tubig",
            "I-dokumento ang kadaot pinaagi sa litrato para sa insurance claim",
            "Tabangi ang vulnerable nga silingan: tigulang, bata, PWD",
          ],
        },
        flood: {
          signal: "NDRRMC Flood Advisory",
          before: [
            "Ipataas ang importanteng dokumento, appliances, ug muwebles",
            "Hibaloi ang lebel sa imong flood zone \u2014 konsultaha ang hazard map sa barangay",
            "Andama kanunay ang emergency kit ug go bag",
            "Mag-install og check valve sa tubero para malikayan ang sewage backflow",
            "I-tino ang luwas nga tigomanan sa itaas sa flood zone alang sa pamilya",
          ],
          during: [
            "Dayon nga limpyo kung mag-utos ang mga awtoridad \u2014 ayaw paghulat",
            "Ayaw paglakaw o pagmaneho sa baha; 12 ka pulgada makadala og sakyanan",
            "Patya ang utilities sa main switch kung gisugo ug luwas himoon",
            "Likayi ang pagkontak sa baha \u2014 mahimong adunay hugaw ug kemikal kini",
            "Balhin sa pinakataas nga andana, dili sa attic, aron makaikyas ka",
          ],
          after: [
            "Balik lang sa balay kung ideklarar sa awtoridad nga luwas na",
            "Pagsul-ob og rubber boots ug gloves samtang naglimpyo \u2014 peligro sa panglawas",
            "Ilabay ang pagkaon nga nadikit sa baha \u2014 ayaw kini panganibon",
            "Susiha ang pagtubo sa amag ug ayo nga bentilasyon",
            "I-report sa barangay ang guba nga imprastruktura (dalan, tulay)",
          ],
        },
        fire: {
          signal: "BFP Fire Alert",
          before: [
            "Mag-install og gilihok nga smoke detector sa matag andana ug testingi matag bulan",
            "Paghimo ug pagpraktis og home fire escape plan nga adunay duha ka labasan matag kwarto",
            "Pagbutang og dry chemical fire extinguisher sa kusina ug hibaloi kini gamiton",
            "Ayaw pasagdi nga walay tan-aw ang pagluto, kandila, o katol",
            "Itago ang nasunog nga materyal (LPG, gasolina) layo sa init",
            "Susiha ang electrical wiring \u2014 overloaded nga socket usa sa panguna nga hinungdan sa sunog",
          ],
          during: [
            "Gawas dayon \u2014 AYAW paghunong para mangolekta og mga gamit",
            "Kamang og ubos sa aso; mas limpyo ang hangin duol sa salog",
            "Sa dili pa moabli og pultahan, hikapa kini gamit ang likod sa kamot \u2014 init nagpasabot naa'y kalayo sa laing bahin",
            "Sirad-i ang mga pultahan sa imong likod aron mohinay ang pagkatag sa kalayo",
            "Tawagi ang 911 kung luwas na ka sa gawas \u2014 dili gikan sa sulod",
            "Kung nasilo, taphi ang gaps sa pultahan gamit ang panapton ug pag-signal gikan sa bintana",
          ],
          after: [
            "Ayaw pagsulod pag-usab sa nasunog nga building hangtod ideklarar nga luwas sa fire officials",
            "Kontaka ang lokal nga opisina sa BFP para sa imbestigasyon ug dokumentasyon",
            "Pangayo og medical nga tabang para sa paglanghap og aso bisan maayo ang gibati",
            "Bantayi ang natirang baga nga mahimong mosiga pag-usab paglabay sa mga oras",
            "Kontaka ang Red Cross o DSWD para sa emergency assistance",
          ],
        },
        earthquake: {
          signal: "PHIVOLCS Intensity Scale",
          before: [
            "I-secure ang bug-at nga muwebles (bookshelf, cabinet) sa bungbong gamit ang straps",
            "Ibutang ang bug-at nga butang sa ubos nga estante; salamin ug daling mabuak sa naka-secure nga cabinet",
            "I-tino ang luwas nga lugar sa matag kwarto: ilawom sa lig-on nga lamesa, batok sa interior nga bungbong",
            "Hibaloi kung unsaon pagpatay ang gas, tubig, ug kuryente sa main valve",
            "Pag-andam og earthquake kit lakip ang tubig, pagkaon, flashlight, first aid",
            "Pagpraktis og DROP, COVER, HOLD ON uban ang tanang miyembro sa panimalay",
          ],
          during: [
            "DROP sa mga kamot ug tuhod dayon \u2014 proteksyon batok sa pagkatumba",
            "COVER ang imong ulo ug liog ilawom sa lig-on nga lamesa o batok sa interior nga bungbong",
            "HOLD ON hangtod mohunong ang pag-uyog \u2014 pabilin sa posisyon",
            "Layo sa mga bintana, gawas nga bungbong, ug bisan unsa nga mahimong mahulog",
            "Kung sa gawas, layo sa mga building, kahoy, poste sa suga, ug linya sa kuryente",
            "Kung sa sakyanan, hunong sa kilid, layo sa overpass, ug pag-amping sa paghunong",
          ],
          after: [
            "Damha ang mga aftershock \u2014 mahimong kusog kini; buhata pag-usab ang DROP-COVER-HOLD ON",
            "Susiha ang imong kaugalingon ug uban pa alang sa kasamok sa dili pa molihok",
            "Simhota kung adunay gas leak \u2014 kung naa, ablihi ang mga bintana ug gawas dayon",
            "Gamita ang text message imbes tawag; overload ang network human sa linog",
            "Susiha sa PHIVOLCS ug lokal nga awtoridad sa dili pa mobalik sa nadaot nga estruktura",
          ],
        },
        landslide: {
          signal: "MGB Landslide Advisory",
          before: [
            "Hibaloi kung ang imong komunidad naa sa landslide-prone zone (konsultaha ang barangay)",
            "Bantayi ang mga timailhan: liki sa yuta o bungbong, nagtikiling nga kahoy, katingalahang tingog",
            "Ayaw pagtukod o pagpuyo sa titib nga bakilid, sa tiilan sa lugot, o duol sa suba",
            "Pagtanom og lawom ang gamut nga tanom sa mga bakilid libot sa imong propyedad",
            "Limpyoha ang drainage channel aron malikayan ang pagpundo sa tubig sa bakilid",
            "Pag-andam og ruta sa paglikas paingon sa mas taas nga dapit, layo sa bakilid",
          ],
          during: [
            "Palayo dayon sa agianan sa landslide \u2014 adto sa kilid, dili diretso",
            "Kung imposible ang pag-ikyas, pilo ang lawas ug protektahi ang ulo",
            "Paminaw sa katingalahang tingog: naguba nga kahoy, nagbanggaay nga bato \u2014 sayo nga pasidaan",
            "Likayi ang mga walog ug ubos nga dapit duol sa gigikanan sa guba",
            "Kung nagmaneho, bantayi ang nagub-a nga dalan, lapok, o debris sa dalan",
          ],
          after: [
            "Palayo sa dapit sa guba \u2014 mahimong adunay dugang nga guba",
            "Susiha ang nasamdan ug nasilo apan ayaw pagsulod sa dili lig-on nga dapit",
            "I-report dayon ang landslide sa imong barangay o MGB",
            "Bantayi ang baha nga kasagarang mosunod sa landslide",
            "Ayaw gamita ang dalan nga nadaot sa guba hangtod opisyal nga na-inspeksyon",
          ],
        },
        road: {
          signal: "LTO / MMDA Traffic Alert",
          before: [
            "Kanunay magsul-ob og seatbelt \u2014 atubang ug likod nga pasahero",
            "Ayaw pag-text o paggamit og telepono samtang nagmaneho; gamita ang hands-free kung kinahanglan",
            "Buhata ang simple nga check sa sakyanan sa dili pa ang layo nga biyahe: goma, preno, suga, tubig",
            "Sunda ang speed limit; iangay ang tulin sa panahon, trapiko, ug kondisyon sa dalan",
            "Ayaw pagmaneho kung nakainom o tulogon",
            "Andama ang roadside emergency kit: triangle reflector, jumper cable, first aid",
          ],
          during: [
            "Pabilin nga kalmado \u2014 susiha ang imong kaugalingon ug pasahero alang sa samad sa dili pa molihok",
            "Sindihi ang hazard lights ug ibutang ang triangle reflector sa luwas nga distansya",
            "Tawagi dayon ang 911 kung adunay nasamdan; ayaw ilihok ang nasamdan gawas kung adunay dinalian nga peligro",
            "Kuhaa ang sakyanan gikan sa trapiko kung luwas ug walay nasamdan",
            "Ayaw pagbahin bahin bahin mahitungod sa sayop sa eksena \u2014 i-dokumento na lang gamit ang litrato",
          ],
          after: [
            "Pakigtambayayong sa mga nitubag nga awtoridad ug ihatag ang imong lisensya ug rehistro",
            "Pangayo og medical evaluation bisan maayo ang gibati \u2014 mahimong maglangan ang samad",
            "Pagsumite og incident report sa pinakaduol nga estasyon sa pulis sulod sa 24 ka oras",
            "Pahibaloa ang imong insurance company sa labing sayo nga panahon",
            "Kontaka ang LTO para sa mga proseso sa kadaot sa sakyanan ug dokumentasyon sa insidente",
          ],
        },
      },
    },'''
},
}

for code, cfg in LANGS.items():
    tr = must_replace_once(tr, cfg["gobag_anchor"], cfg["gobag_new"], f"[{code}] goBag object")
    tr = must_replace_once(tr, cfg["categories_anchor"], cfg["categories_new_suffix"], f"[{code}] categories + disasterData insertion")

with open(translations_path, "w", encoding="utf-8") as f:
    f.write(tr)
print(f"Patched: {translations_path}")

print("\nAll patches applied successfully (en, tl, ceb).")
print("Korean / Chinese / Japanese / Russian / Arabic disasterData still need to be added —")
print("ask for the follow-up script once you've verified this one.")
PYEOF

echo ""
echo "Done. If anything looks wrong, restore with:"
echo "  mv '$TRANSLATIONS.bak' '$TRANSLATIONS'"
echo "  mv '$SAFETY_PAGE.bak' '$SAFETY_PAGE'"
