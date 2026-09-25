import{j as e,r as o,H as v}from"./app-BmQcu0lG.js";import{A as j}from"./app-layout-CKQGSazf.js";import{C as z,a as M,b as $,d as P,c as D}from"./card-DcbiBgIF.js";import{c as N,b as B,B as c}from"./button-a38SVfeV.js";import{i as H,g as I,U as L,B as k,C as E}from"./useQueue-CBWgYJyC.js";import{T as m}from"./ticket-CqCiOMzM.js";import{S as q}from"./sparkles-B1USyxa5.js";import{c as x}from"./index-BriSJ68E.js";import{C as R}from"./circle-alert-B9V4yIMu.js";import{A as V}from"./arrow-left-CRMumjgM.js";/* empty css            */import"./index-B0VcPoVB.js";import"./index-CkzgjImP.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F=[["path",{d:"M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z",key:"1b4qmf"}],["path",{d:"M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2",key:"i71pzd"}],["path",{d:"M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2",key:"10jefs"}],["path",{d:"M10 6h4",key:"1itunk"}],["path",{d:"M10 10h4",key:"tcdvrf"}],["path",{d:"M10 14h4",key:"kelpxr"}],["path",{d:"M10 18h4",key:"1ulq68"}]],G=x("Building2",F);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]],y=x("CircleCheck",U);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const W=[["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"143wyd"}],["path",{d:"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6",key:"1itne7"}],["rect",{x:"6",y:"14",width:"12",height:"8",rx:"1",key:"1ue0tg"}]],X=x("Printer",W),K=B("relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",{variants:{variant:{default:"bg-background text-foreground",destructive:"text-destructive-foreground [&>svg]:text-current *:data-[slot=alert-description]:text-destructive-foreground/80"}},defaultVariants:{variant:"default"}});function O({className:i,variant:n,...d}){return e.jsx("div",{"data-slot":"alert",role:"alert",className:N(K({variant:n}),i),...d})}function Q({className:i,...n}){return e.jsx("div",{"data-slot":"alert-description",className:N("text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",i),...n})}function ce(){const{services:i,loading:n}=H(),{generateTicket:d,loading:p,error:w}=I(),[s,h]=o.useState(null),[r,u]=o.useState(null),[g,b]=o.useState(null),f=[{title:"Antrian",href:"/queue/display"},{title:"Ambil Tiket",href:"/queue/ticket"}],A=async()=>{if(!s)return;b(null);const t=await d(s);t?u(t):b(w||"Gagal membuat tiket. Silakan coba lagi.")},_=()=>{const t=r,a=i.find(S=>S.id===t.service_id)?.name||"",T=new Date(t.created_at).toLocaleString("id-ID",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}),C=`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Tiket Antrian - ${t.number_str}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 20mm;
          }
          * { 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box; 
          }
          body { 
            font-family: 'Segoe UI', Arial, sans-serif; 
            display: flex;
            justify-content: center;
            padding: 20px;
          }
          .ticket {
            width: 100%;
            max-width: 400px;
            border: 3px solid #0d9488;
            border-radius: 16px;
            overflow: hidden;
            background: white;
          }
          .header {
            background: linear-gradient(135deg, #0d9488, #10b981);
            color: white;
            padding: 20px;
            text-align: center;
          }
          .header h1 {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 4px;
          }
          .header p {
            font-size: 12px;
            opacity: 0.9;
          }
          .content {
            padding: 30px;
            text-align: center;
          }
          .service {
            font-size: 14px;
            padding: 6px 16px;
            border: 2px solid #0d9488;
            border-radius: 20px;
            display: inline-block;
            margin-bottom: 20px;
            color: #0d9488;
            font-weight: 600;
          }
          .number {
            font-size: 72px;
            font-weight: 900;
            letter-spacing: 4px;
            color: #0d9488;
            margin: 20px 0;
            line-height: 1;
          }
          .info {
            margin-top: 25px;
            padding-top: 20px;
            border-top: 2px dashed #e5e7eb;
            text-align: left;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            font-size: 14px;
            border-bottom: 1px solid #f3f4f6;
          }
          .info-row:last-child {
            border-bottom: none;
          }
          .info-label {
            color: #6b7280;
          }
          .info-value {
            font-weight: 600;
            color: #111827;
          }
          .estimate {
            margin-top: 20px;
            padding: 20px;
            background: linear-gradient(135deg, #f0fdfa, #ecfdf5);
            border: 2px solid #99f6e4;
            border-radius: 12px;
            text-align: center;
          }
          .estimate-label {
            font-size: 13px;
            color: #6b7280;
            margin-bottom: 8px;
          }
          .estimate-time {
            font-size: 42px;
            font-weight: 800;
            color: #0d9488;
          }
          .estimate-info {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin-top: 15px;
            font-size: 13px;
          }
          .estimate-info span {
            color: #6b7280;
          }
          .estimate-info strong {
            color: #0d9488;
          }
          .footer {
            text-align: center;
            padding: 15px;
            background: #f9fafb;
            font-size: 12px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
          }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="header">
            <h1>TIKET ANTRIAN</h1>
            <p>Sistem Antrian Poliklinik</p>
          </div>
          <div class="content">
            <div class="service">${a}</div>
            <div class="number">${t.number_str}</div>
            
            <div class="info">
              <div class="info-row">
                <span class="info-label">Waktu Ambil</span>
                <span class="info-value">${T}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Status</span>
                <span class="info-value" style="color: #3b82f6;">Menunggu</span>
              </div>
            </div>

            <div class="estimate">
              <div class="estimate-label">Perkiraan Dilayani</div>
              <div class="estimate-time">${t.estimated_service_time??"--:--"}</div>
              <div class="estimate-info">
                <span>Antrian di depan: <strong>${t.waiting_ahead??0}</strong></span>
                <span>Tunggu: <strong>±${t.estimated_wait_minutes??0} menit</strong></span>
              </div>
            </div>
          </div>
          <div class="footer">
            Harap tunggu panggilan nomor Anda di layar display
          </div>
        </div>
        <script>
          window.onload = function() { 
            setTimeout(function() {
              window.print(); 
            }, 200);
          }
        <\/script>
      </body>
      </html>
    `,l=window.open("","_blank","width=600,height=800");l&&(l.document.write(C),l.document.close())};return n?e.jsxs(j,{breadcrumbs:f,children:[e.jsx(v,{title:"Ambil Tiket"}),e.jsx("div",{className:"flex h-screen items-center justify-center",children:e.jsxs("div",{className:"text-center space-y-4",children:[e.jsxs("div",{className:"relative mx-auto w-16 h-16",children:[e.jsx("div",{className:"absolute inset-0 rounded-full bg-teal-500/20 animate-ping"}),e.jsx("div",{className:"relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600",children:e.jsx(m,{className:"h-7 w-7 text-white"})})]}),e.jsx("p",{className:"text-sm font-medium text-muted-foreground animate-pulse",children:"Memuat layanan…"})]})})]}):e.jsxs(j,{breadcrumbs:f,children:[e.jsx(v,{title:"Ambil Tiket"}),e.jsx("div",{className:"min-h-screen bg-gradient-to-b from-background to-muted/20 p-6",children:e.jsx("div",{className:"container mx-auto max-w-4xl",children:r?e.jsxs(e.Fragment,{children:[e.jsx("style",{dangerouslySetInnerHTML:{__html:`
@media print {
  /* Hide everything except the ticket */
  body > *:not(#app),
  header, nav, aside, footer,
  .no-print,
  [data-sidebar],
  [data-slot="sidebar"],
  [data-slot="sidebar-wrapper"] {
    display: none !important;
  }

  /* Reset page */
  @page {
    size: A6 portrait;
    margin: 8mm;
  }

  html, body {
    margin: 0 !important;
    padding: 0 !important;
    background: white !important;
  }

  /* Make sure ticket is visible and styled */
  #printable-ticket {
    display: block !important;
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  #printable-ticket * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }

  /* Remove shadows and animations */
  #printable-ticket .shadow,
  #printable-ticket .shadow-xl {
    box-shadow: none !important;
  }

  /* Compact styling for print */
  #printable-ticket .ticket-number {
    font-size: 42px !important;
    color: #000 !important;
  }

  #printable-ticket .text-primary {
    color: #0d9488 !important;
  }
}
`}}),e.jsxs("div",{className:"mx-auto max-w-2xl",children:[e.jsxs("div",{className:"no-print text-center mb-8 animate-in fade-in zoom-in duration-500",children:[e.jsx("div",{className:"inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/50 rounded-full mb-4",children:e.jsx(y,{className:"h-10 w-10 text-green-600 dark:text-green-400"})}),e.jsx("h1",{className:"text-3xl font-bold mb-2",children:"Tiket Berhasil Dibuat!"}),e.jsx("p",{className:"text-muted-foreground",children:"Nomor antrian Anda telah berhasil dibuat"})]}),e.jsx("div",{id:"printable-ticket",children:e.jsxs(z,{className:"border-2 shadow-xl animate-in slide-in-from-bottom-4 duration-500",children:[e.jsxs(M,{className:"card-header text-center py-4 bg-primary/5 dark:bg-primary/10",children:[e.jsx($,{className:"text-xl",children:"Nomor Antrian"}),e.jsx(P,{className:"text-xs",children:"Simpan nomor ini"})]}),e.jsxs(D,{className:"card-content space-y-4 py-4",children:[e.jsxs("div",{className:"rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 dark:bg-primary/10 p-4 text-center",children:[e.jsx(k,{variant:"outline",className:"text-xs font-semibold px-3 py-0.5 mb-2",children:i.find(t=>t.id===r.service_id)?.name}),e.jsx("div",{className:"ticket-number text-6xl font-black text-primary tracking-wider",children:r.number_str})]}),e.jsxs("div",{className:"space-y-2 text-sm",children:[e.jsxs("div",{className:"info-row flex items-center justify-between py-2 px-3 rounded bg-muted/50",children:[e.jsx("span",{className:"text-muted-foreground",children:"Waktu"}),e.jsx("span",{className:"font-medium",children:new Date(r.created_at).toLocaleString("id-ID",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"})})]}),e.jsxs("div",{className:"estimate-section p-3 rounded bg-primary/5 border border-primary/20",children:[e.jsxs("div",{className:"flex justify-between items-center mb-2",children:[e.jsx("span",{className:"text-xs text-muted-foreground",children:"Antrian di depan"}),e.jsx("span",{className:"font-bold text-primary",children:r.waiting_ahead??0})]}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-xs text-muted-foreground",children:"Perkiraan dilayani"}),e.jsx("span",{className:"estimate-time text-xl font-bold text-primary",children:r.estimated_service_time??"--:--"})]})]}),e.jsxs("div",{className:"info-row flex items-center justify-between py-2 px-3 rounded bg-muted/50",children:[e.jsx("span",{className:"text-muted-foreground",children:"Status"}),e.jsx(k,{variant:"outline",className:"text-xs border-blue-500 text-blue-600",children:"Menunggu"})]})]}),e.jsx("p",{className:"text-center text-xs text-muted-foreground",children:"Tunggu pemanggilan di layar display"})]})]})}),e.jsxs("div",{className:"no-print mt-6 space-y-3",children:[e.jsxs(c,{onClick:_,variant:"default",size:"lg",className:"w-full h-12 text-base font-semibold",children:[e.jsx(X,{className:"mr-2 h-5 w-5"}),"Cetak Tiket"]}),e.jsxs(c,{onClick:()=>{u(null),h(null)},variant:"outline",size:"lg",className:"w-full h-12 text-base font-semibold",children:[e.jsx(V,{className:"mr-2 h-5 w-5"}),"Ambil Tiket Baru"]})]}),e.jsxs(O,{className:"no-print mt-6 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/50",children:[e.jsx(E,{className:"h-4 w-4 text-amber-600 dark:text-amber-400"}),e.jsxs(Q,{className:"text-amber-900 dark:text-amber-100 text-sm",children:[e.jsx("strong",{children:"Perhatian:"})," Pastikan Anda berada di area tunggu dan memperhatikan layar display untuk mendengar nomor antrian Anda dipanggil."]})]}),e.jsx("div",{className:"no-print mt-6 text-center text-sm text-muted-foreground",children:e.jsx("p",{children:"Terima kasih telah menggunakan sistem antrian digital kami"})})]})]}):e.jsxs("div",{className:"space-y-8",children:[e.jsxs("div",{className:"text-center space-y-4 pt-4",children:[e.jsxs("div",{className:"relative inline-flex items-center justify-center",children:[e.jsx("div",{className:"absolute inset-0 rounded-full bg-teal-500/20 blur-xl"}),e.jsx("div",{className:"relative p-5 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-xl shadow-teal-500/30",children:e.jsx(m,{className:"h-12 w-12 text-white"})})]}),e.jsxs("div",{children:[e.jsx("h1",{className:"text-4xl font-black tracking-tight",children:"Ambil Tiket Antrian"}),e.jsx("p",{className:"text-muted-foreground mt-2 text-base",children:"Pilih layanan dan dapatkan nomor antrian Anda sekarang"})]})]}),e.jsxs("div",{className:"flex items-center gap-3 p-4 rounded-2xl bg-blue-500/8 border border-blue-500/20",children:[e.jsx(q,{className:"h-5 w-5 text-blue-500 shrink-0"}),e.jsx("p",{className:"text-sm text-blue-700 dark:text-blue-300",children:"Sistem antrian digital – pilih layanan dan ambil nomor antrian Anda tanpa perlu mengantri di loket."})]}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center gap-2 mb-5",children:[e.jsx("div",{className:"p-2 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow shadow-teal-500/25",children:e.jsx(G,{className:"h-4 w-4 text-white"})}),e.jsx("h2",{className:"text-xl font-bold",children:"Pilih Layanan"})]}),e.jsx("div",{className:"grid gap-4 md:grid-cols-2 lg:grid-cols-3",children:i?.map(t=>{const a=s===t.id;return e.jsxs("button",{type:"button",onClick:()=>h(t.id),className:`group relative text-left w-full rounded-2xl border-2 p-5 transition-all duration-200 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${a?"border-teal-500 bg-gradient-to-br from-teal-500/10 to-emerald-500/5 shadow-lg shadow-teal-500/15":"border-border bg-card hover:border-teal-400/60 hover:shadow-md"}`,children:[a&&e.jsx("div",{className:"absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-400"}),e.jsxs("div",{className:"flex items-start justify-between mb-3",children:[e.jsx("div",{className:`p-2.5 rounded-xl transition-all ${a?"bg-gradient-to-br from-teal-500 to-emerald-600 shadow shadow-teal-500/30":"bg-muted group-hover:bg-teal-500/10"}`,children:e.jsx(L,{className:`h-5 w-5 ${a?"text-white":"text-muted-foreground group-hover:text-teal-600"}`})}),a&&e.jsx(y,{className:"h-5 w-5 text-teal-500"})]}),e.jsx("div",{className:"font-bold text-base leading-tight mb-1",children:t.name}),e.jsxs("div",{className:"text-xs text-muted-foreground mb-3",children:["Kode: ",t.code]}),e.jsxs("div",{className:`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${a?"bg-teal-500 text-white":"bg-muted text-muted-foreground"}`,children:["Antrian: ",t.prefix,"-XXX"]})]},t.id)})})]}),e.jsxs("div",{className:"space-y-3",children:[e.jsx(c,{onClick:A,disabled:!s||p,size:"lg",className:`w-full h-14 text-lg font-bold transition-all ${s?"bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 shadow-lg shadow-teal-500/30":""}`,children:p?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"mr-2 h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"}),"Membuat Tiket…"]}):e.jsxs(e.Fragment,{children:[e.jsx(m,{className:"mr-2 h-6 w-6"}),"Ambil Nomor Antrian Sekarang"]})}),!s&&e.jsx("p",{className:"text-center text-sm text-muted-foreground",children:"Silakan pilih layanan terlebih dahulu"}),g&&e.jsxs("div",{className:"flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800",children:[e.jsx(R,{className:"h-4 w-4 text-red-500 mt-0.5 shrink-0"}),e.jsx("p",{className:"text-sm text-red-800 dark:text-red-200",children:g})]})]})]})})})]})}export{ce as default};
