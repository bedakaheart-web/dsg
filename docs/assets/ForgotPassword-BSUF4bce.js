import{am as n,ak as e,k as U,ae as w,ah as V,u as X,a as j,z as S,y as P,an as u}from"./index-CvhaT9ii.js";const $=`
  @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@500;700;800;900&family=Instrument+Sans:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .fp-root {
    min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Instrument Sans', sans-serif;
    padding: 24px;
    background: #080c14 url('/src/assets/loginbg.png') center/cover no-repeat fixed;
    position: relative; overflow: hidden;
  }
  .fp-glow { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
  .fp-glow-a {
    position: absolute; width: 700px; height: 700px; border-radius: 50%;
    background: radial-gradient(circle, rgba(46,204,143,.07) 0%, transparent 65%);
    top: -260px; left: -160px;
  }
  .fp-glow-b {
    position: absolute; width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(123,158,255,.05) 0%, transparent 65%);
    bottom: -200px; right: -120px;
  }
  .fp-card {
    position: relative; z-index: 1;
    background: rgba(15,21,33,.82);
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 24px;
    padding: 44px 40px 40px;
    width: 100%; max-width: 460px;
    backdrop-filter: blur(20px);
    animation: fp-rise .55s cubic-bezier(.22,1,.36,1) both;
  }
  @keyframes fp-rise {
    from { opacity: 0; transform: translateY(24px) scale(.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .fp-card::before {
    content: '';
    position: absolute; top: 0; left: 40px; right: 40px; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(46,204,143,.45), transparent);
  }
  .fp-brand {
    display: flex; flex-direction: column; align-items: center;
    gap: 14px; margin-bottom: 32px; text-align: center;
  }
  .fp-logo-ring {
    width: 72px; height: 72px; border-radius: 18px;
    background: rgba(46,204,143,.06); border: 1px solid rgba(46,204,143,.18);
    display: flex; align-items: center; justify-content: center; padding: 10px;
  }
  .fp-logo-ring img { width: 100%; height: 100%; object-fit: contain; }
  .fp-brand-name {
    font-family: 'Cabinet Grotesk', sans-serif;
    font-size: 22px; font-weight: 900; letter-spacing: -.03em; color: #eef0f7;
  }
  .fp-brand-name span { color: #2ECC8F; }
  .fp-brand-sub { font-size: 12.5px; color: rgba(238,240,247,.32); line-height: 1.5; max-width: 280px; }
  .fp-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.07), transparent);
    margin-bottom: 28px;
  }
  .fp-error {
    display: flex; align-items: flex-start; gap: 10px;
    background: rgba(255,107,107,.07); border: 1px solid rgba(255,107,107,.2);
    border-radius: 10px; padding: 11px 14px;
    font-size: 12.5px; color: #FF6B6B; margin-bottom: 20px;
    animation: fp-shake .35s ease;
  }
  @keyframes fp-shake {
    0%,100% { transform: translateX(0); }
    20% { transform: translateX(-5px); }
    40% { transform: translateX(5px); }
    60% { transform: translateX(-3px); }
    80% { transform: translateX(3px); }
  }
  .fp-step-indicator {
    display: flex; align-items: center; justify-content: center;
    gap: 8px; margin-bottom: 28px;
  }
  .fp-step {
    display: flex; align-items: center; justify-content: center;
    width: 28px; height: 28px; border-radius: 50%;
    font-size: 11px; font-weight: 700; transition: all .3s;
  }
  .fp-step.active { background: #2ECC8F; color: #080c14; }
  .fp-step.done { background: rgba(46,204,143,.2); color: #2ECC8F; border: 1px solid rgba(46,204,143,.3); }
  .fp-step.inactive { background: rgba(255,255,255,.06); color: rgba(238,240,247,.3); }
  .fp-step-line { width: 40px; height: 1px; background: rgba(255,255,255,.08); }
  .fp-field { margin-bottom: 18px; }
  .fp-label {
    display: block; font-size: 10px; font-weight: 700; letter-spacing: .13em;
    text-transform: uppercase; color: rgba(238,240,247,.28); margin-bottom: 8px;
  }
  .fp-input-wrap { position: relative; }
  .fp-input-icon {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    color: rgba(238,240,247,.2); pointer-events: none;
  }
  .fp-input {
    width: 100%;
    background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08);
    border-radius: 11px; padding: 12px 14px 12px 40px;
    font-family: 'Instrument Sans', sans-serif;
    font-size: 14px; color: #eef0f7; outline: none;
    transition: border-color .2s, background .2s, box-shadow .2s;
  }
  .fp-input.no-icon { padding-left: 14px; }
  .fp-input::placeholder { color: rgba(238,240,247,.18); }
  .fp-input:focus {
    border-color: rgba(46,204,143,.38); background: rgba(46,204,143,.03);
    box-shadow: 0 0 0 3px rgba(46,204,143,.06);
  }
  .fp-eye {
    position: absolute; right: 13px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: rgba(143,149,172,.25); padding: 0;
    display: flex; align-items: center; transition: color .2s;
  }
  .fp-eye:hover { color: rgba(238,240,247,.6); }
  .fp-strength-wrap { margin-top: 8px; margin-bottom: 6px; }
  .fp-strength-track {
    height: 4px; border-radius: 2px;
    background: rgba(255,255,255,.06); overflow: hidden; margin-bottom: 5px;
  }
  .fp-strength-fill { height: 100%; border-radius: 2px; transition: width .3s ease, background .3s ease; }
  .fp-strength-label { font-size: 10.5px; color: rgba(238,240,247,.3); }
  .fp-btn {
    width: 100%; padding: 13px 20px;
    font-family: 'Cabinet Grotesk', sans-serif;
    font-size: 13px; font-weight: 800; letter-spacing: .1em;
    text-transform: uppercase; border-radius: 11px; border: none;
    background: linear-gradient(135deg, #87849b, #355c8f);
    color: #060a10; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: transform .18s, box-shadow .18s;
    margin-bottom: 20px;
  }
  .fp-btn:hover:not(:disabled) {
    transform: translateY(-2px); box-shadow: 0 10px 28px rgba(46,204,143,.28);
  }
  .fp-btn:disabled { opacity: .45; cursor: not-allowed; }
  .fp-spin {
    width: 14px; height: 14px; border-radius: 50%;
    border: 2px solid rgba(6,10,16,.25); border-top-color: #060a10;
    animation: fp-rotate .65s linear infinite; flex-shrink: 0;
  }
  @keyframes fp-rotate { to { transform: rotate(360deg); } }
  .fp-back {
    display: flex; align-items: center; justify-content: center; gap: 7px;
    font-size: 13px; color: rgba(238,240,247,.3); text-decoration: none;
    transition: color .2s; background: none; border: none; cursor: pointer; width: 100%;
  }
  .fp-back:hover { color: #2ECC8F; }
  .fp-success {
    display: flex; flex-direction: column; align-items: center;
    text-align: center; padding: 8px 0;
    animation: fp-rise .5s cubic-bezier(.22,1,.36,1) both;
  }
  .fp-success-icon {
    width: 80px; height: 80px; border-radius: 50%;
    background: rgba(46,204,143,.1); border: 2px solid rgba(46,204,143,.35);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 22px;
    animation: fp-pop .5s .1s cubic-bezier(.22,1,.36,1) both;
  }
  @keyframes fp-pop {
    from { transform: scale(.6); opacity: 0; }
    to   { transform: scale(1); opacity: 1; }
  }
  .fp-success-title {
    font-family: 'Cabinet Grotesk', sans-serif;
    font-size: 22px; font-weight: 800; color: #eef0f7; margin-bottom: 10px;
  }
  .fp-success-msg {
    font-size: 13.5px; color: rgba(237,240,250,.5);
    line-height: 1.65; margin-bottom: 28px; max-width: 300px;
  }
  .fp-success-msg strong { color: #2ECC8F; }
  .fp-success-divider {
    width: 100%; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.08), transparent);
    margin-bottom: 24px;
  }
  .fp-success-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    width: 100%; padding: 14px;
    font-family: 'Cabinet Grotesk', sans-serif;
    font-size: 13px; font-weight: 800; letter-spacing: .08em;
    text-transform: uppercase; border-radius: 10px; border: none;
    background: #2ECC8F; color: #080c14;
    cursor: pointer; text-decoration: none;
    transition: all .18s; box-sizing: border-box;
  }
  .fp-success-btn:hover {
    background: #35e09a; transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(46,204,143,.3);
  }
  .fp-otp-row {
    display: flex; gap: 6px; justify-content: center; margin-bottom: 8px;
  }
  .fp-otp-input {
    width: 36px; height: 52px; text-align: center;
    background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08);
    border-radius: 10px; font-size: 18px; font-weight: 700;
    color: #eef0f7; outline: none;
    transition: border-color .2s, box-shadow .2s;
  }
  .fp-otp-input:focus {
    border-color: rgba(46,204,143,.38);
    box-shadow: 0 0 0 3px rgba(46,204,143,.06);
  }
  .fp-resend {
    font-size: 12px; color: rgba(238,240,247,.3);
    text-align: center; margin-bottom: 20px;
  }
  .fp-resend button {
    background: none; border: none; color: #2ECC8F;
    font-size: 12px; cursor: pointer; padding: 0; margin-left: 4px;
  }
  .fp-resend button:disabled { color: rgba(46,204,143,.3); cursor: not-allowed; }
`;function K(a){return a?a.length<6?{width:"25%",color:"#EF5B5B",label:"Too short"}:a.length<8?{width:"50%",color:"#F5C842",label:"Weak"}:!/[A-Z]/.test(a)||!/[0-9]/.test(a)?{width:"70%",color:"#F5C842",label:"Fair"}:{width:"100%",color:"#2ECC8F",label:"Strong"}:{width:"0%",color:"transparent",label:""}}const l=8;function H(){const[a,x]=n.useState("email"),[f,B]=n.useState(""),[g,y]=n.useState(Array(l).fill("")),[o,I]=n.useState(""),[p,G]=n.useState(""),[v,Y]=n.useState(!1),[k,O]=n.useState(!1),[i,c]=n.useState(!1),[N,r]=n.useState(""),[h,C]=n.useState(0),b=K(o),F=async()=>{if(r(""),!f.trim()){r("Please enter your email address.");return}c(!0);const{error:s}=await u.auth.resetPasswordForEmail(f.trim(),{redirectTo:`${window.location.origin}/reset-password`});if(c(!1),s){r(s.message||"Failed to send code. Please try again.");return}x("otp"),E()},D=async()=>{r("");const s=g.join("");if(s.length<l){r(`Please enter the full ${l}-digit code.`);return}c(!0);const{error:t}=await u.auth.verifyOtp({email:f.trim(),token:s,type:"recovery"});if(c(!1),t){r("Invalid or expired code. Please try again.");return}x("password")},z=async()=>{if(r(""),!o||!p){r("Please fill in both fields.");return}if(o.length<6){r("Password must be at least 6 characters.");return}if(o!==p){r("Passwords do not match.");return}c(!0);const{error:s}=await u.auth.updateUser({password:o});if(c(!1),s){r(s.message||"Failed to update password.");return}x("success")},L=(s,t)=>{if(!/^\d*$/.test(t))return;const d=[...g];d[s]=t.slice(-1),y(d),t&&s<l-1&&document.getElementById(`otp-${s+1}`)?.focus()},T=(s,t)=>{t.key==="Backspace"&&!g[s]&&s>0&&document.getElementById(`otp-${s-1}`)?.focus()},E=()=>{C(60);const s=setInterval(()=>{C(t=>t<=1?(clearInterval(s),0):t-1)},1e3)},A=async()=>{r(""),y(Array(l).fill("")),await u.auth.resetPasswordForEmail(f.trim(),{redirectTo:`${window.location.origin}/reset-password`}),E()},m=a==="email"?1:a==="otp"?2:3;return a==="success"?e.jsxs(e.Fragment,{children:[e.jsx("style",{children:$}),e.jsxs("div",{className:"fp-root",children:[e.jsxs("div",{className:"fp-glow",children:[e.jsx("div",{className:"fp-glow-a"}),e.jsx("div",{className:"fp-glow-b"})]}),e.jsx("div",{className:"fp-card",children:e.jsxs("div",{className:"fp-success",children:[e.jsx("div",{className:"fp-success-icon",children:e.jsx(U,{size:36,color:"#2ECC8F"})}),e.jsx("div",{className:"fp-success-title",children:"Password Updated!"}),e.jsxs("p",{className:"fp-success-msg",children:["Your password has been ",e.jsx("strong",{children:"successfully reset"}),". You can now sign in with your new password."]}),e.jsx("div",{className:"fp-success-divider"}),e.jsx(w,{to:"/login",className:"fp-success-btn",children:"Sign In Now →"})]})})]})]}):e.jsxs(e.Fragment,{children:[e.jsx("style",{children:$}),e.jsxs("div",{className:"fp-root",children:[e.jsxs("div",{className:"fp-glow",children:[e.jsx("div",{className:"fp-glow-a"}),e.jsx("div",{className:"fp-glow-b"})]}),e.jsxs("div",{className:"fp-card",children:[e.jsxs("div",{className:"fp-brand",children:[e.jsx("div",{className:"fp-logo-ring",children:e.jsx("img",{src:V,alt:"DumaSafeGuide"})}),e.jsxs("div",{children:[e.jsxs("div",{className:"fp-brand-name",children:["Duma",e.jsx("span",{children:"SafeGuide"})]}),e.jsxs("p",{className:"fp-brand-sub",children:[a==="email"&&"Enter your email to receive a verification code.",a==="otp"&&`Enter the ${l}-digit code sent to your email.`,a==="password"&&"Choose a strong new password."]})]})]}),e.jsxs("div",{className:"fp-step-indicator",children:[e.jsx("div",{className:`fp-step ${m===1?"active":"done"}`,children:"1"}),e.jsx("div",{className:"fp-step-line"}),e.jsx("div",{className:`fp-step ${m===2?"active":m>2?"done":"inactive"}`,children:"2"}),e.jsx("div",{className:"fp-step-line"}),e.jsx("div",{className:`fp-step ${m===3?"active":"inactive"}`,children:"3"})]}),e.jsx("div",{className:"fp-divider"}),N&&e.jsxs("div",{className:"fp-error",children:[e.jsx("span",{children:"⚠"}),e.jsx("span",{children:N})]}),a==="email"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"fp-field",children:[e.jsx("label",{className:"fp-label",children:"Email Address"}),e.jsxs("div",{className:"fp-input-wrap",children:[e.jsx(X,{size:13,className:"fp-input-icon"}),e.jsx("input",{className:"fp-input",type:"email",placeholder:"you@example.com",value:f,onChange:s=>B(s.target.value),onKeyDown:s=>s.key==="Enter"&&F(),autoFocus:!0})]})]}),e.jsxs("button",{className:"fp-btn",onClick:F,disabled:i,children:[i&&e.jsx("span",{className:"fp-spin"}),i?"Sending Code…":"Send Verification Code"]}),e.jsxs(w,{to:"/login",className:"fp-back",children:[e.jsx(j,{size:11})," Back to Sign In"]})]}),a==="otp"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"fp-field",children:[e.jsxs("label",{className:"fp-label",children:["Verification Code (",l," digits)"]}),e.jsx("div",{className:"fp-otp-row",children:g.map((s,t)=>e.jsx("input",{id:`otp-${t}`,className:"fp-otp-input",type:"text",inputMode:"numeric",maxLength:1,value:s,onChange:d=>L(t,d.target.value),onKeyDown:d=>T(t,d),autoFocus:t===0},t))}),e.jsxs("p",{className:"fp-resend",children:["Didn't receive it?",e.jsx("button",{onClick:A,disabled:h>0,children:h>0?` Resend in ${h}s`:" Resend Code"})]})]}),e.jsxs("button",{className:"fp-btn",onClick:D,disabled:i,children:[i&&e.jsx("span",{className:"fp-spin"}),i?"Verifying…":"Verify Code"]}),e.jsxs("button",{className:"fp-back",onClick:()=>{x("email"),r("")},children:[e.jsx(j,{size:11})," Change Email"]})]}),a==="password"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"fp-field",children:[e.jsx("label",{className:"fp-label",children:"New Password"}),e.jsxs("div",{className:"fp-input-wrap",children:[e.jsx("input",{className:"fp-input no-icon",type:v?"text":"password",placeholder:"••••••••",value:o,onChange:s=>I(s.target.value),autoFocus:!0}),e.jsx("button",{type:"button",className:"fp-eye",onClick:()=>Y(s=>!s),children:v?e.jsx(S,{size:15}):e.jsx(P,{size:15})})]}),o&&e.jsxs("div",{className:"fp-strength-wrap",children:[e.jsx("div",{className:"fp-strength-track",children:e.jsx("div",{className:"fp-strength-fill",style:{width:b.width,background:b.color}})}),e.jsx("span",{className:"fp-strength-label",style:{color:b.color},children:b.label})]})]}),e.jsxs("div",{className:"fp-field",children:[e.jsx("label",{className:"fp-label",children:"Confirm New Password"}),e.jsxs("div",{className:"fp-input-wrap",children:[e.jsx("input",{className:"fp-input no-icon",type:k?"text":"password",placeholder:"••••••••",value:p,onChange:s=>G(s.target.value),onKeyDown:s=>s.key==="Enter"&&z()}),e.jsx("button",{type:"button",className:"fp-eye",onClick:()=>O(s=>!s),children:k?e.jsx(S,{size:15}):e.jsx(P,{size:15})})]}),p&&e.jsx("p",{style:{fontSize:11,marginTop:6,color:o===p?"#2ECC8F":"#EF5B5B"},children:o===p?"✓ Passwords match":"✗ Passwords do not match"})]}),e.jsxs("button",{className:"fp-btn",onClick:z,disabled:i,children:[i&&e.jsx("span",{className:"fp-spin"}),i?"Updating…":"Update Password"]}),e.jsxs(w,{to:"/login",className:"fp-back",children:[e.jsx(j,{size:11})," Back to Sign In"]})]})]})]})]})}export{H as default};
