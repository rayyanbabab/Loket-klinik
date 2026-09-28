import{r as l,j as e,H as T}from"./app-EqpMieot.js";import{A}from"./app-layout-UtxpLTAo.js";import{i as O,a as q,g as H,B as U}from"./useQueue-3C4gI_Mx.js";import{c as I,B as m}from"./index-C4hFRYgM.js";import{T as S}from"./appearance-dropdown-DSz4ISdq.js";import{M as V,a as W}from"./minimize-2-BGAPf5AT.js";import{S as Q}from"./sparkles-oYgfX-MD.js";import{F as J,B as X,P as Y,S as Z,H as ee}from"./smile-CA7xJo1z.js";import{S as te,C as ae}from"./stethoscope-Cxx0yxoc.js";import{C as b,U as se,a as re}from"./users-DmavEImS.js";import{A as le}from"./arrow-left-CCk7PF2v.js";/* empty css            */import"./index-WuxBE139.js";import"./index-M7N3Rhhl.js";import"./heart-C-0WPamc.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ie=[["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"143wyd"}],["path",{d:"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6",key:"1itne7"}],["rect",{x:"6",y:"14",width:"12",height:"8",rx:"1",key:"1ue0tg"}]],B=I("Printer",ie);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ne=[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]],de=I("RefreshCw",ne),oe={"POLI-UMUM":{icon:te,color:"text-teal-600 dark:text-teal-400",bgGrad:"from-teal-500 to-emerald-600",badgeBg:"bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20",accentBorder:"border-teal-500",lightBg:"bg-teal-500/5"},"POLI-GIGI":{icon:Z,color:"text-sky-600 dark:text-sky-400",bgGrad:"from-sky-500 to-blue-600",badgeBg:"bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20",accentBorder:"border-sky-500",lightBg:"bg-sky-500/5"},FARMASI:{icon:Y,color:"text-amber-600 dark:text-amber-400",bgGrad:"from-amber-500 to-orange-600",badgeBg:"bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",accentBorder:"border-amber-500",lightBg:"bg-amber-500/5"},"POLI-KIA":{icon:X,color:"text-rose-600 dark:text-rose-400",bgGrad:"from-rose-500 to-pink-600",badgeBg:"bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20",accentBorder:"border-rose-500",lightBg:"bg-rose-500/5"},LABORATORIUM:{icon:J,color:"text-purple-600 dark:text-purple-400",bgGrad:"from-purple-500 to-indigo-600",badgeBg:"bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20",accentBorder:"border-purple-500",lightBg:"bg-purple-500/5"}},ce={icon:ee,color:"text-teal-600 dark:text-teal-400",bgGrad:"from-teal-500 to-emerald-600",badgeBg:"bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20",accentBorder:"border-teal-500",lightBg:"bg-teal-500/5"};function Ae(){const{services:c,loading:C}=O(),{data:M,refetch:x}=q(4e3),{generateTicket:E,loading:f,error:P}=H(),[o,u]=l.useState(null),[r,h]=l.useState(null),[v,k]=l.useState(null),[z,L]=l.useState(""),[_,D]=l.useState(""),[j,g]=l.useState(!1),[w,N]=l.useState(12),i=l.useRef(null),y=[{title:"Antrian",href:"/queue/display"},{title:"Mesin Tiket Kiosk",href:"/queue/ticket"}];l.useEffect(()=>{const t=()=>{const s=new Date;L(s.toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit",second:"2-digit"})+" WIB"),D(s.toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"}))};t();const a=setInterval(t,1e3);return()=>clearInterval(a)},[]),l.useEffect(()=>(r?(N(12),i.current&&clearInterval(i.current),i.current=setInterval(()=>{N(t=>t<=1?(clearInterval(i.current),h(null),u(null),x(),12):t-1)},1e3)):i.current&&clearInterval(i.current),()=>{i.current&&clearInterval(i.current)}),[r,x]);const $=()=>{document.fullscreenElement?document.exitFullscreen&&document.exitFullscreen().then(()=>g(!1)).catch(()=>{}):document.documentElement.requestFullscreen().then(()=>g(!0)).catch(()=>{})};l.useEffect(()=>{const t=()=>g(!!document.fullscreenElement);return document.addEventListener("fullscreenchange",t),()=>document.removeEventListener("fullscreenchange",t)},[]);const G=async()=>{if(!o)return;k(null);const t=await E(o);if(t){try{const a=new(window.AudioContext||window.webkitAudioContext),s=a.createOscillator(),n=a.createGain();s.connect(n),n.connect(a.destination),s.frequency.setValueAtTime(587.33,a.currentTime),s.frequency.setValueAtTime(880,a.currentTime+.12),n.gain.setValueAtTime(.15,a.currentTime),n.gain.exponentialRampToValueAtTime(.001,a.currentTime+.5),s.start(),s.stop(a.currentTime+.5)}catch{}h(t),x()}else k(P||"Gagal membuat nomor tiket. Silakan coba lagi.")},F=()=>{if(!r)return;const a=c.find(R=>R.id===r.service_id)?.name||"Poliklinik",s=new Date(r.created_at).toLocaleString("id-ID",{day:"2-digit",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"}),n=`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Tiket Antrian - ${r.number_str}</title>
        <style>
          @page {
            size: 80mm 120mm;
            margin: 4mm;
          }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Courier New', monospace, sans-serif;
            text-align: center;
            color: #000;
            padding: 8px 12px;
          }
          .clinic-name {
            font-size: 15px;
            font-weight: 900;
            text-transform: uppercase;
            margin-bottom: 2px;
          }
          .sub {
            font-size: 9px;
            margin-bottom: 6px;
            line-height: 1.2;
          }
          .divider {
            border-top: 1px dashed #000;
            margin: 6px 0;
          }
          .service-name {
            font-size: 13px;
            font-weight: bold;
            margin: 6px 0;
            text-transform: uppercase;
          }
          .ticket-number {
            font-size: 48px;
            font-weight: 900;
            letter-spacing: 2px;
            line-height: 1;
            margin: 10px 0;
          }
          .info-table {
            width: 100%;
            font-size: 10px;
            margin: 8px 0;
          }
          .info-table td {
            padding: 2px 0;
          }
          .barcode-bars {
            display: flex;
            justify-content: center;
            align-items: flex-end;
            height: 28px;
            gap: 2px;
            margin: 8px 0 4px;
          }
          .barcode-bars div {
            background: #000;
            height: 100%;
          }
          .note {
            font-size: 8px;
            margin-top: 6px;
            line-height: 1.2;
          }
        </style>
      </head>
      <body>
        <div class="clinic-name">KLINIK PRATAMA SEHAT</div>
        <div class="sub">Pelayanan Rawat Jalan Terpadu<br>Jl. Kesehatan No. 1 • Telp: (021) 555-0199</div>
        <div class="divider"></div>
        <div class="service-name">${a}</div>
        <div class="ticket-number">${r.number_str}</div>
        <div class="divider"></div>
        <table class="info-table">
          <tr>
            <td align="left">Waktu Cetak:</td>
            <td align="right">${s}</td>
          </tr>
          <tr>
            <td align="left">Antrian di Depan:</td>
            <td align="right">${r.waiting_ahead??0} Pasien</td>
          </tr>
          <tr>
            <td align="left">Status:</td>
            <td align="right">MENUNGGU</td>
          </tr>
        </table>
        <div class="divider"></div>
        <div class="barcode-bars">
          <div style="width:3px"></div><div style="width:1px"></div><div style="width:4px"></div>
          <div style="width:2px"></div><div style="width:1px"></div><div style="width:3px"></div>
          <div style="width:2px"></div><div style="width:4px"></div><div style="width:1px"></div>
          <div style="width:3px"></div><div style="width:2px"></div><div style="width:1px"></div>
          <div style="width:4px"></div><div style="width:2px"></div><div style="width:3px"></div>
        </div>
        <div style="font-size:9px; font-weight:bold; letter-spacing:1px">${r.number_str}</div>
        <div class="note">
          Harap menunggu di ruang tunggu.<br>
          Perhatikan panggilan suara & layar monitor display.
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 150);
          }
        <\/script>
      </body>
      </html>
    `,d=window.open("","_blank","width=420,height=600");d&&(d.document.write(n),d.document.close())},K=t=>{const a=M?.services?.find(s=>s.service===t);return{waiting:a?.total_waiting??0,current:a?.current||null,counter:a?.counter||null}},p=l.useMemo(()=>c.find(t=>t.id===o),[c,o]);return C?e.jsxs(A,{breadcrumbs:y,children:[e.jsx(T,{title:"Ambil Tiket Antrian"}),e.jsx("div",{className:"flex h-screen items-center justify-center",children:e.jsxs("div",{className:"text-center space-y-4",children:[e.jsxs("div",{className:"relative mx-auto w-16 h-16",children:[e.jsx("div",{className:"absolute inset-0 rounded-full bg-teal-500/20 animate-ping"}),e.jsx("div",{className:"relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 shadow-xl shadow-teal-500/25",children:e.jsx(S,{className:"h-7 w-7 text-white animate-pulse"})})]}),e.jsx("p",{className:"text-sm font-semibold text-muted-foreground",children:"Memuat data layanan poliklinik…"})]})})]}):e.jsxs(A,{breadcrumbs:y,children:[e.jsx(T,{title:"Kiosk Ambil Tiket Antrian"}),e.jsx("div",{className:"min-h-full bg-gradient-to-br from-slate-50 via-teal-50/20 to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 sm:p-6 lg:p-8",children:e.jsxs("div",{className:"max-w-5xl mx-auto space-y-6",children:[e.jsxs("div",{className:"flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-teal-500/20 shadow-xl shadow-teal-500/5",children:[e.jsxs("div",{className:"flex items-center gap-4 text-center sm:text-left",children:[e.jsxs("div",{className:"relative",children:[e.jsx("div",{className:"p-3.5 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-lg shadow-teal-500/30",children:e.jsx(S,{className:"h-7 w-7 text-white"})}),e.jsxs("span",{className:"absolute -top-1 -right-1 flex h-3.5 w-3.5",children:[e.jsx("span",{className:"animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"}),e.jsx("span",{className:"relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"})]})]}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center justify-center sm:justify-start gap-2",children:[e.jsx("h1",{className:"text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight",children:"Mesin Antrian Mandiri"}),e.jsx(U,{variant:"outline",className:"hidden sm:inline-flex bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/30 text-xs font-bold",children:"Kiosk K-1"})]}),e.jsx("p",{className:"text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium",children:"Sentuh layanan yang Anda tuju untuk mencetak nomor antrian"})]})]}),e.jsxs("div",{className:"flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end",children:[e.jsxs("div",{className:"text-right px-4 py-2 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50",children:[e.jsx("div",{className:"text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-wide font-mono",children:z||"00:00:00 WIB"}),e.jsx("div",{className:"text-[11px] text-muted-foreground font-medium",children:_||"Memuat tanggal..."})]}),e.jsx(m,{variant:"outline",size:"icon",onClick:$,title:j?"Keluar Fullscreen":"Layar Penuh Kiosk",className:"h-11 w-11 rounded-2xl border-slate-200 dark:border-slate-700 hover:bg-teal-500/10 hover:border-teal-500/40 transition-all shrink-0",children:j?e.jsx(V,{className:"h-5 w-5 text-teal-600"}):e.jsx(W,{className:"h-5 w-5 text-slate-600 dark:text-slate-300"})})]})]}),r?e.jsxs("div",{className:"max-w-xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300",children:[e.jsxs("div",{className:"text-center space-y-2",children:[e.jsx("div",{className:"inline-flex items-center justify-center p-3 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 mb-1",children:e.jsx(b,{className:"h-10 w-10 animate-bounce"})}),e.jsx("h2",{className:"text-2xl sm:text-3xl font-black text-slate-900 dark:text-white",children:"Nomor Antrian Anda Berhasil Dibuat!"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Silakan simpan tiket Anda dan perhatikan nomor pada layar monitor display."})]}),e.jsxs("div",{className:"ticket-paper rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xl",children:[e.jsx("div",{className:"ticket-zigzag-top"}),e.jsxs("div",{className:"p-6 sm:p-8 text-center text-slate-900 space-y-5",children:[e.jsxs("div",{className:"border-b border-dashed border-slate-300 pb-4",children:[e.jsxs("div",{className:"flex items-center justify-center gap-2 mb-1",children:[e.jsx("div",{className:"w-6 h-6 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-xs",children:"+"}),e.jsx("span",{className:"font-black text-base sm:text-lg tracking-wider text-teal-800 uppercase",children:"Klinik Poliklinik Terpadu"})]}),e.jsx("p",{className:"text-[11px] text-slate-500",children:"Sistem Pelayanan Rawat Jalan Digital Modern"})]}),e.jsxs("div",{className:"py-2",children:[e.jsx("span",{className:"inline-block px-4 py-1.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold uppercase tracking-wider mb-3",children:c.find(t=>t.id===r.service_id)?.name}),e.jsx("div",{className:"text-6xl sm:text-7xl font-black tracking-widest text-teal-600 font-mono py-2 filter drop-shadow-sm",children:r.number_str}),e.jsx("p",{className:"text-xs text-slate-500 font-medium",children:"Simpan tiket ini untuk bukti pelayanan loket"})]}),e.jsxs("div",{className:"border-t border-b border-dashed border-slate-300 py-4 space-y-2.5 text-xs text-left",children:[e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-slate-500 font-medium",children:"Waktu Registrasi:"}),e.jsx("span",{className:"font-bold text-slate-800 font-mono",children:new Date(r.created_at).toLocaleString("id-ID",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})})]}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-slate-500 font-medium",children:"Antrian di Depan Anda:"}),e.jsxs("span",{className:"font-bold text-amber-600 px-2 py-0.5 rounded bg-amber-50",children:[r.waiting_ahead??0," Pasien"]})]}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-slate-500 font-medium",children:"Status Pelayanan:"}),e.jsx("span",{className:"font-bold text-emerald-600 px-2 py-0.5 rounded bg-emerald-50",children:"Menunggu Dipanggil"})]})]}),e.jsxs("div",{className:"pt-2 flex flex-col items-center justify-center gap-1.5",children:[e.jsx("div",{className:"flex items-end justify-center h-8 gap-[3px]",children:[4,2,6,1,3,5,2,7,3,1,4,6,2,5,1,3,6,2,4,1,5,3,6].map((t,a)=>e.jsx("div",{className:"bg-slate-800 rounded-sm",style:{width:`${t}px`,height:"100%"}},a))}),e.jsxs("span",{className:"text-[11px] font-mono tracking-widest text-slate-600 font-bold",children:["*",r.number_str,"*"]})]}),e.jsx("div",{className:"text-[11px] text-slate-500 leading-relaxed pt-2",children:"Mohon duduk di ruang tunggu dan dengarkan pengumuman suara saat nomor Anda dipanggil ke loket."})]}),e.jsx("div",{className:"ticket-zigzag-bottom"})]}),e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-3",children:[e.jsxs(m,{onClick:F,size:"lg",className:"h-14 font-extrabold text-base bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white shadow-xl shadow-teal-500/25 rounded-2xl",children:[e.jsx(B,{className:"mr-2 h-5 w-5"}),"Cetak Fisik Tiket"]}),e.jsxs(m,{onClick:()=>{h(null),u(null),x()},variant:"outline",size:"lg",className:"h-14 font-bold text-base rounded-2xl border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800",children:[e.jsx(le,{className:"mr-2 h-5 w-5"}),"Selesai & Ambil Tiket Baru"]})]}),e.jsxs("div",{className:"p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-center",children:[e.jsxs("div",{className:"flex items-center justify-between text-xs text-muted-foreground mb-2",children:[e.jsxs("span",{className:"flex items-center gap-1.5 font-medium",children:[e.jsx(ae,{className:"h-3.5 w-3.5 text-teal-600"}),"Kiosk akan reset otomatis:"]}),e.jsxs("span",{className:"font-bold text-teal-600 font-mono",children:[w," detik"]})]}),e.jsx("div",{className:"w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden",children:e.jsx("div",{className:"bg-gradient-to-r from-teal-500 to-emerald-500 h-full transition-all duration-1000 ease-linear rounded-full",style:{width:`${w/12*100}%`}})})]})]})]}):e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-teal-500/10 border border-teal-500/20 text-slate-700 dark:text-slate-200",children:[e.jsx(Q,{className:"h-5 w-5 text-teal-600 dark:text-teal-400 shrink-0 animate-pulse"}),e.jsxs("div",{className:"text-xs sm:text-sm font-medium",children:[e.jsx("span",{className:"font-bold text-teal-700 dark:text-teal-300",children:"Langkah 1:"})," Silakan pilih poliklinik atau loket tujuan di bawah ini. Anda dapat melihat jumlah antrian yang sedang menunggu secara langsung."]})]}),e.jsx("div",{className:"grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3",children:c?.map(t=>{const a=o===t.id,s=oe[t.code]||ce,n=s.icon,d=K(t.name);return e.jsxs("button",{type:"button",onClick:()=>u(t.id),className:`group relative text-left w-full rounded-3xl p-5 sm:p-6 transition-all duration-300 transform active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/50 ${a?`bg-white dark:bg-slate-900 border-2 ${s.accentBorder} shadow-2xl shadow-teal-500/20 -translate-y-1.5`:"bg-white/90 dark:bg-slate-900/90 border-2 border-slate-200/80 dark:border-slate-800 hover:border-teal-400/60 hover:shadow-xl hover:-translate-y-1"}`,children:[a&&e.jsx("div",{className:`absolute -top-1 left-4 right-4 h-1.5 rounded-full bg-gradient-to-r ${s.bgGrad}`}),e.jsxs("div",{className:"flex items-start justify-between mb-4",children:[e.jsx("div",{className:`p-3.5 rounded-2xl transition-all duration-300 ${a?`bg-gradient-to-br ${s.bgGrad} text-white shadow-lg shadow-teal-500/30 scale-105`:`${s.lightBg} ${s.color} group-hover:scale-105`}`,children:e.jsx(n,{className:"h-6 w-6"})}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsxs("span",{className:`px-2.5 py-1 rounded-full text-xs font-black tracking-wider ${s.badgeBg}`,children:["KODE ",t.prefix]}),a&&e.jsx("div",{className:"p-1 rounded-full bg-teal-500 text-white animate-in zoom-in",children:e.jsx(b,{className:"h-4 w-4"})})]})]}),e.jsxs("div",{className:"mb-4",children:[e.jsx("h3",{className:"font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors leading-tight",children:t.name}),e.jsxs("p",{className:"text-xs text-muted-foreground mt-1",children:["Nomor Tiket: ",e.jsxs("span",{className:"font-mono font-bold text-foreground",children:[t.prefix,"-XXX"]})]})]}),e.jsxs("div",{className:"pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs",children:[e.jsxs("div",{className:"flex items-center gap-1.5",children:[e.jsx(se,{className:"h-3.5 w-3.5 text-muted-foreground"}),e.jsx("span",{className:"text-muted-foreground font-medium",children:"Menunggu:"}),e.jsxs("span",{className:`font-bold ${d.waiting>0?"text-amber-600 dark:text-amber-400":"text-emerald-600 dark:text-emerald-400"}`,children:[d.waiting," orang"]})]}),e.jsx("div",{className:"flex items-center gap-1 text-[11px] text-muted-foreground font-mono",children:d.current?e.jsxs("span",{className:"px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-700 dark:text-teal-300 font-bold",children:["Sedang: ",d.current]}):e.jsx("span",{className:"text-slate-400",children:"Siap Panggil"})})]})]},t.id)})}),e.jsxs("div",{className:"p-6 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4",children:[e.jsxs("div",{className:"flex flex-col sm:flex-row items-center justify-between gap-4",children:[e.jsxs("div",{children:[e.jsx("div",{className:"text-xs uppercase font-bold tracking-wider text-muted-foreground",children:"Layanan Terpilih"}),e.jsx("div",{className:"text-lg font-black text-slate-900 dark:text-white mt-0.5",children:p?e.jsxs("span",{className:"text-teal-600 dark:text-teal-400 flex items-center gap-2",children:[e.jsx(b,{className:"h-5 w-5"}),p.name," (Awalan ",p.prefix,")"]}):e.jsx("span",{className:"text-slate-400 dark:text-slate-500",children:"Silakan klik salah satu kartu poli di atas"})})]}),e.jsx(m,{onClick:G,disabled:!o||f,size:"lg",className:`w-full sm:w-auto h-14 px-8 text-base font-extrabold rounded-2xl transition-all duration-300 ${o?"bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white shadow-xl shadow-teal-500/30 hover:shadow-2xl hover:shadow-teal-500/40 hover:-translate-y-0.5":"bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"}`,children:f?e.jsxs(e.Fragment,{children:[e.jsx(de,{className:"mr-3 h-5 w-5 animate-spin"}),"Mencetak Tiket…"]}):e.jsxs(e.Fragment,{children:[e.jsx(B,{className:"mr-3 h-6 w-6"}),"CETAK NOMOR TIKET SAYA"]})})]}),v&&e.jsxs("div",{className:"flex items-center gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm",children:[e.jsx(re,{className:"h-5 w-5 shrink-0 text-red-500"}),e.jsx("span",{children:v})]})]})]})]})})]})}export{Ae as default};
