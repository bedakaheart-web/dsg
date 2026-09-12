// apply_signup_translations.cjs
//
// Adds a full `signup` translation section (type + all 8 languages)
// to src/translations/index.ts for the Signup.tsx page.
// Anchors off the `report` section added by apply_report_translations.cjs,
// so RUN THAT SCRIPT FIRST if you haven't already.
//
// Usage (run from your project root, where package.json lives):
//   node apply_signup_translations.cjs

const fs = require("fs");
const path = require("path");

const FILE = path.join(process.cwd(), "src", "translations", "index.ts");

if (!fs.existsSync(FILE)) {
  console.error(`❌ Could not find ${FILE}`);
  process.exit(1);
}

let src = fs.readFileSync(FILE, "utf8");
const original = src;

// ── 1. Patch the TranslationDict type ───────────────────────────────────────
const typeAnchor = `    success: { title: string; sub: string; cardTitle: string; cardText: string; cardBtn: string };
  };
};`;

const typeReplacement = `    success: { title: string; sub: string; cardTitle: string; cardText: string; cardBtn: string };
  };
  signup: {
    eyebrow: string;
    heroLine1: string; heroAccent1: string; heroAccent2: string;
    heroDesc: string;
    steps: {
      create: { title: string; desc: string };
      access: { title: string; desc: string };
      report: { title: string; desc: string };
    };
    certBold: string; certRest: string;
    mobileBadge: string;
    backToHome: string;
    formTitle: string; formSub: string;
    labels: { firstName: string; lastName: string; barangay: string; phone: string; email: string; password: string; confirmPassword: string };
    placeholders: { firstName: string; lastName: string; phone: string; selectLocation: string };
    pwHint: string; emailHint: string; emailInvalid: string;
    errors: {
      missingFields: string; invalidEmail: string; disposableEmail: string;
      passwordMismatch: string; passwordTooShort: string; needCaptcha: string; unexpected: string;
    };
    submitBtn: string; submitting: string;
    footerHaveAccount: string; footerSignIn: string;
    success: { title: string; msgIntro: string; msgBody: string; note: string; goToSignIn: string };
  };
};`;

if (src.includes(typeAnchor)) {
  src = src.replace(typeAnchor, typeReplacement);
  console.log("✅ Patched TranslationDict type with `signup` section");
} else if (src.includes("signup: {\n    eyebrow:")) {
  console.log("↷ TranslationDict type already patched — skipping");
} else {
  console.warn("⚠️  Could not find the `report` type closing anchor.");
  console.warn("    Make sure apply_report_translations.cjs ran successfully first.");
}

// ── 2. Per-language `signup` object, anchored off report's unique cardBtn line ──
const LANGS = [
  {
    code: "en",
    anchor: `cardBtn: "Submit Another Report →",`,
    body: `      eyebrow: "Community Safety Platform",
      heroLine1: "Join the", heroAccent1: "emergency", heroAccent2: "response",
      heroDesc: "Register your account to report incidents, receive real-time alerts, and stay connected with emergency responders across all barangays.",
      steps: {
        create: { title: "Create Account", desc: "Fill your details and select your barangay." },
        access: { title: "Instant Access", desc: "Your account is ready immediately after signup." },
        report: { title: "Report & Respond", desc: "Submit incidents and coordinate with responders now." },
      },
      certBold: "Free for all citizens", certRest: "in Dumaguete",
      mobileBadge: "Sign Up",
      backToHome: "Back to home",
      formTitle: "Create Account",
      formSub: "Join DumaSafeGuide — it's completely free for all citizens.",
      labels: { firstName: "First Name", lastName: "Last Name", barangay: "Barangay", phone: "Phone Number", email: "Email Address", password: "Password", confirmPassword: "Confirm" },
      placeholders: { firstName: "Maria", lastName: "Clara", phone: "09XX XXX XXXX", selectLocation: "Select location" },
      pwHint: "Minimum 6 characters required.",
      emailHint: "Use an email you can check — we'll send a confirmation link before you can sign in.",
      emailInvalid: "Please enter a valid email address.",
      errors: {
        missingFields: "Please complete all fields.",
        invalidEmail: "Please enter a valid email address.",
        disposableEmail: "Temporary or disposable email addresses aren't allowed. Please use a real email you can access.",
        passwordMismatch: "Passwords do not match.",
        passwordTooShort: "Password must be at least 6 characters.",
        needCaptcha: "Please complete the CAPTCHA to verify you're human.",
        unexpected: "An unexpected error occurred.",
      },
      submitBtn: "Create Account", submitting: "Creating account…",
      footerHaveAccount: "Already have an account?", footerSignIn: "Sign in →",
      success: {
        title: "Check Your Email",
        msgIntro: "Welcome to DumaSafeGuide!",
        msgBody: "We've sent a confirmation link to your email. Please verify your address before signing in.",
        note: "Didn't get it? Check your spam folder.",
        goToSignIn: "Go to Sign In",
      },`,
  },
  {
    code: "tl",
    anchor: `cardBtn: "Magsumite ng Isa pang Ulat →",`,
    body: `      eyebrow: "Platform ng Kaligtasan ng Komunidad",
      heroLine1: "Sumali sa", heroAccent1: "emerhensiya", heroAccent2: "na pagtugon",
      heroDesc: "Magrehistro ng account para mag-ulat ng insidente, makatanggap ng real-time na alerto, at manatiling konektado sa mga emergency responder sa lahat ng barangay.",
      steps: {
        create: { title: "Gumawa ng Account", desc: "Punan ang iyong detalye at piliin ang iyong barangay." },
        access: { title: "Agarang Access", desc: "Handa na agad ang iyong account pagkatapos mag-signup." },
        report: { title: "Mag-ulat at Tumugon", desc: "Magsumite ng insidente at makipag-ugnayan sa mga responder ngayon." },
      },
      certBold: "Libre para sa lahat ng mamamayan", certRest: "sa Dumaguete",
      mobileBadge: "Mag-sign Up",
      backToHome: "Bumalik sa home",
      formTitle: "Gumawa ng Account",
      formSub: "Sumali sa DumaSafeGuide — ganap na libre para sa lahat ng mamamayan.",
      labels: { firstName: "Pangalan", lastName: "Apelyido", barangay: "Barangay", phone: "Numero ng Telepono", email: "Email Address", password: "Password", confirmPassword: "Kumpirmahin" },
      placeholders: { firstName: "Maria", lastName: "Clara", phone: "09XX XXX XXXX", selectLocation: "Pumili ng lokasyon" },
      pwHint: "Kailangan ng hindi bababa sa 6 na karakter.",
      emailHint: "Gumamit ng email na maa-access mo — magpapadala kami ng confirmation link bago ka makapag-login.",
      emailInvalid: "Pakilagay ang tamang email address.",
      errors: {
        missingFields: "Pakikumpleto ang lahat ng field.",
        invalidEmail: "Pakilagay ang tamang email address.",
        disposableEmail: "Hindi pinapayagan ang pansamantalang o disposable na email. Gumamit ng tunay na email na maa-access mo.",
        passwordMismatch: "Hindi magkatugma ang mga password.",
        passwordTooShort: "Dapat hindi bababa sa 6 na karakter ang password.",
        needCaptcha: "Pakikumpleto ang CAPTCHA para i-verify na ikaw ay tao.",
        unexpected: "May hindi inaasahang error na naganap.",
      },
      submitBtn: "Gumawa ng Account", submitting: "Ginagawa ang account…",
      footerHaveAccount: "May account ka na?", footerSignIn: "Mag-sign in →",
      success: {
        title: "Tingnan ang Iyong Email",
        msgIntro: "Maligayang pagdating sa DumaSafeGuide!",
        msgBody: "Nagpadala kami ng confirmation link sa iyong email. Paki-verify ang iyong address bago mag-sign in.",
        note: "Hindi natanggap? Tingnan ang iyong spam folder.",
        goToSignIn: "Pumunta sa Sign In",
      },`,
  },
  {
    code: "ceb",
    anchor: `cardBtn: "Pagsumite og Lain nga Report →",`,
    body: `      eyebrow: "Platform sa Kaluwasan sa Komunidad",
      heroLine1: "Apil sa", heroAccent1: "emerhensya", heroAccent2: "nga pagtubag",
      heroDesc: "Pagparehistro og account aron makapag-report og insidente, makadawat og real-time nga alerto, ug magpabilin nga konektado sa mga emergency responder sa tanang barangay.",
      steps: {
        create: { title: "Paghimo og Account", desc: "Pun-a ang imong detalye ug pilia ang imong barangay." },
        access: { title: "Dayon nga Access", desc: "Andam na dayon ang imong account human mag-signup." },
        report: { title: "Pag-report ug Pagtubag", desc: "Pagsumite og insidente ug pakig-uban sa mga responder karon." },
      },
      certBold: "Libre para sa tanang lungsuranon", certRest: "sa Dumaguete",
      mobileBadge: "Mag-sign Up",
      backToHome: "Balik sa home",
      formTitle: "Paghimo og Account",
      formSub: "Apil sa DumaSafeGuide — hingpit nga libre para sa tanang lungsuranon.",
      labels: { firstName: "Ngalan", lastName: "Apelyido", barangay: "Barangay", phone: "Numero sa Telepono", email: "Email Address", password: "Password", confirmPassword: "Kumpirma" },
      placeholders: { firstName: "Maria", lastName: "Clara", phone: "09XX XXX XXXX", selectLocation: "Pagpili og lokasyon" },
      pwHint: "Kinahanglan nga dili moubos sa 6 ka karakter.",
      emailHint: "Gamita ang email nga imong ma-access — padad-an ka namo og confirmation link una ka makasulod.",
      emailInvalid: "Palihug isulat ang tukma nga email address.",
      errors: {
        missingFields: "Palihug kompletoha ang tanang field.",
        invalidEmail: "Palihug isulat ang tukma nga email address.",
        disposableEmail: "Dili tugutan ang temporary o disposable nga email. Gamita ang tinuod nga email nga imong ma-access.",
        passwordMismatch: "Wala magtugma ang mga password.",
        passwordTooShort: "Kinahanglan nga dili moubos sa 6 ka karakter ang password.",
        needCaptcha: "Palihug kompletoha ang CAPTCHA para mapamatud-an nga tawo ka.",
        unexpected: "Adunay wala damha nga sayop nga nahitabo.",
      },
      submitBtn: "Paghimo og Account", submitting: "Gihimo ang account…",
      footerHaveAccount: "Naa na kay account?", footerSignIn: "Pag-sign in →",
      success: {
        title: "Susiha ang Imong Email",
        msgIntro: "Welcome sa DumaSafeGuide!",
        msgBody: "Nagpadala kami og confirmation link sa imong email. Palihug i-verify ang imong address una mag-sign in.",
        note: "Wala nadawat? Susiha ang imong spam folder.",
        goToSignIn: "Adto sa Sign In",
      },`,
  },
  {
    code: "ko",
    anchor: `cardBtn: "다른 신고 제출하기 →",`,
    body: `      eyebrow: "커뮤니티 안전 플랫폼",
      heroLine1: "가입하기", heroAccent1: "긴급", heroAccent2: "대응",
      heroDesc: "계정을 등록하여 사건을 신고하고 실시간 알림을 받으며 모든 바랑가이의 응급 대응요원과 연결 상태를 유지하세요.",
      steps: {
        create: { title: "계정 만들기", desc: "세부 정보를 입력하고 바랑가이를 선택하세요." },
        access: { title: "즉시 이용 가능", desc: "가입 후 즉시 계정을 사용할 수 있습니다." },
        report: { title: "신고 및 대응", desc: "지금 사건을 제출하고 대응요원과 협력하세요." },
      },
      certBold: "모든 시민 무료", certRest: "두마게테시에서",
      mobileBadge: "회원가입",
      backToHome: "홈으로 돌아가기",
      formTitle: "계정 만들기",
      formSub: "DumaSafeGuide에 가입하세요 — 모든 시민에게 완전히 무료입니다.",
      labels: { firstName: "이름", lastName: "성", barangay: "바랑가이", phone: "전화번호", email: "이메일 주소", password: "비밀번호", confirmPassword: "확인" },
      placeholders: { firstName: "Maria", lastName: "Clara", phone: "09XX XXX XXXX", selectLocation: "지역 선택" },
      pwHint: "최소 6자 이상이어야 합니다.",
      emailHint: "확인 가능한 이메일을 사용하세요 — 로그인 전에 확인 링크를 보내드립니다.",
      emailInvalid: "유효한 이메일 주소를 입력해주세요.",
      errors: {
        missingFields: "모든 필드를 작성해주세요.",
        invalidEmail: "유효한 이메일 주소를 입력해주세요.",
        disposableEmail: "임시 또는 일회용 이메일 주소는 허용되지 않습니다. 실제로 접속 가능한 이메일을 사용해주세요.",
        passwordMismatch: "비밀번호가 일치하지 않습니다.",
        passwordTooShort: "비밀번호는 최소 6자 이상이어야 합니다.",
        needCaptcha: "사람인지 확인하기 위해 CAPTCHA를 완료해주세요.",
        unexpected: "예상치 못한 오류가 발생했습니다.",
      },
      submitBtn: "계정 만들기", submitting: "계정 생성 중…",
      footerHaveAccount: "이미 계정이 있으신가요?", footerSignIn: "로그인 →",
      success: {
        title: "이메일을 확인하세요",
        msgIntro: "DumaSafeGuide에 오신 것을 환영합니다!",
        msgBody: "귀하의 이메일로 확인 링크를 보내드렸습니다. 로그인하기 전에 주소를 확인해주세요.",
        note: "받지 못하셨나요? 스팸 폴더를 확인해주세요.",
        goToSignIn: "로그인으로 이동",
      },`,
  },
  {
    code: "zh",
    anchor: `cardBtn: "提交另一份报告 →",`,
    body: `      eyebrow: "社区安全平台",
      heroLine1: "加入", heroAccent1: "紧急", heroAccent2: "响应",
      heroDesc: "注册账户以举报事件、接收实时警报，并与所有村庄的应急响应人员保持联系。",
      steps: {
        create: { title: "创建账户", desc: "填写您的详细信息并选择您的村庄。" },
        access: { title: "即时访问", desc: "注册后您的账户即可立即使用。" },
        report: { title: "举报与响应", desc: "立即提交事件并与响应人员协调。" },
      },
      certBold: "所有市民免费", certRest: "在杜马格特",
      mobileBadge: "注册",
      backToHome: "返回首页",
      formTitle: "创建账户",
      formSub: "加入DumaSafeGuide——对所有市民完全免费。",
      labels: { firstName: "名字", lastName: "姓氏", barangay: "村庄", phone: "电话号码", email: "电子邮箱", password: "密码", confirmPassword: "确认密码" },
      placeholders: { firstName: "Maria", lastName: "Clara", phone: "09XX XXX XXXX", selectLocation: "选择位置" },
      pwHint: "至少需要6个字符。",
      emailHint: "请使用您可以查看的邮箱——登录前我们会发送确认链接。",
      emailInvalid: "请输入有效的电子邮箱地址。",
      errors: {
        missingFields: "请填写所有字段。",
        invalidEmail: "请输入有效的电子邮箱地址。",
        disposableEmail: "不允许使用临时或一次性电子邮箱。请使用您可以访问的真实邮箱。",
        passwordMismatch: "两次输入的密码不一致。",
        passwordTooShort: "密码至少需要6个字符。",
        needCaptcha: "请完成验证码以证明您不是机器人。",
        unexpected: "发生了意外错误。",
      },
      submitBtn: "创建账户", submitting: "正在创建账户…",
      footerHaveAccount: "已有账户？", footerSignIn: "登录 →",
      success: {
        title: "请查收您的邮箱",
        msgIntro: "欢迎加入DumaSafeGuide！",
        msgBody: "我们已向您的邮箱发送了确认链接。请在登录前验证您的地址。",
        note: "没有收到？请查看您的垃圾邮件文件夹。",
        goToSignIn: "前往登录",
      },`,
  },
  {
    code: "ja",
    anchor: `cardBtn: "別の報告を送信 →",`,
    body: `      eyebrow: "コミュニティ安全プラットフォーム",
      heroLine1: "参加する", heroAccent1: "緊急", heroAccent2: "対応",
      heroDesc: "アカウントを登録して事件を報告し、リアルタイムの通知を受け取り、すべてのバランガイの緊急対応者と常につながりましょう。",
      steps: {
        create: { title: "アカウントを作成", desc: "詳細を入力し、バランガイを選択してください。" },
        access: { title: "即時アクセス", desc: "登録後すぐにアカウントをご利用いただけます。" },
        report: { title: "報告と対応", desc: "今すぐ事件を提出し、対応者と連携しましょう。" },
      },
      certBold: "すべての市民に無料", certRest: "ドゥマゲッティ市にて",
      mobileBadge: "サインアップ",
      backToHome: "ホームに戻る",
      formTitle: "アカウントを作成",
      formSub: "DumaSafeGuideに参加しましょう — すべての市民に完全無料です。",
      labels: { firstName: "名", lastName: "姓", barangay: "バランガイ", phone: "電話番号", email: "メールアドレス", password: "パスワード", confirmPassword: "確認" },
      placeholders: { firstName: "Maria", lastName: "Clara", phone: "09XX XXX XXXX", selectLocation: "場所を選択" },
      pwHint: "6文字以上が必要です。",
      emailHint: "確認可能なメールアドレスを使用してください — サインインする前に確認リンクを送信します。",
      emailInvalid: "有効なメールアドレスを入力してください。",
      errors: {
        missingFields: "すべての項目を入力してください。",
        invalidEmail: "有効なメールアドレスを入力してください。",
        disposableEmail: "一時的または使い捨てのメールアドレスは使用できません。アクセス可能な実際のメールアドレスを使用してください。",
        passwordMismatch: "パスワードが一致しません。",
        passwordTooShort: "パスワードは6文字以上である必要があります。",
        needCaptcha: "人間であることを確認するためCAPTCHAを完了してください。",
        unexpected: "予期しないエラーが発生しました。",
      },
      submitBtn: "アカウントを作成", submitting: "アカウントを作成中…",
      footerHaveAccount: "すでにアカウントをお持ちですか？", footerSignIn: "サインイン →",
      success: {
        title: "メールをご確認ください",
        msgIntro: "DumaSafeGuideへようこそ！",
        msgBody: "確認リンクをメールに送信しました。サインインする前にアドレスを確認してください。",
        note: "届いていませんか？迷惑メールフォルダをご確認ください。",
        goToSignIn: "サインインへ",
      },`,
  },
  {
    code: "ru",
    anchor: `cardBtn: "Отправить ещё один отчёт →",`,
    body: `      eyebrow: "Платформа безопасности сообщества",
      heroLine1: "Присоединяйтесь к", heroAccent1: "экстренному", heroAccent2: "реагированию",
      heroDesc: "Зарегистрируйте аккаунт, чтобы сообщать о происшествиях, получать уведомления в реальном времени и оставаться на связи со спасателями во всех барангаях.",
      steps: {
        create: { title: "Создать аккаунт", desc: "Заполните данные и выберите свой барангай." },
        access: { title: "Мгновенный доступ", desc: "Ваш аккаунт готов сразу после регистрации." },
        report: { title: "Сообщайте и реагируйте", desc: "Отправляйте отчёты о происшествиях и координируйтесь со спасателями прямо сейчас." },
      },
      certBold: "Бесплатно для всех жителей", certRest: "в Думагете",
      mobileBadge: "Регистрация",
      backToHome: "Назад на главную",
      formTitle: "Создать аккаунт",
      formSub: "Присоединяйтесь к DumaSafeGuide — совершенно бесплатно для всех жителей.",
      labels: { firstName: "Имя", lastName: "Фамилия", barangay: "Барангай", phone: "Номер телефона", email: "Электронная почта", password: "Пароль", confirmPassword: "Подтверждение" },
      placeholders: { firstName: "Maria", lastName: "Clara", phone: "09XX XXX XXXX", selectLocation: "Выберите местоположение" },
      pwHint: "Требуется минимум 6 символов.",
      emailHint: "Используйте адрес, к которому у вас есть доступ — мы вышлем ссылку для подтверждения перед входом.",
      emailInvalid: "Пожалуйста, введите действительный адрес электронной почты.",
      errors: {
        missingFields: "Пожалуйста, заполните все поля.",
        invalidEmail: "Пожалуйста, введите действительный адрес электронной почты.",
        disposableEmail: "Временные или одноразовые адреса электронной почты не разрешены. Используйте реальный адрес, к которому у вас есть доступ.",
        passwordMismatch: "Пароли не совпадают.",
        passwordTooShort: "Пароль должен содержать не менее 6 символов.",
        needCaptcha: "Пожалуйста, пройдите проверку CAPTCHA, чтобы подтвердить, что вы не робот.",
        unexpected: "Произошла непредвиденная ошибка.",
      },
      submitBtn: "Создать аккаунт", submitting: "Создание аккаунта…",
      footerHaveAccount: "Уже есть аккаунт?", footerSignIn: "Войти →",
      success: {
        title: "Проверьте вашу почту",
        msgIntro: "Добро пожаловать в DumaSafeGuide!",
        msgBody: "Мы отправили ссылку для подтверждения на вашу почту. Пожалуйста, подтвердите свой адрес перед входом.",
        note: "Не получили письмо? Проверьте папку со спамом.",
        goToSignIn: "Перейти ко входу",
      },`,
  },
  {
    code: "ar",
    anchor: `cardBtn: "إرسال بلاغ آخر ←",`,
    body: `      eyebrow: "منصة أمان المجتمع",
      heroLine1: "انضم إلى", heroAccent1: "الاستجابة", heroAccent2: "الطارئة",
      heroDesc: "سجّل حسابك للإبلاغ عن الحوادث، وتلقي التنبيهات الفورية، والبقاء على اتصال بالمستجيبين للطوارئ في جميع الأحياء.",
      steps: {
        create: { title: "إنشاء حساب", desc: "املأ بياناتك واختر حيّك." },
        access: { title: "وصول فوري", desc: "يصبح حسابك جاهزًا فور التسجيل." },
        report: { title: "الإبلاغ والاستجابة", desc: "قدّم بلاغات الحوادث وتنسّق مع المستجيبين الآن." },
      },
      certBold: "مجاني لجميع المواطنين", certRest: "في دوماغيتي",
      mobileBadge: "إنشاء حساب",
      backToHome: "العودة إلى الرئيسية",
      formTitle: "إنشاء حساب",
      formSub: "انضم إلى DumaSafeGuide — مجاني تمامًا لجميع المواطنين.",
      labels: { firstName: "الاسم الأول", lastName: "اسم العائلة", barangay: "الحي", phone: "رقم الهاتف", email: "البريد الإلكتروني", password: "كلمة المرور", confirmPassword: "تأكيد" },
      placeholders: { firstName: "Maria", lastName: "Clara", phone: "09XX XXX XXXX", selectLocation: "اختر الموقع" },
      pwHint: "يلزم 6 أحرف على الأقل.",
      emailHint: "استخدم بريدًا إلكترونيًا يمكنك الوصول إليه — سنرسل رابط تأكيد قبل تسجيل الدخول.",
      emailInvalid: "يرجى إدخال عنوان بريد إلكتروني صالح.",
      errors: {
        missingFields: "يرجى إكمال جميع الحقول.",
        invalidEmail: "يرجى إدخال عنوان بريد إلكتروني صالح.",
        disposableEmail: "عناوين البريد الإلكتروني المؤقتة أو التي تُستخدم لمرة واحدة غير مسموح بها. يرجى استخدام بريد إلكتروني حقيقي يمكنك الوصول إليه.",
        passwordMismatch: "كلمتا المرور غير متطابقتين.",
        passwordTooShort: "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.",
        needCaptcha: "يرجى إكمال التحقق (CAPTCHA) لإثبات أنك لست روبوتًا.",
        unexpected: "حدث خطأ غير متوقع.",
      },
      submitBtn: "إنشاء حساب", submitting: "جارٍ إنشاء الحساب…",
      footerHaveAccount: "لديك حساب بالفعل؟", footerSignIn: "تسجيل الدخول ←",
      success: {
        title: "تحقق من بريدك الإلكتروني",
        msgIntro: "مرحبًا بك في DumaSafeGuide!",
        msgBody: "لقد أرسلنا رابط تأكيد إلى بريدك الإلكتروني. يرجى التحقق من عنوانك قبل تسجيل الدخول.",
        note: "لم تستلمه؟ تحقق من مجلد الرسائل غير المرغوب فيها.",
        goToSignIn: "الانتقال إلى تسجيل الدخول",
      },`,
  },
];

let patchedCount = 0;
let skippedCount = 0;

for (const lang of LANGS) {
  const oldBlock = `${lang.anchor}\n      },\n    },\n  },`;
  const newBlock = `${lang.anchor}\n      },\n    },\n    signup: {\n${lang.body}\n    },\n  },`;

  if (src.includes(`signup: {\n${lang.body}`)) {
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

const backupPath = FILE + ".bak3";
fs.writeFileSync(backupPath, original, "utf8");
fs.writeFileSync(FILE, src, "utf8");

console.log(`\nDone. Patched: ${patchedCount}, skipped: ${skippedCount}`);
console.log(`Backup of original saved to: ${backupPath}`);
console.log(`\nNow restart your dev server and hard-refresh the browser.`);
