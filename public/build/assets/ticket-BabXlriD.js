import{r as n,j as e,H as A}from"./app-VmyNgFq1.js";import{A as T,R as q}from"./app-layout-VNGXczKU.js";import{c as B,B as x}from"./index-CQwZBQkb.js";import{i as G,a as H,g as U}from"./useQueue-CGo2AfEL.js";import{T as S,S as V}from"./appearance-dropdown-DiLmCK9i.js";import{M as W,a as Q}from"./minimize-2-DsS3KVJ9.js";import{F as J,B as X,P as Y,S as Z,H as ee}from"./smile-BvcbvKQ5.js";import{C as b,U as te,a as se}from"./users-DPnweYUA.js";import{A as ae}from"./arrow-left-CTrw6rIW.js";import{C as ie}from"./clock-BkzjFr8B.js";/* empty css            */import"./index-DUVPO0wk.js";import"./index-MeTeP0Wo.js";import"./heart-Clc3g1_2.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ne=[["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"143wyd"}],["path",{d:"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6",key:"1itne7"}],["rect",{x:"6",y:"14",width:"12",height:"8",rx:"1",key:"1ue0tg"}]],C=B("Printer",ne),le={"POLI-UMUM":V,"POLI-GIGI":Z,FARMASI:Y,"POLI-KIA":X,LABORATORIUM:J};function je(){const{services:c,loading:I}=G(),{data:P,refetch:o}=H(4e3),{generateTicket:M,loading:f,error:z}=U(),[d,m]=n.useState(null),[a,u]=n.useState(null),[k,v]=n.useState(null),[E,L]=n.useState(""),[D,_]=n.useState(""),[j,h]=n.useState(!1),[w,N]=n.useState(12),r=n.useRef(null),y=[{title:"Layanan Antrian",href:"/queue/display"},{title:"Kiosk Ambil Tiket",href:"/queue/ticket"}];n.useEffect(()=>{const t=()=>{const i=new Date;L(i.toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit",second:"2-digit"})+" WIB"),_(i.toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"}))};t();const s=setInterval(t,1e3);return()=>clearInterval(s)},[]),n.useEffect(()=>(a?(N(12),r.current&&clearInterval(r.current),r.current=setInterval(()=>{N(t=>t<=1?(clearInterval(r.current),u(null),m(null),o(),12):t-1)},1e3)):r.current&&clearInterval(r.current),()=>{r.current&&clearInterval(r.current)}),[a,o]);const F=()=>{document.fullscreenElement?document.exitFullscreen&&document.exitFullscreen().then(()=>h(!1)).catch(()=>{}):document.documentElement.requestFullscreen().then(()=>h(!0)).catch(()=>{})};n.useEffect(()=>{const t=()=>h(!!document.fullscreenElement);return document.addEventListener("fullscreenchange",t),()=>document.removeEventListener("fullscreenchange",t)},[]);const K=async()=>{if(!d)return;v(null);const t=await M(d);if(t){try{const s=new(window.AudioContext||window.webkitAudioContext),i=s.createOscillator(),l=s.createGain();i.connect(l),l.connect(s.destination),i.frequency.setValueAtTime(587.33,s.currentTime),i.frequency.setValueAtTime(880,s.currentTime+.12),l.gain.setValueAtTime(.15,s.currentTime),l.gain.exponentialRampToValueAtTime(.001,s.currentTime+.5),i.start(),i.stop(s.currentTime+.5)}catch{}u(t),o()}else v(z||"Gagal membuat nomor tiket. Silakan coba lagi.")},R=()=>{if(!a)return;const s=c.find(O=>O.id===a.service_id)?.name||"Poliklinik",i=new Date(a.created_at).toLocaleString("id-ID",{day:"2-digit",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"}),l=`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Tiket Antrian - ${a.number_str}</title>
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
        <div class="service-name">${s}</div>
        <div class="ticket-number">${a.number_str}</div>
        <div class="divider"></div>
        <table class="info-table">
          <tr>
            <td align="left">Waktu Cetak:</td>
            <td align="right">${i}</td>
          </tr>
          <tr>
            <td align="left">Antrian di Depan:</td>
            <td align="right">${a.waiting_ahead??0} Pasien</td>
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
        <div style="font-size:9px; font-weight:bold; letter-spacing:1px">${a.number_str}</div>
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
    `,g=window.open("","_blank","width=420,height=600");g&&(g.document.write(l),g.document.close())},$=t=>{const s=P?.services?.find(i=>i.service===t);return{waiting:s?.total_waiting??0,current:s?.current||null,counter:s?.counter||null}},p=n.useMemo(()=>c.find(t=>t.id===d),[c,d]);return I?e.jsxs(T,{breadcrumbs:y,children:[e.jsx(A,{title:"Ambil Tiket Antrian"}),e.jsx("div",{className:"flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950",children:e.jsxs("div",{className:"text-center space-y-3",children:[e.jsx("div",{className:"flex items-center justify-center w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 mx-auto",children:e.jsx(S,{className:"h-6 w-6 animate-pulse"})}),e.jsx("p",{className:"text-sm font-semibold text-slate-600 dark:text-slate-400",children:"Memuat data layanan poliklinik..."})]})})]}):e.jsxs(T,{breadcrumbs:y,children:[e.jsx(A,{title:"Kiosk Ambil Tiket Antrian"}),e.jsx("div",{className:"min-h-full bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 font-sans",children:e.jsxs("div",{className:"max-w-5xl mx-auto space-y-6",children:[e.jsxs("div",{className:"flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm",children:[e.jsxs("div",{className:"flex items-center gap-3.5 text-center sm:text-left",children:[e.jsx("div",{className:"p-3 rounded-xl bg-teal-700 text-white shrink-0",children:e.jsx(S,{className:"h-6 w-6"})}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center justify-center sm:justify-start gap-2",children:[e.jsx("h1",{className:"text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight",children:"Mesin Antrian Mandiri Pasien"}),e.jsx("span",{className:"hidden sm:inline-flex px-2 py-0.5 rounded text-[11px] font-semibold bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-300 border border-teal-200 dark:border-teal-800",children:"Terminal Kiosk"})]}),e.jsx("p",{className:"text-xs text-slate-500 dark:text-slate-400 font-medium",children:"Sentuh poliklinik tujuan Anda untuk mencetak nomor tiket antrian"})]})]}),e.jsxs("div",{className:"flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end",children:[e.jsxs("div",{className:"text-right px-3.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700",children:[e.jsx("div",{className:"text-sm font-bold text-slate-900 dark:text-white font-mono",children:E||"00:00:00 WIB"}),e.jsx("div",{className:"text-[11px] text-slate-500 font-medium",children:D||"Memuat tanggal..."})]}),e.jsx(x,{variant:"outline",size:"icon",onClick:F,title:j?"Keluar Layar Penuh":"Mode Layar Penuh Kiosk",className:"h-10 w-10 rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0",children:j?e.jsx(W,{className:"h-4 w-4 text-teal-600"}):e.jsx(Q,{className:"h-4 w-4 text-slate-600 dark:text-slate-300"})})]})]}),a?e.jsxs("div",{className:"max-w-md mx-auto space-y-5 animate-in fade-in duration-200",children:[e.jsxs("div",{className:"text-center space-y-1",children:[e.jsx("div",{className:"inline-flex items-center justify-center p-2.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 mb-1",children:e.jsx(b,{className:"h-8 w-8"})}),e.jsx("h2",{className:"text-xl sm:text-2xl font-bold text-slate-900 dark:text-white",children:"Nomor Antrian Berhasil Dicetak"}),e.jsx("p",{className:"text-xs text-slate-500",children:"Silakan simpan nomor tiket Anda dan tunggu panggilan di ruang tunggu."})]}),e.jsxs("div",{className:"ticket-paper rounded-2xl border border-slate-300 overflow-hidden shadow-lg bg-white",children:[e.jsx("div",{className:"ticket-zigzag-top"}),e.jsxs("div",{className:"p-6 text-center text-slate-900 space-y-4",children:[e.jsxs("div",{className:"border-b border-dashed border-slate-300 pb-3",children:[e.jsxs("div",{className:"flex items-center justify-center gap-1.5 mb-0.5",children:[e.jsx("div",{className:"w-5 h-5 rounded bg-teal-700 flex items-center justify-center text-white font-bold text-xs",children:"+"}),e.jsx("span",{className:"font-bold text-base tracking-wider text-teal-900 uppercase",children:"Klinik Pratama Terpadu"})]}),e.jsx("p",{className:"text-[11px] text-slate-500",children:"Pelayanan Rawat Jalan Poliklinik"})]}),e.jsxs("div",{className:"py-1",children:[e.jsx("span",{className:"inline-block px-3 py-1 rounded bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold uppercase tracking-wider mb-2",children:c.find(t=>t.id===a.service_id)?.name}),e.jsx("div",{className:"text-6xl font-bold tracking-widest text-slate-900 font-mono py-1",children:a.number_str}),e.jsx("p",{className:"text-xs text-slate-500 font-medium",children:"Nomor Antrian Pemeriksaan"})]}),e.jsxs("div",{className:"border-t border-b border-dashed border-slate-300 py-3 space-y-2 text-xs text-left",children:[e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-slate-500",children:"Waktu Cetak:"}),e.jsx("span",{className:"font-semibold text-slate-800 font-mono",children:new Date(a.created_at).toLocaleString("id-ID",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})})]}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-slate-500",children:"Antrian di Depan:"}),e.jsxs("span",{className:"font-bold text-amber-700 px-2 py-0.5 rounded bg-amber-50",children:[a.waiting_ahead??0," Pasien"]})]}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-slate-500",children:"Status:"}),e.jsx("span",{className:"font-semibold text-emerald-700 px-2 py-0.5 rounded bg-emerald-50",children:"Menunggu Panggilan"})]})]}),e.jsxs("div",{className:"pt-1 flex flex-col items-center justify-center gap-1",children:[e.jsx("div",{className:"flex items-end justify-center h-7 gap-[2px]",children:[4,2,5,1,3,5,2,6,3,1,4,5,2,5,1,3,5,2,4,1,5,3].map((t,s)=>e.jsx("div",{className:"bg-slate-900",style:{width:`${t}px`,height:"100%"}},s))}),e.jsxs("span",{className:"text-[10px] font-mono tracking-widest text-slate-600 font-bold",children:["*",a.number_str,"*"]})]}),e.jsx("div",{className:"text-[11px] text-slate-500 leading-relaxed pt-1",children:"Harap menunggu di ruang tunggu. Dengarkan pengumuman suara saat nomor Anda dipanggil ke meja loket."})]}),e.jsx("div",{className:"ticket-zigzag-bottom"})]}),e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-3",children:[e.jsxs(x,{onClick:R,size:"lg",className:"h-12 font-bold text-sm bg-teal-700 hover:bg-teal-800 text-white rounded-xl shadow-sm",children:[e.jsx(C,{className:"mr-2 h-4 w-4"}),"Cetak Fisik Tiket"]}),e.jsxs(x,{onClick:()=>{u(null),m(null),o()},variant:"outline",size:"lg",className:"h-12 font-semibold text-sm rounded-xl border-slate-300 dark:border-slate-700",children:[e.jsx(ae,{className:"mr-2 h-4 w-4"}),"Kembali ke Menu"]})]}),e.jsxs("div",{className:"p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center",children:[e.jsxs("div",{className:"flex items-center justify-between text-xs text-slate-500 mb-1.5",children:[e.jsxs("span",{className:"flex items-center gap-1.5 font-medium",children:[e.jsx(ie,{className:"h-3.5 w-3.5 text-teal-600"}),"Kiosk akan reset otomatis ke menu:"]}),e.jsxs("span",{className:"font-bold text-teal-700 dark:text-teal-400 font-mono",children:[w," detik"]})]}),e.jsx("div",{className:"w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden",children:e.jsx("div",{className:"bg-teal-600 h-full transition-all duration-1000 ease-linear rounded-full",style:{width:`${w/12*100}%`}})})]})]})]}):e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"p-4 rounded-xl bg-teal-50/80 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 text-slate-700 dark:text-slate-300 text-xs sm:text-sm",children:[e.jsx("span",{className:"font-bold text-teal-800 dark:text-teal-200",children:"Petunjuk Pasien:"})," Silakan sentuh salah satu poliklinik di bawah ini sesuai rujukan atau kebutuhan pemeriksaan Anda. Setelah itu tekan tombol cetak tiket."]}),e.jsx("div",{className:"grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3",children:c?.map(t=>{const s=d===t.id,i=le[t.code]||ee,l=$(t.name);return e.jsxs("button",{type:"button",onClick:()=>m(t.id),className:`text-left w-full rounded-2xl p-5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${s?"bg-white dark:bg-slate-900 border-2 border-teal-600 shadow-md -translate-y-0.5":"bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-400"}`,children:[e.jsxs("div",{className:"flex items-start justify-between mb-3",children:[e.jsx("div",{className:`p-3 rounded-xl transition-colors ${s?"bg-teal-700 text-white":"bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"}`,children:e.jsx(i,{className:"h-5 w-5"})}),e.jsxs("div",{className:"flex items-center gap-1.5",children:[e.jsxs("span",{className:"px-2 py-0.5 rounded text-xs font-bold font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700",children:["KODE ",t.prefix]}),s&&e.jsx("span",{className:"p-0.5 rounded-full bg-teal-600 text-white",children:e.jsx(b,{className:"h-4 w-4"})})]})]}),e.jsxs("div",{className:"mb-4",children:[e.jsx("h3",{className:"font-bold text-base text-slate-900 dark:text-white leading-tight",children:t.name}),e.jsxs("p",{className:"text-xs text-slate-500 mt-1",children:["Nomor Tiket: ",e.jsxs("span",{className:"font-mono font-semibold text-slate-700 dark:text-slate-300",children:[t.prefix,"-XXX"]})]})]}),e.jsxs("div",{className:"pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs",children:[e.jsxs("div",{className:"flex items-center gap-1.5 text-slate-500",children:[e.jsx(te,{className:"h-3.5 w-3.5"}),e.jsx("span",{children:"Menunggu:"}),e.jsx("span",{className:"font-bold text-slate-800 dark:text-slate-200 font-mono",children:l.waiting})]}),e.jsx("div",{className:"text-[11px] font-mono",children:l.current?e.jsxs("span",{className:"text-teal-700 dark:text-teal-300 font-semibold",children:["Aktif: ",l.current]}):e.jsx("span",{className:"text-slate-400",children:"Siap Panggil"})})]})]},t.id)})}),e.jsxs("div",{className:"p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3",children:[e.jsxs("div",{className:"flex flex-col sm:flex-row items-center justify-between gap-4",children:[e.jsxs("div",{children:[e.jsx("div",{className:"text-xs uppercase font-bold tracking-wider text-slate-400",children:"Layanan Terpilih"}),e.jsx("div",{className:"text-base font-bold text-slate-900 dark:text-white mt-0.5",children:p?e.jsxs("span",{className:"text-teal-700 dark:text-teal-300 flex items-center gap-1.5",children:[e.jsx(b,{className:"h-4 w-4"}),p.name," (Awalan ",p.prefix,")"]}):e.jsx("span",{className:"text-slate-400 font-normal",children:"Pilih salah satu poliklinik di atas untuk melanjutkan"})})]}),e.jsx(x,{onClick:K,disabled:!d||f,size:"lg",className:`w-full sm:w-auto h-12 px-6 text-sm font-bold rounded-xl transition-colors ${d?"bg-teal-700 hover:bg-teal-800 text-white shadow-sm":"bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"}`,children:f?e.jsxs(e.Fragment,{children:[e.jsx(q,{className:"mr-2 h-4 w-4 animate-spin"}),"Mencetak Tiket..."]}):e.jsxs(e.Fragment,{children:[e.jsx(C,{className:"mr-2 h-4 w-4"}),"Cetak Nomor Tiket Saya"]})})]}),k&&e.jsxs("div",{className:"flex items-center gap-2 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold",children:[e.jsx(se,{className:"h-4 w-4 shrink-0 text-rose-500"}),e.jsx("span",{children:k})]})]})]})]})})]})}export{je as default};
