import{r as d,j as e,H as y}from"./app-CLYjD8Lq.js";import{A as N}from"./app-layout-Cjeb57ne.js";import{n as H,l as L,C as l,a as v,b as w,U as E,e as A,c as o,B as c,d as I}from"./useQueue-D5Maa73q.js";import{B as m}from"./button-B-tyaaXY.js";import{A as x,a as p}from"./alert-DzPpns47.js";import{T}from"./ticket-tjWSUCKT.js";import{S as q}from"./sparkles-C2cIGnso.js";import{c as h}from"./index-Db3cCtp2.js";import{A as R}from"./arrow-left-D1Tm3TzM.js";/* empty css            */import"./index-BZUCFwVg.js";import"./index-D2cM0fX8.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F=[["path",{d:"M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z",key:"1b4qmf"}],["path",{d:"M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2",key:"i71pzd"}],["path",{d:"M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2",key:"10jefs"}],["path",{d:"M10 6h4",key:"1itunk"}],["path",{d:"M10 10h4",key:"tcdvrf"}],["path",{d:"M10 14h4",key:"kelpxr"}],["path",{d:"M10 18h4",key:"1ulq68"}]],G=h("Building2",F);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]],_=h("CircleCheck",U);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const W=[["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"143wyd"}],["path",{d:"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6",key:"1itne7"}],["rect",{x:"6",y:"14",width:"12",height:"8",rx:"1",key:"1ue0tg"}]],X=h("Printer",W);function se(){const{services:s,loading:S}=H(),{generateTicket:z,loading:u,error:C}=L(),[r,b]=d.useState(null),[a,g]=d.useState(null),[f,j]=d.useState(null),k=[{title:"Antrian",href:"/queue/display"},{title:"Ambil Tiket",href:"/queue/ticket"}],M=async()=>{if(!r)return;j(null);const t=await z(r);t?g(t):j(C||"Gagal membuat tiket. Silakan coba lagi.")},P=()=>{const t=a,i=s.find(B=>B.id===t.service_id)?.name||"",$=new Date(t.created_at).toLocaleString("id-ID",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}),D=`
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
            <div class="service">${i}</div>
            <div class="number">${t.number_str}</div>
            
            <div class="info">
              <div class="info-row">
                <span class="info-label">Waktu Ambil</span>
                <span class="info-value">${$}</span>
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
    `,n=window.open("","_blank","width=600,height=800");n&&(n.document.write(D),n.document.close())};return S?e.jsxs(N,{breadcrumbs:k,children:[e.jsx(y,{title:"Ambil Tiket"}),e.jsx("div",{className:"flex h-screen items-center justify-center",children:e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"}),e.jsx("p",{className:"mt-2 text-sm text-muted-foreground",children:"Loading..."})]})})]}):e.jsxs(N,{breadcrumbs:k,children:[e.jsx(y,{title:"Ambil Tiket"}),e.jsx("div",{className:"min-h-screen p-6",children:e.jsx("div",{className:"container mx-auto max-w-6xl",children:a?e.jsxs(e.Fragment,{children:[e.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
`}}),e.jsxs("div",{className:"mx-auto max-w-2xl",children:[e.jsxs("div",{className:"no-print text-center mb-8 animate-in fade-in zoom-in duration-500",children:[e.jsx("div",{className:"inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/50 rounded-full mb-4",children:e.jsx(_,{className:"h-10 w-10 text-green-600 dark:text-green-400"})}),e.jsx("h1",{className:"text-3xl font-bold mb-2",children:"Tiket Berhasil Dibuat!"}),e.jsx("p",{className:"text-muted-foreground",children:"Nomor antrian Anda telah berhasil dibuat"})]}),e.jsx("div",{id:"printable-ticket",children:e.jsxs(l,{className:"border-2 shadow-xl animate-in slide-in-from-bottom-4 duration-500",children:[e.jsxs(v,{className:"card-header text-center py-4 bg-primary/5 dark:bg-primary/10",children:[e.jsx(w,{className:"text-xl",children:"Nomor Antrian"}),e.jsx(A,{className:"text-xs",children:"Simpan nomor ini"})]}),e.jsxs(o,{className:"card-content space-y-4 py-4",children:[e.jsxs("div",{className:"rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 dark:bg-primary/10 p-4 text-center",children:[e.jsx(c,{variant:"outline",className:"text-xs font-semibold px-3 py-0.5 mb-2",children:s.find(t=>t.id===a.service_id)?.name}),e.jsx("div",{className:"ticket-number text-6xl font-black text-primary tracking-wider",children:a.number_str})]}),e.jsxs("div",{className:"space-y-2 text-sm",children:[e.jsxs("div",{className:"info-row flex items-center justify-between py-2 px-3 rounded bg-muted/50",children:[e.jsx("span",{className:"text-muted-foreground",children:"Waktu"}),e.jsx("span",{className:"font-medium",children:new Date(a.created_at).toLocaleString("id-ID",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"})})]}),e.jsxs("div",{className:"estimate-section p-3 rounded bg-primary/5 border border-primary/20",children:[e.jsxs("div",{className:"flex justify-between items-center mb-2",children:[e.jsx("span",{className:"text-xs text-muted-foreground",children:"Antrian di depan"}),e.jsx("span",{className:"font-bold text-primary",children:a.waiting_ahead??0})]}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-xs text-muted-foreground",children:"Perkiraan dilayani"}),e.jsx("span",{className:"estimate-time text-xl font-bold text-primary",children:a.estimated_service_time??"--:--"})]})]}),e.jsxs("div",{className:"info-row flex items-center justify-between py-2 px-3 rounded bg-muted/50",children:[e.jsx("span",{className:"text-muted-foreground",children:"Status"}),e.jsx(c,{variant:"outline",className:"text-xs border-blue-500 text-blue-600",children:"Menunggu"})]})]}),e.jsx("p",{className:"text-center text-xs text-muted-foreground",children:"Tunggu pemanggilan di layar display"})]})]})}),e.jsxs("div",{className:"no-print mt-6 space-y-3",children:[e.jsxs(m,{onClick:P,variant:"default",size:"lg",className:"w-full h-12 text-base font-semibold",children:[e.jsx(X,{className:"mr-2 h-5 w-5"}),"Cetak Tiket"]}),e.jsxs(m,{onClick:()=>{g(null),b(null)},variant:"outline",size:"lg",className:"w-full h-12 text-base font-semibold",children:[e.jsx(R,{className:"mr-2 h-5 w-5"}),"Ambil Tiket Baru"]})]}),e.jsxs(x,{className:"no-print mt-6 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/50",children:[e.jsx(I,{className:"h-4 w-4 text-amber-600 dark:text-amber-400"}),e.jsxs(p,{className:"text-amber-900 dark:text-amber-100 text-sm",children:[e.jsx("strong",{children:"Perhatian:"})," Pastikan Anda berada di area tunggu dan memperhatikan layar display untuk mendengar nomor antrian Anda dipanggil."]})]}),e.jsx("div",{className:"no-print mt-6 text-center text-sm text-muted-foreground",children:e.jsx("p",{children:"Terima kasih telah menggunakan sistem antrian digital kami"})})]})]}):e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"text-center mb-8 space-y-2",children:[e.jsx("div",{className:"flex items-center justify-center mb-4",children:e.jsx("div",{className:"bg-primary/10 p-4 rounded-full",children:e.jsx(T,{className:"h-12 w-12 text-primary"})})}),e.jsx("h1",{className:"text-4xl font-bold tracking-tight",children:"Ambil Tiket Antrian"}),e.jsx("p",{className:"text-lg text-muted-foreground",children:"Pilih layanan yang Anda butuhkan dan dapatkan nomor antrian"})]}),e.jsxs(x,{className:"mb-6 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/50",children:[e.jsx(q,{className:"h-4 w-4 text-blue-600 dark:text-blue-400"}),e.jsx(p,{className:"text-blue-900 dark:text-blue-100",children:"Sistem antrian digital memudahkan Anda untuk mendapatkan layanan tanpa menunggu lama. Pilih layanan di bawah ini dan ambil nomor antrian Anda."})]}),e.jsxs("div",{className:"mb-6",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[e.jsx(G,{className:"h-5 w-5 text-muted-foreground"}),e.jsx("h2",{className:"text-xl font-semibold",children:"Pilih Layanan"})]}),e.jsx("div",{className:"grid gap-4 md:grid-cols-2 lg:grid-cols-3",children:s?.map(t=>{const i=r===t.id;return e.jsxs(l,{className:`cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${i?"border-2 border-primary shadow-lg ring-2 ring-primary/20":"border hover:border-primary/50"}`,onClick:()=>b(t.id),children:[e.jsx(v,{className:"pb-3",children:e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsxs("div",{className:"flex-1",children:[e.jsxs(w,{className:"flex items-center gap-2 text-lg",children:[e.jsx("div",{className:`p-2 rounded-lg ${i?"bg-primary text-primary-foreground":"bg-muted"}`,children:e.jsx(E,{className:"h-4 w-4"})}),t.name]}),e.jsxs(A,{className:"mt-1",children:["Kode: ",t.code]})]}),i&&e.jsx(_,{className:"h-5 w-5 text-primary animate-in fade-in zoom-in"})]})}),e.jsx(o,{children:e.jsxs(c,{variant:i?"default":"secondary",className:"w-full justify-center text-sm font-semibold",children:["Antrian: ",t.prefix,"-XXX"]})})]},t.id)})})]}),e.jsx(l,{className:"border-2",children:e.jsxs(o,{className:"pt-6",children:[e.jsx(m,{onClick:M,disabled:!r||u,size:"lg",className:"w-full h-14 text-lg font-semibold",children:u?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"mr-2 h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"}),"Membuat Tiket..."]}):e.jsxs(e.Fragment,{children:[e.jsx(T,{className:"mr-2 h-6 w-6"}),"Ambil Nomor Antrian Sekarang"]})}),!r&&e.jsx("p",{className:"text-center text-sm text-muted-foreground mt-3",children:"Silakan pilih layanan terlebih dahulu"}),f&&e.jsx(x,{className:"mt-4 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50",children:e.jsxs(p,{className:"text-red-900 dark:text-red-100",children:[e.jsx("strong",{children:"Error:"})," ",f]})})]})})]})})})]})}export{se as default};
