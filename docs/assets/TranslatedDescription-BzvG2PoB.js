import{am as d,ak as e}from"./index-CvhaT9ii.js";const h={en:"English",ru:"Russian",ja:"Japanese",ko:"Korean",zh:"Chinese",ar:"Arabic",tl:"Tagalog",ceb:"Cebuano"},x=`
  .td-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 6px;
    font-size: 11px;
    color: var(--text3, rgba(160,200,224,0.55));
    line-height: 1.5;
  }
  .td-toggle {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--cyan, #00c8e0);
    font-size: 11px;
    text-decoration: underline;
    padding: 0;
    font-family: inherit;
  }
  .td-toggle:hover { opacity: 0.75; }
`;function j({description:a,descriptionLang:n,descriptionTranslated:r,className:t}){const[i,s]=d.useState(!1);if(!(!!n&&n!=="en"&&!!r))return t?e.jsx("div",{className:t,children:e.jsx("p",{children:a})}):e.jsx("p",{children:a});const l=h[n]??n,o=e.jsxs(e.Fragment,{children:[e.jsx("p",{children:i?a:r}),e.jsxs("div",{className:"td-meta",children:[e.jsxs("span",{title:"Machine-translated by MyMemory, not a certified translation",children:["Machine-translated · original: ",l]}),e.jsx("button",{type:"button",className:"td-toggle",onClick:()=>s(c=>!c),children:i?"Show translated (English)":"Show original"})]})]});return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:x}),t?e.jsx("div",{className:t,children:o}):o]})}export{j as T};
