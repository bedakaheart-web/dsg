// src/citizen/CitizenSafetyTips.tsx
//
// Embedded (modal) version of the public SafetyTips page, rebuilt after the
// original file was accidentally deleted. Logic, data, and styling are
// carried over from src/pages/SafetyTips.tsx so behavior stays identical —
// this version just drops the standalone-page chrome (it's rendered inside
// CitizenDashboard's modal, which already provides the close button and
// scroll container).
import { useState, useEffect } from "react";
import safetyTipsBg from "../assets/safetytips.jpg";
import { useLanguage } from "../context/LanguageContext";
import {
  DISASTER_TIPS_BY_LANG,
  GO_BAG_BY_LANG,
  STEPS_TITLE_BY_LANG,
} from "./safetyTipsI18n";

// Languages whose disaster-tip and go-bag arrays live in the translation
// dictionary (resolved via tList). Every other active code resolves from
// safetyTipsI18n.ts tables — tList() would otherwise silently inherit the
// English arrays via its en-fallback. Add codes here if the dictionary gains
// disasterDetails/goBagItems coverage for them.
const DICT_COVERED_LANGS = new Set(["en", "tl", "ko"]);

const GO_BAG_ITEMS = [
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
];

// ── Tagalog (tl) labels for the Go-Bag checklist, index-aligned with GO_BAG_ITEMS. ──
// Used as the language-aware fallback when `safetyTips.goBagItems` has no translation.
const GO_BAG_LABELS_TL: string[] = [
  "3-araw na supply ng tubig (1 galon bawat tao bawat araw)",
  "Pagkaing hindi madaling masira (pang 3 araw)",
  "Manu-manong pambukas ng lata",
  "First aid kit na may manual",
  "7-araw na supply ng reseta na gamot",
  "Ekstrang salamin o contact lens supplies",
  "Mga kopya ng ID at mahahalagang dokumento",
  "Nakalimbag na listahan ng emergency contact",
  "Cash sa maliliit na halaga",
  "Flashlight na may ekstrang baterya",
  "Radyong de-baterya o de-pihit",
  "Multi-tool o Swiss Army knife",
  "Pito para humingi ng tulong",
  "Pamalit na damit bawat miyembro ng pamilya",
  "Matibay na sapatos na sarado",
  "Kapote o waterproof na jacket",
  "Magaan na emergency blanket",
  "Dust mask o N95 respirator",
  "Fully charged na power bank",
  "Mapa ng panganib at ruta ng evacuation",
];

// ── Tagalog (tl) fallbacks for disaster tips, keyed by disaster id + phase. ──
// Used only when `tList(safetyTips.disasterDetails.<labelKey>.<phase>)` fails
// or returns an empty array while the navbar language is Tagalog.
const DISASTER_TIPS_TL: Record<string, { before: string[]; during: string[]; after: string[] }> = {
  typhoon: {
    before: [
      "Mag-imbak ng pagkain, tubig, at gamot na tatagal ng hindi bababa sa 3 araw.",
      "Iseguro o ipasok sa loob ang mga maluwag na gamit sa labas (kasangkapan, halaman, signage).",
      "Patibayin ang mga bintana at pinto gamit ang tape o kahoy.",
      "I-charge ang lahat ng device at power bank bago dumating ang bagyo.",
      "Alamin ang inyong evacuation route at ang pinakamalapit na evacuation center.",
      "Putulin ang mga sanga ng puno na malapit sa inyong bubong.",
    ],
    during: [
      "Manatili sa loob ng bahay at lumayo sa mga bintana at salaming pinto.",
      "Huwag lumabas habang nasa mata ng bagyo — parating pa ang ikalawang eyewall.",
      "Iwasan ang mga binahang kalsada; ang 6 na pulgadang umaagos na tubig ay kayang magpatumba.",
      "Huwag gumamit ng generator sa loob ng bahay — nakamamatay ang carbon monoxide.",
      "Subaybayan ang mga update ng PAGASA gamit ang radyong de-baterya.",
    ],
    after: [
      "Suriin ang pinsala sa bahay bago muling pumasok.",
      "Iwasan ang mga naputol na kawad ng kuryente — ituring ang mga ito na buhay.",
      "Gumamit ng de-boteng o pinakuluang tubig; kontaminado ang mga tubo matapos ang baha.",
      "Kunan ng litrato ang pinsala para sa insurance claims.",
      "Tulungan ang mga nangangailangan: matatanda, bata, at PWD.",
    ],
  },
  flood: {
    before: [
      "Itaas ang mahahalagang dokumento, appliances, at kasangkapan.",
      "Alamin ang flood zone level sa inyong lugar — sumangguni sa hazard map ng barangay.",
      "Panatilihing handa ang emergency kit at go bag sa lahat ng oras.",
      "Maglagay ng check valve sa tubo upang maiwasan ang pag-apaw ng dumi.",
      "Tukuyin ang ligtas na tagpuan ng pamilya na mas mataas sa flood zone.",
    ],
    during: [
      "Lumikas agad kapag nag-utos ang mga awtoridad — huwag maghintay.",
      "Huwag maglakad o magmaneho sa baha; ang 12 pulgada ay kayang magpatangay ng sasakyan.",
      "Patayin ang kuryente sa main switch kung inutos at kung ligtas gawin.",
      "Iwasang madikit sa tubig-baha — maaaring may dumi at kemikal ito.",
      "Pumunta sa pinakamataas na palapag, hindi sa attic, upang makalabas kung kailangan.",
    ],
    after: [
      "Umuwi lamang kapag idineklarang ligtas ng mga awtoridad.",
      "Magsuot ng bota at guwantes sa paglilinis — panganib sa kalusugan.",
      "Itapon ang pagkaing nadikit sa baha — huwag makipagsapalaran.",
      "Suriin ang amag at maayos na magpahangin.",
      "I-report ang nasirang imprastraktura (kalsada, tulay) sa inyong barangay.",
    ],
  },
  fire: {
    before: [
      "Maglagay ng gumaganang smoke detector sa bawat palapag at subukan buwanan.",
      "Gumawa at magsanay ng fire escape plan na may dalawang labasan bawat kuwarto.",
      "Magtabi ng dry chemical fire extinguisher sa kusina at alamin ang paggamit nito.",
      "Huwag iwang walang bantay ang niluluto, kandila, o katol.",
      "Ilayo ang mga madaling masunog (LPG, gasolina) sa init.",
      "Suriin ang mga kable ng kuryente — ang overloaded na saksakan ay pangunahing sanhi ng sunog.",
    ],
    during: [
      "Lumabas agad — HUWAG nang mag-aksaya ng oras sa pagkuha ng gamit.",
      "Gumapang nang mababa sa ilalim ng usok; mas malinis ang hangin sa sahig.",
      "Bago buksan ang pinto, kapain ito gamit ang likod ng kamay — kapag mainit ay may apoy sa kabila.",
      "Isara ang mga pinto upang mapabagal ang pagkalat ng apoy.",
      "Tumawag sa 911 kapag nasa labas ka na — huwag mula sa loob.",
      "Kung na-trap, takpan ng tela ang siwang ng pinto at sumenyas mula sa bintana.",
    ],
    after: [
      "Huwag pumasok sa nasunog na gusali hangga't hindi ito nililinis ng BFP.",
      "Makipag-ugnayan sa lokal na BFP para sa imbestigasyon at dokumentasyon.",
      "Magpatingin sa doktor kahit maayos ang pakiramdam matapos malanghap ang usok.",
      "Magbantay sa mga natatagong baga na maaaring muling magliyab.",
      "Makipag-ugnayan sa Red Cross o DSWD para sa emergency assistance.",
    ],
  },
  earthquake: {
    before: [
      "Itali sa dingding ang mabibigat na kasangkapan (bookshelf, cabinet).",
      "Ilagay ang mabibigat na gamit sa mababang istante; ang babasagin ay sa nakasarang kabinet.",
      "Tukuyin ang ligtas na lugar sa bawat kuwarto: sa ilalim ng matibay na mesa, sa tabi ng interior wall.",
      "Alamin kung paano patayin ang gas, tubig, at kuryente sa main valve.",
      "Maghanda ng earthquake kit na may tubig, pagkain, flashlight, at first aid.",
      "Magsanay ng DROP, COVER, HOLD ON kasama ang buong pamilya.",
    ],
    during: [
      "DROP agad — lumuhod upang hindi matumba.",
      "COVER ang ulo at leeg sa ilalim ng matibay na mesa o laban sa interior wall.",
      "HOLD ON hanggang tumigil ang pagyanig — manatili sa puwesto.",
      "Lumayo sa mga bintana, panlabas na dingding, at anumang maaaring mahulog.",
      "Kung nasa labas, lumayo sa mga gusali, puno, poste, at kawad ng kuryente.",
      "Kung nasa sasakyan, huminto nang malayo sa overpass at maingat na huminto.",
    ],
    after: [
      "Asahan ang aftershocks — maaaring malakas; muling gawin ang DROP-COVER-HOLD ON.",
      "Suriin ang sarili at ang iba kung may sugat bago gumalaw.",
      "Amuyin kung may tagas ng gas — kung meron, buksan ang bintana at umalis agad.",
      "Gumamit ng text sa halip na tawag; punuan ang network matapos ang lindol.",
      "Sundin ang PHIVOLCS at lokal na awtoridad bago bumalik sa nasirang gusali.",
    ],
  },
  landslide: {
    before: [
      "Alamin kung ang inyong komunidad ay nasa landslide-prone zone (sumangguni sa barangay).",
      "Obserbahan ang mga babala: bitak sa lupa o dingding, nakatagilid na puno, kakaibang tunog.",
      "Huwag magtayo o tumira sa matatarik na dalisdis, paanan ng bangin, o malapit sa ilog.",
      "Magtanim ng malalalim ang ugat na halaman sa mga dalisdis.",
      "Linisin ang mga kanal upang maiwasan ang pag-ipon ng tubig sa dalisdis.",
      "Maghanda ng evacuation route patungo sa mataas na lugar na malayo sa dalisdis.",
    ],
    during: [
      "Lumayo agad sa dadaanan ng landslide — gumilid nang pahalang, hindi patuwid.",
      "Kung hindi makatakas, yumuko at protektahan ang ulo.",
      "Makinig sa kakaibang tunog: nababaling puno, gumugulong na bato — maagang babala.",
      "Iwasan ang mga lambak at mabababang lugar malapit sa pinagmulan ng guho.",
      "Kung nagmamaneho, magbantay sa gumuho o maputik na kalsada.",
    ],
    after: [
      "Lumayo sa lugar ng guho — maaaring may kasunod pang pagguho.",
      "Tingnan kung may sugatan ngunit huwag pumasok sa hindi matatag na lugar.",
      "I-report agad ang landslide sa barangay o MGB.",
      "Magbantay sa pagbaha na karaniwang sumusunod sa landslide.",
      "Huwag gamitin ang mga kalsadang nasira hangga't hindi naiinspeksyon.",
    ],
  },
  road: {
    before: [
      "Laging magsuot ng seatbelt — harap man o likod.",
      "Huwag mag-text o gumamit ng telepono habang nagmamaneho; gumamit ng hands-free kung kailangan.",
      "Suriin ang sasakyan bago bumiyahe nang malayo: gulong, preno, ilaw, fluids.",
      "Sundin ang speed limit; ibagay ang bilis sa panahon, trapiko, at kalsada.",
      "Huwag magmaneho nang nakainom o inaantok.",
      "Magtabi ng roadside emergency kit: triangle reflector, jumper cable, first aid.",
    ],
    during: [
      "Huminahon — suriin ang sarili at pasahero kung may sugat bago gumalaw.",
      "Buksan ang hazard lights at maglagay ng triangle reflector sa ligtas na distansya.",
      "Tumawag agad sa 911 kung may sugatan; huwag igalaw ang sugatan maliban kung may agarang panganib.",
      "Igilid ang sasakyan kung ligtas at kung walang sugatan.",
      "Huwag makipagtalo tungkol sa kasalanan — kunan na lang ng litrato.",
    ],
    after: [
      "Makipagtulungan sa rumespondeng awtoridad at ibigay ang lisensya at rehistro.",
      "Magpatingin sa doktor kahit maayos ang pakiramdam — maaaring mahuli ang sintomas.",
      "Mag-file ng incident report sa pinakamalapit na police station sa loob ng 24 oras.",
      "Abisuhan agad ang insurance company.",
      "Makipag-ugnayan sa LTO para sa proseso sa pinsala ng sasakyan at dokumentasyon.",
    ],
  },
};
// ── Maps each internal (English) category key to a translation key. ──
// The GO_BAG_ITEMS category values above stay in English on purpose —
// they're used for filter matching logic, decoupled from the displayed label.
const CATEGORY_KEY_MAP: Record<string, string> = {
  "Water & Food": "waterFood",
  "Medical": "medical",
  "Documents": "documents",
  "Tools": "tools",
  "Clothing": "clothing",
  "Shelter": "shelter",
  "Communication": "communication",
};

interface HotlineEntry {
  label: string;
  number: string;
}

const DISASTERS = [
  {
    id: "typhoon", labelKey: "typhoon", emoji: "🌀",
    color: "#60A5FA", colorDim: "rgba(96,165,250,0.08)", colorBorder: "rgba(96,165,250,0.22)",
    colorRgb: "96,165,250", signal: "PAGASA Signal Updates",
    hotlines: [
      { label: "1550 (PAGASA)", number: "1550" },
      { label: "911",           number: "911"  },
    ] as HotlineEntry[],
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
      "Do not go outside during the eye of the storm — the second eyewall is coming",
      "Avoid flooded roads; 6 inches of moving water can knock you down",
      "Do not use generators indoors — carbon monoxide is lethal",
      "Monitor PAGASA updates via battery-powered radio",
    ],
    after: [
      "Check for structural damage before re-entering your home",
      "Avoid downed power lines — treat them as live",
      "Use bottled or boiled water; floodwaters contaminate pipes",
      "Document damage with photos for insurance claims",
      "Help vulnerable neighbors: elderly, children, PWDs",
    ],
  },
  {
    id: "flood", labelKey: "flood", emoji: "🌊",
    color: "#38BDF8", colorDim: "rgba(56,189,248,0.08)", colorBorder: "rgba(56,189,248,0.22)",
    colorRgb: "56,189,248", signal: "NDRRMC Flood Advisory",
    hotlines: [
      { label: "911",    number: "911"        },
      { label: "NDRRMC", number: "028911506"  },
    ] as HotlineEntry[],
    before: [
      "Elevate important documents, appliances, and furniture",
      "Know your flood zone level — consult your barangay hazard map",
      "Keep an emergency kit and go bag ready at all times",
      "Install check valves in plumbing to prevent sewage backflow",
      "Identify a safe meeting place above the flood zone for your family",
    ],
    during: [
      "Evacuate immediately when authorities issue an order — don't wait",
      "Never walk or drive through floodwater; 12 inches can sweep a car",
      "Turn off utilities at main switches if instructed and safe to do so",
      "Avoid contact with floodwater — it may contain sewage and chemicals",
      "Move to the highest floor, not the attic, where you can escape if needed",
    ],
    after: [
      "Return home only when authorities declare it safe",
      "Wear rubber boots and gloves when cleaning — health hazard",
      "Discard food that contacted floodwater — do not risk it",
      "Check for mold growth and ventilate thoroughly",
      "Report damaged infrastructure (roads, bridges) to your barangay",
    ],
  },
  {
    id: "fire", labelKey: "fire", emoji: "🔥",
    color: "#FB923C", colorDim: "rgba(251,146,60,0.08)", colorBorder: "rgba(251,146,60,0.22)",
    colorRgb: "251,146,60", signal: "BFP Fire Alert",
    hotlines: [
      { label: "BFP", number: "160" },
      { label: "911", number: "911" },
    ] as HotlineEntry[],
    before: [
      "Install working smoke detectors on every floor and test monthly",
      "Create and practice a home fire escape plan with two exits per room",
      "Keep a dry chemical fire extinguisher in the kitchen and know how to use it",
      "Never leave cooking, candles, or mosquito coils unattended",
      "Store flammable materials (LPG, gasoline) away from heat sources",
      "Check electrical wiring — overloaded sockets are a leading fire cause",
    ],
    during: [
      "Get out immediately — do NOT stop to collect belongings",
      "Crawl low under smoke; cleaner air is near the floor",
      "Before opening a door, feel it with the back of your hand — hot means fire on the other side",
      "Close doors behind you to slow the spread of fire",
      "Call 911 once you are safely outside — never from inside",
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
  {
    id: "earthquake", labelKey: "earthquake", emoji: "🌍",
    color: "#A78BFA", colorDim: "rgba(167,139,250,0.08)", colorBorder: "rgba(167,139,250,0.22)",
    colorRgb: "167,139,250", signal: "PHIVOLCS Intensity Scale",
    hotlines: [
      { label: "PHIVOLCS", number: "028426146" },
      { label: "911",      number: "911"       },
    ] as HotlineEntry[],
    before: [
      "Secure heavy furniture (bookshelves, cabinets) to walls with straps",
      "Store heavy items on lower shelves; glass and breakables in secured cabinets",
      "Identify safe spots in each room: under sturdy tables, against interior walls",
      "Know how to shut off gas, water, and electricity at the main valves",
      "Prepare an earthquake kit including water, food, flashlight, first aid",
      "Practice DROP, COVER, HOLD ON with all household members",
    ],
    during: [
      "DROP to hands and knees immediately — protects from being knocked down",
      "COVER your head and neck under a sturdy table or desk, or against an interior wall",
      "HOLD ON until the shaking stops — stay in position",
      "Stay away from windows, exterior walls, and anything that can fall",
      "If outdoors, move away from buildings, trees, streetlights, and power lines",
      "If in a vehicle, pull over away from overpasses and stop carefully",
    ],
    after: [
      "Expect aftershocks — they can be strong; apply DROP-COVER-HOLD ON again",
      "Check yourself and others for injuries before moving",
      "Smell for gas leaks — if detected, open windows and leave immediately",
      "Use text messages rather than calls; networks are overloaded after quakes",
      "Check PHIVOLCS and local authorities before returning to damaged structures",
    ],
  },
  {
    id: "landslide", labelKey: "landslide", emoji: "⛰️",
    color: "#86EFAC", colorDim: "rgba(134,239,172,0.08)", colorBorder: "rgba(134,239,172,0.22)",
    colorRgb: "134,239,172", signal: "MGB Landslide Advisory",
    hotlines: [
      { label: "MGB", number: "029295767" },
      { label: "911", number: "911"       },
    ] as HotlineEntry[],
    before: [
      "Know if your community is in a landslide-prone zone (consult your barangay)",
      "Observe warning signs: cracks in ground or walls, tilting trees, unusual sounds",
      "Do not build or live on steep slopes, at canyon bases, or near river channels",
      "Plant deep-rooted vegetation on slopes around your property",
      "Clear drainage channels to prevent water buildup on slopes",
      "Prepare an evacuation route to higher ground away from slopes",
    ],
    during: [
      "Move away from the landslide path immediately — go perpendicular, not straight",
      "If escape is impossible, curl into a ball and protect your head",
      "Listen for unusual sounds: snapping trees, boulders knocking — early warning",
      "Avoid valleys and low-lying areas near the source of a slide",
      "If driving, watch for collapsed pavement, mud, or debris flows on roads",
    ],
    after: [
      "Stay away from the slide area — additional slides are likely",
      "Check for injured and trapped persons but do not enter unstable areas",
      "Report the landslide to your barangay or MGB immediately",
      "Watch for flooding which often follows landslides",
      "Do not use roads damaged by slides until officially inspected",
    ],
  },
  {
    id: "road", labelKey: "road", emoji: "🚗",
    color: "#FCD34D", colorDim: "rgba(252,211,77,0.08)", colorBorder: "rgba(252,211,77,0.22)",
    colorRgb: "252,211,77", signal: "LTO / MMDA Traffic Alert",
    hotlines: [
      { label: "PNP",  number: "117" },
      { label: "MMDA", number: "136" },
      { label: "911",  number: "911" },
    ] as HotlineEntry[],
    before: [
      "Always wear a seatbelt — front and rear passengers",
      "Never text or use a phone while driving; use hands-free if necessary",
      "Conduct a simple vehicle check before long trips: tires, brakes, lights, fluids",
      "Observe speed limits; adjust speed for weather, traffic, and road conditions",
      "Never drive under the influence of alcohol or drowsiness",
      "Keep a roadside emergency kit: triangle reflectors, jumper cables, first aid",
    ],
    during: [
      "Stay calm — assess yourself and passengers for injuries before moving",
      "Turn on hazard lights and place triangle reflectors at safe distance",
      "Call 911 immediately if there are injuries; do not move injured persons unless there is immediate danger",
      "Move vehicles out of traffic if safe and if there are no injuries",
      "Do not argue about fault at the scene — document with photos instead",
    ],
    after: [
      "Cooperate with responding authorities and provide your license and registration",
      "Seek medical evaluation even if you feel fine — injuries can be delayed",
      "File an incident report at the nearest police station within 24 hours",
      "Notify your insurance company as soon as possible",
      "Contact LTO for procedures on vehicle damage and road incident documentation",
    ],
  },
];

// Guaranteed fallback shown only if a disaster's phase has no tips at all
// (translation list empty AND the language-specific hardcoded array is empty).
// Kept language-aware so the UI never shows the wrong language when the
// navbar language selector switches between Tagalog and English.
const FALLBACK_TIPS_TL = [
  "Maghanda ng Go Bag na may pagkain, tubig, at emergency supplies.",
  "Makinig sa opisyal na balita mula sa PAGASA o sa inyong Barangay.",
  "I-charge ang mga mobile phone at power bank.",
  "Siguraduhing nakatali o nakatago ang mga gamit na pwedeng tangayin ng hangin.",
  "Alamin ang pinakamalapit na Evacuation Center sa inyong lugar.",
];

const FALLBACK_TIPS_EN = [
  "Prepare a Go Bag with food, water, and emergency supplies.",
  "Listen to official news from PAGASA or your Barangay.",
  "Charge your mobile phones and power banks.",
  "Make sure loose outdoor items are tied down or stored safely.",
  "Know the nearest Evacuation Center in your area.",
];

export default function CitizenSafetyTips() {
  // Consumes the active language context from the Navbar/Header selector.
  // Reading `language` here subscribes this component to context updates,
  // so any language change triggers an immediate re-render.
  const { language, t, tList } = useLanguage();
  const [activeTab,   setActiveTab]   = useState(0);
  const [activePhase, setActivePhase] = useState<"before" | "during" | "after">("before");
  const [checked,     setChecked]     = useState<Record<number, boolean>>({});
  const [bagFilter,   setBagFilter]   = useState("All");

  const PHASE_META = {
    before: { label: t("safetyTips.phases.beforeLabel", "Bago"), icon: "⚡", desc: t("safetyTips.phases.beforeDesc", "Maghanda nang maaga") },
    during: { label: t("safetyTips.phases.duringLabel", "Habang Nangyayari"), icon: "🔴", desc: t("safetyTips.phases.duringDesc", "Manatiling ligtas ngayon") },
    after:  { label: t("safetyTips.phases.afterLabel", "Pagkatapos"),  icon: "✅", desc: t("safetyTips.phases.afterDesc", "Bumangon nang ligtas") },
  };

  const toggleCheck = (id: number) =>
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));

  const checkedCount = Object.values(checked).filter(Boolean).length;
  const progress     = Math.round((checkedCount / GO_BAG_ITEMS.length) * 100);
  const categories   = ["All", ...Array.from(new Set(GO_BAG_ITEMS.map(i => i.category)))];
  const visibleItems = bagFilter === "All" ? GO_BAG_ITEMS : GO_BAG_ITEMS.filter(i => i.category === bagFilter);

  const categoryLabel = (cat: string) =>
    cat === "All"
      ? t("safetyTips.categories.all", "All")
      : t(`safetyTips.categories.${CATEGORY_KEY_MAP[cat] ?? "all"}`, cat);

  // Go-Bag item labels resolve in priority order:
  // 1) dictionary `safetyTips.goBagItems` (en/tl/ko via tList),
  // 2) per-language table in safetyTipsI18n.ts (ceb/ja/zh/es/ilo/ru/ar),
  // 3) legacy Tagalog fallback, 4) English label — so switching the navbar
  //    language selector re-renders every label immediately, never raw English
  //    by accident.
  const goBagTranslatedLabels = DICT_COVERED_LANGS.has(language) ? (tList("safetyTips.goBagItems") || []) : [];
  const goBagLabel = (item: { id: number; label: string }): string =>
    goBagTranslatedLabels[item.id - 1] ??
    GO_BAG_BY_LANG[language]?.[item.id - 1] ??
    (language === "tl" ? (GO_BAG_LABELS_TL[item.id - 1] ?? item.label) : item.label);

  const isGoBag  = activeTab === DISASTERS.length;
  const disaster = !isGoBag ? DISASTERS[activeTab] : null;

  type PhaseTip = string | { title?: string; text?: string };

  // Universal resolution chain — works for every active language code:
  // 1) Dictionary via tList() for dict-covered languages (en/tl/ko) — renders
  //    instantly on Navbar language change. Other codes skip tList because it
  //    would silently inherit the English arrays via its en-fallback.
  // 2) Multi-language lookup table (safetyTipsI18n.ts) for ceb/ja/zh/es/ilo/ru/ar.
  // 3) Legacy Tagalog table when `language === 'tl'`.
  // 4) Hardcoded English arrays — last resort only, never a primary path.
  // Defensive `|| []`: tList() is typed to always return an array, but this
  // guarantees `.map()`/`.length` below can never throw even if a future
  // dictionary refactor returns undefined for a missing path.
  const translatedTips = (disaster && DICT_COVERED_LANGS.has(language)
    ? tList(`safetyTips.disasterDetails.${disaster.labelKey}.${activePhase}`)
    : []) || [];
  const hardcodedTips: PhaseTip[] = disaster ? disaster[activePhase] : [];
  // Multi-language table lookup for codes without dictionary coverage.
  const tableTips: PhaseTip[] = disaster
    ? (DISASTER_TIPS_BY_LANG[language]?.[disaster.id]?.[activePhase] ?? [])
    : [];
  // Legacy Tagalog fallback (predates dictionary coverage; retained as safety net).
  const tlPhaseTips: PhaseTip[] = disaster ? (DISASTER_TIPS_TL[disaster.id]?.[activePhase] ?? []) : [];
  const localizedFallback: PhaseTip[] =
    tableTips.length ? tableTips
    : language === "tl"
      ? (tlPhaseTips.length ? tlPhaseTips : FALLBACK_TIPS_TL)
      : (hardcodedTips.length ? hardcodedTips : FALLBACK_TIPS_EN);
  const phaseTips: PhaseTip[] = translatedTips.length ? translatedTips : localizedFallback;
  const activePhaseObj = { tips: phaseTips };

  // Card title: per-language table override first (es/ilo have no dictionary
  // block), otherwise the dictionary stepsTitle shared by all 8 active codes.
  const stepsTitleText = STEPS_TITLE_BY_LANG[language] ?? t("safetyTips.stepsTitle", "Safety Steps");

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    const idx = DISASTERS.findIndex(d => d.id === hash);
    if (idx !== -1) setActiveTab(idx);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        .cst {
          min-height: 100%;
          font-family: 'Inter', sans-serif;
          color: #ddeef8;
          background: #07101d;
          position: relative;
          overflow-x: hidden;
        }

        .cst-bg { position: absolute; inset: 0; z-index: 0; overflow: hidden; }
        .cst-bg-img {
          width: 100%; height: 100%;
          object-fit: cover; object-position: center; display: block;
        }
        .cst-bg-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(
            180deg,
            rgba(7,16,29,0.88) 0%,
            rgba(7,16,29,0.82) 25%,
            rgba(7,16,29,0.70) 50%,
            rgba(7,16,29,0.85) 75%,
            rgba(7,16,29,0.96) 100%
          );
          pointer-events: none;
        }
        .cst-bg-atmosphere {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 60% 50% at 10% 0%,  rgba(232,55,42,0.09)  0%, transparent 65%),
            radial-gradient(ellipse 55% 60% at 90% 100%, rgba(0,200,224,0.07)  0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 55% 45%,  rgba(13,27,46,0.40)   0%, transparent 60%);
        }

        .cst-wrap {
          position: relative; z-index: 1;
          max-width: 1080px; margin: 0 auto;
          padding: 24px 28px 100px;
        }

        .cst-hero { margin-bottom: 40px; animation: fadeUp 0.5s ease both; }
        .cst-hero h1 {
          font-family: 'Poppins', sans-serif; font-size: clamp(30px, 4.5vw, 48px);
          font-weight: 700; line-height: 1.05; letter-spacing: -0.03em; color: #F8FAFC; margin-bottom: 16px;
        }
        .cst-hero h1 .accent { color: #A8D8FF; }
        .cst-hero-sub {
          font-family: 'Inter', sans-serif; font-size: 14.5px; font-weight: 300;
          color: rgba(160,200,224,0.60); max-width: 520px; line-height: 1.68;
        }

        .cst-tabs-wrap {
          position: sticky; top: 0; z-index: 20;
          background: rgba(7,16,29,0.92);
          backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(0,200,224,0.08);
          margin: 0 -28px 32px; padding: 0 28px;
        }
        .cst-tabs { display: flex; gap: 2px; overflow-x: auto; scrollbar-width: none; padding: 10px 0; }
        .cst-tabs::-webkit-scrollbar { display: none; }
        .cst-tab {
          flex-shrink: 0; display: flex; align-items: center; gap: 7px;
          font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 500;
          letter-spacing: .04em; padding: 8px 16px; border-radius: 9px;
          border: 1px solid transparent; cursor: pointer; transition: all .18s;
          color: rgba(160,200,224,0.30); background: transparent; min-height: 44px;
        }
        .cst-tab:hover { color: rgba(160,200,224,0.65); background: rgba(0,200,224,0.04); }
        .cst-tab.active { color: #ddeef8; background: rgba(13,27,46,0.72); border-color: rgba(0,200,224,0.18); }
        .cst-tab-emoji { font-size: 14px; }

        .cst-panel { animation: fadeUp .38s ease both; }

        .cst-panel-header-card {
          display: grid; grid-template-columns: 1fr auto;
          gap: 20px; align-items: center;
          background: rgba(13,27,46,0.72);
          border: 1px solid rgba(0,200,224,0.08);
          border-top: 2px solid var(--d-color);
          border-radius: 13px;
          padding: 22px 24px; margin-bottom: 18px;
          position: relative; overflow: hidden;
        }
        .cst-panel-header-card::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse 60% 100% at 0% 50%, rgba(var(--d-rgb),0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .cst-panel-title-group { display: flex; align-items: center; gap: 16px; }
        .cst-panel-icon {
          width: 50px; height: 50px; border-radius: 14px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center; font-size: 24px;
          background: var(--d-dim); border: 1px solid var(--d-border);
        }
        .cst-panel-name {
          font-family: 'Poppins', sans-serif; font-size: 22px; font-weight: 700;
          letter-spacing: -.03em; color: #ddeef8;
        }
        .cst-panel-signal {
          font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 500;
          letter-spacing: .16em; text-transform: uppercase;
          color: var(--d-color); margin-top: 5px; opacity: .75;
        }

        .cst-hotlines { display: flex; gap: 8px; flex-wrap: wrap; flex-shrink: 0; }
        .cst-hotline-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--d-dim); border: 1px solid var(--d-border);
          border-radius: 9px; padding: 10px 16px;
          font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600;
          color: var(--d-color); text-decoration: none;
          white-space: nowrap; cursor: pointer; min-height: 44px;
          transition: background 0.18s, transform 0.15s;
        }
        .cst-hotline-btn:hover { background: rgba(var(--d-rgb), 0.18); transform: translateY(-1px); }
        .cst-hotline-icon { font-size: 14px; flex-shrink: 0; }

        .cst-phases { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin-bottom: 22px; }
        .cst-phase-btn {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          flex-direction: column;
          font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 500;
          letter-spacing: .04em; padding: 14px 12px; border-radius: 13px;
          cursor: pointer; border: 1px solid rgba(0,200,224,0.08);
          background: rgba(13,27,46,0.72);
          color: rgba(160,200,224,0.30); transition: all .2s;
          position: relative; overflow: hidden; min-height: 44px;
        }
        .cst-phase-btn:hover { color: rgba(160,200,224,0.65); border-color: rgba(0,200,224,0.18); }
        .cst-phase-btn.active {
          background: var(--d-dim); border-color: var(--d-border); color: var(--d-color);
        }
        .cst-phase-icon { font-size: 18px; }
        .cst-phase-desc { font-size: 10px; font-weight: 300; opacity: .55; }

        .cst-tips-card {
          margin-top: 20px; padding: 22px 24px;
          background: rgba(15,23,42,0.90);
          border: 1px solid rgba(51,65,85,0.55);
          border-radius: 13px;
        }
        .cst-tips-title {
          font-family: 'Poppins', sans-serif; font-size: 16px; font-weight: 700;
          color: #34d399; margin-bottom: 14px;
          display: flex; align-items: center; gap: 8px;
        }
        .cst-tips-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
        .cst-tips-item {
          display: flex; align-items: flex-start; gap: 10px;
          background: rgba(30,41,59,0.65);
          border: 1px solid rgba(51,65,85,0.45);
          border-radius: 9px; padding: 12px 14px;
          font-size: 13.5px; line-height: 1.55; color: #e2e8f0;
        }
        .cst-tips-item .check { color: #34d399; font-weight: 700; flex-shrink: 0; }

        .cst-gobag { animation: fadeUp .38s ease both; }
        .cst-gobag-header-card {
          display: flex; align-items: flex-start; justify-content: space-between;
          gap: 20px; flex-wrap: wrap;
          background: rgba(13,27,46,0.72); border: 1px solid rgba(0,200,224,0.08);
          border-top: 2px solid #e8372a; border-radius: 13px;
          padding: 22px 24px; margin-bottom: 18px;
        }
        .cst-gobag-title { font-family: 'Poppins', sans-serif; font-size: 22px; font-weight: 700; color: #ddeef8; }
        .cst-gobag-title span { color: #A8D8FF; }
        .cst-gobag-sub { font-family: 'Inter', sans-serif; font-size: 13.5px; font-weight: 300; color: rgba(160,200,224,0.65); margin-top: 6px; max-width: 440px; line-height: 1.65; }

        .cst-progress-card {
          background: rgba(13,27,46,0.72); border: 1px solid rgba(0,200,224,0.08);
          border-radius: 13px; padding: 18px 22px; margin-bottom: 18px;
        }
        .cst-progress-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
        .cst-progress-label { font-family: 'Inter', sans-serif; font-size: 13px; color: rgba(160,200,224,0.65); }
        .cst-progress-pct {
          font-family: 'Poppins', sans-serif; font-size: 24px; font-weight: 700;
          background: linear-gradient(135deg, #e8372a, #00c8e0);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .cst-progress-track { height: 5px; border-radius: 6px; background: rgba(0,200,224,0.06); overflow: hidden; }
        .cst-progress-fill { height: 100%; border-radius: 6px; background: linear-gradient(90deg, #e8372a, #00c8e0); transition: width .5s ease; }

        .cst-cat-filter { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }
        .cst-cat-btn {
          font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 500;
          letter-spacing: .07em; text-transform: uppercase; padding: 6px 14px;
          border-radius: 20px; border: 1px solid rgba(0,200,224,0.08);
          background: rgba(13,27,46,0.72); color: rgba(160,200,224,0.30);
          cursor: pointer; transition: all .18s; min-height: 36px;
        }
        .cst-cat-btn:hover { color: rgba(160,200,224,0.65); border-color: rgba(0,200,224,0.20); }
        .cst-cat-btn.active { background: rgba(0,200,224,0.08); border-color: rgba(0,200,224,0.30); color: #00c8e0; }

        .cst-checklist { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 8px; }
        .cst-check-item {
          display: flex; align-items: center; gap: 12px;
          background: rgba(13,27,46,0.72);
          border: 1px solid rgba(0,200,224,0.07); border-radius: 12px;
          padding: 13px 16px; cursor: pointer; transition: all .2s; user-select: none;
          min-height: 44px;
        }
        .cst-check-item:hover { border-color: rgba(0,200,224,0.18); }
        .cst-check-item.checked { border-color: rgba(0,200,224,0.22); background: rgba(0,200,224,0.05); }
        .cst-checkbox {
          width: 22px; height: 22px; border-radius: 7px; flex-shrink: 0;
          border: 1.5px solid rgba(0,200,224,0.18); background: transparent;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; color: #fff; font-weight: 800;
        }
        .cst-check-item.checked .cst-checkbox { background: linear-gradient(135deg, #e8372a, #00c8e0); border-color: transparent; }
        .cst-check-cat { font-family: 'Inter', sans-serif; font-size: 9px; font-weight: 500; letter-spacing: .14em; text-transform: uppercase; color: #00c8e0; opacity: .7; margin-bottom: 2px; }
        .cst-check-label { font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 300; line-height: 1.45; color: rgba(160,200,224,0.65); }
        .cst-check-item.checked .cst-check-label { color: rgba(160,200,224,0.30); text-decoration: line-through; }
        .cst-check-num { font-family: 'Inter', sans-serif; font-size: 10px; color: rgba(160,200,224,0.30); flex-shrink: 0; margin-left: auto; min-width: 28px; text-align: right; }

        .cst-reset {
          margin-top: 18px; font-family: 'Inter', sans-serif;
          font-size: 11px; font-weight: 500; letter-spacing: .08em; text-transform: uppercase;
          color: rgba(160,200,224,0.30); background: rgba(13,27,46,0.72);
          border: 1px solid rgba(0,200,224,0.08); border-radius: 8px;
          padding: 9px 20px; cursor: pointer; transition: all .2s; min-height: 44px;
        }
        .cst-reset:hover { color: rgba(160,200,224,0.65); border-color: rgba(0,200,224,0.20); }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 680px) {
          .cst-wrap { padding: 16px 16px 90px; }
          .cst-tabs-wrap { margin: 0 -16px 24px; padding: 0 16px; }
          .cst-panel-header-card { grid-template-columns: 1fr; gap: 14px; padding: 16px; }
          .cst-hotlines { width: 100%; }
          .cst-hotline-btn { flex: 1 1 calc(50% - 4px); justify-content: center; font-size: 12px; }
          .cst-phase-desc { display: none; }
          .cst-checklist { grid-template-columns: 1fr; }
          .cst-gobag-header-card { padding: 16px; }
        }
      `}</style>

      <div className="cst">
        <div className="cst-bg">
          <img src={safetyTipsBg} alt="" className="cst-bg-img" aria-hidden="true" />
          <div className="cst-bg-overlay" />
          <div className="cst-bg-atmosphere" />
        </div>

        <div className="cst-wrap">

          {/* Hero — eyebrow tag removed; the persistent CitizenLayout sidebar
              already identifies this section, so the title stands alone. */}
          <section className="cst-hero">
            <h1>
              {t("safetyTips.heroTitleStart")} <span className="accent">{t("safetyTips.heroAccent")}</span> {t("safetyTips.heroTitleEnd")}
            </h1>
            <p className="cst-hero-sub">{t("safetyTips.heroSub")}</p>
          </section>

          {/* Sticky tabs */}
          <div className="cst-tabs-wrap">
            <div className="cst-tabs">
              {DISASTERS.map((d, i) => (
                <button
                  key={d.id}
                  className={`cst-tab${activeTab === i ? " active" : ""}`}
                  onClick={() => { setActiveTab(i); setActivePhase("before"); }}
                >
                  <span className="cst-tab-emoji">{d.emoji}</span>
                  {t(`safetyTips.disasters.${d.labelKey}`)}
                </button>
              ))}
              <button
                className={`cst-tab${isGoBag ? " active" : ""}`}
                onClick={() => setActiveTab(DISASTERS.length)}
              >
                <span className="cst-tab-emoji">🎒</span>
                {t("safetyTips.goBag.tabLabel")}
              </button>
            </div>
          </div>

          {/* Disaster panel */}
          {!isGoBag && disaster && (
            <div
              key={disaster.id}
              className="cst-panel"
              style={{
                "--d-color":  disaster.color,
                "--d-dim":    disaster.colorDim,
                "--d-border": disaster.colorBorder,
                "--d-rgb":    disaster.colorRgb,
              } as React.CSSProperties}
            >
              <div className="cst-panel-header-card">
                <div className="cst-panel-title-group">
                  <div className="cst-panel-icon">{disaster.emoji}</div>
                  <div>
                    <div className="cst-panel-name">{t(`safetyTips.disasters.${disaster.labelKey}`)}</div>
                    <div className="cst-panel-signal">
                      {t(`safetyTips.disasterDetails.${disaster.labelKey}.signal`, disaster.signal)}
                    </div>
                  </div>
                </div>

                <div className="cst-hotlines">
                  {disaster.hotlines.map((h) => (
                    <a key={h.number} href={`tel:${h.number}`} className="cst-hotline-btn">
                      <span className="cst-hotline-icon">📞</span>
                      {h.label}
                    </a>
                  ))}
                </div>
              </div>

              <div className="cst-phases">
                {(["before","during","after"] as const).map(p => {
                  const m = PHASE_META[p];
                  return (
                    <button
                      key={p}
                      className={`cst-phase-btn${activePhase === p ? " active" : ""}`}
                      onClick={() => setActivePhase(p)}
                    >
                      <span className="cst-phase-icon">{m.icon}</span>
                      <span className="cst-phase-label">{m.label}</span>
                      <span className="cst-phase-desc">{m.desc}</span>
                    </button>
                  );
                })}
              </div>

              <div className="cst-tips-card">
                <h4 className="cst-tips-title">
                  <span>📋</span> {stepsTitleText}
                </h4>
                <ul className="cst-tips-list">
                  {activePhaseObj.tips.map((tip, idx) => (
                    <li key={idx} className="cst-tips-item">
                      <span className="check">✓</span>
                      <span>{typeof tip === "string" ? tip : (tip.title || tip.text || "")}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Go Bag panel */}
          {isGoBag && (
            <div className="cst-gobag">
              <div className="cst-gobag-header-card">
                <div>
                  <div className="cst-gobag-title">
                    🎒 {t("safetyTips.goBag.titleStart")} <span>{t("safetyTips.goBag.titleAccent")}</span> {t("safetyTips.goBag.titleEnd")}
                  </div>
                  <p className="cst-gobag-sub">{t("safetyTips.goBag.sub")}</p>
                </div>
              </div>

              <div className="cst-progress-card">
                <div className="cst-progress-row">
                  <span className="cst-progress-label">{checkedCount} / {GO_BAG_ITEMS.length} {t("safetyTips.goBag.itemsPacked")}</span>
                  <span className="cst-progress-pct">{progress}%</span>
                </div>
                <div className="cst-progress-track">
                  <div className="cst-progress-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="cst-cat-filter">
                {categories.map(c => (
                  <button
                    key={c}
                    className={`cst-cat-btn${bagFilter === c ? " active" : ""}`}
                    onClick={() => setBagFilter(c)}
                  >{categoryLabel(c)}</button>
                ))}
              </div>

              <div className="cst-checklist">
                {visibleItems.map(item => (
                  <div
                    key={item.id}
                    className={`cst-check-item${checked[item.id] ? " checked" : ""}`}
                    onClick={() => toggleCheck(item.id)}
                  >
                    <div className="cst-checkbox">{checked[item.id] && "✓"}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="cst-check-cat">{categoryLabel(item.category)}</div>
                      <div className="cst-check-label">{goBagLabel(item)}</div>
                    </div>
                    <div className="cst-check-num">#{String(item.id).padStart(2,"0")}</div>
                  </div>
                ))}
              </div>

              {checkedCount > 0 && (
                <button className="cst-reset" onClick={() => setChecked({})}>
                  {t("safetyTips.goBag.resetBtn")}
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
}