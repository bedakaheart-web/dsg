// apply_report_translations.cjs
//
// Adds a full `report` translation section (type + all 8 languages)
// to src/translations/index.ts for the Report.tsx page.
//
// Usage (run from your project root, where package.json lives):
//   node apply_report_translations.cjs
//
// Safe to re-run — skips languages/type already patched.

const fs = require("fs");
const path = require("path");

const FILE = path.join(process.cwd(), "src", "translations", "index.ts");

if (!fs.existsSync(FILE)) {
  console.error(`❌ Could not find ${FILE}`);
  console.error("   Run this script from your project root (same folder as package.json).");
  process.exit(1);
}

let src = fs.readFileSync(FILE, "utf8");
const original = src;

// ── 1. Patch the TranslationDict type ───────────────────────────────────────
const typeAnchor = `    builtWithPrefix: string;
    builtWithSuffix: string;
  };
};`;

const typeReplacement = `    builtWithPrefix: string;
    builtWithSuffix: string;
  };
  report: {
    heroTitle: string; heroAccent: string;
    heroSub: string;
    bannerTitle: string; bannerText: string; bannerCta: string;
    types: { fire: string; accident: string; flood: string; crime: string; medical: string; other: string };
    steps: { incidentType: string; reporterInfo: string; location: string; description: string; evidence: string; submit: string };
    cardLabels: { incidentType: string; reporterInfo: string; location: string; description: string; evidence: string };
    form: {
      fullName: string; optional: string; contactNumber: string;
      detectedLocation: string; refreshGps: string; verifyMaps: string;
      descriptionPlaceholder: string; uploadHint: string;
      legalTitle: string; legalSummary: string;
      submitBtn: string; submitting: string;
    };
    sidebar: {
      hotlinesTitle: string; warnTitle: string; warnText: string;
      safetyTitle: string; safetyText: string;
      trackTitle: string; trackText: string; trackBtn: string;
    };
    success: { title: string; sub: string; cardTitle: string; cardText: string; cardBtn: string };
  };
};`;

if (src.includes(typeAnchor)) {
  src = src.replace(typeAnchor, typeReplacement);
  console.log("✅ Patched TranslationDict type with `report` section");
} else if (src.includes("report: {\n    heroTitle: string;")) {
  console.log("↷ TranslationDict type already patched — skipping");
} else {
  console.warn("⚠️  Could not find the expected type-closing anchor. Check manually —");
  console.warn("    the `report` type block was NOT added automatically.");
}

// ── 2. Per-language `report` object literal, keyed by unique builtWithSuffix anchor ──
const LANGS = [
  {
    code: "en",
    anchor: `builtWithSuffix: "for the safety of every Dumagueteño",`,
    body: `      heroTitle: "Report an", heroAccent: "Incident",
      heroSub: "Submit a report to alert local responders. Provide accurate details so the right team can act fast.",
      bannerTitle: "Track Your Report in Real-Time",
      bannerText: "Create an account to monitor the status of your incident report and receive updates as authorities respond.",
      bannerCta: "Create Account →",
      types: { fire: "Fire Incident", accident: "Road Accident", flood: "Flood", crime: "Crime", medical: "Medical Emergency", other: "Other" },
      steps: { incidentType: "Incident Type", reporterInfo: "Reporter Info", location: "Location", description: "Description", evidence: "Evidence", submit: "Submit" },
      cardLabels: { incidentType: "Incident Type", reporterInfo: "Reporter Information", location: "Your Location", description: "Incident Details", evidence: "Upload Evidence" },
      form: {
        fullName: "Full Name", optional: "(Optional)", contactNumber: "Contact Number",
        detectedLocation: "Detected Location", refreshGps: "📍 Refresh GPS", verifyMaps: "Verify on Maps →",
        descriptionPlaceholder: "Describe what happened — include time, number of people involved, severity, and any other relevant details…",
        uploadHint: "Click to select or drag & drop",
        legalTitle: "Legal Acknowledgment",
        legalSummary: "By submitting this report, you confirm that the information provided is true and accurate to the best of your knowledge.",
        submitBtn: "Submit Incident Report", submitting: "Submitting…",
      },
      sidebar: {
        hotlinesTitle: "Emergency Hotlines",
        warnTitle: "⚠️ Emergency Reminder",
        warnText: "If someone is in immediate danger, call emergency services directly. Do not rely solely on this form in life-threatening situations.",
        safetyTitle: "🛡️ Your Safety Matters",
        safetyText: "Your identity and contact information are kept strictly confidential. You may submit anonymously if preferred.",
        trackTitle: "📍 Track Your Report",
        trackText: "Create an account to track the status of your incident reports in real-time.",
        trackBtn: "Create Account or Login →",
      },
      success: {
        title: "Report Submitted",
        sub: "Your incident report has been received and is now visible to responders. Authorities have been notified and will respond shortly.",
        cardTitle: "Submit Another Report",
        cardText: "Report another incident to help keep your community safe.",
        cardBtn: "Submit Another Report →",
      },`,
  },
  {
    code: "tl",
    anchor: `builtWithSuffix: "para sa kaligtasan ng bawat Dumagueteño",`,
    body: `      heroTitle: "Mag-report ng", heroAccent: "Insidente",
      heroSub: "Magsumite ng ulat para maabisuhan ang mga lokal na responder. Magbigay ng tamang detalye para makatugon agad ang tamang team.",
      bannerTitle: "Subaybayan ang Iyong Ulat nang Real-Time",
      bannerText: "Gumawa ng account para subaybayan ang status ng iyong insidente at makatanggap ng update kapag tumugon na ang mga awtoridad.",
      bannerCta: "Gumawa ng Account →",
      types: { fire: "Sunog", accident: "Aksidente sa Daan", flood: "Baha", crime: "Krimen", medical: "Medikal na Emerhensiya", other: "Iba pa" },
      steps: { incidentType: "Uri ng Insidente", reporterInfo: "Impormasyon", location: "Lokasyon", description: "Paglalarawan", evidence: "Ebidensya", submit: "Isumite" },
      cardLabels: { incidentType: "Uri ng Insidente", reporterInfo: "Impormasyon ng Nag-ulat", location: "Iyong Lokasyon", description: "Detalye ng Insidente", evidence: "Mag-upload ng Ebidensya" },
      form: {
        fullName: "Buong Pangalan", optional: "(Opsyonal)", contactNumber: "Numero ng Telepono",
        detectedLocation: "Nakitang Lokasyon", refreshGps: "📍 I-refresh ang GPS", verifyMaps: "I-verify sa Maps →",
        descriptionPlaceholder: "Ilarawan kung ano ang nangyari — isama ang oras, bilang ng mga taong kasangkot, tindi, at iba pang detalye…",
        uploadHint: "I-click para pumili o i-drag & drop",
        legalTitle: "Legal na Pagkilala",
        legalSummary: "Sa pagsumite ng ulat na ito, kinukumpirma mo na ang impormasyong ibinigay ay totoo at wasto sa iyong kaalaman.",
        submitBtn: "Isumite ang Ulat ng Insidente", submitting: "Isinusumite…",
      },
      sidebar: {
        hotlinesTitle: "Mga Emergency Hotline",
        warnTitle: "⚠️ Paalala sa Emerhensiya",
        warnText: "Kung may nasa agarang panganib, direktang tumawag sa emergency services. Huwag umasa lamang sa form na ito sa mga sitwasyong nagbabanta sa buhay.",
        safetyTitle: "🛡️ Mahalaga ang Iyong Kaligtasan",
        safetyText: "Ang iyong pagkakakilanlan at contact information ay mananatiling kumpidensyal. Maaari kang magsumite nang anonymous.",
        trackTitle: "📍 Subaybayan ang Iyong Ulat",
        trackText: "Gumawa ng account para masubaybayan ang status ng iyong mga ulat nang real-time.",
        trackBtn: "Gumawa ng Account o Mag-login →",
      },
      success: {
        title: "Naisumite na ang Ulat",
        sub: "Natanggap na ang iyong ulat ng insidente at makikita na ito ng mga responder. Naabisuhan na ang mga awtoridad at tutugon sila sa lalong madaling panahon.",
        cardTitle: "Magsumite ng Isa pang Ulat",
        cardText: "Mag-ulat ng ibang insidente para tumulong panatilihing ligtas ang inyong komunidad.",
        cardBtn: "Magsumite ng Isa pang Ulat →",
      },`,
  },
  {
    code: "ceb",
    anchor: `builtWithSuffix: "alang sa kaluwasan sa matag Dumagueteño",`,
    body: `      heroTitle: "Pag-report og", heroAccent: "Insidente",
      heroSub: "Pagsumite og report aron mapahibalo ang lokal nga mga responder. Paghatag og tukma nga detalye aron makatubag dayon ang husto nga team.",
      bannerTitle: "Bantayi ang Imong Report sa Real-Time",
      bannerText: "Paghimo og account aron masubay ang status sa imong insidente ug makadawat og update kung motubag na ang mga awtoridad.",
      bannerCta: "Paghimo og Account →",
      types: { fire: "Sunog", accident: "Aksidente sa Dalan", flood: "Baha", crime: "Krimen", medical: "Medikal nga Emerhensya", other: "Uban pa" },
      steps: { incidentType: "Klase sa Insidente", reporterInfo: "Impormasyon", location: "Lokasyon", description: "Deskripsyon", evidence: "Ebidensya", submit: "Isumite" },
      cardLabels: { incidentType: "Klase sa Insidente", reporterInfo: "Impormasyon sa Nagreport", location: "Imong Lokasyon", description: "Detalye sa Insidente", evidence: "Pag-upload og Ebidensya" },
      form: {
        fullName: "Kompleto nga Ngalan", optional: "(Opsyonal)", contactNumber: "Numero sa Telepono",
        detectedLocation: "Nakit-an nga Lokasyon", refreshGps: "📍 I-refresh ang GPS", verifyMaps: "I-verify sa Maps →",
        descriptionPlaceholder: "Ihulagway kung unsa ang nahitabo — iapil ang oras, gidaghanon sa mga tawo nga naapil, kagrabe, ug uban pang detalye…",
        uploadHint: "I-klik para mopili o i-drag & drop",
        legalTitle: "Legal nga Pag-ila",
        legalSummary: "Pinaagi sa pagsumite niini nga report, imong gikumpirma nga ang impormasyon nga gihatag tinuod ug tukma base sa imong nahibaloan.",
        submitBtn: "Isumite ang Report sa Insidente", submitting: "Gisumite…",
      },
      sidebar: {
        hotlinesTitle: "Mga Emergency Hotline",
        warnTitle: "⚠️ Pahinumdom sa Emerhensya",
        warnText: "Kung adunay tawo nga naa sa dinalian nga peligro, direkta nga tawagi ang emergency services. Ayaw pagsalig lang niini nga form sa mga sitwasyon nga makahulga sa kinabuhi.",
        safetyTitle: "🛡️ Importante ang Imong Kaluwasan",
        safetyText: "Ang imong pagkatawo ug impormasyon sa kontak kumpidensyal gyud. Pwede ka mosumite nga anonymous.",
        trackTitle: "📍 Bantayi ang Imong Report",
        trackText: "Paghimo og account aron masubay ang status sa imong mga report sa real-time.",
        trackBtn: "Paghimo og Account o Mag-login →",
      },
      success: {
        title: "Nasumite na ang Report",
        sub: "Nadawat na ang imong report sa insidente ug makita na kini sa mga responder. Naabisohan na ang mga awtoridad ug motubag sila sa dili madugay.",
        cardTitle: "Pagsumite og Lain nga Report",
        cardText: "Pag-report og lain nga insidente aron makatabang sa kaluwasan sa inyong komunidad.",
        cardBtn: "Pagsumite og Lain nga Report →",
      },`,
  },
  {
    code: "ko",
    anchor: `builtWithSuffix: "모든 두마게테뇨의 안전을 위하여",`,
    body: `      heroTitle: "사건", heroAccent: "신고",
      heroSub: "현지 대응요원에게 알리기 위해 신고서를 제출하세요. 정확한 정보를 제공하면 적절한 팀이 신속하게 대응할 수 있습니다.",
      bannerTitle: "실시간으로 신고 현황 확인",
      bannerText: "계정을 만들면 사건 신고 상태를 확인하고 당국이 대응할 때 업데이트를 받을 수 있습니다.",
      bannerCta: "계정 만들기 →",
      types: { fire: "화재", accident: "교통사고", flood: "홍수", crime: "범죄", medical: "의료 응급상황", other: "기타" },
      steps: { incidentType: "사건 유형", reporterInfo: "신고자 정보", location: "위치", description: "설명", evidence: "증거", submit: "제출" },
      cardLabels: { incidentType: "사건 유형", reporterInfo: "신고자 정보", location: "현재 위치", description: "사건 세부정보", evidence: "증거 업로드" },
      form: {
        fullName: "성명", optional: "(선택)", contactNumber: "연락처",
        detectedLocation: "감지된 위치", refreshGps: "📍 GPS 새로고침", verifyMaps: "지도에서 확인 →",
        descriptionPlaceholder: "발생한 상황을 설명해주세요 — 시간, 관련 인원 수, 심각도 및 기타 관련 정보를 포함하세요…",
        uploadHint: "클릭하여 선택하거나 드래그 앤 드롭",
        legalTitle: "법적 확인",
        legalSummary: "이 신고서를 제출함으로써 제공된 정보가 귀하가 아는 한 사실이고 정확함을 확인합니다.",
        submitBtn: "사건 신고 제출", submitting: "제출 중…",
      },
      sidebar: {
        hotlinesTitle: "긴급 핫라인",
        warnTitle: "⚠️ 긴급 알림",
        warnText: "누군가 즉각적인 위험에 처해 있다면 긴급 서비스에 직접 전화하세요. 생명이 위태로운 상황에서는 이 양식에만 의존하지 마세요.",
        safetyTitle: "🛡️ 귀하의 안전이 중요합니다",
        safetyText: "귀하의 신원과 연락처 정보는 철저히 비밀로 유지됩니다. 원하시면 익명으로 제출할 수 있습니다.",
        trackTitle: "📍 신고 현황 추적",
        trackText: "계정을 만들면 사건 신고 상태를 실시간으로 추적할 수 있습니다.",
        trackBtn: "계정 만들기 또는 로그인 →",
      },
      success: {
        title: "신고가 제출되었습니다",
        sub: "사건 신고가 접수되어 대응요원에게 표시됩니다. 당국에 통보되었으며 곧 대응할 것입니다.",
        cardTitle: "다른 사건 신고하기",
        cardText: "지역사회의 안전을 위해 다른 사건을 신고하세요.",
        cardBtn: "다른 신고 제출하기 →",
      },`,
  },
  {
    code: "zh",
    anchor: `builtWithSuffix: "为每一位杜马格特人的安全而建",`,
    body: `      heroTitle: "举报", heroAccent: "事件",
      heroSub: "提交报告以提醒当地应急人员。提供准确的详细信息，以便合适的团队能够快速采取行动。",
      bannerTitle: "实时追踪您的报告",
      bannerText: "创建账户以监控您的事件报告状态，并在当局响应时接收更新。",
      bannerCta: "创建账户 →",
      types: { fire: "火灾事故", accident: "交通事故", flood: "洪水", crime: "犯罪", medical: "医疗紧急情况", other: "其他" },
      steps: { incidentType: "事件类型", reporterInfo: "举报人信息", location: "位置", description: "描述", evidence: "证据", submit: "提交" },
      cardLabels: { incidentType: "事件类型", reporterInfo: "举报人信息", location: "您的位置", description: "事件详情", evidence: "上传证据" },
      form: {
        fullName: "姓名", optional: "（可选）", contactNumber: "联系电话",
        detectedLocation: "检测到的位置", refreshGps: "📍 刷新GPS", verifyMaps: "在地图上验证 →",
        descriptionPlaceholder: "描述发生的情况——包括时间、涉及人数、严重程度及其他相关细节…",
        uploadHint: "点击选择或拖放文件",
        legalTitle: "法律确认",
        legalSummary: "提交此报告即表示您确认所提供的信息据您所知真实准确。",
        submitBtn: "提交事件报告", submitting: "提交中…",
      },
      sidebar: {
        hotlinesTitle: "紧急热线",
        warnTitle: "⚠️ 紧急提醒",
        warnText: "如果有人处于紧急危险中，请直接致电紧急服务部门。在危及生命的情况下，请勿仅依赖此表格。",
        safetyTitle: "🛡️ 您的安全至关重要",
        safetyText: "您的身份和联系信息将被严格保密。如果您愿意，也可以匿名提交。",
        trackTitle: "📍 追踪您的报告",
        trackText: "创建账户以实时追踪您的事件报告状态。",
        trackBtn: "创建账户或登录 →",
      },
      success: {
        title: "报告已提交",
        sub: "您的事件报告已收到，现已对应急人员可见。当局已收到通知，将尽快做出响应。",
        cardTitle: "提交另一份报告",
        cardText: "举报其他事件，帮助维护社区安全。",
        cardBtn: "提交另一份报告 →",
      },`,
  },
  {
    code: "ja",
    anchor: `builtWithSuffix: "すべてのドゥマゲッテニョの安全のために",`,
    body: `      heroTitle: "事件を", heroAccent: "報告する",
      heroSub: "地元の対応者に知らせるために報告書を提出してください。正確な詳細を提供することで、適切なチームが迅速に対応できます。",
      bannerTitle: "リアルタイムで報告状況を追跡",
      bannerText: "アカウントを作成すると、事件報告のステータスを確認し、当局が対応した際に更新情報を受け取ることができます。",
      bannerCta: "アカウントを作成 →",
      types: { fire: "火災", accident: "交通事故", flood: "洪水", crime: "犯罪", medical: "医療緊急事態", other: "その他" },
      steps: { incidentType: "事件の種類", reporterInfo: "報告者情報", location: "位置情報", description: "詳細説明", evidence: "証拠", submit: "送信" },
      cardLabels: { incidentType: "事件の種類", reporterInfo: "報告者情報", location: "現在地", description: "事件の詳細", evidence: "証拠のアップロード" },
      form: {
        fullName: "氏名", optional: "（任意）", contactNumber: "連絡先電話番号",
        detectedLocation: "検出された位置", refreshGps: "📍 GPSを更新", verifyMaps: "地図で確認 →",
        descriptionPlaceholder: "何が起きたかを説明してください — 時間、関係者数、深刻度、その他関連する詳細を含めてください…",
        uploadHint: "クリックして選択するかドラッグ＆ドロップ",
        legalTitle: "法的確認事項",
        legalSummary: "この報告を提出することにより、提供された情報が知る限り真実かつ正確であることを確認します。",
        submitBtn: "事件報告を送信", submitting: "送信中…",
      },
      sidebar: {
        hotlinesTitle: "緊急ホットライン",
        warnTitle: "⚠️ 緊急時の注意",
        warnText: "誰かが差し迫った危険にさらされている場合は、直接緊急サービスに電話してください。命に関わる状況では、このフォームだけに頼らないでください。",
        safetyTitle: "🛡️ あなたの安全が最優先です",
        safetyText: "お客様の身元と連絡先情報は厳重に機密として保持されます。ご希望であれば匿名で提出することもできます。",
        trackTitle: "📍 報告を追跡する",
        trackText: "アカウントを作成すると、事件報告のステータスをリアルタイムで追跡できます。",
        trackBtn: "アカウント作成またはログイン →",
      },
      success: {
        title: "報告が送信されました",
        sub: "事件報告を受け付けました。対応者に表示されています。当局に通知され、間もなく対応します。",
        cardTitle: "別の報告を送信する",
        cardText: "地域の安全を守るために別の事件を報告してください。",
        cardBtn: "別の報告を送信 →",
      },`,
  },
  {
    code: "ru",
    anchor: `builtWithSuffix: "для безопасности каждого жителя Думагете",`,
    body: `      heroTitle: "Сообщить о", heroAccent: "происшествии",
      heroSub: "Отправьте отчёт, чтобы уведомить местных спасателей. Предоставьте точные данные, чтобы нужная команда могла быстро отреагировать.",
      bannerTitle: "Отслеживайте свой отчёт в реальном времени",
      bannerText: "Создайте аккаунт, чтобы отслеживать статус вашего отчёта о происшествии и получать обновления по мере реагирования властей.",
      bannerCta: "Создать аккаунт →",
      types: { fire: "Пожар", accident: "ДТП", flood: "Наводнение", crime: "Преступление", medical: "Медицинская экстренная ситуация", other: "Другое" },
      steps: { incidentType: "Тип происшествия", reporterInfo: "Информация", location: "Местоположение", description: "Описание", evidence: "Доказательства", submit: "Отправить" },
      cardLabels: { incidentType: "Тип происшествия", reporterInfo: "Информация о заявителе", location: "Ваше местоположение", description: "Детали происшествия", evidence: "Загрузить доказательства" },
      form: {
        fullName: "Полное имя", optional: "(необязательно)", contactNumber: "Контактный номер",
        detectedLocation: "Определённое местоположение", refreshGps: "📍 Обновить GPS", verifyMaps: "Проверить на карте →",
        descriptionPlaceholder: "Опишите, что произошло — укажите время, количество вовлечённых людей, серьёзность и другие важные детали…",
        uploadHint: "Нажмите, чтобы выбрать, или перетащите файл",
        legalTitle: "Юридическое подтверждение",
        legalSummary: "Отправляя этот отчёт, вы подтверждаете, что предоставленная информация является правдивой и точной, насколько вам известно.",
        submitBtn: "Отправить отчёт о происшествии", submitting: "Отправка…",
      },
      sidebar: {
        hotlinesTitle: "Горячие линии экстренной помощи",
        warnTitle: "⚠️ Напоминание об экстренной ситуации",
        warnText: "Если кто-то находится в непосредственной опасности, звоните напрямую в экстренные службы. Не полагайтесь исключительно на эту форму в ситуациях, угрожающих жизни.",
        safetyTitle: "🛡️ Ваша безопасность важна",
        safetyText: "Ваша личность и контактная информация строго конфиденциальны. При желании вы можете отправить отчёт анонимно.",
        trackTitle: "📍 Отслеживайте свой отчёт",
        trackText: "Создайте аккаунт, чтобы отслеживать статус ваших отчётов о происшествиях в реальном времени.",
        trackBtn: "Создать аккаунт или войти →",
      },
      success: {
        title: "Отчёт отправлен",
        sub: "Ваш отчёт о происшествии получен и теперь виден спасателям. Власти уведомлены и вскоре отреагируют.",
        cardTitle: "Отправить ещё один отчёт",
        cardText: "Сообщите о другом происшествии, чтобы помочь обеспечить безопасность вашего сообщества.",
        cardBtn: "Отправить ещё один отчёт →",
      },`,
  },
  {
    code: "ar",
    anchor: `builtWithSuffix: "من أجل سلامة كل مواطن في دوماغيتي",`,
    body: `      heroTitle: "الإبلاغ عن", heroAccent: "حادثة",
      heroSub: "قدّم بلاغًا لتنبيه المستجيبين المحليين. قدّم تفاصيل دقيقة حتى يتمكن الفريق المناسب من التصرف بسرعة.",
      bannerTitle: "تتبع بلاغك في الوقت الفعلي",
      bannerText: "أنشئ حسابًا لمتابعة حالة بلاغ الحادثة الخاص بك وتلقي التحديثات عند استجابة السلطات.",
      bannerCta: "إنشاء حساب ←",
      types: { fire: "حريق", accident: "حادث طريق", flood: "فيضان", crime: "جريمة", medical: "حالة طوارئ طبية", other: "أخرى" },
      steps: { incidentType: "نوع الحادثة", reporterInfo: "معلومات المبلّغ", location: "الموقع", description: "الوصف", evidence: "الأدلة", submit: "إرسال" },
      cardLabels: { incidentType: "نوع الحادثة", reporterInfo: "معلومات المبلّغ", location: "موقعك", description: "تفاصيل الحادثة", evidence: "تحميل الأدلة" },
      form: {
        fullName: "الاسم الكامل", optional: "(اختياري)", contactNumber: "رقم الاتصال",
        detectedLocation: "الموقع المكتشف", refreshGps: "📍 تحديث GPS", verifyMaps: "التحقق على الخريطة ←",
        descriptionPlaceholder: "صف ما حدث — بما في ذلك الوقت وعدد الأشخاص المعنيين ودرجة الخطورة وأي تفاصيل أخرى ذات صلة…",
        uploadHint: "انقر للاختيار أو اسحب وأفلت",
        legalTitle: "إقرار قانوني",
        legalSummary: "من خلال تقديم هذا البلاغ، فإنك تؤكد أن المعلومات المقدمة صحيحة ودقيقة على حد علمك.",
        submitBtn: "إرسال بلاغ الحادثة", submitting: "جارٍ الإرسال…",
      },
      sidebar: {
        hotlinesTitle: "خطوط الطوارئ الساخنة",
        warnTitle: "⚠️ تذكير بالطوارئ",
        warnText: "إذا كان أحدهم في خطر مباشر، اتصل بخدمات الطوارئ مباشرة. لا تعتمد فقط على هذا النموذج في المواقف التي تهدد الحياة.",
        safetyTitle: "🛡️ سلامتك مهمة",
        safetyText: "تُحفظ هويتك ومعلومات الاتصال الخاصة بك بسرية تامة. يمكنك تقديم البلاغ دون الكشف عن هويتك إذا رغبت.",
        trackTitle: "📍 تتبع بلاغك",
        trackText: "أنشئ حسابًا لتتبع حالة بلاغات الحوادث الخاصة بك في الوقت الفعلي.",
        trackBtn: "إنشاء حساب أو تسجيل الدخول ←",
      },
      success: {
        title: "تم إرسال البلاغ",
        sub: "تم استلام بلاغ الحادثة الخاص بك وهو الآن مرئي للمستجيبين. تم إخطار السلطات وستستجيب قريبًا.",
        cardTitle: "إرسال بلاغ آخر",
        cardText: "أبلغ عن حادثة أخرى للمساعدة في الحفاظ على سلامة مجتمعك.",
        cardBtn: "إرسال بلاغ آخر ←",
      },`,
  },
];

let patchedCount = 0;
let skippedCount = 0;

for (const lang of LANGS) {
  const alreadyDone = src.includes(`report: {\n      heroTitle:`) && src.indexOf(lang.anchor) !== -1 &&
    src.slice(src.indexOf(lang.anchor), src.indexOf(lang.anchor) + 400).includes("report: {");

  const oldBlock = `${lang.anchor}\n    },\n  },`;
  const newBlock = `${lang.anchor}\n    },\n    report: {\n${lang.body}\n    },\n  },`;

  if (src.includes(newBlock) || src.includes(`report: {\n${lang.body}`)) {
    console.log(`↷ [${lang.code}] already patched — skipping`);
    skippedCount++;
    continue;
  }

  if (!src.includes(oldBlock)) {
    console.warn(`⚠️  [${lang.code}] could not find exact anchor block. Skipping — check indentation/text manually.`);
    continue;
  }

  src = src.replace(oldBlock, newBlock);
  console.log(`✅ [${lang.code}] patched`);
  patchedCount++;
}

if (src === original) {
  console.log("\nNo changes were made — file left untouched.");
  process.exit(0);
}

const backupPath = FILE + ".bak2";
fs.writeFileSync(backupPath, original, "utf8");
fs.writeFileSync(FILE, src, "utf8");

console.log(`\nDone. Patched: ${patchedCount}, skipped: ${skippedCount}`);
console.log(`Backup of original saved to: ${backupPath}`);
console.log(`\nNow restart your dev server and hard-refresh the browser.`);
