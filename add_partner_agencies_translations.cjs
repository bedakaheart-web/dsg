const fs = require("fs");
const path = require("path");

const FILE = path.join(process.cwd(), "src", "translations", "index.ts");

if (!fs.existsSync(FILE)) {
  console.error(`Could not find ${FILE}`);
  process.exit(1);
}

let src = fs.readFileSync(FILE, "utf8");
const original = src;

if (src.includes("partnerAgencies:")) {
  console.log("partnerAgencies translations already present - skipping.");
  process.exit(0);
}

// 1. Patch the type
const typeAnchor = `  login: {`;
const typeInsert = `  partnerAgencies: {
    eyebrow: string; heroTitle: string; heroAccent: string; heroSub: string;
    countSuffix: string;
    backToResources: string;
    breadcrumbResources: string; breadcrumbCurrent: string;
    ctaTitle: string; ctaDesc: string; ctaBtn: string;
  };
  login: {`;

if (!src.includes(typeAnchor)) {
  console.error("Could not find type anchor 'login: {'. Type patch skipped - add manually.");
} else {
  src = src.replace(typeAnchor, typeInsert);
}

// 2. Per-language content anchored on each language's unique login.checkingSession line
const LANGS = [
  { code: "en", anchor: `checkingSession: "Checking session…",`, body: `
    eyebrow: "Organizations",
    heroTitle: "Partner", heroAccent: "Agencies",
    heroSub: "Government bodies and civil society organizations collaborating with DumaSafeGuide to deliver coordinated, effective emergency response across Dumaguete City and Negros Oriental.",
    countSuffix: "partner agencies listed",
    backToResources: "← Resources",
    breadcrumbResources: "Resources", breadcrumbCurrent: "Partner Agencies",
    ctaTitle: "Need to report an emergency?", ctaDesc: "Don't wait — use the incident reporting form to alert local responders immediately.", ctaBtn: "Report Now",` },
  { code: "tl", anchor: `checkingSession: "Sinusuri ang session…",`, body: `
    eyebrow: "Mga Organisasyon",
    heroTitle: "Kasosyong", heroAccent: "Ahensya",
    heroSub: "Mga ahensya ng gobyerno at organisasyong sibiko na nakikipagtulungan sa DumaSafeGuide upang maghatid ng maayos at epektibong tugon sa emerhensiya sa buong Dumaguete City at Negros Oriental.",
    countSuffix: "kasosyong ahensya ang nakalista",
    backToResources: "← Mga Mapagkukunan",
    breadcrumbResources: "Mga Mapagkukunan", breadcrumbCurrent: "Kasosyong Ahensya",
    ctaTitle: "Kailangan mo bang mag-report ng emerhensiya?", ctaDesc: "Huwag maghintay — gamitin ang incident reporting form para agad na maabisuhan ang mga lokal na responder.", ctaBtn: "Mag-report Ngayon",` },
  { code: "ceb", anchor: `checkingSession: "Gisusi ang session…",`, body: `
    eyebrow: "Mga Organisasyon",
    heroTitle: "Kasosyo nga", heroAccent: "Ahensya",
    heroSub: "Mga ahensya sa gobyerno ug organisasyong sibiko nga nakigtambayayong sa DumaSafeGuide aron makahatag og han-ay ug epektibo nga tubag sa emerhensya sa tibuok Dumaguete City ug Negros Oriental.",
    countSuffix: "kasosyo nga ahensya ang nalista",
    backToResources: "← Mga Kapanguhaan",
    breadcrumbResources: "Mga Kapanguhaan", breadcrumbCurrent: "Kasosyo nga Ahensya",
    ctaTitle: "Kinahanglan ba nimong mag-report og emerhensya?", ctaDesc: "Ayaw paghulat — gamita ang incident reporting form aron dayon mapahibalo ang lokal nga mga responder.", ctaBtn: "I-report Karon",` },
  { code: "ko", anchor: `checkingSession: "세션 확인 중…",`, body: `
    eyebrow: "조직",
    heroTitle: "협력", heroAccent: "기관",
    heroSub: "두마게테시와 네그로스 오리엔탈 전역에서 조율되고 효과적인 긴급 대응을 제공하기 위해 DumaSafeGuide와 협력하는 정부 기관 및 시민단체입니다.",
    countSuffix: "개 협력 기관 등록됨",
    backToResources: "← 리소스",
    breadcrumbResources: "리소스", breadcrumbCurrent: "협력 기관",
    ctaTitle: "긴급 상황을 신고해야 하나요?", ctaDesc: "기다리지 마세요 — 사고 신고 양식을 사용해 즉시 현지 대응요원에게 알리세요.", ctaBtn: "지금 신고하기",` },
  { code: "zh", anchor: `checkingSession: "正在检查会话…",`, body: `
    eyebrow: "组织",
    heroTitle: "合作", heroAccent: "机构",
    heroSub: "与DumaSafeGuide合作的政府机构和民间社会组织，在杜马格特市和内格罗斯东方省提供协调一致、高效的应急响应。",
    countSuffix: "个合作机构已列出",
    backToResources: "← 资源",
    breadcrumbResources: "资源", breadcrumbCurrent: "合作机构",
    ctaTitle: "需要报告紧急情况吗？", ctaDesc: "不要等待——使用事件报告表立即通知当地应急人员。", ctaBtn: "立即报告",` },
  { code: "ja", anchor: `checkingSession: "セッションを確認しています…",`, body: `
    eyebrow: "組織",
    heroTitle: "協力", heroAccent: "機関",
    heroSub: "ドゥマゲッティ市とネグロス・オリエンタル全域で、調整された効果的な緊急対応を提供するためにDumaSafeGuideと連携する政府機関および市民団体です。",
    countSuffix: "の協力機関が登録されています",
    backToResources: "← リソース",
    breadcrumbResources: "リソース", breadcrumbCurrent: "協力機関",
    ctaTitle: "緊急事態を報告する必要がありますか？", ctaDesc: "待たないでください — インシデント報告フォームを使って、すぐに地元の対応者に知らせましょう。", ctaBtn: "今すぐ報告する",` },
  { code: "ru", anchor: `checkingSession: "Проверка сеанса…",`, body: `
    eyebrow: "Организации",
    heroTitle: "Партнёрские", heroAccent: "организации",
    heroSub: "Государственные органы и общественные организации, сотрудничающие с DumaSafeGuide для обеспечения скоординированного и эффективного реагирования на чрезвычайные ситуации по всему городу Думагете и провинции Восточный Негрос.",
    countSuffix: "партнёрских организаций указано",
    backToResources: "← Ресурсы",
    breadcrumbResources: "Ресурсы", breadcrumbCurrent: "Партнёрские организации",
    ctaTitle: "Нужно сообщить о чрезвычайной ситуации?", ctaDesc: "Не ждите — используйте форму сообщения об инциденте, чтобы немедленно оповестить местных спасателей.", ctaBtn: "Сообщить сейчас",` },
  { code: "ar", anchor: `checkingSession: "جارٍ التحقق من الجلسة…",`, body: `
    eyebrow: "المنظمات",
    heroTitle: "الجهات", heroAccent: "الشريكة",
    heroSub: "جهات حكومية ومنظمات مجتمع مدني تتعاون مع DumaSafeGuide لتقديم استجابة منسقة وفعالة للطوارئ في جميع أنحاء مدينة دوماغيتي ونيغروس الشرقية.",
    countSuffix: "جهة شريكة مدرجة",
    backToResources: "← الموارد",
    breadcrumbResources: "الموارد", breadcrumbCurrent: "الجهات الشريكة",
    ctaTitle: "هل تحتاج إلى الإبلاغ عن حالة طوارئ؟", ctaDesc: "لا تنتظر — استخدم نموذج الإبلاغ عن الحادثة لتنبيه المستجيبين المحليين فورًا.", ctaBtn: "الإبلاغ الآن",` },
];

let patched = 0;
for (const lang of LANGS) {
  const oldBlock = `${lang.anchor}\n    },\n  },`;
  const newBlock = `${lang.anchor}\n    },\n    partnerAgencies: {${lang.body}\n    },\n  },`;
  if (src.includes(`partnerAgencies: {${lang.body}`)) {
    console.log(`[${lang.code}] already patched - skipping`);
    continue;
  }
  if (!src.includes(oldBlock)) {
    console.warn(`[${lang.code}] anchor not found - skipping (add manually)`);
    continue;
  }
  src = src.replace(oldBlock, newBlock);
  console.log(`[${lang.code}] patched`);
  patched++;
}

if (src === original) {
  console.log("No changes made.");
  process.exit(0);
}

fs.writeFileSync(FILE + ".bak5", original, "utf8");
fs.writeFileSync(FILE, src, "utf8");
console.log(`Done. Patched ${patched} languages. Backup: ${FILE}.bak5`);
