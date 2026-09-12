import re, sys

PATH = "src/i18n/translations.ts"

with open(PATH, "r", encoding="utf-8") as f:
    src = f.read()

# ── Type definition insertion ──────────────────────────────
type_anchor = "errLoginFailed: string;\n  };\n  cards: {"
type_block = '''errLoginFailed: string;
  };
  login: {
    backToHome: string;
    formEyebrow: string;
    formTitle: string;
    formSub: string;
    headline1: string;
    headlineAccent: string;
    headline2: string;
    desc: string;
    stats: { barangays: string; monitoring: string; avgResponse: string };
    badge: string;
    checkingSession: string;
    labels: { email: string; password: string };
    rememberMe: string;
    forgotPassword: string;
    submitBtn: string;
    submitting: string;
    footerNoAccount: string;
    footerCreateAccount: string;
    errors: {
      missingFields: string;
      needCaptcha: string;
      unconfirmedEmail: string;
      loginFailed: string;
      profileNotReady: string;
    };
    success: { title: string; sub: string };
  };
  cards: {'''

# ── Per-language insertions ────────────────────────────────
LANGS = {
    "en": {
        "anchor": 'errLoginFailed: "Login failed.",\n    },\n    cards: {',
        "block": '''errLoginFailed: "Login failed.",
    },
    login: {
      backToHome: "Back to home",
      formEyebrow: "Secure Access",
      formTitle: "Welcome Back",
      formSub: "Login to access the DumaSafeGuide emergency dashboard.",
      headline1: "Emergency",
      headlineAccent: "Response",
      headline2: "At Your Fingertips",
      desc: "A centralized safety platform for the City of Gentle People. Fast access to hotlines, facilities, and safety guidelines.",
      stats: { barangays: "Barangays Covered", monitoring: "Monitoring", avgResponse: "Avg. Response" },
      badge: "Live Emergency Monitoring",
      checkingSession: "Checking session…",
      labels: { email: "Email Address", password: "Password" },
      rememberMe: "Remember me",
      forgotPassword: "Forgot Password?",
      submitBtn: "Login Account",
      submitting: "Signing in…",
      footerNoAccount: "No account yet?",
      footerCreateAccount: "Create Account →",
      errors: {
        missingFields: "Please enter your email and password.",
        needCaptcha: "Please complete the CAPTCHA to verify you're human.",
        unconfirmedEmail: "Please confirm your email address before logging in. Check your inbox for the confirmation link.",
        loginFailed: "Login failed. Please check your credentials and try again.",
        profileNotReady: "Profile not ready yet. Please wait a moment and try again.",
      },
      success: { title: "Login Successful", sub: "Redirecting you to your dashboard…" },
    },
    cards: {'''
    },
    "tl": {
        "anchor": 'errLoginFailed: "Nabigo ang pag-login.",\n    },\n    cards: {',
        "block": '''errLoginFailed: "Nabigo ang pag-login.",
    },
    login: {
      backToHome: "Bumalik sa home",
      formEyebrow: "Ligtas na Access",
      formTitle: "Maligayang Pagbabalik",
      formSub: "Mag-login para ma-access ang DumaSafeGuide emergency dashboard.",
      headline1: "Mabilisang",
      headlineAccent: "Tugon",
      headline2: "Sa Iyong Kamay",
      desc: "Sentralisadong plataporma ng kaligtasan para sa Lungsod ng Mababait na Tao. Mabilisang access sa mga hotline, pasilidad, at gabay sa kaligtasan.",
      stats: { barangays: "Sakop na mga Barangay", monitoring: "Monitoring", avgResponse: "Karaniwang Tugon" },
      badge: "Live na Emergency Monitoring",
      checkingSession: "Sinusuri ang session…",
      labels: { email: "Email Address", password: "Password" },
      rememberMe: "Tandaan ako",
      forgotPassword: "Nakalimutan ang Password?",
      submitBtn: "Mag-login",
      submitting: "Nagla-login…",
      footerNoAccount: "Wala pang account?",
      footerCreateAccount: "Gumawa ng Account →",
      errors: {
        missingFields: "Pakilagay ang iyong email at password.",
        needCaptcha: "Pakikumpleto ang CAPTCHA para i-verify na ikaw ay tao.",
        unconfirmedEmail: "Pakumpirma muna ang iyong email address bago mag-login. Tingnan ang iyong inbox para sa confirmation link.",
        loginFailed: "Nabigo ang pag-login. Pakisuri ang iyong detalye at subukan ulit.",
        profileNotReady: "Hindi pa handa ang profile. Maghintay saglit at subukan ulit.",
      },
      success: { title: "Matagumpay ang Pag-login", sub: "Idinadala ka sa iyong dashboard…" },
    },
    cards: {'''
    },
    "ceb": {
        "anchor": 'errLoginFailed: "Napakyas ang pag-login.",\n    },\n    cards: {',
        "block": '''errLoginFailed: "Napakyas ang pag-login.",
    },
    login: {
      backToHome: "Balik sa home",
      formEyebrow: "Luwas nga Access",
      formTitle: "Maayong Pagbalik",
      formSub: "Mag-login para ma-access ang DumaSafeGuide emergency dashboard.",
      headline1: "Paspas nga",
      headlineAccent: "Tubag",
      headline2: "Anaa sa Imong Kamot",
      desc: "Sentralisadong plataporma sa kaluwasan para sa Siyudad sa Malumo nga Katawhan. Paspas nga access sa mga hotline, pasilidad, ug giya sa kaluwasan.",
      stats: { barangays: "Naapil nga mga Barangay", monitoring: "Monitoring", avgResponse: "Kasagarang Tubag" },
      badge: "Live nga Emergency Monitoring",
      checkingSession: "Gisusi ang session…",
      labels: { email: "Email Address", password: "Password" },
      rememberMe: "Hinumdomi ko",
      forgotPassword: "Nalimtan ang Password?",
      submitBtn: "Mag-login",
      submitting: "Nag-login…",
      footerNoAccount: "Wala pa'y account?",
      footerCreateAccount: "Paghimo og Account →",
      errors: {
        missingFields: "Palihug isulat ang imong email ug password.",
        needCaptcha: "Palihug kompletoha ang CAPTCHA para mapamatud-an nga tawo ka.",
        unconfirmedEmail: "Palihug kumpirmaha una ang imong email address una mag-login. Susiha ang imong inbox para sa confirmation link.",
        loginFailed: "Napakyas ang pag-login. Palihug susiha ang imong detalye ug sulayi pag-usab.",
        profileNotReady: "Wala pa andam ang profile. Paghulat una ug sulayi pag-usab.",
      },
      success: { title: "Malampuson ang Pag-login", sub: "Gidala ka sa imong dashboard…" },
    },
    cards: {'''
    },
    "ko": {
        "anchor": 'errLoginFailed: "로그인에 실패했습니다.",\n    },\n    cards: {',
        "block": '''errLoginFailed: "로그인에 실패했습니다.",
    },
    login: {
      backToHome: "홈으로 돌아가기",
      formEyebrow: "보안 접속",
      formTitle: "다시 오신 것을 환영합니다",
      formSub: "DumaSafeGuide 긴급 대시보드에 접속하려면 로그인하세요.",
      headline1: "빠른",
      headlineAccent: "대응",
      headline2: "이 손끝에서",
      desc: "온화한 사람들의 도시를 위한 통합 안전 플랫폼입니다. 핫라인, 시설, 안전 지침에 빠르게 접근하세요.",
      stats: { barangays: "커버되는 바랑가이", monitoring: "모니터링", avgResponse: "평균 대응" },
      badge: "실시간 긴급 모니터링",
      checkingSession: "세션 확인 중…",
      labels: { email: "이메일 주소", password: "비밀번호" },
      rememberMe: "로그인 상태 유지",
      forgotPassword: "비밀번호를 잊으셨나요?",
      submitBtn: "로그인",
      submitting: "로그인 중…",
      footerNoAccount: "계정이 없으신가요?",
      footerCreateAccount: "계정 만들기 →",
      errors: {
        missingFields: "이메일과 비밀번호를 입력해주세요.",
        needCaptcha: "사람인지 확인하기 위해 CAPTCHA를 완료해주세요.",
        unconfirmedEmail: "로그인하기 전에 이메일 주소를 확인해주세요. 받은 편지함에서 확인 링크를 확인하세요.",
        loginFailed: "로그인에 실패했습니다. 정보를 확인하고 다시 시도해주세요.",
        profileNotReady: "프로필이 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요.",
      },
      success: { title: "로그인 성공", sub: "대시보드로 이동 중…" },
    },
    cards: {'''
    },
    "zh": {
        "anchor": 'errLoginFailed: "登录失败。",\n    },\n    cards: {',
        "block": '''errLoginFailed: "登录失败。",
    },
    login: {
      backToHome: "返回首页",
      formEyebrow: "安全登录",
      formTitle: "欢迎回来",
      formSub: "登录以访问 DumaSafeGuide 紧急仪表板。",
      headline1: "紧急",
      headlineAccent: "响应",
      headline2: "触手可及",
      desc: "为温柔之城打造的一体化安全平台。快速获取热线、设施和安全指南信息。",
      stats: { barangays: "覆盖村庄", monitoring: "监测", avgResponse: "平均响应" },
      badge: "实时紧急监测",
      checkingSession: "正在检查会话…",
      labels: { email: "电子邮箱", password: "密码" },
      rememberMe: "记住我",
      forgotPassword: "忘记密码？",
      submitBtn: "登录账户",
      submitting: "登录中…",
      footerNoAccount: "还没有账户？",
      footerCreateAccount: "创建账户 →",
      errors: {
        missingFields: "请输入您的邮箱和密码。",
        needCaptcha: "请完成验证码以证明您不是机器人。",
        unconfirmedEmail: "请在登录前确认您的电子邮箱地址。请查看收件箱中的确认链接。",
        loginFailed: "登录失败。请检查您的信息并重试。",
        profileNotReady: "个人资料尚未准备好，请稍等片刻再试。",
      },
      success: { title: "登录成功", sub: "正在跳转到您的仪表盘…" },
    },
    cards: {'''
    },
    "ja": {
        "anchor": 'errLoginFailed: "ログインに失敗しました。",\n    },\n    cards: {',
        "block": '''errLoginFailed: "ログインに失敗しました。",
    },
    login: {
      backToHome: "ホームに戻る",
      formEyebrow: "セキュアアクセス",
      formTitle: "おかえりなさい",
      formSub: "DumaSafeGuideの緊急ダッシュボードにアクセスするにはログインしてください。",
      headline1: "緊急",
      headlineAccent: "対応",
      headline2: "を手のひらに",
      desc: "優しき人々の街のための統合安全プラットフォーム。ホットライン、施設、安全ガイドラインに素早くアクセスできます。",
      stats: { barangays: "対応バランガイ数", monitoring: "監視", avgResponse: "平均対応" },
      badge: "リアルタイム緊急監視",
      checkingSession: "セッションを確認中…",
      labels: { email: "メールアドレス", password: "パスワード" },
      rememberMe: "ログイン状態を保持",
      forgotPassword: "パスワードをお忘れですか？",
      submitBtn: "ログイン",
      submitting: "ログイン中…",
      footerNoAccount: "アカウントをお持ちでないですか？",
      footerCreateAccount: "アカウントを作成 →",
      errors: {
        missingFields: "メールアドレスとパスワードを入力してください。",
        needCaptcha: "人間であることを確認するためCAPTCHAを完了してください。",
        unconfirmedEmail: "ログインする前にメールアドレスを確認してください。受信トレイの確認リンクをご確認ください。",
        loginFailed: "ログインに失敗しました。情報をご確認の上、再度お試しください。",
        profileNotReady: "プロフィールがまだ準備できていません。少々お待ちの上、再度お試しください。",
      },
      success: { title: "ログイン成功", sub: "ダッシュボードに移動しています…" },
    },
    cards: {'''
    },
    "ru": {
        "anchor": 'errLoginFailed: "Не удалось войти.",\n    },\n    cards: {',
        "block": '''errLoginFailed: "Не удалось войти.",
    },
    login: {
      backToHome: "Назад на главную",
      formEyebrow: "Безопасный вход",
      formTitle: "С возвращением",
      formSub: "Войдите, чтобы получить доступ к панели экстренных ситуаций DumaSafeGuide.",
      headline1: "Экстренное",
      headlineAccent: "реагирование",
      headline2: "всегда под рукой",
      desc: "Единая платформа безопасности для Города добрых людей. Быстрый доступ к горячим линиям, учреждениям и рекомендациям по безопасности.",
      stats: { barangays: "Охваченных барангаев", monitoring: "Мониторинг", avgResponse: "Среднее время" },
      badge: "Мониторинг в реальном времени",
      checkingSession: "Проверка сессии…",
      labels: { email: "Электронная почта", password: "Пароль" },
      rememberMe: "Запомнить меня",
      forgotPassword: "Забыли пароль?",
      submitBtn: "Войти",
      submitting: "Выполняется вход…",
      footerNoAccount: "Ещё нет аккаунта?",
      footerCreateAccount: "Создать аккаунт →",
      errors: {
        missingFields: "Пожалуйста, введите email и пароль.",
        needCaptcha: "Пожалуйста, пройдите проверку CAPTCHA, чтобы подтвердить, что вы не робот.",
        unconfirmedEmail: "Пожалуйста, подтвердите свой email перед входом. Проверьте почту на наличие ссылки для подтверждения.",
        loginFailed: "Не удалось войти. Проверьте данные и попробуйте снова.",
        profileNotReady: "Профиль ещё не готов. Подождите немного и попробуйте снова.",
      },
      success: { title: "Вход выполнен успешно", sub: "Перенаправляем вас на панель…" },
    },
    cards: {'''
    },
    "ar": {
        "anchor": 'errLoginFailed: "فشل تسجيل الدخول.",\n    },\n    cards: {',
        "block": '''errLoginFailed: "فشل تسجيل الدخول.",
    },
    login: {
      backToHome: "العودة إلى الرئيسية",
      formEyebrow: "دخول آمن",
      formTitle: "مرحبًا بعودتك",
      formSub: "سجّل الدخول للوصول إلى لوحة طوارئ DumaSafeGuide.",
      headline1: "استجابة",
      headlineAccent: "طارئة",
      headline2: "في متناول يدك",
      desc: "منصة أمان موحدة لمدينة الناس الطيبين. وصول سريع إلى خطوط الطوارئ والمرافق وإرشادات السلامة.",
      stats: { barangays: "الأحياء المشمولة", monitoring: "المراقبة", avgResponse: "متوسط الاستجابة" },
      badge: "مراقبة الطوارئ المباشرة",
      checkingSession: "جارٍ التحقق من الجلسة…",
      labels: { email: "البريد الإلكتروني", password: "كلمة المرور" },
      rememberMe: "تذكرني",
      forgotPassword: "هل نسيت كلمة المرور؟",
      submitBtn: "تسجيل الدخول",
      submitting: "جارٍ تسجيل الدخول…",
      footerNoAccount: "ليس لديك حساب؟",
      footerCreateAccount: "إنشاء حساب ←",
      errors: {
        missingFields: "يرجى إدخال البريد الإلكتروني وكلمة المرور.",
        needCaptcha: "يرجى إكمال التحقق (CAPTCHA) لإثبات أنك لست روبوتًا.",
        unconfirmedEmail: "يرجى تأكيد بريدك الإلكتروني قبل تسجيل الدخول. تحقق من صندوق الوارد الخاص بك بحثًا عن رابط التأكيد.",
        loginFailed: "فشل تسجيل الدخول. يرجى التحقق من بياناتك والمحاولة مرة أخرى.",
        profileNotReady: "الملف الشخصي غير جاهز بعد. يرجى الانتظار قليلاً ثم المحاولة مرة أخرى.",
      },
      success: { title: "تم تسجيل الدخول بنجاح", sub: "جارٍ تحويلك إلى لوحتك…" },
    },
    cards: {'''
    },
}

def apply(src, anchor, block, label):
    count = src.count(anchor)
    if count != 1:
        print(f"ERROR: expected exactly 1 match for {label}, found {count}. Aborting — no changes written.")
        sys.exit(1)
    return src.replace(anchor, block)

src = apply(src, type_anchor, type_block, "TranslationDict type")
for code, info in LANGS.items():
    src = apply(src, info["anchor"], info["block"], f"language '{code}'")

with open(PATH, "w", encoding="utf-8") as f:
    f.write(src)

print(f"Success: inserted 'login' namespace into type + all {len(LANGS)} languages in {PATH}")
