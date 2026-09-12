import{aq as le,ao as pe,am as o,ak as e,an as C}from"./index-CvhaT9ii.js";const ee=""+new URL("mapbg-BknFwkLU.png",import.meta.url).href;async function ce(m,a){if(!m)return null;if(a==="en")return m;try{const{data:u,error:N}=await C.functions.invoke("translate-report",{body:{text:m,sourceLang:a}});return N?(console.error("Translation failed:",N),null):u?.translatedText??null}catch(u){return console.error("Translation request failed:",u),null}}const de=[{value:"fire",icon:"🔥",accent:"#EF5B5B"},{value:"accident",icon:"🚗",accent:"#F5C842"},{value:"flood",icon:"🌊",accent:"#5B8DEF"},{value:"crime",icon:"🚨",accent:"#EF5B9E"},{value:"medical",icon:"🏥",accent:"#2ECC8F"},{value:"other",icon:"⚠️",accent:"#B0B8CC"}],xe=[{label:"BFP",number:"422-2022",icon:"🔥",color:"#EF5B5B"},{label:"CDRRMO",number:"422-3008",icon:"🌀",color:"#F5C842"},{label:"PNP",number:"422-8708",icon:"👮",color:"#5B8DEF"},{label:"PDRRMO",number:"422-3006",icon:"🏥",color:"#2ECC8F"}];function be(){const m=le(),{t:a,language:u}=pe(),N=de.map(r=>({...r,label:a(`report.types.${r.value}`)})),A=[a("report.steps.incidentType"),a("report.steps.reporterInfo"),a("report.steps.location"),a("report.steps.description"),a("report.steps.evidence"),a("report.steps.submit")],[h,M]=o.useState(""),[F,P]=o.useState(null),[c,v]=o.useState("idle"),[x,O]=o.useState(null),[y,q]=o.useState(!1),[ae,Y]=o.useState(!1),[w,z]=o.useState(null),[$,I]=o.useState(null),[d,T]=o.useState(null),[S,f]=o.useState("idle"),[b,D]=o.useState(null),[B,k]=o.useState(0),[G,E]=o.useState(!1),[X,U]=o.useState(null),[H,V]=o.useState(""),[W,J]=o.useState(""),[L,Z]=o.useState(""),R=o.useRef(null),_=N.find(r=>r.value===x);o.useEffect(()=>()=>{d&&URL.revokeObjectURL(d)},[d]);async function K(r,s){try{const l=await(await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${r}&lon=${s}&format=jsonv2&addressdetails=1`,{headers:{"Accept-Language":"en"}})).json();if(l?.address){const t=l.address,i=[];t.road&&i.push(t.road),t.neighbourhood&&i.push(t.neighbourhood),t.suburb&&i.push(t.suburb),t.village&&i.push(t.village),t.barangay&&i.push(t.barangay),(t.city||t.town||t.municipality)&&i.push(t.city??t.town??t.municipality),(t.state||t.province)&&i.push(t.state??t.province),t.country&&i.push(t.country);const g=[...new Set(i)];if(g.length>0){P(g.join(", "));return}}if(l?.display_name){P(l.display_name);return}}catch(n){console.error("Reverse geocode failed:",n)}P(`Lat ${r}, Lng ${s}`)}function Q(r,s){let n=null,l=null;const t=()=>{l!==null&&(navigator.geolocation.clearWatch(l),l=null)},i=()=>{if(!n){s();return}const p=n.coords.latitude.toFixed(6),j=n.coords.longitude.toFixed(6),oe=n.coords.accuracy;r(p,j,oe)},g=setTimeout(()=>{t(),i()},12e3);l=navigator.geolocation.watchPosition(p=>{const j=p.coords.accuracy;(!n||j<n.coords.accuracy)&&(n=p),j<=15&&(clearTimeout(g),t(),i())},p=>{console.error("GPS error:",p),clearTimeout(g),t(),s()},{enableHighAccuracy:!0,timeout:2e4,maximumAge:0})}o.useEffect(()=>{v("loading"),Q(async(r,s,n)=>{M(`${r}, ${s}`),D(n),v("ok"),await K(r,s)},()=>v("error"))},[]);function te(r){const s=r.target.files?.[0];d&&URL.revokeObjectURL(d),s?(z(s.name),I(s),f("idle"),T(URL.createObjectURL(s))):(z(null),I(null),T(null))}async function se(r){f("uploading");const n=r.name.replace(/[^a-zA-Z0-9._-]/g,"_").split(".").pop()??"bin",t=`evidence/${`${Date.now()}_${Math.random().toString(36).slice(2)}.${n}`}`,{error:i}=await C.storage.from("reports-evidence").upload(t,r,{cacheControl:"3600",upsert:!1,contentType:r.type||"application/octet-stream"});if(i){f("error");let p=`Upload failed: ${i.message}`;return i.message?.includes("Bucket not found")?p='Storage bucket "reports-evidence" not found.':i.message?.includes("row-level security")||i.message?.includes("policy")?p="Upload blocked by storage security policy.":(i.message?.includes("exceeded")||i.message?.includes("too large"))&&(p="File is too large."),{url:null,errorMsg:p}}const{data:g}=C.storage.from("reports-evidence").getPublicUrl(t);return f("done"),{url:g?.publicUrl??null,errorMsg:null}}async function ne(r){if(r.preventDefault(),!y||!x)return;E(!0),U(null);const{data:{user:s}}=await C.auth.getUser();let n=null;if($){const{url:p,errorMsg:j}=await se($);if(!p){U(j??"Evidence upload failed."),E(!1);return}n=p}const l=L.trim()||null;let t=null;l&&(t=await ce(l,u));const i={type:x,description:l,description_lang:l?u:null,description_translated:t,location:h||null,address:F||null,reporter_name:H.trim()||null,reporter_contact:W.trim()||null,status:"pending",user_id:s?.id??null,responder_id:null,evidence_url:n},{error:g}=await C.from("reports").insert(i);if(g){U("Failed to submit report. Please try again."),E(!1);return}E(!1),Y(!0)}o.useEffect(()=>{y&&x?k(5):w?k(4):L.trim()?k(3):k(c==="ok"||c!=="idle"?2:x?1:0)},[x,c,w,y,L]);function ie(){if(c==="loading")return"Acquiring location — please wait…";if(c==="error")return"Location unavailable — GPS access denied or timed out";if(c==="ok"){if(F)return F;if(h)return`Resolving address… (${h})`}return""}return ae?e.jsxs(e.Fragment,{children:[e.jsx("style",{children:re}),e.jsxs("div",{className:"rp-root",children:[e.jsxs("div",{className:"rp-bg",children:[e.jsx("img",{src:ee,alt:"",className:"rp-bg-img","aria-hidden":"true"}),e.jsx("div",{className:"rp-bg-overlay"}),e.jsx("div",{className:"rp-bg-atmosphere"}),e.jsx("div",{className:"rp-bg-grain"})]}),e.jsx("div",{className:"rp-body rp-body--center",children:e.jsxs("div",{className:"rp-success",children:[e.jsx("div",{className:"rp-success-icon",children:"✓"}),e.jsx("h2",{className:"rp-success-title",children:a("report.success.title")}),e.jsx("p",{className:"rp-success-sub",children:a("report.success.sub")}),e.jsx("div",{className:"rp-success-actions",children:e.jsxs("div",{className:"rp-success-card",children:[e.jsx("div",{className:"rp-success-card-icon",children:"📝"}),e.jsx("div",{className:"rp-success-card-title",children:a("report.success.cardTitle")}),e.jsx("p",{className:"rp-success-card-text",children:a("report.success.cardText")}),e.jsx("button",{className:"rp-btn-primary rp-btn-primary--ghost",onClick:()=>{Y(!1),O(null),Z(""),V(""),J(""),z(null),I(null),T(null),q(!1),f("idle")},children:a("report.success.cardBtn")})]})})]})})]})]}):e.jsxs(e.Fragment,{children:[e.jsx("style",{children:re}),e.jsxs("div",{className:"rp-root",children:[e.jsxs("div",{className:"rp-bg",children:[e.jsx("img",{src:ee,alt:"",className:"rp-bg-img","aria-hidden":"true"}),e.jsx("div",{className:"rp-bg-overlay"}),e.jsx("div",{className:"rp-bg-atmosphere"}),e.jsx("div",{className:"rp-bg-grain"})]}),e.jsxs("div",{className:"rp-body",children:[e.jsxs("section",{className:"rp-hero",children:[e.jsxs("h1",{className:"rp-title",children:[a("report.heroTitle")," ",e.jsx("span",{className:"accent",children:a("report.heroAccent")})]}),e.jsx("p",{className:"rp-sub",children:a("report.heroSub")})]}),e.jsxs("div",{className:"rp-tracking-banner",children:[e.jsx("div",{className:"rp-banner-icon",children:"📍"}),e.jsxs("div",{className:"rp-banner-content",children:[e.jsx("div",{className:"rp-banner-title",children:a("report.bannerTitle")}),e.jsx("p",{className:"rp-banner-text",children:a("report.bannerText")})]}),e.jsx("button",{onClick:()=>m("/signup"),className:"rp-banner-cta",style:{cursor:"pointer"},children:a("report.bannerCta")})]}),e.jsx("div",{className:"rp-steps",children:A.map((r,s)=>e.jsxs("div",{className:`rp-step-item${s<=B?" rp-step-item--done":""}${s===B?" rp-step-item--active":""}`,children:[e.jsx("div",{className:"rp-step-dot",children:s<B?"✓":s+1}),e.jsx("span",{className:"rp-step-label",children:r}),s<A.length-1&&e.jsx("div",{className:"rp-step-line"})]},r))}),e.jsxs("div",{className:"rp-layout",children:[e.jsx("div",{className:"rp-left",children:e.jsxs("form",{className:"rp-form",onSubmit:ne,noValidate:!0,children:[e.jsxs("div",{className:"rp-card",children:[e.jsxs("div",{className:"rp-card-label",children:[e.jsx("span",{className:"rp-step-badge",children:"01"}),a("report.cardLabels.incidentType")]}),e.jsx("div",{className:"rp-type-grid",children:N.map(r=>e.jsxs("button",{type:"button",className:`rp-type-btn${x===r.value?" rp-type-btn--active":""}`,style:{"--t-accent":r.accent,"--t-alpha":`${r.accent}22`},onClick:()=>O(r.value),children:[e.jsx("span",{className:"rp-type-icon",children:r.icon}),e.jsx("span",{className:"rp-type-label",children:r.label})]},r.value))}),x&&e.jsxs("div",{className:"rp-type-confirm",style:{"--t-accent":_?.accent},children:[e.jsx("span",{children:_?.icon}),e.jsxs("span",{children:[_?.label," selected"]})]})]}),e.jsxs("div",{className:"rp-card",children:[e.jsxs("div",{className:"rp-card-label",children:[e.jsx("span",{className:"rp-step-badge",children:"02"}),a("report.cardLabels.reporterInfo")]}),e.jsxs("div",{className:"rp-fields",children:[e.jsxs("div",{className:"rp-field",children:[e.jsxs("label",{className:"rp-label",children:[a("report.form.fullName")," ",e.jsx("span",{className:"rp-optional",children:a("report.form.optional")})]}),e.jsx("input",{className:"rp-input",type:"text",placeholder:"e.g. Juan dela Cruz",value:H,onChange:r=>V(r.target.value)})]}),e.jsxs("div",{className:"rp-field",children:[e.jsxs("label",{className:"rp-label",children:[a("report.form.contactNumber")," ",e.jsx("span",{className:"rp-optional",children:a("report.form.optional")})]}),e.jsx("input",{className:"rp-input",type:"tel",placeholder:"+63 9XX XXX XXXX",value:W,onChange:r=>J(r.target.value)})]})]})]}),e.jsxs("div",{className:"rp-card",children:[e.jsxs("div",{className:"rp-card-label",children:[e.jsx("span",{className:"rp-step-badge",children:"03"}),a("report.cardLabels.location")]}),e.jsxs("div",{className:"rp-field",children:[e.jsx("label",{className:"rp-label",children:a("report.form.detectedLocation")}),e.jsxs("div",{className:"rp-location-row",children:[e.jsxs("div",{className:"rp-location-input-wrap",children:[e.jsx("span",{className:"rp-location-dot","data-status":c}),e.jsx("input",{className:"rp-input rp-input--location",type:"text",readOnly:!0,value:ie(),placeholder:"Waiting for GPS…"})]}),e.jsx("button",{type:"button",className:"rp-gps-btn",onClick:()=>{v("loading"),P(null),D(null),Q(async(r,s,n)=>{M(`${r}, ${s}`),D(n),v("ok"),await K(r,s)},()=>v("error"))},children:a("report.form.refreshGps")})]}),c==="ok"&&h&&e.jsxs("div",{className:"rp-coords-badge",children:[e.jsx("span",{className:"rp-coords-icon",children:"🌐"}),e.jsx("span",{className:"rp-coords-text",children:h}),F&&e.jsx("a",{href:`https://www.google.com/maps?q=${h}`,target:"_blank",rel:"noopener noreferrer",className:"rp-maps-verify",children:a("report.form.verifyMaps")})]}),c==="loading"&&e.jsxs("div",{className:"rp-gps-acquiring",children:[e.jsx("span",{className:"rp-gps-pulse"}),e.jsx("span",{children:"Searching for GPS signal… keep your device still and outdoors."})]}),c==="error"&&e.jsxs("p",{className:"rp-hint rp-hint--warn",children:["⚠️ Location access was denied or timed out. Please allow location access and tap ",e.jsx("strong",{children:"Refresh GPS"}),"."]}),c==="ok"&&e.jsxs("div",{className:"rp-gps-badges",children:[b!==null&&e.jsxs("span",{className:`rp-acc-badge ${b<=20?"acc-great":b<=100?"acc-ok":"acc-poor"}`,children:[b<=20?"✓ High accuracy":b<=100?"~ Medium accuracy":"⚠ Low accuracy"," (±",Math.round(b),"m)"]}),b!==null&&b>100&&e.jsx("span",{className:"rp-acc-tip",children:"Move outdoors for better accuracy"})]}),c==="ok"&&e.jsxs("p",{className:"rp-hint rp-hint--warn",children:["⚠️ If the location looks wrong, tap ",e.jsx("strong",{children:"Refresh GPS"})," to try again."]})]})]}),e.jsxs("div",{className:"rp-card",children:[e.jsxs("div",{className:"rp-card-label",children:[e.jsx("span",{className:"rp-step-badge",children:"04"}),a("report.cardLabels.description")]}),e.jsxs("div",{className:"rp-field",children:[e.jsx("label",{className:"rp-label",children:a("report.cardLabels.description")}),e.jsx("textarea",{className:"rp-textarea",rows:5,placeholder:a("report.form.descriptionPlaceholder"),value:L,onChange:r=>Z(r.target.value),required:!0})]})]}),e.jsxs("div",{className:"rp-card",children:[e.jsxs("div",{className:"rp-card-label",children:[e.jsx("span",{className:"rp-step-badge",children:"05"}),a("report.cardLabels.evidence")," ",e.jsx("span",{className:"rp-optional",children:a("report.form.optional")})]}),e.jsxs("div",{className:"rp-dropzone",onClick:()=>R.current?.click(),onDragOver:r=>r.preventDefault(),onDrop:r=>{r.preventDefault();const s=r.dataTransfer.files[0];if(s&&R.current){const n=new DataTransfer;n.items.add(s),R.current.files=n.files,z(s.name),I(s),f("idle"),d&&URL.revokeObjectURL(d),T(URL.createObjectURL(s))}},children:[e.jsx("input",{ref:R,type:"file",accept:"image/*,video/*",style:{display:"none"},onChange:te}),w&&d?e.jsxs("div",{className:"rp-dropzone-preview",children:[$?.type.startsWith("video/")?e.jsx("video",{className:"rp-preview-media",src:d,controls:!0,preload:"metadata"}):e.jsx("img",{className:"rp-preview-media",src:d,alt:"Preview"}),e.jsxs("div",{className:"rp-preview-info",children:[e.jsx("span",{className:"rp-dropzone-icon",children:"📎"}),e.jsx("span",{className:"rp-dropzone-name",children:w}),e.jsx("span",{className:"rp-dropzone-change",children:"Click to change"})]})]}):w?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"rp-dropzone-icon",children:"📎"}),e.jsx("span",{className:"rp-dropzone-name",children:w}),e.jsx("span",{className:"rp-dropzone-change",children:"Click to change"})]}):e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"rp-dropzone-icon",children:"📤"}),e.jsx("span",{className:"rp-dropzone-text",children:a("report.form.uploadHint")}),e.jsx("span",{className:"rp-dropzone-hint",children:"Photos or Videos accepted"})]})]}),S==="uploading"&&e.jsx("div",{className:"rp-upload-status rp-upload-status--uploading",children:"⏳ Uploading evidence…"}),S==="done"&&e.jsx("div",{className:"rp-upload-status rp-upload-status--done",children:"✅ Evidence uploaded successfully"}),S==="error"&&e.jsx("div",{className:"rp-upload-status rp-upload-status--error",children:"❌ Upload failed — please try again"})]}),e.jsxs("div",{className:"rp-disclaimer",children:[e.jsxs("div",{className:"rp-disclaimer-header",children:[e.jsx("span",{className:"rp-disclaimer-icon",children:"⚖️"}),e.jsx("span",{className:"rp-disclaimer-title",children:a("report.form.legalTitle")})]}),e.jsx("p",{className:"rp-disclaimer-summary",children:a("report.form.legalSummary")}),e.jsxs("label",{className:"rp-check-label",children:[e.jsx("input",{type:"checkbox",className:"rp-checkbox",checked:y,onChange:r=>q(r.target.checked),required:!0}),e.jsx("span",{className:"rp-check-box","aria-hidden":"true",children:y?"✓":""}),e.jsx("span",{className:"rp-check-text",dangerouslySetInnerHTML:{__html:a("report.form.legalCheckText")}})]})]}),X&&e.jsxs("div",{className:"rp-error-banner",children:[e.jsxs("div",{style:{marginBottom:S==="error"?10:0},children:["⚠️ ",X]}),S==="error"&&e.jsx("button",{type:"button",className:"rp-skip-evidence-btn",onClick:()=>{I(null),z(null),f("idle"),U(null)},children:"Remove evidence and submit without it →"})]}),e.jsx("button",{type:"submit",className:"rp-submit",disabled:!y||!x||G,children:G?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"rp-loader"}),e.jsx("span",{children:a("report.form.submitting")})]}):e.jsxs(e.Fragment,{children:[e.jsx("span",{children:a("report.form.submitBtn")}),e.jsx("span",{className:"rp-submit-arrow",children:"→"})]})})]})}),e.jsxs("div",{className:"rp-right",children:[e.jsxs("div",{className:"rp-sidebar-card",children:[e.jsx("div",{className:"rp-sidebar-title",children:a("report.sidebar.hotlinesTitle")}),e.jsx("div",{className:"rp-hotlines",children:xe.map(r=>e.jsxs("a",{href:`tel:${r.number}`,className:"rp-hotline",style:{"--h-color":r.color},children:[e.jsx("span",{className:"rp-hotline-icon",children:r.icon}),e.jsxs("div",{className:"rp-hotline-info",children:[e.jsx("span",{className:"rp-hotline-label",children:r.label}),e.jsx("span",{className:"rp-hotline-number",children:r.number})]}),e.jsx("span",{className:"rp-hotline-call",children:"Call →"})]},r.number))})]}),e.jsxs("div",{className:"rp-sidebar-card rp-sidebar-card--warn",children:[e.jsx("div",{className:"rp-sidebar-title",children:a("report.sidebar.warnTitle")}),e.jsx("p",{className:"rp-sidebar-text",children:a("report.sidebar.warnText")})]}),e.jsxs("div",{className:"rp-sidebar-card rp-sidebar-card--info",children:[e.jsx("div",{className:"rp-sidebar-title",children:a("report.sidebar.safetyTitle")}),e.jsx("p",{className:"rp-sidebar-text",children:a("report.sidebar.safetyText")})]}),e.jsxs("div",{className:"rp-sidebar-card rp-sidebar-card--track",children:[e.jsx("div",{className:"rp-sidebar-title",children:a("report.sidebar.trackTitle")}),e.jsx("p",{className:"rp-sidebar-text",children:a("report.sidebar.trackText")}),e.jsx("button",{onClick:()=>m("/signup"),className:"rp-track-link",style:{cursor:"pointer",marginLeft:0},children:a("report.sidebar.trackBtn")})]})]})]})]})]})]})}const re=`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:       #07101d;
    --surface:  rgba(13,27,46,0.72);
    --surface2: rgba(13,27,46,0.88);
    --input-bg: #060f1c;
    --border:   rgba(0,200,224,0.08);
    --border2:  rgba(0,200,224,0.18);
    --text:     #ddeef8;
    --text2:    rgba(160,200,224,0.65);
    --text3:    rgba(160,200,224,0.30);
    --red:      #e8372a;
    --cyan:     #00c8e0;
    --green:    #2ECC8F;
    --yellow:   #F5C842;
    --blue:     #5B8DEF;
    --radius:   13px;
  }

  .rp-root {
    min-height: 100vh;
    font-family: 'Inter', sans-serif;
    color: var(--text);
    background: var(--bg);
    position: relative;
    overflow-x: hidden;
  }

  .rp-bg-img {
    width: 100%; height: 100%;
    object-fit: cover; object-position: center; display: block;
    transform-origin: center center;
    animation: bgDrift 32s ease-in-out infinite;
    will-change: transform;
  }
  .rp-bg { position: fixed; inset: 0; z-index: 0; overflow: hidden; }

  @keyframes bgDrift {
    0%   { transform: scale(1.08) translate(0px,   0px);   }
    25%  { transform: scale(1.12) translate(-16px, -10px); }
    50%  { transform: scale(1.10) translate(-6px,  -18px); }
    75%  { transform: scale(1.13) translate(14px,  -6px);  }
    100% { transform: scale(1.08) translate(0px,   0px);   }
  }

  .rp-bg-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(
      180deg,
      rgba(7,16,29,0.82) 0%,
      rgba(7,16,29,0.68) 40%,
      rgba(7,16,29,0.82) 75%,
      rgba(7,16,29,0.97) 100%
    );
  }
  .rp-bg-atmosphere {
    position: absolute; inset: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 60% 50% at 10% 0%,  rgba(232,55,42,0.09)  0%, transparent 65%),
      radial-gradient(ellipse 55% 60% at 90% 100%, rgba(0,200,224,0.07)  0%, transparent 70%),
      radial-gradient(ellipse 40% 40% at 55% 45%,  rgba(13,27,46,0.40)   0%, transparent 60%);
  }
  .rp-bg-grain {
    position: absolute; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
    background-size: 200px; opacity: 0.45; pointer-events: none;
  }

  .rp-body {
    position: relative; z-index: 1;
    max-width: 1140px; margin: 0 auto;
    padding: 0 32px 96px;
  }
  .rp-body--center { display: flex; align-items: center; justify-content: center; min-height: 80vh; }

  .rp-hero {
    padding: 40px 0 40px;
    animation: rpFadeUp 0.55s ease both;
  }
  .rp-eyebrow {
    font-family: 'Inter', sans-serif;
    font-size: 11px; font-weight: 500;
    letter-spacing: 0.20em; text-transform: uppercase;
    color: var(--red); margin-bottom: 16px;
    display: flex; align-items: center; gap: 10px;
  }
  .rp-eyebrow::after { content: ''; display: block; width: 40px; height: 1px; background: var(--red); opacity: 0.5; }

  .rp-title {
    font-family: 'Poppins', sans-serif;
    font-size: clamp(34px, 5.5vw, 72px);
    font-weight: 700; letter-spacing: -0.03em;
    color: #F8FAFC; line-height: 0.97;
    margin-bottom: 16px;
  }
  .rp-title .accent {
    color: #A8D8FF;
    -webkit-text-stroke: 0;
    display: inline;
    white-space: nowrap;
  }

  .rp-sub {
    font-family: 'Inter', sans-serif;
    font-size: 16px; font-weight: 300;
    color: rgba(160,200,224,0.60); max-width: 480px; line-height: 1.68;
    margin-bottom: 28px;
  }

  .rp-tracking-banner {
    display: flex; align-items: center; gap: 16px;
    background: linear-gradient(135deg, rgba(46,204,143,0.08), rgba(0,200,224,0.05));
    border: 1px solid rgba(46,204,143,0.20);
    border-radius: 12px; padding: 16px 18px;
    margin-bottom: 28px; animation: rpFadeUp 0.55s ease both;
  }
  .rp-banner-icon { font-size: 24px; flex-shrink: 0; }
  .rp-banner-content { flex: 1; }
  .rp-banner-title {
    font-family: 'Poppins', sans-serif;
    font-size: 13px; font-weight: 700; letter-spacing: -0.02em;
    color: var(--green); margin-bottom: 4px;
  }
  .rp-banner-text {
    font-family: 'Inter', sans-serif;
    font-size: 12px; font-weight: 300; color: rgba(160,200,224,0.55);
    line-height: 1.5; margin: 0;
  }
  .rp-banner-text strong { font-weight: 500; color: rgba(46,204,143,0.80); }
  .rp-banner-cta {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600;
    color: var(--green); background: rgba(46,204,143,0.12);
    border: 1px solid rgba(46,204,143,0.25); border-radius: 8px;
    padding: 8px 14px; text-decoration: none;
    transition: background 0.18s, border-color 0.18s, transform 0.18s;
    flex-shrink: 0; white-space: nowrap;
  }
  .rp-banner-cta:hover { background: rgba(46,204,143,0.20); border-color: rgba(46,204,143,0.40); transform: translateY(-1px); }

  .rp-steps {
    display: flex; align-items: center; gap: 0;
    margin-bottom: 28px;
    background: var(--surface); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
    border: 1px solid var(--border); border-radius: var(--radius);
    padding: 16px 20px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    flex-wrap: nowrap;
    animation: rpFadeUp 0.55s ease 0.05s both;
    -webkit-mask-image: linear-gradient(to right, black 0%, black calc(100% - 48px), transparent 100%);
    mask-image: linear-gradient(to right, black 0%, black calc(100% - 48px), transparent 100%);
  }
  .rp-steps::-webkit-scrollbar { display: none; }

  .rp-step-item { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
  .rp-step-dot {
    width: 24px; height: 24px; border-radius: 50%;
    border: 1px solid var(--border2); background: rgba(13,27,46,0.60);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Inter', sans-serif;
    font-size: 10px; font-weight: 500; color: var(--text3);
    transition: all 0.3s ease; flex-shrink: 0;
  }
  .rp-step-item--done .rp-step-dot  { background: rgba(46,204,143,0.15); border-color: var(--green); color: var(--green); }
  .rp-step-item--active .rp-step-dot { background: rgba(232,55,42,0.15); border-color: var(--red); color: var(--red); box-shadow: 0 0 8px rgba(232,55,42,0.30); }
  .rp-step-label {
    font-family: 'Inter', sans-serif;
    font-size: 11px; font-weight: 400;
    color: var(--text3); white-space: nowrap; transition: color 0.3s ease;
  }
  .rp-step-item--done .rp-step-label   { color: rgba(46,204,143,0.60); }
  .rp-step-item--active .rp-step-label { color: rgba(232,55,42,0.80); }
  .rp-step-line { width: 20px; height: 1px; background: var(--border); margin: 0 6px; flex-shrink: 0; }

  .rp-layout {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 24px;
    align-items: start;
  }
  .rp-left  { order: 0; }
  .rp-right { order: 1; }

  .rp-form { display: flex; flex-direction: column; gap: 18px; }
  .rp-card {
    background: var(--surface); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
    border: 1px solid var(--border); border-radius: var(--radius);
    padding: 22px 20px; display: flex; flex-direction: column; gap: 16px;
    animation: rpFadeUp 0.55s ease both;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }
  .rp-card:nth-child(1) { animation-delay: 0.08s; }
  .rp-card:nth-child(2) { animation-delay: 0.14s; }
  .rp-card:nth-child(3) { animation-delay: 0.20s; }
  .rp-card:nth-child(4) { animation-delay: 0.26s; }
  .rp-card:nth-child(5) { animation-delay: 0.32s; }

  .rp-card-label {
    font-family: 'Poppins', sans-serif;
    font-size: 13px; font-weight: 700;
    color: var(--text); display: flex; align-items: center; gap: 10px;
    letter-spacing: -0.02em;
  }
  .rp-step-badge {
    font-family: 'Poppins', sans-serif;
    font-size: 10px; font-weight: 600; letter-spacing: 0.10em;
    color: var(--text3); border: 1px solid var(--border2);
    border-radius: 4px; padding: 2px 6px;
  }
  .rp-optional { font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 300; color: var(--text3); margin-left: 4px; }

  .rp-type-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
  .rp-type-btn {
    background: rgba(13,27,46,0.60); border: 1px solid var(--border);
    border-radius: 9px; padding: 12px 10px;
    display: flex; flex-direction: column; align-items: center; gap: 7px;
    cursor: pointer; transition: transform 0.20s, border-color 0.20s, background 0.20s;
    font-family: 'Inter', sans-serif;
  }
  .rp-type-btn:hover { transform: translateY(-2px); border-color: var(--t-accent); background: var(--t-alpha); }
  .rp-type-btn--active { border-color: var(--t-accent) !important; background: var(--t-alpha) !important; transform: translateY(-2px); box-shadow: 0 0 20px rgba(var(--t-accent), 0.25); }
  .rp-type-icon { font-size: 20px; }
  .rp-type-label { font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 500; color: var(--text2); text-align: center; line-height: 1.3; }
  .rp-type-confirm {
    display: flex; align-items: center; gap: 8px;
    font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 500;
    color: var(--t-accent); background: var(--t-alpha);
    border: 1px solid var(--t-accent); border-radius: 7px; padding: 8px 14px;
    animation: rpFadeUp 0.3s ease both;
  }

  .rp-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .rp-field { display: flex; flex-direction: column; gap: 8px; }
  .rp-label {
    font-family: 'Inter', sans-serif;
    font-size: 10px; font-weight: 500; letter-spacing: 0.20em; text-transform: uppercase;
    color: var(--text3);
  }
  .rp-input {
    background: var(--input-bg); border: 1px solid var(--border);
    border-radius: 8px; padding: 11px 13px;
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 400;
    color: var(--text); outline: none; width: 100%;
    transition: border-color 0.18s, background 0.18s;
    caret-color: var(--cyan);
  }
  .rp-input::placeholder { color: var(--text3); }
  .rp-input:focus { border-color: rgba(0,200,224,0.50); background: rgba(0,200,224,0.04); box-shadow: 0 0 12px rgba(0,200,224,0.15); }
  .rp-textarea {
    background: var(--input-bg); border: 1px solid var(--border);
    border-radius: 8px; padding: 11px 13px;
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 300;
    color: var(--text); outline: none; width: 100%; resize: vertical; line-height: 1.6;
    transition: border-color 0.18s, background 0.18s; caret-color: var(--cyan);
  }
  .rp-textarea::placeholder { color: var(--text3); }
  .rp-textarea:focus { border-color: rgba(0,200,224,0.50); background: rgba(0,200,224,0.04); box-shadow: 0 0 12px rgba(0,200,224,0.15); }

  .rp-location-row {
    display: flex;
    align-items: stretch;
    gap: 8px;
  }
  .rp-location-input-wrap {
    position: relative;
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
  }
  .rp-location-dot {
    position: absolute;
    left: 13px;
    top: 50%;
    transform: translateY(-50%);
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--text3);
    transition: background 0.3s;
    z-index: 1;
    flex-shrink: 0;
    pointer-events: none;
  }
  .rp-location-dot[data-status="loading"] { background: var(--yellow); animation: rpPulse 1.2s ease infinite; }
  .rp-location-dot[data-status="ok"]      { background: var(--green); }
  .rp-location-dot[data-status="error"]   { background: var(--red); }
  .rp-input--location { padding-left: 30px; width: 100%; }

  .rp-gps-btn {
    flex-shrink: 0;
    background: rgba(0,200,224,0.08); border: 1px solid rgba(0,200,224,0.20);
    border-radius: 7px; padding: 9px 12px;
    font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 500;
    color: var(--cyan); cursor: pointer; white-space: nowrap;
    transition: background 0.18s, border-color 0.18s;
    min-height: 44px; align-self: stretch;
    display: flex; align-items: center;
  }
  .rp-gps-btn:hover { background: rgba(0,200,224,0.15); border-color: rgba(0,200,224,0.38); }

  .rp-coords-badge {
    display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
    background: rgba(0,200,224,0.04); border: 1px solid rgba(0,200,224,0.10);
    border-radius: 7px; padding: 7px 12px;
  }
  .rp-coords-icon { font-size: 12px; flex-shrink: 0; }
  .rp-coords-text {
    font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 400;
    color: var(--text3); font-variant-numeric: tabular-nums; flex: 1;
  }

  .rp-gps-acquiring { display: flex; align-items: center; gap: 9px; margin-top: 8px; font-family: 'Inter', sans-serif; font-size: 12px; color: rgba(245,200,66,0.65); line-height: 1.5; }
  .rp-gps-pulse { width: 10px; height: 10px; border-radius: 50%; background: var(--yellow); flex-shrink: 0; animation: gpsPulse 1.1s ease infinite; }
  @keyframes gpsPulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.3; transform:scale(0.7); } }

  .rp-gps-badges { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 6px; }
  .rp-acc-badge { font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 500; padding: 3px 10px; border-radius: 20px; }
  .acc-great { background: rgba(46,204,143,0.12); color: var(--green); border: 1px solid rgba(46,204,143,0.25); }
  .acc-ok    { background: rgba(245,200,66,0.10); color: var(--yellow); border: 1px solid rgba(245,200,66,0.22); }
  .acc-poor  { background: rgba(232,55,42,0.10);  color: var(--red);    border: 1px solid rgba(232,55,42,0.22); }
  .rp-acc-tip { font-family: 'Inter', sans-serif; font-size: 11px; color: rgba(232,55,42,0.60); }

  .rp-maps-verify {
    display: inline-flex; align-items: center; gap: 4px;
    font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 500;
    color: var(--cyan);
    text-decoration: none;
    transition: opacity 0.18s;
    white-space: nowrap;
  }
  .rp-maps-verify:hover { opacity: 0.75; }

  .rp-hint { font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 300; color: var(--text3); line-height: 1.5; }
  .rp-hint--warn { font-size: 11px; color: rgba(245,200,66,0.60); }

  .rp-dropzone { border: 1px dashed var(--border2); border-radius: 10px; padding: 28px 20px; display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer; transition: border-color 0.2s, background 0.2s; text-align: center; }
  .rp-dropzone:hover { border-color: rgba(0,200,224,0.35); background: rgba(0,200,224,0.03); }
  .rp-dropzone-icon { font-size: 24px; }
  .rp-dropzone-text  { font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 400; color: var(--text2); }
  .rp-dropzone-name  { font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; color: var(--cyan); }
  .rp-dropzone-hint, .rp-dropzone-change { font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 300; color: var(--text3); }
  .rp-dropzone-preview { position: relative; width: 100%; border-radius: 8px; overflow: hidden; background: var(--input-bg); border: 1px solid var(--border); }
  .rp-preview-media { display: block; width: 100%; max-height: 260px; object-fit: contain; background: var(--input-bg); }
  .rp-preview-info { display: flex; align-items: center; gap: 8px; padding: 10px 12px; background: var(--surface); border-top: 1px solid var(--border); flex-wrap: wrap; }
  .rp-upload-status { font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 500; padding: 8px 12px; border-radius: 7px; }
  .rp-upload-status--uploading { background: rgba(245,200,66,0.08); color: var(--yellow); border: 1px solid rgba(245,200,66,0.20); }
  .rp-upload-status--done      { background: rgba(46,204,143,0.08); color: var(--green);  border: 1px solid rgba(46,204,143,0.20); }
  .rp-upload-status--error     { background: rgba(232,55,42,0.08);  color: var(--red);    border: 1px solid rgba(232,55,42,0.20); }

  .rp-disclaimer {
    background: rgba(245,200,66,0.04); border: 1px solid rgba(245,200,66,0.13);
    border-radius: 10px; padding: 16px 18px;
    backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
    animation: rpFadeUp 0.55s ease 0.36s both;
    display: flex; flex-direction: column; gap: 12px;
  }
  .rp-disclaimer-header { display: flex; align-items: center; gap: 8px; }
  .rp-disclaimer-icon { font-size: 16px; }
  .rp-disclaimer-title { font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: rgba(245,200,66,0.80); }
  .rp-disclaimer-summary { font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 400; color: var(--text3); line-height: 1.5; margin: 0; }
  .rp-check-label { display: flex; align-items: flex-start; gap: 12px; cursor: pointer; }
  .rp-checkbox { display: none; }
  .rp-check-box {
    width: 18px; height: 18px; flex-shrink: 0;
    border: 1px solid rgba(245,200,66,0.35); border-radius: 4px;
    background: rgba(245,200,66,0.06);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 500; color: var(--yellow);
    margin-top: 1px; transition: background 0.2s, border-color 0.2s;
  }
  .rp-check-text { font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 300; color: var(--text3); line-height: 1.6; }
  .rp-check-text strong { font-weight: 500; color: rgba(245,200,66,0.70); }

  .rp-error-banner {
    background: rgba(232,55,42,0.08); border: 1px solid rgba(232,55,42,0.25);
    border-radius: 8px; padding: 12px 16px;
    font-family: 'Inter', sans-serif; font-size: 13px; color: var(--red);
    animation: rpFadeUp 0.3s ease both;
  }
  .rp-skip-evidence-btn {
    display: inline-block; margin-top: 8px; padding: 7px 14px;
    background: rgba(232,55,42,0.12); border: 1px solid rgba(232,55,42,0.30);
    border-radius: 7px; font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 500;
    color: var(--red); cursor: pointer; transition: background 0.18s;
  }
  .rp-skip-evidence-btn:hover { background: rgba(232,55,42,0.22); }

  .rp-submit {
    display: flex; align-items: center; justify-content: center; gap: 12px;
    width: 100%; padding: 15px 24px;
    font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 700;
    letter-spacing: 0.06em; text-transform: uppercase;
    color: #0b0f1a; background: var(--green);
    border: none; border-radius: 10px; cursor: pointer;
    transition: opacity 0.2s, transform 0.2s, background 0.2s;
    animation: rpFadeUp 0.55s ease 0.42s both;
  }
  .rp-submit:hover:not(:disabled) { background: #38e09e; transform: translateY(-2px); }
  .rp-submit:active:not(:disabled) { transform: translateY(0px); background: #27b885; }
  .rp-submit:disabled { opacity: 0.3; cursor: not-allowed; background: var(--surface2); color: var(--text3); }
  .rp-submit-arrow { font-size: 18px; transition: transform 0.2s; }
  .rp-submit:hover:not(:disabled) .rp-submit-arrow { transform: translateX(4px); }
  .rp-loader {
    display: inline-block;
    width: 14px; height: 14px;
    border: 2px solid rgba(11, 15, 26, 0.3);
    border-top-color: #0b0f1a;
    border-radius: 50%;
    animation: rpSpin 0.8s linear infinite;
  }
  @keyframes rpSpin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .rp-right {
    display: flex; flex-direction: column; gap: 14px;
    position: sticky; top: 76px;
    animation: rpFadeUp 0.55s ease 0.10s both;
  }
  .rp-sidebar-card {
    background: var(--surface2); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
    border: 1px solid var(--border); border-radius: var(--radius);
    padding: 18px 16px; display: flex; flex-direction: column; gap: 12px;
  }
  .rp-sidebar-card--warn  { background: rgba(245,200,66,0.05); border-color: rgba(245,200,66,0.14); }
  .rp-sidebar-card--info  { background: rgba(0,200,224,0.05);  border-color: rgba(0,200,224,0.14);  }
  .rp-sidebar-card--track { background: rgba(46,204,143,0.05); border-color: rgba(46,204,143,0.14); }
  .rp-sidebar-title {
    font-family: 'Poppins', sans-serif;
    font-size: 12px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;
    color: var(--text);
  }
  .rp-sidebar-text { font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 300; color: var(--text3); line-height: 1.65; margin: 0; }
  .rp-track-link {
    display: inline-block; margin-top: 8px;
    font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 500;
    color: var(--green); background: rgba(46,204,143,0.08);
    border: 1px solid rgba(46,204,143,0.20); border-radius: 7px;
    padding: 8px 12px; text-decoration: none; width: fit-content;
    transition: background 0.18s, border-color 0.18s;
  }
  .rp-track-link:hover { background: rgba(46,204,143,0.15); border-color: rgba(46,204,143,0.35); }

  .rp-hotlines { display: flex; flex-direction: column; gap: 8px; }
  .rp-hotline {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; background: rgba(13,27,46,0.60);
    border: 1px solid var(--border); border-radius: 8px;
    text-decoration: none; transition: background 0.2s, border-color 0.2s;
    min-height: 44px;
  }
  .rp-hotline:hover { background: rgba(13,27,46,0.88); border-color: var(--h-color, var(--border2)); }
  .rp-hotline-icon { font-size: 16px; }
  .rp-hotline-info { display: flex; flex-direction: column; flex: 1; }
  .rp-hotline-label { font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text3); }
  .rp-hotline-number { font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 700; color: var(--text); }
  .rp-hotline-call { font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 500; color: var(--h-color, var(--text3)); opacity: 0.7; }

  .rp-success { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 60px 24px 40px; animation: rpFadeUp 0.5s ease both; }
  .rp-success-icon {
    width: 64px; height: 64px; border-radius: 50%;
    background: rgba(46,204,143,0.12); border: 1px solid rgba(46,204,143,0.30);
    display: flex; align-items: center; justify-content: center;
    font-size: 26px; color: var(--green); margin-bottom: 24px;
  }
  .rp-success-title { font-family: 'Poppins', sans-serif; font-size: 32px; font-weight: 700; color: var(--text); margin-bottom: 12px; }
  .rp-success-sub { font-family: 'Inter', sans-serif; font-size: 15px; font-weight: 300; color: var(--text3); max-width: 480px; line-height: 1.65; margin-bottom: 40px; }

  .rp-success-actions {
    display: grid; grid-template-columns: 1fr; gap: 20px; max-width: 500px; width: 100%; margin: 0 auto 20px; justify-items: center;
  }
  .rp-success-card {
    background: var(--surface); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
    border: 1px solid var(--border); border-radius: var(--radius);
    padding: 24px 20px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    animation: rpFadeUp 0.55s ease both;
    width: 100%; max-width: 400px;
  }
  .rp-success-card-icon { font-size: 32px; }
  .rp-success-card-title { font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 700; color: var(--text); letter-spacing: -0.02em; }
  .rp-success-card-text { font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 300; color: var(--text3); line-height: 1.5; margin: 0; }

  .rp-btn-primary {
    display: inline-flex; align-items: center;
    margin-top: 8px;
    font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600;
    color: #0b0f1a; background: var(--green);
    border: none; border-radius: 7px;
    padding: 9px 16px; text-decoration: none; cursor: pointer;
    transition: background 0.18s, transform 0.18s;
    min-height: 40px;
  }
  .rp-btn-primary:hover { background: #38e09e; transform: translateY(-2px); }
  .rp-btn-primary--ghost {
    color: var(--green); background: rgba(46,204,143,0.08);
    border: 1px solid rgba(46,204,143,0.20);
  }
  .rp-btn-primary--ghost:hover { background: rgba(46,204,143,0.15); border-color: rgba(46,204,143,0.35); }

  @media (max-width: 860px) {
    .rp-body { padding: 0 20px 80px; }
    .rp-hero { padding: 28px 0 32px; }
    .rp-tracking-banner { flex-direction: column; align-items: flex-start; gap: 12px; margin-bottom: 24px; }
    .rp-banner-cta { width: 100%; justify-content: center; }
    .rp-title { font-size: clamp(28px, 7.5vw, 52px); }
    .rp-layout { grid-template-columns: 1fr; gap: 20px; }
    .rp-left  { order: 0; }
    .rp-right { order: 1; position: static; top: auto; }
    .rp-hotlines { flex-direction: row; flex-wrap: wrap; gap: 8px; }
    .rp-hotline { flex: 1 1 calc(50% - 4px); min-width: 120px; }
    .rp-steps { padding: 12px 16px; -webkit-mask-image: linear-gradient(to right, black 0%, black calc(100% - 36px), transparent 100%); mask-image: linear-gradient(to right, black 0%, black calc(100% - 36px), transparent 100%); }
  }

  @media (max-width: 600px) {
    .rp-fields { grid-template-columns: 1fr; }
    .rp-body { padding: 0 16px 80px; }
    .rp-title { font-size: clamp(26px, 7vw, 42px); }
    .rp-success-actions { grid-template-columns: 1fr; gap: 16px; }
    .rp-success-card { padding: 20px 16px; }
  }

  @media (max-width: 500px) {
    .rp-location-row { flex-direction: column; align-items: stretch; }
    .rp-gps-btn { width: 100%; justify-content: center; }
    .rp-steps { -webkit-mask-image: none; mask-image: none; justify-content: space-between; padding: 10px 14px; }
    .rp-step-label { width: 0; font-size: 0; overflow: hidden; padding: 0; margin: 0; }
    .rp-step-line { width: 10px; margin: 0 2px; }
    .rp-step-dot { width: 28px; height: 28px; font-size: 11px; }
    .rp-hotline { flex: 1 1 100%; }
  }

  @media (max-width: 380px) {
    .rp-body { padding: 0 12px 80px; }
    .rp-title { font-size: 24px; }
    .rp-type-grid { grid-template-columns: repeat(2, 1fr); gap: 6px; }
    .rp-type-btn  { padding: 10px 8px; }
    .rp-type-icon { font-size: 18px; }
    .rp-type-label { font-size: 10px; }
  }

  @keyframes rpFadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes rpPulse  { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
`;export{be as default};
