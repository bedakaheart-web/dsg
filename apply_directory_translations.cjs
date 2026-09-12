const fs = require('fs');
const path = 'src/translations/index.ts';
let content = fs.readFileSync(path, 'utf8');

const edits = [
[
`    getDirections: string;
  };
};`,
`    getDirections: string;
  };
  directory: {
    heroConnected: string;
    heroSafe: string;
    heroSub: string;
    bannerLabel: string;
    bannerAllEmergencies: string;
    bannerPolice: string;
    bannerFire: string;
    bannerRescue: string;
    disclaimerBold: string;
    disclaimerRest: string;
    disclaimerEnd: string;
    emergencyTitle: string;
    emergencyCount: string;
    emergencyPlaceholder: string;
    emergencyEmpty: string;
    hospitalTitle: string;
    hospitalCount: string;
    hospitalPlaceholder: string;
    hospitalEmpty: string;
    barangayTitle: string;
    barangayCount: string;
    barangayPlaceholder: string;
    barangayEmpty: string;
    agencyPolice: string;
    agencyFire: string;
    agencyCityDrrm: string;
    agencyLocalDrrm: string;
    agencyEms: string;
    agencySeaRescue: string;
    agencyPower: string;
    agencyWater: string;
    government: string;
    private: string;
    callNow: string;
    mapBtn: string;
    call: string;
    navigate: string;
    badgeHotline: string;
    badgeEvacuation: string;
    badgeNoHotline: string;
    statWithHotlines: string;
    statWithEvacuation: string;
    statNoHotline: string;
    noHotlinePrefix: string;
    noHotlineMiddle: string;
  };
};`
],
[
`      getDirections: "Get Directions",
    },
  },

  // ── Tagalog / Filipino ───────────────────────────────────`,
`      getDirections: "Get Directions",
    },
    directory: {
      heroConnected: "Connected", heroSafe: "Safe",
      heroSub: "All critical contacts for Dumaguete City — landlines and mobile numbers for emergency services, hospitals, and every barangay hotline in one place.",
      bannerLabel: "Universal Emergency", bannerAllEmergencies: "All Emergencies", bannerPolice: "PNP Police", bannerFire: "BFP Fire", bannerRescue: "ONE Rescue",
      disclaimerBold: "911, 116, and 160 are free to call from any mobile or landline",
      disclaimerRest: "in the Philippines — no load required, no charges. Mobile numbers (09xx) and landlines (035) may incur standard call rates. When in doubt, dial",
      disclaimerEnd: "first.",
      emergencyTitle: "Emergency Services", emergencyCount: "agencies",
      emergencyPlaceholder: "Search agency, number, or service type…", emergencyEmpty: "No emergency service matches your search.",
      hospitalTitle: "Hospitals & Medical Facilities", hospitalCount: "facilities",
      hospitalPlaceholder: "Search hospital name, address, or phone number…", hospitalEmpty: "No hospital matches your search.",
      barangayTitle: "Barangay Emergency Contacts", barangayCount: "barangays",
      barangayPlaceholder: "Search barangay, hotline, or evacuation site…", barangayEmpty: "No barangay matches your search.",
      agencyPolice: "Police", agencyFire: "Fire Dept.", agencyCityDrrm: "City DRRM", agencyLocalDrrm: "Local DRRM", agencyEms: "EMS / Ambulance", agencySeaRescue: "Sea Rescue", agencyPower: "Power / Electric", agencyWater: "Water District",
      government: "Government", private: "Private",
      callNow: "Call Now", mapBtn: "Map", call: "Call", navigate: "Navigate",
      badgeHotline: "Hotline", badgeEvacuation: "Evacuation", badgeNoHotline: "No Direct Hotline",
      statWithHotlines: "with hotlines", statWithEvacuation: "with evacuation sites", statNoHotline: "no direct hotline",
      noHotlinePrefix: "No direct hotline — call", noHotlineMiddle: "or CDRRMO",
    },
  },

  // ── Tagalog / Filipino ───────────────────────────────────`
],
[
`      getDirections: "Kumuha ng Direksyon",
    },
  },

  // ── Bisaya / Cebuano ─────────────────────────────────────`,
`      getDirections: "Kumuha ng Direksyon",
    },
    directory: {
      heroConnected: "Konektado", heroSafe: "Ligtas",
      heroSub: "Lahat ng mahahalagang contact para sa Dumaguete City — landline at mobile number para sa mga serbisyong pang-emerhensiya, ospital, at bawat barangay hotline sa isang lugar.",
      bannerLabel: "Pangkalahatang Emerhensiya", bannerAllEmergencies: "Lahat ng Emerhensiya", bannerPolice: "PNP Pulis", bannerFire: "BFP Sunog", bannerRescue: "ONE Rescue",
      disclaimerBold: "Libre tumawag sa 911, 116, at 160 mula sa anumang mobile o landline",
      disclaimerRest: "sa Pilipinas — walang load na kailangan, walang bayad. Ang mobile number (09xx) at landline (035) ay maaaring may karaniwang singil. Kung nag-aalinlangan, tumawag sa",
      disclaimerEnd: "muna.",
      emergencyTitle: "Mga Serbisyong Pang-emerhensiya", emergencyCount: "ahensya",
      emergencyPlaceholder: "Maghanap ng ahensya, numero, o uri ng serbisyo…", emergencyEmpty: "Walang serbisyong pang-emerhensiya na tumutugma sa iyong hanap.",
      hospitalTitle: "Mga Ospital at Medikal na Pasilidad", hospitalCount: "pasilidad",
      hospitalPlaceholder: "Maghanap ng pangalan ng ospital, address, o numero ng telepono…", hospitalEmpty: "Walang ospital na tumutugma sa iyong hanap.",
      barangayTitle: "Mga Kontak sa Emerhensiya ng Barangay", barangayCount: "barangay",
      barangayPlaceholder: "Maghanap ng barangay, hotline, o evacuation site…", barangayEmpty: "Walang barangay na tumutugma sa iyong hanap.",
      agencyPolice: "Pulis", agencyFire: "Departamento ng Sunog", agencyCityDrrm: "City DRRM", agencyLocalDrrm: "Local DRRM", agencyEms: "EMS / Ambulansya", agencySeaRescue: "Sea Rescue", agencyPower: "Kuryente", agencyWater: "Tubig",
      government: "Gobyerno", private: "Pribado",
      callNow: "Tawagan Ngayon", mapBtn: "Mapa", call: "Tumawag", navigate: "Mag-navigate",
      badgeHotline: "Hotline", badgeEvacuation: "Evacuation", badgeNoHotline: "Walang Direktang Hotline",
      statWithHotlines: "may hotline", statWithEvacuation: "may evacuation site", statNoHotline: "walang direktang hotline",
      noHotlinePrefix: "Walang direktang hotline — tumawag sa", noHotlineMiddle: "o CDRRMO",
    },
  },

  // ── Bisaya / Cebuano ─────────────────────────────────────`
],
[
`      getDirections: "Pagkuha og Direksyon",
    },
  },

  // ── Korean ───────────────────────────────────────────────`,
`      getDirections: "Pagkuha og Direksyon",
    },
    directory: {
      heroConnected: "Konektado", heroSafe: "Luwas",
      heroSub: "Ang tanan nga importanteng kontak para sa Dumaguete City — landline ug mobile number para sa mga serbisyo sa emerhensya, ospital, ug matag barangay hotline sa usa ka dapit.",
      bannerLabel: "Kinatibuk-ang Emerhensya", bannerAllEmergencies: "Tanang Emerhensya", bannerPolice: "PNP Pulis", bannerFire: "BFP Sunog", bannerRescue: "ONE Rescue",
      disclaimerBold: "Libre motawag sa 911, 116, ug 160 gikan sa bisan unsang mobile o landline",
      disclaimerRest: "sa Pilipinas — walay load nga gikinahanglan, walay bayad. Ang mobile number (09xx) ug landline (035) mahimong adunay standard nga singil. Kung nagduha-duha, tawagi ang",
      disclaimerEnd: "una.",
      emergencyTitle: "Mga Serbisyo sa Emerhensya", emergencyCount: "ahensya",
      emergencyPlaceholder: "Pangitaa ang ahensya, numero, o klase sa serbisyo…", emergencyEmpty: "Walay serbisyo sa emerhensya nga mutugma sa imong gipangita.",
      hospitalTitle: "Mga Ospital ug Medikal nga Pasilidad", hospitalCount: "pasilidad",
      hospitalPlaceholder: "Pangitaa ang ngalan sa ospital, address, o numero sa telepono…", hospitalEmpty: "Walay ospital nga mutugma sa imong gipangita.",
      barangayTitle: "Mga Kontak sa Emerhensya sa Barangay", barangayCount: "barangay",
      barangayPlaceholder: "Pangitaa ang barangay, hotline, o evacuation site…", barangayEmpty: "Walay barangay nga mutugma sa imong gipangita.",
      agencyPolice: "Pulis", agencyFire: "Departamento sa Sunog", agencyCityDrrm: "City DRRM", agencyLocalDrrm: "Local DRRM", agencyEms: "EMS / Ambulansya", agencySeaRescue: "Sea Rescue", agencyPower: "Kuryente", agencyWater: "Tubig",
      government: "Gobyerno", private: "Pribado",
      callNow: "Tawagi Karon", mapBtn: "Mapa", call: "Tawag", navigate: "Mag-navigate",
      badgeHotline: "Hotline", badgeEvacuation: "Evacuation", badgeNoHotline: "Walay Direktang Hotline",
      statWithHotlines: "adunay hotline", statWithEvacuation: "adunay evacuation site", statNoHotline: "walay direktang hotline",
      noHotlinePrefix: "Walay direktang hotline — tawagi ang", noHotlineMiddle: "o CDRRMO",
    },
  },

  // ── Korean ───────────────────────────────────────────────`
],
[
`      getDirections: "길찾기",
    },
  },

  // ── Chinese (Simplified) ─────────────────────────────────`,
`      getDirections: "길찾기",
    },
    directory: {
      heroConnected: "연결", heroSafe: "안전",
      heroSub: "두마게테시의 모든 필수 연락처 — 긴급 서비스, 병원, 각 바랑가이 핫라인의 유선 및 휴대폰 번호를 한곳에 모았습니다.",
      bannerLabel: "통합 긴급 연락처", bannerAllEmergencies: "모든 긴급상황", bannerPolice: "PNP 경찰", bannerFire: "BFP 소방서", bannerRescue: "ONE 구조대",
      disclaimerBold: "911, 116, 160은 모든 휴대폰 또는 유선전화에서 무료로 통화 가능합니다",
      disclaimerRest: "필리핀 내에서 — 통화료나 요금이 부과되지 않습니다. 휴대폰 번호(09xx)와 유선전화(035)는 일반 통화 요금이 부과될 수 있습니다. 확실하지 않으면 먼저",
      disclaimerEnd: "로 전화하세요.",
      emergencyTitle: "긴급 서비스", emergencyCount: "개 기관",
      emergencyPlaceholder: "기관명, 번호 또는 서비스 유형 검색…", emergencyEmpty: "검색과 일치하는 긴급 서비스가 없습니다.",
      hospitalTitle: "병원 및 의료 시설", hospitalCount: "개 시설",
      hospitalPlaceholder: "병원 이름, 주소 또는 전화번호 검색…", hospitalEmpty: "검색과 일치하는 병원이 없습니다.",
      barangayTitle: "바랑가이 긴급 연락처", barangayCount: "개 바랑가이",
      barangayPlaceholder: "바랑가이, 핫라인 또는 대피소 검색…", barangayEmpty: "검색과 일치하는 바랑가이가 없습니다.",
      agencyPolice: "경찰", agencyFire: "소방서", agencyCityDrrm: "시 재난관리", agencyLocalDrrm: "지역 재난관리", agencyEms: "응급의료/구급차", agencySeaRescue: "해상 구조", agencyPower: "전력", agencyWater: "수도",
      government: "정부", private: "민간",
      callNow: "지금 전화", mapBtn: "지도", call: "전화", navigate: "길찾기",
      badgeHotline: "핫라인", badgeEvacuation: "대피소", badgeNoHotline: "직통 핫라인 없음",
      statWithHotlines: "개 핫라인 보유", statWithEvacuation: "개 대피소 보유", statNoHotline: "개 직통 핫라인 없음",
      noHotlinePrefix: "직통 핫라인 없음 — 전화하세요", noHotlineMiddle: "또는 CDRRMO",
    },
  },

  // ── Chinese (Simplified) ─────────────────────────────────`
],
[
`      getDirections: "获取路线",
    },
  },

  // ── Japanese ─────────────────────────────────────────────`,
`      getDirections: "获取路线",
    },
    directory: {
      heroConnected: "保持联系", heroSafe: "确保安全",
      heroSub: "杜马格特市所有重要联系方式——应急服务、医院和每个村庄热线的座机和手机号码，一应俱全。",
      bannerLabel: "统一紧急热线", bannerAllEmergencies: "所有紧急情况", bannerPolice: "PNP 警察", bannerFire: "BFP 消防", bannerRescue: "ONE 救援队",
      disclaimerBold: "911、116和160可通过任何手机或座机免费拨打",
      disclaimerRest: "在菲律宾境内——无需话费，无需付费。手机号码（09xx）和座机（035）可能产生标准通话费用。如有疑问，请先拨打",
      disclaimerEnd: "。",
      emergencyTitle: "紧急服务", emergencyCount: "个机构",
      emergencyPlaceholder: "搜索机构、号码或服务类型…", emergencyEmpty: "没有符合搜索条件的紧急服务。",
      hospitalTitle: "医院与医疗设施", hospitalCount: "家设施",
      hospitalPlaceholder: "搜索医院名称、地址或电话号码…", hospitalEmpty: "没有符合搜索条件的医院。",
      barangayTitle: "村庄紧急联系人", barangayCount: "个村庄",
      barangayPlaceholder: "搜索村庄、热线或疏散点…", barangayEmpty: "没有符合搜索条件的村庄。",
      agencyPolice: "警察", agencyFire: "消防局", agencyCityDrrm: "市减灾管理", agencyLocalDrrm: "地方减灾管理", agencyEms: "急救/救护车", agencySeaRescue: "海上救援", agencyPower: "电力", agencyWater: "供水",
      government: "政府", private: "私立",
      callNow: "立即拨打", mapBtn: "地图", call: "拨打", navigate: "导航",
      badgeHotline: "热线", badgeEvacuation: "疏散点", badgeNoHotline: "无直接热线",
      statWithHotlines: "个有热线", statWithEvacuation: "个有疏散点", statNoHotline: "个无直接热线",
      noHotlinePrefix: "无直接热线 — 请拨打", noHotlineMiddle: "或CDRRMO",
    },
  },

  // ── Japanese ─────────────────────────────────────────────`
],
[
`      getDirections: "道順を取得",
    },
  },

  // ── Russian ──────────────────────────────────────────────`,
`      getDirections: "道順を取得",
    },
    directory: {
      heroConnected: "つながる", heroSafe: "安全を守る",
      heroSub: "ドゥマゲッティ市のすべての重要な連絡先——緊急サービス、病院、各バランガイのホットラインの固定電話と携帯電話番号を一箇所にまとめました。",
      bannerLabel: "統合緊急連絡先", bannerAllEmergencies: "すべての緊急事態", bannerPolice: "PNP 警察", bannerFire: "BFP 消防", bannerRescue: "ONE 救助隊",
      disclaimerBold: "911、116、160はどの携帯電話や固定電話からでも無料で通話できます",
      disclaimerRest: "フィリピン国内——通話料はかかりません。携帯電話番号（09xx）と固定電話（035）は通常の通話料が発生する場合があります。迷ったときはまず",
      disclaimerEnd: "に電話してください。",
      emergencyTitle: "緊急サービス", emergencyCount: "機関",
      emergencyPlaceholder: "機関名、番号、サービスの種類を検索…", emergencyEmpty: "検索条件に一致する緊急サービスがありません。",
      hospitalTitle: "病院と医療施設", hospitalCount: "施設",
      hospitalPlaceholder: "病院名、住所、電話番号を検索…", hospitalEmpty: "検索条件に一致する病院がありません。",
      barangayTitle: "バランガイ緊急連絡先", barangayCount: "バランガイ",
      barangayPlaceholder: "バランガイ、ホットライン、避難所を検索…", barangayEmpty: "検索条件に一致するバランガイがありません。",
      agencyPolice: "警察", agencyFire: "消防署", agencyCityDrrm: "市防災管理", agencyLocalDrrm: "地域防災管理", agencyEms: "救急医療/救急車", agencySeaRescue: "海上救助", agencyPower: "電力", agencyWater: "水道",
      government: "政府", private: "民間",
      callNow: "今すぐ電話", mapBtn: "地図", call: "電話", navigate: "ナビ",
      badgeHotline: "ホットライン", badgeEvacuation: "避難所", badgeNoHotline: "直通ホットラインなし",
      statWithHotlines: "件がホットラインあり", statWithEvacuation: "件が避難所あり", statNoHotline: "件が直通ホットラインなし",
      noHotlinePrefix: "直通ホットラインなし — 電話してください", noHotlineMiddle: "またはCDRRMO",
    },
  },

  // ── Russian ──────────────────────────────────────────────`
],
[
`      getDirections: "Проложить маршрут",
    },
  },

  // ── Arabic (RTL) ─────────────────────────────────────────`,
`      getDirections: "Проложить маршрут",
    },
    directory: {
      heroConnected: "На связи", heroSafe: "В безопасности",
      heroSub: "Все важные контакты для города Думагете — стационарные и мобильные номера экстренных служб, больниц и горячих линий каждого барангая в одном месте.",
      bannerLabel: "Единая экстренная связь", bannerAllEmergencies: "Все экстренные случаи", bannerPolice: "PNP Полиция", bannerFire: "BFP Пожарная служба", bannerRescue: "ONE Rescue",
      disclaimerBold: "911, 116 и 160 бесплатны для звонков с любого мобильного или стационарного телефона",
      disclaimerRest: "на Филиппинах — без необходимости в балансе, без платы. Мобильные номера (09xx) и стационарные (035) могут тарифицироваться по стандартным ставкам. В случае сомнений сначала звоните",
      disclaimerEnd: ".",
      emergencyTitle: "Экстренные службы", emergencyCount: "учреждений",
      emergencyPlaceholder: "Поиск учреждения, номера или типа услуги…", emergencyEmpty: "Нет экстренных служб, соответствующих вашему запросу.",
      hospitalTitle: "Больницы и медицинские учреждения", hospitalCount: "учреждений",
      hospitalPlaceholder: "Поиск названия больницы, адреса или номера телефона…", hospitalEmpty: "Нет больниц, соответствующих вашему запросу.",
      barangayTitle: "Экстренные контакты барангаев", barangayCount: "барангаев",
      barangayPlaceholder: "Поиск барангая, горячей линии или пункта эвакуации…", barangayEmpty: "Нет барангаев, соответствующих вашему запросу.",
      agencyPolice: "Полиция", agencyFire: "Пожарная служба", agencyCityDrrm: "Городское управление по ЧС", agencyLocalDrrm: "Местное управление по ЧС", agencyEms: "Скорая помощь", agencySeaRescue: "Морское спасение", agencyPower: "Электричество", agencyWater: "Водоснабжение",
      government: "Государственная", private: "Частная",
      callNow: "Позвонить сейчас", mapBtn: "Карта", call: "Позвонить", navigate: "Маршрут",
      badgeHotline: "Горячая линия", badgeEvacuation: "Эвакуация", badgeNoHotline: "Нет прямой линии",
      statWithHotlines: "с горячей линией", statWithEvacuation: "с пунктом эвакуации", statNoHotline: "без прямой линии",
      noHotlinePrefix: "Нет прямой линии — звоните", noHotlineMiddle: "или в CDRRMO",
    },
  },

  // ── Arabic (RTL) ─────────────────────────────────────────`
],
[
`      getDirections: "الحصول على الاتجاهات",
    },
  },
};`,
`      getDirections: "الحصول على الاتجاهات",
    },
    directory: {
      heroConnected: "متصل", heroSafe: "آمن",
      heroSub: "جميع جهات الاتصال المهمة لمدينة دوماغيتي — أرقام الهواتف الأرضية والمحمولة لخدمات الطوارئ والمستشفيات وجميع خطوط طوارئ الأحياء في مكان واحد.",
      bannerLabel: "الطوارئ الشاملة", bannerAllEmergencies: "جميع حالات الطوارئ", bannerPolice: "شرطة PNP", bannerFire: "إطفاء BFP", bannerRescue: "فريق إنقاذ ONE",
      disclaimerBold: "يمكن الاتصال بالأرقام 911 و116 و160 مجانًا من أي هاتف محمول أو أرضي",
      disclaimerRest: "داخل الفلبين — دون الحاجة لرصيد أو أي رسوم. قد تُفرض رسوم عادية على أرقام الهواتف المحمولة (09xx) والأرضية (035). عند الشك، اتصل أولاً بـ",
      disclaimerEnd: ".",
      emergencyTitle: "خدمات الطوارئ", emergencyCount: "جهة",
      emergencyPlaceholder: "ابحث عن جهة أو رقم أو نوع الخدمة…", emergencyEmpty: "لا توجد خدمة طوارئ تطابق بحثك.",
      hospitalTitle: "المستشفيات والمرافق الطبية", hospitalCount: "مرفق",
      hospitalPlaceholder: "ابحث عن اسم المستشفى أو العنوان أو رقم الهاتف…", hospitalEmpty: "لا توجد مستشفى تطابق بحثك.",
      barangayTitle: "جهات اتصال طوارئ الأحياء", barangayCount: "حي",
      barangayPlaceholder: "ابحث عن الحي أو الخط الساخن أو موقع الإخلاء…", barangayEmpty: "لا يوجد حي يطابق بحثك.",
      agencyPolice: "الشرطة", agencyFire: "قسم الإطفاء", agencyCityDrrm: "إدارة الكوارث بالمدينة", agencyLocalDrrm: "إدارة الكوارث المحلية", agencyEms: "الإسعاف / الطوارئ الطبية", agencySeaRescue: "الإنقاذ البحري", agencyPower: "الكهرباء", agencyWater: "المياه",
      government: "حكومي", private: "خاص",
      callNow: "اتصل الآن", mapBtn: "الخريطة", call: "اتصال", navigate: "توجيه",
      badgeHotline: "خط ساخن", badgeEvacuation: "إخلاء", badgeNoHotline: "لا يوجد خط مباشر",
      statWithHotlines: "لديها خط ساخن", statWithEvacuation: "لديها موقع إخلاء", statNoHotline: "بدون خط مباشر",
      noHotlinePrefix: "لا يوجد خط مباشر — اتصل بـ", noHotlineMiddle: "أو CDRRMO",
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
