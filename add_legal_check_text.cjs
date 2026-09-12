const fs = require('fs');
const path = require('path');

const FILE = process.argv[2] || 'src/translations/index.ts';

const entries = [
  {
    anchorSummary: `legalSummary: "By submitting this report, you confirm that the information provided is true and accurate to the best of your knowledge.",`,
    checkText: `I understand that submitting <strong>false, misleading, or malicious reports</strong> is punishable under the <strong>Cybercrime Prevention Act of 2012 (RA 10175)</strong>, the <strong>Revised Penal Code</strong>, and other applicable Philippine laws. Penalties may include fines and imprisonment. All reports are logged and may be investigated by authorities.`,
    lang: 'en',
  },
  {
    anchorSummary: `legalSummary: "Sa pagsumite ng ulat na ito, kinukumpirma mo na ang impormasyong ibinigay ay totoo at wasto sa iyong kaalaman.",`,
    checkText: `Nauunawaan ko na ang pagsusumite ng <strong>huwad, mapanlinlang, o may masamang hangaring ulat</strong> ay parurusahan sa ilalim ng <strong>Cybercrime Prevention Act of 2012 (RA 10175)</strong>, ng <strong>Revised Penal Code</strong>, at iba pang naaangkop na batas ng Pilipinas. Maaaring kasama sa parusa ang multa at pagkabilanggo. Lahat ng ulat ay itinatala at maaaring imbestigahan ng mga awtoridad.`,
    lang: 'tl',
  },
  {
    anchorSummary: `legalSummary: "Pinaagi sa pagsumite niini nga report, imong gikumpirma nga ang impormasyon nga gihatag tinuod ug tukma base sa imong nahibaloan.",`,
    checkText: `Nasabtan nako nga ang pagsumite og <strong>bakak, makapahisalaag, o malisyosong mga report</strong> silotan ubos sa <strong>Cybercrime Prevention Act of 2012 (RA 10175)</strong>, ang <strong>gi-usab nga Penal Code</strong>, ug uban pang aplikableng balaod sa Pilipinas. Ang mga silot mahimong maglakip og multa ug pagbilanggo. Ang tanang report girekord ug mahimong imbestigahan sa mga awtoridad.`,
    lang: 'ceb',
  },
  {
    anchorSummary: `legalSummary: "이 신고서를 제출함으로써 제공된 정보가 귀하가 아는 한 사실이고 정확함을 확인합니다.",`,
    checkText: `<strong>허위, 오해의 소지가 있거나 악의적인 신고</strong>를 제출하는 것은 <strong>2012년 사이버범죄 방지법(RA 10175)</strong>, <strong>개정 형법</strong> 및 기타 관련 필리핀 법률에 따라 처벌될 수 있음을 이해합니다. 처벌에는 벌금 및 징역이 포함될 수 있습니다. 모든 신고는 기록되며 당국에 의해 조사될 수 있습니다.`,
    lang: 'ko',
  },
  {
    anchorSummary: `legalSummary: "提交此报告即表示您确认所提供的信息据您所知真实准确。",`,
    checkText: `我理解，提交<strong>虚假、误导性或恶意的报告</strong>将依据<strong>2012年网络犯罪防治法(RA 10175)</strong>、<strong>修订刑法典</strong>及其他适用的菲律宾法律受到处罚。处罚可能包括罚款和监禁。所有报告均会被记录，并可能接受当局调查。`,
    lang: 'zh',
  },
  {
    anchorSummary: `legalSummary: "この報告を提出することにより、提供された情報が知る限り真実かつ正確であることを確認します。",`,
    checkText: `<strong>虚偽、誤解を招く、または悪意のある報告</strong>を提出することは、<strong>2012年サイバー犯罪防止法(RA 10175)</strong>、<strong>改正刑法</strong>、およびその他の適用されるフィリピンの法律により処罰されることを理解しています。処罰には罰金および禁固刑が含まれる場合があります。すべての報告は記録され、当局によって調査される場合があります。`,
    lang: 'ja',
  },
  {
    anchorSummary: `legalSummary: "Отправляя этот отчёт, вы подтверждаете, что предоставленная информация является правдивой и точной, насколько вам известно.",`,
    checkText: `Я понимаю, что подача <strong>ложных, вводящих в заблуждение или злонамеренных сообщений</strong> наказывается в соответствии с <strong>Законом о предотвращении киберпреступлений 2012 года (RA 10175)</strong>, <strong>Уголовным кодексом</strong> и другими применимыми законами Филиппин. Наказание может включать штрафы и лишение свободы. Все сообщения регистрируются и могут быть расследованы властями.`,
    lang: 'ru',
  },
  {
    anchorSummary: `legalSummary: "من خلال تقديم هذا البلاغ، فإنك تؤكد أن المعلومات المقدمة صحيحة ودقيقة على حد علمك.",`,
    checkText: `أفهم أن تقديم <strong>بلاغات كاذبة أو مضللة أو خبيثة</strong> يعاقب عليه القانون بموجب <strong>قانون مكافحة الجرائم الإلكترونية لعام 2012 (RA 10175)</strong>، و<strong>قانون العقوبات المعدل</strong>، وغيرها من القوانين الفلبينية المعمول بها. قد تشمل العقوبات الغرامات والسجن. يتم تسجيل جميع البلاغات وقد تخضع للتحقيق من قبل السلطات.`,
    lang: 'ar',
  },
];

let src = fs.readFileSync(FILE, 'utf8');
let inserted = 0;
let skipped = 0;

for (const { anchorSummary, checkText, lang } of entries) {
  if (!src.includes(anchorSummary)) {
    console.log(`[${lang}] SKIP: anchor line not found (check for whitespace/formatting drift)`);
    skipped++;
    continue;
  }
  const marker = `__LEGALCHECK_${lang}__`;
  if (src.includes(`legalCheckText:`) && src.split(anchorSummary)[1]?.trimStart().startsWith('legalCheckText:')) {
    console.log(`[${lang}] SKIP: legalCheckText already present after this line`);
    skipped++;
    continue;
  }
  const indentMatch = anchorSummary.match(/^(\s*)/);
  // anchorSummary has no leading whitespace captured (we matched from 'legalSummary'); detect indent from file instead
  const lines = src.split('\n');
  const idx = lines.findIndex(l => l.includes(anchorSummary));
  if (idx === -1) { console.log(`[${lang}] SKIP: not found via line scan`); skipped++; continue; }
  const indent = lines[idx].match(/^(\s*)/)[1];
  const newLine = `${indent}legalCheckText: "${checkText.replace(/"/g, '\\"')}",`;
  lines.splice(idx + 1, 0, newLine);
  src = lines.join('\n');
  console.log(`[${lang}] inserted`);
  inserted++;
}

// Update the TS interface so legalCheckText is a known field
const interfaceAnchor = `legalTitle: string; legalSummary: string;`;
if (src.includes(interfaceAnchor) && !src.includes(`legalTitle: string; legalSummary: string; legalCheckText: string;`)) {
  src = src.replace(interfaceAnchor, `legalTitle: string; legalSummary: string; legalCheckText: string;`);
  console.log('interface: updated');
} else {
  console.log('interface: already updated or anchor not found');
}

fs.writeFileSync(FILE, src, 'utf8');
console.log(`\nDone. Inserted: ${inserted}, Skipped: ${skipped}`);
console.log('Verify with: grep -c "legalCheckText" ' + FILE + '   (expect 8 in translation blocks + 1 in interface = 9)');
