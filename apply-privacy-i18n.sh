#!/usr/bin/env bash
set -euo pipefail

# ── Adjust these if your files live elsewhere ──────────────────────────
TRANSLATIONS="${TRANSLATIONS:-src/i18n/translations.ts}"
LANG_CONTEXT="${LANG_CONTEXT:-src/context/LanguageContext.tsx}"
PRIVACY_PAGE="${PRIVACY_PAGE:-src/pages/PrivacyPolicy.tsx}"
# ────────────────────────────────────────────────────────────────────────

for f in "$TRANSLATIONS" "$LANG_CONTEXT" "$PRIVACY_PAGE"; do
  if [ ! -f "$f" ]; then
    echo "ERROR: file not found: $f"
    echo "Set TRANSLATIONS / LANG_CONTEXT / PRIVACY_PAGE env vars to the correct paths and re-run."
    exit 1
  fi
done

cp "$TRANSLATIONS" "$TRANSLATIONS.bak"
cp "$LANG_CONTEXT" "$LANG_CONTEXT.bak"
cp "$PRIVACY_PAGE" "$PRIVACY_PAGE.bak"
echo "Backups written: *.bak"

python3 - "$TRANSLATIONS" "$LANG_CONTEXT" "$PRIVACY_PAGE" <<'PYEOF'
import sys, re

translations_path, lang_context_path, privacy_page_path = sys.argv[1:4]

def must_replace_once(text, old, new, label):
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"ERROR: anchor for '{label}' found {count} times (expected 1). Aborting without writing any file. Anchor was:\n{old!r}")
    return text.replace(old, new, 1)

# ============================================================
# 1) translations.ts — add the TranslationDict type entry
# ============================================================
with open(translations_path, "r", encoding="utf-8") as f:
    tr = f.read()

type_anchor = '''  partnerAgencies: {
    eyebrow: string; heroTitle: string; heroAccent: string; heroSub: string;
    countSuffix: string;
    backToResources: string;
    breadcrumbResources: string; breadcrumbCurrent: string;
    ctaTitle: string; ctaDesc: string; ctaBtn: string;
  };
};'''

type_addition = '''  partnerAgencies: {
    eyebrow: string; heroTitle: string; heroAccent: string; heroSub: string;
    countSuffix: string;
    backToResources: string;
    breadcrumbResources: string; breadcrumbCurrent: string;
    ctaTitle: string; ctaDesc: string; ctaBtn: string;
  };
  privacyPolicy: {
    breadcrumbResources: string;
    breadcrumbTerms: string;
    breadcrumbCurrent: string;
    eyebrow: string;
    heroTitle: string;
    heroAccent: string;
    heroSub: string;
    effectiveMeta: string;
    introBold: string;
    introRest: string;
    sections: {
      collect: { heading: string; items: { label: string; detail: string }[] };
      usage: { heading: string; items: { label: string; detail: string }[] };
      rights: { heading: string; items: { label: string; detail: string }[] };
    };
    noticeBold: string;
    noticeRest: string;
    ctaTitle: string;
    ctaDesc: string;
    ctaBtn: string;
  };
};'''

tr = must_replace_once(tr, type_anchor, type_addition, "TranslationDict type")

# ============================================================
# 2) translations.ts — insert privacyPolicy data block per language
#    Anchored on each language's unique partnerAgencies.countSuffix line,
#    then inserted right after the block closes (before the language's
#    own closing brace).
# ============================================================

LANGS = {
"en": {
  "count_anchor": 'countSuffix: "partner agencies listed",',
  "block": '''
    privacyPolicy: {
      breadcrumbResources: "Resources",
      breadcrumbTerms: "Terms of Service",
      breadcrumbCurrent: "Privacy Policy",
      eyebrow: "Data & Privacy",
      heroTitle: "Privacy",
      heroAccent: "Policy",
      heroSub: "DumaSafeGuide values your privacy. We only collect what's necessary to power emergency reporting and community safety services.",
      effectiveMeta: "Effective Date: January 1, 2025 · Last Updated: June 2025",
      introBold: "Your data is never sold.",
      introRest: "Information collected through DumaSafeGuide is used exclusively to coordinate emergency responses and improve platform safety features. It is not shared with commercial third parties except as required by Philippine law or to support authorized emergency responders.",
      sections: {
        collect: {
          heading: "Information We Collect",
          items: [
            { label: "Basic user details for authentication", detail: "Name, email address, and contact information provided during account registration, used solely to authenticate you on the platform." },
            { label: "Emergency reports submitted through the system", detail: "Location data, incident descriptions, photos, and timestamps attached to any emergency report you file through DumaSafeGuide." },
            { label: "Feedback provided voluntarily", detail: "Ratings, suggestions, or comments you choose to submit to help us improve the platform's responsiveness and usability." },
          ],
        },
        usage: {
          heading: "Data Usage",
          items: [
            { label: "Improve system functionality", detail: "Aggregated, anonymized data helps us identify bottlenecks in report processing and improve response times across barangays." },
            { label: "Support emergency responders", detail: "Relevant incident details are shared with authorized CDRRMO, BFP, and Red Cross personnel to coordinate on-ground response." },
            { label: "Enhance public safety awareness", detail: "Trend data from reported incidents may be published in anonymized form to help the community understand local hazard patterns." },
          ],
        },
        rights: {
          heading: "Your Rights",
          items: [
            { label: "Right to Access", detail: "You may request a copy of all personal data we hold about you at any time by contacting the platform administrators." },
            { label: "Right to Deletion", detail: "You may request removal of your personal data. Requests will be processed within 30 days, subject to legal retention requirements." },
            { label: "Right to Correction", detail: "If any of your stored information is inaccurate, you may request a correction through your account settings or by contacting us directly." },
          ],
        },
      },
      noticeBold: "Questions about your data?",
      noticeRest: "Contact DumaSafeGuide administrators at admin@dumasafeguide.ph or reach out through the platform's feedback form. Data deletion requests are processed within 30 days, subject to legal retention obligations under Philippine law.",
      ctaTitle: "Need to report an emergency?",
      ctaDesc: "Don't wait — use the incident reporting form to alert local responders immediately.",
      ctaBtn: "Report Now",
    },'''
},
"tl": {
  "count_anchor": 'countSuffix: "kasosyong ahensya ang nakalista",',
  "block": '''
    privacyPolicy: {
      breadcrumbResources: "Mga Mapagkukunan",
      breadcrumbTerms: "Mga Tuntunin ng Serbisyo",
      breadcrumbCurrent: "Patakaran sa Privacy",
      eyebrow: "Datos at Privacy",
      heroTitle: "Patakaran sa",
      heroAccent: "Privacy",
      heroSub: "Pinahahalagahan ng DumaSafeGuide ang iyong privacy. Kinokolekta lamang namin ang kinakailangan para paganahin ang pag-uulat ng emerhensiya at mga serbisyo ng kaligtasan ng komunidad.",
      effectiveMeta: "Petsa ng Pagkakabisa: Enero 1, 2025 · Huling In-update: Hunyo 2025",
      introBold: "Hindi kailanman ipinagbibili ang iyong datos.",
      introRest: "Ang impormasyong nakolekta sa pamamagitan ng DumaSafeGuide ay ginagamit lamang upang i-coordinate ang tugon sa emerhensiya at mapahusay ang mga safety feature ng plataporma. Hindi ito ibinabahagi sa mga komersyal na third party maliban kung hinihingi ng batas ng Pilipinas o upang suportahan ang mga awtorisadong emergency responder.",
      sections: {
        collect: {
          heading: "Impormasyong Kinokolekta Namin",
          items: [
            { label: "Pangunahing detalye ng user para sa authentication", detail: "Pangalan, email address, at contact information na ibinigay sa panahon ng pagrehistro ng account, ginagamit lamang para i-authenticate ka sa plataporma." },
            { label: "Mga ulat ng emerhensiya na isinumite sa sistema", detail: "Data ng lokasyon, paglalarawan ng insidente, mga larawan, at timestamp na nakalakip sa anumang ulat ng emerhensiya na isasampa mo sa DumaSafeGuide." },
            { label: "Feedback na kusang-loob na ibinigay", detail: "Mga rating, mungkahi, o komento na pinili mong isumite upang matulungan kaming mapahusay ang pagtugon at pagiging madaling gamitin ng plataporma." },
          ],
        },
        usage: {
          heading: "Paggamit ng Datos",
          items: [
            { label: "Pagpapahusay ng functionality ng sistema", detail: "Ang pinagsama-samang, anonymized na datos ay tumutulong sa amin na tukuyin ang mga bottleneck sa pagproseso ng ulat at pahusayin ang oras ng tugon sa lahat ng barangay." },
            { label: "Suporta sa mga emergency responder", detail: "Ang mga may kaugnayang detalye ng insidente ay ibinabahagi sa awtorisadong tauhan ng CDRRMO, BFP, at Red Cross upang i-coordinate ang tugon sa lugar." },
            { label: "Pagpapahusay ng kamalayan sa kaligtasang pampubliko", detail: "Ang trend data mula sa mga inulat na insidente ay maaaring i-publish sa anonymized na anyo upang matulungan ang komunidad na maunawaan ang mga lokal na pattern ng panganib." },
          ],
        },
        rights: {
          heading: "Ang Iyong mga Karapatan",
          items: [
            { label: "Karapatang Mag-access", detail: "Maaari kang humiling ng kopya ng lahat ng personal na datos na hawak namin tungkol sa iyo anumang oras sa pamamagitan ng pakikipag-ugnayan sa mga administrator ng plataporma." },
            { label: "Karapatang Magpatanggal", detail: "Maaari kang humiling ng pagtanggal ng iyong personal na datos. Ang mga kahilingan ay ipoproseso sa loob ng 30 araw, alinsunod sa legal na kinakailangan sa pagpapanatili." },
            { label: "Karapatang Magpaayos", detail: "Kung mayroong hindi tumpak sa iyong nakaimbak na impormasyon, maaari kang humiling ng pagwawasto sa pamamagitan ng iyong account settings o sa pakikipag-ugnayan sa amin nang direkta." },
          ],
        },
      },
      noticeBold: "May mga tanong tungkol sa iyong datos?",
      noticeRest: "Makipag-ugnayan sa mga administrator ng DumaSafeGuide sa admin@dumasafeguide.ph o sa pamamagitan ng feedback form ng plataporma. Ang mga kahilingan sa pagtanggal ng datos ay ipoproseso sa loob ng 30 araw, alinsunod sa legal na obligasyon sa pagpapanatili sa ilalim ng batas ng Pilipinas.",
      ctaTitle: "Kailangan mo bang mag-report ng emerhensiya?",
      ctaDesc: "Huwag maghintay — gamitin ang incident report form para agad na maabisuhan ang mga lokal na responder.",
      ctaBtn: "Mag-report Ngayon",
    },'''
},
"ceb": {
  "count_anchor": 'countSuffix: "kasosyo nga ahensya ang nalista",',
  "block": '''
    privacyPolicy: {
      breadcrumbResources: "Mga Kapanguhaan",
      breadcrumbTerms: "Mga Termino sa Serbisyo",
      breadcrumbCurrent: "Palisiya sa Privacy",
      eyebrow: "Datos ug Privacy",
      heroTitle: "Palisiya sa",
      heroAccent: "Privacy",
      heroSub: "Gipabilhan sa DumaSafeGuide ang imong privacy. Gikolekta lang namo ang kinahanglanon aron mapadagan ang pag-report sa emerhensya ug mga serbisyo sa kaluwasan sa komunidad.",
      effectiveMeta: "Petsa nga Epektibo: Enero 1, 2025 · Katapusang Gi-update: Hunyo 2025",
      introBold: "Ang imong datos dili gyud ibaligya.",
      introRest: "Ang impormasyon nga nakolekta pinaagi sa DumaSafeGuide gigamit lamang aron i-coordinate ang tubag sa emerhensya ug mapaayo ang mga safety feature sa plataporma. Wala kini gipaambit sa mga komersyal nga third party gawas kung gikinahanglan sa balaod sa Pilipinas o aron suportahan ang mga awtorisadong emergency responder.",
      sections: {
        collect: {
          heading: "Impormasyon nga Among Gikolekta",
          items: [
            { label: "Batakang detalye sa user para sa authentication", detail: "Ngalan, email address, ug impormasyon sa kontak nga gihatag sa panahon sa pagrehistro sa account, gigamit lamang aron i-authenticate ka sa plataporma." },
            { label: "Mga report sa emerhensya nga gisumite sa sistema", detail: "Data sa lokasyon, deskripsyon sa insidente, mga litrato, ug timestamp nga nakalakip sa bisan unsang report sa emerhensya nga imong isumite sa DumaSafeGuide." },
            { label: "Feedback nga kinabubut-on nga gihatag", detail: "Mga rating, sugyot, o komento nga imong gipili nga isumite aron matabangan kami sa pagpaayo sa pagtubag ug kasayonon sa paggamit sa plataporma." },
          ],
        },
        usage: {
          heading: "Paggamit sa Datos",
          items: [
            { label: "Pagpaayo sa functionality sa sistema", detail: "Ang pinagsama, anonymized nga datos nagtabang kanamo sa pag-ila sa mga bottleneck sa pagproseso sa report ug pagpaayo sa oras sa tubag sa tanang barangay." },
            { label: "Pagsuporta sa mga emergency responder", detail: "Ang may kalabutan nga detalye sa insidente gipaambit sa awtorisadong personahe sa CDRRMO, BFP, ug Red Cross aron i-coordinate ang tubag sa lugar." },
            { label: "Pagpalambo sa kahibalo sa kaluwasan sa publiko", detail: "Ang trend data gikan sa mga gireport nga insidente mahimong ma-publish sa anonymized nga porma aron matabangan ang komunidad nga masabtan ang mga lokal nga pattern sa peligro." },
          ],
        },
        rights: {
          heading: "Imong mga Katungod",
          items: [
            { label: "Katungod sa Pag-access", detail: "Mahimo kang mangayo og kopya sa tanang personal nga datos nga among gitipigan bahin kanimo bisan unsang oras pinaagi sa pagkontak sa mga administrator sa plataporma." },
            { label: "Katungod sa Pagpapapas", detail: "Mahimo kang mangayo sa pagpapapas sa imong personal nga datos. Ang mga hangyo iproseso sulod sa 30 ka adlaw, subject sa legal nga kinahanglanon sa pagtipig." },
            { label: "Katungod sa Pagtul-id", detail: "Kung adunay dili tukma nga bahin sa imong natipigan nga impormasyon, mahimo kang mangayo og pagtul-id pinaagi sa imong account settings o pinaagi sa pagkontak kanamo direkta." },
          ],
        },
      },
      noticeBold: "Naa kay mga pangutana bahin sa imong datos?",
      noticeRest: "Kontaka ang mga administrator sa DumaSafeGuide sa admin@dumasafeguide.ph o pinaagi sa feedback form sa plataporma. Ang mga hangyo sa pagpapapas sa datos iproseso sulod sa 30 ka adlaw, subject sa legal nga obligasyon sa pagtipig ilalom sa balaod sa Pilipinas.",
      ctaTitle: "Kinahanglan ba nimong mag-report og emerhensya?",
      ctaDesc: "Ayaw paghulat — gamita ang incident report form aron dayon mapahibalo ang lokal nga mga responder.",
      ctaBtn: "I-report Karon",
    },'''
},
"ko": {
  "count_anchor": 'countSuffix: "개 협력 기관 등록됨",',
  "block": '''
    privacyPolicy: {
      breadcrumbResources: "자료",
      breadcrumbTerms: "서비스 이용약관",
      breadcrumbCurrent: "개인정보 보호정책",
      eyebrow: "데이터 및 개인정보",
      heroTitle: "개인정보",
      heroAccent: "보호정책",
      heroSub: "DumaSafeGuide는 귀하의 개인정보를 소중히 여깁니다. 긴급 신고 및 지역사회 안전 서비스 운영에 필요한 정보만 수집합니다.",
      effectiveMeta: "시행일: 2025년 1월 1일 · 최종 업데이트: 2025년 6월",
      introBold: "귀하의 데이터는 절대 판매되지 않습니다.",
      introRest: "DumaSafeGuide를 통해 수집된 정보는 오직 긴급 대응을 조율하고 플랫폼의 안전 기능을 개선하는 데에만 사용됩니다. 필리핀 법률에서 요구하거나 승인된 응급 대응요원을 지원하는 경우를 제외하고는 상업적 제3자와 공유되지 않습니다.",
      sections: {
        collect: {
          heading: "수집하는 정보",
          items: [
            { label: "인증을 위한 기본 사용자 정보", detail: "계정 등록 시 제공되는 이름, 이메일 주소 및 연락처 정보로, 플랫폼에서 귀하를 인증하는 용도로만 사용됩니다." },
            { label: "시스템을 통해 제출된 긴급 신고", detail: "DumaSafeGuide를 통해 제출하는 모든 긴급 신고에 첨부되는 위치 데이터, 사건 설명, 사진 및 타임스탬프입니다." },
            { label: "자발적으로 제공된 피드백", detail: "플랫폼의 응답성과 사용성을 개선하는 데 도움이 되도록 귀하가 선택적으로 제출하는 평가, 제안 또는 의견입니다." },
          ],
        },
        usage: {
          heading: "데이터 사용",
          items: [
            { label: "시스템 기능 개선", detail: "집계되고 익명화된 데이터는 신고 처리 병목 현상을 파악하고 모든 바랑가이의 대응 시간을 개선하는 데 도움이 됩니다." },
            { label: "응급 대응요원 지원", detail: "관련 사건 세부정보는 현장 대응을 조율하기 위해 승인된 CDRRMO, BFP 및 적십자 담당자와 공유됩니다." },
            { label: "공공 안전 인식 제고", detail: "신고된 사건의 추세 데이터는 지역사회가 지역 위험 패턴을 이해하는 데 도움이 되도록 익명화된 형태로 게시될 수 있습니다." },
          ],
        },
        rights: {
          heading: "귀하의 권리",
          items: [
            { label: "열람권", detail: "플랫폼 관리자에게 연락하여 언제든지 저희가 보유한 귀하의 모든 개인정보 사본을 요청할 수 있습니다." },
            { label: "삭제권", detail: "귀하의 개인정보 삭제를 요청할 수 있습니다. 요청은 법적 보관 요건에 따라 30일 이내에 처리됩니다." },
            { label: "정정권", detail: "저장된 정보에 부정확한 부분이 있는 경우, 계정 설정을 통해 또는 저희에게 직접 연락하여 정정을 요청할 수 있습니다." },
          ],
        },
      },
      noticeBold: "귀하의 데이터에 대해 궁금한 점이 있으신가요?",
      noticeRest: "admin@dumasafeguide.ph로 DumaSafeGuide 관리자에게 문의하시거나 플랫폼의 피드백 양식을 통해 연락해주세요. 데이터 삭제 요청은 필리핀 법률에 따른 법적 보관 의무에 따라 30일 이내에 처리됩니다.",
      ctaTitle: "긴급 상황을 신고해야 하나요?",
      ctaDesc: "기다리지 마세요 — 사고 신고 양식을 사용해 즉시 현지 대응요원에게 알리세요.",
      ctaBtn: "지금 신고하기",
    },'''
},
"zh": {
  "count_anchor": 'countSuffix: "个合作机构已列出",',
  "block": '''
    privacyPolicy: {
      breadcrumbResources: "资源",
      breadcrumbTerms: "服务条款",
      breadcrumbCurrent: "隐私政策",
      eyebrow: "数据与隐私",
      heroTitle: "隐私",
      heroAccent: "政策",
      heroSub: "DumaSafeGuide重视您的隐私。我们仅收集为紧急事件报告和社区安全服务提供支持所必需的信息。",
      effectiveMeta: "生效日期：2025年1月1日 · 最近更新：2025年6月",
      introBold: "您的数据绝不会被出售。",
      introRest: "通过DumaSafeGuide收集的信息仅用于协调应急响应和改善平台安全功能。除非菲律宾法律要求或为支持授权的应急响应人员，否则不会与商业第三方共享。",
      sections: {
        collect: {
          heading: "我们收集的信息",
          items: [
            { label: "用于身份验证的基本用户信息", detail: "账户注册期间提供的姓名、电子邮箱地址和联系信息，仅用于在平台上验证您的身份。" },
            { label: "通过系统提交的紧急报告", detail: "附加在您通过DumaSafeGuide提交的任何紧急报告上的位置数据、事件描述、照片和时间戳。" },
            { label: "自愿提供的反馈", detail: "您选择提交的评分、建议或意见，帮助我们改善平台的响应能力和易用性。" },
          ],
        },
        usage: {
          heading: "数据使用",
          items: [
            { label: "改进系统功能", detail: "汇总的匿名数据帮助我们识别报告处理中的瓶颈，并改善各村庄的响应时间。" },
            { label: "支持应急响应人员", detail: "相关事件详情会与经授权的CDRRMO、消防局和红十字会人员共享，以协调现场响应。" },
            { label: "提升公共安全意识", detail: "报告事件的趋势数据可能以匿名形式发布，以帮助社区了解本地风险模式。" },
          ],
        },
        rights: {
          heading: "您的权利",
          items: [
            { label: "访问权", detail: "您可以随时联系平台管理员，要求获取我们持有的关于您的所有个人数据副本。" },
            { label: "删除权", detail: "您可以要求删除您的个人数据。请求将在30天内处理，但须遵守法律保留要求。" },
            { label: "更正权", detail: "如果您存储的信息有任何不准确之处，您可以通过账户设置或直接联系我们要求更正。" },
          ],
        },
      },
      noticeBold: "对您的数据有疑问？",
      noticeRest: "请通过admin@dumasafeguide.ph联系DumaSafeGuide管理员，或通过平台的反馈表单与我们联系。数据删除请求将在30天内处理，但须遵守菲律宾法律规定的法律保留义务。",
      ctaTitle: "需要报告紧急情况吗？",
      ctaDesc: "不要等待——使用事件报告表立即通知当地应急人员。",
      ctaBtn: "立即报告",
    },'''
},
"ja": {
  "count_anchor": 'countSuffix: "の協力機関が登録されています",',
  "block": '''
    privacyPolicy: {
      breadcrumbResources: "リソース",
      breadcrumbTerms: "利用規約",
      breadcrumbCurrent: "プライバシーポリシー",
      eyebrow: "データとプライバシー",
      heroTitle: "プライバシー",
      heroAccent: "ポリシー",
      heroSub: "DumaSafeGuideはお客様のプライバシーを大切にしています。緊急通報と地域安全サービスの提供に必要な情報のみを収集します。",
      effectiveMeta: "発効日：2025年1月1日 · 最終更新：2025年6月",
      introBold: "お客様のデータが販売されることはありません。",
      introRest: "DumaSafeGuideを通じて収集された情報は、緊急対応の調整とプラットフォームの安全機能の向上のためだけに使用されます。フィリピンの法律で必要とされる場合、または認可された緊急対応者を支援する場合を除き、商業目的の第三者と共有されることはありません。",
      sections: {
        collect: {
          heading: "収集する情報",
          items: [
            { label: "認証のための基本ユーザー情報", detail: "アカウント登録時に提供される氏名、メールアドレス、連絡先情報で、プラットフォーム上でお客様を認証するためだけに使用されます。" },
            { label: "システムを通じて送信された緊急報告", detail: "DumaSafeGuideを通じて提出する緊急報告に添付される位置データ、事件の説明、写真、タイムスタンプです。" },
            { label: "自発的に提供されたフィードバック", detail: "プラットフォームの応答性と使いやすさの向上に役立てるため、お客様が任意で送信する評価、提案、コメントです。" },
          ],
        },
        usage: {
          heading: "データの利用",
          items: [
            { label: "システム機能の改善", detail: "集計され匿名化されたデータは、報告処理のボトルネックを特定し、すべてのバランガイでの対応時間を改善するのに役立ちます。" },
            { label: "緊急対応者の支援", detail: "関連する事件の詳細は、現場対応を調整するため、認可されたCDRRMO、消防局、赤十字社の担当者と共有されます。" },
            { label: "公共安全意識の向上", detail: "報告された事件の傾向データは、地域社会が地域の危険パターンを理解する助けとなるよう、匿名化された形で公開される場合があります。" },
          ],
        },
        rights: {
          heading: "お客様の権利",
          items: [
            { label: "アクセス権", detail: "プラットフォーム管理者に連絡することで、いつでも当社が保有するお客様の個人データのコピーを請求できます。" },
            { label: "削除権", detail: "個人データの削除を請求できます。リクエストは法的保存要件に従い、30日以内に処理されます。" },
            { label: "訂正権", detail: "保存された情報に誤りがある場合、アカウント設定を通じて、または直接当社にご連絡いただくことで訂正を請求できます。" },
          ],
        },
      },
      noticeBold: "お客様のデータについてご質問がありますか？",
      noticeRest: "admin@dumasafeguide.phまでDumaSafeGuide管理者にご連絡いただくか、プラットフォームのフィードバックフォームからご連絡ください。データ削除のリクエストは、フィリピン法に基づく法的保存義務に従い、30日以内に処理されます。",
      ctaTitle: "緊急事態を報告する必要がありますか？",
      ctaDesc: "待たないでください — インシデント報告フォームを使って、すぐに地元の対応者に知らせましょう。",
      ctaBtn: "今すぐ報告する",
    },'''
},
"ru": {
  "count_anchor": 'countSuffix: "партнёрских организаций указано",',
  "block": '''
    privacyPolicy: {
      breadcrumbResources: "Ресурсы",
      breadcrumbTerms: "Условия использования",
      breadcrumbCurrent: "Политика конфиденциальности",
      eyebrow: "Данные и конфиденциальность",
      heroTitle: "Политика",
      heroAccent: "конфиденциальности",
      heroSub: "DumaSafeGuide ценит вашу конфиденциальность. Мы собираем только те данные, которые необходимы для обеспечения работы сервисов сообщения о происшествиях и безопасности сообщества.",
      effectiveMeta: "Дата вступления в силу: 1 января 2025 г. · Последнее обновление: июнь 2025 г.",
      introBold: "Ваши данные никогда не продаются.",
      introRest: "Информация, собираемая через DumaSafeGuide, используется исключительно для координации реагирования на чрезвычайные ситуации и улучшения функций безопасности платформы. Она не передаётся коммерческим третьим лицам, за исключением случаев, предусмотренных законодательством Филиппин, или для поддержки уполномоченных спасателей.",
      sections: {
        collect: {
          heading: "Информация, которую мы собираем",
          items: [
            { label: "Основные данные пользователя для аутентификации", detail: "Имя, адрес электронной почты и контактная информация, предоставленные при регистрации аккаунта, используются исключительно для вашей аутентификации на платформе." },
            { label: "Сообщения о происшествиях, отправленные через систему", detail: "Данные о местоположении, описания происшествий, фотографии и временные метки, прикреплённые к любому сообщению о происшествии, поданному через DumaSafeGuide." },
            { label: "Добровольно предоставленные отзывы", detail: "Оценки, предложения или комментарии, которые вы решаете отправить, чтобы помочь нам улучшить отзывчивость и удобство использования платформы." },
          ],
        },
        usage: {
          heading: "Использование данных",
          items: [
            { label: "Улучшение функциональности системы", detail: "Агрегированные, обезличенные данные помогают нам выявлять узкие места в обработке сообщений и улучшать время реагирования во всех барангаях." },
            { label: "Поддержка спасательных служб", detail: "Соответствующие детали происшествий передаются уполномоченному персоналу CDRRMO, BFP и Красного Креста для координации реагирования на месте." },
            { label: "Повышение осведомлённости об общественной безопасности", detail: "Данные о тенденциях по зарегистрированным происшествиям могут публиковаться в обезличенном виде, чтобы помочь сообществу понять местные модели рисков." },
          ],
        },
        rights: {
          heading: "Ваши права",
          items: [
            { label: "Право на доступ", detail: "Вы можете в любое время запросить копию всех персональных данных, которые мы храним о вас, обратившись к администраторам платформы." },
            { label: "Право на удаление", detail: "Вы можете запросить удаление ваших персональных данных. Запросы обрабатываются в течение 30 дней с учётом требований законодательства о хранении данных." },
            { label: "Право на исправление", detail: "Если какая-либо из ваших сохранённых данных неверна, вы можете запросить исправление через настройки аккаунта или обратившись к нам напрямую." },
          ],
        },
      },
      noticeBold: "Есть вопросы о ваших данных?",
      noticeRest: "Свяжитесь с администраторами DumaSafeGuide по адресу admin@dumasafeguide.ph или через форму обратной связи платформы. Запросы на удаление данных обрабатываются в течение 30 дней с учётом требований законодательства Филиппин о хранении данных.",
      ctaTitle: "Нужно сообщить о чрезвычайной ситуации?",
      ctaDesc: "Не ждите — используйте форму сообщения об инциденте, чтобы немедленно оповестить местных спасателей.",
      ctaBtn: "Сообщить сейчас",
    },'''
},
"ar": {
  "count_anchor": 'countSuffix: "جهة شريكة مدرجة",',
  "block": '''
    privacyPolicy: {
      breadcrumbResources: "الموارد",
      breadcrumbTerms: "شروط الخدمة",
      breadcrumbCurrent: "سياسة الخصوصية",
      eyebrow: "البيانات والخصوصية",
      heroTitle: "سياسة",
      heroAccent: "الخصوصية",
      heroSub: "تُقدّر DumaSafeGuide خصوصيتك. نجمع فقط ما هو ضروري لتشغيل خدمات الإبلاغ عن الطوارئ وسلامة المجتمع.",
      effectiveMeta: "تاريخ السريان: 1 يناير 2025 · آخر تحديث: يونيو 2025",
      introBold: "بياناتك لا تُباع أبدًا.",
      introRest: "تُستخدم المعلومات التي يتم جمعها من خلال DumaSafeGuide حصريًا لتنسيق الاستجابة للطوارئ وتحسين ميزات السلامة في المنصة. لا تتم مشاركتها مع أطراف ثالثة تجارية إلا إذا اقتضى ذلك القانون الفلبيني أو لدعم المستجيبين المعتمدين للطوارئ.",
      sections: {
        collect: {
          heading: "المعلومات التي نجمعها",
          items: [
            { label: "بيانات المستخدم الأساسية للمصادقة", detail: "الاسم والبريد الإلكتروني ومعلومات الاتصال المقدمة أثناء تسجيل الحساب، وتُستخدم فقط للتحقق من هويتك على المنصة." },
            { label: "بلاغات الطوارئ المقدمة عبر النظام", detail: "بيانات الموقع ووصف الحادثة والصور والطوابع الزمنية المرفقة بأي بلاغ طوارئ تقدمه عبر DumaSafeGuide." },
            { label: "الملاحظات المقدمة طوعًا", detail: "التقييمات أو الاقتراحات أو التعليقات التي تختار تقديمها لمساعدتنا في تحسين استجابة المنصة وسهولة استخدامها." },
          ],
        },
        usage: {
          heading: "استخدام البيانات",
          items: [
            { label: "تحسين وظائف النظام", detail: "تساعدنا البيانات المجمّعة وغير المحددة الهوية في تحديد نقاط الاختناق في معالجة البلاغات وتحسين أوقات الاستجابة في جميع الأحياء." },
            { label: "دعم المستجيبين للطوارئ", detail: "تتم مشاركة تفاصيل الحادثة ذات الصلة مع موظفي CDRRMO وBFP والصليب الأحمر المعتمدين لتنسيق الاستجابة الميدانية." },
            { label: "تعزيز الوعي بالسلامة العامة", detail: "قد يتم نشر بيانات الاتجاهات من الحوادث المُبلَّغ عنها بشكل مجهول الهوية لمساعدة المجتمع على فهم أنماط المخاطر المحلية." },
          ],
        },
        rights: {
          heading: "حقوقك",
          items: [
            { label: "الحق في الوصول", detail: "يمكنك طلب نسخة من جميع بياناتك الشخصية التي نحتفظ بها في أي وقت من خلال التواصل مع مسؤولي المنصة." },
            { label: "الحق في الحذف", detail: "يمكنك طلب حذف بياناتك الشخصية. ستتم معالجة الطلبات خلال 30 يومًا، وفقًا لمتطلبات الاحتفاظ القانونية." },
            { label: "الحق في التصحيح", detail: "إذا كانت أي من معلوماتك المخزنة غير دقيقة، يمكنك طلب تصحيحها من خلال إعدادات حسابك أو بالتواصل معنا مباشرة." },
          ],
        },
      },
      noticeBold: "لديك أسئلة حول بياناتك؟",
      noticeRest: "تواصل مع مسؤولي DumaSafeGuide عبر admin@dumasafeguide.ph أو من خلال نموذج الملاحظات في المنصة. تتم معالجة طلبات حذف البيانات خلال 30 يومًا، وفقًا لالتزامات الاحتفاظ القانونية بموجب القانون الفلبيني.",
      ctaTitle: "هل تحتاج إلى الإبلاغ عن حالة طوارئ؟",
      ctaDesc: "لا تنتظر — استخدم نموذج الإبلاغ عن الحادثة لتنبيه المستجيبين المحليين فورًا.",
      ctaBtn: "الإبلاغ الآن",
    },'''
},
}

for code, cfg in LANGS.items():
    anchor = cfg["count_anchor"]
    count = tr.count(anchor)
    if count != 1:
        raise SystemExit(f"ERROR: countSuffix anchor for language '{code}' found {count} times (expected 1). Aborting without writing any file.\nAnchor: {anchor!r}")
    idx = tr.index(anchor)
    # find the first "\n    },\n  },\n" after this anchor -> closes partnerAgencies, then closes the language block
    close_pattern = "\n    },\n  },\n"
    close_idx = tr.index(close_pattern, idx)
    insert_at = close_idx + len("\n    },")  # right after partnerAgencies' own closing "    },"
    tr = tr[:insert_at] + cfg["block"] + tr[insert_at:]

with open(translations_path, "w", encoding="utf-8") as f:
    f.write(tr)
print(f"Patched: {translations_path}")

# ============================================================
# 3) LanguageContext.tsx — add generic tData() getter
# ============================================================
with open(lang_context_path, "r", encoding="utf-8") as f:
    lc = f.read()

interface_anchor = '''  /** Look up a nested string array by dot path, e.g. t("ticker.alerts") — for lists */
  tList: (path: string) => string[];
}'''
interface_addition = '''  /** Look up a nested string array by dot path, e.g. t("ticker.alerts") — for lists */
  tList: (path: string) => string[];
  /** Look up any nested value (objects, arrays) by dot path — falls back to English. */
  tData: <T,>(path: string) => T | undefined;
}'''
lc = must_replace_once(lc, interface_anchor, interface_addition, "LanguageContextValue interface")

impl_anchor = '''  const tList = (path: string): string[] => {
    const value = getNested(dict, path);
    if (Array.isArray(value)) return value;
    const fallback = getNested(translations.en, path);
    return Array.isArray(fallback) ? fallback : [];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, hasChosenLanguage: hasChosen, isRTL, t, tList }}>'''
impl_addition = '''  const tList = (path: string): string[] => {
    const value = getNested(dict, path);
    if (Array.isArray(value)) return value;
    const fallback = getNested(translations.en, path);
    return Array.isArray(fallback) ? fallback : [];
  };

  const tData = <T,>(path: string): T | undefined => {
    const value = getNested(dict, path);
    if (value !== undefined) return value as T;
    const fallback = getNested(translations.en, path);
    return fallback as T | undefined;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, hasChosenLanguage: hasChosen, isRTL, t, tList, tData }}>'''
lc = must_replace_once(lc, impl_anchor, impl_addition, "LanguageProvider implementation")

with open(lang_context_path, "w", encoding="utf-8") as f:
    f.write(lc)
print(f"Patched: {lang_context_path}")

# ============================================================
# 4) PrivacyPolicy.tsx — wire up useLanguage()
# ============================================================
with open(privacy_page_path, "r", encoding="utf-8") as f:
    pp = f.read()

pp = must_replace_once(
    pp,
    'import { Link } from "react-router-dom";\nimport emergencyBg from "../assets/emergency.jpg";',
    'import { Link } from "react-router-dom";\nimport emergencyBg from "../assets/emergency.jpg";\nimport { useLanguage } from "../context/LanguageContext";',
    "PrivacyPolicy imports",
)

old_sections_block = '''const sections = [
  {
    id: "what-we-collect",
    heading: "Information We Collect",
    icon: "📥",
    items: [
      {
        label: "Basic user details for authentication",
        detail:
          "Name, email address, and contact information provided during account registration, used solely to authenticate you on the platform.",
      },
      {
        label: "Emergency reports submitted through the system",
        detail:
          "Location data, incident descriptions, photos, and timestamps attached to any emergency report you file through DumaSafeGuide.",
      },
      {
        label: "Feedback provided voluntarily",
        detail:
          "Ratings, suggestions, or comments you choose to submit to help us improve the platform's responsiveness and usability.",
      },
    ],
  },
  {
    id: "data-usage",
    heading: "Data Usage",
    icon: "⚙️",
    items: [
      {
        label: "Improve system functionality",
        detail:
          "Aggregated, anonymized data helps us identify bottlenecks in report processing and improve response times across barangays.",
      },
      {
        label: "Support emergency responders",
        detail:
          "Relevant incident details are shared with authorized CDRRMO, BFP, and Red Cross personnel to coordinate on-ground response.",
      },
      {
        label: "Enhance public safety awareness",
        detail:
          "Trend data from reported incidents may be published in anonymized form to help the community understand local hazard patterns.",
      },
    ],
  },
  {
    id: "data-rights",
    heading: "Your Rights",
    icon: "✋",
    items: [
      {
        label: "Right to Access",
        detail:
          "You may request a copy of all personal data we hold about you at any time by contacting the platform administrators.",
      },
      {
        label: "Right to Deletion",
        detail:
          "You may request removal of your personal data. Requests will be processed within 30 days, subject to legal retention requirements.",
      },
      {
        label: "Right to Correction",
        detail:
          "If any of your stored information is inaccurate, you may request a correction through your account settings or by contacting us directly.",
      },
    ],
  },
];'''

new_sections_block = '''type PPItem = { label: string; detail: string };

const sectionMeta = [
  { id: "what-we-collect", key: "collect", icon: "📥" },
  { id: "data-usage", key: "usage", icon: "⚙️" },
  { id: "data-rights", key: "rights", icon: "✋" },
] as const;'''

pp = must_replace_once(pp, old_sections_block, new_sections_block, "PrivacyPolicy static sections array")

old_component_open = '''export default function PrivacyPolicy() {
  return ('''
new_component_open = '''export default function PrivacyPolicy() {
  const { t, tData, isRTL } = useLanguage();

  const sections = sectionMeta.map((meta) => ({
    id: meta.id,
    icon: meta.icon,
    heading: t(`privacyPolicy.sections.${meta.key}.heading`),
    items: tData<PPItem[]>(`privacyPolicy.sections.${meta.key}.items`) ?? [],
  }));

  return ('''
pp = must_replace_once(pp, old_component_open, new_component_open, "PrivacyPolicy component body opening")

old_breadcrumb = '''            <div className="pp-breadcrumb">
              <a href="/resources">Resources</a>
              <span className="pp-breadcrumb-sep">›</span>
              <a href="/terms">Terms of Service</a>
              <span className="pp-breadcrumb-sep">›</span>
              <span className="pp-breadcrumb-current">Privacy Policy</span>
            </div>

            <div className="pp-hero-eyebrow">Data &amp; Privacy</div>
            <h1>
              Privacy <span className="accent">Policy</span>
            </h1>
            <p className="pp-hero-sub">
              DumaSafeGuide values your privacy. We only collect what's necessary
              to power emergency reporting and community safety services.
            </p>
            <div className="pp-meta">
              <div className="pp-meta-dot" />
              Effective Date: January 1, 2025 · Last Updated: June 2025
            </div>'''
new_breadcrumb = '''            <div className="pp-breadcrumb">
              <a href="/resources">{t("privacyPolicy.breadcrumbResources")}</a>
              <span className="pp-breadcrumb-sep">{isRTL ? "‹" : "›"}</span>
              <a href="/terms">{t("privacyPolicy.breadcrumbTerms")}</a>
              <span className="pp-breadcrumb-sep">{isRTL ? "‹" : "›"}</span>
              <span className="pp-breadcrumb-current">{t("privacyPolicy.breadcrumbCurrent")}</span>
            </div>

            <div className="pp-hero-eyebrow">{t("privacyPolicy.eyebrow")}</div>
            <h1>
              {t("privacyPolicy.heroTitle")} <span className="accent">{t("privacyPolicy.heroAccent")}</span>
            </h1>
            <p className="pp-hero-sub">
              {t("privacyPolicy.heroSub")}
            </p>
            <div className="pp-meta">
              <div className="pp-meta-dot" />
              {t("privacyPolicy.effectiveMeta")}
            </div>'''
pp = must_replace_once(pp, old_breadcrumb, new_breadcrumb, "PrivacyPolicy breadcrumb/hero JSX")

old_intro = '''          <div className="pp-intro">
            <strong>Your data is never sold.</strong> Information collected through DumaSafeGuide is used
            exclusively to coordinate emergency responses and improve platform safety features.
            It is not shared with commercial third parties except as required by Philippine law or
            to support authorized emergency responders.
          </div>'''
new_intro = '''          <div className="pp-intro">
            <strong>{t("privacyPolicy.introBold")}</strong> {t("privacyPolicy.introRest")}
          </div>'''
pp = must_replace_once(pp, old_intro, new_intro, "PrivacyPolicy intro JSX")

old_notice = '''          <div className="pp-notice">
            <strong>Questions about your data?</strong> Contact DumaSafeGuide administrators at
            admin@dumasafeguide.ph or reach out through the platform's feedback form. Data deletion
            requests are processed within 30 days, subject to legal retention obligations under Philippine law.
          </div>'''
new_notice = '''          <div className="pp-notice">
            <strong>{t("privacyPolicy.noticeBold")}</strong> {t("privacyPolicy.noticeRest")}
          </div>'''
pp = must_replace_once(pp, old_notice, new_notice, "PrivacyPolicy notice JSX")

old_cta = '''          <div className="pp-cta">
            <div className="pp-cta-text">
              <h3>Need to report an emergency?</h3>
              <p>Don't wait — use the incident reporting form to alert local responders immediately.</p>
            </div>
            <a href="/report" className="pp-cta-btn">
              <span>🚨</span> Report Now
            </a>
          </div>'''
new_cta = '''          <div className="pp-cta">
            <div className="pp-cta-text">
              <h3>{t("privacyPolicy.ctaTitle")}</h3>
              <p>{t("privacyPolicy.ctaDesc")}</p>
            </div>
            <a href="/report" className="pp-cta-btn">
              <span>🚨</span> {t("privacyPolicy.ctaBtn")}
            </a>
          </div>'''
pp = must_replace_once(pp, old_cta, new_cta, "PrivacyPolicy CTA JSX")

with open(privacy_page_path, "w", encoding="utf-8") as f:
    f.write(pp)
print(f"Patched: {privacy_page_path}")

print("\nAll patches applied successfully.")
PYEOF

echo ""
echo "Done. If anything looks wrong, restore with:"
echo "  mv '$TRANSLATIONS.bak' '$TRANSLATIONS'"
echo "  mv '$LANG_CONTEXT.bak' '$LANG_CONTEXT'"
echo "  mv '$PRIVACY_PAGE.bak' '$PRIVACY_PAGE'"
