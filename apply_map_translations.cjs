const fs = require('fs');
const path = 'src/translations/index.ts';
let content = fs.readFileSync(path, 'utf8');

const edits = [
[
`    cta: { title: string; desc: string; btn: string };
  };
};`,
`    cta: { title: string; desc: string; btn: string };
  };
  map: {
    backBtn: string;
    titleStart: string;
    titleAccent: string;
    subtitle: string;
    statTotal: string;
    filterLabel: string;
    filterAll: string;
    categories: { emergency: string; hospital: string; evacuation: string };
    searchPlaceholder: string;
    showingPrefix: string;
    showingOf: string;
    showingSuffix: string;
    navigateBtn: string;
    emptyTitle: string;
    legendTitle: string;
    liveTitle: string;
    liveSubPrefix: string;
    liveSubSuffix: string;
    getDirections: string;
  };
};`
],
[
`      cta: { title: "Need to report an emergency?", desc: "Don't wait — use the incident reporting form to alert local responders immediately.", btn: "Report Now" },
    },
  },

  // ── Tagalog / Filipino ───────────────────────────────────`,
`      cta: { title: "Need to report an emergency?", desc: "Don't wait — use the incident reporting form to alert local responders immediately.", btn: "Report Now" },
    },
    map: {
      backBtn: "Back to Dashboard",
      titleStart: "Find Help", titleAccent: "Near You",
      subtitle: "Emergency services, hospitals & evacuation centers across Dumaguete City",
      statTotal: "Total",
      filterLabel: "Filter",
      filterAll: "All",
      categories: { emergency: "Emergency Services", hospital: "Hospitals", evacuation: "Evacuation Centers" },
      searchPlaceholder: "Search facilities or addresses…",
      showingPrefix: "Showing", showingOf: "of", showingSuffix: "facilities",
      navigateBtn: "Navigate",
      emptyTitle: "No facilities match your search.",
      legendTitle: "Map Legend",
      liveTitle: "Dumaguete Coastal Watch",
      liveSubPrefix: "Live map — all", liveSubSuffix: "facilities active",
      getDirections: "Get Directions",
    },
  },

  // ── Tagalog / Filipino ───────────────────────────────────`
],
[
`      cta: { title: "Kailangan mo bang mag-report ng emerhensiya?", desc: "Huwag maghintay — gamitin ang incident report form para agad na maabisuhan ang mga lokal na responder.", btn: "Mag-report Ngayon" },
    },
  },

  // ── Bisaya / Cebuano ─────────────────────────────────────`,
`      cta: { title: "Kailangan mo bang mag-report ng emerhensiya?", desc: "Huwag maghintay — gamitin ang incident report form para agad na maabisuhan ang mga lokal na responder.", btn: "Mag-report Ngayon" },
    },
    map: {
      backBtn: "Bumalik sa Dashboard",
      titleStart: "Humanap ng Tulong", titleAccent: "Malapit sa Iyo",
      subtitle: "Mga serbisyong pang-emerhensiya, ospital, at evacuation center sa buong Dumaguete City",
      statTotal: "Kabuuan",
      filterLabel: "I-filter",
      filterAll: "Lahat",
      categories: { emergency: "Serbisyong Pang-emerhensiya", hospital: "Mga Ospital", evacuation: "Mga Evacuation Center" },
      searchPlaceholder: "Maghanap ng pasilidad o address…",
      showingPrefix: "Ipinapakita", showingOf: "sa", showingSuffix: "na pasilidad",
      navigateBtn: "Mag-navigate",
      emptyTitle: "Walang pasilidad na tumutugma sa iyong hanap.",
      legendTitle: "Alamat ng Mapa",
      liveTitle: "Dumaguete Coastal Watch",
      liveSubPrefix: "Live na mapa — lahat ng", liveSubSuffix: "na pasilidad ay aktibo",
      getDirections: "Kumuha ng Direksyon",
    },
  },

  // ── Bisaya / Cebuano ─────────────────────────────────────`
],
[
`      cta: { title: "Kinahanglan ba nimong mag-report og emerhensya?", desc: "Ayaw paghulat — gamita ang incident report form aron dayon mapahibalo ang lokal nga mga responder.", btn: "I-report Karon" },
    },
  },

  // ── Korean ───────────────────────────────────────────────`,
`      cta: { title: "Kinahanglan ba nimong mag-report og emerhensya?", desc: "Ayaw paghulat — gamita ang incident report form aron dayon mapahibalo ang lokal nga mga responder.", btn: "I-report Karon" },
    },
    map: {
      backBtn: "Balik sa Dashboard",
      titleStart: "Pangita og Tabang", titleAccent: "Duol Kanimo",
      subtitle: "Mga serbisyo sa emerhensya, ospital, ug evacuation center sa tibuok Dumaguete City",
      statTotal: "Total",
      filterLabel: "I-filter",
      filterAll: "Tanan",
      categories: { emergency: "Serbisyo sa Emerhensya", hospital: "Mga Ospital", evacuation: "Mga Evacuation Center" },
      searchPlaceholder: "Pangitaa ang pasilidad o address…",
      showingPrefix: "Gipakita", showingOf: "sa", showingSuffix: "ka pasilidad",
      navigateBtn: "Mag-navigate",
      emptyTitle: "Walay pasilidad nga mutugma sa imong gipangita.",
      legendTitle: "Sambag sa Mapa",
      liveTitle: "Dumaguete Coastal Watch",
      liveSubPrefix: "Live nga mapa — tanan nga", liveSubSuffix: "ka pasilidad aktibo",
      getDirections: "Pagkuha og Direksyon",
    },
  },

  // ── Korean ───────────────────────────────────────────────`
],
[
`      cta: { title: "긴급 상황을 신고해야 하나요?", desc: "기다리지 마세요 — 사고 신고 양식을 사용해 즉시 현지 대응요원에게 알리세요.", btn: "지금 신고하기" },
    },
  },

  // ── Chinese (Simplified) ─────────────────────────────────`,
`      cta: { title: "긴급 상황을 신고해야 하나요?", desc: "기다리지 마세요 — 사고 신고 양식을 사용해 즉시 현지 대응요원에게 알리세요.", btn: "지금 신고하기" },
    },
    map: {
      backBtn: "대시보드로 돌아가기",
      titleStart: "주변 도움", titleAccent: "찾기",
      subtitle: "두마게테시 전역의 긴급 서비스, 병원, 대피소 정보",
      statTotal: "전체",
      filterLabel: "필터",
      filterAll: "전체",
      categories: { emergency: "긴급 서비스", hospital: "병원", evacuation: "대피소" },
      searchPlaceholder: "시설 또는 주소 검색…",
      showingPrefix: "표시 중", showingOf: "/", showingSuffix: "개 시설",
      navigateBtn: "길찾기",
      emptyTitle: "검색 결과와 일치하는 시설이 없습니다.",
      legendTitle: "지도 범례",
      liveTitle: "두마게테 해안 감시",
      liveSubPrefix: "실시간 지도 — 총", liveSubSuffix: "개 시설 운영 중",
      getDirections: "길찾기",
    },
  },

  // ── Chinese (Simplified) ─────────────────────────────────`
],
[
`      cta: { title: "需要报告紧急情况吗？", desc: "不要等待——使用事件报告表立即通知当地应急人员。", btn: "立即报告" },
    },
  },

  // ── Japanese ─────────────────────────────────────────────`,
`      cta: { title: "需要报告紧急情况吗？", desc: "不要等待——使用事件报告表立即通知当地应急人员。", btn: "立即报告" },
    },
    map: {
      backBtn: "返回仪表板",
      titleStart: "查找附近", titleAccent: "帮助",
      subtitle: "杜马格特市各地的紧急服务、医院和疏散中心",
      statTotal: "总计",
      filterLabel: "筛选",
      filterAll: "全部",
      categories: { emergency: "紧急服务", hospital: "医院", evacuation: "疏散中心" },
      searchPlaceholder: "搜索设施或地址…",
      showingPrefix: "显示", showingOf: "/", showingSuffix: "个设施",
      navigateBtn: "导航",
      emptyTitle: "没有符合您搜索条件的设施。",
      legendTitle: "地图图例",
      liveTitle: "杜马格特海岸监测",
      liveSubPrefix: "实时地图 — 全部", liveSubSuffix: "个设施均在运行",
      getDirections: "获取路线",
    },
  },

  // ── Japanese ─────────────────────────────────────────────`
],
[
`      cta: { title: "緊急事態を報告する必要がありますか？", desc: "待たないでください — インシデント報告フォームを使って、すぐに地元の対応者に知らせましょう。", btn: "今すぐ報告する" },
    },
  },

  // ── Russian ──────────────────────────────────────────────`,
`      cta: { title: "緊急事態を報告する必要がありますか？", desc: "待たないでください — インシデント報告フォームを使って、すぐに地元の対応者に知らせましょう。", btn: "今すぐ報告する" },
    },
    map: {
      backBtn: "ダッシュボードに戻る",
      titleStart: "近くの支援を", titleAccent: "探す",
      subtitle: "ドゥマゲッティ市内の緊急サービス、病院、避難所の情報",
      statTotal: "合計",
      filterLabel: "フィルター",
      filterAll: "すべて",
      categories: { emergency: "緊急サービス", hospital: "病院", evacuation: "避難所" },
      searchPlaceholder: "施設名や住所を検索…",
      showingPrefix: "表示中", showingOf: "/", showingSuffix: "件の施設",
      navigateBtn: "ナビゲート",
      emptyTitle: "検索条件に一致する施設がありません。",
      legendTitle: "地図の凡例",
      liveTitle: "ドゥマゲッティ沿岸監視",
      liveSubPrefix: "ライブマップ — 全", liveSubSuffix: "件の施設が稼働中",
      getDirections: "道順を取得",
    },
  },

  // ── Russian ──────────────────────────────────────────────`
],
[
`      cta: { title: "Нужно сообщить о чрезвычайной ситуации?", desc: "Не ждите — используйте форму сообщения об инциденте, чтобы немедленно оповестить местных спасателей.", btn: "Сообщить сейчас" },
    },
  },

  // ── Arabic (RTL) ─────────────────────────────────────────`,
`      cta: { title: "Нужно сообщить о чрезвычайной ситуации?", desc: "Не ждите — используйте форму сообщения об инциденте, чтобы немедленно оповестить местных спасателей.", btn: "Сообщить сейчас" },
    },
    map: {
      backBtn: "Назад к панели",
      titleStart: "Найти помощь", titleAccent: "рядом с вами",
      subtitle: "Экстренные службы, больницы и эвакуационные центры по всему городу Думагете",
      statTotal: "Всего",
      filterLabel: "Фильтр",
      filterAll: "Все",
      categories: { emergency: "Экстренные службы", hospital: "Больницы", evacuation: "Эвакуационные центры" },
      searchPlaceholder: "Поиск объектов или адресов…",
      showingPrefix: "Показано", showingOf: "из", showingSuffix: "объектов",
      navigateBtn: "Маршрут",
      emptyTitle: "Нет объектов, соответствующих вашему запросу.",
      legendTitle: "Легенда карты",
      liveTitle: "Прибрежный дозор Думагете",
      liveSubPrefix: "Карта в реальном времени — все", liveSubSuffix: "объектов активны",
      getDirections: "Проложить маршрут",
    },
  },

  // ── Arabic (RTL) ─────────────────────────────────────────`
],
[
`      cta: { title: "هل تحتاج إلى الإبلاغ عن حالة طوارئ؟", desc: "لا تنتظر — استخدم نموذج الإبلاغ عن الحادثة لتنبيه المستجيبين المحليين فورًا.", btn: "الإبلاغ الآن" },
    },
  },
};`,
`      cta: { title: "هل تحتاج إلى الإبلاغ عن حالة طوارئ؟", desc: "لا تنتظر — استخدم نموذج الإبلاغ عن الحادثة لتنبيه المستجيبين المحليين فورًا.", btn: "الإبلاغ الآن" },
    },
    map: {
      backBtn: "العودة إلى لوحة التحكم",
      titleStart: "ابحث عن مساعدة", titleAccent: "بالقرب منك",
      subtitle: "خدمات الطوارئ والمستشفيات ومراكز الإخلاء في جميع أنحاء مدينة دوماغيتي",
      statTotal: "الإجمالي",
      filterLabel: "تصفية",
      filterAll: "الكل",
      categories: { emergency: "خدمات الطوارئ", hospital: "المستشفيات", evacuation: "مراكز الإخلاء" },
      searchPlaceholder: "ابحث عن مرفق أو عنوان…",
      showingPrefix: "عرض", showingOf: "من", showingSuffix: "مرفق",
      navigateBtn: "التوجيه",
      emptyTitle: "لا توجد مرافق تطابق بحثك.",
      legendTitle: "مفتاح الخريطة",
      liveTitle: "مراقبة ساحل دوماغيتي",
      liveSubPrefix: "خريطة مباشرة — جميع", liveSubSuffix: "مرفق نشط",
      getDirections: "الحصول على الاتجاهات",
    },
  },
};`
]
];

let applied = 0;
edits.forEach(([oldStr, newStr], i) => {
  const idx = content.indexOf(oldStr);
  if (idx === -1) {
    console.log(`❌ Edit ${i + 1}: anchor text not found — skipping.`);
    return;
  }
  content = content.replace(oldStr, newStr);
  applied++;
  console.log(`✅ Edit ${i + 1} applied.`);
});

fs.writeFileSync(path, content, 'utf8');
console.log(`\nDone: ${applied}/${edits.length} edits applied to ${path}`);
