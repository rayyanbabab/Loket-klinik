import{r as f}from"./app-CLYjD8Lq.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),E=(...e)=>e.filter((r,o,s)=>!!r&&r.trim()!==""&&s.indexOf(r)===o).join(" ").trim();/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var x={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D=f.forwardRef(({color:e="currentColor",size:r=24,strokeWidth:o=2,absoluteStrokeWidth:s,className:u="",children:g,iconNode:t,...m},y)=>f.createElement("svg",{ref:y,...x,width:r,height:r,stroke:e,strokeWidth:s?Number(o)*24/Number(r):o,className:E("lucide",u),...m},[...t.map(([k,H])=>f.createElement(k,H)),...Array.isArray(g)?g:[g]]));/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=(e,r)=>{const o=f.forwardRef(({className:s,...u},g)=>f.createElement(D,{ref:g,iconNode:r,className:E(`lucide-${_(e)}`,s),...u}));return o.displayName=`${e}`,o};/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=[["path",{d:"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",key:"c3ymky"}]],L=v("Heart",C);let Q={};const c=e=>{if(!e||!e.query&&!e.mergeQuery)return"";const r=e.query??e.mergeQuery,o=e.mergeQuery!==void 0,s=t=>t===!0?"1":t===!1?"0":t.toString(),u=new URLSearchParams(o&&typeof window<"u"?window.location.search:"");for(const t in r){if(r[t]===void 0||r[t]===null){u.delete(t);continue}if(Array.isArray(r[t]))u.has(`${t}[]`)&&u.delete(`${t}[]`),r[t].forEach(m=>{u.append(`${t}[]`,m.toString())});else if(typeof r[t]=="object"){u.forEach((m,y)=>{y.startsWith(`${t}[`)&&u.delete(y)});for(const m in r[t])typeof r[t][m]>"u"||["string","number","boolean"].includes(typeof r[t][m])&&u.set(`${t}[${m}]`,s(r[t][m]))}else u.set(t,s(r[t]))}const g=u.toString();return g.length>0?`?${g}`:""},S=e=>{const r={...e??{}};for(const o in Q)r[o]===void 0&&Q[o]!==void 0&&(r[o]=Q[o]);return r},n=e=>({url:n.url(e),method:"get"});n.definition={methods:["get","head"],url:"/"};n.url=e=>n.definition.url+c(e);n.get=e=>({url:n.url(e),method:"get"});n.head=e=>({url:n.url(e),method:"head"});const p=e=>({action:n.url(e),method:"get"});p.get=e=>({action:n.url(e),method:"get"});p.head=e=>({action:n.url({[e?.mergeQuery?"mergeQuery":"query"]:{_method:"HEAD",...e?.query??e?.mergeQuery??{}}}),method:"get"});n.form=p;const d=e=>({url:d.url(e),method:"get"});d.definition={methods:["get","head"],url:"/dashboard"};d.url=e=>d.definition.url+c(e);d.get=e=>({url:d.url(e),method:"get"});d.head=e=>({url:d.url(e),method:"head"});const q=e=>({action:d.url(e),method:"get"});q.get=e=>({action:d.url(e),method:"get"});q.head=e=>({action:d.url({[e?.mergeQuery?"mergeQuery":"query"]:{_method:"HEAD",...e?.query??e?.mergeQuery??{}}}),method:"get"});d.form=q;const l=e=>({url:l.url(e),method:"get"});l.definition={methods:["get","head"],url:"/settings/appearance"};l.url=e=>l.definition.url+c(e);l.get=e=>({url:l.url(e),method:"get"});l.head=e=>({url:l.url(e),method:"head"});const w=e=>({action:l.url(e),method:"get"});w.get=e=>({action:l.url(e),method:"get"});w.head=e=>({action:l.url({[e?.mergeQuery?"mergeQuery":"query"]:{_method:"HEAD",...e?.query??e?.mergeQuery??{}}}),method:"get"});l.form=w;const a=e=>({url:a.url(e),method:"get"});a.definition={methods:["get","head"],url:"/register"};a.url=e=>a.definition.url+c(e);a.get=e=>({url:a.url(e),method:"get"});a.head=e=>({url:a.url(e),method:"head"});const b=e=>({action:a.url(e),method:"get"});b.get=e=>({action:a.url(e),method:"get"});b.head=e=>({action:a.url({[e?.mergeQuery?"mergeQuery":"query"]:{_method:"HEAD",...e?.query??e?.mergeQuery??{}}}),method:"get"});a.form=b;const i=e=>({url:i.url(e),method:"get"});i.definition={methods:["get","head"],url:"/login"};i.url=e=>i.definition.url+c(e);i.get=e=>({url:i.url(e),method:"get"});i.head=e=>({url:i.url(e),method:"head"});const A=e=>({action:i.url(e),method:"get"});A.get=e=>({action:i.url(e),method:"get"});A.head=e=>({action:i.url({[e?.mergeQuery?"mergeQuery":"query"]:{_method:"HEAD",...e?.query??e?.mergeQuery??{}}}),method:"get"});i.form=A;const h=e=>({url:h.url(e),method:"post"});h.definition={methods:["post"],url:"/logout"};h.url=e=>h.definition.url+c(e);h.post=e=>({url:h.url(e),method:"post"});const $=e=>({action:h.url(e),method:"post"});$.post=e=>({action:h.url(e),method:"post"});h.form=$;export{L as H,S as a,h as b,v as c,d,l as e,n as h,i as l,c as q,a as r};
